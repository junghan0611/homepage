# AGENTS.md — homepage (Hugo + hextra)

Project context for AI agents. This repo is the **front gate (대문)** of the junghanacs
universe — the curated, bilingual homepage published at `www.junghanacs.com`.

## What this repo is

`junghan0611/homepage` — a [Hugo](https://gohugo.io) site built on the
[hextra](https://github.com/imfing/hextra) theme (consumed as a Hugo module, not vendored).
Curated long-form + landing surface, including the source-first **Eval** shelf for
reviewed browser computation. The raw, networked digital garden is a **separate** repo
and site; homepage never mirrors it wholesale.

| Repo | Role | Site |
|------|------|------|
| `junghan0611/homepage` (this) | **대문 / blog** — curated, bilingual landing + posts | [junghanacs.com](https://junghanacs.com) (apex canonical; `www` → 301) |
| [`junghan0611/garden`](https://github.com/junghan0611/garden) | **digital garden** — Quartz, raw networked notes | [notes.junghanacs.com](https://notes.junghanacs.com) |

Account consolidation: both moved from the legacy `junghanacs` account to `junghan0611`.
(`junghanacs` is a separate GitHub **user** account, not an organization — `gh api
users/junghanacs` → `"type": "User"`. Do not describe it as an org.) One person, one account. The published **domains stay on `junghanacs.com`**
(bought independently of any host) — `homepage` / `garden` are only repo names, never URLs.

Migration heritage: this repo's history came from `junghanacs/junghanacs.github.io` (now
`oldorg` remote, retained for rollback). Despite the `*.github.io` name, the site was never
GitHub-Pages-served — Netlify always served the domain. The rename to `homepage` removes
that misnomer.

## Workspace files

- **`AGENTS.md`** (this file) — durable baseline. Edit when a rule stabilizes.
- **`NEXT.md`** — disposable session handoff: next concrete move, blockers. Read at
  session start. Graduate stable facts here into AGENTS.md.
- **`ROADMAP.md`** — future direction (manual; not auto-edited).
- **`CHANGELOG.md`** — past / what closed, CalVer (`vYYYY.M.D`) snapshots.
- Branch work uses `NEXT--<branch>.md`, deleted before merging to `main`.

## Identity (public persona — passes the global hook)

One person, one identity, consistent with the garden's JSON-LD `Person` node:

> Junghan Kim (김정한) = GLG (힣) = GLGMAN (힣맨) = the junghanacs gardener.

Public identity links extend to LinkedIn / Bluesky / Mastodon / two GitHub accounts at
most — **never add employer, company, affiliation, or device identifiers** to any public
surface. This repo is public; the global commit/push hook scans added lines under
`junghan0611/*`. The GLG/힣/Junghan Kim persona passes; employer/device/secret is blocked.

## Stack facts

- **SSG**: Hugo extended, pinned to `0.156.0` in `netlify.toml` (hextra's recommended).
  hextra `theme.toml` `min_version` is `0.146.0`; the local Nix Hugo may differ but still
  builds. Keep `netlify.toml` HUGO_VERSION aligned with hextra's recommendation on upgrade.
- **Theme**: hextra via Hugo module — `go.mod` pins the version; upgrade with
  `hugo mod get github.com/imfing/hextra@<ver> && hugo mod tidy`. Do **not** vendor the
  theme.
- **Bilingual**: `en` (default, weight 1) / `ko` (weight 2). In-tree i18n —
  `_index.md` / `_index.ko.md` siblings, not separate content roots.
- **Comments**: remark42 (self-hosted). **Analytics**: Umami (self-hosted) — switched off
  Google Analytics deliberately; do not reintroduce third-party trackers.
- **Content**: `content/{about,blog,cv,docs,eval,meta,projects,talks,temp}`. Eval
  remains Hugo content: its editable browser cells, runtime receipts, corresponding
  source, licenses, and CSP are maintained under `assets/`, `data/eval/`, `static/eval/`,
  and `scripts/`; do not replace this with a separately deployed application or an
  unpublished Clay-rendered document.
- **Presentation**: local Catppuccin Mocha tokens in `assets/css/custom.css` are shared
  by normal Hugo chrome and `assets/css/eval.css`. The custom footer already names
  Hugo + Hextra in its publication stack, so `footer.displayPoweredBy` stays false.
- **Eval engine releases**: Homepage owns and publishes the engine; other sites are
  explicit consumers, never a shared mutable source. `data/eval/engine.json` and
  `docs/eval-engine-contract.md` define immutable, content-addressed releases under
  `static/eval/engine/releases/`. `cell-v1` is frozen compatibility behavior;
  `claim-v1` adds scalar-exact, structured-field, and explicit-fragment assertions
  without mutating it. Run `./run.sh e`; never overwrite a released path. The root
  construction marker was retired only after the production browser gate recorded in
  `dev/eval/receipts/20260912T143700-production-gate.json`; keep that current-tense
  promise tied to the receipt.
- **SICM reading edition**: `/eval/sicm/` publishes the pinned English Preface and
  Chapter 1 beside a Korean reading translation under CC BY-NC-SA 3.0. Exact Org,
  segment hashes, original images, balanced rendering repairs, build-time MathML,
  and computed-view provenance remain separate evidence layers. `./run.sh s` verifies/assembles the
  segmented translation and regenerates Hugo Org pages; never hand-edit generated
  `content/eval/sicm/{preface,chapter-1}*.org`.
- **Verification**: `./run.sh v` is the release gate: it verifies Eval source/runtime
  receipts, builds with Hugo, and verifies rendered URL/source/CSP boundaries. Netlify
  runs the same gate with pinned Hugo `0.156.0`.

## Deploy

- **Netlify only.** Push to `main` → the source/runtime verifier + Hugo production
  build + rendered-output verifier → serves apex `junghanacs.com` (`www` redirects).
  Netlify site id `03636ee7-adf3-4993-af03-75907d1f5d14`, under the `junghanacs`
  Netlify team.
- **No GitHub Actions.** The old `pages.yaml` Pages workflow was removed — never re-add a
  CI build/deploy here; it only causes duplicate (failing) runs.
- The Netlify site's source repo was relinked from `junghanacs.github.io` → this repo, so
  the domain/SSL/env carried over unchanged.

## Git

- `origin = junghan0611/homepage`. `oldorg = junghanacs/junghanacs.github.io` (retained
  for rollback/reference; do not push there).
- Commit via the `commit` skill. No `Generated with Claude` / `Co-Authored-By` trailers.
  GLG pushes. Tag/release via the `tag-release` skill (CalVer, explicit request only).
