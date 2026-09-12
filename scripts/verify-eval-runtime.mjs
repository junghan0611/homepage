#!/usr/bin/env node
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const fail = (message) => { console.error(`eval verification failed: ${message}`); process.exit(1); };
const exists = async (path) => { try { await access(resolve(root, path)); return true; } catch { return false; } };

const generated = spawnSync(process.execPath, ["scripts/build-eval-runtime.mjs", "--check"], { cwd: root, encoding: "utf8" });
if (generated.status !== 0) {
	process.stderr.write(generated.stderr || generated.stdout);
	fail("generated runtime receipts are missing or stale");
}
const engineGenerated = spawnSync(process.execPath, ["scripts/build-eval-engine.mjs", "--check"], { cwd: root, encoding: "utf8" });
if (engineGenerated.status !== 0) {
	process.stderr.write(engineGenerated.stderr || engineGenerated.stdout);
	fail("immutable Eval engine release is missing or stale");
}
const engineFeed = spawnSync(process.execPath, ["scripts/verify-eval-engine-feed.mjs"], { cwd: root, encoding: "utf8" });
if (engineFeed.status !== 0) {
	process.stderr.write(engineFeed.stderr || engineFeed.stdout);
	fail("Eval engine discovery feed rehearsal failed");
}
const claimConformance = spawnSync(process.execPath, ["scripts/verify-eval-claim-v1.mjs"], { cwd: root, encoding: "utf8" });
if (claimConformance.status !== 0) {
	process.stderr.write(claimConformance.stderr || claimConformance.stdout);
	fail("claim-v1 conformance failed");
}
const sicmTranslation = spawnSync("python3", ["scripts/build-sicm-translation.py", "--check"], { cwd: root, encoding: "utf8" });
if (sicmTranslation.status !== 0) {
	process.stderr.write(sicmTranslation.stderr || sicmTranslation.stdout);
	fail("segmented SICM translation is missing, structurally changed, or stale");
}
const sicmGenerated = spawnSync("python3", ["scripts/build-sicm-reading.py", "--check"], { cwd: root, encoding: "utf8" });
if (sicmGenerated.status !== 0) {
	process.stderr.write(sicmGenerated.stderr || sicmGenerated.stdout);
	fail("generated SICM reading pages are missing or stale");
}
const sicmViewer = spawnSync(process.execPath, ["scripts/verify-eval-sicm-viewer.mjs"], { cwd: root, encoding: "utf8" });
if (sicmViewer.status !== 0) {
	process.stderr.write(sicmViewer.stderr || sicmViewer.stdout);
	fail("SICM SVG viewer protocol failed");
}

const spec = JSON.parse(await read("data/eval/runtime.json"));
const engineSpec = JSON.parse(await read("data/eval/engine.json"));
const cells = JSON.parse(await read("data/eval/cells.json"));
const rails = JSON.parse(await read("data/eval/rails.json"));
const sicm = JSON.parse(await read("data/eval/sicm.json"));
const productionReceipt = JSON.parse(await read("dev/eval/receipts/20260912T143700-production-gate.json"));
const engineBrowserReceipt = JSON.parse(await read("dev/eval/engine/receipts/20260912T140550-claim-v1-chromium.json"));
const sicmBrowserReceipt = JSON.parse(await read("dev/eval/sicm/receipts/20260912T133900-figure-1-1-chromium.json"));
const sicmTranslationManifest = JSON.parse(await read("dev/eval/sicm/translation/manifest.json"));
const cellsLicense = JSON.parse(await read("data/eval/cells_license.json"));
const runtime = spec.runtime;
const manifest = JSON.parse(await read("static/eval/runtime/manifest.json"));
const sbom = JSON.parse(await read("static/eval/runtime/sbom.json"));

if (manifest.package !== runtime.package || manifest.npmIntegrity !== runtime.npmIntegrity || manifest.kitchenGitHead !== runtime.kitchenGitHead) fail("runtime manifest does not match data/eval/runtime.json");
if (sbom.package !== runtime.package || sbom.npmIntegrity !== runtime.npmIntegrity || sbom.kitchenGitHead !== runtime.kitchenGitHead || JSON.stringify(sbom.components) !== JSON.stringify(runtime.components)) fail("runtime SBOM does not match data/eval/runtime.json");

const requiredComponents = ["scittle-kitchen", "scittle", "SCI", "ClojureScript runtime", "Closure Library", "Emmy", "fraction.js", "odex", "Reagent"];
if (sbom.components.length !== requiredComponents.length || requiredComponents.some((name) => !sbom.components.some((component) => component.name === name))) fail("runtime SBOM component inventory is incomplete");

