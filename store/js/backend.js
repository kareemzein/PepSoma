/* Pepsoma — Supabase backend: accounts (Supabase Auth), catalog and orders (Postgres with row-level security).
   Calls Supabase's REST endpoints with fetch, so there's still no build step or dependency.
   The keys come from js/env.js (written from .env by tools/env.mjs, or by the deploy). Without keys, or when
   Supabase can't be reached, the browser-only demo in core.js keeps running. Schema: supabase/schema.sql. */
(function () {
  const PS = window.PS;
  const env = window.PS_ENV || {};
  const BASE = String(env.supabaseUrl || '').replace(/\/+$/, '');
  const KEY = env.supabaseAnonKey || '';
  PS.backend = { enabled: !!(BASE && KEY), online: false };
  if (!PS.backend.enabled) return;

  const local = { auth: PS.auth, get: PS.orders.get, forEmail: PS.orders.forEmail, create: PS.orders.create };

  // Resolves with { ok, status, data }; rejects only when Supabase can't be reached (network error or timeout)
  async function api(path, { method = 'GET', body, token, headers, timeout = 8000 } = {}) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    try {
      const res = await fetch(BASE + path, {
        method, signal: ctl.signal, body: body && JSON.stringify(body),
        headers: Object.assign({ apikey: KEY, Authorization: 'Bearer ' + (token || KEY), 'Content-Type': 'application/json' }, headers),
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
    if (!s || !s.access_token) { PS.storage.remove('sb.session'); PS.storage.remove('sb.orders'); return; }
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
    if (!r.ok) { saveSession(null); PS.emit('auth'); return null; }
    saveSession(r.data);
    return r.data.access_token;
  }
  const toUser = (u) => ({ id: u.id, email: u.email, name: (u.user_metadata && u.user_metadata.name) || u.email.split('@')[0], created: Date.parse(u.created_at) });
  const MSG = {
    invalid_credentials: 'Email or password is incorrect.',
    email_not_confirmed: 'Confirm your email first: open the link we sent you, then sign in.',
    user_already_exists: 'An account with that email already exists — sign in instead.',
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
      PS.emit('auth');
      syncOrders();
      return { ok: true };
    },
    async signIn(d) {
      let r;
      try {
        r = await api('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: String(d.email).trim().toLowerCase(), password: d.password } });
      } catch (e) { fellBack(); return local.auth.signIn(d); }
      if (!r.ok) return { ok: false, msg: authMsg(r) };
      saveSession(r.data);
      PS.emit('auth');
      syncOrders();
      return { ok: true };
    },
    signOut() {
      const s = session();
      saveSession(null);
      if (s) api('/auth/v1/logout', { method: 'POST', token: s.access_token }).catch(() => {});
      local.auth.signOut();
    },
  };

  /* ---------- orders ---------- */
  // The signed-in customer's orders as the server returned them (row-level security only returns their own)
  const mine = () => (session() ? PS.storage.get('sb.orders', []) : []);
  const norm = (num) => String(num).trim().toUpperCase();
  async function syncOrders() {
    try {
      const t = await token();
      if (!t) return;
      const r = await api('/rest/v1/orders?select=data&order=created_at.desc', { token: t });
      if (!r.ok || !Array.isArray(r.data)) return;
      const list = r.data.map((row) => row.data);
      if (JSON.stringify(list) === JSON.stringify(PS.storage.get('sb.orders', []))) return;
      PS.storage.set('sb.orders', list);
      PS.emit('orders');
    } catch (e) { /* offline: keep what's cached */ }
  }
  PS.orders.get = (num) => local.get(num) || mine().find((o) => o.number === norm(num));
  PS.orders.forEmail = (email) => {
    const seen = new Set();
    return mine().concat(local.forEmail(email)).filter((o) => !seen.has(o.number) && seen.add(o.number)).sort((a, b) => b.createdAt - a.createdAt);
  };
  // Saved on this device first (the confirmation page reads it), then sent to Supabase; if that fails it stays local
  PS.orders.create = function (data, totals) {
    const order = local.create.call(this, data, totals);
    (async () => {
      try {
        const t = await token();
        const r = await api('/rest/v1/orders', { method: 'POST', token: t, headers: { Prefer: 'return=minimal' }, body: { number: order.number, email: order.email, total: order.total, data: order } });
        if (r.ok && t) syncOrders();
      } catch (e) { /* offline */ }
    })();
    return order;
  };
  PS.orders.lookup = async (num, email) => {
    const o = PS.orders.find(num, email);
    if (o) return o;
    try {
      const r = await api('/rest/v1/rpc/track_order', { method: 'POST', body: { p_number: norm(num), p_email: String(email).trim() } });
      return r.ok ? r.data : null;
    } catch (e) { return null; }
  };

  /* ---------- catalog ---------- */
  const fromRow = (row) => Object.assign({}, row.details, { id: row.id, name: row.name, cat: row.category, sizes: row.sizes, cardsAllowed: row.cards_allowed });
  async function loadCatalog() {
    const r = await api('/rest/v1/products?select=*&order=sort', { timeout: 2500 });
    if (r.ok && Array.isArray(r.data) && r.data.length) PS.products = r.data.map(fromRow).filter(PS.featured);
  }

  // The email confirmation link lands here as #access_token=…&refresh_token=… (or #error=…)
  let linkError = null;
  async function fromLink() {
    const h = new URLSearchParams(location.hash.slice(1));
    if (!h.get('access_token') && !h.get('error')) return;
    history.replaceState(null, '', location.pathname + location.search + '#/account');
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
    syncOrders();
    window.addEventListener('hashchange', () => { if (PS.parseHash().name === 'account') syncOrders(); });
  });
})();
