# About this folder

Snapshot of the Pepsoma design system, extracted from `store/styles.css` and `store/css/base.css` (commit 255019e, then `--faint` darkened in a2bd1a1). The live, editable copy is the Claude "Design System" artifact: https://claude.ai/artifact/7pM4NoR1HUKrQH1GkWhzvP

- Start with `README.md` (brand rules), then `tokens.json` (colors in light and dark, type, spacing, radius, shadow) and `components/<Name>/` (README plus static `preview.html`).
- The artifact is the source for Claude Design. This folder is a copy for reference: edit the artifact, then copy changes back here, or the two drift. Generated files (`api/`, `tokens.css`, `manifest.json`) are left out.
- The store's CSS in `store/` is the source of truth for the live site. If a token changes there, update `tokens.json` too.
- `components/bundle.js` is an empty stub; previews are static HTML.
