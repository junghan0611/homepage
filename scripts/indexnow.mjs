#!/usr/bin/env node
/** Operator-run IndexNow notice for junghanacs.com. The operator names the canonical URLs; this tool proves
 * that each one is what production serves from <target>, then (send only) POSTs them once and keeps a receipt.
 *
 *   candidates [--prefix /path/]           live canonical sitemap URLs (GET only, writes nothing)
 *   check --target <sha> --key-file <dir/KEY.txt> [<url|/path> …] [--removed <url> …] [--urls-file <file>]
 *                                          full verification; no POST, no state, log or lock written
 *   send  (same arguments as check)        verify again from scratch, then one POST and one receipt
 *   status                                 this machine's receipts — not the site's notification state
 *
 * Only this CLI acts in production, at the standard host-local state path. The exported run() is always a
 * rehearsal that must be handed a fake fetch, a deploy gate and a temporary state directory. That is a contract
 * between the live CLI and test fixtures, not a sandbox: code preloaded into the process can still do anything.
 *
 * There is no origin or endpoint override and nothing here runs inside a build. A receipt records only the
 * URLs the operator selected; no URL is ever "done" by being left out. Contract: docs/deploy-cloudflare.md
 * ("IndexNow 수동 통지").
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { footerCommit } from "./build-footer.mjs";

export const HOST = "junghanacs.com";
export const ORIGIN = `https://${HOST}`;
export const ENDPOINT = "https://api.indexnow.org/indexnow";
/** Policy, not a protocol or quality limit (IndexNow accepts 10,000 URLs per POST). */
export const DEFAULT_CAP = 30;
export const COOLDOWN_MS = 10 * 60 * 1000; // indexnow.org FAQ: wait at least 10 minutes before resubmitting
const MAX_RETRY_AFTER_MS = 24 * 60 * 60 * 1000;
const MAX_CHILD_SITEMAPS = 10;
const LIMITS = { sitemap: 2 << 20, page: 2 << 20, key: 1024, post: 2048 };
const GET_TIMEOUT_MS = 20000;
const POST_TIMEOUT_MS = 30000;
const VERIFY_TIMEOUT_MS = 180000;
const MAIN_REF = "refs/remotes/origin/main";
const SHA = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/* Captured once: replacing globalThis.fetch later cannot make an injected fetch look like production. */
const REAL_FETCH = globalThis.fetch;

export const EXIT = {
	ok: 0,
	usage: 2,
	notReady: 10,
	precondition: 11,
	cooldown: 12,
	receivedPending: 20,
	rateLimited: 21,
	rejected: 22,
	unknown: 23,
	localRecordFailed: 24,
	deployChanged: 25,
};

export class Stop extends Error {
	constructor(exit, outcome, message) {
		super(message);
		this.exit = exit;
		this.outcome = outcome;
	}
}
const usage = (message) => new Stop(EXIT.usage, "usage", message);
const precondition = (message) => new Stop(EXIT.precondition, "precondition", message);
const notReady = (message) => new Stop(EXIT.notReady, "not-ready", message);
const sha256 = (text) => crypto.createHash("sha256").update(text).digest("hex");

// ---------------------------------------------------------------------------------------------------
// Canonical URLs

/** Problem with a canonical URL, or null. The raw text must already be its own WHATWG serialization: a parser
 *  normalizes host case, default ports, dot segments and empty queries, so checking only the parsed parts would
 *  let a refused input through. Hugo pretty URLs end in "/". */
export function urlProblem(raw) {
	if (typeof raw !== "string" || raw === "") return "empty URL";
	if (/[\s\\\u0000-\u001f\u007f]/.test(raw)) return "whitespace, control character or backslash";
	if (/%(2f|5c|2e)/i.test(raw)) return "percent-encoded slash, backslash or dot";
	let url;
	try {
		url = new URL(raw);
	} catch {
		return "not an absolute URL";
	}
	if (url.protocol !== "https:") return `scheme ${url.protocol} (only https:)`;
	if (url.username || url.password) return "userinfo";
	if (url.hostname !== HOST) return `host ${url.hostname} (only ${HOST})`;
	if (url.port !== "") return `port ${url.port}`;
	if (raw.includes("?") || raw.includes("#")) return "query or fragment";
	if (url.href !== raw) return `not in canonical form (parses as ${url.href})`;
	if (!url.pathname.endsWith("/")) return "path does not end with /";
	if (url.pathname.includes("//")) return "empty path segment";
	return null;
}

/** Operator input → { updated, removed, duplicates }. "/path/" is shorthand for ORIGIN + "/path/" and nothing
 *  else is rewritten: a URL that is not already canonical is refused, never corrected. */
