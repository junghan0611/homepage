---
title: "andenken"
description: "Recollective memory for people and AI agents: recover decisions and continuity from conversations and a public digital garden, with files as authority and the timeline as compass."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/andenken" >}}
  Open source · CLI · Pi extension
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
andenken
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
Let past conversations gain meaning in the present. **Files are the authority. The timeline is the compass.** A semantic memory axis for recovering the reasons behind a decision — and where to pick up next.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="Code and usage" link="https://github.com/junghan0611/andenken#readme" >}}
{{< hextra/hero-button text="Steward's note · 한국어" link="https://notes.junghanacs.com/botlog/20260319T110800" >}}
</div>

## Find it so you can continue

Why did we choose that design? Where did I write about this? What followed that decision?

As conversations grow and harnesses change, a surviving record can become hard to reach. andenken does not keep an old session running. It helps you **choose which original record to open**: find candidates through today's question, check their sources, read what matters, and take the next step.

*Andenken* means recollective thinking — thinking toward what has been. We call it **뜻새김** in Korean: letting the past gain meaning again, rather than pouring every old conversation back into a prompt.

## When to come here

- **Continuing work in a different session:** recover not just the conclusion, but the reasons and conditions behind it, then return to the original conversation.
- **Connecting thoughts and writing:** find public notes written in different words, and neighbours of the idea you are exploring now.
- **Comparing human and bot records:** keep track of who left evidence on which surface, rather than mistaking one source for the whole memory.

Reconstructing an entire day is a job shared with the timeline and other tools. andenken does not collect every record into an all-in-one personal brain.

## Three retrieval surfaces, named sources

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card
        icon="collection"
        title="Conversations · sessions"
        subtitle="Recover decisions and context from Pi and Claude Code conversations. pi-durable participates only through explicitly admitted closed snapshots; reading originals and admitting embeddings are separate acts." >}}
  {{< hextra/feature-card
        icon="puzzle"
        title="Public garden · md"
        subtitle="Find durable interpretations and conceptual connections in exported public Markdown notes. This does not automatically collect every private Org file." >}}
  {{< hextra/feature-card
        icon="share"
        title="Bot records · openclaw"
        subtitle="Harvest text and vectors already computed by OpenClaw into a separate retrieval surface. Preserve the bot and source identity without taking over its memory policy." >}}
{{< /hextra/feature-grid >}}

The engine combines vector retrieval with BM25; available retrieval legs depend on the calling surface and index health. **OpenClaw search currently uses the CLI's `search-openclaw` path; there is no dedicated Pi tool.** Its harvest reuses compatible vectors, so **the import itself makes zero re-embedding API calls** — not a claim that upstream embedding or queries are free. Provenance and ownership remain distinct.

## A small retrieval engine, with authority outside it

```text
Admitted conversations / public writing → chunk → embed → retrieval stores
Already computed bot text and vectors ─────────────────→ a separate store

Question → choose surface and filters → vector + BM25 → fusion / diversity
         → candidates with sources → read selected originals
```

Conversations and garden notes currently use **Qwen3-Embedding-8B / 4096d**, stored in **LanceDB**. Vectors find related expressions; BM25 finds concrete words. Candidates are fused and re-ranked for diversity. Recent-first conversation lookup has its own stored-signal path; ordinary relevance does not decay a memory out of reach merely because it is old.

**Meaning crosses languages.** GLG writes in Korean, while the question that looks for those records may arrive as an English term or an agent's English summary. Word matching alone is not enough to cross that wall, so conversations and notes live in a multilingual embedding space where the same meaning, written in another language, can still land nearby. This is the direction of the design, not a promise of cross-lingual quality; personal vocabulary and morphology stay with their own tools.

Records outlive the index. The session corpus merges admitted files across devices, append-only, with a checksum manifest and roster preserving provenance. The sessions query replica receives **index, manifests and corpus** together. Neither one machine's storage nor one model's context window should become the owner of memory.

