# site-shell — 사이트 구성(대문·projects·blog·footer) + i18n ko/en

담당: claude-opus-5 (claudecode, garden id `20260910T122049-f3aa75`, 2026-09-10 KST).
조율: garden id `20260910T105902-b5c352`. 커밋 안 함.
소유: `site/` 전체 + 이 문서. `proto/`·`book/`·homepage 리포는 **읽기만** 했다.

**증거 표기** — [실측] 로컬 Chrome + `http://127.0.0.1:8790` / [직접 읽음 path:line] /
[웹 출처 URL] / [미확인].

**채점 기준은 회수 가능성이다.** §4가 그 표다. 옮길 수 없는 것을 만들면 다시 만들어야 한다.

---

## 0. 만든 것 — 한 눈에

```
site/
├── _generate.py     466행  ← SSG 모양의 구멍. 회수되면 Hugo 가 이 자리를 메운다
├── site.css         231행  ← 셸 전용. proto/style.css 를 @import (복사 안 함)
├── shell.js          44행  ← 테마 토글 + 언어 선택 기억. 그게 전부
├── index.html                 EN 대문        ├── ko/index.html
├── projects/index.html        EN 프로젝트     ├── ko/projects/index.html
├── blog/index.html            EN 블로그 목록  ├── ko/blog/index.html
├── blog/evaluated-page/       EN 글 1편       ├── ko/blog/evaluated-page/
└── about/index.html           EN 소개         └── ko/about/index.html
```

HTML 10장(EN 5 + KO 5). **EN=루트, KO=`/ko/`** — production 과 같은 모양(§3).

**띄우는 법** (리포 루트에서, `site/` 가 아니다 — `site.css` 가 `../proto/style.css` 를 부른다):

```bash
cd ~/repos/gh/lichtung && python3 -m http.server 8790
# http://127.0.0.1:8790/site/      EN
# http://127.0.0.1:8790/site/ko/   KO
```

`file://` 로 직접 열어도 돈다 — 링크가 전부 상대경로다(§3.3).

**검증 [실측]:**

| 항목 | 결과 |
|---|---|
| 내부 링크 전수 검사 | 100개 중 **깨진 것 0** |
| 언어 쌍 대칭 (A→B→A) | 10면 전부 **대칭**, 비대칭 0 |
| 렌더 | EN·KO 대문/목록/글 모두 Chrome 1280×900 에서 확인 |
| 테마 토글 | catppuccin-latte ↔ mocha 실제 전환, 라벨도 뒤집힘 |
| 언어 전환 | `/site/ko/blog/` → `/site/blog/` 실제 이동 |
| i18n 키 패리티 | 생성기가 매번 검사, 어긋나면 생성 전에 죽는다 |

---

## 1. 기준선 — homepage 가 지금 실제로 하고 있는 것

내 요약이 아니라 파일에서 읽은 것만 적는다.

### 1.1 `hugo.yaml` [직접 읽음 ~/repos/gh/homepage/hugo.yaml]

- `defaultContentLanguage: en`, **`defaultContentLanguageInSubdir` 없음**(grep 0건)
  → EN 이 루트, KO 가 `/ko/`. §3의 출발점이다.
- `languages.en` = `Authology` / `languages.ko` = `어쏠로지` (weight 1 / 2).
- `menu.main` 7개 활성: Projects · Blog · About · Notes↗ · AX↗ · Agenda↗ · GitHub
  (+ LinkedIn · Threads↗). 나머지는 주석 처리됨.
- `menu.sidebar` 는 separator 하나 + Notes↗ 하나뿐.
- `taxonomies`: categories / series / tags.
- `params`: umami(셀프호스팅) · remark42(셀프호스팅) · `theme.default: light` + 토글 ·
  `page.width: wide` · `footer.displayPoweredBy: true` · `editURL` · blog 목록의
  tags/categories/series 표시.

