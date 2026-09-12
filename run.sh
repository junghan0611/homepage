#!/usr/bin/env bash
# homepage의 한 로컬 관문: 전체 Hugo를 보고, 같은 계약을 검증한다.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

PORT="${HUGO_PORT:-2341}"
HUGO_BIN="${HUGO_BIN:-hugo}"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}ℹ ${NC}$1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1" >&2; }

usage() {
	cat <<EOF
homepage — 하나의 Hugo 공개면

Usage: ./run.sh [1|s|v|h|0]

  1  전체 사이트를 빌드하며 보기  http://localhost:${PORT}/
  s  SICM 번역 조립 + 읽기 페이지 갱신
  v  Netlify 계약 검증 + production Hugo build
  h  도움말
  0  종료

Eval 문서의 원본은 Markdown·Org·Clojure다. 생성 HTML은 편집 원본이 아니다.
EOF
}

port_pid() {
	ss -ltnp "sport = :${PORT}" 2>/dev/null \
		| sed -n 's/.*pid=\([0-9][0-9]*\).*/\1/p' \
		| head -1
}

verify_sources() {
	info "Eval 원본·런타임·라이선스 검증"
	node scripts/verify-eval-runtime.mjs
}

build_sicm() {
	info "SICM 분할 번역 검증·조립"
	python3 scripts/build-sicm-translation.py
	python3 scripts/build-sicm-reading.py
	success "SICM 영어 원문·한국어 읽기 페이지 갱신"
}

serve() {
	info "Eval 원본에서 공개 산출물 생성"
	node scripts/build-eval-runtime.mjs
	verify_sources
	local pid
	pid="$(port_pid)"
	if [[ -n "$pid" ]]; then
		success "이미 서빙 중  pid=${pid}  http://localhost:${PORT}/"
		return 0
	fi
	info "${HUGO_BIN} server -p ${PORT} --disableFastRender"
	"$HUGO_BIN" server -p "$PORT" --disableFastRender &
	local spid=$!
	trap 'kill '"$spid"' 2>/dev/null || true' EXIT INT TERM
	for _ in $(seq 1 30); do
		if [[ -n "$(port_pid)" ]]; then
			success "Hugo 전체 공개면  http://localhost:${PORT}/"
			wait "$spid"
			return
		fi
		sleep 0.2
	done
	error "Hugo가 포트 ${PORT}를 열지 못했다."
	kill "$spid" 2>/dev/null || true
	return 1
}

verify() {
	verify_sources
	info "${HUGO_BIN} --gc --minify"
	rm -rf public
	"$HUGO_BIN" --gc --minify
	node scripts/verify-eval-output.mjs
	success "전체 공개면 검증 완료: / · /projects/ · /eval/"
}

menu() {
	echo ""
	echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	echo -e "${GREEN}homepage${NC}  하나의 Hugo 공개면"
	echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	echo ""
	echo "    1) 빌드해서 보기  localhost:${PORT}"
	echo "    s) SICM 읽기판 갱신"
	echo "    v) verify"
	echo "    h) help"
	echo "    0) 종료"
	echo ""
	echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

run() {
	case "$1" in
		1) serve ;;
		s) build_sicm ;;
		v) verify ;;
		h) usage ;;
		0) return 0 ;;
		*)
			error "모르는 선택: $1"
			usage >&2
			return 2
			;;
	esac
}

if [[ $# -gt 0 ]]; then
	run "$1"
elif [[ -t 0 ]]; then
	menu
	read -r -p "선택 [0]: " choice
	run "${choice:-0}"
else
	error "TTY가 아니면 선택을 적어야 한다: ./run.sh 1 또는 ./run.sh v"
	exit 2
fi
