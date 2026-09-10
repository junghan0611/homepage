# eval 축 — Lisp가 평가되는 페이지는 기술적으로 실재하는가

담당: eval 축 (entwurf/sonnet-5, 2026-09-10). 커밋 안 함.

## 결론 먼저

1. **emmy.mentat.org는 "이미 구워진 결과를 보는 것"이다. 독자가 코드를 고쳐 재평가할 수
   없다.** [실측: 브라우저로 직접 열람] Nextjournal Clerk이 만든 **빌드타임 정적
   페이지**이고, 페이지 자신이 그렇게 말한다: *"The interactive documentation on this
   page was generated using Clerk. Follow the instructions in the README to run and
   modify this notebook **on your machine**!"* — 수정·재평가는 로컬 REPL에서 하라는
   뜻이다. KONZEPT.md §3(a) 표의 **"빌드타임" 칸**이지 "브라우저 안" 칸이 아니다.
2. 그런데 **브라우저 안에서 진짜 SCI eval이 도는 것은 맞다** — 단, 그 eval의 대상은
   노트북 소스가 아니라 **`:render-fn`(위젯 렌더 코드)**이다. Clerk는 JVM에서 계산을
   끝낸 값(EDN)을 브라우저로 보내고, 브라우저의 SCI가 그 값을 그리는 `:render-fn`
   form만 평가한다. 슬라이더로 뷰를 바꾸는 것과, 소스 코드 자체를 고쳐 다시 계산하는
   것은 다른 층이다. [웹 출처: nextjournal/clerk GitHub `book.clj`, `shadow-cljs.edn`,
   cljdoc changelog — 아래 §2]
3. **정적 배포는 된다.** Clerk static build(`clerk/build!`)는 순수 정적 파일 산출물이고
   emmy.mentat.org 자체가 그 증거다(URL 자체가 정적 호스팅 산출물). Netlify에 그대로
   올릴 수 있다는 KONZEPT.md §3(a)의 "브라우저 안 = 정적 파일" 항목은 **"위젯
   렌더링"** 수준에서는 참이지만, **"소스를 고쳐 재평가"** 수준에서는 거짓이다 —
   그건 JVM 백엔드(빌드 프로세스 또는 상시 서버)가 있어야 한다.
4. **최소 실증 성공**: `proto/sci-eval.html` 정적 HTML 한 장에 scittle(SCI)을 CDN으로
   실어 `(+ 1 2 3)`을 브라우저 안에서 평가, 화면에 `6`을 렌더했다. [실측: 로컬
   `python3 -m http.server`로 서빙 → claude-in-chrome으로 열람 → `get_page_text`로
   "결과: 6" 확인]. **이것이 KONZEPT.md §4가 요구한 "한 장"의 최소형이다** — 단, 이건
   임의 Lisp 한 줄 eval이지 org-lisp-블록-안-값-표기-TeX-시각화 전체 파이프는 아니다.

즉 GLG의 "eval이 되는 페이지"를 **"독자가 코드를 고쳐 다시 돌린다"**로 읽으면
emmy.mentat.org는 선례가 아니다. **"페이지 자체가 평가기를 내장하고 있어, 최소한
위젯/폼 단위로는 살아있다"**로 읽으면 emmy.mentat.org와 scittle 둘 다 선례다. 이
갈림이 KONZEPT.md §3(a)가 요구한 실측이다.

---

## 1. emmy.mentat.org — 무엇으로 만들어졌나

