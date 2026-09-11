#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fail = (message) => { console.error(`Eval Hugo output verification failed: ${message}`); process.exit(1); };
const required = [
	"public/_headers",
	"public/eval/index.html", "public/eval/proto/index.html", "public/eval/sicm/index.html", "public/eval/clay/index.html", "public/eval/canary/index.html",
	"public/eval/runtime/manifest.json", "public/eval/runtime/sbom.json",
	"public/eval/runtime/scittle.d16f6ed9b4f83be00e3ddebd848db1a8e397a3f9389e0ba3402c62f5193439e6.js",
	"public/eval/runtime/scittle.emmy.427b3b750a79853fe0ee90b3036a40894f514995e3f4301776b593f8f449447c.js",
	"public/eval/source/cells.json", "public/eval/source/cells-license.json", "public/eval/source/eval.js",
	"public/javascript/index.html",
];
for (const path of required) {
	try { await access(resolve(root, path)); } catch { fail(`missing ${path}`); }
}
for (const [source, published] of [
	["data/eval/cells.json", "public/eval/source/cells.json"],
	["data/eval/cells_license.json", "public/eval/source/cells-license.json"],
	["assets/js/eval.js", "public/eval/source/eval.js"],
]) if ((await readFile(resolve(root, source))).compare(await readFile(resolve(root, published))) !== 0) fail(`${published} differs from ${source}`);

const attribute = (tag, name) => {
	const match = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`));
	return match?.[1] ?? match?.[2] ?? match?.[3];
};
const isPreview = ["deploy-preview", "branch-deploy"].includes(process.env.CONTEXT);
const expectedOrigin = new URL(isPreview && process.env.DEPLOY_PRIME_URL || "https://junghanacs.com").origin;
const outputPages = new Map([
	["public/eval/index.html", "/eval/"], ["public/eval/proto/index.html", "/eval/proto/"],
	["public/eval/sicm/index.html", "/eval/sicm/"], ["public/eval/clay/index.html", "/eval/clay/"],
	["public/eval/canary/index.html", "/eval/canary/"], ["public/javascript/index.html", "/javascript/"],
]);
let localURLCount = 0;
let ownGitHubBlobCount = 0;
const externalURLs = new Set();
for (const [file, route] of outputPages) {
	const html = await readFile(resolve(root, file), "utf8");
	if (/https?:\/\/[^"'\s>]*netlify\.app|deploy-preview/i.test(html)) fail(`${file} contains a fixed Netlify preview URL`);
	const canonicalTag = (html.match(/<link\b[^>]*>/g) || []).find((tag) => attribute(tag, "rel") === "canonical");
	const canonical = canonicalTag && attribute(canonicalTag, "href");
	if (!canonical || canonical !== `${expectedOrigin}${route}`) fail(`${file} canonical is not ${expectedOrigin}${route}`);
	for (const tag of html.match(/<[A-Za-z][^>]*>/g) || []) {
		for (const name of ["href", "src"]) {
			const raw = attribute(tag, name);
			if (!raw || raw.startsWith("#") || /^(?:data:|mailto:|tel:|javascript:)/i.test(raw)) continue;
			const url = new URL(raw, expectedOrigin);
			if (url.origin === expectedOrigin) {
				if (!raw.startsWith("/") && !raw.startsWith(expectedOrigin)) fail(`${file} has a non-root internal ${name}: ${raw}`);
				const pathname = decodeURIComponent(url.pathname);
				const candidates = pathname.endsWith("/")
					? [resolve(root, "public", `.${pathname}`, "index.html")]
					: [resolve(root, "public", `.${pathname}`), resolve(root, "public", `.${pathname}`, "index.html")];
				if (!(await Promise.all(candidates.map(async (path) => { try { await access(path); return true; } catch { return false; } }))).some(Boolean)) fail(`${file} links to missing local output ${pathname}`);
				localURLCount += 1;
			} else {
				externalURLs.add(url.href);
				const ownBlob = "https://github.com/junghan0611/homepage/blob/main/";
				if (url.href.startsWith(ownBlob)) {
					const candidatePath = decodeURIComponent(url.href.slice(ownBlob.length));
					try { await access(resolve(root, candidatePath)); } catch { fail(`${file} GitHub blob/main target is absent from this main candidate: ${candidatePath}`); }
					ownGitHubBlobCount += 1;
				}
			}
		}
	}
}
for (const path of ["content/eval/_index.md", "content/eval/proto.md", "content/eval/sicm.md", "content/eval/clay.md", "content/eval/canary.md", "content/javascript.md", "data/eval/rails.json", "data/eval/runtime.json", "layouts/_partials/eval/page.html", "layouts/eval/license.html"]) {
	if (/https?:\/\/[^"'\s>]*netlify\.app|deploy-preview/i.test(await readFile(resolve(root, path), "utf8"))) fail(`${path} hardcodes a Netlify preview URL`);
}

const license = await readFile(resolve(root, "public/javascript/index.html"), "utf8");
for (const needle of ["jslicense-labels1", "/eval/source/cells.json", "/eval/source/cells-license.json", "/eval/source/eval.js", "/eval/runtime/sbom.json"]) if (!license.includes(needle)) fail(`/javascript/ missing ${needle}`);
const sicm = await readFile(resolve(root, "public/eval/sicm/index.html"), "utf8");
for (const needle of ["sicm_edition_2.zip", "sicm/preface.html", "mentat-collective/sicm-book", "No endorsement"]) if (!sicm.includes(needle)) fail(`/eval/sicm/ missing ${needle}`);
for (const page of ["index", "proto/index", "sicm/index", "clay/index", "canary/index"]) {
	const html = await readFile(resolve(root, `public/eval/${page}.html`), "utf8");
	if (html.includes("analytics.junghanacs.com") || /<script[^>]+src=["']?https?:\/\//i.test(html)) fail(`/eval/${page}.html loads an external script or analytics`);
}
console.log(`Eval Hugo output verified: ${localURLCount} local URLs, ${ownGitHubBlobCount} GitHub blob/main targets present in this candidate, ${externalURLs.size} external attribution/source URLs, and no fixed Netlify preview URL`);
