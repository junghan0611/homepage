/** Discovery feed for immutable Eval engine releases. Mutable projection of the release directory ledger. */
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

export const FEED_FORMAT = 1;
export const FEED_NOTE = "discovery only; adopt an exact release and verify its artifact hashes. latest is not a compatibility promise.";
export const FEED_RELATIVE = "static/eval/engine/releases.json";
export const RELEASES_RELATIVE = "static/eval/engine/releases";
const RELEASE_ID = /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/;

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");

export const parseReleaseId = (name) => {
	const match = RELEASE_ID.exec(name);
	if (!match) throw new Error(`engine release directory ${name} is not YYYY.M.D`);
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	if (month < 1 || month > 12 || day < 1 || day > 31) throw new Error(`engine release directory ${name} is not a valid YYYY.M.D date`);
	return { id: name, year, month, day };
};

export const compareReleaseIds = (left, right) => {
	const a = typeof left === "string" ? parseReleaseId(left) : left;
	const b = typeof right === "string" ? parseReleaseId(right) : right;
	return a.year - b.year || a.month - b.month || a.day - b.day;
};

const parseSums = (text, releaseId) => {
	const sums = new Map();
	for (const line of text.replace(/\n$/, "").split("\n")) {
		const match = /^(?<hash>[0-9a-f]{64})  (?<name>.+)$/.exec(line);
		if (!match) throw new Error(`${releaseId} SHA256SUMS has a malformed line: ${line}`);
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
	return ids;
};

export const inspectRelease = async (releasesRoot, releaseId) => {
	parseReleaseId(releaseId);
	const dir = resolve(releasesRoot, releaseId);
	const manifestBytes = await readFile(resolve(dir, "manifest.json"));
	const manifest = JSON.parse(manifestBytes.toString("utf8"));
	if (manifest.release !== releaseId) throw new Error(`release directory ${releaseId} does not match manifest.release ${manifest.release}`);
	if (manifest.basePath !== `/eval/engine/releases/${releaseId}/`) throw new Error(`release ${releaseId} basePath drifted`);
	const expectedSums = new Map();
	const modules = [];
	for (const module of manifest.modules || []) {
		if (!module.path?.startsWith(manifest.basePath)) throw new Error(`release ${releaseId} module ${module.id} path is outside basePath`);
		const name = module.path.slice(manifest.basePath.length);
		const bytes = await readFile(resolve(dir, name));
		if (sha256(bytes) !== module.sha256) throw new Error(`release ${releaseId} module ${module.id} sha256 mismatch`);
		expectedSums.set(name, module.sha256);
		modules.push({ id: module.id, sha256: module.sha256 });
	}
	const conformance = manifest.conformance;
	if (!conformance?.path?.startsWith(manifest.basePath)) throw new Error(`release ${releaseId} conformance path is outside basePath`);
	const conformanceName = conformance.path.slice(manifest.basePath.length);
	const conformanceBytes = await readFile(resolve(dir, conformanceName));
	if (sha256(conformanceBytes) !== conformance.sha256) throw new Error(`release ${releaseId} conformance sha256 mismatch`);
	expectedSums.set(conformanceName, conformance.sha256);
	const sums = parseSums((await readFile(resolve(dir, "SHA256SUMS"))).toString("utf8"), releaseId);
	if (sums.size !== expectedSums.size) throw new Error(`release ${releaseId} SHA256SUMS entry count drifted`);
	for (const [name, hash] of expectedSums) {
		if (sums.get(name) !== hash) throw new Error(`release ${releaseId} SHA256SUMS mismatch for ${name}`);
		if (sha256(await readFile(resolve(dir, name))) !== hash) throw new Error(`release ${releaseId} ${name} bytes do not match SHA256SUMS`);
	}
	return {
		release: releaseId,
		manifest: `${manifest.basePath}manifest.json`,
		manifestSha256: sha256(manifestBytes),
		modules,
	};
};

export const buildFeed = async (releasesRoot) => {
	const ids = await listReleaseIds(releasesRoot);
	if (!ids.length) throw new Error("no engine releases to project into the discovery feed");
	const releases = [];
	for (const id of ids) releases.push(await inspectRelease(releasesRoot, id));
	return {
		format: FEED_FORMAT,
		note: FEED_NOTE,
		latest: ids.at(-1),
		releases,
	};
};

export const serializeFeed = (feed) => Buffer.from(`${JSON.stringify(feed, null, 2)}\n`);
