# NEXT — sicm-reading-edition

Branch-only handoff. Delete this file before merging to `main`.

# RAIL — 현재 좌표

- [x] **1. Preface + Chapter 1 영·한 읽기판과 고정 원본**
- [x] **2. Emmy Figure 1.1 + MathML + candidate Chromium 영수증**
- [ ] **3. branch 검토·merge·push** ← CURRENT: GLG 승인 대기
- [ ] **4. production 관측 뒤 대문 공사중 표식 철거** ← PAUSED: 배포 전

현재 좌표: 읽기판·candidate 검증 완료 → merge/push 승인 대기 → production gate 뒤 표식 철거

# NOW — SICM reading edition 출하

- Current: `sicm-reading-edition`은 `main`보다 9 commits 앞서며 `./run.sh v` 통과.
- Next: GLG가 승인하면 branch NEXT를 삭제하고 main에 merge한 뒤, 별도 push 명령이 있을
  때만 push한다. 배포 뒤 실제 브라우저에서 EN/KO Chapter 1, Figure 1.1 PASS·80 SVG
  points·`book-bound=true`, MathML, CSP를 관측한다.
- Blocker: push 권한 요청과 그 뒤 Netlify production 배포.
- Read: `dev/eval/sicm/translation/REVIEW.md`,
  `dev/eval/sicm/receipts/20260912T133900-figure-1-1-chromium.json`, `data/eval/sicm.json`.
- Do not touch: unrelated untracked `content/blog/20260804T094556{,.ko}.md`; generated
  `content/eval/sicm/{preface,chapter-1}*.org` 직접 편집 금지; production browser receipt
  전 `content/_index{,.ko}.md`의 공사중 표식 철거 금지.

# RECENT

- 2026-09-12: pinned SICM Preface + Chapter 1 English source, original 11 images, and complete
  Korean reading translation shipped into the branch. Independent cross-review covered every
  source segment and its corrections are recorded.
- 2026-09-12: Hugo build-time KaTeX→MathML rendered 512 Chapter 1 formulas per language with no
  browser math script. Emmy `find-path` Figure 1.1 passed in Chromium at max error
  `0.00016772069029036274 < 0.00017` and produced an 80-point SVG. Receipt scope is local
  candidate only, not production.
