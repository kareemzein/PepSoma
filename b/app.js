/* Pepsoma — Version B “Lab”: near-black, antique gold and cream, tight grotesk type,
   marquee trust bars and a catalog-first layout. */
(function () {
  const PS = window.PS;
  const esc = PS.esc, icon = PS.icon, money = PS.money, H = PS.html;
  const VT = 'dark';
  const img = (p, size) => PS.productImage(p, { theme: VT, size });
  const catName = (id) => (PS.getCategory(id) || {}).name || '';
  const dot = '<span class="gold">.</span>';
  const eyebrow = (s) => `<span class="eyebrow"><i></i>${s}</span>`;

  const logo = () => `<a class="logo" href="#/" aria-label="Pepsoma home"><svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M10 34V6h12a9 9 0 0 1 0 18h-6" fill="none" stroke="currentColor" stroke-width="3.2"/><path d="M16 12h6a3 3 0 0 1 0 6h-6z" fill="#c8a44d"/></svg><span class="logo-word">PEPSOMA<small>RESEARCH</small></span></a>`;

  /* ---------- product card ---------- */
  function card(p) {
    const s = p.sizes[0];
    const multi = p.sizes.length > 1;
    const sale = p.sizes.some((x) => x.compare);
    return `<article class="pcard reveal">
      ${sale ? '<span class="sale">SALE!</span>' : ''}
      <a class="pcard-img" href="#/product/${p.id}" aria-label="${esc(p.name)}">${img(p)}</a>
      <h3 class="pcard-name"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
      <div class="pcard-price">${multi ? 'From ' : ''}${s.compare ? `<s>${money(s.compare)}</s> ` : ''}<span>${money(s.price)}</span></div>
      ${multi ? `<a class="btn btn-primary btn-block" href="#/product/${p.id}">Select options</a>` : `<button class="btn btn-primary btn-block" data-add="${p.id}" data-size="${s.id}">Add to cart</button>`}
    </article>`;
  }

  /* ---------- shell ---------- */
  function marquee(items, cls) {
    const row = items.map((x) => `<span>${x}</span><b>×</b>`).join('');
    return `<div class="marquee ${cls || ''}" aria-hidden="true"><div class="marquee-track">${row}${row}${row}</div></div>`;
  }

  function header() {
    const u = PS.auth.current();
    const promoHidden = PS.storage.get('promoBar', null);
    return `${marquee(['Ships in <em>24 hours</em>', '<em>7-point</em> test panel', 'Independently third-party tested', `Free shipping on US orders over <em>${PS.money0(PS.config.freeShip)}</em>`, 'COA on every lot'], 'top-marquee')}
    ${promoHidden ? '' : `<div class="promo-bar"><div class="container"><span class="gold">BUY MORE, SAVE MORE</span> — ${PS.config.tiers.slice().reverse().map((t) => `<strong>${t.min}+ vials ${t.pct}% off</strong>`).join(' · ')} <span class="tag">Auto-applied</span><button class="promo-x" data-promo-close aria-label="Dismiss">${icon('close')}</button></div></div>`}
    <header class="site-header"><div class="container hdr">
      ${logo()}
      <nav class="main-nav" aria-label="Main">
        <form class="nav-search show-sm" data-form="search" role="search"><input class="input" name="q" placeholder="Search compounds" aria-label="Search compounds"></form>
        <div class="dd-wrap"><a href="#/shop" data-nav="shop" class="nav-link">Peptides</a>
          <div class="dd"><a href="#/shop">All compounds</a>${PS.categories.map((c) => `<a href="#/shop/${c.id}">${c.name}</a>`).join('')}</div></div>
        <a href="#/lab-tests" data-nav="lab-tests" class="nav-link">Lab Tests</a>
        <a href="#/shop/stacks" class="nav-link">Stacks</a>
        <a href="#/wholesale" data-nav="wholesale" class="nav-link">Wholesale</a>
        <a href="#/track" data-nav="track" class="nav-link">Track Order</a>
        <a href="#/contact" data-nav="contact" class="nav-link">Contact</a>
        <a href="#/faq" data-nav="faq" class="nav-link show-sm">FAQ</a>
        <a href="#/account" class="nav-link show-sm">${u ? 'My account' : 'Sign in'}</a>
      </nav>
      <div class="hdr-actions">
        <button class="sq-btn hide-sm" data-search aria-label="Search">${icon('search')}</button>
        <a class="btn btn-outline btn-sm hide-sm" href="#/account">${u ? esc(u.name.split(' ')[0]) : 'Sign in'}</a>
        <button class="cart-btn" data-open-cart aria-label="Open cart">${icon('cart')}<span class="cart-count" data-cart-count>0</span><span class="cart-total" data-cart-total>$0.00</span></button>
        <button class="sq-btn nav-toggle" data-nav-toggle aria-label="Menu" aria-expanded="false">${icon('menu')}</button>
      </div>
    </div></header>`;
  }

  function footer() {
    const col = (t, links) => `<div class="fcol"><h4><i></i>${t}</h4>${links.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</div>`;
    return `<footer class="site-footer"><div class="container">
      <div class="f-news reveal"><div>${eyebrow('Stay informed')}<h3>New lots, restocks &amp; COAs${dot}</h3></div>${H.newsletter('b')}</div>
      <div class="f-grid">
        <div class="f-brand">${logo()}<p>Built on transparency. Research-grade peptides, independently tested for purity, identity, endotoxins and sterility — with the COA to prove it.</p></div>
        ${col('Navigate', [['#/shop', 'Peptides'], ['#/lab-tests', 'Lab Tests'], ['#/shop/stacks', 'Research Stacks'], ['#/wholesale', 'Wholesale'], ['#/track', 'Track Order'], ['#/about', 'About'], ['#/faq', 'FAQ']])}
        ${col('Policies', PS.policies.map((p) => ['#/policies/' + p.slug, p.title]))}
        ${col('Contact', [['mailto:' + PS.company.email, 'Email support'], ['#/contact', PS.company.phone], ['#/contact', 'Contact form'], ['#/account', 'Account']])}
      </div>
      <div class="f-notice"><span class="eyebrow-gold">Important notice</span><p>${H.disclaimer()}</p></div>
      <div class="f-bottom"><span>© ${PS.company.founded} ${PS.company.legal.toUpperCase()} · All rights reserved · Demo storefront</span><span>For research &amp; laboratory use only · Not for human or animal consumption</span></div>
    </div></footer>`;
  }

  function lineHTML(l) {
    return `<div class="line">
      <a class="line-img" href="#/product/${l.id}">${img(l.product, l.sizeObj.label)}</a>
      <div><a class="line-name" href="#/product/${l.id}">${esc(l.product.name)}</a>
        <span class="line-meta">${esc(l.sizeObj.label)} · ${esc(l.planObj.short)}${l.planObj.pct ? ` <b class="gold">−${l.planObj.pct}%</b>` : ''}</span>
        <div class="qty sm"><button class="qty-btn" data-line-dec="${esc(l.key)}" aria-label="Decrease">${icon('minus')}</button><input class="qty-input" value="${l.qty}" data-line-qty="${esc(l.key)}" aria-label="Quantity" inputmode="numeric"><button class="qty-btn" data-line-inc="${esc(l.key)}" aria-label="Increase">${icon('plus')}</button></div></div>
      <div class="line-right"><button class="line-remove" data-line-remove="${esc(l.key)}" aria-label="Remove ${esc(l.product.name)}">${icon('trash')}</button>
        <span class="line-price">${l.compare || l.planObj.pct ? `<s>${money((l.compare || l.base) * l.qty)}</s>` : ''}${money(l.total)}</span></div>
    </div>`;
  }

  function drawer(t) {
    return `<div class="drawer-head"><h2>Cart <span class="gold">${t.count}</span></h2><button class="icon-btn" data-close-cart aria-label="Close cart">${icon('close')}</button></div>
      <div class="drawer-body">${t.count ? `${H.freeShip(t)}${H.tierNote(t)}${t.lines.map(lineHTML).join('')}` : `<div class="empty-cart">${icon('cart')}<h3>Your cart is empty</h3><p class="muted">Every compound ships with its lot-matched COA.</p><a class="btn btn-primary" href="#/shop">Shop peptides</a></div>`}</div>
      ${t.count ? `<div class="drawer-foot">${H.totalsRows(t)}<a class="btn btn-primary btn-lg btn-block" href="#/checkout">Checkout ${icon('arrow')}</a><a class="btn btn-outline btn-block" href="#/cart">View cart</a></div>` : ''}`;
  }

  function summary(t, opts) {
    opts = opts || {};
    return `<div class="sum-card">
      <h2 class="sum-title">${eyebrow('Order summary')}</h2>
      ${opts.shipping ? `<ul class="sum-items">${t.lines.map((l) => `<li><span class="sum-img">${img(l.product, l.sizeObj.label)}<b>${l.qty}</b></span><span class="sum-name">${esc(l.product.name)}<small>${esc(l.sizeObj.label)} · ${esc(l.planObj.short)}</small></span><span>${money(l.total)}</span></li>`).join('')}</ul>` : ''}
      ${H.tierNote(t)}${H.promoForm(t)}
      ${H.totalsRows(t, opts)}
      ${opts.shipping ? '' : `<a class="btn btn-primary btn-lg btn-block mt" href="#/checkout">Proceed to checkout ${icon('arrow')}</a>`}
      <ul class="sum-trust"><li>${icon('doc')} COA printed &amp; included</li><li>${icon('truck')} Ships within 24 hours</li><li>${icon('shield')} Discreet, sealed packaging</li></ul>
    </div>`;
  }

  function pageHead(o) {
    return `<section class="page-head"><div class="container">${o.eyebrow ? eyebrow(o.eyebrow) : ''}<h1>${o.title}${/[.!?]$/.test(o.title) ? '' : dot}</h1>${o.intro ? `<p class="lead">${o.intro}</p>` : ''}</div></section>`;
  }

  const ageGate = () => `<div class="gate">${logo()}${eyebrow('Research use only')}<h2>Verify your age${dot}</h2>
    <p>Pepsoma supplies research compounds intended strictly for in-vitro laboratory use. They are not for human or animal consumption. You must be <strong>21 or older</strong> to enter.</p>
    <div class="gate-actions"><button class="btn btn-primary btn-lg" data-age-accept>I am 21+ — Enter</button><button class="btn btn-outline btn-lg" data-age-exit>Exit</button></div>
    <p class="small muted">By entering you agree to our <a href="#/policies/terms" data-age-accept>Terms</a> and <a href="#/policies/research-use" data-age-accept>Research Use Policy</a>.</p></div>`;
  const ageDenied = () => `<div class="gate">${logo()}<h2>Access restricted${dot}</h2><p class="muted">This site is available only to adults 21 and older purchasing for laboratory research.</p></div>`;
  const cookieBanner = () => `<div class="cookie-banner" role="region" aria-label="Cookie consent">${eyebrow('Cookies')}<p>We use essential cookies to run the cart and checkout, and optional analytics to improve the site. <a href="#/policies/cookies">Cookie Policy</a></p><div class="btn-row"><button class="btn btn-primary btn-sm" data-cookie="all">Accept all</button><button class="btn btn-outline btn-sm" data-cookie="essential">Essential only</button></div></div>`;

  /* ---------- pages ---------- */
  const views = {};

  views.home = () => {
    const featured = ['bpc-157', 'ghk-cu', 'tesamorelin', 'cjc-ipa', 'bpc-tb-blend', 'nad', 'tb-500', 'mots-c'].map(PS.getProduct);
    const stacks = PS.products.filter((p) => p.cat === 'stacks');
    const hero = PS.getProduct('bpc-157');
    const lot = PS.lots(hero)[0];
    return {
      html: `
      <section class="hero"><div class="container hero-grid">
        <div class="hero-copy reveal">
          ${eyebrow(`Est. ${PS.company.founded} — Research use only standards`)}
          <h1>Raising the bar for peptide <span class="gold">research</span>.</h1>
          <p class="lead">Independently tested for purity, identity, endotoxins, heavy metals and sterility. Every lot ships with its COA — in 24 hours.</p>
          <div class="btn-row"><a class="btn btn-primary btn-lg" href="#/shop">Shop peptides ${icon('arrow')}</a><a class="text-link" href="#/lab-tests">View lab tests</a></div>
          <div class="metrics">${[['99', '%+', 'Documented purity'], ['7', '×', 'Tested per lot'], ['100', '%', 'COA coverage'], ['24', 'h', 'Ship time']].map(([a, b, c]) => `<div><strong>${a}<span class="gold">${b}</span></strong><small>${c}</small></div>`).join('')}</div>
        </div>
        <div class="hero-art reveal" aria-hidden="true">
          <span class="hv hv1">${PS.vial(PS.getProduct('nad'), { theme: VT })}</span>
          <span class="hv hv2">${PS.vial(hero, { theme: VT, size: '10 mg' })}</span>
          <span class="hv hv3">${PS.vial(PS.getProduct('ghk-cu'), { theme: VT })}</span>
          <div class="lot-chip"><span class="live-dot"></span>Lot ${lot.code} · ${lot.purity}% HPLC</div>
        </div>
      </div></section>

      ${marquee(['US-based', 'Ships in 24 hours', 'COA verified', 'Third-party tested', '99%+ purity', 'Lot traceable'], 'band')}

      <section class="section"><div class="container">
        <div class="sec-head">${eyebrow('Est. 2026 — Research-grade catalog')}<div class="sec-row"><h2>Featured research compounds${dot}</h2><a class="btn btn-outline" href="#/shop">View full catalog</a></div></div>
        <div class="pgrid">${featured.map(card).join('')}</div>
      </div></section>

      <section class="section section-alt"><div class="container">
        <div class="sec-head">${eyebrow('Every order — every lot')}<h2>The Pepsoma standards${dot}</h2></div>
        <div class="standards">${[
          ['Independently tested', 'Verified by third-party labs', 'Every lot is analyzed by an independent ISO/IEC 17025-accredited laboratory for purity, identity, heavy metals, endotoxins and sterility before it’s listed.', '#/lab-tests', 'View lab tests'],
          ['Documented', 'A COA with every lot', 'The Certificate of Analysis for your exact lot is published online and printed in the box — matched to the lot number on your vial.', '#/lab-tests', 'Browse COAs'],
          ['Dispatched fast', 'Ships within 24 hours', `Orders placed before ${PS.company.cutoff} leave the same day — sealed, discreet and tracked from our facility to your lab.`, '#/policies/shipping', 'Shipping policy'],
        ].map(([k, t, b, h, l], i) => `<article class="std reveal"><span class="std-k">${k}</span><h3>${t}</h3><p>${b}</p><a class="text-link" href="${h}">${l}</a><span class="std-n">0${i + 1}</span></article>`).join('')}</div>
      </div></section>

      <section class="section"><div class="container">
        <div class="sec-head">${eyebrow('Bundled & documented')}<div class="sec-row"><h2>Research stacks${dot}</h2><a class="btn btn-outline" href="#/shop/stacks">All stacks</a></div></div>
        <div class="stacks">${stacks.map((p) => `<a class="stack reveal" href="#/product/${p.id}"><span class="stack-img">${img(p)}</span><span class="stack-body"><span class="tag">${esc(p.badge)}</span><strong>${esc(p.name)}</strong><small>${p.includes.map(([id]) => esc(PS.getProduct(id).name)).join(' + ')}</small><span class="pcard-price"><s>${money(p.sizes[0].compare)}</s> <span>${money(p.sizes[0].price)}</span></span></span></a>`).join('')}</div>
      </div></section>

      <section class="section faq-sec"><div class="container narrow">
        <div class="sec-head center">${eyebrow('Common questions')}<h2>Frequently asked questions${dot}</h2></div>
        <div class="reveal">${H.faq([{ items: PS.faqs.flatMap((g) => g.items).slice(0, 5) }])}</div>
        <div class="center mt"><a class="text-link" href="#/faq">All FAQs</a></div>
      </div></section>

      <section class="section section-alt"><div class="container why">
        <div class="reveal">${eyebrow('Why Pepsoma')}<h2>Supplying research the right way${dot}</h2>
          <p class="lead">Pepsoma provides research-use-only compounds to laboratories, academic programs and qualified researchers. Every listing is supported by lot-level documentation and intended strictly for in-vitro research.</p>
          <ul class="why-list">${[['US-based operations', 'Compounds are stored, handled and shipped from our US facility — with support that responds in hours, not days.'], ['Full batch traceability', 'Every vial is labeled with its lot number, so results in your lab trace directly back to the analytical record for that exact batch.'], ['Research-only compliance', 'Materials are supplied exclusively for laboratory research and analytical evaluation — never for human or veterinary use.']].map(([a, b]) => `<li><i></i><div><strong>${a}</strong><p>${b}</p></div></li>`).join('')}</ul></div>
        <div class="why-art reveal"><div class="frame">${PS.vial(PS.getProduct('glutathione'), { theme: VT })}</div><small>Research use only · COA every lot</small></div>
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
      html: `${pageHead({ eyebrow: 'Research-grade catalog', title: c ? esc(c.name) : 'All compounds', intro: c ? esc(c.blurb) : 'Every compound independently tested. Current-lot purity and COA on every listing.' })}
      <section class="container section-sm"><div class="shop-layout">
        <aside class="filters"><h4>${eyebrow('Categories')}</h4>
          <a class="${!cat ? 'on' : ''}" href="#/shop">All compounds <span>${PS.products.length}</span></a>
          ${PS.categories.map((x) => `<a class="${x.id === cat ? 'on' : ''}" href="#/shop/${x.id}">${x.name} <span>${PS.products.filter((p) => p.cat === x.id).length}</span></a>`).join('')}
          <div class="filter-note">${icon('doc')}<span>All lots ship with a printed COA. <a href="#/lab-tests">Search COAs</a></span></div>
        </aside>
        <div>
          <div class="shop-top"><form data-form="search" role="search" class="shop-search">${icon('search')}<input class="input" name="q" value="${esc(query.q || '')}" placeholder="Search compounds" aria-label="Search"></form>
            <span class="muted small">${list.length} result${list.length === 1 ? '' : 's'}</span>
            <label class="sr-only" for="sort">Sort</label><select id="sort" class="input" data-sort>${[['featured', 'Featured'], ['price-asc', 'Price: low → high'], ['price-desc', 'Price: high → low'], ['name', 'Name A–Z']].map(([v, l]) => `<option value="${v}" ${v === sort ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
          ${list.length ? `<div class="pgrid g3">${list.map(card).join('')}</div>` : `<div class="card pad center"><h3>No compounds found${dot}</h3><p class="muted">Try another search term.</p><a class="btn btn-primary" href="#/shop">View all</a></div>`}
        </div>
      </div></section>`,
    };
  };

  views.product = ({ params }) => {
    const p = PS.getProduct(params.id);
    if (!p) return PS.defaultViews.notFound({ msg: 'We couldn’t find that compound.' });
    const s = p.sizes[0];
    const lots = p.includes ? p.includes.flatMap(([id]) => PS.lots(PS.getProduct(id)).slice(0, 1)) : PS.lots(p);
    const lot = lots[0];
    const related = PS.products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    const tiers = [{ min: 1, pct: 0 }].concat(PS.config.tiers.slice().reverse());
    return {
      title: p.name,
      html: `<section class="container pdp">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/shop/${p.cat}">${esc(catName(p.cat))}</a><span>/</span><span>${esc(p.name)}</span></nav>
        <div class="pdp-grid">
          <div class="stage">
            ${s.compare ? '<span class="sale">SALE!</span>' : ''}
            <div class="stage-vial" data-product-vial>${img(p)}</div>
            ${lot ? `<button class="lot-chip" data-coa="${lot.code}"><span class="live-dot"></span>Lot ${lot.code} · ${lot.purity}% · View COA</button>` : ''}
          </div>
          <div class="buybox">
            ${eyebrow(esc(catName(p.cat)))}
            <h1 class="pdp-title">${esc(p.name)}</h1>
            <p class="pdp-sub">${esc(p.full || '')}</p>
            <div class="pdp-price"><s data-compare></s><span data-price>${money(s.price)}</span></div>
            <div class="assay">${p.purity ? `<span><b>${p.purity}%</b> HPLC purity</span>` : ''}${p.mw ? '<span><b>MS</b> identity verified</span>' : ''}${p.noCoa ? '<span><b>Sterile</b> USP grade</span>' : '<span><b>LAL</b> endotoxin tested</span>'}<span><b>COA</b> every lot</span></div>
            <p class="pdp-summary">${esc(p.summary)}</p>
            <form data-form="product" data-id="${p.id}" class="pform">
              ${p.sizes.length > 1 ? `<div class="pf-label">Size: <b data-size-label>${s.label}</b></div><div class="size-row">${p.sizes.map((x, i) => `<label class="size-opt ${i ? '' : 'selected'}"><input type="radio" name="size" value="${x.id}" ${i ? '' : 'checked'}><span>${esc(x.label)}</span></label>`).join('')}</div>` : `<input type="hidden" name="size" value="${s.id}"><div class="pf-label">Size: <b>${s.label}</b></div>`}
              <div class="pf-label">Purchase type</div>
              <div class="plan-row">${PS.config.plans.map((pl, i) => `<label class="plan-opt ${i ? '' : 'selected'}"><input type="radio" name="plan" value="${pl.id}" ${i ? '' : 'checked'}><span class="plan-t">${pl.id === 'once' ? 'One-time' : pl.short}</span><span class="plan-p" data-plan-price="${pl.id}"></span>${pl.pct ? `<span class="plan-save">−${pl.pct}%</span>` : ''}</label>`).join('')}</div>
              <div class="buy-row">${H.qty(1)}<button class="btn btn-primary btn-lg buy-btn" type="submit">Add to cart · <span data-line-price></span></button></div>
            </form>
            <div class="tier-box"><div class="tier-head"><span class="gold">BUY MORE, SAVE MORE</span><small>One-time vials · mix &amp; match · auto-applied</small></div>
              <div class="tier-grid">${tiers.map((t, i) => `<div><strong>${t.min}${tiers[i + 1] ? '–' + (tiers[i + 1].min - 1) : '+'}</strong><span>${t.pct ? t.pct + '% off' : 'List price'}</span></div>`).join('')}</div></div>
            <ul class="pdp-trust"><li>${icon('truck')} Order by ${PS.company.cutoff} — ships today</li><li>${icon('doc')} Printed COA in the box</li><li>${icon('shield')} Research attestation at checkout</li></ul>
          </div>
        </div>

        <div class="tabs" data-tabs>
          <div class="tab-list" role="tablist">
            <button class="tab active" data-tab="desc" role="tab" aria-selected="true">Description</button>
            <button class="tab" data-tab="spec" role="tab" aria-selected="false">Specifications</button>
            ${lots.length ? `<button class="tab" data-tab="coa" role="tab" aria-selected="false">Lab tests</button>` : ''}
            <button class="tab" data-tab="ship" role="tab" aria-selected="false">Storage &amp; shipping</button>
          </div>
          <div class="tab-panel" data-panel="desc"><div class="two-col"><div><h3>Research context${dot}</h3><p>${esc(p.summary)}</p><p>Published literature describes ${esc(p.name)} in the following research contexts:</p><ul class="why-list sm">${p.research.map((r) => `<li><i></i><div>${esc(r)}</div></li>`).join('')}</ul></div>
            <div class="notice-box">${eyebrow('Research use only')}<p>${H.disclaimer()}</p></div></div></div>
          <div class="tab-panel" data-panel="spec" hidden>${p.includes ? `<ul class="why-list">${p.includes.map(([id, sz]) => `<li><i></i><div><a href="#/product/${id}"><strong>${esc(PS.getProduct(id).name)}</strong></a> · ${PS.getSize(PS.getProduct(id), sz).label}</div></li>`).join('')}</ul>` : H.specTable(p)}</div>
          ${lots.length ? `<div class="tab-panel" data-panel="coa" hidden>${H.lotTable(lots)}</div>` : ''}
          <div class="tab-panel" data-panel="ship" hidden><div class="two-col"><div><h3>Storage${dot}</h3><p>Lyophilized material is stable at ambient temperature during transit. Store sealed vials at −20 °C for long-term storage, 2–8 °C short-term, protected from light.</p></div><div><h3>Shipping${dot}</h3><p>Orders before ${PS.company.cutoff} ship same business day. Free standard shipping on orders ${PS.money0(PS.config.freeShip)}+. See our <a href="#/policies/shipping">Shipping Policy</a> and <a href="#/policies/refunds">Refund Policy</a>.</p></div></div></div>
        </div>
      </section>
      ${related.length ? `<section class="section section-alt"><div class="container"><div class="sec-head">${eyebrow('Related')}<h2>Related compounds${dot}</h2></div><div class="pgrid">${related.map(card).join('')}</div></div></section>` : ''}`,
    };
  };

  views.cart = () => {
    const t = PS.cart.totals();
    return {
      title: 'Cart',
      html: `${pageHead({ eyebrow: 'Your order', title: 'Cart' })}
      <section class="container section-sm">${t.count ? `<div class="cart-grid">
        <div class="card pad">${H.freeShip(t)}${t.lines.map(lineHTML).join('')}<a class="text-link mt" href="#/shop">Continue shopping</a></div>
        <aside class="sticky">${summary(t)}</aside></div>`
        : `<div class="card pad empty-cart">${icon('cart')}<h2>Your cart is empty${dot}</h2><p class="muted">Every compound ships with its lot-matched COA.</p><a class="btn btn-primary btn-lg" href="#/shop">Shop peptides</a></div>`}</section>`,
    };
  };

  views.checkout = () => {
    const t = PS.cart.totals();
    if (!t.count) return views.cart();
    return {
      title: 'Checkout',
      html: `${pageHead({ eyebrow: 'Secure checkout', title: 'Checkout' })}
      <section class="container section-sm"><div class="checkout-grid">
        <div class="card pad">${H.checkoutForm(PS.auth.current(), t)}</div>
        <aside class="sticky" data-summary>${summary(t, { shipping: true })}</aside>
      </div></section>`,
    };
  };

  views.about = () => ({
    title: 'About',
    html: `${pageHead({ eyebrow: 'About Pepsoma', title: 'Built on transparency', intro: 'We supply research compounds the way we’d want to receive them: independently tested, fully documented and shipped fast.' })}
    <section class="section-sm container"><div class="why">
      <div>${eyebrow('Our standard')}<h2>Data over claims${dot}</h2><p class="lead">Pepsoma serves universities, biotech R&amp;D teams, CROs and independent researchers across the United States. We publish every COA, screen every order and never make health claims.</p>
        <ul class="why-list">${[['Independent testing', 'Every lot, every time, by ISO/IEC 17025-accredited labs.'], ['Radical transparency', 'Full COAs online and printed in every box.'], ['Research-only integrity', 'Attestation at checkout and order screening on every purchase.']].map(([a, b]) => `<li><i></i><div><strong>${a}</strong><p>${b}</p></div></li>`).join('')}</ul>
        <div class="btn-row"><a class="btn btn-primary" href="#/lab-tests">See lab tests</a><a class="btn btn-outline" href="#/contact">Contact us</a></div></div>
      <div class="why-art"><div class="frame">${PS.productImage(PS.getProduct('stack-longevity'), { theme: VT })}</div><small>Lot traceable · COA every vial</small></div>
    </div></section>
    <section class="section section-alt"><div class="container"><div class="metrics big">${[['99', '%+', 'Average HPLC purity'], ['24', 'h', 'Dispatch before 2 PM ET'], ['100', '%', 'Lots third-party tested'], ['7', '×', 'Tests in our release panel']].map(([a, b, c]) => `<div><strong>${a}<span class="gold">${b}</span></strong><small>${c}</small></div>`).join('')}</div></div></section>`,
  });

  // theme-only behaviors
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-search], [data-promo-close]');
    if (!t) return;
    if ('search' in t.dataset) {
      PS.openModal(`<div class="search-modal">${eyebrow('Search')}<form data-form="search" role="search" class="shop-search big">${icon('search')}<input class="input" name="q" placeholder="Search compounds, e.g. BPC-157" aria-label="Search" autofocus></form><div class="search-pop"><span class="muted small">Popular:</span>${['BPC-157', 'TB-500', 'GHK-Cu', 'NAD+', 'Tesamorelin'].map((x) => `<a class="chip" href="#/shop?q=${encodeURIComponent(x)}">${x}</a>`).join('')}</div></div>`);
      setTimeout(() => { const i = document.querySelector('.search-modal input'); if (i) i.focus(); }, 50);
    } else {
      PS.storage.set('promoBar', 1);
      t.closest('.promo-bar').remove();
    }
  });

  PS.boot({ name: 'b', vialTheme: VT, openCartOnAdd: true, header, footer, drawer, summary, pageHead, ageGate, ageDenied, cookieBanner, views });
})();
