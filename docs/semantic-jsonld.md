# semantic-jsonld — homepage JSON-LD 시맨틱 신원층

이 문서는 homepage(Hugo + hextra, `junghanacs.com`)에 JSON-LD 구조화 데이터를
넣기 위한 **기본 구조 + Hugo 경험치**를 모은다. 디테일은 앞으로 더 고민한다 — 여기는
SSOT 규약과 Hugo 특이점을 쌓아두는 자리다. 설계는 Claude + GPT(codex) 공동 숙론으로
1차 잠금(2026-06-25).

배경/철학의 원천은 가든 쪽 botlog
`~/sync/org/botlog/20260404T145500--§garden…json-ld…org` 와, 먼저 출하된 가든 구현
`junghan0611/notes` `git show f4d26d06 -- quartz/components/Head.tsx` 이다. homepage는
그 신원층을 **이식**한다(복붙 아님 — 가든은 TSX, homepage는 Hugo Go 템플릿).

## 왜 — homepage의 정체성

가든(`notes.junghanacs.com`)은 가든대로 간다. homepage는 앞으로 **한국어/영어 듀얼로
힣(GLG)의 글을 담은 "원석 모음"** — 큐레이션된 이중언어 원작 컬렉션이다. 목표는 외부
AI/검색엔진이 이 사이트를 (1) 누가 쓴 글인지(신원), (2) 한 원작의 두 언어 면임을(번역
관계), (3) 가든과 같은 인물임을(크로스도메인) 헷갈리지 않게 읽는 것.

## 기본 그래프 구조 (잠금)

`@graph` + 안정 `@id`. 한 페이지가 여러 노드를 담고, 전 페이지가 같은 `@id`를 가리켜
크롤러/LLM이 속성을 누적 병합한다.

| 범위 | 노드 | 핵심 |
|---|---|---|
| 전 페이지 공통 | `Person` `#person` | alternateName `[GLG, GLGMAN, 힣, 힣맨]`, `knowsAbout`, `knowsLanguage [ko,en]`, 프로필 이미지, **`sameAs`** |
| 전 페이지 공통 | `WebSite` `#website` | `publisher → #person`, `inLanguage ['en','ko']` 고정 |
| 전 페이지 공통 | `Blog` `#blog` | 원작 글 컬렉션의 안정 노드, `isPartOf → #website`, `publisher → #person` |
| 홈(slug=index) | `ProfilePage` | `@id <permalink>#profilepage`, `mainEntity → #person`, `about → #person`, `isPartOf → #website`, `description`, `primaryImageOfPage`(ImageObject 640×640) |
| `/blog/` 목록면 | `CollectionPage` | `@id <permalink>#collectionpage`, `mainEntity → #blog` |
| 글 페이지 | `BlogPosting` | `@id <permalink>#article`, `author/publisher → #person`, `isPartOf → #blog`, `inLanguage`, date/lastmod |

### @id 규칙 — 공통 노드는 origin fragment, 페이지 노드는 언어별 permalink

bilingual에서 핵심. **공통 엔티티(Person/WebSite/Blog)만** origin fragment
`#person`/`#website`/`#blog` 를 전 언어에서 공유한다. **현재 페이지 노드
(ProfilePage/CollectionPage/BlogPosting)는 항상 `.Permalink` 기반 `@id`** 를 쓴다 — EN
home과 KO home이 같은 `@id`를 쓰면 `name`/`description`/`inLanguage`/`url`이 언어별로
충돌 병합된다.

```
EN home       : https://junghanacs.com/#profilepage
KO home       : https://junghanacs.com/ko/#profilepage
EN blog list  : https://junghanacs.com/blog/#collectionpage
KO blog list  : https://junghanacs.com/ko/blog/#collectionpage
글            : <permalink>#article
```

문서의 `#person`/`#website`/`#blog` 는 shorthand다. **실제 JSON-LD `@id`는 항상
absolute URL**(`https://junghanacs.com/#person`)로 emit한다 — base가 모호하면
fragment-only IRI 해석이 도구마다 흔들린다.

