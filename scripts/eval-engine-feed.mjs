/** Discovery feed for immutable Eval engine releases. Mutable projection of the release directory ledger. */
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

export const FEED_FORMAT = 1;
export const FEED_NOTE = "discovery only; adopt an exact release and verify its artifact hashes. latest is not a compatibility promise.";
export const FEED_RELATIVE = "static/eval/engine/releases.json";
export const RELEASES_RELATIVE = "static/eval/engine/releases";
const RELEASE_ID = /^(\d{4})\.([1-9]|1[0-2])\.([1-9]|[12]\d|3[01])(?:-([a-z][a-z0-9-]*)\.([1-9][0-9]*))?$/;
const LEAF = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const isGregorianDate = (year, month, day) => {
	const utc = new Date(Date.UTC(year, month - 1, day));
	return utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day;
};

export const parseReleaseId = (name) => {
	const match = RELEASE_ID.exec(name);
	if (!match) throw new Error(`engine release directory ${name} is not YYYY.M.D[-<label>.<n>]`);
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	if (!isGregorianDate(year, month, day)) throw new Error(`engine release directory ${name} is not a Gregorian date`);
	return {
		id: name,
		year,
		month,
		day,
		label: match[4] ?? "",
		n: match[4] ? Number(match[5]) : 0,
		suffixed: Boolean(match[4]),
	};
};

export const compareReleaseIds = (left, right) => {
	const a = typeof left === "string" ? parseReleaseId(left) : left;
	const b = typeof right === "string" ? parseReleaseId(right) : right;
	const label = a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
	return a.year - b.year || a.month - b.month || a.day - b.day || Number(a.suffixed) - Number(b.suffixed) || a.n - b.n || label;
};

export const assertDayFollowUpSequence = (ids) => {
	const byDay = new Map();
	for (const id of ids) {
		const item = typeof id === "string" ? parseReleaseId(id) : id;
		if (!item.suffixed) continue;
		const day = `${item.year}.${item.month}.${item.day}`;
		const list = byDay.get(day) || [];
		list.push(item.n);
		byDay.set(day, list);
	}
	for (const [day, numbers] of byDay) {
		numbers.sort((left, right) => left - right);
		for (let i = 0; i < numbers.length; i++) {
			if (numbers[i] !== i + 1) throw new Error(`engine release follow-ups on ${day} must use consecutive n starting at 1; got ${numbers.join(",")}`);
		}
	}
};

export const assertBareForFollowUps = (ids) => {
	const set = new Set(ids);
	for (const id of ids) {
		const item = parseReleaseId(id);
		if (!item.suffixed) continue;
		const bare = `${item.year}.${item.month}.${item.day}`;
		if (!set.has(bare)) throw new Error(`follow-up ${id} has no bare release ${bare}`);
	}
};

export const leafName = (basePath, path, releaseId, what) => {
	if (typeof path !== "string" || !path.startsWith(basePath)) throw new Error(`release ${releaseId} ${what} path is outside basePath`);
	const name = path.slice(basePath.length);
	if (!name || name.includes("/") || name.includes("\\") || name.includes("..") || !LEAF.test(name)) {
		throw new Error(`release ${releaseId} ${what} path is not a single leaf filename`);
	}
	return name;
};

const parseSums = (text, releaseId) => {
	const sums = new Map();
	for (const line of text.replace(/\n$/, "").split("\n")) {
		const match = /^(?<hash>[0-9a-f]{64})  (?<name>.+)$/.exec(line);
		if (!match) throw new Error(`${releaseId} SHA256SUMS has a malformed line: ${line}`);
		if (sums.has(match.groups.name)) throw new Error(`${releaseId} SHA256SUMS repeats ${match.groups.name}`);
		sums.set(match.groups.name, match.groups.hash);
	}
	return sums;
};

export const listReleaseIds = async (releasesRoot) => {
	const ids = [];
	for (const entry of await readdir(releasesRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) throw new Error(`unexpected non-directory in engine releases: ${entry.name}`);
		parseReleaseId(entry.name);
		ids.push(entry.name);
	}
	ids.sort(compareReleaseIds);
	assertDayFollowUpSequence(ids);
	assertBareForFollowUps(ids);
	return ids;
};

