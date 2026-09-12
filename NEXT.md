# NEXT.md — homepage

Disposable handoff. Read at session start. `AGENTS.md` holds durable facts; this holds the
live plan and the next concrete move.

# RAIL — 현재 좌표

Eval 엔진 — 두 번째 릴리즈 생애주기 (이 세션의 workstream). 글쓰기 stem은 바꾸지 않는다.

- [x] **1. v2026.9.12 production** — 불변 릴리즈 1개 · claim-v1 3-mode · fixture 12-case · production receipt
- [x] **2. Phase 0 NEXT 레인**
- [x] **3. Phase 1 버전 하드코딩 → 파생**
- [x] **4. Phase 2 발견면(`/eval/engine/releases.json`) + 캐시 도메인**
- [x] **5. Phase 3 문서 입구**
- [x] **6. Phase 4 릴리즈 id 문법** — `YYYY.M.D[-<label>.<n>]`, `n`은 그날 통산 순번 (라벨별 카운터 아님)
- [x] **7. Sol HOLD A–C** — 발견 링크, fail-closed shared validator, append-only 피드
- [x] **8. Sol HOLD 재검수 A·B** — strict prefix append-only + rendered robots/sitemap

현재 좌표: 1–8 완료. 다음: Sol 짧은 판정 → GLG 태그·푸시. 발행 후 feed cache/CORS 실측.

P2 (지금 안 함): `inspectRelease`가 named entry를 `lstat`하지 않아 safe leaf symlink가 밖을 가리킬 수 있다. trusted git source라 이번 태그 blocker 아님.

# NOW — Eval 엔진, 두 번째 릴리즈를 낼 자리

- Stem: 홈페이지를 다시 글이 쌓이는 대문으로 만든다 (아래 글쓰기 절). 이 세션은 그 stem을 바꾸지 않는다.
- Detour: Eval 엔진에 "두 번째 릴리즈를 낼 자리"를 만든다. Sol HOLD A–C 로컬은 닫혔다.
- Next: Sol 재검수 후 GLG가 태그·푸시를 정한다. 발행 후 `releases.json` cache/CORS 실측.
- Return: 발행 후 실측이 남았다. 코드로 닫지 말 것.
- Blocker: 없음
- Read: `docs/eval-engine-contract.md`, `data/eval/engine.json`, `static/_headers`, `scripts/build-eval-engine.mjs`
- Do not touch: `static/eval/engine/releases/2026.9.12/` 모든 바이트; `dev/eval/**/receipts/*.json`·`*.png`; `CHANGELOG.md` 과거 항목; untracked `content/blog/20260804T094556.md`·`.ko.md`; `git push`; 태그

## Eval 엔진 — 두 번째 릴리즈 생애주기

어제(2026-09-12) `v2026.9.12`를 production에 올렸고, **두 번째 릴리즈를 낼 자리**가 없다.
의미는 멀쩡하다. 빈 것은 전부 "두 번째"다. 계약 정본은 `docs/eval-engine-contract.md`.
여기에는 작업·rehearsal·발행 후 확인만 적는다.

### 지금 하는 작업

1. Phase 0 — 이 레인 (닫힘).
2. Phase 1 — 파생: verifier, 공통 푸터, content 릴리즈 링크 목록. SSOT는
   `data/eval/engine.json` (단수, 그대로). 버전 문자열이 content에 남으면 실패.
   KO 라벨 유지. 의미 회귀는 module id에 묶는다. content→shortcode가 rendered-HTML
   needle과 충돌하면 중개 id에 보고하고 혼자 정하지 말 것.
3. Phase 2 — `/eval/engine/releases.json` 발견면 + `_headers`에 `max-age=0`·CORS·nosniff
   명시. `releases/index.json` 금지(immutable 와일드카드). 피드 = 릴리즈 디렉터리의
   mutable projection. 별도 원장 금지. `latest`는 알림일 뿐 호환성 약속 아님.
4. Phase 3 — `docs/eval-engine-contract.md`에 discovery ≠ compatibility 절만 정본으로.
   README는 `docs/` 입구. AGENTS는 세 문서와 겹치면 **건드리지 않는다.**
   계약 문서의 기존 `2026.9.12`는 역사/예시일 수 있으니 기계 치환하지 말고, 남긴 이유를
   보고에 한 줄.

