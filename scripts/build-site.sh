#!/usr/bin/env bash
# Cloudflare Workers Builds의 빌드 명령: Eval 관문 → Hugo → 산출물 검증 → workers.dev noindex.
# 배포 계약: docs/deploy-cloudflare.md. Netlify는 전환 전까지 netlify.toml의 명령을 쓴다.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "build-site: workers_ci=${WORKERS_CI:-0} commit=${WORKERS_CI_COMMIT_SHA:-local} branch=${WORKERS_CI_BRANCH:-local} base=${SITE_BASE_URL:-https://junghanacs.com/}"

# HUGO_VERSION은 Workers Builds 빌드 변수가 설치할 버전이다. CI에서는 반드시 있어야 하고,
# 설치된 hugo가 그 버전의 extended가 아니면 멈춘다. 빌드 이미지는 `extended_0.163.3`처럼
# 접두사를 붙여야 extended를 설치한다(`0.163.3`만 쓰면 일반판 — 2026-09-30 첫 빌드에서 측정).
if [[ "${WORKERS_CI:-}" == 1 && -z "${HUGO_VERSION:-}" ]]; then
	echo "build-site: HUGO_VERSION build variable is required on Workers Builds" >&2
	exit 1
fi
hugo_version="$(hugo version)"
# 공식 바이너리는 `v0.163.3-<commit>+extended`, nixpkgs는 `v0.163.3+extended+withdeploy`로 찍힌다.
want="${HUGO_VERSION#extended_}"
if [[ -n "${HUGO_VERSION:-}" ]] && ! grep -qE "^hugo v${want//./[.]}(-[0-9a-f]+)?\+extended([+ ]|$)" <<<"$hugo_version"; then
	echo "build-site: expected hugo extended v${want} (set HUGO_VERSION=extended_<version>), got: ${hugo_version}" >&2
	exit 1
fi
echo "$hugo_version"
echo "node $(node --version)"
if command -v go >/dev/null; then echo "$(go version) GOTOOLCHAIN=$(go env GOTOOLCHAIN)"; fi

node scripts/verify-eval-runtime.mjs
rm -rf public
hugo --gc --minify ${SITE_BASE_URL:+-b "$SITE_BASE_URL"}
node scripts/verify-eval-output.mjs
node scripts/verify-jsonld-output.mjs

# Cloudflare만 읽는 절대 URL 규칙이라 공유 static/_headers가 아니라 이 산출물에만 붙인다.
# workers.dev의 production·preview 주소는 정본이 아니다(noindex). canonical 호스트는 Netlify가
# 기본으로 보내던 HSTS를 이어받는다.
cat >> public/_headers <<'HEADERS'

https://:host.junghanacs.workers.dev/*
  X-Robots-Tag: noindex

https://junghanacs.com/*
  Strict-Transport-Security: max-age=31536000
HEADERS
