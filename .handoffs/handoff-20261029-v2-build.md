# Handoff: V2 build from the Oct 27–28 review comments (in progress)

## What the session is doing
Kareem approved `docs/V2-CHANGE-LIST.md` as written ("review-mode compare box first, then fixes, then the options; use Sonnet for the execution"). Opus plans and checks; each batch runs as a Sonnet subagent, one at a time on branch `claude/project-onboarding-review-341ed9` (worktree `.claude/worktrees/project-onboarding-review-77af7e`). After each batch: review the diff, check in headless Chrome, commit (one commit per batch). Merge to main, push and confirm live only after all batches pass.

## Batches
- **A: review-mode "What changed" walkthrough + Old/New/New B compare box (item 1)**. Done, commit `3e2fb2c`.
  - `PS.variant(id)` / `PS.setVariant(id, v)` in `store/js/core.js`. Picks count only in review mode and are stored per tab; each one is mirrored as `data-var-<id>` on `<html>`.
  - The `CHANGES` list lives in `store/js/review.js`, one line per entry: `[id, title, what changed, route, selector, ['b','c']]`.
  - "Old" shows `versions/v1/` in an overlay iframe named `rv-old`. `versions/v1/js/review.js` got a one-line guard so it doesn't start review mode in there.
- **B: whole-site and Home fixes**: items 2, 3, 4, 6, 7, 9, 10, 11, 12, 13, 16–19, 21, 22 (fix part), 23. Running.
- **C: shop, product, cart/checkout, account, lab tests, other pages (Fix items)**: items 25, 27–29, 31–36, 39, 41–45, 47, 48, 50, 53, plus the write-up for item 30 (how real COAs get uploaded, in `docs/`).
  - Account items (39, 41, 42) touch `ui.js`, which the Supabase backend session (branch `claude/supabase-accounts-products-1648c7`) also edits. Keep these changes small and expect a rebase.
  - For item 45, the norm is to name the testing lab and its report/task ID at the top, with a line saying the lab, not Pepsoma, ran the analysis.
- **D: Options as switchable variants**: item 8 (header fonts), item 14 (opening mark, with a replay button in review mode), item 20 (hero background: letters/binary wave vs DNA helix), and item 22 (2 alternative card styles). Each is registered in `CHANGES` with its variants.
- **Then**: run the full check, rebase on `origin/main`, ff-merge into main from the main checkout, and push (Kareem approved building, but confirm the push). Confirm the site is live, update the versions page note for V2, and finish this handoff.

## Notion and to-dos
- The Pepsoma page's "To do" section and the Open questions page are grouped by topic (Oct 28). `docs/TODO.md` is a dated copy; Notion is the current version.

## Verification setup
The scratchpad harnesses are `check.mjs`, `review-check.mjs` and `changes-check.mjs`. They build a fake Pages layout in `scratchpad/site/PepSoma`, stub `script.google.com`, run with the sandbox off, and wait for curl before navigating.