**정본 호스트 = apex `junghanacs.com`** (2026-06-27 실측). `www.junghanacs.com`은
`301 → junghanacs.com`. `notes.junghanacs.com`은 별개 사이트(가든, Quartz) —
homepage와 다른 도메인이며 `Person.sameAs`로만 같은 인물임을 잇는다(병합 아님).
`$origin`은 하드코딩 상수가 아니라 **`strings.TrimSuffix "/" .Site.BaseURL`** 로
도출한다 — 그래야 production(=`junghanacs.com`)과 deploy-preview(=`$DEPLOY_PRIME_URL`)
양쪽에서 공통 노드 `@id`와 페이지 노드 `.Permalink`가 같은 호스트로 자기일관된다.

### 신원 (Person.sameAs) — 크로스도메인의 핵심

host가 `www` vs `notes`로 달라 `@id` 자동 병합은 안 된다. **같은 인물임은 `sameAs` +
동일 social profile 집합**으로 박는다.

```
sameAs: [
  "https://notes.junghanacs.com/",            # 가든 — #person fragment 아닌 프로필 URL
  "https://agenda.junghanacs.com/",           # geworfen 어젠다 대시보드
  "https://github.com/junghan0611",
  "https://www.linkedin.com/in/junghan-kim-1489a4306",
  "https://bsky.app/profile/junghanacs.bsky.social",
  "https://fosstodon.org/@junghanacs",
  "https://www.threads.net/@junghanacs"
]
```

재료는 `layouts/_partials/custom/footer.html` 의 소셜 집합 + `hugo.yaml` menu.social.
(후속: 가든 쪽 Person.sameAs에도 `https://junghanacs.com/` 을 reciprocal하게 넣으면
더 단단하다 — homepage 먼저여도 social 집합이 같아 신호는 충분.)

**`github.com/junghanacs` 조직은 sameAs에서 뺐다(2026-07-13).** 가든이
`junghanacs/notes.junghanacs.com` → `junghan0611/garden` 으로 이관되고 Netlify
소스도 relink되면서, 조직에 남은 건 read-only MOVED 저장소 / archived / fork 뿐이다.
활성 저장소가 없는 조직 프로필은 신원 신호가 아니라 죽은 링크에 가깝다 — GitHub 축은
개인 계정 `junghan0611` 하나로 일원화한다. **sameAs는 정체성 프로필 URL이지 저장소
URL이 아니므로** `junghan0611/garden` 같은 repo 링크를 대신 넣지 않는다. 가든의
정체성 면은 이미 `notes.junghanacs.com`이 담당한다.

### 이중언어 (번역 관계)

ko/en 두 면을 **같은 `@id`로 묶지 않는다.** 언어별 `BlogPosting`을 따로 두고 번역
관계로 잇는다.

- KO 원본: `inLanguage: ko`, (쌍 있으면) `workTranslation → {EN #article}`
- EN 번역: `inLanguage: en`, (쌍 있으면) `translationOfWork → {KO #article}`
- 상대 언어는 stub 노드로만: `{ "@id": otherURL+"#article", "@type": "BlogPosting", "url": otherURL, "inLanguage": otherLang }`
- **한국어가 원본(canonical)이라는 사실은 SEO canonical 리다이렉트가 아니라 이 translation
  관계로만 표현한다.** HTML `rel=canonical`은 각 언어 페이지 self-canonical 유지.

## Hugo 경험치 — homepage 특이점 (가든 TSX와 다른 점)

> Hugo는 또 특별하다. 여기에 실측한 사실을 쌓는다.

- **주입점**: `layouts/partials/custom/head-end.html` (hextra의 custom head 훅). 비언더스코어
  `partials/` 경로인데도 빌드 산출물에 반영된다(naver/google verification으로 실측 확인).
  theme `_partials/head.html` 끝에서 `partial "custom/head-end.html"` 호출.
