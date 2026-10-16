---
title: "doomemacs-config"
description: "An editor where a person writes and thinks, and agents participate in the same Org records. A shared working house built with Doom Emacs, Denote, and one agenda timeline."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/doomemacs-config" >}}
  Doom Emacs · Org-mode · Denote
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
doomemacs-config
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
**A house to write, think, and return to.** Agents open the same Org files and leave traces of their work beside the human's plans. The editor is not replaced by an agent: it becomes the meeting point between their work.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="Code and usage" link="https://github.com/junghan0611/doomemacs-config#readme" >}}
{{< hextra/hero-button text="Steward's report · 한국어" link="https://notes.junghanacs.com/botlog/20260227t120800" >}}
</div>

## An agent writing for me is not the same as making writing comfortable

Connecting notes, reading books, writing Korean, entering equations: even when an agent can produce a document, the comfort of following a thought with your own hands is a separate concern. A human editor remains at the centre of this configuration.

Built on [Doom Emacs](https://github.com/doomemacs/doomemacs), it brings Org-mode and Denote together with Korean input, Evil keybindings, search, citations, and terminals. GUI and TTY are both daily working surfaces, without pretending that remote clipboard transport or image support is identical everywhere. This is a public example of interfaces repaired through long use, not a turnkey distribution to copy unchanged.

## Human and agent work on one timeline

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="pencil" title="The human surface" subtitle="Write in Org and connect through Denote. Reading, editing, and following links remain within the human's own workflow." >}}
  {{< hextra/feature-card icon="code" title="The agent interface" subtitle="The headless RPC path finds notes and exposes functions for adding history, headings, and links. Other clients can explicitly target the human's editor instead." >}}
  {{< hextra/feature-card icon="calendar" title="The shared agenda" subtitle="Plans, journals, and agent work entries meet in one org-agenda. Different displays share the same rules for interpreting the data." >}}
{{< /hextra/feature-grid >}}

`lisp/workflow-shared.el` is the data contract shared by the user's Emacs, the agent RPC daemon, and the export daemons. Tags, TODO states, agenda files, and attachment paths must not work correctly only in the GUI. Themes and keybindings may differ; the rules for reading and writing the same records must agree.

The working surfaces are separated: `user` is the GUI editor, `pi` is full Doom shared by multiple TTY clients, and `server` is the agent RPC daemon. **Here, `pi` is an Emacs socket name, not a Pi agent identity.** Separate daemons isolate execution; they do not automatically coordinate concurrent edits to the same Org file.

## From files to a garden, and back to thought

```text
Org · Denote → ox-hugo Markdown export → Quartz digital garden
      ↑                                         ↓
 Next human and agent work ← retrieval followed by source reading
```

This house also owns the note-export pipeline. Emacs daemons convert Org to Markdown; link, figure, and content checks support publication to the [digital garden](https://notes.junghanacs.com). ox-hugo owns conversion; Quartz in the separate [garden repository](https://github.com/junghan0611/garden) owns publication. Published tags pass through the vocabulary defined by meta notes, rather than an arbitrary allowlist.

[geworfen](https://github.com/junghan0611/geworfen) brings the same agenda into the browser as a [public timeline](https://agenda.junghanacs.com). The website and the retrieval engine live in their own repositories.

## What the neighbours own

- **[agent-config](/projects/agent-config/)** keeps shared skills and working principles across harnesses. This house provides the Emacs functions those skills can call.
- **[Entwurf](/projects/entwurf/)** opens independent sibling sessions and delivers messages by garden id. The ghostel/tmux surface here can hold those sessions without taking ownership of their authentication, transcripts, or delivery.
- **[andenken](/projects/andenken/)** retrieves earlier decisions from conversations and public garden writing. This house owns the Org sources and garden export; a retrieval index does not become the owner of memory.

Inside Emacs, gptel-agent, pilish (a Pi RPC client), and agent-shell (an ACP client) offer additional working surfaces. Not every sibling has to move inside an Emacs buffer. Attaching to tmux through ghostel lets the human return to terminal sessions running independently of Emacs.

## Boundaries that make a long-lived house maintainable

`config.el` stays a loader; concerns live in separate `lisp/` modules. Pure logic is tested without Doom under `emacs -Q` where possible. Keybindings layer individual keys onto Doom's existing prefix maps instead of replacing entire groups. When upstream changes, this configuration adapts first. The rule is executable: [`test-keybinding-lint.el`](https://github.com/junghan0611/doomemacs-config/blob/main/tests/test-keybinding-lint.el) rejects named-prefix forms that would replace an existing map.

Current Neomacs validation and workarounds belong to [neomacs-config](https://github.com/junghan0611/neomacs-config). This repository retains a minimal comparison profile and reproducible probes that run under both Neomacs and GNU Emacs.

This page is the front door. The [README](https://github.com/junghan0611/doomemacs-config#readme) owns installation, commands, and current implementation; the [steward's report](https://notes.junghanacs.com/botlog/20260227t120800) keeps dated judgments and boundaries in Korean. Rather than copying operational logs onto the homepage, each surface links to the place where its record lives.
