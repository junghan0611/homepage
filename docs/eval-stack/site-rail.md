# 사이트 층 — Clay는 페이지를 주고, 사이트를 안 준다

담당: record `glm-5.3` (세션 시작 meta) · 실제로 돈 모델 **grok** (pi, 2026-09-10, GLM 쿼터 소진 후 교체).
조율: `20260910T105902-b5c352`. 커밋 안 함.

증거: `[실측]` · `[직접 읽음 file:line]` · `[웹 출처 URL]` · `[미확인 추정]`.

---

## 요약 — 유력 판독 (결론 아님)

1. **Clay의 사이트 모드는 Quarto book이다.** `[:html]`로 노트북 여러 개를 한 번에 구우면 파일만 나란히 생긴다 — nav·목록·i18n 없음. book 모드는 `_quarto.yml`까지 쓰지만 이 머신 quarto HTML이 죽어 있다. `[실측 §1]`
2. **flower의 직감(「HTML 후처리」)은 맞다. 도구 선택은 빗나간다.** flower는 pollen식 `◊` 템플릿 SSG이고, 후처리(transformers)는 soupault에서 빌려 왔다. soupault 본체가 그 모델의 정본이다. `[웹 출처 flower README]` `[실측 soupault 5.3.0]`
3. **템플레이팅이 “페이지를 다시 짜는 일”이라면 필요 없다. “껍데기를 심는 일”이라면 필요하다.** Clay가 이미 완전한 HTML을 낸다. 필요한 건 nav / hreflang / footer / JSON-LD 자리를 *바깥에서* 넣는 것이다.
4. 유력 조합: **Hugo를 사이트 셸로 유지하고, Clay 산출은 섬(`static/` 또는 후처리로 껍데기 주입).** Clojure로 사이트 전체를 다시 세우는 대가는 JSON-LD·RSS·i18n·taxonomy를 재구현하는 것이다. 그 대가가 이 판에서 이득인지는 GLG가 고른다.

---

## 1. Clay가 어디까지 주는가 — 실측

### 1.1 다중 노트북, `[:html]`

`dev/eval-stack/clay/usage-site.clj`로 `source-path` 세 개(`index` / `chapter` / `preface`)를 한 `make!`에 넣었다. `[실측]`

```
docs-site/notebooks.index.html
docs-site/notebooks.chapter.html
docs-site/notebooks.preface.html
```

index 페이지 `<nav>` 0. 페이지 간 링크는 노트북 안에 손으로 쓴 마크다운
`[preface](notebooks.preface.html)` 뿐이다. 목록면·footer·언어 전환 없음.
**여러 장을 구워도 사이트가 아니라 파일 묶음이다.**

(산출 HTML은 698KB급이라 측정 후 지웠다. 노트북과 `usage-site.clj`는 남김.)

### 1.2 book 모드 = Quarto

Clay 문서의 book 예는 전부 `:format [:quarto :html]` + `:book {:title …}`.
`[:html]` book은 API에 없다. `[직접 읽음 /tmp/clay-doc.md book 절]`
`make.clj`가 `_quarto.yml`에 `project: {type: book}` 과 `book.chapters`를 쓴다.
`[직접 읽음 clay-2.0.22 make.clj:229-247]`

오늘 실측: qmd 3개 + `_quarto.yml`까지 써지고, `quarto render`가
`Aeson exception: Unknown option "syntax-highlighting"`으로 죽는다.
`[실측]` `[상속: viewer-rail.md 로컬 quarto 1.9.37 HTML 버그]`

고치면 Quarto가 장 간 nav·TOC를 준다. 그래도 **ko/en, JSON-LD, Hugo taxonomy,
homepage footer는 Quarto book의 관심사가 아니다.**

### 1.3 Clay가 주는 것 / 안 주는 것

| | `[:html]` 다중 | Quarto book (로컬 불가) |
|---|---|---|
| 페이지(수식·eval 섬) | ✓ | ✓ |
| 장 간 이동 | ✗ (손 링크) | ✓ (quarto nav) |
| 사이트 nav/목록/태그 | ✗ | ✗ |
| i18n | ✗ | ✗ |
| RSS / JSON-LD | ✗ | ✗ |
| `:post-process`로 껍데기 주입 | ✓ `[상속: clay-spike.md §6]` | (quarto 경로, 미실측) |

---

## 2. flower — 실제로 본 것

정본 Codeberg `jyn514/flower`, GitHub는 read-only 미러.
`/tmp/flower`에 clone. `[실측 git clone]`

README가 스스로 적는다:

- 템플릿 문법 = **pollen** (`◊`) `[웹 출처 README template language]`
- transformers = **soupault에서 빌림**. 「soupault의 설정 양이 싫어서 언어를 줬다」
  `[직접 읽음 /tmp/flower/README.md 165행 근처]`
- `.editorconfig` 커밋 메시지: *give up on soupault; extend flower readme*
  `[웹 출처 codeberg 파일 목록]`
- **pre-alpha**, ninja 빌드 시스템 필수 `[직접 읽음 docs/pages/quickstart.md]`

후처리 모델은 있다. `transformers/title.clj` 예: CSS selector로 `<h1>`을
`<title>`에 복사. `[직접 읽음 docs/pages/guide.md:228-239]`
RSS/Atom을 기능 목록에 넣는다. **i18n·hreflang·언어 서브디렉터리는 문서에 없다**
(grep 0). `[실측 grep README+docs]`

**오늘 못 돌린 이유:** 호스트에 `ninja` 없음. `scripts/run-flower.sh`는
`clojure -M --main flower.main`이고 quickstart가 ninja 설치를 전제한다.
`[실측 which ninja → 없음]`

직감 재측정: 「Clay가 HTML을 내놓으니 페이지를 다시 짜지 말고 바깥을 두르자」는
**soupault의 문장이다.** flower는 그 후처리를 *포함한* Clojure SSG이고, 기본
경로는 마크다운+`◊` 템플릿으로 사이트를 새로 짜는 쪽이다. 「기존 사이트 import」
기능이 있지만 설정이 필요하고, pre-alpha다.

---

## 3. soupault — 그 직감의 실물

soupault 5.3.0 리눅스 바이너리를 `/tmp`에 받아 **generator_mode = false**
(HTML processor mode)로 Clay 흉내 페이지를 돌렸다. `[실측]`

입력: 완전한 HTML (`<article class="doc">…`).
위젯 하나: `insert_html` → `body`에 `<nav id="site-nav">` prepend.

출력: 본문은 그대로, nav만 앞에 붙음. 로그: *Running in HTML processor mode,
not using page templates.* `[실측 /tmp/soupault-spike/build/preface.html]`

OCaml 바이너리, MIT. Clojure 스택이 아니다. **「이미 있는 HTML을 후처리」축의
정본**이고, 오늘 실제로 돌았다.

i18n: 툴이 언어쌍을 모른다. 디렉터리 두 개(`site/` + `site/ko/`)를 우리가
나누면 된다. `[미확인 추정 — 위젯으로 hreflang 삽입은 가능]`

---

## 4. 갈래 비교 — 축은 「HTML 후처리 vs 소스 템플릿」

입력이 이미 HTML(Clay)이라 이 축이 결정적이다.

### A. Hugo 유지 + Clay를 `static/` (또는 후처리 섬)

이미 도는 것 `[직접 읽음]`:

- i18n: `hugo.yaml` `defaultContentLanguage: en`, `defaultContentLanguageInSubdir`
  없음 → **EN=루트 / KO=`/ko/`** `[직접 읽음 hugo.yaml:24-35]`
  `dev/eval-stack/site/`가 그 모양을 재현. `[상속: site-shell.md]`
- JSON-LD `@graph`: `layouts/partials/custom/head-end.html` 화이트리스트
  (홈 / blog 목록 / blog 글) `[직접 읽음 head-end.html:1-16]`
- RSS: Hugo 기본 outputs (현행 계약) `[직접 읽음 homepage AGENTS.md]`
- taxonomy: `hugo.yaml` categories/series/tags `[직접 읽음 hugo.yaml:50-53]`
- 셸 구멍: `site/_generate.py`가 i18n/menu/footer를 homepage 파일에 대응시켜 둠
  `[직접 읽음 site/_generate.py:1-20]`

대가:

- 빌드가 둘 (Hugo + Clay `make!`).
- `static/`에 떨어뜨리면 **Hugo 콘텐츠 모델 밖** — 태그·목록·JSON-LD 화이트리스트에
  안 잡힌다. 섬이다.
- 섬에도 사이트 nav가 필요하면 **후처리 한 겹이 여전히 필요**하다
  (Clay `:post-process` `[상속: clay-spike.md]` 또는 soupault 위젯 `[실측 §3]`).

### B. Clojure 일관 (flower / cryogen / stasis / bootleg)

| 도구 | 축 | i18n | RSS | 오늘 |
|---|---|---|---|---|
| **flower** | 소스 템플릿(`◊`) + soupault풍 transformer | 문서에 없음 | 있다고 함 | ninja 없어 미실행, pre-alpha |
| **cryogen** | md → selmer 템플릿 `[웹 출처 github.com/cryogen-project/cryogen]` | 1급 아님 | 있음 | 미실행. **HTML 입력이 본류가 아님** |
| **stasis** | path→html 함수 `[웹 출처 github.com/magnars/stasis]` | 우리가 짬 | 우리가 짬 | Clay HTML을 slurp해 감싸는 DIY soupault가 됨 |
| **bootleg** | babashka hiccup/selmer | 우리가 짬 | 우리가 짬 | 동 |

