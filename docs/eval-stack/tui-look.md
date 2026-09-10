# tui-look — UI 축 실증 (WebTUI로 "org처럼 보이는 eval 페이지"의 룩이 나오는가)

UI 축 담당. **구현 없음, 커밋 없음.** 산출물: `proto/style.css` + `proto/look.html`
(script 태그 없는 정적 목업, 하드코딩된 `data-state`로 4상태를 동시에 보임).
파일 소유 경계는 코디네이터(entwurf/claude-opus-5)가 확정한 마크업 계약을 따른다 —
`proto/index.html`/`proto/eval.js`는 eval 축 소유, 이 문서가 다루는 건 CSS/마크업뿐이다.

증거 상태 표기: `[직접 읽음 file:line]` / `[실측]`(로컬 브라우저로 렌더 확인) /
`[웹 출처 URL]` / `[미확인 추정]`.

## 결론 (요약)

1. **org 헤딩/태그/드로어/인용은 전부 수제다.** WebTUI가 공짜로 주는 건 색 변수와
   `box-=` 테두리 유틸, 그리고 `details[is-="accordion"]`의 화살표 마커뿐이다. org
   특유의 `*`/`**` 접두, `:tag:` pill, `:PROPERTIES:` 드로어는 WebTUI 어휘에
   아예 없다 — CSS `content:` 의사요소로 하나하나 만들었다. [실측]
2. **접힘은 마크업 계약에 달렸지, WebTUI 능력 문제가 아니다.** 이번 계약처럼
   섹션이 고정 `<section>`이면 순수 CSS로 토글이 안 된다(체크박스 해크도 계약에
   없는 `<input>`이 필요해 못 씀) — "안 된다"가 실측 결론이다. 반면 계약과
   무관하게 `<details is-="accordion">`을 쓰면 JS 없이 진짜로 접힌다 — 이건
   브라우저 네이티브 기능이지 WebTUI의 공로가 아니다. [실측]
3. **eval 셀 4상태(idle/running/ok/error)는 `data-state` 속성 하나로 깨끗하게
   갈린다.** JS가 속성값과 출력 텍스트만 바꾸면 CSS가 테두리색·접두 기호·표시
   여부를 전부 결정 — 계약이 잘 짜였다. [실측]
4. **모노스페이스 그리드는 세 곳에서 확실히 이질감이 난다**: (a) 긴 산문 — 본문을
   가변폭으로 바꾸지 않는 한 에세이가 코드처럼 딱딱하게 읽힌다(취향 선택이지 기술
   제약 아님), (b) TeX 결과 — WebTUI에 수식 렌더 사례가 전혀 없고, KaTeX/MathJax를
   얹으면 그 결과물(가변폭 세리프+이탤릭)이 모노스페이스 셀 옆에서 튄다, (c) 반면
   **SVG 차트는 깨지지 않는다** — `box-=` 테두리 안에서 벡터 그래픽은 문제없이
   맞물린다. [실측 + 웹 출처]

## 1. org처럼 보이는 문서 — 어디까지 공짜고 어디부터 수제인가

| 요소 | WebTUI가 주는 것 | 수제로 짠 것 |
|---|---|---|
| 헤딩 접두 `*`/`**` | 없음 | `.org-heading::before { content: "* " }` — `data-level` 속성별 분기 [proto/style.css] |
| 태그 pill `:tag:` | 없음 (badge 컴포넌트는 있지만 org 태그 문법과 무관) | `.org-tag::before/::after`로 콜론 감싸기, 배경색은 `--surface0` [proto/style.css] |
| PROPERTIES 드로어 | 없음 | `.org-drawer::before/::after`로 `:PROPERTIES:`/`:END:` 텍스트 삽입 [proto/style.css] |
| 인용 블록 | 없음 (blockquote 컴포넌트 없음) | 순수 `border-left` [proto/style.css] |
| 접힘 화살표(▷/▽) | **있음** — `details[is-~=accordion]>summary:before`가 `˃ `/`˅ ` 삽입 [웹 출처: webtui.ironclad.sh/components/accordion] | 없음 — 그대로 씀 |
| 색·테두리 팔레트 | **있음** — Catppuccin 테마 CSS 변수(`--green`, `--red`, `--surface0` 등) [웹 출처: webtui.ironclad.sh, 이전 조사] | 없음 |
| 박스 테두리(`box-=`) | **있음** — 유틸리티 클래스 | 없음 |

