# Changelog

CalVer snapshots (`vYYYY.M.D[-suffix]`) of the homepage repo. Past tense — what closed.
`NEXT.md` holds what's next; `ROADMAP.md` holds where it's going.

## Unreleased

## v2026.9.13-fix.1 — Feed order is a promise, not an inference

Widening release ids to `-<label>.<n>` on the same day handed every consumer a parsing
job the contract never acknowledged. The first external adopter hit it within the hour:
`"2026.9.12-fix.1".split(".").map(Number)` yields `[2026,9,NaN,1]`, and the comparison
returns false without throwing — a watcher that reports "nothing newer" in silence, which
is the failure mode this repository forbids by design.

- Declared `releases[]` array order normative in the discovery feed's guarantee paragraph:
  publication order, oldest first, `latest` always the last element, and a previously
  observed position never displaced by an insertion in front of it. A consumer answers
  "is anything newer than what I adopted" from array position alone; the release-id sort
  rules are how the publisher builds that order, not a procedure a consumer must follow.
- Verified the claim against the bytes a consumer actually reads. `assertFeedOrder` runs
  in the builder, in the rehearsal fixture, and over `public/eval/engine/releases.json`,
  with reversed-order and displaced-`latest` feeds as negative controls. The schema is
  unchanged — no index field — so a consumer already reading the feed is unaffected.
- Pointed the adoption receipt in `llms.txt` and the garden's registry at
  https://aionsclubs.org/eval/engine/adopted.json, measured 200 from both sides, so a
  public claim about an adopter carries a readable receipt.

## v2026.9.13 — Second-release lifecycle and public authority

### Features

- Published `/eval/engine/releases.json`, a mutable discovery feed derived from the
  release-directory ledger, so a consumer can learn that a new engine release exists
  without scraping the shelf page. The feed lives outside `/eval/engine/releases/*` and
  carries `max-age=0`, CORS, and `nosniff`, keeping the mutable discovery surface and the
  year-immutable adoption surface in separate cache domains under one directory.
- Widened engine release identifiers to `YYYY.M.D[-<label>.<n>]` so a second release on
  the same day is possible at all, with `n` a running serial for that date enforced by
  the build, a four-step deterministic sort, and the release-id axis kept explicitly
  separate from the repository's git tags.
- Opened the whole Eval shelf, the SICM reading edition, and the `/javascript/` license
  page to search engines and AI crawlers. `noindex` had shipped as a first-release guard
  and the gate had been enforcing that guard as if it were policy; the gate now refuses
  any Eval page that carries it, and `robots.txt` states the crawl stance the way the
  digital garden already does.
- Covered `/about/` with an `AboutPage` node and moved the site description to
  per-language params, so the Korean home and about pages stop describing themselves in
  English.

### Fixes

- Closed a path escape in the release validator: a module path that merely began with
  the release `basePath` could resolve outside the release root. Paths are now single
  safe leaf filenames rejected before any file is read, alongside real Gregorian date
  validation, a required bare release for any same-day follow-up, an exact directory
  entry set, and duplicate-name rejection in `SHA256SUMS`.
- Made the discovery feed append-only: a previously published `releases[]` must be an
  exact prefix of the next one, so an existing entry cannot be rewritten, removed,
  reordered, or displaced by a backdated insertion.
- Stopped declaring `ai-train=yes` for the whole site. The crawl policy had been copied
  from the garden, which holds only the author's own notes; this site also serves the
  SICM reading edition under an upstream NonCommercial license, and a site-wide training
  grant would purport to re-license work the author does not own.
- Derived every current-release path from `data/eval/engine.json` instead of repeating
  the version across verifiers, the shared page footer, and two hand-maintained locale
  pages whose link lists had already drifted apart.

### Docs

- Separated discovery from compatibility in the engine contract: the feed finds a
  published id, while adoption still closes on an exact manifest, artifact hashes, the
  named runtime pin, and a vendored conformance fixture.
- Registered the Eval shelf in `llms.txt` as a published surface, named its layered
  licenses, and narrowed the import claim to the engine release subtree — the reading
  edition and the experiments are published to be read and run.
- Added the site's own copyright beside the retained hextra starter notice, and declared
  CC BY-NC-SA 4.0 for the original writing in the README, `llms.txt`, and the `Blog` node.
- Recorded the second-release lifecycle in `NEXT.md`, including the rehearsal fixture and
  the checks that only a deployed build can answer.

### Verification

- Added `scripts/verify-jsonld-output.mjs` and wired it into both `./run.sh v` and all
  three Netlify build contexts, with a preview-aware origin. The identity layer had been
  shipping on claims nothing checked.
