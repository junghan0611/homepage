# Cloudflare Workers 배포 계약

homepage를 Cloudflare Workers의 **정적 자산**으로 서빙하기 위한 계약이다. Worker 코드는 없다.
큰 틀(계정·토큰·DNS·터널·Netlify 해지)은 nixos-config#11, 이 리포의 이전은 homepage#3.

상태(2026-09-30): apex는 아직 Netlify가 서빙한다. Worker `junghanacs-homepage`는 workers.dev에서
실측 중이고, 이 문서의 계약은 `cloudflare-workers` 브랜치에서 만들어졌다.

## 구성

| 파일 | 역할 |
|---|---|
| `wrangler.jsonc` | Worker `junghanacs-homepage`, `assets.directory=./public`, `not_found_handling=404-page` |
| `scripts/build-site.sh` | Workers Builds의 빌드 명령. Eval 관문 → Hugo → 산출물 검증 → workers.dev noindex |
| `.node-version` | Node 22 (Netlify와 같은 줄) |
| `static/_headers` | 응답 헤더. 전환 전까지 Netlify와 Cloudflare가 같은 파일을 읽는다 |
| `scripts/verify-deployed.mjs` | 배포된 호스트의 **응답**을 검증하는 관문 |

Workers Builds 설정(대시보드 또는 `cf builds`):

- 빌드 명령 `./scripts/build-site.sh`
- 배포 명령: production `npx wrangler deploy`, 비production 브랜치는 Cloudflare 기본값 `npx wrangler preview`
  (configuration 문서, 2026-09 기준). package.json이 없어 wrangler 버전은 고정되지 않는다 — 빌드 로그에서 확인한다
- 빌드 변수 `HUGO_VERSION=0.163.3` (로컬 nix Hugo와 같은 버전. Netlify는 0.156.0에 고정했었다) — `build-site.sh`가 설치된 Hugo가 이 버전의 extended인지 확인하고, 아니면 멈춘다
- 빌드 변수 `GO_VERSION` — go.mod가 `go 1.26`이고 빌드 이미지 기본은 1.24.3이다. `GOTOOLCHAIN=auto`가
  1.26을 받아 올 수도 있지만 측정하지 않았다. 검증한 1.26.x를 명시하고 로그로 확인한다
- `build-site.sh` 첫 줄에 `WORKERS_CI`·`WORKERS_CI_COMMIT_SHA`·`WORKERS_CI_BRANCH`·base URL을, 이어서
  hugo·node·go 버전을 찍는다. `WORKERS_CI=1`인데 `HUGO_VERSION`이 없으면 멈춘다
- `SITE_BASE_URL`이 있으면 Hugo `-b`와 두 산출물 verifier의 origin으로 쓴다. 없으면 apex다

## `_headers` — 두 호스트가 같은 파일을 읽는다

한 경로에 맞는 규칙이 여럿이고 **같은 헤더 이름**이 겹치면, Netlify는 나중 규칙의 값을 쓰고 **Cloudflare는
값을 모두 이어 붙인다** (`public, max-age=0, public, max-age=31536000, immutable`). 서로 다른 헤더 이름은
두 호스트 모두 합친다. 그래서:

- 한 헤더 이름은 겹치는 두 규칙 중 **한 곳에만** 둔다. `verify-eval-runtime.mjs`가 검사한다: 규칙 경로는
  `/exact`와 `/prefix/*`만 허용, 같은 경로 중복 금지, 한 규칙 안의 헤더 이름 중복 금지, 겹치는 규칙끼리 이름 중복 금지.
- Eval CSP는 directive 단위로 기대값과 비교한다(`'unsafe-inline'` 추가나 경계 directive 삭제를 잡는다).
- `Cache-Control`은 구체 규칙(`releases.json`, `releases/*`, 해시 런타임 JS, `/javascript/*`)에만 둔다.
  `/eval/*`·`/ko/eval/*`는 플랫폼 기본값(`public, max-age=0, must-revalidate`)을 쓴다.
- Cloudflare 전용 문법(`! Header` detach, 절대 URL 규칙)은 공유 파일에 넣지 않는다. Netlify가
  어떻게 읽는지 측정하지 않았다. 필요하면 `build-site.sh`가 산출물에만 붙인다.
- `/ko/eval/*`는 `/eval/*`와 같은 헤더를 가진다(같은 CSP). 이전 전에는 빠져 있었다.
- Workers는 `Content-Type`에 charset을 붙이지 않는다. 한글이 든 `/llms.txt`에는 `charset=utf-8`을 명시한다.

