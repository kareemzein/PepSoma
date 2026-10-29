# V2 change list (all review comments so far)

V2 is everything from both review rounds. The Oct 1 round (13 comments) is already built and live; the Oct 27–28 round (64 comments, made on V1 with the guided checklist) is items 1–53 below.

Why 53 and not 64: the "page reloads" complaint came up 5 times and is one item (#2), a few comments covered the same thing twice, 3 only said "looks good" / "works" (prices, overall colors, lot search), and 2 were empty ("Explore Peptides: b", and "Vials and glow" which only repeats its label).

## Oct 1 round (13 comments): status

- Done and live: Explore Peptides font and order, header search (changes again in #4), track-order pane, "Almost there" in one thinner font, Home carousel instead of the scrolling names, Lab Tests cards with no status column, web COA page with the lab PDF at the bottom.
- Built but switched off (`?preview=sprays,supplies`): Semax and Selank sprays, Supplies link. Waiting on the Noza/FDA answer.
- Waiting on your answer in Notion: bulk pane (10-pack size or Bulk section), renaming "Research Stacks".
- Logo pack: skipped for now. The new opening-mark idea is #14.

Tags:
- **Fix**: clear what to do; build it.
- **Options**: needs 2–3 versions you switch between in review mode (see #1).
- **Decide**: a question for you or Noza. It goes in Notion and `docs/TODO.md`; nothing gets built.
- **Note**: wording or process to write down for later.

## Review mode (do this first)

1. **Fix: a "what changed" walkthrough.** Like the guided checklist, it steps through each changed feature in order. A box at the bottom left switches between **Old** (V1), **New** and **New B/C** right on the page, without opening the old site. Every **Options** item below depends on it. *This is in `store/js/review.js`, which the Feedback Annotation Tool session is also editing, so the two need to coordinate.*

## Whole site

2. **Fix: no "page reload" flash.** Filters, sort, applying a promo code, and going from cart to checkout currently re-draw the whole page. Only the part that changes should update (cards fade and come back), and moving between pages gets a smooth transition like diabrowser.com. *You raised this 5 times.*
3. **Fix:** dropdown menus close after you click an item.
4. **Fix: search moves out of the header.** Take out the header search button that V2 added, and put a search box next to "Best-selling compounds" on Home. *This reverses the Oct 1 request; your Oct 28 comment wins.*
5. **Already in V2:** the truck (track order) button now shows on desktop. Your comment was made on V1.
6. **Fix:** the Account Login glow stays tight under the button instead of spilling below the bar.
7. **Fix:** clearer hover highlight on header buttons, and a more visible menu pill.
8. **Options: font for "Shop Peptides" and "Account Login".** These look too heavy and slightly too big. Show 2–3 slimmer bold fonts that still match the headline.
9. **Fix:** remove the glow that follows the cursor over cards.
10. **Fix: add-to-cart fly-in.** The circle stays inside the window, on a flatter arc that isn't completely straight.
11. **Fix:** no "Added to cart" notice, and the cart drawer no longer opens on every add.
12. **Fix:** the cookie banner is more visible (a shade that stands out from the page).
13. **Fix: phone layout.** The floating bar moves up and toward the center. The product grid becomes 1 column, with cards that don't span the full width.
14. **Options: opening animation.** A simple mark replaces the "p": a DNA double helix or a peptide-chain mark that ties to the name. Includes a replay button in review mode so you don't need to clear the cache.
15. **Decide: age check.** Does an 18+/21+ gate make sense for research-only sales? This needs a compliance answer, not a design one.

## Home

16. **Fix:** remove the "Third-party tested · COA on every lot" pill and its pulsing dot.
17. **Fix: hero stats.** Keep the 99.3% average purity and remove the floating 99.4% "current lot" number. Make the "Ships today" chip calmer and less Amazon-like.
18. **Fix:** replace "45 lots tested" with something true at launch (for example "Every lot third-party tested"), or drop it.
19. **Fix: deals.** No top deal bar. The deal shows on product pages and at checkout. On Home, an offer card fades in mid-screen after someone has spent a few seconds on the products. **Note:** if the bar ever comes back, its X goes next to "Auto-applied".
20. **Options: hero background.** Replaces the "stars" network. A: peptide letters or binary in a slow wave. B: a DNA helix that fades in and out.
21. **Fix: carousel cards.** No jump or tilt on hover, and no glow behind the vials.
22. **Fix + Options: reviews section.** Remove the sample testimonials. Replace them with plain "why Pepsoma" points and no hover jump. Show 2 less "AI-looking" card styles.
23. **Fix:** clicking anywhere on a stack card opens its page.
24. **Note:** "qualified researcher" in the footer may be too vague. Add it to the copy-review todo.

## Shop

25. **Fix: product cards.** Size buttons are centered with less space above the price. Clicking anywhere on the card opens the product. Picking a size swaps the vial picture and changes "Select" to "Add to cart".
26. Filters and sort: covered by #2.

## Product page

27. **Fix:** remove the "Pepsoma LLC supplies research materials…" paragraph from the product page. The research-only notice stays in the footer and at checkout.
28. **Fix: standing order.** Every 4 weeks stays the default, and **Custom** replaces 8 weeks. The custom period is remembered and suggested on other products.
29. **Fix:** the quantity number rolls up or down when it changes.
30. **Note: how a real COA gets onto the site** (upload steps). I'll write the answer in `docs/`. It depends on the Supabase backend session (products/lots in the database).

## Cart and checkout

31. **Fix: cart drawer.** Changing a quantity updates only that number. An item shrinks out at 0 or when you press trash, and the trash icon becomes an outlined can.
32. **Fix:** the free-shipping bar moves to the bottom, above the subtotal, as a small floating bar.
33. **Fix:** unchecking "Billing same as shipping" shows the billing fields. *Bug.*
34. **Fix:** the card number takes at most 16 digits. *Bug.*
35. **Fix:** "Secured with 256-bit TLS encryption" becomes just "Secure checkout".
36. **Fix:** on order confirmation, "Research attestation verified" becomes "Research-use terms accepted". It's only the checkbox they ticked, so "verified" overstates it.
37. **Decide:** shipping methods to offer.
38. **Decide:** keep the automatic bulk discount (3+/5+/10+)? Nothing on the site tells shoppers it exists.

## Account and orders

39. **Fix: separate pages.** Sign in and Create account each get their own page, with Create account linked from Sign in. The big Pepsoma mark bleeds in from the side, like the footer wordmark.
40. **Decide: Google/Apple sign-in.** It's easy with Supabase Auth: one button each, and it does both sign-in and sign-up, so no separate create button. It needs the backend from the Supabase session, plus Apple developer setup.
41. **Fix: header account button.** It reads "Hi Kareem / Account & Orders" in two lines like Amazon. Hovering shows a menu with Order history. Order history becomes its own page and is also listed under Resources.
42. **Fix:** a standing order gets a **Manage** step before Cancel. You can change the period and the start and end dates, and it shows the next shipment date.
43. **Fix:** order page items show the product picture, and the name and picture link to the product.

## Lab tests and COA

44. **Fix:** a product filter at the top of Lab Tests.
45. **Fix + research:** the certificate page names the testing lab at the top instead of Pepsoma. I'll check what other suppliers do.
46. **Already the plan:** the web COA stays as it is, and "Open the lab's PDF" serves the lab's exact PDF. This is waiting on the real PDFs, an open question in Notion.
47. **Fix:** the chart label "10.73 min • 99.4%" is squished. *Bug.*

## Other pages

48. **Fix:** remove "We don't manufacture claims — we publish data." from About. **Note:** add a copy review of every page to the todo list.
49. **Note:** Noza reads and rewords the FAQ.
50. **Fix:** Contact drops the phone number and hours, with no mailing address.
51. **Decide:** keep the wholesale application? Ask Noza, and see how Fisher Scientific does it.
52. **Note:** policies get reviewed by counsel (already in the README todo list).
53. **Fix:** the 404 page text is centered vertically.

## Where the todos go

The **Decide** and **Note** items go to the Notion "Open questions" page and to a new `docs/TODO.md`, which moves the README's todo list there too. Notion stays the place you answer.
