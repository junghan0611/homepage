#!/usr/bin/env bash
# 로컬 개발 서버. 발행은 안 한다 (issue #1).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

DEV_DIR="dev/eval-stack"
HUGO_PORT=2341
STACK_PORT=2342

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}ℹ ${NC}$1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1" >&2; }

usage() {
	cat <<EOF
로컬 개발 서버 — 발행 안 함. 품질은 여기서 올리고 한 번에 내보낸다.

Usage: ./run.sh [모드]

모드:
  hugo    현행 Hugo 사이트              http://localhost:${HUGO_PORT}/
  stack   eval-stack 정적 면            http://localhost:${STACK_PORT}/
  clay    Clay 노트북 빌드 후 stack     http://localhost:${STACK_PORT}/clay/
  both    hugo(백그라운드) + stack

SICM 책 전문 렌더는 서버 모드가 아니다. 개인 열람:
  python3 dev/eval-stack/book/build.py

인자 없이 부르면 번호 메뉴.
포트가 이미 물려 있으면 트레이스백 대신 pid를 보고하고
재사용 / 종료 후 재시작 / 다른 포트를 고른다. 말없이 죽이지 않는다.
EOF
}

port_listen_pid() {
	local port="$1"
	ss -ltnp "sport = :${port}" 2>/dev/null \
		| sed -n 's/.*pid=\([0-9][0-9]*\).*/\1/p' \
		| head -1
}

port_listen_cmd() {
	local pid="$1"
	if [[ -n "$pid" && -r "/proc/${pid}/comm" ]]; then
		tr -d '\0' <"/proc/${pid}/comm"
	else
		echo "?"
	fi
}

wait_for_port() {
	local port="$1"
	local n=0
	while (( n < 25 )); do
		if [[ -n "$(port_listen_pid "$port")" ]]; then
			return 0
		fi
		sleep 0.2
		n=$((n + 1))
	done
	return 1
}

# 점유된 포트를 사람 말로 보고하고, 재사용/종료/다른포트/취소를 고른다.
# 재사용이면 1을 반환(호출자가 서버를 안 띄움). 준비되면 0.
# PORT_VAR 이름의 변수를 새 포트로 바꿀 수 있다.
ensure_port() {
	local port_var="$1"
	local port="${!port_var}"
	local pid
	pid="$(port_listen_pid "$port")"
	if [[ -z "$pid" ]]; then
		return 0
	fi
	local cmd
	cmd="$(port_listen_cmd "$pid")"
	error "포트 ${port} 가 이미 물려 있다 — pid=${pid} (${cmd})"
	if [[ ! -t 0 ]]; then
		error "tty 가 아니라 고를 수 없다. 그 프로세스를 먼저 정리하거나 다른 포트를 넘겨라."
		return 2
	fi
	echo ""
	echo "  1) 재사용 — 이미 뜬 서버의 URL만 보여 주고 끝"
	echo "  2) 종료 후 재시작 — pid ${pid} 를 죽이고 이 스크립트가 띄운다"
	echo "  3) 다른 포트"
	echo "  0) 취소"
	echo ""
	local choice
	read -r -p "선택 [0]: " choice
	choice="${choice:-0}"
	case "$choice" in
		1) return 1 ;;
		2)
			info "pid ${pid} 종료 요청 (사용자 선택)"
			if ! kill "$pid" 2>/dev/null; then
				error "죽이지 못했다. 권한이 없거나 이미 죽었다."
				return 2
			fi
			local i=0
			while [[ -n "$(port_listen_pid "$port")" && $i -lt 20 ]]; do
				sleep 0.1
				i=$((i + 1))
			done
			if [[ -n "$(port_listen_pid "$port")" ]]; then
				error "포트 ${port} 가 아직 안 비었다."
				return 2
			fi
			success "포트 ${port} 비었음"
			return 0
			;;
		3)
			local newp
			read -r -p "포트 번호: " newp
			if [[ ! "$newp" =~ ^[0-9]+$ ]]; then
				error "숫자가 아니다: ${newp}"
				return 2
			fi
			printf -v "$port_var" '%s' "$newp"
			ensure_port "$port_var"
			;;
		*)
			info "취소"
			return 2
			;;
	esac
}