## workers.dev는 정본이 아니다

production 빌드의 canonical은 `https://junghanacs.com/`이다. `*.junghanacs.workers.dev`는 `build-site.sh`가
산출물에 붙인 절대 URL 규칙(`https://:host.junghanacs.workers.dev/*`)으로 `X-Robots-Tag: noindex`를 받는다.
측정: production workers.dev 주소와 version URL(`42dd7adf-…`)에서 확인. branch preview는 아직 측정하지
않았다 — Cloudflare 문서는 preview에 플랫폼이 noindex를 붙인다고 하므로 값이 겹치는지 본다.
apex를 연결한 뒤에도 workers.dev 주소는 남으므로 이 규칙을 유지한다.

## 검증

```bash
./scripts/build-site.sh                                   # 로컬: 빌드 + 산출물 검증
node scripts/verify-deployed.mjs https://junghanacs-homepage.junghanacs.workers.dev
node scripts/verify-deployed.mjs https://junghanacs.com   # 전환 뒤 canonical 호스트
```

`verify-deployed.mjs`는 **헤더와 상태 코드의 관문**이다. 경로마다 응답 하나를 받아 모든 판정을 그 응답에 한다:
주요 경로 200, Cache-Control directive 중복 없음, Eval 페이지(en/ko)·엔진 릴리즈·런타임의 CSP가
`static/_headers`의 `/eval/*` 값과 정확히 같음, nosniff, 엔진 릴리즈 파일 전부와 런타임 JS의 immutable,
`releases.json`의 max-age=0, 릴리즈의 CORS, `/llms.txt` charset, 없는 경로 404, workers.dev면 noindex·
canonical 호스트면 X-Robots-Tag 없음. 본문은 비교하지 않으므로 **어느 커밋이 배포됐는지는 증명하지 않는다**.

## 알려진 차이 (Netlify → Workers)

- 슬래시 없는 경로는 **307**로 `/path/`에 보낸다(Netlify 301). `html_handling`의 auto/force/drop은 모두 307이고
  (`none`은 처리 자체를 끈다), 상태 코드를 고르는 옵션은 없다.
  301이 필요하면 경로를 `_redirects`에 하나씩 적는다. `/* /:splat/ 301`은 JS·JSON까지 걸려 쓰지 않는다.
- 대소문자를 구분한다. 대문자가 든 파일을 대소문자가 다른 URL로 부르면 404다(Netlify는 200).
- 없는 `/ko/…` 경로는 한국어 404를 준다(Netlify는 영어 404).
- HSTS는 Netlify가 기본으로 붙였다(`max-age=31536000`). Cloudflare에서는 `build-site.sh`가 산출물에
  `https://junghanacs.com/*` 규칙으로 같은 값을 붙이고, `verify-deployed.mjs`가 canonical 호스트에서 확인한다.

## 도메인

- apex `junghanacs.com`은 `wrangler.jsonc`의 `routes`에 `custom_domain: true`로 선언한다. 배포가 proxied DNS 레코드와
  인증서를 만든다. 같은 이름의 CNAME이 있으면 만들 수 없으므로 전환 때 Netlify CNAME을 먼저 지웠다.
- www는 Worker에 붙이지 않는다. proxied `AAAA 100::`(originless placeholder) + Single Redirect `www → apex` 301,
  쿼리 보존. zone 규칙이라 nixos-config#11 소관이다.

## 전환 기록과 되돌리기 (2026-09-30)

- 12:33 KST apex CNAME(→`junghanacs.netlify.app`) 삭제 → `wrangler deploy`(커밋 `84ed799`)가 custom domain과
  Worker 소유 `AAAA 100::`(proxied, read-only)·인증서(Google Trust Services)를 만들었다.
- 12:35 www CNAME 삭제 → `AAAA 100::` proxied + zone 리다이렉트 규칙 `www → apex` 301(쿼리 보존).
  zone 설정 `always_use_https`를 켰다(http://가 200이었다).
- 되돌리기 순서: Worker custom domain 해제와 www 리다이렉트 규칙 비활성을 **먼저** 하고 CNAME을 복원한다.
  CNAME만 다시 만들면 Worker 소유 레코드와 충돌하거나 리다이렉트가 남는다. `wrangler.jsonc`의 `routes`가
  남아 있으면 다음 배포(Workers Builds 포함)가 apex를 다시 붙이므로 함께 되돌린다. Netlify 사이트와 도메인
  연결이 살아 있어야 되돌릴 곳이 있다.
