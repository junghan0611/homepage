# Clay 스파이크 — SICM 한 절이 `.clj`에서 정적 HTML로, Emmy 셀이 산다

담당: glm-5.3 (pi, zai, 2026-09-10). 커밋 안 함. 조율: `20260910T105902-b5c352`.
작업 자리: `/tmp/clay-sicm/` (회수 위치는 조율자가 정함). `dev/eval-stack/` 읽기만.
`viewer-rail.md` 안 건드림.

증거: `[실측]` thinkpad · OpenJDK 17 · Clojure 1.12.5 · Clay 2.0.22 · Emmy 0.32.0 ·
emmy-viewers 0.3.2 · Chrome 151 · `python3 -m http.server`. `[직접 읽음 file:line]` ·
`[웹 출처 URL]` · `[미확인 추정]`.

---

## 한 줄

**된다.** `notebooks/preface.clj` → Clay `[:html]` → 정적 파일 한 장
(`docs/notebooks.preface.html`, 698 KB). python 서빙만으로 KaTeX 14, Mafs 장면,
그리고 브라우저 scittle이 Emmy를 다시 돌려 `browser: 2\,x` 를 렌더했다.
열람에 JVM 없다. `[실측]`

---

## 1. 입력 소스 — 셋 비교, 영수증으로 골랐다

GLG가 wiki md를 가리켰지만 그대로 가지 않았다. 같은 자리(서문 라그랑주 식)를 셋이
어떻게 적는지 봤다.

| 소스 | 자리 | 수식 | 방언·잡음 | `.clj`로 옮기는 비용 |
|---|---|---|---|---|
| **wiki md** | `sicm-book/wiki/preface.md` 83줄 | `$…$` / `$$…$$` — 마크다운 수식 그대로 | `!!Polyglot`, `#page(xiv)`, `#Footnote(n)`, `#Quote(…)`, `#Caption … #CaptionEnd`, `[5](bibliography!bib_5)` — 줄 머리 지시어, 기계적으로 벗길 수 있음 | **가장 쌈.** Clay 주석이 마크다운이라 `$`가 바로 산다 |
| **org** | `sicm-book/org/preface.org` 123줄 | `\(\frac{d}{dt}…\)` 는 LaTeX. 함수 표기 `/D/(∂_{2}/L/ ∘ Γ[/q/])` 는 org 이탤릭 평문 — 수식 아님 `[상속: book-viewer.md]` | deepl/kagi 번역 초고가 본문에 섞임. `<<pxiv>>`, `^{[[#endnote_1][1]]}` | 수식 복원+초고 분리 비용. 한국어 층이 여기 있으면 나중  sorce는 여기 |
| **tgvaughan HTML** | 리포 안에 없음 `[실측 find]` | — | README가 변환 *출발점*으로만 적음 `[직접 읽음 sicm-book/README.md]` | 원격 클론이 선행. 이번 스파이크 입력으로 안 씀 |

README 정정 (조율자 브리핑과 같음, 재확인): org는 pandoc 직후가 아니라
**"and then doing much more conversion by hand"**. wiki는 그 org를 다시 md로 옮긴
jamescrook 포트이고 자체 위키 방언이다. `[직접 읽음 sicm-book/README.md,
README-wiki.md]`

**이번 스파이크 입력 = wiki md 서문 발췌.** 이유: 수식이 이미 `$` 폼이라 Clay
주석→마크다운 파이프에 그냥 들어간다. org 의존이 목적이 아니라는 GLG 결정과도
맞다. 한국어 curated 층이 필요해지면 org가 입력이 된다 — 그건 결정 5의 다음
갈림이지 이번 한 절의 문제가 아니다.

위키 방언 처리(손, 한 절 분량): `!!Polyglot`/`#page` 삭제, `#Footnote(n)` →
`[n]`, `/L/` → `*L*`. 각주·장간 링크는 이번 범위 밖 (책 뼈대 문제).

---

## 2. 산문은 노트북에서 어떻게 사는가

Clay 관례: **`;` 주석 = 마크다운**. `comment->item`이 `^;+\s?`를 벗기고
`item/md`로 넘긴다. `[직접 읽음 clay-2.0.22 notebook.clj:134-143]`

실측: 주석 안의 `$$\frac{d}{dt}…$$` 와 본문 `$…$`가 페이지에서 KaTeX로 조판됐다
(katex 14). `[실측 DOM]` `kind/md` 문자열로 감쌀 필요는 이 절에서 없었다.
코드 폼은 그대로 소스+결과 쌍으로 보인다. 숨기려면 `^:kindly/hide-code` /
`:kind/hidden` (이번엔 안 씀 — 노트북이니까 보여주는 게 맞다).

---

## 3. 심은 것 — 구운 값 + 살아있는 섬

proto/sicm.html 코드를 재료로. `[상속: sicm-sample.md]`

| 셀 | 층 | 화면에 뜬 것 `[실측]` |
|---|---|---|
| `Gamma` →TeX | JVM 굽힘 `kind/tex` | KaTeX 행렬 (`pmatrix` 존재) |
| 함수 표기 잔차 →TeX | JVM 굽힘 `kind/tex` | `k q(t) + m D^{2}q(t)` 조판 |
| 참 경로 `q=cos` | JVM 굽힘 값 | `0` |
| **Fig 1.1 오차** | JVM `find-path` n=3 | **`1.6772069029036274E-4`** — proto의 1.677e-4와 같다 |
| Mafs `y=x²` | `kind/emmy-viewers` → 브라우저 | 축 눈금 라벨·SVG (id1) |
| **`(e/+ 'x 'x)` →TeX** | `kind/scittle`+`kind/reagent` `:html/deps [:emmy]` | **`browser: 2\,x`** — JVM 없이 탭 안에서 다시 계산 |

