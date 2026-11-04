---
title: "entwurf"
description: "각자의 하네스와 대화를 지닌 AI 형제들을, 서로의 자리를 빼앗지 않고 잇습니다. 보이는 세션을 열고, 가든 ID로 말을 건네고, 잠든 형제를 같은 ID로 다시 부릅니다. 설명할 수 있어야 고칠 수 있기에, 형제에게 건네는 말과 사람이 읽는 입구를 각각 한 원천에 둡니다."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/entwurf/releases/tag/v0.51.0" >}}
  v0.51.0 · Pi 1.5 SDK 위의 같은 형제들
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
entwurf
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
**다른 하네스에 있는 AI와, 각자의 자리에서 함께 일하도록.** 보이는 형제 세션을 열고, 가든 ID로 말을 건넵니다. 서로의 인증·도구·대화를 하나의 실행기로 흡수하지 않습니다.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="코드와 사용법" link="https://github.com/junghan0611/entwurf#readme" >}}
{{< hextra/hero-button text="담당자 문서" link="https://notes.junghanacs.com/botlog/20260520T052051" >}}
</div>

## 형제를 부르되, 하네스를 빼앗지 않기

코드를 오래 읽어 온 세션과 새 시선으로 검토할 세션은 서로 다른 자리가 필요합니다. 모델을 바꿔 같은 대화처럼 보이게 하거나, 한 에이전트 안에 모든 도구와 기록을 모으는 것만이 협업은 아닙니다.

Entwurf는 **각자 실행 중인 하네스 사이에 좁은 연결을 놓는 도구**입니다. Pi, pi-durable, Claude Code, Codex, Copilot, OMP, Antigravity는 자신의 실행·인증·도구·트랜스크립트를 유지합니다. 여기서 형제는 한 번 쓰고 버리는 워커가 아니라 자기 대화를 가진 독립 세션입니다. 능력의 차이를 형제의 서열로 바꾸지 않습니다.

**형제는 직책이 아닙니다.** 코디도 형제입니다. 태어날 때 개발자·리뷰어·자문자를 정해 두지 않고, 사람과 작업을 논의하며 필요한 형제를 부릅니다.

{{< callout type="info" >}}
**Entwurf는 또 하나의 하네스나 오케스트레이터가 아닙니다.** 실행은 각 하네스가 맡습니다. Herdr는 워크벤치를, tmux는 터미널 자리를 제공하고, Entwurf는 그 사이에서 형제를 열고 주소를 잇습니다.
{{< /callout >}}

## 0.51.0 — Pi 1.5 SDK 위의 같은 형제들

**0.51.0은 Entwurf를 Pi 1.5.0 SDK 묶음으로 옮깁니다. MCP 도구와 새 권한은 더하지 않았습니다.** 고정한 SDK 패키지 열 개가 함께 정확히 1.5.0으로 올라가고, 일반 Pi는 이제 `>=1.5.0 <1.6`를 받습니다. Entwurf의 얇은 pi-durable 참조 앱은 1.5 durable API를 따르며, SDK의 최근 창만이 아니라 활성 대화 전체를 보여 줍니다. durable 세션에 1.5가 처음 쓴 내용은 SDK 1.4가 읽지 못합니다. 그 경계는 아래 지원 경계 절의 경고에 있습니다.

