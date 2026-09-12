#!/usr/bin/env node
/** Materialize one immutable Eval engine release from its source and contract SSOT. */
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] || "write";
if (!new Set(["write", "--check"]).has(mode)) throw new Error("usage: node scripts/build-eval-engine.mjs [write|--check]");
const read = (path) => readFile(resolve(root, path));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const spec = JSON.parse((await read("data/eval/engine.json")).toString("utf8"));
const runtime = JSON.parse((await read("data/eval/runtime.json")).toString("utf8")).runtime;
const releaseRelative = `static${spec.basePath}`.replace(/\/$/, "");
const releaseDirectory = resolve(root, releaseRelative);

const payloads = [];
for (const module of spec.modules) {
	const bytes = await read(module.source);
	if (sha256(bytes) !== module.sha256 || !module.artifact.includes(module.sha256)) throw new Error(`${module.id} source hash or artifact name drifted`);
	payloads.push([module.artifact, bytes]);
}
const fixture = await read(spec.conformance.source);
if (sha256(fixture) !== spec.conformance.sha256 || !spec.conformance.artifact.includes(spec.conformance.sha256)) throw new Error("conformance source hash or artifact name drifted");
payloads.push([spec.conformance.artifact, fixture]);

const manifestObject = {
	format: spec.format,
	release: spec.release,
	basePath: spec.basePath,
	license: spec.license,
	licenseUrl: spec.licenseUrl,
	security: spec.security,
	runtime: {
		manifest: spec.runtimeManifest,
		package: runtime.package,
		npmIntegrity: runtime.npmIntegrity,
		files: [
			{ path: runtime.scittle.file.replace(/^static/, ""), sha256: runtime.scittle.sha256 },
			{ path: runtime.emmy.file.replace(/^static/, ""), sha256: runtime.emmy.sha256 },
		],
	},
	modules: spec.modules.map((module) => ({
		id: module.id,
		path: `${spec.basePath}${module.artifact}`,
		sha256: module.sha256,
		global: module.global,
		status: module.status,
		...(module.semantics ? { semantics: module.semantics } : {}),
		...(module.modes ? { modes: module.modes } : {}),
		correspondingSource: `${spec.basePath}${module.artifact}`,
	})),
	conformance: {
		path: `${spec.basePath}${spec.conformance.artifact}`,
		sha256: spec.conformance.sha256,
	},
};
const manifest = Buffer.from(`${JSON.stringify(manifestObject, null, 2)}\n`);
const sums = Buffer.from(`${payloads.map(([name, bytes]) => `${sha256(bytes)}  ${name}`).join("\n")}\n`);
const outputs = [...payloads, ["manifest.json", manifest], ["SHA256SUMS", sums]];
const expectedNames = new Set(outputs.map(([name]) => name));

const stale = [];
for (const [name, expected] of outputs) {
	const path = resolve(releaseDirectory, name);
	let actual = null;
	try { actual = await readFile(path); } catch {}
	if (!actual?.equals(expected)) stale.push(name);
}
let unexpected = [];
try { unexpected = (await readdir(releaseDirectory)).filter((name) => !expectedNames.has(name)); } catch {}

if (mode === "--check") {
	if (stale.length || unexpected.length) {
		console.error(`Eval engine release drift: stale=[${stale.join(", ")}] unexpected=[${unexpected.join(", ")}]`);
		process.exit(1);
	}
	console.log(`Eval engine ${spec.release}: immutable artifacts match source hashes`);
} else {
	await mkdir(releaseDirectory, { recursive: true });
	for (const [name, expected] of outputs) {
		const path = resolve(releaseDirectory, name);
		let actual = null;
		try { actual = await readFile(path); } catch {}
		if (actual && !actual.equals(expected)) throw new Error(`refusing to overwrite immutable release artifact: ${releaseRelative}/${name}`);
		if (!actual) await writeFile(path, expected);
	}
	if (unexpected.length) throw new Error(`unexpected files in immutable release: ${unexpected.join(", ")}`);
	console.log(`wrote Eval engine ${spec.release} immutable release`);
}
