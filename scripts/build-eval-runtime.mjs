#!/usr/bin/env node
/**
 * Materialize the machine-readable Eval runtime receipts.
 * Document HTML is owned by Hugo and is never generated here.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const specPath = resolve(root, "data/eval/runtime.json");
const manifestPath = resolve(root, "static/eval/runtime/manifest.json");
const sbomPath = resolve(root, "static/eval/runtime/sbom.json");
const mode = process.argv[2] || "write";

if (!new Set(["write", "--check"]).has(mode)) {
	throw new Error("usage: node scripts/build-eval-runtime.mjs [write|--check]");
}

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const fileName = (asset) => asset.file.split("/").at(-1);
const publicPath = (asset) => asset.file.replace(/^static/, "");
const spec = JSON.parse(await readFile(specPath, "utf8"));
const runtime = spec.runtime;

for (const asset of [runtime.scittle, runtime.emmy]) {
	const bytes = await readFile(resolve(root, asset.file));
	const digest = sha256(bytes);
	if (digest !== asset.sha256) throw new Error(`runtime hash mismatch: ${asset.file}`);
	if (!fileName(asset).includes(asset.sha256)) throw new Error(`runtime filename is not full-hash pinned: ${asset.file}`);
}

const manifest = `${JSON.stringify({
	format: 1,
	package: runtime.package,
	npmIntegrity: runtime.npmIntegrity,
	kitchenGitHead: runtime.kitchenGitHead,
	kitchenPluginTemplates: runtime.kitchenPluginTemplates,
	sbom: "/eval/runtime/sbom.json",
	files: [
		{ path: fileName(runtime.scittle), publicPath: publicPath(runtime.scittle), origin: runtime.scittle.origin, sha256: runtime.scittle.sha256, license: "EPL-1.0", source: "https://github.com/babashka/scittle/tree/v0.8.33" },
		{ path: fileName(runtime.emmy), publicPath: publicPath(runtime.emmy), origin: runtime.emmy.origin, sha256: runtime.emmy.sha256, license: "GPL-3.0-only", source: "https://github.com/mentat-collective/emmy/tree/v0.32.0" },
	],
}, null, 2)}\n`;

const sbom = `${JSON.stringify({
	format: 1,
	package: runtime.package,
	npmIntegrity: runtime.npmIntegrity,
	kitchenGitHead: runtime.kitchenGitHead,
	kitchenPluginTemplates: runtime.kitchenPluginTemplates,
	runtimeFiles: [runtime.scittle, runtime.emmy],
	components: runtime.components,
}, null, 2)}\n`;

const outputs = [[manifestPath, manifest], [sbomPath, sbom]];
if (mode === "--check") {
	const stale = [];
	for (const [path, expected] of outputs) {
		let actual = "";
		try { actual = await readFile(path, "utf8"); } catch {}
		if (actual !== expected) stale.push(path.replace(`${root}/`, ""));
	}
	if (stale.length) {
		console.error(`Eval runtime receipts are missing or stale: ${stale.join(", ")}`);
		console.error("run: node scripts/build-eval-runtime.mjs");
		process.exit(1);
	}
	console.log("Eval runtime receipts are current");
} else {
	for (const [path, body] of outputs) {
		await mkdir(dirname(path), { recursive: true });
		await writeFile(path, body);
	}
	console.log("wrote Eval runtime manifest and SBOM");
}
