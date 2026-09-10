# 교차검수 — proto 맞물림 · 수선

담당: grok-4.6 (pi, 2026-09-10). 커밋 안 함.
조율: garden id `20260910T105902-b5c352`.

증거 표기: `[실측]` 로컬 Chrome 151 + `http://127.0.0.1:8765` / `[직접 읽음 file:line]` / `[웹 출처 URL]` / `[미확인 추정]`.

---

## 고친 것

### 1. 두 쪽이 처음으로 만났다

- `proto/index.html`은 처음부터 `style.css`를 링크하고 있었다. `[직접 읽음 proto/index.html:7]`
- 안 맞던 자리: **테마 속성**. `look.html`은 `data-webtui-theme="catppuccin-mocha"`가 있고 `index.html`에는 없었다. CSS 변수(`--green` 등)가 안 켜지면 4상태 테두리가 회색으로 죽는다. `index.html`의 `<html>`에 같은 속성과 viewport를 넣었다. `[실측]` 맞춘 뒤 idle 테두리 `rgb(88, 91, 112)`가 두 파일에서 같다.
- 클래스·속성 계약은 한 글자도 안 어긋났다. JS가 만지는 것은 그대로 `.org-cell`의 `data-state`와 `.org-cell-out` 텍스트. `[직접 읽음 proto/eval.js:6-21]` `[실측]`
- **4상태가 눈에 갈린다.** `look.html` 하드코딩 + `index.html` 실제 클릭 둘 다. `[실측]` computed + 스크린샷:

| state | 테두리 | 출력 |
|---|---|---|
| idle | `rgb(88, 91, 112)` | `display:none` |
| running | `rgb(249, 226, 175)` | `::before "… evaluating"`, 버튼 `pointer-events:none` |
| ok | `rgb(166, 227, 161)` | `::before "⇒ "`, 본문 `--peach` |
| error | `rgb(243, 139, 168)` | `::before "✗ "` |

### 2. 승인된 계약 — `<details>` 접힘

`.org-section`을 `<details class="org-section" data-level="N" open>` + `<summary class="org-heading">`로 바꿨다. 대상: `index.html` · `look.html` · `style.css`. 기본 마커는 숨기고 `*`/`**` 접두와 `▽`/`▷`는 CSS. `[직접 읽음 proto/style.css:28-39, proto/style.css 접힘 절]`

- 클릭으로 열림/닫힘 왕복. `[실측]` `look.html`의 「접힌 채로 시작」은 `open` 없이 시작해 본문이 숨고, 클릭하면 펼쳐진다.
- **eval.js 무영향.** 섹션을 접은 채로 버튼을 JS로 눌러도 셀 1이 `ok` / `6`. `[실측]` `eval.js`는 `.org-section`을 조회하지 않는다.

`sci-eval.html`은 그대로 둠.

### 3. Emmy CDN — 우회로가 있다. 실렸다.

공식 scittle CDN에는 Emmy가 없다. 그 문장은 유지. 다만 **유일 경로가 shadow-cljs 커스텀 번들은 아니다.**

- `scittle-kitchen@0.8.33-105`가 jsdelivr에 `dist/scittle.emmy.js`를 배포한다. `[웹 출처 https://github.com/timothypratley/scittle-kitchen]` `[웹 출처 https://cdn.jsdelivr.net/npm/scittle-kitchen@0.8.33-105/dist/scittle.emmy.js]` HTTP 200, `x-jsd-version: 0.8.33-105`.
- README 주의: *Only scittle-kitchen can load these plugins.* 그래서 `index.html`의 scittle도 kitchen 쪽으로 맞췄다. `[웹 출처 같은 README]`
- `[실측]` 브라우저 `performance` encoded/decoded:

| 파일 | encoded (전송) | decoded |
|---|---|---|
| kitchen `scittle.js` | 265 439 B | 1 331 978 B |
| kitchen `scittle.emmy.js` | 492 768 B | 4 093 648 B |
| KaTeX js+css+auto-render | ≈ 81 KB | ≈ 301 KB |

- `[실측]` 셀 5 + 콘솔:

```
(e/simplify (e/+ 'x 'x))          => (* 2 x)
(e/->TeX (e/simplify (e/+ 'x 'x))) => 2\,x
(e/->TeX (e/sin (e/+ 'x 3)))       => \sin\left(x + 3\right)
```

