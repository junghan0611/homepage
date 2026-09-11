// SPDX-License-Identifier: GPL-3.0-only
// Corresponding source: this unminified file.
(() => {
	const render = (cell) => {
		const source = cell.querySelector("textarea").value;
		const output = cell.querySelector(".eval-output");
		const status = cell.querySelector(".eval-status");
		const expectError = cell.dataset.expectError === "true";
		const originalConsoleError = console.error;
		if (expectError) console.error = () => {};
		cell.dataset.state = "running";
		status.textContent = "RUNNING";
		try {
			if (!window.scittle?.core?.eval_string) {
				throw new Error("scittle.core.eval_string is unavailable");
			}
			const value = String(window.scittle.core.eval_string(source));
			if (expectError) throw new Error("the deliberately invalid form unexpectedly succeeded");
			const expected = cell.dataset.expected;
			if (expected && !value.includes(expected)) {
				throw new Error(`unexpected result: expected ${expected}, received ${value}`);
			}
			output.textContent = value;
			cell.dataset.state = "pass";
			status.textContent = "PASS";
		} catch (error) {
			const message = error?.message ?? String(error);
			output.textContent = `ERROR: ${message}`;
			if (expectError && !message.includes("unexpectedly succeeded")) {
				cell.dataset.state = "pass";
				status.textContent = "EXPECTED ERROR";
			} else {
				cell.dataset.state = "error";
				status.textContent = "ERROR";
			}
		} finally {
			console.error = originalConsoleError;
		}
	};

	document.querySelectorAll(".eval-cell").forEach((cell) => {
		cell.querySelector("button").addEventListener("click", () => render(cell));
		if (cell.dataset.auto === "true") render(cell);
	});
})();
