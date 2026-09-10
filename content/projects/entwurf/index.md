---
title: "entwurf"
description: "Garden-citizen dispatch substrate — a thin bridge that lets already-existing agent harnesses address one another by garden id."
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
A thin bridge that lets already-existing agent harnesses address one another by **garden id** —
without pretending to own each other's transcript, auth, or runtime.
{{< /hextra/hero-subtitle >}}

<div class="hx-mt-6 hx-mb-6">
{{< hextra/hero-button text="View on GitHub" link="https://github.com/junghan0611/entwurf" >}}
</div>

## Quick start

```bash
npm install -g @junghanacs/entwurf

entwurf setup /path/to/your-project
entwurf check-bridge
```

`setup` composes every harness it finds on the host and reports each one PASS / SKIP / FAIL.

### How it dispatches

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card
        icon="share"
        title="entwurf_v2"
        subtitle="Canonical dispatch over an existing garden citizen — control-socket send, meta-mailbox enqueue, or native-push into a live conversation."
  >}}
  {{< hextra/feature-card
        icon="sparkles"
        title="entwurf_fresh_call"
        subtitle="Opens a NEW sibling session in the operator's tmux and learns its garden id from the callback it makes."
  >}}
  {{< hextra/feature-card
        icon="refresh"
        title="entwurf_resume_call"
        subtitle="Reopens a DORMANT citizen under its own garden id in a visible window, without running a hidden turn."
  >}}
{{< /hextra/feature-grid >}}

### Five harnesses, one address space

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="claude" title="Claude Code" subtitle="Mailbox-backed self-fetch meta-session, registered by a SessionStart hook." >}}
  {{< hextra/feature-card icon="chip" title="Copilot CLI" subtitle="Self-fetch rail with a first-prompt birth hook and an extension-armed receiver." >}}
  {{< hextra/feature-card icon="lightning-bolt" title="Antigravity" subtitle="Native-push citizen with automatic PreInvocation birth and live gRPC delivery." >}}
  {{< hextra/feature-card icon="collection" title="OMP" subtitle="Self-fetch citizen opened under the visible-fresh contract." >}}
  {{< hextra/feature-card icon="puzzle" title="pi" subtitle="Adapter that hosts the ACP plugin and the live control-socket surface." >}}
{{< /hextra/feature-grid >}}

### Garden id is deliberate vocabulary

Not a decorative synonym for session id, worker, delegate, or subagent. Each harness keeps
its own identity and transcript; entwurf supplies a narrow addressable surface between
siblings.

<div class="hx-mt-6">
{{< hextra/hero-button text="Read the full docs" link="https://github.com/junghan0611/entwurf#readme" >}}
</div>
