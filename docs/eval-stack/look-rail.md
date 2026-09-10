# 룩 레일 — Clay의 읽기 품질을 사이트 셸로

담당: record `glm-5.3` (세션 시작 meta) · 실제로 돈 모델 **grok** (pi, 2026-09-10).
조율: `20260910T105902-b5c352`. 커밋 안 함.

증거: `[실측]` Chrome 151 · `http://127.0.0.1:2348/site/` 및 Clay preface.
`[직접 읽음 file:line]`.

---

## 1. Clay 산출물의 룩이 무엇으로 이루어져 있는가

대상: `dev/eval-stack/clay/docs/notebooks.preface.html` (698 KB).
구성: Bootswatch Cosmo 5.3.3(Bootstrap 인라인) + Google Fonts **Source Sans Pro**
+ 코드용 Fira Code 선언 + KaTeX/Mafs CSS CDN. `[실측 HTML <style>/<link>]`

Chrome computed `[실측 preface.html]`:

| | font | size / line-height | 색 | 폭 |
|---|---|---|---|---|
| body | Source Sans Pro | 16px / 24px (**1.5**) | `#373a3c` on `#fff` | 뷰포트 918px |
| h1 | 같은 sans | **29.6px** / 35.5px | 본문과 같음 | 본문 666px |
| p | 같은 sans | 16 / 24 | 본문 | 666px |
| pre | SFMono / Menlo | 14 / 21 | 검정 | 666px |

인상을 만드는 것, 우선순위:

1. **산문이 sans이고 코드가 mono다.** 한 페이지가 터미널이 아니다.
2. **제목 스케일** — h1이 본문의 ~1.85배. 사이트는 고치기 전 h1=16px=본문.
3. **행간 1.5** 와 **본문 폭 ~666px** (대략 65–70ch sans). 숨 쉴 자리.
4. 코드 셀 `margin:15px` + `bg-light` 가 노트북처럼 칸을 가른다.
5. KaTeX가 본문 sans 옆에 세리프로 앉는다 (셀 안이 아니라 문장 속).
6. **밝은 Cosmo** — 이건 읽기 품질이 아니라 Bootswatch의 기본 스킨이다.

5·6은 우리 미학(Catppuccin, WebTUI 크롬)과 충돌한다. 1–4가 가져올 리듬이다.

---

## 2. 가져오는 방식 — 고른 것

| | 대가 |
|---|---|
| ① Clay CSS 추출해 공용 시트 | 두 면이 같은 파일을 쓰니 드리프트 없음. 그러나 그 파일은 **Bootswatch Cosmo + Source Sans + 흰 배경**이다. WebTUI·Catppuccin·모노 크롬이 죽는다. 698KB 인라인을 공용으로 빼는 일도 정직하지 않다. |
| ② `site.css`에 시각 언어를 다시 그림 | 우리 손. 드리프트 가능. |
| ③ **섞는다 (채택)** | proto/WebTUI는 크롬(내비·브랜드·테마)에 남기고, **산문 리듬만 Clay 실측값으로 맞춘다.** Clay CSS는 가져오지 않는다. |

①이 “정직”하려면 두 면이 *같은 룩 파일*을 써야 한다. 오늘 그 파일의 정체는 Cosmo다.
GLG 축은 “hextra 스타일 + WebTUI”, Catppuccin, 터미널 크롬. 그래서 ①은 기각.
Clay 노트북은 영수증으로 동결이라 공용 시트를 Clay 쪽에 심을 수도 없다.

토큰 (사이트 `:root`, Clay 실측에 맞춤):

```
--read-font: ui-sans-serif, system-ui, "Noto Sans KR", "Noto Sans CJK KR",
             "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
--read-measure: 42rem;   /* 실측 672px, Clay 본문 666px */
--read-leading: 1.7;     /* Clay 1.5보다 한글에 조금 더 연다 */
h1 / .post-title(글): 1.85em → 실측 29.6px  (Clay h1과 같음)
```

