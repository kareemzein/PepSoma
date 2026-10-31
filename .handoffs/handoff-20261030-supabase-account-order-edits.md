# Handoff: Supabase account and order edits (not merged)

## Current state
- Branch `claude/supabase-accounts-products-1648c7`, rebased on main at `722980f`. **Not merged or pushed.** Merge only after it's tested against the real Supabase project.
- Kareem's project has `schema.sql` and `seed.sql` applied. `supabase/002_account_order_edits.sql` is written and **not yet run there**. The keys aren't in this worktree yet.
- Decisions are in `docs/BACKEND-SPEC.md` and `docs/TODO.md`: signed-in owners only edit addresses, guests email support, tax 0%, no automatic charges or refunds, a person reviews state changes.

## How it works
- `store/js/backend.js` replaces `PS.auth`, `PS.details`, `PS.subs` and the order functions when keys are set. Account data is cached in `sb.*` storage keys so pages still render synchronously, and cleared on sign-out.
- An order with a `status` came from the server. Without one it's a browser-only demo order. `core.js` keeps the demo timing for those.
- Checkout now waits for the database. Unreachable falls back to a demo order, which must change before real sales (`docs/TODO.md`).
- The browser's edit check is display only. `update_order_address` decides, by the database's clock, and answers with a code rather than raising, so `EDIT_MSG` in `backend.js` maps the messages.

## What was verified, and how
- `supabase/*.sql` on real Postgres (PGlite) with Supabase's auth schema and roles stubbed: all the spec's rules, including 59 and 61 minutes, labels, tax refusal and RLS.
- The store in headless Chrome against a stand-in for Supabase's Auth and REST API over that database: sign up, sign in, profile, one-time import, checkout, address changes, standing orders, email change, guest tracking, two customers. Also no keys and unreachable. No uncaught errors.
- The test scripts are in this session's scratchpad (`pg/sqltest.mjs`, `pg/fake.mjs`, `e2e.mjs`), not the repo.

## Not verified
- Anything on real Supabase: the real API, real column grants, publishable key format, real email links (`#message=` is coded from the docs).
- `supabase/functions/order-address-email`: never run.
- Whether Confirm email off makes an email change apply instantly. Test it; it may need Resend SMTP and Confirm email on.
- Safari, Firefox, phones.

## Next
1. Kareem runs 002, supplies keys. Write `.env`, set the Actions secrets with `gh` (he approved this).
2. Rerun the spec's "Done means" list against the real project. The 59/61-minute and label tests need SQL he runs, since the browser can no longer set those columns.
3. Update the README if anything differs, rebase, merge, push. Pushing deploys.
