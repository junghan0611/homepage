# 문서 포맷 · 콘텐츠 파이프 레일

> 조사 범위: 구현·커밋 없음. `KONZEPT.md`와 그가 가리킨 두 Org 원본, 현재 homepage 발행 계약, 공식 문서/프로젝트 원문을 읽었다.
>
> **증거 표기:** `[직접 읽음 file:line]`은 이 조사에서 읽은 로컬 파일, `[웹 출처 URL]`은 해당 URL 원문, `[미확인 추정]`은 아직 스파이크가 필요한 설계 판단이다.

## 결론 — 포맷을 갈지 말고, 먼저 Org 결과를 현재 Hugo에 통과시켜라

1. **가장 싼 1단계는 `Org SSOT → Babel 평가 결과 → ox-hugo → Markdown → Hugo`이다.** 현재 계약이 이미 한국어 Org 원본, 수동 `org-hugo-export-wim-to-md`, Hextra/Hugo 검증을 정하고 있으므로, 결과를 `#+RESULTS`로 원본에 남기고 `:exports results` 또는 `both`로 발행하면 된다. `[직접 읽음 /home/junghan/sync/org/.claude/skills/homepage-post/SKILL.md:8-10,96-110] [웹 출처 https://orgmode.org/manual/Exporting-Code-Blocks.html]`
2. **이 길은 “Org에서 오는, 평가 이력이 보이는 정적 문서”에는 충분하지만, 독자가 Lisp를 다시 평가하는 페이지는 아니다.** Babel은 Emacs/빌드 쪽에서 결과를 Org 파일에 넣고 export하며, 현재 Hugo 계약은 정적 빌드다. `[웹 출처 https://orgmode.org/manual/Evaluating-Code-Blocks.html] [직접 읽음 /home/junghan/repos/gh/homepage/AGENTS.md:48-59]`
3. **따라서 §4의 한 장 프로토타입은 포맷 교체가 아니라, 위 정적 페이지의 한 Lisp 블록에 작은 브라우저 평가기(SCI/ClojureScript)를 붙이는 방식이 가장 낮은 이전비용이다.** KONZEPT가 이미 “브라우저 안 SCI/ClojureScript”도 정적 파일로 Netlify에 올릴 수 있다고 구분했고, 이 방식은 현재 신원·번역·feed 껍데기를 버리지 않는다. `[직접 읽음 KONZEPT.md:62-85] [미확인 추정 — SCI 번들/Emmy 실제 호환·크기·울타리는 스파이크 필요]`
4. **Quarto는 계산 문서로는 정확하지만 현재 문제의 기본 답이 아니다.** Jupyter/Clojupyter로 Clojure를 *렌더 시* 평가할 수 있고 OJS로 브라우저 상호작용도 만들 수 있으나, Org SSOT·ox-hugo 발행 계약·Hugo의 JSON-LD/번역/taxonomy를 동시에 새로 잇게 만든다. `[웹 출처 https://quarto.org/docs/computations/jupyter.html] [웹 출처 https://github.com/clojupyter/clojupyter] [직접 읽음 /home/junghan/repos/gh/homepage/NEXT.md:18-38]`
5. **Org를 브라우저에서 직접 파싱하는 길은 실재하지만 “완성된 Org 홈페이지”가 아니라 parser + renderer를 조립하는 프로젝트다.** Uniorg는 links/drawers/LaTeX 등을 포함한 대부분의 syntax를 파싱한다고 하나 Babel call·dynamic block·macro 등은 미완료이고, 접힘 UI·발행 메타·RSS/taxonomy는 별도 구현물이다. `[웹 출처 https://github.com/rasendubi/uniorg]`

GLG가 말한 “모든 것이 텍스트이고, 보기는 Emacs/터미널이며, 수식·시각화·eval이 한 문서에 있는 창”은 이 결론과 맞는다. 원석은 자유 실행이 아니라 **형식화·제한 평가기·영수증·사람의 보장**을 분리하라고 이미 요구한다. `[직접 읽음 /home/junghan/sync/org/notes/20250405T171216--힣-선택하지-않고-평가한다-—-리스프-repl로-대화가-프롬프트가-되는-일__agent_autholog_autopilot_bib_conversation_emmy_evaluation_lisp_prompt_repl_sicm_verification.org:45-55]`

---

## 1. 세 층을 섞지 않는 판정

