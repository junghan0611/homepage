#!/usr/bin/env node
/** Tests for scripts/indexnow.mjs — node --test scripts/indexnow.test.mjs
 * Every run injects fetch and the deploy gate, so it is a rehearsal with its own temporary state; the
 * production state directory is pointed into the sandbox first, and no test touches the network.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";

const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "homepage-indexnow-test-"));
delete process.env.HOMEPAGE_INDEXNOW_STATE_DIR;
process.env.XDG_STATE_HOME = path.join(sandbox, "xdg"); // the standard production path, moved into the sandbox
const PRODUCTION_DIR = path.join(sandbox, "xdg", "homepage-indexnow");
after(() => fs.rmSync(sandbox, { recursive: true, force: true }));

const m = await import("./indexnow.mjs");
const { footerCommit } = await import("./build-footer.mjs");
const O = m.ORIGIN;
const EXIT = m.EXIT;

/* A git repository: c1 ← c2 (= origin/main) ← c3 (not on origin/main). */
const repo = path.join(sandbox, "repo");
fs.mkdirSync(repo);
execFileSync("git", ["init", "-q", repo]);
const git = (...args) => execFileSync("git", ["-C", repo, "-c", "user.name=t", "-c", "user.email=t@invalid", "-c", "commit.gpgsign=false", ...args], { encoding: "utf8" }).trim();
const commit = (n) => {
	fs.writeFileSync(path.join(repo, "f"), String(n));
	git("add", "f");
	git("commit", "-qm", `c${n}`);
	return git("rev-parse", "HEAD");
};
const C1 = commit(1);
const TARGET = commit(2);
git("update-ref", "refs/remotes/origin/main", TARGET);
const C3 = commit(3);

/* Explicit test dummies, generated per run: no key-shaped literal lives in this file. */
const KEY = `test-dummy-${crypto.randomUUID()}`;
const OTHER_KEY = `test-dummy-other-${crypto.randomUUID()}`;
const keyDir = fs.mkdtempSync(path.join(sandbox, "key-"));
const keyFile = path.join(keyDir, `${KEY}.txt`);
fs.writeFileSync(keyFile, `${KEY}\n`);

const LOCS = [`${O}/`, `${O}/projects/`, `${O}/projects/entwurf/`, `${O}/ko/`, `${O}/ko/projects/`, `${O}/ko/projects/entwurf/`];
const A = `${O}/projects/entwurf/`;
const B = `${O}/ko/projects/entwurf/`;

const pageHtml = (url, sha, { dirty = false, canonical = [url], robots = "index, follow", head = "", footers = 1 } = {}) => {
	const footer = `<p class=site-build>Built from <a href=https://github.com/junghan0611/homepage/commit/${sha} data-build-commit=${sha} target=_blank rel="noopener noreferrer"><code>${sha.slice(0, 7)}</code></a>${dirty ? "<span>+ local changes</span>" : ""}<span aria-hidden=true>·</span><span>Cloudflare Workers</span></p>`;
	return `<!doctype html><html lang=en><head><meta name=robots content="${robots}">${canonical.map((c) => `<link rel=canonical href=${c} itemprop=url>`).join("")}${head}</head><body><main id=content>body</main><footer>${footer.repeat(footers)}</footer></body></html>`;
};
const html = (body, status = 200, headers = {}) => ({ status, headers: { "content-type": "text/html", ...headers }, body });
const xml = (body, type = "application/xml") => ({ status: 200, headers: { "content-type": type }, body: `<?xml version="1.0" encoding="utf-8" standalone="yes"?>${body}` });
const urlset = (locs) => xml(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locs.map((u) => `<url><loc>${u}</loc><lastmod>2026-11-04T09:06:41+09:00</lastmod></url>`).join("")}</urlset>`);
const sitemapIndex = (children) => xml(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${children.map((c) => `<sitemap><loc>${c}</loc></sitemap>`).join("")}</sitemapindex>`);

/** A fake production host + IndexNow endpoint. routes: URL → { status, headers, body } or { throw }. */
function makeSite({ sha = TARGET, locs = LOCS } = {}) {
	const routes = new Map();
	routes.set(`${O}/sitemap.xml`, sitemapIndex([`${O}/en/sitemap.xml`, `${O}/ko/sitemap.xml`]));
	routes.set(`${O}/en/sitemap.xml`, urlset(locs.filter((u) => !u.startsWith(`${O}/ko/`))));
	routes.set(`${O}/ko/sitemap.xml`, urlset(locs.filter((u) => u.startsWith(`${O}/ko/`))));
	for (const url of new Set([...locs, `${O}/`])) routes.set(url, html(pageHtml(url, sha)));
	routes.set(`${O}/${KEY}.txt`, { status: 200, headers: { "content-type": "text/plain" }, body: `${KEY}\n` });
	const site = { routes, calls: [], posts: [], rawPosts: [], post: () => ({ status: 200, body: "" }), onPost: null };
	site.fetchImpl = async (url, init = {}) => {
		assert.equal(init.redirect, "manual", "redirects are never followed");
		site.calls.push(`${init.method ?? "GET"} ${url}`);
		if (url === m.ENDPOINT) {
			assert.equal(init.method, "POST");
			site.posts.push(JSON.parse(init.body));
			site.rawPosts.push(init.body);
			site.onPost?.();
			const reply = site.post();
			if (reply.throw) throw reply.throw;
			return new Response(reply.body ?? "", { status: reply.status, headers: reply.headers ?? {} });
		}
		assert.notEqual(init.method, "POST", "only the endpoint is POSTed");
		const r = routes.get(url) ?? html("<html><head></head><body>404</body></html>", 404);
		if (r.throw) throw r.throw;
		return new Response(r.body, { status: r.status, headers: r.headers });
	};
	return site;
}

const okGate = async () => ({ exit: 0, summary: "stub gate" });
const freshState = () => fs.mkdtempSync(path.join(sandbox, "state-"));
const sel = (...updated) => m.parseSelection({ updated });
let clock = Date.parse("2026-11-04T06:00:00Z");
const opts = (site, extra = {}) => ({ repo, target: TARGET, keyFile, selection: sel(A, B), fetchImpl: site.fetchImpl, verifyDeployed: okGate, now: () => clock, ...extra });
const receiptsFile = (dir) => path.join(dir, `${m.HOST}.rehearsal.receipts.jsonl`);
const readLines = (dir) => (fs.existsSync(receiptsFile(dir)) ? fs.readFileSync(receiptsFile(dir), "utf8").trim().split("\n").map((l) => JSON.parse(l)) : []);
const rejects = (promise, exit) => assert.rejects(promise, (e) => e instanceof m.Stop && e.exit === exit);

