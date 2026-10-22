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

## Project content publication — entwurf 0.41.0 (2026-10-22)

- GLG requested a steward update and homepage publication after the 0.41.0 GitHub Release. The scoped content is `content/projects/entwurf/index.md` and `index.ko.md`: long-lived siblings, operator-requested retirement, Pi/Claude Code same-id return in tmux, and a non-authoritative team bookmark. No permanent developer/reviewer identity is assigned.
- The registry was read directly: npm `latest` is 0.41.0, published 2026-10-22 13:37 KST; its integrity matches the preserved accepted candidate. The last Herdr snapshot remains 0.40.0 and does not acquire the new lifecycle features. GitHub release, npm publication and Herdr pin remain separate facts. This observation is not registry-installed native acceptance.
- Existing Org records were updated through Emacs APIs: homepage-linked chronicle `20260520T052051` and a short status link in ledger steward `20260302T191200`. A dated follow-up corrects the earlier inherited npm-pending statement. Org source updates are not a garden export/deployment receipt; no note identity or ledger assignment changed.
- Opus1's read-only product-fact review of both current leaves is B0/D0. Final isolated gate #19620 passed at `/tmp/homepage-entwurf-041-r2.zK5axa`: Hugo/Eval/JSON-LD plus both canonical URLs, language switches, prose wrappers, npm/release/bookmark links and four lifecycle cards. The tracked-source archive contains exactly the two leaf overlays, sandboxed HOME/XDG, and equal before/after leaf and excluded-draft hashes. The two pre-existing unpublished blog drafts stay outside build/commit/publication. Local rendered-output evidence is not visual browser acceptance: no usable local browser/CDP was observed, and no other device was contacted.
- **Published and observed:** homepage source `67605db8fe819029985e36e42c7542ab4c162fc0`, normal main push and agenda stamp completed. Cloudflare build `20eeb2ea-82ea-41df-82c5-7303ddaebb15` succeeded at that SHA. Production gate #19665 passed 21 paths; both `/projects/entwurf/` and `/ko/projects/entwurf/` returned that exact footer SHA, correct canonical URLs and all four lifecycle/npm/bookmark links. Receipt: `/tmp/homepage-entwurf-041-production.DUKBTX/receipt.json`; a copy is retained with the Entwurf release evidence. No browser visual acceptance is claimed.
- **Herdr 0.41.0 snapshot published (source fact, 2026-10-22):** [`v2026.10.22-herdr.0.41.0`](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.22-herdr.0.41.0) → entwurf `addcb8c`, non-Latest; it pins npm `@junghanacs/entwurf@0.41.0` with the registry sha512. Its exact-SHA CI passed and its clean-container install/use/deactivate/reinstall passed at the public `main` ref (not the tag ref, no real pane or model work). Source evidence stays with the Entwurf release records.
- **Current:** the two Entwurf leaves now name that snapshot in the install command, the Herdr guide link and the version boundary, and state Claude Code `>=2.1.306` as a prerequisite. The historical 0.40.0 crossing stays. Awaiting the coordinator's diff review; then an isolated draft-excluded build, then a separately confirmed commit + push. The source project's registry-installed proof and garden Org export are separate follow-ups. Do not re-publish npm or roll out to another device.

## Project content publication — doomemacs-config / nixos-config (2026-10-16)

