---
title: "SICM — An Executable Reading Edition"
description: "The preface and first chapter in English and Korean, with pinned sources and computation-derived views."
type: eval
translationKey: "sicm-index"
comments: false
toc: false
sidebar:
  exclude: true
runtime: true
eyebrow: "Eval / SICM Reading Edition"
---

Read *Structure and Interpretation of Classical Mechanics* where its central claim can
run in the browser. This shelf begins with the **complete preface and Chapter 1**, in the
English source text and a Korean reading translation.

- [Preface — English original](/eval/sicm/preface/)
- [Chapter 1: Lagrangian Mechanics — English original](/eval/sicm/chapter-1/)
- [한국어 읽기 번역](/ko/eval/sicm/)

Every reading page names the exact upstream revision and exposes both its corresponding
Org source and adaptation status. The prose, translation, and Homepage computation are
distinct evidence layers.

## One sentence, one calculation

> “Classical mechanics is deceptively simple.”
>
> — Gerald Jay Sussman and Jack Wisdom, *Structure and Interpretation of Classical
> Mechanics*, 2nd edition

{{< eval-cell id="sicm-harmonic" >}}

For the path `q = cos(t)` with `m = k = 1`, the Euler–Lagrange residual evaluates to
exactly zero. Chapter 1 continues from this scalar receipt to a computation-derived view
of Figure 1.1.

{{< eval-attribution rail="sicm" >}}
