---
title: "Engine Releases"
description: "Immutable evaluator and assertion contracts that another site can adopt without waiting for Homepage."
type: eval
translationKey: eval-engine
weight: 5
comments: false
toc: false
runtime: true
engineConformance: true
eyebrow: "Eval / Engine"
---

This is the part that may leave the house. Homepage publishes complete, immutable
releases; another site chooses if and when to import one. No shared deployment and no
silent copy are required.

{{< eval-engine-release >}}

- [Contract and adoption boundary](https://github.com/junghan0611/homepage/blob/main/docs/eval-engine-contract.md)
- [Homepage candidate-browser receipt](https://github.com/junghan0611/homepage/blob/main/dev/eval/engine/receipts/20260912T140550-claim-v1-chromium.json)
- [Production browser gate](https://github.com/junghan0611/homepage/blob/main/dev/eval/receipts/20260912T143700-production-gate.json)

The manifest also pins the exact Scittle and Emmy runtime. The module artifacts are their
own unminified corresponding source and are released under
[GPL-3.0-only](/eval/licenses/GPL-3.0.txt).

## Three claims, not one substring

### Scalar exact

```js
HomepageEvalClaimV1.assert(0, {
  mode: "scalar-exact",
  expected: "0"
})
```

`0` passes; `10`, `100`, and `0.5` fail.

### Structured field

```js
HomepageEvalClaimV1.assert(result, {
  mode: "field",
  path: ["figure", "maximum-error"],
  predicate: { op: "lt", expected: 0.00017 }
})
```

A cell returning a map can claim one field without freezing the map printer, key order,
or unrelated floating-point formatting. `exact`, `lt`, `lte`, `gt`, `gte`, and `within`
are the v1 predicates.

### Explicit fragment

```js
HomepageEvalClaimV1.assert(rendered, {
  mode: "fragment",
  expected: ":days 11.14"
})
```

Fragment matching survives only as an explicit compatibility choice.

> A negative control proves that one tested mutation fails. It does not prove that the
> predicate rejects every false result.

## Compatibility boundary

`cell-v1` keeps the existing shared-state, `String(value)`, and substring behavior. Its
bytes are frozen rather than rewritten. `claim-v1` is a separate assertion module that
operates on the raw value; it does not evaluate code or render a page.

The fixture proves assertion semantics in Node. Homepage records candidate and production-browser
PASS against real Scittle keyword maps. An adopter’s rendering remains **unobserved** until it records its own real-browser receipt for its DOM, CSP, load order, and visible states.
Scittle evaluation is not a sandbox.