Google Fonts는 안 넣는다 (제3자 트래커 금지, AGENTS.md). Noto Sans KR는
이 머신에 있다 `[실측 document.fonts.check("16px \"Noto Sans KR\"") === true]`.

---

## 3. 적용 — 화면에 실제로 보인 것

소유: `dev/eval-stack/site/site.css`. `_generate.py`는 HTML 구조가 이미 맞아서
안 건드렸다. proto·clay 노트북은 안 만졌다.

**고치기 전** KO 글 (`/site/ko/blog/evaluated-page/`) `[실측 2342, mocha 기억]`:

- 전면 monospace 16 / **20.8 (1.3)**
- h1 = 본문 16px, 초록
- 본문폭 720px (90ch)
- `word-break: keep-all` 은 이미 있음 (WebTUI `break-all` 수선)

**고친 뒤** 같은 글 `[실측 2348]`:

- 내비 브랜드 `어쏠로지` — 여전히 **monospace** (크롬)
- h1 `평가되는 페이지` — **sans 29.6px / 37px**, 초록, keep-all
- 본문 p — **sans 16 / 27.2 (1.7)**, keep-all, Noto Sans KR 스택
- `.site-main` max-width **672px**
- 단락 높이 54px (두 줄 × 1.7) — 예전 1.3에서 한글이 붙던 느낌 없음

KO 대문 히어로 레데
「삶은 언제나 여여(如如)하다…」 sans 16/27.2 keep-all. `[실측 /site/ko/]`

KO 목록 요약도 같은 스택 27.2px. `[실측 /site/ko/blog/]`

WebTUI가 `p { font-family: monospace }`를 본문에 다시 씌워서, `.post-body p`에
sans를 **한 단계 더 특정**해야 했다. 제목만 바뀌고 본문이 모노로 남는 상태가
한 번 관측됐다 `[실측 .post-body=sans, p=monospace → 선택자 보강]`.

색은 mocha (로컬 테마 기억). 라이트(latte) 토글은 그대로 산다. Clay의 흰 Cosmo로
바꾸지 않았다.

---

## 4. 한국어

- `word-break: keep-all` 유지. 산문 선택자에 제목도 넣었다.
- 행간 1.7. Clay의 1.5는 라틴 Source Sans 기준이고, 한글 본문에는 부족하다
  (고치기 전 1.3은 더 빡빡했다).
- Noto Sans KR 실재. 모노 폴백으로 한글 제목을 그리던 자리는 산문에서 사라졌다.
  브랜드 `어쏠로지`는 의도적으로 모노 — 글리프는 시스템 모노 CJK 폴백.

---

## 5. run.sh · book 모드

메뉴는 `hugo` / `stack` / `clay` / `both`. `book` 없음.
책 전문은 `python3 dev/eval-stack/book/build.py` (개인 열람).
`book-viewer.md` 맨 위에 내린 이유를 한 줄 적음. build.py는 그대로.

---

## 6. 전부 모노 — GLG Mono (2026-09-10 2홉)

산문 sans 절충 폐기. GLG: «나는 모노스페이스가 편하다.»

**함정:** `fc-match "GLG Mono:lang=ko"` → Noto Sans CJK KR (비례폭).
`font-family: "GLG Mono", monospace` 만 쓰면 한글이 조용히 비례로 떨어진다.
homepage `assets/css/custom.css:41` 이 그 패턴이다 (`ui-sans-serif` 폴백).

**스택 (실측 후 채택):** `"GLG Mono", "Sarasa Fixed K", "D2Coding", "Noto Sans Mono CJK KR", monospace`

폭 측정 16px `[실측 KO 글, Chrome 151]`:

| 글자 | px | 비고 |
|---|---|---|
| `M` / `0` | 8.45 | GLG Mono 모노 |
| `가` | 16.91 | **2.00 × M** — Sarasa Fixed K 2:1. 비례폭이면 이 비가 안 나온다 |

**로드:** `document.fonts.check('16px "GLG Mono"') === true`.
`GLG-Mono-Regular.woff2` transferSize 2 644 320. `/site/fonts/` → `static/fonts` 심볼릭.

