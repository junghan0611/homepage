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

## 0.35.1 — Claude 5.5 on the ACP rail, read back before the prompt

{{< callout type="info" >}}
**[Core v0.35.1](https://github.com/junghan0611/entwurf/releases/tag/v0.35.1) and
[Herdr plugin 0.35.1](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.13-herdr.0.35.1)
are published (2026-10-13).** The curated Claude ACP rows move to **Opus 5.5** and **Sonnet 5.5**
(plus Fable 5.1), and Entwurf now reads back the driver's set-model answer before the prompt instead
of trusting the request. Entwurf-built launches refuse the retired exact Claude 5 ids before opening a pane. pi-durable withdraws
stale inbox notices after a read (#140), and the source-checkout menu now asks in English. The plugin
acquires the actually published npm **0.35.1** artifact with its measured registry integrity pin; it
is a separate snapshot, and the core release stays Latest.

The core's whole qualification BODY ran at the release SHA (956/956 claims killed). The LIVE release
gate recorded MUST 23 PASS / 0 FAIL, with native Codex excluded for this cut as one named SKIP;
the standard `--cut` verdict therefore stayed BLOCKED, and the operator authorized that per-cut
exception.
{{< /callout >}}

### Inside real Herdr: Pi ↔ native Claude Code

The first newly recorded collaboration demo since the 0.12.0 rename from `pi-shell-acp` to `entwurf`.
Two siblings keep their own harnesses and transcripts, meeting through garden ids and official
Entwurf verbs. This is the approved original GIF, not a homepage retake or re-render.

<img src="/projects/entwurf/entwurf-demo.gif" width="1126" height="764" alt="Original demo of Pi and native Claude Code collaborating through Entwurf in the real Herdr workbench" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.75rem;">

[Original demo and reproducibility boundaries](https://github.com/junghan0611/entwurf/blob/v0.35.0/demo/README.md) ·
[Plugin 0.35.1 install and recovery acceptance](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.13-herdr.0.35.1)

**What was observed is not what remains unmeasured.** Native Codex LIVE is this cut's explicit
**unmeasured exception**, not a PASS. Sonnet 5.5 ran real prompt turns through the gate; Opus 5.5 ran
only as a turn-free socket citizen, and Fable 5.1 has no prompt-turn evidence. A skipped plugin BODY
or an older receipt cannot stand in for a PASS. Headless install evidence also does not certify a
citizen rendered as a row in a real Herdr pane.

## Start in Herdr

{{< callout type="important" >}}
**Already using Herdr? Install Entwurf with one command.** The plugin acquires and activates
Entwurf for the **pi** and **Claude Code** sessions that Herdr has already integrated, and adds a
read-only pane showing which citizens are visible in the workbench.
{{< /callout >}}

```bash
# From an existing Herdr workspace, after integrating pi and/or Claude Code
herdr plugin install junghan0611/entwurf/plugins/herdr --ref v2026.10.13-herdr.0.35.1 --yes

# Start pi as an Entwurf citizen in a Herdr pane
pi --entwurf-control
```

This is the short path for an existing Herdr setup, now pinned to the published plugin snapshot.
The public npm-install journey passed on `main` at **d0bc556**, the snapshot's commit:
real registry acquisition, compiled bridge, three executable bins, eight verbs, zero-turn Pi
admission and status reads, deactivation with zero install-state files, and reinstall. Separate
real-npm 0.35.0→0.35.1 swap and product recovery from a harness-seeded torn window also passed.
Installing with the tag itself as `--ref` remains **unmeasured**, not an additional claimed PASS.
The plugin is measured with **Herdr 0.9.3**; its admission floor remains **Herdr ≥0.9.0**.
Node ≥24, npm, git, network access, and a first run plus Herdr integration for each harness
are still required. The plugin
does not install a harness, subscription, or login. The [Herdr plugin README](https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md)
covers those one-time steps and the optional status pane.

Switching from a `herdr-checkout` candidate to npm requires an explicit certified deactivate first.
A settled same-source npm installation may update under the README's ownership conditions.
The plugin adds no `entwurf` bin to `PATH`. Follow the guide's
[absolute installed-bin inverse](https://github.com/junghan0611/entwurf/blob/v2026.10.13-herdr.0.35.1/plugins/herdr/README.md#remove-it).
Uncertified older state is refused, not permission for blind cleanup or migration.

## Direct setup — the broader surface

Need managed **pi-durable**, native **Codex**, **Copilot**, **OMP**, or **Antigravity** setup,
or are you working outside Herdr? Use the direct route:

```bash
npm install -g "@earendil-works/pi-coding-agent@>=1.1.0 <1.2"   # only if you use ordinary pi
npm install -g @junghanacs/entwurf@0.35.1

entwurf setup /path/to/your-project
entwurf pi
entwurf check-bridge
```

`setup` composes every harness it finds on the host and reports each one PASS / SKIP / FAIL.
`entwurf pi` starts pi as a control-socket garden citizen. Herdr integration is deliberately narrow
today: it activates only Herdr-integrated pi and Claude Code.

Ordinary Pi is optional, supported in `>=1.1.0 <1.2`, and calls the same bridge through
Pi 1.1 built-in MCP. The direct **pi-durable** route carries the pinned upstream app/TUI and
nine exact Pi **1.1.0** SDK members; a separate runtime checkout or ordinary Pi CLI is not
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
  {{< hextra/feature-card icon="puzzle" title="pi" subtitle="Garden-native sessions with a live control-socket surface, calling the same bridge through Pi 1.1's built-in MCP." >}}
  {{< hextra/feature-card icon="puzzle" title="pi-durable" subtitle="The supplied native durable app/TUI, with garden identity and explicit two-way self-fetch; its runtime and storage remain upstream-owned." >}}
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
