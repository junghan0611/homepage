# SICM 책 전체 뷰잉 — 판정

담당: grok-4.6 (pi, 2026-09-10). 커밋 안 함.
산출: `book/` (`build.py` + pandoc HTML + `images/` + `style.css` 복사본).
`proto/` 동결, 원본 org 읽기만.

로컬: `http://127.0.0.1:8766/` (book 루트).

---

## 0. 원본이 몇 개인가

`~/sync/code/junghan0611/sicm-book/org/*.org` 는 **18개**다. 브리프의 19는 과대. `[실측 ls]`

영어 책 척추 17 + 한국어 초고 `ch09.org` 1.
`ch09.org` 첫줄: 「레이텍스 수식은 사라짐 / 한글 번역」. 척추에 넣지 않고 인덱스의 “Not in the English spine”에만 둔다. `[직접 읽음 ch09.org:1-3]`

원본은 MIT Press 2판 HTML(tgvaughan) → pandoc → 손교정 org다. `[직접 읽음 sicm-book/README.md]` Jekyll `{% include %}` 가 파일마다 남아 있다.

---

## 1. org → HTML 을 무엇으로 하는가

**빌드타임 pandoc org→html5 + 브라우저 KaTeX.** 브라우저 uniorg/orgajs가 아니다.

이유 (이 18개 실물):

| 변환기 | 이 책에 대한 판정 |
|---|---|
| **pandoc 3.7 org→html** | 된다. preface 2.8s, chapter001 ~3s. `\(...\)`·`$...$`를 `<span class="math">`로 남긴다. 내부 링크 `file:chapter001.html#h1-2` 가 `chapter001.html#h1-2` 로 산다. `[실측]` |
| **ox-html (Emacs)** | 더 충실할 수 있으나 에이전트 빌드 한 방에 안 묶었다. Hugo 회수 때도 Emacs가 빌드 의존이 된다. |
| **uniorg/orgajs 브라우저 파싱** | 이 원본은 Jekyll 잔재 + 표기 혼재 + 271KB 장. parser 조립 프로젝트다. Hugo는 그 JS를 콘텐츠 파이프로 못 쓴다. `[직접 읽음 docs/doc-format-rail.md 결론 5]` |

표기가 변환기를 고른다:

- `preface.org:54` LaTeX `\(\frac{d}{dt}...\)` → pandoc math span → KaTeX 조판. `[실측 preface.html katex=4, 에러 0]`
- `preface.org:66` org 아래첨자 평문 `/D/(∂_{2}/L/ ∘ Γ[/q/])` → `<em>` 수프. **수식이 아니다.** 변환기 버그가 아니라 원본이 수식 문법이 아님. `[직접 읽음]` `[실측]`
- 장 2 이후는 `$...$` / `$$...$$` 가 주력. pandoc이 “Could not convert TeX math, rendering as TeX” 경고를 내도 스팬 안에 TeX가 남아 KaTeX가 받는다. `[실측 pandoc-warnings.txt]`

**못 한 것 vs 안 되는 것**

- 안 됨(원본 문법): org 이탤릭 평문을 수식으로 복원하는 일. preface:66.
- 됨, 단 깨지는 자리 있음(아래 §3): `\begin{array}...\end{equation}` 불일치, `$` 미종결이 src 블록을 삼킴.
- 못 함(이번 범위): ox-html과 1:1 비교. 추정 금지, 다음 스파이크.

---

## 2. 장 간 이동

척추 순서 (toc.org 기준): Title → Dedication → Preface → Acknowledgments → Contents → ch.1–7 → Appendix Scheme → Appendix Notation → Exercises → Bibliography → Index.

- 각 페이지 상·하 `← prev · Contents · next →`. `[실측 preface nav]`
- 장 안 앵커: `chapter001.html` 에 `id="h1-2"` 존재. toc 링크와 맞다. `[실측]`
- 문헌: `bibliography.html#bib_16`. `[실측 chapter001]`
- 각주: org `[fn:N]` → pandoc `<a href="#fn1">` + 페이지 끝 footnotes. preface의 `^{[[#endnote_1][1]]}` 도 `<a href="#endnote_1">` 로 남는다. `[실측]`
- `file:book.html` → `index.html`, `file:index.html`(색인) → `keyword_index.html`. `[직접 읽음 book/build.py LINK_MAP]`

깨지면 책이 아닌 자리: keyword_index 1904개 링크는 pandoc이 변환한다. 전수 클릭은 안 했다. `[미확인 추정 — 전수]`

---

## 3. 수식 조판 — 파일별

KaTeX 0.18.7 auto-render, `throwOnError: false`.

| 파일 | pandoc WARNING | 브라우저 메모 |
|---|---|---|
| titlepage, dedication, acknowledgments, toc, appendix, bibliography, chapter008 | 0 | 수식 거의 없음 / Scheme 부록 |
| preface | 3 | `[실측]` katex 4, katex-error 0. 전통 라그랑주 식 조판됨 |
| chapter001 | 48 | `[실측]` math 스팬 100, katex 28, **katex-error 17**, 미조판 스팬 73 |
| chapter002 | 225 | `$`/`overset` 대량. 경고=TeX 잔류 |
| chapter003 | 198 | 동 |
| chapter004 | 46 | 동 |
| chapter005 | 347 | 경고 최다 |
| chapter006 | 188 | 동 |
| chapter007 | 101 | 동 |
| chapter009 | 35 | 표기 부록 |
| keyword_index | 6 | |
| ch09 (ko) | 14 | 파일 자신이 「수식 사라짐」 |