| 층 | 실제 실행 자리 | 독자가 하는 일 | Netlify 정적 배포 | 이 레일의 역할 |
|---|---|---|---|---|
| A. Babel/Quarto 계산 | 작성자 Emacs 또는 render 환경 | 이미 난 결과를 읽음 | 가능 | **지금 즉시** |
| B. SCI/ClojureScript 섬 | 브라우저 sandbox | 명시한 form을 재평가 | 가능 | **§4 프로토타입** |
| C. geworfen식 요청 평가 | 서버 | 요청을 보내고 결과를 받음 | 별도 서버 필요 | 나중의 다른 문제 |

- KONZEPT는 A를 Quarto·Clerk static·org-babel export, B를 SCI/ClojureScript, C를 서버 평가로 이미 분리한다. `[직접 읽음 KONZEPT.md:60-73]`
- C가 필요한 이유는 eval 자체가 아니라 호스트 Emacs daemon에서 agenda를 실시간으로 읽는 geworfen의 데이터 소스라고 적혀 있다. `[직접 읽음 KONZEPT.md:70-73]`
- 그러므로 라이브 Emacs 데이터가 없는 첫 문서는 A 또는 B만으로도 정적 대문에 남는다. `[직접 읽음 KONZEPT.md:70-73] [미확인 추정 — 해당 문서의 데이터 의존성을 먼저 명시해야 함]`

## 2. Quarto — 강한 계산 문서, 그러나 이 판의 기본 포맷은 아님

### 실행과 산출물

- Quarto의 Jupyter 문서는 실행 가능한 코드 블록을 `quarto render` 때 실행하고 결과(그림·표·텍스트)를 HTML에 넣는다. `.ipynb`는 기본적으로 재실행하지 않으며 `--execute` 또는 YAML `execute.enabled: true`가 필요하다. `[웹 출처 https://quarto.org/docs/computations/jupyter.html]`
- Quarto의 `freeze`는 계산 결과를 `_freeze`에 보관해 전체 site render에서 재사용하도록 하며, 그 디렉터리를 버전 관리하라고 안내한다. `[웹 출처 https://quarto.org/docs/projects/code-execution.html]`
- 따라서 Jupyter/Knitr 계열은 기본적으로 **빌드타임 계산 + 정적 HTML**이며, 독자가 페이지를 열었다고 그 커널이 다시 도는 것은 아니다. `[웹 출처 https://quarto.org/docs/computations/jupyter.html] [웹 출처 https://quarto.org/docs/projects/code-execution.html]`
- Quarto의 OJS는 예외로, 브라우저의 reactive runtime에서 입력이 바뀔 때 JavaScript 셀을 재실행하며 서버 없이 배포할 수 있다. `[웹 출처 https://quarto.org/docs/interactive/ojs/]`
- Quarto의 서버형 상호작용은 Shiny처럼 별도 서버를 요구하고, Jupyter widgets/htmlwidgets는 정적 HTML 안에서 클라이언트 측으로 동작할 수 있다. `[웹 출처 https://quarto.org/docs/interactive/]`

### 커널과 Lisp

- Quarto는 `jupyter:` metadata로 kernelspec을 고르며, 첫 실행 블록 언어를 지원하는 kernel을 자동 선택할 수도 있다. `[웹 출처 https://quarto.org/docs/computations/jupyter.html]`
- Clojupyter는 Jupyter Lab/Notebook/Console에서 Clojure를 실행하는 kernel이며, Quarto의 Jupyter 경로에 설치된 kernelspec으로 연결할 수 있다. `[웹 출처 https://github.com/clojupyter/clojupyter] [웹 출처 https://quarto.org/docs/computations/jupyter.html]`
- Common Lisp도 Jupyter kernel을 별도로 마련하면 같은 Jupyter 일반 경로로 연결할 수 있을 가능성은 있으나, 이 조사에서는 Quarto+Clojure 외의 kernel 조합을 실측하지 않았다. `[미확인 추정]`
- OJS의 런타임 언어는 Observable JavaScript이고, Quarto 문서가 브라우저에서 Clojure/Emmy를 실행해 준다는 근거는 찾지 못했다. `[웹 출처 https://quarto.org/docs/computations/ojs.html]`

### GLG 판에서의 비용

