# Changelog

CalVer snapshots (`vYYYY.M.D[-suffix]`) of the homepage repo. Past tense — what closed.
`NEXT.md` holds what's next; `ROADMAP.md` holds where it's going.

## Unreleased

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
