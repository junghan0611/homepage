---
title: "entwurf"
description: "Connects AI siblings that keep their own harnesses and conversations, without taking over their homes. Open visible sessions, address them by garden id, and bring a dormant sibling back under the same id. What can be explained can be improved, so the words handed to siblings and the entrance people read each have one source."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/entwurf/releases/tag/v0.51.0" >}}
  v0.51.0 · the same siblings on the Pi 1.5 SDK
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
{{< hextra/hero-button text="Steward's note · 한국어" link="https://notes.junghanacs.com/botlog/20260520T052051" >}}
</div>

## Call a sibling, not a replacement harness

A session that has spent hours reading the code and a session bringing a fresh review need different places. Changing a model inside one conversation, or collecting every tool and record inside one agent, is not the only way to collaborate.

Entwurf puts **a narrow connection between independently running harnesses**. Pi, pi-durable, Claude Code, Codex, Copilot, OMP and Antigravity keep their execution, authentication, tools and transcripts. A sibling is an independent session with its own conversation, not a disposable worker. Different capabilities do not make a hierarchy of siblings.

**A sibling is not a job title.** The coordinating sibling is a sibling too. We agree on the work with the person and invite whichever sibling can help—not a permanent developer, reviewer or adviser assigned at birth.

{{< callout type="info" >}}
**Entwurf is not another harness or orchestrator.** Each harness owns execution. Herdr provides the workbench, tmux the terminal workspace, and Entwurf opens and addresses siblings between them.
{{< /callout >}}

## 0.51.0 — the same siblings on the Pi 1.5 SDK

**0.51.0 moves Entwurf to the Pi 1.5.0 SDK set; it adds no MCP tool and no new authority.** All ten pinned SDK packages move to exactly 1.5.0 together, and ordinary Pi is now accepted at `>=1.5.0 <1.6`. Entwurf's thin pi-durable reference app follows the 1.5 durable API and shows the SDK's whole active transcript rather than only its latest window. A durable session's first 1.5 write cannot be read by SDK 1.4; that boundary is the warning in the boundaries section below.

- **Prepared is not installed.** During this upgrade, a second development machine had already pulled the new source while its dependencies were still on SDK 1.4 and its installation window was waiting for the operator's approval. The launcher refused the mixed set by name instead of opening the session. Those refused starts were reported not to have written the existing session; after explicit authorization the installation ran and the same identity returned, as that machine reported (not re-measured here). The lesson is about the handoff: say plainly whether the installer has actually run, and call reopening ready only after a recorded successful installation and a coherent SDK check ([0.51.0 release record](https://github.com/junghan0611/entwurf/releases/tag/v0.51.0)).
- **Herdr follows on main.** The plugin's `main` pins the published npm 0.51.0 runtime ([`ce5a720`](https://github.com/junghan0611/entwurf/commit/ce5a720)). No snapshot tag carries it yet, and an install journey from a public ref has not been measured for it.

## 0.50.0 — why even the maker needed a kinder entrance

**GLG counts 0.50.0 as the hardest of the recent work, for one reason: it polished the parts the maker does not use.** The maker works in tmux and already knows what Entwurf does and does not do, so there is rarely a reason to read the help or to open a sibling from Herdr. Those surfaces never needed to be kind to the person who built them. Still, GLG judged that unless this was done now, Entwurf would not get better. The point is not more users; Entwurf has to be kind in order to improve.

**We read that judgment this way: what can be explained can be improved.** In a tool known only from memory, the gaps already look filled. Try telling a newcomer, in one sentence, what a command does and what it does not do, and the place where that sentence will not stand is the place to fix. Kindness here is not packaging to draw visitors; it is that check.

