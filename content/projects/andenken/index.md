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
{{< hextra/hero-button text="Steward's report · 한국어" link="https://notes.junghanacs.com/botlog/20260319T110800.html" >}}
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

Records outlive the index. The session corpus merges admitted files across devices, append-only, with a checksum manifest and roster preserving provenance. The sessions query replica receives **index, manifests and corpus** together. Neither one machine's storage nor one model's context window should become the owner of memory.

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

The same distinction matters for pi-durable: **the embedded selection is not the whole conversation**. Reading a closed snapshot has its own path; embedding follows an explicit admission policy and checkpoints. andenken neither silently opens a live conversation database nor claims to remember every latest turn.

## Who owns the memory?

{{< callout type="info" >}}
**Files are canonical, and a human decides when memory is committed to coherence.** The index does not become the owner of the record. Corpus, manifests and index stay coherent; changed inputs are handled incrementally. Full re-embedding and global publication require separate decisions. This project does not run automatic dreaming or overnight consolidation by default.
{{< /callout >}}

Depending on the configured provider, embedding uses an external API. **Public source code does not make personal conversation corpora public.** Operators must decide what to collect, what to send to a provider, and what spending to authorize.

**Zero results and retrieval failure are not the same observation.** Index integrity, retrieval behaviour and human usefulness are separate acceptance layers. The [README](https://github.com/junghan0611/andenken#readme) and [change history](https://github.com/junghan0611/andenken/blob/main/CHANGELOG.md) record the implementation and measured boundaries.

## The direction we keep

- **Refine acceptance around timeline-grounded work:** evaluate evidence rank, provenance, diversity and freshness gaps in real tasks, beyond keyword hits, and ask whether retrieval helped the next decision.
- **Codify conversation admission:** make the selection of meaningful human–agent exchanges clearer through dry runs and evidence.
- **Reduce calling-surface gaps:** expose the differences between CLI and Pi reach, and treat tool access for surfaces such as OpenClaw as separate follow-up work. Leave pre-reply recall orchestration, session transport, time coordinates, structural navigation and vocabulary to their owners.
- **Explore source structure:** the disabled Org track remains upstream research. Reactivation or further vocabulary/structure integration requires its own demonstrated need and verification.

These are directions, not completed features or release promises. Repository documents keep concrete next steps and open questions.

## Beside the house that calls siblings

[Entwurf](/projects/entwurf/) opens and addresses independent sibling sessions. Once their **Pi and Claude Code transcripts, and explicitly admitted pi-durable snapshots**, reach the corpus, andenken helps recover **what was decided, and why**, after those sessions have passed. Retrieval is not proof of session resumption or restored identity.

This page is the project's front door. The [steward's report](https://notes.junghanacs.com/botlog/20260319T110800.html) (in Korean) keeps dated design judgments and boundaries; the [repository](https://github.com/junghan0611/andenken) owns code and reproducible usage. The three surfaces link to one another without copying operational logs or private conversations onto the homepage.
