#!/usr/bin/env node
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fail = (message) => { console.error(`Eval Hugo output verification failed: ${message}`); process.exit(1); };
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const engineSpec = JSON.parse(await readFile(resolve(root, "data/eval/engine.json"), "utf8"));
const currentReleasePublic = `public${engineSpec.basePath}`.replace(/\/$/, "");
const currentReleaseFiles = [
	`${currentReleasePublic}/manifest.json`,
	`${currentReleasePublic}/SHA256SUMS`,
	...engineSpec.modules.map((module) => `${currentReleasePublic}/${module.artifact}`),
	`${currentReleasePublic}/${engineSpec.conformance.artifact}`,
];
const required = [
	"public/_headers",
	"public/eval/index.html", "public/eval/proto/index.html", "public/eval/sicm/index.html", "public/eval/sicm/preface/index.html", "public/eval/sicm/chapter-1/index.html", "public/ko/eval/sicm/index.html", "public/ko/eval/sicm/preface/index.html", "public/ko/eval/sicm/chapter-1/index.html", "public/eval/clay/index.html", "public/eval/engine/index.html", "public/ko/eval/engine/index.html", "public/eval/canary/index.html",
	"public/eval/runtime/manifest.json", "public/eval/runtime/sbom.json",
	...currentReleaseFiles,
	"public/eval/source/sicm/LICENSE", "public/eval/source/sicm/en/preface.org", "public/eval/source/sicm/en/chapter001.org", "public/eval/source/sicm/ko/preface.ko.org", "public/eval/source/sicm/ko/chapter001.ko.org", "public/eval/source/sicm/images/Art_P19.jpg",
	"public/eval/runtime/scittle.d16f6ed9b4f83be00e3ddebd848db1a8e397a3f9389e0ba3402c62f5193439e6.js",
	"public/eval/runtime/scittle.emmy.427b3b750a79853fe0ee90b3036a40894f514995e3f4301776b593f8f449447c.js",
	"public/eval/source/cells.json", "public/eval/source/cells-license.json", "public/eval/source/eval.js", "public/eval/source/eval-sicm.js", "public/eval/source/eval-engine-conformance.js",
	"public/javascript/index.html",
];
for (const path of required) {
	try { await access(resolve(root, path)); } catch { fail(`missing ${path}`); }
}
for (const [source, published] of [
	["data/eval/cells.json", "public/eval/source/cells.json"],
	["data/eval/cells_license.json", "public/eval/source/cells-license.json"],
	["assets/js/eval.js", "public/eval/source/eval.js"],
	["assets/js/eval-sicm.js", "public/eval/source/eval-sicm.js"],
	["assets/js/eval-engine-conformance.js", "public/eval/source/eval-engine-conformance.js"],
	...engineSpec.modules.map((module) => [module.source, `${currentReleasePublic}/${module.artifact}`]),
	[engineSpec.conformance.source, `${currentReleasePublic}/${engineSpec.conformance.artifact}`],
	["static/eval/source/sicm/LICENSE", "public/eval/source/sicm/LICENSE"],
	["static/eval/source/sicm/en/preface.org", "public/eval/source/sicm/en/preface.org"],
	["static/eval/source/sicm/en/chapter001.org", "public/eval/source/sicm/en/chapter001.org"],
	["static/eval/source/sicm/ko/preface.ko.org", "public/eval/source/sicm/ko/preface.ko.org"],
	["static/eval/source/sicm/ko/chapter001.ko.org", "public/eval/source/sicm/ko/chapter001.ko.org"],
]) if ((await readFile(resolve(root, source))).compare(await readFile(resolve(root, published))) !== 0) fail(`${published} differs from ${source}`);

