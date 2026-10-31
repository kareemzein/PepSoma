# Backend spec: account and order edits

For the backend session (Code B, branch `claude/supabase-accounts-products-1648c7`). The store already does all of this in the browser, in V3. The database has to do the same, with the rules enforced on the server. The current `supabase/schema.sql` doesn't support any of it yet.

## Account details: editable any time

Customers can change their name, email, phone, lab / institution and saved address whenever they like.

- **Profile:** add a `profiles` table keyed to `auth.users`, with first name, last name, phone, org and saved address (shipping and billing, as JSON). Row-level security: a customer reads and updates only their own row.
- **Email:** change it through Supabase Auth's confirmation flow, so the old email keeps working until the new one is confirmed. Show "check your inbox" rather than the instant change the demo makes.
- **Orders stay put:** orders link to the account by `user_id`, so an email change keeps the order history. `orders.email` stays as the email used at checkout, because guests track orders with it.
- **Placed orders never change:** a profile edit doesn't touch any order. An order keeps its own copy of the name and address.
- **No card data** in these tables, ever. Saved cards wait for the processor and are stored with them.
- **Move off the browser:** replace `PS.auth.update` and `PS.details` (localStorage key `savedDetails`). Offer to bring a signed-in customer's saved details across once.

## Shipping address on an order: editable for one hour

**Rule:** a customer can change it until one hour after `created_at`, and only while the order hasn't shipped and has no shipping label. The database decides this using its own clock. The browser's check is only for display.

- **What can change:** recipient name, phone, org, and the address.
- **What can't:** email, items, quantities, shipping speed, billing address. These go through support for now. The only total that can change is tax (below).
- **Who can change it:** the signed-in owner, or a guest with the order number and checkout email, the same check `track_order` uses. Rate-limit this, since it can change where an order goes.
- **How:** a `security definer` function, `update_order_address(p_number, p_email, p_changes jsonb)`. Keep "no update policies" on `orders`, so this function is the only way in.
- **Validation:** repeat the store's rules on the server: required fields, a valid state, a 5-digit ZIP.
- **History:** add an `order_address_edits` table with order id, time, old values, new values and who made the change. The demo keeps the same record in `addressEdits`.
- **Email:** send a confirmation through Resend after every change. Send it to the checkout email, so the customer hears about a change they didn't make.
- **State changes and tax:** allowed. When the new address changes the tax, recalculate it and update the order's tax and total:
  - Show the customer the new tax and the difference before they save.
  - If tax goes down, refund the difference. If it goes up, charge the difference. Save the new address only if that charge succeeds.
  - Record the old and new tax in the history row.
  - Orders paid by crypto or Zelle can't be charged or refunded automatically, so flag the difference for manual handling.
- **Labels:** Shippo labels always read the current address. Creating a label closes the window straight away.
- **Fraud:** changing the address after payment is a common pattern in fraud and chargebacks, so make edits easy to see in the admin view.

### Columns `orders` needs

| Column | Why |
| --- | --- |
| `status` | The demo works status out from the clock. The real one has to be stored |
| `label_created_at`, `shipped_at` | They close the edit window |

Keep the address in `data`, and update it there along with the history row, in one transaction.

## Standing orders

- `subSettings` and `cancelledSubs` move to the database, as already planned.
- Each standing order needs its own shipping address. Every shipment it creates is a new order with its own one-hour window, starting from that shipment.

## Open questions

Don't guess this; ask Kareem and Noza. It's also on the Notion Open questions page.

**One-hour window vs. same-day shipping.** The site promises same-day shipping before 2 PM ET. Default in this spec: printing the label closes the window, so an order packed quickly could close it early. The alternative is holding every order for an hour before packing.

## Before starting

- Rebase first: the branch forked at `39b245c`, before V2 and V3. Expect conflicts in `store/js/core.js` and `store/js/ui.js`.
- Remove the demo-only timing in `PS.orders.status` when real status arrives. "Shipped" sits at 60 minutes only so the demo's window can run its full hour.

## Done means

Verified against a real Supabase project:

- A customer can't edit someone else's profile or order.
- A wrong number and email combination changes nothing.
- An edit at 59 minutes works, and one at 61 minutes is refused even if the browser's clock is wrong.
- An edit after a label exists is refused.
- A state change recalculates tax: a lower tax refunds the difference, and a higher tax charges it, with a failed charge leaving the address unchanged.
- A profile edit leaves placed orders unchanged.
- A confirmed email change keeps the order history, and guest tracking still works with the checkout email.
