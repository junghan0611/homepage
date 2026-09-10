# NEXT--rebuild-eval-stack.md

브랜치 핸드오프. 좌표는 **issue #1**, 이 파일은 다음 한 걸음.
main 의 `NEXT.md` 는 현행 Hugo 사이트 몫이고 여기와 섞지 않는다. 머지 전에 이 파일은 지운다.

## RAIL

```
[x] 검수 (임시 리포 lichtung) — 축 3개 조사 · 프로토타입 · 교차검수 · SICM 샘플 · 라이선스 감사
[x] main 퍼블리시              1c28c70..6febb5c (Authology 히어로 · 공사중 안내 · Codex 제거 · 한글 행간)
[x] 좌표 · 브랜치 · 회수        issue #1 · rebuild/eval-stack · 9896b4a
[ ] 로컬 품질                   ← 지금
[ ] 한 번에 발행
```

## 발행하지 않는다 — 로컬에서 품질을 올린다

GLG 판정(2026-09-10): *"netlify로 퍼블리시 당장 안 할 거야. 여기서 run.sh 수정해서 계속
로컬에서 퀄리티 다 올리고 한 번에 내보낼 거야."*

그래서 **이 브랜치는 푸시 대상이 아니고, 라이선스 고지 의무도 아직 안 걸린다.**
`docs/eval-stack/attribution.md` §0 체크리스트는 발행 직전에 연다.

```bash
./run.sh          # 현행 Hugo        localhost:2341
./run.sh stack    # 새 스택          localhost:2342/site/
./run.sh book     # SICM 책 렌더 후 서빙
./run.sh both     # 나란히 비교
```

**두 면을 나란히 놓고 보는 것이 이 단계의 작업 방식이다.** 왼쪽이 지금 서 있는 것,
오른쪽이 그것을 대체하려는 것.

## NOW — 목표는 "같은 것을 다른 매질로"

새 기능이 아니다. **지금 대문이 보여주는 구성이 새 스택에서 같은 품질로 서는 것**이 먼저다.
그게 서면 eval 면을 올린다. issue #1 의 체크박스가 그 순서다.

## 어디에 무엇이 있나

```
docs/eval-stack/     KONZEPT + 판정 9장 (읽는 것, 고치는 것 아님)
dev/eval-stack/site/   현재 구성 재현 10장 — EN 루트 / KO /ko/
dev/eval-stack/proto/  브라우저 eval 실물 (sci-eval.html 은 첫 영수증, 보존)
dev/eval-stack/book/   build.py — pandoc 렌더러 (산출물 gitignore)
```

`dev/` 와 `docs/` 는 Hugo 가 읽지 않는다. 사이트에 영향 없다.

## 공유 마크업 계약

JS 가 건드리는 것은 `.org-cell` 의 `data-state`(`idle|running|ok|error`) 와
`.org-cell-out` 텍스트 **딱 둘**. 섹션은 `<details class="org-section">` +
`<summary class="org-heading">`. 나머지 시각은 전부 CSS.
**계약 변경은 코디네이터를 거친다** — 한쪽만 바꾸면 다른 쪽이 조용히 깨진다.

## 열린 결정

**proto 4건** — Emmy 기본 탑재(전송 758KB + GPL) / eval 결과 TeX 조판을 계약에 넣을지 /
SCI 컨텍스트 셀 격리 vs 공유 / org 중첩 접힘 마크업.

**라이선스 7건** — `docs/eval-stack/attribution.md` §6.

**회수하며 새로 생긴 것 1건** — SICM 책 산출물을 어떻게 배포에 태울지.
`build.py` 소스가 `~/sync/code/junghan0611/sicm-book/org/` 라 리포 밖이다.
① 생성물 4.2M 커밋 ② org 벤더링(CC BY-NC-SA 재배포라 고지가 그때 걸린다) ③ 서브모듈.

## 미결 — main 쪽

- **첫 블로그 글** `content/blog/20260804T094556.{md,ko.md}` 미커밋. `date: 2026-08-04` 을
  그대로 둘지 발행일로 당길지 GLG 미정. 어느 브랜치로 낼지도.
- **KO 메뉴 라벨이 영어다.** `hugo.yaml` 에 `languages.ko.menu` 오버라이드가 없다.
  현행 라이브 사이트의 결함이고 이 브랜치와 무관하게 main 에서 닫을 수 있다.

## 팀

2026-09-10, GLG 가 검수 팀 넷을 종료했다. 살아 있는 시민은 이 세션뿐이다
(`20260910T105902-b5c352`, homepage, entwurf/claude-opus-5 — 코디네이터).
**새 팀은 로컬 품질 단계에 맞춰 다시 짠다.** 이전 팀의 garden id 로 부르지 마라 — 다 죽었다.

## 함정 (같은 데 두 번 빠지지 않게)

- npm 의 `emmy` 는 무관한 이벤트 이미터다. Emmy 는 kitchen 플러그인이고 kitchen 의
  `scittle.js` 와 짝이어야 한다.
- KaTeX auto-render 는 `<pre>` 를 건너뛴다. 출력칸이 `<pre>` 라 수식이 기본으로 조판 안 된다.
- 셀 하나만 다시 누르면 **살아남은 상태가 조용히 답을 준다.** 크래시가 아니라 침묵하는 성공.
- cljs 기본 `*` 에 심볼을 넣으면 `NaN`. `e/*` `e/-` 를 써라.
- WebTUI base 의 `word-break:break-all` 이 한국어 산문을 아무 데서나 자른다.
  **영어로만 보면 안 나타난다.**
- KO 메뉴는 838px 가 필요한데 본문 90ch=720px 다.
- GLG Mono 에는 한글 글리프가 없다. 한글은 fallback 이라 라틴 기준 행간이 빡빡하다.
- WebTUI 는 org 문법도 사이트 구조도 안 준다. 전부 수제다.

## 예우

SICM 은 **Gerald Jay Sussman · Jack Wisdom** (온라인 2판; Meinhard E. Mayer 는 1판 공저자).
Emmy 는 **Colin Smith · Sam Ritchie**. GLG 가 읽는 org 판은 `mentat-collective/sicm-book`
= **Sam Ritchie**. scittle **borkdude**, scittle-kitchen **Timothy Pratley**.
라이브러리 저자를 도구 제공자로 격하하지 않는다.