const frozenCellStatus = "frozen compatibility module";
const claimV1Modes = JSON.stringify(["scalar-exact", "field", "fragment"]);
const parseSums = (text, releaseId) => {
	const sums = new Map();
	for (const line of text.replace(/\n$/, "").split("\n")) {
		const match = /^(?<hash>[0-9a-f]{64})  (?<name>.+)$/.exec(line);
		if (!match) fail(`${releaseId} SHA256SUMS has a malformed line: ${line}`);
		sums.set(match.groups.name, match.groups.hash);
	}
	return sums;
};
const verifyPublishedRelease = async (releaseId) => {
	const dir = resolve(root, "public/eval/engine/releases", releaseId);
	const manifestBytes = await readFile(resolve(dir, "manifest.json"));
	const manifest = JSON.parse(manifestBytes.toString("utf8"));
	const manifestSha256 = sha256(manifestBytes);
	if (manifest.release !== releaseId) fail(`release directory ${releaseId} does not match manifest.release ${manifest.release}`);
	if (manifest.basePath !== `/eval/engine/releases/${releaseId}/`) fail(`release ${releaseId} basePath drifted`);
	const expectedSums = new Map();
	for (const module of manifest.modules || []) {
		if (!module.path?.startsWith(manifest.basePath)) fail(`release ${releaseId} module ${module.id} path is outside basePath`);
		const name = module.path.slice(manifest.basePath.length);
		const bytes = await readFile(resolve(dir, name));
		if (sha256(bytes) !== module.sha256) fail(`release ${releaseId} module ${module.id} sha256 mismatch`);
		expectedSums.set(name, module.sha256);
		if (module.id === "cell-v1" && module.status !== frozenCellStatus) fail(`release ${releaseId} cell-v1 is not a frozen compatibility module`);
		if (module.id === "claim-v1" && JSON.stringify(module.modes) !== claimV1Modes) fail(`release ${releaseId} claim-v1 modes drifted`);
	}
	const conformance = manifest.conformance;
	if (!conformance?.path?.startsWith(manifest.basePath)) fail(`release ${releaseId} conformance path is outside basePath`);
	const conformanceName = conformance.path.slice(manifest.basePath.length);
	const conformanceBytes = await readFile(resolve(dir, conformanceName));
	if (sha256(conformanceBytes) !== conformance.sha256) fail(`release ${releaseId} conformance sha256 mismatch`);
	expectedSums.set(conformanceName, conformance.sha256);
	const sums = parseSums(await readFile(resolve(dir, "SHA256SUMS"), "utf8"), releaseId);
	if (sums.size !== expectedSums.size) fail(`release ${releaseId} SHA256SUMS entry count drifted`);
	for (const [name, hash] of expectedSums) {
		if (sums.get(name) !== hash) fail(`release ${releaseId} SHA256SUMS mismatch for ${name}`);
		if (sha256(await readFile(resolve(dir, name))) !== hash) fail(`release ${releaseId} ${name} bytes do not match SHA256SUMS`);
	}
	return { manifest, manifestSha256 };
};
const staticReleaseRoot = resolve(root, "static/eval/engine/releases");
const publicReleaseRoot = resolve(root, "public/eval/engine/releases");
const releaseIdsFrom = async (dir) => {
	const ids = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		if (!entry.isDirectory()) fail(`unexpected non-directory in ${dir}: ${entry.name}`);
		ids.push(entry.name);
	}
	return ids.sort();
};
const staticReleaseIds = await releaseIdsFrom(staticReleaseRoot);
const publicReleaseIds = await releaseIdsFrom(publicReleaseRoot);
if (staticReleaseIds.join("\0") !== publicReleaseIds.join("\0")) fail(`published engine releases ${publicReleaseIds.join(", ")} do not match static ledger ${staticReleaseIds.join(", ")}`);
if (!publicReleaseIds.includes(engineSpec.release)) fail(`current spec release ${engineSpec.release} is missing from published releases`);
const publishedReleases = [];
for (const releaseId of publicReleaseIds) publishedReleases.push(await verifyPublishedRelease(releaseId));
for (const path of ["content/eval/engine.md", "content/eval/engine.ko.md"]) {
	if ((await readFile(resolve(root, path), "utf8")).includes(engineSpec.release)) fail(`${path} still hardcodes release ${engineSpec.release}`);
}

