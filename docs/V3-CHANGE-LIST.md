# V3 change list

From the V2 review comments: 31 from Kareem (Oct 30) and 1 from Noza (Oct 29). Walkthrough items looked at with no comment count as fine and stay as they are.

V2 is frozen at `versions/v2/`. `store/` becomes V3. Compare any of this in review mode's What changed box, which now shows V1, V2 and V2's options.

## Review mode

- **A1. V2 frozen, V3 live.** `/review/` still opens V1. A new `/review-v2/` opens V2 with its own comments. `?review` on the main site opens V3, with separate comments in the same sheet.
- **A2. The left box compares against every older version.** Chips: V1, V2, V2 B, V2 C (only where V2 had that option for this item), New, New B, New C.
- **A3. The right pane lists every change.** Scrollable and grouped. Click one to jump to it. Each row shows looked-at, thumb and note count. Back and Next still work.

## Whole site and header

1. **Track an order pop-up:** delay it slightly and show it slower on hover.
2. **Explore Peptides button:** same size as the "Hi Kareem / Account & Orders" button, font a little bigger than the login button, not the old heavy bold.
3. **Account button:** keep the glow, remove the lift on hover. Explore Peptides keeps its glow and lift.
4. **Page title fade:** the title at the top of Shop fades in on every arrival, as it does from the Shop Peptides menu.
5. **Product cards everywhere (Shop, Home, stacks):** no glow, no mouse tilt. Hover lifts the card and the product image grows slightly.
6. **Added-to-cart notice:** back, at the top of the screen, green outline. The first time it has a "Show cart" button. After that the button is the header's cart icon plus a `>` chevron.

## Home

7. **Headline (Noza):** "traceable" and the other rotating words use the same font as the rest of the headline.
8. **Heading:** "Best-selling compounds" becomes "Most-selling compounds".
9. **Ships today chip:** same design as V1, but it doesn't bob up and down with the vials.
10. **Offer card:** appears only after the visitor has scrolled to Most-selling compounds and 10 seconds have passed since load. More rectangular, bigger, better looking.
11. **Why Pepsoma:** option B removed. New is the flat cards, New B is the intro + list (V2's C). Both use V1's section background.
12. **Browse compounds:** the section is replaced by one slow row moving left to right, no dots. Each item has a faint colored outline that rotates around it, with bigger, more visible names and pills. Clicking scrolls down to that product's card in Most-selling and gives it a small green glow that fades. Compounds not in that grid open their product page.
13. **Opening mark:** V2's option B (DNA helix) becomes the only one, tilted 45 degrees.
14. **Hero background:** V2's option C (DNA helix) becomes the only one. It runs from the bottom-left corner to the top-right, then disappears from the tail. The next one starts slightly above the first, then one below, for five in all. Then the same sequence runs top-left to bottom-right.
15. **Header type:** no comment, so V2's New stays and options B and C are removed.

## Product and cart

16. **Quantity number:** updates in place, no rolodex. The old digit disappears bit by bit from the bottom and the new one is revealed the same way. Fast.
17. **Cart panel quantities:** same animation as the product page. Going up reads as up, going down reads as down.
18. **Free-shipping box:** smaller gap to the line above it, even space at the top and bottom of the box.

## Checkout and order

19. **"Almost there":** sits a little lower.
20. **Billing address:** the checkbox and billing fields move up to directly under Shipping address. The heading is bigger (slightly smaller than "Shipping address"), with space between it and the checkbox.
21. **Secure checkout line:** the word "policies" links to the policies page in a new tab.
22. **Field errors don't move anything.** New: space is reserved under each field for the message. New B: the box shrinks slightly with the message under it, and typing brings the box back with a small animation as the message disappears.
23. **Order page status:** research-use terms show as checked as soon as the page loads, with no pending state.
24. **Save my details:** a checkbox at checkout saves name, address and contact details on this browser and fills them in next time. No cards (see "Not built").

## Account

25. **After signing in:** an animated transition into the account page instead of an instant swap.
26. **Profile:** edit name, email, phone and saved address.
27. **Order history items:** each order lists "2 × BPC-157 10 mg" lines, kept light.
28. **Manage orders box:** on the right of Order history, with Return, Order again and Get support. Support offers a message through the Contact page, or email. For email, pick the order or "Other question", and a button opens an email in a new tab with the subject filled in.

## Lab tests

29. **Search:** results animate smoothly as you type.
30. **Certificate:** opens as a pop-up again, as in V1. `/coa/<lot>` links still work and open the pop-up over Lab Tests.
31. **Download PDF:** moves below the certificate's header area.

## Added after V3 went live

32. **Change the shipping address:** for one hour after ordering, as long as the order hasn't shipped, the order page lets the customer change the name, phone, lab and address. Each change keeps a record of what it replaced. The demo timeline now ships at the one-hour mark, not 8 minutes in. Profile edits are allowed at any time and don't change orders already placed.

## Not built

- **Saved cards:** needs the payment processor. Goes in Notion and `TODO.md`.
- **Real accounts:** profile, saved details and address changes stay on this browser until the backend exists. `docs/BACKEND-SPEC.md` says what the database needs.
- **Changing what's in an order:** items, quantities and shipping speed change the amount charged, so those stay with support for now.