[실측: claude-in-chrome으로 https://emmy.mentat.org/ 직접 열람, `get_page_text` 전체 발췌]

- 페이지 최상단 각주: **"Generated with Clerk from dev/emmy/notebook.clj@f807468"** —
  특정 git 커밋에 고정된 **빌드 산출물**이라는 뜻. 라이브 REPL이 뒤에서 도는 것이
  아니라, 그 커밋 시점에 한 번 평가하고 구운 결과다.
- 본문 1문단: *"The interactive documentation on this page was generated using Clerk.
  Follow the instructions in the README to run and modify this notebook on your
  machine!"* — **"modify … on your machine"**이 핵심 문장이다. 독자는 이 페이지에서
  코드를 못 고친다. 고치려면 리포를 클론해서 자기 컴퓨터에서 Clerk을 띄워야 한다.
- 페이지 안에 코드 편집기·"Run"/"Eval" 버튼·입력창이 전혀 없다. TOC만 접히고 펼쳐지는
  탐색 UI다. [실측: 스크린샷 + `read_page` 확인]
- 페이지 안에 **"Emmy via SCI"**, **"Emmy via Clerk"** 절이 따로 있어 "브라우저에서
  진짜 평가되는 판"을 만드는 방법을 안내한다 — 즉 그 페이지 자체가 "이 문서는 그
  판이 아니다. 그 판을 만들려면 이렇게 해라"라고 명시한다. 이게 가장 직접적인 증거다.

**결론**: emmy.mentat.org는 "GLG가 그리는 그림"의 최종 산출물 예시가 아니라, "그
그림을 만드는 도구(Clerk + SCI)의 저작·배포 방식 예시"다. 둘을 구분해야 한다.

## 2. SCI가 브라우저에서 도는 실증 — 어디서, 무엇을 위해

### 2a. Emmy 자체가 ClojureScript/SCI 호환

[실측: emmy.mentat.org 본문 "Emmy via SCI" 절, 직접 읽음]

> "Emmy is compatible with SCI, the Small Clojure Interpreter. To install Emmy into
> your SCI context, require the `emmy.sci` namespace and call `emmy.sci/install!`... Note
> that Emmy does not ship with a dependency on SCI, so you'll need to install your own
> version."

Emmy는 처음부터 Clojure/ClojureScript 겸용 라이브러리이고, SCI 컨텍스트에 설치하는
공식 경로(`emmy.sci`)가 라이브러리 안에 있다. **Emmy를 브라우저 SCI에 넣어 수식을
평가하는 것은 라이브러리 저자가 명시적으로 지원하는 사용법**이다 — 단, "브라우저"가
아니라 "SCI 호스트 환경"이라는 더 넓은 범주로 말한다(SCI는 브라우저·Babashka·서버
모두에서 돈다).

### 2b. Clerk의 브라우저 SCI는 render-fn 전용

[웹 출처: https://github.com/nextjournal/clerk `shadow-cljs.edn`,
`book.clj`, cljdoc changelog — exa-search로 열람, 직접 읽음]

- `shadow-cljs.edn`의 `:viewer` 빌드가 `nextjournal.clerk.sci-env`를 엔트리로 포함한다
  — **Clerk가 배포하는 브라우저 번들 자체에 SCI 런타임이 들어 있다.**
- `book.clj`(Clerk 공식 문서 노트북) 안 발췌: *"Clerk's rendering happens in the
  browser. ... When you want to run code in the browser where Clerk's viewers are
  rendered, reach for `:render-fn`. ... Note that this is a quoted form, not a function.
  Clerk will send this form to the browser for evaluation."*
- cljdoc changelog: `:render-fn`은 브라우저 SCI(또는 대안으로 cherry)로 평가되고,
  `v/clerk-eval`로 "문서 네임스페이스 컨텍스트에서 quoted form을 평가"할 수 있다 —
  단 이건 **위젯 작성자가 미리 박아둔 코드**가 도는 것이지, 독자가 새 코드를 타이핑해
  넣는 창구가 아니다.

**결론**: "Emmy를 브라우저 SCI 컨텍스트에 넣어 수식을 평가·렌더한 선례"는 존재한다 —
Clerk 자체가 그 패턴이다. 다만 그 eval의 권한은 **문서 저자**에게 있지 **독자**에게
있지 않다. Scittle(§2c)은 반대로 "누구나 스크립트 태그로 임의 Lisp을 평가"할 수 있는
더 일반적인 도구다.

### 2c. Scittle — 독자 쪽 임의 eval의 실제 최소형

[실측: `proto/sci-eval.html`]

babashka/scittle은 "SCI를 script 태그로 노출"하는 독립 프로젝트로, Clerk과 무관하게
정적 HTML 한 장에서 Lisp을 돌릴 수 있다. 실제로 CDN(`scittle@0.8.33`)을 정적 HTML에
붙여 `(+ 1 2 3)` → `6` 렌더를 실측했다(§4). **이것이 KONZEPT.md가 그리는 "org 문서
안 Lisp 블록이 브라우저에서 평가된다"는 그림에 가장 가까운 원재료**다 — Clerk보다
scittle 쪽이 "독자가 코드를 고쳐 재평가"에 더 가깝다(단, Emmy 전체를 얹었을 때
번들 크기·SCI가 지원 못 하는 매크로/리더 문법이 실제 장벽이 될 수 있음 — 미검증,
다음 세션 실증 대상).

### 2d. maria.cloud / clj-tiles — 다른 선례

[웹 출처: emmy.mentat.org 본문 "Who is using Emmy?" 절, 직접 읽음]

emmy.mentat.org 자신이 링크한 것: *"@kloimhardt has integrated Emmy into his
Scratch-like, blocks-based language at clj-tiles."* clj-tiles는 브라우저에서 도는
블록 기반 Clojure 환경으로 Emmy를 얹었다는 사례 — **브라우저 Emmy 평가의 제3의
독립 선례**다. maria.cloud는 검색 결과에 직접 걸리지 않아 **미확인**으로 남긴다.

## 3. Clerk static build — 정적 파일은 정확히 무엇을 산출하는가

[웹 출처: cljdoc changelog, `nextjournal/clerk` `book.clj` "Rationale" 절 — 직접 읽음]

- Clerk 공식 문서의 설계 원칙(발췌): *"no editing environment, folks can keep using
  the editors they know and love ... no external process: Clerk runs inside your
  Clojure process."* — Clerk는 애초에 **브라우저 편집기가 아니다.** 편집은 항상
  로컬 에디터 + JVM REPL에서 일어나고, 브라우저는 결과를 보는 창이다.
- `clerk/build!`(구 `build-static-app!`)는 노트북을 평가한 뒤 **순수 정적 파일**(HTML +
  JS + 데이터)로 산출한다. `:package :single-file`(단일 파일) 또는 `:directory`
  옵션이 있다 — 이게 Netlify 같은 정적 호스팅에 그대로 올라가는 형태다.
  emmy.mentat.org가 살아있는 실물 증거다.
- 올라간 뒤: **독자는 재평가할 수 없다.** JVM 프로세스가 없기 때문에 새 코드를
  계산할 수 없다. 할 수 있는 것은 (a) 이미 구워진 값을 보는 것, (b) 그 값을 그리는
  `:render-fn`(브라우저 SCI)와 상호작용하는 것 — 슬라이더·토글·탭 전환 같은 **뷰
  상태 변경**이지 **새 계산**이 아니다.

**KONZEPT.md §3(b) 확인**: geworfen이 서버인 이유는 eval이 아니라 emacsclient
라이브 데이터 소스 때문이라는 문서의 판정은, 이번 조사로 간접 확인된다 — Clerk
static build 자체가 "eval 결과가 정적으로 굳어도 무방한 문서"에서는 서버가 전혀
필요 없다는 반례를 실물로 보여준다.

## 4. 수식 표기와 데이터 시각화 — 무엇이 내는가

[웹 출처: `shadow-cljs.edn`(:katex 모듈), nextjournal.com Clojure viewer API 문서 —
직접 읽음. emmy.mentat.org 렌더 결과 실측 확인]

- **TeX 렌더러는 KaTeX**다. Clerk 빌드 설정(`shadow-cljs.edn`)에 별도 `:katex` 모듈이
  있고 `nextjournal.clerk.render.katex/renderToString`을 내보낸다. Emmy 쪽은 자체
  TeX **생성기**(`->TeX` 함수, 심볼→LaTeX 문자열 변환 로직)를 갖고 있을 뿐이고,
  화면에 렌더하는 것(수식 이미지가 아니라 폰트로 조판)은 KaTeX가 한다. 실제
  emmy.mentat.org에서 `sin²(a+3)`, `Θ+α` 같은 수식이 벡터 폰트로 뜨는 것을 확인했다
  (이미지 아님, 텍스트 선택 가능한 조판).
- **차트/시각화**: Clerk/Nextjournal 계열 viewer API는 **Plotly**와 **Vega-Lite**를
  1급 뷰어로 지원한다(`^{:nextjournal/viewer :plotly}`, `:vega-lite` 메타데이터로
  선택). emmy.mentat.org 첫 화면의 곡선 그래픽(색색 아치)도 이 계열 뷰어로 추정되나
  **어떤 뷰어인지는 미확인**(페이지 소스에서 특정하지 않음).

## 5. 울타리 — 브라우저 eval에 남는 위험

KONZEPT.md §2가 인용한 네 갈래(표현의 형식화 / 제한된 평가기 / 실제 테스트·수식·
기록의 영수증 / 사람이 무엇을 보장하려 했는지)를 기준으로:

- **서버 임의실행이 아니다는 점은 명확하다.** SCI/scittle 코드는 **독자의 브라우저
  탭 안**에서만 돈다 — 다른 방문자, 서버, 파일시스템에 영향 없음. 이게 KONZEPT.md
  §3(a) 표가 "브라우저 안"을 "서버"와 분리해 적은 이유이고, 이번 조사로 실측
  확인됐다(§4의 proto는 로컬 프로세스·네트워크 어디에도 흔적을 남기지 않고 탭
  안에서만 계산됨).
- 그럼에도 남는 위험, 네 갈래에 맞춰:
  - **표현의 형식화** — SCI는 Clojure 리더의 부분집합만 지원한다(예: 일부 리더
    매크로, 타입 힌트, 특정 Java interop이 막힐 수 있음). "Lisp으로 적었다"가
    "SCI가 받는다"를 보장하지 않는다 — 이 갈림 자체가 형식화 실패 지점이다.
  - **제한된 평가기** — SCI는 애초에 샌드박스형 평가기(임의 Java 클래스 접근 제한
    가능)라 이 갈래엔 원래 잘 맞는다. 다만 **무한루프/과도한 재귀를 SCI 자체가
    막아주지 않는다** — 탭 하나를 멈추게 할 수 있다(다른 탭·서버엔 번지지 않음).
  - **번들 크기** — scittle 코어만 CDN 한 파일(수백 KB급, 미측정)이지만, Emmy 전체를
    SCI 컨텍스트에 올리면 CAS(컴퓨터 대수) 라이브러리 특성상 훨씬 커질 수 있다 —
    **미측정, 다음 실증 대상**.
  - **XSS/신뢰 경계** — 브라우저에서 평가된 결과를 DOM에 얼마나 순진하게
    꽂는지가 관건이다. Clerk changelog에 실제로 *"Fix reagent unsafe html
    rendering"* 버그가 있었다(§3 인용) — 렌더 파이프라인이 완벽히 안전하진
    않았다는 직접 증거. 이 페이지가 "누구나 코드를 고쳐 재평가"로 가면(§1의
    결론과 달리 미래에 그렇게 설계한다면), **입력이 다른 방문자에게 노출되는
    순간** 이건 더 이상 "내 브라우저 탭"이 아니라 "브라우저 안에서 도는
    임의실행 서비스"가 되고, 위 네 갈래 전부를 다시 따져야 한다.
  - **사람이 무엇을 보장하려 했는지** — Clerk/scittle 둘 다 "저자가 쓴 코드를
    저자의 브라우저 또는 방문자 브라우저에서 그대로 재생"할 뿐, **아무 검증도
    보장하지 않는다.** "브라우저에서 돈다"와 "맞다"는 여전히 별개다 — 이 문서
    §2b에서 지적한 것과 같은 함정이 여기도 있다: **"Eval됐다"가 "증명됐다"는
    아니다.**

## 6. 최소 실증 — `proto/sci-eval.html`

- 파일: `proto/sci-eval.html`
- 구성: scittle(SCI) CDN 스크립트 하나 + `type="application/x-scittle"` 스크립트
  블록 하나. 평가식: `(+ 1 2 3)`.
- 방법: `python3 -m http.server`로 로컬 서빙(파일 URL은 확장 정책상 직접 열람
  불가 — claude-in-chrome이 `file://`을 거부함, 실측) → claude-in-chrome으로 열람.
- 1차 시도 실패, 원인 확인: CDN 버전 `scittle@0.6.31`이 존재하지 않아 jsdelivr가
  **503**을 반환(`read_network_requests`로 실측). jsdelivr npm 메타데이터
  조회(`data.jsdelivr.com`)로 최신 버전이 `0.8.33`임을 확인 후 교체.
- 2차 시도 성공: 페이지 `결과:` 칸이 `6`으로 렌더됨(`get_page_text`로 실측).
  **정적 파일 한 장 + CDN 하나로 브라우저 안 Lisp 평가가 실제로 된다.**
- 하지 않은 것(여력 문제로 보류, 미확인 영역): Emmy를 이 scittle 컨텍스트에
  올려서 `emmy.sci/install!` 후 실제 수식(`(simplify ...)`, `->TeX`)을 평가하는
  것 — 이게 KONZEPT.md §4가 요구한 "한 장"의 완전판이다. 다음 실증 후보.

## 4-v2. 실증 v2 — 「보이는 것 = 평가되는 것」, 셀 격리, Emmy 실측

담당 회신(entwurf/claude-opus-5)이 §6의 틈을 정확히 짚었다: v1은 `<pre>`에 보이는
소스와 실제로 평가된 스크립트가 **다른 사본**이었다 — "브라우저가 Clojure를
평가한다"는 증명됐지만 "보이는 그 블록이 평가됐다"는 증명 못 했다(20250405 원석의
「가짜 정밀도」 경계). v2가 이 틈을 메운다. 파일 소유 경계(조율자 지시)에 따라
`proto/index.html` + `proto/eval.js`만 새로 세웠고, `proto/sci-eval.html`(v1)은
영수증으로 그대로 남겼다. `proto/style.css`는 UI 축 소유라 건드리지 않았다(링크만
걸어둠, 미도착 시 404 — 정상).