export function parseSelection({ updated = [], removed = [], file } = {}) {
	const rows = [];
	for (const input of updated) rows.push({ kind: "updated", input, where: "argument" });
	for (const input of removed) rows.push({ kind: "removed", input, where: "--removed" });
	if (file !== undefined) {
		file.split("\n").forEach((line, i) => {
			const text = line.trim();
			if (text === "" || text.startsWith("#")) return;
			const m = text.match(/^(?:(removed)\s+)?(\S+)$/);
			if (!m) throw usage(`urls file line ${i + 1}: expected "<url>" or "removed <url>"`);
			rows.push({ kind: m[1] ? "removed" : "updated", input: m[2], where: `urls file line ${i + 1}` });
		});
	}
	const seen = new Map();
	let duplicates = 0;
	for (const row of rows) {
		const url = row.input.startsWith("/") && !row.input.startsWith("//") ? `${ORIGIN}${row.input}` : row.input;
		const problem = urlProblem(url);
		if (problem) throw usage(`${row.where}: ${row.input}: ${problem}`);
		const previous = seen.get(url);
		if (previous && previous !== row.kind) throw usage(`${url} is selected as both updated and removed`);
		if (previous) duplicates++;
		else seen.set(url, row.kind);
	}
	const pick = (kind) => [...seen].filter(([, k]) => k === kind).map(([url]) => url).sort();
	return { updated: pick("updated"), removed: pick("removed"), duplicates };
}

// ---------------------------------------------------------------------------------------------------
// Key

export const keyBodyMatches = (text, key) => text === key || text === `${key}\n`;

/** --key-file names the file that is published as /<key>.txt; its body must be exactly its own key. */
export function readKeyFile(file) {
	if (!file) throw usage("--key-file <dir>/<key>.txt is required");
	const m = path.basename(file).match(/^([A-Za-z0-9-]{8,128})\.txt$/);
	if (!m) throw usage("--key-file must be named <key>.txt, the key being 8–128 of A-Za-z0-9-");
	let body;
	try {
		body = fs.readFileSync(file, "utf8");
	} catch (error) {
		throw usage(`--key-file cannot be read: ${error.code ?? error.message}`);
	}
	if (!keyBodyMatches(body, m[1])) throw precondition("--key-file body is not exactly the key its name carries");
	return m[1];
}

export function excerpt(text, key) {
	let out = String(text ?? "");
	if (key) out = out.replaceAll(key, "<key>");
	return out.replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e]/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
}

// ---------------------------------------------------------------------------------------------------
// HTTP: one request, redirects never followed, bounded time and body.

async function request(fetchImpl, url, { method = "GET", headers = {}, body, maxBytes, timeoutMs = GET_TIMEOUT_MS }) {
	const response = await fetchImpl(url, { method, headers, body, redirect: "manual", signal: AbortSignal.timeout(timeoutMs) });
	const chunks = [];
	let size = 0;
	let truncated = false;
	if (response.body) {
		const reader = response.body.getReader();
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > maxBytes) {
				truncated = true;
				await reader.cancel().catch(() => {});
				chunks.push(value.subarray(0, value.byteLength - (size - maxBytes)));
				break;
			}
			chunks.push(value);
		}
	}
	return { status: response.status, headers: response.headers, text: Buffer.concat(chunks).toString("utf8"), truncated };
}

const transportError = (error) => (error.name === "TimeoutError" ? "timeout" : String(error.cause?.code ?? error.message));

async function get(fetchImpl, url, maxBytes) {
	try {
		return await request(fetchImpl, url, { headers: { "cache-control": "no-cache" }, maxBytes });
	} catch (error) {
		throw notReady(`${url}: ${transportError(error)}`);
	}
}

// ---------------------------------------------------------------------------------------------------
// Sitemap: Hugo multilingual — /sitemap.xml is a <sitemapindex> of per-language <urlset> files.

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
function decodeXml(text) {
	return text.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-z]+);/g, (match, entity) => {
		if (entity[0] === "#") return String.fromCodePoint(entity[1] === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10));
		if (!(entity in ENTITIES)) throw new Error(`unknown XML entity ${match}`);
		return ENTITIES[entity];
	});
}

async function fetchXml(fetchImpl, url, root) {
	const r = await get(fetchImpl, url, LIMITS.sitemap);
	if (r.status !== 200) throw (r.status >= 500 ? notReady : precondition)(`${url} answered ${r.status}`);
	if (r.truncated) throw precondition(`${url} exceeds ${LIMITS.sitemap} bytes`);
	const type = r.headers.get("content-type") ?? "";
	if (!/^(application|text)\/xml(\s*;|$)/i.test(type)) throw precondition(`${url} content-type is ${type || "absent"}, not XML`);
	const body = r.text.replace(/^\uFEFF/, "").replace(/^<\?xml[^>]*\?>\s*/, "").trimEnd();
	if (!new RegExp(`^<${root}[\\s>]`).test(body) || !body.endsWith(`</${root}>`)) throw precondition(`${url} is not a <${root}> document`);
	return body;
}

function locsIn(xml, element, where) {
	const count = (xml.match(new RegExp(`<${element}>`, "g")) ?? []).length;
	const locs = [...xml.matchAll(new RegExp(`<${element}>\\s*<loc>([^<]*)</loc>`, "g"))].map((m) => m[1].trim());
	if (locs.length !== count) throw precondition(`${where}: a <${element}> without a leading <loc>`);
	try {
		return locs.map(decodeXml);
	} catch (error) {
		throw precondition(`${where}: ${error.message}`);
	}
}

