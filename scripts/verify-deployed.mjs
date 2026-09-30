#!/usr/bin/env node
/** Header and status gate for a deployed homepage: the responses, not the files that should produce them.
 * Usage: node scripts/verify-deployed.mjs <origin> [<commit>]   e.g. https://junghanacs.com 3ead173
 * With <commit>, the page footers (`data-build-commit`) must name that commit: the only link here
 * from the deployed bytes back to the source, since a Worker version carries no commit.
 * Contract SSOT: docs/deploy-cloudflare.md. static/_headers existing proves nothing about what a host
 * sends; Cloudflare joins overlapping rules and Netlify does not.
 */
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const origin = process.argv[2]?.replace(/\/$/, "");
if (!origin) { console.error("usage: node scripts/verify-deployed.mjs <origin> [<commit>]"); process.exit(2); }
const expectCommit = process.argv[3]?.toLowerCase();
if (expectCommit && !/^[0-9a-f]{7,40}$/.test(expectCommit)) { console.error(`not a commit: ${expectCommit}`); process.exit(2); }
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { runtime } = JSON.parse(await readFile(resolve(root, "data/eval/runtime.json"), "utf8"));
const engine = JSON.parse(await readFile(resolve(root, "data/eval/engine.json"), "utf8"));
const staticHeaders = await readFile(resolve(root, "static/_headers"), "utf8");
const rule = (path, name) => (staticHeaders.split(/\n\s*\n/).find((block) => block.split("\n").some((line) => line === path)) ?? "")
	.split("\n").find((line) => line.trim().toLowerCase().startsWith(`${name}:`))?.trim().slice(name.length + 1).trim();
const failures = [];
const fail = (message) => failures.push(message);
const indexable = !new URL(origin).hostname.endsWith(".workers.dev");
const normalizeCsp = (policy) => (policy ?? "").split(";").map((part) => part.trim().split(/\s+/).join(" ")).filter(Boolean).join("; ");
const evalCsp = normalizeCsp(rule("/eval/*", "content-security-policy"));
if (!evalCsp) { console.error("static/_headers has no /eval/* Content-Security-Policy"); process.exit(2); }

const releaseBase = engine.basePath;
const releaseFiles = ["manifest.json", "SHA256SUMS", ...engine.modules.map((module) => module.artifact), engine.conformance.artifact].map((file) => `${releaseBase}${file}`);
const runtimeFiles = [runtime.scittle, runtime.emmy].map((asset) => asset.file.replace(/^static/, ""));
const checks = [
	...["/", "/ko/", "/about/", "/blog/", "/projects/", "/javascript/", "/robots.txt", "/sitemap.xml"].map((path) => ({ path })),
	...["/eval/", "/ko/eval/", "/ko/eval/sicm/"].map((path) => ({ path, csp: evalCsp, nosniff: true })),
	{ path: "/llms.txt", charset: true },
	{ path: "/eval/engine/releases.json", cache: "public,max-age=0", cors: true, csp: evalCsp, nosniff: true },
	...releaseFiles.map((path) => ({ path, cache: "public,max-age=31536000,immutable", cors: true, csp: evalCsp, nosniff: true })),
	...runtimeFiles.map((path) => ({ path, cache: "public,max-age=31536000,immutable", csp: evalCsp, nosniff: true })),
	{ path: "/verify-deployed-missing/", status: 404 },
];