for (const asset of [runtime.scittle, runtime.emmy]) {
	const bytes = await readFile(resolve(root, asset.file));
	if (sha256(bytes) !== asset.sha256) fail(`runtime hash mismatch: ${asset.file}`);
	if (!asset.file.includes(asset.sha256)) fail(`runtime filename is not full-hash pinned: ${asset.file}`);
}
const expectedRuntimeFiles = new Set([runtime.scittle.file.split("/").at(-1), runtime.emmy.file.split("/").at(-1)]);
for (const name of await readdir(resolve(root, "static/eval/runtime"))) {
	if (name.endsWith(".js") && !expectedRuntimeFiles.has(name)) fail(`obsolete or unpinned runtime file remains: static/eval/runtime/${name}`);
}
const engineReleaseDir = `static${engineSpec.basePath}`.replace(/\/$/, "");
const engineReleaseFiles = [`${engineReleaseDir}/manifest.json`, `${engineReleaseDir}/SHA256SUMS`, ...engineSpec.modules.map((module) => `${engineReleaseDir}/${module.artifact}`), `${engineReleaseDir}/${engineSpec.conformance.artifact}`];

const requiredFiles = [
	"content/eval/_index.md", "content/eval/proto.md", "content/eval/sicm/_index.md", "content/eval/sicm/_index.ko.md", "content/eval/sicm/preface.org", "content/eval/sicm/preface.ko.org", "content/eval/sicm/chapter-1.org", "content/eval/sicm/chapter-1.ko.org", "content/eval/clay.md", "content/eval/engine.md", "content/eval/engine.ko.md", "content/eval/canary.md", "content/javascript.md",
	"data/eval/runtime.json", "data/eval/engine.json", "data/eval/cells.json", "data/eval/cells_license.json", "data/eval/rails.json", "data/eval/sicm.json",
	"layouts/eval/list.html", "layouts/eval/single.html", "layouts/eval/license.html",
	"layouts/shortcodes/eval-cell.html", "layouts/shortcodes/eval-rails.html", "layouts/shortcodes/eval-attribution.html", "layouts/shortcodes/eval-engine-release.html", "layouts/shortcodes/sicm-math.html",
	"layouts/_partials/eval/page.html", "layouts/_partials/eval/scripts.html", "layouts/_partials/eval/cell.html", "assets/js/eval-claim-v1.js", "assets/js/eval-engine-conformance.js", "layouts/_partials/eval/engine-conformance.html", "layouts/_partials/eval/sicm-source.html", "layouts/_partials/eval/sicm-viewer.html",
	"layouts/_partials/components/analytics/analytics.html", "assets/css/eval.css", "assets/js/eval.js", "assets/js/eval-sicm.js",
	"dev/eval/clay/deps.edn", "dev/eval/clay/notebooks/preface.clj", "dev/eval/clay/render.clj",
	"scripts/build-eval-runtime.mjs", "scripts/build-eval-engine.mjs", "scripts/eval-engine-feed.mjs", "scripts/verify-eval-engine-feed.mjs", "scripts/verify-eval-claim-v1.mjs", "scripts/build-sicm-reading.py", "scripts/build-sicm-translation.py", "scripts/verify-eval-sicm-viewer.mjs", "scripts/verify-eval-runtime.mjs", "scripts/verify-eval-output.mjs",
	"static/eval/engine/releases.json",
	"dev/eval/receipts/20260912T143700-production-gate.json", "dev/eval/receipts/20260912T143722-production-claim-v1.png", "dev/eval/receipts/20260912T143639-production-sicm-figure-1-1-ko.png",
	"dev/eval/engine/conformance-v1.json", "dev/eval/engine/receipts/20260912T140550-claim-v1-chromium.json", "dev/eval/engine/receipts/20260912T140550-claim-v1-chromium.png", "docs/eval-engine-contract.md",
	...engineReleaseFiles,
	"dev/eval/sicm/translation/manifest.json", "dev/eval/sicm/translation/REVIEW.md", "dev/eval/sicm/receipts/20260912T133900-figure-1-1-chromium.json", "dev/eval/sicm/receipts/20260912T133900-figure-1-1-chromium.png", "dev/eval/sicm/translation/chapter001/ch1-00-04.ko.org", "dev/eval/sicm/translation/chapter001/ch1-05.ko.org", "dev/eval/sicm/translation/chapter001/ch1-06.ko.org", "dev/eval/sicm/translation/chapter001/ch1-07-09.ko.org", "dev/eval/sicm/translation/chapter001/ch1-10-12.ko.org",
	"static/eval/source/sicm/LICENSE", "static/eval/source/sicm/en/preface.org", "static/eval/source/sicm/en/chapter001.org", "static/eval/source/sicm/ko/preface.ko.org", "static/eval/source/sicm/ko/chapter001.ko.org",
	"static/eval/licenses/GPL-3.0.txt", "static/eval/licenses/EPL-1.0.txt", "static/eval/licenses/Apache-2.0.txt", "static/eval/licenses/MIT-fraction.js.txt", "static/eval/licenses/BSD-2-Clause-odex.txt",
];
for (const path of requiredFiles) if (!(await exists(path))) fail(`required source or notice missing: ${path}`);
const productionEngineScreenshot = await readFile(resolve(root, productionReceipt.engine.screenshot));
const productionSicmScreenshot = await readFile(resolve(root, productionReceipt.sicmFigure11.screenshot));
if (sha256(productionEngineScreenshot) !== productionReceipt.engine.screenshotSha256 || sha256(productionSicmScreenshot) !== productionReceipt.sicmFigure11.screenshotSha256 || productionReceipt.scope !== "production browser and response-header observation" || productionReceipt.productionGate !== "pass" || productionReceipt.engine.routes["/eval/engine/"]?.state !== "pass" || productionReceipt.engine.routes["/ko/eval/engine/"]?.state !== "pass" || productionReceipt.sicmFigure11.routes["/eval/sicm/chapter-1/"]?.state !== "pass" || productionReceipt.sicmFigure11.routes["/ko/eval/sicm/chapter-1/"]?.state !== "pass" || productionReceipt.sicmFigure11.svgPathCommands < 80 || !productionReceipt.sicmFigure11.cellOutput.includes("book-bound=true") || productionReceipt.engine.cases.some((test) => test.pass !== test.expectedPass)) fail("Eval production browser gate receipt is incomplete");
if (sicm.computedViews["figure-1-1"].productionBrowserReceipt !== "dev/eval/receipts/20260912T143700-production-gate.json" || engineSpec.productionBrowserReceipt !== "dev/eval/receipts/20260912T143700-production-gate.json") fail("Eval production receipt is not wired into its source records");
const engineScreenshot = await readFile(resolve(root, engineBrowserReceipt.artifacts.screenshot));
if (sha256(engineScreenshot) !== engineBrowserReceipt.artifacts.screenshotSha256 || engineBrowserReceipt.candidateCommit !== "c66e35c8cff8f8fdf794501f1bb557a4524644ff" || engineBrowserReceipt.routes["/eval/engine/"]?.state !== "pass" || engineBrowserReceipt.routes["/ko/eval/engine/"]?.state !== "pass" || engineBrowserReceipt.observations.externalScriptElements !== 0 || engineBrowserReceipt.observations.cases.some((test) => test.pass !== test.expectedPass)) fail("claim-v1 candidate browser receipt is incomplete or changed");
const sicmScreenshot = await readFile(resolve(root, sicmBrowserReceipt.artifacts.screenshot));
if (sha256(sicmScreenshot) !== sicmBrowserReceipt.artifacts.screenshotSha256) fail("SICM browser screenshot hash mismatch");
if (sicmBrowserReceipt.scope !== "local candidate browser observation; not a production receipt" || sicmBrowserReceipt.observations.cellState !== "pass" || sicmBrowserReceipt.observations.svgPathCommands < 80 || sicmBrowserReceipt.observations.externalScriptElements !== 0 || !sicmBrowserReceipt.observations.cellOutput.includes("book-bound=true")) fail("SICM browser receipt is incomplete or overclaims its scope");
if (sicmTranslationManifest.reviewReceipt !== "dev/eval/sicm/translation/REVIEW.md" || sha256(await readFile(resolve(root, sicmTranslationManifest.reviewReceipt))) !== sicmTranslationManifest.reviewReceiptSha256 || sicmTranslationManifest.segments.some((segment) => !segment.reviewedBy || !segment.reviewResult || !segment.reviewedAt)) fail("SICM independent translation review receipt is incomplete");

