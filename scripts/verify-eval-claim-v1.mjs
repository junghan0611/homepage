#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import vm from "node:vm";

const root = resolve(import.meta.dirname, "..");
const source = await readFile(resolve(root, "assets/js/eval-claim-v1.js"), "utf8");
const fixture = JSON.parse(await readFile(resolve(root, "dev/eval/engine/conformance-v1.json"), "utf8"));
const context = vm.createContext({ console });
context.globalThis = context;
vm.runInContext(source, context, { filename: "eval-claim-v1.js" });
const api = context.HomepageEvalClaimV1;
if (api?.VERSION !== "claim-v1" || typeof api.assert !== "function") throw new Error("claim-v1 browser global is unavailable");

for (const test of fixture.cases) {
	const result = api.assert(test.value, test.claim);
	if (result.pass !== test.pass || result.code !== test.code) {
		throw new Error(`${test.id}: expected pass=${test.pass} code=${test.code}, received ${JSON.stringify(result)}`);
	}
}

context.cljs = {
	core: {
		keyword: (key) => `:${key}`,
		get: (value, key, missing) => value?.__cljsMap?.has(key) ? value.__cljsMap.get(key) : missing,
	},
};
const cljsValue = { __cljsMap: new Map([[":minutes-per-waking", 48]]) };
const cljsResult = api.assert(cljsValue, {
	mode: "field",
	path: ["minutes-per-waking"],
	predicate: { op: "exact", expected: 48 },
});
if (!cljsResult.pass) throw new Error(`CLJS keyword-map field lookup failed: ${JSON.stringify(cljsResult)}`);

for (const badValue of ["10", "100", "0.5"]) {
	if (api.assert(badValue, { mode: "scalar-exact", expected: "0" }).pass) throw new Error(`scalar negative control passed: ${badValue}`);
}
if (api.assert({ value: 480 }, { mode: "field", path: ["value"], predicate: { op: "exact", expected: 48 } }).pass) throw new Error("structured negative control passed");

console.log(`claim-v1 verified: ${fixture.cases.length} fixtures, CLJS keyword-map lookup, and four negative controls`);
