# 뷰어 축 — 저작 층과 열람 층, 그리고 남이 푼 문제를 가져오는 일

담당: glm-5.3 (pi, zai, 2026-09-10). 커밋 안 함. 조율: `20260910T105902-b5c352`.
물음: GLG — "SICM 라이브 eval 뷰어 퀄리티", "geworfen식 대시보드가 아니라 **콘텐츠 뷰어**",
"외부 프로젝트가 만든 것을 가져와 구성하는 게 옳은가".

증거 표기: `[실측]` = 이번 세션에서 내가 직접 돌려 봄(환경: thinkpad, OpenJDK 17.0.20,
Clojure CLI 1.12.5.1645, pandoc 3.7.0.2, quarto 1.9.37, Chrome 151, 로컬 `python3 -m
http.server`). `[직접 읽음 file:line]` · `[웹 출처 URL]` · `[미확인 추정]`. 선대 실측은
`[상속: 문서명]`으로 인용 — 나는 재측정한 것만 내 영수증으로 적는다.

---

## 요약 — 유력한 그림 (결론 아님, 판독임)

1. **저작 층과 열람 층은 실제로 갈라져 있고, 만나는 지점은 "값이 어떻게 건너가는가"다.**
   Clerk는 EDN 데이터로 건네고 브라우저 viewer 앱이 전부 그린다. Clay는 JVM에서 HTML로
   다 구워두고, 살아야 하는 부분만 `x-scittle` 태그로 브라우저에 남긴다. `[실측 §1]`
2. **kindly는 코디네이터의 상속 기억 그대로다 — "표시 규약"이 맞고, 우리 계약의 상위
   개념이며, 서로 다른 층이라 충돌하지 않는다.** kinds에 `:kind/tex` `:kind/scittle`
   `:kind/emmy-viewers`가 이미 있다. `[웹 출처 §2]`
3. **Clay 정적 산출물에서 "JVM이 계산한 CAS + 브라우저에서 살아있는 그림 + KaTeX"가
   한 파일 안에 실제로 떴다.** Mafs 좌표 장면과 reagent 셀 `f(5) = 26`이 순수 정적
   서빙에서 렌더됐다. `[실측 §4]`
4. **우리가 손으로 짜던 것(proto)은 "eval 섬"의 원형 실증으로는 성공이지만, 콘텐츠
   뷰어의 뼈대(목차·각주·상호참조·책 폭)에서는 0이다.** 그 뼈대는 Quarto급 발행기가
   이미 푼 문제다. `[실측 §3]`
5. 유력 조합(판독): **kindly 어휘를 값→표기 계약으로 채택하고, 책 뼈대는 발행기에게,
   살아야 하는 셀은 scittle 섬으로.** 저작기로 Clay가 가장 가깝게 그 전부를 잇지만,
   org SSOT와의 간극·daslu CDN·로컬 quarto 버그 세 가지가 걸린다. `[§4 §6]`

---

## 1. 저작 층과 열람 층

### 1.1 두 층이 각각 무엇인가

- **저작 층(JVM)**: Clerk, Clay. REPL에 붙어 `.clj` 노트북 네임스페이스를 평가하고
  발행물을 굽는다. Clerk 스스로 "no editing environment … no external process"라
  적는다 — 만드는 쪽 도구다. `[상속: eval-rail.md §3]`
- **열람 층(브라우저)**: SCI(scittle) + KaTeX + Reagent/React. 정적 파일만으로 돈다.
  `[상속: eval-rail.md §4-v2]` `[실측 재확인 §4]`

### 1.2 두 층이 어디서 만나는가 — 산출물 실측

**Clerk 0.18.1158 `clerk/build!` 산출물 구조** `[실측: /tmp/clerk-spike]`

- `:package :directory` → `index.html`(13.6KB 셸) + `index.edn`(15.8KB 콘텐츠) 두 파일.
  셸이 CDN에서 받는 것: `storage.clerk.garden/nextjournal/clerk-assets@ESbJXy…/viewer.js`,
  `cdn.tailwindcss.com?plugins=typography`, KaTeX 0.13.13 css, bunny fonts.
- `.edn` 안에는 절 트리 TOC, `:nextjournal/viewer` 디스크립터, `:render-fn`(SCI)이
  들어 있다. 즉 **콘텐츠는 데이터로 건너가고 브라우저 앱(viewer.js)이 전부 그린다.**
