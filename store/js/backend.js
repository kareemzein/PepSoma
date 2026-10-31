/* Pepsoma — Supabase backend: accounts (Supabase Auth), catalog and orders (Postgres with row-level security).
   Calls Supabase's REST endpoints with fetch, so there's still no build step or dependency.
   The keys come from js/env.js (written from .env by tools/env.mjs, or by the deploy). Without keys, or when
   Supabase can't be reached, the browser-only demo in core.js keeps running. Schema: supabase/*.sql. */
(function () {
  const PS = window.PS;
  const env = window.PS_ENV || {};
  const BASE = String(env.supabaseUrl || '').replace(/\/+$/, '');
  const KEY = env.supabaseAnonKey || '';
  PS.backend = { enabled: !!(BASE && KEY), online: false, signedIn: () => false };
  if (!PS.backend.enabled) return;

  const local = {
    auth: PS.auth, details: Object.assign({}, PS.details), subs: Object.assign({}, PS.subs),
    get: PS.orders.get, forEmail: PS.orders.forEmail, create: PS.orders.create, status: PS.orders.status,
    editable: PS.orders.editable, editUntil: PS.orders.editUntil, updateAddress: PS.orders.updateAddress,
  };
  const OFFLINE = 'Can’t reach the server right now. Please try again.';

  // Resolves with { ok, status, data }; rejects only when Supabase can't be reached (network error or timeout)
  async function api(path, { method = 'GET', body, token, headers, timeout = 8000 } = {}) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    try {
      const res = await fetch(BASE + path, {
        method, signal: ctl.signal, body: body && JSON.stringify(body),
        headers: Object.assign({ apikey: KEY, 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}, headers),
      });
      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { /* not JSON */ }
      PS.backend.online = true;
      return { ok: res.ok, status: res.status, data };
    } finally { clearTimeout(timer); }
  }

  /* ---------- session ---------- */
  const session = () => PS.storage.get('sb.session', null);
  function saveSession(s) {
    if (!s || !s.access_token) { ['session', 'orders', 'profile', 'subs'].forEach((k) => PS.storage.remove('sb.' + k)); return; }
    PS.storage.set('sb.session', {
      access_token: s.access_token, refresh_token: s.refresh_token, user: s.user,
      expires_at: s.expires_at || Math.floor(Date.now() / 1000) + (s.expires_in || 3600),
    });
  }
  // A valid access token for the signed-in customer (refreshed when close to expiry), or null when signed out
  async function token() {
    const s = session();
    if (!s) return null;
    if (s.expires_at * 1000 - Date.now() > 60000) return s.access_token;
    const r = await api('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: s.refresh_token } });
    if (r.status === 400 || r.status === 401) { saveSession(null); PS.emit('auth'); return null; }
    if (!r.ok) return null;
    saveSession(r.data);
    return r.data.access_token;
  }
  PS.backend.signedIn = () => !!session();
  const toUser = (u) => ({ id: u.id, email: u.email, name: (u.user_metadata && u.user_metadata.name) || u.email.split('@')[0], created: Date.parse(u.created_at), pendingEmail: u.new_email || '' });
  const MSG = {
    invalid_credentials: 'Email or password is incorrect.',
    email_not_confirmed: 'Confirm your email first: open the link we sent you, then sign in.',
    user_already_exists: 'An account with that email already exists — sign in instead.',
    email_exists: 'An account with that email already exists.',
    weak_password: 'Choose a stronger password (at least 8 characters).',
    over_email_send_rate_limit: 'Too many sign-ups right now. Try again in a few minutes.',
    email_address_not_authorized: 'We can’t send email to that address yet. Try again later.',
  };
  const authMsg = (r) => MSG[r.data && r.data.error_code] || (r.data && (r.data.msg || r.data.error_description || r.data.message)) || 'Something went wrong. Try again.';
  const fellBack = () => { if (PS.toast) PS.toast('Can’t reach the server — using a demo account saved in this browser.'); };

  PS.auth = {
    current() {
      const s = session();
      return s && s.user ? toUser(s.user) : local.auth.current();
    },
    async signUp(d) {
      const email = String(d.email).trim().toLowerCase();
      let r;
      try {
        r = await api('/auth/v1/signup?redirect_to=' + encodeURIComponent(location.origin + location.pathname), { method: 'POST', body: { email, password: d.password, data: { name: String(d.name).trim() } } });
      } catch (e) { fellBack(); return local.auth.signUp(d); }
      if (!r.ok) return { ok: false, msg: authMsg(r) };
      // With "Confirm email" on, Supabase returns the user without a session until the link is opened
      if (!r.data.access_token) return { ok: true, pending: true, msg: `Almost done: we sent a confirmation link to ${email}. Open it to finish creating your account.` };
      saveSession(r.data);
      await loadAccount(true);
      PS.emit('auth');
      return { ok: true };
    },
    async signIn(d) {
      let r;
      try {
        r = await api('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: String(d.email).trim().toLowerCase(), password: d.password } });
      } catch (e) { fellBack(); return local.auth.signIn(d); }
      if (!r.ok) return { ok: false, msg: authMsg(r) };
      saveSession(r.data);
      await loadAccount(true);
      PS.emit('auth');
      return { ok: true };
    },
    // A new email takes effect only after the confirmation link is opened, so the old one keeps working until then.
    // The caller emits 'auth' once its other changes are saved.
    async update({ name, email }) {
      if (!session()) return local.auth.update({ name, email });
      email = String(email).trim().toLowerCase();
      const body = { data: { name: String(name).trim() } }, changing = email !== session().user.email;
      if (changing) body.email = email;
      try {
        const r = await api('/auth/v1/user?redirect_to=' + encodeURIComponent(location.origin + location.pathname), { method: 'PUT', token: await token(), body });
        if (!r.ok) return { ok: false, msg: authMsg(r) };
        saveSession(Object.assign({}, session(), { user: r.data }));
        return changing && r.data.email !== email ? { ok: true, pending: true, msg: `Saved. Check your inbox to confirm ${email}. Your current email keeps working until then.` } : { ok: true };
      } catch (e) { return { ok: false, msg: OFFLINE }; }
    },
    signOut() {
      const s = session();
      saveSession(null);
      if (s) api('/auth/v1/logout', { method: 'POST', token: s.access_token }).catch(() => {});
      local.auth.signOut();
    },
  };

  /* ---------- account data: cached in this browser (the pages render without waiting) and cleared on sign-out ---------- */
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const cache = (k, v) => { if (same(v, PS.storage.get('sb.' + k, null))) return false; PS.storage.set('sb.' + k, v); return true; };
  async function fetchOrders(t) {
    const r = await api('/rest/v1/rpc/my_orders', { method: 'POST', token: t, body: {} });
    return r.ok && Array.isArray(r.data) && cache('orders', r.data);
  }
  async function fetchProfile(t, uid) {
    const r = await api(`/rest/v1/profiles?id=eq.${uid}&select=*`, { token: t });
    return r.ok && Array.isArray(r.data) && r.data[0] ? cache('profile', r.data[0]) : false;
  }
  async function fetchSubs(t) {
    const r = await api('/rest/v1/standing_orders?select=*', { token: t });
    return r.ok && Array.isArray(r.data) && cache('subs', r.data);
  }
  async function fetchUser(t) {
    const r = await api('/auth/v1/user', { token: t });
    if (!r.ok || same(r.data, session().user)) return false;
    saveSession(Object.assign({}, session(), { user: r.data }));
    return true;
  }
  // a redraw would throw away a half-filled form, and whatever changed shows on the next page anyway
  const busy = () => !!document.querySelector('#view form[data-form="checkout"], #view form[data-form="profile"], #ps-modal:not([hidden])');
  // quiet: the caller redraws the page itself
  async function loadAccount(quiet) {
    try {
      const t = await token();
      if (!t) return;
      const uid = session().user.id;
      const [orders, profile, subs, user] = await Promise.all([fetchOrders(t), fetchProfile(t, uid), fetchSubs(t), fetchUser(t)]);
      if (quiet || busy()) return;
      if (profile || user) PS.emit('auth');
      if (orders || subs) PS.emit('orders');
    } catch (e) { /* offline: keep what's cached */ }
  }

  /* ---------- saved details: the customer's profile row. Signed out, they stay in this browser as in core.js ---------- */
  const addressOrNull = (a) => (a && a.line1 ? ['line1', 'line2', 'city', 'state', 'zip'].reduce((o, k) => { o[k] = String(a[k] || '').trim(); return o; }, {}) : null);
  PS.details.get = () => {
    if (!session()) return local.details.get();
    const p = PS.storage.get('sb.profile', null);
    if (!p || !(p.phone || p.org || p.shipping_address || p.billing_address)) return null;
    return { email: session().user.email, phone: p.phone, first: p.first_name, last: p.last_name, org: p.org, address: p.shipping_address || {}, billing: p.billing_address };
  };
  PS.details.set = async (d) => {
    if (!session()) return local.details.set(d);
    const s = (k) => String(d[k] || '').trim();
    try {
      const t = await token();
      const r = await api(`/rest/v1/profiles?id=eq.${session().user.id}`, { method: 'PATCH', token: t, headers: { Prefer: 'return=representation' }, body: { first_name: s('first'), last_name: s('last'), phone: s('phone'), org: s('org'), shipping_address: addressOrNull(d.address), billing_address: addressOrNull(d.billing) } });
      if (!r.ok || !Array.isArray(r.data) || !r.data[0]) return { ok: false, msg: 'We couldn’t save your details. Please try again.' };
      cache('profile', r.data[0]);
      return { ok: true };
    } catch (e) { return { ok: false, msg: OFFLINE }; }
  };
  // Unticking "save my details" at checkout only skips saving this order's details. It doesn't erase the account's.
  PS.details.clear = () => { if (!session()) local.details.clear(); };
  // Details saved in this browser before signing in, offered once. They may be someone else's on a shared computer, so the customer chooses
  PS.details.importable = () => !!session() && !!local.details.get();
  PS.details.importLocal = async (accept) => {
    const found = local.details.get();
    if (accept && found) {
      // what the account already has wins; the browser's copy only fills the blanks
      const p = PS.storage.get('sb.profile', {});
      const r = await PS.details.set({
        first: p.first_name || found.first, last: p.last_name || found.last, phone: p.phone || found.phone, org: p.org || found.org,
        address: p.shipping_address || found.address, billing: p.billing_address || found.billing,
      });
      if (!r.ok) return r;
    }
    local.details.clear();
    return { ok: true };
  };

  /* ---------- standing orders: the customer's changes, as rows in standing_orders ---------- */
  async function saveSub(body) {
    try {
      const r = await api('/rest/v1/standing_orders?on_conflict=user_id,key', { method: 'POST', token: await token(), headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body });
      if (!r.ok || !Array.isArray(r.data) || !r.data[0]) return { ok: false, msg: 'We couldn’t save that change. Please try again.' };
      cache('subs', PS.storage.get('sb.subs', []).filter((x) => x.key !== body.key).concat(r.data[0]));
      return { ok: true };
    } catch (e) { return { ok: false, msg: OFFLINE }; }
  }
  PS.subs.settings = () => {
    if (!session()) return local.subs.settings();
    const set = {};
    PS.storage.get('sb.subs', []).forEach((x) => { if (x.plan_id) set[x.key] = { planId: x.plan_id, start: x.start_date || '', end: x.end_date || '' }; });
    return set;
  };
  PS.subs.cancelled = () => (session() ? PS.storage.get('sb.subs', []).filter((x) => x.cancelled_at).map((x) => x.key) : local.subs.cancelled());
  PS.subs.save = (key, cfg) => (session() ? saveSub({ key, plan_id: cfg.planId, start_date: cfg.start || null, end_date: cfg.end || null }) : local.subs.save(key, cfg));
  PS.subs.cancel = (key) => (session() ? saveSub({ key, cancelled_at: new Date().toISOString() }) : local.subs.cancel(key));

  /* ---------- orders ---------- */
  // The signed-in customer's orders as the server returned them. An order with a `status` came from the server;
  // without one it's a demo order, saved only in this browser because Supabase couldn't be reached.
  const mine = () => (session() ? PS.storage.get('sb.orders', []) : []);
  const norm = (num) => String(num).trim().toUpperCase();
  const isMine = (o) => mine().some((x) => x.number === o.number);
  const looked = {}; // orders found by Track order this visit, so "View order details" works on any device
  PS.orders.get = (num) => mine().find((o) => o.number === norm(num)) || looked[norm(num)] || local.get(num);
  PS.orders.forEmail = (email) => {
    const seen = new Set();
    return mine().concat(local.forEmail(email)).filter((o) => !seen.has(o.number) && seen.add(o.number)).sort((a, b) => b.createdAt - a.createdAt);
  };
  const replaceLocal = (number, order) => PS.storage.set('orders', PS.orders.all().map((o) => (o.number === number ? order : o)).filter(Boolean));
  // Sent to Supabase before the confirmation page shows. Unreachable: stays a demo order in this browser. Refused: null, so checkout can say so.
  PS.orders.create = async function (data, totals) {
    const order = local.create.call(this, data, totals);
    try {
      const t = await token();
      const body = Object.assign({}, order);
      delete body.tracking; // a made-up demo number; real ones come with the shipping label
      const r = await api('/rest/v1/orders', { method: 'POST', token: t, headers: { Prefer: 'return=minimal' }, body: { number: order.number, email: order.email, total: order.total, data: body } });
      if (!r.ok) { replaceLocal(order.number, null); return null; }
      if (t) {
        await fetchOrders(t);
        const saved = mine().find((o) => o.number === order.number);
        if (saved) { replaceLocal(order.number, null); return saved; }
      }
      const tracked = await api('/rest/v1/rpc/track_order', { method: 'POST', body: { p_number: order.number, p_email: order.email } });
      const saved = (tracked.ok && tracked.data) || Object.assign(body, { status: 'placed', editUntil: order.createdAt + 3600000 });
      replaceLocal(order.number, saved);
      return saved;
    } catch (e) { return order; }
  };
  const closed = (o) => Date.now() >= o.editUntil || !!o.labelCreatedAt || !!o.shippedAt || ['shipped', 'delivered'].includes(o.status);
  // For showing the link only: update_order_address decides, by the database's clock
  PS.orders.editable = (o) => (o.status ? isMine(o) && !closed(o) : local.editable(o));
  PS.orders.guestOnly = (o) => !!o.status && !isMine(o) && !closed(o);
  PS.orders.editUntil = (o) => o.editUntil || local.editUntil(o);
  PS.orders.status = (o) => {
    if (!o.status) return local.status(o);
    // research-use terms are accepted at checkout, so that step is done the moment the order exists
    const idx = Math.max(1, PS.orders.steps.findIndex((s) => s.id === o.status));
    const time = { placed: o.createdAt, verified: o.createdAt, shipped: o.shippedAt };
    return { steps: PS.orders.steps.map((s, i) => Object.assign({}, s, { done: i <= idx, current: i === idx, time: time[s.id] || null })), current: PS.orders.steps[idx] };
  };
  const EDIT_MSG = {
    closed: 'The one-hour window to change this address has closed.',
    tax_changed: 'This change affects your order’s tax, so our team needs to make it. Please contact us.',
    invalid: 'Please check the address and try again.',
    not_signed_in: 'Sign in again to change this address.',
    not_found: 'Sign in to the account that placed this order to change its address, or contact us.',
  };
  PS.orders.updateAddress = async (num, next) => {
    const o = PS.orders.get(num);
    if (!o) return { ok: false, msg: EDIT_MSG.not_found };
    if (!o.status) return local.updateAddress(num, next);
    try {
      const r = await api('/rest/v1/rpc/update_order_address', { method: 'POST', token: await token(), body: { p_number: num, p_changes: next } });
      if (!r.ok || !r.data) return { ok: false, msg: EDIT_MSG.not_found };
      if (!r.data.ok) return { ok: false, msg: EDIT_MSG[r.data.code] || EDIT_MSG.invalid };
      PS.storage.set('sb.orders', mine().map((x) => (x.number === r.data.order.number ? r.data.order : x)));
      return { ok: true };
    } catch (e) { return { ok: false, msg: OFFLINE }; }
  };
  PS.orders.lookup = async (num, email) => {
    try {
      const r = await api('/rest/v1/rpc/track_order', { method: 'POST', body: { p_number: norm(num), p_email: String(email).trim() } });
      if (r.ok && r.data) { looked[r.data.number] = r.data; return r.data; }
    } catch (e) { /* offline: this browser's copy, below */ }
    return PS.orders.find(num, email);
  };

  /* ---------- catalog ---------- */
  const fromRow = (row) => Object.assign({}, row.details, { id: row.id, name: row.name, cat: row.category, sizes: row.sizes, cardsAllowed: row.cards_allowed });
  async function loadCatalog() {
    const r = await api('/rest/v1/products?select=*&order=sort', { timeout: 2500 });
    if (r.ok && Array.isArray(r.data) && r.data.length) PS.products = r.data.map(fromRow).filter(PS.featured);
  }

  // Email links land here as #access_token=…&refresh_token=…, #error=…, or #message=… (the first of an email change's two links)
  let linkError = null, linkNote = null;
  async function fromLink() {
    if (location.hash.startsWith('#/')) return;
    const h = new URLSearchParams(location.hash.slice(1));
    if (!h.get('access_token') && !h.get('error') && !h.get('message')) return;
    history.replaceState(null, '', location.pathname + location.search + '#/account');
    if (h.get('message')) { linkNote = h.get('message'); return; }
    if (!h.get('access_token')) { linkError = h.get('error_description') || 'That link didn’t work. Try signing in.'; return; }
    const r = await api('/auth/v1/user', { token: h.get('access_token') });
    if (r.ok) saveSession({ access_token: h.get('access_token'), refresh_token: h.get('refresh_token'), expires_at: +h.get('expires_at') || 0, expires_in: +h.get('expires_in'), user: r.data });
  }

  // Hold the first render until the catalog and any sign-in link are handled (the catalog gives up after 2.5s)
  const ready = Promise.all([loadCatalog().catch(() => {}), fromLink().catch(() => {})]);
  const boot = PS.boot;
  PS.boot = (theme) => ready.then(() => {
    boot(theme);
    if (linkError) PS.toast(PS.esc(linkError), 'error');
    if (linkNote) PS.toast(PS.esc(linkNote));
    loadAccount();
    window.addEventListener('hashchange', () => { if (['account', 'orders', 'order', 'checkout'].includes(PS.parseHash().name)) loadAccount(); });
  });
})();