### 1.2 `i18n/{en,ko}.yaml` [직접 읽음]

키 15개가 양쪽에 같은 이름으로 있다: `backToTop`, `changeLanguage`, `changeTheme`,
`copyCode`, `copyright`, `dark`, `editThisPage`, `lastUpdated`, `light`,
`noResultsFound`, `onThisPage`, `poweredBy`, `readMore`, `searchPlaceholder`.
**이 파일이 i18n 의 정본이다.** `site/_generate.py` 의 `STRINGS` 가 이 키를 그대로 가져왔다.

### 1.3 `layouts/_partials/custom/footer.html` [직접 읽음]

링크 10개 한 줄: `@junghan0611` · Threads · Bluesky · Mastodon · RSS · Source ·
Garden · Agenda · AX · AIONS. `site/_generate.py` 의 `FOOTER` 가 이것이다.

### 1.4 대문 [직접 읽음 content/_index.md, content/_index.ko.md]

`{{< card >}}` 6장: Blog · Digital Garden · Live Agenda · AX Record · AIONS Clubs · About.
그 위에 h2 한 줄 + 불릿 5개 + 한 문장. **이게 hextra 의 hero+feature grid 자리다.**

### 1.5 URL 구조 — 빌드 산출물로 확인 [실측]

`public/` 을 열어 셌다(로컬 `hugo server` 산출물, 2026-09-09 21:52 KST):

| 경로 | 실측 |
|---|---|
| `public/index.html` | `lang="en"` — **EN 이 루트** |
| `public/ko/` | 117개 파일, `public/ko/index.html` 은 `lang="ko"` |
| `public/en/` | **파일 2개뿐** — `index.html` + `sitemap.xml` |
| `public/{tags,series,categories}` | 루트에 존재(EN), `public/ko/` 아래에도 존재 |

**상속 문장 하나를 정밀하게 고친다.** `content/blog/_index.md` 의 주석은
*"`/en/*`는 존재하지 않는 경로 = 404"* 라고 적는다 [직접 읽음]. 대체로 맞지만 **`/en/` 자체는
404 가 아니다** — Hugo 가 기본 언어 홈에 대해 alias 리다이렉트 한 장을 낸다 [실측]:

```html
<meta http-equiv="refresh" content="0; url=http://localhost:2341/">
```

즉 **`/en/` = 루트로 리다이렉트, `/en/series`·`/en/blog` 등 = 진짜 404.** taxonomy 배지를
껐던 판단 자체는 옳다.
(주의: 위 산출물은 `-b http://localhost:2341` 로 빌드돼 절대 URL 이 localhost 다.
**경로 구조는 신뢰할 수 있고 절대 URL 은 신뢰할 수 없다.** production 은 `netlify.toml` 의
`hugo --gc --minify` 로 `hugo.yaml` 의 baseURL 을 쓴다 [직접 읽음 netlify.toml].)

### 1.6 발견 — KO 면의 메뉴 라벨이 영어다

`hugo.yaml` 에 `menu` 는 최상위에만 있고 **`languages.ko.menu` 오버라이드가 없다**
[직접 읽음, grep 확인]. 결과를 빌드 산출물에서 확인했다 [실측: `public/ko/index.html` 의
nav 앵커]:

```
/ko/          → "어쏠로지"     ← 사이트 제목만 번역된다
/ko/projects  → "Projects"    ← 메뉴는 영어
/ko/blog      → "Blog"
/ko/about     → "About"
```

(KO 빌드에 보이는 "블로그"·"소개" 문자열은 메뉴가 아니라 **대문 카드 제목과 글 제목**이다
— 헷갈리기 쉬워 확인해 두었다 [실측].)

→ `site/` 는 메뉴 라벨을 언어별로 갈라 두었다(`MENU[].label.{en,ko}`). **회수할 때
가져갈 가치가 있는 차이다** — §8 결정 항목.

---

