# AGENTS.md — homepage (Hugo + hextra)

Project context for AI agents. This repo is the **front gate (대문)** of the junghanacs
universe — the curated, bilingual homepage published at `www.junghanacs.com`.

## What this repo is

`junghan0611/homepage` — a [Hugo](https://gohugo.io) site built on the
[hextra](https://github.com/imfing/hextra) theme (consumed as a Hugo module, not vendored).
Curated long-form + landing surface. The raw, networked digital garden is a **separate**
repo and site.

| Repo | Role | Site |
|------|------|------|
| `junghan0611/homepage` (this) | **대문 / blog** — curated, bilingual landing + posts | [www.junghanacs.com](https://www.junghanacs.com) |
| [`junghan0611/garden`](https://github.com/junghan0611/garden) | **digital garden** — Quartz, raw networked notes | [notes.junghanacs.com](https://notes.junghanacs.com) |

Account consolidation: both moved from the `junghanacs` org to the `junghan0611` personal
account. One person, one account. The published **domains stay on `junghanacs.com`**
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
- **Content**: `content/{about,blog,cv,docs,meta,projects,talks,temp}`.

## Deploy

- **Netlify only.** Push to `main` → Netlify build (`hugo --gc --minify`) → serves
  `www.junghanacs.com`. Netlify site id `03636ee7-adf3-4993-af03-75907d1f5d14`, under
  the `junghanacs` Netlify team.
- **No GitHub Actions.** The old `pages.yaml` Pages workflow was removed — never re-add a
  CI build/deploy here; it only causes duplicate (failing) runs.
- The Netlify site's source repo was relinked from `junghanacs.github.io` → this repo, so
  the domain/SSL/env carried over unchanged.

## Git

- `origin = junghan0611/homepage`. `oldorg = junghanacs/junghanacs.github.io` (retained
  for rollback/reference; do not push there).
- Commit via the `commit` skill. No `Generated with Claude` / `Co-Authored-By` trailers.
  GLG pushes. Tag/release via the `tag-release` skill (CalVer, explicit request only).
