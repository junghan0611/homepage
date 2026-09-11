[![Netlify Status](https://api.netlify.com/api/v1/badges/03636ee7-adf3-4993-af03-75907d1f5d14/deploy-status)](https://app.netlify.com/projects/junghanacs/deploys)

# homepage — junghanacs.com

> **Authology** — the curated, bilingual front gate (대문) of the junghanacs universe.
> It publishes independent writing and the source-first **Eval** shelf; the raw, networked
> digital garden remains next door at [`junghan0611/garden`](https://github.com/junghan0611/garden)
> → [notes.junghanacs.com](https://notes.junghanacs.com).

🔗 **Live:** https://junghanacs.com (`www` redirects to the apex)

## Stack

| Layer | Choice |
|---|---|
| SSG | [Hugo](https://gohugo.io) `0.156.0` (extended) |
| Theme | [hextra](https://github.com/imfing/hextra) `v0.12.3` (Hugo module), locally styled with Catppuccin Mocha |
| Languages | bilingual — `en` (default) / `ko`, in-tree i18n |
| Eval | Hugo content with a self-hosted, hash-pinned browser runtime; source, licenses, SBOM, and CSP travel with it |
| Comments | [remark42](https://remark42.com) (self-hosted) |
| Analytics | [Umami](https://umami.is) (self-hosted; omitted from Eval) |
| Host | Netlify → `junghanacs.com` (apex canonical) |

## Develop

```bash
./run.sh 1                 # source/runtime receipts, then Hugo dev server on :2341
./run.sh v                 # release gate: receipts + production build + rendered-output graph
hugo mod get -u            # update the Hugo module deliberately
```

Hugo is pinned to `0.156.0` in `netlify.toml` (matches hextra's recommended version).
`./run.sh v` is the deployment contract: it verifies the self-hosted Eval runtime,
corresponding source, URL graph, CSP boundary, and rendered Hugo output. The local
Nix-provided Hugo may differ; hextra `theme.toml` `min_version` is `0.146.0`. Use the
pinned binary for an exact release check when necessary.

## Structure

```
content/        about · blog · cv · docs · eval · meta · projects · talks   (en + .ko in-tree)
data/eval/      reviewed browser-cell, runtime, rail, and license declarations
assets/         shared Catppuccin/GLG Mono CSS and the evaluator source
static/eval/    self-hosted runtime bundles, notices, manifest, and SBOM
scripts/        runtime and rendered-output verification gates
hugo.yaml       site config (baseURL, languages, modules, menus)
netlify.toml    build command + HUGO_VERSION / NODE_VERSION
go.mod / go.sum hextra module pin
```

## Agent docs

| File | Role |
|---|---|
| `AGENTS.md` | durable baseline — what this repo is, stack facts, invariants |
| `NEXT.md` | disposable session handoff — next concrete move |
| `ROADMAP.md` | future direction (manual) |
| `CHANGELOG.md` | past — what closed, CalVer snapshots |

## Deploy

Pushes to `main` on [`junghan0611/homepage`](https://github.com/junghan0611/homepage)
trigger Netlify's source/runtime verification → Hugo build → rendered-output verification
pipeline, serving `junghanacs.com`. No GitHub Actions — deploy is Netlify-only.

## History

This repo was migrated from
[`junghanacs/junghanacs.github.io`](https://github.com/junghanacs/junghanacs.github.io)
→ `junghan0611/homepage`. The move consolidates development and deployment repos under
the `junghan0611` account for consistency. The old repo is being set to **ARCHIVE** and
is no longer the source of truth — all source, edit, and deploy links now point here.
