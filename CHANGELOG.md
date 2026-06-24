# Changelog

CalVer snapshots (`vYYYY.M.D[-suffix]`) of the homepage repo. Past tense — what closed.
`NEXT.md` holds what's next; `ROADMAP.md` holds where it's going.

## Unreleased

## v2026.6.24 — homepage 이주 + 문서 세트

### Migration — junghanacs.github.io → junghan0611/homepage

- Created `junghan0611/homepage` (public) on the personal account; pushed full history.
- Remotes: `origin` → homepage, `oldorg` → `junghanacs/junghanacs.github.io` (retained for
  rollback).
- Relinked the Netlify site source repo from `junghanacs.github.io` → `homepage`; domain,
  SSL, and env carried over. `www.junghanacs.com` now builds from the new repo.
- Removed `.github/workflows/pages.yaml` — deploy is Netlify-only, no GitHub Actions.

### Tooling / docs

- Upgraded hextra `v0.12.1 → v0.12.3` (Hugo module); bumped `netlify.toml` HUGO_VERSION
  `0.152.2 → 0.156.0` to match hextra's recommended version.
- `docs(about)`: callout emoji + details color style.
- Converted `README.org` → `README.md`; added the Netlify deploy-status badge.
- Established the agent doc set: `AGENTS.md`, `NEXT.md`, `ROADMAP.md`, `CHANGELOG.md`.

## Pre-CalVer — junghanacs.github.io heritage

Milestones from before the personal-account migration (history preserved on `oldorg`):

- **Blog v0.1 revival** — English default, bilingual `en`/`ko`, remark42 comments.
- Google / Naver Search Console verification; `robots.txt` (Allow + Sitemap).
- GLG-Mono font; hextra upgrades `v0.11.x → v0.12.x`.
- Analytics: Google Analytics → self-hosted Umami.
- Nix flake dev environment; blog ↔ digital-garden split.
- Initial migration onto Hugo + hextra.