- **테마 중복 없음**: hextra v0.12.3 layouts에 ld+json 파셜이 실질 0. `head.html:28`이
  `partial "schema.html"` 을 호출하나 구조화 데이터를 안 뱉고 빌드는 green. 신선 빌드
  (hugo 0.152.2)에서 ld+json 0개 재확인 → 우리 JSON-LD와 충돌/중복 없음.
- **canonical**: 테마가 `<link rel=canonical href={{.Permalink}}>` self-canonical을 이미
  emit. → 우리는 canonical 안 건드린다.
- **hreflang**: 테마가 **안 뱉는다.** head-end.html에서 추가는 우리 몫 — 단 **실제 언어
  변형이 있을 때만.** 안전한 규칙: `.AllTranslations` 가 2개 이상일 때만 alternates +
  `x-default = EN permalink`. **KO-only 글은 없는 EN URL을 만들지 말 것** — KO self
  alternate만 내거나 hreflang 전체 생략(더 보수적). x-default는 EN 번역면이 실제 존재하는
  translation set에서만.
- **URL 구조**: `hugo.yaml` `defaultContentLanguage: en` + `defaultContentLanguageInSubdir`
  없음 → EN(default)=루트, KO=`/ko/`.
  - EN: `https://junghanacs.com/blog/<slug>/`
  - KO: `https://junghanacs.com/ko/blog/<slug>/`
- **파일 규칙 / 번역 페어링**: `<slug>.md`=en, `<slug>.ko.md`=ko. Hugo가 파일명 suffix로
  자동 페어링하는지 `.Translations` 로 실측 — 안 잡히는 글은 front matter에
  `translationKey: <slug>` 강제.
- **콘텐츠 현실 (중요)**: 지금 `content/blog/` 의 진짜 글들(20240321·20240324)은
  **KO-only다 — EN 번역면이 아직 없다.** sample-template만 ko/en 쌍. "한/영 듀얼"은 GLG가
  앞으로 채울 방향이고, 현시점 그래프는 대부분 KO `BlogPosting` 단독이다. → translation
  속성은 **반드시 `.Translations` 존재 시에만 emit**, 쌍 없으면 생략.
- **빌드타임 합성**: org 원문/콘텐츠는 안 건드린다. Person/WebSite/Blog는 정적,
  per-page 노드는 front matter(`.Title`/`.Description`/`.Date`/`.Lastmod`/`.Lang`/
  `.Permalink`)에서 빌드 시점에 합성.
- **`safeJS` 필수 (이중 인코딩 함정, 2026-06-27 실측)**: `<script
  type="application/ld+json">{{ $jsonld | jsonify }}</script>` 만 쓰면 Go
  `html/template`이 script를 JS 컨텍스트로 보고 jsonify가 반환한 string을 한 번 더
  JS 리터럴로 quote/escape한다 → 산출물이 `"{\"@context\":...}"`(유효 JSON이지만
  string으로 이중 래핑). **`{{ $jsonld | jsonify | safeJS }}`** 로 raw 삽입을 명시해야
  한다. 안전성: `jsonify`는 Go `json.Marshal`(HTMLescape on)이라 `<`/`>`/`&` 를
  `<` 등으로 빼므로 `</script>` breakout은 무해 — `safeJS`를 써도 인젝션 없음.
- **minify가 속성 따옴표 제거 (추출 함정)**: `hugo --minify` 산출물은
  `<script type=application/ld+json>`(따옴표 없음). `public/`에서 rg/grep으로 검증
  추출할 때 `type="application/ld\+json"` 정규식은 안 맞는다 →
  `<script[^>]*ld\+json[^>]*>(.*?)</script>` 처럼 `ld+json` 부분매칭으로 잡을 것.
