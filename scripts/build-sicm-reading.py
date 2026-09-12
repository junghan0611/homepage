#!/usr/bin/env python3
"""Build Hugo SICM reading pages from pinned English and Korean Org sources.

The exact source files remain public under static/eval/source/sicm/. This script only
adds Hugo front matter and rewrites links for the reading routes; it never edits the
source corpus. Use --check in verification to reject stale generated pages.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "static/eval/source/sicm"
CONTENT = ROOT / "content/eval/sicm"
UPSTREAM_COMMIT = "4088864745715d8afa923162155e63795d43a375"
UPSTREAM_RAW = f"https://raw.githubusercontent.com/mentat-collective/sicm-book/{UPSTREAM_COMMIT}/org"
CANONICAL_HTML = "https://tgvaughan.github.io/sicm"


@dataclass(frozen=True)
class Page:
	stem: str
	source_name: str
	title_en: str
	title_ko: str
	description_en: str
	description_ko: str
	weight: int
	viewer: str = ""


PAGES = (
	Page(
		"preface",
		"preface.org",
		"Preface",
		"서문",
		"The complete English preface and a Korean reading translation of SICM, pinned to its exact source.",
		"SICM 서문 영어 원문과 정확한 소스에 고정된 한국어 읽기 번역.",
		10,
	),
	Page(
		"chapter-1",
		"chapter001.org",
		"Chapter 1 — Lagrangian Mechanics",
		"제1장 — 라그랑주 역학",
		"The complete first chapter of SICM with source receipts and computation-derived Emmy views.",
		"SICM 제1장 전체와 소스 영수증, 계산에서 다시 그린 Emmy 뷰.",
		20,
		"chapter-1",
	),
)


def source_path(page: Page, lang: str) -> Path:
	name = page.source_name if lang == "en" else page.source_name.replace(".org", ".ko.org")
	return SOURCE / lang / name


def output_path(page: Page, lang: str) -> Path:
	suffix = ".org" if lang == "en" else ".ko.org"
	return CONTENT / f"{page.stem}{suffix}"


def strip_upstream_header(text: str, page: Page) -> str:
	text = re.sub(r"\A---.*?---\s*", "", text, count=1, flags=re.S)
	text = re.sub(r"\A#\+title:.*\n", "", text, count=1, flags=re.I)
	text = re.sub(r"\A#\+OPTIONS:.*\n", "", text, count=1, flags=re.I)
	if page.stem == "preface":
		# Hugo supplies the page H1; remove only the duplicated upstream heading drawer.
		text = re.sub(
			r"\A\*\* [^\n]+\n\s*:PROPERTIES:\n.*?\s*:END:\n",
			"",
			text,
			count=1,
			flags=re.S,
		)
	return text.lstrip()


def repair_reading_markup(text: str) -> str:
	"""Repair known conversion scars in the pinned Org without changing the public source."""
	text = re.sub(r"(?m)^\[fn:([^\]]+)\](?=\S)", r"[fn:\1] ", text)

	# Three conversion scars around source blocks otherwise make go-org swallow
	# hundreds of lines as one Scheme listing.
	text = re.sub(
		r"(?ms)^(\s*)#\+begin_src scheme\s+(.+?)\s+#\+end_src\s+%\}\s*$",
		lambda match: f"{match.group(1)}#+begin_src scheme\n{match.group(2)}\n{match.group(1)}#+end_src",
		text,
	)
	text = re.sub(r"(?m)^(\s*),#\+(begin_src\s+scheme|end_src)\s*(?:%\})?\s*$", r"\1#+\2", text)

	# The HTML→Org port closed every array display with the wrong environment
	# name. Direct display arrays also lost their closing dollar delimiters.
	def direct_array(match: re.Match[str]) -> str:
		indent, body = match.group(1), match.group(2).rstrip()
		return f"{indent}$$\\begin{{array}}{body}\\end{{array}}$$"

	text = re.sub(
		r"(?ms)^([ \t]*)\${1,2}\\begin\{array\}(.*?)\\end\{equation\}\$?\s*$",
		direct_array,
		text,
	)
	text = re.sub(
		r"(?s)(\\begin\{array\}(?:(?!\\end\{array\}).)*?)\\end\{equation\}",
		r"\1\\end{array}",
		text,
	)
	text = re.sub(
		r"(?s)\\begin\{array\}(.*?)\\end\{array\}",
		lambda match: r"\begin{array}" + re.sub(r"\s*\n\s*", " ", match.group(1)) + r"\end{array}",
		text,
	)

	# go-org consumes raw equation wrappers but leaves their closing token visible.
	# Explicit display delimiters keep the same TeX body available to KaTeX.
	def equation(match: re.Match[str]) -> str:
		indent, body = match.group(1), match.group(2).strip()
		return f"{indent}$$\\begin{{aligned}}\n{body}\n{indent}\\end{{aligned}}$$"

	text = re.sub(
		r"(?ms)^([ \t]*)\\begin\{equation\}\s*(.*?)\\end\{equation\}\s*$",
		equation,
		text,
	)
	text = re.sub(
		r"(?s)\${1,2}([D(]*)\\begin\{equation\}\s*(.*?)\\end\{equation\}\$?",
		lambda match: "$$\\begin{aligned}\n" + match.group(1) + match.group(2).strip() + "\n\\end{aligned}$$",
		text,
	)
	return text


def render_math_shortcodes(text: str) -> str:
	"""Route Org dollar math through Hugo's pinned build-time KaTeX→MathML."""
	protected = re.compile(
		r"(?msi)^([ \t]*#\+begin_(?:src|example|export).*?^[ \t]*#\+end_(?:src|example|export)[ \t]*$)"
	)

	def normalize_tex(tex: str) -> str:
		# The canonical Org port encoded Newton dots as underlined spacing accents;
		# normalize only in the generated rendering layer.
		return (
			tex.replace(r"\overset{˙}", r"\dot")
			.replace(r"\overset{¨}", r"\ddot")
			.replace("\u2009\u0332", "")
			.replace("\u2009", "")
		)

	def convert(chunk: str) -> str:
		out: list[str] = []
		cursor = 0
		while cursor < len(chunk):
			if chunk.startswith("$$", cursor):
				end = chunk.find("$$", cursor + 2)
				if end < 0:
					raise ValueError("unmatched display-math delimiter in generated SICM page")
				tex = normalize_tex(chunk[cursor + 2 : end])
				out.append("{{< sicm-math display >}}" + tex + "{{< /sicm-math >}}")
				cursor = end + 2
			elif chunk[cursor] == "$":
				end = chunk.find("$", cursor + 1)
				if end < 0:
					raise ValueError("unmatched inline-math delimiter in generated SICM page")
				tex = normalize_tex(chunk[cursor + 1 : end])
				out.append("{{< sicm-math >}}" + tex + "{{< /sicm-math >}}")
				cursor = end + 1
			else:
				out.append(chunk[cursor])
				cursor += 1
		return "".join(out)

	pieces = protected.split(text)
	return "".join(piece if protected.fullmatch(piece) else convert(piece) for piece in pieces)


