---
title: "entwurf"
description: "가든-시민 디스패치 기반 — 이미 존재하는 에이전트 하네스들이 서로의 트랜스크립트·인증·런타임을 소유한 척하지 않고 garden id로 서로를 부를 수 있게 하는 얇은 다리."
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
독립된 **pi**, **Claude Code**, **Codex**, **Copilot**, **OMP**, **Antigravity** 세션이
서로의 인증·도구·트랜스크립트를 빼앗지 않은 채 **garden id** 로 서로를 부를 수 있게 하는
얇은 다리(bridge)입니다.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0;">
{{< hextra/hero-button text="Herdr에서 시작하기" link="https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md#install" >}}
{{< hextra/hero-button text="GitHub에서 보기" link="https://github.com/junghan0611/entwurf" >}}
</div>

## 먼저 Herdr에서 시작하세요

{{< callout type="important" >}}
**이미 Herdr를 쓰고 있나요? 한 명령으로 Entwurf를 설치하세요.** 플러그인이 Herdr가 이미
통합한 **pi**와 **Claude Code** 세션에 Entwurf를 받아 활성화하고, 어느 시민이 워크벤치에
보이는지 알려 주는 읽기 전용 pane도 더합니다.
{{< /callout >}}

```bash
# 기존 Herdr 워크벤치에서 pi 및/또는 Claude Code를 통합한 뒤
herdr plugin install junghan0611/entwurf/plugins/herdr --yes

# Herdr pane에서 pi를 Entwurf 시민으로 시작
pi --entwurf-control
```

이는 이미 Herdr를 갖춘 경우의 짧은 경로입니다. Herdr ≥0.9.0, Node ≥24, npm, git, 네트워크와
각 하네스의 첫 실행·Herdr 통합은 여전히 필요합니다. 이 플러그인은 하네스·구독·로그인을
설치하지 않습니다. 한 번만 하면 되는 과정과 선택적인 상태 pane은 [Herdr 플러그인 README](https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md)에서 다룹니다.

## 직접 설치 — 더 넓은 표면

**Codex**, **Copilot**, **OMP**, **Antigravity**, **ACP**가 필요하거나 Herdr 밖에서 작업한다면
직접 설치 경로를 사용하세요.

```bash
npm install -g @junghanacs/entwurf

entwurf setup /path/to/your-project
entwurf pi
entwurf check-bridge
```

`setup` 한 번이면 호스트에 있는 모든 하네스를 찾아 구성하고 각각을 PASS / SKIP / FAIL 로 보고합니다.
`entwurf pi`는 pi를 control-socket 가든 시민으로 시작합니다. Herdr 통합은 현재 의도적으로
좁습니다. Herdr에 이미 통합된 pi와 Claude Code만 활성화합니다.
ACP, Codex, Copilot, OMP, Antigravity 또는 Herdr 밖 작업면은 Entwurf 직접 설치를 사용하세요.

### 디스패치 방식

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card
        icon="share"
        title="entwurf_v2"
        subtitle="이미 존재하는 가든 시민에게 보내는 정본 디스패치 — control-socket 전송, meta-mailbox 적재, 또는 살아있는 대화로의 native-push." >}}
  {{< hextra/feature-card
        icon="sparkles"
        title="entwurf_fresh_call"
        subtitle="운영자의 tmux 안에 새 분신 세션을 열고, 그 콜백으로부터 garden id를 알아냅니다." >}}
  {{< hextra/feature-card
        icon="refresh"
        title="entwurf_resume_call"
        subtitle="숨은 턴을 실행하지 않고, 잠든 시민을 자신의 garden id로 보이는 창에서 다시 엽니다." >}}
{{< /hextra/feature-grid >}}

### 여섯 하네스, 하나의 주소 공간

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="puzzle" title="pi" subtitle="살아있는 control-socket 표면을 갖는 가든 네이티브 세션." >}}
  {{< hextra/feature-card icon="claude" title="Claude Code" subtitle="자신의 인증·도구·트랜스크립트를 유지한 채 이어지는 독립 세션." >}}
  {{< hextra/feature-card icon="chip" title="Codex" subtitle="다른 가든 시민과 나란히 주소를 갖는 자신의 하네스 세션." >}}
  {{< hextra/feature-card icon="chip" title="Copilot CLI" subtitle="자신의 인증·도구·트랜스크립트를 유지한 채 이어지는 독립 세션." >}}
  {{< hextra/feature-card icon="collection" title="OMP" subtitle="자신의 런타임 경계를 지닌 보이는 형제 세션." >}}
  {{< hextra/feature-card icon="lightning-bolt" title="Antigravity" subtitle="실시간 native-push 딜리버리를 갖춘 독립 세션." >}}
{{< /hextra/feature-grid >}}

### Herdr는 워크벤치를, Entwurf는 주소를 맡습니다

Herdr 안에서 Entwurf는 통합된 **pi**·**Claude Code** 세션을 활성화하고, 선택적인 읽기 전용
상태 pane으로 그 시민의 보이는 위치를 알려 줍니다. 워크벤치는 Herdr가 소유하지만, Entwurf는
여섯 하네스 전체를 잇는 독립적인 가든 주소·딜리버리 층입니다. Herdr 전용 플러그인으로 축소되지
않습니다.

### garden id는 의도된 어휘입니다

session id, worker, delegate, subagent의 장식적 동의어가 아닙니다. 각 하네스는 자신의
정체성과 트랜스크립트를 그대로 유지하며, entwurf는 형제 세션들 사이에 좁은 주소 표면 하나만
제공합니다.

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="Entwurf README 읽기" link="https://github.com/junghan0611/entwurf#readme" >}}
{{< hextra/hero-button text="Herdr 플러그인 안내 읽기" link="https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md" >}}
</div>