## 2. 설계 원칙 — 왜 이렇게 만들었나

**(a) 셸은 정적 HTML 이다. JS 가 nav·footer 를 그리지 않는다.**
이 사이트의 값어치 절반은 크롤러 판독성(JSON-LD·llms.txt·RSS)이다 [직접 읽음
homepage/AGENTS.md, KONZEPT.md §3(d)]. nav 를 JS 로 그리면 그게 무너진다. 그래서 10장 전부에
같은 머리·꼬리 HTML 이 **중복해서** 들어 있다.

**그 중복이 논증이다.** 손으로 유지할 수 없다는 것이 곧 "여기는 partial 이 와야 한다"는
증거이고, §4가 그 대응표다. 중복을 감추려고 JS 를 쓰면 회수할 때 그 자리가 안 보인다.

**(b) `_generate.py` 는 산출물이 아니라 자리표시자다.**
회수되면 이 파일은 사라지고 Hugo 가 그 일을 한다. 그래서 표 이름을 homepage 의 대응물로
지어 두었다 — `STRINGS`↔`i18n/*.yaml`, `MENU`↔`hugo.yaml menu.main`,
`FOOTER`↔`footer.html`, `PAGES`↔`content/**`.

**(c) `proto/style.css` 를 복사하지 않고 `@import` 한다.**
`site/site.css:14` 가 `@import url("../proto/style.css")`. 복사하면 드리프트한다.
proto 는 동결이고 이 파일은 그것을 **읽기만** 한다 [직접 읽음 site/site.css].
층 관계: proto = org 문서면 + eval 셀, site = 그것을 감싸는 껍데기.

**(d) 셸 규칙은 `@layer` 밖에 둔다.**
`proto/style.css:6` 이 `@layer base, utils, components` 를 선언한다 [직접 읽음]. 레이어
밖 규칙은 레이어 안 규칙을 이긴다 — **`!important` 없이** WebTUI 기본값을 덮을 수 있다.

**(e) 제3자 스크립트 0개.**
homepage/AGENTS.md 가 제3자 트래커를 금지한다 [직접 읽음]. `shell.js` 는 44행이고 바깥과
통신하지 않는다. Umami 는 슬롯 주석으로만 표시했다.

---

## 3. i18n — 제일 어려운 절

### 3.1 라우팅

production 과 같은 규칙을 그대로 구현했다 [실측 §1.5]:

| 언어 | 대문 | 하위면 |
|---|---|---|
| en (기본) | `/` | `/blog/`, `/blog/<slug>/` |
| ko | `/ko/` | `/ko/blog/`, `/ko/blog/<slug>/` |

`_generate.py` 의 `url_for(lang, route)` 한 함수가 이 규칙 전부다. **KO 는 EN 보다 항상
한 단계 깊다** — 이게 아래 모든 문제의 뿌리다.

### 3.2 언어 전환 UI — hextra 와 다르게 만들었다

hextra 는 `<button class="hextra-language-switcher">` 팝업 메뉴를 쓴다
[실측: `public/index.html` 에서 추출]. `site/` 는 **평범한 `<a>` 한 개**를 쓴다:

```html
<a class="lang-switch" href="../../../blog/evaluated-page/"
   hreflang="en" lang="en" title="언어변경">English</a>
```

이유 셋:
1. **크롤러가 읽는다.** 버튼 안의 JS 팝업은 링크가 아니다.
2. **`hreflang` 을 붙일 자리가 생긴다.** homepage 는 지금 `<link rel="alternate" hreflang>`
   를 **내지 않는다** [실측: `public/index.html` 에서 hreflang 매치 0건] — homepage `NEXT.md`
   가 "옵션, 별도 커밋"으로 남겨둔 항목이다 [직접 읽음]. 여기서는 `<head>` 에도 넣었다.
3. 두 언어뿐이라 팝업이 필요 없다. 세 번째 언어가 오면 그때 팝업으로 바꾼다.