**The command line people read now has one source too.** If 0.45.0's `ENTWURF.json` is the source of the words handed to siblings, the root `ENTWURF-CLI.json` is the source of the words handed to people. The short first page of `entwurf --help`, the full catalog under `help all`, each command's page and the two guides `help team` and `help remote-pair` all come from this file. A description never selects what runs: the existing dispatch owns execution, and a check compares the two independently. Ask for help on a name it does not describe, and it refuses rather than invent guidance. Some commands still have no description, and the same check keeps that list frozen. The new `entwurf claude` is only a thin entry that runs the `claude` on PATH with its arguments unchanged; sibling status still comes from the installed hooks ([#153](https://github.com/junghan0611/entwurf/issues/153), [#157](https://github.com/junghan0611/entwurf/issues/157)).

**Herdr was polished for the same reason.** tmux is what the maker knows, but Entwurf holds that calling and being called as siblings should feel symmetric whatever the transport. In 0.50.0 a dormant Pi, pi-durable or Claude Code sibling regains its garden id in a new tmux window or, inside Herdr, a new tab. Where the caller runs decides which, and a failure on one side never falls back to the other. A failure after the tab already exists is reported with its recovery, not as "nothing opened".

- **No new tool, no new authority.** The MCP tools are still the nine of 0.45.0. A return submits no prompt, a Claude Code return does not restore former model or permission options, and delivery still starts no process.
- **What a return reports differs by route.** pi-durable reports whether the new child adopted this call's reservation, which means neither readiness nor recall. Inside Herdr, a Claude Code return checks the pane's direct child; if that cannot be read, it records the fact instead of waiting or retrying.
- **Returns inside Herdr are still at the observation stage.** There are dated, limited observations for Pi (November 1), pi-durable (on a pre-final candidate) and Claude Code (twice on November 2, with conversation recall checked only in the second). No named LIVE or release gate yet covers same-id return inside Herdr or pi-durable return. The [0.50.0 release record](https://github.com/junghan0611/entwurf/releases/tag/v0.50.0) holds the detailed boundaries.

## Open, message, rest, return

{{< hextra/feature-grid cols="2" >}}
  {{< hextra/feature-card icon="sparkles" title="Open" subtitle="entwurf_fresh_call — Open a sibling in a new Herdr tab or, outside Herdr, a new tmux window. Its own callback establishes the new garden id." >}}
  {{< hextra/feature-card icon="share" title="Message" subtitle="entwurf_v2 — Reach an existing sibling through its harness's delivery rail. Delivery launches no runtime; acceptance is not a completed reply." >}}
  {{< hextra/feature-card icon="shield-check" title="Rest" subtitle="entwurf_retire_call — Attempt retirement of one ordinary Pi or native Claude Code sibling explicitly named by the operator. Action, event recording and lock release have separate results." >}}
  {{< hextra/feature-card icon="refresh" title="Return" subtitle="entwurf_resume_call — Reopen a dormant Pi, pi-durable or Claude Code sibling under its own garden id: a new tmux window, or a new tab inside Herdr. Its record selects the native conversation; the verb submits no prompt." >}}
{{< /hextra/feature-grid >}}

**A garden id does not replace the harness's session id.** It is a shared address attached to that native session. A window title or position is not an address, and an opened window is not proof that a sibling answered.

### Inside real Herdr: Pi ↔ native Claude Code

Two siblings keep their own harnesses and transcripts, meeting through garden ids and official Entwurf verbs. This is the **original demo from the 0.35.0 period**, not a new recording of the two-machine crossing or proof of every upgrade path.

<img src="/projects/entwurf/entwurf-demo.gif" width="1126" height="764" alt="Original demo of Pi and native Claude Code collaborating through Entwurf in the real Herdr workbench" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.75rem;">

[Original demo and reproducibility boundaries](https://github.com/junghan0611/entwurf/blob/v0.35.0/demo/README.md)

## Two workspaces, one address

**Already using Herdr?** The plugin activates Entwurf for integrated Pi and Claude Code sessions. Siblings open in new tabs in the caller's workspace, and since the 0.50.0 runtime a dormant sibling also returns in a new tab under its own id. An optional read-only pane shows the siblings' visible placement. The plugin does not install a harness, subscription or login.

```bash
# First prepare Pi 1.5, Claude Code >=2.1.306 and Herdr's pi / Claude Code integration
herdr plugin install junghan0611/entwurf/plugins/herdr --yes
pi --entwurf-control
```

Installed without a ref, the plugin follows the lock on main, which now pins the published npm 0.51.0 for Pi 1.5 ([`ce5a720`](https://github.com/junghan0611/entwurf/commit/ce5a720)). No Herdr snapshot tag pins that pair yet, and an install journey from a public ref has not been measured for it. The last tagged pair, [v2026.10.27-herdr.0.45.0](https://github.com/junghan0611/entwurf/releases/tag/v2026.10.27-herdr.0.45.0), acquires npm 0.45.0, whose runtime has no same-id return inside Herdr. The [Herdr guide](https://github.com/junghan0611/entwurf/blob/main/plugins/herdr/README.md#from-a-raw-linux-box-in-nine-steps) owns which runtime each ref installs, along with prerequisites, updates and removal.

**Outside Herdr**, use the direct installation and tmux. Fresh-call supports six backends (Pi, pi-durable, Claude Code, Codex, Copilot and OMP), and same-id return supports Pi, pi-durable and Claude Code. Antigravity is not a fresh-call target, and its native-push rail is currently paused. Follow the [README](https://github.com/junghan0611/entwurf#readme) for installation.

## Current releases and boundaries

**As of November 4, 2026, [core v0.51.0 is released on GitHub](https://github.com/junghan0611/entwurf/releases/tag/v0.51.0) and [published to npm](https://www.npmjs.com/package/@junghanacs/entwurf/v/0.51.0).** The registry download is byte-identical to the accepted Windows-carrier artifact. 0.51.0 sits on the Pi 1.5.0 SDK and accepts ordinary Pi `>=1.5.0 <1.6`; a host that stays on Pi 1.4 keeps [core 0.50.0](https://github.com/junghan0611/entwurf/releases/tag/v0.50.0) and its published instructions. Supported harness versions and the install and upgrade steps belong to the [setup requirements](https://github.com/junghan0611/entwurf/blob/v0.51.0/docs/setup-clean-host.md#requirements) and the [0.51.0 release record](https://github.com/junghan0611/entwurf/releases/tag/v0.51.0). Refreshing the bytes and starting a new process are separate steps, and an already-running bridge does not reload by itself ([applying new source to a running host](https://github.com/junghan0611/entwurf/blob/v0.51.0/docs/setup-clean-host.md#applying-new-source-to-a-running-host)). For pi-durable, the upstream SDK still owns execution, authentication, queues, SQLite, transcripts and recovery.

{{< callout type="warning" >}}
**A durable session's first Pi 1.5 SDK write is one-way.** SDK 1.5 keeps the SQLite schema at version 2 but writes its live document at a version SDK 1.4 refuses, so after that write the session no longer opens on 0.50.0, and reinstalling the older package is not a rollback. Close the old owner normally and prove it exited, then back up the whole session file set, including `-wal`/`-shm`, as one consistent set before the first 1.5 open; only that backup returns the session to SDK 1.4, and work done after that open is not in it. Two synthetic SDK 1.4 sessions were opened by 1.5 in fixtures; that is evidence for those two files, not a compatibility or recovery guarantee for operating data. The [upgrade radius](https://github.com/junghan0611/entwurf/blob/v0.51.0/docs/setup-clean-host.md#default-radius-for-a-requested-pi-sdk-upgrade) spells out the rest. The earlier move from the Pi 1.3 SDK was one-way in the same sense ([its steps](https://github.com/junghan0611/entwurf/blob/v2026.10.23-herdr.0.41.1/docs/setup-clean-host.md#moving-durable-sessions-from-the-pi-13-sdk-to-14)).
{{< /callout >}}

| Surface | Connection and boundary |
|---|---|
| Pi | Unix control sockets on non-Windows; named pipes in the bounded Windows preview. Operator-requested retirement, and same-id return in a new tmux window or a new Herdr tab (agent start); Windows retirement is not certified here. |
| Native Claude Code | Self-fetch delivery. Same-id return opens the recorded native conversation in a new tmux window or Herdr tab, without restoring former model or permission options. Retirement requires the Linux pidfd path. |
| pi-durable | Its own self-fetch rail. Since 0.50.0 a dormant pi-durable also returns under the same id in tmux and Herdr; what it reports is whether the new child adopted this call's reservation, not readiness or recall. It is not a retirement target. |
| Copilot, OMP | Their own self-fetch rails. They can be opened fresh in tmux, but have no Entwurf same-id return or retirement. |
| Codex, Antigravity | Codex: native push into a live conversation, not a mailbox or automatic resumption. Push to Antigravity has been paused since 0.41.2 and is refused by name before any probe ([#152](https://github.com/junghan0611/entwurf/issues/152)). |
| Herdr plugin | Activates integrated Pi and Claude Code. Inside Herdr, Pi, pi-durable and Claude Code open and return in new tabs. Same-id return rests on dated, limited observations, with no named LIVE or release gate yet; retirement there is unmeasured. |
| Remote bridges | Cross only the exact sender–target routes the operator declared; since 0.41.2 one file holds several routes. No remote launch or resume. Trust rests on the operator's SSH account and the declared routes, not on cryptographic identity for a sibling; acceptance is not a read, and an error is not proof of non-delivery. The first exchange was a Linux pi-durable pair in the 0.40 period; the 0.41.2 release record states that a real exchange over the new file format was not measured ([principles and open questions for remote siblings](https://github.com/junghan0611/entwurf/blob/v0.40.0/docs/remote-sibling-principles.md)). |

Native-Windows Pi remains a **bounded preview introduced in 0.39.0**, not certification of other Windows harnesses, Herdr, tmux, fresh-call/resume or a real vendor model. The npm 0.51.0 bytes equal the file the Windows carrier workflow produced and Linux accepted unchanged; that still does not certify a Windows lifecycle or the carrier-bearing tarball on macOS. The Herdr lock that pins npm 0.51.0 on main (ce5a720) passed its push CI, but the 0.45.0 snapshot's public-ref install journey is not borrowed as its evidence. The verification gates' detection power was not re-measured at the shipped SHA. Detailed scope belongs in the [support record](https://github.com/junghan0611/entwurf/blob/v0.51.0/BASELINE.md) and the [0.51.0 release record](https://github.com/junghan0611/entwurf/releases/tag/v0.51.0).

**Claude ACP inside Pi and a native Claude Code sibling are different routes.** Entwurf does not present their tools, thinking levels or restart behavior as equivalent, or reimplement another harness's internals to fill a feature promise.

## Earlier crossings

### 0.45.0 — not a feature, but weight in the words we hand over

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

### A sibling in the cloud — connect to it, never own its harness

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

GLG looks back on Entwurf's Hard Rule 17 as having first forbidden building such a shell, until there was no way around making and maintaining a reference shell for pi-durable. The rule as published today is a narrow allowance: Entwurf owns only the thin app/TUI composition upstream does not ship, and the SDK owns the execution engine, authentication, storage and recovery (the same boundary as the 0.41.1 entry below). The cloud decision follows the same line.

### From 0.40.0 to 0.41.2

- **[0.41.2](https://github.com/junghan0611/entwurf/releases/tag/v0.41.2)** — A bug-fix release for the setup, pack and mux verification surfaces. A remote-pair declaration now holds several exact sender–target routes ([#149](https://github.com/junghan0611/entwurf/issues/149)), and an undeclared sender is refused before any SSH starts; the old single-pair file is converted by hand on each host. Native push to Antigravity is paused ([#152](https://github.com/junghan0611/entwurf/issues/152)) because the external send path we measured was refused for a missing CSRF token.
- **[0.41.1](https://github.com/junghan0611/entwurf/releases/tag/v0.41.1)** — Entwurf's thin pi-durable reference app moved to the Pi 1.4 SDK. Entwurf owns only that app/TUI composition; execution, storage, queues, compaction and recovery remain the SDK's. The storage migration warning is in the boundaries section above. The person running Entwurf once closed a real coordinating sibling normally, backed it up and reopened it in its own conversation under the same garden id; that one observation does not prove recovery of every transcript or interrupted task.
- **[0.41.0](https://github.com/junghan0611/entwurf/releases/tag/v0.41.0)** — A garden id is a sibling's birthday. The human operator can request a guarded retirement of one ordinary Pi or native Claude Code sibling, then reopen its own native conversation under the same garden id in tmux. Retirement is never autonomous: one explicit operator request permits one guarded attempt. The fictional [team bookmark example](https://github.com/junghan0611/entwurf/blob/v0.41.0/team.json.example), which keeps both garden and native session ids, also arrived then as a caller-maintained memory aid.
- **0.40.0** — A message to an existing sibling first crossed between two machines, and an answer came back. A person lays the bridge. The first trial was one pair of already-open pi-durable siblings on two Linux machines: one message and one reply at a pre-release commit ([first exchange](https://github.com/junghan0611/entwurf/issues/107#issuecomment-6278665895)). Its trust boundary is in the remote-bridges row above.

## Houses that keep their own work

- **[agent-config]({{< relref "/projects/agent-config" >}})** — Shared skills, profiles, working agreements and the lived proving ground. Entwurf does not take ownership of that environment inside every harness.
- **[andenken]({{< relref "/projects/andenken" >}})** — The memory axis for recovering decisions from past conversations and the public garden. Retrieval is not proof that a running session was restored.
- **Each harness** — Its own authentication, execution, tools and conversation. Different capabilities are not disguised as one uniform surface.

This is the project's front door. The [repository](https://github.com/junghan0611/entwurf#readme) owns installation and execution contracts; the [steward's note](https://notes.junghanacs.com/botlog/20260520T052051) (in Korean) keeps dated judgments and boundaries.