/* One response per path, every assertion on that response — including the footer commit below. */
const bodies = new Map();
for (const check of checks) {
	let response, body, lastError;
	/* One retry on a network exception only (a dropped connection is not an answer); any HTTP status counts. */
	for (let attempt = 0; attempt < 2 && !response; attempt++) {
		try {
			const candidate = await fetch(`${origin}${check.path}`, { redirect: "manual", signal: AbortSignal.timeout(15000) });
			body = await candidate.text();
			response = candidate;
		} catch (error) { lastError = error; }
	}
	if (!response) { fail(`${check.path} fetch failed: ${lastError.cause?.code ?? lastError.message}`); continue; }
	const header = (name) => response.headers.get(name);
	const where = check.path;
	if (response.status !== (check.status ?? 200)) { fail(`${where} answered ${response.status}`); continue; }
	bodies.set(check.path, body);
	/* fetch joins repeated header lines with ", ": a Cache-Control directive named twice means two rules matched. */
	const cacheNames = (header("cache-control") ?? "").split(",").map((part) => part.trim().split("=")[0].toLowerCase()).filter(Boolean);
	if (new Set(cacheNames).size !== cacheNames.length) fail(`${where} cache-control repeats a directive: ${header("cache-control")}`);
	if (check.cache && header("cache-control")?.replace(/\s/g, "").toLowerCase() !== check.cache) fail(`${where} cache-control is ${header("cache-control")}, expected ${check.cache}`);
	if (check.csp && normalizeCsp(header("content-security-policy")) !== check.csp) fail(`${where} CSP differs from static/_headers /eval/*: ${header("content-security-policy")}`);
	if (check.nosniff && header("x-content-type-options") !== "nosniff") fail(`${where} x-content-type-options is ${header("x-content-type-options")}`);
	if (check.cors && header("access-control-allow-origin") !== "*") fail(`${where} access-control-allow-origin is ${header("access-control-allow-origin")}`);
	if (check.charset && !/;\s*charset=utf-8$/i.test(header("content-type") ?? "")) fail(`${where} content-type has no utf-8 charset: ${header("content-type")}`);
	const robots = (header("x-robots-tag") ?? "").split(",").map((token) => token.trim().toLowerCase()).filter(Boolean);
	if (indexable && header("strict-transport-security")?.replace(/\s/g, "") !== "max-age=31536000") fail(`${where} strict-transport-security is ${header("strict-transport-security")}`);
	if (indexable && robots.length) fail(`${where} carries X-Robots-Tag on the canonical host: ${header("x-robots-tag")}`);
	if (!indexable && !robots.includes("noindex")) fail(`${where} is indexable on a workers.dev host`);
}

/* The publication footer names the build commit. Read from the same 200 responses checked above,
   so a stale or failing second fetch cannot vouch for the deploy. Only the footer anchor counts: one
   <p class=site-build>, whose data-build-commit is exactly 40 hex and matches its own commit href. */
const footerCommit = (html) => {
	const footers = html.match(/<p class=["']?site-build["']?>[\s\S]*?<\/p>/g) ?? [];
	if (footers.length !== 1) return { error: `${footers.length} build footers` };
	const anchor = footers[0].match(/<a href=["']?https:\/\/github\.com\/junghan0611\/homepage\/commit\/([0-9a-f]{40})["']?\s[^>]*\bdata-build-commit=["']?([0-9a-f]{40})(?=["'\s>])/);
	if (!anchor) return { error: "no commit anchor in the build footer" };
	if (anchor[1] !== anchor[2]) return { error: `footer href ${anchor[1]} and data-build-commit ${anchor[2]} disagree` };
	return { commit: anchor[1] };
};
let deployedCommit;
if (expectCommit) {
	const seen = new Map();
	for (const path of ["/", "/ko/", "/eval/"]) {
		if (!bodies.has(path)) continue; // already failed on status or fetch
		const { commit, error } = footerCommit(bodies.get(path));
		if (error) fail(`${path} ${error}`);
		else if (!commit.startsWith(expectCommit)) fail(`${path} was built from ${commit}, expected ${expectCommit}`);
		else seen.set(path, commit);
	}
	/* A short expected prefix could match two different full commits; the pages must agree. */
	if (new Set(seen.values()).size > 1) fail(`pages were built from different commits: ${[...seen].map(([path, commit]) => `${path} ${commit.slice(0, 12)}`).join(", ")}`);
	else deployedCommit = [...seen.values()][0];
}

if (failures.length) {
	console.error(`deployed verification failed for ${origin}:\n  - ${failures.join("\n  - ")}`);
	process.exit(1);
}
console.log(`deployed verified: ${origin}${deployedCommit ? ` @ ${deployedCommit.slice(0, 7)}` : ""} — ${checks.length} paths; status, Cache-Control directives, exact Eval CSP (en/ko), immutable engine release + runtime, CORS, llms charset, ${indexable ? "HSTS, no X-Robots-Tag (canonical host)" : "noindex (workers.dev host)"}`);
