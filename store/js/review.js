/* Pepsoma — review mode: point at any part of the site and leave a comment on it.
   Turn on with ?review in the address (or the /review/ link); it stays on in this browser until "Exit review".
   Comments live in localStorage (pepsoma.reviewNotes) and export as plain text. */
(function () {
  const S = PS.storage;
  if (/[?&]review(=|&|$)/.test(location.search)) S.set('review', true);
  if (!S.get('review', false)) return;

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let notes = S.get('reviewNotes', []);
  const save = () => S.set('reviewNotes', notes);
  let mode = 'browse', hoverEl = null, picked = null, widen = [], editing = null;

  /* ---------- styles ---------- */
  document.head.insertAdjacentHTML('beforeend', `<style>
  .rv, .rv * { box-sizing: border-box; font: 500 14px/1.4 "DM Sans", system-ui, sans-serif; letter-spacing: 0; text-transform: none; }
  .rv { position: fixed; z-index: 2147483600; }
  .rv[hidden] { display: none !important; }
  html.rv-on, html.rv-on * { cursor: crosshair !important; }
  html.rv-on .rv, html.rv-on .rv * { cursor: auto !important; }
  html.rv-on .rv button, html.rv-on .rv-pin { cursor: pointer !important; }
  .rv-bar { right: 16px; bottom: 16px; display: flex; gap: 6px; padding: 6px; border-radius: 999px; background: #1b1a17; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.14); }
  .rv-bar button { border: 0; border-radius: 999px; padding: 10px 14px; background: transparent; color: #cfcac0; font-weight: 600; }
  .rv-bar button[aria-pressed="true"] { background: #fff; color: #1b1a17; }
  .rv-bar .rv-count { background: #ff5a1f; color: #fff; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 99px; display: inline-grid; place-items: center; font-size: 12px; font-weight: 700; margin-left: 6px; }
  .rv-hint { right: 16px; bottom: 76px; padding: 8px 12px; border-radius: 10px; background: #1b1a17; color: #fff; font-size: 13px; box-shadow: 0 6px 20px rgba(0,0,0,.25); pointer-events: none; }
  .rv-hl { pointer-events: none; border: 2px solid #3b82f6; background: rgba(59,130,246,.12); border-radius: 4px; transition: all .06s linear; }
  .rv-hl.rv-picked { border-color: #ff5a1f; background: rgba(255,90,31,.1); }
  .rv-tag { pointer-events: none; padding: 3px 8px; border-radius: 6px; background: #3b82f6; color: #fff; font-size: 12px; font-weight: 600; white-space: nowrap; max-width: calc(100vw - 32px); overflow: hidden; text-overflow: ellipsis; }
  .rv-pin { width: 26px; height: 26px; margin: -13px 0 0 -13px; border-radius: 50%; background: #ff5a1f; color: #fff; display: grid; place-items: center; font-size: 12px; font-weight: 700; border: 2px solid #fff; box-shadow: 0 3px 10px rgba(0,0,0,.3); padding: 0; z-index: 2147483500; }
  .rv-pin.rv-done { background: #8a857c; }
  .rv-pop { width: min(360px, calc(100vw - 32px)); padding: 14px; border-radius: 16px; background: #fff; color: #1b1a17; box-shadow: 0 18px 50px rgba(0,0,0,.3); border: 1px solid #e6e1d8; }
  .rv-pop .rv-what { font-size: 12px; color: #6b665d; margin-bottom: 8px; display: flex; gap: 6px; align-items: center; }
  .rv-pop .rv-what b { font-weight: 700; color: #1b1a17; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rv-pop textarea { width: 100%; min-height: 92px; resize: vertical; padding: 10px 12px; border-radius: 10px; border: 1px solid #d9d3c8; background: #faf8f4; color: #1b1a17; outline: none; }
  .rv-pop textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.18); }
  .rv-row { display: flex; gap: 8px; margin-top: 10px; align-items: center; }
  .rv-btn { border: 1px solid #d9d3c8; background: #fff; color: #1b1a17; border-radius: 999px; padding: 8px 14px; font-weight: 600; }
  .rv-btn.rv-main { background: #1b1a17; color: #fff; border-color: #1b1a17; }
  .rv-btn.rv-sm { padding: 4px 9px; font-size: 12px; }
  .rv-btn.rv-red { color: #c4321a; }
  .rv-grow { flex: 1; }
  .rv-panel { top: 0; right: 0; bottom: 0; width: min(400px, 100vw); background: #fff; color: #1b1a17; box-shadow: -20px 0 60px rgba(0,0,0,.2); display: flex; flex-direction: column; }
  .rv-panel header { padding: 18px 18px 12px; border-bottom: 1px solid #eee8de; }
  .rv-panel h2 { font-size: 18px; font-weight: 700; margin: 0 0 10px; display: flex; align-items: center; color: #1b1a17; }
  .rv-panel .rv-tools { display: flex; flex-wrap: wrap; gap: 6px; }
  .rv-list { flex: 1; overflow-y: auto; padding: 8px 18px 24px; }
  .rv-page { font-size: 12px; font-weight: 700; color: #6b665d; text-transform: uppercase; letter-spacing: .06em; margin: 18px 0 6px; }
  .rv-item { display: flex; gap: 10px; padding: 10px; border-radius: 12px; border: 1px solid #eee8de; margin-bottom: 8px; background: #faf8f4; text-align: left; width: 100%; color: inherit; }
  .rv-item:hover { border-color: #d9d3c8; background: #f4f0e8; }
  .rv-item .rv-pin { position: static; margin: 0; flex: none; }
  .rv-item .rv-el { font-size: 12px; color: #6b665d; }
  .rv-item .rv-txt { white-space: pre-wrap; word-break: break-word; }
  .rv-item.rv-done .rv-txt { text-decoration: line-through; color: #8a857c; }
  .rv-empty { color: #6b665d; padding: 24px 0; }
  .rv-flash { outline: 3px solid #ff5a1f !important; outline-offset: 3px; transition: outline-color .6s; }
  @media (max-width: 600px) {
    .rv-bar { left: 50%; right: auto; transform: translateX(-50%); bottom: 12px; }
    .rv-hint { left: 16px; right: 16px; bottom: 70px; text-align: center; }
    .rv-pop { left: 8px !important; right: 8px; top: auto !important; bottom: 8px; width: auto; }
  }
  </style>`);

  /* ---------- UI shell ---------- */
  const ui = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); const el = d.firstChild; el.classList.add('rv'); el.dataset.rv = ''; document.body.appendChild(el); return el; };
  const bar = ui(`<div class="rv-bar" role="toolbar" aria-label="Review mode">
    <button data-m="browse" aria-pressed="true">Browse</button>
    <button data-m="comment" aria-pressed="false">Comment</button>
    <button data-list>Comments<span class="rv-count">0</span></button></div>`);
  const hint = ui('<div class="rv-hint" hidden>Click anything to comment on it · C to toggle · Esc to stop</div>');
  const hl = ui('<div class="rv-hl" hidden></div>');
  const tag = ui('<div class="rv-tag" hidden></div>');
  const pins = ui('<div style="inset:0;pointer-events:none"></div>');
  const pop = ui('<div class="rv-pop" hidden></div>');
  const panel = ui('<aside class="rv-panel" hidden aria-label="All comments"></aside>');
  const isUI = (el) => !!(el && el.closest && el.closest('[data-rv]'));

  /* ---------- describing and re-finding elements ---------- */
  const NAMES = { A: 'Link', BUTTON: 'Button', IMG: 'Image', svg: 'Graphic', CANVAS: 'Animation', H1: 'Heading', H2: 'Heading', H3: 'Heading', H4: 'Heading', P: 'Text', LI: 'List item', UL: 'List', INPUT: 'Field', SELECT: 'Dropdown', TEXTAREA: 'Text box', LABEL: 'Label', FORM: 'Form', SECTION: 'Section', HEADER: 'Header', FOOTER: 'Footer', NAV: 'Menu', TABLE: 'Table', SPAN: 'Text', STRONG: 'Text', EM: 'Text', I: 'Text', B: 'Text' };
  const snippet = (el) => (el.getAttribute('aria-label') || el.innerText || el.getAttribute('alt') || el.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim().slice(0, 50);
  const describe = (el) => {
    const t = snippet(el);
    const name = NAMES[el.tagName] || (el.closest('svg') ? 'Graphic' : 'Area');
    return t ? `${name} “${t}${t.length >= 50 ? '…' : ''}”` : name;
  };
  const classes = (el) => (typeof el.className === 'string' ? el.className.split(/\s+/).filter((c) => c && !/^(in|is-|reveal|visible)/.test(c)).slice(0, 2).map((c) => '.' + c).join('') : '');
  const selectorOf = (el) => {
    const parts = [];
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (e.id) { parts.unshift('#' + CSS.escape(e.id)); break; }
      const same = [...e.parentElement.children].filter((c) => c.tagName === e.tagName);
      parts.unshift(e.tagName.toLowerCase() + (same.length > 1 ? `:nth-of-type(${same.indexOf(e) + 1})` : ''));
    }
    return parts.join(' > ');
  };
  const find = (n) => {
    if (!n.sel) return null;
    if (n._el && n._el.isConnected) return n._el;
    let el = null;
    try { el = document.querySelector(n.sel); } catch (e) { /* ignore */ }
    return (n._el = el);
  };
  const route = () => PS.parseHash().path;
  const pageName = (p) => (p === '/' ? 'Home' : p.replace(/^\//, '').split('/').map((s) => s.replace(/-/g, ' ')).join(' › '));

  /* ---------- modes ---------- */
  function setMode(m) {
    mode = m;
    document.documentElement.classList.toggle('rv-on', m === 'comment');
    bar.querySelectorAll('[data-m]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === m)));
    hint.hidden = m !== 'comment';
    if (m !== 'comment') { hoverEl = null; if (!picked) hl.hidden = tag.hidden = true; }
  }
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.m) { closePop(); setMode(b.dataset.m); }
    if ('list' in b.dataset) openPanel();
  });

  function box(el, cls) {
    const r = el.getBoundingClientRect();
    Object.assign(hl.style, { left: r.left - 2 + 'px', top: r.top - 2 + 'px', width: r.width + 4 + 'px', height: r.height + 4 + 'px' });
    hl.className = 'rv rv-hl' + (cls ? ' ' + cls : '');
    hl.hidden = false;
    tag.textContent = describe(el) + ` · ${Math.round(r.width)}×${Math.round(r.height)}`;
    tag.hidden = false;
    const above = r.top > 30;
    Object.assign(tag.style, { left: Math.max(8, Math.min(r.left, innerWidth - tag.offsetWidth - 8)) + 'px', top: (above ? r.top - 26 : Math.min(r.bottom + 4, innerHeight - 26)) + 'px' });
  }
  const pickable = (el) => el && el.nodeType === 1 && !isUI(el) && el !== document.documentElement && el !== document.body;
  // a click on a drawing lands on one of its tiny shapes; take the whole drawing instead
  const target = (el) => { let s = el.closest && el.closest('svg'); while (s && s.parentElement && s.parentElement.closest('svg')) s = s.parentElement.closest('svg'); return s || el; };

  // In comment mode the page underneath shouldn't react: swallow presses and clicks before the store's own handlers see them.
  const block = (e) => {
    if (mode !== 'comment' || isUI(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.type === 'click' && pickable(e.target)) { widen = []; openPop(target(e.target)); }
  };
  ['pointerdown', 'mousedown', 'mouseup', 'pointerup', 'click', 'dblclick', 'auxclick', 'contextmenu', 'submit'].forEach((t) => window.addEventListener(t, block, true));
  window.addEventListener('mouseover', (e) => {
    if (mode !== 'comment' || picked || !pickable(e.target)) return;
    hoverEl = target(e.target);
    box(hoverEl);
  }, true);
  document.addEventListener('mouseleave', () => { if (mode === 'comment' && !picked) hl.hidden = tag.hidden = true; });

  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName) || (document.activeElement && document.activeElement.isContentEditable);
    if (e.key === 'Escape') {
      if (!pop.hidden) { closePop(); e.preventDefault(); }
      else if (!panel.hidden) closePanel();
      else if (mode === 'comment') setMode('browse');
      return;
    }
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'c' || e.key === 'C') { closePop(); setMode(mode === 'comment' ? 'browse' : 'comment'); }
  }, true);

  /* ---------- the comment box ---------- */
  function placePop(el) {
    if (innerWidth <= 600) return;
    const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2 - 180, right: innerWidth / 2 + 180, top: innerHeight / 3, bottom: innerHeight / 3 };
    const h = pop.offsetHeight, w = pop.offsetWidth;
    let top = r.bottom + 10;
    if (top + h > innerHeight - 12) top = r.top - h - 10;
    if (top < 12) top = Math.max(12, Math.min(innerHeight - h - 12, r.top + 12));
    pop.style.left = Math.max(12, Math.min(r.left, innerWidth - w - 12)) + 'px';
    pop.style.top = top + 'px';
  }
  function openPop(el, note) {
    closePanel();
    picked = el;
    editing = note || null;
    if (el) { el.scrollIntoView({ block: 'nearest' }); box(el, 'rv-picked'); } else { hl.hidden = tag.hidden = true; }
    const what = el ? describe(el) : 'This whole page';
    pop.innerHTML = `
      <div class="rv-what"><b title="${esc(what)}">${esc(what)}</b>
        ${el && !note ? '<button class="rv-btn rv-sm" data-a="wider" title="Select the area around it">Bigger ↑</button><button class="rv-btn rv-sm" data-a="narrower" title="Back to the smaller piece"' + (widen.length ? '' : ' disabled') + '>Smaller ↓</button>' : ''}</div>
      <textarea placeholder="What should change here?">${note ? esc(note.body) : ''}</textarea>
      <div class="rv-row">
        ${note ? `<button class="rv-btn rv-sm rv-red" data-a="delete">Delete</button><button class="rv-btn rv-sm" data-a="done">${note.done ? 'Reopen' : 'Mark done'}</button>` : ''}
        <span class="rv-grow"></span>
        <button class="rv-btn" data-a="cancel">Cancel</button>
        <button class="rv-btn rv-main" data-a="save">Save</button>
      </div>`;
    pop.hidden = false;
    placePop(el);
    const ta = $('textarea', pop);
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }
  function closePop() {
    pop.hidden = true;
    picked = editing = null;
    hl.hidden = tag.hidden = true;
  }
  pop.addEventListener('click', (e) => {
    const a = e.target.closest('[data-a]');
    if (!a) return;
    const act = a.dataset.a, body = $('textarea', pop).value.trim();
    if (act === 'wider' && picked.parentElement && pickable(picked.parentElement)) { const p = picked.parentElement; widen.push(picked); openPop(p); }
    else if (act === 'narrower' && widen.length) openPop(widen.pop());
    else if (act === 'cancel') closePop();
    else if (act === 'delete') { if (confirm('Delete this comment?')) { notes = notes.filter((n) => n !== editing); save(); closePop(); paint(); } }
    else if (act === 'done') { editing.done = !editing.done; save(); closePop(); paint(); }
    else if (act === 'save') {
      if (!body) { $('textarea', pop).focus(); return; }
      if (editing) editing.body = body;
      else {
        const el = picked;
        notes.push({
          n: notes.reduce((m, x) => Math.max(m, x.n), 0) + 1,
          page: route(), sel: el ? selectorOf(el) : null, text: el ? snippet(el) : '', what: el ? describe(el) : 'Whole page',
          cls: el ? el.tagName.toLowerCase() + classes(el) : '',
          body, width: innerWidth, theme: document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
          at: new Date().toISOString(),
        });
      }
      save();
      closePop();
      paint();
    }
  });
  pop.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) $('[data-a="save"]', pop).click(); });

  /* ---------- pins, kept on their elements as the page scrolls and re-renders ---------- */
  function paint() {
    bar.querySelector('.rv-count').textContent = notes.filter((n) => !n.done).length;
    const here = notes.filter((n) => n.page === route() && n.sel);
    pins.innerHTML = here.map((n) => `<button class="rv rv-pin${n.done ? ' rv-done' : ''}" data-n="${n.n}" data-rv title="${esc(n.body)}" style="pointer-events:auto">${n.n}</button>`).join('');
    if (!panel.hidden) renderPanel();
  }
  function track() {
    pins.querySelectorAll('.rv-pin').forEach((p) => {
      const n = notes.find((x) => x.n === +p.dataset.n), el = n && find(n);
      const r = el && el.getBoundingClientRect();
      if (!r || (!r.width && !r.height)) { p.style.display = 'none'; return; }
      p.style.display = '';
      p.style.left = Math.max(14, Math.min(r.left + 4, innerWidth - 14)) + 'px';
      p.style.top = Math.max(14, r.top + 4) + 'px';
      p.style.visibility = r.bottom < 0 || r.top > innerHeight ? 'hidden' : '';
    });
    if (picked && !pop.hidden) box(picked, 'rv-picked');
    requestAnimationFrame(track);
  }
  pins.addEventListener('click', (e) => {
    const p = e.target.closest('.rv-pin');
    if (!p) return;
    const n = notes.find((x) => x.n === +p.dataset.n);
    if (n) openPop(find(n), n);
  });
  window.addEventListener('hashchange', () => { closePop(); setTimeout(paint, 50); });

  /* ---------- the list of all comments ---------- */
  function renderPanel() {
    const pages = [...new Set(notes.map((n) => n.page))];
    panel.innerHTML = `<header>
        <h2><span class="rv-grow">Comments (${notes.length})</span><button class="rv-btn rv-sm" data-p="close" aria-label="Close">✕</button></h2>
        <div class="rv-tools">
          <button class="rv-btn rv-sm rv-main" data-p="page">+ Comment on this page</button>
          <button class="rv-btn rv-sm" data-p="copy"${notes.length ? '' : ' disabled'}>Copy all</button>
          <button class="rv-btn rv-sm" data-p="download"${notes.length ? '' : ' disabled'}>Download</button>
          <button class="rv-btn rv-sm rv-red" data-p="clear"${notes.length ? '' : ' disabled'}>Clear all</button>
          <button class="rv-btn rv-sm" data-p="exit">Exit review</button>
        </div></header>
      <div class="rv-list">${notes.length ? pages.map((p) => `<div class="rv-page">${esc(pageName(p))}</div>` +
        notes.filter((n) => n.page === p).map((n) => `<button class="rv-item${n.done ? ' rv-done' : ''}" data-go="${n.n}">
          <span class="rv-pin${n.done ? ' rv-done' : ''}">${n.n}</span>
          <span><div class="rv-el">${esc(n.what)}</div><div class="rv-txt">${esc(n.body)}</div></span></button>`).join('')).join('')
        : '<p class="rv-empty">No comments yet. Switch to <b>Comment</b> and click any part of the page.</p>'}</div>`;
  }
  function openPanel() { closePop(); setMode('browse'); renderPanel(); panel.hidden = false; }
  function closePanel() { panel.hidden = true; }

  function exportText() {
    const day = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    let out = `PEPSOMA — REVIEW COMMENTS (${notes.length}) · ${day}\n`;
    [...new Set(notes.map((n) => n.page))].forEach((p) => {
      out += `\n${pageName(p).toUpperCase()}  (#${p})\n`;
      notes.filter((n) => n.page === p).forEach((n) => {
        out += `${n.n}. ${n.what}${n.done ? '  [done]' : ''}\n   ${n.body.replace(/\n/g, '\n   ')}\n   (${n.width < 700 ? 'phone' : n.width < 1100 ? 'tablet' : 'desktop'} ${n.width}px, ${n.theme}${n.sel ? ` · ${n.cls} · ${n.sel}` : ''})\n`;
      });
    });
    return out;
  }
  panel.addEventListener('click', async (e) => {
    const go = e.target.closest('[data-go]');
    if (go) {
      const n = notes.find((x) => x.n === +go.dataset.go);
      closePanel();
      if (route() !== n.page) location.hash = '#' + n.page;
      setTimeout(() => {
        const el = find(n);
        if (!el) { openPop(null, n); return; }
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setTimeout(() => openPop(el, n), 450);
      }, 120);
      return;
    }
    const b = e.target.closest('[data-p]');
    if (!b) return;
    const act = b.dataset.p;
    if (act === 'close') closePanel();
    else if (act === 'page') { widen = []; openPop(null); }
    else if (act === 'copy') {
      try { await navigator.clipboard.writeText(exportText()); b.textContent = 'Copied ✓'; }
      catch (err) { prompt('Copy the comments:', exportText()); }
      setTimeout(() => { b.textContent = 'Copy all'; }, 1600);
    }
    else if (act === 'download') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([exportText()], { type: 'text/plain' }));
      a.download = `pepsoma-review-${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    else if (act === 'clear') { if (confirm(`Delete all ${notes.length} comments? Copy or download them first if you need them.`)) { notes = []; save(); paint(); } }
    else if (act === 'exit') {
      if (!confirm('Turn off review mode in this browser? Your comments stay saved; add ?review to the address to come back.')) return;
      S.set('review', false);
      location.href = location.pathname + location.hash;
    }
  });

  paint();
  requestAnimationFrame(track);
})();