- Quarto HTML은 KaTeX/MathJax를 포함한 수식, 표·그림 출력, TOC와 CSS를 제공한다. `[웹 출처 https://quarto.org/docs/output-formats/html-basics.html]`
- 그러나 현재 homepage는 Hugo+Hextra이고, 한국어 원본은 Org, export는 curated 수동 `ox-hugo`이며, 영문은 별도의 두 번째 입구다. `[직접 읽음 /home/junghan/repos/gh/homepage/AGENTS.md:42-47] [직접 읽음 /home/junghan/sync/org/.claude/skills/homepage-post/SKILL.md:8-10,96-117]`
- 그러므로 Quarto를 대문 기본 스택으로 바꾸면 Org→Quarto 변환/이중 원본 문제와 함께 Hugo template에 이미 있는 JSON-LD·llms.txt·언어쌍·taxonomy 검증을 새 발행기로 이식해야 한다. `[직접 읽음 /home/junghan/repos/gh/homepage/NEXT.md:26-86] [직접 읽음 /home/junghan/repos/gh/homepage/hugo.yaml:24-54] [미확인 추정 — Quarto 측 재구현 범위는 아직 산정하지 않음]`

### 보존층 한 줄 판정

- **en/ko:** Quarto에도 다국어 site 구성은 가능할 수 있으나, 현재의 `<slug>.ko.md`/`<slug>.md` 별도 입구 계약을 그대로 보존하는지는 별도 설계다. `[직접 읽음 /home/junghan/repos/gh/homepage/NEXT.md:18-23] [미확인 추정]`
- **JSON-LD:** Quarto로 전환하면 Hugo `head-end.html`의 `@graph` 계약을 새 layout/template로 다시 검증해야 한다. `[직접 읽음 /home/junghan/repos/gh/homepage/NEXT.md:26-38] [미확인 추정]`
- **RSS:** Quarto의 현행 feed 생성·현재 URL 계약의 동등성은 이 조사에서 확인하지 않았으므로, 전환 비용으로 남긴다. `[미확인 추정]`
- **taxonomy:** Hugo의 `category/series/tag` 설정은 현존하므로 유지되지 않는 전환안은 동등 기능을 재구현·검증해야 한다. `[직접 읽음 /home/junghan/repos/gh/homepage/hugo.yaml:50-53]`

## 3. Org-babel export — 현재 계약 안의 정적 계산 문서

### 가능한 일

- Org는 평가 결과를 source block 바로 뒤 `#+RESULTS`에 기록한다. `[웹 출처 https://orgmode.org/manual/Evaluating-Code-Blocks.html]`
- `:exports results`는 결과만, `both`는 코드와 결과를 export하며, 이름 붙인 결과는 링크 대상으로도 남는다. `[웹 출처 https://orgmode.org/manual/Exporting-Code-Blocks.html]`
- 기본 활성 언어는 Emacs Lisp이고, Clojure는 `ob-clojure`를 require해 활성화할 수 있다. `[웹 출처 https://orgmode.org/manual/Languages.html]`
- `ob-clojure` 문서는 Clojure code block을 Org 안에서 실행하고 결과를 exported document에 넣을 수 있다고 명시하며, CIDER REPL·Babashka backend 예도 제공한다. `[웹 출처 https://orgmode.org/worg/org-contrib/babel/languages/ob-doc-clojure.html]`
- Common Lisp Babel은 SLIME 또는 SLY session으로 평가하고 모든 result type을 지원한다고 문서화한다. `[웹 출처 https://orgmode.org/worg/org-contrib/babel/languages/ob-doc-lisp.html]`
- `ox-hugo`는 Org에서 Hugo-compatible Markdown과 front matter를 생성하고, 현재 계약도 그 exporter의 `org-hugo-export-wim-to-md`를 한 번 실행하라고 정한다. `[웹 출처 https://ox-hugo.scripter.co/] [직접 읽음 /home/junghan/sync/org/.claude/skills/homepage-post/SKILL.md:96-108]`

### 수식·표·차트 판정

