---
title: "entwurf"
description: "Open visible sibling AI sessions in Herdr or tmux, reopen dormant pi sessions in tmux under the same garden id, and exchange messages across independent agent harnesses."
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
Open new sibling sessions in your **Herdr** workspace or **tmux** session by default, reopen a
dormant **pi** session in tmux under the same **garden id**, and reach any existing sibling — **pi**, **pi-durable**,
**Claude Code**, **Codex**, **Copilot**, **OMP**, **Antigravity** — without taking over its auth, tools,
or transcript.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0;">
{{< hextra/hero-button text="Start in Herdr" link="https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md#quick-start" >}}
{{< hextra/hero-button text="View on GitHub" link="https://github.com/junghan0611/entwurf" >}}
</div>

## 0.36.0 — pi-durable on Entwurf-owned source and Pi 1.2

{{< callout type="info" >}}
**[Core v0.36.0](https://github.com/junghan0611/entwurf/releases/tag/v0.36.0) (2026-10-13) and
[Herdr plugin 0.36.0](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.14-herdr.0.36.0)
(2026-10-14) are published.** The pi-durable app/TUI is now Entwurf-owned source emitted to its
carrier, on the nine published Pi **1.2.0** SDK members; the upstream SDK still owns execution,
auth, storage, transcripts and recovery. Ordinary Pi support moves to `>=1.2.0 <1.3`. The plugin
acquires the actually published npm **0.36.0** artifact with its measured registry integrity pin and
is measured with **Herdr 0.9.4**; it is a separate snapshot, and the core release stays Latest.

The core's release CI passed all four jobs and its whole qualification BODY (971/971 claims killed),
and the LIVE release gate passed `--cut` with MUST 24 PASS / 0 FAIL / 0 SKIP. The official exact-SHA
oracle refused that CI run's stale step metadata, and the operator accepted that one per-cut
exception; it is not an oracle PASS. The plugin snapshot's own CI passed the official oracle, with
the Herdr sandbox gate on Herdr 0.9.4 and 971/971 again.
{{< /callout >}}

### Inside real Herdr: Pi ↔ native Claude Code

The first newly recorded collaboration demo since the 0.12.0 rename from `pi-shell-acp` to `entwurf`.
Two siblings keep their own harnesses and transcripts, meeting through garden ids and official
Entwurf verbs. This is the approved original GIF, not a homepage retake or re-render.

<img src="/projects/entwurf/entwurf-demo.gif" width="1126" height="764" alt="Original demo of Pi and native Claude Code collaborating through Entwurf in the real Herdr workbench" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.75rem;">

[Original demo and reproducibility boundaries](https://github.com/junghan0611/entwurf/blob/v0.35.0/demo/README.md) ·
[Plugin 0.36.0 install, cross-ref reinstall and survival acceptance](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.14-herdr.0.36.0)

**What was observed is not what remains unmeasured.** The reinstall journey shows that a running Pi
session keeps its process, garden id and control socket across a version-changing reinstall, not that its MCP,
model or tool work continues. `pi update self`, a host Pi or Herdr upgrade, a `plugin update` that
finds a new commit, and installing with the new tag as `--ref` are unmeasured. An older receipt
cannot stand in for a PASS, and headless install evidence does not certify a citizen rendered as a
row in a real Herdr pane.

## Start in Herdr

{{< callout type="important" >}}
**Already using Herdr? Install Entwurf with one command.** The plugin acquires and activates
Entwurf for the **pi** and **Claude Code** sessions that Herdr has already integrated, and adds a
read-only pane showing which citizens are visible in the workbench.
{{< /callout >}}

```bash
# From an existing Herdr workspace, after integrating pi and/or Claude Code
herdr plugin install junghan0611/entwurf/plugins/herdr --ref v2026.10.14-herdr.0.36.0 --yes

# Start pi as an Entwurf citizen in a Herdr pane
pi --entwurf-control
```

This is the short path for an existing Herdr setup, now pinned to the published plugin snapshot.
On **Herdr 0.9.4** the public npm-install journey passed on `main` at **9f33dd1**, the snapshot's
commit: real registry acquisition, compiled bridge, three executable bins, eight verbs, zero-turn Pi
admission and status reads, deactivation with zero install-state files, and reinstall. A
version-changing cross-ref reinstall also passed: `herdr plugin install … --ref main` (9f33dd1) over the
`v2026.10.13-herdr.0.35.1` installation. `herdr plugin update` was measured only as an already-up-to-date
no-op. Because 0.35.1 accepts Pi `>=1.1.0 <1.2` and 0.36.0 accepts
`>=1.2.0 <1.3`, that reinstall crosses a Pi upgrade: the wiring stayed stable, a running Pi session kept
its process, garden id and control socket, and deactivation left no owned runtime, cache or ledger.
Installing with the tag itself as `--ref` remains **unmeasured**, not an additional claimed PASS.
The plugin is measured with **Herdr 0.9.4**; its admission floor remains **Herdr ≥0.9.0**.
Node ≥24, npm, git, network access, and a first run plus Herdr integration for each harness
are still required. The plugin
does not install a harness, subscription, or login. The [Herdr plugin README](https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md)
covers those one-time steps and the optional status pane.

Switching from a `herdr-checkout` candidate to npm requires an explicit certified deactivate first.
A settled same-source npm installation may update under the README's ownership conditions.
The plugin adds no `entwurf` bin to `PATH`. Follow the guide's
[absolute installed-bin inverse](https://github.com/junghan0611/entwurf/blob/v2026.10.14-herdr.0.36.0/plugins/herdr/README.md#remove-it).
Uncertified older state is refused, not permission for blind cleanup or migration.

## Direct setup — the broader surface

Need managed **pi-durable**, native **Codex**, **Copilot**, **OMP**, or **Antigravity** setup,
or are you working outside Herdr? Use the direct route:

```bash
npm install -g "@earendil-works/pi-coding-agent@>=1.2.0 <1.3"   # only if you use ordinary pi
npm install -g @junghanacs/entwurf@0.36.0

entwurf setup /path/to/your-project
entwurf pi
entwurf check-bridge
```

`setup` composes every harness it finds on the host and reports each one PASS / SKIP / FAIL.
`entwurf pi` starts pi as a control-socket garden citizen. Herdr integration is deliberately narrow
today: it activates only Herdr-integrated pi and Claude Code.

Ordinary Pi is optional, supported in `>=1.2.0 <1.3`, and calls the same bridge through
Pi's built-in MCP. The direct **pi-durable** route carries Entwurf's owned app/TUI carrier and
nine exact Pi **1.2.0** SDK members; a separate runtime checkout or ordinary Pi CLI is not
required for durable.

`entwurf pi-durable` opens the supplied native durable app. Optional `--native-module <absolute file>`
or `--native-module-dir <absolute directory>` loads explicitly named native extensions, not a classic
Pi API shim. Runtime, auth, queues, SQLite, transcripts and recovery remain upstream-owned.

Direct fresh-call supports six backends: **pi**, **Claude Code**, **Copilot**, **OMP**, **Codex**, and
managed **pi-durable**. Herdr fresh-call and plugin wiring remain **pi / Claude Code** only;
a bare `--kind` cannot carry `entwurf pi-durable …`. The
[durable-on-Herdr pilot](https://github.com/junghan0611/entwurf/issues/132) is still unmeasured:
manual native record/self-fetch, then Herdr detection, then GLG's judgment — no wrapper or fallback.
Antigravity's existing native-push delivery does not imply fresh-call support.

### Open, reopen, message

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card
        icon="sparkles"
        title="entwurf_fresh_call"
        subtitle="Opens a NEW visible sibling: a new unfocused tab in the caller's Herdr workspace (pi or Claude Code), or outside Herdr a new window in the caller's tmux session by default, or in another existing tmux session the caller names; learns its garden id from its callback."
  >}}
  {{< hextra/feature-card
        icon="refresh"
        title="entwurf_resume_call"
        subtitle="Reopens a DORMANT pi citizen under its own garden id in a visible tmux window, without running a hidden turn."
  >}}
  {{< hextra/feature-card
        icon="share"
        title="entwurf_v2"
        subtitle="Reaches an existing garden citizen over its own rail — control-socket send, meta-mailbox enqueue, or native-push into a live conversation. Delivery starts no process."
  >}}
{{< /hextra/feature-grid >}}

### Independent harnesses, one address space

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="puzzle" title="pi" subtitle="Garden-native sessions with a live control-socket surface, calling the same bridge through Pi's built-in MCP." >}}
  {{< hextra/feature-card icon="puzzle" title="pi-durable" subtitle="Entwurf's owned durable app/TUI on the upstream SDK, with garden identity and explicit two-way self-fetch; its execution engine and storage remain upstream-owned." >}}
  {{< hextra/feature-card icon="claude" title="Claude Code" subtitle="An independent session, connected without absorbing its auth, tools, or transcript." >}}
  {{< hextra/feature-card icon="chip" title="Codex" subtitle="Its own harness session, opened visibly in tmux or reached in its live thread through native push." >}}
  {{< hextra/feature-card icon="chip" title="Copilot CLI" subtitle="An independent session, connected without absorbing its auth, tools, or transcript." >}}
  {{< hextra/feature-card icon="collection" title="OMP" subtitle="A visible sibling session with its own runtime boundary." >}}
  {{< hextra/feature-card icon="lightning-bolt" title="Antigravity" subtitle="An independent session with live native-push delivery." >}}
{{< /hextra/feature-grid >}}

### Herdr brings the workbench; Entwurf opens and addresses the siblings

Inside Herdr, Entwurf activates the integrated **pi** and **Claude Code** sessions, opens new pi and
Claude Code siblings as tabs in the caller's workspace, and its optional read-only status pane shows
their visible placement. Herdr owns the workbench; Entwurf remains the independent garden-address,
lifecycle and delivery layer across these harnesses — not a Herdr-only plugin.

### Garden id is deliberate vocabulary

Not a decorative synonym for session id, worker, delegate, or subagent. Each harness keeps
its own identity and transcript; entwurf supplies a narrow addressable surface between
siblings.

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="Read the Entwurf README" link="https://github.com/junghan0611/entwurf#readme" >}}
{{< hextra/hero-button text="Read the Herdr plugin guide" link="https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md" >}}
</div>
