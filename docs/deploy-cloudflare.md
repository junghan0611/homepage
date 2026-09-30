# Cloudflare Workers 배포 계약

homepage를 Cloudflare Workers의 **정적 자산**으로 서빙하기 위한 계약이다. Worker 코드는 없다.
큰 틀(계정·토큰·DNS·터널·Netlify 해지)은 nixos-config#11, 이 리포의 이전은 homepage#3.

상태(2026-09-30): apex `junghanacs.com`을 Worker `junghanacs-homepage`가 서빙한다(12:33 KST 전환). main에
push하면 Workers Builds가 빌드·배포한다(아래 빌드 감시 제외 파일만 바뀐 push는 빌드하지 않는다).

## 구성

| 파일 | 역할 |
|---|---|
| `wrangler.jsonc` | Worker `junghanacs-homepage`, `assets.directory=./public`, `not_found_handling=404-page` |
| `scripts/build-site.sh` | Workers Builds의 빌드 명령. Eval 관문 → Hugo → 산출물 검증 → workers.dev noindex |
| `.node-version` | Node 22 (Netlify와 같은 줄) |
| `static/_headers` | 응답 헤더. 전환 전까지 Netlify와 Cloudflare가 같은 파일을 읽는다 |
| `scripts/verify-deployed.mjs` | 배포된 호스트의 **응답**을 검증하는 관문 |

Workers Builds 설정 — 2026-09-30 GLG가 대시보드에서 연결, `cf builds workers get <script-tag>`로 확인:
repo `junghan0611/homepage`, production branch `main`, 빌드 토큰은 Cloudflare가 자동 생성(좁은 범위),
build caching off(첫 빌드 기준 시간을 재기 위해), preview builds off(GLG는 main push 흐름. 미리보기는
`wrangler versions upload`로 버전 URL을 만든다). **main push = production 배포**다.


- 빌드 명령 `./scripts/build-site.sh`
- 빌드 감시 제외(path excludes): `NEXT.md`, `NEXT--*.md`, `ROADMAP.md`, `CHANGELOG.md`, `AGENTS.md`, `README.md`, `docs/**` — 사이트 산출물에 들어가지 않는 파일만 바뀐 push는 빌드하지 않는다
- 배포 명령: production `npx wrangler@4.144.0 deploy` — package.json이 없어 버전을 명령에 고정한다(고정 전 `npx`는
  매번 최신을 받았다). 올릴 때는 빌드 로그의 wrangler 버전을 보고 이 명령과 이 문서를 같이 바꾼다. 비production
  브랜치 빌드는 꺼져 있다(preview builds off — 검증된 것이 아니라 쓰지 않는 것이다)
- 빌드 변수 `HUGO_VERSION=extended_0.163.3` — `extended_` 접두사가 있어야 extended판이 설치된다(`0.163.3`만 쓰면 일반판, 첫 빌드 `7ce6d0b3`에서 측정). `build-site.sh`가 설치된 Hugo가 이 버전의 extended인지 확인하고, 아니면 멈춘다. 로컬 nix Hugo와 같은 버전이다(Netlify는 0.156.0에 고정했었다)
- 빌드 변수 `GO_VERSION` — go.mod가 `go 1.26`이고 빌드 이미지 기본은 1.24.3이다. `GOTOOLCHAIN=auto`가
  1.26을 받아 올 수도 있지만 측정하지 않았다. 검증한 1.26.x를 명시하고 로그로 확인한다
- `build-site.sh` 첫 줄에 `WORKERS_CI`·`WORKERS_CI_COMMIT_SHA`·`WORKERS_CI_BRANCH`·base URL을, 이어서
  hugo·node·go 버전을 찍는다. `WORKERS_CI=1`인데 `HUGO_VERSION`이 없으면 멈춘다
- `SITE_BASE_URL`이 있으면 Hugo `-b`와 두 산출물 verifier의 origin으로 쓴다. 없으면 apex다

### Workers Builds 측정 (2026-09-30, garden 이전의 선례)