**자동 리다이렉트는 하지 않는다.** `shell.js` 는 선택을 `localStorage` 에 기억만 하고 이동은
안 시킨다 [직접 읽음 site/shell.js]. `Accept-Language` 로 자동 이동시키면 크롤러와 직접
링크가 깨진다 — Hugo 도 하지 않는 일이다.

### 3.3 상대경로를 쓴 이유

모든 내부 링크가 상대경로다(`../../../blog/`). 절대경로(`/blog/`)가 아니다.

- 프로토타입은 `/site/` 접두 아래 산다. 절대경로를 쓰면 접두를 지울 때 전부 고쳐야 한다.
- `file://` 로 열어도 돈다.
- **KO 가 EN 보다 한 단계 깊다는 사실이 경로에 그대로 드러난다** — 감추지 않는 편이
  설계 검토에 낫다.

대가: 손으로 쓰기 까다롭다. 그래서 `rel()` 함수가 계산한다. **회수하면 이 문제는 사라진다**
— Hugo 는 `.RelPermalink` 로 절대경로를 낸다.

### 3.4 진짜 어려운 부분 — 구조 패리티

번역 자체가 아니라 **두 언어가 같은 구조를 유지하는지**가 어렵다. 한쪽에만 키가 생기면
그 면은 조용히 영어로 새거나 빈칸이 된다.

`_generate.py` 의 `check_parity()` 가 생성 **전에** 검사하고, 어긋나면 `sys.exit` 로 죽는다:
i18n 키 집합, 메뉴/카드 라벨의 언어별 존재, 글의 `title`/`summary`/`body`/`tags` 전부.

```
$ python3 site/_generate.py
i18n 패리티 OK — 두 언어의 키·라벨·글이 모두 짝을 이룬다
```

**Hugo 는 이걸 안 해준다.** `i18n/ko.yaml` 에 키가 빠지면 조용히 영어로 폴백하고,
`_index.ko.md` 가 없으면 그 면은 KO 에서 사라진다. §8 결정 항목 — 회수할 때 CI 검사 한 줄로
가져갈 수 있다.

### 3.5 KO 면에서 실제로 갈라야 했던 것

| 대상 | EN | KO |
|---|---|---|
| 사이트 제목 | Authology | 어쏠로지 |
| 메뉴 | Projects / Blog / About | 프로젝트 / 블로그 / 소개 ← **homepage 는 지금 영어** |
| 도구 | Change language / Light / Dark | 언어변경 / 밝은 테마 / 어두운 테마 |
| 글 메타 | Posted / Read more → / All posts | 작성 / 더보기 → / 전체 글 |
| 외부 링크 라벨 | Notes ↗ / AX ↗ / Agenda ↗ | 노트 ↗ / AX ↗ / 어젠다 ↗ |
| 고유명사 | GitHub, Threads, Bluesky … | **번역하지 않는다** |

---

## 4. 회수 매핑 — 채점 기준

`site/` 의 각 조각이 Hugo 의 어디로 가는지. **이 표가 이 문서의 목적이다.**