for (const obsolete of [
	"static/eval/index.html", "static/eval/proto", "static/eval/sicm", "static/eval/clay", "static/eval/canary",
	"static/eval/eval.css", "static/eval/eval.js", "static/javascript.html", "dev/eval-stack",
]) if (await exists(obsolete)) fail(`obsolete HTML-first surface remains: ${obsolete}`);

const requiredCells = ["hub-canary", "proto-arithmetic", "proto-definition", "proto-shared-state", "proto-error-state", "proto-emmy", "sicm-harmonic", "sicm-figure-1-1", "clay-emmy", "runtime-canary"];
if (Object.keys(cells).length !== requiredCells.length || requiredCells.some((id) => !cells[id]?.source || !cells[id]?.label)) fail("Eval cell inventory is incomplete");
if (rails.length !== 5 || ["proto", "sicm", "clay", "engine", "canary"].some((id) => !rails.some((rail) => rail.id === id && rail.route === `/eval/${id}/`))) fail("Eval rail inventory is incomplete");
if (cellsLicense.spdx !== "GPL-3.0-only" || cellsLicense.sourcePath !== "data/eval/cells.json" || cellsLicense.correspondingSourceUrl !== "/eval/source/cells.json" || cellsLicense.declarationUrl !== "/eval/source/cells-license.json" || cellsLicense.licenseUrl !== "/eval/licenses/GPL-3.0.txt") fail("Eval cell corresponding-source declaration is incomplete");
const sicmAttribution = rails.find((rail) => rail.id === "sicm")?.attribution;
for (const field of ["work", "edition", "authors", "publisher", "copyright", "license", "licenseUrl", "canonicalOriginalUrl", "exactSourceUrl", "orgSourceUrl", "sourceChain", "adaptation", "noEndorsement"]) if (!sicmAttribution?.[field] || (Array.isArray(sicmAttribution[field]) && !sicmAttribution[field].length)) fail(`SICM attribution field missing: ${field}`);
if (sicmAttribution.licenseUrl !== "https://creativecommons.org/licenses/by-nc-sa/3.0/" || sicmAttribution.orgSourceUrl !== `https://github.com/${sicm.orgSource.repository}/tree/${sicm.orgSource.commit}`) fail("SICM license or exact source-chain URL drifted");
if (sicm.orgSource.commit !== "4088864745715d8afa923162155e63795d43a375" || sicm.images.commit !== "6cac77666976d7656ba6adb4571995d086943af7") fail("SICM source revisions are not pinned");
for (const [name, expected] of Object.entries(sicm.orgSource.files)) {
	const path = name === "LICENSE" ? `static/eval/source/sicm/${name}` : `static/eval/source/sicm/en/${name}`;
	if (sha256(await readFile(resolve(root, path))) !== expected) fail(`SICM source hash mismatch: ${path}`);
}
for (const [name, expected] of Object.entries(sicm.translation.files)) {
	const path = `static/eval/source/sicm/ko/${name}`;
	if (sha256(await readFile(resolve(root, path))) !== expected) fail(`SICM translation hash mismatch: ${path}`);
}
for (const [name, expected] of Object.entries(sicm.images.files)) {
	const path = `static/eval/source/sicm/images/${name}`;
	if (sha256(await readFile(resolve(root, path))) !== expected) fail(`SICM image hash mismatch: ${path}`);
}

