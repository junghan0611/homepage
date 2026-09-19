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
A thin bridge that lets independent **pi**, **Claude Code**, **Codex**, **Copilot**, **OMP**, and
**Antigravity** sessions address one another by **garden id** — without taking over each other's
auth, tools, or transcript.
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

### Six harnesses, one address space

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="puzzle" title="pi" subtitle="Garden-native sessions with a live control-socket surface." >}}
  {{< hextra/feature-card icon="claude" title="Claude Code" subtitle="An independent session, connected without absorbing its auth, tools, or transcript." >}}
  {{< hextra/feature-card icon="chip" title="Codex" subtitle="Its own harness session, addressable alongside the other garden citizens." >}}
  {{< hextra/feature-card icon="chip" title="Copilot CLI" subtitle="An independent session, connected without absorbing its auth, tools, or transcript." >}}
  {{< hextra/feature-card icon="collection" title="OMP" subtitle="A visible sibling session with its own runtime boundary." >}}
  {{< hextra/feature-card icon="lightning-bolt" title="Antigravity" subtitle="An independent session with live native-push delivery." >}}
{{< /hextra/feature-grid >}}

### Herdr is an integration, not the boundary

Entwurf also has a Herdr workbench integration: it activates the **pi** and **Claude Code**
sessions that Herdr has integrated and provides a state pane showing their visible placement.
Herdr owns the workbench; Entwurf remains the independent garden-address and delivery layer for
all six harnesses.

### Garden id is deliberate vocabulary

Not a decorative synonym for session id, worker, delegate, or subagent. Each harness keeps
its own identity and transcript; entwurf supplies a narrow addressable surface between
siblings.

<div class="hx-mt-6">
{{< hextra/hero-button text="Read the full docs" link="https://github.com/junghan0611/entwurf#readme" >}}
</div>