| `site/` 의 무엇 | 회수 후 자리 | 성격 |
|---|---|---|
| `_generate.py` `STRINGS` | `i18n/en.yaml` · `i18n/ko.yaml` | 키 이름을 이미 맞춰 뒀다. 값만 옮기면 된다 |
| `_generate.py` `MENU` | `hugo.yaml` `menu.main` + **`languages.{en,ko}.menu` 신설** | §1.6 — 지금 없는 오버라이드가 필요하다 |
| `_generate.py` `FOOTER` | `layouts/_partials/custom/footer.html` | 이미 존재. 링크 목록 그대로 |
| `_generate.py` `HOME_HERO` + `HOME_CARDS` | `content/_index.md` / `_index.ko.md` 의 `{{< card >}}` | 이미 존재. 마크업만 hextra 쇼트코드로 |
| `_generate.py` `PROJECTS` | `content/projects/_index{,.ko}.md` | 이미 존재 |
| `_generate.py` `POSTS` | `content/blog/<slug>{,.ko}.md` front matter + 본문 | 이미 존재 |
| `_generate.py` `head()` | `layouts/_partials/head.html` (+ 기존 `custom/head-end.html`) | JSON-LD 는 **건드리지 않는다**(§5) |
| `_generate.py` `nav()` | `layouts/_partials/navbar.html` | hextra 오버라이드 |
| `_generate.py` `footer()` | 기존 `custom/footer.html` 확장 | |
| `_generate.py` `render_blog_list()` | `layouts/blog/list.html` | `.Pages` 로 순회 |
| `_generate.py` `render_post()` | `layouts/blog/single.html` | |
| `_generate.py` `url_for()`/`rel()` | **사라진다** — `.RelPermalink`, `.Translations` | Hugo 가 하는 일 |
| `_generate.py` `check_parity()` | CI 스크립트 한 줄 (선택) | Hugo 가 **안 해주는 일**. §8 |
| `site.css` 셸 규칙 | `assets/css/custom.css` | hextra 는 Tailwind(`hx:` 접두) 기반이라 §6-(e) |
| `site.css` 의 `@import "../proto/style.css"` | `assets/css/` 로 함께 회수 | proto 와 site 는 **같이** 회수돼야 한다 |
| `shell.js` 테마 토글 | **사라진다** — hextra 가 이미 제공(`theme.displayToggle: true`) | |
| `shell.js` 언어 기억 | 버려도 된다 | |
| `site/**/index.html` | **전부 사라진다** — Hugo 가 생성 | 산출물이지 소스가 아니다 |

**옮길 수 없게 만들지 않으려고 지킨 것 셋:**
1. 콘텐츠(글·카드·라벨)를 HTML 에 박지 않고 **표에 모았다.** 표는 front matter 로 간다.
2. **URL 규칙을 함수 하나(`url_for`)에 가뒀다.** Hugo 로 갈아탈 때 그 함수만 버리면 된다.
3. **Hugo 가 낼 것을 재구현하지 않았다.** §5.

---

## 5. 비워둔 슬롯 — 재구현 금지

생성된 HTML 에 주석으로 자리만 표시했다. `grep -rn "SLOT:" site/` 로 전부 보인다.

| 슬롯 | 누가 채우나 | 왜 안 만들었나 |
|---|---|---|
| JSON-LD `@graph` 신원층 | `layouts/partials/custom/head-end.html` (195행) | 이미 출하됨. 화이트리스트 = 홈/blog 목록/blog 글. 다시 만들면 두 벌이 된다 |
| RSS (`index.xml`) | Hugo 내장 | |
| taxonomy (tags/categories/series) | Hugo 내장 | 지금 배지는 꺼져 있다(§1.5) |
| `llms.txt` / `sitemap.xml` | `static/llms.txt` + Hugo | |
| Umami 스니펫 | 발행면에서만 | 제3자 트래커 금지 |
| remark42 댓글 | `layouts/_partials/components/comments.html` | 이미 존재 |
| "이 페이지 편집" | Hugo `editURL` | 이미 설정됨 |
| 평가되는 셀 `.org-cell` | `proto/` 의 마크업 계약 | **내 소유가 아니다.** 계약: `data-state`=idle/running/ok/error, 출력은 `.org-cell-out` 텍스트 |

블로그 글 면에 셀 슬롯을 둔 것이 이 판의 요점이다 — **셸이 완성되면 그 자리에 proto 의
셀이 그대로 들어온다.** 마크업 계약을 한 글자도 안 바꿨으므로 붙기만 하면 된다 [직접 읽음
NEXT.md 「공유 마크업 계약」].

---

## 6. 측정된 함정

