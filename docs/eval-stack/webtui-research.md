# WebTUI 리서치 — homepage 스택 판단 재료

조사 임무. **구현·커밋 없음.** 결론을 위에, 근거를 아래에 둔다. 각 문장 끝의 괄호가
증거 상태다: `[직접 읽음 file:line]` / `[웹 출처 URL]` / `[실측]` / `[미확인 추정]`.

## 결론 (요약)

**추천: (a) Hugo 유지 + 손수 짠 WebTUI 테마.** SSG를 버리는 재작성(geworfen식 서버+SPA,
혹은 다른 SSG로 이관)보다, 지금의 Hugo 파이프를 살리고 hextra 대신 WebTUI CSS를
직접 얹는 편이 "SSG가 싫다"의 실제 원인(hextra의 문서-사이트 느낌·룩) 하나만 정확히
겨냥한다. WebTUI는 순수 CSS 라이브러리이자 렌더링 방식에 대해 무관심하므로
[웹 출처: github.com/webtui/webtui README] Hugo 템플릿에서도 그대로 쓸 수 있다.

반대 근거(GLG가 뒤집을 여지): "SSG 방식도 싫다"는 발언은 SSG라는 *빌드 모델* 자체에
대한 거부일 수도 있다 — 그렇다면 (a)는 룩만 바뀔 뿐 GLG가 지목한 불만의 뿌리를
안 건드린다. 그 경우 (c) geworfen식 서버+SPA가 정답에 더 가깝고, 대가는 아래 3번
표에 정리한 이중언어·JSON-LD·taxonomy·RSS·검색엔진 판독성의 전면 재구현이다.

## 1. WebTUI란 무엇인가

- **순수 CSS 라이브러리, 프레임워크 아님.** "Modular CSS Library that brings the beauty
  of Terminal UIs to the browser". JS 런타임 요구 없음 — "WebTUI is built with Pure CSS
  and does not require any JavaScript." [웹 출처: webtui.ironclad.sh]
- **시맨틱/속성 기반 접근.** 커스텀 엘리먼트(`<row>`, `<column>`)와 대시(`-`)로 끝나는
  속성(`box-="square"`, `is-="switch"`, `variant-="yellow"`)으로 컴포넌트를 표현한다.
  대시 접미사는 React 등 프레임워크와 충돌 없이 쓰기 위한 설계. [웹 출처:
  webtui.ironclad.sh]
- **렌더링 방식을 전제하지 않는다.** `@layer base, utils, components;` 뒤에
  `@import '@webtui/css'`만 하면 되는 정적 스타일시트다. 공식 설치 가이드가 Next.js,
  Vite, Astro별로 따로 있다는 것 자체가 — 렌더링 파이프라인 불문, HTML/CSS 계층에만
  개입한다는 뜻이다. [웹 출처: github.com/webtui/webtui showcase 목차]
- **주는 것**: 컴포넌트 CSS(button, badge, table, dialog, accordion, progress,
  tooltip 등 18종 이상), 5개 공식 테마 패키지(Catppuccin/Gruvbox/Nord/Vitesse/
  Everforest), Nerd Font 플러그인. [웹 출처: github.com/webtui/webtui README]
- **안 주는 것**: 라우팅, 마크다운 렌더링, 콘텐츠 모델, i18n, 빌드 파이프라인, SEO/
  구조화 데이터, RSS/taxonomy, 폼 처리 로직, 상태 관리 — 전부 없음. HTML 골격과 데이터
  주입은 소비하는 쪽(SSG 템플릿이든, 손수 짠 JS든, React든)이 책임진다. [미확인 추정 —
  실제 코드 안 봤지만 "Pure CSS, no JS" 선언과 컴포넌트 목록이 스타일 전용임을
  강하게 시사]
- **성숙도**: GitHub 2,397 stars, 2025-03 창설, `@webtui/css` npm 최신 0.1.10
  (2026-08-12), 주간 다운로드 541 — 니치지만 활발. [웹 출처: github.com/webtui/webtui,
  npmjs.com/package/@webtui/css]
- **geworfen이 실제로 쓰는 방식**: CDN `<link>` 두 개(`@webtui/css@0.1.9/dist/full.css`,
  `@webtui/theme-catppuccin@0.0.5`)만 박고, 나머지는 전부 손으로 짠 `<style>` 블록 +
  바닐라 JS(fetch, DOM 조작)다. 빌드 도구 없음, npm 없음, 프레임워크 없음.
  [직접 읽음: geworfen/resources/public/index.html:1-542]