결론: **WebTUI는 "터미널 팔레트 + 박스 프레임 + 몇 개 컴포넌트"를 주고, org
문법 자체는 안 준다.** org를 흉내내려면 이번처럼 의사요소 CSS를 전부 손으로
짜야 한다 — 양은 많지 않지만(약 40줄), WebTUI가 org를 이해해서 도와주는 건 없다.

## 2. 접힘 — 실측: 계약 안에서는 안 된다

- **이번 마크업 계약**(코디네이터가 확정): `<section class="org-section">`이 고정
  엘리먼트, 체크박스도 `<details>`도 없음. 순수 CSS만으로 클릭 토글을 넣을 방법이
  없다 — `:has()`/`:target`/checkbox-hack 어느 것도 계약에 없는 엘리먼트를
  요구한다. `proto/look.html`의 "펼친/접힌 상태 스냅샷" 두 섹션은 `data-fold-demo`
  속성을 손으로 다르게 박아 **두 상태를 동시에 나란히 보여주는 것**이지 하나를
  클릭해서 바뀌는 게 아니다 — script 없는 파일이라 실제로 클릭해도 아무 일도 안
  일어남을 확인했다. [실측]
- **계약 밖 대안**: `<details is-="accordion">`는 브라우저 네이티브 기능이라 JS
  없이 실제로 토글된다 — `proto/look.html`에 별도로 넣어 실측함(클릭 시 화살표
  `▷`→`▽`, 내용 표시/숨김 정상 동작). [실측] 이걸 쓰려면 org 섹션 자체를
  `<details>`로 감싸야 하는데, 이건 지금 계약과 다른 마크업이라 **계약 변경이
  필요하다** — 임의로 바꾸지 않고 이 문서에 남긴다.
- 요약: **"WebTUI로 접히는가"의 답은 "엘리먼트를 details로 두면 그렇다, 지금
  계약처럼 두면 아니다"** — WebTUI 능력의 한계가 아니라 마크업 선택의 문제.

## 3. eval 셀 4상태

`proto/style.css`의 `.org-cell[data-state="..."]` 규칙 4개가 전부다:

- `idle`: 테두리 기본색, `.org-cell-out` 자체를 `display:none`으로 숨김.
- `running`: 노란 테두리, 출력 자리에 `::before`로 "… evaluating" 삽입(실제
  텍스트 콘텐츠는 비워둬도 됨 — JS가 아무것도 안 써도 CSS가 표시), eval 버튼
  `pointer-events:none`으로 비활성화 느낌.
- `ok`: 초록 테두리, `⇒ ` 접두 + `--peach` 색 텍스트.
- `error`: 빨강 테두리, `✗ ` 접두 + `--red` 색 텍스트.

네 상태를 `proto/look.html`에 나란히 렌더해 실측 — 육안으로 명확히 구분됨
(스크린샷 기준 테두리색이 가장 강한 신호, 접두 기호가 보조). [실측]

이 설계의 이점: **JS는 속성 하나 + 텍스트 하나만 건드리면 되고, "평가 중인데
버튼을 또 누르면?" 같은 상태 오류를 CSS가 `pointer-events:none`으로 원천
차단한다** — UI 버그 표면적이 줄어든다.

## 4. 수식·차트와 모노스페이스 그리드

- **수식**: WebTUI 쇼케이스·컴포넌트 문서 어디에도 수식 렌더 사례가 없다(이전
  조사에서 이미 확인, 이번에 재확인) — 없다는 게 답. [웹 출처: webtui.ironclad.sh
  전체 목차 탐색, 2026-09-10] `proto/look.html`에서 KaTeX 없이 세리프 폰트로
  흉내내 봤더니 위첨자는 유니코드 글리프(`E = mc²`)로만 가능하고, 분수선·근호·
  정렬된 행렬 같은 진짜 TeX 레이아웃은 세리프 전환만으로 안 나온다. **KaTeX/
  MathJax를 별도로 얹어야 하고, 그 결과물은 모노스페이스 셀 옆에서 폰트가 확실히
  튄다** — 이건 실제 KaTeX를 넣어 측정한 게 아니라 세리프 대조로 얻은 정황
  증거다. [실측(대조) + 미확인 추정(실제 KaTeX 결과물 정합성)]