**(a) WebTUI 가 산문을 아무 데서나 자른다.** [실측]
`@webtui/css@0.1.9` 의 `@layer base` 가 `html, body { word-break: break-all }` 를 건다
(CDN 원본 39,377 B 를 받아서 확인). 코드에는 맞지만 **한국어·영어 산문에서 단어 중간이
잘린다.** 셸은 산문을 담으므로 되돌렸다 — `word-break: normal`, 산문 블록에는
`word-break: keep-all`(한국어를 어절 단위로 끊는다) + `overflow-wrap: anywhere`.
`proto/style.css` 는 이 재정의가 없다 [직접 읽음] — proto 는 짧은 셀 위주라 아직 안 드러났다.
**긴 org 문서를 proto 면에 넣으면 드러날 것이다** [미확인: proto 에서 재현해보지 않았다].

**(b) 한국어 라벨이 메뉴를 무너뜨린다.** [실측]
KO 블로그 목록 1280×900 에서 브랜드 80 + 메뉴 592 + 도구 166 = **838px** 가 필요한데
본문 폭 90ch(=720px)뿐이라 도구가 다음 줄로 밀렸다. 머리띠만 110ch 로 넓혀 해결.
**영어로만 보면 안 나타나는 버그다** — i18n 은 문자열만의 문제가 아니라 폭의 문제다.

**(c) WebTUI `box-=` 유틸이 카드와 안 맞는다.** [실측]
`box-="round"` 는 의사요소로 프레임을 그려서 내 padding·높이와 어긋났다 — 부제 없는 짧은
카드 아래에 여분의 선이 남았다. 테두리를 `1px solid` 로 직접 그려 해결.
`proto/style.css` 의 `.org-cell` 도 같은 방식이다 [직접 읽음].

