# NEXT.md — homepage

Disposable handoff. Read at session start. `AGENTS.md` holds durable facts; this holds the
live plan and the next concrete move.

# RAIL — 현재 좌표

SSOT: [homepage#3 — Cloudflare Workers 배포](https://github.com/junghan0611/homepage/issues/3). 큰 틀(계정·토큰·DNS·터널·Netlify 해지)은 [nixos-config#11](https://github.com/junghan0611/nixos-config/issues/11) 소관 — 2026-09-30 homepage#2에서 이관.

- [x] 1·2. DNS·Registrar → Cloudflare (nixos-config#11, 2026-09-29)
- [x] **선행 (nixos-config)**: 토큰 `~/.cf-token-glg`, wrangler 4.143.0, GitHub App 연결(GLG 말, 미측정) — 2026-09-30 11:37 인계
- [ ] **실측** `workers.dev` → `docs/` 배포 계약
- [ ] **리포 설정** `wrangler.jsonc`, 빌드 명령, Hugo `0.156.0` 고정
- [ ] **검증** `./run.sh v`, custom hostname
- [ ] **전환 관문** 신·구 비교 → apex 연결 → Netlify 도메인 해제

역할(2026-09-30 GLG): 오라클 = 상시 배포 플랫폼, 노트북 = 켜져 있을 때의 빌드 검수대. nixos-config가 토큰을 준비하면 homepage가 설정·실배포·검증한다.

# NOW — Cloudflare Workers 배포 (#3)

- 브랜치 `cloudflare-workers`: `wrangler.jsonc`, `scripts/build-site.sh`(빌드), `scripts/verify-deployed.mjs`(응답 gate), `docs/deploy-cloudflare.md`(계약), `_headers` 재구조(겹치는 규칙에 같은 헤더 이름 금지, `/ko/eval/*` CSP 추가, llms charset). Sol 교차검토 2회 반영.
- 측정: workers.dev에서 `verify-deployed.mjs` 통과. Netlify production은 `/ko/eval/` CSP 누락으로 실패(이전 전부터 있던 결함 — 전환하면 닫힌다).
- Hugo: GLG 결정으로 0.163.3(로컬 nix와 같음). Workers Builds 빌드 변수 `HUGO_VERSION=0.163.3`, `GO_VERSION`은 1.26.x로 명시해 로그 확인.
- **apex 전환 완료 2026-09-30 12:33 KST** (Version `a46804b7`, 커밋 `84ed799`): apex = Worker custom domain, www = AAAA 100:: proxied + 301 rule, `always_use_https` on. 엣지 측정 정상. 기록·되돌리기는 `docs/deploy-cloudflare.md`.
- **canonical gate 녹색**: 오라클에서 `node scripts/verify-deployed.mjs https://junghanacs.com` 3/3, DoH(Cloudflare·Google) 수렴. **노트북 네트워크는 53번 포트를 가로챈다** (`dig @192.0.2.1`이 답함) — 노트북의 `dig @…`와 로컬 resolver는 신·구가 섞여 나오니 DNS·배포 판정은 오라클이나 DoH로 한다. Netlify DNS zone 삭제는 정리 항목(GLG).
- 남음(#3): 댓글 위젯·애널리틱스 실브라우저 확인(배선은 오라클 curl로 확인), Netlify homepage 사이트 정리(GLG), `cloudflare-workers` → main 머지.
- Next: Workers Builds(Git 연동) — 자격은 GLG 결정 대기(nixos-config 권고 (c) 대시보드 Git 연결 → 자동 빌드 토큰). 연결되면 `cf builds triggers environment-variables upsert`로 `HUGO_VERSION=0.163.3`·`GO_VERSION`, 빌드 로그로 Hugo·Go·wrangler·빌드 시간 측정(garden 이전의 선례). production 브랜치는 main 머지 전까지 `cloudflare-workers`.
- hextra v0.13.0 적용(`220348b`, Sol 검수 4 — 새 회귀 없음). 기존 결함 둘을 별도로 고친다: (1) Eval·`/javascript/` layout에서 hextra menu.js null 오류(sidebar 없음), (2) Mermaid loader 3중(CDN 2 + self-hosted 1, shortcode `<script src>` 본문은 실행 안 됨). 검색을 켤 때는 Eval CSP `connect-src 'none'`과 충돌한다.
- **garden 위험**: `notes.junghanacs.com`도 Netlify(`notes-junghanacs.netlify.app`). 구독 해지 시 사이트가 계속 서빙되는지 미확인 — 사이트·팀·DNS zone은 지우지 않는다.
- 호출: `CLOUDFLARE_API_TOKEN=$(<~/.cf-token-glg) wrangler …` / `cf …` — 전역 export 금지, 토큰 prefix 없이 `cf`를 부르면 GLG OAuth(전권). `cf`는 cwd에 `.cloudflare/`를 쓴다(gitignore됨). 사용법 SSOT는 agent-config `cloudflare` 스킬. 토큰 범위는 정책 원문 기준으로 custom domain·route·Access 모두 있음.
- Do not touch:
  - 커밋 기준으로만 빌드·업로드 — untracked 초안(`draft: false`)이 섞여 공개된다.
  - 공유 `static/_headers`에 Cloudflare 전용 문법(`!`, 절대 URL)을 넣지 않는다 — 산출물에서만(`build-site.sh`).

# 연재 — 기술 하네스 글쓰기 (웹 이전 뒤로 보류된 stem)

Eval 엔진의 "두 번째 릴리즈 생애주기" detour는 `v2026.9.13`으로 닫혔다 (CHANGELOG 참조).

**걸려 있는 한 수**: `content/blog/20260804T094556.md`·`.ko.md`가 워킹트리에 untracked로
떠 있고 front matter가 `draft: false`다. 그런데 Org 정본
(`~/sync/org/posts/20260804T094556--…org`)은 아직 `#+hugo_draft: t`다. 세 신호가 어긋나 있다:
정본은 초안, export는 발행, 이 문서는 "아직 export 안 함". **누군가 `git add -A` 한 번이면
GLG의 첫 연재 글이 공개된다.** GLG가 발행/보류를 정하고, 어느 쪽이든 세 곳을 같이 맞춘다.

## 남은 후속

- **P2 — `inspectRelease`의 symlink**: named entry를 `lstat`으로 regular file인지 보지 않아
  safe leaf symlink가 릴리즈 루트 밖을 가리킬 수 있다. trusted git source라 `v2026.9.13`
  blocker는 아니었다 (Sol 판정). 다음에 엔진을 손댈 때 닫는다.

## 연재 계획 — 기술 하네스 글쓰기

**Stem:** 홈페이지를 다시 글이 쌓이는 대문으로 만든다. 초반 연재는 이직 시장에서도
GLG를 정확히 소개할 수 있도록, 삶 일반론보다 **직접 만든 AI 기술 하네스와 그 설계 판단**을
먼저 다룬다.

- **첫 글은 계속 쓰는 초안:** `~/sync/org/posts/20260804T094556--글쓰기를-시작하기-전에-—-왜-지금-기술-하네스부터-쓰는가__autholog_blogging_career_harness_posts_writing.org`가 한국어 SSOT이며 `hugo_draft: t`다. 주 1편 리듬, 어쏠로그 3~5편 규모·그림 3~5장 이상, 링크·풋노트를 갖춘 자기 완결 에세이의 첫 사례로 천천히 닫는다. 가든 메타/관련노트 그래프는 본문에 넣지 않는다.
- **바로 다음:** GLG 프롬프트를 원문 보존에 계속 추가할 뿐, 아직 한국어 export·영어판·build를 하지 않는다. 본문이 닫힌 뒤 GLG가 한국어를 export하고, 홈페이지 담당이 영어라는 별도 입구를 맡을 수 있다. 첫 주제는 기술 하네스가 아니라 글쓰기와 아무도 읽지 않는 디지털가든을 통해 정체성을 세상에 정리하는 글이다.
- **연재 우선순위:** (1) 이 메타 블로깅 글 — 왜 하네스부터 쓰는가 (준비 완료) → (2) `이름 없는 군단` — 세션의 생애주기·기억·정체성 경계 → (3) `Entwurf는 모두를 지원하지 않는다` — PI 코어·ACP 레일·얇은 mux의 의도된 경계.
- **검증:** 각 글은 가든의 어쏠로그 여러 편을 재료로 삼되, 홈페이지 본문에는 메타노트·그래프 연결을 넣지 않는 독립 에세이여야 한다. 기술 주장에는 실제 설계 선택과 그 대가를 남긴다.
- **가드레일:** 가든을 단순 홍보하거나 기술 스택 목록으로 축소하지 않는다. 의식·인격을 증명한다고 주장하지 않으며, 세션/에이전트의 관계를 관찰과 설계의 언어로 쓴다.

## 포스팅 흐름 — 한국어 원본에서 영문판까지

- **원석과 원본:** GLG와 어쏠로그 중심으로 대화해 `~/sync/org/posts/`에 한국어 원본을 쓴다. 지금의 대화도 메타 블로깅 원석으로 보존한다.
- **내보내기:** `posts/`는 homepage base-dir와 Hextra 규약이 잡힌 curated 수동 export 흐름이다. Org 원본이 SSOT이며, 한 편마다 `org-hugo-export-wim-to-md`를 한 번 실행한다. 세부 계약은 `~/sync/org/.claude/skills/homepage-post/SKILL.md`.
- **영문판:** 한국어 본문이 닫힌 뒤, 에이전트가 의미·톤을 살린 영어판을 만든다. 영어는 직역이 아니라 같은 글의 두 번째 입구다.
- **홈페이지 반영:** `<slug>.ko.md` = 한국어 원본, `<slug>.md` = 영어(default). front matter의 title / description / date를 언어별로 맞춘 뒤 `hugo server -D`와 production build로 확인하고 발행한다.
- **리듬:** 주 1편을 목표로 하되, 기술 하네스 연재의 첫 세 편은 완결도와 구체성을 우선한다.

## JSON-LD 시맨틱 신원층 — 남은 후속

SSOT는 `docs/semantic-jsonld.md`. 출하된 범위는 home / blog 목록 / blog 글 / about이고,
`scripts/verify-jsonld-output.mjs`가 렌더된 HTML에서 그 계약을 검증한다(`./run.sh v`와
Netlify 세 context 모두). KO description 다국어와 `/about/` 커버리지는 `v2026.9.13`에서 닫혔다.

1. **`/cv`·`/projects` 커버리지** — 화이트리스트에 아직 없다. 넣을 때 docs·템플릿·verifier를
   같은 변경으로 함께 옮긴다.
2. (옵션) hreflang `.AllTranslations ≥ 2`일 때만 — JSON-LD 코어와 분리한 별도 커밋.
3. `WebSite.hasPart → #blog`, breadcrumb, 가든 reciprocal `sameAs` — `semantic-jsonld.md` 후속 목록 참조.

## Verify

```bash
git remote -v                       # origin=homepage, oldorg=junghanacs.github.io
hugo --gc --minify                  # local prod build sanity
curl -sI https://junghanacs.com | grep -i server       # Netlify serving until #3 전환 관문 (apex canonical, www→301)
whois junghanacs.com | grep -iE 'Registrar:|Expiry'    # Cloudflare, Inc. / 2028-03-25
./run.sh v                          # Eval source/runtime + Hugo + rendered URL/source/CSP
```

## Blockers / open decisions

- ~~**Domain timing vs garden**~~ **해소(2026-07-13)**: 가든이 `junghan0611/garden`으로
  이관되고 Netlify 소스도 relink됐다(`notes.junghanacs.com` 도메인은 그대로). 옛
  `junghanacs/notes.junghanacs.com`은 "MOVED" read-only. 이에 따라 `junghanacs` 조직은
  활성 저장소 0(MOVED/archived/fork뿐) → **`Person.sameAs`에서 조직 링크 제거**, GitHub
  축은 `junghan0611` 하나로 일원화했다. 근거는 `docs/semantic-jsonld.md` 신원 절.
- **Build WARN (non-blocking)**: `tabs` shortcode `items` / `defaultIndex` params are
  deprecated → use `name` on `tab` / `selected`. Content-side fix, not theme-version. Find
  and migrate the offending pages when convenient.

## Done

See `CHANGELOG.md`. Most recent: `v2026.9.13` — second-release lifecycle and public authority.
