# About this folder

Snapshot of the Pepsoma design system, extracted from `store/styles.css` and `store/css/base.css` (commit 255019e, then `--faint` darkened in a2bd1a1). The live, editable copy is the Claude "Design System" artifact: https://claude.ai/artifact/7pM4NoR1HUKrQH1GkWhzvP

- Start with `README.md` (brand rules), then `tokens.json` (colors in light and dark, type, spacing, radius, shadow) and `components/<Name>/` (README plus static `preview.html`).
- **This folder is the source of truth.** Make every design-system change here, commit it, then republish the changed files to the artifact above (Claude: read the artifact first, publish only the changed `project/` files to the same URL, `design-system.json` last and only if its own keys change). Do not edit the artifact directly; if someone does, copy those changes back here first.
- Generated files (`api/`, `tokens.css`, `manifest.json`) are not kept here; the artifact regenerates them.
- The store's CSS in `store/` is the source of truth for the live site. If a token changes there, update `tokens.json` here too, then republish.
- `components/bundle.js` is an empty stub; previews are static HTML.
