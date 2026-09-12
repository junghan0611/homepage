// SPDX-License-Identifier: GPL-3.0-only
// Browser view for the claim-v1 conformance surface; not part of the assertion module.
(() => {
	const mount = document.querySelector("[data-engine-conformance]");
	if (!mount) return;
	const status = mount.querySelector(".eval-status");
	const output = mount.querySelector(".eval-output");
	const show = (state, label, value) => {
		mount.dataset.state = state;
		status.textContent = label;
		output.textContent = JSON.stringify(value, null, 2);
	};
	try {
		const evaluate = window.scittle?.core?.eval_string;
		const claim = window.HomepageEvalClaimV1;
		if (!evaluate || claim?.VERSION !== "claim-v1") throw new Error("pinned Scittle or claim-v1 is unavailable");
		const result = evaluate("{:minutes-per-waking 48 :longest-silence-days 11.14}");
		const cases = [
			["scalar exact 0", claim.assert(evaluate("0"), { mode: "scalar-exact", expected: "0" }), true],
			["scalar rejects 10", claim.assert(evaluate("10"), { mode: "scalar-exact", expected: "0" }), false],
			["keyword-map field 48", claim.assert(result, { mode: "field", path: ["minutes-per-waking"], predicate: { op: "exact", expected: 48 } }), true],
			["keyword-map rejects 480", claim.assert(result, { mode: "field", path: ["minutes-per-waking"], predicate: { op: "exact", expected: 480 } }), false],
			["explicit fragment", claim.assert(String(result), { mode: "fragment", expected: ":longest-silence-days 11.14" }), true],
		];
		const observed = cases.map(([name, assertion, expectedPass]) => ({ name, expectedPass, pass: assertion.pass, code: assertion.code }));
		if (observed.some((item) => item.pass !== item.expectedPass)) throw new Error(`browser conformance mismatch: ${JSON.stringify(observed)}`);
		show("pass", "PASS", { contract: claim.VERSION, cases: observed });
	} catch (error) {
		show("error", "ERROR", { error: error?.message ?? String(error) });
	}
})();
