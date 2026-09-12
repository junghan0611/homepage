# NEXT.md — homepage

Disposable handoff. Read at session start. `AGENTS.md` holds durable facts; this holds the
live plan and the next concrete move.

# NOW — 기술 하네스 글쓰기의 첫 판본

Eval 엔진의 "두 번째 릴리즈 생애주기" detour는 `v2026.9.13`으로 닫혔다 (CHANGELOG 참조).
stem으로 복귀한다. 아래 글쓰기 절이 지금의 작업이다.

**바로 다음 한 수**: `content/blog/20260804T094556.md`·`.ko.md`가 워킹트리에 untracked로
떠 있고 front matter가 `draft: false`다. 그런데 Org 정본
(`~/sync/org/posts/20260804T094556--…org`)은 아직 `#+hugo_draft: t`다. 세 신호가 어긋나 있다:
정본은 초안, export는 발행, 이 문서는 "아직 export 안 함". **누군가 `git add -A` 한 번이면
GLG의 첫 연재 글이 공개된다.** GLG가 발행/보류를 정하고, 어느 쪽이든 세 곳을 같이 맞춘다.

## 남은 후속

- **P2 — `inspectRelease`의 symlink**: named entry를 `lstat`으로 regular file인지 보지 않아
  safe leaf symlink가 릴리즈 루트 밖을 가리킬 수 있다. trusted git source라 `v2026.9.13`
  blocker는 아니었다 (Sol 판정). 다음에 엔진을 손댈 때 닫는다.
- **aionsclubs 채택 영수증 URL**: `llms.txt`·가든 `llms.txt` 모두 상대경로
  `eval/engine/adopted.json`로 적혀 있다. `https://aionsclubs.org/eval/engine/adopted.json`이
  실제로 200이면 exact URL이 더 나은 증거다 (Sol 지적). **확인 전에 적지 말 것.**
- **B에게 전환 신호**: 피드가 200이 된 시점에 한 통 보내기로 약속했다. 지금 200이다.
  보내면 B가 `--online`을 스크랩에서 피드로 바꾸고 이 왕복이 닫힌다.

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

See `CHANGELOG.md`. Most recent: `v2026.9.13` — second-release lifecycle and public authority.