**리듬 재측정** (모노는 sans보다 글자폭이 넓다. 42rem=672px 폐기 → **70ch**):

| | KO 글 | EN 대문 | Clay preface |
|---|---|---|---|
| 본문 | 16 / 25.6 (1.6) | 같음 | 같음 |
| h1 | 29.6 / 37 | 같음 | 같음 |
| 폭 | 591px (70ch) | 591px | 591px `.container` |
| 배경 | mocha `#1e1e2e` | 같음 | **같음** (Cosmo 흰 배경 눌림) |
| 서체 | GLG Mono 스택 | 같음 | 같음 |

70ch × 8.45px = 591.5px. 66ch면 557px로 좁다. 70ch를 유지.
행간 1.6: 한글 keep-all 본문에서 1.5는 붙고 1.7은 헐거웠던 중간. 1.6으로 닫음.

**한 물건:** Clay `:post-process`가 `/site/read.css` + webtui/catppuccin 을 싣고
`data-webtui-theme=catppuccin-mocha`. 본문·h1·폭·색이 사이트와 같다.
`notebooks/preface.clj` 내용은 안 바꿈.

**KaTeX 확정 (GLG 2026-09-10: «katex로 하면 된다. 하나만 하자.»).** MathJax는 후보에서 내림. 엔진을 늘리지 않는다. 폰트는 안 건드렸다.

실측 Clay preface, mocha 본문 옆 `[실측]`:
- 인라인 `.katex`: **KaTeX_Main** 17.64px / 21.2px, 색 `rgb(205, 214, 244)` — 본문과 같은 잉크.
- 디스플레이 수식은 본문 폭(528px) 안에 앉는다. 14곳 조판.
- 본문 GLG Mono 16px 모노 옆에 세리프 수식이 조금 크고, 획이 다르다. 색이 같아서 같은 문단의 다른 소리로 읽힌다. 깨지거나 칸 밖으로 넘치지는 않았다.

**11MB 웹폰트:** Regular+Bold+Italic+BoldItalic ≈ 10.98MB. 로컬은 블로커 아님.
발행 때 서브셋 필요.

심볼릭: `dev/eval-stack/site/fonts` → `../../../static/fonts`.

## 7. 입구 · 히어로 · 토글 (2026-09-10 3홉)

- `dev/eval-stack/index.html` — `localhost:2342/` 개발 입구. site / clay / proto / book.
  clay·book 은 HEAD 로 없으면 링크를 내지 않는다. `[실측: clay·book 있을 때 링크 13개, missing 0]`
- 히어로: `_index.md` / `_index.ko.md` (6febb5c) 그대로. 불릿 0.
  KO 마지막 줄 한 글자 안 바꿈. `[실측]`
- 토글: `[ EN | KO ]` `[ lt | dk ]` 각 칸 33.8px 동일 (2글자 모노).
  KO 면에서 KO=current, dk=pressed. `[실측 /site/ko/]`

## 8. 격자 · dev 바 (2026-09-10 4홉)

칸이 안 맞던 원인: `.seg-bar` 폭 없음(`|` 자연폭) + `height: 1.5lh`와 `line-height: 1` 혼용.
조치: 단위를 `ch`만. 셀 4ch, 막대 1ch, 높이 2.5ch.

실측 EN/KO 대문, 1ch=8.45px `[실측]`:

| | 폭 | 높이 | top |
|---|---|---|---|
| EN\|KO | 78px (4+1+4 ch + 테두리 2px) | 21.11 (2.5ch) | 52.88 |
| lt\|dk | 78px | 21.11 | 52.88 |
| 셀 | 33.78 = **4.00ch** | 19.11 | |
| \| | 8.44 = **1.00ch** | 19.11 | |

두 `.seg` 가 같은 top·같은 박스. 안쪽은 ch 격자.

**dev 바:** footer 아래 `← eval-stack`. 본문 nav 아님.
`_generate.py` `DEV_BAR = True` — 발행 시 False. `SLOT: DEV_BAR` 주석.
실측 href: EN `/` → `../`, KO `/site/ko/` → `../../`.
