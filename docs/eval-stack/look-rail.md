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

## 남은 것 (이 레일이 안 닫는 것)

- Clay 페이지 자체는 여전히 Cosmo. 두 면이 *완전히* 한 물건이 되려면 Clay
  `:post-process`로 같은 `--read-*` 토큰을 심어야 한다. 노트북 동결이라 오늘은
  사이트 셸만.
- hextra 카드/목록의 세부(배지 간격)는 손대지 않았다. 리듬이 우선이었다.
