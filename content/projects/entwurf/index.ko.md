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

<div class="hx-mt-6 hx-mb-6">
{{< hextra/hero-button text="GitHub에서 보기" link="https://github.com/junghan0611/entwurf" >}}
</div>

## 빠른 시작

```bash
npm install -g @junghanacs/entwurf

entwurf setup /path/to/your-project
entwurf check-bridge
```

`setup` 한 번이면 호스트에 있는 모든 하네스를 찾아 구성하고 각각을 PASS / SKIP / FAIL 로 보고합니다.

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

### Herdr는 통합 지점이지 경계가 아닙니다

Entwurf에는 Herdr 워크벤치 통합도 있습니다. Herdr가 통합한 **pi**·**Claude Code** 세션을
활성화하고, 그 시민이 어느 pane에 보이는지 상태 pane으로 보여 줍니다. 워크벤치는 Herdr가
소유하지만, Entwurf는 여섯 하네스 전체를 잇는 독립적인 가든 주소·딜리버리 층으로 남습니다.

### garden id는 의도된 어휘입니다

session id, worker, delegate, subagent의 장식적 동의어가 아닙니다. 각 하네스는 자신의
정체성과 트랜스크립트를 그대로 유지하며, entwurf는 형제 세션들 사이에 좁은 주소 표면 하나만
제공합니다.

<div class="hx-mt-6">
{{< hextra/hero-button text="전체 문서 읽기" link="https://github.com/junghan0611/entwurf#readme" >}}
</div>