- Promoted the rendered contract to the gate: Eval routes are parsed for `robots` meta
  and must appear in the per-language sitemaps, so a template or configuration change
  cannot quietly close the shelf again.
- Reused one shared release validator across the feed builder and the rendered-output
  verifier, and exercised it against a two-release rehearsal fixture covering numeric
  sort, malformed identifiers, and the adversarial mutations above.

## v2026.9.12 — SICM reading edition and immutable Eval engine

### Features

- Published complete English and Korean reading editions of the SICM Preface and
  Chapter 1 from pinned `sicm-book@4088864` source, with exact Org source, license,
  translation provenance, anchors, equations, Scheme blocks, footnotes, and all eleven
  original chapter images preserved as separate evidence layers.
- Rendered the full mathematical layer to build-time MathML and added an Emmy-derived
  Figure 1.1 view whose browser cell computes the path, checks a strict book-bound error,
  and draws the accepted 80-point SVG rather than copying an output image.
- Published the Homepage-owned Eval engine at immutable release path
  `/eval/engine/releases/2026.9.12/`: frozen `cell-v1`, separately versioned `claim-v1`,
  conformance fixtures, exact hashes, runtime pins, license, CORS, and immutable caching.
- Opened bilingual engine documentation and browser conformance pages while keeping
  explicit consumers autonomous and free to remain on older immutable releases.

### Fixes

- Repaired upstream Org rendering scars only in generated Hugo pages while leaving the
  pinned source bytes authoritative, and normalized the independently reviewed Korean
  translation without weakening source-structure preservation.
- Replaced fragile substring-only claim checks with explicit scalar, structured-field,
  and fragment assertion modes without changing frozen `cell-v1` compatibility semantics.

### Verification

- Recorded independent bilingual review for every translation segment and real Chromium
  candidate receipts for the computed SICM figure and Scittle keyword-map assertions.
- Passed the production browser gate on English and Korean routes: engine conformance
  PASS, 512 Chapter 1 MathML elements per language, Figure 1.1 maximum error
  `0.00016772069029036274`, 80 SVG points, `book-bound=true`, exact release bytes,
  restricted CSP, CORS, and immutable cache headers.
- Retired the root construction marker only after the production receipt passed, replacing
  a future promise with a current source/runtime/browser-receipt statement.

## v2026.9.11 — Authology and Eval source-first pages

### Features

- Reframed the homepage as **Authology**: refreshed the home statement, Projects
  surface, AX and agenda navigation, and the public publication-authority record
  (`llms.txt` + JSON-LD assets).
- Published the first **Eval** shelf inside Hugo: source-first Markdown/Org/Clojure
  documents, self-hosted pinned browser runtime, editable evaluated cells,
  corresponding-source and license surfaces, SBOM/manifest receipts, and a
  restricted Eval CSP with analytics suppressed.
- Unified Hugo chrome and Eval with local Catppuccin Mocha tokens, a single GLG Mono
  font declaration, and a footer that distinguishes source-first authoring,
  Hugo/Hextra publishing, and browser evaluation without presenting unpublished
  Clay output as a released document.

### Fixes

- Retired empty taxonomy badges that linked to nonexistent `/en/*` routes and loosened
  Korean home-page line height.
- Kept production canonical verification on `junghanacs.com` while allowing preview
  builds to verify against their dynamic deploy origin.

### Verification

- Exact Hugo 0.156 production build, Netlify production build, URL-graph verifier,
  self-hosted Eval cell E2E, CSP/cache headers, source links, and GitHub main-source
  links passed after deployment.

## v2026.6.27-fix.1 — 라이브 호스트 apex `junghanacs.com` 통일

### Fixes

- 라이브 사이트의 3-호스트 불일치를 apex `junghanacs.com`으로 통일. 출하 직후 실측에서
  canonical·og:url·`.Permalink`(→ JSON-LD 페이지 노드 `@id`)가 `main--junghanacs.netlify.app`
  으로 새고, JSON-LD 공통 노드 `@id`는 `www.junghanacs.com`이라 같은 `@graph` 안에서 호스트가
  갈라져 불변식 #2가 깨지던 것을 바로잡음.
  - `netlify.toml`: production 빌드의 `-b ${DEPLOY_PRIME_URL}` override 제거(hugo.yaml의 고정
    `baseURL` 사용). 동적 deploy URL은 `[context.deploy-preview]`/`[context.branch-deploy]`에만.
  - `hugo.yaml` `baseURL`: `www.junghanacs.com` → `junghanacs.com`(apex가 정본, `www`는 301→apex).
  - `head-end.html` `$origin`: 하드코딩 상수 → `strings.TrimSuffix "/" .Site.BaseURL` 도출
    (production·deploy-preview 양쪽에서 공통/페이지 노드 호스트 자기일관).
