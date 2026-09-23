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
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
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
  H.check = (o) => `<div class="field field-check"><label class="check"><input type="checkbox" name="${o.name}" ${o.required ? 'required' : ''} ${o.checked ? 'checked' : ''}><span class="check-box">${PS.icon('check')}</span><span class="check-label">${o.label}</span></label><small class="field-error" aria-live="polite"></small></div>`;

  H.qty = (value, attrs) => `<div class="qty" ${attrs || ''}><button type="button" class="qty-btn" data-step="-1" aria-label="Decrease quantity">${PS.icon('minus')}</button><input class="qty-input" name="qty" type="number" min="1" max="99" value="${value || 1}" aria-label="Quantity" inputmode="numeric"><button type="button" class="qty-btn" data-step="1" aria-label="Increase quantity">${PS.icon('plus')}</button></div>`;

  H.promoForm = (t) => t.promo
    ? `<div class="promo-applied"><span>${PS.icon('check')} <strong>${esc(t.promo.code)}</strong> — ${esc(t.promo.label)}</span><button type="button" class="link-btn" data-remove-promo>Remove</button></div>`
    : `<form class="promo-form" data-form="promo" novalidate><label class="sr-only" for="promo-code">Promo code</label><input id="promo-code" class="input" name="code" placeholder="Promo code" autocomplete="off"><button class="btn btn-secondary" type="submit">Apply</button></form>${t.promoCode ? `<p class="small muted">${esc(t.promoCode)} isn’t active for this cart.</p>` : ''}`;

  H.freeShip = (t) => t.count === 0 ? '' : `<div class="freeship"><div class="freeship-text">${t.freeStandard ? `${PS.icon('truck')} You’ve unlocked <strong>free standard shipping</strong>` : `${PS.icon('truck')} You’re <strong>${PS.money(t.freeShipRemaining)}</strong> away from free shipping`}</div><div class="freeship-bar"><span style="width:${Math.round((t.freeStandard ? 1 : t.freeShipProgress) * 100)}%"></span></div></div>`;

  H.tierNote = (t) => {
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
      ${t.promoDiscount ? row(`Promo ${esc(t.promo.code)}`, '−' + PS.money(t.promoDiscount), 'discount') : ''}
      ${opts.shipping ? row(`Shipping <small>${esc(t.method.label.split(' — ')[0])}</small>`, t.shipping ? PS.money(t.shipping) : 'Free') : row('Shipping', t.freeStandard ? 'Free' : 'Calculated at checkout')}
      ${opts.shipping ? row('Tax', 'Calculated per state · $0.00', 'muted') : ''}
      ${row('Total', PS.money(opts.shipping ? t.total : t.merch), 'grand')}
      ${t.savings > 0 ? `<div class="tot-savings">You’re saving ${PS.money(t.savings)}</div>` : ''}
    </div>`;
  };

  H.checkoutForm = (user, t) => {
    const f = (o) => H.field(Object.assign({ form: 'co' }, o));
    return `<form class="checkout-form" data-form="checkout" novalidate>
      <fieldset class="fs"><legend class="legend"><span class="legend-n">1</span> Contact</legend>
        ${f({ name: 'email', label: 'Email', type: 'email', auto: 'email', validate: 'email', value: user ? user.email : '' })}
        ${f({ name: 'phone', label: 'Phone', type: 'tel', auto: 'tel', required: false, validate: 'phone', hint: 'For delivery issues only.' })}
        ${user ? `<p class="small muted">Signed in as ${esc(user.email)}</p>` : `<p class="small muted">Have an account? <a href="#/account">Sign in</a> to see order history.</p>`}
      </fieldset>
      <fieldset class="fs"><legend class="legend"><span class="legend-n">2</span> Shipping address</legend>
        <div class="field-row">${f({ name: 'first', label: 'First name', auto: 'given-name', value: user ? user.name.split(' ')[0] : '' })}${f({ name: 'last', label: 'Last name', auto: 'family-name', value: user ? user.name.split(' ').slice(1).join(' ') : '' })}</div>
        ${f({ name: 'org', label: 'Lab / institution', auto: 'organization', required: false })}
        ${f({ name: 'address1', label: 'Street address', auto: 'address-line1' })}
        ${f({ name: 'address2', label: 'Apt, suite, building', auto: 'address-line2', required: false })}
        <div class="field-row three">${f({ name: 'city', label: 'City', auto: 'address-level2' })}${f({ name: 'state', label: 'State', options: PS.states, auto: 'address-level1' })}${f({ name: 'zip', label: 'ZIP', auto: 'postal-code', validate: 'zip', attrs: 'inputmode="numeric" maxlength="10"' })}</div>
      </fieldset>
      <fieldset class="fs"><legend class="legend"><span class="legend-n">3</span> Shipping method</legend>
        <div class="options">${PS.config.shipping.map((m, i) => `<label class="option"><input type="radio" name="ship" value="${m.id}" ${i === 0 ? 'checked' : ''}><span class="option-dot"></span><span class="option-body"><span class="option-title">${esc(m.label)}</span><span class="option-sub">${esc(m.eta)}</span></span><span class="option-price" data-ship-price="${m.id}">${PS.money(t.shipPrice(m)) === '$0.00' ? 'Free' : PS.money(t.shipPrice(m))}</span></label>`).join('')}</div>
      </fieldset>
      <fieldset class="fs"><legend class="legend"><span class="legend-n">4</span> Payment</legend>
        <div class="demo-note">${PS.icon('lock')} <span><strong>Demo checkout — no card is charged.</strong> Try <code>4242 4242 4242 4242</code>, any future expiry, any CVC.</span></div>
        ${f({ name: 'cardname', label: 'Name on card', auto: 'cc-name' })}
        ${f({ name: 'card', label: 'Card number', auto: 'cc-number', validate: 'card', attrs: 'inputmode="numeric" data-format="card" maxlength="23" placeholder="1234 5678 9012 3456"' })}
        <div class="field-row">${f({ name: 'exp', label: 'Expiry', auto: 'cc-exp', validate: 'exp', attrs: 'inputmode="numeric" data-format="exp" maxlength="7" placeholder="MM / YY"' })}${f({ name: 'cvc', label: 'CVC', auto: 'cc-csc', validate: 'cvc', attrs: 'inputmode="numeric" maxlength="4" placeholder="123"' })}</div>
        ${H.check({ name: 'billingSame', label: 'Billing address same as shipping', checked: true })}
      </fieldset>
      <fieldset class="fs attest"><legend class="legend"><span class="legend-n">5</span> Research use attestation</legend>
        ${H.check({ name: 'ruo', required: true, label: 'I confirm these materials are purchased solely for in-vitro laboratory research and <strong>not for human or animal consumption</strong>.' })}
        ${H.check({ name: 'age', required: true, label: 'I am 21 years of age or older.' })}
        ${H.check({ name: 'terms', required: true, label: 'I agree to the <a target="_blank" rel="noopener" href="#/policies/terms">Terms of Service</a>, <a target="_blank" rel="noopener" href="#/policies/research-use">Research Use Policy</a> and <a target="_blank" rel="noopener" href="#/policies/refunds">Refund Policy</a>.' })}
        ${t.hasSubs ? H.check({ name: 'subs', required: true, label: 'I understand my standing order <strong>renews automatically</strong> and I’ll be charged on each ship date until I cancel. <a target="_blank" rel="noopener" href="#/policies/subscriptions">Standing Order Terms</a>' }) : ''}
        ${H.check({ name: 'marketing', label: 'Email me new lots, restocks and research-stack offers.' })}
      </fieldset>
      <button class="btn btn-primary btn-lg btn-block" type="submit" data-submit>${PS.icon('lock')} Place order · <span data-total>${PS.money(t.total)}</span></button>
      <p class="secure-note">Secured with 256-bit TLS encryption. By placing your order you agree to our policies.</p>
    </form>`;
  };

  H.contactForm = () => {
    const f = (o) => H.field(Object.assign({ form: 'ct' }, o));
    return `<form class="stack-form" data-form="contact" novalidate>
      <div class="field-row">${f({ name: 'name', label: 'Name', auto: 'name' })}${f({ name: 'email', label: 'Email', type: 'email', auto: 'email', validate: 'email' })}</div>
      <div class="field-row">${f({ name: 'topic', label: 'Topic', options: [['', 'Select…'], ['order', 'Order support'], ['coa', 'Product / COA question'], ['wholesale', 'Wholesale & institutional'], ['other', 'Something else']] })}${f({ name: 'order', label: 'Order number', required: false, placeholder: 'PS123456' })}</div>
      ${f({ name: 'message', label: 'Message', type: 'textarea', placeholder: 'How can we help?' })}
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

  H.orderItems = (o) => `<ul class="order-items">${o.items.map((i) => `<li><span>${i.qty} × ${esc(i.name)} <small>${esc(i.size)}${i.planId !== 'once' ? ' · ' + esc(i.plan) : ''}</small></span><span>${PS.money(i.total)}</span></li>`).join('')}</ul>
    <div class="totals">
      <div class="tot-row"><span>Subtotal</span><span>${PS.money(o.subtotal)}</span></div>
      ${o.tierDiscount ? `<div class="tot-row discount"><span>Volume savings (${o.tierPct}%)</span><span>−${PS.money(o.tierDiscount)}</span></div>` : ''}
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

  H.faq = (groups) => groups.map((g) => `<div class="faq-group">${g.group ? `<h3 class="faq-group-title">${esc(g.group)}</h3>` : ''}${g.items.map(([q, a]) => `<details class="faq-item"><summary><span>${esc(q)}</span>${PS.icon('chev', 'faq-chev')}</summary><div class="faq-a"><p>${esc(a)}</p></div></details>`).join('')}</div>`).join('');

  H.disclaimer = () => `${PS.company.legal} supplies research materials intended strictly for in-vitro laboratory research. Products are not drugs, supplements or cosmetics, have not been evaluated by the FDA, and are not intended to diagnose, treat, cure or prevent any disease. Not for human or veterinary use. ${PS.company.name} is not a compounding pharmacy or outsourcing facility under Sections 503A/503B of the FD&amp;C Act. By purchasing you confirm you are 21+ and a qualified researcher.`;

  /* ---------- default pages (themes can override any of these) ---------- */
  const T = () => PS.theme;
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
            <div class="order-meta"><div><span class="label">Ship to</span><p>${esc(o.name)}${o.org ? '<br>' + esc(o.org) : ''}<br>${esc(o.address.line1)}${o.address.line2 ? ', ' + esc(o.address.line2) : ''}<br>${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.zip)}</p></div>
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
          <div class="lot-search"><span class="lot-search-icon">${PS.icon('search')}</span><label class="sr-only" for="lot-q">Search lots</label><input id="lot-q" class="input" data-lot-search placeholder="Search lot number or product — e.g. PS-BPC-2609A" value="${esc(query.q || '')}"></div>
          ${H.lotTable(lots)}
          <p class="small muted mt">Demo COAs use illustrative values. Read our <a href="#/policies/testing">Testing &amp; COA Policy</a>.</p>
        </section>`,
        after() { const i = $('[data-lot-search]'); if (i && i.value) filterLots(i.value); },
      };
    },
    faq() {
      return {
        title: 'FAQ',
        html: `${T().pageHead({ eyebrow: 'Help center', title: 'Frequently asked questions', intro: 'Can’t find an answer? Our team replies within one business day.' })}
        <section class="container section-sm narrow faq">${H.faq(PS.faqs)}
          <div class="card pad center mt"><h2 class="h3">Still have questions?</h2><p class="muted">Email <a href="mailto:${PS.company.email}">${PS.company.email}</a> or send us a message.</p><a class="btn btn-primary" href="#/contact">Contact support</a></div></section>`,
      };
    },
    contact() {
      const C = PS.company;
      return {
        title: 'Contact',
        html: `${T().pageHead({ eyebrow: 'Support', title: 'Contact us', intro: 'Questions about an order, a COA or wholesale? We reply within one business day.' })}
        <section class="container section-sm"><div class="contact-grid">
          <div class="card pad" data-form-wrap>${H.contactForm()}</div>
          <aside class="contact-side">
            <div class="card pad"><ul class="contact-list">
              <li>${PS.icon('mail')}<div><span class="label">Email</span><a href="mailto:${C.email}">${C.email}</a></div></li>
              <li>${PS.icon('phone')}<div><span class="label">Phone</span><span>${C.phone}</span></div></li>
              <li>${PS.icon('clock')}<div><span class="label">Hours</span><span>Mon–Fri · 9 AM – 6 PM ET</span></div></li>
              <li>${PS.icon('pin')}<div><span class="label">Mailing address</span><span>${C.address}</span></div></li>
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
    account() {
      const u = PS.auth.current();
      if (!u) {
        const f = (o) => H.field(o);
        return {
          title: 'Account',
          html: `${T().pageHead({ eyebrow: 'Account', title: 'Sign in or create an account', intro: 'Track orders, reorder in one click and manage standing orders.' })}
          <section class="container section-sm"><div class="auth-grid">
            <div class="card pad"><h2 class="h3">Sign in</h2><form class="stack-form" data-form="signin" novalidate>
              ${f({ form: 'si', name: 'email', label: 'Email', type: 'email', auto: 'email', validate: 'email' })}${f({ form: 'si', name: 'password', label: 'Password', type: 'password', auto: 'current-password' })}
              <p class="form-msg" aria-live="polite"></p><button class="btn btn-primary btn-block" type="submit">Sign in</button></form></div>
            <div class="card pad"><h2 class="h3">Create account</h2><form class="stack-form" data-form="signup" novalidate>
              ${f({ form: 'su', name: 'name', label: 'Full name', auto: 'name' })}${f({ form: 'su', name: 'email', label: 'Email', type: 'email', auto: 'email', validate: 'email' })}${f({ form: 'su', name: 'password', label: 'Password', type: 'password', auto: 'new-password', validate: 'password', hint: 'At least 8 characters.' })}
              ${H.check({ name: 'age', required: true, label: 'I am 21+ and will use products for laboratory research only.' })}
              <p class="form-msg" aria-live="polite"></p><button class="btn btn-secondary btn-block" type="submit">Create account</button></form></div>
          </div><p class="small muted center mt">Demo accounts are stored only in this browser.</p></section>`,
        };
      }
      const orders = PS.orders.forEmail(u.email);
      const cancelled = PS.storage.get('cancelledSubs', []);
      const subs = orders.flatMap((o) => o.items.filter((i) => i.planId !== 'once').map((i) => Object.assign({ key: o.number + '|' + i.id + '|' + i.size, order: o }, i)));
      return {
        title: 'My account',
        html: `${T().pageHead({ eyebrow: 'Account', title: `Welcome back, ${esc(u.name.split(' ')[0])}.`, intro: `Signed in as ${esc(u.email)} · member since ${PS.date(u.created, { month: 'long', year: 'numeric' })}` })}
        <section class="container section-sm"><div class="account-grid">
          <div class="card pad"><h2 class="h3">Order history</h2>${orders.length ? `<ul class="order-list">${orders.map((o) => `<li><a href="#/order/${o.number}"><strong>${o.number}</strong><span>${PS.date(o.createdAt)} · ${o.items.reduce((s, i) => s + i.qty, 0)} items · ${PS.money(o.total)}</span><span class="badge">${PS.orders.status(o).current.label}</span></a></li>`).join('')}</ul>` : `<p class="muted">No orders yet.</p><a class="btn btn-primary" href="#/shop">Start shopping</a>`}</div>
          <div class="stack">
            <div class="card pad"><h2 class="h3">Standing orders</h2>${subs.length ? `<ul class="sub-list">${subs.map((s) => { const off = cancelled.includes(s.key); return `<li><div><strong>${esc(s.name)}</strong> <small>${esc(s.size)} × ${s.qty}</small><span class="small muted">${esc(s.plan)} · ${off ? 'Cancelled' : 'Next ship ' + PS.date(s.order.createdAt + (s.planId === '4w' ? 28 : 56) * 864e5)}</span></div>${off ? '<span class="badge badge-muted">Cancelled</span>' : `<button class="btn btn-sm btn-ghost" data-cancel-sub="${esc(s.key)}">Cancel</button>`}</li>`; }).join('')}</ul>` : '<p class="muted small">No standing orders. Choose “Standing order” on any product page to save up to 15%.</p>'}</div>
            <div class="card pad"><h2 class="h3">Profile</h2><p>${esc(u.name)}<br><span class="muted">${esc(u.email)}</span></p><button class="btn btn-secondary" data-signout>Sign out</button></div>
          </div></div></section>`,
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
        html: `${T().pageHead({ eyebrow: '404', title: 'Page not found', intro: (o && o.msg) || 'That page doesn’t exist or has moved.' })}<section class="container section-sm center"><a class="btn btn-primary" href="#/">Back home</a> <a class="btn btn-ghost" href="#/shop">Shop peptides</a></section>`,
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
    setTimeout(() => { m.hidden = true; }, 200);
    if (!$('.drawer.open')) document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
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
      if (!input) return;
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
  const formData = (form) => {
    const o = {};
    new FormData(form).forEach((v, k) => { o[k] = typeof v === 'string' ? v.trim() : v; });
    return o;
  };

  function filterLots(q) {
    q = String(q).trim().toLowerCase();
    let shown = 0;
    $$('[data-lot-row]').forEach((r) => { const m = !q || r.dataset.lotRow.includes(q); r.hidden = !m; if (m) shown++; });
    const e = $('.empty-row');
    if (e) e.hidden = shown > 0;
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

  /* ---------- delegated behaviors ---------- */
  function bind() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('button, a, [data-close-modal], [data-close-cart]');
      if (!t) return;
      const d = t.dataset;
      if ('openCart' in d) { e.preventDefault(); PS.openCart(); }
      else if ('closeCart' in d) { e.preventDefault(); PS.closeCart(); }
      else if ('closeModal' in d) { e.preventDefault(); PS.closeModal(); }
      else if (d.add) {
        e.preventDefault();
        PS.cart.add(d.add, d.size, 1, 'once');
        const p = PS.getProduct(d.add);
        PS.toast(`${esc(p.name)} added to cart`);
        if (T().openCartOnAdd !== false) PS.openCart();
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
      else if (d.coa) {
        const lot = PS.findLot(d.coa);
        if (lot) PS.openModal(`${PS.coaDoc(lot)}<div class="coa-actions"><button class="btn btn-primary" type="button" data-print>${PS.icon('download')} Print / save PDF</button></div>`, { cls: 'modal-coa' });
      }
      else if ('print' in d) { window.print(); }
      else if ('signout' in d) { PS.auth.signOut(); PS.toast('Signed out'); }
      else if (d.cancelSub) {
        const list = PS.storage.get('cancelledSubs', []);
        list.push(d.cancelSub);
        PS.storage.set('cancelledSubs', list);
        PS.toast('Standing order cancelled — no further charges.');
        render();
      }
      else if ('ageAccept' in d) { PS.storage.set('ageOk', Date.now()); PS.closeModal(true); }
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
      if (e.key === 'Escape') { PS.closeModal(); PS.closeCart(); document.body.classList.remove('nav-open'); }
    });

    document.addEventListener('input', (e) => {
      const t = e.target;
      if (t.dataset.format === 'card') t.value = t.value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');
      if (t.dataset.format === 'exp') { const d = t.value.replace(/\D/g, '').slice(0, 4); t.value = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; }
      if ('lotSearch' in t.dataset) filterLots(t.value);
      const pf = t.closest('form[data-form="product"]');
      if (pf) PS.syncProductForm(pf);
      const field = t.closest('.field.is-invalid');
      if (field) { field.classList.remove('is-invalid'); const er = $('.field-error', field); if (er) er.textContent = ''; }
    });

    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t.dataset.lineQty) PS.cart.setQty(t.dataset.lineQty, t.value);
      const pf = t.closest('form[data-form="product"]');
      if (pf) PS.syncProductForm(pf);
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
        PS.cart.add(p.id, data.size, data.qty, data.plan || 'once');
        PS.toast(`${esc(p.name)} added to cart`);
        PS.openCart();
        return;
      }
      if (kind === 'search') { PS.go('#/shop?q=' + encodeURIComponent(data.q || '')); document.body.classList.remove('nav-open'); return; }
      if (kind === 'promo') { const r = PS.cart.applyPromo(data.code); PS.toast(esc(r.msg), r.ok ? '' : 'error'); return; }
      if (!validateForm(form)) return;
      const btn = $('button[type="submit"]', form);
      if (kind === 'checkout') {
        const t = PS.cart.totals(data.ship);
        if (!t.lines.length) { PS.toast('Your cart is empty.', 'error'); return; }
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Processing…';
        await new Promise((r) => setTimeout(r, 900));
        const order = PS.orders.create(data, t);
        if (data.marketing) PS.storage.set('newsletter', (PS.storage.get('newsletter', [])).concat(data.email));
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
      if (kind === 'signin' || kind === 'signup') {
        btn.disabled = true;
        const r = kind === 'signin' ? await PS.auth.signIn(data) : await PS.auth.signUp(data);
        btn.disabled = false;
        if (!r.ok) { $('.form-msg', form).textContent = r.msg; return; }
        PS.toast(kind === 'signin' ? 'Welcome back!' : 'Account created');
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
    if (panel) panel.innerHTML = T().drawer(t);
    if (current === 'cart' || (current === 'checkout' && !t.count)) render();
    else if (current === 'checkout') refreshCheckout();
  }
  function reveal() {
    const els = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }
  let lastPath = null;
  function render() {
    const r = PS.parseHash();
    const views = Object.assign({}, PS.defaultViews, T().views);
    const fn = views[r.name] || views.notFound;
    const out = fn(r) || views.notFound(r);
    current = r.name;
    const main = $('#view');
    main.innerHTML = out.html;
    document.title = (out.title ? out.title + ' · ' : '') + 'Pepsoma — Research-grade peptides';
    $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === r.path.split('/')[1]));
    document.body.classList.remove('nav-open');
    document.body.dataset.route = r.name;
    PS.closeCart();
    PS.closeModal();
    if (r.path !== lastPath) window.scrollTo(0, 0);
    lastPath = r.path;
    $$('form[data-form="product"]', main).forEach(PS.syncProductForm);
    if (out.after) out.after();
    reveal();
  }
  PS.render = render;

  /* ---------- boot ---------- */
  PS.boot = (theme) => {
    PS.theme = theme;
    document.documentElement.dataset.theme = theme.name;
    $('#app-header').innerHTML = theme.header();
    $('#app-footer').innerHTML = theme.footer();
    document.body.insertAdjacentHTML('beforeend', `
      <div id="cart-drawer" class="drawer" hidden><div class="drawer-backdrop" data-close-cart></div><aside class="drawer-panel" role="dialog" aria-modal="true" aria-label="Shopping cart" tabindex="-1"></aside></div>
      <div id="ps-modal" class="modal" hidden><div class="modal-backdrop" data-close-modal></div><div class="modal-panel" role="dialog" aria-modal="true" tabindex="-1"></div></div>
      <div id="ps-toasts" class="toasts" aria-live="polite"></div>`);
    bind();
    PS.on('cart', refreshCart);
    PS.on('auth', () => { $('#app-header').innerHTML = theme.header(); refreshCart(); if (['account', 'checkout', 'track'].includes(current)) render(); });
    PS.on('route', render);
    window.addEventListener('hashchange', render);
    render();
    refreshCart();
    if (!PS.storage.get('ageOk', null)) PS.openModal(theme.ageGate(), { locked: true, cls: 'modal-gate' });
    if (!PS.storage.get('cookies', null)) document.body.insertAdjacentHTML('beforeend', theme.cookieBanner());
  };
})();
