#!/usr/bin/env python3
"""SICM org → static HTML. Read-only on the org tree. Pandoc 3 required."""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ORG = Path.home() / "sync/code/junghan0611/sicm-book/org"
OUT = ROOT

SPINE = [
	("titlepage", "Title"),
	("dedication", "Dedication"),
	("preface", "Preface"),
	("acknowledgments", "Acknowledgments"),
	("toc", "Contents"),
	("chapter001", "1 Lagrangian Mechanics"),
	("chapter002", "2 Rigid Bodies"),
	("chapter003", "3 Hamiltonian Mechanics"),
	("chapter004", "4 Phase Space Structure"),
	("chapter005", "5 Canonical Transformations"),
	("chapter006", "6 Canonical Evolution"),
	("chapter007", "7 Canonical Perturbation Theory"),
	("chapter008", "Appendix: Scheme"),
	("chapter009", "Appendix: Our Notation"),
	("appendix", "List of Exercises"),
	("bibliography", "Bibliography"),
	("keyword_index", "Index"),
]
EXTRA = [
	("ch09", "9 Notation (ko draft)"),
]

KATEX = "https://cdn.jsdelivr.net/npm/katex@0.18.7/dist"

LINK_MAP = {
	"book.html": "index.html",
	"toc.html": "toc.html",
	"index.html": "keyword_index.html",
}


def strip_jekyll(text: str) -> tuple[str, list[str]]:
	text = re.sub(r"^---\s*---\s*\n", "", text)
	text = re.sub(r"\{%.*?%\}", "", text, flags=re.S)
	imgs: list[str] = []

	def tok(m: re.Match[str]) -> str:
		imgs.append(m.group(1))
		return f"\n\nSICMIMG{len(imgs) - 1}\n\n"

	text = re.sub(r"\[\[file:images/([^\]]+)\]\]", tok, text)
	return text, imgs


def pandoc_org(src: Path) -> tuple[str, str, list[str]]:
	cleaned, imgs = strip_jekyll(src.read_text(encoding="utf-8", errors="replace"))
	tmp = ROOT / ".tmp.org"
	tmp.write_text(cleaned, encoding="utf-8")
	r = subprocess.run(
		["pandoc", "-f", "org", "-t", "html5", "--wrap=none", str(tmp)],
		capture_output=True,
		text=True,
	)
	tmp.unlink(missing_ok=True)
	if r.returncode != 0:
		raise RuntimeError(f"pandoc {src.name}: {r.stderr[-500:]}")
	return r.stdout, r.stderr, imgs


def rewrite_images(html: str, imgs: list[str]) -> str:
	for i in range(len(imgs) - 1, -1, -1):
		html = html.replace(f"SICMIMG{i}", f'<img src="images/{imgs[i]}" alt="">')
	html = re.sub(
		r"\[\[file:(images/[^\]]+)\]\]",
		r'<img src="\1" alt="">',
		html,
	)
	return html


def rewrite_hrefs(html: str) -> str:
	def repl(m: re.Match[str]) -> str:
		href = m.group(1)
		if href.startswith(("http://", "https://", "mailto:", "#")):
			return m.group(0)
		base, frag = (href.split("#", 1) + [""])[:2]
		base = base.replace("file:", "")
		base = LINK_MAP.get(base, base)
		if base.endswith(".org"):
			base = base[:-4] + ".html"
		out = base + (("#" + frag) if frag else "")
		return f'href="{out}"'

	return re.sub(r'href="([^"]*)"', repl, html)


def nav_html(stem: str) -> str:
	stems = [s for s, _ in SPINE]
	if stem not in stems:
		return '<nav class="book-nav"><a href="index.html">Contents</a></nav>'
	i = stems.index(stem)
	prev_ = SPINE[i - 1] if i > 0 else None
	next_ = SPINE[i + 1] if i + 1 < len(SPINE) else None
	parts = []
	if prev_:
		parts.append(f'<a href="{prev_[0]}.html">← {prev_[1]}</a>')
	parts.append('<a href="index.html">Contents</a>')
	if next_:
		parts.append(f'<a href="{next_[0]}.html">{next_[1]} →</a>')
	return '<nav class="book-nav">' + " · ".join(parts) + "</nav>"


def wrap(stem: str, title: str, body: str) -> str:
	return f"""<!DOCTYPE html>
<html lang="en" data-webtui-theme="catppuccin-mocha">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — SICM</title>
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="{KATEX}/katex.min.css">
<style>
.book-nav {{ margin: 1lh 0; color: var(--overlay1); font-size: 0.85em; display: flex; flex-wrap: wrap; gap: 1ch; }}
.book-nav a {{ color: var(--blue); }}
article.doc img {{ max-width: 100%; height: auto; background: var(--surface0); }}
article.doc pre {{ overflow-x: auto; }}
article.doc table {{ overflow-x: auto; display: block; }}
.math.display {{ overflow-x: auto; }}
</style>
</head>
<body>
{nav_html(stem)}
<article class="doc">
<h1 class="org-title">{title}</h1>
{body}
</article>
{nav_html(stem)}
<script src="{KATEX}/katex.min.js"></script>
<script src="{KATEX}/contrib/auto-render.min.js"></script>
<script>
	renderMathInElement(document.body, {{
		delimiters: [
			{{left: '$$', right: '$$', display: true}},
			{{left: '\\\\[', right: '\\\\]', display: true}},
			{{left: '$', right: '$', display: false}},
			{{left: '\\\\(', right: '\\\\)', display: false}}
		],
		throwOnError: false,
		ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
	}});
</script>
</body>
</html>
"""


def index_html() -> str:
	lis = "\n".join(
		f'<li><a href="{s}.html">{t}</a></li>' for s, t in SPINE
	)
	extra = "\n".join(
		f'<li><a href="{s}.html">{t}</a></li>' for s, t in EXTRA
	)
	body = f"""<p>Unofficial HTML of <em>Structure and Interpretation of Classical Mechanics</em>
(Sussman &amp; Wisdom, 2nd ed.). Built from local org (read-only) via pandoc.
CC BY-NC-SA 3.0. Not a release.</p>
<ul>{lis}</ul>
<p style="color:var(--overlay1);font-size:0.85em">Not in the English spine:</p>
<ul>{extra}</ul>
"""
	return wrap("index", "SICM", body).replace(nav_html("index"), nav_html("toc"), 2)


def main() -> int:
	if not ORG.is_dir():
		print(f"missing org tree: {ORG}", file=sys.stderr)
		return 1
	img_src = ORG / "images"
	img_dst = OUT / "images"
	if img_src.is_dir():
		if img_dst.exists():
			shutil.rmtree(img_dst)
		shutil.copytree(img_src, img_dst)
	warn_log: list[str] = []
	for stem, title in SPINE + EXTRA:
		src = ORG / f"{stem}.org"
		if not src.exists():
			print(f"skip missing {src.name}", file=sys.stderr)
			continue
		body, err, imgs = pandoc_org(src)
		body = rewrite_images(rewrite_hrefs(body), imgs)
		(OUT / f"{stem}.html").write_text(wrap(stem, title, body), encoding="utf-8")
		nwarn = err.count("WARNING")
		print(f"wrote {stem}.html  warnings={nwarn}")
		if nwarn:
			warn_log.append(f"{stem}: {nwarn}")
	(OUT / "index.html").write_text(index_html(), encoding="utf-8")
	print("wrote index.html")
	(OUT / "pandoc-warnings.txt").write_text("\n".join(warn_log) + "\n", encoding="utf-8")
	return 0


if __name__ == "__main__":
	raise SystemExit(main())
