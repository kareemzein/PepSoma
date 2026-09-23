# Pepsoma — storefront MVP

A working demo storefront for **pepsoma.com**, a research-use-only peptide supplier. It comes in two design directions to choose between:

| | Version A — Clinical | Version B — Lab |
|---|---|---|
| Path | `/a/` | `/b/` |
| Inspired by | brellohealth.com (product/plan layout) | olympexsolutions.com (catalog/lab layout) |
| Look | Cream, lavender, deep purple, yellow accents; Fraunces serif italics + DM Sans. Follows the device's light/dark mode, with a sun/moon toggle to override | Near-black, antique gold, cream; Inter Tight + Inter |
| Signature pieces | Plan-selector product page, “What’s included” box, animated hero with rolling headline word, compound marquee, count-up stats, live COA window, fly-to-cart, giant footer wordmark | Marquee trust bars, “Buy more, save more” tiers, 01/02/03 standards, framed product art |

The root `index.html` is a split-screen page where you pick a version.

## What works (both versions)

- **Catalog**: 16 compounds and 4 research stacks, with category filters, search and sort
- **Product pages**: size options, one-time vs standing order (15%/10% off), quantity, specs, per-lot lab tests
- **Cart**: slide-out drawer and full cart page, free-shipping progress bar ($150), automatic volume tiers (3+/5+/10+ vials), promo codes
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
# open http://localhost:8000
```

You can also open `index.html` directly. There's no build step and no dependencies.

## Deploy (GitHub Pages)

`.github/workflows/pages.yml` deploys the site on every push to `main`.
1. Merge to `main`.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. For the custom domain: add a `CNAME` file containing `pepsoma.com` and point DNS at GitHub Pages. Only do this once you're ready, because it redirects the github.io URL.

## Project structure

```
index.html            version chooser
a/                    Version A: index.html, app.js (layout + pages), styles.css
b/                    Version B: same shape
shared/js/data.js     products, prices, categories, FAQs, company info   ← edit content here
shared/js/core.js     storage, pricing rules, cart, orders, accounts, router
shared/js/visuals.js  SVG vials, lot/COA data, chromatograms
shared/js/policies.js all policy pages
shared/js/ui.js       shared forms, default pages, cart drawer/modals, app boot
shared/css/base.css   shared layout; each version's styles.css builds on it
```

To change prices, shipping, tiers or promo codes, edit `PS.config` in `shared/js/core.js`. To change products, edit `shared/js/data.js`. Both versions update together.

## Before a real launch

- [ ] Pick a version, then delete the other folder and the chooser page
- [ ] Fill in the bracketed placeholders in `PS.company` (`shared/js/data.js`): business address, state of formation, county, and the phone number (currently a 555 placeholder)
- [ ] **Have a lawyer review every policy.** They're starting templates for a US RUO supplier.
- [ ] Replace the sample testimonials with real, verifiable reviews, or remove them
- [ ] Replace the demo COA data (marked “SAMPLE DATA”) with real lab PDFs for each lot
- [ ] Swap the SVG vials for product photos if you want (change `PS.productImage` in `shared/js/visuals.js`)
- [ ] Connect real commerce: a payment processor that accepts research-chemical merchants (many mainstream processors don't), plus order emails, inventory and shipping labels. Shopify/WooCommerce, or a custom backend in place of `PS.cart` / `PS.orders` / `PS.auth`.
- [ ] Add analytics that respect the cookie choice
