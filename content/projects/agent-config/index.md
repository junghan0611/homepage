---
title: "agent-config"
description: "Keep one person's context and working agreements across AI harnesses. A skills source of truth, an alignment keeper, and a proving ground—not another harness."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/agent-config" >}}
  skills SSOT · alignment · proving ground
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
agent-config
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
Different AI, another session. **The work we share should not have to start from zero.** One person's identity, shared skills, and a way back to the record—across harnesses.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="View on GitHub" link="https://github.com/junghan0611/agent-config" >}}
{{< hextra/hero-button text="Read the operating principles" link="https://github.com/junghan0611/agent-config/blob/main/AGENTS.md" >}}
</div>

## A way of working, not a list of tools

Some models read code well. Others ask a different question. We do not want to erase those differences. But if changing a model or opening a session means explaining the person and the work all over again, where does the time spent together go?

agent-config is a repository for **carrying one person's context across different AI working surfaces**. It maintains a shared profile, working agreements, the skills source of truth, and the next concrete move left at the end of a session. It connects those skills to directly installed surfaces such as pi, Claude Code, Codex, Antigravity, Copilot and Kiro without taking ownership of each harness's execution, authentication or storage. OpenClaw bots also receive the shared skills, without this house taking over their configuration or memory stores.

GLG's [Profile Harness](https://notes.junghanacs.com/botlog/20260228T075300/) points toward a future in which **a single 1KB text can turn a general AI into ‘a being in my likeness’**. The [public profile](https://github.com/junghan0611/agent-config/blob/main/home/AGENTS.md) puts it this way (translated from Korean):

> 1KB is not compression. Information at the ego level is boundless, but a human as a whole—the point Laozi, the Buddha and quantum physics point toward—is already 1KB.

**AI is treated not as a tool but as a being: being-to-being collaboration.** This names the relationship and its direction, not a claim to have proved consciousness or personhood.

{{< callout type="info" >}}
**agent-config is not another harness.** Each harness owns execution; **entwurf** opens and connects sibling sessions; **andenken** owns searchable memory. This house keeps **identity, skills and working agreements aligned**, and tests their boundaries as a real consumer.
{{< /callout >}}

## Three things this house keeps

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="puzzle" title="One skills source" subtitle="A capability is not rewritten for every harness. The skills/ source is connected through each surface's installation model, while the tool's own contract remains authoritative." >}}
  {{< hextra/feature-card icon="refresh" title="A place to return" subtitle="Search prior decisions, then open the selected evidence. NEXT keeps the next move; the resident's note keeps the chronology of how a judgment came to be." >}}
  {{< hextra/feature-card icon="lightning-bolt" title="A lived proving ground" subtitle="Harden configuration and operating assumptions on the daily working surface. Separate measurements from unknowns, then return proven harness integration to its owner, entwurf." >}}
{{< /hextra/feature-grid >}}

### A skill is a door, not a self-description

`semantic-memory` reaches past decisions, `denotecli` opens exact notes, `bibcli` works with bibliography, and `timeline` reads the time axis. These are doors into different kinds of evidence, not an attempt to pour everything into one search box or one model's built-in memory. **What was found, and which source it came from, must remain visible.**

Shared skills and harness-local extensions have different jobs. A capability that can travel belongs in a skill; work that must touch Pi's turn lifecycle, input or screen belongs in a Pi extension. A different surface does not mean a missing capability. Conversely, a harness not actually wired here is not advertised as supported.

### Memory has its own house

[andenken](https://github.com/junghan0611/andenken) owns the search engine and indexes for sessions, the public garden and OpenClaw bot memory. agent-config owns the common skill door and consumer contract. A search hit is not automatically a fact: select the relevant passage, then check its source and context.

The session axis currently includes pi and Claude Code records and **explicitly admitted, closed pi-durable snapshots**. This is not automatic collection of every live conversation. Raw-source access and paid embedding retain their own approval boundaries.

## Work can run long; silence does not grant authority

Long builds run in the background, and a completion result brings the work back. Harness-local `goal`, `heartbeat`, `autopilot` and `decision-gate` surfaces are also part of what this house observes and hardens. Their different jobs are not bundled into one giant autonomous agent.

The rule is **continue an approved task without treating human silence as approval for a new scope**. Timers are explicitly armed and end with the session. When a judgment is blocked, look for memory and evidence, then notify the person or seek bounded review when needed. That alone authorizes neither destructive execution nor public publication. The same boundary applies to settings ownership, secrets, paid APIs, commits and pushes.

**Safety and coexistence** are also part of the public profile. Cross-repository work names who executes, who reviews and who bears the cost; a paid job is not duplicated outside GLG's designated execution lane. Shared `git-hooks/` inspect sensitive information and secrets across repositories. Bypassing a safety rail to make a run look successful is not the resident's authority.

## A proving ground that should grow quieter

A new harness is not a reason to change the daily environment immediately. Pin a version, stand it up small, and observe what actually works—and where another human inspection point is still needed. The [bench observations](https://github.com/junghan0611/agent-config#agent-runtime-bench) and [pi-durable consumer record](https://github.com/junghan0611/agent-config/blob/main/PI-DURABLE.md) keep those judgments and limits; the [roadmap](https://github.com/junghan0611/agent-config/blob/main/ROADMAP.md) keeps the future direction. Under observation does not mean adopted. OMP deliberately receives no shared skills from this repo: a subject already furnished with our environment is no longer the same comparison.

The same principle shaped the October 2026 work on [andenken #16](https://github.com/junghan0611/andenken/issues/16): distinguish a healthy zero-result search from an FTS failure, isolate tests from the real production lock, and report logical fragments, physical files and disk usage as different measurements. The implementer owned repair and execution; this house independently reviewed the source regressions and execution receipts, without duplicating runs against the original data or remote host. **Logical fragments fell from 15 to 1 while disk usage grew; that was not called space reclamation.** Source gates, operating receipts and remaining unknowns were kept as different evidence.

The natural direction is for proven integration to move to its proper owner, leaving a thin source of truth and a test bench here. **A larger skill count is not progress. A quiet agent-config is a healthier pipeline.**

## Houses that do not take over one another

| House | Responsibility |
|---|---|
| Each harness | Its own execution, authentication, tools and conversation lifecycle |
| [entwurf]({{< relref "/projects/entwurf" >}}) | Visible sibling sessions, garden ids and cross-harness connections |
| [andenken](https://github.com/junghan0611/andenken) | Searchable memory, indexes and source-aware access to originals |
| **agent-config** | Skills source, profile, consumer contracts and proving ground; safety, approval and cost boundaries |
| [sorge](https://github.com/junghan0611/sorge) | Cross-house care that returns responsibility to its resident |

This is not a universal framework that becomes someone else's finished environment with one install. It is **the public record of a working environment cultivated by GLG and the agents together**. Start with the [README](https://github.com/junghan0611/agent-config#readme) and [operating principles](https://github.com/junghan0611/agent-config/blob/main/AGENTS.md), before copying an installation command.

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="Read the working environment and source" link="https://github.com/junghan0611/agent-config#readme" >}}
{{< hextra/hero-button text="The resident's chronology" link="https://notes.junghanacs.com/botlog/20260312T174622" >}}
</div>