const contentPaths = ["content/eval/_index.md", "content/eval/proto.md", "content/eval/engine.md", "content/eval/engine.ko.md", "content/eval/sicm/_index.md", "content/eval/sicm/_index.ko.md", "content/eval/sicm/preface.org", "content/eval/sicm/preface.ko.org", "content/eval/sicm/chapter-1.org", "content/eval/sicm/chapter-1.ko.org", "content/eval/clay.md", "content/eval/canary.md"];
const referencedCells = new Set();
for (const path of [...contentPaths, "content/javascript.md", "layouts/_partials/eval/sicm-viewer.html"]) {
	const source = await read(path);
	if (!path.startsWith("layouts/")) for (const marker of ["type: eval", "noindex: true", "comments: false", "toc: false"]) if (!source.includes(marker)) fail(`${path} is missing Eval publication front matter: ${marker}`);
	for (const match of source.matchAll(/eval-cell id="([^"]+)"/g)) referencedCells.add(match[1]);
	for (const match of source.matchAll(/"ID" "([^"]+)"/g)) referencedCells.add(match[1]);
}
if (requiredCells.some((id) => !referencedCells.has(id)) || [...referencedCells].some((id) => !cells[id])) fail("content cell references and data/eval/cells.json disagree");
if (!(await read("content/eval/sicm/_index.md")).includes('{{< eval-attribution rail="sicm" >}}')) fail("SICM page does not render the structured attribution record");
const sourceReceipt = await read("layouts/_partials/eval/page.html");
const licenseSurface = await read("layouts/eval/license.html");
for (const surface of [sourceReceipt, licenseSurface]) if (!surface.includes("cellSource") || !surface.includes("evalSource")) fail("Eval corresponding-source links are missing from a public surface");