// ---------------------------------------------------------------------------------------------------
// URL and selection grammar

test("urlProblem accepts only the exact canonical serialization", () => {
	for (const ok of [`${O}/`, A, B, `${O}/ko/blog/20240321t160910/`]) assert.equal(m.urlProblem(ok), null, ok);
	const refused = [
		"http://junghanacs.com/",
		"https://www.junghanacs.com/",
		"https://junghanacs-homepage.junghanacs.workers.dev/",
		"https://notes.junghanacs.com/",
		"https://junghanacs.com./",
		"https://JunghanACS.com/",
		"https://junghanacs.com:443/",
		"https://junghanacs.com:8443/",
		"https://user@junghanacs.com/",
		"https://user:pw@junghanacs.com/",
		"https://junghanacs.com/?a=1",
		"https://junghanacs.com/?",
		"https://junghanacs.com/#x",
		"https://junghanacs.com/#",
		"https://junghanacs.com/projects",
		"https://junghanacs.com//projects/",
		"https://junghanacs.com/a/../projects/",
		"https://junghanacs.com/./projects/",
		"https://junghanacs.com/%2e%2e/projects/",
		"https://junghanacs.com/a%2Fb/",
		"https://junghanacs.com/a%5cb/",
		"https://junghanacs.com\\projects\\",
		"https://junghanacs.com/a b/",
		"ftp://junghanacs.com/",
		"javascript:alert(1)",
		"//junghanacs.com/",
		"projects/",
		"",
	];
	for (const bad of refused) assert.notEqual(m.urlProblem(bad), null, bad);
});

test("parseSelection: shorthand, file grammar, duplicates, conflicts", () => {
	const s = m.parseSelection({ updated: ["/projects/entwurf/", A], file: `# comment\n\n${B}\nremoved ${O}/old/\n` });
	assert.deepEqual(s, { updated: [B, A].sort(), removed: [`${O}/old/`], duplicates: 1 });
	assert.throws(() => m.parseSelection({ updated: [A], removed: [A] }), (e) => e.exit === EXIT.usage);
	assert.throws(() => m.parseSelection({ file: "delete https://junghanacs.com/x/" }), (e) => e.exit === EXIT.usage);
	assert.throws(() => m.parseSelection({ updated: ["//evil.example/"] }), (e) => e.exit === EXIT.usage);
	assert.throws(() => m.parseSelection({ updated: ["/Projects"] }), (e) => e.exit === EXIT.usage);
});

test("readKeyFile: the name is the key and the body must be exactly it", () => {
	assert.equal(m.readKeyFile(keyFile), KEY);
	const other = path.join(keyDir, `${OTHER_KEY}.txt`);
	fs.writeFileSync(other, `${KEY}\n`); // an old key body under a new name
	assert.throws(() => m.readKeyFile(other), (e) => e.exit === EXIT.precondition);
	assert.throws(() => m.readKeyFile(path.join(keyDir, "short.txt")), (e) => e.exit === EXIT.usage);
	assert.throws(() => m.readKeyFile(undefined), (e) => e.exit === EXIT.usage);
});

test("footerCommit (shared with verify-deployed) keeps its readings", () => {
	assert.deepEqual(footerCommit(pageHtml(A, TARGET)), { commit: TARGET });
	assert.deepEqual(footerCommit(`<p class="site-build">Built from <a href="https://github.com/junghan0611/homepage/commit/${TARGET}" data-build-commit="${TARGET}">x</a></p>`), { commit: TARGET });
	assert.match(footerCommit(pageHtml(A, TARGET, { footers: 2 })).error, /2 build footers/);
	assert.match(footerCommit("<html></html>").error, /0 build footers/);
	assert.match(footerCommit(`<p class=site-build>Built from <a href=https://github.com/junghan0611/homepage/commit/${TARGET} data-build-commit=${C1}>x</a></p>`).error, /disagree/);
	assert.match(footerCommit("<p class=site-build>Built from <code>abc</code></p>").error, /no commit anchor/);
	assert.equal(m.footerIsDirty(pageHtml(A, TARGET, { dirty: true })), true);
	assert.equal(m.footerIsDirty(pageHtml(A, TARGET)), false);
});

// ---------------------------------------------------------------------------------------------------
// Namespaces: the production-pollution counterexample

test("the exported run() is always a rehearsal: nothing it is handed selects production", async () => {
	assert.equal(m.PRODUCTION, undefined);
	assert.equal(m.main, undefined);
	assert.equal(m.namespaceFor, undefined);
	const site = makeSite();
	const base = { repo, target: TARGET, keyFile, selection: sel(A), now: () => clock };
	await rejects(m.run("send", { ...base, stateDir: freshState() }), EXIT.usage); // no default fetch or gate
	await rejects(m.run("send", { ...base, stateDir: freshState(), fetchImpl: globalThis.fetch, verifyDeployed: okGate }), EXIT.usage);
	await rejects(m.run("send", { ...base, fetchImpl: site.fetchImpl, verifyDeployed: okGate }), EXIT.usage);
	await rejects(m.run("send", { ...base, fetchImpl: site.fetchImpl, verifyDeployed: okGate, stateDir: PRODUCTION_DIR }), EXIT.usage);
	const forged = await m.run("send", { ...base, fetchImpl: site.fetchImpl, verifyDeployed: okGate, stateDir: freshState() }, Symbol("production"));
	assert.equal(forged.receipt.namespace, "rehearsal");
	assert.equal(fs.existsSync(PRODUCTION_DIR), false);
});

