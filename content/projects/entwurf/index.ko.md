---
title: "entwurf"
description: "Herdr나 tmux에 보이는 형제 AI 세션을 열고, 잠든 pi 세션을 tmux에서 같은 garden id로 다시 열고, 독립된 에이전트 하네스들 사이에서 메시지를 주고받습니다."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://www.npmjs.com/package/@junghanacs/entwurf" >}}
  npm · @junghanacs/entwurf
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
entwurf
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
기본으로 **Herdr** 워크스페이스나 **tmux** 세션에 새 형제 세션을 열고, 잠든 **pi** 세션을 tmux에서
같은 **garden id**로 다시 열고, 이미 있는 형제 — **pi**, **pi-durable**, **Claude Code**, **Codex**, **Copilot**, **OMP**,
**Antigravity** — 에게 닿습니다. 서로의 인증·도구·트랜스크립트는 빼앗지 않습니다.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0;">
{{< hextra/hero-button text="Herdr에서 시작하기" link="https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md#quick-start" >}}
{{< hextra/hero-button text="GitHub에서 보기" link="https://github.com/junghan0611/entwurf" >}}
</div>

## 0.35.1 — ACP 레일의 Claude 5.5, 프롬프트 전에 되읽기

{{< callout type="info" >}}
**[Core v0.35.1](https://github.com/junghan0611/entwurf/releases/tag/v0.35.1)과
[Herdr 플러그인 0.35.1](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.13-herdr.0.35.1)이
발행됐습니다(2026-10-13).** 큐레이션한 Claude ACP 행이 **Opus 5.5**와 **Sonnet 5.5**(그리고 Fable 5.1)로
옮겨 갔고, Entwurf는 이제 요청을 믿는 대신 드라이버의 set-model 응답을 프롬프트 전에 되읽습니다.
Entwurf가 만드는 실행은 은퇴한 정확한 Claude 5 id를 pane이 열리기 전에 거절합니다. pi-durable은 읽은 뒤 낡은 inbox 알림을 거둬들이고(#140),
소스 checkout 메뉴는 이제 영어로 묻습니다. 플러그인은 실제 발행된 npm **0.35.1** 아티팩트를 측정한
레지스트리 무결성 pin으로 받습니다. 별도 스냅샷이며 core 릴리즈의 Latest도 그대로입니다.

core 전체 qualification BODY는 릴리즈 SHA에서 돌았습니다(956/956 claim kill). LIVE 릴리즈 게이트는
MUST 23 PASS / 0 FAIL이었고, native Codex는 이번 컷에서 이름 붙은 SKIP 하나로 제외했습니다.
그래서 표준 `--cut` 판정은 BLOCKED로 남았고, 이 컷 한정 예외는 운영자가 승인했습니다.
{{< /callout >}}

### 실제 Herdr 안에서, Pi ↔ 네이티브 Claude Code

`pi-shell-acp`에서 `entwurf`로 이름을 바꾼 0.12.0 이후 처음 새로 기록한 협업 데모입니다.
각자 자신의 하네스와 트랜스크립트를 유지한 두 형제가 garden id와 공식 Entwurf 동사로 만납니다.
이 GIF는 승인된 원본 그대로이며, 홈페이지용 재촬영이나 재렌더가 아닙니다.

<img src="/projects/entwurf/entwurf-demo.gif" width="1126" height="764" alt="실제 Herdr 작업면에서 Pi와 네이티브 Claude Code가 Entwurf로 협업하는 원본 데모" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.75rem;">

[데모 원본과 재현 경계](https://github.com/junghan0611/entwurf/blob/v0.35.0/demo/README.md) ·
[플러그인 0.35.1 설치·복구 수용 기록](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.13-herdr.0.35.1)

**보여 준 것과 아직 측정하지 않은 것을 구분합니다.** native Codex LIVE는 이번 컷의 명시적인
**미측정 예외**이며 PASS가 아닙니다. Sonnet 5.5는 게이트에서 실제 프롬프트 턴을 돌았고, Opus 5.5는 턴 없는
소켓 시민으로만 돌았으며, Fable 5.1은 프롬프트 턴 증거가 없습니다. 플러그인 BODY 생략이나 기존 영수증이
PASS를 대신하지 않습니다. headless 설치 검증도 실제 Herdr pane의 시민 행을 그린 관측과는 다릅니다.

## Herdr에서 시작하기

{{< callout type="important" >}}
**이미 Herdr를 쓰고 있나요? 한 명령으로 Entwurf를 설치하세요.** 플러그인이 Herdr가 이미
통합한 **pi**와 **Claude Code** 세션에 Entwurf를 받아 활성화하고, 어느 시민이 워크벤치에
보이는지 알려 주는 읽기 전용 pane도 더합니다.
{{< /callout >}}

```bash
# 기존 Herdr 워크벤치에서 pi 및/또는 Claude Code를 통합한 뒤
herdr plugin install junghan0611/entwurf/plugins/herdr --ref v2026.10.13-herdr.0.35.1 --yes

# Herdr pane에서 pi를 Entwurf 시민으로 시작
pi --entwurf-control
```

이미 Herdr를 갖춘 경우의 짧은 경로이며, 이제 발행한 플러그인 스냅샷에 고정합니다.
실제 공개 npm 설치 여정은 `main`이 스냅샷과 같은 **d0bc556**일 때 통과했습니다.
실제 npm 획득·compiled bridge·세 실행 bin·여덟 동사, 모델 턴 없는 Pi의 입학과 상태 읽기,
비활성화 뒤 설치 상태 파일 0개·재설치를 확인했습니다. 별도의 실제 npm 0.35.0→0.35.1
교체·하니스가 심은 중단 지점에서의 제품 복구도 통과했습니다.
태그 자체를 `--ref`로 사용한 설치는 아직 **미측정**이며 별도의 PASS로 주장하지 않습니다.
플러그인을 측정한 Herdr 본체는 **0.9.3**이고, 입학 하한은 **Herdr ≥0.9.0**으로 유지합니다.
Node ≥24, npm, git, 네트워크와 각 하네스의 첫 실행·Herdr 통합은 여전히 필요합니다.
이 플러그인은 하네스·구독·로그인을
설치하지 않습니다. 한 번만 하면 되는 과정과 선택적인 상태 pane은 [Herdr 플러그인 README](https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md)에서 다룹니다.

`herdr-checkout` 후보 설치에서 npm으로 소스를 바꾸려면 먼저 명시적인 certified deactivate가
필요합니다. 정상적으로 정착한 같은 npm 소스의 설치는 README의 소유권 조건에 따라 갱신할 수 있습니다.
플러그인은 `PATH`에 `entwurf` bin을 더하지 않으므로 가이드의
[설치된 절대 bin 경로로 제거](https://github.com/junghan0611/entwurf/blob/v2026.10.13-herdr.0.35.1/plugins/herdr/README.md#remove-it)를 따르세요.
인증되지 않은 옛 상태의 거부는 무조건 삭제하거나 마이그레이션해도 된다는 뜻이 아닙니다.

## 직접 설치 — 더 넓은 표면

managed **pi-durable**, 네이티브 **Codex**, **Copilot**, **OMP**, **Antigravity** 구성이 필요하거나
Herdr 밖에서 작업한다면 직접 설치 경로를 사용하세요.

```bash
npm install -g "@earendil-works/pi-coding-agent@>=1.1.0 <1.2"   # 일반 pi를 쓸 때만
npm install -g @junghanacs/entwurf@0.35.1

entwurf setup /path/to/your-project
entwurf pi
entwurf check-bridge
```

`setup` 한 번이면 호스트에 있는 모든 하네스를 찾아 구성하고 각각을 PASS / SKIP / FAIL 로 보고합니다.
`entwurf pi`는 pi를 control-socket 가든 시민으로 시작합니다. Herdr 통합은 현재 의도적으로
좁습니다. Herdr에 이미 통합된 pi와 Claude Code만 활성화합니다.

일반 Pi는 선택 사항이며 지원 범위는 `>=1.1.0 <1.2`입니다. Pi 1.1 built-in MCP로
다른 하네스와 같은 bridge를 부릅니다. 직접 설치의 **pi-durable** 경로는 고정한 업스트림
앱/TUI와 exact Pi **1.1.0** SDK 아홉 종을 싣습니다. 별도 런타임 checkout이나 일반 Pi CLI는
durable의 필수 설치가 아닙니다.

`entwurf pi-durable`은 패키지에 실린 네이티브 durable 앱을 엽니다. 선택적인
`--native-module <absolute file>` 또는 `--native-module-dir <absolute directory>`는 명시한
네이티브 확장만 싣습니다. 고전 Pi API shim이 아니며, 런타임·인증·queue·SQLite·transcript·recovery는
업스트림 소유로 남습니다.

직접 fresh-call은 **pi**, **Claude Code**, **Copilot**, **OMP**, **Codex**, managed **pi-durable**의
여섯 backend입니다. Herdr fresh-call과 플러그인 wiring은 여전히 **pi / Claude Code** 둘뿐입니다.
bare `--kind` 하나로 `entwurf pi-durable …`를 담을 수 없습니다.
[durable-on-Herdr pilot](https://github.com/junghan0611/entwurf/issues/132)은 아직 미측정입니다.
수동 native record/self-fetch → Herdr 감지 → GLG 판단 순서이며 wrapper나 fallback을 만들지 않습니다.
Antigravity의 기존 native-push delivery가 fresh-call 지원을 뜻하지는 않습니다.

### 열기, 다시 열기, 메시지

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card
        icon="sparkles"
        title="entwurf_fresh_call"
        subtitle="보이는 새 형제를 엽니다. Herdr 안에서는 호출자 워크스페이스의 새 tab(pi·Claude Code), 밖에서는 기본으로 호출자 tmux 세션의 새 창이고, 호출자가 명시한 기존 tmux 세션에 열 수도 있습니다. 콜백으로 garden id를 알아냅니다." >}}
  {{< hextra/feature-card
        icon="refresh"
        title="entwurf_resume_call"
        subtitle="숨은 턴을 실행하지 않고, 잠든 pi 시민을 자신의 garden id로 보이는 tmux 창에서 다시 엽니다." >}}
  {{< hextra/feature-card
        icon="share"
        title="entwurf_v2"
        subtitle="이미 있는 가든 시민에게 그 시민의 레일로 닿습니다 — control-socket 전송, meta-mailbox 적재, 또는 살아있는 대화로의 native-push. 전달은 프로세스를 시작하지 않습니다." >}}
{{< /hextra/feature-grid >}}

### 독립된 하네스들, 하나의 주소 공간

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="puzzle" title="pi" subtitle="살아있는 control-socket 표면을 갖고, Pi 1.1 built-in MCP로 같은 bridge를 부르는 가든 네이티브 세션." >}}
  {{< hextra/feature-card icon="puzzle" title="pi-durable" subtitle="garden identity와 명시적인 양방향 self-fetch를 더한 네이티브 durable 앱/TUI. 런타임과 저장소는 업스트림 소유로 남습니다." >}}
  {{< hextra/feature-card icon="claude" title="Claude Code" subtitle="자신의 인증·도구·트랜스크립트를 유지한 채 이어지는 독립 세션." >}}
  {{< hextra/feature-card icon="chip" title="Codex" subtitle="tmux에 보이게 열거나, native-push로 자신의 살아있는 스레드에서 닿는 자기 하네스 세션." >}}
  {{< hextra/feature-card icon="chip" title="Copilot CLI" subtitle="자신의 인증·도구·트랜스크립트를 유지한 채 이어지는 독립 세션." >}}
  {{< hextra/feature-card icon="collection" title="OMP" subtitle="자신의 런타임 경계를 지닌 보이는 형제 세션." >}}
  {{< hextra/feature-card icon="lightning-bolt" title="Antigravity" subtitle="실시간 native-push 딜리버리를 갖춘 독립 세션." >}}
{{< /hextra/feature-grid >}}

### Herdr는 워크벤치를, Entwurf는 형제를 열고 주소를 맡습니다

Herdr 안에서 Entwurf는 통합된 **pi**·**Claude Code** 세션을 활성화하고, 호출자 워크스페이스에 새
pi·Claude Code 형제를 tab으로 열며, 선택적인 읽기 전용 상태 pane으로 그 시민의 보이는 위치를
알려 줍니다. 워크벤치는 Herdr가 소유하지만, Entwurf는 이 하네스들을 잇는 독립적인 가든 주소·lifecycle·딜리버리 층입니다. Herdr 전용 플러그인으로 축소되지
않습니다.

### garden id는 의도된 어휘입니다

session id, worker, delegate, subagent의 장식적 동의어가 아닙니다. 각 하네스는 자신의
정체성과 트랜스크립트를 그대로 유지하며, entwurf는 형제 세션들 사이에 좁은 주소 표면 하나만
제공합니다.

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="Entwurf README 읽기" link="https://github.com/junghan0611/entwurf#readme" >}}
{{< hextra/hero-button text="Herdr 플러그인 안내 읽기" link="https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md" >}}
</div>
