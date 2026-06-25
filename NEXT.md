# NEXT.md — homepage

Disposable handoff. Read at session start. `AGENTS.md` holds durable facts; this holds the
live plan and the next concrete move.

## NOW — the next concrete move

**Migration to `junghan0611/homepage` complete and tagged `v2026.6.24`** — repo created,
history + doc set pushed, Netlify relinked, build green, `www.junghanacs.com` serving from
here. The remaining moves are cleanup, not blockers:

1. **Rename the local folder** `~/repos/gh/blog` → `~/repos/gh/homepage` (GLG does this last,
   once confident — no git impact, only the working-dir name).
2. **Verify the live cutover** — confirm a fresh deploy of `www.junghanacs.com` reflects a
   commit that only exists on `junghan0611/homepage` (e.g. this doc set), proving Netlify
   builds from the new repo, not the old one.
3. **Decide `oldorg` fate** — `junghanacs/junghanacs.github.io` is kept as a rollback safety
   net. Archive it on GitHub once the cutover is trusted for a while; keep the `oldorg`
   remote locally regardless.

## 포스팅 리듬 — 주 1편 (cutover 이후의 진짜 일)

이주는 끝났다. 이제 홈페이지에 **글이 쌓일 때**다. 목표는 **매주 1편** 발행.

- **작성**: 힣(GLG)이 한국어로 초안을 쓴다 → `content/blog/<DenoteID>.ko.md`.
- **번역**: 에이전트가 영어로 옮긴다 → `content/blog/<DenoteID>.md`. 이 홈페이지는
  bilingual(`en` 기본 / `ko`, in-tree i18n)이라 두 파일이 한 글의 두 언어 면이 된다.
- **파일 규칙**: `<slug>.md` = 영어(default), `<slug>.ko.md` = 한국어. slug은 Denote ID
  (`YYYYMMDDTHHMMSS`) 관례. front matter의 `title` / `description` / `date`도 언어별로 맞춘다.
- **흐름**: 한국어 초안 → 영어 번역 → `hugo server -D`로 두 언어 면 확인 → `commit` 스킬로
  커밋 → 발행(Netlify 자동 빌드).
- 번역은 직역이 아니라 의미·톤을 살린 영어 면으로. 한국어 면이 원본(canonical)이다.

## JSON-LD 시맨틱 신원층 — 설계 잠금, 미구현

**가든은 출하했는데 homepage엔 JSON-LD가 전무.** 대문(`www.junghanacs.com`)에도 같은
신원 토대를 이식해 "한/영 듀얼 원석 모음" 정체성을 기계가 읽게 한다. 설계는 Claude+GPT
공동 숙론으로 1차 잠금(2026-06-25) → **SSOT는 `docs/semantic-jsonld.md`** (기본 구조 +
Hugo 경험치 + 불변식 7 + 검증 루프). 디테일은 구현하며 더 채운다.

다음 한 걸음:

1. `docs/semantic-jsonld.md` 따라 `layouts/partials/custom/head-end.html`에 ld+json 주입
   Go 템플릿 초안.
2. `.Translations`/`translationKey` 실측(sample-template ko/en 쌍).
3. 검증 루프 통과(validator 오류0, Rich Results sanity) 후 GPT schema 리뷰.

참고 구현: `git -C ~/repos/gh/notes show f4d26d06 -- quartz/components/Head.tsx`.

## Verify

```bash
git remote -v                       # origin=homepage, oldorg=junghanacs.github.io
hugo --gc --minify                  # local prod build sanity
curl -sI https://www.junghanacs.com | grep -i server   # Netlify serving
```

## Blockers / open decisions

- **Domain timing vs garden**: `notes.junghanacs.com` (garden) still points at the
  `junghanacs/notes.junghanacs.com` repo and is mid-migration to `junghan0611/garden`. That
  is a *separate* Netlify site — homepage cutover does not touch it. Do not remove the
  `junghanacs` org connection until garden's own migration lands.
- **Build WARN (non-blocking)**: `tabs` shortcode `items` / `defaultIndex` params are
  deprecated → use `name` on `tab` / `selected`. Content-side fix, not theme-version. Find
  and migrate the offending pages when convenient.

## Done

See `CHANGELOG.md` `v2026.6.24` for the closed migration + doc-set work.
