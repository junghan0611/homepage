#!/usr/bin/env node
// Protocol test only: this verifies SVG construction around a supplied point receipt.
// It is not a browser-rendering, CSP, SRI, or Scittle/Emmy execution receipt.
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const fail = (message) => { console.error(`SICM viewer protocol failed: ${message}`); process.exit(1); };

class Node {
	constructor(name = "node") { this.name = name; this.attrs = {}; this.children = []; this.textContent = ""; }
	setAttribute(name, value) { this.attrs[name] = String(value); }
	append(...nodes) { this.children.push(...nodes); }
	replaceChildren(...nodes) { this.children = [...nodes]; }
}

const output = new Node("output");
output.textContent = "0.00016772069029036274";
const cell = new Node("cell");
cell.dataset = { state: "pass" };
cell.querySelector = (selector) => selector === ".eval-output" ? output : null;
const canvas = new Node("canvas");
const result = new Node("result");
const figure = new Node("figure");
figure.dataset = {};
figure.querySelector = (selector) => selector === ".sicm-figure-canvas" ? canvas : selector === ".sicm-figure-result" ? result : null;
const document = {
	querySelector: (selector) => selector === "#cell-sicm-figure-1-1" ? cell : selector === '[data-sicm-figure="1.1"]' ? figure : null,
	createElementNS: (_namespace, name) => new Node(name),
};
class MutationObserver { constructor(callback) { this.callback = callback; } observe() {} }
const points = Array.from({ length: 80 }, (_, index) => {
	const t = index * 0.02;
	return [t, 0.00016 * Math.sin(t * 2)];
});
const window = { scittle: { core: { eval_string: () => points } } };

const source = await readFile(new URL("../assets/js/eval-sicm.js", import.meta.url), "utf8");
vm.runInNewContext(source, { document, window, MutationObserver, Array, Object, Math, String });

const svg = canvas.children[0];
if (!svg || svg.name !== "svg") fail("viewer did not create an SVG root");
if (svg.attrs.role !== "img" || !svg.attrs["aria-labelledby"]) fail("SVG accessible name contract is missing");
const path = svg.children.find((node) => node.name === "path");
if (!path?.attrs.d?.startsWith("M")) fail("computed point receipt did not become a path");
if (!result.textContent.includes(output.textContent)) fail("scalar receipt and figure caption disagree");
if (figure.dataset.state === "error") fail("viewer entered error state");
console.log("SICM viewer protocol verified: supplied points become an accessible SVG and retain the scalar receipt (not browser E2E)");
