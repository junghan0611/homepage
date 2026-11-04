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
| `scripts/build-footer.mjs` | 푸터 빌드 커밋 판독(`footerCommit`) — verify-deployed와 indexnow가 같이 쓴다 |
| `scripts/indexnow.mjs` | 운영자가 고른 정본 URL의 IndexNow 수동 통지. 아래 "IndexNow 수동 통지". 테스트 `scripts/indexnow.test.mjs` |

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

## IndexNow 수동 통지 (운영자 실행)

GLG 결정(2026-11-04): 자동으로 하지 않는다. 빌드·CI·hook·cron 어디에도 붙이지 않는다. 운영자가 정본 URL을 고르면, `scripts/indexnow.mjs`가 그 URL들이 production에서 지정한 커밋으로 서빙되는지 증명하고 `send`일 때만 POST를 한 번 보낸다. 가든(`notes.junghanacs.com`)의 notifier를 참조했지만 host·key·상태·URL 집합은 공유하지 않는다.

- **전역 baseline은 없다.** receipt는 그 batch에서 고른 URL만 기록한다. 고르지 않은 URL은 통지된 것이 아니고, `status`는 이 기기의 기록일 뿐 사이트 전체 통지 상태가 아니다. 다른 기기에서 보낸 기록은 여기 보이지 않는다. IndexNow의 HTTP 200은 수신이지 크롤링·색인이 아니며, 정확히 한 번 전달된다고 주장하지 않는다.
- **명령:**
  - `node scripts/indexnow.mjs candidates [--prefix /projects/]` — 라이브 sitemap URL 목록. GET만, 아무것도 쓰지 않는다.
  - `node scripts/indexnow.mjs check --target <40자리 SHA> --key-file <dir>/<key>.txt /projects/entwurf/ /ko/projects/entwurf/` — 전체 검사. POST·state·log·lock 쓰기 0.
  - `send` (같은 인자) — 검사를 처음부터 다시 하고 POST 1회.
  - `status` — 이 기기의 receipt. 미해결 intent(`unresolved`)와 202·unknown(`maybe_received`)은 정확한 target·URL 집합·request hash로 보여 준다.
  - URL은 인자, `--removed <url>`, 또는 `--urls-file`(한 줄에 `<url>` 또는 `removed <url>`, `#` 주석)로 준다.
- **target:** 운영자가 전체 SHA를 명시한다. 라이브에서 자동으로 채택하지 않는다. 로컬에 있는 commit이면서 `refs/remotes/origin/main`의 조상이어야 한다(자동 fetch 없음). origin/main tip과 같을 필요는 없다. 문서 전용 push는 빌드되지 않으므로 tip이 서빙 SHA보다 앞설 수 있고, 그 차이는 receipt의 `main_tip`·`target_is_main_tip`에 남긴다.
- **입력 URL:** `https://junghanacs.com/…/`만 허용한다. 원문이 그 자체로 WHATWG 직렬화여야 하므로 정규화해서 받아 주지 않는다. www·workers.dev·다른 host·scheme·port·userinfo·query·fragment·끝 `/` 없음·`//`·dot segment·`%2f`/`%5c`/`%2e`·백슬래시·공백은 거부한다. `/path/` 축약은 origin만 붙인다. 중복은 제거하고 개수를 기록하며, 순서와 관계없이 같은 집합은 같은 해시다.
- **검사(하나라도 실패하면 POST 0, 실패한 행만 빼고 보내는 일은 없다):**
  - `verify-deployed.mjs <origin> <target>` exit 0
  - 라이브 sitemap(`/sitemap.xml` index → `/<lang>/sitemap.xml` 자식): 같은 origin, 자식 10개 이하, 중복·순환 없음, XML content-type과 root element, 본문 2MiB 이하, 모든 loc가 정본 형식, loc 중복 없음
  - updated 행: sitemap에 정확히 있고, redirect 미추종 GET 200 `text/html`, 단일 푸터의 `data-build-commit` = target, `+ local changes` 아님, canonical link 정확히 1개 = 그 URL, robots meta·`X-Robots-Tag`에 `noindex`/`none` 없음(대소문자 무관), meta refresh 없음. `<meta>`/`<link>`는 문서 전체에서 읽는다. 속성 순서·대소문자·따옴표 유무와 관계없이 읽고 entity도 해석한다. 중복 속성은 첫 값을 쓰고, meta name은 `robots`와 `*bot`을 본다. 범용 HTML parser는 아니며, 주석·raw text를 모델링하지 않아서 생기는 오차는 거부를 늘리는 쪽으로만 나온다.
  - 라이브 `/<key>.txt`: 200 `text/plain`, 본문이 정확히 key 또는 key+`\n`(SPA·redirect·옛 key 본문 거부)
  - POST 직전 `/` 푸터 재확인
  - POST 뒤에는 첫 updated URL(없으면 `/`)을 다시 읽어 `deploy_after`에 따로 남긴다. 이 재확인이 실패해도 endpoint 응답을 덮어쓰지 않는다. 읽기 사이·POST 중에 배포가 끼어드는 경우는 좁힐 뿐 배제하지 못한다.
