// SPDX-License-Identifier: GPL-3.0-only
// Corresponding source: this unminified file.
(() => {
	const cell = document.querySelector("#cell-sicm-figure-1-1");
	const figure = document.querySelector('[data-sicm-figure="1.1"]');
	if (!cell || !figure) return;

	const canvas = figure.querySelector(".sicm-figure-canvas");
	const result = figure.querySelector(".sicm-figure-result");
	let rendered = false;

	const pointSource = `(clj->js
		(mapv (fn [i]
				(let [t (* i 0.02)]
					[t (- (sicm-q3 t) (js/Math.cos t))]))
			(range 80)))`;

	const svgNode = (name, attrs, text = "") => {
		const node = document.createElementNS("http://www.w3.org/2000/svg", name);
		Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
		if (text) node.textContent = text;
		return node;
	};

	const draw = () => {
		if (rendered || cell.dataset.state !== "pass") return;
		try {
			const points = window.scittle.core.eval_string(pointSource);
			if (!Array.isArray(points) || points.length === 0) throw new Error("no path samples");
			const width = 640;
			const height = 230;
			const left = 64;
			const right = 18;
			const top = 18;
			const bottom = 42;
			const tMax = Math.PI / 2;
			const yMax = 0.0002;
			const x = (t) => left + (t / tMax) * (width - left - right);
			const y = (error) => top + ((yMax - error) / (2 * yMax)) * (height - top - bottom);
			const path = points.map(([t, error], index) => `${index ? "L" : "M"}${x(t).toFixed(2)} ${y(error).toFixed(2)}`).join(" ");

			const svg = svgNode("svg", {
				viewBox: `0 0 ${width} ${height}`,
				role: "img",
				"aria-labelledby": "sicm-fig11-svg-title sicm-fig11-svg-desc",
			});
			svg.append(svgNode("title", { id: "sicm-fig11-svg-title" }, "Recomputed SICM Figure 1.1 error curve"));
			svg.append(svgNode("desc", { id: "sicm-fig11-svg-desc" }, "The difference between the Emmy action-minimizing path q3 of t and cosine t from zero to pi over two."));
			svg.append(svgNode("line", { x1: left, y1: y(0), x2: width - right, y2: y(0), class: "sicm-axis" }));
			svg.append(svgNode("line", { x1: left, y1: top, x2: left, y2: height - bottom, class: "sicm-axis" }));
			svg.append(svgNode("path", { d: path, class: "sicm-error-path" }));
			svg.append(svgNode("text", { x: width / 2, y: height - 10, class: "sicm-axis-label", "text-anchor": "middle" }, "t  (0 … π/2)"));
			svg.append(svgNode("text", { x: 16, y: height / 2, class: "sicm-axis-label", transform: `rotate(-90 16 ${height / 2})`, "text-anchor": "middle" }, "q₃(t) − cos(t)"));
			svg.append(svgNode("text", { x: left, y: height - bottom + 20, class: "sicm-tick", "text-anchor": "middle" }, "0"));
			svg.append(svgNode("text", { x: width - right, y: height - bottom + 20, class: "sicm-tick", "text-anchor": "middle" }, "π/2"));
			canvas.replaceChildren(svg);
			const output = cell.querySelector(".eval-output")?.textContent ?? "";
			result.textContent = `max |q₃(t) − cos(t)| = ${output}`;
			rendered = true;
		} catch (error) {
			result.textContent = `UNVERIFIED: ${error?.message ?? String(error)}`;
			figure.dataset.state = "error";
		}
	};

	new MutationObserver(draw).observe(cell, { attributes: true, attributeFilter: ["data-state"] });
	draw();
})();