**방법**: `.org-cell-src` textarea의 `.value`를 읽어 `scittle.core.eval_string()`에
직접 넘긴다. 하드코딩 사본 없음. `eval.js`가 만지는 것은 `.org-cell`의
`data-state`(`idle|running|ok|error`)와 `.org-cell-out`의 텍스트뿐 — 계약대로.

**실측 결과** (javascript_tool로 각 셀 버튼을 순서대로 클릭, 매 단계 DOM 상태를
`JSON.stringify`로 읽음 — 재현 가능):

| 셀 | 소스 | 순서 | 결과 |
|---|---|---|---|
| 1 | `(+ 1 2 3)` | 1번째 | `ok` / `6` |
| 3 | `(* x 2)` | 2번째(2 이전) | `error` / `Unable to resolve symbol: x` |
| 2 | `(def x 42)` | 3번째 | `ok` / `#'user/x` |
| 3 | `(* x 2)` | 4번째(2 이후, 재클릭) | `ok` / `84` |
| 4 | `(this-symbol-does-not-exist 1 2)` | 5번째 | `error` / `Unable to resolve symbol: this-symbol-does-not-exist` |
| 5 | `(require '[emmy.env :as e])` | 6번째 | `error` / `Could not find namespace: emmy.env.` |

1. **「보이는 것 = 평가된 것」성립.** textarea 값을 고쳐 다시 누르면 다른 결과가
   뜬다(§6 v1에서 이미 `(* 6 7)`→`42` 확인, v2에서 셀 구조로 재확인).