- `docs/semantic-jsonld.md`: 정본 호스트 apex 명시, Netlify baseURL override 함정 경험치 추가,
  `$origin` 도출 방식 정정.

검증: production 빌드 8페이지 전부 공통+페이지 노드 `@id`·canonical·og:url이 `junghanacs.com`,
`netlify.app` 잔재 0, `Person.sameAs`의 가든 크로스도메인(`notes.junghanacs.com`) 보존.

## v2026.6.27 — JSON-LD 시맨틱 신원층 출하

### Features

- JSON-LD `@graph` 신원층을 `layouts/partials/custom/head-end.html`에 구현. 공통 노드
  `Person`/`WebSite`/`Blog`는 안정 origin `@id`(`#person`/`#website`/`#blog`)를 전 언어에서
  공유, 페이지 노드 `ProfilePage`/`CollectionPage`/`BlogPosting`은 언어별 `.Permalink` 기반
  `@id`로 분리(EN home `#profilepage` vs KO home `/ko/#profilepage`). 홈/blog 목록/blog 글
  화이트리스트, taxonomy·term·404는 제외.
- 크로스도메인 신원: `Person.sameAs` 7개(notes 가든 + `junghan0611`/`junghanacs` GitHub +
  LinkedIn + Bluesky + Mastodon + Threads). 프로필 이미지는 가든 크로스도메인 재사용
  (`notes.junghanacs.com/static/profile.jpg`).
- 이중언어 번역 관계: KO 원본 `workTranslation` / EN 번역 `translationOfWork`, 상대 언어는
  stub 노드(`@id`+`@type`+`url`+`inLanguage`). KO-only 글은 `.Translations` 가드로 translation
  속성 생략.
- WebSite 클린명 `Authology`(전 언어 고정) + `alternateName [authology, 어쏠로지, junghanacs]`;
  `Person.alternateName [GLG, GLGMAN, 힣, 힣맨]`. ProfilePage에 `description` +
  `primaryImageOfPage`(ImageObject 640×640).

### Docs

- `docs/semantic-jsonld.md`: Hugo 경험치에 `safeJS` 이중 인코딩 함정과 minify 속성 따옴표
  제거(추출 시 `ld+json` 부분매칭) 실측 추가. ProfilePage 스펙 행 보강, 출하 후속 항목 정리.
- JSON-LD 시맨틱 정체성 스펙 1차 잠금 — 페이지 노드 `@id` 언어 분리, hreflang x-default 가드,
  불변식 보강 (d02f8f5).
- `NEXT.md`에 주 1편 포스팅 리듬 추가 — 힣 한국어 작성 → 에이전트 영어 번역 (b05fcdf).

### Fixes

- source/edit 링크를 `junghan0611/homepage`로 교정 (7e3c955).

검증: notes 637ab1 세션 3라운드 재리뷰 GO(블로커 0, 매 라운드 빌드+jq 독립검증), 8페이지
valid JSON. 외부 validator(`validator.schema.org`/Rich Results)는 배포 후 sanity.

## v2026.6.24 — homepage 이주 + 문서 세트

### Migration — junghanacs.github.io → junghan0611/homepage

- Created `junghan0611/homepage` (public) on the personal account; pushed full history.
- Remotes: `origin` → homepage, `oldorg` → `junghanacs/junghanacs.github.io` (retained for
  rollback).
- Relinked the Netlify site source repo from `junghanacs.github.io` → `homepage`; domain,
  SSL, and env carried over. `www.junghanacs.com` now builds from the new repo.
- Removed `.github/workflows/pages.yaml` — deploy is Netlify-only, no GitHub Actions.

### Tooling / docs

- Upgraded hextra `v0.12.1 → v0.12.3` (Hugo module); bumped `netlify.toml` HUGO_VERSION
  `0.152.2 → 0.156.0` to match hextra's recommended version.
- `docs(about)`: callout emoji + details color style.
- Converted `README.org` → `README.md`; added the Netlify deploy-status badge.
- Established the agent doc set: `AGENTS.md`, `NEXT.md`, `ROADMAP.md`, `CHANGELOG.md`.

## Pre-CalVer — junghanacs.github.io heritage

Milestones from before the personal-account migration (history preserved on `oldorg`):

- **Blog v0.1 revival** — English default, bilingual `en`/`ko`, remark42 comments.
- Google / Naver Search Console verification; `robots.txt` (Allow + Sitemap).
- GLG-Mono font; hextra upgrades `v0.11.x → v0.12.x`.
- Analytics: Google Analytics → self-hosted Umami.
- Nix flake dev environment; blog ↔ digital-garden split.
- Initial migration onto Hugo + hextra.
