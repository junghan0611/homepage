#!/usr/bin/env node
/** Verify the rendered JSON-LD identity layer. Contract SSOT: docs/semantic-jsonld.md.
 *
 * The Eval gate proves the executable shelf; it says nothing about the identity graph.
 * This verifier reads the built HTML and checks the claims that docs/semantic-jsonld.md
 * makes, so a whitelist or node change cannot ship unobserved.
 */
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://junghanacs.com";
const failures = [];
const fail = (message) => failures.push(message);

/* Hugo minifies attributes unquoted: <script type=application/ld+json>. A regex that
   demands quotes silently finds nothing and every check below would vacuously pass. */
const BLOCK = /<script type=["']?application\/ld\+json["']?>([\s\S]*?)<\/script>/g;

const read = async (path) => {
	try {
		return await readFile(resolve(root, path), "utf8");
	} catch {
		fail(`missing build output: ${path}`);
		return null;
	}
};

const graphOf = (html, path) => {
	const blocks = [...html.matchAll(BLOCK)];
	if (blocks.length !== 1) {
		fail(`${path} carries ${blocks.length} JSON-LD blocks, expected exactly 1`);
		return null;
	}
	let parsed;
	try {
		parsed = JSON.parse(blocks[0][1]);
	} catch (error) {
		fail(`${path} JSON-LD does not parse: ${error.message}`);
		return null;
	}
	if (parsed["@context"] !== "https://schema.org") fail(`${path} @context drifted`);
	if (!Array.isArray(parsed["@graph"])) {
		fail(`${path} has no @graph array`);
		return null;
	}
	return parsed["@graph"];
};

const pick = (graph, type) => graph.find((node) => node["@type"] === type);

/* Locked in docs/semantic-jsonld.md: the same alternateName set the garden's Person node
   carries. The two nodes declare one person through sameAs, so the sets must not drift. */
const ALTERNATE_NAMES = ["GLG", "GLGMAN", "힣", "힣맨", "정한"];
const CONTENT_LICENSE = "https://creativecommons.org/licenses/by-nc-sa/4.0/";

const pages = [
	{ path: "public/index.html", permalink: `${origin}/`, lang: "en", pageType: "ProfilePage", fragment: "profilepage" },
	{ path: "public/ko/index.html", permalink: `${origin}/ko/`, lang: "ko", pageType: "ProfilePage", fragment: "profilepage" },
	{ path: "public/about/index.html", permalink: `${origin}/about/`, lang: "en", pageType: "AboutPage", fragment: "aboutpage" },
	{ path: "public/ko/about/index.html", permalink: `${origin}/ko/about/`, lang: "ko", pageType: "AboutPage", fragment: "aboutpage" },
];

const descriptions = new Map();

for (const page of pages) {
	const html = await read(page.path);
	if (!html) continue;
	const graph = graphOf(html, page.path);
	if (!graph) continue;

	const person = pick(graph, "Person");
	if (!person) fail(`${page.path} has no Person node`);
	else {
		if (person["@id"] !== `${origin}/#person`) fail(`${page.path} Person @id is ${person["@id"]}`);
		if (JSON.stringify(person.alternateName) !== JSON.stringify(ALTERNATE_NAMES)) fail(`${page.path} Person alternateName drifted from the garden's set: ${JSON.stringify(person.alternateName)}`);
		if (!person.sameAs?.includes("https://notes.junghanacs.com/")) fail(`${page.path} Person sameAs lost the garden`);
	}

	const website = pick(graph, "WebSite");
	if (website?.["@id"] !== `${origin}/#website`) fail(`${page.path} WebSite @id drifted`);

	/* The original-writing layer states its own terms; the engine and the SICM reading
	   edition answer to different licenses and must not inherit this one. */
	const blog = pick(graph, "Blog");
	if (blog?.["@id"] !== `${origin}/#blog`) fail(`${page.path} Blog @id drifted`);
	else if (blog.license !== CONTENT_LICENSE) fail(`${page.path} Blog license is ${blog.license}, expected ${CONTENT_LICENSE}`);

	const node = pick(graph, page.pageType);
	if (!node) {
		fail(`${page.path} has no ${page.pageType} node`);
		continue;
	}
	/* Page nodes must never share an origin fragment, or every language collapses into one node. */
	if (node["@id"] !== `${page.permalink}#${page.fragment}`) fail(`${page.path} ${page.pageType} @id is ${node["@id"]}, expected ${page.permalink}#${page.fragment}`);
	if (node.url !== page.permalink) fail(`${page.path} ${page.pageType} url is ${node.url}`);
	if (node.inLanguage !== page.lang) fail(`${page.path} ${page.pageType} inLanguage is ${node.inLanguage}`);
	if (node.mainEntity?.["@id"] !== `${origin}/#person`) fail(`${page.path} ${page.pageType} mainEntity does not point at the Person`);
	if (!node.description) fail(`${page.path} ${page.pageType} has no description`);
	else descriptions.set(`${page.pageType}:${page.lang}`, node.description);
}

/* A Korean page describing itself with the English copy is the bug this pair exists to catch. */
for (const pageType of ["ProfilePage", "AboutPage"]) {
	const en = descriptions.get(`${pageType}:en`);
	const ko = descriptions.get(`${pageType}:ko`);
	if (en && ko && en === ko) fail(`${pageType} description is identical in both languages; the Korean page is still falling back to the English copy`);
}

/* The whitelist is a claim too: taxonomy and Eval routes must stay out of the graph. */
for (const path of ["public/tags/index.html", "public/eval/engine/index.html"]) {
	const html = await read(path);
	if (!html) continue;
	const blocks = [...html.matchAll(BLOCK)];
	if (blocks.length) fail(`${path} emits ${blocks.length} JSON-LD blocks; the whitelist is home / blog / about only`);
}

if (failures.length) {
	for (const message of failures) console.error(`JSON-LD verification failed: ${message}`);
	process.exit(1);
}
console.log(`JSON-LD identity layer verified: ${pages.length} pages, Person/WebSite anchors stable, per-language descriptions distinct`);
