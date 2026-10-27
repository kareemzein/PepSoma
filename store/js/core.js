/* Pepsoma — core engine: storage, events, pricing, cart, orders, accounts, router.
   Everything persists in the browser (localStorage) so the demo is fully clickable
   without a backend. js/backend.js swaps PS.auth and PS.orders for Supabase when it's configured and reachable. */
(function () {
  const PS = (window.PS = window.PS || {});

  /* ---------- storage (falls back to memory if localStorage is blocked) ---------- */
  const PREFIX = 'pepsoma.';
  const mem = {};
  PS.storage = {
    get(k, d) {
      try {
        const v = localStorage.getItem(PREFIX + k);
        if (v != null) return JSON.parse(v);
      } catch (e) { /* ignore */ }
      return k in mem ? mem[k] : d;
    },
    set(k, v) {
      mem[k] = v;
      try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { /* ignore */ }
    },
    remove(k) {
      delete mem[k];
      try { localStorage.removeItem(PREFIX + k); } catch (e) { /* ignore */ }
    },
  };

  /* ---------- events ---------- */
  const subs = {};
  PS.on = (ev, fn) => (subs[ev] = subs[ev] || []).push(fn);
  PS.emit = (ev, data) => (subs[ev] || []).forEach((fn) => fn(data));

  /* ---------- utils ---------- */
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  PS.money = (n) => fmt.format(n || 0);
  PS.money0 = (n) => '$' + Math.round(n).toLocaleString('en-US');
  PS.round = (n) => Math.round(n * 100) / 100;
  PS.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  PS.hash = (s) => {
    let h = 1779033703 ^ s.length;
    for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return h >>> 0;
  };
  PS.rng = (seed) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  PS.date = (ts, opts) => new Date(ts).toLocaleDateString('en-US', opts || { month: 'short', day: 'numeric', year: 'numeric' });
  PS.time = (ts) => new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  /* ---------- commerce config ---------- */
  PS.config = {
    freeShip: 150,
    shipping: [
      { id: 'standard', label: 'Standard — USPS Priority', eta: '2–4 business days', price: 9.95, freeEligible: true },
      { id: 'express', label: 'Express — UPS 2nd Day Air', eta: '2 business days', price: 24.95 },
      { id: 'overnight', label: 'Overnight — UPS Next Day Air', eta: 'Next business day', price: 44.95 },
    ],
    plans: [
      { id: 'once', label: 'One-time purchase', short: 'One-time', pct: 0 },
      { id: '4w', label: 'Standing order · every 4 weeks', short: 'Every 4 weeks', pct: 15, weeks: 4 },
      // chosen on the product page: the cart and orders carry the period in the plan id ('c6' = every 6 weeks), see PS.getPlan
      { id: 'custom', label: 'Standing order · custom', short: 'Custom', pct: 10, custom: true },
    ],
    // One-time vial deal: 'volume' = tiers below (highest qualifying tier wins);
    // 'bogo' = Buy 1 Get 1 — every second vial of the same product and size is free (stacks excluded); 'off' = no deal
    deal: 'volume',
    tiers: [ { min: 10, pct: 15 }, { min: 5, pct: 10 }, { min: 3, pct: 5 } ],
    promos: {
      WELCOME10: { pct: 10, label: '10% off your order' },
      LAB15: { pct: 15, min: 250, label: '15% off orders $250+' },
      SHIPFREE: { freeShip: true, label: 'Free standard shipping' },
    },
    // Built but waiting on a decision: products with a matching `flag` (js/data.js) stay hidden, and the header's
    // Supplies link stays off, until switched on here. Preview without switching: add ?preview=sprays,supplies to the address (before the #).
    features: { sprays: false, supplies: false, retatrutide: false },
  };
  new URLSearchParams(location.search).getAll('preview').join(',').split(',').forEach((f) => { if (f in PS.config.features) PS.config.features[f] = true; });
  PS.featured = (p) => !p.flag || PS.config.features[p.flag];
  PS.products = PS.products.filter(PS.featured);
  // 'once', '4w', 'custom' (the product page's Custom option), or 'cN' (custom, every N weeks, 1–12) that a cart line or order was saved with.
  // 'Nw' ids from before Custom existed (the old 8-week plan) read as custom too.
  PS.getPlan = (id) => {
    const found = PS.config.plans.find((p) => p.id === id);
    if (found) return found;
    const m = /^(?:c(\d+)|(\d+)w)$/.exec(id);
    if (!m) return PS.config.plans[0];
    const n = Math.max(1, Math.min(12, +(m[1] || m[2])));
    return { id: 'c' + n, custom: true, label: `Standing order · every ${n} week${n > 1 ? 's' : ''}`, short: n > 1 ? `Every ${n} weeks` : 'Every week', pct: 10, weeks: n };
  };
  PS.getSize = (p, id) => p.sizes.find((s) => s.id === id) || p.sizes[0];
  PS.minPrice = (p) => Math.min(...p.sizes.map((s) => s.price));

  /* ---------- cart ---------- */
  let cart = PS.storage.get('cart', { items: [], promo: null });
  if (!cart || !Array.isArray(cart.items)) cart = { items: [], promo: null };
  const saveCart = () => { PS.storage.set('cart', cart); PS.emit('cart', cart); };

  PS.cart = {
    items: () => cart.items,
    promo: () => cart.promo,
    count: () => cart.items.reduce((s, i) => s + i.qty, 0),
    add(id, size, qty, plan) {
      const p = PS.getProduct(id);
      if (!p) return;
      size = PS.getSize(p, size).id;
      plan = PS.getPlan(plan).id;
      qty = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
      const key = [id, size, plan].join('|');
      const ex = cart.items.find((i) => i.key === key);
      if (ex) ex.qty = Math.min(99, ex.qty + qty);
      else cart.items.push({ key, id, size, plan, qty });
      saveCart();
    },
    setQty(key, q) {
      q = parseInt(q, 10) || 0;
      if (q <= 0) return this.remove(key);
      const it = cart.items.find((i) => i.key === key);
      if (it) { it.qty = Math.min(99, q); saveCart(); }
    },
    remove(key) { cart.items = cart.items.filter((i) => i.key !== key); saveCart(); },
    clear() { cart = { items: [], promo: null }; saveCart(); },
    applyPromo(code) {
      code = String(code || '').trim().toUpperCase();
      const p = PS.config.promos[code];
      if (!code) return { ok: false, msg: 'Enter a promo code.' };
      if (!p) return { ok: false, msg: `“${code}” isn’t a valid code.` };
      const t = this.totals();
      if (p.min && t.afterItems < p.min) return { ok: false, msg: `${code} needs a subtotal of ${PS.money(p.min)} or more.` };
      cart.promo = code;
      saveCart();
      return { ok: true, msg: `${code} applied — ${p.label}.` };
    },
    removePromo() { cart.promo = null; saveCart(); },
    totals(shipId) {
      const C = PS.config;
      const lines = cart.items.map((it) => {
        const p = PS.getProduct(it.id);
        if (!p) return null;
        const s = PS.getSize(p, it.size);
        const plan = PS.getPlan(it.plan);
        const unit = PS.round(s.price * (1 - plan.pct / 100));
        return Object.assign({}, it, { product: p, sizeObj: s, planObj: plan, base: s.price, compare: s.compare, unit, total: PS.round(unit * it.qty) });
      }).filter(Boolean);
      const sum = (arr, f) => PS.round(arr.reduce((s, x) => s + f(x), 0));
      const subtotal = sum(lines, (l) => l.total);
      const once = lines.filter((l) => l.planObj.id === 'once');
      const onceQty = once.reduce((s, l) => s + l.qty, 0);
      const bogo = C.deal === 'bogo';
      const volume = C.deal === 'volume';
      const tier = volume ? C.tiers.find((t) => onceQty >= t.min) || null : null;
      const nextTier = volume ? C.tiers.slice().reverse().find((t) => t.min > onceQty) || null : null;
      const tierDiscount = tier ? PS.round(sum(once, (l) => l.total) * tier.pct / 100) : 0;
      const bogoLines = bogo ? once.filter((l) => !l.product.includes) : [];
      bogoLines.forEach((l) => { l.free = Math.floor(l.qty / 2); });
      const dealFree = bogoLines.reduce((s, l) => s + l.free, 0);
      const dealDiscount = sum(bogoLines, (l) => l.free * l.unit);
      const dealOdd = bogoLines.filter((l) => l.qty % 2);
      const afterItems = PS.round(subtotal - tierDiscount - dealDiscount);
      let promo = null, promoDiscount = 0, freeShipPromo = false;
      if (cart.promo) {
        const p = C.promos[cart.promo];
        if (p && (!p.min || afterItems >= p.min)) {
          promo = Object.assign({ code: cart.promo }, p);
          if (p.pct) promoDiscount = PS.round(afterItems * p.pct / 100);
          if (p.freeShip) freeShipPromo = true;
        }
      }
      const merch = PS.round(afterItems - promoDiscount);
      const method = C.shipping.find((m) => m.id === shipId) || C.shipping[0];
      const freeStandard = freeShipPromo || afterItems >= C.freeShip;
      const shipPrice = (m) => (m.freeEligible && freeStandard ? 0 : m.price);
      const shipping = lines.length ? shipPrice(method) : 0;
      const savings = PS.round(sum(lines, (l) => ((l.compare || l.base) - l.unit) * l.qty) + tierDiscount + dealDiscount + promoDiscount);
      return {
        lines, count: lines.reduce((s, l) => s + l.qty, 0), subtotal, onceQty, tier, nextTier, tierDiscount, afterItems,
        deal: C.deal, dealFree, dealDiscount, dealOdd,
        promo, promoCode: cart.promo, promoDiscount, merch, method, shipping, shipPrice, freeStandard,
        total: PS.round(merch + shipping), savings,
        freeShipRemaining: Math.max(0, PS.round(C.freeShip - afterItems)),
        freeShipProgress: Math.min(1, afterItems / C.freeShip),
        hasSubs: lines.some((l) => l.planObj.pct > 0),
      };
    },
  };

  /* ---------- orders ---------- */
  const STATUS = [
    { id: 'placed', label: 'Order placed', at: 0 },
    { id: 'verified', label: 'Research-use terms accepted', at: 0 }, // ticked at checkout, so done the moment the order exists
    { id: 'packed', label: 'Packed with lot-matched COA', at: 3 },
    { id: 'shipped', label: 'Shipped', at: 60 }, // not before the one-hour window to change the address closes
    { id: 'delivered', label: 'Delivered', at: 180 },
  ];
  PS.orders = {
    all: () => PS.storage.get('orders', []),
    get: (num) => PS.orders.all().find((o) => o.number === String(num).trim().toUpperCase()),
    find(num, email) {
      const o = this.get(num);
      return o && o.email.toLowerCase() === String(email).trim().toLowerCase() ? o : null;
    },
    // async so js/backend.js can look the order up on the server when it isn't on this device
    lookup: async (num, email) => PS.orders.find(num, email),
    forEmail: (email) => PS.orders.all().filter((o) => o.email.toLowerCase() === String(email).toLowerCase()),
    create(data, totals) {
      const r = PS.rng(Date.now());
      const number = 'PS' + String(Math.floor(100000 + r() * 900000));
      const order = {
        number,
        createdAt: Date.now(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone || '',
        name: `${data.first} ${data.last}`.trim(),
        org: data.org || '',
        address: { line1: data.address1, line2: data.address2 || '', city: data.city, state: data.state, zip: data.zip },
        billing: data.billingSame ? null : { line1: data.baddress1, line2: data.baddress2 || '', city: data.bcity, state: data.bstate, zip: data.bzip },
        method: { id: totals.method.id, label: totals.method.label, eta: totals.method.eta },
        items: totals.lines.map((l) => ({ id: l.id, name: l.product.name, size: l.sizeObj.label, plan: l.planObj.short, planId: l.planObj.id, weeks: l.planObj.weeks || 0, qty: l.qty, unit: l.unit, total: l.total })),
        subtotal: totals.subtotal, tierDiscount: totals.tierDiscount, tierPct: totals.tier ? totals.tier.pct : 0,
        dealDiscount: totals.dealDiscount, dealFree: totals.dealFree,
        promo: totals.promo ? totals.promo.code : null, promoDiscount: totals.promoDiscount,
        shipping: totals.shipping, total: totals.total,
        payment: { brand: PS.cardBrand(data.card), last4: String(data.card).replace(/\D/g, '').slice(-4) },
        tracking: '9400 1' + Array.from({ length: 17 }, () => Math.floor(r() * 10)).join('').replace(/(\d{4})/g, '$1 ').trim(),
      };
      const list = PS.orders.all();
      list.unshift(order);
      PS.storage.set('orders', list);
      PS.emit('orders', order);
      return order;
    },
    // the shipping address can be changed for an hour after ordering, as long as the order hasn't shipped
    editUntil: (order) => order.createdAt + 60 * 60000,
    editable(order) {
      const st = PS.orders.status(order).current.id;
      return Date.now() < PS.orders.editUntil(order) && st !== 'shipped' && st !== 'delivered';
    },
    // keeps what the order said before each change in addressEdits. Checks the window again, since the form can sit open past it
    updateAddress(num, next) {
      const list = PS.orders.all(), o = list.find((x) => x.number === num);
      if (!o || !PS.orders.editable(o)) return { ok: false, msg: 'The one-hour window to change this address has closed.' };
      o.addressEdits = (o.addressEdits || []).concat({ at: Date.now(), from: { name: o.name, org: o.org, phone: o.phone, address: o.address } });
      Object.assign(o, next);
      PS.storage.set('orders', list);
      PS.emit('orders', o);
      return { ok: true };
    },
    // Demo timeline is accelerated: statuses advance over minutes instead of days.
    status(order) {
      const mins = (Date.now() - order.createdAt) / 60000;
      let idx = 0;
      STATUS.forEach((s, i) => { if (mins >= s.at) idx = i; });
      return { steps: STATUS.map((s, i) => Object.assign({}, s, { done: i <= idx, current: i === idx, time: order.createdAt + s.at * 60000 })), current: STATUS[idx] };
    },
  };

  /* ---------- saved details: "Save my details for next time" at checkout (this browser only; never card data) ----------
     PS.storage 'savedDetails' is { email, phone, first, last, org, address: { line1, line2, city, state, zip }, billing: null (same as shipping) or the same shape }. */
  const addr = (a) => ['line1', 'line2', 'city', 'state', 'zip'].reduce((o, k) => { o[k] = String((a && a[k]) || '').trim(); return o; }, {});
  PS.details = {
    get: () => PS.storage.get('savedDetails', null),
    // only these fields are ever kept, so nothing else (a card, say) can end up in storage
    set(d) {
      const s = (k) => String(d[k] || '').trim();
      PS.storage.set('savedDetails', { email: s('email'), phone: s('phone'), first: s('first'), last: s('last'), org: s('org'), address: addr(d.address), billing: d.billing ? addr(d.billing) : null });
    },
    clear: () => PS.storage.remove('savedDetails'),
    // the details in a submitted checkout form (the form's field names, as formData gives them)
    fromForm: (data) => ({
      email: data.email, phone: data.phone, first: data.first, last: data.last, org: data.org,
      address: { line1: data.address1, line2: data.address2, city: data.city, state: data.state, zip: data.zip },
      billing: data.billingSame ? null : { line1: data.baddress1, line2: data.baddress2, city: data.bcity, state: data.bstate, zip: data.bzip },
    }),
  };

  /* ---------- accounts (demo: stored locally, passwords hashed) ---------- */
  async function sha(s) {
    try {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
    } catch (e) { return 'h' + PS.hash(s); }
  }
  PS.auth = {
    current() {
      const e = PS.storage.get('session', null);
      const u = e && PS.storage.get('users', {})[e];
      return u ? { email: e, name: u.name, created: u.created } : null;
    },
    async signUp({ name, email, password }) {
      email = String(email).trim().toLowerCase();
      const users = PS.storage.get('users', {});
      if (users[email]) return { ok: false, msg: 'An account with that email already exists — sign in instead.' };
      users[email] = { name: String(name).trim(), hash: await sha(email + ':' + password), created: Date.now() };
      PS.storage.set('users', users);
      PS.storage.set('session', email);
      PS.emit('auth');
      return { ok: true };
    },
    async signIn({ email, password }) {
      email = String(email).trim().toLowerCase();
      const u = PS.storage.get('users', {})[email];
      if (!u || u.hash !== (await sha((u.salt || email) + ':' + password))) return { ok: false, msg: 'Email or password is incorrect.' };
      PS.storage.set('session', email);
      PS.emit('auth');
      return { ok: true };
    },
    // Profile edit: a new name and/or email for the signed-in account. A new email moves the record (and its orders) to that email;
    // the password hash was made with the first email, so `salt` remembers it.
    update({ name, email }) {
      const old = PS.storage.get('session', null), users = PS.storage.get('users', {}), u = old && users[old];
      if (!u) return { ok: false, msg: 'Sign in again to edit your profile.' };
      email = String(email).trim().toLowerCase();
      if (email !== old) {
        if (users[email]) return { ok: false, msg: 'An account with that email already exists.' };
        delete users[old];
        users[email] = Object.assign({}, u, { salt: u.salt || old });
        PS.storage.set('session', email);
        PS.storage.set('orders', PS.orders.all().map((o) => (o.email === old ? Object.assign({}, o, { email }) : o)));
      }
      users[email].name = String(name).trim();
      PS.storage.set('users', users);
      return { ok: true }; // the caller emits 'auth' once its other changes are saved
    },
    signOut() { PS.storage.remove('session'); PS.emit('auth'); },
  };

  /* ---------- validation ---------- */
  PS.cardBrand = (n) => {
    n = String(n).replace(/\D/g, '');
    if (/^4/.test(n)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    if (/^6(011|5)/.test(n)) return 'Discover';
    return 'Card';
  };
  PS.valid = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    zip: (v) => /^\d{5}(-\d{4})?$/.test(v.trim()),
    phone: (v) => !v.trim() || v.replace(/\D/g, '').length >= 10,
    card(v) {
      const d = v.replace(/\D/g, '');
      if (d.length < 13 || d.length > 19) return false;
      let sum = 0, alt = false;
      for (let i = d.length - 1; i >= 0; i--) {
        let n = +d[i];
        if (alt) { n *= 2; if (n > 9) n -= 9; }
        sum += n; alt = !alt;
      }
      return sum % 10 === 0;
    },
    exp(v) {
      const m = v.match(/^(\d{2})\s*\/\s*(\d{2})$/);
      if (!m) return false;
      const mo = +m[1], yr = 2000 + +m[2];
      return mo >= 1 && mo <= 12 && new Date(yr, mo, 1) > new Date();
    },
    cvc: (v) => /^\d{3,4}$/.test(v.trim()),
    password: (v) => v.length >= 8,
  };

  PS.states = [['', 'Select…'], ...'AL Alabama|AK Alaska|AZ Arizona|AR Arkansas|CA California|CO Colorado|CT Connecticut|DE Delaware|DC District of Columbia|FL Florida|GA Georgia|HI Hawaii|ID Idaho|IL Illinois|IN Indiana|IA Iowa|KS Kansas|KY Kentucky|LA Louisiana|ME Maine|MD Maryland|MA Massachusetts|MI Michigan|MN Minnesota|MS Mississippi|MO Missouri|MT Montana|NE Nebraska|NV Nevada|NH New Hampshire|NJ New Jersey|NM New Mexico|NY New York|NC North Carolina|ND North Dakota|OH Ohio|OK Oklahoma|OR Oregon|PA Pennsylvania|RI Rhode Island|SC South Carolina|SD South Dakota|TN Tennessee|TX Texas|UT Utah|VT Vermont|VA Virginia|WA Washington|WV West Virginia|WI Wisconsin|WY Wyoming|AA Armed Forces Americas|AE Armed Forces Europe|AP Armed Forces Pacific'
    .split('|').map((s) => [s.slice(0, 2), s.slice(3)])];

  /* ---------- variants: review mode's New / New B / New C compare chips ---------- */
  // PS.variant(id) is 'new' unless review mode picked another ('b', 'c', ...) for that id. Picks only count while review mode is on and are
  // kept per tab (sessionStorage). Each id is also mirrored on <html> as data-var-<id>="<variant>", so CSS can key off it; a view reads PS.variant(id) when it renders.
  const VARS = 'pepsoma.variants';
  let picks = {};
  try { picks = JSON.parse(sessionStorage.getItem(VARS)) || {}; } catch (e) { /* blocked storage: lasts until reload */ }
  const reviewing = () => {
    try { return /[?&]review(=|&|$)/.test(location.search) || sessionStorage.getItem('pepsoma.review') === '1'; } catch (e) { return /[?&]review(=|&|$)/.test(location.search); }
  };
  PS.variant = (id) => (reviewing() && picks[id]) || 'new';
  PS.setVariant = (id, v) => {
    if (!reviewing()) return;
    if (v && v !== 'new') picks[id] = v; else delete picks[id];
    try { sessionStorage.setItem(VARS, JSON.stringify(picks)); } catch (e) { /* ignore */ }
    document.documentElement.setAttribute('data-var-' + id, PS.variant(id));
    PS.emit('route'); // draw the current view again with the new pick
    PS.emit('variant', { id, variant: PS.variant(id) });
  };
  if (reviewing()) Object.keys(picks).forEach((id) => document.documentElement.setAttribute('data-var-' + id, picks[id]));

  /* ---------- hash router ---------- */
  PS.routes = [
    ['/', 'home'], ['/shop', 'shop'], ['/shop/:cat', 'shop'], ['/product/:id', 'product'], ['/cart', 'cart'],
    ['/checkout', 'checkout'], ['/order/:num', 'order'], ['/track', 'track'], ['/lab-tests', 'labs'], ['/coa/:code', 'coa'], ['/faq', 'faq'],
    ['/about', 'about'], ['/contact', 'contact'], ['/wholesale', 'wholesale'], ['/account', 'account'], ['/signup', 'signup'], ['/orders', 'orders'],
    ['/policies', 'policies'], ['/policies/:slug', 'policy'],
  ];
  PS.parseHash = () => {
    const h = decodeURI(location.hash.replace(/^#/, '')) || '/';
    const [path, qs] = h.split('?');
    const query = {};
    new URLSearchParams(qs || '').forEach((v, k) => { query[k] = v; });
    for (const [pattern, name] of PS.routes) {
      const a = pattern.split('/').filter(Boolean), b = path.split('/').filter(Boolean);
      if (a.length !== b.length) continue;
      const params = {};
      if (a.every((seg, i) => (seg[0] === ':' ? ((params[seg.slice(1)] = b[i]), true) : seg === b[i]))) return { name, params, query, path };
    }
    return { name: 'notFound', params: {}, query, path };
  };
  PS.go = (h) => { if (location.hash === h) PS.emit('route'); else location.hash = h; };
})();
