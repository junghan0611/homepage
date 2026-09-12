#!/usr/bin/env node
/** Rehearse a second release without writing a fake tree under static/. */
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertAppendOnly, assertFeedOrder, buildFeed, compareReleaseIds, parseReleaseId, serializeFeed, sha256 } from "./eval-engine-feed.mjs";

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

const ordered = (left, right) => {
	if (compareReleaseIds(left, right) >= 0) fail(`numeric/suffix sort puts ${left} after or equal to ${right}`);
};

const root = await mkdtemp(join(tmpdir(), "eval-engine-feed-"));
try {
	ordered("2026.9.2", "2026.9.12");
	ordered("2026.9.12", "2026.9.12-fix.1");
	ordered("2026.9.12-fix.2", "2026.9.12-fix.10");
	ordered("2026.9.12-docs.1", "2026.9.12-fix.1");
	if (parseReleaseId("2026.9.12").day !== 12 || parseReleaseId("2026.9.12").suffixed) fail("YYYY.M.D parser rejected the bare id grammar");
	if (parseReleaseId("2026.9.12-fix.1").n !== 1 || parseReleaseId("2026.9.12-fix.1").label !== "fix") fail("suffix parser rejected YYYY.M.D[-<label>.<n>]");
	for (const name of ["latest", "2026.09.12a", "9.12.2026", "2026.9.12-", "2026.9.12-fix", "2026.9.12-FIX.1", "2026.9.12-fix.0"]) {
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
	const follow = await writeRelease(root, "2026.9.12-fix.1", [
		["cell-v1", "cell-follow"],
		["claim-v1", "claim-follow"],
		["conformance-v1", "{\"cases\":[2]}"],
	]);
	const feed = await buildFeed(root);
	const serialized = serializeFeed(feed);
	if (serializeFeed(await buildFeed(root)).compare(serialized) !== 0) fail("feed serialization is not deterministic");
	if (feed.format !== 1 || feed.latest !== "2026.9.12-fix.1") fail(`latest drifted: ${feed.latest}`);
	if (!feed.note.includes("discovery only") || !feed.note.includes("latest is not a compatibility promise")) fail("feed note dropped the discovery/compatibility boundary");
	if (feed.releases.map((entry) => entry.release).join(",") !== "2026.9.2,2026.9.12,2026.9.12-fix.1") fail(`release order drifted: ${feed.releases.map((entry) => entry.release).join(",")}`);
	if (feed.releases[0].manifestSha256 !== early.manifestSha256 || feed.releases[1].manifestSha256 !== current.manifestSha256 || feed.releases[2].manifestSha256 !== follow.manifestSha256) fail("manifestSha256 does not match written manifest bytes");
	if (feed.releases[1].modules[0].sha256 !== current.modules[0].sha256) fail("module sha256 in the feed does not match artifact bytes");
	await writeRelease(root, "2026.9.12-docs.2", [
		["cell-v1", "cell-docs"],
		["claim-v1", "claim-docs"],
		["conformance-v1", "{\"cases\":[3]}"],
	]);
	const withDocs = await buildFeed(root);
	if (withDocs.latest !== "2026.9.12-docs.2") fail(`day-serial follow-up did not become latest: ${withDocs.latest}`);
	if (withDocs.releases.map((entry) => entry.release).join(",") !== "2026.9.2,2026.9.12,2026.9.12-fix.1,2026.9.12-docs.2") fail(`day-serial order drifted: ${withDocs.releases.map((entry) => entry.release).join(",")}`);
	assertFeedOrder(feed);
	assertFeedOrder(withDocs);
	try {
		const reversed = { ...feed, releases: [...feed.releases].reverse(), latest: feed.releases[0].release };
		assertFeedOrder(reversed);
		fail("reversed releases[] was accepted");
	} catch (error) {
		if (!String(error.message).includes("publication order")) fail(`reversed order failed with the wrong error: ${error.message}`);
	}
	try {
		const wrongLatest = { ...feed, latest: feed.releases[0].release };
		assertFeedOrder(wrongLatest);
		fail("latest that is not the last releases[] entry was accepted");
	} catch (error) {
		if (!String(error.message).includes("last releases[]")) fail(`wrong latest failed with the wrong error: ${error.message}`);
	}
	assertAppendOnly(feed, feed);
	assertAppendOnly(feed, withDocs);
	try {
		const mutated = JSON.parse(JSON.stringify(withDocs));
		mutated.releases[1].manifestSha256 = "0".repeat(64);
		assertAppendOnly(feed, mutated);
		fail("mutated historical manifestSha256 was accepted");
	} catch (error) {
		if (!String(error.message).includes("mutated")) fail(`historical mutation failed with the wrong error: ${error.message}`);
	}
	try {
		const dropped = { ...withDocs, releases: withDocs.releases.filter((entry) => entry.release !== "2026.9.12") };
		assertAppendOnly(feed, dropped);
		fail("deleted historical release was accepted");
	} catch (error) {
		if (!String(error.message).includes("removed")) fail(`historical deletion failed with the wrong error: ${error.message}`);
	}
	try {
		const reordered = { ...feed, releases: [feed.releases[1], feed.releases[0], ...feed.releases.slice(2)] };
		assertAppendOnly(feed, reordered);
		fail("reordered historical releases were accepted");
	} catch (error) {
		if (!String(error.message).includes("prefix")) fail(`historical reorder failed with the wrong error: ${error.message}`);
	}
	try {
		const previous = { ...feed, releases: feed.releases.slice(1) };
		const backdated = { ...feed, releases: [feed.releases[0], ...previous.releases] };
		assertAppendOnly(previous, backdated);
		fail("past-date middle insertion was accepted");
	} catch (error) {
		if (!String(error.message).includes("prefix")) fail(`past-date insertion failed with the wrong error: ${error.message}`);
	}
	const expectFeedFailure = async (ids, needle, label) => {
		const bad = await mkdtemp(join(tmpdir(), "eval-engine-feed-bad-"));
		try {
			for (const id of ids) await writeRelease(bad, id, [["cell-v1", id], ["claim-v1", id], ["conformance-v1", "{}"]]);
			try {
				await buildFeed(bad);
				fail(`${label} was accepted`);
			} catch (error) {
				if (!String(error.message).includes(needle)) fail(`${label} failed with the wrong error: ${error.message}`);
			}
		} finally {
			await rm(bad, { recursive: true, force: true });
		}
	};
	await expectFeedFailure(["2026.9.12", "2026.9.12-fix.1", "2026.9.12-docs.1"], "consecutive n", "duplicate n");
	await expectFeedFailure(["2026.9.12", "2026.9.12-fix.1", "2026.9.12-docs.3"], "consecutive n", "gapped n");
	await expectFeedFailure(["2026.9.12-fix.1"], "bare release", "suffix without bare");
	for (const name of ["2026.2.30", "2025.2.29"]) {
		try {
			parseReleaseId(name);
			fail(`accepted non-Gregorian id ${name}`);
		} catch (error) {
			if (!String(error.message).includes("Gregorian")) fail(`non-Gregorian id ${name} failed with the wrong error: ${error.message}`);
		}
	}
	const expectMutationFailure = async (label, needle, mutate) => {
		const bad = await mkdtemp(join(tmpdir(), "eval-engine-feed-mut-"));
		try {
			await mutate(bad);
			try {
				await buildFeed(bad);
				fail(`${label} was accepted`);
			} catch (error) {
				if (!String(error.message).includes(needle)) fail(`${label} failed with the wrong error: ${error.message}`);
			}
		} finally {
			await rm(bad, { recursive: true, force: true });
		}
	};
	await expectMutationFailure("rogue file", "directory entries", async (bad) => {
		await writeRelease(bad, "2026.9.12", [["cell-v1", "cell"], ["claim-v1", "claim"], ["conformance-v1", "{}"]]);
		await writeFile(join(bad, "2026.9.12", "rogue.txt"), "no");
	});
	await expectMutationFailure("path escape", "leaf filename", async (bad) => {
		const id = "2026.9.12";
		const dir = join(bad, id);
		await mkdir(dir);
		const conf = Buffer.from("{}");
		await writeFile(join(dir, "conformance-v1.json"), conf);
		const escaped = "../outside.js";
		const fake = sha256(Buffer.from("escaped"));
		const manifest = Buffer.from(`${JSON.stringify({
			format: 1,
			release: id,
			basePath: `/eval/engine/releases/${id}/`,
			modules: [{ id: "cell-v1", path: `/eval/engine/releases/${id}/${escaped}`, sha256: fake }],
			conformance: { path: `/eval/engine/releases/${id}/conformance-v1.json`, sha256: sha256(conf) },
		}, null, 2)}\n`);
		await writeFile(join(dir, "manifest.json"), manifest);
		await writeFile(join(dir, "SHA256SUMS"), Buffer.from(`${fake}  ${escaped}\n${sha256(conf)}  conformance-v1.json\n`));
	});
	await expectMutationFailure("duplicate SHA256SUMS name", "repeats", async (bad) => {
		const written = await writeRelease(bad, "2026.9.12", [["cell-v1", "cell"], ["claim-v1", "claim"], ["conformance-v1", "{}"]]);
		const dir = join(bad, "2026.9.12");
		const first = written.modules[0];
		await writeFile(join(dir, "SHA256SUMS"), Buffer.from(`${first.sha256}  cell-v1.${first.sha256}.js\n${first.sha256}  cell-v1.${first.sha256}.js\n`));
	});
	await mkdir(join(root, "2026.9.12-fix"));
	try {
		await buildFeed(root);
		fail("malformed release directory was skipped instead of failing");
	} catch (error) {
		if (!String(error.message).includes("YYYY.M.D")) fail(`malformed directory failed with the wrong error: ${error.message}`);
	}
	console.log("eval engine feed rehearsal passed: suffix grammar, day-serial n, and malformed id failure");
} finally {
	await rm(root, { recursive: true, force: true });
}