print_stack_urls() {
	local port="$1"
	local base="http://localhost:${port}"
	local any=0
	echo ""
	if [[ -f "${DEV_DIR}/site/index.html" ]]; then
		echo "  새 스택      ${base}/site/"
		echo "    ko        ${base}/site/ko/"
		any=1
	else
		warn "site/ 산출 없음 — ${DEV_DIR}/site/index.html"
	fi
	if [[ -f "${DEV_DIR}/proto/index.html" ]]; then
		echo "  eval proto  ${base}/proto/index.html"
		any=1
	fi
	if [[ -f "${DEV_DIR}/proto/sicm.html" ]]; then
		echo "  SICM 샘플   ${base}/proto/sicm.html"
		any=1
	fi
	if [[ -f "${DEV_DIR}/proto/look.html" ]]; then
		echo "  룩 목업     ${base}/proto/look.html"
		any=1
	fi
	if [[ -f "${DEV_DIR}/book/preface.html" ]]; then
		echo "  SICM 책(개인 열람) ${base}/book/preface.html"
		any=1
	fi
	if [[ -f "${DEV_DIR}/clay/docs/notebooks.preface.html" ]]; then
		echo "  Clay        ${base}/clay/docs/notebooks.preface.html"
		any=1
	else
		warn "Clay HTML 없음 (gitignore) — ./run.sh clay 로 빌드"
	fi
	if [[ "$any" -eq 0 ]]; then
		warn "띄울 산출물이 없다. ${base}/${DEV_DIR}/ 디렉터리만 열린다."
	fi
	echo ""
}

serve_python() {
	local port="$1"
	local dir="$2"
	info "python3 -m http.server ${port} --directory ${dir}"
	python3 -m http.server "$port" --directory "$dir" &
	local spid=$!
	# 우리가 띄운 것만 나간다. 재사용한 남의 프로세스는 trap 하지 않는다.
	trap 'kill '"$spid"' 2>/dev/null || true' EXIT INT TERM
	if ! wait_for_port "$port"; then
		error "포트 ${port} 가 안 열렸다 (pid ${spid})."
		kill "$spid" 2>/dev/null || true
		trap - EXIT INT TERM
		return 1
	fi
	success "서빙 중  pid=${spid}  ${dir} → http://localhost:${port}/"
	print_stack_urls "$port"
	wait "$spid"
}

serve_hugo() {
	local st
	set +e
	ensure_port HUGO_PORT
	st=$?
	set -e
	if [[ $st -eq 1 ]]; then
		success "Hugo 재사용  http://localhost:${HUGO_PORT}/"
		return 0
	elif [[ $st -ne 0 ]]; then
		return "$st"
	fi
	info "hugo server -p ${HUGO_PORT}"
	hugo server -p "$HUGO_PORT" --disableFastRender &
	local spid=$!
	trap 'kill '"$spid"' 2>/dev/null || true' EXIT INT TERM
	if ! wait_for_port "$HUGO_PORT"; then
		error "Hugo 가 포트 ${HUGO_PORT} 를 안 열었다."
		kill "$spid" 2>/dev/null || true
		trap - EXIT INT TERM
		return 1
	fi
	success "Hugo  http://localhost:${HUGO_PORT}/"
	wait "$spid"
}

serve_stack() {
	local st
	set +e
	ensure_port STACK_PORT
	st=$?
	set -e
	if [[ $st -eq 1 ]]; then
		success "stack 재사용  http://localhost:${STACK_PORT}/"
		print_stack_urls "$STACK_PORT"
		return 0
	elif [[ $st -ne 0 ]]; then
		return "$st"
	fi
	serve_python "$STACK_PORT" "$DEV_DIR"
}