**막힌 자리 (값짐):** `mafs/of-x`에 `q3`(find-path 다항 경로)를 넣으면
`ClassCastException Symbol→Number` (compile-1d). Fig 1.1을 *곡선으로* 그리는
일은 이 경로에서 안 된다. 스칼라 오차 재현은 된다. 곡선은 proto의 수제 SVG가
아직 더 싸다. `[실측 예외 /tmp/clojure-12794….edn]`

---

## 4. 열람에 JVM이 필요한가 — 이 산출물로 재확인

`python3 -m http.server 8801` 만으로 페이지를 열었다. Chrome 151 DOM:

```
katex:14  mafs:2  svg:3  reagentText:"browser: 2\\,x"
```

JVM 프로세스 없음. viewer-rail.md §4.2 판정(Clay `[:html]` 열람 시 JVM 불필요)을
**이 SICM 산출물이 다시 닫는다.** `[실측]`

---

## 5. CDN 자가호스팅 — 되는지 / 안 되는지 (채택은 열어둠)

Clay 기본 산출물은 `daslu.github.io/scittle/js/*` 를 `<script src>`로 싣는다
(scittle + reagent + emmy + emmy-viewers). `[실측 HTML src 목록]`

Clay *안*의 훅:

| 경로 | 결과 |
|---|---|
| `special-lib-resources` 키워드 (`:emmy` 등) | 전부 `:from-the-web` URL. `:from-local-copy` 키는 `include-libs-hiccup`가 읽지만 **이 버전 기본 테이블에는 쓰는 항목이 없다** `[직접 읽음 page.clj:16-90, 144-152]` |
| 사용자 맵 의존성 (`:html/deps [{…}]`) | `resolve-deps`가 맵을 **항상 `{:from-the-web …}`로 감싼다.** 사용자가 `:from-local-copy`를 넘겨도 그 가지로 안 간다 `[직접 읽음 page.clj:144-152]` |
| `:inline-js-and-css true` | **이 노트북에서 실패.** `include-inline`이 `src=nil` 태그를 `slurp` → `Cannot open <nil> as a Reader` `[실측 usage.clj B, page.clj:107]` |
| **손: 파일을 받아 `src`를 상대경로로 치환** | **된다.** daslu 5파일을 `docs/vendor/`에 받아 HTML의 URL을 `vendor/`로 바꿨다 (emmy.js 2.1 MB, emmy-viewers.js 3.2 MB). 같은 정적 서버에서 `reagentText:"browser: 2\,x"`, 스크립트 src 전부 `127.0.0.1:8801/vendor/…`. daslu 참조 0 `[실측 notebooks.preface.selfhost.html]` |

즉 **Clay 설정 키 `:from-local-copy`로는 오늘 못 열었고, 빌드 후 치환으로는
열렸다.** 채택(기본 CDN vs vendor)은 GLG 결정. Emmy JS는 GPL-3.0 — vendor로
실으면 고지 의무가 따라온다 `[웹 출처 GitHub API emmy GPL-3.0]`. 법 판단은 안 함.

---

## 6. 룩 — 뜯을 여지

Clay `[:html]` 산출은 평범한 HTML + Bootswatch가 인라인된 껍데기.
설정 훅 `:post-process`가 HTML 문자열을 받는다 `[직접 읽음 make.clj:380-381]`.

이번 실험: `</head>` 앞에 catppuccin-mocha 변수 한 덩어리를 주입
(`docs-look/`). 브라우저 computed style:

```
background: rgb(30, 30, 46)   /* #1e1e2e */
color:      rgb(205, 214, 244) /* #cdd6f4 */
#clay-spike-look 존재
reagent 셀은 그대로 "browser: 2\,x"
```

`[실측]` proto/style.css의 토큰을 *한 장에 입히는 것*은 된다. 셀 마크업은
`style="margin:15px"` 인라인이 많아 WebTUI 4상태·org `*` 접두를 재현하려면
CSS `!important` 또는 post-process 수술이 더 필요하다. **채택 조건으로서
“우리 미학으로 바꿀 여지”는 있다. 다만 Clay 룩을 지우고 WebTUI를 입히는 일은
다음 단계의 공수다** — 오늘은 훅이 산다는 것만 닫았다.

quarto 테마 길은 로컬 quarto 1.9.37 HTML 버그로 여전히 막혀 있다
`[상속: viewer-rail.md §4]`. 이번 스파이크는 `[:html]`만.

---

## 산출물 (전부 `/tmp/clay-sicm/`)

```
notebooks/preface.clj          저작 원본 (wiki 서문 발췌 + proto 셀)
docs/notebooks.preface.html    기본 Clay 산출 (daslu CDN)
docs/notebooks.preface.selfhost.html  vendor/ 치환본
docs/vendor/scittle*.js        받아 둔 런타임 (GPL 고지 대상 포함)
docs-look/notebooks.preface.html  post-process 룩 주입본
```

회수 위치는 조율자. 이 리포 `dev/eval-stack/`에는 안 넣었다.

---

## GLG/조율자가 아직 고를 것 (이번이 안 닫는 것)

1. 기본 CDN(daslu) vs vendor 자가호스팅 (+ GPL 고지).
2. 룩을 어디서 타협할지 — post-process 토큰만 vs WebTUI 전면.
3. Fig 1.1 곡선을  sal 것인가 — mafs/of-x(q3)는 막혔고, proto SVG는 된다.
4. 다음 절을 같은 `.clj` 패턴으로 늘릴 것인가. org 한국어 층을 섞을 시점.

결정 5(`.clj` 노트북)와 결정 1(Clay까지)은 이 한 절로 **경로가 뚫렸다.**