| 빌드 | 커밋 | 결과 | 시간(running→stopped) | 메모 |
|---|---|---|---|---|
| `7ce6d0b3` | `2ab31e3` | 실패 | 27s | `HUGO_VERSION=0.163.3` → 일반판 Hugo 설치, 버전 검사가 멈춤 |
| `dd4d18be` | `0af73e5` | 실패 | 25s | extended 설치됨, 공식 문자열 `v0.163.3-<commit>+extended`를 검사가 거부 |
| `8d4e1f3e` | `50bc9b6` | 성공 | 63s | Hugo 9.6s, modules 1.5s, 업로드 112 files, wrangler 4.144.0 |
| `bc027caf` | `dcb28d6` | 성공 | 65s | build caching on — "No build output / No dependencies detected to cache. Skipping." |

- 빌드 이미지 설치(Node·Go·Hugo)와 컨테이너 기동이 시간의 대부분이다. Hugo 자체는 10초 안팎(로컬 3초대).
- **build caching은 package manager 의존성과 프레임워크 산출물만 캐시한다.** Hugo·Go 모듈은 인식하지 않아
  homepage에는 효과가 없어 껐다. package.json·node_modules가 있는 리포(garden의 Quartz)는 효과가 있을 것이다 — 거기서 측정한다.
- 고정 전 `npx wrangler deploy`는 최신 wrangler를 받았다(측정 4.144.0) → 배포 명령을 `npx wrangler@4.144.0 deploy`로 고정했다.
- 빌드 변수 `WRANGLER_SEND_METRICS=false`로 wrangler 텔레메트리를 끈다(nixos-config의 기기 설정과 같은 선택).
  `bc027caf` 로그에서 텔레메트리 안내 줄이 사라진 것으로 확인했다.
- **빌드 성공 ≠ 라이브 gate**: CI는 배포 전 산출물 verifier까지 돈다. 배포된 응답은
  `node scripts/verify-deployed.mjs https://junghanacs.com`을 오라클에서 따로 돌려 확인한다(노트북은 DNS가 가로채진다).
- 배포 증거: 빌드 로그 안에서 commit SHA와 `Current Version ID`가 이어진다. Worker version metadata에는 commit
  SHA가 없다. 그래서 `build-site.sh`가 커밋을 Hugo에 넘겨(`HUGO_PARAMS_BUILDCOMMIT`, `…BUILDDATE`) **모든 페이지
  푸터**에 `Built from <sha7> · <커밋 날짜>`와 `data-build-commit`을 찍는다. `verify-deployed.mjs <origin> <commit>`이
  `/`·`/ko/`·`/eval/`의 푸터가 그 커밋인지 확인한다. 로컬 빌드는 git HEAD를 쓰고, 수정 파일이나 untracked 파일이
있으면(Hugo가 그것도 읽는다) `+ local changes`를 붙인다. `./run.sh`·`hugo server`는 이 스크립트를 거치지 않아 푸터에
빌드 줄이 없다. 푸터는 정상 콘텐츠 페이지에만 있다(404·alias·`llms.txt`에는 없음). 날짜는 빌드 시각이 아니라 커밋 날짜다.

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
node scripts/verify-deployed.mjs https://junghanacs.com <마지막 성공 빌드의 commit>   # canonical 호스트 + 배포 커밋
# 문서만 바뀐 커밋은 빌드되지 않으므로 HEAD가 아니라 빌드 로그의 commit을 쓴다
```

`verify-deployed.mjs`는 **헤더와 상태 코드의 관문**이고, 커밋 인자를 주면 **배포 커밋의 관문**도 된다. 경로마다
응답 하나를 받아 모든 판정을 그 응답에 한다:
주요 경로 200, Cache-Control directive 중복 없음, Eval 페이지(en/ko)·엔진 릴리즈·런타임의 CSP가
`static/_headers`의 `/eval/*` 값과 정확히 같음, nosniff, 엔진 릴리즈 파일 전부와 런타임 JS의 immutable,
`releases.json`의 max-age=0, 릴리즈의 CORS, `/llms.txt` charset, 없는 경로 404, workers.dev면 noindex·
canonical 호스트면 X-Robots-Tag 없음. 커밋 인자가 있으면 `/`·`/ko/`·`/eval/`의 같은 200 응답에서 푸터 앵커
하나(`<p class=site-build>`, href와 `data-build-commit`이 같은 40자리)를 읽어 기대 커밋과 대조하고, 세 페이지가
같은 전체 SHA인지 본다. 다른 경로의 세대까지 증명하지는 않는다. 푸터는 자기 보고이므로 빌드 로그의
commit→Version ID 기록과 함께 운영 영수증으로 쓴다.

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