test("a fetch mock installed before import still cannot make run() production", () => {
	const script = path.join(sandbox, "preimport.mjs");
	fs.writeFileSync(script, `
const urls = [];
globalThis.fetch = async (url) => { urls.push(String(url)); return new Response("", { status: 200 }); };
const m = await import(${JSON.stringify(new URL("./indexnow.mjs", import.meta.url).href)});
const base = { repo: ${JSON.stringify(repo)}, target: ${JSON.stringify(TARGET)}, keyFile: ${JSON.stringify(keyFile)}, selection: { updated: [${JSON.stringify(A)}], removed: [] } };
const out = {};
/* bare: exactly what a production call would carry, and nothing a rehearsal needs. */
const bare = { target: base.target, keyFile: base.keyFile, selection: base.selection };
for (const [name, args] of Object.entries({ bare, global: { ...base, fetchImpl: globalThis.fetch, verifyDeployed: async () => ({ exit: 0 }), stateDir: ${JSON.stringify(path.join(sandbox, "child-state"))} } })) {
	try { const r = await m.run("send", args); out[name] = r.receipt.namespace + ":" + r.receipt.outcome; } catch (e) { out[name] = e.outcome ?? String(e); }
}
out.fetches = urls.length;
console.log(JSON.stringify(out));
`);
	const childXdg = path.join(sandbox, "xdg-child");
	const stdout = execFileSync(process.execPath, [script], { encoding: "utf8", env: { ...process.env, XDG_STATE_HOME: childXdg } });
	assert.deepEqual(JSON.parse(stdout.trim().split("\n").pop()), { bare: "usage", global: "usage", fetches: 0 });
	assert.equal(fs.existsSync(childXdg), false);
	assert.equal(fs.existsSync(path.join(sandbox, "child-state")), false);
});

test("CLI: production state has one path — no --state-dir, no HOMEPAGE_INDEXNOW_STATE_DIR; status names the file", () => {
	const cli = new URL("./indexnow.mjs", import.meta.url).pathname;
	const childXdg = path.join(sandbox, "xdg-cli");
	const runCli = (args, env = {}) => {
		try {
			return { code: 0, out: execFileSync(process.execPath, [cli, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, XDG_STATE_HOME: childXdg, ...env } }) };
		} catch (e) {
			return { code: e.status, out: `${e.stdout}${e.stderr}` };
		}
	};
	assert.equal(runCli(["send", "--state-dir", sandbox, "--target", TARGET, "--key-file", keyFile, A]).code, EXIT.usage);
	assert.equal(runCli(["status", "--state-dir", sandbox]).code, EXIT.usage);
	assert.equal(runCli(["status"], { HOMEPAGE_INDEXNOW_STATE_DIR: sandbox }).code, EXIT.usage);
	const status = runCli(["status"]);
	assert.equal(status.code, 0);
	assert.equal(JSON.parse(status.out).receipts_file, path.join(childXdg, "homepage-indexnow", `${m.HOST}.receipts.jsonl`));
	assert.equal(fs.existsSync(childXdg), false, "status reads; it creates nothing");
});

test("an injected run cannot reach production state, even when its POST is accepted", async () => {
	const site = makeSite();
	await rejects(m.run("send", opts(site)), EXIT.usage); // no state dir
	await rejects(m.run("send", opts(site, { stateDir: PRODUCTION_DIR })), EXIT.usage);
	assert.equal(site.posts.length, 0);
	const dir = freshState();
	const { exit } = await m.run("send", opts(site, { stateDir: dir }));
	assert.equal(exit, EXIT.ok);
	assert.equal(site.posts.length, 1);
	assert.equal(fs.existsSync(PRODUCTION_DIR), false);
	assert.equal(fs.existsSync(path.join(dir, `${m.HOST}.receipts.jsonl`)), false);
	assert.deepEqual(readLines(dir).map((r) => [r.namespace, r.phase]), [["rehearsal", "intent"], ["rehearsal", "result"]]);
});

test("a receipts file whose lines name another namespace, or a corrupt line, stops the run", async () => {
	const dir = freshState();
	fs.writeFileSync(receiptsFile(dir), JSON.stringify({ schema: 1, mode: "send", phase: "result", attempt: "x", namespace: "production", host: m.HOST }) + "\n", { mode: 0o600 });
	const site = makeSite();
	const r1 = await m.run("send", opts(site, { stateDir: dir }));
	assert.equal(r1.exit, EXIT.precondition);
	fs.writeFileSync(receiptsFile(dir), "{not json\n", { mode: 0o600 });
	const r2 = await m.run("check", opts(site, { stateDir: dir }));
	assert.equal(r2.exit, EXIT.precondition);
	assert.match(r2.receipt.error, /not JSON/);
	assert.equal(site.posts.length, 0);
});

test("state must be private", async () => {
	const dir = freshState();
	fs.chmodSync(dir, 0o755);
	const site = makeSite();
	const { exit, receipt } = await m.run("send", opts(site, { stateDir: dir }));
	assert.equal(exit, EXIT.precondition);
	assert.match(receipt.error, /mode 755/);
	assert.equal(site.posts.length, 0);
});

// ---------------------------------------------------------------------------------------------------
// check and send

test("check verifies everything and writes nothing", async () => {
	const site = makeSite();
	const dir = freshState();
	const { exit, receipt } = await m.run("check", opts(site, { stateDir: dir }));
	assert.equal(exit, EXIT.ok);
	assert.equal(receipt.outcome, "verified");
	assert.equal(receipt.pages.length, 2);
	assert.equal(site.posts.length, 0);
	assert.deepEqual(fs.readdirSync(dir), []);
	assert.equal(receipt.receipts_file, receiptsFile(dir));
	assert.ok(site.calls.every((c) => c.startsWith("GET ")));
});

test("send POSTs exactly the checked set once, records intent then result, and never stores the key", async () => {
	const site = makeSite();
	const dir = freshState();
	const { exit, receipt } = await m.run("send", opts(site, { stateDir: dir }));
	assert.equal(exit, EXIT.ok);
	assert.deepEqual(site.posts, [{ host: m.HOST, key: KEY, keyLocation: `${O}/${KEY}.txt`, urlList: [B, A].sort() }]);
	assert.equal(receipt.outcome, "accepted");
	assert.equal(receipt.deploy_after.matched, true);
	assert.equal(receipt.main_tip, TARGET);
	assert.equal(receipt.target_is_main_tip, true);
	const lines = readLines(dir);
	assert.equal(lines[0].attempt, lines[1].attempt);
	assert.equal(lines[1].http, 200);
	assert.equal(fs.statSync(dir).mode & 0o777, 0o700);
	assert.equal(fs.statSync(receiptsFile(dir)).mode & 0o777, 0o600);
	assert.ok(!fs.readFileSync(receiptsFile(dir), "utf8").includes(KEY));
	assert.ok(!JSON.stringify(receipt).includes(KEY));
	assert.ok(!JSON.stringify(lines).includes(`${O}/projects/"`), "an unselected sitemap URL is not recorded");
	assert.equal(fs.existsSync(path.join(dir, `${m.HOST}.rehearsal.lock`)), false);
});

