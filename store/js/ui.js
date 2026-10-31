/* Pepsoma — shared UI: components, default pages, behaviors and app boot.
   A theme (a/app.js or b/app.js) supplies layout + the design-heavy pages; everything
   else — forms, validation, cart drawer, modals, routing — lives here so both versions
   behave identically. */
(function () {
  const PS = window.PS;
  const esc = PS.esc;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  PS.$ = $; PS.$$ = $$;

  /* ---------- icons ---------- */
  const I = {
    check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
    cart: '<path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.2L21 8H6.2"/><circle cx="9.5" cy="20" r="1.2"/><circle cx="17.5" cy="20" r="1.2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
    flask: '<path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill="currentColor" stroke="none"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    trash: '<path d="M4 7h16"/><path d="M9.5 7V4.5h5V7"/><path d="M6 7l.9 12.2A1.8 1.8 0 0 0 8.7 21h6.6a1.8 1.8 0 0 0 1.8-1.8L18 7"/><path d="M10 11v6M14 11v6"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>',
    monitor: '<rect x="3" y="4" width="18" height="12.5" rx="2"/><path d="M8.5 20.5h7M12 16.5v4"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    box: '<path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/>',
    beaker: '<path d="M6 3h12M8 3v14a4 4 0 0 0 8 0V3"/><path d="M8 12h8"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    x: '<path d="M4 4l16 16M20 4L4 20"/>',
    youtube: '<rect x="2.5" y="6" width="19" height="12" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>',
  };
  PS.icon = (n, cls) => `<svg class="icon ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;

  /* ---------- form components ---------- */
  const H = (PS.html = {});
  H.field = (o) => {
    const id = `${o.form || 'f'}-${o.name}`;
    const req = o.required !== false;
    const common = `id="${id}" name="${o.name}" class="input" ${req ? 'required' : ''} ${o.auto ? `autocomplete="${o.auto}"` : ''} ${o.validate ? `data-validate="${o.validate}"` : ''} ${o.attrs || ''}`;
    let input;
    if (o.options) input = `<select ${common}>${o.options.map(([v, l]) => `<option value="${esc(v)}" ${v === (o.value || '') ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
    else if (o.type === 'textarea') input = `<textarea ${common} rows="${o.rows || 5}" placeholder="${esc(o.placeholder || '')}">${esc(o.value || '')}</textarea>`;
    else input = `<input ${common} type="${o.type || 'text'}" value="${esc(o.value || '')}" placeholder="${esc(o.placeholder || '')}">`;
    return `<div class="field ${o.cls || ''}"><label class="label" for="${id}">${o.label}${req ? '' : ' <span class="optional">optional</span>'}</label>${input}${o.hint ? `<small class="hint">${o.hint}</small>` : ''}<small class="field-error" aria-live="polite"></small></div>`;
  };
  H.check = (o) => `<div class="field field-check"><label class="check"><input type="checkbox" name="${o.name}" ${o.required ? 'required' : ''} ${o.checked ? 'checked' : ''}><span class="check-box">${PS.icon('check')}</span><span class="check-label">${o.label}</span></label>${o.required ? '<small class="field-error" aria-live="polite"></small>' : ''}</div>`;

  H.qty = (value, attrs) => `<div class="qty" ${attrs || ''}><button type="button" class="qty-btn" data-step="-1" aria-label="Decrease quantity">${PS.icon('minus')}</button><input class="qty-input" name="qty" type="number" min="1" max="99" value="${value || 1}" aria-label="Quantity" inputmode="numeric"><button type="button" class="qty-btn" data-step="1" aria-label="Increase quantity">${PS.icon('plus')}</button></div>`;

  H.promoForm = (t) => t.promo
    ? `<div class="promo-applied"><span>${PS.icon('check')} <strong>${esc(t.promo.code)}</strong> — ${esc(t.promo.label)}</span><button type="button" class="link-btn" data-remove-promo>Remove</button></div>`
    : `<form class="promo-form" data-form="promo" novalidate><label class="sr-only" for="promo-code">Promo code</label><input id="promo-code" class="input" name="code" placeholder="Promo code" autocomplete="off"><button class="btn btn-secondary" type="submit">Apply</button></form>${t.promoCode ? `<p class="small muted">${esc(t.promoCode)} isn’t active for this cart.</p>` : ''}`;

  H.freeShip = (t) => t.count === 0 ? '' : `<div class="freeship"><div class="freeship-text">${t.freeStandard ? `${PS.icon('truck')} You’ve unlocked <strong>free standard shipping</strong>` : `${PS.icon('truck')} You’re <strong>${PS.money(t.freeShipRemaining)}</strong> away from free shipping`}</div><div class="freeship-bar"><span style="width:${Math.round((t.freeStandard ? 1 : t.freeShipProgress) * 100)}%"></span></div></div>`;

  H.tierNote = (t) => {
    if (t.deal === 'bogo') {
      if (t.dealOdd.length) return `<p class="tier-note">Add <strong>1 more ${esc(t.dealOdd[0].product.name)}</strong> (${esc(t.dealOdd[0].sizeObj.label)}) and it’s <strong>free</strong> · Buy 1 Get 1</p>`;
      if (t.dealFree) return `<p class="tier-note">${PS.icon('check')} Buy 1 Get 1 applied: ${t.dealFree} free vial${t.dealFree > 1 ? 's' : ''}</p>`;
      return '';
    }
    if (t.tier && !t.nextTier) return `<p class="tier-note">${PS.icon('check')} Max volume savings applied: ${t.tier.pct}% off one-time vials</p>`;
    if (t.nextTier && t.onceQty > 0) return `<p class="tier-note">Add <strong>${t.nextTier.min - t.onceQty}</strong> more vial${t.nextTier.min - t.onceQty > 1 ? 's' : ''} to save <strong>${t.nextTier.pct}%</strong>${t.tier ? ` (now ${t.tier.pct}%)` : ''}</p>`;
    return '';
  };

  // Totals rows (used in drawer, cart and checkout summaries)
  H.totalsRows = (t, opts) => {
    opts = opts || {};
    const row = (l, v, cls) => `<div class="tot-row ${cls || ''}"><span>${l}</span><span>${v}</span></div>`;
    return `<div class="totals">
      ${row('Subtotal', PS.money(t.subtotal))}
      ${t.tierDiscount ? row(`Volume savings (${t.tier.pct}%)`, '−' + PS.money(t.tierDiscount), 'discount') : ''}
      ${t.dealDiscount ? row(`Buy 1 Get 1 (${t.dealFree} free)`, '−' + PS.money(t.dealDiscount), 'discount') : ''}
      ${t.promoDiscount ? row(`Promo ${esc(t.promo.code)}`, '−' + PS.money(t.promoDiscount), 'discount') : ''}
      ${opts.shipping ? row(`Shipping <small>${esc(t.method.label.split(' — ')[0])}</small>`, t.shipping ? PS.money(t.shipping) : 'Free') : row('Shipping', t.freeStandard ? 'Free' : 'Calculated at checkout')}
      ${opts.shipping ? row('Tax', 'Calculated per state · $0.00', 'muted') : ''}
      ${row('Total', PS.money(opts.shipping ? t.total : t.merch), 'grand')}
      ${t.savings > 0 ? `<div class="tot-savings">You’re saving ${PS.money(t.savings)}</div>` : ''}
    </div>`;
  };

  H.checkoutForm = (user, t) => {
    const f = (o) => H.field(Object.assign({ form: 'co' }, o));
    // details saved on this browser fill the form (and keep the save box ticked); otherwise a signed-in visitor's name and email do
    const sv = PS.details.get(), bill = (sv && sv.billing) || null, ad = (sv && sv.address) || {};
    const v = (k, d) => (sv ? sv[k] : d) || '';
    return `<form class="checkout-form" data-form="checkout" novalidate>
      <fieldset class="fs"><legend class="legend"><span class="legend-n">1</span> Contact</legend>
        ${f({ name: 'email', label: 'Email', type: 'email', auto: 'email', validate: 'email', value: v('email', user && user.email) })}
        ${f({ name: 'phone', label: 'Phone', type: 'tel', auto: 'tel', required: false, validate: 'phone', hint: 'For delivery issues only.', value: v('phone') })}
        ${user ? `<p class="small muted">Signed in as ${esc(user.email)}</p>` : `<p class="small muted">Have an account? <a href="#/account?next=/checkout">Sign in</a> to see order history.</p>`}
      </fieldset>
      <fieldset class="fs"><legend class="legend"><span class="legend-n">2</span> Shipping address</legend>
        <div class="field-row">${f({ name: 'first', label: 'First name', auto: 'given-name', value: v('first', user && user.name.split(' ')[0]) })}${f({ name: 'last', label: 'Last name', auto: 'family-name', value: v('last', user && user.name.split(' ').slice(1).join(' ')) })}</div>
        ${f({ name: 'org', label: 'Lab / institution', auto: 'organization', required: false, value: v('org') })}
        ${f({ name: 'address1', label: 'Street address', auto: 'address-line1', value: ad.line1 })}
        ${f({ name: 'address2', label: 'Apt, suite, building', auto: 'address-line2', required: false, value: ad.line2 })}
        <div class="field-row three">${f({ name: 'city', label: 'City', auto: 'address-level2', value: ad.city })}${f({ name: 'state', label: 'State', options: PS.states, auto: 'address-level1', value: ad.state })}${f({ name: 'zip', label: 'ZIP', auto: 'postal-code', validate: 'zip', attrs: 'inputmode="numeric" maxlength="10"', value: ad.zip })}</div>
        ${H.check({ name: 'billingSame', label: 'Billing address same as shipping', checked: !bill })}
        <div class="billing-fields" data-billing ${bill ? '' : 'hidden'}>
          <h3 class="legend legend-sub">Billing address</h3>
          ${f({ name: 'baddress1', label: 'Street address', auto: 'billing address-line1', attrs: bill ? '' : 'disabled', value: bill && bill.line1 })}
          ${f({ name: 'baddress2', label: 'Apt, suite, building', auto: 'billing address-line2', required: false, attrs: bill ? '' : 'disabled', value: bill && bill.line2 })}
          <div class="field-row three">${f({ name: 'bcity', label: 'City', auto: 'billing address-level2', attrs: bill ? '' : 'disabled', value: bill && bill.city })}${f({ name: 'bstate', label: 'State', options: PS.states, auto: 'billing address-level1', attrs: bill ? '' : 'disabled', value: bill && bill.state })}${f({ name: 'bzip', label: 'ZIP', auto: 'billing postal-code', validate: 'zip', attrs: 'inputmode="numeric" maxlength="10"' + (bill ? '' : ' disabled'), value: bill && bill.zip })}</div>
        </div>
      </fieldset>
      <fieldset class="fs"><legend class="legend"><span class="legend-n">3</span> Shipping method</legend>
        <div class="options">${PS.config.shipping.map((m, i) => `<label class="option"><input type="radio" name="ship" value="${m.id}" ${i === 0 ? 'checked' : ''}><span class="option-dot"></span><span class="option-body"><span class="option-title">${esc(m.label)}</span><span class="option-sub">${esc(m.eta)}</span></span><span class="option-price" data-ship-price="${m.id}">${PS.money(t.shipPrice(m)) === '$0.00' ? 'Free' : PS.money(t.shipPrice(m))}</span></label>`).join('')}</div>
      </fieldset>
      <fieldset class="fs"><legend class="legend"><span class="legend-n">4</span> Payment</legend>
        <div class="demo-note">${PS.icon('lock')} <span><strong>Demo checkout — no card is charged.</strong> Try <code>4242 4242 4242 4242</code>, any future expiry, any CVC.</span></div>
        ${f({ name: 'cardname', label: 'Name on card', auto: 'cc-name' })}
        ${f({ name: 'card', label: 'Card number', auto: 'cc-number', validate: 'card', attrs: 'inputmode="numeric" data-format="card" maxlength="19" placeholder="1234 5678 9012 3456"' })}
        <div class="field-row">${f({ name: 'exp', label: 'Expiry', auto: 'cc-exp', validate: 'exp', attrs: 'inputmode="numeric" data-format="exp" maxlength="7" placeholder="MM / YY"' })}${f({ name: 'cvc', label: 'CVC', auto: 'cc-csc', validate: 'cvc', attrs: 'inputmode="numeric" maxlength="4" placeholder="123"' })}</div>
      </fieldset>
      <fieldset class="fs attest"><legend class="legend"><span class="legend-n">5</span> Research use attestation</legend>
        ${H.check({ name: 'ruo', required: true, label: 'I confirm these materials are purchased solely for in-vitro laboratory research and <strong>not for human or animal consumption</strong>.' })}
        ${H.check({ name: 'age', required: true, label: 'I am 21 years of age or older.' })}
        ${H.check({ name: 'terms', required: true, label: 'I agree to the <a target="_blank" rel="noopener" href="#/policies/terms">Terms of Service</a>, <a target="_blank" rel="noopener" href="#/policies/research-use">Research Use Policy</a> and <a target="_blank" rel="noopener" href="#/policies/refunds">Refund Policy</a>.' })}
        ${t.hasSubs ? H.check({ name: 'subs', required: true, label: 'I understand my standing order <strong>renews automatically</strong> and I’ll be charged on each ship date until I cancel. <a target="_blank" rel="noopener" href="#/policies/subscriptions">Standing Order Terms</a>' }) : ''}
        ${H.check({ name: 'marketing', label: 'Email me new lots, restocks and research-stack offers.' })}
      </fieldset>
      ${H.check({ name: 'saveDetails', checked: !!sv, label: 'Save my details for next time <small class="save-note">Details stay on this browser only.</small>' })}
      <button class="btn btn-primary btn-lg btn-block" type="submit" data-submit>${PS.icon('lock')} Place order · <span data-total>${PS.money(t.total)}</span></button>
      <p class="secure-note">Secure checkout. By placing your order you agree to our <a href="#/policies" target="_blank" rel="noopener">policies</a>.</p>
    </form>`;
  };

  // q: the Contact page's address query, so a link elsewhere can open the form with a topic (and an order number or the start of a message) filled in
  H.contactForm = (q) => {
    q = q || {};
    const f = (o) => H.field(Object.assign({ form: 'ct' }, o));
    return `<form class="stack-form" data-form="contact" novalidate>
      <div class="field-row">${f({ name: 'name', label: 'Name', auto: 'name' })}${f({ name: 'email', label: 'Email', type: 'email', auto: 'email', validate: 'email' })}</div>
      <div class="field-row">${f({ name: 'topic', label: 'Topic', options: [['', 'Select…'], ['order', 'Order support'], ['coa', 'Product / COA question'], ['wholesale', 'Wholesale & institutional'], ['other', 'Something else']], value: q.topic })}${f({ name: 'order', label: 'Order number', required: false, placeholder: 'PS123456', value: /^PS\d+$/i.test(q.order || '') ? q.order.toUpperCase() : '' })}</div>
      ${f({ name: 'message', label: 'Message', type: 'textarea', placeholder: 'How can we help?', value: (q.msg || '').slice(0, 200) })}
      <p class="small muted">Please don’t include questions about personal use or dosing — we can only support laboratory research.</p>
      <button class="btn btn-primary" type="submit">Send message ${PS.icon('arrow')}</button>
    </form>`;
  };

  H.wholesaleForm = () => {
    const f = (o) => H.field(Object.assign({ form: 'ws' }, o));
    return `<form class="stack-form" data-form="wholesale" novalidate>
      <div class="field-row">${f({ name: 'org', label: 'Organization', auto: 'organization' })}${f({ name: 'type', label: 'Organization type', options: [['', 'Select…'], ['academic', 'University / academic lab'], ['biotech', 'Biotech / pharma R&D'], ['cro', 'Contract research org (CRO)'], ['distributor', 'Research distributor'], ['other', 'Other']] })}</div>
      <div class="field-row">${f({ name: 'name', label: 'Contact name', auto: 'name' })}${f({ name: 'email', label: 'Work email', type: 'email', auto: 'email', validate: 'email' })}</div>
      <div class="field-row">${f({ name: 'phone', label: 'Phone', type: 'tel', required: false, validate: 'phone' })}${f({ name: 'volume', label: 'Est. monthly volume', options: [['', 'Select…'], ['1', '$500 – $2,500'], ['2', '$2,500 – $10,000'], ['3', '$10,000 – $50,000'], ['4', '$50,000+']] })}</div>
      ${f({ name: 'compounds', label: 'Compounds of interest', type: 'textarea', rows: 3, placeholder: 'e.g. BPC-157 10 mg × 100 vials / month' })}
      ${H.check({ name: 'ruo', required: true, label: 'Our organization purchases for lawful laboratory research only.' })}
      <button class="btn btn-primary" type="submit">Request wholesale pricing ${PS.icon('arrow')}</button>
    </form>`;
  };

  H.trackForm = (q) => {
    const f = (o) => H.field(Object.assign({ form: 'tr' }, o));
    return `<form class="stack-form" data-form="track" novalidate>
      <div class="field-row">${f({ name: 'order', label: 'Order number', placeholder: 'PS123456', value: q.order || '' })}${f({ name: 'email', label: 'Email used at checkout', type: 'email', validate: 'email', value: q.email || '' })}</div>
      <button class="btn btn-primary" type="submit">Track order ${PS.icon('arrow')}</button>
    </form><div data-track-result></div>`;
  };

  H.newsletter = (label) => `<form class="newsletter" data-form="newsletter" novalidate><label class="sr-only" for="nl-${label || 'x'}">Email address</label><input id="nl-${label || 'x'}" class="input" type="email" name="email" placeholder="you@lab.org" required data-validate="email"><button class="btn btn-primary" type="submit">Subscribe</button><small class="field-error" aria-live="polite"></small></form>`;

  H.orderStatus = (o) => {
    const s = PS.orders.status(o);
    return `<ol class="timeline">${s.steps.map((st) => `<li class="${st.done ? 'done' : ''} ${st.current ? 'current' : ''}"><span class="tl-dot">${st.done ? PS.icon('check') : ''}</span><span class="tl-body"><strong>${st.label}</strong><small>${st.done ? new Date(st.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Pending'}</small>${st.id === 'shipped' && st.done ? `<small>Tracking: <code>${esc(o.tracking)}</code></small>` : ''}</span></li>`).join('')}</ol>
    <p class="small muted">Demo timeline runs in minutes instead of days so you can watch it progress.</p>`;
  };

  // each line shows the product picture; the picture and the name both open the product page
  H.orderItems = (o) => `<ul class="order-items">${o.items.map((i) => {
    const p = PS.getProduct(i.id), href = `#/product/${esc(i.id)}`;
    return `<li>${p ? `<a class="oi-img" href="${href}" aria-label="${esc(i.name)}">${PS.productImage(p, { theme: T().vialTheme, size: i.size })}</a>` : ''}<span class="oi-name">${i.qty} × ${p ? `<a href="${href}">${esc(i.name)}</a>` : esc(i.name)} <small>${esc(i.size)}${i.planId !== 'once' ? ' · ' + esc(i.plan) : ''}</small></span><span>${PS.money(i.total)}</span></li>`;
  }).join('')}</ul>
    <div class="totals">
      <div class="tot-row"><span>Subtotal</span><span>${PS.money(o.subtotal)}</span></div>
      ${o.tierDiscount ? `<div class="tot-row discount"><span>Volume savings (${o.tierPct}%)</span><span>−${PS.money(o.tierDiscount)}</span></div>` : ''}
      ${o.dealDiscount ? `<div class="tot-row discount"><span>Buy 1 Get 1 (${o.dealFree} free)</span><span>−${PS.money(o.dealDiscount)}</span></div>` : ''}
      ${o.promoDiscount ? `<div class="tot-row discount"><span>Promo ${esc(o.promo)}</span><span>−${PS.money(o.promoDiscount)}</span></div>` : ''}
      <div class="tot-row"><span>Shipping</span><span>${o.shipping ? PS.money(o.shipping) : 'Free'}</span></div>
      <div class="tot-row grand"><span>Total</span><span>${PS.money(o.total)}</span></div>
    </div>`;

  H.specTable = (p) => {
    const rows = [
      ['Full name', p.full], ['Sequence', p.seq], ['Molecular formula', p.formula], ['Molecular weight', p.mw ? p.mw + ' g/mol' : '—'],
      ['CAS number', p.cas], ['Purity (current lot)', p.purity ? p.purity + '% (HPLC)' : '—'],
      ['Form', p.liquid ? 'Sterile solution' : p.appearance || 'White lyophilized powder'],
      ['Storage', p.liquid ? 'Room temperature; discard 28 days after first puncture' : '−20 °C long-term · 2–8 °C short-term · protect from light'],
    ].filter((r) => r[1]);
    return `<table class="spec-table"><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>`;
  };

  H.lotRows = (lots) => lots.map((l) => {
    const p = PS.getProduct(l.product);
    return `<tr data-lot-row="${esc((l.code + ' ' + p.name + ' ' + p.cat).toLowerCase())}">
      <td><code>${esc(l.code)}</code></td><td><a href="#/product/${p.id}">${esc(p.name)}</a></td><td>${PS.date(l.tested)}</td>
      <td><strong>${l.purity}%</strong></td><td><span class="badge ${l.current ? 'badge-live' : 'badge-muted'}">${l.current ? 'Current lot' : 'Archived'}</span></td>
      <td><button class="btn btn-sm btn-secondary" type="button" data-coa="${esc(l.code)}">${PS.icon('doc')} View COA</button></td></tr>`;
  }).join('');
  H.lotTable = (lots) => `<div class="table-wrap"><table class="lot-table"><thead><tr><th>Lot</th><th>Product</th><th>Tested</th><th>Purity</th><th>Status</th><th><span class="sr-only">COA</span></th></tr></thead><tbody>${H.lotRows(lots)}</tbody></table><p class="empty-row" hidden>No lots match that search.</p></div>`;
  // Lab Tests page: one card per product with its current lot; earlier lots are links underneath
  H.lotCards = (lots) => {
    const by = {};
    lots.forEach((l) => (by[l.product] = by[l.product] || []).push(l));
    return `<div class="lot-cards">${Object.keys(by).map((id) => {
      const p = PS.getProduct(id), [cur, ...older] = by[id];
      const key = by[id].map((l) => l.code).concat(p.name, p.cat).join(' ').toLowerCase();
      return `<article class="card lot-card" data-lot-row="${esc(key)}" data-lot-product="${esc(p.id)}">
        <a class="lot-card-img" href="#/product/${p.id}" aria-label="${esc(p.name)}">${PS.productImage(p, { theme: T().vialTheme })}</a>
        <div class="lot-card-body">
          <h3 class="h4"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
          <dl class="lot-card-facts"><div><dt>Purity</dt><dd>${cur.purity}%</dd></div><div><dt>Lot</dt><dd><code>${esc(cur.code)}</code></dd></div><div><dt>Tested</dt><dd>${PS.date(cur.tested)}</dd></div></dl>
          <button class="btn btn-primary btn-sm" type="button" data-coa="${esc(cur.code)}">${PS.icon('doc')} View COA</button>
          ${older.length ? `<p class="lot-older">Earlier lots: ${older.map((l) => `<a href="#/coa/${esc(l.code)}" data-coa="${esc(l.code)}">${esc(l.code)}</a>`).join(' · ')}</p>` : ''}
        </div></article>`;
    }).join('')}</div><p class="empty-row" hidden>No lots match that search or filter.</p>`;
  };

  H.faq = (groups) => groups.map((g) => `<div class="faq-group">${g.group ? `<h3 class="faq-group-title">${esc(g.group)}</h3>` : ''}${g.items.map(([q, a]) => `<details class="faq-item"><summary><span>${esc(q)}</span>${PS.icon('chev', 'faq-chev')}</summary><div class="faq-a"><p>${esc(a)}</p></div></details>`).join('')}</div>`).join('');

  H.disclaimer = () => `${PS.company.legal} supplies research materials intended strictly for in-vitro laboratory research. Products are not drugs, supplements or cosmetics, have not been evaluated by the FDA, and are not intended to diagnose, treat, cure or prevent any disease. Not for human or veterinary use. ${PS.company.name} is not a compounding pharmacy or outsourcing facility under Sections 503A/503B of the FD&amp;C Act. By purchasing you confirm you are 21+ and a qualified researcher.`;

  /* ---------- default pages (themes can override any of these) ---------- */
  const T = () => PS.theme;

  // Sign in and Create account are separate pages. `next` is where to go once signed in (set by links that ask for a sign-in first).
  const safeNext = (n) => (/^\/[\w\-./]*$/.test(n || '') && !/^\/\//.test(n) ? n : '');
  function authPage(mode, next) {
    const f = (o) => H.field(o), q = next ? '?next=' + next : '', signin = mode === 'signin';
    return {
      title: signin ? 'Sign in' : 'Create account',
      html: `<div class="auth-page ${signin ? 'from-left' : 'from-right'}"><span class="auth-wordmark" aria-hidden="true">pepsoma</span>
        ${T().pageHead({ eyebrow: 'Account', title: signin ? 'Sign in' : 'Create an account', intro: signin ? 'Track orders, reorder in one click and manage standing orders.' : 'Track orders, see your order history and manage standing orders.' })}
        <section class="container section-sm"><div class="card pad auth-card">${signin
          ? `<form class="stack-form" data-form="signin" novalidate>
              ${f({ form: 'si', name: 'email', label: 'Email', type: 'email', auto: 'email', validate: 'email' })}${f({ form: 'si', name: 'password', label: 'Password', type: 'password', auto: 'current-password' })}
              <p class="form-msg" aria-live="polite"></p><button class="btn btn-primary btn-block" type="submit">Sign in</button></form>
            <p class="auth-switch">New here? <a href="#/signup${q}">Create an account</a></p>`
          : `<form class="stack-form" data-form="signup" novalidate>
              ${f({ form: 'su', name: 'name', label: 'Full name', auto: 'name' })}${f({ form: 'su', name: 'email', label: 'Email', type: 'email', auto: 'email', validate: 'email' })}${f({ form: 'su', name: 'password', label: 'Password', type: 'password', auto: 'new-password', validate: 'password', hint: 'At least 8 characters.' })}
              ${H.check({ name: 'age', required: true, label: 'I am 21+ and will use products for laboratory research only.' })}
              <p class="form-msg" aria-live="polite"></p><button class="btn btn-primary btn-block" type="submit">Create account</button></form>
            <p class="auth-switch">Already have an account? <a href="#/account${q}">Sign in</a></p>`}
        </div><p class="small muted center mt">Demo accounts are stored only in this browser.</p></section></div>`,
    };
  }

  /* ---------- standing orders: every order item bought on a plan. Manage changes its period, start and end dates (kept in 'subSettings') ---------- */
  const DAY = 864e5;
  const dayOf = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d; };
  const isoDay = (t) => { const d = dayOf(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const fromIso = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v || '') ? new Date(v + 'T00:00:00') : null);
  // The next ship date after today, on a schedule that starts on `start` and repeats every `weeks` weeks (the start itself if it is still ahead).
  // null when the end date comes first.
  function nextShip(weeks, start, end) {
    const s = dayOf(start), step = weeks * 7, gone = Math.round((dayOf(Date.now()) - s) / DAY);
    const n = new Date(s);
    n.setDate(n.getDate() + (gone < 0 ? 0 : Math.floor(gone / step) + 1) * step);
    const e = fromIso(end);
    return e && n > e ? null : n;
  }
  const subsOf = (orders) => {
    const set = PS.storage.get('subSettings', {}), off = PS.storage.get('cancelledSubs', []);
    return orders.flatMap((o) => o.items.filter((i) => i.planId !== 'once').map((i) => {
      const key = o.number + '|' + i.id + '|' + i.size, cfg = set[key] || {};
      const cur = PS.getPlan(cfg.planId || i.planId), start = cfg.start || isoDay(o.createdAt), end = cfg.end || '';
      return Object.assign({ key, order: o, off: off.includes(key), cur, start, end, next: nextShip(cur.weeks || 4, fromIso(start), end) }, i);
    }));
  };
  const planPct = (id) => PS.config.plans.find((p) => p.id === id).pct;
  const manageHtml = (s) => {
    const is4 = s.cur.id === '4w', f = (o) => H.field(Object.assign({ form: 'ms' }, o));
    return `<h2 class="h3">Manage standing order</h2><p class="muted">${esc(s.name)} · ${esc(s.size)} × ${s.qty}</p>
      <form class="stack-form" data-form="manage-sub" novalidate>
        <input type="hidden" name="key" value="${esc(s.key)}">
        <div class="options">
          <label class="option"><input type="radio" name="plan" value="4w" ${is4 ? 'checked' : ''}><span class="option-dot"></span><span class="option-body"><span class="option-title">Every 4 weeks</span><span class="option-sub">Saves ${planPct('4w')}%</span></span></label>
          <label class="option"><input type="radio" name="plan" value="custom" ${is4 ? '' : 'checked'}><span class="option-dot"></span><span class="option-body"><span class="option-title">Custom: every <input class="plan-weeks" name="weeks" type="number" min="1" max="12" value="${is4 ? weeksIn(PS.storage.get('customWeeks', 6)) : s.cur.weeks}" inputmode="numeric" aria-label="Weeks between shipments"> weeks</span><span class="option-sub">Saves ${planPct('custom')}%</span></span></label>
        </div>
        <div class="field-row">${f({ name: 'start', label: 'Start date', type: 'date', value: s.start })}${f({ name: 'end', label: 'End date', type: 'date', required: false, value: s.end, hint: 'Leave empty to keep going until you cancel.' })}</div>
        <p class="manage-next">Next shipment: <strong data-next-ship></strong></p>
        <p class="form-msg" aria-live="polite"></p>
        <div class="btn-row"><button class="btn btn-primary" type="submit">Save changes</button><button class="btn btn-ghost" type="button" data-cancel-ask="${esc(s.key)}">Cancel standing order</button></div>
      </form>`;
  };
  const cancelAskHtml = (s) => `<h2 class="h3">Cancel standing order?</h2><p class="muted">${esc(s.name)} · ${esc(s.size)} × ${s.qty} will stop shipping and you won’t be charged again.</p>
    <div class="btn-row"><button class="btn btn-primary" type="button" data-manage-sub="${esc(s.key)}">Keep</button><button class="btn btn-ghost" type="button" data-cancel-sub="${esc(s.key)}">Cancel it</button></div>`;
  // the Manage panel's "Next shipment" follows the plan, start and end dates as they are edited
  function syncManage(form) {
    const weeks = form.elements.plan.value === '4w' ? 4 : weeksIn(form.elements.weeks.value), start = fromIso(form.elements.start.value);
    const n = start && nextShip(weeks, start, form.elements.end.value);
    $('[data-next-ship]', form).textContent = !start ? '—' : n ? PS.date(n) : 'none, the end date comes first';
  }
  const swapModal = (html) => { $('#ps-modal .modal-panel').innerHTML = `<button class="modal-close" data-close-modal aria-label="Close">${PS.icon('close')}</button>` + html; };
  function openManage(key, swap) {
    const u = PS.auth.current(), s = u && subsOf(PS.orders.forEmail(u.email)).find((x) => x.key === key);
    if (!s || s.off) return;
    if (swap) swapModal(manageHtml(s)); else PS.openModal(manageHtml(s));
    syncManage($('#ps-modal form[data-form="manage-sub"]'));
  }
  // an order's lines, one each ("2 × BPC-157 10 mg"), the first 3 and then "+N more"
  const orderLines = (o) => `<span class="ol-lines">${o.items.slice(0, 3).map((i) => `<span>${i.qty} × ${esc(i.name)} ${esc(i.size)}${i.planId !== 'once' ? ' · ' + esc(i.plan) : ''}</span>`).join('')}${o.items.length > 3 ? `<span>+${o.items.length - 3} more</span>` : ''}</span>`;
  H.orderList = (orders, opts) => `<ul class="order-list">${orders.map((o) => { const n = o.items.reduce((s, i) => s + i.qty, 0); return `<li><a href="#/order/${o.number}"><strong>${o.number}</strong><span>${PS.date(o.createdAt)} · ${n} item${n > 1 ? 's' : ''} · ${PS.money(o.total)}</span><span class="badge">${PS.orders.status(o).current.label}</span>${opts && opts.lines ? orderLines(o) : ''}</a></li>`; }).join('')}</ul>`;

  /* ---------- profile: the account's name and email plus the details saved for checkout (PS.details), edited in place on /account ---------- */
  const profileHtml = (u, edit) => {
    const sv = PS.details.get(), ad = (sv && sv.address) || {};
    if (!edit) {
      return `<div class="profile-head"><h2 class="h3">Profile</h2><button class="btn btn-sm btn-secondary" type="button" data-profile-edit>Edit</button></div>
        <p>${esc(u.name)}<br><span class="muted">${esc(u.email)}</span></p>
        ${sv ? `<dl class="profile-facts"><div><dt>Phone</dt><dd>${sv.phone ? esc(sv.phone) : '—'}</dd></div><div><dt>Lab / institution</dt><dd>${sv.org ? esc(sv.org) : '—'}</dd></div>
          <div><dt>Saved address</dt><dd>${ad.line1 ? `${esc(ad.line1)}${ad.line2 ? ', ' + esc(ad.line2) : ''}<br>${esc(ad.city)}, ${esc(ad.state)} ${esc(ad.zip)} <button class="link-btn" type="button" data-address-remove>Remove</button>` : 'None'}</dd></div></dl>`
          : '<p class="small muted">No phone or address saved yet. <button class="link-btn" type="button" data-profile-edit>Add details</button></p>'}
        <button class="btn btn-secondary" data-signout>Sign out</button>
        <p class="small muted profile-note">Your details stay on this browser until real accounts exist.</p>`;
    }
    const f = (o) => H.field(Object.assign({ form: 'pf' }, o)), parts = u.name.split(' ');
    return `<h2 class="h3">${sv ? 'Edit profile' : 'Add your details'}</h2><form class="stack-form" data-form="profile" novalidate>
      <div class="field-row">${f({ name: 'first', label: 'First name', auto: 'given-name', value: sv ? sv.first : parts[0] })}${f({ name: 'last', label: 'Last name', auto: 'family-name', value: sv ? sv.last : parts.slice(1).join(' ') })}</div>
      ${f({ name: 'email', label: 'Email', type: 'email', auto: 'email', validate: 'email', value: u.email })}
      <div class="field-row">${f({ name: 'phone', label: 'Phone', type: 'tel', auto: 'tel', required: false, validate: 'phone', value: sv && sv.phone })}${f({ name: 'org', label: 'Lab / institution', auto: 'organization', required: false, value: sv && sv.org })}</div>
      <h3 class="legend legend-sub">Saved address <span class="optional">optional</span></h3>
      ${f({ name: 'address1', label: 'Street address', auto: 'address-line1', value: ad.line1 })}
      ${f({ name: 'address2', label: 'Apt, suite, building', auto: 'address-line2', required: false, value: ad.line2 })}
      <div class="field-row three">${f({ name: 'city', label: 'City', auto: 'address-level2', value: ad.city })}${f({ name: 'state', label: 'State', options: PS.states, auto: 'address-level1', value: ad.state })}${f({ name: 'zip', label: 'ZIP', auto: 'postal-code', validate: 'zip', attrs: 'inputmode="numeric" maxlength="10"', value: ad.zip })}</div>
      <p class="form-msg" aria-live="polite"></p>
      <div class="btn-row"><button class="btn btn-primary" type="submit">Save</button><button class="btn btn-ghost" type="button" data-profile-cancel>Cancel</button></div>
    </form>`;
  };

  /* ---------- Manage orders (on /orders): Return and Get support open the same chooser, Order again fills the cart ---------- */
  const manageOrders = (orders) => `<aside class="card pad manage-orders rise" style="--i:3"><h2 class="h3">Manage orders</h2><p class="muted small">${orders.length ? 'Return an order, buy it again or get help with one.' : 'Questions? Our team replies within one business day.'}</p>
    <div class="manage-actions">${orders.length ? `<button class="btn btn-secondary" type="button" data-help="return">${PS.icon('box')} Return</button><button class="btn btn-secondary" type="button" data-reorder>${PS.icon('cart')} Order again</button>` : ''}<button class="btn btn-secondary" type="button" data-help="support">${PS.icon('mail')} Get support</button></div></aside>`;
  const helpHtml = (kind) => `<h2 class="h3">${kind === 'return' ? 'Return an order' : 'Get support'}</h2><p class="muted">How would you like to reach us?</p>
    <div class="choices"><a class="choice" href="#/contact?topic=order${kind === 'return' ? '&amp;msg=' + encodeURIComponent('Return request: ') : ''}"><strong>Send a message</strong><span>Through the Contact page</span></a>
      <button class="choice" type="button" data-help-email="${kind}"><strong>Email us</strong><span>Opens a draft in your mail app</span></button></div>`;
  const helpSubject = (kind, num) => (num ? `${kind === 'return' ? 'Return request' : 'Support'} — Order ${num}` : 'Question');
  const helpMail = (kind, num) => `mailto:${PS.company.email}?subject=${encodeURIComponent(helpSubject(kind, num))}`;
  const helpEmailHtml = (kind, orders) => {
    const opt = (v, title, sub, on) => `<label class="option"><input type="radio" name="helpOrder" value="${v}" ${on ? 'checked' : ''}><span class="option-dot"></span><span class="option-body"><span class="option-title">${title}</span><span class="option-sub">${sub}</span></span></label>`;
    return `<h2 class="h3">Which order is it about?</h2>
      <div class="options">${orders.map((o, i) => { const n = o.items.reduce((s, x) => s + x.qty, 0); return opt(o.number, o.number, `${PS.date(o.createdAt)} · ${n} item${n > 1 ? 's' : ''} · ${PS.money(o.total)}`, i === 0); }).join('')}${opt('', 'Other question', 'Not about a particular order', !orders.length)}</div>
      <p class="small muted">Nothing is sent. This opens a draft in your mail app.</p>
      <div class="btn-row"><a class="btn btn-primary" data-help-mail="${kind}" href="${helpMail(kind, orders[0] && orders[0].number)}" target="_blank" rel="noopener">${PS.icon('mail')} Open email draft</a><button class="btn btn-ghost" type="button" data-help-back="${kind}">Back</button></div>`;
  };
  const orderAddressHtml = (o) => {
    const f = (x) => H.field(Object.assign({ form: 'oa' }, x)), a = o.address;
    return `<h2 class="h3">Change shipping address</h2><p class="muted">Order ${o.number}. You can change this until ${PS.time(PS.orders.editUntil(o))}.</p><form class="stack-form" data-form="order-address" data-order="${o.number}" novalidate>
      ${f({ name: 'name', label: 'Full name', auto: 'name', value: o.name })}
      <div class="field-row">${f({ name: 'phone', label: 'Phone', type: 'tel', auto: 'tel', required: false, validate: 'phone', value: o.phone })}${f({ name: 'org', label: 'Lab / institution', auto: 'organization', required: false, value: o.org })}</div>
      ${f({ name: 'address1', label: 'Street address', auto: 'address-line1', value: a.line1 })}
      ${f({ name: 'address2', label: 'Apt, suite, building', auto: 'address-line2', required: false, value: a.line2 })}
      <div class="field-row three">${f({ name: 'city', label: 'City', auto: 'address-level2', value: a.city })}${f({ name: 'state', label: 'State', options: PS.states, auto: 'address-level1', value: a.state })}${f({ name: 'zip', label: 'ZIP', auto: 'postal-code', validate: 'zip', attrs: 'inputmode="numeric" maxlength="10"', value: a.zip })}</div>
      <p class="form-msg" aria-live="polite"></p>
      <div class="btn-row"><button class="btn btn-primary" type="submit">Save address</button><button class="btn btn-ghost" type="button" data-close-modal>Cancel</button></div>
    </form>`;
  };
  const reorderHtml = (orders) => `<h2 class="h3">Order again</h2><p class="muted">Which order should go in your cart?</p>
    <div class="choices">${orders.map((o) => `<button class="choice" type="button" data-reorder-pick="${o.number}"><strong>${o.number} <small>${PS.date(o.createdAt)}</small></strong>${orderLines(o)}</button>`).join('')}</div>`;
  // an order's lines go into the cart as they were bought (a standing order keeps its plan); lines whose product or size is gone are skipped
  function reorder(o) {
    let skipped = 0, added = 0;
    o.items.forEach((i) => {
      const p = PS.getProduct(i.id), s = p && p.sizes.find((x) => x.label === i.size);
      if (!s) { skipped++; return; }
      PS.cart.add(p.id, s.id, i.qty, i.planId);
      added++;
    });
    PS.closeModal();
    if (added) PS.openCart();
    if (skipped) PS.toast(added ? `${skipped} item${skipped > 1 ? 's' : ''} from that order ${skipped > 1 ? 'are' : 'is'} no longer sold and ${skipped > 1 ? 'were' : 'was'} skipped.` : 'Nothing from that order is sold any more.', added ? '' : 'error');
  }

  PS.defaultViews = {
    order({ params }) {
      const o = PS.orders.get(params.num);
      if (!o) return PS.defaultViews.notFound({ msg: 'We couldn’t find that order on this device.' });
      const first = o.name.split(' ')[0];
      return {
        title: `Order ${o.number}`,
        html: `${T().pageHead({ eyebrow: 'Order confirmed', title: `Thank you, ${esc(first)}.`, intro: `Order <strong>${o.number}</strong> is in. A confirmation was sent to <strong>${esc(o.email)}</strong> (demo — no email is actually sent).` })}
        <section class="container section-sm"><div class="order-grid">
          <div class="card pad"><h2 class="h3">Status</h2>${H.orderStatus(o)}<div class="btn-row"><a class="btn btn-secondary" href="#/track?order=${o.number}&email=${encodeURIComponent(o.email)}">Track this order</a><a class="btn btn-ghost" href="#/shop">Continue shopping</a></div></div>
          <div class="card pad"><h2 class="h3">Summary</h2>${H.orderItems(o)}
            <div class="order-meta"><div><span class="label">Ship to</span><p>${esc(o.name)}${o.org ? '<br>' + esc(o.org) : ''}<br>${esc(o.address.line1)}${o.address.line2 ? ', ' + esc(o.address.line2) : ''}<br>${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.zip)}</p>
              ${PS.orders.editable(o) ? `<button class="link-btn" type="button" data-order-edit="${o.number}">Change address</button><br><small class="muted">Until ${PS.time(PS.orders.editUntil(o))}</small>` : '<small class="muted">The one-hour window to change this has closed. <a href="#/contact">Contact us</a> for help.</small>'}
              ${o.addressEdits ? `<br><small class="muted">Updated ${PS.time(o.addressEdits[o.addressEdits.length - 1].at)}</small>` : ''}</div>
            <div><span class="label">Method</span><p>${esc(o.method.label)}<br><small class="muted">${esc(o.method.eta)}</small></p></div>
            <div><span class="label">Payment</span><p>${esc(o.payment.brand)} ending ${esc(o.payment.last4)}<br><small class="muted">Demo — not charged</small></p></div></div>
          </div></div></section>`,
      };
    },
    track({ query }) {
      const user = PS.auth.current();
      const mine = user ? PS.orders.forEmail(user.email).slice(0, 5) : [];
      return {
        title: 'Track order',
        html: `${T().pageHead({ eyebrow: 'Order status', title: 'Track your order', intro: 'Enter your order number and the email you used at checkout.' })}
        <section class="container section-sm narrow"><div class="card pad">${H.trackForm(query)}</div>
        ${mine.length ? `<div class="card pad mt"><h2 class="h3">Your recent orders</h2><ul class="order-list">${mine.map((o) => `<li><a href="#/order/${o.number}"><strong>${o.number}</strong><span>${PS.date(o.createdAt)} · ${PS.money(o.total)}</span><span class="badge">${PS.orders.status(o).current.label}</span></a></li>`).join('')}</ul></div>` : ''}</section>`,
        after() { if (query.order && query.email) PS.trackLookup(query.order, query.email); },
      };
    },
    labs({ query }) {
      const lots = PS.allLots();
      return {
        title: 'Lab tests & COAs',
        html: `${T().pageHead({ eyebrow: 'Transparency', title: 'Lab tests & Certificates of Analysis', intro: 'Every lot is independently tested for purity, identity, content, endotoxins, heavy metals and sterility. Search by the lot number printed on your vial.' })}
        <section class="container section-sm">
          <div class="lab-stats">${[['100%', 'lots third-party tested'], ['≥98%', 'release purity spec'], [String(lots.length), 'lots on record'], ['ISO 17025', 'accredited labs']].map(([a, b]) => `<div><strong>${a}</strong><span>${b}</span></div>`).join('')}</div>
          <div class="lot-tools">
            <div class="lot-search"><span class="lot-search-icon">${PS.icon('search')}</span><label class="sr-only" for="lot-q">Search lots</label><input id="lot-q" class="input" data-lot-search placeholder="Search lot number or product — e.g. PS-BPC-2609A" value="${esc(query.q || '')}"></div>
            <label class="sr-only" for="lot-product">Filter by product</label><select id="lot-product" class="input" data-lot-product-filter><option value="">All products</option>${PS.products.filter((p) => PS.lots(p).length).map((p) => `<option value="${esc(p.id)}" ${p.id === query.product ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
          </div>
          ${H.lotCards(lots)}
          <p class="small muted mt">Demo COAs use illustrative values. Read our <a href="#/policies/testing">Testing &amp; COA Policy</a>.</p>
        </section>`,
        after() { filterLots(); },
      };
    },
    // /coa/<lot> is Lab Tests with that lot's certificate open as a pop-up (closing it goes back to Lab Tests)
    coa({ params }) {
      const lot = PS.findLot(params.code);
      if (!lot) return PS.defaultViews.notFound({ msg: 'We couldn’t find that lot number. Check the label on your vial.' });
      const labs = PS.defaultViews.labs({ query: {} });
      return Object.assign({}, labs, { title: `COA ${lot.code}`, after() { labs.after(); openCoa(lot.code); } });
    },
    faq() {
      return {
        title: 'FAQ',
        html: `${T().pageHead({ eyebrow: 'Help center', title: 'Frequently asked questions', intro: 'Can’t find an answer? Our team replies within one business day.' })}
        <section class="container section-sm narrow faq">${H.faq(PS.faqs)}
          <div class="card pad center mt"><h2 class="h3">Still have questions?</h2><p class="muted">Email <a href="mailto:${PS.company.email}">${PS.company.email}</a> or send us a message.</p><a class="btn btn-primary" href="#/contact">Contact support</a></div></section>`,
      };
    },
    contact({ query }) {
      const C = PS.company;
      return {
        title: 'Contact',
        html: `${T().pageHead({ eyebrow: 'Support', title: 'Contact us', intro: 'Questions about an order, a COA or wholesale? We reply within one business day.' })}
        <section class="container section-sm"><div class="contact-grid">
          <div class="card pad" data-form-wrap>${H.contactForm(query)}</div>
          <aside class="contact-side">
            <div class="card pad"><ul class="contact-list">
              <li>${PS.icon('mail')}<div><span class="label">Email</span><a href="mailto:${C.email}">${C.email}</a></div></li>
            </ul></div>
            <div class="card pad"><h2 class="h4">Quick links</h2><ul class="link-list"><li><a href="#/track">Track an order</a></li><li><a href="#/lab-tests">Find a COA</a></li><li><a href="#/policies/refunds">Returns &amp; refunds</a></li><li><a href="#/wholesale">Wholesale pricing</a></li></ul></div>
          </aside></div></section>`,
      };
    },
    wholesale() {
      return {
        title: 'Wholesale',
        html: `${T().pageHead({ eyebrow: 'Institutions & partners', title: 'Wholesale & institutional supply', intro: 'Volume pricing, net terms and dedicated lot reservations for universities, biotech R&D teams and CROs.' })}
        <section class="container section-sm"><div class="contact-grid">
          <div class="card pad" data-form-wrap><h2 class="h3">Apply for an account</h2>${H.wholesaleForm()}</div>
          <aside class="contact-side"><div class="card pad"><ul class="benefit-list">
            ${[['Tiered pricing', 'Up to 35% off list on recurring volume.'], ['Net-30 terms', 'Pay by PO, ACH or wire once approved.'], ['Lot reservation', 'Hold a single lot for multi-month studies.'], ['Custom documentation', 'Batch records and extended COA panels on request.']].map(([a, b]) => `<li>${PS.icon('check')}<div><strong>${a}</strong><span>${b}</span></div></li>`).join('')}
          </ul></div></aside></div></section>`,
      };
    },
    account({ query }) {
      const u = PS.auth.current();
      if (!u) return authPage('signin', safeNext(query.next));
      const orders = PS.orders.forEmail(u.email);
      const subs = subsOf(orders);
      return {
        title: 'My account',
        html: `${T().pageHead({ eyebrow: 'Account', title: `Welcome back, ${esc(u.name.split(' ')[0])}.`, intro: `Signed in as ${esc(u.email)} · member since ${PS.date(u.created, { month: 'long', year: 'numeric' })}` })}
        <section class="container section-sm"><div class="account-grid">
          <div class="card pad rise" style="--i:2"><h2 class="h3">Recent orders</h2>${orders.length ? `${H.orderList(orders.slice(0, 3))}<a class="link-arrow mt" href="#/orders">Order history ${PS.icon('arrow')}</a>` : `<p class="muted">No orders yet.</p><a class="btn btn-primary" href="#/shop">Start shopping</a>`}</div>
          <div class="stack rise" style="--i:3">
            <div class="card pad" id="standing-orders"><h2 class="h3">Standing orders</h2>${subs.length ? `<ul class="sub-list">${subs.map((s) => `<li><div><strong>${esc(s.name)}</strong> <small>${esc(s.size)} × ${s.qty}</small><span class="small muted">${esc(s.cur.short)} · ${s.off ? 'Cancelled' : s.next ? 'Next ship ' + PS.date(s.next) : 'No further shipments'}</span></div>${s.off ? '<span class="badge badge-muted">Cancelled</span>' : `<button class="btn btn-sm btn-ghost" data-manage-sub="${esc(s.key)}">Manage</button>`}</li>`).join('')}</ul>` : '<p class="muted small">No standing orders. Choose “Standing order” on any product page to save up to 15%.</p>'}</div>
            <div class="card pad" id="profile">${profileHtml(u)}</div>
          </div></div></section>`,
        after() { if (query.focus === 'standing') { const el = $('#standing-orders'); if (el) el.scrollIntoView({ block: 'center' }); } },
      };
    },
    signup({ query }) {
      return PS.auth.current() ? PS.defaultViews.account({ query: {} }) : authPage('signup', safeNext(query.next));
    },
    // every order on this account; signed out, it is the sign-in page and brings you back here afterwards
    orders() {
      const u = PS.auth.current();
      if (!u) return authPage('signin', '/orders');
      const orders = PS.orders.forEmail(u.email);
      return {
        title: 'Order history',
        html: `${T().pageHead({ eyebrow: 'Account', title: 'Order history', intro: orders.length ? `${orders.length} order${orders.length > 1 ? 's' : ''} on ${esc(u.email)}.` : `Orders placed with ${esc(u.email)} show up here.` })}
        <section class="container section-sm"><div class="orders-grid"><div class="card pad rise" style="--i:2">${orders.length ? H.orderList(orders, { lines: true }) : `<p class="muted">No orders yet.</p><a class="btn btn-primary" href="#/shop">Start shopping</a>`}</div>${manageOrders(orders)}</div>
          <p class="small center mt"><a class="link-arrow" href="#/account">${PS.icon('arrow')} Back to my account</a></p></section>`,
      };
    },
    policies() {
      return {
        title: 'Policies',
        html: `${T().pageHead({ eyebrow: 'Legal', title: 'Policies', intro: 'Everything that governs how we sell, ship and support research materials.' })}
        <section class="container section-sm"><div class="policy-cards">${PS.policies.map((p) => `<a class="card pad policy-card" href="#/policies/${p.slug}"><h2 class="h4">${p.title}</h2><p class="muted small">${p.summary}</p><span class="link-arrow">Read ${PS.icon('arrow')}</span></a>`).join('')}</div></section>`,
      };
    },
    policy({ params }) {
      const p = PS.getPolicy(params.slug);
      if (!p) return PS.defaultViews.notFound({});
      return {
        title: p.title,
        html: `${T().pageHead({ eyebrow: 'Policies', title: p.title, intro: `Effective ${PS.company.effective}` })}
        <section class="container section-sm"><div class="policy-layout">
          <nav class="policy-nav" aria-label="Policies">${PS.policies.map((x) => `<a href="#/policies/${x.slug}" class="${x.slug === p.slug ? 'active' : ''}">${x.title}</a>`).join('')}</nav>
          <article class="prose">${p.body}<p class="policy-template-note">This policy is a starting template for the Pepsoma demo and should be reviewed by qualified counsel before launch.</p></article>
        </div></section>`,
      };
    },
    notFound(o) {
      return {
        title: 'Not found',
        html: `<section class="notfound"><div class="container">
          <span class="eyebrow">404</span><h1>Page not found</h1><p class="lead">${esc((o && o.msg) || 'That page doesn’t exist or has moved.')}</p>
          <div class="btn-row"><a class="btn btn-primary" href="#/">Back home</a><a class="btn btn-ghost" href="#/shop">Shop peptides</a></div></div></section>`,
      };
    },
  };

  /* ---------- modal / drawer / toast ---------- */
  let lastFocus = null;
  PS.openModal = (html, opts) => {
    opts = opts || {};
    const m = $('#ps-modal');
    lastFocus = document.activeElement;
    m.className = 'modal ' + (opts.cls || '');
    m.dataset.locked = opts.locked ? '1' : '';
    $('.modal-panel', m).innerHTML = (opts.locked ? '' : `<button class="modal-close" data-close-modal aria-label="Close">${PS.icon('close')}</button>`) + html;
    m.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => { m.classList.add('open'); $('.modal-panel', m).focus(); });
  };
  PS.closeModal = (force) => {
    const m = $('#ps-modal');
    if (m.hidden || (m.dataset.locked && !force)) return;
    m.classList.remove('open');
    setTimeout(() => { if (!m.classList.contains('open')) m.hidden = true; }, 200); // not if a pop-up opened in the meantime
    if (!$('.drawer.open')) document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  // A lot's Certificate of Analysis as a pop-up, with its Download PDF button right under the header (lab, report ID and so on). It is the lab's own
  // PDF when the lot has one, otherwise the browser's print / save as PDF.
  function openCoa(code) {
    const lot = PS.findLot(code);
    if (!lot) return;
    const dl = lot.pdf
      ? `<a class="btn btn-primary btn-sm" href="${esc(lot.pdf)}" target="_blank" rel="noopener" download>${PS.icon('download')} Download PDF</a>`
      : `<button class="btn btn-primary btn-sm" type="button" data-print>${PS.icon('download')} Download PDF</button>`;
    PS.openModal(PS.coaDoc(lot, `<div class="coa-actions">${dl}</div>`), { cls: 'modal-coa' });
  }
  // Escape, the backdrop and the close button: closing a certificate opened by its /coa/<lot> link goes on to Lab Tests
  function dismissModal() {
    PS.closeModal();
    if (current === 'coa' && !$('#ps-modal').dataset.locked) location.replace('#/lab-tests');
  }
  PS.openCart = () => {
    const d = $('#cart-drawer');
    d.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => { d.classList.add('open'); $('.drawer-panel', d).focus(); });
  };
  PS.closeCart = () => {
    const d = $('#cart-drawer');
    if (!d || d.hidden) return;
    d.classList.remove('open');
    setTimeout(() => { d.hidden = true; }, 250);
    document.body.classList.remove('no-scroll');
  };
  PS.toast = (msg, kind) => {
    const box = $('#ps-toasts');
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.setAttribute('role', 'status');
    t.innerHTML = `${PS.icon(kind === 'error' ? 'close' : 'check')}<span>${msg}</span>`;
    box.appendChild(t);
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 300); }, 3200);
  };

  /* ---------- validation ---------- */
  function validateForm(form) {
    let first = null;
    $$('.field', form).forEach((f) => {
      const input = $('input, select, textarea', f);
      if (!input || input.disabled) return;
      let msg = '';
      const v = input.type === 'checkbox' ? input.checked : String(input.value || '');
      if (input.required && (input.type === 'checkbox' ? !v : !v.trim())) msg = input.type === 'checkbox' ? 'Required to continue.' : 'This field is required.';
      else if (v && input.dataset.validate && PS.valid[input.dataset.validate] && !PS.valid[input.dataset.validate](v)) {
        msg = { email: 'Enter a valid email address.', zip: 'Enter a 5-digit ZIP code.', phone: 'Enter a 10-digit phone number.', card: 'That card number isn’t valid.', exp: 'Enter a future date as MM / YY.', cvc: 'Enter the 3–4 digit code.', password: 'Use at least 8 characters.' }[input.dataset.validate];
      }
      f.classList.toggle('is-invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const err = $('.field-error', f);
      if (err) err.textContent = msg;
      if (msg && !first) first = input;
    });
    if (first) { first.focus(); first.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    return !first;
  }
  // typing clears a field's error. In New B the box grows back and the message slides down and fades first, so the text goes a moment later
  function clearError(field) {
    field.classList.remove('is-invalid');
    const er = $('.field-error', field);
    if (!er) return;
    if (PS.variant('field-err') !== 'b' || matchMedia('(prefers-reduced-motion: reduce)').matches) { er.textContent = ''; return; }
    setTimeout(() => { if (!field.classList.contains('is-invalid')) er.textContent = ''; }, 220);
  }
  const formData = (form) => {
    const o = {};
    new FormData(form).forEach((v, k) => { o[k] = typeof v === 'string' ? v.trim() : v; });
    return o;
  };

  // Lab Tests: a card shows when it matches both the search box and the product filter.
  // With `animate` (typing, the filter) the change plays for 220ms: cards that stop matching fade and shrink out where they stand, the others glide to
  // their new places (FLIP: measure, change, then animate from the old place) and new matches fade in. No card is redrawn, so a keystroke in the middle
  // of it carries on from wherever the cards are. With reduced motion, or without `animate`, it just shows and hides.
  function filterLots(animate) {
    const i = $('[data-lot-search]'), f = $('[data-lot-product-filter]'), grid = $('.lot-cards'), e = $('.empty-row');
    const q = (i ? i.value : '').trim().toLowerCase(), pid = f ? f.value : '';
    const cards = $$('[data-lot-row]'), want = cards.map((r) => (!q || r.dataset.lotRow.includes(q)) && (!pid || r.dataset.lotProduct === pid));
    const shown = want.filter(Boolean).length;
    const drop = (r) => { r.getAnimations().forEach((a) => a.cancel()); r.classList.remove('leaving'); r.style.cssText = ''; };
    if (!animate || !grid || !grid.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((r, k) => { drop(r); r.hidden = !want[k]; });
      if (e) { e.getAnimations().forEach((a) => a.cancel()); e.hidden = shown > 0; }
      return;
    }
    const opt = { duration: 220, easing: 'cubic-bezier(.25,.8,.25,1)' }, gr = grid.getBoundingClientRect();
    // before: where every card on show stands right now (mid-animation included), and how visible it is
    const before = new Map();
    cards.forEach((r) => { if (!r.hidden) { const cs = getComputedStyle(r); before.set(r, { box: r.getBoundingClientRect(), op: +cs.opacity, sc: parseFloat(cs.scale) || 1 }); } });
    const h0 = gr.height;
    cards.forEach((r) => { if (before.has(r) && r._flip) r._flip.cancel(); });
    if (grid._h) grid._h.cancel();
    const stay = [], enter = [];
    cards.forEach((r, k) => {
      const b = before.get(r);
      if (!want[k]) {
        if (!b || r.classList.contains('leaving')) return; // hidden already, or already on its way out
        r.getAnimations().forEach((a) => a.cancel());
        r.style.cssText = `left:${b.box.left - gr.left}px;top:${b.box.top - gr.top}px;width:${b.box.width}px;height:${b.box.height}px`;
        r.classList.add('leaving');
        const out = r.animate([{ opacity: b.op, scale: b.sc }, { opacity: 0, scale: 0.96 }], Object.assign({ fill: 'forwards' }, opt));
        out.onfinish = () => { drop(r); r.hidden = true; };
      } else if (!b) {
        r.hidden = false;
        enter.push([r, 0, 0.96]);
      } else {
        if (r.classList.contains('leaving')) { drop(r); enter.push([r, b.op, b.sc]); } // matches again before it was gone
        stay.push(r);
      }
    });
    // after: the same cards at their new places
    stay.forEach((r) => {
      const a = before.get(r).box, b = r.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) r._flip = r.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], opt);
    });
    enter.forEach(([r, op, sc]) => { r.animate([{ opacity: op, scale: sc }, { opacity: 1, scale: 1 }], opt); });
    const h1 = grid.getBoundingClientRect().height;
    if (Math.abs(h1 - h0) > 1) grid._h = grid.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], opt);
    if (e) { // the empty message fades too
      const op = e.hidden ? 0 : +getComputedStyle(e).opacity;
      e.getAnimations().forEach((a) => a.cancel());
      if (!shown && op < 1) { e.hidden = false; e.animate([{ opacity: op }, { opacity: 1 }], opt); }
      else if (shown && !e.hidden) { const out = e.animate([{ opacity: op }, { opacity: 0 }], Object.assign({ fill: 'forwards' }, opt)); out.onfinish = () => { out.cancel(); e.hidden = true; }; }
    }
  }

  PS.trackLookup = (num, email) => {
    const box = $('[data-track-result]');
    if (!box) return;
    const o = PS.orders.find(num, email);
    box.innerHTML = o
      ? `<div class="track-result"><div class="track-head"><div><span class="label">Order</span><strong>${o.number}</strong></div><div><span class="label">Placed</span><strong>${PS.date(o.createdAt)}</strong></div><div><span class="label">Total</span><strong>${PS.money(o.total)}</strong></div></div>${H.orderStatus(o)}<a class="btn btn-ghost btn-sm" href="#/order/${o.number}">View order details</a></div>`
      : `<div class="notice notice-error">No order matches that number and email on this device. Double-check both — order numbers look like <code>PS123456</code>.</div>`;
  };

  /* ---------- product form sync ---------- */
  PS.syncProductForm = (form) => {
    const p = PS.getProduct(form.dataset.id);
    if (!p) return;
    const s = PS.getSize(p, (form.elements.size && form.elements.size.value) || p.sizes[0].id);
    const plan = PS.getPlan(form.elements.plan ? form.elements.plan.value : 'once');
    const qty = Math.max(1, parseInt(form.elements.qty && form.elements.qty.value, 10) || 1);
    const unit = PS.round(s.price * (1 - plan.pct / 100));
    const ref = s.compare || s.price;
    $$('[data-plan-price]', form).forEach((el) => { el.textContent = PS.money(s.price * (1 - PS.getPlan(el.dataset.planPrice).pct / 100)); });
    $$('[data-plan-compare]', form).forEach((el) => { const pl = PS.getPlan(el.dataset.planCompare); const u = s.price * (1 - pl.pct / 100); el.textContent = ref > u ? PS.money(ref) : ''; });
    $$('[data-price]').forEach((el) => { el.textContent = PS.money(unit); });
    $$('[data-compare]').forEach((el) => { el.textContent = ref > unit ? PS.money(ref) : ''; });
    $$('[data-line-price]', form).forEach((el) => { el.textContent = PS.money(unit * qty); });
    $$('[data-size-label]').forEach((el) => { el.textContent = s.label; });
    $$('.option, .size-opt, .plan-opt', form).forEach((o) => { const i = $('input', o); if (i) o.classList.toggle('selected', i.checked); });
    // redraw vial with the chosen size
    const img = $('[data-product-vial]');
    if (img && !p.includes && img.dataset.size !== s.label) { img.dataset.size = s.label; img.innerHTML = PS.productImage(p, { theme: T().vialTheme, size: s.label }); }
  };

  // standing order, Custom: every N weeks (1–12)
  const weeksIn = (v) => Math.max(1, Math.min(12, parseInt(v, 10) || 4));
  function pickCustomPlan(form) {
    const r = $('input[name="plan"][value="custom"]', form);
    if (r && !r.checked) { r.checked = true; PS.syncProductForm(form); }
  }
  // A quantity changes in place: the old number is wiped away (a ghost copy over the box) and the new one wiped in. Going up it works from the bottom edge
  // and going down from the top, so up reads as up. The same box holds both, so nothing shifts; each step is 90ms. Used by the product page and by the cart
  // (the panel and the page). The real input always holds the new value; the ghost only ever sits on top of it for the 180ms.
  function wipeQty(q, from, to) {
    const box = q.parentNode;
    if (q._wipe) q._wipe.cancel();
    $$('.qty-ghost', box).forEach((g) => g.remove());
    if (to === from || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const up = to > from, ghost = document.createElement('span');
    ghost.className = 'qty-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.textContent = from;
    ghost.style.cssText = `left:${q.offsetLeft}px;top:${q.offsetTop}px;width:${q.offsetWidth}px;height:${q.offsetHeight}px`;
    box.appendChild(ghost);
    // the digits sit mid-box, so the edge sweeps just their band: from `a` (the digits' near edge) to `b` (their far edge), px from the box's top or bottom
    const mid = q.offsetHeight / 2, d = parseFloat(getComputedStyle(q).fontSize) / 2, a = mid - d + 'px', b = mid + d + 'px', opt = { duration: 90, easing: 'ease-out' };
    const out = ghost.animate(up ? [{ clipPath: `inset(0 0 ${a} 0)` }, { clipPath: `inset(0 0 ${b} 0)` }] : [{ clipPath: `inset(${a} 0 0 0)` }, { clipPath: `inset(${b} 0 0 0)` }], Object.assign({ fill: 'forwards' }, opt));
    out.onfinish = out.oncancel = () => { if (box.contains(ghost)) ghost.remove(); };
    q._wipe = q.animate(up ? [{ clipPath: `inset(${b} 0 0 0)` }, { clipPath: `inset(${a} 0 0 0)` }] : [{ clipPath: `inset(0 0 ${b} 0)` }, { clipPath: `inset(0 0 ${a} 0)` }], Object.assign({ delay: 90, fill: 'backwards' }, opt));
  }
  // the product page's quantity box, after the number was typed or stepped
  function rollQty(q) {
    const to = parseInt(q.value, 10);
    if (!to) return;
    const from = q.dataset.prev != null ? +q.dataset.prev : +q.defaultValue || 1;
    q.dataset.prev = to;
    wipeQty(q, from, to);
  }

  /* ---------- delegated behaviors ---------- */
  function bind() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('button, a, [data-close-modal], [data-close-cart]');
      if (!t) return;
      const d = t.dataset;
      if ('openCart' in d) { e.preventDefault(); PS.openCart(); }
      else if ('closeCart' in d) { e.preventDefault(); PS.closeCart(); }
      else if ('closeModal' in d) { e.preventDefault(); dismissModal(); }
      else if (d.add) {
        e.preventDefault();
        PS.cart.add(d.add, d.size, 1, 'once');
        PS.emit('added', { el: t, id: d.add });
      }
      else if (d.step) {
        const q = $('.qty-input', t.closest('.qty'));
        q.value = Math.max(1, Math.min(99, (parseInt(q.value, 10) || 1) + +d.step));
        q.dispatchEvent(new Event('input', { bubbles: true }));
      }
      else if (d.lineInc || d.lineDec) {
        const key = d.lineInc || d.lineDec;
        const it = PS.cart.items().find((i) => i.key === key);
        if (it) PS.cart.setQty(key, it.qty + (d.lineInc ? 1 : -1));
      }
      else if (d.lineRemove) { PS.cart.remove(d.lineRemove); }
      else if ('removePromo' in d) { PS.cart.removePromo(); }
      else if (d.coa) { e.preventDefault(); openCoa(d.coa); }
      else if ('print' in d) { window.print(); }
      else if ('signout' in d) { PS.auth.signOut(); PS.toast('Signed out'); }
      else if (d.orderEdit) { const o = PS.orders.get(d.orderEdit); if (o && PS.orders.editable(o)) PS.openModal(orderAddressHtml(o)); else { PS.toast('The one-hour window to change this address has closed.', 'error'); render(); } }
      else if ('profileEdit' in d) { $('#profile').innerHTML = profileHtml(PS.auth.current(), true); $('#pf-first').focus(); }
      else if ('profileCancel' in d) { $('#profile').innerHTML = profileHtml(PS.auth.current(), false); $('[data-profile-edit]', $('#profile')).focus(); }
      else if ('addressRemove' in d) {
        PS.details.set(Object.assign({}, PS.details.get(), { address: {}, billing: null }));
        PS.toast('Saved address removed.');
        render();
      }
      else if (d.help) { PS.openModal(helpHtml(d.help)); }
      else if (d.helpEmail) { const u = PS.auth.current(); swapModal(helpEmailHtml(d.helpEmail, u ? PS.orders.forEmail(u.email) : [])); }
      else if (d.helpBack) { swapModal(helpHtml(d.helpBack)); }
      else if ('reorder' in d) {
        const u = PS.auth.current(), orders = u ? PS.orders.forEmail(u.email) : [];
        if (orders.length === 1) reorder(orders[0]); else if (orders.length) PS.openModal(reorderHtml(orders));
      }
      else if (d.reorderPick) { const o = PS.orders.get(d.reorderPick); if (o) reorder(o); }
      else if (d.manageSub) { openManage(d.manageSub, !!t.closest('#ps-modal')); }
      else if (d.cancelAsk) {
        const u = PS.auth.current(), s = u && subsOf(PS.orders.forEmail(u.email)).find((x) => x.key === d.cancelAsk);
        if (s) swapModal(cancelAskHtml(s));
      }
      else if (d.cancelSub) {
        const list = PS.storage.get('cancelledSubs', []);
        list.push(d.cancelSub);
        PS.storage.set('cancelledSubs', list);
        PS.closeModal();
        PS.toast('Standing order cancelled — no further charges.');
        render();
      }
      else if ('ageAccept' in d) { PS.storage.set('ageOk', Date.now()); PS.closeModal(true); if (current === 'coa') render(); } // a direct certificate link brings its pop-up back
      else if ('ageExit' in d) { $('.modal-panel').innerHTML = T().ageDenied(); }
      else if (d.cookie) { PS.storage.set('cookies', d.cookie); const b = $('.cookie-banner'); if (b) b.remove(); }
      else if ('navToggle' in d) { document.body.classList.toggle('nav-open'); t.setAttribute('aria-expanded', document.body.classList.contains('nav-open')); }
      else if (d.scrollTo) { e.preventDefault(); const el = $(d.scrollTo); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
      else if (d.tab) {
        const box = t.closest('[data-tabs]');
        $$('[data-tab]', box).forEach((b) => { b.classList.toggle('active', b === t); b.setAttribute('aria-selected', b === t); });
        $$('[data-panel]', box).forEach((p) => { p.hidden = p.dataset.panel !== d.tab; });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { dismissModal(); PS.closeCart(); document.body.classList.remove('nav-open'); }
      const m = $('#ps-modal');
      if (e.key === 'Tab' && !m.hidden && m.classList.contains('open')) { // a pop-up keeps the focus inside itself
        const panel = $('.modal-panel', m), els = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])', panel).filter((x) => x.offsetParent), a = document.activeElement;
        const first = els[0], last = els[els.length - 1];
        if (!els.length) { e.preventDefault(); panel.focus(); }
        else if (!panel.contains(a) || a === panel) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
        else if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
      }
    });

    document.addEventListener('input', (e) => {
      const t = e.target;
      if (t.dataset.format === 'card') t.value = t.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
      if (t.dataset.format === 'exp') { const d = t.value.replace(/\D/g, '').slice(0, 4); t.value = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; }
      if ('lotSearch' in t.dataset) filterLots(true);
      const mf = t.closest('form[data-form="manage-sub"]');
      if (mf) {
        if (t.name === 'weeks') mf.elements.plan.value = 'custom'; // typing a number means Custom
        syncManage(mf);
      }
      const pf = t.closest('form[data-form="product"]');
      if (pf && t.name === 'qty') rollQty(t);
      if (pf && t.name === 'weeks') pickCustomPlan(pf);
      if (pf) PS.syncProductForm(pf);
      const field = t.closest('.field.is-invalid');
      if (field) clearError(field);
    });

    document.addEventListener('focusin', (e) => {
      const pf = e.target.name === 'weeks' && e.target.closest('form[data-form="product"]');
      if (pf) pickCustomPlan(pf);
    });

    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t.dataset.lineQty) PS.cart.setQty(t.dataset.lineQty, t.value);
      const pf = t.closest('form[data-form="product"]');
      if (pf && t.name === 'weeks') t.value = weeksIn(t.value);
      if (pf) PS.syncProductForm(pf);
      if ('lotProductFilter' in t.dataset) filterLots(true);
      const mf = t.closest('form[data-form="manage-sub"]');
      if (mf) { if (t.name === 'weeks') t.value = weeksIn(t.value); syncManage(mf); }
      if (t.name === 'helpOrder') { const a = $('[data-help-mail]'); a.setAttribute('href', helpMail(a.dataset.helpMail, t.value)); }
      if (t.name === 'billingSame') {
        // the billing address shows only when it differs from shipping; its fields are required while shown and off (skipped by the form) while hidden
        const box = $('[data-billing]', t.closest('form'));
        box.hidden = t.checked;
        $$('input, select', box).forEach((i) => { i.disabled = t.checked; });
        if (t.checked) $$('.field.is-invalid', box).forEach((f) => { f.classList.remove('is-invalid'); $('.field-error', f).textContent = ''; });
      }
      if (t.name === 'ship' && t.closest('[data-form="checkout"]')) refreshCheckout();
      if (t.dataset.sort != null) { const r = PS.parseHash(); r.query.sort = t.value; PS.go('#' + r.path + '?' + new URLSearchParams(r.query)); }
    });

    document.addEventListener('submit', async (e) => {
      const form = e.target.closest('form[data-form]');
      if (!form) return;
      e.preventDefault();
      const kind = form.dataset.form;
      const data = formData(form);
      if (kind === 'product') {
        const p = PS.getProduct(form.dataset.id);
        let plan = data.plan || 'once';
        if (plan === 'custom') {
          const w = weeksIn(data.weeks);
          plan = 'c' + w;
          PS.storage.set('customWeeks', w); // suggested next time on other product pages
        }
        PS.cart.add(p.id, data.size, data.qty, plan);
        PS.emit('added', { el: form.querySelector('[type=submit]'), id: p.id });
        return;
      }
      if (kind === 'search') { PS.go('#/shop?q=' + encodeURIComponent(data.q || '')); document.body.classList.remove('nav-open'); return; }
      if (kind === 'track-go') { PS.go(`#/track?order=${encodeURIComponent(data.order)}&email=${encodeURIComponent(data.email)}`); form.reset(); document.activeElement.blur(); return; }
      if (kind === 'promo') { const r = PS.cart.applyPromo(data.code); PS.toast(esc(r.msg), r.ok ? '' : 'error'); return; }
      if (kind === 'profile') { // the address is all or nothing: once any of it is filled in, the main lines are required
        const any = ['address1', 'address2', 'city', 'state', 'zip'].some((k) => data[k]);
        ['address1', 'city', 'state', 'zip'].forEach((k) => { form.elements[k].required = any; });
      }
      if (!validateForm(form)) return;
      const btn = $('button[type="submit"]', form);
      if (kind === 'manage-sub') {
        if (data.end && data.end < data.start) { $('.form-msg', form).textContent = 'The end date has to come after the start date.'; return; }
        const weeks = data.plan === '4w' ? 4 : weeksIn(data.weeks), set = PS.storage.get('subSettings', {});
        set[data.key] = { planId: data.plan === '4w' ? '4w' : 'c' + weeks, start: data.start, end: data.end || '' };
        PS.storage.set('subSettings', set);
        PS.closeModal();
        PS.toast('Standing order updated.');
        render();
        return;
      }
      if (kind === 'checkout') {
        const t = PS.cart.totals(data.ship);
        if (!t.lines.length) { PS.toast('Your cart is empty.', 'error'); return; }
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Processing…';
        await new Promise((r) => setTimeout(r, 900));
        const order = PS.orders.create(data, t);
        if (data.marketing) PS.storage.set('newsletter', (PS.storage.get('newsletter', [])).concat(data.email));
        if (data.saveDetails) PS.details.set(PS.details.fromForm(data)); else PS.details.clear();
        PS.cart.clear();
        PS.go('#/order/' + order.number);
        return;
      }
      if (kind === 'newsletter') {
        PS.storage.set('newsletter', (PS.storage.get('newsletter', [])).concat(data.email));
        form.reset();
        PS.toast('You’re on the list — watch for new lots and restocks.');
        return;
      }
      if (kind === 'track') { PS.trackLookup(data.order, data.email); return; }
      if (kind === 'contact' || kind === 'wholesale') {
        const key = kind === 'contact' ? 'messages' : 'wholesaleApps';
        PS.storage.set(key, PS.storage.get(key, []).concat(Object.assign({ at: Date.now() }, data)));
        const wrap = form.closest('[data-form-wrap]') || form.parentElement;
        wrap.innerHTML = `<div class="success-panel"><span class="success-icon">${PS.icon('check')}</span><h2 class="h3">${kind === 'contact' ? 'Message sent' : 'Application received'}</h2><p class="muted">Thanks${data.name ? ', ' + esc(data.name.split(' ')[0]) : ''}. We’ll reply to <strong>${esc(data.email)}</strong> within one business day.</p><a class="btn btn-secondary" href="#/shop">Back to shop</a></div>`;
        return;
      }
      if (kind === 'order-address') {
        const r = PS.orders.updateAddress(form.dataset.order, { name: data.name.trim(), phone: data.phone || '', org: data.org || '', address: { line1: data.address1, line2: data.address2 || '', city: data.city, state: data.state, zip: data.zip } });
        if (!r.ok) { $('.form-msg', form).textContent = r.msg; return; }
        PS.closeModal();
        PS.toast('Shipping address updated.');
        render();
        return;
      }
      if (kind === 'profile') {
        const prev = PS.details.get(), r = PS.auth.update({ name: `${data.first} ${data.last}`, email: data.email });
        if (!r.ok) { $('.form-msg', form).textContent = r.msg; return; }
        PS.details.set({ email: data.email, phone: data.phone, first: data.first, last: data.last, org: data.org, address: { line1: data.address1, line2: data.address2, city: data.city, state: data.state, zip: data.zip }, billing: prev && prev.billing });
        PS.emit('auth'); // the header's "Hi <name>" and this page follow the new name at once
        PS.toast('Profile saved.');
        return;
      }
      if (kind === 'signin' || kind === 'signup') {
        btn.disabled = true;
        signingIn = true;
        const r = kind === 'signin' ? await PS.auth.signIn(data) : await PS.auth.signUp(data);
        signingIn = false;
        if (!r.ok) { btn.disabled = false; $('.form-msg', form).textContent = r.msg; return; }
        arrive(form);
      }
    });
  }

  /* ---------- rendering ---------- */
  let current = null;
  function refreshCheckout() {
    const form = $('form[data-form="checkout"]');
    if (!form) return;
    const t = PS.cart.totals(form.elements.ship.value);
    const sum = $('[data-summary]');
    if (sum) sum.innerHTML = T().summary(t, { shipping: true });
    $$('[data-ship-price]', form).forEach((el) => { const m = PS.config.shipping.find((x) => x.id === el.dataset.shipPrice); const v = t.shipPrice(m); el.textContent = v ? PS.money(v) : 'Free'; });
    $$('[data-total]', form).forEach((el) => { el.textContent = PS.money(t.total); });
  }
  function refreshCart() {
    const t = PS.cart.totals();
    $$('[data-cart-count]').forEach((el) => { el.textContent = t.count; el.classList.toggle('has', t.count > 0); });
    $$('[data-cart-total]').forEach((el) => { el.textContent = PS.money(t.merch); });
    const panel = $('#cart-drawer .drawer-panel');
    const drawFull = () => { panel.innerHTML = T().drawer(PS.cart.totals()); };
    if (panel && !patchCart(panel, T().drawer(t), drawFull)) drawFull();
    if (current === 'cart') {
      const views = Object.assign({}, PS.defaultViews, T().views);
      if (!patchCart($('#view'), views.cart().html, () => { if (current === 'cart') render(); })) render();
    }
    else if (current === 'checkout' && !t.count) render();
    else if (current === 'checkout') refreshCheckout();
  }
  // Updates a cart (the drawer or the cart page) in place: only the quantities, line prices, notes and totals change, and a removed line
  // collapses out before it goes. `html` is the cart as freshly drawn, `redraw` draws it from scratch (used once the cart has emptied).
  // Returns false when the lines changed too much to patch (a line was added or moved), and the caller redraws.
  function patchCart(root, html, redraw) {
    const next = document.createElement('div');
    next.innerHTML = html;
    const old = $$('.line:not(.leaving)', root), fresh = $$('.line', next);
    const byKey = {};
    old.forEach((l) => { byKey[l.dataset.key] = l; });
    const keys = fresh.map((l) => l.dataset.key);
    if (!old.length || keys.some((k) => !byKey[k])) return false;
    if (old.map((l) => l.dataset.key).filter((k) => keys.includes(k)).join('\n') !== keys.join('\n')) return false;
    const head = $('.drawer-head h2', root);
    if (head) head.innerHTML = $('.drawer-head h2', next).innerHTML;
    if (!fresh.length) {
      old.forEach(collapseLine);
      setTimeout(() => { if (!PS.cart.items().length) redraw(); }, 300);
      return true;
    }
    const pairs = [['.totals', 'innerHTML'], ['.freeship-text', 'innerHTML'], ['.drawer-foot .btn-primary', 'textContent']];
    if (pairs.some(([q]) => !$(q, root) !== !$(q, next)) || !$('.totals', root) || !!$('.promo-applied', root) !== !!$('.promo-applied', next)) return false;
    fresh.forEach((f) => {
      const o = byKey[f.dataset.key];
      const q = $('.qty-input', o), from = parseInt(q.value, 10) || 0, to = parseInt($('.qty-input', f).value, 10) || 0;
      q.value = to;
      wipeQty(q, from, to);
      ['.line-price', '.line-meta'].forEach((q) => { $(q, o).innerHTML = $(q, f).innerHTML; });
    });
    old.filter((l) => !keys.includes(l.dataset.key)).forEach(collapseLine);
    pairs.forEach(([q, prop]) => { const o = $(q, root); if (o) o[prop] = $(q, next)[prop]; });
    const bar = $('.freeship-bar span', root);
    if (bar) bar.style.width = $('.freeship-bar span', next).style.width;
    const note = $('.tier-note', root), noteNew = $('.tier-note', next);
    if (note && noteNew) note.innerHTML = noteNew.innerHTML;
    else if (note) note.remove();
    else if (noteNew) old[0].parentNode.insertBefore(noteNew, old[0]);
    return true;
  }
  function collapseLine(el) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.remove(); return; }
    el.classList.add('leaving');
    el.style.height = el.offsetHeight + 'px';
    void el.offsetHeight;
    el.classList.add('out');
    el.style.height = '0px';
    setTimeout(() => el.remove(), 280);
  }
  function reveal(soft) {
    const els = $$('.reveal:not(.in)');
    if (soft || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }
  // Same page redrawn (filters, sort, search, promo code, cart or sign-in changes) is "soft": nothing re-enters or jumps, only the shop grid fades.
  // Any other arrival, including one category of Shop to another, is a new page: it cross-fades with the browser's view transition (or the quick
  // page-enter fade where that isn't available), and the title's rise-in plays again.
  let lastPath = null, lastName = null, latest = null, swapping = false, signingIn = false, arriving = false;
  // Signing in or up goes on to where the visitor was headed (or the account page); on a page that asked for a sign-in (Order history) it is drawn again in place.
  function goAfterAuth() {
    const q = PS.parseHash().query;
    if (PS.auth.current() && ['account', 'signup'].includes(current) && (q.next || current === 'signup')) PS.go('#' + (safeNext(q.next) || '/account'));
    else if (['account', 'signup', 'orders', 'checkout', 'track'].includes(current)) render();
  }
  // After a good sign-in or sign-up the form fades and lifts out as "Welcome back, <name>" fades in, then the next page rises in (about 0.7s in all).
  // The header already shows the signed-in button by now (the 'auth' event updated it). With reduced motion it goes straight on.
  function arrive(form) {
    const card = form.closest('.auth-card'), at = location.hash, go = () => { if (location.hash !== at) return; arriving = true; goAfterAuth(); };
    if (!card || matchMedia('(prefers-reduced-motion: reduce)').matches) { go(); return; }
    card.style.minHeight = card.offsetHeight + 'px';
    card.insertAdjacentHTML('beforeend', `<div class="auth-welcome" role="status">${PS.icon('check')}<strong>${form.dataset.form === 'signup' ? 'Welcome' : 'Welcome back'}, ${esc(PS.auth.current().name.split(' ')[0])}</strong></div>`);
    card.classList.add('welcome');
    setTimeout(go, 300);
  }
  function render() {
    const r = PS.parseHash();
    const views = Object.assign({}, PS.defaultViews, T().views);
    const fn = views[r.name] || views.notFound;
    const out = fn(r) || views.notFound(r);
    const arrived = arriving;
    arriving = false;
    const soft = !arrived && lastName === r.name && lastPath === r.path;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches || !document.startViewTransition;
    const mode = soft ? 'soft' : lastName === null || still || arrived ? 'enter' : 'vt';
    current = r.name;
    lastPath = r.path;
    lastName = r.name;
    if (swapping) { latest.r = r; latest.out = out; return; } // a page change is waiting for its frame: it will draw this one
    latest = { r, out, mode, arrived };
    if (mode !== 'vt') { paint(); return; }
    const root = document.documentElement;
    swapping = true;
    root.classList.add('vt-page');
    try {
      const vt = document.startViewTransition(() => { swapping = false; paint(); });
      vt.ready.catch(() => {});
      vt.updateCallbackDone.catch((e) => console.error(e));
      vt.finished.then(() => root.classList.remove('vt-page'), () => root.classList.remove('vt-page'));
    } catch (e) { swapping = false; root.classList.remove('vt-page'); paint(); }
  }
  function paint() {
    const { r, out, mode } = latest;
    const main = $('#view');
    const soft = mode === 'soft';
    const focused = soft && main.contains(document.activeElement) ? document.activeElement.id : '';
    main.innerHTML = out.html;
    main.classList.toggle('soft', soft);
    main.classList.toggle('arrive', !!latest.arrived);
    document.title = (out.title ? out.title + ' · ' : '') + 'Pepsoma — Research-grade peptides';
    $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === r.path.split('/')[1]));
    document.body.classList.remove('nav-open');
    document.body.dataset.route = r.name;
    if (!soft) { PS.closeCart(); PS.closeModal(); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
    $$('form[data-form="product"]', main).forEach(PS.syncProductForm);
    if (out.after) out.after();
    if (T().afterRender) T().afterRender(r, main, mode);
    reveal(soft);
    if (focused && document.getElementById(focused)) document.getElementById(focused).focus({ preventScroll: true });
  }
  PS.render = render;

  /* ---------- boot ---------- */
  PS.boot = (theme) => {
    PS.theme = theme;
    document.documentElement.dataset.site = theme.name;
    $('#app-header').innerHTML = theme.header();
    $('#app-footer').innerHTML = theme.footer();
    document.body.insertAdjacentHTML('beforeend', `
      <div id="cart-drawer" class="drawer" hidden><div class="drawer-backdrop" data-close-cart></div><aside class="drawer-panel" role="dialog" aria-modal="true" aria-label="Shopping cart" tabindex="-1"></aside></div>
      <div id="ps-modal" class="modal" hidden><div class="modal-backdrop" data-close-modal></div><div class="modal-panel" role="dialog" aria-modal="true" tabindex="-1"></div></div>
      <div id="ps-toasts" class="toasts" aria-live="polite"></div>`);
    bind();
    PS.on('cart', refreshCart);
    PS.on('auth', () => {
      $('#app-header').innerHTML = theme.header();
      refreshCart();
      if (!signingIn) goAfterAuth(); // a sign-in from its form waits for the welcome (see arrive)
    });
    PS.on('route', render);
    window.addEventListener('hashchange', render);
    render();
    refreshCart();
    if (!PS.storage.get('ageOk', null)) PS.openModal(theme.ageGate(), { locked: true, cls: 'modal-gate' });
    if (!PS.storage.get('cookies', null)) document.body.insertAdjacentHTML('beforeend', theme.cookieBanner());
  };
})();
