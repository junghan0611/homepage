#!/usr/bin/env python3
"""Verify and assemble the segmented SICM Chapter 1 Korean translation."""

from __future__ import annotations

import argparse
from collections import Counter
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "dev/eval/sicm/translation/manifest.json"
OUTPUT = ROOT / "static/eval/source/sicm/ko/chapter001.ko.org"


def sha256(data: bytes) -> str:
	return hashlib.sha256(data).hexdigest()


def repair_source_blocks(text: str) -> str:
	text = re.sub(
		r"(?ms)^(\s*)#\+begin_src scheme\s+(.+?)\s+#\+end_src\s+%\}\s*$",
		lambda match: f"{match.group(1)}#+begin_src scheme\n{match.group(2)}\n{match.group(1)}#+end_src",
		text,
	)
	return re.sub(r"(?m)^(\s*),#\+(begin_src\s+scheme|end_src)\s*(?:%\})?\s*$", r"\1#+\2", text)


def blocks(text: str) -> list[str]:
	text = repair_source_blocks(text)
	return [
		match.group(0).strip()
		for match in re.finditer(
			r"(?ms)^\s*#\+begin_(src|example|export)[^\n]*\n.*?^\s*#\+end_\1\s*$",
			text,
		)
	]


def structures(text: str) -> dict[str, object]:
	return {
		"heading-depth": [len(match) for match in re.findall(r"(?m)^(\*+)\s+", text)],
		"properties": re.findall(r"(?m)^\s*:(?:CUSTOM_ID|CLASS|NAME):.*$", text),
		"link-targets": re.findall(r"\[\[((?:file:|https?://|#)[^\]]+)", text),
		"footnotes": re.findall(r"\[fn:[^\]]+\]", text),
		"images": re.findall(r"images/[^\]\s]+", text),
		"equations": re.findall(r"\\begin\{equation\}.*?\\end\{equation\}", text, re.S),
		"arrays": re.findall(r"\\begin\{array\}.*?\\end\{equation\}", text, re.S),
		"blocks": blocks(text),
		"single-line-math": Counter(re.findall(r"\$[^$\n]+\$", text)),
	}


def fail(message: str) -> None:
	print(f"SICM translation verification failed: {message}", file=sys.stderr)
	raise SystemExit(1)


def main() -> int:
	parser = argparse.ArgumentParser()
	parser.add_argument("--check", action="store_true", help="fail if the assembled public source is stale")
	args = parser.parse_args()
	manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
	source_path = ROOT / manifest["source"]["path"]
	source_bytes = source_path.read_bytes()
	if sha256(source_bytes) != manifest["source"]["sha256"]:
		fail("full English source hash drifted")
	source_lines = source_bytes.decode("utf-8").splitlines(keepends=True)
	translations: list[str] = []
	for segment in manifest["segments"]:
		start, end = segment["sourceLines"]
		source = "".join(source_lines[start - 1:end - 1])
		if sha256(source.encode()) != segment["sourceSha256"]:
			fail(f"source segment {segment['id']} hash drifted")
		translation_path = ROOT / segment["translationPath"]
		translation_bytes = translation_path.read_bytes()
		if sha256(translation_bytes) != segment["translationSha256"]:
			fail(f"translation segment {segment['id']} hash drifted")
		translation = translation_bytes.decode("utf-8")
		for marker in ("f또는", "co또는", "transf또는", "만일ied", "또는igin", "cchoose", "cplace"):
			if marker in translation:
				fail(f"translation segment {segment['id']} contains retired corruption marker {marker}")
		original_structure = structures(source)
		translated_structure = structures(translation)
		for name, original in original_structure.items():
			if original != translated_structure[name]:
				fail(f"translation segment {segment['id']} changed protected structure: {name}")
		translations.append(translation.rstrip("\n") + "\n")
	assembled = "".join(translations)
	if args.check:
		if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != assembled:
			fail("assembled Korean Chapter 1 source is missing or stale")
		print("SICM Chapter 1 translation verified: 5 segments, protected structures intact, aggregate current")
	else:
		OUTPUT.parent.mkdir(parents=True, exist_ok=True)
		OUTPUT.write_text(assembled, encoding="utf-8")
		print(f"wrote {OUTPUT.relative_to(ROOT)}")
	return 0


if __name__ == "__main__":
	raise SystemExit(main())