def add_navigation_anchors(text: str) -> str:
	# go-org prints legacy <<target>> syntax as text; raw inline HTML preserves the
	# canonical target without altering the exact public source artifact.
	text = re.sub(r"<<([A-Za-z0-9_.:-]+)>>", r'@@html:<span id="\1"></span>@@', text)

	text = re.sub(
		r"\^\{\[\[#endnote_(\d+)\]\[(\d+)\]\]\}",
		r'@@html:<sup><a id="endnote_ref_\1" href="#endnote_\1">\2</a></sup>@@',
		text,
	)
	text = re.sub(
		r"\[\[#endnote_ref_(\d+)\]\[\^\{(\d+)\}\]\]",
		r'@@html:<span id="endnote_\1"></span><a href="#endnote_ref_\1"><sup>\2</sup></a>@@',
		text,
	)

	# Normalize numbered display environments so each can carry the same anchor
	# used by the canonical HTML port.
	text = re.sub(
		r"(?s)(?<!\$)\$(\\begin\{(?:array|aligned)\}.*?\\end\{(?:array|aligned)\})\$(?!\$)",
		r"$$\1$$",
		text,
	)

	def display_anchors(match: re.Match[str]) -> str:
		block = match.group(0)
		numbers = list(dict.fromkeys(re.findall(r"\{\(1\.([0-9]+)\)\}", block)))
		anchors = "".join(f'@@html:<span id="disp_1.{number}"></span>@@\n' for number in numbers)
		return anchors + block

	text = re.sub(r"(?s)\$\$.*?\$\$", display_anchors, text)
	text = re.sub(
		r"(?m)^(\s*)(\$\$[^\n]*\{\(1\.([0-9]+)\)\}[^\n]*\$\$)",
		lambda match: f'{match.group(1)}@@html:<span id="disp_1.{match.group(3)}"></span>@@\n{match.group(1)}{match.group(2)}' if f'id="disp_1.{match.group(3)}"' not in text else match.group(0),
		text,
	)
	text = re.sub(
		r"(?m)^(\s*)(#\+caption:\s+\*?(?:Figure|그림)\s+1\.([0-9]+)\*?)",
		lambda match: f'{match.group(1)}@@html:<span id="Fig_1-{match.group(3)}"></span>@@\n{match.group(1)}{match.group(2)}',
		text,
	)
	text = re.sub(
		r"(?m)^(\s*)(\*(?:Exercise|연습문제)\s+1\.([0-9]+)[^\n]*\*)",
		lambda match: f'{match.group(1)}@@html:<span id="Exe_1-{match.group(3)}"></span>@@\n{match.group(1)}{match.group(2)}',
		text,
	)
	text = re.sub(
		r"(?m)^(\*{2,}\s+(?:Exercise|연습문제)\s+1\.([0-9]+)[^\n]*)",
		lambda match: f'@@html:<span id="Exe_1-{match.group(2)}"></span>@@\n{match.group(1)}',
		text,
	)
	text = re.sub(
		r"\[\[#(p\d+)\]\[([^\]]+)\]\]",
		lambda match: f'[[{CANONICAL_HTML}/chapter001.html#{match.group(1)}][{match.group(2)}]]',
		text,
	)
	return text


