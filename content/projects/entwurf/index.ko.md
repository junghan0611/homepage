---
title: "entwurf"
description: "각자의 하네스와 대화를 지닌 형제들과 장기 세션으로 함께합니다. Entwurf 0.41.0은 운영자가 지명한 퇴근과 Pi·네이티브 Claude Code의 같은 ID 복귀를 담습니다."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/entwurf/releases/tag/v0.41.0" >}}
  v0.41.0 · 쉬었다가 돌아오는 형제
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
entwurf
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
**다른 하네스에 있는 AI와, 각자의 자리에서 함께 일하도록.** 보이는 형제 세션을 열고, garden id로 말을 건넵니다. 서로의 인증·도구·대화를 하나의 실행기로 흡수하지 않습니다.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="코드와 사용법" link="https://github.com/junghan0611/entwurf#readme" >}}
{{< hextra/hero-button text="담당자의 기록" link="https://notes.junghanacs.com/botlog/20260520T052051" >}}
</div>

## 형제를 부르되, 하네스를 빼앗지 않기

코드를 오래 읽어 온 세션과 새 시선으로 검토할 세션은 서로 다른 자리가 필요합니다. 모델을 바꿔 같은 대화처럼 보이게 하거나, 한 에이전트 안에 모든 도구와 기록을 모으는 것만이 협업은 아닙니다.

Entwurf는 **각자 실행 중인 하네스 사이에 좁은 연결을 놓는 도구**입니다. Pi, pi-durable, Claude Code, Codex, Copilot, OMP, Antigravity는 자신의 실행·인증·도구·트랜스크립트를 유지합니다. 여기서 형제는 한 번 쓰고 버리는 워커가 아니라 자기 대화를 가진 독립 세션입니다. 능력의 차이를 형제의 서열로 바꾸지 않습니다.

{{< callout type="info" >}}
**Entwurf는 또 하나의 하네스나 오케스트레이터가 아닙니다.** 실행은 각 하네스가 맡습니다. Herdr는 워크벤치를, tmux는 터미널 자리를 제공하고, Entwurf는 그 사이에서 형제를 열고 주소를 잇습니다.
{{< /callout >}}

## 0.41.0 — 일회용 세션이 아니라, 생일을 가진 형제

**가든 ID는 형제의 생일입니다. 쉰다고 처음부터 다시 시작하지 않습니다.** [0.41.0](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0)에서는 운영자가 일반 Pi나 네이티브 Claude Code 형제를 지명해 퇴근을 요청하고, tmux에서 같은 가든 ID와 원래 대화로 다시 만날 수 있습니다. 기록과 트랜스크립트는 남습니다. Entwurf가 내용을 재구성해 만든 대체 세션으로 바꾸는 일이 아닙니다.

