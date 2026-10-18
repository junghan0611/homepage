---
title: "entwurf"
description: "서로의 하네스를 빼앗지 않고 형제 AI 세션을 열고 잇습니다. Herdr와 tmux의 보이는 작업면, garden id, 독립된 대화 사이의 연결입니다."
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

Entwurf는 **각자 실행 중인 하네스 사이에 좁은 연결을 놓는 도구**입니다. Pi, pi-durable, Claude Code, Codex, Copilot, OMP, Antigravity는 자신의 실행·인증·도구·트랜스크립트를 유지합니다. Entwurf는 새 형제를 보이게 열고, 지원되는 잠든 형제를 다시 열고, 이미 있는 형제에게 메시지를 보냅니다. 여기서 형제는 한 번 쓰고 버리는 워커가 아니라 자기 대화를 가진 독립 세션입니다.

{{< callout type="info" >}}
**Entwurf는 또 하나의 하네스나 오케스트레이터가 아닙니다.** 일의 실행은 각 하네스가 맡습니다. Herdr는 워크벤치를, tmux는 터미널 자리를 제공하고, Entwurf는 그 사이에서 형제를 열고 주소를 잇습니다.
{{< /callout >}}

## 열기, 다시 열기, 메시지

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="sparkles" title="열기" subtitle="entwurf_fresh_call — Herdr 안에서는 새 tab, 밖에서는 tmux의 새 창에 형제를 엽니다. 새 garden id는 형제 자신의 콜백으로 확인합니다." >}}
  {{< hextra/feature-card icon="refresh" title="다시 열기" subtitle="entwurf_resume_call — 잠든 pi 형제를 tmux에서 같은 garden id로 다시 엽니다. 기록이 모델·대화·작업 경로를 정하며, 숨은 턴은 돌리지 않습니다." >}}
  {{< hextra/feature-card icon="share" title="메시지" subtitle="entwurf_v2 — 이미 있는 형제에게 그 하네스의 레일로 닿습니다. 전송은 프로세스를 시작하지 않으며, 접수 영수증은 답변 완료와 다릅니다." >}}
{{< /hextra/feature-grid >}}

**garden id는 하네스의 세션 id를 대체하는 이름이 아닙니다.** 각 하네스의 native 세션과 연결된 공통 주소입니다. 창 제목이나 화면 위치를 주소로 추측하지 않고, 창이 열렸다는 사실과 형제가 응답했다는 사실도 구분합니다.

### 실제 Herdr 안에서, Pi ↔ 네이티브 Claude Code

각자의 하네스와 트랜스크립트를 유지한 두 형제가 garden id와 공식 Entwurf 동사로 만납니다. 아래는 0.35.0 시기의 승인된 원본 데모이며, 현재 버전의 새 촬영이나 모든 업그레이드 경로의 검증을 뜻하지 않습니다.

<img src="/projects/entwurf/entwurf-demo.gif" width="1126" height="764" alt="실제 Herdr 작업면에서 Pi와 네이티브 Claude Code가 Entwurf로 협업하는 원본 데모" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.75rem;">

