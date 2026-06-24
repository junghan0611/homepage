# ROADMAP.md — homepage

Future direction. Manual, intentionally loose — `NEXT.md` holds the concrete next move;
this holds where the front gate is heading. Not a commitment, a compass.

## Now (this cycle)

- Finish the `junghanacs.github.io → homepage` cutover and settle on Netlify under the
  personal account. Archive the old org repo once trusted.

## Near

- **Content surface**: shape `blog` / `talks` / `projects` / `cv` into a coherent landing
  experience. Decide what the 대문 actually presents first (latest writing? identity? a map
  to the garden?).
- **Bilingual parity**: audit `en` ↔ `ko` coverage; the default is `en` but the author
  works in `ko` — keep both first-class, not one a stub.
- **Garden ↔ homepage link tissue**: deliberate cross-links between curated posts here and
  raw notes at `notes.junghanacs.com`. The two sites are one universe.
- Migrate deprecated `tabs` shortcode usages to the `name` / `selected` API.

## Later

- **Design pass**: GLG-Mono typography, custom SCSS, identity-consistent visual language
  shared with the garden.
- **JSON-LD / SEO**: align the `Person` / `WebSite` structured data with the garden's
  identity graph so both sites describe the same person node.
- **Self-host question**: the garden defers Netlify→Oracle to post-stable; homepage can
  follow the same path *later*, independently. One variable at a time — do not bundle a host
  swap with a content or theme change.

## Non-goals

- No GitHub Actions / Pages deploy — Netlify is the single deploy path.
- No third-party analytics/trackers — Umami self-host only.
- No employer / company / device identifiers on any public surface.
