# NEXT--rebuild-eval-stack.md

브랜치 핸드오프. 좌표는 **issue #1**, 이 파일은 다음 한 걸음.
main 의 `NEXT.md` 는 현행 Hugo 사이트 몫이고 여기와 섞지 않는다. 머지 전에 이 파일은 지운다.
2026-09-10 17:40 KST.

## 방향 — 한 문단으로

**저작만 Clojure 로 간다. 사이트는 지금 것을 지킨다.**
글은 `.clj` 노트북으로 쓰고, Clay 가 그것을 자기완결 HTML 한 장으로 굽는다. 그 안에서
JVM 이 미리 계산해 둔 값과, 브라우저 scittle 이 살려 두는 셀이 함께 산다. **독자에게는
JVM 이 가지 않는다.** 그 페이지를 감싸는 껍데기 — nav · footer · i18n · JSON-LD · RSS ·
taxonomy — 는 이미 Hugo 가 내고 있으므로 다시 만들지 않는다. Clojure 로 사이트 전체를
재구현하는 값을 이 브랜치는 치르지 않는다.

org 는 이 판의 목적이 아니다(GLG 판정 2026-09-10). 홈페이지에 들어갈 글은 가든 전체가
아니라 curated 소수라, 저작면을 갈라도 삶의 데이터 축이 갈라지지 않는다. 다만 **한국어
층이 필요해지면 org 가 입력이 된다** — `sicm-book/org/` 에 GLG 의 번역 초고가 이미 섞여
있다(실측). 버리는 게 아니라 다른 자리다.

## RAIL

```
[x] 검수 (임시 리포 lichtung)
[x] main 퍼블리시                 1c28c70..6febb5c
[x] 좌표 · 브랜치 · 회수           issue #1 · rebuild/eval-stack
[x] 뷰어 축 조사                   kindly / Clay / Clerk        3a02cd9
[x] Clay 저작 경로 실증            한 절 end-to-end             27001e2
[x] 사이트 층 판정                 템플레이팅 불필요            8a9a9c4
[x] run.sh 수선                    포트 선검사 · 번호 메뉴      a92babc
[x] 시인성 — 읽기 리듬 · 전부 모노  세 면이 한 물건              46082ea 15fcf45
[x] 품질 홉                        입구 · 히어로 · 토글 · 격자   e43a7f3 fffc51a
[ ] eval-stack 재검수              ← 다음 텀 첫 일 (GLG 지시)
[ ] 한 절 → 여러 절
[ ] 껍데기 결합 방식 결정 후 구현
[ ] Netlify 서빙 테스트
[ ] 발행 전 라이선스 체크리스트
[ ] 한 번에 발행
```

## 무엇이 증명됐나 (전부 이 머신 실측)

- 브라우저에서 Lisp 이 돈다 — scittle. 독자가 고쳐 재평가한다.
- **Emmy 가 브라우저에서 돈다** — `scittle-kitchen`. `(e/->TeX (e/simplify (e/+ 'x 'x)))` → `2\,x`.
- **책의 숫자가 계산으로 재현된다** — SICM Fig 1.1 오차 `1.677e-4`, `find-path` n=3.
- **`.clj` → 정적 HTML 한 장** — Clay 2.0.22, 698KB. KaTeX 14 · Mafs 장면 · 브라우저 Emmy 셀.
  **열람에 JVM 없다.**
- **남의 뷰어에 우리 룩을 입힐 수 있다** — Clay `:post-process` 로 배경 주입 확인.
- **Clay 는 사이트를 안 준다** — 노트북 셋을 한 번에 구워도 `<nav>` 0. 파일 묶음이다.
- **템플레이팅은 필요 없다** — soupault 5.3.0 `generator_mode=false` 가 자기가 만들지 않은
  HTML 에 nav 를 심었다. 페이지를 다시 짤 필요는 없고 껍데기를 심을 자리만 필요하다.

## 세 면이 한 물건이다 (2026-09-10 닫힘)

| | KO 글 | EN 대문 | Clay preface |
|---|---|---|---|
| 본문 | 16 / 25.6 (1.6) | 같음 | 같음 |
| h1 | 29.6 / 37 | 같음 | 같음 |
| 폭 | 591px (**70ch**) | 같음 | 같음 |
| 배경 | mocha `#1e1e2e` | 같음 | 같음 (Cosmo 눌림) |
| 서체 | GLG Mono 스택 | 같음 | 같음 |

공유 스타일시트는 `dev/eval-stack/site/read.css`. Clay 쪽은 `:post-process` 로 끌어온다.

