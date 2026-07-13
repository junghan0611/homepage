# NEXT.md — homepage

Disposable handoff. Read at session start. `AGENTS.md` holds durable facts; this holds the
live plan and the next concrete move.

## NOW — the next concrete move

**Migration to `junghan0611/homepage` complete and tagged `v2026.6.24`** — repo created,
history + doc set pushed, Netlify relinked, build green, `junghanacs.com` (apex; `www`→301)
serving from here. The remaining moves are cleanup, not blockers:

1. **Rename the local folder** `~/repos/gh/blog` → `~/repos/gh/homepage` (GLG does this last,
   once confident — no git impact, only the working-dir name).
2. **Verify the live cutover** — confirm a fresh deploy of `junghanacs.com` reflects a
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

배포 후 외부 validator(`validator.schema.org` / Google Rich Results) sanity 확인.
참고 구현: `git -C ~/repos/gh/notes show f4d26d06 -- quartz/components/Head.tsx`.

## Verify

```bash
git remote -v                       # origin=homepage, oldorg=junghanacs.github.io
hugo --gc --minify                  # local prod build sanity
curl -sI https://junghanacs.com | grep -i server       # Netlify serving (apex canonical, www→301)
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
