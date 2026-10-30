/* Pepsoma — Version A “Clinical”: navy, periwinkle, cream and olive-yellow, serif-italic accents,
   plan-selector product pages. Follows the device's light/dark setting (toggle overrides).
   Motion vocabulary (rise-and-unblur load-ins, sliding nav pill, live demo window,
   count-ups, corner brackets, footer wordmark). */
(function () {
  const PS = window.PS;
  const esc = PS.esc, icon = PS.icon, money = PS.money, H = PS.html;
  const VT = 'light';
  const img = (p, size) => PS.productImage(p, { theme: VT, size });
  const catName = (id) => (PS.getCategory(id) || {}).name || '';
  const it = (s) => `<em class="serif">${s}</em>`; // serif italic accent
  const checkItem = (s) => `<li><span class="yc">${icon('check')}</span><span>${s}</span></li>`;

  // One-time vial deal, shown on product pages and in Home's offer card, and applied in the cart: 'volume' (3+/5+/10+ vial savings),
  // 'bogo' (Buy 1 Get 1) or 'off' (no deal anywhere). To preview another without changing this, add ?deal=bogo, ?deal=volume or ?deal=off to the address (before the #).
  const DEAL = 'volume';
  const dealParam = new URLSearchParams(location.search).get('deal');
  PS.config.deal = ['bogo', 'volume', 'off'].includes(dealParam) ? dealParam : DEAL;
  if (PS.config.deal === 'bogo') {
    PS.faqs.forEach((g) => g.items.forEach((q, i) => {
      if (/volume pricing/i.test(q[0])) g.items[i] = ['Do you run any deals?', 'Yes: Buy 1 Get 1 on single vials. Every second vial of the same compound and size is free, applied automatically in your cart. Research stacks are excluded. Institutions ordering at larger scale can apply for wholesale pricing.'];
    }));
  }
  // [title, details] for the running deal (read from PS.config), or null when it's off
  const dealText = () => {
    if (PS.config.deal === 'bogo') return ['Buy 1 Get 1', 'Every second vial of the same compound and size is free'];
    if (PS.config.deal === 'volume') return ['Buy more, save more', PS.config.tiers.slice().reverse().map((t) => `${t.min}+&nbsp;vials&nbsp;${t.pct}%&nbsp;off`).join(' · ')];
    return null;
  };

  /* ---------- product card ---------- */
  function card(p, i) {
    const s = p.sizes[0];
    const multi = p.sizes.length > 1;
    // one navy "Sale" tag wherever the card shows a crossed-out price (stacks keep their "Save x%" pill)
    const sale = p.badge === 'Sale' || (s.compare && !/save/i.test(p.badge || ''));
    const badge = p.badge && p.badge !== 'Sale' ? p.badge : '';
    return `<article class="pcard reveal" data-id="${p.id}" style="--d:${(i || 0) % 4}">
      <a class="pcard-img" href="#/product/${p.id}" aria-label="${esc(p.name)}">${badge ? `<span class="pill-y">${esc(badge)}</span>` : ''}${sale ? '<span class="sale-tag">Sale</span>' : ''}<span class="pcard-vial">${img(p)}</span></a>
      <div class="pcard-body">
        <span class="pcard-cat">${esc(catName(p.cat))}</span>
        <h3 class="pcard-name"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
        <p class="pcard-full">${esc(p.full || p.summary)}</p>
        <div class="pcard-sizes">${multi ? p.sizes.map((x) => `<button type="button" class="size-chip" data-card-size="${x.id}" aria-pressed="false">${esc(x.label)}</button>`).join('') : `<span class="size-chip">${esc(s.label)}</span>`}</div>
        <div class="pcard-foot">
          <div class="price">${multi ? '<small>From</small> ' : ''}${money(s.price)} ${s.compare ? `<s>${money(s.compare)}</s>` : ''}</div>
          ${multi ? `<button type="button" class="btn btn-primary btn-sm" data-card-act>Select</button>` : `<button class="btn btn-primary btn-sm" data-add="${p.id}" data-size="${s.id}">Add to cart</button>`}
        </div>
      </div>
    </article>`;
  }

  function pickCardSize(pcard, chip) {
    const p = PS.getProduct(pcard.dataset.id), s = PS.getSize(p, chip.dataset.cardSize);
    pcard.querySelectorAll('[data-card-size]').forEach((b) => { b.classList.toggle('on', b === chip); b.setAttribute('aria-pressed', b === chip); });
    pcard.querySelector('.pcard-vial').innerHTML = img(p, s.label);
    pcard.querySelector('.price').innerHTML = `${money(s.price)} ${s.compare ? `<s>${money(s.compare)}</s>` : ''}`;
    const act = pcard.querySelector('[data-card-act]');
    act.dataset.add = p.id;
    act.dataset.size = s.id;
    act.textContent = 'Add to cart';
  }

  /* ---------- shell ---------- */
  const modeLabel = { auto: 'Theme: match device', light: 'Theme: light', dark: 'Theme: dark' };
  function themeButton() {
    return `<button class="round-btn theme-btn" data-mode-cycle data-mode="auto" aria-label="${modeLabel.auto}">
      <span class="t-ico t-sun">${icon('sun')}</span><span class="t-ico t-moon">${icon('moon')}</span><span class="t-ico t-auto">${icon('monitor')}</span>
      <span class="theme-tip">${modeLabel.auto}</span></button>`;
  }
  function header() {
    const u = PS.auth.current();
    const cats = PS.categories.filter((c) => c.id !== 'stacks');
    const stacks = PS.products.filter((p) => p.cat === 'stacks');
    const count = (id) => PS.products.filter((p) => p.cat === id).length;
    return `<header class="site-header"><div class="container hdr">
      <a class="logo" href="#/" aria-label="Pepsoma home">pep<i>soma</i></a>
      <nav class="main-nav" aria-label="Main">
        <span class="nav-pill" aria-hidden="true"></span>
        <form class="nav-search show-sm" data-form="search" role="search"><input class="input" name="q" placeholder="Search peptides" aria-label="Search peptides"></form>
        <div class="nav-item dd-wrap"><a href="#/shop" data-nav="shop" class="nav-link">Shop Peptides ${icon('chev')}</a>
          <div class="dd"><a href="#/shop">All peptides <small>${PS.products.length}</small></a>${cats.map((c) => `<a href="#/shop/${c.id}">${c.name} <small>${count(c.id)}</small></a>`).join('')}</div></div>
        <div class="nav-item dd-wrap"><a href="#/shop/stacks" class="nav-link">Research Stacks ${icon('chev')}</a>
          <div class="dd">${stacks.map((p) => `<a href="#/product/${p.id}">${esc(p.name)} <small>${money(p.sizes[0].price)}</small></a>`).join('')}</div></div>
        <div class="nav-item dd-wrap"><a href="#/lab-tests" data-nav="lab-tests" class="nav-link">Resources ${icon('chev')}</a>
          <div class="dd"><a href="#/lab-tests">Lab Tests &amp; COAs</a><a href="#/faq">FAQ</a><a href="#/track">Track Order</a><a href="${u ? '#/orders' : '#/account?next=/orders'}">Order history</a><a href="#/wholesale">Wholesale</a><a href="#/policies">Policies</a></div></div>
        <a href="#/about" data-nav="about" class="nav-link">About</a>
        <a href="#/contact" data-nav="contact" class="nav-link">Contact</a>
        ${PS.config.features.supplies ? '<a href="#/shop/supplies" class="nav-link">Supplies</a>' : ''}
        <a href="#/account" class="nav-link show-sm">${u ? 'My account' : 'Sign in'}</a>
      </nav>
      <div class="hdr-actions">
        ${themeButton()}
        <div class="track-wrap"><a class="round-btn" href="#/track" aria-label="Track an order">${icon('truck')}</a>
          <div class="track-pane"><strong>Track an order</strong><form class="stack-form" data-form="track-go"><input class="input" name="order" placeholder="Order number, e.g. PS123456" aria-label="Order number" required><input class="input" name="email" type="email" placeholder="Email used at checkout" aria-label="Email" required><button class="btn btn-primary btn-sm" type="submit">Track ${icon('arrow')}</button></form></div></div>
        <a class="btn btn-yellow btn-pill hide-md" href="#/shop">Explore Peptides</a>
        ${u ? `<div class="acct-wrap dd-wrap hide-sm"><a class="btn btn-primary btn-pill acct-btn" href="#/account"><span>Hi ${esc(u.name.split(' ')[0])}</span><small>Account &amp; Orders</small></a>
          <div class="dd"><a href="#/account">Account</a><a href="#/orders">Order history</a><a href="#/account?focus=standing">Standing orders</a><button type="button" data-signout>Sign out</button></div></div>`
          : '<a class="btn btn-primary btn-pill hide-sm" href="#/account">Account Login</a>'}
        <button class="round-btn cart-btn" data-open-cart aria-label="Open cart">${icon('cart')}<span class="cart-count" data-cart-count>0</span></button>
        <button class="round-btn nav-toggle" data-nav-toggle aria-label="Menu" aria-expanded="false">${icon('menu')}</button>
      </div>
    </div></header>`;
  }

  function footer() {
    const col = (t, links) => `<div class="fcol"><h4>${t}</h4>${links.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</div>`;
    return `<footer class="site-footer">
      <div class="container">
        <div class="f-news reveal"><div><h3>Get ${it('new lot')} alerts</h3><p class="muted">Restocks, new COAs and research-stack offers. No spam.</p></div>${H.newsletter('a')}</div>
        <p class="f-disclaimer">${H.disclaimer()}</p>
        <div class="f-grid">
          <div class="f-brand"><a class="logo" href="#/">pep<i>soma</i></a><p>Research-grade peptides, independently tested and documented to the lot — shipped to your lab within 24 hours.</p>
            <div class="f-badges"><span>${icon('shield')} Third-party tested</span><span>${icon('doc')} COA every lot</span></div></div>
          ${col('Shop', [['#/shop', 'All peptides'], ...PS.categories.slice(0, 5).map((c) => ['#/shop/' + c.id, c.name]), ['#/shop/stacks', 'Research Stacks']])}
          ${col('Resources', [['#/lab-tests', 'Lab Tests & COAs'], ['#/faq', 'FAQ'], ['#/track', 'Track Order'], ['#/wholesale', 'Wholesale'], ['#/account', 'My Account']])}
          ${col('Company', [['#/about', 'About Us'], ['#/contact', 'Contact Us'], ['#/contact', PS.company.email]])}
          ${col('Policies', PS.policies.map((p) => ['#/policies/' + p.slug, p.title]))}
        </div>
        <div class="f-bottom"><div><a href="#/policies/terms"><strong>Terms &amp; Conditions</strong></a><span>© ${PS.company.founded} ${PS.company.legal}. All rights reserved. · Demo storefront — no real orders are processed.</span></div>
          <div class="f-right">
            <div class="seg" role="group" aria-label="Color theme">${[['auto', 'monitor', 'System'], ['light', 'sun', 'Light'], ['dark', 'moon', 'Dark']].map(([m, ic, l]) => `<button type="button" data-mode-set="${m}" aria-pressed="false">${icon(ic)}${l}</button>`).join('')}</div>
            <div class="f-social">${['instagram', 'linkedin', 'x', 'youtube'].map((s) => `<a href="#/" aria-label="${s}">${icon(s)}</a>`).join('')}</div>
          </div></div>
      </div>
      <div class="wordmark" aria-hidden="true">pepsoma</div>
    </footer>`;
  }

  function lineHTML(l) {
    return `<div class="line" data-key="${esc(l.key)}">
      <a class="line-img" href="#/product/${l.id}">${img(l.product, l.sizeObj.label)}</a>
      <div><a class="line-name" href="#/product/${l.id}">${esc(l.product.name)}</a>
        <span class="line-meta">${esc(l.sizeObj.label)} · ${esc(l.planObj.short)}${l.planObj.pct ? ` <b class="save">−${l.planObj.pct}%</b>` : ''}${l.free ? ` <b class="save">${l.free} free</b>` : ''}</span>
        <div class="qty sm"><button class="qty-btn" data-line-dec="${esc(l.key)}" aria-label="Decrease">${icon('minus')}</button><input class="qty-input" value="${l.qty}" data-line-qty="${esc(l.key)}" aria-label="Quantity" inputmode="numeric"><button class="qty-btn" data-line-inc="${esc(l.key)}" aria-label="Increase">${icon('plus')}</button></div></div>
      <div class="line-right"><button class="line-remove" data-line-remove="${esc(l.key)}" aria-label="Remove ${esc(l.product.name)}">${icon('trash')}</button>
        <span class="line-price">${l.compare || l.planObj.pct ? `<s>${money((l.compare || l.base) * l.qty)}</s>` : ''}${money(l.total)}</span></div>
    </div>`;
  }

  function drawer(t) {
    return `<div class="drawer-head"><h2>Your cart <span class="muted">(${t.count})</span></h2><button class="icon-btn" data-close-cart aria-label="Close cart">${icon('close')}</button></div>
      <div class="drawer-body">${t.count ? `${H.tierNote(t)}${t.lines.map(lineHTML).join('')}` : `<div class="empty-cart">${icon('cart')}<h3>Your cart is empty</h3><p class="muted">Browse research peptides with lot-matched COAs.</p><a class="btn btn-primary" href="#/shop">Shop peptides</a></div>`}</div>
      ${t.count ? `<div class="drawer-foot">${H.freeShip(t)}${H.totalsRows(t)}<a class="btn btn-primary btn-lg btn-block" href="#/checkout">Checkout · ${money(t.merch)}</a><a class="btn btn-ghost btn-block" href="#/cart">View cart</a></div>` : ''}`;
  }

  function summary(t, opts) {
    opts = opts || {};
    return `<div class="sum-card">
      <h2 class="h3">Order summary</h2>
      ${opts.shipping ? `<ul class="sum-items">${t.lines.map((l) => `<li><span class="sum-img">${img(l.product, l.sizeObj.label)}<b>${l.qty}</b></span><span class="sum-name">${esc(l.product.name)}<small>${esc(l.sizeObj.label)} · ${esc(l.planObj.short)}</small></span><span>${money(l.total)}</span></li>`).join('')}</ul>` : ''}
      ${H.promoForm(t)}
      ${H.totalsRows(t, opts)}
      ${opts.shipping ? '' : `<a class="btn btn-primary btn-lg btn-block mt" href="#/checkout">Secure checkout</a>`}
      <ul class="sum-trust">${checkItem('Lot-matched COA in every box')}${checkItem(`Ships same day before ${PS.company.cutoff}`)}${checkItem('Damaged or incorrect? Replaced free')}</ul>
    </div>`;
  }

  function pageHead(o) {
    return `<section class="page-head"><div class="container">${o.eyebrow ? `<span class="eyebrow rise" style="--i:0">${o.eyebrow}</span>` : ''}<h1 class="rise" style="--i:1">${o.title}</h1>${o.intro ? `<p class="lead rise" style="--i:2">${o.intro}</p>` : ''}</div></section>`;
  }

  const ageGate = () => `<div class="gate"><span class="logo">pepsoma</span><h2>Welcome to ${it('Pepsoma')}</h2>
    <p>This site offers research materials intended <strong>strictly for laboratory research use</strong> — not for human or animal consumption. You must be 21 or older to enter.</p>
    <div class="gate-actions"><button class="btn btn-primary btn-lg btn-block" data-age-accept>I am 21+ and agree</button><button class="btn btn-ghost btn-block" data-age-exit>I am under 21</button></div>
    <p class="small muted">By entering you agree to our <a href="#/policies/terms" data-age-accept>Terms</a> and <a href="#/policies/research-use" data-age-accept>Research Use Policy</a>.</p></div>`;
  const ageDenied = () => `<div class="gate"><span class="logo">pepsoma</span><h2>Sorry — you must be 21+</h2><p class="muted">Our products are available only to adults purchasing for laboratory research.</p></div>`;
  const cookieBanner = () => `<div class="cookie-banner" role="region" aria-label="Cookie consent"><strong>We use cookies</strong><p>Essential cookies keep your cart and checkout working. Optional analytics help us improve. See our <a href="#/policies/cookies">Cookie Policy</a>.</p><div class="btn-row"><button class="btn btn-primary btn-sm" data-cookie="all">Accept all</button><button class="btn btn-ghost btn-sm" data-cookie="essential">Essential only</button></div></div>`;

  /* ---------- pages ---------- */
  const views = {};

  views.home = () => {
    const hero = PS.getProduct('bpc-157');
    const stacks = PS.products.filter((p) => p.cat === 'stacks');
    const singlesAll = PS.products.filter((p) => !p.includes && !p.noCoa);
    const best = singlesAll.filter((p) => p.featured).concat(singlesAll.filter((p) => !p.featured)).slice(0, 8);
    const sampleLot = PS.lots(hero)[0];
    const singles = PS.products.filter((p) => !p.includes && !p.noCoa);
    const avgPurity = singles.reduce((s, p) => s + p.purity, 0) / singles.length;
    // the Browse row: every compound, twice over so the loop has no seam (the second copy is hidden from keyboards and screen readers)
    const chip = (p, i, copy) => `<a class="mchip" href="#/product/${p.id}" data-chip="${p.id}" style="--c:${p.accent};--o:${i * 47}deg"${copy ? ' tabindex="-1"' : ''}><b>${esc(p.name)}</b><span>${esc(catName(p.cat))}</span></a>`;
    const chips = (copy) => singlesAll.map((p, i) => chip(p, i, copy)).join('');
    return {
      html: `
      <section class="hero"><canvas class="hero-bg" data-herobg aria-hidden="true"></canvas><div class="container hero-grid">
        <div class="hero-copy">
          <h1><span class="line-mask" style="--i:1"><span>Research peptides,</span></span><span class="line-mask" style="--i:2"><span><span class="swap" data-swap>${['documented', 'verified', 'traceable'].map((w, i) => `<em class="${i ? '' : 'on'}">${w}</em>`).join('')}</span> to the lot.</span></span></h1>
          <p class="lead rise" style="--i:3">High-purity peptides for laboratory research. Third-party tested, traceable to the lot, dispatched within 24 hours.</p>
          <div class="btn-row rise" style="--i:4"><a class="btn btn-primary btn-lg" href="#/shop">SHOP PEPTIDES</a><a class="btn btn-yellow btn-lg" href="#/lab-tests"><em class="serif">View lab tests</em></a></div>
          <div class="hero-stats rise" style="--i:5">
            <div><strong data-count="${avgPurity.toFixed(1)}" data-dec="1" data-suffix="%">0%</strong><span>avg. HPLC purity</span></div>
            <div><strong>Every lot</strong><span>third-party tested</span></div>
            <div><strong data-count="24" data-suffix="h">0h</strong><span>dispatch</span></div>
          </div>
        </div>
        <div class="hero-art rise" style="--i:3">
          <div class="hero-glow"></div>
          <div class="hero-vials"><span class="hv hv1">${PS.vial(PS.getProduct('ghk-cu'), { theme: VT })}</span><span class="hv hv2">${PS.vial(hero, { theme: VT, size: '10 mg' })}</span><span class="hv hv3">${PS.vial(PS.getProduct('nad'), { theme: VT })}</span></div>
          <div class="float-chip fc2">${icon('truck')}<div><strong>Ships today</strong><small>Order by ${PS.company.cutoff}</small></div></div>
        </div>
      </div></section>

      <section class="chips-band" aria-label="Browse compounds" data-drift>
        <div class="marquee" style="--dur:${Math.round(singlesAll.length * 5.5)}s"><div class="marquee-track">${chips()}</div><div class="marquee-track" aria-hidden="true">${chips(true)}</div></div>
      </section>

      <section class="section"><div class="container">
        <div class="sec-head center reveal"><h2>Choose your ${it('research stack')}</h2><p class="lead muted">Complementary compounds, pre-kitted. Each vial ships with its own lot-matched COA.</p></div>
        <div class="stack-grid">${stacks.map((p, i) => {
          const s = p.sizes[0];
          return `<article class="stack-card reveal" style="--d:${i % 2}"><a href="#/product/${p.id}" class="stack-img">${img(p)}</a>
            <div class="stack-body"><div class="stack-top"><h3>${esc(p.name)}</h3><span class="pill-y">${esc(p.badge)}</span></div>
            <ul class="checks">${p.includes.map(([id, sz]) => checkItem(`${esc(PS.getProduct(id).name)} · ${PS.getSize(PS.getProduct(id), sz).label}`)).join('')}${checkItem('Lot-matched COA for each vial')}</ul>
            <div class="stack-foot"><div class="price">${money(s.price)} <s>${money(s.compare)}</s></div><a class="btn btn-primary btn-sm" href="#/product/${p.id}">Select stack</a></div></div></article>`;
        }).join('')}</div>
      </div></section>

      <section class="section"><div class="container">
        <div class="sec-head split-head reveal"><h2>Most-selling ${it('compounds')}</h2>
          <form data-form="search" role="search" class="shop-search home-search">${icon('search')}<input class="input" name="q" placeholder="Search compounds" aria-label="Search compounds"></form>
          <a class="btn btn-ghost" href="#/shop">View full catalog ${icon('arrow')}</a></div>
        <div class="pgrid" data-best>${best.map((p, i) => card(p, i)).join('')}</div>
      </div></section>

      <section class="testi" data-why="${PS.variant('why')}"><div class="container">
        <div class="why-head"><h2 class="reveal">Why ${it('Pepsoma')}</h2><p class="why-intro reveal">Four things we do for every lot, and say plainly.</p></div>
        <div class="testi-grid">${[
          ['doc', 'Lot-matched COAs', 'Each vial’s lot number matches a Certificate of Analysis, printed in the box and published online.'],
          ['shield', 'Third-party tested', 'Every lot goes to an independent ISO/IEC 17025-accredited laboratory before it’s listed.'],
          ['truck', '24-hour dispatch', `Orders placed before ${PS.company.cutoff} ship the same day, with tracking.`],
          ['flask', 'Research use only', 'Documented and sold for laboratory research, with a research-use confirmation at checkout.'],
        ].map(([ic, t, body], i) => `<div class="testi-card reveal" style="--d:${i}">${icon(ic)}<h3>${t}</h3><p>${body}</p></div>`).join('')}</div>
      </div></section>

      <section class="section section-cream"><div class="container">
        <h2 class="center reveal">Inside every ${it('Pepsoma')} order</h2>
        <div class="split reveal" style="margin-top:40px">
          <div class="split-art art-box"><div class="box-card"><div class="box-vials">${PS.productImage(PS.getProduct('stack-recovery'), { theme: VT })}</div><div class="mini-coa"><span>${icon('doc')} Certificate of Analysis</span><strong>${sampleLot.code}</strong><div class="mini-bar"><i style="width:${sampleLot.purity}%"></i></div><small>Purity ${sampleLot.purity}% · Identity conforms</small></div></div></div>
          <div class="split-copy"><h3 class="big">${it('Every shipment')} includes</h3>
            <ul class="checks lg">${checkItem('A printed, lot-matched Certificate of Analysis')}${checkItem(`Same-day dispatch before ${PS.company.cutoff}, with tracking`)}${checkItem('Tamper-evident seal, lot label and discreet packaging')}</ul>
            <a class="btn btn-primary btn-lg" href="#/shop">SHOP PEPTIDES</a></div>
        </div>
      </div></section>

      <section class="section"><div class="container split reverse">
        <div class="split-copy reveal"><h2 class="serif-h">How we ${it('test')}</h2>
          <p>Every lot is sent to an independent ISO/IEC 17025-accredited laboratory<sup>1</sup> before it’s listed. We publish the results, not a summary.</p>
          <p>Our release panel covers:</p>
          <ul class="checks">${checkItem('<strong>Purity</strong> by reverse-phase HPLC, release spec ≥98%')}${checkItem('<strong>Identity</strong> by mass spectrometry')}${checkItem('<strong>Endotoxin</strong> by LAL<sup>2</sup> and <strong>sterility</strong><sup>3</sup>')}${checkItem('<strong>Heavy metals</strong> by ICP-MS')}</ul>
          <button class="btn btn-primary" data-coa="${sampleLot.code}">VIEW A SAMPLE COA</button>
          <ol class="refs"><li>ISO/IEC 17025:2017 — General requirements for the competence of testing and calibration laboratories.</li><li>USP General Chapter ⟨85⟩ Bacterial Endotoxins Test.</li><li>USP General Chapter ⟨71⟩ Sterility Tests.</li></ol></div>
        <div class="split-art art-coa reveal"><div class="window" data-loop>
          <div class="win-bar"><i></i><i></i><i></i><span>pepsoma.com/lab-tests/${sampleLot.code}</span></div>
          <div class="win-body">
            <div class="win-head"><span>RP-HPLC · ${esc(hero.name)} · 220 nm</span><strong data-count="${sampleLot.purity}" data-dec="1" data-suffix="%" data-replay>0%</strong></div>
            ${PS.chromatogram(sampleLot)}
            <ul class="win-rows">${[['Identity · ESI-MS', 'Conforms'], ['Endotoxin · LAL', sampleLot.endotoxin + ' EU/mg'], ['Heavy metals · ICP-MS', '< 0.5 ppm'], ['Sterility · USP ⟨71⟩', 'No growth']].map(([a, b], i) => `<li style="--i:${i}"><span>${a} <small class="muted">· ${b}</small></span><b>PASS</b></li>`).join('')}</ul>
            <div class="win-status"><span class="live"></span>Live demo · replays while on screen</div>
          </div></div></div>
      </div></section>

      <section class="section section-soft"><div class="container">
        <h2 class="center reveal">A straightforward ${it('path')} to your lab</h2>
        <div class="steps">${PS.steps.map((s, i) => `<div class="step reveal" style="--d:${i}"><span class="step-ico">${icon(['search', 'shield', 'truck', 'doc'][i])}</span><span class="step-n">${s.n}</span><h3>${s.title}</h3><p>${s.body}</p></div>`).join('')}</div>
        <div class="center"><a class="btn btn-primary btn-lg" href="#/shop">START SHOPPING</a></div>
      </div></section>

      <section class="section"><div class="container faq-split">
        <h2 class="faq-title reveal">${it('Frequently')} Asked Questions</h2>
        <div class="reveal">${H.faq([{ items: PS.faqs.flatMap((g) => g.items).slice(0, 6) }])}<a class="link-arrow mt" href="#/faq">See all FAQs ${icon('arrow')}</a></div>
      </div></section>

      <section class="closer" data-observe><span class="bracket tl"></span><span class="bracket br"></span><div class="container">
        <h2>Traceable to the lot.</h2>
        <p>Third-party tested · COA in every box · 24-hour dispatch</p>
        <div class="btn-row" style="justify-content:center"><a class="btn btn-primary btn-lg" href="#/shop">SHOP PEPTIDES</a><a class="btn btn-ghost btn-lg" href="#/lab-tests">Browse COAs</a></div>
      </div></section>`,
    };
  };

  views.shop = ({ params, query }) => {
    const cat = params.cat || query.cat || '';
    const q = (query.q || '').toLowerCase();
    const sort = query.sort || 'featured';
    let list = PS.products.filter((p) => (!cat || p.cat === cat) && (!q || (p.name + ' ' + (p.full || '') + ' ' + p.summary + ' ' + catName(p.cat)).toLowerCase().includes(q)));
    if (sort === 'price-asc') list.sort((a, b) => PS.minPrice(a) - PS.minPrice(b));
    if (sort === 'price-desc') list.sort((a, b) => PS.minPrice(b) - PS.minPrice(a));
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'featured') list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    const c = PS.getCategory(cat);
    return {
      title: c ? c.name : 'Shop',
      html: `<section class="page-head"><div class="container"><span class="eyebrow rise" style="--i:0">Shop</span><h1 class="rise" style="--i:1">${c ? esc(c.name) : `Research ${it('peptides')}`}</h1><p class="lead rise" style="--i:2">${c ? esc(c.blurb) : 'Every compound independently tested, with the current lot’s purity and COA on every listing.'}</p></div></section>
      <section class="container section-sm">
        <div class="shop-bar">
          <div class="chips"><a class="chip ${!cat ? 'on' : ''}" href="#/shop">All</a>${PS.categories.map((x) => `<a class="chip ${x.id === cat ? 'on' : ''}" href="#/shop/${x.id}">${x.name}</a>`).join('')}</div>
          <div class="shop-tools"><form data-form="search" role="search" class="shop-search">${icon('search')}<input class="input" name="q" value="${esc(query.q || '')}" placeholder="Search compounds" aria-label="Search"></form>
          <label class="sr-only" for="sort">Sort</label><select id="sort" class="input" data-sort>${[['featured', 'Featured'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['name', 'Name A–Z']].map(([v, l]) => `<option value="${v}" ${v === sort ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        </div>
        <p class="muted small">${list.length} product${list.length === 1 ? '' : 's'}${q ? ` matching “${esc(query.q)}”` : ''}</p>
        ${list.length ? `<div class="pgrid">${list.map((p, i) => card(p, i)).join('')}</div>` : `<div class="card pad center"><h3>No matches</h3><p class="muted">Try a different search or browse all compounds.</p><a class="btn btn-primary" href="#/shop">View all</a></div>`}
      </section>`,
    };
  };

  views.product = ({ params }) => {
    const p = PS.getProduct(params.id);
    if (!p) return PS.defaultViews.notFound({ msg: 'We couldn’t find that product.' });
    const s = p.sizes[0];
    const lots = p.includes ? p.includes.flatMap(([id]) => PS.lots(PS.getProduct(id)).slice(0, 1)) : PS.lots(p);
    const lot = lots[0];
    const related = PS.products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    const included = p.includes
      ? p.includes.map(([id, sz]) => `${esc(PS.getProduct(id).name)} — ${PS.getSize(PS.getProduct(id), sz).label} vial`).concat(['Lot-matched COA for every vial'])
      : [`${esc(p.name)} — ${p.liquid ? 'sterile multi-use vial' : 'lyophilized vial'} (<span data-size-label>${s.label}</span>)`, p.noCoa ? 'Manufacturer specification sheet' : 'Printed, lot-matched Certificate of Analysis'];
    included.push('Tamper-evident seal & lot label', 'Discreet, protective packaging', 'Same-day dispatch before ' + PS.company.cutoff, 'Research support from our team');
    const plans = PS.config.plans;
    const lastWeeks = Math.max(0, Math.min(12, parseInt(PS.storage.get('customWeeks', 0), 10) || 0)); // the Custom period used last time
    const deal = dealText();
    const seqParts = (p.seq || '').split('-');
    const seq = seqParts.length > 2 && seqParts.every((x) => /^[A-Z][a-z]{2}$/.test(x)) ? seqParts : null;

    return {
      title: p.name,
      html: `<section class="container pdp">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <a href="#/shop/${p.cat}">${esc(catName(p.cat))}</a> / <span>${esc(p.name)}</span></nav>
        <div class="pdp-grid">
          <div class="gallery" data-tabs>
            <div class="thumbs" role="tablist">
              <button class="thumb active" data-tab="vial" role="tab" aria-selected="true" aria-label="Product">${img(p)}</button>
              ${lot ? `<button class="thumb" data-tab="coa" role="tab" aria-label="COA preview"><span class="thumb-ico">${icon('doc')}<small>COA</small></span></button>` : ''}
              <button class="thumb" data-tab="spec" role="tab" aria-label="Specifications"><span class="thumb-ico">${icon('beaker')}<small>Specs</small></span></button>
              <button class="thumb" data-tab="box" role="tab" aria-label="In the box"><span class="thumb-ico">${icon('box')}<small>Box</small></span></button>
            </div>
            <div class="stage rise" style="--i:1">
              <div class="stage-panel stage-vial" data-panel="vial" data-product-vial>${img(p)}</div>
              ${lot ? `<div class="stage-panel stage-coa" data-panel="coa" hidden><span class="eyebrow">Current lot</span><h3>${esc(lot.code)}</h3><div class="big-purity">${lot.purity}<small>%</small></div><p class="muted">HPLC purity · tested ${PS.date(lot.tested)}</p>${PS.chromatogram(lot)}<button class="btn btn-primary btn-sm" data-coa="${lot.code}">Open full COA</button></div>` : ''}
              <div class="stage-panel stage-spec" data-panel="spec" hidden>${seq ? `<div class="beads">${seq.map((a, i) => `<span style="--i:${i}">${esc(a)}</span>`).join('')}</div>` : ''}<dl class="mini-spec"><dt>Formula</dt><dd>${esc(p.formula || '—')}</dd><dt>Mol. weight</dt><dd>${p.mw ? p.mw + ' g/mol' : '—'}</dd><dt>CAS</dt><dd>${esc(p.cas || '—')}</dd></dl></div>
              <div class="stage-panel stage-box" data-panel="box" hidden><div class="box-card">${img(p)}<div class="mini-coa"><span>${icon('doc')} COA inserted</span><strong>${lot ? esc(lot.code) : 'Spec sheet'}</strong></div></div></div>
            </div>
          </div>

          <div class="buybox">
            ${p.badge ? `<span class="pill-y">${esc(p.badge)}</span>` : ''}
            <h1 class="pdp-title rise" style="--i:0">${it(esc(p.name))}</h1>
            <p class="pdp-sub rise" style="--i:1">${esc(p.full || '')}</p>
            <p class="pdp-summary rise" style="--i:2">${esc(p.summary)}</p>
            ${p.purity ? `<div class="pdp-meta"><span>${icon('shield')} ${p.purity}% purity (current lot)</span><span>${icon('flask')} Research use only</span></div>` : ''}
            <div class="included rise" style="--i:3"><h3>What’s included?</h3><ul class="checks">${included.map(checkItem).join('')}</ul></div>

            <form data-form="product" data-id="${p.id}" class="pform rise" style="--i:4">
              ${p.sizes.length > 1 ? `<h3 class="pform-h">Select size</h3><div class="size-row">${p.sizes.map((x, i) => `<label class="size-opt ${i ? '' : 'selected'}"><input type="radio" name="size" value="${x.id}" ${i ? '' : 'checked'}><span>${esc(x.label)}</span><small>${money(x.price)}</small></label>`).join('')}</div>` : `<input type="hidden" name="size" value="${s.id}">`}
              <h3 class="pform-h">Confirm your ${it('order type')}:</h3>
              <div class="plans">${plans.map((pl, i) => `<label class="plan-opt ${i ? '' : 'selected'}"><input type="radio" name="plan" value="${pl.id}" ${i ? '' : 'checked'}>
                <span class="plan-check">${icon('check')}</span>
                <span class="plan-body"><strong>${pl.id === 'once' ? 'ONE-TIME PURCHASE' : `STANDING ORDER · ${pl.short.toUpperCase()}`}</strong>
                <small>${pl.id === 'once' ? (PS.config.deal === 'bogo' ? 'Billed once · Buy 1 Get 1 free' : 'Billed once · volume savings apply') : `Billed <b data-plan-price="${pl.id}"></b> today, then every ${pl.custom ? `<input class="plan-weeks" name="weeks" type="number" min="1" max="12" value="${lastWeeks || 6}" inputmode="numeric" aria-label="Weeks between shipments"> weeks` : `${pl.weeks} weeks`}<br>Skip or cancel anytime`}</small>${pl.custom && lastWeeks ? `<small class="plan-last">Last time: every ${lastWeeks} week${lastWeeks > 1 ? 's' : ''}</small>` : ''}</span>
                <span class="plan-price">${pl.pct ? `<span class="pill-y">Save ${pl.pct}%</span>` : ''}<s data-plan-compare="${pl.id}"></s><b data-plan-price="${pl.id}"></b></span></label>`).join('')}</div>
              ${deal && !(PS.config.deal === 'bogo' && p.includes) ? `<p class="deal-line"><span class="yc">${icon('check')}</span><span><strong>${deal[0]}:</strong> ${deal[1]}. Applied automatically to one-time orders.</span></p>` : ''}
              <div class="buy-row">${H.qty(1)}<button class="btn btn-primary btn-lg buy-btn" type="submit">ADD TO CART · <span data-line-price></span></button></div>
            </form>
            <div class="info-box"><span class="info-i">i</span><div><strong>Research use attestation at checkout</strong><p>Checkout asks you to confirm you’re 21+ and purchasing for lawful in-vitro research. Orders ship within 24 hours. Damaged or incorrect? We replace it free.</p></div></div>
          </div>
        </div>
      </section>

      <section class="section section-cream"><div class="container split">
        <div class="split-copy"><h2 class="serif-h">About ${it(esc(p.name))}</h2><p>${esc(p.summary)}</p>
          <p>Published literature describes ${esc(p.name)} in the following research contexts:</p>
          <ul class="checks">${p.research.map(checkItem).join('')}</ul>
          <p class="small muted"><em>Descriptions refer to preclinical and in-vitro research. Not for human or veterinary use.</em></p></div>
        <div class="card pad spec-card"><h3>Specifications</h3>${p.includes ? `<ul class="checks">${p.includes.map(([id, sz]) => checkItem(`<a href="#/product/${id}">${esc(PS.getProduct(id).name)}</a> · ${PS.getSize(PS.getProduct(id), sz).label}`)).join('')}</ul>` : H.specTable(p)}</div>
      </div></section>

      ${lots.length ? `<section class="section"><div class="container"><div class="sec-head split-head"><h2>Lab tests for ${it('this product')}</h2><a class="btn btn-ghost" href="#/lab-tests">All lab tests ${icon('arrow')}</a></div>${H.lotTable(lots)}</div></section>` : ''}

      ${related.length ? `<section class="section section-lav"><div class="container"><h2 class="reveal">You may also ${it('research')}</h2><div class="pgrid">${related.map((p, i) => card(p, i)).join('')}</div></div></section>` : ''}`,
    };
  };

  views.cart = () => {
    const t = PS.cart.totals();
    return {
      title: 'Cart',
      html: `${pageHead({ eyebrow: 'Cart', title: `Your ${it('cart')}` })}
      <section class="container section-sm">${t.count ? `<div class="cart-grid">
        <div class="card pad">${H.freeShip(t)}${H.tierNote(t)}${t.lines.map(lineHTML).join('')}<a class="link-arrow mt" href="#/shop">${icon('arrow')} Continue shopping</a></div>
        <aside class="sticky">${summary(t)}</aside></div>`
        : `<div class="card pad empty-cart">${icon('cart')}<h2>Your cart is empty</h2><p class="muted">Explore research peptides — every lot independently tested.</p><a class="btn btn-primary btn-lg" href="#/shop">Shop peptides</a></div>`}</section>`,
    };
  };

  views.checkout = () => {
    const t = PS.cart.totals();
    if (!t.count) return views.cart();
    return {
      title: 'Checkout',
      html: `${pageHead({ eyebrow: 'Secure checkout', title: '<span class="thin">Almost there</span>' })}
      <section class="container section-sm"><div class="checkout-grid">
        <div class="card pad">${H.checkoutForm(PS.auth.current(), t)}</div>
        <aside class="sticky" data-summary>${summary(t, { shipping: true })}</aside>
      </div></section>`,
    };
  };

  views.about = () => ({
    title: 'About',
    html: `<section class="page-head"><div class="container"><span class="eyebrow rise" style="--i:0">About Pepsoma</span><h1 class="rise" style="--i:1">Science first. ${it('Documented')} always.</h1><p class="lead rise" style="--i:2">We started Pepsoma because researchers deserve suppliers who show their work — every lot, every test, every time.</p></div></section>
    <section class="section-sm container"><div class="split">
      <div class="split-art art-box"><div class="box-card">${PS.productImage(PS.getProduct('stack-longevity'), { theme: VT })}</div></div>
      <div class="split-copy"><h2 class="serif-h">Our ${it('standard')}</h2><p>Pepsoma supplies research peptides to universities, biotech R&amp;D teams, CROs and independent researchers across the United States.</p>
        <ul class="checks lg">${checkItem('<strong>Independent testing.</strong> Every lot, every time, by ISO/IEC 17025-accredited labs.')}${checkItem('<strong>Radical transparency.</strong> Full COAs published online and printed in every box.')}${checkItem('<strong>Research-only integrity.</strong> We sell to researchers, screen orders, and never make health claims.')}</ul>
        <div class="btn-row"><a class="btn btn-primary" href="#/lab-tests">See our lab tests</a><a class="btn btn-ghost" href="#/contact">Talk to our team</a></div></div>
    </div></section>
    <section class="section section-soft"><div class="container"><div class="values">${[['99%+', 'average HPLC purity across current lots'], ['24h', 'dispatch on orders before 2 PM ET'], ['100%', 'of lots independently tested'], ['US', 'based operations & fulfillment']].map(([a, b]) => `<div class="value reveal"><strong>${a}</strong><span>${b}</span></div>`).join('')}</div></div></section>`,
  });

  /* ---------- theme: follows the device, toggle overrides ---------- */
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const darkMq = matchMedia('(prefers-color-scheme: dark)');
  const getMode = () => PS.storage.get('mode', 'auto');
  function syncModeUI() {
    const m = getMode();
    const effective = m === 'auto' ? (darkMq.matches ? 'dark' : 'light') : m;
    const label = m === 'auto' ? `Theme: match device (${effective})` : modeLabel[m];
    PS.$$('[data-mode-cycle]').forEach((b) => { b.dataset.mode = m; b.setAttribute('aria-label', label); const tip = b.querySelector('.theme-tip'); if (tip) tip.textContent = label; });
    PS.$$('[data-mode-set]').forEach((b) => { const on = b.dataset.modeSet === m; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = effective === 'dark' ? '#0b1026' : '#ffffff';
  }
  function applyMode(m, fromEl) {
    PS.storage.set('mode', m);
    const root = document.documentElement;
    const commit = () => { if (m === 'auto') root.removeAttribute('data-theme'); else root.dataset.theme = m; syncModeUI(); };
    if (fromEl && document.startViewTransition && !reduced()) {
      const r = fromEl.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const t = document.startViewTransition(commit);
      t.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] }, { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
    } else {
      root.classList.add('theme-anim');
      commit();
      setTimeout(() => root.classList.remove('theme-anim'), 500);
    }
  }
  darkMq.addEventListener('change', syncModeUI);
  document.addEventListener('click', (e) => {
    // stack cards open their page from anywhere on the card; links and buttons inside keep their own action
    const stack = e.target.closest('.stack-card');
    if (stack && !e.target.closest('a, button')) { PS.go(stack.querySelector('.stack-img').getAttribute('href')); return; }
    // product cards: a size button picks that size (the picture and the button follow); a click anywhere else on the card, or on Select, opens the product
    const pcard = e.target.closest('.pcard');
    if (pcard) {
      const chip = e.target.closest('[data-card-size]');
      const act = e.target.closest('[data-card-act]');
      if (chip) { pickCardSize(pcard, chip); return; }
      if ((act && !act.dataset.add) || !e.target.closest('a, button')) { PS.go(pcard.querySelector('.pcard-name a').getAttribute('href')); return; }
    }
    const cyc = e.target.closest('[data-mode-cycle]');
    if (cyc) { const order = ['auto', 'light', 'dark']; applyMode(order[(order.indexOf(getMode()) + 1) % 3], cyc); return; }
    const set = e.target.closest('[data-mode-set]');
    if (set) applyMode(set.dataset.modeSet, set);
    // dropdowns open on hover or focus, so a click on an item shuts its menu
    if (e.target.closest('.dd a, .dd button')) shutMenus();
    // Browse row: a compound that has a card in Most-selling compounds scrolls to it and lights it up; any other opens its page
    const chip = e.target.closest('[data-chip]');
    if (chip) {
      const card = document.querySelector(`[data-best] .pcard[data-id="${chip.dataset.chip}"]`);
      if (card) { e.preventDefault(); spotlight(card); }
    }
  });
  // scroll the card to just under the header, then (once the scrolling has stopped) give it a green glow that fades
  function spotlight(card) {
    if (!card.classList.contains('in')) { // its scroll reveal hasn't run: show it now, without the slide, so the scroll aims at where it really sits
      card.style.transition = 'none';
      card.classList.add('in');
      void card.offsetWidth;
      card.style.transition = '';
    }
    card.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    let y = -1, still = 0, frames = 0;
    const wait = () => {
      still = Math.abs(scrollY - y) < 1 ? still + 1 : 0;
      y = scrollY;
      if (still < 6 && ++frames < 240) { requestAnimationFrame(wait); return; }
      card.classList.remove('glow'); void card.offsetWidth; card.classList.add('glow');
      clearTimeout(card._glow);
      card._glow = setTimeout(() => card.classList.remove('glow'), 2200);
      card.querySelector('.pcard-name a').focus({ preventScroll: true }); // keyboard users carry on from the card
    };
    requestAnimationFrame(wait);
  }
  // a menu shut this way stays shut until the pointer leaves it, then opens on hover again
  function shutMenus() {
    document.querySelectorAll('.dd-wrap, .track-wrap').forEach((w) => { if (w.matches(':hover')) w.classList.add('shut'); });
    const a = document.activeElement;
    if (a && a.closest('.dd-wrap, .track-wrap')) a.blur();
  }
  document.addEventListener('pointerout', (e) => {
    const w = e.target.closest && e.target.closest('.shut');
    if (w && !w.contains(e.relatedTarget)) w.classList.remove('shut');
  });
  addEventListener('hashchange', shutMenus);

  /* ---------- motion ---------- */
  // sliding pill behind the nav link you're pointing at
  function movePill(link) {
    const nav = document.querySelector('.main-nav'), pill = nav && nav.querySelector('.nav-pill');
    if (!pill) return;
    if (!link) { pill.style.opacity = 0; return; }
    const nr = nav.getBoundingClientRect(), lr = link.getBoundingClientRect();
    pill.style.left = lr.left - nr.left + 'px';
    pill.style.width = lr.width + 'px';
    pill.style.opacity = 1;
  }
  document.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    const link = e.target.closest('.main-nav > .nav-link, .main-nav > .dd-wrap > .nav-link');
    if (link) movePill(link);
  });
  document.addEventListener('pointerout', (e) => {
    const nav = e.target.closest && e.target.closest('.main-nav');
    if (nav && !nav.contains(e.relatedTarget)) movePill(null);
  });

  // header lifts into a floating rounded bar once you scroll
  addEventListener('scroll', () => { const h = document.querySelector('.site-header'); if (h) h.classList.toggle('scrolled', scrollY > 8); }, { passive: true });

  // headline word swap
  setInterval(() => {
    const box = document.querySelector('[data-swap]');
    if (!box || reduced() || document.hidden) return;
    const words = Array.from(box.children), cur = words.findIndex((w) => w.classList.contains('on'));
    const next = (cur + 1) % words.length;
    words[cur].classList.remove('on'); words[cur].classList.add('out');
    setTimeout(() => words[cur].classList.remove('out'), 600);
    words[next].classList.add('on');
  }, 2600);

  // hero background, faint and behind the headline: DNA double helices, one at a time. Five run from the bottom left corner to the top right (the middle
  // one first, then one a step above it, one below, two above, two below); each draws in, leaves the screen at the far corner and loses its tail along
  // the path, so none stays. Then the same five run from the top left to the bottom right, and it starts over. It pauses when the hero is off-screen
  // or the tab is hidden.
  function startHeroBg(cv) {
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const TAU = Math.PI * 2;
    const DRAW = 3400, ERASE = 3000, EACH = DRAW + ERASE + 200; // ms a strand takes to draw in, to lose its tail, and with a short rest after
    const SLOTS = [0, -1, 1, -2, 2]; // steps from the middle line, negative above it
    let w = 0, h = 0, color = '', raf = 0, last = 0, onScreen = true, t0 = 0, el = 0, n = 0;
    const size = () => {
      if (!cv.isConnected) { removeEventListener('resize', size); return; }
      const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(reduced() ? DRAW : el);
    };
    const ease = (x) => x * x * (3 - 2 * x);
    // the strand playing at time t: which diagonal (0 bottom left to top right, 1 top left to bottom right), its slot, and how far its head and tail have got along the path (0 to 1)
    const strand = (t) => {
      const k = Math.floor(t / EACH) % 10, l = t % EACH;
      return { diag: k < 5 ? 0 : 1, slot: SLOTS[k % 5], head: ease(Math.min(1, l / DRAW)), tail: ease(Math.max(0, Math.min(1, (l - DRAW) / ERASE))) };
    };
    const helix = (t) => {
      const { diag, slot, head, tail } = strand(t);
      const amp = Math.max(30, Math.min(56, h * 0.09)), lam = 150, pad = amp * 3.5, turn = reduced() ? 0 : t / 2600;
      const a = diag ? [-0.04 * w, 0.12 * h] : [-0.04 * w, 0.88 * h], b = diag ? [1.04 * w, 0.88 * h] : [1.04 * w, 0.12 * h];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len, nx = -uy, ny = ux;
      // the path starts and ends well outside the hero, shifted sideways by its slot
      const ax = a[0] - ux * pad + nx * slot * amp * 2.4, ay = a[1] - uy * pad + ny * slot * amp * 2.4, L = len + 2 * pad, s0 = tail * L, s1 = head * L;
      const at = (s, off) => { const th = s / lam * TAU + turn + off; return [ax + ux * s + nx * amp * Math.sin(th), ay + uy * s + ny * amp * Math.sin(th), Math.cos(th)]; };
      const seen = (p) => p[0] > -40 && p[0] < w + 40 && p[1] > -40 && p[1] < h + 40;
      ctx.fillStyle = ctx.strokeStyle = color; ctx.lineCap = 'round';
      for (let s = s0; s < s1; s += 6) {
        const f = Math.min(1, (s - s0) / 160); // the tail thins out
        for (let o = 0; o < 2; o++) {
          const p = at(s, o * Math.PI), q = at(Math.min(s1, s + 6), o * Math.PI), d = (p[2] + 1) / 2;
          if (!seen(p) && !seen(q)) continue;
          ctx.globalAlpha = f * (0.1 + 0.2 * d); ctx.lineWidth = 1 + 1.2 * d;
          ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
        }
      }
      ctx.lineWidth = 1;
      for (let s = Math.ceil(s0 / (lam / 10)) * (lam / 10); s < s1; s += lam / 10) {
        const p = at(s, 0), q = at(s, Math.PI), f = Math.min(1, (s - s0) / 160);
        if (!seen(p) && !seen(q)) continue;
        ctx.globalAlpha = f * 0.12 * Math.abs(Math.sin(s / lam * TAU + turn));
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
        ctx.globalAlpha = f * 0.3;
        [p, q].forEach((e) => { ctx.beginPath(); ctx.arc(e[0], e[1], 2.2, 0, TAU); ctx.fill(); });
      }
    };
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      helix(t);
      ctx.globalAlpha = 1;
    }
    color = getComputedStyle(cv).color; size();
    if (reduced()) return;
    const tick = (now) => {
      raf = 0;
      if (!cv.isConnected || !onScreen || document.hidden) return;
      raf = requestAnimationFrame(tick);
      if (now - last < 33) return; // 30 frames a second is plenty for something this slow
      if (!t0) t0 = now;
      last = now;
      el = now - t0;
      if (++n % 30 === 0) color = getComputedStyle(cv).color; // follows light/dark switches
      draw(el);
    };
    const wake = () => {
      if (!cv.isConnected) { document.removeEventListener('visibilitychange', wake); if (obs) obs.disconnect(); return; }
      if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const obs = 'IntersectionObserver' in window ? new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; wake(); }) : null;
    if (obs) obs.observe(cv);
    document.addEventListener('visibilitychange', wake);
    addEventListener('resize', size);
    wake();
  }

  // count-up numbers
  function countUp(el) {
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
    if (reduced()) { el.textContent = to.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => { const k = Math.min(1, (t - t0) / dur), e2 = 1 - Math.pow(1 - k, 4); el.textContent = (to * e2).toFixed(dec) + suf; if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  // observers: count-ups, bracket closers and looping live windows
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => entries.forEach((en) => {
    const el = en.target;
    if (el.matches('[data-count]')) { if (en.isIntersecting && !el.dataset.done) { el.dataset.done = 1; countUp(el); } return; }
    if (el.matches('[data-observe]')) { if (en.isIntersecting) el.classList.add('in'); return; }
    if (el.matches('[data-drift]')) { el.classList.toggle('off', !en.isIntersecting); return; } // the Browse row stands still while off-screen
    if (el.matches('[data-loop]')) {
      clearInterval(el._loop);
      if (!en.isIntersecting) return;
      const play = () => { el.classList.remove('play'); void el.offsetWidth; el.classList.add('play'); const n = el.querySelector('[data-replay]'); if (n) countUp(n); };
      play();
      if (!reduced()) el._loop = setInterval(play, 7000);
    }
  }), { threshold: 0.3 }) : null;

  // fly-to-cart: a yellow dot arcs from the button into the cart, kept inside the window all the way
  PS.on('added', ({ el }) => {
    const cart = document.querySelector('.cart-btn');
    if (!el || !cart) return;
    const a = el.getBoundingClientRect(), b = cart.getBoundingClientRect();
    const bump = () => { cart.classList.remove('bump'); void cart.offsetWidth; cart.classList.add('bump'); };
    if (reduced() || !document.body.animate) { bump(); return; }
    const dot = document.createElement('div');
    dot.className = 'fly';
    dot.innerHTML = icon('flask');
    document.body.appendChild(dot);
    // the dot is 44px wide: keep its centre 28px in from every edge. A quadratic curve stays inside its control points, so clamping those is enough.
    const fit = (v, max) => Math.min(max - 28, Math.max(28, v));
    const x0 = fit(a.left + a.width / 2, innerWidth), y0 = fit(a.top + a.height / 2, innerHeight);
    const x1 = fit(b.left + b.width / 2, innerWidth), y1 = fit(b.top + b.height / 2, innerHeight);
    // a flat arc: the middle bows away from the straight line by a fifth of the distance (at most 70px), upward, or toward the middle of the screen on a steep path
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, lift = Math.min(70, Math.max(24, Math.hypot(x1 - x0, y1 - y0) * 0.2));
    let nx = y0 - y1, ny = x1 - x0;
    const len = Math.hypot(nx, ny) || 1;
    nx /= len; ny /= len;
    if (Math.abs(ny) > 0.3 ? ny > 0 : (nx > 0) === (mx > innerWidth / 2)) { nx = -nx; ny = -ny; }
    const bow = (k) => [fit(mx + k * nx * lift, innerWidth), fit(my + k * ny * lift, innerHeight)];
    let [cx, cy] = bow(1);
    if (Math.hypot(cx - mx, cy - my) < lift * 0.6) [cx, cy] = bow(-1); // no room that way: bow the other way
    const steps = 14;
    dot.animate(Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps, u = 1 - t;
      return {
        transform: `translate(${u * u * x0 + 2 * u * t * cx + t * t * x1}px, ${u * u * y0 + 2 * u * t * cy + t * t * y1}px) scale(${t < 0.15 ? 0.4 + t * 4 : 1 - (t - 0.15) * 0.8})`,
        opacity: i === 0 ? 0 : i === steps ? 0.6 : 1,
      };
    }), { duration: 650, easing: 'cubic-bezier(.45,0,.25,1)' }).onfinish = () => { dot.remove(); bump(); };
    dot.style.left = '0px'; dot.style.top = '0px';
  });

  // Home's offer card: the deal fades in mid-screen once the visitor has scrolled to Most-selling compounds AND 10 seconds have passed since the page loaded,
  // whichever comes last (once per browser session, not while the deal is off)
  const OFFER = 'pepsoma.offerSeen', OFFER_AFTER = 10000;
  let offerIO = null, offerTimer = 0;
  function offerStop() {
    clearTimeout(offerTimer);
    if (offerIO) offerIO.disconnect();
    offerIO = null;
    document.querySelectorAll('.offer-card').forEach((c) => c.remove());
  }
  function offerWatch(main) {
    offerStop();
    const deal = dealText(), grid = main.querySelector('[data-best]');
    let seen = false;
    try { seen = !!sessionStorage.getItem(OFFER); } catch (e) { /* blocked storage: shows once per page load */ }
    if (!deal || seen || !grid || !('IntersectionObserver' in window)) return;
    const show = () => {
      // wait while the age gate, the cart or the opening is up
      if (document.querySelector('#ps-modal:not([hidden]), #cart-drawer:not([hidden]), .opening-cover')) { offerTimer = setTimeout(show, 1500); return; }
      try { sessionStorage.setItem(OFFER, '1'); } catch (e) { /* ignore */ }
      offerStop();
      const big = PS.config.deal === 'bogo' ? ['', '1+1', 'free vial'] : ['up to', Math.max(...PS.config.tiers.map((t) => t.pct)) + '%', 'off'];
      document.body.insertAdjacentHTML('beforeend', `<aside class="offer-card" role="complementary" aria-label="Offer"><button class="offer-x" type="button" data-offer-close aria-label="Close offer">${icon('close')}</button>
        <div class="offer-badge" aria-hidden="true">${big[0] ? `<small>${big[0]}</small>` : ''}<strong>${big[1]}</strong><small>${big[2]}</small></div>
        <div><span class="eyebrow">Auto-applied</span><h3>${deal[0]}</h3><p>${deal[1]}</p><a class="btn btn-primary" href="#/shop">Shop peptides ${icon('arrow')}</a></div></aside>`);
      const card = document.querySelector('.offer-card');
      void card.offsetWidth;
      card.classList.add('in');
    };
    // the grid's top has come up into the screen: now it is only a matter of the 10 seconds (performance.now() counts from the page load)
    offerIO = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      offerIO.disconnect();
      offerTimer = setTimeout(show, Math.max(0, OFFER_AFTER - performance.now()));
    }, { rootMargin: '0px 0px -20% 0px' });
    offerIO.observe(grid);
  }
  document.addEventListener('click', (e) => {
    const x = e.target.closest('[data-offer-close], .offer-card a');
    if (!x) return;
    const card = x.closest('.offer-card');
    card.classList.remove('in');
    setTimeout(() => card.remove(), 600);
  });

  // added-to-cart notice, at the top of the screen under the header. The first time in this browser its button reads "Show cart"; after that
  // it is the header's cart icon with a > tip. Either opens the cart.
  const NOTICE = 'cartNoticeSeen';
  const chevR = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  let noticeTimer = 0;
  function noticeHide(n) {
    clearTimeout(noticeTimer);
    n.classList.remove('in');
    setTimeout(() => n.remove(), 300);
  }
  PS.on('added', ({ id }) => {
    const p = PS.getProduct(id);
    if (!p) return;
    const first = !PS.storage.get(NOTICE, false);
    PS.storage.set(NOTICE, true);
    document.querySelectorAll('.added-notice').forEach((n) => n.remove());
    document.body.insertAdjacentHTML('beforeend', `<div class="added-notice" role="status">${icon('check')}<span>${esc(p.name)} added to cart</span><button type="button" class="notice-btn" data-open-cart data-notice-go${first ? '' : ' aria-label="Show cart"'}>${first ? 'Show cart' : icon('cart') + chevR}</button></div>`);
    const n = document.querySelector('.added-notice');
    void n.offsetWidth;
    n.classList.add('in');
    const tick = () => { if (n.matches(':hover, :focus-within')) noticeTimer = setTimeout(tick, 1500); else noticeHide(n); }; // stays while the pointer or keyboard is on it
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(tick, 5000);
  });
  document.addEventListener('click', (e) => {
    const go = e.target.closest('[data-notice-go]');
    if (go) noticeHide(go.closest('.added-notice'));
  });

  // runs after every page render
  // mode: 'soft' = the same page redrawn (nothing re-enters), 'vt' = a page change the browser is cross-fading, 'enter' = the page-enter fade
  function afterRender(route, main, mode) {
    const soft = mode === 'soft';
    if (!soft) { main.classList.remove('entered', 'page-enter'); void main.offsetWidth; }
    main.classList.add('entered');
    if (mode === 'enter') main.classList.add('page-enter');
    if (soft) main.querySelectorAll('[data-count]').forEach((el) => { el.dataset.done = 1; el.textContent = (+el.dataset.count).toFixed(+(el.dataset.dec || 0)) + (el.dataset.suffix || ''); });
    if (io) main.querySelectorAll(soft ? '[data-observe], [data-loop], [data-drift]' : '[data-count]:not([data-replay]), [data-observe], [data-loop], [data-drift]').forEach((el) => io.observe(el));
    else if (!soft) main.querySelectorAll('[data-count]').forEach(countUp);
    PS.$$('.theme-btn, .seg').length && syncModeUI();
    if (!(window.CSS && CSS.registerProperty)) main.querySelectorAll('[data-drift]').forEach((el) => el.classList.add('static-ring')); // no animated ring: the faint static one stays
    const bg = main.querySelector('[data-herobg]');
    if (bg) startHeroBg(bg);
    movePill(null);
    if (!soft) { offerStop(); if (route.name === 'home') offerWatch(main); }
  }

  // keep the toggle labels right after the header re-renders (sign in / out)
  PS.on('auth', () => setTimeout(syncModeUI));

  PS.boot({ name: 'a', vialTheme: VT, header, footer, drawer, summary, pageHead, ageGate, ageDenied, cookieBanner, views, afterRender });
  syncModeUI();

  // opening, the first time the site is opened in this browser (index.html sets html.opening): the mark traces itself, then its middle opens
  // and you fly through onto the page while the page's own entrance replays behind it. A tap skips ahead.
  // The mark inside is a DNA double helix, tilted 45 degrees. Review mode's Replay button plays it again through PS.replayOpening.
  const openingMark = () => {
    const strand = (ph) => 'M' + Array.from({ length: 19 }, (_, i) => `${(500 + 8 * Math.sin(i / 12 * Math.PI * 2 + ph)).toFixed(1)} ${484 + i * 2}`).join('L');
    return `<g class="oc-p"><g class="oc-tilt" transform="rotate(45 500 502)"><path d="${strand(0)}" stroke-width="2"/><path d="${strand(Math.PI)}" stroke-width="2"/>${[487, 490, 493, 499, 502, 505, 511, 514, 517].map((y) => { const d = 8 * Math.sin((y - 484) / 24 * Math.PI * 2); return `<path d="M${500 - d} ${y}H${500 + d}" stroke-width="1.2"/>`; }).join('')}</g></g>`;
  };
  function playOpening() {
    const root = document.documentElement;
    document.querySelectorAll('.opening-cover').forEach((c) => c.remove());
    const cover = document.createElement('div');
    cover.className = 'opening-cover';
    cover.setAttribute('aria-hidden', 'true');
    cover.innerHTML = `<svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
      <defs><mask id="oc-mask"><rect width="1000" height="1000" fill="#fff"/><g class="oc-hole"><rect x="468" y="468" width="64" height="64" rx="16" fill="#000"/></g></mask></defs>
      <rect class="oc-bg" width="1000" height="1000" mask="url(#oc-mask)"/>
      <g class="oc-mark"><rect class="oc-fill" x="468" y="468" width="64" height="64" rx="16"/>
        <path class="oc-line" pathLength="100" d="M500 532H516A16 16 0 0 0 532 516V484A16 16 0 0 0 516 468H500"/>
        <path class="oc-line" pathLength="100" d="M500 532H484A16 16 0 0 1 468 516V484A16 16 0 0 1 484 468H500"/>
        ${openingMark()}</g>
    </svg><div class="oc-word"><span class="oc-kicker">Research-grade peptides</span><span class="logo">pep<i>soma</i></span></div>`;
    document.body.appendChild(cover);
    root.classList.remove('opening');
    root.style.overflow = 'hidden';
    void cover.offsetWidth;
    cover.classList.add('play');
    const open = () => {
      if (cover.classList.contains('zoom')) return;
      clearTimeout(wait);
      cover.classList.add('zoom');
      setTimeout(() => {
        const main = document.getElementById('view');
        main.classList.remove('entered', 'page-enter');
        void main.offsetWidth;
        main.classList.add('entered', 'page-enter');
        main.querySelectorAll('[data-count][data-done]').forEach(countUp);
      }, 150);
      setTimeout(() => { cover.remove(); root.style.overflow = ''; }, 1250);
    };
    const wait = setTimeout(open, 3000);
    cover.addEventListener('click', open);
  }
  PS.replayOpening = playOpening;
  if (document.documentElement.classList.contains('opening')) {
    try { localStorage.setItem('pepsoma.opened', '1'); } catch (e) { /* ignore */ }
    playOpening();
  }
})();