/** Every URL the live canonical sitemap lists. Children must be /<lang>/sitemap.xml on this origin, once each. */
export async function readSitemap(fetchImpl) {
	const indexUrl = `${ORIGIN}/sitemap.xml`;
	const children = locsIn(await fetchXml(fetchImpl, indexUrl, "sitemapindex"), "sitemap", indexUrl);
	if (children.length === 0 || children.length > MAX_CHILD_SITEMAPS) throw precondition(`${indexUrl} names ${children.length} sitemaps`);
	const seen = new Set();
	const locs = new Set();
	for (const child of children) {
		if (!/^https:\/\/junghanacs\.com\/[a-z]{2}\/sitemap\.xml$/.test(child)) throw precondition(`${indexUrl} names ${child}`);
		if (seen.has(child)) throw precondition(`${indexUrl} names ${child} twice`);
		seen.add(child);
		for (const loc of locsIn(await fetchXml(fetchImpl, child, "urlset"), "url", child)) {
			const problem = urlProblem(loc);
			if (problem) throw precondition(`${child} lists ${loc}: ${problem}`);
			if (locs.has(loc)) throw precondition(`${loc} is listed twice`);
			locs.add(loc);
		}
	}
	if (locs.size === 0) throw precondition("the sitemap lists no URL");
	return locs;
}

// ---------------------------------------------------------------------------------------------------
// Live checks

/** "none" is noindex + nofollow; either word in a robots meta or X-Robots-Tag (any case, any agent prefix) refuses. */
const NOINDEX = /\b(noindex|none)\b/i;
const HTML_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decodeAttribute = (value) =>
	value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, entity) => {
		if (entity[0] !== "#") return HTML_ENTITIES[entity.toLowerCase()] ?? match;
		const cp = /^#x/i.test(entity) ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
		return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : match;
	});

/** Every <meta>/<link> tag in the document, attributes in any order and case, double-, single- or unquoted, with
 *  entities decoded; a repeated attribute keeps its first value, as HTML parsing does. Not a general HTML parser:
 *  comments and raw text are not modelled, which can only add tags (more refusals), never hide one. */