- GLG directly reviewed and approved both introductions, README update and commit + push in homepage session `20261016T103933-96efd0`. Four new bilingual leaves and two shared project indexes are the publication scope; README now names all five houses. Existing unpublished blog drafts remain excluded and untouched.
- Isolated gate #252 passed: `/tmp/homepage-two-houses.CcDpZP/receipt.json` and `verify.log`. Hugo/Eval/JSON-LD, bilingual project cards, new page metadata/prose wrappers, and all six before/candidate/after hashes passed. This is source/rendered-output evidence, not an automated visual review. GLG's direct review is the acceptance evidence.
- Source stewards reported published releases: [doomemacs-config v2026.10.16](https://github.com/junghan0611/doomemacs-config/releases/tag/v2026.10.16), commit `67fe2f1`; [nixos-config v2026.10.16](https://github.com/junghan0611/nixos-config/releases/tag/v2026.10.16), commit `cb732eb`. Those source releases are not homepage deployment receipts.
- Next after push: verify production against the new homepage commit. Earlier homepage publication `18485d9` was confirmed deployed by GLG directly; no independent production SHA gate was run here.

## Project content handoff — agent-config / final joint gate (2026-10-16)

- **Current publication decision:** GLG directly accepted the rendered result and authorized commit + push in homepage durable session `20261016T103933-96efd0` on 2026-10-16; also approved a README Projects link. This supersedes the historical approval-pending wording below. Publish only the four new leaves, two shared indexes, scoped layout/CSS, AGENTS/NEXT and README; exclude both untracked blog drafts. Next: verify the production response against the pushed commit; build success alone is not a live receipt.

- **Live visual correction accepted by GLG:** GLG still found the page wrong after #5001. Existing Opus a98cac inspected GLG's real Chrome at `http://localhost:2341/projects/agent-config/`: Hextra home omitted `.content`, so preflight reset h2/p/blockquote styling (h2 16px/400/margin0, p margin0). Whitespace reflow was not the visual fix. Added a minimal v0.13.0 `layouts/hextra-home.html` override with block `.content.hextra-home-prose`, preserving upstream hooks, plus scoped not-prose color resets/grid spacing in custom.css. This affects the six project home pages; leaf text is untouched. a98cac reloaded all six real file-backed pages in GLG's Chrome at 688px with no injected probe: restored headings/paragraph spacing/quote borders, preserved hero/button/card colors, and zero document overflow. A further scoped `html[lang="ko"] .hextra-home-prose { word-break: keep-all; }` fixes observed Korean mid-word wrapping; its real-file KO3 recheck passed in the same Chrome tab (688px, reload, probe:false; p/h2/td/li keep-all, break-word fallback preserved, zero horizontal overflow, no mid-word Korean breaks), with final regression #5181 PASS (`/tmp/agent-config-homepage-keepall.pjaoe9uy/receipt.json`, ten file hashes stable before/candidate/after); isolated regression #5128 passed (`/tmp/agent-config-homepage-prose.Z9hs5O/receipt.json`, ten input hashes match before/candidate/after), separately from the now-completed a98cac real-Chrome visual acceptance (six prose pages and the three Korean pages after keep-all, blocker0). Wide desktop, light theme and other browsers remain unmeasured; ko/agent-config was left open for GLG. The ko/entwurf leading middle-dot wrap is a nonblocking pre-existing content observation, not changed here. No publication approval.

- **Formatting follow-up from GLG's browser review completed:** both houses' four leaves use one source line per prose paragraph, separated by one blank line, without fixed-column wrapping or forced hero `<br>` breaks. Wording is unchanged apart from whitespace/break removal; the rule is recorded in AGENTS.md. **Post-reflow gate #5001 PASS**, receipt `/tmp/agent-config-homepage-reflow.AhmlYQ/receipt.json`: all eight hashes match before/candidate/after, full Hugo/Eval/JSON-LD and bilingual meta/navigation checks pass. Rendered paragraph count stays 22 on each page, with zero `<br>` tags (previously agent-config 2 / andenken 1). This checks generated HTML, not a new visual browser observation. The #4884 hashes below describe the pre-reflow candidate. No publication approval was added.

- Agent-config's bilingual home is `content/projects/agent-config/index{,.ko}.md`. Its full-project identity, skills SSOT, continuity, safety/authority and lived proving ground were reviewed with existing Opus a98cac; #16 remains one dated example. Source README and PI-DURABLE current pointers were corrected separately; dated observations remain historical.
- **Final frozen joint gate PASS:** task #4884, private tracked clone at HEAD `87940b5cfe520b35c7910102798475dde9ec512c`, exactly four new leaf files plus two shared indexes overlaid; existing Entwurf leaves unchanged. All eight named input hashes match source-before/candidate/source-after. Receipt: `/tmp/agent-config-homepage-final.2pKP1P/receipt.json`, SHA256 `41c5c6867ab4a8e9356f0d520bdf00fa02260af96154a0d8e12c5e3d385047d0`.
- `./run.sh v` passed Eval/Hugo/output/JSON-LD (EN40/KO113). HTMLParser checks passed both houses' canonical/source/description/steward/Entwurf/language-switch links and all three project cards in both languages. KO card hrefs explicitly use `/ko/projects/.../`; Hextra does not localize literal card links. Theme head hreflang is absent on both languages; actual language-switch anchors work. No global SEO/theme changes were made; existing deprecation warnings remain.
- Andenken's existing Opus review and leaf freeze were accepted; its leaf content remains its steward's property. Shared project indexes were finalized by agent-config. Existing unpublished blog drafts `20260804T094556{,.ko}.md` were excluded and untouched. Real source `public/`, config, theme and deployment code were not changed. **No new commit/push/deployment approval:** wait for GLG's content/publication decision; publish homepage before source/note links or in the same approved window. This does not reopen infrastructure deployment work.

## Project content handoff — andenken (2026-10-16)

- GLG asked the andenken steward to create and maintain `content/projects/andenken/index.md` and `index.ko.md` beside Entwurf. Both project indexes now link the new home; no Entwurf content or site infrastructure was changed. The steward report is Denote `20260319T110800`; implementation/usage remain in the andenken README/run.sh.
- The bilingual pages introduce purpose, three retrieval surfaces, timeline grounding, closed durable-snapshot boundaries and privacy/cost/acceptance limits, not private operational logs. The source steward owns project facts; homepage owns rendering/publication.
- Text review passed with blockers zero. Reflow gate #5001 proved source/HTML properties, not visual repair: GLG's Chrome exposed missing prose styling in the layout. Agent-config owns the scoped `hextra-home` layout/CSS fix and Korean keep-all rule; its Opus a98cac reported actual Chrome reload/probe:false checks on six project pages at 688px and a final KO-three-page recheck at 10:26:26, blockers zero/no overflow. This lane inherits that observation, not an independent browser run; wide desktop/light/other browsers are unmeasured. Final regression #5181 passed Hugo/Eval/output/JSON-LD, metadata/nav/cards, six prose wrappers and ten equal before/candidate/after hashes. The andenken steward directly read its receipt and matched the CSS/layout/leaf hashes; receipt SHA256 `20127bb2bf7a20d4a275d6a544d83055ef947e1b07b12373d231005c32cd1098`. Theme head hreflang remains absent, not a claimed PASS. Old untracked blog drafts were excluded and untouched.
- GLG's one-line prose/single blank-line/no forced hero-break request is complete. Normalized words, metadata, lists, shortcodes and fenced code were preserved apart from intentional `<br>` removal; the final gate above covers these new bytes. No further review/build is queued. Agent-config owns shared indexes and the required scoped layout/CSS fix; andenken owns its unchanged leaves. Any approved homepage publication must include the presentation fix, not just the Markdown. New commit/push/deployment still await GLG: homepage first, then source-document links and Org export (or a coordinated window). Do not sweep in the old blog drafts. This content task does not reopen the deployment workstream below.

# NOW — Cloudflare Workers 배포 (#3)

- 브랜치 `cloudflare-workers`: `wrangler.jsonc`, `scripts/build-site.sh`(빌드), `scripts/verify-deployed.mjs`(응답 gate), `docs/deploy-cloudflare.md`(계약), `_headers` 재구조(겹치는 규칙에 같은 헤더 이름 금지, `/ko/eval/*` CSP 추가, llms charset). Sol 교차검토 2회 반영.
- 측정: workers.dev에서 `verify-deployed.mjs` 통과. Netlify production은 `/ko/eval/` CSP 누락으로 실패(이전 전부터 있던 결함 — 전환하면 닫힌다).
- Hugo: GLG 결정으로 0.163.3(로컬 nix와 같음). Workers Builds 빌드 변수 `HUGO_VERSION=0.163.3`, `GO_VERSION`은 1.26.x로 명시해 로그 확인.
- **apex 전환 완료 2026-09-30 12:33 KST** (Version `a46804b7`, 커밋 `84ed799`): apex = Worker custom domain, www = AAAA 100:: proxied + 301 rule, `always_use_https` on. 엣지 측정 정상. 기록·되돌리기는 `docs/deploy-cloudflare.md`.
- **canonical gate 녹색**: 오라클에서 `node scripts/verify-deployed.mjs https://junghanacs.com` 3/3, DoH(Cloudflare·Google) 수렴. **노트북 네트워크는 53번 포트를 가로챈다** (`dig @192.0.2.1`이 답함) — 노트북의 `dig @…`와 로컬 resolver는 신·구가 섞여 나오니 DNS·배포 판정은 오라클이나 DoH로 한다. Netlify DNS zone 삭제는 정리 항목(GLG).
- 남음(#3): 댓글 위젯·애널리틱스 실브라우저 확인(배선은 오라클 curl로 확인), Netlify homepage 사이트 정리(GLG), `cloudflare-workers` → main 머지.
- **Workers Builds 운영 중** (2026-09-30): main push → 빌드(~60s) → production. 트리거 `a2654efb`, 변수 `HUGO_VERSION=extended_0.163.3`·`GO_VERSION=1.26.5`·`WRANGLER_SEND_METRICS=false`, 배포 `npx wrangler@4.144.0 deploy`, caching off(Hugo·Go 모듈은 캐시 대상 아님), preview builds off, 문서 파일만 바뀐 push는 빌드 제외. 측정·결정은 `docs/deploy-cloudflare.md`. 배포 확인은 오라클에서 `verify-deployed.mjs` — 빌드 성공 ≠ 라이브 gate.
- 후속(#3): `build-info.json`(commit·도구 버전)으로 배포 SHA 증거 강화, `.Site.Data`→`hugo.Data`·tabs shortcode 경고 정리(다음 Hugo 업그레이드 전), Eval menu null·Mermaid loader 결함, 댓글 위젯 실브라우저.
- hextra v0.13.0 적용(`220348b`, Sol 검수 4 — 새 회귀 없음). 기존 결함 둘을 별도로 고친다: (1) Eval·`/javascript/` layout에서 hextra menu.js null 오류(sidebar 없음), (2) Mermaid loader 3중(CDN 2 + self-hosted 1, shortcode `<script src>` 본문은 실행 안 됨). 검색은 쓰지 않는다(GLG 2026-09-30, `search.enable: false` 유지).
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
