#!/usr/bin/env node
/** Rehearse a second release without writing a fake tree under static/. */
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildFeed, compareReleaseIds, parseReleaseId, serializeFeed, sha256 } from "./eval-engine-feed.mjs";

const fail = (message) => { console.error(`Eval engine feed rehearsal failed: ${message}`); process.exit(1); };

const writeRelease = async (root, id, payloads) => {
	const dir = join(root, id);
	await mkdir(dir);
	const files = [];
	const modules = [];
	let conformance = null;
	for (const [role, contents] of payloads) {
		const bytes = Buffer.from(contents);
		const digest = sha256(bytes);
		const name = `${role}.${digest}.${role === "conformance-v1" ? "json" : "js"}`;
		await writeFile(join(dir, name), bytes);
		files.push([name, digest]);
		if (role === "conformance-v1") conformance = { path: `/eval/engine/releases/${id}/${name}`, sha256: digest };
		else modules.push({ id: role, path: `/eval/engine/releases/${id}/${name}`, sha256: digest });
	}
	const manifestObject = {
		format: 1,
		release: id,
		basePath: `/eval/engine/releases/${id}/`,
		modules,
		conformance,
	};
	const manifest = Buffer.from(`${JSON.stringify(manifestObject, null, 2)}\n`);
	await writeFile(join(dir, "manifest.json"), manifest);
	await writeFile(join(dir, "SHA256SUMS"), Buffer.from(`${files.map(([name, digest]) => `${digest}  ${name}`).join("\n")}\n`));
	return { manifestSha256: sha256(manifest), modules: modules.map((module) => ({ id: module.id, sha256: module.sha256 })) };
};

const root = await mkdtemp(join(tmpdir(), "eval-engine-feed-"));
try {
	if (compareReleaseIds("2026.9.2", "2026.9.12") >= 0) fail("numeric component sort puts 2026.9.2 after 2026.9.12");
	if (parseReleaseId("2026.9.12").day !== 12) fail("YYYY.M.D parser rejected the current id grammar");
	for (const name of ["2026.9.12-fix.1", "latest", "2026.09.12a", "9.12.2026"]) {
		try {
			parseReleaseId(name);
			fail(`accepted malformed release id ${name}`);
		} catch (error) {
			if (!String(error.message).includes("YYYY.M.D")) fail(`malformed id ${name} failed with the wrong error: ${error.message}`);
		}
	}
	const early = await writeRelease(root, "2026.9.2", [
		["cell-v1", "cell-early"],
		["claim-v1", "claim-early"],
		["conformance-v1", "{\"cases\":[]}"],
	]);
	const current = await writeRelease(root, "2026.9.12", [
		["cell-v1", "cell-current"],
		["claim-v1", "claim-current"],
		["conformance-v1", "{\"cases\":[1]}"],
	]);
	const feed = await buildFeed(root);
	const serialized = serializeFeed(feed);
	if (serializeFeed(await buildFeed(root)).compare(serialized) !== 0) fail("feed serialization is not deterministic");
	if (feed.format !== 1 || feed.latest !== "2026.9.12") fail(`latest drifted: ${feed.latest}`);
	if (!feed.note.includes("discovery only") || !feed.note.includes("latest is not a compatibility promise")) fail("feed note dropped the discovery/compatibility boundary");
	if (feed.releases.map((entry) => entry.release).join(",") !== "2026.9.2,2026.9.12") fail(`release order drifted: ${feed.releases.map((entry) => entry.release).join(",")}`);
	if (feed.releases[0].manifestSha256 !== early.manifestSha256 || feed.releases[1].manifestSha256 !== current.manifestSha256) fail("manifestSha256 does not match written manifest bytes");
	if (feed.releases[1].modules[0].sha256 !== current.modules[0].sha256) fail("module sha256 in the feed does not match artifact bytes");
	await mkdir(join(root, "2026.9.12-fix.1"));
	try {
		await buildFeed(root);
		fail("malformed release directory was skipped instead of failing");
	} catch (error) {
		if (!String(error.message).includes("YYYY.M.D")) fail(`malformed directory failed with the wrong error: ${error.message}`);
	}
	console.log("eval engine feed rehearsal passed: numeric sort, manifest hashes, and malformed YYYY.M.D failure");
} finally {
	await rm(root, { recursive: true, force: true });
}