**폰트 스택**: `"GLG Mono", "Sarasa Fixed K", "D2Coding", "Noto Sans Mono CJK KR", monospace`.
**GLG Mono 에는 한글이 없다.** 그냥 `monospace` 로 폴백을 두면 `fc-match "GLG Mono:lang=ko"`
가 Noto Sans CJK KR(비례폭)로 가서, 모노를 요청하고 섞인 격자를 받는다.
격자가 살아있다는 영수증은 폭 비율이다 — `M` 8.45px, `가` 16.91px, **정확히 2.00배**.
비례폭 폴백은 이 비를 못 낸다.

**폭은 px 가 아니라 `ch` 로 잡았다.** 모노는 sans 보다 넓어 같은 글자수에서 픽셀이 커진다.
서체를 바꿔도 읽기 폭이 따라오게 하려면 `ch` 여야 한다.

⚠️ **현행 라이브 사이트(main)도 같은 폴백 문제를 갖고 있다** — `assets/css/custom.css:41`
이 `ui-sans-serif` 폴백이다. 이 브랜치와 별개로 main 에서 닫을 수 있다.

## 어디까지 왔나 — 정직하게

**룩은 발행해도 될 품질이다.** 세 면이 한 격자 위에 있고, 히어로는 main 과 같은 카피이고,
토글은 `ch` 격자에 앉고 상태를 aria 로 말한다. GLG 판정(2026-09-10): *"조금만 정리하면
바로 퍼블리시 가능할 수준."*

**배선은 아직 아니다.** 지금 `dev/eval-stack/site/` 는 `_generate.py` 가 뽑는 정적 목업이고,
Hugo 콘텐츠 모델 밖에 있다. 발행하려면 이것들이 남는다:

- Clay 산출을 Hugo 가 서빙하는 자리에 앉히기 (`static/` 인가 후처리인가 — 아래 결정 1)
- `SLOT:` 60개를 실제 Hugo partial 로 잇기 (JSON-LD · RSS · taxonomy · 댓글 · editURL)
- i18n 을 Hugo in-tree i18n 과 만나게 하기
- `DEV_BAR = False`
- 웹폰트 11MB 서브셋
- `attribution.md` §0 체크리스트

**Hugo 는 그대로 쓴다.** 오늘 판정이 그거다 — 저작만 Clojure 로 가고 셸은 Hugo 가 진다.
사이트 층을 Clojure 로 다시 세우는 값을 이 브랜치는 치르지 않는다.

## 다음 텀 첫 일 — eval-stack 재검수 (GLG 지시)

*"다음 텀에 eval-stack 쪽 특히 다시 검수를 좀 하자."*
오늘 하루에 형제 여덟이 지나갔고 판정이 12장 쌓였다. 넓히기 전에 **한 번 훑어 서로
어긋난 곳·낡은 곳을 정리한다.** 특히 `proto/` 계약 4건은 Clay·kindly 채택 뒤 일부가
흡수됐을 수 있는데 아직 재검토 안 했다.

## 그 다음 — 한 절을 여러 절로

지금 Clay 노트북은 `preface.clj` 한 장이다. 여러 절이 되면 그때 비로소 목차 · 페이지 간
이동 · 목록면이 필요해지고, **껍데기 결합 방식(아래 결정 1)이 실물로 갈린다.** 순서가 그렇다 —
먼저 넓히고, 그 다음에 껍데기를 정한다.

## 열린 결정

**결정났음** — 저작은 `.clj`(결정 5) · kindly 어휘 채택 + Clay 저작기까지(결정 1) ·
사이트 셸은 Hugo 유지(유력, GLG 확인 대기) · **수식 엔진은 KaTeX 하나**(2026-09-10,
GLG «katex로 하면 된다. 하나만 하자»). MathJax 는 후보에서 내림 — Clay 산출과 현행
hextra(`math: true`)가 이미 둘 다 KaTeX 라 바꿀 근거가 없다. 다시 열려면 «Emmy `->TeX`
가 뱉은 표현을 KaTeX 가 못 조판한다»는 실측이 선행 조건이다. · **서체는 전부 모노**
(GLG Mono + 한글 모노 fallback) — 산문 sans 절충은 폐기.

**남은 것**
1. **껍데기 결합 방식** — Clay 산출을 Hugo `static/` 에 그냥 둘지, soupault 후처리로 nav ·
   hreflang 까지 씌울지. 전자는 오늘 당장 되고, 후자는 eval 면이 사이트와 한 몸으로 보인다.
2. **scittle/emmy 런타임 자가호스팅** — `daslu.github.io` 는 개인 GitHub Pages 다.
   GPL 고지 의무와 가용성이 둘 다 자가호스팅을 가리킨다. Clay `:from-local-copy` 는 사용자
   설정으로 안 열리고(맵을 항상 `from-the-web` 으로 쌈), **파일을 받아 `src` 를 치환하면 된다**(실측).