- **차트**: `<svg>`를 `box-="square"` 안에 넣었을 때 테두리·정렬이 깨지지 않음을
  실측 확인. `stroke` 값을 `style="stroke: var(--green)"`로 지정하면 CSS 변수가
  정상 반영된다(이전 조사에서 `stroke="var(--green)"` presentation attribute로
  넣었을 때의 우려를 이번에 `style` 속성으로 옮겨 실측 해소). [실측]
- **긴 산문**: `.org-body`가 WebTUI 기본 모노스페이스 폰트를 그대로 상속받아
  본문도 고정폭으로 남는다 — 코드가 아닌 에세이 산문이 고정폭이면 가독성이
  코드블록처럼 딱딱해진다. `font-family`를 가변폭으로 바꾸는 건 CSS 한 줄이지만,
  그 순간 "터미널 미학"이라는 룩의 정체성과 충돌한다 — **이건 기술적 제약이
  아니라 취향 트레이드오프**로 남는다. [실측 + 판단]

## 5. geworfen이 WebTUI 위에 수제로 얹은 것 — 이 판에서 재사용되는가

직접 읽음: `~/repos/gh/geworfen/resources/public/index.html` 전문 (이전 조사에서
이미 확인, 이번 계약 관점으로 재정리).

| geworfen이 수제로 짠 것 | 이 판(lichtung)에서 재사용 가능한가 |
|---|---|
| `<row>`/`<column>` 커스텀 엘리먼트 + flex CSS | **가능** — WebTUI 문법이 아니라 geworfen이 임의로 도입한 시맨틱 태그. lichtung 계약은 표준 `<section>`/`<div>`를 쓰므로 그대로 가져올 필요는 없지만 패턴은 참고 가능 |
| org-agenda 텍스트를 정규식으로 파싱해 색칠하는 `colorize()`/`renderBody()` JS [geworfen/index.html:290-397] | **재사용 안 됨** — 이건 org-agenda 특유 포맷(카테고리:시간:본문:태그) 파서다. lichtung의 org 문서 렌더는 (이번 계약 기준) 서버/빌드 단계에서 이미 구조화된 HTML을 내려주는 모델이라 클라이언트 정규식 파서가 필요 없다 |
| 실행 상태를 보여주는 패턴 자체(footer의 버전 skew 경고, runtime 표시) [geworfen/index.html:487-524] | **패턴만 참고 가능** — "상태를 색+텍스트로 동시에 보여준다"는 원칙은 이번 eval 셀 4상태 설계와 통한다. 코드 재사용은 아니고 설계 원칙의 재사용 |
| CDN 버전 고정 관례(`@webtui/css@0.1.9`, `theme-catppuccin@0.0.5`) | **그대로 재사용** — `proto/style.css`도 동일 버전을 고정했다. `@latest` 금지 원칙 승계 |
| GLG Mono 커스텀 폰트 `@font-face` | **재사용 가능** — 이번 프로토타입엔 안 넣었지만(범위 밖), 실제 발행 단계에선 같은 폰트 파일을 그대로 가져오면 된다 |

**결론**: geworfen에서 가져올 건 "CDN 버전 고정 습관"과 "상태를 색+기호로
동시에 표시"라는 설계 원칙 둘뿐이다. **org-agenda 파서 JS는 이 판과 무관한
다른 문제(실시간 emacsclient 피드)를 풀고 있어서 재사용 대상이 아니다.**

## 계약에 대한 의견 (요청받은 대로)

불만 없음 — 파일 경계(`style.css`+`look.html` vs `index.html`+`eval.js`)와
마크업 계약(`data-state` 단일 축)이 명확해서 충돌 없이 작업했다. 굳이 하나
남기면: **접힘을 실제로 넣고 싶다면 계약에 `<details>`를 포함하는 변형이
필요하다** — 이번 계약대로는 안 되는 게 실측으로 확인됐으니, eval 축과 논의할
때 이 사실을 근거로 삼으면 된다.
