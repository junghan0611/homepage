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

<div class="hx-mt-10 hx-mb-10">
{{< hextra/hero-button text="Start in Herdr" link="https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md#install" >}}
{{< hextra/hero-button text="View on GitHub" link="https://github.com/junghan0611/entwurf" >}}
</div>

## Start here: Herdr

{{< callout type="important" >}}
**Already using Herdr? Install Entwurf with one command.** The plugin acquires and activates
Entwurf for the **pi** and **Claude Code** sessions that Herdr has already integrated, and adds a
read-only pane showing which citizens are visible in the workbench.
{{< /callout >}}

```bash
# From an existing Herdr workspace, after integrating pi and/or Claude Code
herdr plugin install junghan0611/entwurf/plugins/herdr --yes

# Start pi as an Entwurf citizen in a Herdr pane
pi --entwurf-control
```

This is the short path for an existing Herdr setup — it still requires Herdr ≥0.9.0, Node ≥24,
npm, git, network access, and a first run plus Herdr integration for each harness. The plugin
does not install a harness, subscription, or login. The [Herdr plugin README](https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md)
covers those one-time steps and the optional status pane.

## Direct setup — the broader surface

Need **Codex**, **Copilot**, **OMP**, **Antigravity**, or **ACP** setup, or are you working
outside Herdr? Use the direct route:

```bash
npm install -g @junghanacs/entwurf

entwurf setup /path/to/your-project
entwurf pi
entwurf check-bridge
```

`setup` composes every harness it finds on the host and reports each one PASS / SKIP / FAIL.
`entwurf pi` starts pi as a control-socket garden citizen. Herdr integration is deliberately narrow
today: it activates only Herdr-integrated pi and Claude
Code. For ACP, Codex, Copilot, OMP, Antigravity, or a non-Herdr workspace, use Entwurf’s direct
install.

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

### Herdr brings the workbench; Entwurf keeps the address

Inside Herdr, Entwurf activates the integrated **pi** and **Claude Code** sessions, and its
optional read-only status pane shows their visible placement. Herdr owns the workbench; Entwurf
remains the independent garden-address and delivery layer for all six harnesses — not a Herdr-only
plugin.

### Garden id is deliberate vocabulary

Not a decorative synonym for session id, worker, delegate, or subagent. Each harness keeps
its own identity and transcript; entwurf supplies a narrow addressable surface between
siblings.

<div class="hx-mt-10 hx-mb-10">
{{< hextra/hero-button text="Read the Entwurf README" link="https://github.com/junghan0611/entwurf#readme" >}}
{{< hextra/hero-button text="Read the Herdr plugin guide" link="https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md" >}}
</div>
