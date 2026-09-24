/* Pepsoma — Version A “Clinical”: cream, lavender and deep purple, serif-italic accents,
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

  /* ---------- product card ---------- */
  function card(p, i) {
    const s = p.sizes[0];
    const multi = p.sizes.length > 1;
    return `<article class="pcard reveal" style="--d:${(i || 0) % 4}">
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
    return `<div class="announce"><span class="announce-roll"><span>Free shipping on orders ${PS.money0(PS.config.freeShip)}+</span><span>Orders before ${PS.company.cutoff} ship same day</span><span>A lot-matched COA ships in every box</span></span></div>
    <header class="site-header"><div class="container hdr">
      <a class="logo" href="#/" aria-label="Pepsoma home">pep<i>soma</i></a>
      <nav class="main-nav" aria-label="Main">
        <span class="nav-pill" aria-hidden="true"></span>
        <form class="nav-search show-sm" data-form="search" role="search"><input class="input" name="q" placeholder="Search peptides" aria-label="Search peptides"></form>
        <div class="nav-item dd-wrap"><a href="#/shop" data-nav="shop" class="nav-link">Shop Peptides ${icon('chev')}</a>
          <div class="dd"><a href="#/shop">All peptides <small>${PS.products.length}</small></a>${cats.map((c) => `<a href="#/shop/${c.id}">${c.name} <small>${count(c.id)}</small></a>`).join('')}</div></div>
        <div class="nav-item dd-wrap"><a href="#/shop/stacks" class="nav-link">Research Stacks ${icon('chev')}</a>
          <div class="dd">${stacks.map((p) => `<a href="#/product/${p.id}">${esc(p.name)} <small>${money(p.sizes[0].price)}</small></a>`).join('')}</div></div>
        <div class="nav-item dd-wrap"><a href="#/lab-tests" data-nav="lab-tests" class="nav-link">Resources ${icon('chev')}</a>
          <div class="dd"><a href="#/lab-tests">Lab Tests &amp; COAs</a><a href="#/faq">FAQ</a><a href="#/track">Track Order</a><a href="#/wholesale">Wholesale</a><a href="#/policies">Policies</a></div></div>
        <a href="#/about" data-nav="about" class="nav-link">About</a>
        <a href="#/contact" data-nav="contact" class="nav-link">Contact</a>
        <a href="#/account" class="nav-link show-sm">${u ? 'My account' : 'Sign in'}</a>
      </nav>
      <div class="hdr-actions">
        ${themeButton()}
        <a class="btn btn-primary btn-pill hide-sm" href="#/account">${u ? 'Hi, ' + esc(u.name.split(' ')[0]) : 'Account Login'}</a>
        <a class="btn btn-yellow hide-md" href="#/shop"><em class="serif">Explore Peptides</em></a>
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
    const chip = (p) => `<a class="mchip" href="#/product/${p.id}"><i style="background:${p.accent}"></i><b>${esc(p.name)}</b><span>${esc(catName(p.cat))}</span></a>`;
    const half = Math.ceil(PS.products.length / 2);
    const rowA = PS.products.slice(0, half).map(chip).join(''), rowB = PS.products.slice(half).map(chip).join('');
    const r = (i) => `class="rise" style="--i:${i}"`;
    return {
      html: `
      <section class="hero"><div class="container hero-grid">
        <div class="hero-copy">
          <span ${r(0)}><span class="trust-chip"><span class="live"></span>Independently tested · COA on every lot</span></span>
          <h1><span class="line-mask" style="--i:1"><span>Research peptides,</span></span><span class="line-mask" style="--i:2"><span><span class="swap" data-swap>${['documented', 'verified', 'traceable'].map((w, i) => `<em class="serif ${i ? '' : 'on'}">${w}</em>`).join('')}</span> to the lot.</span></span></h1>
          <p class="lead rise" style="--i:3">Pepsoma supplies high-purity peptides to laboratories and qualified researchers. Every vial is third-party tested, every lot is traceable, and orders ship within 24 hours.</p>
          <div class="btn-row rise" style="--i:4"><a class="btn btn-primary btn-lg" href="#/shop">SHOP PEPTIDES</a><a class="btn btn-yellow btn-lg" href="#/lab-tests"><em class="serif">View lab tests</em></a></div>
          <ul class="hero-checks rise" style="--i:5">${checkItem(`≥${Math.floor(avgPurity)}% average HPLC purity`)}${checkItem('Lot-matched COA')}${checkItem(`Ships before ${PS.company.cutoff}`)}</ul>
        </div>
        <div class="hero-art rise" style="--i:3" data-parallax>
          <div class="hero-blob"></div>
          <div class="hero-vials" data-depth="1"><span class="hv hv1">${PS.vial(PS.getProduct('ghk-cu'), { theme: VT })}</span><span class="hv hv2">${PS.vial(hero, { theme: VT, size: '10 mg' })}</span><span class="hv hv3">${PS.vial(PS.getProduct('nad'), { theme: VT })}</span></div>
          <div class="float-chip fc1" data-depth="2">${icon('shield')}<div><strong>${sampleLot.purity}% purity</strong><small>Current lot · verified</small></div></div>
          <div class="float-chip fc2" data-depth="2.6">${icon('truck')}<div><strong>Ships today</strong><small>Order by ${PS.company.cutoff}</small></div></div>
          <div class="float-chip fc3" data-depth="1.6">${icon('doc')}<div><strong>COA in the box</strong><small>Matched to your vial</small></div></div>
        </div>
      </div></section>

      <section class="chips-band" aria-label="Browse compounds">
        <div class="marquee"><div class="marquee-track">${rowA}</div><div class="marquee-track" aria-hidden="true">${rowA}</div></div>
        <div class="marquee rev"><div class="marquee-track">${rowB}</div><div class="marquee-track" aria-hidden="true">${rowB}</div></div>
      </section>

      <section class="section"><div class="container">
        <div class="sec-head center reveal"><h2>Choose your ${it('research stack')}</h2><p class="lead muted">Pre-built kits of complementary compounds, each vial with its own lot-matched COA. Save up to 15% more with a standing order.</p></div>
        <div class="stack-grid">${stacks.map((p, i) => {
          const s = p.sizes[0];
          return `<article class="stack-card reveal" style="--d:${i % 2}"><a href="#/product/${p.id}" class="stack-img">${img(p)}</a>
            <div class="stack-body"><div class="stack-top"><h3>${esc(p.name)}</h3><span class="pill-y">${esc(p.badge)}</span></div>
            <ul class="checks">${p.includes.map(([id, sz]) => checkItem(`${esc(PS.getProduct(id).name)} · ${PS.getSize(PS.getProduct(id), sz).label}`)).join('')}${checkItem('Lot-matched COA for each vial')}</ul>
            <div class="stack-foot"><div class="price">${money(s.price)} <s>${money(s.compare)}</s></div><a class="btn btn-primary btn-sm" href="#/product/${p.id}">Select stack</a></div></div></article>`;
        }).join('')}</div>
      </div></section>

      <section class="container"><div class="stats reveal">
        <div class="stat"><strong data-count="${avgPurity.toFixed(1)}" data-dec="1" data-suffix="%">0%</strong><span>average HPLC purity, current lots</span></div>
        <div class="stat"><strong data-count="${PS.allLots().length}">0</strong><span>lots tested and on record</span></div>
        <div class="stat"><strong data-count="8">0</strong><span>tests on every certificate</span></div>
        <div class="stat"><strong data-count="24" data-suffix="h">0h</strong><span>dispatch before ${PS.company.cutoff}</span></div>
      </div></section>

      <section class="section"><div class="container">
        <div class="sec-head split-head reveal"><h2>Best-selling ${it('compounds')}</h2><a class="btn btn-ghost" href="#/shop">View full catalog ${icon('arrow')}</a></div>
        <div class="pgrid">${best.map((p, i) => card(p, i)).join('')}</div>
      </div></section>

      <section class="testi"><div class="container">
        <h2 class="reveal">Why labs choose ${it('Pepsoma')}</h2>
        <div class="testi-grid">${PS.testimonials.map((x, i) => `<figure class="testi-card reveal" style="--d:${i}"><div class="stars">${icon('star').repeat(5)}</div><h3>${esc(x.title)}</h3><blockquote>“${esc(x.body)}”</blockquote><figcaption>— ${esc(x.who)} —</figcaption></figure>`).join('')}</div>
        <p class="testi-note">Sample testimonials for demo purposes.</p>
      </div></section>

      <section class="section section-cream"><div class="container">
        <h2 class="center reveal">Inside every ${it('Pepsoma')} order</h2>
        <div class="split reveal" style="margin-top:40px">
          <div class="split-art art-box"><div class="box-card"><div class="box-vials">${PS.productImage(PS.getProduct('stack-recovery'), { theme: VT })}</div><div class="mini-coa"><span>${icon('doc')} Certificate of Analysis</span><strong>${sampleLot.code}</strong><div class="mini-bar"><i style="width:${sampleLot.purity}%"></i></div><small>Purity ${sampleLot.purity}% · Identity conforms</small></div></div></div>
          <div class="split-copy"><h3 class="big">${it('Every shipment')} is built for researchers who:</h3>
            <ul class="checks lg">${checkItem('Need documentation they can file. A printed, lot-matched COA ships in every box.')}${checkItem(`Can’t afford delays. Same-day dispatch before ${PS.company.cutoff} with tracking in hours.`)}${checkItem('Expect integrity. Tamper-evident seals, lot labels and protective, discreet packaging.')}</ul>
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
        <h2>Research you can trace back to the lot.</h2>
        <p>Independently tested · COA in every box · ships in 24 hours</p>
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
            <p class="gallery-disclaimer">${H.disclaimer()}</p>
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
      html: `${pageHead({ eyebrow: 'Secure checkout', title: `Almost ${it('there')}` })}
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
      <div class="split-copy"><h2 class="serif-h">Our ${it('standard')}</h2><p>Pepsoma supplies research peptides to universities, biotech R&amp;D teams, CROs and independent researchers across the United States. We don’t manufacture claims — we publish data.</p>
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
    if (meta) meta.content = effective === 'dark' ? '#100a22' : '#ffffff';
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
    const cyc = e.target.closest('[data-mode-cycle]');
    if (cyc) { const order = ['auto', 'light', 'dark']; applyMode(order[(order.indexOf(getMode()) + 1) % 3], cyc); return; }
    const set = e.target.closest('[data-mode-set]');
    if (set) applyMode(set.dataset.modeSet, set);
  });

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

  // header gains a hairline once you scroll
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

  // hero depth parallax + card spotlight/tilt
  let raf = 0;
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || reduced()) return;
    const card = e.target.closest('.pcard');
    if (card) {
      const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', px * 100 + '%'); card.style.setProperty('--my', py * 100 + '%');
      card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-4px)`;
    }
    const art = document.querySelector('[data-parallax]');
    if (!art || raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = art.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      art.querySelectorAll('[data-depth]').forEach((el) => { const d = +el.dataset.depth; el.style.translate = `${dx * d * 22}px ${dy * d * 18}px`; });
      const v = art.querySelector('.hero-vials');
      if (v) v.style.transform = `rotateY(${dx * 10}deg) rotateX(${-dy * 6}deg)`;
    });
  });
  document.addEventListener('pointerout', (e) => {
    const card = e.target.closest && e.target.closest('.pcard');
    if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
  });

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
    if (el.matches('[data-loop]')) {
      clearInterval(el._loop);
      if (!en.isIntersecting) return;
      const play = () => { el.classList.remove('play'); void el.offsetWidth; el.classList.add('play'); const n = el.querySelector('[data-replay]'); if (n) countUp(n); };
      play();
      if (!reduced()) el._loop = setInterval(play, 7000);
    }
  }), { threshold: 0.3 }) : null;

  // fly-to-cart: a yellow dot arcs from the button into the cart
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
    const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
    const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 140;
    dot.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(.4)`, opacity: 0 },
      { transform: `translate(${x0}px, ${y0 - 20}px) scale(1)`, opacity: 1, offset: 0.12 },
      { transform: `translate(${mx}px, ${my}px) scale(.9)`, offset: 0.55 },
      { transform: `translate(${x1}px, ${y1}px) scale(.3)`, opacity: 0.6 },
    ], { duration: 650, easing: 'cubic-bezier(.45,0,.25,1)' }).onfinish = () => { dot.remove(); bump(); };
    dot.style.left = '0px'; dot.style.top = '0px';
  });

  // runs after every page render
  function afterRender(route, main) {
    main.classList.remove('entered', 'page-enter');
    void main.offsetWidth;
    main.classList.add('entered', 'page-enter');
    if (io) main.querySelectorAll('[data-count]:not([data-replay]), [data-observe], [data-loop]').forEach((el) => io.observe(el));
    else main.querySelectorAll('[data-count]').forEach(countUp);
    PS.$$('.theme-btn, .seg').length && syncModeUI();
    movePill(null);
  }

  // keep the toggle labels right after the header re-renders (sign in / out)
  PS.on('auth', () => setTimeout(syncModeUI));

  PS.boot({ name: 'a', vialTheme: VT, cartDelay: 560, header, footer, drawer, summary, pageHead, ageGate, ageDenied, cookieBanner, views, afterRender });
  syncModeUI();
})();
