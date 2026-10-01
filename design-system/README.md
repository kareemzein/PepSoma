# Pepsoma

Pepsoma is a research-use-only peptide supplier. The store looks clinical but warm: navy type on white and cream, periwinkle accents, one olive-yellow signature, serif italics for emphasis. Extracted from `store/` (`styles.css`, `css/base.css`) at commit 255019e. Static HTML previews, no component bundle: the store is vanilla JS.

## Content fundamentals

- Voice: calm, lab-precise, no hype. State purity, lot numbers, COA availability. "Independently tested, research-grade peptides with lot-matched Certificates of Analysis."
- Every product surface carries the compliance line: for laboratory research use only. Never imply human use.
- Emphasis comes from one Fraunces italic word inside a DM Sans headline (`Research-grade <i>peptides</i>`), never bold or color alone.
- Numbers are tabular (`font-variant-numeric: tabular-nums`): prices, purity, stats.
- Casing: sentence case for headings and buttons; UPPERCASE with 0.16em tracking only for eyebrows and product categories.

## Visual foundations

- **Color**: text is navy `{text}`, never black. Page `{bg}`; bands alternate `{bg-soft}` and `{cream}`. Periwinkle `{accent}` for eyebrows, links, progress and focus. Olive-yellow `{yellow}` is the one loud color: promo pills, check dots, the highlight CTA; text on it is always `{on-yellow}`.
- **Dark mode**: follows the device, with a header toggle that stamps `data-theme="light|dark"` on `<html>`. In dark, `{primary}` inverts to pale periwinkle with dark text; `{yellow}` stays the same.
- **Type**: DM Sans for everything, Fraunces italic for emphasis and stat numerals. Headlines weight 500, letter-spacing -0.02em, balanced wrapping.
- **Shape**: buttons, chips, badges, steppers are always pills (`{radius-btn}`). Cards and tables `{radius-lg}`, inputs and notes `{radius}`.
- **Borders over shadows** for structure (1px `{line}`); `{shadow-lg}` only on hover and overlays.
- **Header**: sticky, frosted (`{header-bg}`, 14px blur); after scroll it lifts into a floating pill.
- **Motion**: spring ease on rise-ins and fly-to-cart, expo-out for headline lines, 0.15 to 0.45s on hovers. Buttons lift 1px on hover. Respect reduced motion.
- **Imagery**: products are drawn SVG vials on a lavender radial glow, hero is a molecule network, lots show an HPLC chromatogram. No photography, no stock people.
- **Focus**: 2px `{focus}` outline, 2px offset; inputs add a 3px 22% halo.

## Iconography

Inline stroke SVGs, 1.15em, `currentColor`, stroke-based; checks inside yellow discs use stroke width 3. The only mark is `assets/Logos/pepsoma-mark.svg`: a navy rounded square with a yellow Georgia-italic "p". Wordmark is plain "Pepsoma" in DM Sans.

## Components

Button, Badge, Chip, Field, ProductCard, DealBar, Header, QuantityStepper, OptionRow, Checkbox, OrderTotals, FreeShippingBar, DataTable, Timeline, FooterWordmark. Previews are static renditions of the store's classes; `bundle.js` is an empty stub.

## Not synced

Motion tokens (not supported by the format), the vial/chromatogram SVG generators in `store/js/visuals.js`, the feedback site's tokens (`pepsoma-feedback/`, a separate neutral theme), and the review-mode UI. `accent` at small sizes is 4.3:1 on white; flagged in its note, kept as in source. `faint` was darkened from the store's original to pass 4.5:1.