test("the same selection is refused once accepted; another set for the same target is its own notice", async () => {
	const site = makeSite();
	const dir = freshState();
	assert.equal((await m.run("send", opts(site, { stateDir: dir, selection: sel(A) }))).exit, EXIT.ok);
	assert.equal((await m.run("send", opts(site, { stateDir: dir, selection: sel(A) }))).exit, EXIT.precondition);
	assert.equal(site.posts.length, 1);
	assert.equal((await m.run("send", opts(site, { stateDir: dir, selection: sel(A, B) }))).exit, EXIT.ok);
	assert.equal(site.posts.length, 2);
	assert.ok(readLines(dir).every((r) => !("baseline" in r)), "no site-wide baseline is kept");
});

test("one failing row means no POST at all", async () => {
	const site = makeSite();
	const dir = freshState();
	const { exit, receipt } = await m.run("send", opts(site, { stateDir: dir, selection: sel(A, `${O}/not-in-sitemap/`) }));
	assert.equal(exit, EXIT.precondition);
	assert.equal(site.posts.length, 0);
	assert.deepEqual(readLines(dir).map((r) => r.phase), ["refused"]);
	assert.equal(receipt.posted, false);
});

test("pages: other target, dirty footer, unreadable footer, redirect, 5xx", async () => {
	const cases = [
		[(s) => s.routes.set(A, html(pageHtml(A, C1))), EXIT.notReady],
		[(s) => s.routes.set(A, html(pageHtml(A, TARGET, { dirty: true }))), EXIT.precondition],
		[(s) => s.routes.set(A, html(pageHtml(A, TARGET, { footers: 2 }))), EXIT.notReady],
		[(s) => s.routes.set(A, html("", 307, { location: "/projects/entwurf" })), EXIT.precondition],
		[(s) => s.routes.set(A, html("", 503)), EXIT.notReady],
		[(s) => s.routes.set(A, { throw: Object.assign(new Error("t"), { name: "TimeoutError" }) }), EXIT.notReady],
		[(s) => s.routes.set(A, { status: 200, headers: { "content-type": "application/json" }, body: "{}" }), EXIT.precondition],
	];
	for (const [mutate, want] of cases) {
		const site = makeSite();
		mutate(site);
		const { exit } = await m.run("send", opts(site, { stateDir: freshState() }));
		assert.equal(exit, want);
		assert.equal(site.posts.length, 0);
	}
});

test("pages: canonical, robots meta, X-Robots-Tag and meta refresh", async () => {
	const cases = [
		html(pageHtml(A, TARGET, { canonical: [B] })),
		html(pageHtml(A, TARGET, { canonical: [A, A] })),
		html(pageHtml(A, TARGET, { canonical: [] })),
		html(pageHtml(A, TARGET, { robots: "noindex, follow" })),
		html(pageHtml(A, TARGET), 200, { "x-robots-tag": "noindex" }),
		html(pageHtml(A, TARGET, { head: `<meta http-equiv=refresh content="0; url=${B}">` })),
	];
	for (const route of cases) {
		const site = makeSite();
		site.routes.set(A, route);
		const { exit } = await m.run("send", opts(site, { stateDir: freshState() }));
		assert.equal(exit, EXIT.precondition);
		assert.equal(site.posts.length, 0);
	}
});

test("live key: old body, SPA page, missing, redirected", async () => {
	const keyUrl = `${O}/${KEY}.txt`;
	const cases = [
		{ status: 200, headers: { "content-type": "text/plain" }, body: "oldkey0123456789\n" },
		{ status: 200, headers: { "content-type": "text/html" }, body: `${KEY}\n` },
		html("<html>spa</html>"),
		html("404", 404),
		{ status: 301, headers: { location: "/other.txt", "content-type": "text/plain" }, body: "" },
	];
	for (const route of cases) {
		const site = makeSite();
		site.routes.set(keyUrl, route);
		const { exit, receipt } = await m.run("send", opts(site, { stateDir: freshState() }));
		assert.equal(exit, EXIT.precondition);
		assert.ok(!JSON.stringify(receipt).includes(KEY));
		assert.equal(site.posts.length, 0);
	}
});

test("target: full SHA required, must be on origin/main, deploy gate must pass", async () => {
	const site = makeSite();
	await rejects(m.run("send", opts(site, { stateDir: freshState(), target: TARGET.slice(0, 12) })), EXIT.usage);
	assert.equal((await m.run("send", opts(site, { stateDir: freshState(), target: C3 }))).exit, EXIT.precondition);
	assert.equal((await m.run("send", opts(site, { stateDir: freshState(), target: "f".repeat(40) }))).exit, EXIT.precondition);
	const failing = async () => ({ exit: 1, summary: "deployed verification failed" });
	assert.equal((await m.run("send", opts(site, { stateDir: freshState(), verifyDeployed: failing }))).exit, EXIT.notReady);
	assert.equal(site.posts.length, 0);
	/* An ancestor of origin/main is a valid target: a docs-only push leaves the tip ahead of what is served. */
	const older = makeSite({ sha: C1 });
	const { exit, receipt } = await m.run("check", opts(older, { stateDir: freshState(), target: C1 }));
	assert.equal(exit, EXIT.ok);
	assert.equal(receipt.target_is_main_tip, false);
});

test("the root footer is re-read just before the POST", async () => {
	const site = makeSite();
	site.routes.set(`${O}/`, html(pageHtml(`${O}/`, C1)));
	const { exit, receipt } = await m.run("send", opts(site, { stateDir: freshState() }));
	assert.equal(exit, EXIT.notReady);
	assert.equal(receipt.deploy_pre_post.commit, C1);
	assert.equal(site.posts.length, 0);
});

test("cap is a policy refusal before any network read", async () => {
	const site = makeSite();
	const urls = Array.from({ length: 31 }, (_, i) => `${O}/p${i}/`);
	const { exit } = await m.run("send", opts(site, { stateDir: freshState(), selection: sel(...urls) }));
	assert.equal(exit, EXIT.precondition);
	assert.deepEqual(site.calls, []);
});

