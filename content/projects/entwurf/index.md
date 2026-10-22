---
title: "entwurf"
description: "Long-lived AI siblings, each keeping its own harness and conversation. Entwurf 0.41.0 adds operator-requested retirement and same-id return for Pi and native Claude Code."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/entwurf/releases/tag/v0.41.0" >}}
  v0.41.0 · A sibling can rest and return
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
{{< hextra/hero-button text="The resident's record" link="https://notes.junghanacs.com/botlog/20260520T052051" >}}
</div>

## Call a sibling, not a replacement harness

A session that has spent hours reading the code and a session bringing a fresh review need different places. Changing a model inside one conversation, or collecting every tool and record inside one agent, is not the only way to collaborate.

Entwurf puts **a narrow connection between independently running harnesses**. Pi, pi-durable, Claude Code, Codex, Copilot, OMP and Antigravity keep their execution, authentication, tools and transcripts. A sibling is an independent session with its own conversation, not a disposable worker. Different capabilities do not make a hierarchy of siblings.

{{< callout type="info" >}}
**Entwurf is not another harness or orchestrator.** Each harness owns execution. Herdr provides the workbench, tmux the terminal workspace, and Entwurf opens and addresses siblings between them.
{{< /callout >}}

## 0.41.0 — a birthday, not a disposable session

**A garden id is a sibling's birthday: resting does not mean starting over.** With [0.41.0](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0), the human operator can request a guarded retirement of an ordinary Pi or native Claude Code sibling, then reopen its own native conversation under the same garden id in tmux. The record and transcript remain; the next meeting is not a replacement session reconstructed by Entwurf.

