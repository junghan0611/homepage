# SICM Chapter 1 Korean reading translation — cross-review receipt

Date: 2026-09-12
Scope: pinned English `chapter001.org` lines `[1,6379)` against all five Korean
translation segments. Each segment was reviewed by a model that did not draft it.
Reviewers ignored stylistic preference and checked meaning reversal, omission,
mistranslation, and chapter-level terminology. Structural checks remain the job of
`scripts/build-sicm-translation.py`.

| Source range | Independent reviewer | Result applied |
|---|---|---|
| `[1,815)` | Claude Opus | 4 meaning blockers, 6 clarity defects, and terminology normalization |
| `[815,1539)` | GPT-5.6 Terra | PASS; no meaning defect found |
| `[1539,3244)` | Grok 4.6 | 5 meaning or direction defects |
| `[3244,6379)` | GLM 5.3 | 2 ambiguities and chapter-level terminology normalization |

## Applied meaning corrections

- EN 170–174 / KO segment 00-04 lines 130–132: restored the double-pendulum
  attachment chain.
- EN 522–523 / KO 423: made `/Dq/` the name of the coordinate-path derivative,
  rather than a path differentiated twice.
- EN 734–737 / KO 621–623: separated the minimization procedure from the action
  it computes.
- EN 439–441 / KO 348–350: made the ray, not the source, traverse Fermat's path.
- EN 19, 33–34, 279–281, 314, 511–513, 583–585: clarified eclipse scope, stiff
  forces, discontinuous motion, aggregation, one-argument literal functions, and
  the coordinate representation of a Lagrangian.
- EN 1694 / KO segment 06 line 141: restored “nothing more than” in the reduction
  to `F=ma`.
- EN 2218, 2336, 3101, 3191 / KO 598, 694, 1366, 1445: interpreted negation of
  centrifugal potential as a minus sign; corrected `blob` to a drawn mass; made
  pivot acceleration additive; restored the direction `G = D_t F` in Exercise 1.28.
- EN 5084 and 5707–5708 / KO segment 10-12 lines 305 and 886: distinguished the
  upper panel of Figure 1.9 and the `m_2` bob from the Korean word “addition.”

## Chapter terminology ledger

- rectangular coordinates → `직교 좌표`
- evolution / evolve → `전개`
- plumb line → `연직선`
- center of mass → `질량중심`
- colatitude → `여위도`
- Foucault pendulum → `푸코 진자`
- point mass → `질점`
- radial momentum → `방사 운동량`
- four-bar linkage → `4절 링크 기구(four-bar linkage)`

## Boundary

This receipt establishes complete independent review by source segment, not endorsement
by the original authors or publisher. It does not make the Korean text an official
translation. Corrections remain welcome through the source and segment receipts.
