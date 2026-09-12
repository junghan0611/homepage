# SICM 한국어 읽기 번역 계약

## 범위와 원문 고정

- 대상 원문: `mentat-collective/sicm-book@4088864745715d8afa923162155e63795d43a375`, `org/preface.org`.
- 이 세션에서 얻은 원문 SHA-256: `140b8edd06c627301e8ff54f2ad081776fc48679df18e0b79b8e00d26c6f2655` (13,652 bytes, 268 lines).
- 라이선스 원문: 같은 commit의 `LICENSE`, SHA-256 `9ff68d09842e2bf5bd1db5d97acb1b58f9e05425ff0d11e716f86195f12d5e21`; repository contents는 CC BY-NC-SA 3.0 Unported라고 명시한다.
- Chapter 1 원문: 같은 commit의 `org/chapter001.org`, SHA-256 `efc987664d30dd3bfd399933797c2e799842ecf92d831e6ce9fb50ffabd11c2e`.
- 번역은 원문의 *adaptation*이다. 영어 원문과 번역 원고를 서로 대체하거나, 원저자·upstream·출판사가 번역을 검토/보증했다고 말하지 않는다.

## 1. 고정 용어표

첫 등장에는 한국어(English)를 쓰고, 이후 아래의 한국어를 고정한다. 수식 속 식별자, 책의 고유 함수명, Scheme 식별자는 번역하지 않는다.

| English | 고정 한국어 | 비고 |
|---|---|---|
| classical mechanics | 고전역학 | |
| dynamics | 동역학 | nonlinear dynamics = 비선형 동역학 |
| dynamical system | 동역학계 | system은 문맥상 계 |
| configuration space | 배치공간 | configuration = 배치, coordinate가 아님 |
| degree of freedom | 자유도 | |
| coordinate / coordinates | 좌표 | generalized coordinates = 일반화 좌표 |
| trajectory | 궤적 | |
| path | 경로 | path function = 경로 함수 |
| realizable path | 실현 가능한 경로 | |
| action | 작용 | action integral = 작용 적분 |
| Principle of Stationary Action | 정지 작용 원리 | 대문자 원리명 |
| Lagrangian | 라그랑지언 | `/L/`은 그대로 |
| Lagrange equations | 라그랑주 방정식 | |
| Euler--Lagrange equations | 오일러--라그랑주 방정식 | 원문의 double hyphen 보존 |
| functional notation | 함수 표기 | functional derivative = 함수 미분 |
| partial derivative | 편미분 | ∂, argument position은 그대로 |
| variation | 변분 | variation operator = 변분 연산자 |
| constrained motion | 구속 운동 | constraint = 구속조건 |
| rigid constraint | 강체 구속조건 | |
| coordinate constraint | 좌표 구속조건 | |
| derivative constraint | 미분 구속조건 | |
| nonholonomic system | 비홀로노믹 계 | 첫 등장에 English 병기 |
| generalized force | 일반화 힘 | |
| momentum / conserved momentum | 운동량 / 보존 운동량 | |
| conserved quantity | 보존량 | |
| dynamical state | 동역학적 상태 | |
| phase space | 위상공간 | |
| canonical transformation | 정준 변환 | |
| symplectic transformation | 심플렉틱 변환 | |
| central force | 중심력 | |
| restricted three-body problem | 제한 삼체 문제 | |
| Coriolis / centrifugal force | 코리올리 힘 / 원심력 | |
| quadrature | 구적법 | |
| symbolic expression / analysis | 기호 표현식 / 기호 해석 | |
| computation / computational | 계산 / 계산적 | computer simulation = 컴퓨터 시뮬레이션 |
| procedure | 절차 | Scheme의 procedure도 절차 |
| Scheme | Scheme | 언어명은 번역하지 않음 |

용어표에 없는 것은 임의로 번역하지 않는다. 처음 발견한 후보를 `term-candidates` ledger에 English, 문맥 줄 범위, 제안, 결정자를 기록하고, 확정한 뒤에만 이후 segment에 쓴다.

## 2. 수식·Scheme·각주·그림 보존 규칙

### 구조와 원문 대응

1. 번역 파일은 원문의 heading depth, `:PROPERTIES:`, `:CUSTOM_ID:`, `<<anchor>>`, Org link target, footnote label, page marker, `#+` directive의 순서와 개수를 보존한다. 제목의 자연어만 한국어화할 수 있으며 ID/target은 바꾸지 않는다.
2. 각 source segment에는 `source commit`, source SHA-256, 시작·끝 줄(반개방 범위), 번역 파일 SHA-256, reviewer와 검증 결과를 ledger에 남긴다. 어느 번역 문단도 source segment 밖의 내용을 보충하거나 요약하지 않는다.
3. 자연어 인용문은 번역하되 인물명·저작명·연도·서지 링크는 남긴다. 번역자가 넣는 설명은 본문에 섞지 않고 별도 `[번역자 주]`로 표시하며, 가능한 한 첫 reading translation에는 넣지 않는다.