- **Netlify가 baseURL을 deploy URL로 override (호스트 누출, 2026-06-27 실측)**:
  `netlify.toml`의 production `command = "hugo ... -b ${DEPLOY_PRIME_URL}"`은 라이브
  사이트의 canonical·og:url·`.Permalink`(따라서 페이지 노드 `@id`)를 전부
  `main--<site>.netlify.app`으로 흘린다 → 공통 노드(`$origin`)와 페이지 노드(`.Permalink`)
  호스트가 갈라져 불변식 #2가 깨진다. **production은 override 없이**(hugo.yaml의 고정
  `baseURL` 사용), `$DEPLOY_PRIME_URL`은 `[context.deploy-preview]`/`[context.branch-deploy]`
  에만 둔다. `$origin`을 `.Site.BaseURL`에서 도출하면 두 context 모두 자기일관.

## 불변식 (못 박을 것)

1. **표준 schema.org만** 사용, 조어 금지(크롤러가 noise로 버린다).
2. **안정 `@id` 노드(Person/WebSite/Blog)는 전 언어 페이지에서 값이 흔들리지 않게** 한다.
   언어별 title/description은 현재-페이지 노드(WebPage/ProfilePage/CollectionPage/
   BlogPosting)에만. 언어별 사이트명이 필요하면 `alternateName`(`#authology @junghanacs`
   / `#어쏠로지 @junghanacs`). **페이지 노드는 그 역(逆)** — origin fragment를 공유하지 말고
   언어별 `.Permalink` 기반 `@id`를 쓴다. 모든 `@id`는 absolute URL로 emit(fragment-only
   금지).
3. **언어별 글은 별도 `BlogPosting`** — 같은 `@id`로 병합 금지.
4. **KO 원본성은 canonical이 아니라 `translationOfWork`/`workTranslation`** 으로 표현.
5. **크로스도메인 신원은 `Person.sameAs`** 에 `https://notes.junghanacs.com/` + 동일
   social profiles로 표현.
6. **KO-only 글은 translation 관계를 emit하지 않는다.**
7. **원문 보존**: 콘텐츠/org 원문 수정 없이 빌드타임에만 파생층 합성.

## 검증 루프

```bash
hugo --gc --minify
# public 내 ld+json 추출·중복 확인
rg -n "application/ld\+json|schema.org|BlogPosting|ProfilePage|translationOfWork|workTranslation" public
# 한 KO/EN pair에서 JSON-LD 추출해 jq validate
# validator.schema.org 오류0·경고0
# Google Rich Results Test — Article/ProfilePage 적격 sanity (translation props는
#   Google이 rich feature로 안 써도 KG/LLM엔 의미 있음)
```

규율(가든 botlog 그대로): 자화자찬 금지 — 힣봇끼리의 "훌륭합니다"가 아니라 외부 기계
(validator/Rich Results)의 통과로만 검증한다.

## 앞으로 더 (디테일 TBD)

기본 구조 + `head-end.html` Go 템플릿은 출하(2026-06-27, notes 637ab1 재리뷰 GO).
`.Translations` 실측으로 번역 페어링·KO-only 가드 확인 완료. 남은 디테일:

- **KO ProfilePage description 다국어** — 현재 `or .Description .Site.Params.description`
  fallback인데 `site.Params.description`이 언어별로 안 갈려 KO도 영어 카피. 고칠 땐
  **config side**(hugo.yaml `languages.ko/en.params.description`)로 — 템플릿에 카피
  하드코딩 금지(로직과 카피 분리 유지).
- **/about·/cv·/projects 커버리지** — 화이트리스트가 현재 home/blog만. 인물정체성
  정본면(about)에 최소 `Person`+`WebSite`(AboutPage) 깔 가치. 화이트리스트 확장 후속.
- `WebSite.hasPart → #blog` 넣을지, breadcrumb(`BreadcrumbList`) 추가할지.
- hreflang(`.AllTranslations ≥ 2`일 때만) — JSON-LD 코어와 분리한 별도 후속 커밋.
- 가든 reciprocal sameAs 후속(`notes` Person.sameAs에 `junghanacs.com/`).
- 4월 botlog가 꿈꾼 evidence graph(노트–커밋–시간축)로의 확장 — 신원층은 그 토대.
- 프로필 이미지 자체 사본(현재 가든 크로스도메인 재사용 → homepage og 생기면 승격).