test("sitemap defenses: foreign or repeated children, cycles, HTML 200, bad locs, entities, size", async () => {
	const big = xml(`<urlset>${"<!-- -->".repeat(300000)}</urlset>`);
	const cases = [
		(s) => s.routes.set(`${O}/sitemap.xml`, sitemapIndex([`https://evil.example/en/sitemap.xml`])),
		(s) => s.routes.set(`${O}/sitemap.xml`, sitemapIndex([`${O}/en/sitemap.xml`, `${O}/en/sitemap.xml`])),
		(s) => s.routes.set(`${O}/sitemap.xml`, sitemapIndex([`${O}/sitemap.xml`])),
		(s) => s.routes.set(`${O}/sitemap.xml`, sitemapIndex([`${O}/en/sitemap.xml?x=1`])),
		(s) => s.routes.set(`${O}/sitemap.xml`, html("<html>spa</html>")),
		(s) => s.routes.set(`${O}/en/sitemap.xml`, sitemapIndex([`${O}/en/sitemap.xml`])),
		(s) => s.routes.set(`${O}/en/sitemap.xml`, urlset([`${O}/?q=1`])),
		(s) => s.routes.set(`${O}/en/sitemap.xml`, urlset([`https://www.junghanacs.com/`])),
		(s) => s.routes.set(`${O}/en/sitemap.xml`, urlset([`${O}/a&bogus;/`])),
		(s) => s.routes.set(`${O}/en/sitemap.xml`, xml(`<urlset><url><lastmod>x</lastmod><loc>${A}</loc></url></urlset>`)),
		(s) => s.routes.set(`${O}/en/sitemap.xml`, big),
		(s) => s.routes.set(`${O}/en/sitemap.xml`, xml(`<urlset><url><loc>${A}</loc></url>`)),
	];
	for (const mutate of cases) {
		const site = makeSite();
		mutate(site);
		const { exit } = await m.run("send", opts(site, { stateDir: freshState() }));
		assert.equal(exit, EXIT.precondition);
		assert.equal(site.posts.length, 0);
	}
});

// ---------------------------------------------------------------------------------------------------
// Responses, cooldown, intent

test("202 and unknown cool down 10 minutes; 403 is rejected without cooldown", async () => {
	for (const [reply, exitWant] of [
		[{ status: 202 }, EXIT.receivedPending],
		[{ status: 500 }, EXIT.unknown],
		[{ throw: Object.assign(new Error("t"), { name: "TimeoutError" }) }, EXIT.unknown],
	]) {
		const site = makeSite();
		const dir = freshState();
		site.post = () => reply;
		const first = await m.run("send", opts(site, { stateDir: dir }));
		assert.equal(first.exit, exitWant);
		assert.equal(first.receipt.posted, true);
		clock += 5 * 60 * 1000;
		assert.equal((await m.run("send", opts(site, { stateDir: dir }))).exit, EXIT.cooldown);
		assert.equal(site.posts.length, 1);
		clock += 6 * 60 * 1000;
		site.post = () => ({ status: 200 });
		assert.equal((await m.run("send", opts(site, { stateDir: dir }))).exit, EXIT.ok);
		assert.equal(site.posts.length, 2);
	}
	const site = makeSite();
	const dir = freshState();
	site.post = () => ({ status: 403, body: `bad key ${KEY}` });
	const r = await m.run("send", opts(site, { stateDir: dir }));
	assert.equal(r.exit, EXIT.rejected);
	assert.ok(!r.receipt.response_excerpt.includes(KEY));
	assert.equal((await m.run("check", opts(site, { stateDir: dir }))).exit, EXIT.ok);
});

test("429 honours Retry-After as seconds or HTTP-date, within [10 min, 24 h]", async () => {
	for (const retryAfterFor of [() => "3600", (t) => new Date(t + 3600 * 1000).toUTCString()]) {
		const site = makeSite();
		const dir = freshState();
		const start = clock;
		const retryAfter = retryAfterFor(start);
		site.post = () => ({ status: 429, headers: { "retry-after": retryAfter } });
		assert.equal((await m.run("send", opts(site, { stateDir: dir }))).exit, EXIT.rateLimited);
		clock = start + 30 * 60 * 1000;
		assert.equal((await m.run("send", opts(site, { stateDir: dir }))).exit, EXIT.cooldown);
		clock = start + 61 * 60 * 1000;
		site.post = () => ({ status: 200 });
		assert.equal((await m.run("send", opts(site, { stateDir: dir }))).exit, EXIT.ok);
	}
	assert.equal(m.parseRetryAfter("soon", clock), null);
	assert.equal(m.parseRetryAfter("120", clock), 120000);
});

test("an intent without a result stops every later send and check until the operator decides", async () => {
	const dir = freshState();
	fs.writeFileSync(receiptsFile(dir), JSON.stringify({ schema: 1, mode: "send", phase: "intent", attempt: "a1", namespace: "rehearsal", host: m.HOST, at: new Date(clock).toISOString(), target: TARGET, updated: [A], removed: [], urls_sha256: "0".repeat(64), request_sha256: "1".repeat(64) }) + "\n", { mode: 0o600 });
	const receipts = m.readReceipts(m.statePaths(dir, "rehearsal"));
	assert.equal(m.attempts(receipts)[0].result, undefined);
	const site = makeSite();
	for (const later of [0, 11 * 60 * 1000, 25 * 60 * 60 * 1000]) {
		clock += later;
		for (const command of ["send", "check"]) {
			const { exit, receipt } = await m.run(command, opts(site, { stateDir: dir, selection: sel(B) }));
			assert.equal(exit, EXIT.precondition);
			assert.match(receipt.error, /unresolved attempt.*a1.*projects\/entwurf/);
		}
	}
	assert.equal(site.posts.length, 0);
	assert.equal(m.attempts(m.readReceipts(m.statePaths(dir, "rehearsal")))[0].result, undefined, "nothing is repaired into a result");
});

test("a 202 for an updated URL is not evidence for removing it later", async () => {
	const dir = freshState();
	const gone = `${O}/projects/old/`;
	const before = makeSite({ locs: [...LOCS, gone] });
	before.post = () => ({ status: 202 });
	assert.equal((await m.run("send", opts(before, { stateDir: dir, selection: sel(gone) }))).exit, EXIT.receivedPending);
	clock += 11 * 60 * 1000;
	const { exit, receipt } = await m.run("send", opts(makeSite(), { stateDir: dir, selection: m.parseSelection({ removed: [gone] }) }));
	assert.equal(exit, EXIT.precondition);
	assert.match(receipt.error, /never accepted/);
});