2. **에러가 페이지를 죽이지 않는다.** 셀 4가 `error` 상태로 멈춘 뒤에도 셀 5, 그
   이전 셀들 전부 정상 작동 — try/catch 하나로 셀 단위 격리가 된다. 탭 하나 안에서
   셀 하나의 실패가 문서 전체를 무너뜨리지 않는다는 최소 계약은 선다.
3. **SCI 컨텍스트는 셀끼리 공유된다 — 격리가 아니라 누적이다.** `scittle.core.eval_string`은
   전역 컨텍스트 하나(`sci.ctx-store`)를 쓴다(§2c 소스 인용 `store/reset-ctx!` 참고).
   셀 2의 `(def x 42)`가 셀 3에서 그대로 보인다. **이게 20250405 원석이 「살아남은
   워크스페이스 상태」로 경계 그은 바로 그 지점**이다 — org 문서에서 셀 순서를
   바꿔 읽거나, 셀을 재평가하지 않고 다른 셀만 다시 돌리면, "지금 화면"과 "실제
   평가된 상태"가 어긋날 수 있다. 격리하려면 셀마다 별도 SCI 컨텍스트(`sci/init`)를
   만들어야 하는데, 그러면 셀 간 값 공유(예: 앞 셀에서 정의한 함수를 다음 셀에서
   쓰는 org-babel스러운 흐름)를 포기해야 한다 — **이건 취향이 아니라 설계
   트레이드오프이고, KONZEPT.md 다음 단계에서 명시적으로 결정해야 한다.**
