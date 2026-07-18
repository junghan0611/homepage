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
3. ~~**Decide `oldorg` fate**~~ **닫힘(2026-07-13)** — `junghanacs/junghanacs.github.io`는
   GitHub에서 **archive** 했다. README.org와 repo description을 "MOVED → junghan0611/homepage
   (같은 저자·같은 히스토리, 복사가 아니라 이관)" 공지로 갈아끼운 뒤 읽기 전용 전환.
   `oldorg` 리모트는 로컬에 그대로 둔다 — archived 레포도 fetch는 된다.

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

## 소유권 선언 — llms.txt + 자산 등록부 (2026-07-18)

위키독스 미러(`wikidocs.net/book/20676`)가 한국어 검색에서 먼저 잡히기 시작 →
**junghanacs 이름 아래 무엇이 우리 것이고 그중 무엇이 정본인지**를 홈페이지 축에
남겼다. 로컬 반영 완료, 빌드 green, 커밋 전.

1. **`static/llms.txt` 신설** — 홈페이지에 기계 판독 진입점이 아예 없었다(라이브 404
   실측; 가든은 200). *What junghanacs operates* 절이 발행면별 권한을 명시한다:
   homepage=신원·원작 정본, 가든=노트 정본·최신, agenda=대시보드, **위키독스=소유하되
   정본 아님(생성된 발견면)**, GitHub 축은 `junghan0611` 단일, `junghanacs` 조직은 은퇴.
   "여기 없는 면은 우리가 운영하지 않는다"까지 못 박았다.
2. **JSON-LD 자산 등록부** — 홈 그래프에 노드 3개(가든 `WebSite` / agenda `WebSite` /
   위키독스 `Book`), 전부 `author`/`publisher` → `#person`, 미러는 `isBasedOn` → 가든.
   `sameAs`에 넣지 않은 이유와 `@id` 병합 근거는 `docs/semantic-jsonld.md` 자산 등록부 절.
   검증: EN/KO 홈 각 7노드, blog 목록엔 미주입(홈 전용 의도대로).

3. **교차 리뷰 정정 3건**(GPT 검토 → 실측 확인 후 반영):
   - `junghanacs`는 **organization이 아니라 legacy user 계정**(`gh api users/junghanacs`
     → `"type":"User"`, public repo 9). llms.txt·`docs/semantic-jsonld.md`·`AGENTS.md`의
     "조직/organization" 표기를 전부 정정했다. 결론(축은 `junghan0611`)은 불변.
   - "ownership registry" → **publication-authority / provenance registry**.
     `author`/`publisher`는 저작·발행 관계이지 법적 소유권 증명이 아니다.
   - "`Person.sameAs`는 프로필 축" → **"이 사이트의 `Person.sameAs` 배열은 프로필만
     담는다"**로 범위를 좁혔다. 가든은 `Article.sameAs`로 미러를 정당하게 가리킨다.
   - "여기 없는 면은 운영하지 않는다"(깨지기 쉬움) → **"이 등록부는 권한 목록이지
     전수 목록이 아니다; 링크백 없는 재게시는 정본으로 간주하지 않는다"**로 완화.
   - `AGENTS.md`의 라이브 호스트 표기 `www.junghanacs.com` → apex(`www`→301). c29c6c6과
     `docs/semantic-jsonld.md`가 이미 apex 정본인데 AGENTS.md만 낡아 있었다.

**가든 reciprocal — 닫힘(2026-07-18, `notes@ab6db80e`)**: 가든 `content/llms.txt`의
*Author*에 `https://junghanacs.com/`, *Connected Repositories*에 `junghan0611/homepage`가
추가됐다. 모순이 아니라 **llms.txt 채널만 침묵하던 누락**이었고(가든 `Head.tsx`의
`Person.sameAs`엔 이미 있었다), 이제 양방향 완결. *Machine-readable entry points*의
`Home`은 가든 자체 홈이므로 그대로 둔다.

배포 후 외부 validator(`validator.schema.org` / Google Rich Results) sanity 확인.
참고 구현: `git -C ~/repos/gh/notes show f4d26d06 -- quartz/components/Head.tsx`.

## Taxonomy 배지 404 + hextra 버전 (2026-07-18)

- **404 원인은 테마가 아니라 콘텐츠였다.** `content/blog/_index.md`(EN)의 hero-badge가
  `/en/series`·`/en/categories`·`/en/tags`로 링크했는데, `defaultContentLanguageInSubdir`가
  없어 **EN은 루트**다 → `/en/*`는 존재하지 않는 경로. KO는 이미 주석 처리 상태였다.
- **조치**: EN 배지 3개를 주석 처리하되 **되살릴 때를 대비해 경로를 루트 기준으로
  고쳐두었다**(`/series`·`/categories`·`/tags`). 글이 쌓이면 EN/KO 양쪽을 함께 되살린다.
  근거: series 사용 0, categories는 `Blog` 하나 — 눌러도 빈 면이다.
- **taxonomy 자체는 유지**한다. blog 목록의 글 태그 pill(`/ko/tags/posts/` 등)이 실제로
  쓰이므로 `disableKinds`로 끄면 살아있는 링크가 죽는다. 정리한다면 `series`(사용 0)만
  `hugo.yaml`에서 빼는 선택지 — 미실행, GLG 판단.
- **hextra는 버전 업 대상이 아니다**: 최신 릴리스가 `v0.12.3`(2026-05-05)이고 `go.mod`도
  `v0.12.3`. upstream main에 이후 커밋은 있으나 릴리스 전. `tabs` deprecation WARN은
  테마 버전이 아니라 데모 콘텐츠(`content/docs/orghextra/guide/shortcodes/tabs.ko.md`)다.

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
