# Handoff: Supabase account and order edits (not merged)

## Current state
- Merged to `main` and pushed on Oct 31. The deployed store reads `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the Actions secrets (both set). `.env` is per worktree and gitignored.
- Kareem's project has `schema.sql`, `seed.sql` and `002_account_order_edits.sql` applied, and the test data is deleted. Enable Email provider is on and Confirm email is off until Resend is set up.
- Decisions are in `docs/BACKEND-SPEC.md` and `docs/TODO.md`: signed-in owners only edit addresses, guests email support, tax 0%, no automatic charges or refunds, a person reviews state changes.

## How it works
- `store/js/backend.js` replaces `PS.auth`, `PS.details`, `PS.subs` and the order functions when keys are set. Account data is cached in `sb.*` storage keys so pages still render synchronously, and cleared on sign-out.
- An order with a `status` came from the server. Without one it's a browser-only demo order. `core.js` keeps the demo timing for those.
- Checkout now waits for the database. Unreachable falls back to a demo order, which must change before real sales (`docs/TODO.md`).
- The browser's edit check is display only. `update_order_address` decides, by the database's clock, and answers with a code rather than raising, so `EDIT_MSG` in `backend.js` maps the messages.

## What was verified
- On the real project, in headless Chrome and against its API: sign up, sign in, profiles, the one-time import, checkout, order history, address changes, standing orders, guest tracking, and the access rules between two customers, a guest and signed-out visitors. The publishable key works.
- In the SQL Editor on the real project, 10 of 10: edits at 59 and 61 minutes, the tax refusal, labels, shipping, the review flag and the change history.
- No keys and unreachable: the demo still works (against a test stand-in and the same code).
- The test scripts were in the session scratchpad, not the repo.

## Not verified
- **Email change.** On the real project it failed with `Email address "..." is invalid`, naming the account's current `@example.com` address, even with Confirm email off. It's probably Supabase emailing the current address. The error shows and nothing changes. Retest with real inboxes after Resend. The `#message=` link handling in `backend.js` has never seen a real link.
- `supabase/functions/order-address-email`: not deployed, never run.
- Safari, Firefox, phones.

## Next
Resend (see `docs/TODO.md`), then the orders prompt: inventory, order confirmation emails, Shippo labels. Order status and labels are set by hand in Supabase until then.
