#!/usr/bin/env bash
#
# 로컬 개발 서버.
#
# 발행은 당분간 안 한다 (issue #1). 로컬에서 품질을 다 올리고 한 번에 내보낸다.
# 그래서 이 스크립트는 두 면을 나란히 띄운다 — 지금 서 있는 Hugo 사이트와,
# 그것을 대체하려는 새 스택.
#
#   ./run.sh            현행 Hugo 사이트          http://localhost:2341
#   ./run.sh stack      새 스택 (정적)            http://localhost:2342
#   ./run.sh book       SICM 책 렌더 후 서빙      http://localhost:2342/book/
#   ./run.sh both       둘 다 (Hugo 는 백그라운드)
#
set -euo pipefail

cd "$(dirname "$0")"

DEV_DIR="dev/eval-stack"
HUGO_PORT=2341
STACK_PORT=2342

serve_hugo() {
	rm -rf public
	hugo server -p "$HUGO_PORT" --disableFastRender
}

serve_stack() {
	echo "새 스택      http://localhost:${STACK_PORT}/site/"
	echo "  ko        http://localhost:${STACK_PORT}/site/ko/"
	echo "eval proto  http://localhost:${STACK_PORT}/proto/index.html"
	echo "SICM 샘플   http://localhost:${STACK_PORT}/proto/sicm.html"
	echo "룩 목업     http://localhost:${STACK_PORT}/proto/look.html"
	[ -f "${DEV_DIR}/book/preface.html" ] && echo "SICM 책     http://localhost:${STACK_PORT}/book/preface.html"
	echo
	python3 -m http.server "$STACK_PORT" --directory "$DEV_DIR"
}

build_book() {
	# 산출물은 gitignore 되어 있다. 원본은 이 리포 밖이라 Netlify 는 재생성하지 못한다 (issue #1).
	python3 "${DEV_DIR}/book/build.py"
}

case "${1:-hugo}" in
	hugo)
		serve_hugo
		;;
	stack)
		serve_stack
		;;
	book)
		build_book
		serve_stack
		;;
	both)
		serve_hugo &
		trap 'kill %1 2>/dev/null || true' EXIT
		serve_stack
		;;
	-h | --help | help)
		sed -n '3,12p' "$0" | sed 's/^# \{0,1\}//'
		;;
	*)
		echo "run.sh: 모르는 모드 '$1' — hugo | stack | book | both" >&2
		exit 2
		;;
esac
