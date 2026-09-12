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
| Eval | Homepage-owned engine: Hugo content plus hash-pinned runtime; immutable releases under `static/eval/engine/releases/`; consumers adopt an exact release. Contract: `docs/eval-engine-contract.md` |
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
data/eval/      reviewed browser-cell, runtime, rail, engine spec, and license declarations
assets/         shared Catppuccin/GLG Mono CSS and the evaluator source
static/eval/    self-hosted runtime bundles, notices, manifest, and SBOM
static/eval/engine/releases/  immutable content-addressed engine releases
docs/           public contracts (eval engine, SICM reading, JSON-LD)
dev/            receipts and translation working surface; not public HTML
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
| `docs/eval-engine-contract.md` | engine ownership, immutable releases, discovery vs compatibility |
| `docs/sicm-reading-contract.md` | SICM reading edition |
| `docs/semantic-jsonld.md` | JSON-LD identity layer |

## Deploy

Pushes to `main` on [`junghan0611/homepage`](https://github.com/junghan0611/homepage)
trigger Netlify's source/runtime verification → Hugo build → rendered-output verification
pipeline, serving `junghanacs.com`. No GitHub Actions — deploy is Netlify-only.

## Links

- **Homepage**: https://junghanacs.com — this site (`www` redirects to the apex)
- **Digital Garden**: https://notes.junghanacs.com
- **Dashboard**: https://agenda.junghanacs.com — geworfen, existence-data
- **AX Record**: https://ax.junghanacs.com
- **AIONS CLUBS**: https://aionsclubs.org — B's residence (`www` redirects to the apex).
  Adjacent project with its own editorial voice; the first external adopter of the Eval
  engine published here, pinned to an exact release
- **Zotero Library**: https://www.zotero.org/groups/5570207/junghanacs/library
- **GitHub**: https://github.com/junghan0611
- **Substack**: https://junghankim151502.substack.com
- **Threads**: [@junghanacs](https://www.threads.net/@junghanacs) ·
  **Bluesky**: [junghanacs.bsky.social](https://bsky.app/profile/junghanacs.bsky.social) ·
  **Mastodon**: [@junghanacs](https://fosstodon.org/@junghanacs) ·
  **LinkedIn**: [junghan-kim](https://www.linkedin.com/in/junghan-kim-1489a4306)

The machine-readable version of this list, with the authority of each surface stated, is
[`/llms.txt`](https://junghanacs.com/llms.txt).

## Acknowledgments

- [Hugo](https://gohugo.io) and [hextra](https://github.com/imfing/hextra) by imfing — the
  theme is consumed as a Hugo module, never vendored
- [Catppuccin](https://catppuccin.com) Mocha — local palette tokens
- [Scittle](https://github.com/babashka/scittle) and [Emmy](https://github.com/mentat-collective/emmy)
  — the self-hosted, hash-pinned browser runtime behind the Eval shelf
- *Structure and Interpretation of Classical Mechanics* by Gerald Jay Sussman and Jack
  Wisdom. The reading edition is built from the pinned Org source at
  [mentat-collective/sicm-book](https://github.com/mentat-collective/sicm-book), with
  [tgvaughan's HTML port](https://tgvaughan.github.io/sicm) as the canonical reference

## License

| Layer | License |
|---|---|
| Original writing (`/blog/`, `/about/`, and the curated pages) | CC BY-NC-SA 4.0 — same terms as the digital garden |
| Repository code | MIT — see [`LICENSE`](LICENSE); the hextra starter scaffolding's notice is retained beside this site's own |
| Eval engine releases | GPL-3.0-only — the unminified artifact is its own corresponding source ([`/eval/licenses/GPL-3.0.txt`](https://junghanacs.com/eval/licenses/GPL-3.0.txt)) |
| SICM reading edition | CC BY-NC-SA 3.0, inherited from the pinned upstream source |
| Bundled runtime components | Apache-2.0 · BSD-2-Clause · EPL-1.0 · MIT — receipts at [`/javascript/`](https://junghanacs.com/javascript/) and [`/eval/runtime/sbom.json`](https://junghanacs.com/eval/runtime/sbom.json) |

## History

This repo was migrated from
[`junghanacs/junghanacs.github.io`](https://github.com/junghanacs/junghanacs.github.io)
→ `junghan0611/homepage`. The move consolidates development and deployment repos under
the `junghan0611` account for consistency. The old repo is being set to **ARCHIVE** and
is no longer the source of truth — all source, edit, and deploy links now point here.
