# Pepsoma — storefront MVP

A working demo storefront for **pepsoma.com**, a research-use-only peptide supplier, plus the design feedback page used to choose its look.

- **`store/`** is the storefront we're building. It started as design "Version A" (modeled on brellohealth.com) and was reworked from reviewer feedback: navy, periwinkle, cream and olive-yellow; Fraunces serif italics + DM Sans; follows the device's light/dark mode with a sun/moon toggle; a once-per-visit opening that flies through the Pepsoma mark (Robinhood-style); floating header, count-up stats, molecule-network hero, live COA window, fly-to-cart, giant footer wordmark.
- **`pepsoma-feedback/`** is the design feedback page: the two original designs embedded live, a board of similar sites to Like/Pass, a color picker, and a summary the reviewer sends back.

Both are published from this repo as one site with two links:

| | Live link | Folder |
|---|---|---|
| Pepsoma (the store) | https://kareemzein.github.io/PepSoma/ | `store/` |
| Pepsoma feedback | https://kareemzein.github.io/PepSoma/pepsoma-feedback/ | `pepsoma-feedback/` |
| Store in review mode | https://kareemzein.github.io/PepSoma/review/ | `store/js/review.js` |

## What the store does

- **Catalog**: 16 compounds and 4 research stacks, with category filters, search and sort
- **Product pages**: size options, one-time vs standing order (15%/10% off), quantity, specs, per-lot lab tests
- **Cart**: slide-out drawer and full cart page, free-shipping progress bar ($150), an automatic one-time-vial deal (volume tiers 3+/5+/10+ vials, or Buy 1 Get 1: set `DEAL` in `store/app.js`, or add `?deal=bogo` to the address to preview), promo codes
- **Checkout**: field validation, card checks (Luhn, expiry, CVC), three shipping methods, and required checkboxes for research use, 21+, terms and auto-renew
- **Orders**: confirmation page, order tracking by number + email (a sped-up demo status timeline), order history
- **Accounts**: sign up, sign in, sign out, order history, cancelling standing orders
- **Lab Tests / COAs**: lot search, a certificate viewer with a generated HPLC chart, print/save as PDF
- **Pages**: FAQ, About, Contact form, Wholesale application, 404
- **Compliance**: 21+ age gate, cookie consent banner, research-use disclaimers site-wide
- **Policies**: Terms of Service, Research Use Only, Shipping, Refund & Return, Testing & COA, Standing Order (auto-renewal) Terms, Privacy, Cookies, Accessibility

**Demo promo codes:** `WELCOME10` (10% off), `LAB15` (15% off $250+), `SHIPFREE`
**Demo card:** `4242 4242 4242 4242`, any future expiry, any CVC

Everything is saved in the browser's `localStorage`. There's no backend, no card is charged and no email is sent.

## Run locally

```bash
python3 -m http.server 8000
# store:     http://localhost:8000/store/
# feedback:  http://localhost:8000/pepsoma-feedback/
```

There's no build step and no dependencies. (Online, the store is served at the main address instead of `/store/`; the deploy step does that.)

## Deploy (GitHub Pages)

`.github/workflows/pages.yml` deploys on every push to `main`. It copies `store/` to the site root and `pepsoma-feedback/` beside it, adds forwarding pages for the old `/a/`, `/b/` and `/v1/` links, and publishes nothing else.
1. Merge to `main`.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. For the custom domain: set `pepsoma.com` under **Settings → Pages → Custom domain** and point DNS at GitHub Pages. The store then lives at pepsoma.com and the feedback page at pepsoma.com/pepsoma-feedback/. Only do this once you're ready, because it redirects the github.io URL.

## Project structure

```
store/                   the storefront (published at the main address)
  index.html             page shell
  app.js                 header, footer, home / shop / product / cart / checkout / about pages, motion
  styles.css             the store's look (colors, type, layout)
  favicon.svg
  js/data.js             products, prices, categories, FAQs, company info   ← edit content here
  js/core.js             storage, pricing rules, cart, orders, accounts, router
  js/visuals.js          SVG vials, lot/COA data, chromatograms
  js/policies.js         all policy pages
  js/ui.js               forms, default pages, cart drawer/modals, app boot
  js/review.js           review mode: Browse/Comment toggle, click any element to comment, commenter names (N switches), person filter, everyone's comments from the sheet, export (only runs with ?review)
  css/base.css           base layout that styles.css builds on

tools/review-sheet.gs    Google Apps Script that collects review-mode comments in a Google Sheet (not published; setup steps inside)

pepsoma-feedback/        design feedback page (published at /pepsoma-feedback/)
  index.html             the page
  first-draft/           the first version of the feedback page, kept so its old link works
  designs/               frozen copy of design A and B exactly as the reviewer saw them (don't edit)
  screenshots/           screenshots of the reference sites
```

To change prices, shipping, tiers or promo codes, edit `PS.config` in `store/js/core.js`. To change products, edit `store/js/data.js`.

## Before a real launch

- [ ] Fill in the bracketed placeholders in `PS.company` (`store/js/data.js`): business address, state of formation, county, and the phone number (currently a 555 placeholder)
- [ ] **Have a lawyer review every policy.** They're starting templates for a US RUO supplier.
- [ ] Replace the sample testimonials with real, verifiable reviews, or remove them
- [ ] Replace the demo COA data (marked “SAMPLE DATA”) with real lab PDFs for each lot
- [ ] Swap the SVG vials for product photos if you want (change `PS.productImage` in `store/js/visuals.js`)
- [ ] Connect real commerce: a payment processor that accepts research-chemical merchants (many mainstream processors don't), plus order emails, inventory and shipping labels. Shopify/WooCommerce, or a custom backend in place of `PS.cart` / `PS.orders` / `PS.auth`.
- [ ] Add analytics that respect the cookie choice