- 정적 서빙(python http.server)에서 h1·표·Vega-Lite·KaTeX 실제 렌더 확인, TOC는
  데이터에 있으나 이 구성에선 기본 숨김. 페이지에 "Generated with Clerk from
  notebook.clj" 스탬프. `[실측]`
- `:package :single-file`도 **자완결이 아니다** — 여전히 clerk.garden CDN의 viewer.js와
  Tailwind Play CDN(tailwind 공식 문서가 production 부적합으로 명시하는 dev CDN)을
  참조한다. `[실측 out-single/index.html 스크립트 src]`

**Clay 2.0.22 `clay/make!` 산출물 구조** `[실측: /tmp/clay-spike]`

- 기본 `:format [:html]` → **단일 자완결 HTML 1개**(~692KB). 외부 참조는 CDN script
  태그들(jQuery, KaTeX, React, scittle 계열)뿐 — 데이터 파일도 viewer 앱도 없다.
- JVM에서 계산한 값은 HTML로 다 구워 들어가고(아래 §4 emmy 실측), 살아야 하는 셀만
  `<script type="application/x-scittle">` 태그로 남는다. `[실측]`
- 모든 페이지에 `kindly-compute`가 심어진다 — 브라우저 scittle에서 JVM Clay 서버로
  `POST /kindly-compute` 하는 브리지. Clay 서버가 없는 정적 배포에선 조용히 실패
  (error-handler가 console.log). 즉 **서버가 있으면 브라우저→JVM 평가도 이 설계 안에
  이미 있다.** `[직접 읽음 clay-2.0.22.jar scicloj/clay/v2/item.clj:185-205 scittle-header-form]`

### 1.3 Clerk의 뷰어 층만 떼어 쓸 수 있는가

형식상 분리는 돼 있다(html 셸 + edn + viewer.js). 그러나:

- viewer.js는 clerk-assets CDN의 특정 해시에 고정된 컴파일된 cljs 앱이고, edn 스키마는
  `:nextjournal/viewer` 내부 계약이라 **버전 동반이 강제된다.** `[실측 산출물 구조]`
- 룩이 Tailwind 클래스로 viewer.js 안에 굽혀 있다. 껍데기 html의 `tailwind.config`
  정도만 바꿀 수 있다. 우리 룩을 입히려면 viewer.js를 fork해 cljs 앱을 다시 컴파일하는
  길이다. `[실측]` `[미확인 추정 — fork 공수]`
- 판정: **"뷰어만 가져오기"는 Clerk를 통째로 얻는 것과 거의 같고, 뷰어가 필요로 하는
  것(노트북 모델·CDN·Tailwind)까지 딸려온다.**

### 1.4 우리 판에서 둘 다 필요한가

SICM 책 한 권의 물성: 대부분은 죽은 산문+수식+그림이고 살아야 하는 셀은 극소수
(ch1 85개·ch8 83개 Scheme 블록, 나머지 장 0개 `[상속: book-viewer.md §5]`).
**"대부분 구워두고 섬만 산다"는 Clay 모델이 문제 형태에 맞고, "전부를 브라우저 앱이
그린다"는 Clerk 모델은 노트북·대시보드 성격이다.** 다만 GLG의 org SSOT는 둘 다
`.clj`를 저작 포맷으로 전제한다 — 간극은 §6에서.

---

## 2. kindly — 확인과 판정

**상속 기억("표시 규약, 값에 표시 방식을 붙이는 명세")은 사실이었다.** 내 영수증:

- kindly는 "Clojure form/값이 어떤 방식으로 보여야 하는지를 정의하는 표준"이고,
  "blog posts, books, slideshows, reports, dashboards, interactive analyses"를 넘어
  도구 간 복붙 호환을 목표로 한다. 지원 현황: **Clay(완전)**, kind-portal·kind-clerk
  (부분), Cursive/Calva/Clojupyter 지원 작업 중. `[웹 출처
  https://scicloj.github.io/kindly-noted/kindly — Status 절 직접 읽음]`