3. **로컬 quarto 1.9.37 이 HTML 을 전혀 못 굽는다** — 오늘 세 번 걸렸다(Quarto 경로 ·
   Clay book 모드 · 발행기 후보). 수선은 nixos-config 영역일 수 있다. **별건으로 세울 것.**
4. **SICM 산출물을 어떻게 배포에 태울지** — `build.py` 소스가 리포 밖이다.
   ① 생성물 커밋 ② org 벤더링(CC BY-NC-SA 재배포라 고지가 그때 걸린다) ③ 서브모듈.
5. **라이선스 7건** — `docs/eval-stack/attribution.md` §6. 발행 직전에 §0 체크리스트를 연다.
6. **proto 계약 4건** — Emmy 기본 탑재 · TeX 조판을 계약에 넣을지 · SCI 셀 격리 vs 공유 ·
   org 중첩 접힘. Clay 채택으로 일부는 kindly 가 흡수할 수 있다. 재검토 필요.

## 미결 — main 쪽

- **첫 블로그 글** `content/blog/20260804T094556.{md,ko.md}` 미커밋. `date: 2026-08-04` 을
  그대로 둘지 발행일로 당길지 GLG 미정.
- **KO 메뉴 라벨이 영어다.** `hugo.yaml` 에 `languages.ko.menu` 오버라이드 없음.
  현행 라이브 사이트의 결함이고 이 브랜치와 무관하게 main 에서 닫을 수 있다.

## 어디에 무엇이 있나

```
docs/eval-stack/      KONZEPT + 판정 12장 (읽는 것)
dev/eval-stack/clay/  .clj 노트북 · deps.edn · usage*.clj   ← 지금의 저작 경로
dev/eval-stack/proto/ 브라우저 eval 원형 (sci-eval.html 은 첫 영수증, 보존)
dev/eval-stack/site/  현재 구성 재현 10장 — 껍데기 참고용
dev/eval-stack/book/  build.py — pandoc 렌더러
```

`dev/` 와 `docs/` 는 Hugo 가 읽지 않는다. 산출물은 전부 gitignore — 소스만 커밋한다.

## 팀

| 자리 | garden id | 비고 |
|---|---|---|
| 조율 | `20260910T105902-b5c352` | homepage, entwurf/claude-opus-5 |
| 구현·조사 | `20260910T152414-d530ed` | **record 는 `zai/glm-5.3`, 실제로 도는 모델은 grok** (GLM 쿼터 소진으로 GLG 가 세션 중간에 교체) |

**meta-record 의 모델은 세션 시작 시점 기록이라 중간 교체를 못 따라온다.** 봉투와 형제의
자기보고가 어긋나면 형제 쪽이 맞을 수 있다 — 임의로 고치지 말고 물어라. 2026-09-10 에
코디네이터가 이걸로 한 번 틀렸다.

## 함정 (같은 데 두 번 빠지지 않게)

- npm 의 `emmy` 는 무관한 이벤트 이미터다. Emmy 는 kitchen 플러그인이고 kitchen 의
  `scittle.js` 와 짝이어야 한다.
- KaTeX auto-render 는 `<pre>` 를 건너뛴다.
- 셀 하나만 다시 누르면 **살아남은 상태가 조용히 답을 준다.** 크래시가 아니라 침묵하는 성공.
- cljs 기본 `*` 에 심볼을 넣으면 `NaN`. `e/*` `e/-` 를 써라.
- WebTUI base 의 `word-break:break-all` 이 한국어 산문을 자른다. 영어로만 보면 안 보인다.
- GLG Mono 에는 한글 글리프가 없다. 한글은 fallback 이라 라틴 기준 행간이 빡빡하다.
- **quarto 를 전제하는 길은 이 머신에서 전부 막혀 있다.**
- 스파이크가 띄운 서버가 살아남아 포트를 문다. 띄우기 전에 점유를 확인해라.

## 예우

SICM 은 **Gerald Jay Sussman · Jack Wisdom** (온라인 2판; Meinhard E. Mayer 는 1판 공저자).
Emmy 는 **Colin Smith · Sam Ritchie**. `sicm-book` org 판은 **Sam Ritchie**, wiki 판은
**jamescrook** 포트, 그 출발점은 **@tgvaughan** 의 HTML 판.
scittle **borkdude**, scittle-kitchen **Timothy Pratley**, soupault **Daniil Baturin**.
라이브러리 저자를 도구 제공자로 격하하지 않는다.