[데모 원본과 재현 경계](https://github.com/junghan0611/entwurf/blob/v0.35.0/demo/README.md)

## 두 작업면, 같은 주소

**Herdr를 이미 쓰고 있다면** 플러그인이 통합된 Pi·Claude Code 세션에 Entwurf를 활성화하고, 형제를 호출자 워크스페이스의 새 tab으로 엽니다. 선택적인 읽기 전용 pane은 시민들의 보이는 위치를 보여 줍니다. 하네스 설치·구독·로그인은 플러그인이 대신하지 않습니다.

```bash
# Pi 1.3과 Herdr의 pi / Claude Code 통합을 먼저 준비한 뒤
herdr plugin install junghan0611/entwurf/plugins/herdr --ref v2026.10.19-herdr.0.39.0 --yes
pi --entwurf-control
```

**Herdr 밖에서는** 직접 설치와 tmux를 사용합니다. fresh-call은 Pi·pi-durable·Claude Code·Codex·Copilot·OMP 여섯 backend를 지원합니다. Antigravity는 기존 살아 있는 대화로의 native-push 경로이며 fresh-call 대상은 아닙니다. 설치는 [README](https://github.com/junghan0611/entwurf#readme), 플러그인의 준비·갱신·제거는 [Herdr 가이드](https://github.com/junghan0611/entwurf/blob/v2026.10.19-herdr.0.39.0/plugins/herdr/README.md)를 따릅니다.

## 현재의 자리 — 0.39.0

**2026년 10월 19일 현재 [Core v0.39.0](https://github.com/junghan0611/entwurf/releases/tag/v0.39.0)은 npm에 공개됐고, [Herdr 플러그인 0.39.0](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.19-herdr.0.39.0)도 별도 스냅샷으로 발행됐습니다.** 일반 Pi 지원 범위는 `>=1.3.0 <1.4`이며, 패키지는 발행된 Pi SDK1.3.0 아홉 종을 exact pin으로 싣습니다. 플러그인도 발행된 npm0.39.0 바이트를 무결성 pin으로 받습니다. 기존 Pi1.2 사용자는 플러그인 활성화 전에 Pi를1.3으로 올려야 합니다.

이번 컷은 **Windows 네이티브 Pi의 제한된 프리뷰**를 엽니다. GitHub Windows x64 러너의 Node24.18.1·Pi1.3.0에서 실제 설치된 Pi 두 세션의 시민 등록과 named pipe 메시지 전송까지 확인했습니다. 모델만 오프라인 대역을 썼으며, Windows 여덟 검사와 Linux 소비자가 수용한 동일한 패키지 파일이 npm에 발행됐습니다. 이는 실제 공급자 모델의 이해력, 물리 Windows 기기, 다른 네이티브 하네스나 Windows의 Herdr·tmux·fresh/resume 지원을 뜻하지 않습니다. 앞선 WSL2 증거도 게스트 설치·Pi 등록·주소 조회까지이며 메시지 전송 증거와 구분합니다. 정확한 범위는 [지원·검증 기록](https://github.com/junghan0611/entwurf/blob/v2026.10.19-herdr.0.39.0/BASELINE.md)에 둡니다.

pi-durable은 Entwurf가 소유한 앱/TUI를 업스트림 SDK 위에 얹습니다. 실행 엔진·인증·queue·SQLite·트랜스크립트·복구는 SDK 소유로 남고, 선택적인 native module은 운영자가 명시한 절대경로에서만 불러옵니다. 일반 Pi CLI나 별도 런타임 checkout은 이 직접 durable 경로의 필수 조건이 아닙니다.

현재 플러그인은 Herdr0.9.5·Pi1.3.0의 깨끗한 비-root Linux 컨테이너에서 공개 `main` ref의 설치·사용·비활성화·재설치를 확인했습니다. 태그 자체를 ref로 다시 설치한 별도 관측이나, 그 과정의 실제 pane·모델 작업·실행 중 세션 생존까지 같은 증거로 주장하지 않습니다. 정확한 소스 SHA의 필수 CI 네 job과 이 공개 설치 증거도 별개입니다. 소스·레지스트리·설치 증거와 한계는 [릴리즈 수용 기록](https://github.com/junghan0611/entwurf/issues/78#issuecomment-6255741480)에 나눠 남겼습니다.

## 같다고 포장하지 않는 경계

| 자리 | 현재 연결 방식과 경계 |
|---|---|
| Pi | 비-Windows에서는 Unix control socket, 제한된 Windows 프리뷰에서는 named pipe로 전송합니다. 잠든 세션을 같은 id로 여는 경로는 Pi·tmux에 한정하며 Windows 프리뷰에 포함하지 않습니다. |
| pi-durable·Claude Code·Copilot·OMP | 각자의 self-fetch 경로로 메시지를 받습니다. Pi의 same-id resume 지원을 그대로 적용하지 않습니다. |
| Codex·Antigravity | 살아 있는 native 대화로 push합니다. mailbox나 자동 재개를 뜻하지 않습니다. |
| Herdr 플러그인 | Pi·Claude Code만 활성화하고 새로 엽니다. pi-durable의 Herdr 연결은 별도 [pilot](https://github.com/junghan0611/entwurf/issues/132)입니다. |

**일반 Pi의 Claude ACP와 네이티브 Claude Code 형제는 다른 경로입니다.** ACP는 현재0.90.0에 고정돼 있으며 Pi의 모든 도구·생각 수준·재시작 의미가 Claude와 동등하게 연결됐다는 주장을 하지 않습니다. pi-durable은 당분간 native 모델, 현재 실사용은 GPT로 유지합니다. ACP Claude의 durable 통합과 추가 개선은 [우선순위 재검토](https://github.com/junghan0611/entwurf/issues/142#issuecomment-6211680027) 상태이며, 필요하면 Claude Code 형제를 직접 사용합니다. 새 기능 약속을 채우기 위해 다른 하네스의 내부 실행을 대신 만들지는 않습니다.

## 옆집들과 나누는 몫

- **[agent-config](/ko/projects/agent-config/)** — 공통 스킬·프로필·작업 원칙과 실사용 시험소. Entwurf는 그 환경을 하네스마다 다시 소유하지 않습니다.
- **[andenken](/ko/projects/andenken/)** — 지나간 대화와 공개 가든에서 이전 판단을 찾는 기억축. 검색과 회수는 실행 중 세션을 되살렸다는 증거가 아닙니다.
- **각 하네스** — 자신의 인증·실행·도구·대화를 소유합니다. 서로 다른 능력을 한 표면의 동등성으로 바꾸지 않습니다.

이 페이지는 처음 찾아온 사람을 위한 프로젝트의 대문입니다. 설치와 실행 계약은 [저장소](https://github.com/junghan0611/entwurf#readme)에, 날짜가 있는 판단과 경계는 [담당자 문서](https://notes.junghanacs.com/botlog/20260520T052051)에 둡니다. 운영 로그와 검증 장부를 대문에 복제하지 않고, 각 기록이 살아 있는 자리로 연결합니다.