4. **Emmy는 CDN으로 못 싣는다 — 확인된 실패, 이유 포함.** `(require '[emmy.env :as e])`가
   `"Could not find namespace: emmy.env."`로 즉시 실패한다. [실측: npm
   registry(`registry.npmjs.org/emmy`) 조회 — `emmy`라는 npm 패키지는 존재하지만
   `mentat-collective/emmy`(CAS 라이브러리)와 **무관한 이벤트 이미터 패키지**다.
   mentat-collective/emmy는 Clojars/git 소스로만 배포되고, **jsdelivr/npm에 컴파일된
   브라우저 JS 번들이 없다.** §3에서 확인한 Clerk의 방식(`clerk-utils`로 커스텀
   ClojureScript 빌드를 shadow-cljs로 직접 컴파일)이 유일한 경로다 — scittle처럼
   "CDN 스크립트 태그 하나로 끝"이 안 된다. **이게 §3(a) 표의 결정적 제약이다**:
   org-lisp-블록이 임의 Clojure는 브라우저에서 바로 되지만(scittle), **Emmy/수식
   축까지 같은 판에 세우려면 빌드 단계(shadow-cljs 컴파일)가 필요**해진다 — "정적
   파일만으로 끝"이 "정적 파일 + 빌드 파이프라인 하나"로 바뀐다. Netlify에는 여전히
   정적 산출물만 올라가지만(빌드는 CI에서), KONZEPT.md §4의 "한 장"이 "scittle
   CDN 하나"로는 안 되고 "커스텀 cljs 빌드 산출물 하나"여야 한다는 뜻이다.

파일: `proto/index.html`(마크업, 이 축 소유), `proto/eval.js`(eval 로직, 이 축
소유). `proto/style.css`는 UI 축 소유라 비어 있어도 정상.

## 7. 미확인으로 남긴 것 (추정 금지, 다음 세션 실증 대상)

- Emmy를 scittle 컨텍스트에 직접 올렸을 때 실제로 도는지, 번들 크기, 어떤 emmy
  네임스페이스가 SCI가 못 읽는 매크로/리더 문법에 걸리는지.
- maria.cloud가 이 분야의 선례인지 — 검색으로 직접 확인 못 함.
- emmy.mentat.org 첫 화면 곡선 그래픽의 정확한 렌더러(Plotly/Vega-Lite/커스텀 SVG
  중 무엇인지).
- scittle 번들의 정확한 파일 크기(KB) — gzip 여부 포함 미측정.