공통 대가: JSON-LD `@graph` 계약, `/ko/` 패리티, taxonomy, Umami 자리,
`llms.txt`를 **다시 세운다.** 템플릿 재작성이 “없다”는 말은 셸을 후처리로
넣을 때에만 참이고, cryogen/stasis 기본 경로는 그 반대다.

### 축으로 다시 세우면

```
이미 있는 HTML을 후처리     소스에서 템플릿으로 짠다
─────────────────────     ─────────────────────
soupault  (실측 성공)      Hugo  (지금 사이트 셸)
Clay :post-process         flower ◊  (미실행, pre-alpha)
flower transformers        cryogen / stasis / bootleg
(실행은 못 함)              Quarto book  (로컬 불가)
```

우리 입력(Clay HTML)은 왼쪽 열에 산다. 오른쪽 열은 homepage의 *나머지*
(블로그·about·i18n)가 이미 앉아 있는 자리다.

---

## 5. i18n 한 줄씩

요구: **EN=루트, KO=`/ko/`** (`site/`가 재현, production과 같음)
`[상속: site-shell.md §0]` `[직접 읽음 hugo.yaml:24-35]`

| 후보 | 어떻게 내나 |
|---|---|
| Hugo | 이미 그 모양. `.md` / `.ko.md` 쌍 |
| Clay `[:html]` | 모름. 노트북을 `preface.clj` / `preface.ko.clj`로 나누고 경로를 우리가 정함 |
| Clay Quarto book | quarto `lang` / 다국어 북은 별도 설계 `[미확인 추정]` |
| soupault | 디렉터리 두 개 + 위젯으로 `hreflang`. 언어 엔진 없음 |
| flower | 문서에 i18n 없음 |
| cryogen/stasis | 우리가 경로 규칙을 짬 |

Clay 섬을 `/sicm/` (en) · `/ko/sicm/` (ko)에 두는 것은 A에서도 가능하다.
번역본 노트북이 있느냐가 선행 문제 (결정 5의 다음 갈림).

---

## 6. 템플레이팅이 필요한가 — 물음에 대한 답

GLG: *“이제 clojure 스택이 필요한 거지? 템플레이팅이 필요한가?”*

**페이지를 템플릿으로 다시 짤 필요는 없다.** Clay가 본문·수식·eval 섬을 이미
HTML로 낸다. 그 위에 Hugo/flower/cryogen 본문 템플릿을 씌우면 이중으로 짠다.

**사이트 껍데기를 심는 자리는 필요하다.** nav, 언어 전환, footer, (선택)
JSON-LD. Clay는 그걸 안 준다(`[실측 §1]`). 그 자리를

- Hugo 레이아웃이 메우거나 (마크다운 면)
- HTML 후처리가 메우거나 (Clay 면: `:post-process` / soupault)
- `_generate.py` 같은 구멍이 메운다 (`site/`가 그 증명)

Clojure 스택이 *필요하냐* — 저작(Clay)에는 이미 있다. 사이트 셸까지
Clojure여야 할 이유는 오늘 실측으로 안 닫힌다. 일관성이 이득인지는
「JSON-LD·i18n을 다시 세울 값어치」의 문제다.

---

## GLG가 고를 재료

1. **셸을 어디에 둘까.** Hugo 유지(A) vs soupault로 Clay 섬만 두르기 vs
   사이트 전체를 Clojure SSG로 이전(B).
2. **Clay 섬의 껍데기.** `:post-process` 한 함수 vs soupault 위젯 vs 껍데기 없이
   책 섬(book-viewer.md 산 길).
3. **Quarto book을 살릴까.** 로컬 quarto 수선 전제. 살아도 사이트 i18n은 안 준다.
4. **flower를 더 볼까.** ninja를 넣고 pre-alpha를 감수할 이유가 아직 없다 — 후처리
   모델은 soupault가 오늘 증명했다.

유력 판독(근거 §1+§3+Hugo 현행): **A + 얇은 후처리.** 사이트 계약(JSON-LD,
`/ko/`, RSS)을 버리고 Clojure SSG로 가는 비용이, Clay 페이지 몇 개를 섬으로
넣는 비용보다 크다. 다만 섬이 「홈페이지의 글」로 태그·목록에 잡혀야 한다면
A의 대가가 커지고 B가 다시 열린다.