`emmy.env` public 앞 12개에 `->infix`, `elliptic-f`, `rotate-x`가 있다. 수식 표기만이 아니라 CAS 본체다.

셀 5 기본 소스를 위 `->TeX` 형태로 고쳤다. 결과는 `.org-cell-out`에 문자열 `2\,x`로 뜬다(조판 아님 — 아래 결정 항).

Emmy 패키지 라이선스는 GPL. `[웹 출처 scittle-kitchen README]`

### 4. KaTeX를 실제로 얹었다

`katex@0.18.7`를 `index.html`과 `look.html`에 핀. `[실측]`

- 본문 `\[...\]`는 조판된다. 폰트 `KaTeX_Main, "Times New Roman", serif` vs body/cell `monospace`.
- **그리드는 안 깨진다.** 초록 셀 박스 안에 \(E=mc^2\), 적분, 근호가 앉고 SVG 차트도 `box-="square"` 안에서 유지.
- **이질감은 있다. 파손은 없다.** 세리프 수식이 모노스페이스 옆에 앉는 것은 사실이다. “선례 없으니 닫자”는 근거가 못 된다.

가짜 정밀도 하나 수선: KaTeX auto-render는 기본으로 `<pre>`를 건너뛴다. `.org-cell-out`은 `<pre>`라, 출력 칸에 LaTeX를 텍스트로 넣으면 조판되지 않는다. `[실측]` `look.html` 셀 안 수식은 그래서 `pre` 옆 `div.tex-sample`로 옮겼다.

### 5. 그 밖의 수선

- `look.html` 접힘 절: 정적 `data-fold-demo` 스냅샷을 지우고 진짜 `<details>` 토글로 바꿨다. style.css의 fold-demo 규칙도 삭제.
- `eval.js` 주석: “Emmy CDN 불가”를 kitchen 우회로로 정정. 로직은 그대로.

---

## 은퇴시킨 문장

1. **「Emmy는 CDN 불가, shadow-cljs 커스텀 번들이 유일 경로」**
   (`docs/eval-rail.md` §4-v2 셀 5, `proto/eval.js` 구 주석)
   은퇴 영수증: jsdelivr `scittle-kitchen@0.8.33-105/dist/scittle.emmy.js` HTTP 200 + 브라우저에서 `e/simplify` → `(* 2 x)`, `e/->TeX` → `2\,x`. `[실측]` `[웹 출처]`
   남는 조각: **공식 scittle CDN에는 여전히 없다.** npm 패키지명 `emmy`는 무관한 이벤트 이미터 — 그 경로로 찾으면 계속 실패한다. kitchen 플러그인은 kitchen의 `scittle.js`와 짝이다.

2. **「접힘은 지금 계약(고정 `<section>`)에선 CSS만으로 불가능」**
   (`docs/tui-look.md` 결론 2)
   은퇴 이유: 그 문장은 **당시 계약**에서는 맞았다. 계약이 `<details>`로 바뀌어 지금은 JS 없이 접힌다. `[실측]`

3. **「TeX 수식은 … 모노스페이스와 이질감」(세리프 흉내를 실측처럼 읽히게 한 부분)**
   (`docs/tui-look.md` §4: “실제 KaTeX를 넣어 측정한 게 아니라 세리프 대조”)
   은퇴 영수증: KaTeX 0.18.7을 얹어 셀 안·본문에서 조판 확인. 폰트 이질감은 재확인, 레이아웃 파손은 없음. `[실측]`
   남는 조각: WebTUI 컴포넌트 목록에 수식/org 문법은 없다. `[웹 출처 https://webtui.ironclad.sh/showcase/]` accordion, badge, button, checkbox, dialog, input, popover, pre, progress, radio, range, separator, spinner, switch, table, textarea, tooltip, typography, view.

4. **셀 5 첫 소스 `(e/simplify '(+ x x))` → 화면은 ok, 값은 `(+ x x)`**
   인용 리스트는 emmy `+`가 아니다. “성공”처럼 보이는 가짜 정밀도. 소스를 `(e/->TeX (e/simplify (e/+ 'x 'x)))`로 바꿨다. `[실측]`

확인으로 **남는** 문장:

- **「WebTUI는 org 문법을 전혀 안 준다, 전부 CSS 의사요소 수제」** — 맞다. `[웹 출처 위 컴포넌트 목록]` `[직접 읽음 proto/style.css]` `*`/`**`, `:tag:`, `:PROPERTIES:` 는 전부 이 파일의 `content:`.
- **v1 「보이는 소스 ≠ 평가 소스」** — `index.html`+`eval.js`에는 재발 없음. textarea `.value`를 그대로 `eval_string`. `[직접 읽음 proto/eval.js:14]` `look.html` 4상태는 하드코딩 스냅샷이라고 페이지가 먼저 말한다.

---

## SCI 컨텍스트 공유 — 측정 (결정은 GLG)

`scittle.core` 공개 키는 `eval_string` / `eval_script_tags` / `disable_auto_eval` 셋뿐이다. `init`·`fork`·`reset-ctx!` 없음. `window`에도 sci/ctx 심볼 없음. `[실측]`

동작 `[실측]`:

| 순서 | form | 결과 |
|---|---|---|
| 셀3 먼저 | `(* x 2)` | error `Unable to resolve symbol: x` |
| 셀2 | `(def x 42)` | `#'user/x` |
| 셀3 다시 | `(* x 2)` | `84` |
| 셀4 에러 뒤 | 다른 셀 | 그대로 동작 (페이지 안 죽음) |
| `(ns-unmap *ns* 'x)` 후 | `(* x 2)` | 다시 resolve 실패 |
| 다시 `(def x 1)` | `(* x 2)` | `2` |

원석 `~/org/notes/20250405T171216--…org` 「오후에 온 영수증」 `[직접 읽음 해당 절]`: *상태가 사는 것과, 살아남은 상태가 안전한 것은 다른 문제다.* 그날은 워크스페이스에 dict가 남아 다음 턴을 죽였다. 여기 대응물은 크래시가 아니라 **침묵하는 성공**이다 — 화면 순서를 건너뛰고 셀3만 다시 누르면, 예전에 살아남은 `x`가 84를 준다. 지금 화면과 평가된 상태가 갈라진다.

격리하면 잃는 것: 셀2에서 정의한 값을 셀3이 쓰는 org-babel 흐름.
격리 가능한가: **공개 API만으로는 셀 단위 컨텍스트를 못 연다.** 할 수 있는 것은 (a) 심볼을 아는 채로 `ns-unmap`, (b) 페이지 리로드, (c) sci를 직접 싣고 `sci/init` — 그건 scittle 위가 아니라 다른 스택. `[실측]` + `[미확인 추정]` (c)의 공수.

중간안(제안, 미적용): 공유 유지 + 「위에서부터 다시」/리로드 버튼. 마크업 계약 변경이라 안 넣었다.

---

## 남은 것 / GLG 결정 필요

1. **Emmy를 기본으로 실을 것인가.** 된다. 대가는 kitchen scittle 265 KB + emmy 493 KB (전송, `[실측]`) 그리고 **GPL**. 수식 *표기만*이면 KaTeX만으로 충분하고, 그건 “수식이 값”이 아니다. KONZEPT의 그림은 Emmy 쪽이다.
2. **eval 결과 TeX를 조판할 것인가.** 지금 계약은 `.org-cell-out` **텍스트**. `2\,x`가 문자열로 남는다. `katex.render`를 부르면 HTML이 들어가 계약을 넘는다. 조판하려면 코디네이터 승인 필요.
3. **SCI 공유 vs 셀 격리.** 위 측정. 기본은 공유로 두었다.
4. **본문 가변폭.** `.org-body`도 모노스페이스. 취향이지 기술 제약이 아님. `[실측]`
5. **org 접힘 1:1은 아직 아니다.** 섹션이 형제 `<details>`라 상위 헤딩을 접어도 하위 헤딩이 남는다. 중첩하려면 마크업을 한 번 더 바꿔야 한다 — 계약이라 안 만졌다.
6. **공식 scittle@0.8.33 + kitchen emmy 플러그인 혼용**은 안 재봤다. kitchen README가 말리므로 짝을 맞췄다. `[미확인 추정]` 혼용 실패 여부.

로컬 확인: `http://127.0.0.1:8765/index.html` · `look.html`. `proto/sci-eval.html` 보존.