## 2. "SSG가 싫다"의 대안 축 — 4갈래

WebTUI 채택과 SSG 폐기는 **독립된 두 축**이다. WebTUI는 CSS일 뿐이라 Hugo 템플릿
안에서도 그대로 쓸 수 있다 — 이 사실이 아래 표의 핵심.

| 축 | 무엇을 바꾸나 | 대가 |
|---|---|---|
| **(a) Hugo 유지 + WebTUI 테마** | hextra 룩만 제거, 레이아웃/파샬을 WebTUI 속성으로 다시 짠다 | hextra가 공짜로 주던 것(북 사이드바, 검색, 다크모드 토글, `editURL`, blog 목록 컴포넌트)을 손수 재구현. SSG의 이점(빌드타임 정적 HTML, RSS/타xonomy/JSON-LD 템플릿)은 전부 보존 |
| **(b) 다른 SSG + WebTUI** (예: Astro — WebTUI 자체가 Astro로 만들어짐) | 빌드 도구·콘텐츠 모델 전체 교체 | org→md export 체인 재작성 필요(현재 hugo-org 규약이 Astro 콘텐츠 컬렉션 규약으로 안 감), JSON-LD/RSS/taxonomy를 Astro 생태계로 재구현. 얻는 것은 미미(둘 다 SSG) — "SSG가 싫다"를 전혀 해소 못함 |
| **(c) geworfen식 서버+SPA** | Clojure(or 다른 백엔드) 한 장 SPA, 빌드타임 정적 생성 없음 | 이중언어 라우팅, JSON-LD `@graph`, RSS, taxonomy, sitemap, llms.txt 생성 로직을 전부 서버/클라이언트 코드로 재작성. 크롤러 판독성(정적 HTML vs JS-렌더 SPA)이 구조적으로 나빠짐 — geworfen 자체가 "curl로 판단하지 마라, JS가 채운다"고 경고 [직접 읽음: geworfen/AGENTS.md:12-24]. 장문 에세이·다국어 SEO에는 SPA가 원래 약한 영역 |
| **(d) 순수 정적 수제 HTML** | 빌드 도구 자체를 없앰, org export가 손으로 만든 `.html` 파일을 직접 겨냥 | 매 포스팅마다 손으로 head/JSON-LD/hreflang/RSS 항목을 관리 — 지금 hugo.yaml + 템플릿이 자동화하는 모든 것의 반자동화 상실. 글이 쌓일수록 유지비 급증 |

geworfen은 "블로그 CMS"가 아니라 **단일 대시보드 SPA**(agenda 뷰 하나)라는 점이
중요하다 — 페이지 하나, 콘텐츠는 API가 실시간으로 채운다. 대문(홈페이지)이 요구하는
"여러 페이지, 쌓이는 장문 글, 이중언어, SEO"는 geworfen이 애초에 풀지 않은 문제다.
[직접 읽음: geworfen/ARCHITECTURE.md 전체 — agenda 렌더링 로직만 있고 콘텐츠
페이지네이션/포스트 개념 자체가 없음]

## 3. 지금 SSG(Hugo+hextra)가 실제로 주는 것 — 축별로 버리면 무엇을 잃나

