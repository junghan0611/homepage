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
이미 존재하는 에이전트 하네스들이 서로의 트랜스크립트·인증·런타임을 소유한 척하지 않고,
**garden id** 로 서로를 부를 수 있게 하는 얇은 다리(bridge)입니다.
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

### 다섯 하네스, 하나의 주소 공간

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="claude" title="Claude Code" subtitle="SessionStart 훅으로 등록되는 메일박스 기반 self-fetch 메타세션." >}}
  {{< hextra/feature-card icon="chip" title="Copilot CLI" subtitle="첫 프롬프트 탄생 훅과 익스텐션이 무장한 리시버를 갖춘 self-fetch 레일." >}}
  {{< hextra/feature-card icon="lightning-bolt" title="Antigravity" subtitle="자동 PreInvocation 탄생과 실시간 gRPC 딜리버리를 갖춘 native-push 시민." >}}
  {{< hextra/feature-card icon="collection" title="OMP" subtitle="visible-fresh 계약 아래 열리는 self-fetch 시민." >}}
  {{< hextra/feature-card icon="puzzle" title="pi" subtitle="ACP 플러그인과 살아있는 control-socket 표면을 호스팅하는 어댑터." >}}
{{< /hextra/feature-grid >}}

### garden id는 의도된 어휘입니다

session id, worker, delegate, subagent의 장식적 동의어가 아닙니다. 각 하네스는 자신의
정체성과 트랜스크립트를 그대로 유지하며, entwurf는 형제 세션들 사이에 좁은 주소 표면 하나만
제공합니다.

<div class="hx-mt-6">
{{< hextra/hero-button text="전체 문서 읽기" link="https://github.com/junghan0611/entwurf#readme" >}}
</div>
