/* Pepsoma — core engine: storage, events, pricing, cart, orders, accounts, router.
   Everything persists in the browser (localStorage) so the demo is fully clickable
   without a backend. Swap these modules for API calls when wiring up real commerce. */
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
      { id: '8w', label: 'Standing order · every 8 weeks', short: 'Every 8 weeks', pct: 10, weeks: 8 },
    ],
    // Volume savings on one-time vials (highest qualifying tier wins)
    tiers: [ { min: 10, pct: 15 }, { min: 5, pct: 10 }, { min: 3, pct: 5 } ],
    promos: {
      WELCOME10: { pct: 10, label: '10% off your order' },
      LAB15: { pct: 15, min: 250, label: '15% off orders $250+' },
      SHIPFREE: { freeShip: true, label: 'Free standard shipping' },
    },
  };
  PS.getPlan = (id) => PS.config.plans.find((p) => p.id === id) || PS.config.plans[0];
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
      const tier = C.tiers.find((t) => onceQty >= t.min) || null;
      const nextTier = C.tiers.slice().reverse().find((t) => t.min > onceQty) || null;
      const tierDiscount = tier ? PS.round(sum(once, (l) => l.total) * tier.pct / 100) : 0;
      const afterItems = PS.round(subtotal - tierDiscount);
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
      const savings = PS.round(sum(lines, (l) => ((l.compare || l.base) - l.unit) * l.qty) + tierDiscount + promoDiscount);
      return {
        lines, count: lines.reduce((s, l) => s + l.qty, 0), subtotal, onceQty, tier, nextTier, tierDiscount, afterItems,
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
    { id: 'verified', label: 'Research attestation verified', at: 1 },
    { id: 'packed', label: 'Packed with lot-matched COA', at: 3 },
    { id: 'shipped', label: 'Shipped', at: 8 },
    { id: 'delivered', label: 'Delivered', at: 30 },
  ];
  PS.orders = {
    all: () => PS.storage.get('orders', []),
    get: (num) => PS.orders.all().find((o) => o.number === String(num).trim().toUpperCase()),
    find(num, email) {
      const o = this.get(num);
      return o && o.email.toLowerCase() === String(email).trim().toLowerCase() ? o : null;
    },
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
        method: { id: totals.method.id, label: totals.method.label, eta: totals.method.eta },
        items: totals.lines.map((l) => ({ id: l.id, name: l.product.name, size: l.sizeObj.label, plan: l.planObj.short, planId: l.planObj.id, qty: l.qty, unit: l.unit, total: l.total })),
        subtotal: totals.subtotal, tierDiscount: totals.tierDiscount, tierPct: totals.tier ? totals.tier.pct : 0,
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
    // Demo timeline is accelerated: statuses advance over minutes instead of days.
    status(order) {
      const mins = (Date.now() - order.createdAt) / 60000;
      let idx = 0;
      STATUS.forEach((s, i) => { if (mins >= s.at) idx = i; });
      return { steps: STATUS.map((s, i) => Object.assign({}, s, { done: i <= idx, current: i === idx, time: order.createdAt + s.at * 60000 })), current: STATUS[idx] };
    },
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
      if (!u || u.hash !== (await sha(email + ':' + password))) return { ok: false, msg: 'Email or password is incorrect.' };
      PS.storage.set('session', email);
      PS.emit('auth');
      return { ok: true };
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

  /* ---------- hash router ---------- */
  PS.routes = [
    ['/', 'home'], ['/shop', 'shop'], ['/shop/:cat', 'shop'], ['/product/:id', 'product'], ['/cart', 'cart'],
    ['/checkout', 'checkout'], ['/order/:num', 'order'], ['/track', 'track'], ['/lab-tests', 'labs'], ['/faq', 'faq'],
    ['/about', 'about'], ['/contact', 'contact'], ['/wholesale', 'wholesale'], ['/account', 'account'],
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