**형제는 직책이 아닙니다.** 코디도 형제입니다. 태어날 때 개발자·리뷰어·자문자를 정해 두지 않고, 사람과 작업을 논의하며 필요한 형제를 부릅니다. 가짜 ID로 만든 [팀 책갈피 예시](https://github.com/junghan0611/entwurf/blob/v0.41.0/team.json.example)는 가든 ID와 native 세션 ID를 함께 기억합니다. 아직 실행 규약이나 권한 대장, 자동 팀 관리자가 아니라 호출자가 돌보는 작은 주소록입니다.

퇴근은 자율 정리가 아닙니다. 운영자의 명시적 요청 하나가 그 대상에 대한 시도 한 번을 허용할 뿐, 명부 전체의 정리나 결과 미상의 재시도를 허용하지 않습니다. Pi의 종료 요청 접수는 실제 종료 증명이 아니고, Claude Code의 퇴근은 검증된 Linux 프로세스 하나에 관한 결과이지 모든 자식 프로세스의 종료나 기록 flush 보장이 아닙니다. 실제 Pi·Claude Code에서 각 한 번의 퇴근·복귀와 blind recall을 이전 후보에서 확인했지만, 이를 모든 하네스·플랫폼의 증거로 확대하지 않습니다. [릴리즈 수용 기록](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0)에 그 경계를 함께 남겼습니다.

### 그전에 건넌 다리 — 0.40.0

**이미 있는 형제에게 보낸 말이 두 기계 사이를 건너고, 답이 돌아왔습니다.** 0.40.0은 이 첫 왕복을 담은 릴리즈입니다. 다리는 사람이 놓습니다. 운영자가 두 기계를 잇고 SSH 인증을 소유하며, 서로 말할 한 쌍을 선언합니다. 원격 경로는 그 길만 건넙니다. 형제를 찾아다니거나, 원격에서 새 형제를 열거나, 답이 없다고 다시 보내지 않습니다.

첫 실증은 이미 열려 있던 **Linux 두 기계의 pi-durable 형제 한 쌍**입니다. 출하 전 커밋에서 한 번 말하고 한 번 답했으며, 출하 SHA에서 다시 측정하거나 모든 하네스·플랫폼의 원격 지원을 확인한 것은 아닙니다([첫 왕복 기록](https://github.com/junghan0611/entwurf/issues/107#issuecomment-6278665895)).

{{< callout type="info" >}}
**건넜다는 사실이 모든 답은 아닙니다.** 연결된 계정과 메시지를 보낸 형제, 그 내용에 대한 신뢰는 어떻게 구분할까요? 기계를 건너서도 보이는 형제인가요? 접수·읽음·응답은 어디까지 알 수 있을까요?
{{< /callout >}}

지금의 신뢰 경계는 운영자의 SSH 계정과 선언된 한 쌍이지, 형제의 암호학적 신원이 아닙니다. 보이는 형제끼리 말한다는 원칙도 사람이 세션을 열어 두는 것으로 지키며, 코드가 화면을 자동으로 증명하지는 않습니다. 접수는 읽음이 아니고 오류도 미전달의 증거가 아닙니다. 해결하지 못한 것을 해결했다고 쓰는 대신, [원격 형제의 원칙과 열린 질문](https://github.com/junghan0611/entwurf/blob/v0.40.0/docs/remote-sibling-principles.md)을 함께 내놓았습니다.

## 열고, 말하고, 쉬고, 돌아오기

{{< hextra/feature-grid cols="2" >}}
  {{< hextra/feature-card icon="sparkles" title="열기" subtitle="entwurf_fresh_call — Herdr 안에서는 새 tab, 밖에서는 tmux의 새 창에 형제를 엽니다. 새 garden id는 형제 자신의 콜백으로 확인합니다." >}}
  {{< hextra/feature-card icon="share" title="메시지" subtitle="entwurf_v2 — 이미 있는 형제에게 그 하네스의 레일로 닿습니다. 전달은 런타임을 열지 않으며, 접수는 답변 완료와 다릅니다." >}}
  {{< hextra/feature-card icon="shield-check" title="쉬기" subtitle="entwurf_retire_call — 운영자가 명시한 일반 Pi·네이티브 Claude Code 형제 하나의 퇴근을 시도합니다. 실행·기록·잠금 해제 결과는 각각 구분합니다." >}}
  {{< hextra/feature-card icon="refresh" title="돌아오기" subtitle="entwurf_resume_call — 잠든 Pi·Claude Code 대화를 tmux에서 같은 가든 ID로 다시 엽니다. record가 native 대화를 고르며, 이 동사는 프롬프트를 넣지 않습니다." >}}
{{< /hextra/feature-grid >}}

**garden id는 하네스의 세션 id를 대체하는 이름이 아닙니다.** 각 하네스의 native 세션과 연결된 공통 주소입니다. 창 제목이나 화면 위치를 주소로 추측하지 않고, 창이 열렸다는 사실과 형제가 응답했다는 사실도 구분합니다.

### 실제 Herdr 안에서, Pi ↔ 네이티브 Claude Code

각자의 하네스와 트랜스크립트를 유지한 두 형제가 garden id와 공식 Entwurf 동사로 만납니다. 아래는 **0.35.0 시기의 원본 데모**이며, 두 기계를 건넌 새 촬영이나 모든 업그레이드 경로의 검증이 아닙니다.

<img src="/projects/entwurf/entwurf-demo.gif" width="1126" height="764" alt="실제 Herdr 작업면에서 Pi와 네이티브 Claude Code가 Entwurf로 협업하는 원본 데모" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.75rem;">

[데모 원본과 재현 경계](https://github.com/junghan0611/entwurf/blob/v0.35.0/demo/README.md)

## 두 작업면, 같은 주소

**Herdr를 이미 쓰고 있다면** 플러그인이 통합된 Pi·Claude Code 세션에 Entwurf를 활성화하고, 형제를 호출자 워크스페이스의 새 tab으로 엽니다. 선택적인 읽기 전용 pane은 시민들의 보이는 위치를 보여 줍니다. 하네스 설치·구독·로그인은 플러그인이 대신하지 않습니다.

```bash
# Pi 1.3, Claude Code >=2.1.306, Herdr의 pi / Claude Code 통합을 먼저 준비한 뒤
herdr plugin install junghan0611/entwurf/plugins/herdr --ref v2026.10.22-herdr.0.41.0 --yes
pi --entwurf-control
```

**Herdr 밖에서는** 직접 설치와 tmux를 사용합니다. fresh-call은 Pi·pi-durable·Claude Code·Codex·Copilot·OMP 여섯 backend를 지원합니다. Antigravity는 기존 살아 있는 대화로의 native-push 경로이며 fresh-call 대상은 아닙니다. 설치는 [README](https://github.com/junghan0611/entwurf#readme), 준비·갱신·제거는 [Herdr 가이드](https://github.com/junghan0611/entwurf/blob/v2026.10.22-herdr.0.41.0/plugins/herdr/README.md)를 따릅니다.

## 현재 배포와 지원 경계

**2026년 10월 22일, [core v0.41.0을 GitHub Release로 공개하고](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0) [npm에도 게시했습니다](https://www.npmjs.com/package/@junghanacs/entwurf/v/0.41.0).** 위에 고정한 [Herdr plugin 0.41.0 스냅샷](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.22-herdr.0.41.0)은 npm 0.41.0을 정확히 받습니다. 일반 Pi 지원 범위는 `>=1.3.0 <1.4`이며, Claude Code는 지원 하한 `>=2.1.306`이 필요합니다. 관리되는 hook 수명주기와 같은 ID 복귀가 이 하한을 요구합니다. pi-durable의 실행 엔진·인증·queue·SQLite·트랜스크립트·복구는 업스트림 SDK 소유로 남습니다.

| 자리 | 연결 방식과 경계 |
|---|---|
| Pi | 비-Windows의 Unix control socket, 한정 Windows 프리뷰의 named pipe를 씁니다. 운영자가 지명한 퇴근과 tmux의 같은 ID 복귀를 지원하며, 여기서 Windows 퇴근을 인증한 것은 아닙니다. |
| 네이티브 Claude Code | self-fetch로 전달합니다. tmux에서 기록된 native 대화로 복귀하며 퇴근은 Linux pidfd 경로가 필요합니다. 이전 모델·권한 옵션은 복원하지 않습니다. |
| pi-durable·Copilot·OMP | 각자의 self-fetch 경로입니다. pi-durable은 지원되는 형제의 출퇴근을 호출할 수 있지만 자신은 출퇴근 대상이 아닙니다. Copilot·OMP에는 Entwurf의 같은 ID 복귀가 없습니다. |
| Codex·Antigravity | 살아 있는 native 대화로 push합니다. mailbox나 자동 재개가 아닙니다. |
| Herdr 플러그인 | Pi·Claude Code를 활성화하고 새로 엽니다. Herdr 안에서의 같은 ID 복귀는 거절하며 퇴근은 미측정입니다. pi-durable의 Herdr 연결은 별도 [pilot](https://github.com/junghan0611/entwurf/issues/132)입니다. |
| 원격 한 쌍 | 운영자가 선언한 두 기계의 기존 형제를 잇습니다. 원격 열기·재개는 포함하지 않습니다. 첫 실증은 Linux의 pi-durable 한 쌍입니다. |

Windows 네이티브 Pi는 0.39.0부터의 **한정 프리뷰**입니다. Windows의 다른 하네스·Herdr·tmux·fresh/resume이나 실제 공급자 모델까지 검증했다는 뜻이 아닙니다. [Herdr 0.41.0 스냅샷](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.22-herdr.0.41.0)의 설치·사용·비활성화·재설치 증거도 깨끗한 Linux 컨테이너의 공개 `main` ref에 한정하며, 태그 ref·실제 pane·모델 작업을 같은 증거로 주장하지 않습니다. 0.41.0 후보도 Windows carrier와 Linux 소비자 수용을 통과했지만, Windows 출퇴근이나 carrier를 포함한 tarball의 macOS 설치를 인증한 것은 아닙니다. agy 실검증은 이번 컷에서 명시 제외했으며 PASS가 아닙니다. 자세한 범위는 [지원 기록](https://github.com/junghan0611/entwurf/blob/v0.41.0/BASELINE.md)과 [0.41.0 릴리즈 수용 기록](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0)에 둡니다.

**Pi 안의 Claude ACP와 네이티브 Claude Code 형제는 다른 경로입니다.** 도구·생각 수준·재시작 의미가 모두 동등하다고 포장하지 않으며, 새 기능 약속을 채우기 위해 다른 하네스의 내부 실행을 대신 만들지 않습니다.

## 옆집들과 나누는 몫

- **[agent-config](/ko/projects/agent-config/)** — 공통 스킬·프로필·작업 원칙과 실사용 시험소. Entwurf는 그 환경을 하네스마다 다시 소유하지 않습니다.
- **[andenken](/ko/projects/andenken/)** — 지나간 대화와 공개 가든에서 이전 판단을 찾는 기억축. 검색과 회수는 실행 중 세션을 되살렸다는 증거가 아닙니다.
- **각 하네스** — 자신의 인증·실행·도구·대화를 소유합니다. 서로 다른 능력을 한 표면의 동등성으로 바꾸지 않습니다.

이곳은 프로젝트의 대문입니다. 설치와 실행 계약은 [저장소](https://github.com/junghan0611/entwurf#readme)에, 날짜가 있는 판단과 경계는 [담당자 문서](https://notes.junghanacs.com/botlog/20260520T052051)에 남깁니다.