- 사용법: 값이나 form에 `:kindly/kind` 메타데이터를 붙인다 — `^:kind/md [...]`,
  `(kind/tex "...")` 둘 다 같은 것. 메타데이터를 못 다는 값은 벡터로 싼다.
  `kindly-advice`가 종류를 자동 추론한다(이미지 파일→`:kind/image` 등).
  `[웹 출처 같은 문서 §2.7]`
- **kinds 43종에 `:kind/tex` `:kind/md` `:kind/table` `:kind/vega-lite` `:kind/hiccup`
  `:kind/scittle` `:kind/reagent` `:kind/emmy-viewers`가 전부 들어 있다.**
  즉 "수식으로 보여라/표로 보여라/브라우저에서 평가해라"까지 규약 안에 이미 있다.
  `[웹 출처 같은 문서 §2.6 known-kinds 전체 목록]`
- hiccup 안에서 `'(...)` 심볼 시작 리스트는 `kind/scittle`로, `['(...)]`은
  `kind/reagent`로 자동 인식된다. `[웹 출처 같은 문서 §3.11]`

**우리 `.org-cell` + `data-state` 계약과의 관계 — 판정:**

- 두 계약은 **층이 다르다.** 우리 계약은 뷰어 셸의 DOM 계약이다(셀이 idle/running/ok/error
  로 어떻게 보이고 움직이는가 — `[직접 읽음 dev/eval-stack/proto/eval.js:6-21]`).
  kindly는 값의 표시 의도 계약이다(이 값은 TeX인가 표인가 섬인가).
- 그래서 "버리거나"가 아니라 **종속이 된다**: `.org-cell-out` 안에 무엇을 그릴지를
  kindly 어휘로 정하는 식이다(`:kind/tex` → katex.render, `:kind/table` → 표,
  `:kind/scittle` → 섬). 실제로 sicm-sample.md가 우회했던 "쌍둥이 DOM"(값을 텍스트로
  보여주고 조판은 옆 div) 문제가 바로 이 층이 비어 있어서 생긴 것이다.
  `[상속: sicm-sample.md 「결정 2번의 실물」]`
- 채택 부수효과: kindly로 쓴 노트북은 Clay에서 그대로 돈다(§4 실측). 즉 우리가
  지금 손으로 짜는 표기 계약을 kindly로 옮겨 적으면, 저작 도구 교체 선택권이 열린 채로
  값 표기가 표준화된다.

---

## 3. 콘텐츠 뷰어로서 필요한 것 — proto 실측과 공급 표

### 3.1 proto/sicm.html 오늘 다시 잰 것 `[실측: Chrome 151, localhost:2342]`

셀 4개 전부 `ok`(Γ[q] TeX, 잔차 TeX, 참경로 0, Fig 1.1 오차 `0.00016772069029036274`),
KaTeX 5곳 조판, SVG 3개. — eval 섬으로서는 여전히 산다(선대 실측과 일치).

반면: **TOC 없음 · 각주 0 · 상호참조 앵커 0 · 이미지 0 · 표 0 · 섹션은 sibling
`<details>` 3개(중첩 아님)**. `[실측 DOM 집계]` 접힘 비중첩·TeX 쌍둥이 DOM은 선대
지적 그대로다. `[상속: review-grok.md 남은 것 5]` `[상속: sicm-sample.md]`

책 한 권이 요구하는 것 대비 proto가 스스로 해결한 것은 "셀 계약 + 4상태 표시 + WebTUI
룩"뿐이고, 나머지 전부(아래 표의 상단 6행)가 아직 손으로 지어야 하는 부분이다.

### 3.2 공급 표 — 각 항목을 누가 이미 주는가

