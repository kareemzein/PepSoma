/* Pepsoma — Version A “Clinical”: cream, lavender and deep purple, serif-italic accents,
   plan-selector product pages. Layout language adapted from modern wellness storefronts. */
(function () {
  const PS = window.PS;
  const esc = PS.esc, icon = PS.icon, money = PS.money, H = PS.html;
  const VT = 'light';
  const img = (p, size) => PS.productImage(p, { theme: VT, size });
  const catName = (id) => (PS.getCategory(id) || {}).name || '';
  const it = (s) => `<em class="serif">${s}</em>`; // serif italic accent
  const checkItem = (s) => `<li><span class="yc">${icon('check')}</span><span>${s}</span></li>`;

  /* ---------- product card ---------- */
  function card(p) {
    const s = p.sizes[0];
    const multi = p.sizes.length > 1;
    return `<article class="pcard reveal">
      <a class="pcard-img" href="#/product/${p.id}" aria-label="${esc(p.name)}">${p.badge ? `<span class="pill-y">${esc(p.badge)}</span>` : ''}${img(p)}</a>
      <div class="pcard-body">
        <span class="pcard-cat">${esc(catName(p.cat))}</span>
        <h3 class="pcard-name"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
        <p class="pcard-full">${esc(p.full || p.summary)}</p>
        <div class="pcard-sizes">${p.sizes.map((x) => `<span>${esc(x.label)}</span>`).join('')}</div>
        <div class="pcard-foot">
          <div class="price">${multi ? '<small>From</small> ' : ''}${money(s.price)} ${s.compare ? `<s>${money(s.compare)}</s>` : ''}</div>
          ${multi ? `<a class="btn btn-primary btn-sm" href="#/product/${p.id}">Select</a>` : `<button class="btn btn-primary btn-sm" data-add="${p.id}" data-size="${s.id}">Add to cart</button>`}
        </div>
      </div>
    </article>`;
  }

  /* ---------- shell ---------- */
  function header() {
    const u = PS.auth.current();
    const cats = PS.categories.filter((c) => c.id !== 'stacks');
    const stacks = PS.products.filter((p) => p.cat === 'stacks');
    return `<div class="announce">Questions about your order? Email <a href="mailto:${PS.company.email}">${PS.company.email}</a><span class="hide-sm"> · Free shipping on orders ${PS.money0(PS.config.freeShip)}+</span></div>
    <header class="site-header"><div class="container hdr">
      <a class="logo" href="#/" aria-label="Pepsoma home">pepsoma</a>
      <nav class="main-nav" aria-label="Main">
        <form class="nav-search show-sm" data-form="search" role="search"><input class="input" name="q" placeholder="Search peptides" aria-label="Search peptides"></form>
        <div class="nav-item dd-wrap"><a href="#/shop" data-nav="shop" class="nav-link">Shop Peptides ${icon('chev')}</a>
          <div class="dd"><a href="#/shop">All peptides</a>${cats.map((c) => `<a href="#/shop/${c.id}">${c.name}</a>`).join('')}</div></div>
        <div class="nav-item dd-wrap"><a href="#/shop/stacks" class="nav-link">Research Stacks ${icon('chev')}</a>
          <div class="dd">${stacks.map((p) => `<a href="#/product/${p.id}">${esc(p.name)}</a>`).join('')}</div></div>
        <div class="nav-item dd-wrap"><a href="#/lab-tests" data-nav="lab-tests" class="nav-link">Resources ${icon('chev')}</a>
          <div class="dd"><a href="#/lab-tests">Lab Tests &amp; COAs</a><a href="#/faq">FAQ</a><a href="#/track">Track Order</a><a href="#/wholesale">Wholesale</a><a href="#/policies">Policies</a></div></div>
        <a href="#/about" data-nav="about" class="nav-link">About Us</a>
        <a href="#/contact" data-nav="contact" class="nav-link">Contact Us</a>
        <a href="#/account" class="nav-link show-sm">${u ? 'My account' : 'Sign in'}</a>
      </nav>
      <div class="hdr-actions">
        <a class="btn btn-primary btn-pill hide-sm" href="#/account">${u ? 'Hi, ' + esc(u.name.split(' ')[0]) : 'Account Login'}</a>
        <a class="btn btn-yellow hide-md" href="#/shop"><em class="serif">Explore Peptides</em></a>
        <button class="cart-btn" data-open-cart aria-label="Open cart">${icon('cart')}<span class="cart-count" data-cart-count>0</span></button>
        <button class="nav-toggle" data-nav-toggle aria-label="Menu" aria-expanded="false">${icon('menu')}</button>
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
          <div class="f-brand"><a class="logo" href="#/">pepsoma</a><p>Research-grade peptides, independently tested and documented to the lot — shipped to your lab within 24 hours.</p>
            <div class="f-badges"><span>${icon('shield')} Third-party tested</span><span>${icon('doc')} COA every lot</span></div></div>
          ${col('Shop', [['#/shop', 'All peptides'], ...PS.categories.slice(0, 5).map((c) => ['#/shop/' + c.id, c.name]), ['#/shop/stacks', 'Research Stacks']])}
          ${col('Resources', [['#/lab-tests', 'Lab Tests & COAs'], ['#/faq', 'FAQ'], ['#/track', 'Track Order'], ['#/wholesale', 'Wholesale'], ['#/account', 'My Account']])}
          ${col('Company', [['#/about', 'About Us'], ['#/contact', 'Contact Us'], ['mailto:' + PS.company.email, PS.company.email]])}
          ${col('Policies', PS.policies.map((p) => ['#/policies/' + p.slug, p.title]))}
        </div>
        <div class="f-bottom"><div><a href="#/policies/terms"><strong>Terms &amp; Conditions</strong></a><span>© ${PS.company.founded} ${PS.company.legal}. All rights reserved. · Demo storefront — no real orders are processed.</span></div>
          <div class="f-social">${['instagram', 'linkedin', 'x', 'youtube'].map((s) => `<a href="#/" aria-label="${s}">${icon(s)}</a>`).join('')}</div></div>
      </div>
    </footer>`;
  }

  function lineHTML(l) {
    return `<div class="line">
      <a class="line-img" href="#/product/${l.id}">${img(l.product, l.sizeObj.label)}</a>
      <div><a class="line-name" href="#/product/${l.id}">${esc(l.product.name)}</a>
        <span class="line-meta">${esc(l.sizeObj.label)} · ${esc(l.planObj.short)}${l.planObj.pct ? ` <b class="save">−${l.planObj.pct}%</b>` : ''}</span>
        <div class="qty sm"><button class="qty-btn" data-line-dec="${esc(l.key)}" aria-label="Decrease">${icon('minus')}</button><input class="qty-input" value="${l.qty}" data-line-qty="${esc(l.key)}" aria-label="Quantity" inputmode="numeric"><button class="qty-btn" data-line-inc="${esc(l.key)}" aria-label="Increase">${icon('plus')}</button></div></div>
      <div class="line-right"><button class="line-remove" data-line-remove="${esc(l.key)}" aria-label="Remove ${esc(l.product.name)}">${icon('trash')}</button>
        <span class="line-price">${l.compare || l.planObj.pct ? `<s>${money((l.compare || l.base) * l.qty)}</s>` : ''}${money(l.total)}</span></div>
    </div>`;
  }

  function drawer(t) {
    return `<div class="drawer-head"><h2>Your cart <span class="muted">(${t.count})</span></h2><button class="icon-btn" data-close-cart aria-label="Close cart">${icon('close')}</button></div>
      <div class="drawer-body">${t.count ? `${H.freeShip(t)}${H.tierNote(t)}${t.lines.map(lineHTML).join('')}` : `<div class="empty-cart">${icon('cart')}<h3>Your cart is empty</h3><p class="muted">Browse research peptides with lot-matched COAs.</p><a class="btn btn-primary" href="#/shop">Shop peptides</a></div>`}</div>
      ${t.count ? `<div class="drawer-foot">${H.totalsRows(t)}<a class="btn btn-primary btn-lg btn-block" href="#/checkout">Checkout · ${money(t.merch)}</a><a class="btn btn-ghost btn-block" href="#/cart">View cart</a></div>` : ''}`;
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
    return `<section class="page-head"><div class="container">${o.eyebrow ? `<span class="eyebrow">${o.eyebrow}</span>` : ''}<h1>${o.title}</h1>${o.intro ? `<p class="lead">${o.intro}</p>` : ''}</div></section>`;
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
    const best = PS.products.filter((p) => p.featured && !p.includes).slice(0, 8);
    const sampleLot = PS.lots(hero)[0];
    return {
      html: `
      <section class="hero"><div class="container hero-grid">
        <div class="hero-copy reveal">
          <span class="trust-chip">${icon('star')}${icon('star')}${icon('star')}${icon('star')}${icon('star')} <span>Independently tested · COA on every lot</span></span>
          <h1>Research peptides, ${it('documented')} to the lot.</h1>
          <p class="lead">Pepsoma supplies high-purity peptides to laboratories and qualified researchers. Every vial is third-party tested, every lot is traceable, and orders ship within 24 hours.</p>
          <div class="btn-row"><a class="btn btn-primary btn-lg" href="#/shop">SHOP PEPTIDES</a><a class="btn btn-yellow btn-lg" href="#/lab-tests"><em class="serif">View lab tests</em></a></div>
          <ul class="hero-checks">${checkItem('≥99% average HPLC purity')}${checkItem('Lot-matched COA in every box')}${checkItem(`Ships same day before ${PS.company.cutoff}`)}</ul>
        </div>
        <div class="hero-art reveal">
          <div class="hero-blob"></div>
          <div class="hero-vials"><span class="hv hv1">${PS.vial(PS.getProduct('ghk-cu'), { theme: VT })}</span><span class="hv hv2">${PS.vial(hero, { theme: VT, size: '10 mg' })}</span><span class="hv hv3">${PS.vial(PS.getProduct('nad'), { theme: VT })}</span></div>
          <div class="float-chip fc1">${icon('shield')}<div><strong>Lot ${sampleLot.code}</strong><small>${sampleLot.purity}% purity · verified</small></div></div>
          <div class="float-chip fc2">${icon('truck')}<div><strong>Ships today</strong><small>Order by ${PS.company.cutoff}</small></div></div>
        </div>
      </div></section>

      <section class="cat-strip"><div class="container">
        <div class="cat-row">${PS.categories.map((c) => `<a class="cat-card reveal" href="#/shop/${c.id}"><strong>${c.name}</strong><span>${PS.products.filter((p) => p.cat === c.id).length} products ${icon('arrow')}</span></a>`).join('')}</div>
      </div></section>

      <section class="section"><div class="container">
        <div class="sec-head center reveal"><h2>Choose your ${it('research stack')}</h2><p class="lead muted">Pre-built kits of complementary compounds — each vial with its own lot-matched COA. Save up to 15% more with a standing order.</p></div>
        <div class="stack-grid">${stacks.map((p) => {
          const s = p.sizes[0];
          return `<article class="stack-card reveal"><a href="#/product/${p.id}" class="stack-img">${img(p)}</a>
            <div class="stack-body"><div class="stack-top"><h3>${esc(p.name)}</h3><span class="pill-y">${esc(p.badge)}</span></div>
            <ul class="checks">${p.includes.map(([id, sz]) => checkItem(`${esc(PS.getProduct(id).name)} · ${PS.getSize(PS.getProduct(id), sz).label}`)).join('')}${checkItem('Lot-matched COA for each vial')}</ul>
            <div class="stack-foot"><div class="price">${money(s.price)} <s>${money(s.compare)}</s></div><a class="btn btn-primary btn-sm" href="#/product/${p.id}">Select stack</a></div></div></article>`;
        }).join('')}</div>
      </div></section>

      <section class="section section-lav"><div class="container">
        <div class="sec-head split-head reveal"><h2>Best-selling ${it('compounds')}</h2><a class="btn btn-ghost" href="#/shop">View full catalog ${icon('arrow')}</a></div>
        <div class="pgrid">${best.map(card).join('')}</div>
      </div></section>

      <section class="testi"><div class="container">
        <h2 class="reveal">Why labs choose ${it('Pepsoma')}</h2>
        <div class="testi-grid">${PS.testimonials.map((x) => `<figure class="testi-card reveal"><div class="stars">${icon('star').repeat(5)}</div><h3>${esc(x.title)}</h3><blockquote>“${esc(x.body)}”</blockquote><figcaption>— ${esc(x.who)} —</figcaption></figure>`).join('')}</div>
        <p class="testi-note">Sample testimonials for demo purposes.</p>
      </div></section>

      <section class="section section-cream"><div class="container">
        <h2 class="center reveal">Inside every ${it('Pepsoma')} order</h2>
        <div class="split reveal">
          <div class="split-art art-box"><div class="box-card"><div class="box-vials">${PS.productImage(PS.getProduct('stack-recovery'), { theme: VT })}</div><div class="mini-coa"><span>${icon('doc')} Certificate of Analysis</span><strong>${sampleLot.code}</strong><div class="mini-bar"><i style="width:${sampleLot.purity}%"></i></div><small>Purity ${sampleLot.purity}% · Identity conforms</small></div></div></div>
          <div class="split-copy"><h3 class="big">${it('Every shipment')} is built for researchers who:</h3>
            <ul class="checks lg">${checkItem('Need documentation they can file — a printed, lot-matched COA ships in every box')}${checkItem('Can’t afford delays — same-day dispatch before 2 PM ET with tracking in hours')}${checkItem('Expect integrity — tamper-evident seals, lot labels and protective, discreet packaging')}</ul>
            <a class="btn btn-primary btn-lg" href="#/shop">SHOP PEPTIDES</a></div>
        </div>
      </div></section>

      <section class="section"><div class="container split reverse reveal">
        <div class="split-copy"><h2 class="serif-h">How we ${it('test')}</h2>
          <p>Every lot is sent to an independent ISO/IEC 17025-accredited laboratory${'<sup>1</sup>'} before it’s listed. We publish the results — not a summary.</p>
          <p>Our release panel covers:</p>
          <ul class="checks">${checkItem('<strong>Purity</strong> by reverse-phase HPLC — release spec ≥98%')}${checkItem('<strong>Identity</strong> by mass spectrometry')}${checkItem('<strong>Endotoxin</strong> by LAL<sup>2</sup> and <strong>sterility</strong><sup>3</sup>')}${checkItem('<strong>Heavy metals</strong> by ICP-MS')}</ul>
          <p class="small muted"><em>Results apply to the lot tested.</em></p>
          <button class="btn btn-primary" data-coa="${sampleLot.code}">VIEW A SAMPLE COA</button>
          <ol class="refs"><li>ISO/IEC 17025:2017 — General requirements for the competence of testing and calibration laboratories.</li><li>USP General Chapter ⟨85⟩ Bacterial Endotoxins Test.</li><li>USP General Chapter ⟨71⟩ Sterility Tests.</li></ol></div>
        <div class="split-art art-coa"><div class="coa-preview"><div class="coa-preview-head"><span>RP-HPLC · ${esc(hero.name)}</span><strong>${sampleLot.purity}%</strong></div>${PS.chromatogram(sampleLot)}<div class="coa-preview-rows"><span>Identity (ESI-MS)</span><b>Conforms</b><span>Endotoxin</span><b>${sampleLot.endotoxin} EU/mg</b><span>Sterility</span><b>No growth</b></div></div></div>
      </div></section>

      <section class="section section-soft"><div class="container">
        <h2 class="center reveal">A straightforward ${it('path')} to your lab</h2>
        <div class="steps">${PS.steps.map((s, i) => `<div class="step reveal"><div class="step-art">${icon(['search', 'shield', 'truck', 'doc'][i])}</div><span class="step-n">${s.n}</span><h3>${s.title}</h3><p>${s.body}</p></div>`).join('')}</div>
        <div class="center"><a class="btn btn-primary btn-lg" href="#/shop">START SHOPPING</a></div>
      </div></section>

      <section class="section"><div class="container faq-split">
        <h2 class="faq-title reveal">${it('Frequently')} Asked Questions</h2>
        <div class="reveal">${H.faq([{ items: PS.faqs.flatMap((g) => g.items).slice(0, 6) }])}<a class="link-arrow mt" href="#/faq">See all FAQs ${icon('arrow')}</a></div>
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
      html: `<section class="page-head"><div class="container"><span class="eyebrow">Shop</span><h1>${c ? esc(c.name) : `Research ${it('peptides')}`}</h1><p class="lead">${c ? esc(c.blurb) : 'Every compound independently tested, with the current lot’s purity and COA on every listing.'}</p></div></section>
      <section class="container section-sm">
        <div class="shop-bar">
          <div class="chips"><a class="chip ${!cat ? 'on' : ''}" href="#/shop">All</a>${PS.categories.map((x) => `<a class="chip ${x.id === cat ? 'on' : ''}" href="#/shop/${x.id}">${x.name}</a>`).join('')}</div>
          <div class="shop-tools"><form data-form="search" role="search" class="shop-search">${icon('search')}<input class="input" name="q" value="${esc(query.q || '')}" placeholder="Search compounds" aria-label="Search"></form>
          <label class="sr-only" for="sort">Sort</label><select id="sort" class="input" data-sort>${[['featured', 'Featured'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['name', 'Name A–Z']].map(([v, l]) => `<option value="${v}" ${v === sort ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        </div>
        <p class="muted small">${list.length} product${list.length === 1 ? '' : 's'}${q ? ` matching “${esc(query.q)}”` : ''}</p>
        ${list.length ? `<div class="pgrid">${list.map(card).join('')}</div>` : `<div class="card pad center"><h3>No matches</h3><p class="muted">Try a different search or browse all compounds.</p><a class="btn btn-primary" href="#/shop">View all</a></div>`}
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
            <div class="stage">
              <div class="stage-panel stage-vial" data-panel="vial" data-product-vial>${img(p)}</div>
              ${lot ? `<div class="stage-panel stage-coa" data-panel="coa" hidden><span class="eyebrow">Current lot</span><h3>${esc(lot.code)}</h3><div class="big-purity">${lot.purity}<small>%</small></div><p class="muted">HPLC purity · tested ${PS.date(lot.tested)}</p>${PS.chromatogram(lot)}<button class="btn btn-primary btn-sm" data-coa="${lot.code}">Open full COA</button></div>` : ''}
              <div class="stage-panel stage-spec" data-panel="spec" hidden>${seq ? `<div class="beads">${seq.map((a) => `<span>${esc(a)}</span>`).join('')}</div>` : ''}<dl class="mini-spec"><dt>Formula</dt><dd>${esc(p.formula || '—')}</dd><dt>Mol. weight</dt><dd>${p.mw ? p.mw + ' g/mol' : '—'}</dd><dt>CAS</dt><dd>${esc(p.cas || '—')}</dd></dl></div>
              <div class="stage-panel stage-box" data-panel="box" hidden><div class="box-card">${img(p)}<div class="mini-coa"><span>${icon('doc')} COA inserted</span><strong>${lot ? esc(lot.code) : 'Spec sheet'}</strong></div></div></div>
            </div>
            <p class="gallery-disclaimer">${H.disclaimer()}</p>
          </div>

          <div class="buybox">
            ${p.badge ? `<span class="pill-y">${esc(p.badge)}</span>` : ''}
            <h1 class="pdp-title">${it(esc(p.name))}</h1>
            <p class="pdp-sub">${esc(p.full || '')}</p>
            <p class="pdp-summary">${esc(p.summary)}</p>
            ${p.purity ? `<div class="pdp-meta"><span>${icon('shield')} ${p.purity}% purity (current lot)</span><span>${icon('flask')} Research use only</span></div>` : ''}
            <div class="included"><h3>What’s included?</h3><ul class="checks">${included.map(checkItem).join('')}</ul></div>

            <form data-form="product" data-id="${p.id}" class="pform">
              ${p.sizes.length > 1 ? `<h3 class="pform-h">Select size</h3><div class="size-row">${p.sizes.map((x, i) => `<label class="size-opt ${i ? '' : 'selected'}"><input type="radio" name="size" value="${x.id}" ${i ? '' : 'checked'}><span>${esc(x.label)}</span><small>${money(x.price)}</small></label>`).join('')}</div>` : `<input type="hidden" name="size" value="${s.id}">`}
              <h3 class="pform-h">Confirm your ${it('order type')}:</h3>
              <div class="plans">${plans.map((pl, i) => `<label class="plan-opt ${i ? '' : 'selected'}"><input type="radio" name="plan" value="${pl.id}" ${i ? '' : 'checked'}>
                <span class="plan-check">${icon('check')}</span>
                <span class="plan-body"><strong>${pl.id === 'once' ? 'ONE-TIME PURCHASE' : `STANDING ORDER · ${pl.short.toUpperCase()}`}</strong>
                <small>${pl.id === 'once' ? 'Billed once · volume savings apply' : `Billed <b data-plan-price="${pl.id}"></b> today, then every ${pl.weeks} weeks<br>Skip or cancel anytime`}</small></span>
                <span class="plan-price">${pl.pct ? `<span class="pill-y">Save ${pl.pct}%</span>` : ''}<s data-plan-compare="${pl.id}"></s><b data-plan-price="${pl.id}"></b></span></label>`).join('')}</div>
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

      ${related.length ? `<section class="section section-lav"><div class="container"><h2 class="reveal">You may also ${it('research')}</h2><div class="pgrid">${related.map(card).join('')}</div></div></section>` : ''}`,
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
      html: `${pageHead({ eyebrow: 'Secure checkout', title: `Almost ${it('there')}` })}
      <section class="container section-sm"><div class="checkout-grid">
        <div class="card pad">${H.checkoutForm(PS.auth.current(), t)}</div>
        <aside class="sticky" data-summary>${summary(t, { shipping: true })}</aside>
      </div></section>`,
    };
  };

  views.about = () => ({
    title: 'About',
    html: `<section class="page-head"><div class="container"><span class="eyebrow">About Pepsoma</span><h1>Science first. ${it('Documented')} always.</h1><p class="lead">We started Pepsoma because researchers deserve suppliers who show their work — every lot, every test, every time.</p></div></section>
    <section class="section-sm container"><div class="split">
      <div class="split-art art-box"><div class="box-card">${PS.productImage(PS.getProduct('stack-longevity'), { theme: VT })}</div></div>
      <div class="split-copy"><h2 class="serif-h">Our ${it('standard')}</h2><p>Pepsoma supplies research peptides to universities, biotech R&amp;D teams, CROs and independent researchers across the United States. We don’t manufacture claims — we publish data.</p>
        <ul class="checks lg">${checkItem('<strong>Independent testing.</strong> Every lot, every time, by ISO/IEC 17025-accredited labs.')}${checkItem('<strong>Radical transparency.</strong> Full COAs published online and printed in every box.')}${checkItem('<strong>Research-only integrity.</strong> We sell to researchers, screen orders, and never make health claims.')}</ul>
        <div class="btn-row"><a class="btn btn-primary" href="#/lab-tests">See our lab tests</a><a class="btn btn-ghost" href="#/contact">Talk to our team</a></div></div>
    </div></section>
    <section class="section section-soft"><div class="container"><div class="values">${[['99%+', 'average HPLC purity across current lots'], ['24h', 'dispatch on orders before 2 PM ET'], ['100%', 'of lots independently tested'], ['US', 'based operations & fulfillment']].map(([a, b]) => `<div class="value reveal"><strong>${a}</strong><span>${b}</span></div>`).join('')}</div></div></section>`,
  });

  PS.boot({ name: 'a', vialTheme: VT, header, footer, drawer, summary, pageHead, ageGate, ageDenied, cookieBanner, views });
})();
