---
title: "doomemacs-config"
description: "사람이 쓰고 생각하는 편집기, 에이전트가 같은 Org 기록에 참여하는 접점. Doom Emacs·Denote·하나의 어젠다에서 디지털 가든까지 이어지는 집입니다."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/doomemacs-config" >}}
  Doom Emacs · Org-mode · Denote
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
doomemacs-config
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
**사람이 쓰고, 생각하고, 다시 돌아오는 집.** 에이전트도 같은 Org 파일을 열고, 사람이 남긴 일정 옆에 자기 작업의 흔적을 남깁니다. 편집기를 에이전트로 대체하지 않고, 서로의 일이 만나는 접점을 만듭니다.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="코드와 사용법" link="https://github.com/junghan0611/doomemacs-config#readme" >}}
{{< hextra/hero-button text="담당자 문서" link="https://notes.junghanacs.com/botlog/20260227t120800" >}}
</div>

## 에이전트가 대신 쓰는 것과 내가 쓰기 편한 것은 다릅니다

메모를 연결하고, 책을 읽고, 한글을 쓰고, 수식을 입력하는 일. 에이전트가 문서를 만들어 줄 수 있어도 사람이 직접 생각을 이어 가는 손의 편안함은 별개의 문제입니다. 이 설정의 중심에는 여전히 사람이 사용하는 편집기가 있습니다.

[Doom Emacs](https://github.com/doomemacs/doomemacs) 위에 Org-mode와 Denote를 놓고, 한글 입력·Evil 키바인딩·검색·인용·터미널을 일상 작업에 맞춥니다. GUI와 TTY를 함께 쓰되, 원격 클립보드나 이미지처럼 환경마다 달라지는 경계를 같다고 포장하지 않습니다. 개인 설정인 만큼 그대로 복제하는 배포판보다는, 오래 사용하며 고친 접점들의 공개 사례에 가깝습니다.

## 사람과 에이전트가 하나의 시간축에 남기는 것

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="pencil" title="사람의 작업면" subtitle="Org에 글을 쓰고 Denote로 연결합니다. 편집·읽기·노트 사이를 오가는 흐름은 사람의 손에 남깁니다." >}}
  {{< hextra/feature-card icon="code" title="에이전트의 접점" subtitle="헤드리스 RPC 경로에서 노트를 찾고 히스토리·헤딩·링크를 더합니다. 클라이언트에 따라 사람의 편집 세션을 명시적으로 대상으로 삼을 수도 있습니다." >}}
  {{< hextra/feature-card icon="calendar" title="공유하는 어젠다" subtitle="일정·저널·에이전트 작업 기록을 같은 org-agenda에 놓습니다. 화면은 달라도 데이터의 해석 규칙은 공유합니다." >}}
{{< /hextra/feature-grid >}}

`lisp/workflow-shared.el`은 사용자 Emacs, 에이전트 RPC 데몬, 내보내기 데몬이 함께 지켜야 할 데이터 계약입니다. 태그·할 일 상태·어젠다 파일·첨부 경로의 해석이 GUI에서만 맞고 데몬에서는 달라지는 일을 막습니다. 테마와 키바인딩은 달라도, 같은 기록을 읽고 쓰는 규칙은 같아야 합니다.

작업면은 분리합니다. `user`는 GUI 편집기, `pi`는 여러 TTY 클라이언트가 붙는 전체 Doom 세션, `server`는 에이전트 RPC 데몬입니다. **여기서 `pi`는 Emacs 소켓 이름이며, Pi 에이전트의 정체성이 아닙니다.** 별도 데몬은 실행을 분리하지만, 같은 Org 파일의 동시 편집까지 자동으로 조정해 주는 것은 아닙니다.

## 파일에서 가든으로, 가든에서 다시 생각으로

```text
Org · Denote → ox-hugo Markdown 내보내기 → Quartz 디지털 가든
       ↑                                      ↓
   사람과 에이전트의 다음 작업 ← 원문을 확인하는 검색과 회수
```

이 집은 노트를 내보내는 파이프라인도 맡습니다. Emacs 데몬들이 Org를 Markdown으로 변환하고, 링크·그림·콘텐츠 검사를 거쳐 [디지털 가든](https://notes.junghanacs.com)에 닿습니다. ox-hugo는 변환을, 별도 [garden 리포](https://github.com/junghan0611/garden)의 Quartz는 발행을 맡습니다. 태그도 임의 목록이 아니라 meta 노트가 정의한 어휘 풀을 통과해야 공개됩니다.

같은 어젠다를 브라우저로 보여 주는 곳은 [geworfen](https://github.com/junghan0611/geworfen)의 [공개 시간축](https://agenda.junghanacs.com)입니다. 이 리포가 웹사이트나 기억 검색 엔진까지 모두 소유하지는 않습니다.

## 옆집들과 나누는 몫

- **[agent-config](/ko/projects/agent-config/)** — 하네스가 바뀌어도 이어지는 스킬과 작업 원칙. 이 집은 그 스킬이 호출할 Emacs 쪽 함수를 제공합니다.
- **[Entwurf](/ko/projects/entwurf/)** — 독립된 형제 세션을 열고 garden id로 메시지를 보냅니다. 이 집의 ghostel·tmux 작업면은 그 세션을 담을 수 있지만, 인증·트랜스크립트·딜리버리를 대신 소유하지 않습니다.
- **[andenken](/ko/projects/andenken/)** — 대화와 공개 가든에서 이전 판단을 찾습니다. 이 집은 Org 원문과 가든 내보내기를 맡고, 검색 인덱스는 기억의 주인이 되지 않습니다.

Emacs 안에서도 gptel-agent, Pi의 RPC 클라이언트인 pilish, ACP 클라이언트인 agent-shell을 사용할 수 있습니다. 그렇다고 모든 형제를 Emacs 안으로 옮기지는 않습니다. ghostel 안에서 tmux에 붙으면 Emacs와 독립적으로 실행되는 터미널 세션에 돌아갈 수 있습니다.

## 오래 쓰기 위해 남기는 경계

`config.el`은 로더로 두고, 기능은 `lisp/`에서 관심사별로 나눕니다. 순수 로직은 가능하면 Doom 없이 `emacs -Q`로 검증합니다. 키바인딩은 Doom의 기존 접두 맵을 통째로 교체하지 않고 필요한 키만 얹습니다. 상류가 바뀌면 먼저 이 설정을 고칩니다. 이 규칙은 실행되는 검사이기도 합니다. [`test-keybinding-lint.el`](https://github.com/junghan0611/doomemacs-config/blob/main/tests/test-keybinding-lint.el)은 기존 맵을 교체해 버리는 이름 붙은 접두 형식을 거부합니다.

Neomacs의 현재 검수와 우회책은 별도 [neomacs-config](https://github.com/junghan0611/neomacs-config)가 맡습니다. 여기에는 GNU Emacs와 같은 조건으로 비교하는 최소 프로필과 재현 프로브가 남습니다.

이 페이지는 집의 대문입니다. 설치·명령·현재 구현은 [README](https://github.com/junghan0611/doomemacs-config#readme)에, 날짜가 있는 판단과 경계는 [담당자 문서](https://notes.junghanacs.com/botlog/20260227t120800)에 둡니다. 작업 로그를 대문에 복제하지 않고, 각 기록이 살아 있는 자리로 연결합니다.
