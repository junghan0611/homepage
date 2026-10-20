---
title: "entwurf"
description: "각자의 하네스와 대화를 지닌 AI 형제를 열고 잇습니다. 0.40.0은 사람이 놓은 다리로 두 기계를 건넌 첫 대화와, 신뢰·가시성의 열린 질문을 함께 내놓습니다."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://www.npmjs.com/package/@junghanacs/entwurf" >}}
  Open source · Herdr · tmux
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

## 0.40.0 — 다리는 건넜고, 질문은 함께 남겼다

**이미 있는 형제에게 보낸 말이 두 기계 사이를 건너고, 답이 돌아왔습니다.** 0.40.0은 이 첫 왕복을 담은 릴리즈입니다. 다리는 사람이 놓습니다. 운영자가 두 기계를 잇고 SSH 인증을 소유하며, 서로 말할 한 쌍을 선언합니다. 원격 경로는 그 길만 건넙니다. 형제를 찾아다니거나, 원격에서 새 형제를 열거나, 답이 없다고 다시 보내지 않습니다.

첫 실증은 이미 열려 있던 **Linux 두 기계의 pi-durable 형제 한 쌍**입니다. 출하 전 커밋에서 한 번 말하고 한 번 답했으며, 출하 SHA에서 다시 측정하거나 모든 하네스·플랫폼의 원격 지원을 확인한 것은 아닙니다([첫 왕복 기록](https://github.com/junghan0611/entwurf/issues/107#issuecomment-6278665895)).

{{< callout type="info" >}}
**건넜다는 사실이 모든 답은 아닙니다.** 연결된 계정과 메시지를 보낸 형제, 그 내용에 대한 신뢰는 어떻게 구분할까요? 기계를 건너서도 보이는 형제인가요? 접수·읽음·응답은 어디까지 알 수 있을까요?
{{< /callout >}}

지금의 신뢰 경계는 운영자의 SSH 계정과 선언된 한 쌍이지, 형제의 암호학적 신원이 아닙니다. 보이는 형제끼리 말한다는 원칙도 사람이 세션을 열어 두는 것으로 지키며, 코드가 화면을 자동으로 증명하지는 않습니다. 접수는 읽음이 아니고 오류도 미전달의 증거가 아닙니다. 해결하지 못한 것을 해결했다고 쓰는 대신, [원격 형제의 원칙과 열린 질문](https://github.com/junghan0611/entwurf/blob/v0.40.0/docs/remote-sibling-principles.md)을 함께 내놓았습니다.

## 열기, 다시 열기, 메시지

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="sparkles" title="열기" subtitle="entwurf_fresh_call — Herdr 안에서는 새 tab, 밖에서는 tmux의 새 창에 형제를 엽니다. 새 garden id는 형제 자신의 콜백으로 확인합니다." >}}
  {{< hextra/feature-card icon="refresh" title="다시 열기" subtitle="entwurf_resume_call — 잠든 pi 형제를 tmux에서 같은 garden id로 다시 엽니다. 기록이 모델·대화·작업 경로를 정하며, 숨은 턴은 돌리지 않습니다." >}}
  {{< hextra/feature-card icon="share" title="메시지" subtitle="entwurf_v2 — 이미 있는 형제에게 그 하네스의 레일로 닿습니다. 전달은 형제 런타임을 자동으로 열거나 재개하지 않으며, 접수 영수증은 답변 완료와 다릅니다." >}}
{{< /hextra/feature-grid >}}

**garden id는 하네스의 세션 id를 대체하는 이름이 아닙니다.** 각 하네스의 native 세션과 연결된 공통 주소입니다. 창 제목이나 화면 위치를 주소로 추측하지 않고, 창이 열렸다는 사실과 형제가 응답했다는 사실도 구분합니다.

### 실제 Herdr 안에서, Pi ↔ 네이티브 Claude Code

각자의 하네스와 트랜스크립트를 유지한 두 형제가 garden id와 공식 Entwurf 동사로 만납니다. 아래는 **0.35.0 시기의 원본 데모**이며, 두 기계를 건넌 새 촬영이나 모든 업그레이드 경로의 검증이 아닙니다.

<img src="/projects/entwurf/entwurf-demo.gif" width="1126" height="764" alt="실제 Herdr 작업면에서 Pi와 네이티브 Claude Code가 Entwurf로 협업하는 원본 데모" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.75rem;">

[데모 원본과 재현 경계](https://github.com/junghan0611/entwurf/blob/v0.35.0/demo/README.md)

## 두 작업면, 같은 주소

**Herdr를 이미 쓰고 있다면** 플러그인이 통합된 Pi·Claude Code 세션에 Entwurf를 활성화하고, 형제를 호출자 워크스페이스의 새 tab으로 엽니다. 선택적인 읽기 전용 pane은 시민들의 보이는 위치를 보여 줍니다. 하네스 설치·구독·로그인은 플러그인이 대신하지 않습니다.

```bash
# Pi 1.3과 Herdr의 pi / Claude Code 통합을 먼저 준비한 뒤
herdr plugin install junghan0611/entwurf/plugins/herdr --ref v2026.10.20-herdr.0.40.0 --yes
pi --entwurf-control
```

**Herdr 밖에서는** 직접 설치와 tmux를 사용합니다. fresh-call은 Pi·pi-durable·Claude Code·Codex·Copilot·OMP 여섯 backend를 지원합니다. Antigravity는 기존 살아 있는 대화로의 native-push 경로이며 fresh-call 대상은 아닙니다. 설치는 [README](https://github.com/junghan0611/entwurf#readme), 준비·갱신·제거는 [Herdr 가이드](https://github.com/junghan0611/entwurf/blob/v2026.10.20-herdr.0.40.0/plugins/herdr/README.md)를 따릅니다.

## 현재 배포와 지원 경계

**2026년 10월 20일, [core v0.40.0](https://github.com/junghan0611/entwurf/releases/tag/v0.40.0)과 [Herdr plugin 0.40.0](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.20-herdr.0.40.0)의 버전쌍을 맞췄습니다.** Herdr는 수용된 core와 동일한 npm 0.40.0 바이트를 무결성 pin으로 받습니다. 일반 Pi 지원 범위는 `>=1.3.0 <1.4`이며, pi-durable의 실행 엔진·인증·queue·SQLite·트랜스크립트·복구는 업스트림 SDK 소유로 남습니다.

| 자리 | 연결 방식과 경계 |
|---|---|
| Pi | 비-Windows에서는 Unix control socket, 제한된 Windows 프리뷰에서는 named pipe를 씁니다. 같은 id로 잠든 세션을 다시 여는 경로는 Pi·tmux에 한정합니다. |
| pi-durable·Claude Code·Copilot·OMP | 각자의 self-fetch 경로로 메시지를 받습니다. Pi의 same-id resume 지원을 그대로 적용하지 않습니다. |
| Codex·Antigravity | 살아 있는 native 대화로 push합니다. mailbox나 자동 재개가 아닙니다. |
| Herdr 플러그인 | Pi·Claude Code를 활성화하고 새로 엽니다. pi-durable의 Herdr 연결은 별도 [pilot](https://github.com/junghan0611/entwurf/issues/132)입니다. |
| 원격 한 쌍 | 운영자가 선언한 두 기계의 기존 형제를 잇습니다. 원격 열기·재개는 포함하지 않습니다. 첫 실증은 Linux의 pi-durable 한 쌍입니다. |

Windows 네이티브 Pi는 0.39.0부터의 **한정 프리뷰**입니다. Windows의 다른 하네스·Herdr·tmux·fresh/resume이나 실제 공급자 모델까지 검증했다는 뜻이 아닙니다. Herdr의 이번 설치·사용·비활성화·재설치 증거도 깨끗한 Linux 컨테이너의 공개 `main` ref에 한정하며, 태그 ref·실제 pane·모델 작업을 같은 증거로 주장하지 않습니다. 자세한 범위는 [지원 기록](https://github.com/junghan0611/entwurf/blob/v0.40.0/BASELINE.md)과 [릴리즈 수용 기록](https://github.com/junghan0611/entwurf/issues/107#issuecomment-6281902241)에 둡니다.

**Pi 안의 Claude ACP와 네이티브 Claude Code 형제는 다른 경로입니다.** 도구·생각 수준·재시작 의미가 모두 동등하다고 포장하지 않으며, 새 기능 약속을 채우기 위해 다른 하네스의 내부 실행을 대신 만들지 않습니다.

## 옆집들과 나누는 몫

- **[agent-config](/ko/projects/agent-config/)** — 공통 스킬·프로필·작업 원칙과 실사용 시험소. Entwurf는 그 환경을 하네스마다 다시 소유하지 않습니다.
- **[andenken](/ko/projects/andenken/)** — 지나간 대화와 공개 가든에서 이전 판단을 찾는 기억축. 검색과 회수는 실행 중 세션을 되살렸다는 증거가 아닙니다.
- **각 하네스** — 자신의 인증·실행·도구·대화를 소유합니다. 서로 다른 능력을 한 표면의 동등성으로 바꾸지 않습니다.

이곳은 프로젝트의 대문입니다. 설치와 실행 계약은 [저장소](https://github.com/junghan0611/entwurf#readme)에, 날짜가 있는 판단과 경계는 [담당자 문서](https://notes.junghanacs.com/botlog/20260520T052051)에 남깁니다.