| 물건 | Babel→현재 export에서의 판정 | 남은 확인 |
|---|---|---|
| 표 | source/result 표를 export할 수 있고 ox-hugo는 표 markup·style 예를 문서화한다. `[웹 출처 https://orgmode.org/manual/Exporting-Code-Blocks.html] [웹 출처 https://ox-hugo.scripter.co/doc/formatting/]` | 실제 Hextra 폭·모바일 CSS만 샘플로 확인. `[미확인 추정]` |
| 차트 | Clojure Babel 문서는 그림을 PNG/PDF로 저장해 Org 링크로 export하는 예를 준다. `[웹 출처 https://orgmode.org/worg/org-contrib/babel/languages/ob-doc-clojure.html]` | homepage asset 경로·캐시·alt text를 한 장 스파이크로 확인. `[미확인 추정]` |
| 수식 | homepage의 Hextra 문서는 page front matter `math: true`에서 KaTeX가 Markdown의 inline/display LaTeX를 렌더한다고 적는다. `[직접 읽음 /home/junghan/repos/gh/homepage/content/docs/orghextra/guide/latex.ko.md:8-26]` | Org LaTeX fragment가 ox-hugo 뒤에도 같은 delimiter와 `math: true` front matter로 남는지 실제 한 문서 build로 확인. `[미확인 추정]` |

### 안전·운영 경계

- Org는 평가 시 해를 줄 위험이 있어 실행 전 권한 확인 safeguard를 둔다. `[웹 출처 https://orgmode.org/manual/Evaluating-Code-Blocks.html]`
- `:eval never-export`는 export 중 source evaluation을 막고, `query-export`는 export 때 확인을 요구한다. `[웹 출처 https://orgmode.org/manual/Evaluating-Code-Blocks.html]`
- 따라서 기본안은 **검증된 `#+RESULTS`를 원본에 commit/export하고 export 자체는 재평가하지 않는 방식**이며, 신뢰한 작은 계산 문서만 격리된 build에서 명시적으로 재평가하는 방식이다. `[웹 출처 https://orgmode.org/manual/Evaluating-Code-Blocks.html] [미확인 추정 — 실제 CI/Netlify에 evaluation 권한을 주지 않는 운영안]`
- 현재 homepage-post 계약은 export 전 글을 닫고, GLG/담당자가 Emacs에서 수동 export하며, Emacs server가 없을 때 Markdown을 손으로 흉내 내지 말라고 한다. `[직접 읽음 /home/junghan/sync/org/.claude/skills/homepage-post/SKILL.md:96-111]`
- 그 계약에는 Babel language enablement·평가 sandbox·Netlify에서의 재평가 정책이 명시돼 있지 않다. `[직접 읽음 /home/junghan/sync/org/.claude/skills/homepage-post/SKILL.md:1-125] [직접 읽음 /home/junghan/repos/gh/homepage/NEXT.md:18-24]`

### 보존층 한 줄 판정

- **en/ko:** 한국어 Org SSOT와 export 후 별도 영어 Markdown이라는 현재 계약을 그대로 유지한다. `[직접 읽음 /home/junghan/sync/org/.claude/skills/homepage-post/SKILL.md:113-117]`
- **JSON-LD:** Markdown/Hugo 경로를 유지하므로 현 `@graph` template·translation 규칙을 유지한다. `[직접 읽음 /home/junghan/repos/gh/homepage/NEXT.md:26-38]`
- **RSS:** Hugo 발행기 자체를 유지하므로 기존 RSS surface를 깨뜨릴 포맷 전환은 없다. `[직접 읽음 KONZEPT.md:84-85] [미확인 추정 — 현재 RSS 산출물을 이번 조사에서 재빌드하지 않음]`
- **taxonomy:** `#+hugo_tags`와 현재 Hugo taxonomy 설정을 그대로 쓴다. `[직접 읽음 /home/junghan/sync/org/.claude/skills/homepage-post/SKILL.md:52-94] [직접 읽음 /home/junghan/repos/gh/homepage/hugo.yaml:50-53]`

## 4. Org를 브라우저에서 직접 렌더하는 선례

### 실재하는 부품

- **Uniorg**는 JavaScript/TypeScript용 Org parser이며 unified pipeline에서 Org AST를 rehype/HTML로 변환하는 예를 제공한다. `[웹 출처 https://github.com/rasendubi/uniorg]`
- Uniorg는 complex list·links·drawers·clock entries·LaTeX 등을 포함한 대부분 문법이 Emacs와 같은 방식으로 동작한다고 주장한다. `[웹 출처 https://github.com/rasendubi/uniorg]`
- Uniorg는 inlinetask, Babel/inline Babel call, dynamic block, target/radio target, macro, 일부 timestamp property는 아직 완료하지 않았다고 열거한다. `[웹 출처 https://github.com/rasendubi/uniorg]`
- **Orga(orgajs)**는 JavaScript Org AST parser이며, Vite/Rollup에서 `.org`를 직접 import하고 React JSX export block 및 Astro/Next integration을 제공한다. `[웹 출처 https://github.com/orgapp/orgajs]`
- org-roam-ui는 Uniorg→rehype→React 경로에서 `section` component를 바꿔 접힘/outline UI를 구현한 공개 선례다. `[웹 출처 https://github.com/org-roam/org-roam-ui/blob/main/util/processOrg.tsx]`