chapter001에서 실제로 깨진 패턴 `[실측 .katex-error title]`:

1. `\begin{array} ... \end{equation}` 환경 불일치 (식 1.111, 1.116, 1.141, 1.159, 1.169, 1.175 근처).
2. `$` 미종결 → 다음 `#+begin_src scheme` 이 수식 모드로 빨려 들어감.
3. 수식 안에 다시 `$` (`Can't use function '$' in math mode`).

이건 「KaTeX가 모노스페이스에서 깨진다」가 아니다. **원본 TeX/org 표기가 닫히지 않은 자리**다.

---

## 4. 이미지

`org/images/` 2.7MB → `book/images/` 복사. `[실측]`

org `[[file:images/…]]` 103개 중 HTML `<img>` **101개**. `[실측 재빌드 후 집계]`

**빠진 둘 (chapter001):** `Art_P19.jpg` (Figure 1.1), `Art_P138.jpg` (Figure 1.2).
둘 다 `#+caption:` 바로 아래 + 다음이 `#+begin_src` 이라 pandoc이 캡션·그림을 통째로 삼켰다. `[직접 읽음 chapter001.org:756-762, 2341-2347]` `[실측 html에 파일명 없음]`

Figure 1.1은 `proto/sicm.html` 이 **계산으로** 이미 재현했다 (오차 1.677e-4). 뷰어 HTML에는 그 비트맵이 없다. 못 한 것(캡션 결합 전처리)이지, 그림 파일이 없어서가 아니다.

그 외 장 2–7 이미지는 토큰 치환 후 전부 `<img src="images/…">`. `[실측]` chapter001의 산 9장 중 5장은 본문, 일부는 src 블록 안에 토큰이 남아 img로 바뀐 자리(캡션이 코드로 들어간 원본 버그).

---

## 5. eval 셀을 어디에 넣을 것인가 — 목록만

전부 구현하지 않는다. emmy 번들 ~493KB를 장마다 싣지 마라.

Scheme 블록: chapter001 **85**, chapter008 **83**. 다른 장은 `#+begin_src scheme` 0. `[실측]`

표본 (지금 구현하지 않음, 자리만):

| # | 자리 | 왜 표본인가 | 상태 |
|---|---|---|---|
| A | ch1 `L-harmonic` + `find-path` n=3, Fig 1.1 | 책 숫자 재현. | **이미** `proto/sicm.html` `[실측 1.677e-4]` |
| B | ch1 `L-free-particle` + `Gamma` + `compose` | 서문 Γ[q] 와 같은 객체 | 미구현. emmy에 `Gamma` 있음 `[실측]` |
| C | ch1 `Lagrangian-action` 수치 (3.0, 0..10 → 435) | 숫자 영수증 | 미구현 |
| D | ch1 `Lagrange-equations` / `Euler-Lagrange-operator` | 서문 식을 연산자로 | 미구현. operator는 emmy.env public |
| E | ch1 `L-pend` 구동 진자 (Fig 1.7 궤도) | 그래프를 이미지에서 계산으로 | 미구현. `evolve`/`state-advancer` 실측 전 |
| F | ch8 Scheme 부록 블록 | 언어 입문. CAS 아님 | 넣을 자리 아님 (산술 예시) |

권장: A는 proto에 있고, 회수 때 chapter001 페이지에 A·D 두 섬만 얹는다. E는 `evolve`가 SCI에서 도는지 따로 재고 나서.

---

## 6. Hugo로 옮길 때

회수 대상은 `book/*.html` + `book/images/` + `book/style.css` + `book/build.py`.

- **산 길:** Hugo `static/sicm/` 에 이 HTML을 그대로 둔다. 메뉴만 `hugo.yaml`에 `/sicm/` 한 줄. JSON-LD/RSS는 대문 쪽 껍데기 그대로. 빌드는 `python3 book/build.py` 한 번 (또는 `assets` 파이프).
- **죽 길:** 브라우저 uniorg SPA, 또는 장마다 emmy CDN. 회수하면 다시 만들어야 한다.
- **중간:** ox-hugo로 md를 다시 뽑기 — 이 org의 `$`/`equation`/`array` 혼재가 md+KaTeX에서 더 깨진다. 지금 HTML이 낫다.
- 페이지는 pandoc `h1/h2` 다. proto의 `<details class="org-section">` 계약을 **책에 적용하지 않았다.** 6000줄 장을 details로 접으면 책이 안 된다. 회수 때도 읽기 페이지 ≠ eval 섬.
- `book/style.css` 는 proto 복사본이다. proto를 동결한 채 여기만 고쳐라.
- 리포 이름 `lichtung`을 라이선스 문안에 넣지 마라 (NEXT.md).

---

## 경계

- 커밋 없음. org 원본 수정 없음. proto 수정 없음. site/ 손 안 댐.
- 결정 4건(Emmy 탑재 / TeX 조판 계약 / SCI 격리 / 중첩 접힘)은 이 뷰어가 닫지 않는다.
