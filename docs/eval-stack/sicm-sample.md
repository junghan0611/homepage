# SICM 샘플 — 표기가 아니라 값

담당: grok-4.6 (pi, 2026-09-10). 커밋 안 함.
파일: `proto/sicm.html` (기존 proto 파일은 안 건드림). `style.css` 재사용.

---

## 계보

**`emmy`는 `sicm-utils`가 이름을 바꾼 것이다.** 맞다.

- sicmutils 리포 경고: *All development has moved to Emmy*. `[웹 출처 https://github.com/sicmutils/sicmutils]`
- emmy v0.30.0: *To port from sicmutils, simply rename sicmutils to emmy everywhere.* `[웹 출처 https://github.com/mentat-collective/emmy/releases/tag/v0.30.0]`
- 그래서 「sicm-utils 수준이 되나」의 답은 **같은 라이브러리다**. 브라우저에 실린 것은 그 후손 `org.mentat/emmy`를 kitchen이 컴파일한 플러그인.

---

## 콘텐츠 SSOT

웹은 대조만. 식과 그림은 로컬 org.

- 전통 라그랑주: `preface.org:54` LaTeX `\(\frac{d}{dt}\frac{\partial L}{\partial{\overset{˙}{q}}^{i}} - \frac{\partial L}{\partial q^{i}} = 0\)`. 바로 아래 메모 「수식 이상하다 수정 바람.」 `[직접 읽음]`
- 함수 표기: `preface.org:66` org 아래첨자 평문 `/D/(∂_{2}/L/ ∘ Γ[/q/]) − ∂_{1}/L/ ∘ Γ[/q/] = 0.` `[직접 읽음]`
- Figure 1.1: `chapter001.org:756-788`, 이미지 `org/images/Art_P19.jpg`. 작용 최소화 다항 경로 vs 조화진동자 참 경로 \(q=\cos t\), 횡축 시간, 종축 오차. 중간점 3개에서 최대 오차 &lt; 1.7×10⁻⁴. `[직접 읽음]`

`diagrams/` 디렉터리는 없다. 그림은 `org/images/`. `[실측 ls]`

---

## 화면에 실제로 뜬 것 `[실측]`

`http://127.0.0.1:8765/sicm.html` 로드 후 셀 자동 eval. Chrome 151.

| 셀 | data-state | `.org-cell-out` 텍스트 | 옆 div |
|---|---|---|---|
| Γ[q] | ok | `\begin{pmatrix} t \\ q(t) \\ Dq(t) \end{pmatrix}` | KaTeX 행렬 조판 1개 |
| 함수 표기 잔차 | ok | `k\,q\left(t\right) + m\,{D}^{2}q\left(t\right)` | KaTeX \(k q(t)+m D^{2}q(t)\) |
| 참 경로 | ok | `0` | (조판 없음 — 숫자) |
| Fig 1.1 | ok | `0.00016772069029036274` | SVG path 974자, 초록 곡선 |

책의 「&lt; 1.7×10⁻⁴」와 실측 1.677×10⁻⁴ 가 같다. 이미지를 베낀 게 아니라 `e/find-path` n=3 이 그 오차를 다시 냈다 (n=3 계산 760ms). `[실측]`

서문 식 \(D(\partial_2 L \circ \Gamma[q]) - \partial_1 L \circ \Gamma[q]\) 는 조판을 손으로 치지 않았다. 셀이 `partial` / `Gamma` / `D` / `compose` 로 계산하고 `->TeX` 한 문자열이 옆 div에서 조판된다.

참 경로 `q=cos`, m=k=1 에서 `Lagrange-equations` 잔차는 `0`. `[실측]`

---

## 된 것 / 못 한 것 / 안 되는 것

**된다 (실측):**

- `Lagrange-equations`, `Gamma`, `partial`, `literal-function`, `D`, `compose`, `->TeX`, `simplify`, `find-path`, `Lagrangian-action`, `multidimensional-minimize` — 전부 `emmy.env` public. `[실측 resolve]`
- 위 표의 네 셀.
- SVG는 차트 라이브러리 없이 path. `q3`를 80점 샘플.

**못 한 게 아니라 가려야 했던 것:**

- `L-harmonic` 은 emmy에 없다. 책 코드. 페이지 로드 때 정의. `[실측 resolve = null]`
- cljs 기본 `*` 에 심볼을 넣으면 `NaN`. `e/*` `e//` `e/-` 로 바꾸면
  \(L=\frac12 m v^2-\frac12 k q^2\) 가 산다. `[실측]` 「CAS 불가」가 아님.

**안 한 것 (이 샘플 범위 밖):**

- 구동 진자 Fig 1.7 등 이후 그림. 「중간 그래프」는 Fig 1.1 로 특정했음.
- eval 결과를 `.org-cell-out` 안에 조판 — 계약 유지. 옆 div 우회.

---

## 결정 2번의 실물

`.org-cell-out`은 `<pre>`라 KaTeX auto-render가 건너뛴다 (앞 검수). 이 페이지는 같은 셀 안에

1. `<pre class="org-cell-out">` — 원문 TeX 문자열 (계약 준수, eval.js만 씀)
2. `<div class="tex-sample tex-render">` — 클릭 후 페이지 로컬 스크립트가 `katex.render`

둘을 나란히 둔다. 값은 두 번 보인다. 어색하다. 그게 근거다: 조판을 계약 안에 넣지 않으면 셀마다 쌍둥이 DOM이 생긴다.

Fig 1.1 SVG도 같은 우회 — out에는 스칼라 오차, 그림은 `#fig11-svg`. 그리지 위해 클릭 리스너를 **eval.js 다음에** 한 번 더 걸었다. eval.js는 그대로다.

---

## 경계

- 마크업 계약 유지. 기존 `proto/` 파일 수정 없음. org 원본 수정 없음. 커밋 없음.
- 결정 4건(Emmy 탑재 여부 / TeX 조판 계약 / SCI 격리 / 중첩 접힘)은 이 샘플이 답하지 않는다. 다만 결정 2는 이 페이지가 실물 근거를 제공한다.