### “쓸 만함”의 정확한 답

- parser가 있어도 **접힘은 parser 기능이 아니라 AST를 받는 UI component의 몫**이다. `[웹 출처 https://github.com/rasendubi/uniorg] [웹 출처 https://github.com/org-roam/org-roam-ui/blob/main/util/processOrg.tsx]`
- drawers·links·headline tags는 Uniorg AST에서 다룰 수 있는 범주지만, GLG의 Denote 링크, `:noexport:`, custom block, Org Babel 결과와 metadata를 homepage 의미로 보존하는 renderer는 아직 없다. `[웹 출처 https://github.com/rasendubi/uniorg] [직접 읽음 /home/junghan/sync/org/.claude/skills/homepage-post/SKILL.md:31-47,52-94] [미확인 추정]`
- orgajs의 `.org` import는 build tool 통합 근거이지, “원본 `.org`를 브라우저에서 fetch해 완전한 Org UI로 즉시 보인다”는 근거는 아니다. `[웹 출처 https://github.com/orgapp/orgajs]`
- 따라서 이 길은 문법을 흉내 내는 Markdown보다 정직하게 Org에서 오지만, 현재 Hugo 발행 계약의 대체 후보가 아니라 **두 번째 prototype** 후보가 적합하다. `[미확인 추정]`

### 보존층 한 줄 판정

- **en/ko:** parser는 언어쌍·원본/번역 관계를 발행 정책으로 만들지 않으므로 별도 metadata 설계가 필요하다. `[직접 읽음 /home/junghan/repos/gh/homepage/NEXT.md:18-23] [미확인 추정]`
- **JSON-LD:** parser가 Hugo `head-end.html`의 `@graph`를 대신 emit하지 않으므로 새 static template를 만들어야 한다. `[직접 읽음 /home/junghan/repos/gh/homepage/NEXT.md:26-38] [미확인 추정]`
- **RSS:** raw Org renderer는 feed 생성기가 아니므로 별도 static collection/build가 필요하다. `[미확인 추정]`
- **taxonomy:** Org `filetags`/headline tag를 site taxonomy URL로 map·index·render하는 규칙을 새로 만들어야 한다. `[직접 읽음 /home/junghan/repos/gh/homepage/hugo.yaml:50-53] [미확인 추정]`

## 5. 권장 스파이크 순서 — 구현 지시가 아니라 판정 실험

1. **Babel static 영수증:** 임시 Org 한 편에 `emacs-lisp` 또는 `clojure` block 하나, `#+RESULTS`, 결과 표 하나, chart asset 하나, LaTeX fragment 하나를 둔다. `[웹 출처 https://orgmode.org/manual/Exporting-Code-Blocks.html]`
2. **현재 계약으로 export:** `org-hugo-export-wim-to-md` 한 번 → `hugo --gc --minify` 한 번으로 Markdown, `math: true`, 그림 경로, table CSS, KO/EN 파일쌍·JSON-LD를 확인한다. `[직접 읽음 /home/junghan/sync/org/.claude/skills/homepage-post/SKILL.md:96-108] [직접 읽음 /home/junghan/repos/gh/homepage/NEXT.md:18-38]`
3. **브라우저 eval은 그 다음:** 같은 페이지에서 allowlist된 form 하나만 SCI/ClojureScript로 재평가하고, 결과 DOM만 바꾼다. `[직접 읽음 KONZEPT.md:60-63,84-90] [미확인 추정 — capability·timeout·bundle budget·Emmy 호환성 측정 필요]`
4. **직접 Org renderer는 비교 대상:** 위 한 장이 부족할 때에만 Uniorg/Orga를 써서 `headings + folding + drawer + Denote link + tags` 다섯 가지만 재현해 exporter 대체 비용을 잰다. `[웹 출처 https://github.com/rasendubi/uniorg] [웹 출처 https://github.com/orgapp/orgajs] [미확인 추정]`

이 순서는 KONZEPT의 “먼저 Netlify에 올라가는 한 장을 세워 스택을 취향 투표가 아니라 실측으로 가른다”는 기준을 따른다. `[직접 읽음 KONZEPT.md:88-90]`