def rewrite_links(text: str, lang: str) -> str:
	prefix = "/ko" if lang == "ko" else ""
	local = {
		"preface.html": f"{prefix}/eval/sicm/preface/",
		"chapter001.html": f"{prefix}/eval/sicm/chapter-1/",
	}

	def replace_file_link(match: re.Match[str]) -> str:
		target, label = match.group(1), match.group(2)
		base, sep, fragment = target.partition("#")
		if base.startswith("images/"):
			href = f"/eval/source/sicm/{base}"
		elif base in local and not (fragment and re.fullmatch(r"p\d+", fragment)):
			href = local[base]
		else:
			href = f"{CANONICAL_HTML}/{base}"
		if sep:
			href += f"#{fragment}"
		return f"[[{href}][{label}]]"

	text = re.sub(r"\[\[file:([^\]]+)\]\[([^\]]+)\]\]", replace_file_link, text)
	text = re.sub(
		r"\[\[file:images/([^\]]+)\]\]",
		r"[[/eval/source/sicm/images/\1]]",
		text,
	)
	return text


def front_matter(page: Page, lang: str) -> str:
	title = page.title_ko if lang == "ko" else page.title_en
	description = page.description_ko if lang == "ko" else page.description_en
	source_rel = f"{lang}/{page.source_name if lang == 'en' else page.source_name.replace('.org', '.ko.org')}"
	translation = "true" if lang == "ko" else "false"
	viewer = f'\nsicmViewer: "{page.viewer}"' if page.viewer else ""
	return f'''---
title: "{title}"
description: "{description}"
type: eval
translationKey: "sicm-{page.stem.replace('chapter-1', 'ch1')}"
weight: {page.weight}
math: true
comments: false
toc: false
sidebar:
  exclude: true
runtime: true
eyebrow: "Eval / SICM Reading Edition"
sicmSource: "{source_rel}"
sicmTranslation: {translation}{viewer}
---

'''


def render(page: Page, lang: str) -> str | None:
	path = source_path(page, lang)
	if not path.exists():
		return None
	body = strip_upstream_header(path.read_text(encoding="utf-8"), page)
	body = repair_reading_markup(body)
	body = body.replace("$q = $\\chi \\circ \\gamma$", "$q = \\chi \\circ \\gamma$")
	body = add_navigation_anchors(body)
	body = rewrite_links(body, lang)
	body = render_math_shortcodes(body)
	return front_matter(page, lang) + body.rstrip() + "\n"


def main() -> int:
	parser = argparse.ArgumentParser()
	parser.add_argument("--check", action="store_true", help="fail if generated pages are stale")
	args = parser.parse_args()
	failures: list[str] = []
	CONTENT.mkdir(parents=True, exist_ok=True)
	for page in PAGES:
		for lang in ("en", "ko"):
			expected = render(page, lang)
			if expected is None:
				continue
			out = output_path(page, lang)
			if args.check:
				actual = out.read_text(encoding="utf-8") if out.exists() else ""
				if actual != expected:
					failures.append(str(out.relative_to(ROOT)))
			else:
				out.write_text(expected, encoding="utf-8")
				print(f"wrote {out.relative_to(ROOT)}")
	if failures:
		print("stale SICM reading pages: " + ", ".join(failures), file=sys.stderr)
		print("run: python3 scripts/build-sicm-reading.py", file=sys.stderr)
		return 1
	if args.check:
		print("SICM reading sources: generated pages match")
	return 0


if __name__ == "__main__":
	raise SystemExit(main())