| 요구 | 우리 proto `[실측]` | pandoc book `[상속: book-viewer.md]`+`[실측 preface.html]` | Clerk static `[실측]` | Clay [:html] `[실측]` | Clay [:quarto :html] |
|---|---|---|---|---|---|
| 절 구조·중첩 헤딩 | sibling `<details>`만 | h1–h4 정적 | 완전(노트북 셀 단위) | h1/h2 정적 | 완전(책/챕터/부) |
| 목차(TOC) | ✗ | ✗(책척추 nav만) | 데이터로 있음¹ | ✗ | ✓ |
| 접힘 | ✓(sibling) | ✗ | ✗ | ✗ | ✗² |
| 각주 | ✗ | ✓(pandoc footnotes) | ✓(sidenote 모드) | ?³ | ✓ |
| 상호참조·장 간 링크 | ✗ | ✓(LINK_MAP·앵커) | 한 노트북 안 | ?³ | ✓(crossref) |
| 긴 산문 가독 폭 | 우리가 임의로 | 우리가 임의로 | ✓(typography) | 부트스트랩 컨테이너 | ✓ |
| 수식 인라인/디스플레이 | KaTeX(옆 div 우회) | KaTeX 자동 | KaTeX(0.13.13) | KaTeX(kind/tex) | KaTeX(quarto 표준) |
| 그림·이미지 | 수제 SVG | ✓(101/103) | ✓ | ✓ | ✓ |
| 표 | ✗ | 일부 | ✓ | ✓(datatables) | ✓ |
| 코드 셀+출력 | ✓(우리 계약) | 정적 하이라이트만 | ✓(구운 결과) | ✓(구운 결과) | ✓ |
| **셀이 브라우저에서 살아 평가** | **✓(scittle)** | ✗ | 위젯(render-fn) 한정 `[상속: eval-rail.md §2b]` | **✓(kind/scittle)** | ✓(같은 매커니즘, qmd 통과)⁴ |

¹ TOC는 edn에 트리로 있으나 이 빌드에선 `:toc-visibility false`로 숨김. `[실측 out/index.edn]`
² quarto 접힘은 callouts/fold 유사물이 있으나 org식 헤딩 접힘은 아님. `[미확인 추정 — quarto 문서 레벨 확인 필요]`
³ Clay `[:html]` 래퍼의 각주/상호참조는 이번 표본에 없어 미측. markdown→각주는 quarto 포맷에서 온다. `[미확인 추정]`
⁴ kind/scittle 태그가 qmd를 그대로 통과하는 것을 qmd에서 확인. `[실측 docs-quarto/notebook.qmd]`

읽는 방법: **표의 상단(책의 뼈대)은 quarto가, 하단 두 줄(eval 섬)은 우리 proto와 Clay가
각각 이미 가진다.** 어느 한 후보가 전부 갖춘 것은 없다 — Clay[:quarto]가 이론상 전부를
커버하지만 오늘 이 머신에서 html이 안 구워진다(§4).

---

## 4. 후보 실측 비교

### 4.1 무엇이 화면에 떴고 무엇이 안 떴는가

**Clerk 0.18.1158** `[실측 /tmp/clerk-spike]` — 빌드 성공(172ms). 정적 서빙에서
h1·표 2·Vega-Lite·KaTeX 렌더 확인. 안 뜬 것: TOC(숨김), 독자 재평가 창구(근원적으로
없음 `[상속: eval-rail.md §1-3]`). 걸리는 것: 산출물이 clerk.garden CDN의 viewer.js와
Tailwind Play CDN에 의존 — 단일파일 모드도 마찬가지. `[실측]`

**Clay 2.0.22 `[:html]`** `[실측 /tmp/clay-spike]` — 노트북(clj) 1개 평가(7.6s, emmy
컴파일 포함) → 단일 HTML 692KB. 정적 서빙에서:
- `(kind/tex (e/->TeX (e/simplify (e/+ 'x 'x))))` → `2\,x` KaTeX 조판 ✓
- `kind/scittle` + `kind/reagent` → 브라우저에서 scittle이 `(defn f …)` 평가 후
  reagent가 **`f(5) = 26`을 실제 렌더** ✓ (JVM 없이, 순수 정적 파일)
- `kind/emmy-viewers`(`mafs/of-x`) → **Mafs 좌표 장면(축 눈금 라벨·SVG) 렌더** ✓,
  mafs/mathlive CSS 로드 확인. 첫 셀(`{:fx false}` 옵션)은 빈 div로 남음 — 원인
  미상, 내 misuse 가능성 있음 `[미확인 추정]`
- 걸리는 것: scittle 계열 런타임을 `daslu.github.io`(kindly 저자 개인 GitHub Pages)에서
  받는다. `resolve-deps`가 맵 형태 의존성(`:from-the-web`/`:from-local-copy`)을 받아
  **URL은 설정으로 바꿀 수 있다** — 자가호스팅 가능. `[직접 읽음 clay-2.0.22.jar
  scicloj/clay/v2/page.clj:144-152]`