build_clay() {
	if [[ ! -f "${DEV_DIR}/clay/usage.clj" ]]; then
		error "없다: ${DEV_DIR}/clay/usage.clj"
		return 1
	fi
	if [[ -f "${DEV_DIR}/clay/docs/notebooks.preface.html" ]]; then
		info "Clay HTML 이 이미 있다 — 빌드 생략"
		return 0
	fi
	info "clojure -M usage.clj  (${DEV_DIR}/clay)"
	if ( cd "${DEV_DIR}/clay" && clojure -M usage.clj </dev/null ); then
		:
	else
		warn "Clay 빌드가 실패했다 (usage.clj 가 inline 단계에서 죽을 수 있음)"
	fi
	if [[ -f "${DEV_DIR}/clay/docs/notebooks.preface.html" ]]; then
		success "Clay HTML 준비됨"
	else
		warn "Clay HTML 없음 — 링크를 찍지 않는다"
	fi
}

mode_both() {
	local hs ss
	set +e
	ensure_port HUGO_PORT
	hs=$?
	ensure_port STACK_PORT
	ss=$?
	set -e
	if [[ $hs -eq 2 || $ss -eq 2 ]]; then
		return 2
	fi
	if [[ $hs -eq 0 ]]; then
		info "hugo server -p ${HUGO_PORT} (background)"
		hugo server -p "$HUGO_PORT" --disableFastRender >/tmp/homepage-hugo.log 2>&1 &
		local hpid=$!
		trap 'kill '"$hpid"' 2>/dev/null || true' EXIT INT TERM
		if wait_for_port "$HUGO_PORT"; then
			success "Hugo  http://localhost:${HUGO_PORT}/"
		else
			error "Hugo 가 안 떴다 — /tmp/homepage-hugo.log"
		fi
	else
		success "Hugo 재사용  http://localhost:${HUGO_PORT}/"
	fi
	if [[ $ss -eq 1 ]]; then
		success "stack 재사용  http://localhost:${STACK_PORT}/"
		print_stack_urls "$STACK_PORT"
		# hugo 를 우리가 띄웠으면 그걸 기다린다
		wait || true
		return 0
	fi
	serve_python "$STACK_PORT" "$DEV_DIR"
}

show_menu() {
	echo ""
	echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	echo -e "${GREEN}homepage${NC}  로컬 서버  —  발행 안 함"
	echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	echo ""
	echo "    1) hugo     localhost:${HUGO_PORT}   현행 Hugo"
	echo "    2) stack    localhost:${STACK_PORT}   eval-stack 정적"
	echo "    3) clay     Clay 노트북 빌드 + stack"
	echo "    4) both     hugo + stack"
	echo ""
	echo "    h) help"
	echo "    0) 종료"
	echo ""
	echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

dispatch() {
	local mode="$1"
	case "$mode" in
		hugo | 1) serve_hugo ;;
		stack | 2) serve_stack ;;
		clay | 3) build_clay; serve_stack ;;
		both | 4) mode_both ;;
		-h | --help | help | h) usage ;;
		0 | quit | exit) return 0 ;;
		*)
			error "모르는 모드 '${mode}' — hugo | stack | clay | both"
			usage >&2
			return 2
			;;
	esac
}

main() {
	if [[ $# -gt 0 ]]; then
		dispatch "$1"
		return
	fi
	if [[ ! -t 0 ]]; then
		error "인자 없이·tty 아니면 메뉴를 못 연다. ./run.sh --help"
		return 2
	fi
	show_menu
	local choice
	read -r -p "선택 [0]: " choice
	choice="${choice:-0}"
	if [[ "$choice" == "0" ]]; then
		return 0
	fi
	dispatch "$choice"
}

main "$@"