const attribute = (tag, name) => {
	const match = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`));
	return match?.[1] ?? match?.[2] ?? match?.[3];
};
const isPreview = ["deploy-preview", "branch-deploy"].includes(process.env.CONTEXT);
const expectedOrigin = new URL(isPreview && process.env.DEPLOY_PRIME_URL || "https://junghanacs.com").origin;
const outputPages = new Map([
	["public/eval/index.html", "/eval/"], ["public/eval/proto/index.html", "/eval/proto/"],
	["public/eval/sicm/index.html", "/eval/sicm/"], ["public/eval/sicm/preface/index.html", "/eval/sicm/preface/"],
	["public/eval/sicm/chapter-1/index.html", "/eval/sicm/chapter-1/"], ["public/ko/eval/sicm/index.html", "/ko/eval/sicm/"],
	["public/ko/eval/sicm/preface/index.html", "/ko/eval/sicm/preface/"], ["public/ko/eval/sicm/chapter-1/index.html", "/ko/eval/sicm/chapter-1/"],
	["public/eval/clay/index.html", "/eval/clay/"],
	["public/eval/engine/index.html", "/eval/engine/"], ["public/ko/eval/engine/index.html", "/ko/eval/engine/"],
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
	const tags = html.match(/<[A-Za-z][^>]*>/g) || [];
	const ids = new Set(tags.map((tag) => attribute(tag, "id")).filter(Boolean));
	for (const tag of tags) {
		for (const name of ["href", "src"]) {
			const raw = attribute(tag, name);
			if (!raw || /^(?:data:|mailto:|tel:|javascript:)/i.test(raw)) continue;
			const url = new URL(raw, expectedOrigin);
			if (url.origin === expectedOrigin) {
				if (!raw.startsWith("/") && !raw.startsWith(expectedOrigin) && !raw.startsWith("#")) fail(`${file} has a non-root internal ${name}: ${raw}`);
				const pathname = decodeURIComponent(url.pathname);
				if (name === "href" && pathname === route && url.hash && !ids.has(decodeURIComponent(url.hash.slice(1)))) fail(`${file} links to missing same-page fragment ${url.hash}`);
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
for (const path of ["content/eval/_index.md", "content/eval/proto.md", "content/eval/sicm/_index.md", "content/eval/sicm/_index.ko.md", "content/eval/sicm/preface.org", "content/eval/sicm/preface.ko.org", "content/eval/sicm/chapter-1.org", "content/eval/sicm/chapter-1.ko.org", "content/eval/clay.md", "content/eval/engine.md", "content/eval/engine.ko.md", "content/eval/canary.md", "content/javascript.md", "data/eval/rails.json", "data/eval/runtime.json", "data/eval/engine.json", "data/eval/sicm.json", "layouts/_partials/eval/page.html", "layouts/eval/license.html"]) {
	if (/https?:\/\/[^"'\s>]*netlify\.app|deploy-preview/i.test(await readFile(resolve(root, path), "utf8"))) fail(`${path} hardcodes a Netlify preview URL`);
}

const currentPublished = publishedReleases.find((entry) => entry.manifest.release === engineSpec.release);
if (!currentPublished || currentPublished.manifest.basePath !== engineSpec.basePath) fail("current spec release is missing from published manifests");
const claimPath = currentPublished.manifest.modules?.find((module) => module.id === "claim-v1")?.path;
if (!claimPath) fail("current spec is missing claim-v1");
const license = await readFile(resolve(root, "public/javascript/index.html"), "utf8");
for (const needle of ["jslicense-labels1", "/eval/source/cells.json", "/eval/source/cells-license.json", "/eval/source/eval.js", "/eval/source/eval-sicm.js", "/eval/source/eval-engine-conformance.js", claimPath, "/eval/runtime/sbom.json"]) if (!license.includes(needle)) fail(`/javascript/ missing ${needle}`);
const home = await readFile(resolve(root, "public/index.html"), "utf8");
const homeKo = await readFile(resolve(root, "public/ko/index.html"), "utf8");
if (home.includes("Under construction") || homeKo.includes("공사중")) fail("root construction marker remains after the production Eval gate");
for (const [route, html, needles] of [["/", home, ["The executable shelf is open", "/eval/engine/", "/eval/sicm/"]], ["/ko/", homeKo, ["실행되는 선반", "/ko/eval/engine/", "/ko/eval/sicm/"]]]) for (const needle of needles) if (!html.includes(needle)) fail(`${route} missing current Eval promise ${needle}`);
for (const route of ["public/eval/engine/index.html", "public/ko/eval/engine/index.html"]) {
	const html = await readFile(resolve(root, route), "utf8");
	for (const needle of ["scalar-exact", "structured", "fragment", "claim-v1", "cell-v1", "unobserved", "data-engine-conformance", "eval-engine-conformance.min."]) if (!html.toLowerCase().includes(needle)) fail(`${route} missing ${needle}`);
}
const sicm = await readFile(resolve(root, "public/eval/sicm/index.html"), "utf8");
for (const needle of ["sicm_edition_2.zip", "tgvaughan.github.io/sicm/", "mentat-collective/sicm-book/tree/4088864", "No endorsement"]) if (!sicm.includes(needle)) fail(`/eval/sicm/ missing ${needle}`);
const sicmChapter = await readFile(resolve(root, "public/eval/sicm/chapter-1/index.html"), "utf8");
const sicmChapterKo = await readFile(resolve(root, "public/ko/eval/sicm/chapter-1/index.html"), "utf8");
for (const [route, html] of [["/eval/sicm/chapter-1/", sicmChapter], ["/ko/eval/sicm/chapter-1/", sicmChapterKo]]) {
	for (const needle of ["computed-figure-1-1", "sicm-figure-1-1", "Art_P19.jpg", "eval-sicm.min."]) if (!html.includes(needle)) fail(`${route} missing ${needle}`);
	if ((html.match(/<math(?:\s|>)/g) || []).length < 500) fail(`${route} must contain the complete build-time MathML layer`);
	if (html.includes("$")) fail(`${route} contains an unrendered dollar-math delimiter`);
	for (const marker of ["f또는", "co또는", "transf또는", "만일ied", "또는igin"]) if (html.includes(marker)) fail(`${route} contains retired translation corruption marker ${marker}`);
}
for (const route of ["public/eval/sicm/preface/index.html", "public/ko/eval/sicm/preface/index.html"]) {
	const html = await readFile(resolve(root, route), "utf8");
	if ((html.match(/<math(?:\s|>)/g) || []).length < 4 || html.includes("$")) fail(`${route} is missing its complete build-time MathML layer`);
}
for (const [file, route] of outputPages) {
	if (!route.startsWith("/eval/") && !route.startsWith("/ko/eval/")) continue;
	const html = await readFile(resolve(root, file), "utf8");
	if (html.includes("analytics.junghanacs.com") || /<script[^>]+src=["']?https?:\/\//i.test(html)) fail(`${route} loads an external script or analytics`);
}
console.log(`Eval Hugo output verified: ${localURLCount} local URLs, ${ownGitHubBlobCount} GitHub blob/main targets present in this candidate, ${externalURLs.size} external attribution/source URLs, and no fixed Netlify preview URL`);