### 수학

1. `$...$`, `\(...\)`, `\[...\]`, display equation, Unicode 수학 기호, 함수명, 첨자·상첨자, 수치 상수, 등호와 부등호는 byte-for-byte로 유지한다. 식 바로 앞뒤의 산문만 번역한다.
2. `/L/`, /D/, ∂_{2}, Γ[/q/] 등 원문 Org/수학 표기는 정규화하거나 예쁘게 다시 조판하지 않는다. 줄 바꿈도 수식 내부에서는 바꾸지 않는다.
3. 수식이 문장 중간에 있을 때도 수식 토큰을 번역하지 않으며, 원문 순서대로 번역한다. 수식의 의미를 해설로 대체하지 않는다.

### Scheme와 계산 산출

1. `#+begin_src ... #+end_src`, `#+begin_example`, REPL transcript, program output, shell command, file path, URL, symbol, keyword, identifier, comment을 포함한 code block은 byte-for-byte로 복사한다. 코드 안의 영어 주석도 읽기 번역에서 고치지 않는다.
2. code 바로 앞·뒤 산문은 번역하지만, code output을 한국어 문장으로 바꾸거나 계산값·오류 메시지를 의역하지 않는다.
3. Scheme을 Clojure/Emmy로 자동 변환하지 않는다. Homepage의 실행 뷰는 원문 Scheme source와 별도 adapter/receipt를 가져야 하며, 번역본이 원문의 실행 환경을 대체한다고 주장하지 않는다.

### 각주·그림·캡션

1. `^{[[#endnote_n][n]]}`, `[[#endnote_ref_n][^{n}]]`, `file:` 링크, bibliography link, `<<px...>>`를 변경하거나 재번호 매기지 않는다. 각주 본문의 산문은 충실하게 번역한다.
2. `#+caption:`, `#+name:`, image/file link, figure/table directive, 그래프 데이터와 원본 이미지 파일명은 보존한다. 캡션 산문은 한국어로 번역하되 원본 asset과 source figure가 무엇인지 지우지 않는다.
3. Emmy 계산 뷰로 이어지는 새 그림은 원문 그림의 replacement가 아니다. 각각에 (a) 원문 figure/section source, (b) 계산 source와 runtime pin, (c) generated output, (d) 변환/차이의 설명을 붙인다. 원본 이미지와 계산 그림을 한 caption 아래 섞어 원저자의 그림인 것처럼 만들지 않는다.

## 3. CC BY-NC-SA 3.0 attribution / share-alike 문안

공개 번역 페이지와 source repository에 다음을 함께 둔다. 대괄호 안만 release마다 채운다.