export function htmlTags(html) {
	const tags = [];
	for (const m of html.matchAll(/<(meta|link)(?=[\s\/>])((?:[^>"']|"[^"]*"|'[^']*')*)>/gi)) {
		const attrs = {};
		for (const a of m[2].matchAll(/([^\s"'=<>\/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
			const name = a[1].toLowerCase();
			if (!(name in attrs)) attrs[name] = decodeAttribute(a[2] ?? a[3] ?? a[4] ?? "");
		}
		tags.push({ tag: m[1].toLowerCase(), attrs });
	}
	return tags;
}

/** Index-facing problems of a served page (canonical link, robots, refresh), read from the whole document. The
 *  footer commit is judged separately. */
export function pageProblems(html, url) {
	if (!/<head[\s>]/i.test(html)) return ["no <head>"];
	const problems = [];
	const tags = htmlTags(html);
	const canonical = tags.filter((t) => t.tag === "link" && (t.attrs.rel ?? "").toLowerCase().split(/\s+/).includes("canonical")).map((t) => t.attrs.href ?? "");
	if (canonical.length !== 1) problems.push(`${canonical.length} canonical links`);
	else if (canonical[0] !== url) problems.push(`canonical link is ${canonical[0]}`);
	const robots = tags.filter((t) => t.tag === "meta" && /^(robots|[a-z0-9-]*bot)$/i.test(t.attrs.name ?? ""));
	if (robots.some((t) => NOINDEX.test(t.attrs.content ?? ""))) problems.push(`robots meta ${robots.map((t) => `${t.attrs.name}=${t.attrs.content}`).join(" | ")}`);
	if (tags.some((t) => t.tag === "meta" && (t.attrs["http-equiv"] ?? "").toLowerCase() === "refresh")) problems.push("meta refresh (an alias page is not sent)");
	return problems;
}

/** A footer saying "+ local changes" names a commit the build did not match (build-site.sh:42-44). */
export const footerIsDirty = (html) => /local changes/.test(html.match(/<p class=["']?site-build["']?>[\s\S]*?<\/p>/)?.[0] ?? "");

async function servedCommit(fetchImpl, url) {
	const r = await get(fetchImpl, url, LIMITS.page);
	if (r.status !== 200) return { status: r.status, response: r, error: `answered ${r.status}` };
	if (r.truncated) return { status: r.status, error: `exceeds ${LIMITS.page} bytes` };
	return { status: r.status, response: r, dirty: footerIsDirty(r.text), ...footerCommit(r.text) };
}

async function checkUpdated(fetchImpl, url, target) {
	const served = await servedCommit(fetchImpl, url);
	if (served.status !== 200) {
		const location = served.response?.headers.get("location");
		throw (served.status >= 500 ? notReady : precondition)(`${url} answered ${served.status}${location ? ` → ${location}` : ""} (redirects are not followed)`);
	}
	if (!served.response) throw precondition(`${url} ${served.error}`);
	const r = served.response;
	const type = r.headers.get("content-type") ?? "";
	if (!/^text\/html(\s*;|$)/i.test(type)) throw precondition(`${url} content-type is ${type || "absent"}`);
	const robotsHeader = r.headers.get("x-robots-tag") ?? "";
	if (NOINDEX.test(robotsHeader)) throw precondition(`${url} carries X-Robots-Tag ${robotsHeader}`);
	if (served.error) throw notReady(`${url}: ${served.error} (not a build footer this tool can read)`);
	if (served.commit !== target) throw notReady(`${url} is built from ${served.commit}, not ${target}`);
	if (served.dirty) throw precondition(`${url} footer says "+ local changes": not a clean build of ${target}`);
	const problems = pageProblems(r.text, url);
	if (problems.length) throw precondition(`${url}: ${problems.join("; ")}`);
	return { url, status: 200, commit: served.commit };
}

async function checkRemoved(fetchImpl, url) {
	const r = await get(fetchImpl, url, LIMITS.page);
	const location = r.headers.get("location");
	if (r.status !== 404 || location) throw precondition(`${url} answered ${r.status}${location ? ` → ${location}` : ""}; a removed URL must answer 404 (a redirected old URL is not sent)`);
	return { url, status: 404 };
}

async function checkKey(fetchImpl, key) {
	const r = await get(fetchImpl, `${ORIGIN}/${key}.txt`, LIMITS.key);
	const type = r.headers.get("content-type") ?? "";
	const location = r.headers.get("location");
	if (r.status !== 200 || location || r.truncated || !/^text\/plain(\s*;|$)/i.test(type) || !keyBodyMatches(r.text, key))
		throw precondition(`${ORIGIN}/<key>.txt answered ${r.status} ${type || "-"} without the exact key body`);
	return { url: `${ORIGIN}/<key>.txt`, status: 200, matched: true, key_sha256: sha256(key).slice(0, 16) };
}

/** The existing response gate, run as the operator would run it: node scripts/verify-deployed.mjs <origin> <sha>. */
export function defaultVerifyDeployed(target) {
	const r = spawnSync(process.execPath, [path.join(ROOT, "scripts", "verify-deployed.mjs"), ORIGIN, target], { encoding: "utf8", timeout: VERIFY_TIMEOUT_MS });
	const last = (text) => (text ?? "").trim().split("\n").pop() ?? "";
	return { exit: r.status, signal: r.signal ?? null, summary: excerpt(r.status === 0 ? last(r.stdout) : r.stderr || r.stdout || r.error?.message) };
}

// ---------------------------------------------------------------------------------------------------
// git (never fetches)

function gitOk(repo, args) {
	try {
		execFileSync("git", ["-C", repo, ...args], { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}
export function targetProblem(repo, target, mainRef = MAIN_REF) {
	if (!gitOk(repo, ["rev-parse", "--verify", "--quiet", mainRef])) return `${mainRef} does not exist (git fetch origin)`;
	if (!gitOk(repo, ["cat-file", "-e", `${target}^{commit}`])) return `${target} is not a commit in this repository (git fetch origin)`;
	if (!gitOk(repo, ["merge-base", "--is-ancestor", target, mainRef])) return `${target} is not on ${mainRef}; nothing is fetched here`;
	return null;
}

// ---------------------------------------------------------------------------------------------------
// Local receipts: <dir>/<stem>.receipts.jsonl and <stem>.lock, stem = host (production) or host.rehearsal.

/** The one production state directory. Moving it is an operator's migration, not an option or variable. */
export function defaultStateDir(env = process.env) {
	return path.join(env.XDG_STATE_HOME || path.join(os.homedir(), ".local", "state"), "homepage-indexnow");
}

/* Not exported: only main() below can ask run() for production. */
const PRODUCTION = Symbol("production");

export function statePaths(dir, namespace) {
	if (namespace !== "production" && namespace !== "rehearsal") throw new Error(`unknown namespace ${namespace}`);
	const stem = namespace === "production" ? HOST : `${HOST}.rehearsal`;
	return { dir, namespace, receipts: path.join(dir, `${stem}.receipts.jsonl`), lock: path.join(dir, `${stem}.lock`) };
}

function assertPrivate(file) {
	const mode = fs.statSync(file).mode & 0o777;
	if (mode & 0o077) throw precondition(`${file} has mode ${mode.toString(8)}; it must be private (700 for the directory, 600 for files)`);
}

const PHASES = ["intent", "result", "refused"];
/** Every line must parse and belong to this host and namespace: a corrupt or foreign line stops, it is not skipped. */
export function readReceipts(p) {
	if (!fs.existsSync(p.receipts)) return [];
	assertPrivate(p.receipts);
	const lines = fs.readFileSync(p.receipts, "utf8").split("\n");
	if (lines.at(-1) === "") lines.pop();
	return lines.map((line, i) => {
		let receipt;
		try {
			receipt = JSON.parse(line);
		} catch {
			throw precondition(`${p.receipts} line ${i + 1} is not JSON; repair or move the file (it is never skipped)`);
		}
		if (receipt?.schema !== 1 || receipt.host !== HOST || receipt.namespace !== p.namespace)
			throw precondition(`${p.receipts} line ${i + 1} belongs to ${receipt?.namespace}/${receipt?.host}, not ${p.namespace}/${HOST}`);
		if (receipt.mode !== "send" || !PHASES.includes(receipt.phase) || (receipt.phase !== "refused" && typeof receipt.attempt !== "string"))
			throw precondition(`${p.receipts} line ${i + 1} is not a send intent/result/refused record`);
		const isDate = (v) => typeof v === "string" && !Number.isNaN(Date.parse(v));
		const posted = receipt.phase !== "refused";
		if (posted && (!Array.isArray(receipt.updated) || !Array.isArray(receipt.removed) || !SHA256.test(receipt.request_sha256 ?? "") || !isDate(receipt.phase === "intent" ? receipt.at : receipt.received_at)))
			throw precondition(`${p.receipts} line ${i + 1}: ${receipt.phase} lacks its selection, request hash or time`);
		return receipt;
	});
}

/** POST attempts in order: intent written before the POST, result after. An intent without a result is unresolved. */
export function attempts(receipts) {
	const byId = new Map();
	for (const r of receipts) {
		if (r.phase === "refused") continue;
		const entry = byId.get(r.attempt) ?? {};
		if (entry[r.phase]) throw precondition(`attempt ${r.attempt} has two ${r.phase} records`);
		if (r.phase === "result" && !entry.intent) throw precondition(`attempt ${r.attempt} has a result before its intent`);
		if (r.phase === "result")
			for (const field of ["target", "urls_sha256", "request_sha256", "updated", "removed"])
				if (JSON.stringify(r[field]) !== JSON.stringify(entry.intent[field])) throw precondition(`attempt ${r.attempt}: result ${field} differs from its intent`);
		entry[r.phase] = r;
		byId.set(r.attempt, entry);
	}
	return [...byId.values()];
}
const acceptedResults = (receipts) => attempts(receipts).map((a) => a.result).filter((r) => r?.outcome === "accepted");

/** What status prints: exact selections of attempts that are unresolved or may have been received. */
export function statusReport(receipts) {
	const list = attempts(receipts);
	const selection = (r) => ({ attempt: r.attempt, target: r.target, updated: r.updated, removed: r.removed, urls_sha256: r.urls_sha256, request_sha256: r.request_sha256 });
	return {
		attempts: list.length,
		accepted: list.filter((a) => a.result?.outcome === "accepted").length,
		unresolved: list.filter((a) => !a.result).map((a) => ({ ...selection(a.intent), sent_at: a.intent.at, note: "no result recorded: it may or may not have been received" })),
		maybe_received: list.filter((a) => ["received-pending", "unknown"].includes(a.result?.outcome)).map((a) => ({ ...selection(a.result), outcome: a.result.outcome, received_at: a.result.received_at })),
		refused: receipts.filter((r) => r.phase === "refused").length,
	};
}

function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
	assertPrivate(dir);
}

/** Write every byte or throw: a short write is never taken as success. */
function writeAll(fd, text) {
	const buffer = Buffer.from(text);
	for (let offset = 0; offset < buffer.length; ) {
		const written = fs.writeSync(fd, buffer, offset, buffer.length - offset);
		if (!(written > 0)) throw new Error(`short write (${offset} of ${buffer.length} bytes)`);
		offset += written;
	}
}

/** One line, complete and fsynced before returning; a new file also fsyncs its directory so the name survives. */
function appendReceipt(p, receipt) {
	ensureDir(p.dir);
	const created = !fs.existsSync(p.receipts);
	if (!created) assertPrivate(p.receipts);
	const fd = fs.openSync(p.receipts, "a", 0o600);
	try {
		writeAll(fd, JSON.stringify(receipt) + "\n");
		fs.fsyncSync(fd);
	} finally {
		fs.closeSync(fd);
	}
	if (created) {
		const dirFd = fs.openSync(p.dir, "r");
		try {
			fs.fsyncSync(dirFd);
		} finally {
			fs.closeSync(dirFd);
		}
	}
	assertPrivate(p.receipts);
}

function takeLock(p, now) {
	ensureDir(p.dir);
	let fd;
	try {
		fd = fs.openSync(p.lock, "wx", 0o600);
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
		throw new Stop(EXIT.precondition, "locked", `${p.lock} is held; if no send is running, remove the file`);
	}
	try {
		writeAll(fd, JSON.stringify({ pid: process.pid, at: new Date(now).toISOString() }) + "\n");
		fs.fsyncSync(fd);
	} catch (error) {
		throw new Stop(EXIT.localRecordFailed, "lock-write-failed", `${p.lock} was created but could not be written (${error.code ?? error.message}); it is retained — remove it once no send is running`);
	} finally {
		fs.closeSync(fd);
	}
}

/** Retry-After as delta-seconds or IMF-fixdate (RFC 9110); anything else is ignored. */
export function parseRetryAfter(value, nowMs) {
	if (value == null) return null;
	const text = String(value).trim();
	if (/^\d+$/.test(text)) return Number(text) * 1000;
	if (/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(text)) {
		const t = Date.parse(text);
		if (!Number.isNaN(t)) return Math.max(0, t - nowMs);
	}
	return null;
}

export function classifyResponse(status) {
	if (status === 200) return "accepted";
	if (status === 202) return "received-pending"; // received, key validation pending
	if (status === 429) return "rate-limited";
	if (status >= 300 && status < 500) return "rejected"; // a redirect is not followed: nothing was received
	return "unknown"; // 5xx and undocumented 2xx: the batch may or may not have been received
}
const OUTCOME_EXIT = { accepted: EXIT.ok, "received-pending": EXIT.receivedPending, "rate-limited": EXIT.rateLimited, rejected: EXIT.rejected, unknown: EXIT.unknown };

/** The last answered attempt decides the wait: 202 and unknown 10 minutes, 429 its Retry-After within
 *  [10 min, 24 h], counted from received_at. */
export function cooldownUntil(receipts) {
	const last = attempts(receipts).filter((a) => a.result).at(-1); // a result-less intent stops run() before this
	if (!last) return null;
	const { result } = last;
	const at = Date.parse(result.received_at); // when the endpoint answered (or the transport failed), not when checks began
	if (result.outcome === "rate-limited") return at + Math.min(Math.max(result.retry_after_ms ?? 0, COOLDOWN_MS), MAX_RETRY_AFTER_MS);
	if (result.outcome === "received-pending" || result.outcome === "unknown") return at + COOLDOWN_MS;
	return null;
}

// ---------------------------------------------------------------------------------------------------
// check / send

/**
 * check: every verification, nothing written. send: the same verification from scratch inside a lock; any
 * failed check means no POST at all (no row is silently dropped). Before the POST the root footer is re-read
 * and an intent record is appended and fsynced — if that write fails nothing is sent. After the POST a result
 * record follows, with a re-read of the served commit kept on its own axis (deploy_after) so a later GET can
 * never rewrite what the endpoint answered. Reads before and after narrow, but cannot exclude, a deploy
 * landing in between.
 */
export async function run(command, opts, token) {
	if (command !== "check" && command !== "send") throw usage(`unknown command ${command}`);
	const production = token === PRODUCTION;
	const namespace = production ? "production" : "rehearsal";
	const { target, keyFile, selection, cap = DEFAULT_CAP } = opts;
	const injected = ["fetchImpl", "verifyDeployed", "stateDir", "repo", "mainRef", "now"].filter((name) => opts[name] !== undefined);
	if (production && injected.length) throw usage(`production takes no injected ${injected.join(", ")}`);
	if (!production) {
		if (typeof opts.fetchImpl !== "function" || typeof opts.verifyDeployed !== "function" || !opts.stateDir)
			throw usage("run() outside the CLI is a rehearsal: give it fetchImpl, verifyDeployed and its own stateDir");
		if (opts.fetchImpl === REAL_FETCH || opts.fetchImpl === globalThis.fetch) throw usage("a rehearsal injects a fake fetch, not the global one");
		if (path.resolve(opts.stateDir) === path.resolve(defaultStateDir())) throw usage("a rehearsal may not use the production state directory");
	}
	const fetchImpl = production ? REAL_FETCH : opts.fetchImpl;
	const verifyDeployed = production ? defaultVerifyDeployed : opts.verifyDeployed;
	const stateDir = production ? defaultStateDir() : opts.stateDir;
	const repo = opts.repo ?? ROOT;
	const mainRef = opts.mainRef ?? MAIN_REF;
	const now = opts.now ?? (() => Date.now());
	if (!SHA.test(target ?? "")) throw usage("--target must be a full 40-hex commit (the footer names full SHAs)");
	if (!Number.isInteger(cap) || cap < 1 || cap > 10000) throw usage("--cap must be an integer in 1..10000");
	const key = readKeyFile(keyFile);
	/* The selection is re-validated, de-duplicated and sorted here whatever built it: the set hash depends on the
	   URLs only, never on input order, and no unchecked row reaches the POST. */
	const canonical = (list, kind) =>
		[...new Set(list ?? [])].sort().map((url) => {
			const problem = urlProblem(url);
			if (problem) throw usage(`${kind} ${url}: ${problem}`);
			return url;
		});
	const updated = canonical(selection?.updated, "updated");
	const removed = canonical(selection?.removed, "removed");
	const duplicates = (selection?.duplicates ?? 0) + (selection?.updated?.length ?? 0) - updated.length + (selection?.removed?.length ?? 0) - removed.length;
	if (updated.some((url) => removed.includes(url))) throw usage("a URL is selected as both updated and removed");
	if (updated.length + removed.length === 0) throw usage("no URL selected");
	const lines = [...updated.map((u) => `updated ${u}`), ...removed.map((u) => `removed ${u}`)].sort();
	const urlList = [...updated, ...removed].sort();
	const p = statePaths(stateDir, namespace);
	const receipt = {
		schema: 1,
		mode: command,
		namespace,
		host: HOST,
		at: new Date(now()).toISOString(),
		target,
		updated,
		removed,
		duplicates_removed: duplicates,
		urls_sha256: sha256(lines.join("\n")),
		receipts_file: p.receipts,
		posted: false,
	};
	const attempt = crypto.randomUUID();

	let exit;
	let locked = false;
	try {
		if (command === "send") {
			takeLock(p, now());
			locked = true;
		}
		if (urlList.length > cap) throw precondition(`${urlList.length} URLs exceed the cap ${cap} (a policy value; review, or pass --cap)`);
		const gitProblem = targetProblem(repo, target, mainRef);
		if (gitProblem) throw precondition(gitProblem);
		receipt.main_tip = execFileSync("git", ["-C", repo, "rev-parse", mainRef], { encoding: "utf8" }).trim();
		receipt.target_is_main_tip = receipt.main_tip === target; // a docs-only push is not built: the tip may legitimately differ

		const receipts = readReceipts(p);
		/* A result-less intent may have been received. It is never resent or repaired automatically: the operator
		   reviews that attempt's stdout and record; what to do then is decided at that time. */
		const unresolved = attempts(receipts).filter((a) => !a.result).map((a) => a.intent);
		if (unresolved.length)
			throw precondition(`unresolved attempt(s) with no result — possibly received: ${unresolved.map((i) => `${i.attempt} target ${i.target.slice(0, 12)} [${[...i.updated, ...i.removed.map((u) => `removed ${u}`)].join(" ")}]`).join("; ")}`);
		const until = cooldownUntil(receipts);
		if (until !== null && until > now()) throw new Stop(EXIT.cooldown, "cooldown", `cooldown until ${new Date(until).toISOString()} after the last attempt`);
		const accepted = acceptedResults(receipts);
		if (accepted.some((r) => r.target === target && r.urls_sha256 === receipt.urls_sha256))
			throw precondition("this exact selection was already accepted for this target on this machine");
		/* Overlap with an earlier accepted set for this target is sent as selected and only reported: rows are
		   never dropped or added on the operator's behalf. */
		const acceptedForTarget = new Set(accepted.filter((r) => r.target === target).flatMap((r) => [...(r.updated ?? []), ...(r.removed ?? [])]));
		receipt.overlap_with_accepted = urlList.filter((url) => acceptedForTarget.has(url));
		const sentUpdated = new Set(accepted.flatMap((r) => r.updated ?? []));
		const unrecorded = removed.filter((url) => !sentUpdated.has(url));
		if (unrecorded.length)
			throw precondition(`removed URLs never accepted as updated on this machine: ${unrecorded.join(" ")} (left to recrawl; not sent)`);

		const before = await verifyDeployed(target);
		receipt.deploy_before = { gate: "scripts/verify-deployed.mjs", exit: before.exit, summary: before.summary };
		if (before.exit !== 0) throw notReady(`verify-deployed ${ORIGIN} ${target} exit ${before.exit}: ${before.summary}`);
		const sitemap = await readSitemap(fetchImpl);
		receipt.sitemap_locs = sitemap.size;
		receipt.pages = [];
		for (const url of updated) {
			if (!sitemap.has(url)) throw precondition(`${url} is not in the live sitemap (alias and redirect URLs are not sent)`);
			receipt.pages.push(await checkUpdated(fetchImpl, url, target));
		}
		for (const url of removed) {
			if (sitemap.has(url)) throw precondition(`${url} is still in the live sitemap`);
			receipt.pages.push(await checkRemoved(fetchImpl, url));
		}
		receipt.key = await checkKey(fetchImpl, key);

		if (command === "check") {
			receipt.outcome = "verified";
			return { exit: EXIT.ok, receipt };
		}

		const root = await servedCommit(fetchImpl, `${ORIGIN}/`);
		receipt.deploy_pre_post = { url: `${ORIGIN}/`, status: root.status, commit: root.commit ?? null, dirty: root.dirty ?? null };
		if (root.commit !== target || root.dirty) throw notReady(`${ORIGIN}/ serves ${root.commit ?? root.error}${root.dirty ? " (+ local changes)" : ""} just before the POST, not ${target}`);

		const body = JSON.stringify({ host: HOST, key, keyLocation: `${ORIGIN}/${key}.txt`, urlList });
		receipt.attempt = attempt;
		receipt.endpoint = ENDPOINT;
		receipt.url_count = urlList.length;
		receipt.request_sha256 = sha256(body); // the exact bytes POSTed; the key itself is never stored
		const intent = { schema: 1, mode: "send", phase: "intent", attempt, namespace, host: HOST, at: new Date(now()).toISOString(), target, updated, removed, urls_sha256: receipt.urls_sha256, request_sha256: receipt.request_sha256, url_count: urlList.length, endpoint: ENDPOINT };
		try {
			appendReceipt(p, intent);
		} catch (error) {
			throw new Stop(EXIT.localRecordFailed, "intent-not-recorded", `the attempt could not be recorded before sending, so nothing was sent: ${error.message}`);
		}
		receipt.posted = true;
		receipt.sent_at = intent.at;
		const started = now();
		try {
			const r = await request(fetchImpl, ENDPOINT, {
				method: "POST",
				headers: { "content-type": "application/json; charset=utf-8", "user-agent": "homepage-indexnow/1" },
				body,
				maxBytes: LIMITS.post,
				timeoutMs: POST_TIMEOUT_MS,
			});
			receipt.http = r.status;
			receipt.outcome = classifyResponse(r.status);
			receipt.retry_after = r.headers.get("retry-after");
			if (receipt.outcome === "rate-limited") receipt.retry_after_ms = parseRetryAfter(receipt.retry_after, now());
			receipt.response_excerpt = excerpt(r.text, key);
		} catch (error) {
			receipt.http = null;
			receipt.outcome = "unknown"; // a timeout or reset may still have been received
			receipt.post_error = excerpt(transportError(error), key);
		}
		receipt.received_at = new Date(now()).toISOString();
		receipt.ms = now() - started;
		exit = OUTCOME_EXIT[receipt.outcome];

		const probe = updated[0] ?? `${ORIGIN}/`;
		try {
			const after = await servedCommit(fetchImpl, probe);
			receipt.deploy_after = { url: probe, status: after.status, commit: after.commit ?? null, dirty: after.dirty ?? null, matched: after.commit === target && !after.dirty };
		} catch (error) {
			receipt.deploy_after = { url: probe, error: excerpt(error.message, key), matched: false };
		}
		if (!receipt.deploy_after.matched && exit === EXIT.ok) exit = EXIT.deployChanged;
	} catch (error) {
		if (!(error instanceof Stop)) throw error;
		receipt.outcome = error.outcome;
		receipt.error = excerpt(error.message, key);
		exit = error.exit;
		if (command === "check" || error.outcome === "locked") return { exit, receipt };
	} finally {
		if (locked) {
			receipt.phase = receipt.posted ? "result" : "refused";
			receipt.recorded_at = new Date(now()).toISOString();
			try {
				appendReceipt(p, receipt);
			} catch (error) {
				receipt.record_error = excerpt(error.message, key);
			}
			try {
				fs.rmSync(p.lock);
			} catch (error) {
				receipt.lock_error = excerpt(error.message, key);
			}
		}
	}
	if ((receipt.record_error || receipt.lock_error) && exit === EXIT.ok) exit = EXIT.localRecordFailed;
	return { exit, receipt };
}

// ---------------------------------------------------------------------------------------------------
// CLI

const VALUE_FLAGS = ["target", "key-file", "urls-file", "removed", "prefix", "cap"];
function parseArgs(argv) {
	const [command, ...rest] = argv;
	const flags = { _: [], removed: [] };
	for (let i = 0; i < rest.length; i++) {
		const arg = rest[i];
		if (!arg.startsWith("--")) {
			flags._.push(arg);
			continue;
		}
		const name = arg.slice(2);
		if (!VALUE_FLAGS.includes(name)) throw usage(`unknown flag ${arg}`);
		if (rest[i + 1] === undefined) throw usage(`${arg} needs a value`);
		if (name === "removed") flags.removed.push(rest[++i]);
		else if (name in flags) throw usage(`${arg} given twice`);
		else flags[name] = rest[++i];
	}
	return { command, flags };
}

const USAGE = "usage: indexnow.mjs candidates [--prefix /path/] | check|send --target <sha> --key-file <dir/KEY.txt> [<url|/path> …] [--removed <url> …] [--urls-file <file>] [--cap N] | status";

async function main(argv) {
	let command, flags;
	try {
		({ command, flags } = parseArgs(argv));
		if (process.env.HOMEPAGE_INDEXNOW_STATE_DIR !== undefined) throw usage(`HOMEPAGE_INDEXNOW_STATE_DIR is not supported; production state is ${defaultStateDir()}`);
		if (command === "candidates") {
			const prefix = flags.prefix ?? "/";
			if (!prefix.startsWith("/")) throw usage("--prefix must start with /");
			const locs = [...(await readSitemap(REAL_FETCH))].filter((url) => new URL(url).pathname.startsWith(prefix)).sort();
			for (const url of locs) console.log(url);
			console.error(`[indexnow] ${locs.length} live sitemap URL(s) under ${prefix} — candidates only; nothing is selected or sent`);
			return EXIT.ok;
		}
		if (command === "status") {
			const p = statePaths(defaultStateDir(), "production");
			const receipts = readReceipts(p);
			console.log(JSON.stringify({
				receipts_file: p.receipts,
				note: "this machine's records only: other machines' sends are invisible here, and a URL never selected is not 'done'",
				...statusReport(receipts),
				last: receipts.slice(-10),
			}, null, 2));
			return EXIT.ok;
		}
		if (command !== "check" && command !== "send") {
			console.error(USAGE);
			return EXIT.usage;
		}
		let file;
		if (flags["urls-file"]) {
			try {
				file = fs.readFileSync(flags["urls-file"], "utf8");
			} catch (error) {
				throw usage(`--urls-file cannot be read: ${error.code ?? error.message}`);
			}
		}
		const selection = parseSelection({ updated: flags._, removed: flags.removed, file });
		const cap = flags.cap === undefined ? DEFAULT_CAP : /^[1-9]\d*$/.test(flags.cap) ? Number(flags.cap) : NaN;
		const { exit, receipt } = await run(command, { target: flags.target, keyFile: flags["key-file"], selection, cap }, PRODUCTION);
		console.log(JSON.stringify(receipt, null, 2));
		const warn = [receipt.overlap_with_accepted?.length && `${receipt.overlap_with_accepted.length} URL(s) were already accepted for this target here`, receipt.record_error && `receipt NOT recorded (keep this stdout): ${receipt.record_error}`, receipt.lock_error && `lock NOT released: ${receipt.lock_error}`].filter(Boolean);
		console.error(`[indexnow] ${receipt.namespace} ${command} ${receipt.outcome} exit=${exit} target=${receipt.target?.slice(0, 12)} urls=${receipt.updated.length + receipt.removed.length}${receipt.error ? ` — ${receipt.error}` : ""}${warn.length ? ` — ${warn.join("; ")}` : ""}`);
		return exit;
	} catch (error) {
		if (!(error instanceof Stop)) throw error;
		console.error(`[indexnow] ${error.outcome}: ${error.message}`);
		return error.exit;
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	main(process.argv.slice(2)).then(
		(code) => process.exit(code),
		(error) => {
			console.error(`[indexnow] FAILED ${error.stack ?? error}`);
			process.exit(1);
		},
	);
}