- 안 뜬 것: TOC 없음, 노트북이 4MB급 emmy 번들(`scittle.emmy.js` 다운로드 380ms
  `[실측 network entries]`)을 쓰는 경우 페이지가 무거워짐 — 섬을 극소수로 골라야
  한다는 book-viewer.md §5 결론과 일치.

**Clay 2.0.22 `[:quarto :html]`** `[실측]` — qmd 생성까지는 성공(TOC·front matter
구조 포함, kind/scittle 태그가 `{=html}` 블록으로 통과). **그러나 quarto render가
실패한다: 이 머신의 quarto 1.9.37이 어떤 문서든 HTML로 못 굽는다** — 최소 qmd 한 줄
짜리도 `Aeson exception: Unknown option "syntax-highlighting"`, exit 1. gfm은 정상.
`quarto check install`에서 같은 예외. 즉 **환경(패키지) 버그이지 Clay의 잘못이
아니다.** nix 쪽 quarto 버전 교체/핀 변경으로 열 수 있는 길로 보인다. `[미확인 추정 —
수선 방법]`

**Portal 0.67 / Reveal** `[웹 출처 README 직접 읽음]` — Portal은 "A clojure tool to
navigate through your data"(REPL 값 검사기), Reveal는 "Read Eval Visualize Loop"(JVM
데스크톱 값 브라우저). 둘 다 **발행되는 문서 면이 없다 — 콘텐츠 뷰어 후보가 아니다.**
kindly 생태계가 kind-portal 어댑터(부분 동작)를 유지할 뿐이다. `[웹 출처
https://scicloj.github.io/kindly-noted/kindly Status]`

**scittle 단독(우리 proto)** `[실측 재확인]` — 오늘도 4셀 전부 `ok`. 가장 작고 우리
손안에 있으나, §3.2 표의 상단 전부를 우리가 지어야 한다.

**그 밖**: maria.cloud `[상속: eval-rail.md §7 미확인 유지]`, clj-tiles(블록 기반,
선례로만) `[상속: eval-rail.md §2d]`, Uniorg/Orga(파서는 있으나 뷰어 아님)
`[상속: doc-format-rail.md §4]`, emmy-viewers(MIT, mafs/mathbox/mathlive — Clay
안에서 실측함).

### 4.2 JVM이 어느 시점에 필요한가 — 빌드타임/런타임 판정

| 후보 | 빌드타임 JVM | 열람 시 JVM | 근거 |
|---|---|---|---|
| Clerk static | 필요(clerk/build!) | **불필요** | `[실측: python 서빙에서 전부 렌더]` |
| Clay `[:html]` | 필요(clj 평가) | **불필요** | `[실측: 정적 파일에서 f(5)=26 렌더]` |
| Clay 서버 모드(live-reload·kindly-compute) | — | 필요(상시 서버) | 선택 사양. 정적 산출과 같은 페이지가 서버 없이도 선다. `[실측 산출물 구조]` |
| 우리 proto | 불필요(CDN) | 불필요 | `[상속: eval-rail.md §4-v2]` |
| pandoc book | 불필요(python+pandoc) | 불필요 | `[직접 읽음 dev/eval-stack/book/build.py]` |

**GLG의 "로컬에서 잘 만들면 호스팅은 다 가능하다"는 모든 유력 후보에서 참이다 —
열람에 JVM이 필요한 길은 없다.**

### 4.3 라이선스 한 줄표 `[웹 출처 GitHub API + README]`

scittle EPL-1.0 · Clay EPL-1.0 · kindly EPL-2.0 · emmy-viewers MIT · **Emmy GPL-3.0**
(상속 판정 유지 `[상속: review-grok.md §3]`). Emmy 번들을 실어 굽는 페이지의 배포
조건은 법 판단이 필요한 자리 — 여기선 표기만.

---

## 5. 시인성 — 남의 뷰어를 쓰면 남의 룩이 따라오는가

- **Clerk**: 룩이 viewer.js(컴파일된 cljs+Tailwind) 안에 굽혀 있다. 셸에서 폰트/다크
  모드 정도만. 우리 룩 = fork. **가장 뜯기 어렵다.** `[실측 산출물 구조]`