**Small enough to keep.** An index that grows toward ten gigabytes per checkout cannot be carried for a lifetime, so size now comes before retrieval polish. The sessions index is built under a pinned selection policy: lifecycle notices injected by the harness and sibling-mail doorbell envelopes are dropped before embedding, and messages containing credential-shaped strings are held rather than sent. Only the searchable trace is selected; no original conversation is deleted. A freshly built store came out far smaller; the dropped rows explain only a small part of that, and most of the reduction appears to come from rewriting accumulated storage — the [change history](https://github.com/junghan0611/andenken/blob/main/CHANGELOG.md) keeps the measured scope.

## From time to meaning, and back

**The timeline is the skeleton; the embedding is the lens.**

1. **Time → meaning:** start with a date or event, then recover conversational decisions and garden interpretations around its canonical coordinates.
2. **Meaning → time:** start with a question, find related records, then return their dates, files and identifiers to the timeline to check the surrounding context.

The harness-side [timeline](https://github.com/junghan0611/agent-config/tree/main/skills/timeline) owns when and what happened. An embedding similarity score is neither evidence of a date nor a probability of truth.

## Search offers rooms; reading opens one

```text
Question → start with a few candidates → check sources → open selected originals → decide
```

The first screen helps you choose a record instead of flooding context with chunks. Narrow conversations by source, project and time window; return to public notes through titles and Denote IDs. Use structural lookup to establish that a particular note exists, and the timeline to establish when an event happened. With `source=all`, a sparse conversation search may append a few public-note results, labelled as supplementary sources.

When a result looks wrong, or two traces disagree, return to the original conversation before tuning the index. An excerpt command reads the lines around a hit directly from the source file. A trace points the way to the original; it never stands in for it.

The same distinction matters for pi-durable: **the embedded selection is not the whole conversation**. Reading a closed snapshot has its own path; embedding follows an explicit admission policy and checkpoints. andenken neither silently opens a live conversation database nor claims to remember every latest turn.

## Who owns the memory?

{{< callout type="info" >}}
**Files are canonical, and a human decides when memory is committed to coherence.** The index is a derived, searchable trace; it does not become the owner of the record. The records belong to the person who left them.
{{< /callout >}}

Session originals live in a separate, private git-annex archive: [agent-config]({{< relref "/projects/agent-config" >}}), the harness configuration repository, owns its storage method, version retrieval and ledger/commit rules, while andenken implements its own gathering, admission, manifests, replication and reader, and builds the derived index. Implementing a reader is neither unlimited permission to read nor a certificate that what it reads is true.

Global publication checkpoints that archive before indexing and checks its source receipt before the index ships. Corpus, manifests and index stay coherent; changed inputs are handled incrementally. This project does not run automatic dreaming or overnight consolidation by default.

**When in doubt, go back to the originals.** Because the session originals are preserved, the sessions search index can be rebuilt from them; if that store ever drifts into something strange, re-embedding from the originals is a real way out. That is a strategic option, not a standing permission: a full re-embedding is paid work and, like global publication, still needs its own human decision.

Depending on the configured provider, embedding uses an external API. **Public source code does not make personal conversation corpora public.** Operators must decide what to collect, what to send to a provider, and what spending to authorize.

**Zero results and retrieval failure are not the same observation.** Index integrity, retrieval behaviour and human usefulness are separate acceptance layers. The [README](https://github.com/junghan0611/andenken#readme) and [change history](https://github.com/junghan0611/andenken/blob/main/CHANGELOG.md) record the implementation and measured boundaries.

## The direction we keep

- **Keep the trace small enough to carry:** prefer a store that can last for years over improvements that cannot be sustained. Improvements are tried within that size; if the sessions store starts to look wrong, the way out is a fresh embedding from the preserved originals, decided by a human.
- **Keep conversation admission explicit:** the sessions index follows a pinned selection policy. Changing what counts as a meaningful human–agent exchange stays a deliberate decision, backed by dry runs and evidence.
- **Let quality follow real work:** perfect retrieval is not today's gate. When quality returns to the front, judge it by timeline-grounded tasks — evidence rank, provenance, diversity and freshness gaps — rather than keyword hits, and ask whether retrieval helped the next decision.
- **Reduce calling-surface gaps:** expose the differences between CLI and Pi reach, and treat tool access for surfaces such as OpenClaw as separate follow-up work. Leave pre-reply recall orchestration, session transport, time coordinates, structural navigation and vocabulary to their owners.
- **Explore source structure:** the disabled Org track remains upstream research. Reactivation or further vocabulary/structure integration requires its own demonstrated need and verification.

These are directions, not completed features or release promises. Repository documents keep concrete next steps and open questions.

## Beside the house that calls siblings

[Entwurf]({{< relref "/projects/entwurf" >}}) opens and addresses independent sibling sessions. Once their **Pi and Claude Code transcripts, and explicitly admitted pi-durable snapshots**, reach the corpus, andenken helps recover **what was decided, and why**, after those sessions have passed. Retrieval is not proof of session resumption or restored identity.

This page is the project's front door. The [steward's note](https://notes.junghanacs.com/botlog/20260319T110800) (in Korean) keeps dated design judgments and boundaries; the [repository](https://github.com/junghan0611/andenken) owns code and reproducible usage. The three surfaces link to one another without copying operational logs or private conversations onto the homepage.
