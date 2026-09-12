# Eval engine release contract

Status: `2026.9.12` first immutable release surface.
Authority: `data/eval/engine.json` + content-addressed source bytes.

## Ownership and cadence

Homepage publishes the engine on its own cadence. A consumer imports an exact release;
it does not wait for, coordinate with, or silently fork Homepage. Adoption is explicit:
manifest path, artifact hash, runtime pin, license, and conformance fixture travel
together. A consumer can remain on an old release indefinitely.

## Separate contracts

1. **Runtime** — Scittle and Emmy bytes, package integrity, SBOM, and licenses.
2. **Evaluator (`cell-v1`)** — reads a cell, evaluates it in page-lifetime shared SCI
   state, renders `String(value)`, and applies its legacy assertion behavior.
3. **Assertion (`claim-v1`)** — receives the raw value and a claim; it neither evaluates
   code nor renders DOM.
4. **View** — prose, cell chrome, plots, and accessible output.
5. **Observation** — Node conformance proves assertion semantics. Only a real browser
   observation proves rendering and browser/runtime correspondence.

These boundaries are versioned independently. `claim-v1` does not mutate `cell-v1`.

## Immutable release

`/eval/engine/releases/2026.9.12/manifest.json` names content-addressed artifacts. Rules:

- never replace bytes at a released path;
- never delete an artifact referenced by a release manifest;
- publish a new release directory for any semantic or byte change;
- corresponding source is the unminified artifact itself;
- verify the artifact SHA-256 before import;
- pin the runtime manifest named by the engine manifest;
- do not infer compatibility from an unversioned page URL or from the discovery feed.

The build refuses to overwrite a mismatching release artifact. `SHA256SUMS` covers the
modules and conformance fixture. The release manifest is deterministic and protected by
the repository commit that publishes it.

## Release identifiers

An engine release id is `YYYY.M.D` with an optional same-day follow-up `-<label>.<n>`.
Month and day have no leading zero. `label` is `[a-z][a-z0-9-]*`. `n` is an integer ≥ 1
with no leading zero. Examples: `2026.9.12`, `2026.9.12-fix.1`, `2026.9.12-docs.2`.

`n` is that date's running follow-up number, not a per-label counter. After `-fix.1`, a
documentation follow-up is `-docs.2`, not `-docs.1`. Git tags may restart `.1` on each
label (`-fix.1`, `-cleanup.1`); engine release ids do not. The feed has to name an order,
so this promise is narrower than the tag convention.

Sort is deterministic:

1. `(year, month, day)` numerically;
2. on the same date, the bare id precedes any suffix — the bare id is the original, the suffix a follow-up;
3. suffixes compare `n` numerically, so `-fix.2` precedes `-fix.10`;
4. if `n` also matches, `label` compares as ASCII.

Step 3 is first among suffixes because `n` is the running order: the sort then matches
publication order, and `latest` is the most recent release. Step 4 is only a tie-breaker;
a valid ledger never has two follow-ups with the same `n` on the same day. The build
rejects duplicate or gapped `n` on a date.

`latest` is the last id in that order. A same-day follow-up such as `2026.9.12-fix.1` is
normal: immutability forbids overwriting a released directory, not creating a new one.

A release id and a git tag are different axes. Tags snapshot the repository
(`vYYYY.M.D[-suffix]`). Release ids address immutable engine artifacts. They share a
house convention, not a derivation. They may differ on the same day.

## Discovery is not compatibility

`/eval/engine/releases.json` lists published releases. It is a mutable projection of the
release-directory ledger, kept outside `/eval/engine/releases/*` so it does not receive
the immutable cache. `latest` is a convenience for humans and watchers. It is not a
compatibility promise and not an instruction to auto-adopt.

