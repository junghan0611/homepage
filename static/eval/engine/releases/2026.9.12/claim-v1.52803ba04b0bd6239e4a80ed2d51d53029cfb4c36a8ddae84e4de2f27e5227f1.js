// SPDX-License-Identifier: GPL-3.0-only
// claim-v1: assertion semantics only; evaluation and rendering are separate contracts.
((root) => {
	"use strict";

	const VERSION = "claim-v1";
	const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
	const failure = (mode, code, reason, details = {}) => ({ pass: false, mode, code, reason, ...details });
	const success = (mode, actual, expected, details = {}) => ({ pass: true, mode, code: "pass", actual, expected, ...details });

	const normalizeScalar = (value) => {
		if (value === null || value === undefined) throw new TypeError("scalar value is null or undefined");
		if (["object", "function"].includes(typeof value)) throw new TypeError("scalar value must not be a collection or function");
		return String(value).normalize("NFC").trim();
	};

	const readCljs = (value, key, missing) => {
		const core = root.cljs?.core;
		if (!core?.get) return missing;
		const candidates = [key];
		if (typeof key === "string" && core.keyword) candidates.unshift(core.keyword(key.replace(/^:/, "")));
		for (const candidate of candidates) {
			const found = core.get(value, candidate, missing);
			if (found !== missing) return found;
		}
		return missing;
	};

	const resolvePath = (value, path) => {
		if (!Array.isArray(path) || path.length === 0) throw new TypeError("field path must be a non-empty array");
		let current = value;
		for (const key of path) {
			const missing = Object.freeze({});
			let next = missing;
			if (current instanceof Map) {
				if (current.has(key)) next = current.get(key);
				else if (typeof key === "string" && current.has(`:${key.replace(/^:/, "")}`)) next = current.get(`:${key.replace(/^:/, "")}`);
			} else if (Array.isArray(current) && Number.isInteger(Number(key))) {
				const index = Number(key);
				if (index >= 0 && index < current.length) next = current[index];
			} else if (current !== null && typeof current === "object" && own(current, key)) {
				next = current[key];
			} else if (current !== null && typeof current === "object" && typeof current.get === "function") {
				const direct = current.get(key, missing);
				if (direct !== missing && direct !== undefined) next = direct;
				if (next === missing && typeof current.forEach === "function") {
					const wanted = typeof key === "string" ? key.replace(/^:/, "") : String(key);
					current.forEach((entryValue, entryKey) => {
						const observed = String(entryKey).replace(/^:/, "");
						if (next === missing && observed === wanted) next = entryValue;
					});
				}
			}
			if (next === missing && current !== null && typeof current === "object") next = readCljs(current, key, missing);
			if (next === missing) throw new ReferenceError(`field path is missing at ${String(key)}`);
			current = next;
		}
		return current;
	};

	const numeric = (value, label) => {
		const number = typeof value === "number" ? value : Number(normalizeScalar(value));
		if (!Number.isFinite(number)) throw new TypeError(`${label} must be a finite number`);
		return number;
	};

	const applyPredicate = (actualValue, predicate) => {
		if (!predicate || typeof predicate !== "object" || Array.isArray(predicate)) throw new TypeError("field predicate must be an object");
		const op = predicate.op;
		if (op === "exact") {
			const actual = normalizeScalar(actualValue);
			const expected = normalizeScalar(predicate.expected);
			return actual === expected
				? success("field", actual, expected, { operator: op })
				: failure("field", "mismatch", "selected field does not equal the expected scalar", { actual, expected, operator: op });
		}
		if (["lt", "lte", "gt", "gte"].includes(op)) {
			const actual = numeric(actualValue, "selected field");
			const expected = numeric(predicate.expected, "predicate expected");
			const pass = op === "lt" ? actual < expected : op === "lte" ? actual <= expected : op === "gt" ? actual > expected : actual >= expected;
			return pass
				? success("field", actual, expected, { operator: op })
				: failure("field", "mismatch", `selected field does not satisfy ${op}`, { actual, expected, operator: op });
		}
		if (op === "within") {
			const actual = numeric(actualValue, "selected field");
			const expected = numeric(predicate.expected, "predicate expected");
			const tolerance = numeric(predicate.tolerance, "predicate tolerance");
			if (tolerance < 0) throw new RangeError("predicate tolerance must not be negative");
			return Math.abs(actual - expected) <= tolerance
				? success("field", actual, expected, { operator: op, tolerance })
				: failure("field", "mismatch", "selected field is outside tolerance", { actual, expected, operator: op, tolerance });
		}
		throw new TypeError(`unsupported field predicate: ${String(op)}`);
	};

	const assert = (value, claim) => {
		const mode = claim?.mode;
		try {
			if (mode === "scalar-exact") {
				const actual = normalizeScalar(value);
				const expected = normalizeScalar(claim.expected);
				return actual === expected
					? success(mode, actual, expected)
					: failure(mode, "mismatch", "scalar does not exactly equal the expected value", { actual, expected });
			}
			if (mode === "field") {
				const selected = resolvePath(value, claim.path);
				return { ...applyPredicate(selected, claim.predicate), path: claim.path };
			}
			if (mode === "fragment") {
				const actual = String(value).normalize("NFC");
				const expected = String(claim.expected ?? "").normalize("NFC");
				if (expected.length === 0) throw new TypeError("fragment expected value must not be empty");
				return actual.includes(expected)
					? success(mode, actual, expected)
					: failure(mode, "mismatch", "result does not contain the explicit fragment", { actual, expected });
			}
			throw new TypeError(`unsupported claim mode: ${String(mode)}`);
		} catch (error) {
			return failure(mode ?? "unknown", "invalid-claim", error?.message ?? String(error));
		}
	};

	root.HomepageEvalClaimV1 = Object.freeze({ VERSION, assert, normalizeScalar, resolvePath });
})(globalThis);
