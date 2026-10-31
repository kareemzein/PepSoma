# Handoff: V3 build from the Oct 29–30 review comments

## What happened
Kareem asked for V3 from the V2 feedback: 31 comments of his (Oct 30) and 1 from Noza (Oct 29). Built on branch `claude/project-onboarding-review-341ed9`, one commit per batch, so any batch can be reverted on its own. The list is `docs/V3-CHANGE-LIST.md`.
- `cab3baf`: V2 frozen at `versions/v2/`, change list added.
- `03d1190` **A**: review tools (versions, chips, right-pane list).
- `db733fc` **B**: whole site and Home (items 1–15).
- `1f38a90` **C**: product, cart, checkout (items 16–24).
- `fb3c031` **D**: account and lab tests (items 25–31).
- `9d769e3`: checklist text, TODO.

Check `git log origin/main` to see whether this has been pushed. Saved cards are not built (needs the processor); that's in Notion and `docs/TODO.md`.

## How Kareem reviews it
- `?review` on the main site opens V3, then **What changed** in the panel.
- The left box has chips: V1, V2, V2's options where it had them, New, New B.
- **All changes** opens the scrollable list in the right pane. Back and Next still work.
- `/review/` opens V1 and `/review-v2/` opens V2, each with its own comments. All go to the same sheet, kept apart by address.

## Code map for what's new
- **Older versions in the box:** two iframes, `rv-old` (V1) and `rv-old-v2` (V2), each loaded once. A CHANGES entry's optional 7th element, `v2opts`, lists V2's option id and letters.
- **Frozen V2** keeps its variant picks under `pepsoma.v2.variants`, so they don't mix with V3's.
- **Variants left in V3:** `why` (new / b) and `field-err` (new / b). Picks made in review mode only.
- **Saved details:** `PS.details` in `store/js/core.js`, key `savedDetails`, browser only, never card data.
- **Profile:** `PS.auth.update`. A changed email moves the account's orders; a `salt` field keeps sign-in working.
- **Certificate:** modal of `PS.coaDoc`. `/coa/<lot>` opens it over Lab Tests. The COA page is gone.
- **Quantity animation:** `wipeQty` in `store/js/ui.js`, shared by the product page, cart panel and cart page.

## Behavior to check with Kareem
- **Order status badge:** "Research-use terms accepted" now shows from the start on order lists and the track page, not only on the order page, because item 23 changed the step's timing.
- **Order again on a standing order** keeps its plan, so it can create a duplicate standing order if the old one is still active.
- **Stack cards (item 5):** read as "make product cards like the stack cards", so stack cards themselves didn't change.
- **Fields are about 6px taller** in every form, because space for the error line is always reserved.
- **Offer card** sits mid-screen and can cover part of the Most-selling heading while it's up.

## Added after V3 went live
- **Comments across domains:** Pages now forwards to `testing.pepsoma.com`, so all three review tools match sheet rows on the `?version` part of the address, not the whole address.
- **Order address edits:** `PS.orders.editable` / `updateAddress` in `store/js/core.js`, `orderAddressHtml` in `store/js/ui.js`. One hour, not after shipping. The demo's "Shipped" moved from 8 to 60 minutes and "Delivered" from 30 to 180, so the window can run its full hour.
- **Backend:** `docs/BACKEND-SPEC.md` says what Code B has to build for account and order edits.

## Open items for next time
- Kareem picks `why` and `field-err`. Make the chosen one the default and remove the other.
- COA placeholders: "[Testing lab]" / "[Report ID]" show publicly until Noza names the lab.
- Supabase session (branch `claude/supabase-accounts-products-1648c7`): touches `ui.js`/`core.js`, so expect a rebase. Migrate `PS.details`, the profile and `subSettings` to the backend.
- Design system (`design-system/`): not updated for V2 or V3 changes. Per CLAUDE.md, update it there and republish.

## Verification
- Headless Chrome with the sheet stubbed, 1492 and 390 wide. Suites are in the session scratchpad (`batch-v3a` to `batch-v3d`, `final/`).
- Whole-site pass on the final code: 18 routes at both widths with 0 overflow, header with 0 overflow/overlaps at 9 widths, 0 console errors.
- Not checked: Safari, Firefox, real phones, a real mail app opening the email links.
