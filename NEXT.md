# NEXT.md — homepage

Disposable handoff. Read at session start. `AGENTS.md` holds durable facts; this holds the
live plan and the next concrete move.

## NOW — the next concrete move

**Migration to `junghan0611/homepage` is functionally complete** — repo created, history
pushed, Netlify relinked to the new repo, build green, `www.junghanacs.com` serving from
here. The remaining moves are cleanup, not blockers:

1. **Rename the local folder** `~/repos/gh/blog` → `~/repos/gh/homepage` (GLG does this last,
   once confident — no git impact, only the working-dir name).
2. **Verify the live cutover** — confirm a fresh deploy of `www.junghanacs.com` reflects a
   commit that only exists on `junghan0611/homepage` (e.g. this doc set), proving Netlify
   builds from the new repo, not the old one.
3. **Decide `oldorg` fate** — `junghanacs/junghanacs.github.io` is kept as a rollback safety
   net. Archive it on GitHub once the cutover is trusted for a while; keep the `oldorg`
   remote locally regardless.

## Verify

```bash
git remote -v                       # origin=homepage, oldorg=junghanacs.github.io
hugo --gc --minify                  # local prod build sanity
curl -sI https://www.junghanacs.com | grep -i server   # Netlify serving
```

## Blockers / open decisions

- **Domain timing vs garden**: `notes.junghanacs.com` (garden) still points at the
  `junghanacs/notes.junghanacs.com` repo and is mid-migration to `junghan0611/garden`. That
  is a *separate* Netlify site — homepage cutover does not touch it. Do not remove the
  `junghanacs` org connection until garden's own migration lands.
- **Build WARN (non-blocking)**: `tabs` shortcode `items` / `defaultIndex` params are
  deprecated → use `name` on `tab` / `selected`. Content-side fix, not theme-version. Find
  and migrate the offending pages when convenient.

## Done

- hextra `v0.12.1 → v0.12.3`; `netlify.toml` HUGO `0.152.2 → 0.156.0` (hextra recommended).
- about page: callout emoji + details color style.
- **Repo migration**: created `junghan0611/homepage` (public); `origin` → homepage,
  `oldorg` → junghanacs.github.io (retained); full history pushed.
- Removed `.github/workflows/pages.yaml` — Netlify-only deploy, no GitHub Actions.
- Netlify site source repo relinked junghanacs.github.io → homepage; domain/SSL/env
  carried over; build green.
- Doc set established: `README.md` (was `README.org`), `AGENTS.md`, `NEXT.md`,
  `ROADMAP.md`, `CHANGELOG.md`.
