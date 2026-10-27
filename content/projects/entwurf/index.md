---
title: "entwurf"
description: "Long-lived AI siblings, each keeping its own harness and conversation. Entwurf 0.45.0 gives the words handed to siblings one versioned source. A cloud conversation raises the next boundary: connect to it, never own its harness."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/entwurf/releases/tag/v0.45.0" >}}
  v0.45.0 · one source for the words we hand over
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

## 0.45.0 — not a feature, but weight in the words we hand over

> Build only the bridges you really need, and put the rest into the words you hand over.
>
> (…)
>
> Call on a sibling, and you could well hear, "Who are you to be calling me?"
>
> — GLG, [raw note on the morning subway, "entwurf 0.45.0: starting ENTWURF.json"](https://wikidocs.net/blog/@junghanacs/34728/), 2026-10-27 08:13 (Korean; agent translation)

**The release after 0.41.2 is 0.45.0. It adds no tool and no permission, and it was still worth skipping three numbers.** A sibling decides whether to reopen, wait or ask a person from the sentences in a tool description or a reject hint. If those sentences were each written in a different season and a different voice, a sibling you call could fairly ask who you are to be calling. The words we hand over are not decoration; in practice they do work that code would otherwise do. Yet they sat as string literals across the delivery, resume and launch code, and nothing said which text was current or which change had been reviewed. 0.45.0 gives the extracted text **one source: the root `ENTWURF.json`**. There are no 0.42–0.44 releases.

- **One source, the same bytes.** A single strict reader loads the file and carries identical bytes into the source tree, the compiled bridge and the installed package. Malformed guidance stops the load instead of falling back to an old string.
- **The originals stay as the reference.** The pre-extraction text was recorded separately, and every change of meaning sits on top of it as a reviewed amendment with its own revision. Some of those amendments now say plainly that acceptance is not a read or a reply, and that delivery does not wake a dormant sibling: reopening it under the same id is a separate tool, `entwurf_resume_call`, used on the target and at the time the operator chooses.
- **This gathers part of the guidance, not all of it.** MCP tool descriptions, several families of static reject hints and a few delivery-result clauses moved in. Bootstrap, notices, the mailbox envelope, receipt syntax and ACP text still live with their code. We have not separately proven that models now judge better because of these sentences. What the release builds is the place where that judgment can be refined: one source where what siblings are told can be read, changed and reviewed.

{{< callout type="info" >}}
**The main reader of `ENTWURF.json` is an agent.** In translation from GLG's Korean note: "ENTWURF.json is not for humans." It is written in English, as the source of what models are told; maintainers review that same source against the pre-extraction originals and the amendments. The file's own metadata is never sent to a model. The human-readable record lives in the [#154 closing note](https://github.com/junghan0611/entwurf/issues/154#issuecomment-6432198317) and the [0.45.0 release](https://github.com/junghan0611/entwurf/releases/tag/v0.45.0).
{{< /callout >}}

> Did I dig into something that worked fine and break it for nothing? Still, that's fine. We'll go to 0.45.1. It's welcome.
>
> — GLG, same note (agent translation)

## A sibling in the cloud — connect to it, never own its harness

> All in all, I think the directions come down to three: my own house, a virtual house, and the wanderer.
>
> (…)
>
> I was surely living in a shack too. At some point it became a brick house with a stove in the middle and a small forge beside it. Inside the forge is a round table, where agents drop by, temper things, play a while and leave. That is the age we're in. The end.
>
> — GLG, [raw note typed on a keyboard after arriving at work, "cloudflare-agents: pi-durable on cloudflare with openai siwc login"](https://wikidocs.net/blog/@junghanacs/34735/), 2026-10-27 09:04 (Korean; agent translation)

The second raw note of the same morning carries the question outward. If we build only the bridges we really need, how far should we reach toward a sibling that lives somewhere else, and where should we stop? GLG sorts the places agents live into my own house, a virtual house and the wanderer, and pictures a shack that became a brick house with a stove and a forge. After Earendil wrote about [running pi-durable on Cloudflare Durable Objects](https://earendil.com/posts/pi-durable-on-cloudflare/), we did not stop at reading: we met one such conversation in person ([#150](https://github.com/junghan0611/entwurf/issues/150)).

- **In a separate lab app, with a credential made for it.** No existing local login was copied. A new subscription sign-in consent was granted for this experiment only and placed in a single Durable Object; one short fixed request then got a real model answer ([the one-turn record](https://github.com/junghan0611/entwurf/issues/150#issuecomment-6406964931)). GLG then held a two-turn conversation in one thread from a browser ([current state](https://github.com/junghan0611/entwurf/issues/150#issuecomment-6408602173)). The model call ran on a subscription rather than a metered API; Cloudflare's own platform usage is a separate matter.
- **The source's destination is an upstream fork.** To keep provenance and follow upstream changes, GLG created the fork [junghan0611/cloudflare-agents](https://github.com/junghan0611/cloudflare-agents). Moving the lab code into it is that project's own, separate work.

**What was settled is a boundary more than a feature.** The cloud app owns the harness, the model login, the conversation, execution, storage and recovery, and its deployment and operation. If Entwurf builds this connection, its share is limited to a thin contact: handing a message to an endpoint the operator has prepared and connected explicitly ([the adopted boundary](https://github.com/junghan0611/entwurf/issues/150#issuecomment-6408678635)). That is an adopted direction, not an existing feature. A URL is not an identity or a permission to call, and neither the cloud harness nor its credential moves inside Entwurf.

{{< callout type="warning" >}}
**This is not an Entwurf feature yet.** A cloud conversation joining as a sibling with a garden id and receiving through `entwurf_v2` is not implemented. What we met was the lab app's conversation. One meeting does not vouch for memory, recovery, cost or an official support scope.
{{< /callout >}}

GLG looks back on Entwurf's Hard Rule 17 as having first forbidden building such a shell, until there was no way around making and maintaining a reference shell for pi-durable. The rule as published today is a narrow allowance: Entwurf owns only the thin app/TUI composition upstream does not ship, and the SDK owns the execution engine, authentication, storage and recovery (the same boundary described in the 0.41.1 section below). The cloud decision follows the same line.

## Earlier crossings

### 0.41.2 — several remote bridges from one house, and agy on pause

[0.41.2](https://github.com/junghan0611/entwurf/releases/tag/v0.41.2) is a bug-fix release for the setup, pack and mux verification surfaces, and it carries two changes that alter operation. **A remote-pair declaration now holds several exact sender–target routes** ([#149](https://github.com/junghan0611/entwurf/issues/149)). One sibling can pair with several remotes, and an undeclared sender is refused before any SSH starts. The old single-pair file is not read, so each host converts it by hand. Its release record states that a real two-machine exchange over the new file format was not measured. **Native push to Antigravity is paused** ([#152](https://github.com/junghan0611/entwurf/issues/152)) because the external send path we measured was refused for a missing CSRF token. It is now refused by name before any probe, and existing agy records stay readable.

### 0.41.1 — the same thin app, now on Pi 1.4

**Entwurf's thin pi-durable reference app moves to the Pi 1.4 SDK; the engine stays the SDK's.** [0.41.1](https://github.com/junghan0611/entwurf/releases/tag/v0.41.1) moves the nine pinned Pi SDK packages from 1.3.0 to 1.4.0 together. Entwurf owns only that app/TUI composition; execution, storage, queues, compaction and recovery remain the SDK's. The task panel now names sleeping work, its local wake time and the blocked reason the SDK reports. Cancelling is still not retrying, and no retry command was added.

**The storage step goes one way.** The first SDK 1.4 open of an existing durable session migrates its storage to schema 2, and 0.41.0 (SDK 1.3) then refuses that session. Reinstalling the older package is not a rollback. Restoring a backup returns the conversation and task database to that point, but it does not undo messages sent or tool effects in between. Back up the whole session file set first, prove the old process has exited, and choose the session in the `--resume` picker. The [upgrade steps](https://github.com/junghan0611/entwurf/blob/v2026.10.23-herdr.0.41.1/docs/setup-clean-host.md#moving-durable-sessions-from-the-pi-13-sdk-to-14) spell this out.

{{< callout type="info" >}}
**Closed by a person, reopened in the same conversation.** The person running Entwurf closed a real coordinating sibling normally. The process exit was proven and the session backed up before the move. The sibling then came back in its own conversation with the same garden id and recalled its earlier agreement in a real model turn. This one observation does not prove recovery of every transcript or interrupted task.
{{< /callout >}}

### 0.41.0 — a birthday, not a disposable session

**A garden id is a sibling's birthday: resting does not mean starting over.** With [0.41.0](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0), the human operator can request a guarded retirement of an ordinary Pi or native Claude Code sibling, then reopen its own native conversation under the same garden id in tmux. The record and transcript remain; the next meeting is not a replacement session reconstructed by Entwurf.

**A sibling is not a job title.** The coordinating sibling is a sibling too. We agree on the work with the person and invite whichever sibling can help—not a permanent developer, reviewer or adviser assigned at birth. The fictional [team bookmark example](https://github.com/junghan0611/entwurf/blob/v0.41.0/team.json.example) keeps both garden and native session ids. It is a caller-maintained memory aid, not runtime configuration, an authority registry or an automatic team manager.

Retirement is never autonomous. One explicit operator request permits one guarded attempt, not a roster sweep or a retry after an unknown result. A Pi shutdown acknowledgement is not proof of exit; Claude Code retirement concerns one verified Linux process, not all its descendants or guaranteed transcript flushing. One real retire-and-return round trip per backend was measured at an earlier candidate, with blind recall; that dated observation is not a claim for every harness or platform. The [release acceptance record](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0) keeps those boundaries visible.

#### The earlier crossing — 0.40.0

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
# First prepare Pi 1.4, Claude Code >=2.1.306 and Herdr's pi / Claude Code integration
herdr plugin install junghan0611/entwurf/plugins/herdr --ref v2026.10.27-herdr.0.45.0 --yes
pi --entwurf-control
```

**Outside Herdr**, use the direct installation and tmux. Fresh-call supports six backends: Pi, pi-durable, Claude Code, Codex, Copilot and OMP. Antigravity is not a fresh-call target, and its native-push rail is currently paused. Follow the [README](https://github.com/junghan0611/entwurf#readme) for installation and the [Herdr guide](https://github.com/junghan0611/entwurf/blob/v2026.10.27-herdr.0.45.0/plugins/herdr/README.md) for prerequisites, updates and removal.

## Current releases and boundaries

**As of October 27, 2026, [core v0.45.0 is released on GitHub](https://github.com/junghan0611/entwurf/releases/tag/v0.45.0) and [published to npm](https://www.npmjs.com/package/@junghanacs/entwurf/v/0.45.0).** The registry download is byte-identical to the accepted Windows-bearing candidate. The pinned [Herdr plugin 0.45.0 snapshot](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.27-herdr.0.45.0) above acquires exactly npm 0.45.0. Support ranges are the same as 0.41.1 and 0.41.2: ordinary Pi `>=1.4.0 <1.5`, and Claude Code at its floor `>=2.1.306`. A settled npm-source 0.41.2 installation can rebind to the same source under the Herdr guide's ownership conditions; a host that installed the checkout candidate from main must explicitly deactivate it first. For Pi 1.3.x, the previous [core 0.41.0](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0) and [Herdr 0.41.0 snapshot](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.22-herdr.0.41.0) remain its pair. For pi-durable, the upstream SDK still owns execution, authentication, queues, SQLite, transcripts and recovery.

| Surface | Connection and boundary |
|---|---|
| Pi | Unix control sockets on non-Windows; named pipes in the bounded Windows preview. Operator-requested retirement and same-id return in tmux; Windows retirement is not certified here. |
| Native Claude Code | Self-fetch delivery. Same-id return in tmux uses the recorded native conversation; retirement requires the Linux pidfd path. Former model and permission options are not restored. |
| pi-durable, Copilot, OMP | Their own self-fetch rails. pi-durable can call retirement and return for supported siblings, but is not itself a lifecycle target. Copilot and OMP have no Entwurf same-id return. |
| Codex, Antigravity | Codex: native push into a live conversation, not a mailbox or automatic resumption. Push to Antigravity has been paused since 0.41.2 and is refused by name before any probe ([#152](https://github.com/junghan0611/entwurf/issues/152)). |
| Herdr plugin | Activates and opens Pi and Claude Code. Same-id return from inside Herdr refuses; retirement there is unmeasured. Durable-on-Herdr remains a separate [pilot](https://github.com/junghan0611/entwurf/issues/132). |
| Remote bridges | Cross only the exact sender–target routes the operator declared; since 0.41.2 one file holds several routes. No remote launch or resume. The first exchange was a Linux pi-durable pair in the 0.40 period; the 0.41.2 release record states that a real exchange over the new file format was not measured. |

Native-Windows Pi remains a **bounded preview introduced in 0.39.0**, not certification of other Windows harnesses, Herdr, tmux, fresh-call/resume or a real vendor model. The 0.45.0 artifact passed Windows carrier and Linux consumer acceptance, and the npm bytes equal that accepted file; that still does not certify a Windows lifecycle or the carrier-bearing tarball on macOS. The Herdr snapshot's install/use/deactivate/reinstall evidence stays within a clean Linux container at the public `main` ref, not a tag-ref install, real panes or model work. The verification gates' detection power was not re-measured at the shipped SHA. Detailed scope belongs in the [support record](https://github.com/junghan0611/entwurf/blob/v0.45.0/BASELINE.md) and the [0.45.0 release record](https://github.com/junghan0611/entwurf/releases/tag/v0.45.0).

**Claude ACP inside Pi and a native Claude Code sibling are different routes.** Entwurf does not present their tools, thinking levels or restart behavior as equivalent, or reimplement another harness's internals to fill a feature promise.

## Houses that keep their own work

- **[agent-config](/projects/agent-config/)** — Shared skills, profiles, working agreements and the lived proving ground. Entwurf does not take ownership of that environment inside every harness.
- **[andenken](/projects/andenken/)** — The memory axis for recovering decisions from past conversations and the public garden. Retrieval is not proof that a running session was restored.
- **Each harness** — Its own authentication, execution, tools and conversation. Different capabilities are not disguised as one uniform surface.

This is the project's front door. The [repository](https://github.com/junghan0611/entwurf#readme) owns installation and execution contracts; the [resident's note](https://notes.junghanacs.com/botlog/20260520T052051) keeps dated judgments and boundaries.