| 기능 | 지금 어떻게 되어 있나 | (a) Hugo+WebTUI | (b) 다른 SSG+WebTUI | (c) geworfen식 서버 SPA | (d) 수제 정적 HTML |
|---|---|---|---|---|---|
| 이중언어 (en/ko 형제 파일) | `_index.md`/`_index.ko.md`, Hugo In-tree i18n, `defaultContentLanguage: en` [직접 읽음: hugo.yaml:24-32, AGENTS.md] | 그대로 유지 (Hugo 코어 기능, 테마와 무관) | 재구현 필요 (Astro는 다른 i18n 규약) | 라우팅·번역 페어링 전부 서버/클라 코드로 재작성 | 파일 두 벌을 계속 손으로 관리 |
| JSON-LD `@graph` 신원층 | `head-end.html` 템플릿이 Person/WebSite/Blog/ProfilePage/BlogPosting 노드를 자동 emit [직접 읽음: docs/semantic-jsonld.md] | 템플릿 그대로 이식 가능 (hextra 종속 아님, 순수 Hugo Go 템플릿) | 처음부터 재작성 | JS로 client-side inject하거나 서버가 페이지별 HTML을 조립해야 함 — SSR 필요, geworfen의 순수 client-fetch 모델과 충돌 | 매 페이지 손으로 붙여넣기 — 노드 불일치 위험 급증 |
| `llms.txt` | `static/llms.txt` 정적 파일, Hugo가 그대로 서빙 [직접 읽음: static/llms.txt] | 무관 — 그대로 유지 | 무관 — 그대로 유지 | 서버 라우트 하나 추가하면 됨 (경미) | 그대로 유지 (정적 파일이라 SSG 여부 무관) |
| RSS | Hugo 기본 output format, `index.xml` 자동 생성 (llms.txt가 `/index.xml`을 명시) [직접 읽음: static/llms.txt "RSS: https://junghanacs.com/index.xml"] | 유지 | Astro도 RSS 플러그인 있음 — 재설정 필요 | 직접 XML 생성 로직 작성 필요 | 손으로 XML 관리 |
| Taxonomy (categories/tags/series) | `hugo.yaml` taxonomies 설정 + hextra blog list 컴포넌트가 pill 렌더 [직접 읽음: hugo.yaml:44-48, NEXT.md taxonomy 절] | 유지, pill만 WebTUI `badge`로 재스타일 | 재구현 | 완전 재구현 (인덱싱 로직 자체를 서버가 짜야 함) | 손으로 인덱스 페이지 관리 |
| remark42 댓글 | `params.comments.remark42` 설정 한 줄, 테마가 embed [직접 읽음: hugo.yaml comments 절] | embed 스니펫만 새 템플릿에 옮기면 됨 — SSG 무관 | 동일 | 동일 (댓글은 항상 클라이언트 embed라 SSG 여부와 무관) | 동일 |
| Umami 분석 | `params.analytics.umami` 설정, 스크립트 태그 embed [직접 읽음: hugo.yaml] | 무관 | 무관 | 무관 (geworfen도 동일 스크립트 태그 방식) [직접 읽음: geworfen/index.html:9] | 무관 |
| Netlify 빌드 | `hugo --gc --minify` push-to-deploy [직접 읽음: AGENTS.md 배포 절] | 유지 | Netlify가 Astro도 지원 — 재설정 필요 | Netlify는 정적 호스팅 전용이라 **서버 필요한 (c)는 Netlify를 벗어나야 함** — geworfen은 자체 Docker/GraalVM native-image로 별도 인프라 운영 [직접 읽음: geworfen/AGENTS.md] | 유지 (정적 파일만 있으면 Netlify 그대로) |
| 검색엔진/에이전트 판독성 | 빌드타임에 완성된 정적 HTML — 크롤러가 JS 없이도 전문·구조화 데이터를 읽음 | 유지 (SSG의 핵심 이점) | 유지 | **구조적으로 나빠짐** — geworfen 자체가 "SPA라 curl/크롤러엔 빈 페이지로 보인다"고 자인 [직접 읽음: geworfen/AGENTS.md:12-16] | 유지 (수제라도 정적 HTML이면 크롤러엔 안전) |

**핵심 관찰**: (c)를 고르면 Netlify를 떠나야 하고(서버 프로세스 필요), 크롤러
판독성이 구조적으로 후퇴한다 — 이건 llms.txt·JSON-LD 신원층에 최근 투자한
작업(NEXT.md 2026-06/07/08월 기록)과 정면으로 배치된다. [직접 읽음: NEXT.md JSON-LD·
llms.txt 절]

## 4. WebTUI showcase 실제 사례 — GLG 취향 부합도 & 장문 내성

- **justin.run** (Personal Website) — 파일명 스타일 내비(`home.md`, `now.md`,
  `contact.md`, `ama.md`), 극단적으로 미니멀, 텍스트 위주. 실측 결과 각 페이지는
  2~4문장 짧은 산문이다. [웹 출처: justin.run 본문 실측] → **장문 에세이 내성 미검증**
  — 이 사이트가 다루는 콘텐츠 단위 자체가 짧은 소개문이라, 3-5편 규모 논지+이미지
  3-5장을 얹는 GLG의 블로그 포맷을 버틸지는 이 사례만으론 판단 불가.
- **fullstackbrett.com** (Blog, showcase에 등재) — 컨텐츠 fetch 실패(크롤러 응답
  없음, 사이트 다운/차단 가능성) [실측: contents.js 빈 응답] → **미확인**, 직접
  브라우저로 열어봐야 장문 판독 가능.