test("if the intent cannot be written nothing is sent", async () => {
	if (process.getuid?.() === 0) return; // root ignores file modes
	const dir = freshState();
	fs.writeFileSync(receiptsFile(dir), "", { mode: 0o400 });
	const site = makeSite();
	const { exit, receipt } = await m.run("send", opts(site, { stateDir: dir }));
	assert.equal(exit, EXIT.localRecordFailed);
	assert.equal(receipt.outcome, "intent-not-recorded");
	assert.equal(site.posts.length, 0);
	assert.ok(receipt.record_error);
});

test("a 200 whose result cannot be recorded is accepted but exits non-zero", async () => {
	if (process.getuid?.() === 0) return;
	const dir = freshState();
	const site = makeSite();
	site.onPost = () => fs.chmodSync(receiptsFile(dir), 0o400);
	const { exit, receipt } = await m.run("send", opts(site, { stateDir: dir }));
	assert.equal(receipt.outcome, "accepted");
	assert.equal(exit, EXIT.localRecordFailed);
	assert.ok(receipt.record_error);
	assert.equal(site.posts.length, 1);
});

test("a held lock is not taken over or removed", async () => {
	const dir = freshState();
	const lock = path.join(dir, `${m.HOST}.rehearsal.lock`);
	fs.writeFileSync(lock, "{}\n", { mode: 0o600 });
	const site = makeSite();
	const { exit, receipt } = await m.run("send", opts(site, { stateDir: dir }));
	assert.equal(exit, EXIT.precondition);
	assert.equal(receipt.outcome, "locked");
	assert.ok(fs.existsSync(lock));
	assert.equal(site.posts.length, 0);
	assert.equal(fs.existsSync(receiptsFile(dir)), false);
});

test("a drifted deploy after the POST stays on its own axis", async () => {
	const site = makeSite();
	site.onPost = () => [A, B].forEach((url) => site.routes.set(url, html(pageHtml(url, C1))));
	const r1 = await m.run("send", opts(site, { stateDir: freshState() }));
	assert.equal(r1.receipt.outcome, "accepted");
	assert.equal(r1.receipt.deploy_after.matched, false);
	assert.equal(r1.exit, EXIT.deployChanged);
	const site2 = makeSite();
	site2.onPost = () => [A, B].forEach((url) => site2.routes.set(url, { throw: new Error("reset") }));
	const r2 = await m.run("send", opts(site2, { stateDir: freshState() }));
	assert.equal(r2.receipt.outcome, "accepted");
	assert.equal(r2.receipt.http, 200);
	assert.equal(r2.exit, EXIT.deployChanged);
});

// ---------------------------------------------------------------------------------------------------
// Removed URLs

test("removed: only a URL this machine sent as updated, gone from the sitemap and answering 404", async () => {
	const dir = freshState();
	const gone = `${O}/projects/old/`;
	const before = makeSite({ locs: [...LOCS, gone] });
	const removedSel = m.parseSelection({ removed: [gone] });
	assert.equal((await m.run("send", opts(makeSite(), { stateDir: dir, selection: removedSel }))).exit, EXIT.precondition); // never sent
	assert.equal((await m.run("send", opts(before, { stateDir: dir, selection: sel(gone) }))).exit, EXIT.ok);
	assert.equal((await m.run("send", opts(before, { stateDir: dir, selection: removedSel }))).exit, EXIT.precondition); // still listed
	const redirected = makeSite();
	redirected.routes.set(gone, html("", 301, { location: A }));
	assert.equal((await m.run("send", opts(redirected, { stateDir: dir, selection: removedSel }))).exit, EXIT.precondition);
	const after = makeSite();
	const { exit } = await m.run("send", opts(after, { stateDir: dir, selection: removedSel }));
	assert.equal(exit, EXIT.ok);
	assert.deepEqual(after.posts.at(-1).urlList, [gone]);
});

// ---------------------------------------------------------------------------------------------------
// Garden-coordinator counterexamples (A/B/C/D/E)

test("A: concurrent sends — the lock spans receipts read, intent, POST and result", async () => {
	const dir = freshState();
	const site = makeSite();
	let release;
	const gate = new Promise((resolve) => (release = resolve));
	site.post = () => ({ status: 200 });
	site.onPost = () => {};
	const slowFetch = async (url, init) => {
		if (url === m.ENDPOINT) await gate;
		return site.fetchImpl(url, init);
	};
	const first = m.run("send", opts(site, { stateDir: dir, fetchImpl: slowFetch }));
	await new Promise((r) => setTimeout(r, 50)); // the first run is now waiting inside its POST
	const second = await m.run("send", opts(site, { stateDir: dir, fetchImpl: slowFetch, selection: sel(A) }));
	assert.equal(second.receipt.outcome, "locked");
	release();
	assert.equal((await first).exit, EXIT.ok);
	assert.equal(site.posts.length, 1);
});

test("B: the set hash ignores input order; cooldown is per host, not per set; overlap is reported, not dropped", async () => {
	const dir = freshState();
	const site = makeSite();
	assert.equal((await m.run("send", opts(site, { stateDir: dir, selection: m.parseSelection({ updated: [A, B] }) }))).exit, EXIT.ok);
	assert.equal((await m.run("send", opts(site, { stateDir: dir, selection: m.parseSelection({ updated: [B, A] }) }))).exit, EXIT.precondition);
	const overlap = await m.run("send", opts(site, { stateDir: dir, selection: sel(A, `${O}/projects/`) }));
	assert.equal(overlap.exit, EXIT.ok);
	assert.deepEqual(overlap.receipt.overlap_with_accepted, [A]);
	assert.deepEqual(site.posts.at(-1).urlList, [A, `${O}/projects/`].sort());
	site.post = () => ({ status: 202 });
	assert.equal((await m.run("send", opts(site, { stateDir: dir, selection: sel(`${O}/ko/`) }))).exit, EXIT.receivedPending);
	assert.equal((await m.run("send", opts(site, { stateDir: dir, selection: sel(`${O}/ko/projects/`) }))).exit, EXIT.cooldown); // a different set does not escape
	clock += 11 * 60 * 1000;
});

