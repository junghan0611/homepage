---
title: "Proto — Browser Experiment"
description: "The smallest contract for editable browser evaluation cells."
type: eval
comments: false
toc: false
sidebar:
  exclude: true
runtime: true
eyebrow: "Eval / Proto"
---

The smallest contract for an editable browser cell: source, run state, result, and an
error that stays in place.

## Shared evaluation context

Run these cells in order. A definition made in one cell remains available to the next;
the deliberate error stays local instead of taking down the page.

{{< eval-cell id="proto-arithmetic" >}}

{{< eval-cell id="proto-definition" >}}

{{< eval-cell id="proto-shared-state" >}}

{{< eval-cell id="proto-error-state" >}}

## Emmy in the same local runtime

The runtime is the same pinned, self-hosted bundle used by the canary. No CDN script is
loaded.

{{< eval-cell id="proto-emmy" >}}