> **원문과 번역 라이선스.** 이 한국어 읽기 번역은 Gerald Jay Sussman과 Jack Wisdom의 *Structure and Interpretation of Classical Mechanics*, `mentat-collective/sicm-book`의 `org/[preface.org 또는 chapter001.org]`에서 출발한 adaptation이다. 원문 source revision: `4088864745715d8afa923162155e63795d43a375` ([정확한 source URL]); upstream repository contents는 [CC BY-NC-SA 3.0 Unported](https://creativecommons.org/licenses/by-nc-sa/3.0/)로 제공된다. 한국어 번역과 번역자가 추가한 표기·연결은 같은 CC BY-NC-SA 3.0 Unported로 제공된다. 원저자, upstream 편집자, 출판사는 이 번역 또는 Homepage Eval 계산 뷰를 검토하거나 보증하지 않았다.

필수 준수 사항:

- Attribution에는 저자(Sussman, Wisdom), 작품명, upstream repo, exact commit, 정확한 source path/URL, licence URL, 번역자/번역 revision을 모두 적는다.
- NonCommercial: 상업적 이용을 허가한다고 암시하지 않는다.
- ShareAlike: 번역·편집·계산적으로 다시 그린 원문 figure의 adaptation을 배포하면 CC BY-NC-SA 3.0으로 배포하고, 변경 사실과 해당 source를 밝힌다.
- 원문 source와 번역 source를 공개 링크로 함께 제공한다. upstream의 CC 라이선스와 별개인 third-party image, figure, code, quotation에는 source별 라이선스 조사 없이 CC 표지를 확장하지 않는다.
- 출판된 book edition의 별도 copyright/attribution과 upstream repository license가 충돌하거나 불명확해 보이면 공개 전에 권리자를 추정하지 말고 release를 멈추고 원문 edition/권리 고지를 재검증한다.

## 4. Chapter 1 안전 분할·번역·검증법

### 분할 단위

`org/chapter001.org`는 약 271 KB이므로 byte count나 모델 context 길이로 자르지 않는다. `* 1.n` level-1 heading을 원자적 release unit으로 삼고, 600 source lines를 넘는 unit은 `**`/`***` child heading 경계에서만 둘로 나눈다. 한 source block, figure directive + caption + file link, footnote definition, 또는 display math를 가르지 않는다.

초기 segment manifest는 다음과 같다(모든 줄 범위는 source에서 재생성해 기록한다).

| segment | source heading 범위 | 안전한 최초 분할 |
|---|---|---|
| ch01-01 | `1.1 Configuration Spaces` | exercise 1.1을 포함한 1.1 전체 |
| ch01-02 | `1.2 Generalized Coordinates` | exercise 1.2를 포함한 1.2 전체 |
| ch01-03 | `1.3 The Principle of Stationary Action` | `Experience of motion`, `Realizable paths`, exercise 1.3 경계에서 필요 시 분할 |
| ch01-04 | `1.4 Computing Actions` | `Paths of minimum action`, `Finding trajectories...`, exercise 1.4 경계에서 분할 |
| ch01-05a/b | `1.5 The Euler--Lagrange Equations` | `1.5.1 Derivation...`와 `1.5.2 Computing...`을 별 segment로 |
| ch01-06a/b | `1.6 How to Find Lagrangians` | `1.6.1`/`1.6.2`와 `1.6.3`/`1.6.4`의 heading 경계로 |
| ch01-07 | `1.7 Evolution of Dynamical State` | `Numerical integration`을 같은 segment에 |
| ch01-08a/b | `1.8 Conserved Quantities` | `1.8.1`–`1.8.3`, `1.8.4`–`1.8.5`의 heading 경계로 |
| ch01-09 | `1.9 Abstraction of Path Functions` | `Lagrange equations at a moment` 포함 |
| ch01-10a/b | `1.10 Constrained Motion` | `1.10.1`, `1.10.2`–`1.10.3`의 heading 경계로 |
| ch01-11 | `1.11 Summary` | 독립 segment |
| ch01-12 | `1.12 Projects`와 `Footnotes` | footnote target가 장 전체에 걸리므로 끝까지 함께 |

### 한 segment의 작업 순서

1. **Acquire:** exact commit/source hash를 재확인하고 source range를 immutable work copy로 만든다. 원문 행 번호와 heading/anchor manifest를 만든다.
2. **Translate:** 한 문단 대 한 문단으로 번역한다. term ledger의 확정 용어만 사용하며, 식·code·asset token을 건드리지 않는다. 새 정보·해설·계산 결과는 넣지 않는다.
3. **Structural check (자동):** source와 translation에서 heading depth/ID, anchors, link targets, footnote labels, `#+begin_*/#+end_*` 쌍, source block hash, math-token sequence, figure/file directives, code block hash를 추출해 순서대로 비교한다. 불일치는 release blocker다.
4. **Bilingual fidelity review (사람):** 다른 reviewer가 source와 Korean을 나란히 읽고, 각 문단을 `exact / terminology / omission / added-claim / citation`으로 판정한다. 요약·의역·누락·번역자 주 무표기는 blocker다.
5. **Render/receipt check:** Org/Markdown rendering에서 links, footnote jumps, equations, code fences, original figures와 translated captions가 깨지지 않는지 확인한다. 계산 그림이 있으면 original source→calculation source→output의 세 link를 별도 확인한다.
6. **Publish:** segment manifest에 source revision/hash, translation hash, term ledger version, structural check command/result, bilingual reviewer receipt를 기록한다. 이 receipt 없는 segment는 Chapter 1의 일부로 연결하지 않는다.

### 재개/변경 규칙

- upstream commit을 바꾸면 chapter 전체 manifest를 새 release로 시작한다. 이전 번역에 덮어쓰지 않는다.
- 용어표 변경은 affected segment 목록을 만든 뒤 재검토한다. 무차별 global replace를 하지 않는다.
- 한 segment가 아직 review 중이면 다른 segment의 번역은 진행할 수 있으나, chapter-level ‘complete’ 또는 단일 공개 reading edition이라고 부르지 않는다.
- figure/Emmy work는 번역 병렬 lane이지 번역 완료 gate를 가로채지 않는다. 다만 새 calculation view를 원문 figure의 adaptation으로 공개하는 시점에는 위의 attribution·source chain 검사를 반드시 다시 거친다.