const headers = await read("static/_headers");
for (const asset of [runtime.scittle, runtime.emmy]) {
	const publicPath = asset.file.replace(/^static/, "");
	if (!headers.includes(`${publicPath}\n  Cache-Control: public, max-age=31536000, immutable`)) fail(`immutable runtime header missing: ${publicPath}`);
	if (headers.indexOf("/eval/*") > headers.indexOf(publicPath)) fail(`generic Eval cache rule must precede immutable runtime override: ${publicPath}`);
}
if (!headers.includes("/eval/*\n  Cache-Control: public, max-age=0\n  Content-Security-Policy:")) fail("Eval HTML revalidation/CSP header rule is missing");
if (!headers.includes("/eval/engine/releases/*\n  Cache-Control: public, max-age=31536000, immutable\n  Access-Control-Allow-Origin: *")) fail("immutable cross-origin engine release header is missing");
if (!headers.includes("/eval/engine/releases.json\n  Cache-Control: public, max-age=0\n  Access-Control-Allow-Origin: *\n  X-Content-Type-Options: nosniff")) fail("mutable engine discovery feed header is missing");
if (headers.indexOf("/eval/*") > headers.indexOf("/eval/engine/releases/*")) fail("generic Eval cache rule must precede immutable engine override");
if (headers.indexOf("/eval/*") > headers.indexOf("/eval/engine/releases.json")) fail("generic Eval cache rule must precede the discovery feed override");
const evalHeaderBlock = headers.slice(headers.indexOf("/eval/*"), headers.indexOf("/javascript/*"));
if (evalHeaderBlock.includes("script-src 'self' 'unsafe-inline'")) fail("Eval CSP permits unnecessary inline scripts");
if (!headers.includes("/javascript/*") || !headers.slice(headers.indexOf("/javascript/*")).includes("Content-Security-Policy:")) fail("JavaScript license CSP header rule is missing");

for (const [path, notice] of [
	["static/eval/licenses/GPL-3.0.txt", "GNU GENERAL PUBLIC LICENSE"],
	["static/eval/licenses/EPL-1.0.txt", "Eclipse Public License - v 1.0"],
	["static/eval/licenses/Apache-2.0.txt", "Apache License"],
	["static/eval/licenses/MIT-fraction.js.txt", "Copyright (c) 2017 Robert Eisele"],
	["static/eval/licenses/BSD-2-Clause-odex.txt", "Copyright (c) 2016, Colin Smith"],
]) if (!(await read(path)).includes(notice)) fail(`invalid license notice: ${path}`);

const authoredPaths = [...contentPaths, "content/javascript.md", "docs/eval-engine-contract.md", "data/eval/engine.json", "dev/eval/engine/conformance-v1.json", "data/eval/cells.json", "data/eval/cells_license.json", "data/eval/rails.json", "data/eval/sicm.json", "assets/js/eval.js", "assets/js/eval-claim-v1.js", "assets/js/eval-engine-conformance.js", "assets/js/eval-sicm.js", "assets/css/eval.css", "layouts/_partials/eval/scripts.html", "layouts/_partials/eval/engine-conformance.html", "layouts/_partials/eval/sicm-source.html", "layouts/_partials/eval/sicm-viewer.html", "layouts/shortcodes/sicm-math.html", "dev/eval/clay/notebooks/preface.clj", "dev/eval/clay/render.clj"];
for (const path of authoredPaths) {
	const source = await read(path);
	for (const forbidden of ["cdn.jsdelivr.net", "unpkg.com", "daslu.github.io", "/home/", "~/", "dev/eval-stack/"]) {
		if (source.includes(forbidden)) fail(`${path} contains forbidden publication dependency or private path: ${forbidden}`);
	}
}
for (const path of ["assets/js/eval.js", "assets/js/eval-claim-v1.js", "assets/js/eval-engine-conformance.js", "assets/js/eval-sicm.js"]) if (!(await read(path)).includes("SPDX-License-Identifier: GPL-3.0-only")) fail(`Eval JavaScript license marker is missing: ${path}`);
if (!(await read("layouts/_partials/components/analytics/analytics.html")).includes('(ne .Type "eval")')) fail("Eval analytics suppression is missing");

console.log("eval verified: Hugo sources, cells, runtime hashes, SBOM, licenses, CSP, and publication boundaries are current");