- **삭제(removed):** 세 조건을 모두 만족해야 한다. 이 기기에서 이전에 updated로 accepted된 URL이고, 라이브 sitemap에 없고, `Location` 없는 404여야 한다. 제약: 이 기기가 보낸 적 없는 옛 URL은 보내지 않는다(재크롤에 맡기며, 그것을 전송 완료로 표시하지 않는다). 410·alias·3xx로 옮긴 옛 URL은 v1에서 보내지 않는다. 202(received-pending)나 unknown으로 끝난 updated는 삭제 근거가 되지 않는다. 삭제만 있는 batch의 target 증거는 verify-deployed 관문(`/`·`/ko/`·`/eval/` 푸터)과 POST 직전 `/` 푸터다.
- **응답:**
  - 200 `accepted`
  - 202 `received-pending`(key 검증 대기, 수신됐을 수 있음)
  - 429 `rate-limited`
  - 3xx·4xx `rejected`
  - 5xx·timeout·전송 오류 `unknown`(수신됐을 수 있음)
  - 실행 안에서 재전송하지 않는다.
- **cooldown(host 단위, 집합 단위 아님):** 마지막으로 응답이 기록된 시도가 202·unknown이면 endpoint가 답한(또는 전송이 실패한) 시각 `received_at`에서 10분, 429면 `Retry-After`(초 또는 HTTP-date, 형식이 틀리면 10분)를 [10분, 24시간]으로 제한해 기다린다. 같은 target에 같은 집합이 이미 accepted면 거부한다. 부분적으로 겹치는 집합은 고른 그대로 보내고, 겹친 URL을 `overlap_with_accepted`와 stderr로 알린다.
- **기록:** production 경로는 `${XDG_STATE_HOME:-~/.local/state}/homepage-indexnow/` 하나뿐이다. 이 디렉토리(0700)에 `junghanacs.com.receipts.jsonl`(0600)과 `junghanacs.com.lock`(O_EXCL)을 둔다. `--state-dir`·`HOMEPAGE_INDEXNOW_STATE_DIR`은 없으며, 주면 usage로 거부한다. 다른 디렉토리로 cooldown·accepted 이력을 우회하지 못하게 하기 위해서다. 경로를 옮기는 일은 옵션이 아니라 운영자의 이관 판단이다. 모든 stdout receipt에 `receipts_file`을 적는다. HOME·XDG 변조나 사용자가 기록을 지우는 경우까지 막는 보안 경계는 아니다.
  - lock은 기록 읽기부터 intent·POST·result까지 감싼다. 남은 lock은 자동으로 지우지 않는다. lock 파일을 만든 뒤 내용을 쓰지 못하면 `lock-write-failed`(exit 24)로 멈추고 lock은 남긴다.
  - POST 전에 `intent`를 append+fsync한다. intent에는 검증된 updated/removed 목록과 실제 POST 본문의 `request_sha256`이 들어간다(key 자체는 저장하지 않는다). 쓰지 못하면 보내지 않는다(exit 24). 모든 줄은 byte 단위로 전부 쓰고 fsync한 뒤에야 다음으로 넘어간다. short write는 실패로 본다. 파일을 처음 만들 때는 디렉토리도 fsync한다. 기존 파일의 mode는 쓰기 전에 검사한다. 중간에 끊겨 남은 반쪽 줄은 다음 읽기에서 멈춘다.
  - 시각 필드: `at`는 검사 시작, `sent_at`는 intent 시각, `received_at`는 응답 완료나 전송 실패 시각, `recorded_at`는 줄을 쓴 시각이다.
  - POST 뒤에 `result`를 쓴다. 쓰지 못하면 결과는 그대로 두고 exit 24이며, stdout receipt가 1차 증거다.
  - 결과 없는 intent는 미해결(수신됐을 수 있음)이다. 그 뒤의 모든 `check`·`send`는 precondition으로 멈추고, 그 attempt의 target·URL 집합을 오류에 보여 준다. 시간이 지나도 자동 재전송하지 않는다. 운영자가 그 attempt의 stdout과 기록을 검토하고, 어떻게 복구할지는 그 사건 때 GLG가 정한다. 코드가 알 수 없는 상태를 accepted로 수선하는 일은 없고, reconcile 명령도 없다. result의 target·집합·hash가 intent와 다르면 읽기를 멈춘다.
  - lock을 잡은 뒤 멈춘 send는 `refused` 한 줄을 남긴다(인자·key 파일 오류는 lock 전이라 줄이 없다).
  - 손상됐거나 다른 namespace·host의 줄이 있으면 건너뛰지 않고 멈춘다. key는 기록·출력에 남기지 않는다(`<key>`, `key_sha256` 앞 16자리).