- **Clay `[:html]`**: 산출물이 평범한 HTML+부트스트랩 css. `:post-process`(산출 HTML
  문자열 후처리) 설정 훅과 `:from-local-copy` 의존성이 있어 **수술 여지는 있다.**
  셀 마크업에 inline style이 많아 CSS 덮어쓰기보다 post-process가 실용적. 중간.
- **Clay `[:quarto :html]`**: quarto SCSS 테마 변수 + 사용자 CSS가 정식 면 — 커스텀
  룩 설계 자리가 가장 넓다. 단 이 머신 quarto 수선 전제. `[웹 출처 quarto 테이밍
  문서, 로컬 실측은 quarto 버그로 불가]`
- **scittle 단독(proto)**: 룩이 전부 우리 style.css — WebTUI 4상태·org 표기가 이미
  실측돼 있다. 남의 룩이 없는 대신 뼈대도 전부 우리 몫. `[상속: review-grok.md §1]`
- **Portal/Reveal**: 발행면 자체가 없어 해당 없음.

한 줄 총괄: **룩의 자유는 "직접 짜기 > quarto > clay-html > clerk" 순**이고, 그 대가는
뼈대를 누가 주느냐(정반대 순서)다. 이 교환 곡선이 채택 조건의 본체다.

---

## 6. 유력 판독과 열린 결정

**내 판독(유력 순):**

1. **값 표기 어휘는 kindly를 채택하는 게 유력.** 검증 끝난 표준이고, 우리 셸 계약과
   충돌하지 않으며(§2), Clay와의 상호운용이 공짜로 열린다. 우리 proto의 쌍둥이 DOM
   문제도 이 어휘로 풀린다.
2. **책 뼈대(TOC·각주·상호참조·폭)는 손으로 짜지 않는 게 유력.** 이미 quarto급
   발행기가 푼 문제이고, proto 실측이 보여주듯 그 비용이 만만치 않다. 다만 발행기가
   quarto일 필요는 없다 — book-viewer.md §6의 "Hugo static 산 길"(pandoc HTML을
   Hugo static에 두고 메뉴만)도 같은 뼈대를 유지하는 더 싼 길이다. `[상속: book-viewer.md §6]`
3. **살아야 하는 셀은 scittle 섬(kind/scittle)으로 굽는 게 유력.** Clay가 저작→열람
   전 축을 이미 잇는 실측 영수증이 있고(§4), 그 산출물은 순수 정적이다. proto는 이
   섬의 원형 실증으로 살아 있되, 콘텐츠 뷰어 전체로 확장하는 길은 아니다.
4. **Clerk 채택은 유력하지 않다.** 독자 재평가 불가(선대 판정) + CDN/Tailwind 의존 +
   룩 fork 비용. 다만 산출물 구조(edn 데이터 + 뷰어)는 설계 참고 가치가 있다.

**GLG/코디네이터가 고를 것:**

1. kindly 채택 형태 — 우리 셸 안에 어휘만 들여올지, 저작 도구(Clay)까지 딸려올지.
2. 책 뼈대 발행기 — quarto(로컬 quarto 수선 전제) vs Hugo static 산 길(현재 계약 유지).
3. 로컬 quarto 1.9.37 HTML 버그의 수선 여부와 시점(nixos-config 영역일 수 있음).
4. scittle/emmy 런타임 CDN — daslu.github.io를 그대로 쓸지 `:from-local-copy`로
   자가호스팅할지. (GPL·가용성이 여기 걸린다.)
5. org SSOT ↔ `.clj` 노트북 간극 — org→clj/clay 변환을 짤지, 저작을 .clj로 옮길지,
   org-babel 정적 경로와 섬을 분리해 병립시킬지. `[상속: doc-format-rail.md 결론 1-3]`
6. WebTUI 룩 적용면 — 어느 후보든 "룩 자유 vs 뼈대 공짜" 교환(§5)을 어디서 타협할지.

---

## 경계

- 산출물: 이 파일 하나. `/tmp/{clerk-spike,clay-spike,quarto-min,emmyv}`에서만 실험.
- `dev/eval-stack/` 읽기만, org 원본·proto 수정 없음, 커밋 없음.
- 미확인으로 남긴 것: Clay 첫 mafs 셀 빈 div 원인, quarto 버그의 nix 수선법, maria.cloud,
  quarto fold 유사물의 정확한 범위, kind-clerk/kind-portal 어댑터의 완성도.