The feed guarantees discovery and manifest-byte correspondence: the listed ids exist, and
each `manifestSha256` matches the bytes at that release's manifest path. `releases[]` is
in publication order, oldest first. A consumer answers whether anything is newer than an
adopted id from that id's array position: later entries are newer. Reimplementing the
release-id grammar is not required. `latest` is always the last array element. Because
the feed is append-only, a previously observed position is never displaced by an
insertion in front of it. The sort rules under Release identifiers are how the publisher
builds that order, not a procedure a consumer must follow. The feed does not guarantee
compatibility between releases, that a consumer should run `latest`, or that a
consumer's rendering matches Homepage's observation.

Adoption still closes on an exact manifest path, artifact hashes, the runtime pin named
by that manifest, and a vendored conformance fixture. The prohibition on inferring
compatibility from an unversioned page URL forbids compatibility inference. It does not
forbid using the feed to find a published id.

## `cell-v1` frozen behavior

`cell-v1` preserves compatibility rather than retroactively strengthening claims:

- one shared Scittle state for the lifetime of the page;
- output is `String(value)`;
- `data-expected` uses substring matching;
- expected errors are visible states.

Those bytes remain available forever. New claim surfaces should call `claim-v1` with the
raw evaluator return value instead of treating `cell-v1` substring success as stronger
evidence.

## `claim-v1`

Browser global: `HomepageEvalClaimV1`.

```js
const result = HomepageEvalClaimV1.assert(value, claim)
// { pass, mode, code, reason?, actual?, expected?, ... }
```

A failed assertion returns `pass: false`; an invalid contract returns
`code: "invalid-claim"`. It does not throw across the public API.

### 1. Scalar exact

The default for an in-sentence scalar claim. Both values are converted with `String`,
Unicode-normalized to NFC, and trimmed. Collections and functions are rejected.

```json
{"mode":"scalar-exact","expected":"0"}
```

`0` passes. `10`, `100`, and `0.5` fail.

### 2. Structured field

The claim identifies a non-empty key/index path and a predicate. Paths traverse plain
objects, arrays, JavaScript Maps, and ClojureScript associative collections with keyword
keys when `cljs.core` is present.

```json
{
  "mode":"field",
  "path":["figure","maximum-error"],
  "predicate":{"op":"lt","expected":0.00017}
}
```

Operators:

- `exact` — normalized scalar equality;
- `lt`, `lte`, `gt`, `gte` — finite-number comparison;
- `within` — absolute numeric error no greater than non-negative `tolerance`.

A missing path is an invalid claim, never a silent mismatch against the printed map.

### 3. Explicit fragment

Compatibility mode for claims intentionally made against a rendered fragment.

```json
{"mode":"fragment","expected":":days 11.14"}
```

The expected fragment must be non-empty. Fragment is never an implicit default in
`claim-v1`.

## Negative controls

A negative control proves only that the tested mutation fails. It does not prove the
strength of the predicate and cannot establish that every false result fails. Each claim
mode therefore carries adversarial fixtures suited to its own semantics: prefix/suffix
numbers for scalar equality, wrong selected fields for structured claims, and missing
fragments for fragment mode.

## Conformance and browser boundary

`dev/eval/engine/conformance-v1.json` is published byte-for-byte with the release. The
Node verifier covers all three modes, nested and array paths, a simulated ClojureScript
keyword map, and negative controls. This is evaluator/assertion evidence only.

Homepage's candidate-browser receipt is
`dev/eval/engine/receipts/20260912T140550-claim-v1-chromium.json`; the deployed gate is
`dev/eval/receipts/20260912T143700-production-gate.json`. The first real-map
observation retired a pre-release assumption that `cljs.core` was exported globally;
the released module instead uses the map-compatible `get`/`forEach` surface actually
observed on Scittle's returned ClojureScript collection.

An adopter still owes a browser receipt for its own DOM, loading order, CSP, runtime
bytes, and visible PASS/FAIL states. “Unobserved” is the correct rendering status until
that receipt exists.

## Security boundary

Scittle evaluates code in the page. This release is not a sandbox and `claim-v1` adds no
isolation. Persistence, origin isolation, capability control, and agent communication
require separate contracts.