test("C: malformed Retry-After falls back to the 10-minute cooldown", async () => {
	const dir = freshState();
	const site = makeSite();
	site.post = () => ({ status: 429, headers: { "retry-after": "tomorrow-ish" } });
	const start = clock;
	assert.equal((await m.run("send", opts(site, { stateDir: dir }))).exit, EXIT.rateLimited);
	clock = start + 9 * 60 * 1000;
	assert.equal((await m.run("send", opts(site, { stateDir: dir }))).exit, EXIT.cooldown);
	clock = start + 11 * 60 * 1000;
	site.post = () => ({ status: 200 });
	assert.equal((await m.run("send", opts(site, { stateDir: dir }))).exit, EXIT.ok);
});

test("D: a removed-only batch is witnessed by the deploy gate and the root footer in the same attempt", async () => {
	const gone = `${O}/projects/old/`;
	const seed = async () => {
		const dir = freshState();
		assert.equal((await m.run("send", opts(makeSite({ locs: [...LOCS, gone] }), { stateDir: dir, selection: sel(gone) }))).exit, EXIT.ok);
		return dir;
	};
	const removedSel = m.parseSelection({ removed: [gone] });
	const failing = async () => ({ exit: 1, summary: "/ was built from another commit" });
	assert.equal((await m.run("send", opts(makeSite(), { stateDir: await seed(), selection: removedSel, verifyDeployed: failing }))).exit, EXIT.notReady);
	const drifted = makeSite();
	drifted.routes.set(`${O}/`, html(pageHtml(`${O}/`, C1)));
	assert.equal((await m.run("send", opts(drifted, { stateDir: await seed(), selection: removedSel }))).exit, EXIT.notReady);
	assert.equal(drifted.posts.length, 0);
	const dir = await seed();
	const { exit, receipt } = await m.run("send", opts(makeSite(), { stateDir: dir, selection: removedSel }));
	assert.equal(exit, EXIT.ok);
	assert.equal(receipt.deploy_before.exit, 0);
	assert.equal(receipt.deploy_pre_post.commit, TARGET);
	assert.deepEqual(receipt.pages, [{ url: gone, status: 404 }]);
	assert.equal(receipt.deploy_after.url, `${O}/`);
	assert.equal(receipt.deploy_after.matched, true);
	assert.equal(readLines(dir).at(-1).attempt, receipt.attempt);
});

test("E: robots none/NOINDEX in meta or header, any case", async () => {
	for (const route of [
		html(pageHtml(A, TARGET, { robots: "NONE" })),
		html(pageHtml(A, TARGET, { robots: "NoIndex" })),
		html(pageHtml(A, TARGET), 200, { "x-robots-tag": "googlebot: none" }),
		html(pageHtml(A, TARGET), 200, { "x-robots-tag": "NOINDEX" }),
	]) {
		const site = makeSite();
		site.routes.set(A, route);
		assert.equal((await m.run("send", opts(site, { stateDir: freshState() }))).exit, EXIT.precondition);
		assert.equal(site.posts.length, 0);
	}
});

test("run() re-validates, de-duplicates and orders a selection it did not parse", async () => {
	const dir = freshState();
	const site = makeSite();
	assert.equal((await m.run("send", opts(site, { stateDir: dir, selection: { updated: [B, A, B], removed: [] } }))).exit, EXIT.ok);
	assert.deepEqual(site.posts[0].urlList, [A, B].sort());
	assert.equal((await m.run("send", opts(site, { stateDir: dir, selection: { updated: [A, B], removed: [] } }))).exit, EXIT.precondition);
	await rejects(m.run("send", opts(site, { stateDir: dir, selection: { updated: [`https://www.junghanacs.com/`], removed: [] } })), EXIT.usage);
	await rejects(m.run("send", opts(site, { stateDir: dir, selection: { updated: [A], removed: [A] } })), EXIT.usage);
	assert.equal(site.posts.length, 1);
});

// ---------------------------------------------------------------------------------------------------
// Coordinator review fixes: cooldown clock, recoverable intent, attribute order

test("cooldown counts from when the endpoint answered, not from when checks began", async () => {
	const t = (hm) => `2026-11-04T${hm}:00.000Z`;
	const intent = { schema: 1, mode: "send", phase: "intent", attempt: "x", namespace: "rehearsal", host: m.HOST, at: t("12:15"), target: TARGET, updated: [A], removed: [], urls_sha256: "0".repeat(64), request_sha256: "1".repeat(64) };
	const result = { ...intent, phase: "result", at: t("12:00"), sent_at: t("12:15"), received_at: t("12:15"), outcome: "unknown" };
	assert.equal(m.cooldownUntil([intent, result]), Date.parse(t("12:25")));
	/* Integration: a slow pre-check (20 min) followed by an unknown answer must still cool down. */
	const dir = freshState();
	const site = makeSite();
	site.post = () => ({ status: 500 });
	const slowGate = async () => {
		clock += 20 * 60 * 1000;
		return { exit: 0, summary: "slow gate" };
	};
	const start = clock;
	const r = await m.run("send", opts(site, { stateDir: dir, verifyDeployed: slowGate }));
	assert.equal(r.exit, EXIT.unknown);
	assert.equal(r.receipt.at, new Date(start).toISOString());
	assert.equal(r.receipt.received_at, new Date(start + 20 * 60 * 1000).toISOString());
	clock = start + 25 * 60 * 1000;
	assert.equal((await m.run("send", opts(site, { stateDir: dir }))).exit, EXIT.cooldown);
	assert.equal(site.posts.length, 1);
	clock = start + 31 * 60 * 1000;
});

test("the intent carries the exact selection and request hash; status reports it without unselected URLs", async () => {
	const dir = freshState();
	const site = makeSite();
	site.post = () => ({ status: 202 });
	await m.run("send", opts(site, { stateDir: dir, selection: sel(A) }));
	const [intent, result] = readLines(dir);
	const posted = crypto.createHash("sha256").update(site.rawPosts[0]).digest("hex");
	assert.deepEqual([intent.updated, intent.removed, intent.request_sha256], [[A], [], posted]);
	assert.equal(result.request_sha256, posted);
	assert.ok(!JSON.stringify([intent, result]).includes(KEY));
	/* A crash after the POST leaves only the intent: status still names the exact set. */
	const crashed = freshState();
	fs.writeFileSync(receiptsFile(crashed), JSON.stringify(intent) + "\n", { mode: 0o600 });
	const unresolved = m.statusReport(m.readReceipts(m.statePaths(crashed, "rehearsal")));
	assert.deepEqual(unresolved.unresolved.map((u) => [u.target, u.updated, u.removed, u.request_sha256]), [[TARGET, [A], [], posted]]);
	const pending = m.statusReport(m.readReceipts(m.statePaths(dir, "rehearsal")));
	assert.deepEqual(pending.maybe_received.map((u) => [u.outcome, u.updated]), [["received-pending", [A]]]);
	assert.equal(pending.accepted, 0);
	assert.ok(!JSON.stringify(pending).includes(B), "an unselected URL is never reported");
	/* A result that disagrees with its intent stops the reader. */
	const forged = freshState();
	fs.writeFileSync(receiptsFile(forged), [intent, { ...result, updated: [A, B] }].map((r) => JSON.stringify(r)).join("\n") + "\n", { mode: 0o600 });
	assert.throws(() => m.attempts(m.readReceipts(m.statePaths(forged, "rehearsal"))), (e) => e.exit === EXIT.precondition);
	const bare = freshState();
	fs.writeFileSync(receiptsFile(bare), JSON.stringify({ ...intent, updated: undefined }) + "\n", { mode: 0o600 });
	assert.throws(() => m.readReceipts(m.statePaths(bare, "rehearsal")), (e) => e.exit === EXIT.precondition);
});

