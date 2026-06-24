[![Netlify Status](https://api.netlify.com/api/v1/badges/03636ee7-adf3-4993-af03-75907d1f5d14/deploy-status)](https://app.netlify.com/projects/junghanacs/deploys)

# homepage — junghanacs.com

> **Meditations on Knowledge and Knowing** — the front gate (대문) of the junghanacs
> universe. Curated, bilingual, publishing-grade. The raw digital garden lives next door
> at [`junghan0611/garden`](https://github.com/junghan0611/garden) →
> [notes.junghanacs.com](https://notes.junghanacs.com).

🔗 **Live:** https://www.junghanacs.com

## Stack

| Layer | Choice |
|---|---|
| SSG | [Hugo](https://gohugo.io) `0.156.0` (extended) |
| Theme | [hextra](https://github.com/imfing/hextra) `v0.12.3` (Hugo module) |
| Languages | bilingual — `en` (default) / `ko`, in-tree i18n |
| Comments | [remark42](https://remark42.com) (self-hosted) |
| Analytics | [Umami](https://umami.is) (self-hosted) |
| Host | Netlify → `www.junghanacs.com` |

## Develop

```bash
hugo mod get -u            # update theme module
hugo server -D             # http://localhost:1313  (-D = include drafts)
hugo --gc --minify         # production build → ./public
```

Hugo is pinned to `0.156.0` in `netlify.toml` (matches hextra's recommended version).
The local Nix-provided Hugo may differ; hextra `theme.toml` `min_version` is `0.146.0`.

## Structure

```
content/        about · blog · cv · docs · meta · projects · talks   (en + .ko in-tree)
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
trigger a Netlify build that serves `www.junghanacs.com`. No GitHub Actions — deploy is
Netlify-only.