- **friends.dorm.social** (community) — 커뮤니티 사이트, 콘텐츠 구조 미확인.
- 공통 관찰(showcase 목록 자체에서): showcase에 걸린 프로젝트 대다수가 "개인
  소개/도구/커뮤니티" 유형이고, **긴 산문형 블로그의 성공 사례는 fullstackbrett.com
  하나뿐**이며 그마저 검증 실패. [웹 출처: webtui.ironclad.sh/showcase 목록]
- GLG 취향 부합: 모노스페이스 폰트·터미널 미학·Catppuccin 팔레트는 이미 geworfen에서
  검증된 GLG 선호와 일치한다(`GLG Mono` 커스텀 폰트까지 이미 있음) [직접 읽음:
  geworfen/index.html:19-34]. 다만 이건 **홈페이지에도 그대로 이식 가능** — WebTUI
  채택이 (a)든 (c)든 무관하게 얻어지는 이점이다.

## 5. 마이그레이션 비용 — org SSOT export 흐름이 핵심 변수

- 지금 흐름: `~/sync/org/posts/*.org`(한국어 SSOT) → GLG가 Emacs에서
  `org-hugo-export-wim-to-md` 1회 실행 → `content/blog/<id>.ko.md` 생성 → 영어판은
  후속으로 `<id>.md` 별도 작성. [직접 읽음: NEXT.md 포스팅 흐름 절,
  ~/sync/org/.claude/skills/homepage-post/SKILL.md 전체]
- export 도구(`org-hugo-export-wim-to-md`, `ox-hugo`)는 **Hugo 프론트매터 규약에
  하드코딩**되어 있다(`#+HUGO_SECTION`, `#+export_file_name`, `hugo_draft` 등이
  Org 파일 전용 ox-hugo 키워드). [직접 읽음: SKILL.md 한국어 Org 계약 절]
- **(a) Hugo 유지**: export 체인 무변화. 테마 교체는 `layouts/`만 건드리고
  `content/*.md`의 프론트매터·본문 포맷은 그대로 유효 — **비용 최소**.
- **(b) 다른 SSG(Astro 등)**: ox-hugo가 만드는 프론트매터/디렉터리 규약이 Astro
  content collections 스키마와 다르다 → export 파이프 자체를 새로 짜야 한다
  (`ox-hugo` 대체품 또는 커스텀 elisp export 함수 필요) — **비용 큼**, 지금까지
  쌓은 `homepage-post` SKILL의 계약 전체 재설계.
- **(c) geworfen식 서버+SPA**: 마크다운 export 자체가 무의미해진다 — 서버가 org를
  직접 읽거나(geworfen은 emacsclient로 org-agenda를 실시간 읽는 전례가 있음
  [직접 읽음: geworfen/ARCHITECTURE.md]), 별도 콘텐츠 API를 만들어야 한다.
  **비용 최대** — 콘텐츠 파이프라인을 처음부터 설계해야 하고, geworfen의 emacsclient
  전례는 "실시간 대시보드 한 페이지"에 최적화된 패턴이라 "쌓이는 블로그 포스트
  여러 편"에는 직접 재사용되지 않는다(다른 문제 형태).
- **(d) 수제 정적 HTML**: export 도구 자체를 버리고 org→html 변환을 손으로 짜야
  한다(`ox-html` 커스터마이즈 또는 pandoc) — **비용 중간**, 다만 프론트매터
  자동화(JSON-LD, taxonomy)를 모두 잃어 매 포스팅 수작업이 늘어난다.

## 근거 목록 (재확인용)

- `AGENTS.md`, `NEXT.md`, `ROADMAP.md`, `hugo.yaml` — 이 리포, 직접 읽음.
- `docs/semantic-jsonld.md`, `static/llms.txt` — 이 리포, 직접 읽음.
- `~/sync/org/.claude/skills/homepage-post/SKILL.md` — 직접 읽음.
- `/home/junghan/repos/gh/geworfen/AGENTS.md`, `ARCHITECTURE.md`,
  `resources/public/index.html` — 전문 직접 읽음.
- `https://webtui.ironclad.sh`, `/showcase`, `https://github.com/webtui/webtui`,
  `https://www.npmjs.com/package/@webtui/css`, `https://justin.run`,
  `https://fullstackbrett.com`(fetch 실패) — exa-search 웹 조사, 2026-09-10.