export const inspectRelease = async (releasesRoot, releaseId) => {
	parseReleaseId(releaseId);
	const dir = resolve(releasesRoot, releaseId);
	const manifestBytes = await readFile(resolve(dir, "manifest.json"));
	const record = JSON.parse(manifestBytes.toString("utf8"));
	if (record.release !== releaseId) throw new Error(`release directory ${releaseId} does not match manifest.release ${record.release}`);
	if (record.basePath !== `/eval/engine/releases/${releaseId}/`) throw new Error(`release ${releaseId} basePath drifted`);
	const expectedSums = new Map();
	const modules = [];
	const moduleIds = new Set();
	for (const module of record.modules || []) {
		if (!module.id) throw new Error(`release ${releaseId} has a module without id`);
		if (moduleIds.has(module.id)) throw new Error(`release ${releaseId} repeats module id ${module.id}`);
		moduleIds.add(module.id);
		const name = leafName(record.basePath, module.path, releaseId, `module ${module.id}`);
		if (expectedSums.has(name)) throw new Error(`release ${releaseId} repeats artifact ${name}`);
		const bytes = await readFile(resolve(dir, name));
		if (sha256(bytes) !== module.sha256) throw new Error(`release ${releaseId} module ${module.id} sha256 mismatch`);
		expectedSums.set(name, module.sha256);
		modules.push({ id: module.id, sha256: module.sha256 });
	}
	const conformance = record.conformance;
	const conformanceName = leafName(record.basePath, conformance?.path, releaseId, "conformance");
	if (expectedSums.has(conformanceName)) throw new Error(`release ${releaseId} repeats artifact ${conformanceName}`);
	const conformanceBytes = await readFile(resolve(dir, conformanceName));
	if (sha256(conformanceBytes) !== conformance.sha256) throw new Error(`release ${releaseId} conformance sha256 mismatch`);
	expectedSums.set(conformanceName, conformance.sha256);
	const sums = parseSums((await readFile(resolve(dir, "SHA256SUMS"))).toString("utf8"), releaseId);
	if (sums.size !== expectedSums.size) throw new Error(`release ${releaseId} SHA256SUMS entry count drifted`);
	for (const [name, hash] of expectedSums) {
		if (sums.get(name) !== hash) throw new Error(`release ${releaseId} SHA256SUMS mismatch for ${name}`);
		if (sha256(await readFile(resolve(dir, name))) !== hash) throw new Error(`release ${releaseId} ${name} bytes do not match SHA256SUMS`);
	}
	const expectedEntries = new Set(["manifest.json", "SHA256SUMS", ...expectedSums.keys()]);
	const actualEntries = await readdir(dir);
	if (actualEntries.length !== expectedEntries.size || actualEntries.some((name) => !expectedEntries.has(name))) {
		throw new Error(`release ${releaseId} directory entries drifted`);
	}
	return {
		release: releaseId,
		manifest: `${record.basePath}manifest.json`,
		manifestSha256: sha256(manifestBytes),
		modules,
		record,
	};
};

export const buildFeed = async (releasesRoot) => {
	const ids = await listReleaseIds(releasesRoot);
	if (!ids.length) throw new Error("no engine releases to project into the discovery feed");
	const releases = [];
	for (const id of ids) releases.push(await inspectRelease(releasesRoot, id));
	const feed = {
		format: FEED_FORMAT,
		note: FEED_NOTE,
		latest: ids.at(-1),
		releases: releases.map((entry) => ({
			release: entry.release,
			manifest: entry.manifest,
			manifestSha256: entry.manifestSha256,
			modules: entry.modules,
		})),
	};
	assertFeedOrder(feed);
	return feed;
};

export const assertFeedOrder = (feed) => {
	if (!feed?.releases?.length) throw new Error("discovery feed is missing releases");
	const ids = feed.releases.map((entry) => entry.release);
	const sorted = [...ids].sort(compareReleaseIds);
	if (ids.join("\0") !== sorted.join("\0")) throw new Error("discovery feed releases[] is not in publication order");
	if (feed.latest !== ids.at(-1)) throw new Error("discovery feed latest is not the last releases[] entry");
};

export const assertAppendOnly = (previous, next) => {
	if (!previous?.releases || !next?.releases) throw new Error("discovery feed is missing releases");
	for (let i = 0; i < previous.releases.length; i++) {
		const prev = previous.releases[i];
		const cur = next.releases[i];
		if (!cur) throw new Error(`discovery feed removed release ${prev.release}`);
		if (cur.release !== prev.release) {
			const moved = next.releases.some((entry) => entry.release === prev.release);
			throw new Error(moved ? `discovery feed is not a strict prefix; ${prev.release} moved` : `discovery feed removed release ${prev.release}`);
		}
		if (JSON.stringify(cur) !== JSON.stringify(prev)) throw new Error(`discovery feed mutated release ${prev.release}`);
	}
};

export const serializeFeed = (feed) => Buffer.from(`${JSON.stringify(feed, null, 2)}\n`);
