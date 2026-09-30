/* Pepsoma — policy pages (shared by both design versions).
   These are starting-point templates written for a US research-use-only (RUO) peptide supplier.
   Have them reviewed by a qualified attorney before launch. Bracketed values come from PS.company. */
(function () {
  const PS = window.PS;
  const C = PS.company;
  const mail = (e) => `<a href="mailto:${e}">${e}</a>`;

  PS.policies = [
    {
      slug: 'terms', title: 'Terms of Service', summary: 'The agreement that governs use of the site and every purchase.',
      body: `
<p>These Terms of Service (“Terms”) govern your access to and use of ${C.domain} (the “Site”) and any purchase of products from ${C.legal} (“${C.name},” “we,” “us”). By accessing the Site or placing an order you agree to these Terms. If you do not agree, do not use the Site.</p>

<h2>1. Research use only</h2>
<p>All products sold by ${C.name} are intended <strong>solely for in-vitro laboratory research and analytical purposes</strong>. Products are not drugs, dietary supplements, food, cosmetics or medical devices; they have not been evaluated or approved by the U.S. Food and Drug Administration (FDA) and are not intended to diagnose, treat, cure, mitigate or prevent any disease. Products must not be administered to humans or animals, used in clinical settings, or used for any purpose other than lawful research. Our full <a href="#/policies/research-use">Research Use Policy</a> is incorporated into these Terms.</p>

<h2>2. Eligibility and buyer representations</h2>
<p>By placing an order you represent and warrant that you: (a) are at least 21 years of age; (b) are a qualified researcher, or are purchasing on behalf of a laboratory, academic institution or business engaged in legitimate research; (c) have the knowledge, facilities and training to handle research chemicals safely; (d) will use products only in accordance with all applicable federal, state and local laws; and (e) will not resell products for human or animal consumption. We may request verification of your identity, affiliation or intended use and may refuse or cancel any order at our sole discretion.</p>

<h2>3. Accounts</h2>
<p>You are responsible for keeping your login credentials confidential and for all activity under your account. Notify us promptly at ${mail(C.email)} of any unauthorized use. We may suspend or close accounts that violate these Terms.</p>

<h2>4. Orders, pricing and availability</h2>
<p>Your order is an offer to purchase. We accept an order when we ship it. Prices, promotions and product availability may change without notice. If a product is listed at an incorrect price due to an error, we may cancel the order and refund any amount charged. Quantity limits may apply. Promo codes cannot be combined unless stated and have no cash value.</p>

<h2>5. Payment</h2>
<p>You authorize us and our payment processors to charge the payment method you provide for the total amount of your order, including shipping and any applicable taxes. You represent that you are authorized to use that payment method. Disputed or fraudulent charges may result in account suspension.</p>

<h2>6. Standing orders</h2>
<p>If you enroll in a standing (recurring) order, you authorize recurring charges as described in our <a href="#/policies/subscriptions">Standing Order Terms</a> until you cancel.</p>

<h2>7. Shipping, title and risk of loss</h2>
<p>Products are shipped as described in our <a href="#/policies/shipping">Shipping Policy</a>. Title and risk of loss pass to you upon our delivery of the package to the carrier.</p>

<h2>8. Returns and refunds</h2>
<p>Returns, replacements and refunds are governed by our <a href="#/policies/refunds">Refund &amp; Return Policy</a>.</p>

<h2>9. Product information</h2>
<p>Product descriptions, specifications and references to published literature are provided for informational and research-context purposes only. They are not claims of safety or efficacy for any use and are not medical advice. Certificates of Analysis apply only to the specific lot identified. See our <a href="#/policies/testing">Testing &amp; COA Policy</a>.</p>

<h2>10. Prohibited uses</h2>
<p>You may not: use the Site for any unlawful purpose; provide false information; purchase products for human or animal use; make health, dosing or therapeutic claims about our products when reselling or publishing content; interfere with the Site’s security or operation; scrape, copy or frame the Site without permission; or infringe our intellectual property.</p>

<h2>11. Intellectual property</h2>
<p>All content on the Site — including text, graphics, logos, product imagery and software — is owned by or licensed to ${C.legal} and protected by intellectual-property laws. You may not reproduce or distribute it without our prior written consent.</p>

<h2>12. Disclaimer of warranties</h2>
<p>EXCEPT AS EXPRESSLY STATED IN A LOT-SPECIFIC CERTIFICATE OF ANALYSIS, PRODUCTS AND THE SITE ARE PROVIDED “AS IS” AND “AS AVAILABLE,” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT PRODUCTS ARE SUITABLE FOR ANY PARTICULAR RESEARCH APPLICATION.</p>

<h2>13. Limitation of liability</h2>
<p>TO THE FULLEST EXTENT PERMITTED BY LAW, ${C.legal.toUpperCase()} WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA OR RESEARCH RESULTS, ARISING FROM YOUR USE OF THE SITE OR PRODUCTS. OUR TOTAL LIABILITY FOR ANY CLAIM WILL NOT EXCEED THE AMOUNT YOU PAID FOR THE PRODUCT GIVING RISE TO THE CLAIM.</p>

<h2>14. Indemnification</h2>
<p>You agree to indemnify and hold harmless ${C.legal}, its members, officers, employees and agents from any claims, damages, losses and expenses (including reasonable attorneys’ fees) arising from your misuse of any product, your violation of these Terms, or your violation of any law or third-party right.</p>

<h2>15. Governing law and disputes</h2>
<p>These Terms are governed by the laws of ${C.state}, without regard to conflict-of-law rules. Any dispute will be resolved exclusively in the state or federal courts located in ${C.county}, ${C.state}, and you consent to their jurisdiction. You and ${C.name} each waive any right to a jury trial or to participate in a class action to the extent permitted by law.</p>

<h2>16. Changes</h2>
<p>We may update these Terms at any time by posting a revised version with a new effective date. Continued use of the Site after changes are posted constitutes acceptance.</p>

<h2>17. Contact</h2>
<p>${C.legal} · ${C.address} · ${mail(C.email)} · ${C.phone}</p>`,
    },
    {
      slug: 'research-use', title: 'Research Use Only Policy', summary: 'How our products may — and may not — be used.',
      body: `
<p class="lead">Every product sold by ${C.name} is a research material intended strictly for in-vitro laboratory research and analytical use.</p>

<h2>Not for human or animal use</h2>
<p>Products are <strong>not for human or veterinary use</strong>, not for consumption, injection, inhalation or topical application, and not for use in any diagnostic or therapeutic procedure. They are not drugs, dietary supplements, cosmetics or food.</p>

<h2>Regulatory status</h2>
<p>Statements on this Site have not been evaluated by the U.S. Food and Drug Administration. ${C.legal} is a supplier of research materials. We are <strong>not</strong> a pharmacy, a compounding pharmacy under Section 503A of the Federal Food, Drug, and Cosmetic Act, or an outsourcing facility under Section 503B, and we do not prescribe, dispense or provide medical advice.</p>

<h2>No medical claims</h2>
<p>References to scientific literature describe areas where compounds have been studied, typically in cell-culture or animal models. They are provided for research context only and are not claims that any product is safe or effective for any purpose. Nothing on this Site is medical advice.</p>

<h2>Buyer responsibility</h2>
<ul>
  <li>You must be 21 or older and purchasing for legitimate research.</li>
  <li>You are responsible for safe handling, storage and disposal in accordance with your institution’s protocols and applicable law, including OSHA and local hazardous-materials rules.</li>
  <li>You are responsible for determining whether possession and use of any product is lawful in your jurisdiction.</li>
</ul>

<h2>Order screening</h2>
<p>We may refuse, cancel or refund any order, and close any account, if we reasonably believe products are intended for human or animal use, for resale as consumer products, or for any unlawful purpose. Customer communications suggesting personal use (for example, questions about dosing or self-administration) may result in order cancellation.</p>

<h2>Attestation</h2>
<p>At checkout, every customer affirms that they are 21+ and that products are purchased solely for lawful laboratory research. That attestation is recorded with the order.</p>`,
    },
    {
      slug: 'shipping', title: 'Shipping Policy', summary: 'Processing times, carriers, rates and delivery issues.',
      body: `
<h2>Processing time</h2>
<p>Orders placed before <strong>${C.cutoff}, Monday–Friday</strong> (excluding U.S. federal holidays) ship the same business day. Orders placed after the cutoff, on weekends or on holidays ship the next business day. Orders flagged for verification may take longer; we’ll contact you by email if we need anything.</p>

<h2>Rates and methods</h2>
<table class="policy-table">
  <thead><tr><th>Method</th><th>Delivery estimate</th><th>Rate</th></tr></thead>
  <tbody>
    ${PS.config.shipping.map((m) => `<tr><td>${m.label}</td><td>${m.eta}</td><td>${PS.money(m.price)}${m.freeEligible ? ` — <strong>free on orders ${PS.money0(PS.config.freeShip)}+</strong>` : ''}</td></tr>`).join('')}
  </tbody>
</table>
<p>Delivery estimates begin once an order ships and are not guaranteed. Carrier delays caused by weather, volume or other events outside our control are not eligible for shipping refunds.</p>

<h2>Where we ship</h2>
<p>We ship to addresses within the United States, including APO/FPO/DPO addresses via USPS. We do not currently ship internationally. We reserve the right not to ship to any jurisdiction where a product may be restricted.</p>

<h2>Packaging</h2>
<p>Lyophilized products are stable at ambient temperature during transit. Vials ship sealed in protective inserts inside plain, unbranded outer packaging, together with a printed, lot-matched Certificate of Analysis.</p>

<h2>Tracking</h2>
<p>A tracking number is emailed when your label is created. You can also check status any time on our <a href="#/track">Track Order</a> page.</p>

<h2>Address accuracy</h2>
<p>Please double-check your shipping address. We are not responsible for packages delivered to an address entered incorrectly. If you notice an error, contact ${mail(C.email)} immediately — we can update the address only before the order ships. Packages returned to us as undeliverable can be reshipped at the customer’s expense.</p>

<h2>Lost, stolen or damaged packages</h2>
<p>Title and risk of loss pass to you when the package is handed to the carrier. That said, we want your research on schedule: if tracking shows no movement for 5 business days, or your package arrives damaged, email ${mail(C.email)} within <strong>7 days</strong> of the delivery date (or expected delivery date) with your order number and photos of any damage. We will open a carrier claim and, where appropriate, reship or refund. For packages the carrier marks as delivered but you did not receive, we’ll file a carrier claim on your behalf and work with you on a resolution.</p>`,
    },
    {
      slug: 'refunds', title: 'Refund & Return Policy', summary: 'Cancellations, returns, damaged items and refunds.',
      body: `
<h2>Order cancellations</h2>
<p>You may cancel an order for a full refund any time before it ships by emailing ${mail(C.email)} with your order number. Once an order has shipped it cannot be cancelled, but may be eligible for return under this policy.</p>

<h2>Unopened products — 30-day returns</h2>
<p>Unopened products with intact seals and labels may be returned within <strong>30 days of delivery</strong> for a refund to the original payment method. To start a return, email us for a Return Authorization (RA) number; returns without an RA cannot be processed. Return shipping is the customer’s responsibility unless the return is due to our error. Refunds are issued within 5 business days of our receiving and inspecting the return.</p>

<h2>Opened products</h2>
<p>To protect product integrity and the safety of our team and customers, we cannot accept returns of any vial that has been opened, reconstituted, unsealed or stored outside the recommended conditions.</p>

<h2>Damaged, defective or incorrect items</h2>
<p>If your order arrives damaged, contains the wrong item, or a product does not conform to its lot-specific Certificate of Analysis, contact us within <strong>7 days of delivery</strong> with your order number and photos. We will send a replacement or issue a full refund, at your choice — usually without requiring the item to be returned.</p>

<h2>Quality concerns</h2>
<p>If your own analytical testing indicates a result outside the specifications on the COA, send us your method and data. We will review with our testing laboratory and, if a nonconformance is confirmed, replace or refund the affected product.</p>

<h2>Standing orders</h2>
<p>Standing-order shipments may be cancelled for a full refund before they ship. Shipped standing-order items are treated like any other order under this policy.</p>

<h2>Non-refundable items</h2>
<ul><li>Shipping charges (unless the return is due to our error)</li><li>Gift cards</li><li>Orders cancelled by us due to a violation of our Research Use Policy may be refunded less a processing fee of up to 10% where permitted by law.</li></ul>

<h2>Chargebacks</h2>
<p>Please contact us before disputing a charge with your bank — we can almost always resolve issues faster directly. Accounts with unresolved chargebacks may be suspended.</p>`,
    },
    {
      slug: 'testing', title: 'Testing & COA Policy', summary: 'Our quality standard and how Certificates of Analysis work.',
      body: `
<h2>Every lot, independently tested</h2>
<p>Before any lot is released for sale, samples are sent to an independent ISO/IEC 17025-accredited analytical laboratory. We never self-certify.</p>

<h2>Our release panel</h2>
<table class="policy-table">
  <thead><tr><th>Test</th><th>Method</th><th>Release specification</th></tr></thead>
  <tbody>
    <tr><td>Purity</td><td>Reverse-phase HPLC</td><td>≥ 98.0% (typical ≥ 99%)</td></tr>
    <tr><td>Identity</td><td>Mass spectrometry (ESI-MS)</td><td>Within ± 1.0 Da of theoretical mass</td></tr>
    <tr><td>Net content</td><td>Gravimetric / HPLC assay</td><td>≥ 100% of labeled amount</td></tr>
    <tr><td>Endotoxin</td><td>LAL (USP ⟨85⟩)</td><td>&lt; 1.0 EU/mg</td></tr>
    <tr><td>Heavy metals</td><td>ICP-MS</td><td>Pb, As, Cd, Hg each &lt; 0.5 ppm</td></tr>
    <tr><td>Sterility</td><td>USP ⟨71⟩</td><td>No growth</td></tr>
  </tbody>
</table>

<h2>Lot traceability</h2>
<p>Every vial is labeled with a lot number. Enter it on the <a href="#/lab-tests">Lab Tests</a> page to view the COA for that exact lot. A printed COA ships with every order. Lot records are retained for at least five years.</p>

<h2>Out-of-specification results</h2>
<p>Lots that fail any release test are quarantined and never sold. If post-release testing identifies a problem, affected customers are notified by email and offered a replacement or refund.</p>

<h2>Limitations</h2>
<p>A COA applies only to the lot identified and reflects results at the time of testing. Product stability after delivery depends on storage and handling. COAs are not a representation that a product is suitable for any particular research application.</p>`,
    },
    {
      slug: 'subscriptions', title: 'Standing Order Terms', summary: 'Automatic-renewal terms for recurring shipments.',
      body: `
<p class="lead">Standing orders let you receive the same research materials on a regular schedule at a discount. This page is our automatic-renewal disclosure.</p>

<h2>How it works</h2>
<ul>
  <li>When you choose a standing order, you’re charged for your first shipment at checkout.</li>
  <li>Your order then <strong>renews automatically</strong> every 4 or 8 weeks (as selected) and your payment method is charged the then-current discounted price, plus any shipping and tax, on each renewal date until you cancel.</li>
  <li>Standing-order discounts are ${PS.config.plans.filter((p) => p.pct).map((p) => `${p.pct}% (${p.short.toLowerCase()})`).join(' and ')} off the one-time price.</li>
</ul>

<h2>Reminders</h2>
<p>We email you a reminder at least 3 days before each renewal charge, with a link to skip, change or cancel.</p>

<h2>Cancel any time</h2>
<p>You can cancel online from <a href="#/account">your account</a>, by replying to any reminder email, or by emailing ${mail(C.email)}. Cancellations received before a renewal is processed take effect immediately; there are no cancellation fees and no minimum commitment.</p>

<h2>Price changes</h2>
<p>If the price of an item in your standing order changes, we’ll notify you at least 14 days before the change affects a renewal.</p>

<h2>Failed payments</h2>
<p>If a renewal payment fails, we’ll retry and notify you. Standing orders with repeated failed payments may be paused.</p>`,
    },
    {
      slug: 'privacy', title: 'Privacy Policy', summary: 'What we collect, why, and the choices you have.',
      body: `
<p>This Privacy Policy explains how ${C.legal} collects, uses and shares personal information when you visit ${C.domain} or buy from us.</p>

<h2>Information we collect</h2>
<ul>
  <li><strong>Information you provide:</strong> name, email, phone, shipping and billing address, organization or institution, account credentials, order details, research-use attestations, and messages you send us.</li>
  <li><strong>Payment information:</strong> processed directly by our PCI-DSS-compliant payment processor. We do not store full card numbers.</li>
  <li><strong>Automatically collected:</strong> IP address, device and browser type, pages viewed, referring URLs and similar data collected through cookies and similar technologies (see our <a href="#/policies/cookies">Cookie Policy</a>).</li>
</ul>

<h2>How we use information</h2>
<ul>
  <li>To process, verify, ship and support your orders, including fraud prevention and research-use screening.</li>
  <li>To manage your account and standing orders.</li>
  <li>To send transactional messages (order confirmations, shipping updates, renewal reminders).</li>
  <li>To send marketing emails if you opt in — you can unsubscribe at any time.</li>
  <li>To operate, secure and improve the Site, and to comply with legal obligations.</li>
</ul>

<h2>How we share information</h2>
<p>We do not sell your personal information and do not share it for cross-context behavioral advertising. We share information only with service providers who help us run our business (payment processing, shipping carriers, email delivery, hosting, analytics), under contracts that limit their use of it; with authorities when required by law; and in connection with a merger or sale of our business.</p>

<h2>Retention</h2>
<p>We keep order records for as long as required for tax, accounting and product-traceability purposes (generally seven years) and other information only as long as necessary for the purposes above.</p>

<h2>Your rights</h2>
<p>Depending on where you live (for example California, Colorado, Connecticut, Virginia, Texas and other states with consumer privacy laws), you may have the right to access, correct, delete or obtain a copy of your personal information, and to opt out of targeted advertising or the sale of personal information. To make a request, email ${mail(C.privacyEmail)}. We will verify your request and respond within the time required by law. We will not discriminate against you for exercising your rights. You may use an authorized agent where permitted.</p>

<h2>Security</h2>
<p>We use administrative, technical and physical safeguards — including TLS encryption in transit — to protect your information. No method of transmission or storage is 100% secure.</p>

<h2>Age restriction</h2>
<p>The Site is intended only for adults 21 and older. We do not knowingly collect information from anyone under 21.</p>

<h2>Changes and contact</h2>
<p>We may update this policy and will post the new effective date. Questions: ${mail(C.privacyEmail)} · ${C.legal}, ${C.address}.</p>`,
    },
    {
      slug: 'cookies', title: 'Cookie Policy', summary: 'The cookies we use and how to control them.',
      body: `
<p>Cookies are small files stored in your browser. We use them, and similar technologies such as local storage, to run the Site and understand how it’s used.</p>

<table class="policy-table">
  <thead><tr><th>Type</th><th>Purpose</th><th>Can be disabled?</th></tr></thead>
  <tbody>
    <tr><td>Strictly necessary</td><td>Cart contents, checkout, login sessions, security, age-verification and cookie-choice memory.</td><td>No — the Site won’t work without them.</td></tr>
    <tr><td>Analytics</td><td>Aggregate, de-identified measurement of page views and site performance.</td><td>Yes</td></tr>
    <tr><td>Marketing</td><td>Measuring the effectiveness of our email campaigns. We do not use third-party ad-retargeting cookies.</td><td>Yes</td></tr>
  </tbody>
</table>

<h2>Your choices</h2>
<p>When you first visit, you can accept all cookies or only essential ones. You can change your choice any time by clearing site data in your browser, which will show the banner again. Most browsers also let you block or delete cookies in their settings, and we honor Global Privacy Control (GPC) signals as an opt-out.</p>`,
    },
    {
      slug: 'accessibility', title: 'Accessibility Statement', summary: 'Our commitment to an accessible site.',
      body: `
<p>${C.name} is committed to making ${C.domain} usable by everyone, including people with disabilities. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.</p>
<h2>What we do</h2>
<ul><li>Semantic HTML with labeled form fields and keyboard-operable navigation, menus and dialogs.</li><li>Text alternatives for product imagery.</li><li>Color contrast checked against WCAG AA.</li><li>Support for reduced-motion preferences.</li></ul>
<h2>Feedback</h2>
<p>If you encounter a barrier, email ${mail(C.email)} or call ${C.phone}. We’ll respond within two business days and can help you place an order directly.</p>`,
    },
  ];

  PS.getPolicy = (slug) => PS.policies.find((p) => p.slug === slug);
})();