**(d) light 테마의 메타 텍스트 대비가 낮다.** [실측 + 계산]
`catppuccin-latte` 에서 `--overlay1`(#8c8fa1) on `--base`(#eff1f5) ≈ **3.0:1**. 날짜·태그
같은 보조 정보에만 쓰이지만 WCAG AA 본문 기준(4.5:1) 아래다. 본문(`--subtext0` ≈ 5.3:1)과
제목(`--text` ≈ 7:1)은 통과. **`--overlay1` 을 `--overlay0` 이나 `--subtext0` 로 올릴지는
취향이라 안 건드렸다** — §8.
[미확인: 대비값은 catppuccin 팔레트 hex 로 계산한 것이고 대비 검사 도구를 돌리지 않았다.]

**(e) hextra 는 Tailwind, 우리는 CSS 변수다.** [웹 출처 + 실측]
hextra 산출물의 클래스가 전부 `hx:` 접두 Tailwind 다(`hx:flex hx:flex-wrap …`). 셸을 회수할
때 **두 체계가 한 페이지에 공존한다.** 충돌은 안 나지만(접두가 다르다) 유지보수 부담이
두 배가 된다. §8의 가장 큰 결정이 이것이다.

**(f) CDN 의존.** [실측]
`proto/style.css:7-8` 이 WebTUI 와 catppuccin 을 jsDelivr 에서 `@import` 한다. 오프라인이면
스타일이 통째로 안 온다. 회수 시 `assets/` 로 벤더링할지 결정 필요 — §8.
(라이선스는 둘 다 MIT 로 닫혀 있다 [`docs/attribution.md` §1.6].)

---

## 7. 확인하지 못한 것

1. **Hugo 에서 실제로 빌드해보지 않았다.** §4의 매핑은 homepage 설정·산출물·hextra 산출물을
   읽고 세운 것이지, 이 셸을 `layouts/` 에 넣고 돌려본 결과가 아니다. homepage 리포는
   읽기만 하라는 경계가 있었다.
2. **hextra partial 오버라이드의 정확한 파일명을 확인하지 않았다.** `layouts/_partials/navbar.html`
   은 hextra 구조에서 추정한 이름이다 [미확인]. 회수 전에 hextra 모듈 소스에서 확인해야 한다.
3. **모바일 폭에서 눈으로 확인하지 않았다.** 60ch 미만 미디어쿼리는 넣었지만 1280×900 에서만
   실측했다.
4. **접근성 검사 도구를 돌리지 않았다.** skip-link·`aria-current`·`aria-label` 은 넣었으나
   스크린리더로 확인하지 않았다.
5. **`public/` 산출물은 로컬 `hugo server` 것이다**(baseURL=localhost:2341, 2026-09-09 21:52).
   **경로 구조는 신뢰, 절대 URL 은 불신** — §1.5.
6. **검색(flexsearch)은 손대지 않았다.** homepage 는 `search.enable: false` 다 [직접 읽음].
7. **cv / docs / talks / meta 섹션은 만들지 않았다.** 임무가 지정한 것은 대문·projects·blog·
   footer 넷이다. `docs/` 는 SICM 책 뷰어(grok 축 A)가 들어올 자리라 일부러 비웠다.

---

## 8. GLG 결정 필요

**결정 1 — 셸의 CSS 전략.** (§6-(e)) ← 제일 큰 것
(a) hextra 를 유지하고 `assets/css/custom.css` 로 이 셸을 덧입힌다 → 회수 싸지만 Tailwind
와 CSS 변수 두 체계가 공존. (b) hextra partial 을 통째로 오버라이드해 `hx:` 를 걷어낸다 →
깨끗하지만 hextra 업그레이드 때마다 깨진다. (c) 테마를 떠난다 → 가장 비싸고 가장 자유롭다.
**권고: (a) 로 시작한다.** 대문 한 면만 먼저 갈아입혀 보고 결정한다.

**결정 2 — KO 메뉴 라벨을 번역할 것인가.** (§1.6)
지금 KO 면 메뉴가 영어다. `hugo.yaml` 에 `languages.ko.menu` 를 신설하면 해결된다.
**권고: 한다.** 사이트 제목만 번역되고 메뉴가 영어인 것은 어중간하다.

**결정 3 — 언어 전환을 `<a>` 로 바꿀 것인가.** (§3.2)
hextra 기본은 JS 팝업 버튼. `<a>` 는 크롤러가 읽고 `hreflang` 이 붙는다.
**권고: 바꾼다.** 언어가 둘뿐이라 팝업이 필요 없다.

**결정 4 — `hreflang` 을 낼 것인가.** (§3.2)
지금 안 나간다(실측 0건). homepage `NEXT.md` 가 이미 옵션으로 남겨둔 항목.
**권고: 낸다.** 이중언어 사이트에서 검색엔진에 가장 값싼 신호다.

**결정 5 — i18n 패리티 검사를 CI 에 넣을 것인가.** (§3.4)
Hugo 는 키가 빠져도 조용히 영어로 폴백한다.
**권고: 넣는다.** 스크립트 20행이고, 이중언어를 손으로 유지하는 비용을 가장 크게 줄인다.

**결정 6 — WebTUI/catppuccin 을 벤더링할 것인가.** (§6-(f))
지금은 CDN `@import`. 회수하면 `assets/` 로 옮길 수 있다.
**권고: 벤더링한다.** 발행면이 제3자 CDN 에 매달릴 이유가 없다.

**결정 7 — light 테마 메타 대비를 올릴 것인가.** (§6-(d))
`--overlay1` 3.0:1. **권고: `--overlay0` 으로 한 단계 올린다.** 취향이라 안 건드렸다.

**결정 8 — taxonomy 배지를 되살릴 것인가.** (§1.5)
2026-07-18 에 껐고 경로는 이미 EN 루트 기준으로 고쳐져 있다. 글이 쌓이면 되살린다는 것이
당시 판단이다 [직접 읽음 content/blog/_index.md 주석]. **지금 글 1편 + series 0 — 아직 이르다.**
