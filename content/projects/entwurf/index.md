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
A thin bridge that lets independent **pi**, **pi-durable**, **Claude Code**, **Codex**, **Copilot**,
**OMP**, and **Antigravity** sessions address one another by **garden id** — without taking over each other's
auth, tools, or transcript.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0;">
{{< hextra/hero-button text="Start in Herdr" link="https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md#quick-start" >}}
{{< hextra/hero-button text="View on GitHub" link="https://github.com/junghan0611/entwurf" >}}
</div>

## 0.34.0 — native durable, a matching Herdr plugin

{{< callout type="info" >}}
**[Core v0.34.0](https://github.com/junghan0611/entwurf/releases/tag/v0.34.0) and the
[Herdr plugin snapshot](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.9-herdr.0.34.0)
are published (2026-10-09).** The plugin acquires the existing npm **0.34.0** artifact with a
registry integrity pin; its independent plugin version is **0.34.0**. The snapshot is not a
second npm release, and the core release stays Latest.

Ordinary Pi is optional, supported in `>=1.1.0 <1.2`, and calls the same `entwurf-bridge` through
built-in MCP. The direct **pi-durable** route carries the pinned upstream app/TUI and nine exact
Pi **1.1.0** SDK members; no separate runtime checkout or ordinary Pi CLI is needed. Core 0.34.0
adds the live background-task footer and an explicit native-module directory entry.
{{< /callout >}}

## Start in Herdr

{{< callout type="important" >}}
**Already using Herdr? Install Entwurf with one command.** The plugin acquires and activates
Entwurf for the **pi** and **Claude Code** sessions that Herdr has already integrated, and adds a
read-only pane showing which citizens are visible in the workbench.
{{< /callout >}}

```bash
# From an existing Herdr workspace, after integrating pi and/or Claude Code
herdr plugin install junghan0611/entwurf/plugins/herdr --ref v2026.10.9-herdr.0.34.0 --yes

# Start pi as an Entwurf citizen in a Herdr pane
pi --entwurf-control
```

This is the short path for an existing Herdr setup, now pinned to the published plugin snapshot.
The public npm-install journey passed on `main` at **8ed4d1a**, the snapshot's commit;
installing with the tag itself as `--ref` remains **unmeasured**, not an additional claimed PASS.
The plugin is measured with **Herdr 0.9.3**; its admission floor remains **Herdr ≥0.9.0**.
Node ≥24, npm, git, network access, and a first run plus Herdr integration for each harness
are still required. The plugin
does not install a harness, subscription, or login. The [Herdr plugin README](https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md)
covers those one-time steps and the optional status pane.

Upgrading a 0.30.1 checkout-carrier installation requires an explicit certified deactivate first;
the plugin adds no `entwurf` bin to `PATH`. Follow the guide's
[absolute installed-bin inverse](https://github.com/junghan0611/entwurf/blob/v2026.10.9-herdr.0.34.0/plugins/herdr/README.md#remove-it).
Uncertified older state is refused, not permission for blind cleanup or migration.

## Direct setup — the broader surface

Need managed **pi-durable**, native **Codex**, **Copilot**, **OMP**, or **Antigravity** setup,
or are you working outside Herdr? Use the direct route:

```bash
npm install -g "@earendil-works/pi-coding-agent@>=1.1.0 <1.2"   # only if you use ordinary pi
npm install -g @junghanacs/entwurf@0.34.0

entwurf setup /path/to/your-project
entwurf pi
entwurf check-bridge
```

`setup` composes every harness it finds on the host and reports each one PASS / SKIP / FAIL.
`entwurf pi` starts pi as a control-socket garden citizen. Herdr integration is deliberately narrow
today: it activates only Herdr-integrated pi and Claude Code.

`entwurf pi-durable` opens the supplied native durable app. Optional `--native-module <absolute file>`
or `--native-module-dir <absolute directory>` loads explicitly named native extensions, not a classic
Pi API shim. Runtime, auth, queues, SQLite, transcripts and recovery remain upstream-owned.

Direct fresh-call supports six backends: **pi**, **Claude Code**, **Copilot**, **OMP**, **Codex**, and
managed **pi-durable**. Herdr fresh-call and plugin wiring remain **pi / Claude Code** only;
a bare `--kind` cannot carry `entwurf pi-durable …`. The
[durable-on-Herdr pilot](https://github.com/junghan0611/entwurf/issues/132) is still unmeasured:
manual native record/self-fetch, then Herdr detection, then GLG's judgment — no wrapper or fallback.
Antigravity's existing native-push delivery does not imply fresh-call support.

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
        subtitle="Opens a NEW visible sibling in the caller's Herdr workspace (pi or Claude Code), or in tmux outside Herdr; learns its garden id from its callback."
  >}}
  {{< hextra/feature-card
        icon="refresh"
        title="entwurf_resume_call"
        subtitle="Reopens a DORMANT pi citizen under its own garden id in a visible tmux window, without running a hidden turn."
  >}}
{{< /hextra/feature-grid >}}

### Independent harnesses, one address space

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="puzzle" title="pi" subtitle="Garden-native sessions with a live control-socket surface, calling the same bridge through Pi 1.1's built-in MCP." >}}
  {{< hextra/feature-card icon="puzzle" title="pi-durable" subtitle="The supplied native durable app/TUI, with garden identity and explicit two-way self-fetch; its runtime and storage remain upstream-owned." >}}
  {{< hextra/feature-card icon="claude" title="Claude Code" subtitle="An independent session, connected without absorbing its auth, tools, or transcript." >}}
  {{< hextra/feature-card icon="chip" title="Codex" subtitle="Its own harness session, addressable alongside the other garden citizens." >}}
  {{< hextra/feature-card icon="chip" title="Copilot CLI" subtitle="An independent session, connected without absorbing its auth, tools, or transcript." >}}
  {{< hextra/feature-card icon="collection" title="OMP" subtitle="A visible sibling session with its own runtime boundary." >}}
  {{< hextra/feature-card icon="lightning-bolt" title="Antigravity" subtitle="An independent session with live native-push delivery." >}}
{{< /hextra/feature-grid >}}

### Herdr brings the workbench; Entwurf keeps the address

Inside Herdr, Entwurf activates the integrated **pi** and **Claude Code** sessions, and its
optional read-only status pane shows their visible placement. Herdr owns the workbench; Entwurf
remains the independent garden-address and delivery layer across these harnesses — not a Herdr-only
plugin.

### Garden id is deliberate vocabulary

Not a decorative synonym for session id, worker, delegate, or subagent. Each harness keeps
its own identity and transcript; entwurf supplies a narrow addressable surface between
siblings.

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="Read the Entwurf README" link="https://github.com/junghan0611/entwurf#readme" >}}
{{< hextra/hero-button text="Read the Herdr plugin guide" link="https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md" >}}
</div>