- **production/rehearsal:** production은 CLI(`main`)만 고를 수 있다. export된 `run()`은 무엇을 넘겨받든 rehearsal이다. fetch, 관문, production이 아닌 임시 state 디렉토리를 모두 명시해야 하며 `….rehearsal.*` 파일만 읽고 쓴다. 코드는 넘겨받은 fetch가 가짜인지 판별하지 못한다. 거부하는 것은 전역 fetch identity 하나뿐이다. 실제 fetch를 감싼 wrapper를 넘기면 live POST가 나가고 그 기록은 rehearsal 쪽에 남는다. 그래서 rehearsal fixture는 network deny나 loopback 모의 응답으로만 쓰고, 실제 fetch wrapper는 쓰지 않는다. 이것은 운영 규칙이지 코드가 보장하는 것이 아니다. 두 namespace의 분리는 이 계약을 지킬 때만 성립한다. rehearsal이 production 기록을 바꾸지 않는다는 것도, rehearsal이 실제 전송을 하지 않는다는 것도 그 이상으로 보장하지 않는다. fetch identity로는 production을 판정하지 않는다. import 전에 전역 fetch를 바꾸거나 dispatcher mock을 쓰면 identity가 그대로 유지되기 때문이다. 이것은 라이브 CLI와 테스트 fixture를 가르는 계약이지 sandbox가 아니다. 프로세스에 미리 로드된 코드는 무엇이든 할 수 있다. CLI에는 origin·endpoint override가 없다.
- **key:** `--key-file`로 명시 주입한다. 파일명 stem이 key(8~128자 `A-Za-z0-9-`)이고 본문은 정확히 그 key다. 홈페이지 전용 공개 key 파일은 GLG 승인으로 `static/<key>.txt`에 추가했다. 실제 제출은 해당 커밋 배포 뒤 key 응답의 정확한 본문을 확인한 다음에만 한다. 이 검증 key는 공개 파일이며 Cloudflare API 자격증명이 아니다.
- **cap 30:** 고른 send batch에만 적용하는 정책값이다. 품질 기준이나 프로토콜 한도(요청당 10,000)가 아니다. 그보다 크면 거부하므로 검토한 뒤 `--cap`을 준다.
- **exit:**
  - 0 accepted/verified
  - 2 usage
  - 10 not-ready(관문·푸터 SHA·GET 전송 오류)
  - 11 precondition(형식·sitemap·key·git·cap·lock·기록)
  - 12 cooldown
  - 20 received-pending
  - 21 rate-limited
  - 22 rejected
  - 23 unknown
  - 24 로컬 기록 실패
  - 25 accepted이지만 POST 뒤 재확인이 target과 다르거나 실패
- **Google Search Console은 별도 수동 단계다.** `gog gsc sitemaps submit <property> https://junghanacs.com/sitemap.xml`(sitemap index 하나)를 쓰고, property는 `gog gsc sites list`가 보여 주는 실제 값을 쓴다(meta 검증 태그로 property 형태를 추론하지 않는다). IndexNow와 묶지 않으며 영수증도 따로다. 관측(2026-11-04): production sitemap의 lastmod가 전부 배포 커밋 시각이었고 로컬 전체 이력 빌드와 달랐다. 원인(shallow clone 추정)은 미확정이다.
- **테스트:** `node --test scripts/indexnow.test.mjs` — 주입 fetch, 임시 git repo, 임시 state. 네트워크·실제 key·production state 0.

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
