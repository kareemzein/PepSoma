# PepSoma — Project Brief & Work Split

Oct 26, 2026 · Kareem Zein · Online version: https://claude.ai/artifact/F7NoD4ZJZUVxHDeFNfr8m9 · Tuesday checklist: https://claude.ai/artifact/3DLtt2HDAyq59fLdMDzNsC

## What PepSoma is

PepSoma is a research-use-only (RUO) peptide storefront for pepsoma.com, built for Noza. The front-end demo is live; there is no backend yet, so accounts, orders and payments are simulated in the browser. By Tuesday, Oct 27, the infrastructure for a live launch should be built: domain, database and accounts, payments, order emails, inventory and shipping.

| What | Link |
| --- | --- |
| Live store | [kareemzein.github.io/PepSoma](https://kareemzein.github.io/PepSoma/) |
| Store in review mode | [/PepSoma/review/](https://kareemzein.github.io/PepSoma/review/) |
| Design feedback page | [/PepSoma/pepsoma-feedback/](https://kareemzein.github.io/PepSoma/pepsoma-feedback/) |
| Code | GitHub `kareemzein/PepSoma` · local folder `Documents/Claude Personal/PepSoma` |
| Review hub | [Review hub artifact](https://claude.ai/artifact/7U6G6jwMBDxiuBSRekVgoN) |
| Kickoff deck | [Kickoff deck artifact](https://claude.ai/artifact/5e4gSW3TEFuCpJgmURFZzM) |
| Design system | [Design System artifact](https://claude.ai/artifact/7pM4NoR1HUKrQH1GkWhzvP) (source of truth is `design-system/` in the repo) |
| Notion | [Pepsoma page](https://app.notion.com/p/3ec1f1852d9780359b64ea85fb3c45b4) · [Pepsoma umbrella task](https://app.notion.com/p/3fe1f1852d978141a9f1ffcd9003fbb4) |

## What's done

The storefront MVP, its design and an in-person review tool are finished and deployed. Everything was built between Sep 23 and Oct 1, and the repo has had no commits since.

| Area | What exists |
| --- | --- |
| Catalog | 16 compounds and 4 research stacks, with category filters, search and sort |
| Product pages | Size options, one-time vs standing order (15% / 10% off), quantity, specs, per-lot lab tests |
| Cart and deals | Slide-out drawer and cart page, $150 free-shipping bar, volume tiers (3+/5+/10+ vials) or BOGO, promo codes |
| Checkout and orders | Validated checkout UI (demo card only), 3 shipping methods, confirmation, order tracking, order history |
| Accounts | Sign up, sign in, cancel standing orders (browser storage only) |
| Lab tests | Lot search, COA viewer with generated HPLC chart, print to PDF (sample data) |
| Pages | FAQ, About, Contact, Wholesale application, 404 |
| Compliance UI | 21+ age gate, cookie banner, RUO disclaimers site-wide |
| Policies | Terms, RUO, Shipping, Refund, Testing/COA, Standing Order, Privacy, Cookies, Accessibility (templates, not lawyer-reviewed) |
| Look and feel | Navy, periwinkle, cream and olive-yellow; Fraunces + DM Sans; light/dark mode; first-visit opening animation |
| Review mode | Click-to-comment on any element, named reviewers, Google Sheet sync, password-protected Everyone view |
| Design system | Tokens plus 30 components, published as a Claude artifact |
| Deploy | GitHub Pages on every push to `main`, with cache-busting |

## What needs doing

Step zero is getting the final list of offerings from Noza: the catalog, deals and compliance pass depend on it. Tuesday means the infrastructure is built for a live launch, so the backend, payments, emails and inventory are now part of the plan. Real card charges still wait on the payment processor's approval, which isn't in our control.

| # | Task | Priority | Where | Notes |
| --- | --- | --- | --- | --- |
| 0 | Get the final list of offerings from Noza | First (blocks 2, 3) | You, by message or in person | Which compounds, sizes, prices and combos are actually offered |
| 1 | Implement the review comments | Must (Tue) | Claude Code | Pull from the Sheet or review mode's Copy all, group by page, apply to `store/` |
| 2 | Update catalog to Noza's list, add Retatrutide, set up deals/combos | Must (Tue) | Decide here, build in Claude Code | Retatrutide already bought; Selank and Semax already listed. Settle the FDA question first |
| 3 | Compliance pass on site copy | Must (Tue) | Research here, edits in Claude Code | Dosing language, BAC water pairing, human-use signals (see Risks) |
| 4 | Pick a payment processor and a backend | Must (Mon AM) | Research here | Cowork recommends one of each, with costs and setup time |
| 5 | Apply to the payment processor | Must (Mon) | You | Approval takes days to weeks, so apply Monday |
| 6 | Sign up for database, email and shipping services | Must (Mon) | You | Claude Code needs the keys to build against them |
| 7 | Database and real accounts | Must (Tue) | Claude Code | Moves accounts and products out of the browser |
| 8 | Orders, confirmation emails, inventory, shipping | Must (Tue) | Claude Code | Depends on 6 and 7 |
| 9 | Payments wired into checkout, test mode | Must (Tue) | Claude Code | May wait: many processors give no test keys until they approve you |
| 10 | Connect pepsoma.com with a preview banner and checkout off | Must (Tue) | You (GoDaddy DNS) + Claude Code | Domain is on GoDaddy and owned; DNS steps on hold until you ask |
| 11 | Your own tweaks pass | Should (Tue) | You, then Claude Code | Walk the store in review mode and leave comments. Cut first if time runs short |
| 12 | Test the order flow end to end | Must (Tue PM) | You | Sign up, order in test mode, check the email and order history |
| 13 | Cart animation fixes | Optional | You (own Code session) | Fly-in overshoot; drawer opening on every add |
| 14 | Logo: picture to SVG | Skipped for now | You | Keeping the current "p" mark |
| 15 | Other design assets | After Tue | Here (pick), Claude Code (build) | Componentry, Unicorn Studio, Lenis |
| 16 | Company placeholders | After Tue | You and Noza | Address, state of formation, county, phone |
| 17 | Lawyer review of all policies | After Tue | In person | Templates only today |
| 18 | Real COAs and reviews | After Tue | You and Noza, then Claude Code | Replace sample COA data and sample testimonials |
| 19 | Take the preview banner down and turn checkout on | After Tue | Claude Code | Once the processor approves and payments are real |
| 20 | Analytics respecting cookie consent | After Tue | Claude Code | |

## Who does what, where

The rule: anything that changes the repo happens in Claude Code; everything that plans, tracks or researches happens here; anything needing a person, money or a signature is yours.

| Where | Owns | Doesn't do |
| --- | --- | --- |
| Here (Claude, Cowork) | This brief, the Notion page and tasks, research (compliance, processors, backend options), decisions, design picks, drafts for Noza | Commit or push code |
| Claude Code | Every change to `store/`, `design-system/` and deploys; review-comment implementation; backend build; handoff notes in `.handoffs/` | Notion, research, decisions it wasn't given |
| In person / you | Meetings with Noza, the logo picture, buying stock, processor and bank applications, lawyer, DNS, company details |  |

**Handoff rules**

- Decisions made here get written into this doc first, then given to Claude Code as a short spec.
- Claude Code sessions start by reading `README.md`, `CLAUDE.md` and the newest file in `.handoffs/`, and end by writing a handoff.
- Several Code sessions share the folder: run `git fetch` first, and commit only your own files by path.
- Design-system changes go to `design-system/` first, then get republished to the artifact.
- When a task finishes, tick it off in Notion (here) so this doc and the tracker stay in sync.

## Risks and open questions

The biggest risk is regulatory: on Aug 24, 2026 the FDA sent warning letters to five RUO peptide vendors, naming retatrutide and tesamorelin among the compounds. The "research use only" label didn't protect them. The FDA cited dosing guidance, reconstitution calculators and bacteriostatic water sold next to injectables as signs of human use ([AFS Law summary](https://www.afslaw.com/perspectives/alerts/ruo-ined-five-peptide-vendors-learn-research-use-only-not-legal-strategy)). PepSoma sells tesamorelin and bacteriostatic water today, and Retatrutide is next.

- **Payments:** Stripe prohibits "incorrectly labeled research chemicals" ([Stripe restricted businesses](https://stripe.com/us/restricted-businesses/)), so the Stripe/Link plan likely won't work. Many processors give no test keys until they approve you, so payments may not be testable by Tuesday.

* [x] What does Tuesday mean? Infrastructure ready for a live launch (answered Oct 26)
* [ ] Pepsoma or PepSoma? The code and logo say "Pepsoma" / "pep*soma*".
* [ ] Keep Retatrutide and BAC water on the menu given the FDA letters? Undecided; asking Noza.

## Sources

- [AFS Law: RUO-ined, five peptide vendors learn RUO is not a legal strategy](https://www.afslaw.com/perspectives/alerts/ruo-ined-five-peptide-vendors-learn-research-use-only-not-legal-strategy)
- [Stripe: restricted and prohibited businesses](https://stripe.com/us/restricted-businesses/)
- Repo: `README.md`, `.handoffs/` (Sep 23 to Oct 1), `design-system/ABOUT.md`
- Notion: Pepsoma page, Design page, Pepsoma umbrella task and its 9 subtasks
