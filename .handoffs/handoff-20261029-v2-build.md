# Handoff: V2 build from all review comments (done, live Oct 29)

## What happened
Kareem approved `docs/V2-CHANGE-LIST.md` as written. Every Fix and Options item is built, verified in headless Chrome, merged to main and live at https://kareemzein.github.io/PepSoma/ (deploy of `30fe996` succeeded).
- Opus planned and checked; each batch ran as a Sonnet subagent on branch `claude/project-onboarding-review-341ed9`, one commit per batch, so any batch can be reverted on its own:
  - `3e2fb2c` **A**: review mode's "What changed" walkthrough, with Old / New / New B / New C buttons. Also adds `docs/V2-CHANGE-LIST.md` and `docs/TODO.md`.
  - `6ab189a` **B**: whole site and Home (items 2–4, 6, 7, 9–13, 16–19, 21–23).
  - `d141bde` **C1**: shop, product, cart, checkout (items 25, 27–29, 31–36).
  - `a6a5544` **C2**: account, lab tests, other pages (items 39, 41–45, 47, 48, 50, 53), the phone-menu grey stripe, and `docs/COA-UPLOAD.md` (item 30).
  - `30fe996` **D**: options (items 8, 14, 20, 22) and the versions-page note.
- Not built, by design: the Decide/Note items. They're in Notion (Pepsoma page "To do", grouped by topic, and the Open questions page) and copied to `docs/TODO.md`.

## How Kareem reviews it
- Open https://kareemzein.github.io/PepSoma/?review, then in the panel pick **What changed**.
- It steps through every change in order (Oct 1 round first, then Oct 28 by page).
- The box at the bottom left has **Old** (V1 shown in place), **New**, and **New B / New C** on the options items.
- The opening-mark item has a **Replay** button.
- Picks only apply in review mode (per tab). The public site always shows "New".
- `/review/` still opens V1 with the old comments.

## Code map for what's new
- **Variants:** `PS.variant(id)` / `PS.setVariant` (`store/js/core.js`). CSS keys off `html[data-var-<id>]`.
- **Walkthrough:** `CHANGES` in `store/js/review.js`, one line per entry.
- **Options and their ids:**
  - `hdr-type`: nav and pill type (New DM Sans slimmer / B DM Sans headline cut / C Hanken Grotesk)
  - `opening`: peptide-chain p / DNA helix; `PS.replayOpening`
  - `hero-bg`: peptide letters / binary / DNA helix; `startHeroBg` in `app.js`, peak alpha 0.17
  - `why`: flat cards / editorial rules / intro + list
- **Behavior changes and where they live:**
  - Soft re-render (no reload flash) is in `render()` in `ui.js`.
  - Cart updates in place via `patchCart()`.
  - Custom standing-order plans use ids like `c6`. Legacy `8w` still reads.
  - Standing-order Manage settings are saved per browser (`subSettings`).
  - New routes: `/signup`, `/orders`.
  - The COA lab is `PS.lab` = `[Testing lab]` / `[Report ID]` placeholders. Per-lot overrides go in `PS.lotOverrides`, and PDFs in `store/coa/<lot>.pdf`.

## Open items for next time
- **Kareem picks the options** in review mode. Make the chosen one "New" and remove the others.
- **COA placeholders:** "[Testing lab]" / "[Report ID]" show publicly until Noza names the lab.
- **Supabase session (branch `claude/supabase-accounts-products-1648c7`):**
  - Its schema has no lots table and no COA storage; `docs/COA-UPLOAD.md` lists what's missing.
  - That branch touches `ui.js`/`core.js`, so expect a rebase.
  - Migrate `subSettings` / `cancelledSubs` to the backend.
- **Design system** (`design-system/`): not updated for the header account menu, the deal changes, Why Pepsoma, the cookie banner or the sign-in wordmark. Per CLAUDE.md, update it there and republish.
- **Copy:** Why Pepsoma option C has one new intro line ("Four things we do for every lot, and say plainly."). The FAQ still mentions volume pricing; check it when the bulk-discount question is answered.
- **Hero "SHOP PEPTIDES" button:** left as is. Item 8 changed only the nav and header pills; ask if he meant the hero button too.

## Verification
- Final pass: all 18 routes at 1492 and 390 render with 0 horizontal overflow, the header has 0 overflow/overlaps at 9 widths, and the C1/C2 test suites (order flow, account, Manage, walkthrough) pass with 0 console errors.
- Live: headless Chrome on the live URL showed the new home (hero background, Home search, no deal bar, no header search), key pages load, 0 errors, 0 sheet requests.
- The harnesses are in the session scratchpad (`batch-*/`, `final/`).