test("robots, canonical and refresh are read in any attribute order, case and quoting", () => {
	const doc = (head) => `<!doctype html><html><head>${head}</head><body><main id=content></main></body></html>`;
	const canon = `<link rel=canonical href=${A}>`;
	assert.deepEqual(m.pageProblems(doc(`${canon}<meta name=robots content="index, follow">`), A), []);
	assert.deepEqual(m.pageProblems(doc(`<link href="${A}" rel="canonical">`), A), []);
	assert.deepEqual(m.pageProblems(doc(`<LINK REL='Canonical' HREF='${A}'>`), A), []);
	const refusedHeads = [
		`${canon}<meta content="noindex" name="robots">`,
		`${canon}<META NAME=ROBOTS CONTENT=NOINDEX>`,
		`${canon}<meta name='robots' content='none'>`,
		`${canon}<meta name=googlebot content="noindex">`,
		`${canon}<meta name="robots" content="&#110;oindex">`,
		`${canon}<meta content="0; url=${B}" http-equiv="Refresh">`,
		`${canon}<link href="${A}" rel="canonical">`,
		`${canon}<link rel="alternate canonical" href="${B}">`,
		`<link href=${B} rel=canonical>`,
		``,
	];
	for (const head of refusedHeads) assert.notDeepEqual(m.pageProblems(doc(head), A), [], head);
	/* A robots meta outside <head> still refuses (fail closed). */
	assert.notDeepEqual(m.pageProblems(`<html><head>${canon}</head><body><meta name=robots content=noindex></body></html>`, A), []);
});

// ---------------------------------------------------------------------------------------------------
// Durability of the local record (fs faults injected into this process; production state untouched)

const faultyWrites = (t, plan) => {
	const real = fs.writeSync;
	let call = 0;
	t.mock.method(fs, "writeSync", function (fd, buffer, offset, length) {
		const step = plan[call++] ?? "ok";
		if (step === "ok") return real.call(fs, fd, buffer, offset, length);
		if (step === "half") return real.call(fs, fd, buffer, offset, Math.max(1, Math.floor(length / 2)));
		if (step === "zero") return 0;
		throw Object.assign(new Error("ENOSPC: no space left on device, write"), { code: "ENOSPC" });
	});
};

test("a short or failed intent write sends nothing, and the partial line is refused later", async (t) => {
	for (const plan of [["ok", "half", "enospc"], ["ok", "zero"], ["ok", "enospc"]]) {
		const dir = freshState();
		const site = makeSite();
		faultyWrites(t, plan);
		const { exit, receipt } = await m.run("send", opts(site, { stateDir: dir }));
		t.mock.restoreAll();
		assert.equal(exit, EXIT.localRecordFailed, plan.join());
		assert.equal(receipt.outcome, "intent-not-recorded");
		assert.equal(site.posts.length, 0);
		assert.equal(fs.existsSync(path.join(dir, `${m.HOST}.rehearsal.lock`)), false);
		if (plan[1] === "half") assert.throws(() => m.readReceipts(m.statePaths(dir, "rehearsal")), (e) => e.exit === EXIT.precondition);
	}
	assert.equal(fs.existsSync(PRODUCTION_DIR), false);
});

test("ENOSPC on the result after a 200: accepted, not recorded, non-zero exit", async (t) => {
	const dir = freshState();
	const site = makeSite();
	faultyWrites(t, ["ok", "ok", "enospc"]);
	const { exit, receipt } = await m.run("send", opts(site, { stateDir: dir }));
	t.mock.restoreAll();
	assert.equal(receipt.outcome, "accepted");
	assert.equal(exit, EXIT.localRecordFailed);
	assert.match(receipt.record_error, /ENOSPC/);
	assert.equal(site.posts.length, 1);
	assert.equal(m.statusReport(m.readReceipts(m.statePaths(dir, "rehearsal"))).unresolved.length, 1, "the next run sees an unresolved attempt");
});

test("a lock whose metadata cannot be written is a named failure and is retained", async (t) => {
	const dir = freshState();
	const site = makeSite();
	faultyWrites(t, ["enospc"]);
	const { exit, receipt } = await m.run("send", opts(site, { stateDir: dir }));
	t.mock.restoreAll();
	assert.equal(exit, EXIT.localRecordFailed);
	assert.equal(receipt.outcome, "lock-write-failed");
	assert.ok(fs.existsSync(path.join(dir, `${m.HOST}.rehearsal.lock`)));
	assert.equal(fs.existsSync(receiptsFile(dir)), false);
	assert.equal(site.posts.length, 0);
});

test("creating the receipts file also fsyncs its directory", async (t) => {
	const dir = freshState();
	const site = makeSite();
	const real = fs.openSync;
	const opened = [];
	t.mock.method(fs, "openSync", function (file, flags, mode) {
		opened.push([String(file), flags]);
		return real.call(fs, file, flags, mode);
	});
	await m.run("send", opts(site, { stateDir: dir, selection: sel(A) }));
	const first = opened.filter(([f, fl]) => f === dir && fl === "r").length;
	await m.run("send", opts(site, { stateDir: dir, selection: sel(B) }));
	t.mock.restoreAll();
	assert.equal(first, 1);
	assert.equal(opened.filter(([f, fl]) => f === dir && fl === "r").length, 1, "an existing file does not reopen the directory");
});