각 단계 끝: `./run.sh v` 통과 후 그 단계만 `commit` 스킬. 푸시·태그 없음.

### 다음 릴리즈 rehearsal (Phase 2 완료 조건)

실릴리즈가 하나뿐이면 피드·정렬·열거는 "한 건이 보인다"만 증명한다.
**`static/` 아래에 가짜 릴리즈를 만들지 말 것.** `dev/` 또는 임시 디렉터리 fixture로
최소 두 릴리즈를 구성한다:

- `2026.9.2` 와 `2026.9.12` — 숫자 컴포넌트 정렬. `latest` = `2026.9.12` (사전순이면 실패).
- 각 `manifestSha256`이 실제 바이트와 일치.
- 허용 문법 `YYYY.M.D[-<label>.<n>]` 밖 디렉터리 → 조용히 넘기지 말고 **실패**.

이 테스트가 없으면 Phase 2는 미완.

### 발행 후 확인할 것 (코드로 닫지 말 것)

푸시 이후에만 가능하다. 로컬 게이트가 대체하지 않는다.

```bash
curl -sI https://junghanacs.com/eval/engine/releases.json
# Cache-Control: public, max-age=0
# Access-Control-Allow-Origin: *
# X-Content-Type-Options: nosniff
```

불변 트리 대조: `releases/2026.9.12/manifest.json` 은 계속 `max-age=31536000,immutable` + CORS.

### 검수 체크리스트 (Phase 1–2가 닫을 것)

- [x] feed deterministic generation + `--check`가 byte-exact drift를 잡음
- [x] 모든 release manifest 전수 파싱
- [x] 디렉터리 이름 ↔ `manifest.release` / `basePath` 일치
- [x] `manifestSha256` ↔ 실제 manifest 바이트
- [x] module·conformance artifact 존재와 SHA
- [x] `SHA256SUMS` 검증
- [x] current source ↔ current release byte equality
- [x] 기존 `2026.9.12` 디렉터리 바이트 불변 (작업 전후; `git diff` empty)
- [ ] production feed cache·CORS 실측 ← 발행 후. 위 절.

### 가드레일

- `static/eval/engine/releases/2026.9.12/` 모든 바이트. 추가·수정·삭제 금지.
- `dev/eval/**/receipts/*.json`, `*.png`. 버전이 박혀 있는 게 정상.
- `CHANGELOG.md` 과거 항목.
- untracked `content/blog/20260804T094556.md`·`.ko.md`.
- `git push` 금지. 태그 금지.

---

## Stem (paused) — 기술 하네스 글쓰기의 첫 판본

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

## JSON-LD 시맨틱 신원층 — 출하 완료, 후속 2건

**구현·출하(2026-06-27).** `head-end.html`에 `@graph` 신원층 이식 완료. notes 637ab1
세션 3라운드 재리뷰 GO(블로커 0, 매 라운드 빌드+jq 독립검증). 8페이지 emit 검증
(EN home·blog목록·sample / KO 동일+실글2), taxonomy 누출 0, 번역관계·KO-only 가드 작동.
SSOT는 `docs/semantic-jsonld.md`. 남은 후속:

1. **KO ProfilePage description 다국어** — 현재 `or .Description .Site.Params.description`
   fallback이라 KO도 영어 카피. 고칠 땐 **config side**(hugo.yaml
   `languages.ko/en.params.description`)로 — 템플릿 카피 하드코딩 금지. 가까운 후속(다음 커밋쯤).
2. **/about·/cv·/projects JSON-LD 커버리지** — 화이트리스트가 현재 home/blog만.
   인물정체성 정본면(about)에 최소 `Person`+`WebSite`(AboutPage) 깔 가치. 화이트리스트 확장.
3. (옵션) hreflang `.AllTranslations ≥ 2`일 때만 — JSON-LD 코어와 분리한 별도 커밋.

## Verify

```bash
git remote -v                       # origin=homepage, oldorg=junghanacs.github.io
hugo --gc --minify                  # local prod build sanity
curl -sI https://junghanacs.com | grep -i server       # Netlify serving (apex canonical, www→301)
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

See `CHANGELOG.md` `v2026.6.24` for the closed migration + doc-set work.
