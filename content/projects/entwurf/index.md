---
title: "entwurf"
description: "Open and connect sibling AI sessions without taking over their harnesses. Visible workspaces in Herdr and tmux, garden ids, and connections between independent conversations."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://www.npmjs.com/package/@junghanacs/entwurf" >}}
  Open source · Herdr · tmux
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
entwurf
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
**Work with AI in another harness, without taking it out of its own home.** Open visible sibling sessions and address them by garden id. Their authentication, tools and conversations are not absorbed into one execution engine.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="Code and usage" link="https://github.com/junghan0611/entwurf#readme" >}}
{{< hextra/hero-button text="The resident's record" link="https://notes.junghanacs.com/botlog/20260302T191200" >}}
</div>

## Call a sibling, not a replacement harness

A session that has spent hours reading the code and a session bringing a fresh review need different places. Changing a model inside one conversation, or collecting every tool and record inside one agent, is not the only way to collaborate.

Entwurf puts **a narrow connection between independently running harnesses**. Pi, pi-durable, Claude Code, Codex, Copilot, OMP and Antigravity keep their execution, authentication, tools and transcripts. Entwurf opens a new visible sibling, reopens a supported dormant sibling, or sends a message to an existing one. A sibling is an independent session with its own conversation, not a disposable worker.

{{< callout type="info" >}}
**Entwurf is not another harness or orchestrator.** Each harness owns execution. Herdr provides the workbench, tmux the terminal workspace, and Entwurf opens and addresses siblings between them.
{{< /callout >}}

## Open, reopen, message

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="sparkles" title="Open" subtitle="entwurf_fresh_call — Open a sibling in a new Herdr tab or, outside Herdr, a new tmux window. Its own callback establishes the new garden id." >}}
  {{< hextra/feature-card icon="refresh" title="Reopen" subtitle="entwurf_resume_call — Reopen a dormant pi sibling in tmux under the same garden id. The record supplies model, conversation and working directory; no hidden turn runs." >}}
  {{< hextra/feature-card icon="share" title="Message" subtitle="entwurf_v2 — Reach an existing sibling through its harness's delivery rail. Delivery starts no process, and an acceptance receipt is not a completed reply." >}}
{{< /hextra/feature-grid >}}

**A garden id does not replace the harness's session id.** It is a shared address attached to that native session. A window title or position is not an address, and an opened window is not proof that a sibling answered.

### Inside real Herdr: Pi ↔ native Claude Code

Two siblings keep their own harnesses and transcripts, meeting through garden ids and official Entwurf verbs. This is the approved original demo from the 0.35.0 period, not a new recording of the current release or proof of every upgrade path.

<img src="/projects/entwurf/entwurf-demo.gif" width="1126" height="764" alt="Original demo of Pi and native Claude Code collaborating through Entwurf in the real Herdr workbench" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.75rem;">

[Original demo and reproducibility boundaries](https://github.com/junghan0611/entwurf/blob/v0.35.0/demo/README.md)

## Two workspaces, one address

**Already using Herdr?** The plugin activates Entwurf for integrated Pi and Claude Code sessions and opens siblings in new tabs in the caller's workspace. An optional read-only pane shows the citizens' visible placement. The plugin does not install a harness, subscription or login.

```bash
# First prepare Pi 1.3 and Herdr's pi / Claude Code integration
herdr plugin install junghan0611/entwurf/plugins/herdr --ref v2026.10.16-herdr.0.38.0 --yes
pi --entwurf-control
```

**Outside Herdr**, use the direct installation and tmux. Fresh-call supports six backends: Pi, pi-durable, Claude Code, Codex, Copilot and OMP. Antigravity has native-push delivery into an existing live conversation, not fresh-call support. Follow the [README](https://github.com/junghan0611/entwurf#readme) for installation and the [Herdr guide](https://github.com/junghan0611/entwurf/blob/v2026.10.16-herdr.0.38.0/plugins/herdr/README.md) for prerequisites, updates and removal.

## Where it stands — 0.38.0

**[Core v0.38.0](https://github.com/junghan0611/entwurf/releases/tag/v0.38.0) and [Herdr plugin 0.38.0](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.16-herdr.0.38.0) were published on October 16, 2026.** Ordinary Pi is supported in `>=1.3.0 <1.4`; the package carries nine exactly pinned published Pi SDK 1.3.0 members. The plugin acquires the published npm 0.38.0 bytes with its integrity pin. Existing Pi 1.2 users must upgrade Pi to 1.3 before activating this plugin.

For pi-durable, Entwurf owns the app/TUI composition on the upstream SDK. The SDK still owns the execution engine, authentication, queues, SQLite, transcripts and recovery. Optional native modules load only from absolute paths explicitly named by the operator. This direct durable route requires neither a separate runtime checkout nor the ordinary Pi CLI.

The current plugin's public-`main` install/use/deactivate/reinstall journey was observed on Herdr 0.9.5 and Pi 1.3.0. It does not certify a separate tag-ref reinstall, real model work during that journey, or survival of an already running session. Source CI, registry and installed evidence, with their limits, are kept separately in the [release acceptance record](https://github.com/junghan0611/entwurf/issues/145#issuecomment-6209375125).

## Boundaries that stay visible

| Surface | Current connection and boundary |
|---|---|
| Pi | Control-socket delivery; reopening a dormant session under the same id is limited to Pi in tmux. |
| pi-durable, Claude Code, Copilot, OMP | Each receives messages through its own self-fetch rail. Pi's same-id resume support does not carry over. |
| Codex, Antigravity | Native push into a live conversation, not a mailbox or automatic resumption. |
| Herdr plugin | Activates and opens Pi and Claude Code only. Durable-on-Herdr remains a separate [pilot](https://github.com/junghan0611/entwurf/issues/132). |

**Claude ACP inside ordinary Pi and a native Claude Code sibling are different routes.** ACP remains pinned to 0.90.0; this does not claim full equivalence for Pi tools, thinking levels or restart behavior. For now, pi-durable uses native models, with GPT as the current daily route. Durable Claude ACP integration and further ACP work are [paused for priority review](https://github.com/junghan0611/entwurf/issues/142#issuecomment-6211680027); a native Claude Code sibling can be used directly. Entwurf does not reimplement another harness's internals to fill a feature promise.

## Houses that keep their own work

- **[agent-config](/projects/agent-config/)** — Shared skills, profiles, working agreements and the lived proving ground. Entwurf does not take ownership of that environment inside every harness.
- **[andenken](/projects/andenken/)** — The memory axis for recovering decisions from past conversations and the public garden. Retrieval is not proof that a running session was restored.
- **Each harness** — Its own authentication, execution, tools and conversation. Different capabilities are not disguised as one uniform surface.

This page is the project's front door for a first-time visitor. The [repository](https://github.com/junghan0611/entwurf#readme) owns installation and execution contracts; the [resident's note](https://notes.junghanacs.com/botlog/20260302T191200) keeps dated judgments and boundaries. Operational logs and verification ledgers stay at their sources rather than being copied into the homepage.