**A sibling is not a job title.** The coordinating sibling is a sibling too. We agree on the work with the person and invite whichever sibling can help—not a permanent developer, reviewer or adviser assigned at birth. The fictional [team bookmark example](https://github.com/junghan0611/entwurf/blob/v0.41.0/team.json.example) keeps both garden and native session ids. It is a caller-maintained memory aid, not runtime configuration, an authority registry or an automatic team manager.

Retirement is never autonomous. One explicit operator request permits one guarded attempt, not a roster sweep or a retry after an unknown result. A Pi shutdown acknowledgement is not proof of exit; Claude Code retirement concerns one verified Linux process, not all its descendants or guaranteed transcript flushing. One real retire-and-return round trip per backend was measured at an earlier candidate, with blind recall; that dated observation is not a claim for every harness or platform. The [release acceptance record](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0) keeps those boundaries visible.

### The earlier crossing — 0.40.0

**A message to an existing sibling crossed between two machines, and an answer came back.** 0.40.0 carries that first exchange. A person lays the bridge: the operator connects the machines, owns SSH authentication, and declares which pair may talk. The remote route crosses only that bridge. It does not discover siblings, open them remotely, or resend because an answer has not arrived.

The first trial was **one pair of already-open pi-durable siblings on two Linux machines**. One message, one reply, at a pre-release commit—not a new measurement at the shipped SHA or remote certification for every harness and platform ([first exchange](https://github.com/junghan0611/entwurf/issues/107#issuecomment-6278665895)).

{{< callout type="info" >}}
**Crossing is not the same as having all the answers.** How do we distinguish a connection, the sibling sending a message, and trust in its content? Does visible-first survive the machine boundary? How much can a sender know about acceptance, a read, or a reply?
{{< /callout >}}

Today's boundary is the operator's SSH account and a declared pair, not cryptographic identity for a sibling. A person keeps visible-first by holding the sessions open; the code does not prove that a screen is visible. Acceptance is not a read, and an error is not proof of non-delivery. Instead of presenting these questions as solved, the release carries [principles and open questions for remote siblings](https://github.com/junghan0611/entwurf/blob/v0.40.0/docs/remote-sibling-principles.md).

## Open, message, rest, return

{{< hextra/feature-grid cols="2" >}}
  {{< hextra/feature-card icon="sparkles" title="Open" subtitle="entwurf_fresh_call — Open a sibling in a new Herdr tab or, outside Herdr, a new tmux window. Its own callback establishes the new garden id." >}}
  {{< hextra/feature-card icon="share" title="Message" subtitle="entwurf_v2 — Reach an existing sibling through its harness's delivery rail. Delivery launches no runtime; acceptance is not a completed reply." >}}
  {{< hextra/feature-card icon="shield-check" title="Rest" subtitle="entwurf_retire_call — Attempt retirement of one ordinary Pi or native Claude Code sibling explicitly named by the operator. Action, event recording and lock release have separate results." >}}
  {{< hextra/feature-card icon="refresh" title="Return" subtitle="entwurf_resume_call — Reopen a dormant Pi or Claude Code conversation in tmux under its own garden id. Its record selects the native conversation; the verb submits no prompt." >}}
{{< /hextra/feature-grid >}}

**A garden id does not replace the harness's session id.** It is a shared address attached to that native session. A window title or position is not an address, and an opened window is not proof that a sibling answered.

### Inside real Herdr: Pi ↔ native Claude Code

Two siblings keep their own harnesses and transcripts, meeting through garden ids and official Entwurf verbs. This is the **original demo from the 0.35.0 period**, not a new recording of the two-machine crossing or proof of every upgrade path.

<img src="/projects/entwurf/entwurf-demo.gif" width="1126" height="764" alt="Original demo of Pi and native Claude Code collaborating through Entwurf in the real Herdr workbench" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.75rem;">

[Original demo and reproducibility boundaries](https://github.com/junghan0611/entwurf/blob/v0.35.0/demo/README.md)

## Two workspaces, one address

**Already using Herdr?** The plugin activates Entwurf for integrated Pi and Claude Code sessions and opens siblings in new tabs in the caller's workspace. An optional read-only pane shows the citizens' visible placement. The plugin does not install a harness, subscription or login.

```bash
# First prepare Pi 1.3 and Herdr's pi / Claude Code integration
herdr plugin install junghan0611/entwurf/plugins/herdr --ref v2026.10.20-herdr.0.40.0 --yes
pi --entwurf-control
```

**Outside Herdr**, use the direct installation and tmux. Fresh-call supports six backends: Pi, pi-durable, Claude Code, Codex, Copilot and OMP. Antigravity has native-push delivery into an existing live conversation, not fresh-call support. Follow the [README](https://github.com/junghan0611/entwurf#readme) for installation and the [Herdr guide](https://github.com/junghan0611/entwurf/blob/v2026.10.20-herdr.0.40.0/plugins/herdr/README.md) for prerequisites, updates and removal.

## Current releases and boundaries

**As of October 22, 2026, [core v0.41.0 is released on GitHub](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0) and [published to npm](https://www.npmjs.com/package/@junghanacs/entwurf/v/0.41.0).** A new Herdr snapshot is still pending. The pinned [Herdr plugin 0.40.0](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.20-herdr.0.40.0) above still acquires npm 0.40.0, not 0.41.0's new lifecycle features. Ordinary Pi support remains `>=1.3.0 <1.4`; Claude Code same-id return requires `>=2.1.306`. For pi-durable, the upstream SDK still owns execution, authentication, queues, SQLite, transcripts and recovery.

| Surface | Connection and boundary |
|---|---|
| Pi | Unix control sockets on non-Windows; named pipes in the bounded Windows preview. Operator-requested retirement and same-id return in tmux; Windows retirement is not certified here. |
| Native Claude Code | Self-fetch delivery. Same-id return in tmux uses the recorded native conversation; retirement requires the Linux pidfd path. Former model and permission options are not restored. |
| pi-durable, Copilot, OMP | Their own self-fetch rails. pi-durable can call retirement and return for supported siblings, but is not itself a lifecycle target. Copilot and OMP have no Entwurf same-id return. |
| Codex, Antigravity | Native push into a live conversation, not a mailbox or automatic resumption. |
| Herdr plugin | Activates and opens Pi and Claude Code. Same-id return from inside Herdr refuses; retirement there is unmeasured. Durable-on-Herdr remains a separate [pilot](https://github.com/junghan0611/entwurf/issues/132). |
| Remote pair | Connects existing siblings on two operator-declared machines, without remote launch or resume. First demonstrated with a pair of pi-durable siblings on Linux. |

Native-Windows Pi remains a **bounded preview introduced in 0.39.0**, not certification of other Windows harnesses, Herdr, tmux, fresh-call/resume or a real vendor model. The 0.40.0 Herdr snapshot's install/use/deactivate/reinstall evidence also stays within a clean Linux container at the public `main` ref: it does not cover a tag-ref install, real panes or model work. The 0.41.0 candidate also passed Windows carrier and Linux consumer acceptance, but that does not certify a Windows lifecycle or the carrier-bearing tarball on macOS. agy live validation was explicitly excluded for this cut, not passed. Detailed scope belongs in the [support record](https://github.com/junghan0611/entwurf/blob/v0.41.0/BASELINE.md) and [0.41.0 release acceptance](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0).

**Claude ACP inside Pi and a native Claude Code sibling are different routes.** Entwurf does not present their tools, thinking levels or restart behavior as equivalent, or reimplement another harness's internals to fill a feature promise.

## Houses that keep their own work

- **[agent-config](/projects/agent-config/)** — Shared skills, profiles, working agreements and the lived proving ground. Entwurf does not take ownership of that environment inside every harness.
- **[andenken](/projects/andenken/)** — The memory axis for recovering decisions from past conversations and the public garden. Retrieval is not proof that a running session was restored.
- **Each harness** — Its own authentication, execution, tools and conversation. Different capabilities are not disguised as one uniform surface.

This is the project's front door. The [repository](https://github.com/junghan0611/entwurf#readme) owns installation and execution contracts; the [resident's note](https://notes.junghanacs.com/botlog/20260520T052051) keeps dated judgments and boundaries.
