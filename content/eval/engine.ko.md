---
title: "엔진 릴리즈"
description: "다른 사이트가 Homepage를 기다리지 않고 채택할 수 있는 불변 evaluator·assertion 계약."
type: eval
translationKey: eval-engine
weight: 5
noindex: true
comments: false
toc: false
runtime: true
engineConformance: true
eyebrow: "Eval / Engine"
---

이 방은 집 밖으로 가져갈 수 있는 부분이다. Homepage는 완결된 불변 릴리즈를 자기
박자로 공개하고, 다른 사이트는 가져갈지와 시점을 스스로 고른다. 배포를 공유하거나
조용히 복사본을 만들 필요가 없다.

## Release 2026.9.12

- [Manifest](/eval/engine/releases/2026.9.12/manifest.json)
- [SHA256SUMS](/eval/engine/releases/2026.9.12/SHA256SUMS)
- [`cell-v1` 동결 evaluator](/eval/engine/releases/2026.9.12/cell-v1.33595f963be56964bb8544401eec19b7d65c5193816826c2da6f372a6c9234f6.js)
- [`claim-v1` assertion module](/eval/engine/releases/2026.9.12/claim-v1.52803ba04b0bd6239e4a80ed2d51d53029cfb4c36a8ddae84e4de2f27e5227f1.js)
- [Conformance fixture](/eval/engine/releases/2026.9.12/conformance-v1.1b1967a47deec8388daeb71f35e463fcac79e8cc16477ad068fb6d20efaba603.json)
- [계약과 채택 경계](https://github.com/junghan0611/homepage/blob/main/docs/eval-engine-contract.md)
- [Homepage candidate-browser 영수증](https://github.com/junghan0611/homepage/blob/main/dev/eval/engine/receipts/20260912T140550-claim-v1-chromium.json)

Manifest는 정확한 Scittle·Emmy 런타임도 고정한다. 모듈 artifact 자체가 압축하지 않은
corresponding source이며 [GPL-3.0-only](/eval/licenses/GPL-3.0.txt)로 공개된다.

## 부분문자열 하나가 아닌 세 가지 주장

### Scalar exact

```js
HomepageEvalClaimV1.assert(0, {
  mode: "scalar-exact",
  expected: "0"
})
```

`0`은 통과하고 `10`, `100`, `0.5`는 실패한다.

### Structured field

```js
HomepageEvalClaimV1.assert(result, {
  mode: "field",
  path: ["figure", "maximum-error"],
  predicate: { op: "lt", expected: 0.00017 }
})
```

맵을 반환하는 셀도 맵 프린터, 키 순서, 무관한 부동소수점 표기를 고정하지 않고 한
필드를 주장할 수 있다. v1 술어는 `exact`, `lt`, `lte`, `gt`, `gte`, `within`이다.

### Explicit fragment

```js
HomepageEvalClaimV1.assert(rendered, {
  mode: "fragment",
  expected: ":days 11.14"
})
```

Fragment matching은 명시적인 호환 선택으로만 남는다.

> Negative control은 시험한 변이 하나가 실패함을 증명할 뿐이다. 그 술어가 모든 거짓
> 결과를 거절한다고 증명하지 않는다.

## 호환 경계

`cell-v1`은 기존 shared state, `String(value)`, substring 동작을 보존한다. 과거 의미를
고쳐 쓰지 않고 바이트를 동결했다. `claim-v1`은 raw value를 받는 별도 assertion
module이며 코드를 실행하거나 페이지를 렌더링하지 않는다.

Fixture는 Node에서 assertion semantics를 증명하고, Homepage는 실제 Scittle keyword
map에 대한 candidate-browser PASS도 기록했다. 채택한 쪽이 자기 DOM·CSP·로딩 순서·가시
상태를 실제 브라우저에서 기록하기 전까지 그쪽 rendering 상태는 **unobserved**다. Scittle 실행은 sandbox가 아니다.
