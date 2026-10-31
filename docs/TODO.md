# Pepsoma to-dos and open questions

**This file isn't always up to date.** The current version is in Notion: the "To do" section of the [Pepsoma page](https://app.notion.com/p/3ec1f1852d9780359b64ea85fb3c45b4) and the [Open questions](https://app.notion.com/p/4061f1852d978181a94beec4d2e722a8) page. Copied from Notion on Oct 28, 2026, with Oct 30 additions.

Design changes from the review comments are in [V2-CHANGE-LIST.md](V2-CHANGE-LIST.md) and [V3-CHANGE-LIST.md](V3-CHANGE-LIST.md), not here.

## To do

### Catalog and products (with Noza)

- [ ] **Get Noza's list of offerings** (blocks catalog + compliance)
- [ ] Update catalog to Noza's list, add Retatrutide, set up deals/combos (Selank and Semax already listed)
- [ ] Real COAs and real reviews
- [ ] Product photos to replace the drawn vials (optional)

### Compliance, legal and wording

- [ ] Compliance pass on site copy (dosing language, BAC water, human-use signals)
- [ ] Lawyer review of all policies
- [ ] Noza reads and rewords the FAQ
- [ ] Copy review of every page. Starting points: About wording; "qualified researcher" in the footer sign-up is vague

### Payments

- [x] Pick payment processor + backend: Unison + custom backend (see `PROJECT-BRIEF.md`)
- [ ] Apply to processors with Retatrutide listed up front: Unison, Vector Payments, 2Accept (approval takes days to weeks)
- [ ] Crypto + business Zelle checkout as the Retatrutide fallback (Claude Code builds the switch)
- [ ] Payments wired into checkout, test mode (may wait on processor approval)
- [ ] Take the preview banner down and turn checkout on once the processor approves
- [ ] Saved cards at checkout (Oct 30 review): needs the processor, since cards are saved with them and not on our site

### Backend and launch

- [ ] Sign up for database, email, shipping services
- [ ] Database + real accounts (Claude Code). Customers can edit account details at any time; move the profile and saved details off the browser. See `BACKEND-SPEC.md`
- [ ] Orders, confirmation emails, inventory, shipping (Claude Code). Includes changing an order's shipping address for one hour after ordering, enforced in the database. See `BACKEND-SPEC.md`
- [ ] Write down how a lab's COA gets uploaded and shown on the site (Claude Code, once products and lots are in the database)
- [ ] Connect pepsoma.com (GoDaddy DNS, on hold until asked)
- [ ] Test the order flow end to end
- [ ] Analytics respecting cookie consent

### Business info

- [ ] Company placeholders (address, state of formation, county, phone) in `PS.company` (`store/js/data.js`)

### Design and site

- [x] Implement the review comments (Claude Code). Oct 1 and Oct 27–28 rounds are V2 (`V2-CHANGE-LIST.md`); Oct 29–30 round is V3 (`V3-CHANGE-LIST.md`)
- [ ] Own tweaks pass
- [ ] Other design assets (Componentry, Unicorn Studio, Lenis)
- [ ] Cart animation fixes
- [ ] Logo: skipped for now, keeping the current "p" mark
- Note: if the top deal bar ever comes back, its X goes next to "Auto-applied", not at the edge of the screen

## Open questions

Within each group the quick one-word answers come first.

### Brand and naming

- [ ] **Pepsoma or PepSoma?** Affects every page, the emails and the domain branding.
- [ ] **Rename "Research Stacks" to what?** Options: Stacks, Bundles, Kits. A short name also frees header room for the Supplies link.

### Catalog and products (with Noza)

- [ ] **Bulk (10+ of one item):** a "10-pack" size on each product page, or a separate Bulk section in the shop?
- [ ] **Keep the automatic bulk discount?** 3+ vials 5% off, 5+ 10%, 10+ 15%. Nothing on the site tells shoppers it exists once the top deal bar is gone.
- [ ] **Keep Retatrutide and BAC water?** The FDA's Aug 24 letters named retatrutide and cited BAC water next to injectables as a sign of human use. Decides whether Supplies goes live. Plan if kept: list Reta on every processor application; if cards exclude it, sell it through crypto/Zelle only.
- [ ] **Sprays (Semax + Selank):** sizes, prices, and whether Noza offers them. Needs the compliance pass. Built behind a switch that's off.
- [ ] **Supplies section:** what goes in it besides BAC water? Built and switched off; the header is 12–77px too wide with it on.
- [ ] **Wholesale application: keep it?** Ask Noza; see how Fisher Scientific handles wholesale accounts.

### Compliance

- [ ] **Age check:** does an 18+/21+ gate make sense for research-only sales?

### Checkout and accounts

- [ ] **Shipping methods:** which carriers, speeds and prices?
- [ ] **One-hour address changes vs. same-day shipping:** the site promises same-day shipping before 2 PM ET. Should printing the label close the window early, or does every order wait an hour before packing?
- [ ] **Address changes and tax:** once tax is real, a change of state can change the amount owed. Block state changes, or recalculate?
- [ ] **Sign in with Google or Apple?** Supabase Auth supports both; needs the real backend first, and Apple needs a developer account.

### Lab tests

- [ ] **COA PDFs:** get the real third-party lab PDFs from Noza.

### Design

- [ ] **Skinnier heading:** checkout only, or every page title?
- [ ] **Old /v1/ link:** keep it on the feedback page's first draft, or point it at the V1 store snapshot?
- [ ] **Home carousel:** keep it (minus the hover jump and glow), or point at a site whose version you like better?