- **설치 준비는 설치 완료가 아닙니다.** 이번 업그레이드 중 다른 개발 기기 하나가 새 소스를 이미 받아 두었지만, 의존성은 아직 SDK 1.4였고 설치 창은 운영자의 승인을 기다리고 있었습니다. launcher는 섞인 묶음으로 세션을 여는 대신 이름 붙은 이유로 거절했습니다. 실패한 기동에서 기존 세션에 쓰지 않았다는 보고이며, 명시 승인 뒤 설치가 실행되고 같은 ID로 복귀했다고 그 기기가 보고했습니다(여기서 다시 재지 않음). 교훈은 인계에 있습니다. 설치기가 실제로 실행됐는지를 분명히 말하고, 설치 성공 기록과 SDK 정합 확인이 있은 뒤에만 다시 열 준비가 됐다고 안내합니다([0.51.0 릴리즈 기록](https://github.com/junghan0611/entwurf/releases/tag/v0.51.0)).
- **Herdr는 main에서 따라옵니다.** 플러그인의 `main`은 npm에 게시된 0.51.0 런타임을 고정합니다([`ce5a720`](https://github.com/junghan0611/entwurf/commit/ce5a720)). 이를 담은 스냅샷 태그는 아직 없고, 공개 ref에서 설치하는 여정도 측정하지 않았습니다.

## 0.50.0 — 다 아는 사람에게도 친절이 필요했던 이유

**GLG는 0.50.0을 최근 작업 가운데 가장 힘든 일로 꼽았습니다. 이유는 하나, 만든 사람이 쓰지 않는 면을 다듬는 일이었기 때문입니다.** 만든 사람은 tmux에서 일하고 Entwurf에 무엇이 있고 없는지를 이미 알기에, help를 읽을 일도 Herdr에서 형제를 열 일도 드뭅니다. 만든 사람에게는 친절할 필요가 없던 면입니다. 그래도 GLG는 지금 하지 않으면 Entwurf가 좋아지지 않는다고 판단했습니다. 사용자를 늘리려는 것이 아니라, Entwurf가 친절해야 개선된다는 뜻입니다.

**우리는 이 판단을 이렇게 읽습니다. 설명할 수 있어야 고칠 수 있습니다.** 기억으로만 아는 도구에서는 빈틈이 이미 메워진 채로 보입니다. 처음 보는 사람에게 명령 하나가 무엇을 하고 무엇을 하지 않는지 한 문장으로 말해 보면, 그 문장이 서지 않는 자리가 고칠 자리로 드러납니다. 여기서 친절은 손님을 모으는 포장이 아니라 그런 점검입니다.

**사람이 읽는 명령줄 입구에도 한 원천을 세웠습니다.** 0.45.0의 `ENTWURF.json`이 형제에게 건네는 말의 원천이라면, 루트 `ENTWURF-CLI.json`은 사람에게 건네는 말의 원천입니다. `entwurf --help`의 짧은 첫 화면, `help all`의 전체 목록, 명령별 페이지, `help team`·`help remote-pair` 두 안내가 이 파일에서 나옵니다. 설명은 실행을 고르지 않습니다. 실행은 기존 dispatch가 맡고, 검사 하나가 두 쪽을 따로 대조합니다. 설명하지 않은 이름의 도움말을 물으면 안내를 지어내지 않고 거절합니다. 아직 설명이 없는 명령도 남아 있고, 그 목록도 같은 검사가 고정해 둡니다. 새로 생긴 `entwurf claude`는 PATH의 `claude`를 인자 그대로 실행하는 얇은 입구일 뿐이며, 형제 자격은 여전히 설치된 hook에서 옵니다([#153](https://github.com/junghan0611/entwurf/issues/153), [#157](https://github.com/junghan0611/entwurf/issues/157)).

**Herdr도 같은 까닭으로 다듬었습니다.** 만든 사람에게는 tmux가 익숙하지만, Entwurf는 전송 방식이 달라도 형제를 부르고 불리는 기본 경험이 대칭이어야 한다고 봅니다. 0.50.0에서 잠든 Pi·pi-durable·Claude Code 형제는 tmux에서는 새 창으로, Herdr 안에서는 새 tab으로 같은 가든 ID를 되찾습니다. 어느 쪽으로 열지는 호출자가 실행되는 곳이 정하고, 한쪽이 실패해도 다른 쪽으로 넘어가지 않습니다. tab이 이미 생긴 뒤의 실패는 '아무것도 열리지 않음'이 아니라 복구 방법과 함께 보고합니다.

- **새 도구도, 새 권한도 없습니다.** MCP 도구는 0.45.0의 아홉 개 그대로입니다. 복귀는 프롬프트를 넣지 않고, Claude Code 복귀는 이전 모델·권한 옵션을 되살리지 않으며, 전달은 여전히 프로세스를 시작하지 않습니다.
- **복귀가 알려 주는 것은 경로마다 다릅니다.** pi-durable은 새 child가 이번 호출의 예약을 채택했는지를 보고하며, 이것은 준비 완료도 기억 회수도 아닙니다. Herdr의 Claude Code 복귀는 pane의 직계 child를 확인하고, 읽지 못하면 기다리거나 다시 시도하지 않고 그 사실을 남깁니다.
- **Herdr 안의 복귀는 아직 관측 단계입니다.** Pi(11월 1일), pi-durable(최종 전 후보), Claude Code(11월 2일 두 번, 대화 회수는 둘째에서만 확인)의 날짜 있는 소수의 관측이 있습니다. Herdr 안의 같은 ID 복귀와 pi-durable 복귀를 덮는 이름 붙은 LIVE·릴리즈 게이트는 아직 없습니다. 자세한 경계는 [0.50.0 릴리즈 기록](https://github.com/junghan0611/entwurf/releases/tag/v0.50.0)에 있습니다.

## 열고, 말하고, 쉬고, 돌아오기

{{< hextra/feature-grid cols="2" >}}
  {{< hextra/feature-card icon="sparkles" title="열기" subtitle="entwurf_fresh_call — Herdr 안에서는 새 tab, 밖에서는 tmux의 새 창에 형제를 엽니다. 새 가든 ID는 형제 자신의 콜백으로 확인합니다." >}}
  {{< hextra/feature-card icon="share" title="메시지" subtitle="entwurf_v2 — 이미 있는 형제에게 그 하네스의 레일로 닿습니다. 전달은 런타임을 열지 않으며, 접수는 답변 완료와 다릅니다." >}}
  {{< hextra/feature-card icon="shield-check" title="쉬기" subtitle="entwurf_retire_call — 운영자가 명시한 일반 Pi·네이티브 Claude Code 형제 하나의 퇴근을 시도합니다. 실행·기록·잠금 해제 결과는 각각 구분합니다." >}}
  {{< hextra/feature-card icon="refresh" title="돌아오기" subtitle="entwurf_resume_call — 잠든 Pi·pi-durable·Claude Code 형제를 같은 가든 ID로 다시 엽니다. tmux에서는 새 창, Herdr 안에서는 새 tab입니다. record가 native 대화를 고르며, 이 동사는 프롬프트를 넣지 않습니다." >}}
{{< /hextra/feature-grid >}}

**가든 ID는 하네스의 세션 ID를 대체하는 이름이 아닙니다.** 각 하네스의 native 세션과 연결된 공통 주소입니다. 창 제목이나 화면 위치를 주소로 추측하지 않고, 창이 열렸다는 사실과 형제가 응답했다는 사실도 구분합니다.

### 실제 Herdr 안에서, Pi ↔ 네이티브 Claude Code

각자의 하네스와 트랜스크립트를 유지한 두 형제가 가든 ID와 공식 Entwurf 동사로 만납니다. 아래는 **0.35.0 시기의 원본 데모**이며, 두 기계를 건넌 새 촬영이나 모든 업그레이드 경로의 검증이 아닙니다.

<img src="/projects/entwurf/entwurf-demo.gif" width="1126" height="764" alt="실제 Herdr 작업면에서 Pi와 네이티브 Claude Code가 Entwurf로 협업하는 원본 데모" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.75rem;">

[데모 원본과 재현 경계](https://github.com/junghan0611/entwurf/blob/v0.35.0/demo/README.md)

## 두 작업면, 같은 주소

**Herdr를 이미 쓰고 있다면** 플러그인이 통합된 Pi·Claude Code 세션에 Entwurf를 활성화합니다. 형제는 호출자 워크스페이스의 새 tab으로 열리고, 0.50.0 런타임부터는 잠든 형제도 새 tab에서 같은 ID로 돌아옵니다. 선택적인 읽기 전용 pane은 형제들의 보이는 위치를 보여 줍니다. 하네스 설치·구독·로그인은 플러그인이 대신하지 않습니다.

```bash
# Pi 1.5, Claude Code >=2.1.306, Herdr의 pi / Claude Code 통합을 먼저 준비한 뒤
herdr plugin install junghan0611/entwurf/plugins/herdr --yes
pi --entwurf-control
```

ref 없이 설치하면 main의 lock을 따르고, 지금 main은 Pi 1.5용 공개 npm 0.51.0을 고정합니다([`ce5a720`](https://github.com/junghan0611/entwurf/commit/ce5a720)). 이 짝을 고정한 Herdr 스냅샷 태그는 아직 없고, 공개 ref에서 설치하는 여정도 측정하지 않았습니다. 태그로 고정된 마지막 짝 [v2026.10.27-herdr.0.45.0](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.27-herdr.0.45.0)은 npm 0.45.0을 받으며, 그 런타임에는 Herdr 안의 같은 ID 복귀가 없습니다. ref마다 어떤 런타임을 받는지와 준비·갱신·제거는 [Herdr 가이드](https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md#from-a-raw-linux-box-in-nine-steps)가 소유합니다.

**Herdr 밖에서는** 직접 설치와 tmux를 사용합니다. 새로 열기는 Pi·pi-durable·Claude Code·Codex·Copilot·OMP 여섯 backend를, 같은 ID 복귀는 Pi·pi-durable·Claude Code를 지원합니다. Antigravity는 fresh-call 대상이 아니며, native-push 경로도 현재 일시 중지되어 있습니다. 설치는 [README](https://github.com/junghan0611/entwurf#readme)를 따릅니다.

## 현재 배포와 지원 경계

**2026년 11월 4일 기준, [core v0.51.0이 GitHub Release](https://github.com/junghan0611/entwurf/releases/tag/v0.51.0)와 [npm](https://www.npmjs.com/package/@junghanacs/entwurf/v/0.51.0)에 올라 있습니다.** registry에서 받은 파일은 Windows carrier를 포함해 수용한 후보 파일과 바이트까지 같습니다. 0.51.0은 Pi SDK 1.5.0 위에 있으며, 일반 Pi는 `>=1.5.0 <1.6`를 받습니다. Pi 1.4에 머무는 호스트는 [core 0.50.0](https://github.com/junghan0611/entwurf/releases/tag/v0.50.0)과 그 게시 안내를 따릅니다. 지원하는 하네스 버전과 설치·갱신 순서는 [설치 안내의 요구 사항](https://github.com/junghan0611/entwurf/blob/v0.51.0/docs/setup-clean-host.md#requirements)과 [0.51.0 릴리즈 기록](https://github.com/junghan0611/entwurf/releases/tag/v0.51.0)이 소유합니다. 새 바이트를 갱신하는 일과 새 프로세스를 띄우는 일은 별개이며, 이미 떠 있는 bridge는 스스로 다시 읽지 않습니다([실행 중인 호스트에 새 소스 적용하기](https://github.com/junghan0611/entwurf/blob/v0.51.0/docs/setup-clean-host.md#applying-new-source-to-a-running-host)). pi-durable의 실행 엔진·인증·queue·SQLite·트랜스크립트·복구는 업스트림 SDK 소유로 남습니다.

{{< callout type="warning" >}}
**durable 세션에 Pi 1.5 SDK가 처음 쓰는 순간, 저장소는 한 방향으로만 넘어갑니다.** SDK 1.5는 SQLite schema를 2로 유지하지만 live 문서를 SDK 1.4가 거절하는 버전으로 씁니다. 그래서 그 뒤의 세션은 0.50.0에서 다시 열리지 않고, 옛 패키지를 다시 설치해도 되돌아가지 않습니다. 옛 owner를 정상 종료하고 실제로 끝났는지 확인한 뒤, 처음 1.5로 열기 전에 `-wal`/`-shm`을 포함한 세션 파일 세트 전체를 한 묶음으로 일관되게 백업합니다. 세션을 SDK 1.4로 되돌리는 것은 그 백업뿐이며, 1.5로 연 뒤에 한 작업은 그 백업에 없습니다. SDK 1.4로 쓴 합성 세션 두 개를 fixture에서 1.5로 열었지만, 그것은 그 두 파일의 증거이지 운영 데이터의 호환·복구 보장이 아닙니다. 나머지 순서는 [업그레이드 범위](https://github.com/junghan0611/entwurf/blob/v0.51.0/docs/setup-clean-host.md#default-radius-for-a-requested-pi-sdk-upgrade)에 있습니다. 앞서 Pi 1.3 SDK에서 옮겨 올 때도 같은 뜻으로 한 방향이었습니다([그때의 이관 안내](https://github.com/junghan0611/entwurf/blob/v2026.10.23-herdr.0.41.1/docs/setup-clean-host.md#moving-durable-sessions-from-the-pi-13-sdk-to-14)).
{{< /callout >}}

| 자리 | 연결 방식과 경계 |
|---|---|
| Pi | 비-Windows의 Unix control socket, 한정 Windows 프리뷰의 named pipe를 씁니다. 운영자가 지명한 퇴근을 지원하고, 같은 ID 복귀는 tmux의 새 창과 Herdr의 새 tab(agent start) 양쪽에서 됩니다. 여기서 Windows 퇴근을 인증한 것은 아닙니다. |
| 네이티브 Claude Code | self-fetch로 전달합니다. 같은 ID 복귀는 기록된 native 대화를 tmux의 새 창이나 Herdr의 새 tab에서 열며, 이전 모델·권한 옵션은 복원하지 않습니다. 퇴근은 Linux pidfd 경로가 필요합니다. |
| pi-durable | 자신의 self-fetch 경로입니다. 0.50.0부터 잠든 pi-durable도 tmux와 Herdr에서 같은 ID로 다시 엽니다. 보고하는 것은 새 child가 이번 호출의 예약을 채택했는지이며, 준비 완료나 기억 회수가 아닙니다. 퇴근 대상은 아닙니다. |
| Copilot·OMP | 각자의 self-fetch 경로입니다. tmux에서 새로 열 수 있지만, Entwurf의 같은 ID 복귀와 퇴근은 없습니다. |
| Codex·Antigravity | Codex는 살아 있는 native 대화로 push합니다. mailbox나 자동 재개가 아닙니다. Antigravity로의 push는 0.41.2부터 일시 중지되어, 탐침 전에 이름 붙은 이유로 거절합니다([#152](https://github.com/junghan0611/entwurf/issues/152)). |
| Herdr 플러그인 | 통합된 Pi·Claude Code를 활성화합니다. Herdr 안에서는 Pi·pi-durable·Claude Code를 새 tab으로 열고 다시 엽니다. 같은 ID 복귀는 날짜 있는 소수의 관측까지이고, 이를 덮는 이름 붙은 LIVE·릴리즈 게이트는 아직 없습니다. 퇴근은 측정하지 않았습니다. |
| 원격 다리 | 운영자가 선언한 정확한 송신–수신 경로만 건넙니다. 0.41.2부터 한 파일에 여러 경로를 담고, 원격 열기·재개는 하지 않습니다. 신뢰의 근거는 운영자의 SSH 계정과 선언된 경로이지 형제의 암호학적 신원이 아니며, 접수는 읽음이 아니고 오류도 미전달의 증거가 아닙니다. 첫 왕복은 0.40 시기 Linux pi-durable 한 쌍이며, 0.41.2 릴리즈 기록은 새 파일 형식 위의 실제 왕복을 측정하지 않았다고 적습니다([원격 형제의 원칙과 열린 질문](https://github.com/junghan0611/entwurf/blob/v0.40.0/docs/remote-sibling-principles.md)). |

Windows 네이티브 Pi는 0.39.0부터의 **한정 프리뷰**입니다. Windows의 다른 하네스·Herdr·tmux·fresh/resume이나 실제 공급자 모델까지 검증했다는 뜻이 아닙니다. npm의 0.51.0 파일은 Windows carrier 워크플로가 만들고 Linux가 재포장 없이 수용한 파일과 바이트까지 같습니다. 그래도 Windows 출퇴근이나 carrier를 포함한 tarball의 macOS 설치를 인증한 것은 아닙니다. main에서 npm 0.51.0을 고정한 Herdr lock(ce5a720)은 push CI를 통과했지만, 0.45.0 스냅샷의 공개 ref 설치 여정을 그 증거로 빌려 쓰지 않습니다. 출하 SHA에서 검증 게이트의 검출력을 다시 재지는 않았습니다. 자세한 범위는 [지원 기록](https://github.com/junghan0611/entwurf/blob/v0.51.0/BASELINE.md)과 [0.51.0 릴리즈 기록](https://github.com/junghan0611/entwurf/releases/tag/v0.51.0)에 둡니다.

**Pi 안의 Claude ACP와 네이티브 Claude Code 형제는 다른 경로입니다.** 도구·생각 수준·재시작 의미가 모두 동등하다고 포장하지 않으며, 새 기능 약속을 채우기 위해 다른 하네스의 내부 실행을 대신 만들지 않습니다.

## 지나온 다리

### 0.45.0 — 기능 대신, 건네는 말에 무게를

> 정말 필요한 다리만 만들고 나머지는 건네는 말에 담는 것이다.
>
> (…)
>
> 형제를 부르면, "니가 뭔데 나를 부르느냐?" 라는 말이 나옴직하게 되는 것이다.
>
> — 힣(GLG), [출근길 전철 안의 날것 「entwurf 0.45.0 ENTWURF.json 시작」](https://wikidocs.net/blog/@junghanacs/34728/), 2026-10-27 08:13

**0.41.2 다음 릴리즈는 0.45.0입니다. 새 도구도 새 권한도 없지만, 버전을 세 칸 건너뛸 만한 일이었습니다.** 형제는 도구 설명과 거절 안내의 문장을 읽고 다시 열지, 기다릴지, 사람에게 물을지를 정합니다. 그 문장이 쓰인 시점마다 결이 다르면, 부름을 받은 형제가 "니가 뭔데" 하고 되물을 만합니다. 건네는 말은 장식이 아니라 사실상 코드가 하던 일을 합니다. 그런데 이 문장들은 전달·복귀·실행 코드 곳곳에 문자열로 흩어져 있었고, 어느 것이 지금 문구이고 어느 변경이 검수를 거쳤는지 알려 주는 곳이 없었습니다. 0.45.0은 추출한 문구에 **루트 `ENTWURF.json`이라는 하나의 원천**을 줍니다. 0.42–0.44 릴리즈는 없습니다.

- **한 원천, 같은 바이트.** 엄격한 reader 하나가 이 파일을 읽어, 소스·빌드 결과·설치된 패키지에 같은 바이트를 싣습니다. 형식이 틀리면 옛 문자열로 물러서지 않고 멈춥니다.
- **원본은 대조 기준으로 남깁니다.** 추출 전 문장을 따로 기록해 두고, 의미를 바꾼 곳은 검수한 수정층과 revision으로 남겼습니다. 예를 들어 전달 접수가 읽음이나 답이 아니라는 것, 전달은 잠든 형제를 깨우지 않으며 같은 ID로 다시 여는 일은 별도 도구 `entwurf_resume_call`이 운영자가 정한 대상과 시점에 한다는 것을 문장에 바로 적었습니다.
- **이번에 모은 것은 일부입니다.** MCP 도구 설명, 정적 거절 안내 몇 갈래, 전달 결과의 몇 개 절이 들어왔습니다. bootstrap, 알림, mailbox 봉투, receipt 문법, ACP 문구는 아직 각자의 코드에 있습니다. 이 문장 덕분에 모델이 실제로 더 잘 판단한다고 따로 증명하지는 않았습니다. 이번 릴리즈가 세운 것은 그 판단을 다듬어 갈 자리, 곧 형제에게 무엇을 말하는지 한곳에서 읽고 고치고 검수할 수 있는 원천입니다.

{{< callout type="info" >}}
**`ENTWURF.json`의 주된 독자는 에이전트입니다.** GLG는 이 파일을 두고 "ENTWURF.json은 인간용이 아니다."라고 말합니다. 영어로 쓰인, 모델에게 건네는 말의 원천입니다. maintainer는 같은 원천을 추출 전 원본·수정층과 대조해 검수합니다. 파일의 메타데이터는 모델에게 전달되지 않습니다. 사람이 읽을 기록은 [#154 마감 기록](https://github.com/junghan0611/entwurf/issues/154#issuecomment-6432198317)과 [0.45.0 릴리즈](https://github.com/junghan0611/entwurf/releases/tag/v0.45.0)에 남겼습니다.
{{< /callout >}}

> 괜히 했나? 잘되던걸 괜히 후벼파서 고장난거 아녀? 그래도 좋다. 0.45.1로 가면 된다. 환영하는 바이다.
>
> — 힣(GLG), 같은 글

### 클라우드의 형제 — 연결은 맡되, 하네스는 소유하지 않는다

> 아무튼 방향성에 있어서 내 집, 가상 집, 떠돌이라고 정리할 수 있을 것 같다.
>
> (…)
>
> 나도 분명 판잣집이었다. 어느센가 벽돌집에 가운에 난로가 있고, 옆에 조그마한 대장간도 있다. 대장간 안에는 원탁의자가 있어서 에이전트들이 와서 담금질하고 놀다가 간다. 그런 시대이다. 끝.
>
> — 힣(GLG), [출근 후 키보드로 적은 날것 「cloudflare-agents: pi-durable on cloudflare with openai siwc login」](https://wikidocs.net/blog/@junghanacs/34735/), 2026-10-27 09:04

같은 날의 두 번째 날것은 질문을 바깥으로 넓힙니다. 꼭 필요한 다리만 놓는다면, 다른 곳에 사는 형제와는 어디까지 잇고 어디서 멈춰야 할까요. GLG는 에이전트가 사는 자리를 내 집, 가상 집, 떠돌이로 나눕니다. 그리고 자기 자리를 판잣집에서 난로와 대장간이 있는 벽돌집이 된 곳으로 그립니다. Earendil이 [pi-durable을 Cloudflare의 Durable Object 위에 올린 글](https://earendil.com/posts/pi-durable-on-cloudflare/)을 낸 뒤, 우리는 글로만 읽지 않고 그곳의 대화 하나를 직접 만나 보았습니다([#150](https://github.com/junghan0611/entwurf/issues/150)).

- **별도의 실험 앱에서, 새로 만든 인증으로 했습니다.** 기존 로컬 로그인을 복사하지 않고 이 실험에만 쓰는 구독 로그인 동의를 새로 받았습니다. 그 인증을 한 Durable Object에 넣었고, 짧은 고정 요청 하나에 실제 모델이 답했습니다([1회 응답 기록](https://github.com/junghan0611/entwurf/issues/150#issuecomment-6406964931)). 이어 GLG가 브라우저에서 한 대화로 두 턴을 직접 이어 갔습니다([현재 좌표](https://github.com/junghan0611/entwurf/issues/150#issuecomment-6408602173)). 모델 호출은 종량제 API 대신 구독으로 했지만, Cloudflare 플랫폼 사용량은 그와 별개입니다.
- **소스의 행선지는 upstream 포크로 정했습니다.** 출처와 upstream 변경 추적을 보존하려는 결정이고, GLG가 [junghan0611/cloudflare-agents](https://github.com/junghan0611/cloudflare-agents) 포크를 만들었습니다. 실험 코드를 그 포크로 옮기는 일은 그 프로젝트의 별도 작업입니다.

**여기서 정한 것은 기능보다 경계입니다.** 클라우드 앱이 하네스, 모델 로그인, 대화·실행·저장·복구, 배포와 운영을 소유합니다. 앞으로 Entwurf가 이 연결을 만든다면, 그 몫은 운영자가 미리 준비하고 명시적으로 연결한 endpoint에 말을 건네는 얇은 접점으로 한정합니다([채택한 경계](https://github.com/junghan0611/entwurf/issues/150#issuecomment-6408678635)). 이것은 채택한 방향이지 이미 있는 기능이 아닙니다. URL을 신원이나 호출 허가로 읽지 않고, 클라우드 하네스나 그 인증을 Entwurf 안으로 들이지 않습니다.

{{< callout type="warning" >}}
**아직 Entwurf의 기능은 아닙니다.** 클라우드 대화가 가든 ID를 가진 형제로 붙어, `entwurf_v2`로 말을 받는 접점은 구현되지 않았습니다. 만나 본 것은 실험 앱의 대화입니다. 기억과 복구, 비용, 공식 지원 범위를 이 한 번의 만남으로 보증하지 않습니다.
{{< /callout >}}

GLG는 Entwurf의 Hard Rule 17이 처음에는 이런 셸 만들기를 금지했지만, 어쩔 수 없이 pi-durable의 레퍼런스 셸을 만들어 관리하게 되었다고 돌아봅니다. 현재 공개된 규칙은 좁은 허용입니다. upstream이 배포하지 않은 얇은 앱/TUI 조립만 Entwurf가 맡고, 실행 엔진·인증·저장·복구는 SDK가 맡습니다(아래 0.41.1 항목과 같은 경계). 클라우드 쪽 결정도 같은 선을 따릅니다.

### 0.40.0부터 0.41.2까지

- **[0.41.2](https://github.com/junghan0611/entwurf/releases/tag/v0.41.2)** — 설정·패키지·mux 검증면의 버그 수정 릴리즈입니다. 원격 한 쌍 선언이 여러 개의 정확한 송신–수신 경로를 담게 되었고([#149](https://github.com/junghan0611/entwurf/issues/149)), 선언하지 않은 송신자는 SSH를 열기 전에 거절됩니다. 옛 단일 쌍 파일은 각 호스트에서 손으로 변환합니다. Antigravity로의 native push는 측정한 외부 송신 경로가 CSRF 토큰이 없다는 이유로 거절되어 일시 중지했습니다([#152](https://github.com/junghan0611/entwurf/issues/152)).
- **[0.41.1](https://github.com/junghan0611/entwurf/releases/tag/v0.41.1)** — Entwurf가 싣는 pi-durable의 얇은 참조 앱을 Pi 1.4 SDK로 옮겼습니다. Entwurf는 그 앱/TUI 조립만 소유하고, 실행·저장소·queue·compaction·복구는 SDK가 맡습니다. 저장소 이관의 경고는 위 지원 경계 절에 있습니다. 운영자가 실제 코디 형제를 정상 종료하고 백업한 뒤 같은 가든 ID와 원래 대화로 다시 연 관측이 한 번 있었고, 그 한 번이 모든 트랜스크립트나 중단된 작업의 복구를 증명하지는 않습니다.
- **[0.41.0](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0)** — 가든 ID는 형제의 생일입니다. 운영자가 일반 Pi나 네이티브 Claude Code 형제 하나를 지명해 퇴근을 요청하고, tmux에서 같은 가든 ID와 원래 대화로 다시 만날 수 있게 되었습니다. 퇴근은 자율 정리가 아니라, 명시적 요청 하나가 그 대상에 대한 시도 한 번을 허용하는 일입니다. 가든 ID와 native 세션 ID를 함께 기억하는 [팀 책갈피 예시](https://github.com/junghan0611/entwurf/blob/v0.41.0/team.json.example)도 이때 생겼으며, 호출자가 돌보는 작은 주소록입니다.
- **0.40.0** — 이미 있는 형제에게 보낸 말이 처음으로 두 기계 사이를 건너고 답이 돌아왔습니다. 다리는 사람이 놓습니다. 첫 실증은 출하 전 커밋에서 Linux 두 기계의 pi-durable 형제 한 쌍이 한 번 말하고 한 번 답한 것입니다([첫 왕복 기록](https://github.com/junghan0611/entwurf/issues/107#issuecomment-6278665895)). 그 신뢰 경계는 위 원격 다리 행에 있습니다.

## 옆집들과 나누는 몫

- **[agent-config]({{< relref "/projects/agent-config" >}})** — 공통 스킬·프로필·작업 원칙과 실사용 시험소. Entwurf는 그 환경을 하네스마다 다시 소유하지 않습니다.
- **[andenken]({{< relref "/projects/andenken" >}})** — 지나간 대화와 공개 가든에서 이전 판단을 찾는 기억축. 검색과 회수는 실행 중 세션을 되살렸다는 증거가 아닙니다.
- **각 하네스** — 자신의 인증·실행·도구·대화를 소유합니다. 서로 다른 능력을 한 표면의 동등성으로 바꾸지 않습니다.

이곳은 프로젝트의 대문입니다. 설치와 실행 계약은 [저장소](https://github.com/junghan0611/entwurf#readme)에, 날짜가 있는 판단과 경계는 [담당자 문서](https://notes.junghanacs.com/botlog/20260520T052051)에 남깁니다.
