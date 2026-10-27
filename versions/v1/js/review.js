/* Pepsoma — review mode: point at any part of the site and leave a comment on it.
   Turn on with ?review in the address (or the /review/ link); it stays on in that tab until "Exit review" or the tab closes.
   Comments live in localStorage (pepsoma.reviewNotes) and export as plain text.
   Each comment is signed with the current commenter; names are kept per device (pepsoma.reviewPeople) and N cycles them.
   With SHEET_URL set, every comment is also sent to a Google Sheet (setup: tools/review-sheet.gs), and the panel can show everyone's comments from it (password checked by the script). */
(function () {
  const S = PS.storage;
  // per tab (sessionStorage), so the plain link always opens the normal store
  const ON = 'pepsoma.review', asked = /[?&]review(=|&|$)/.test(location.search);
  S.remove('review'); // earlier builds kept review on for the whole browser
  let on = asked;
  try { if (asked) sessionStorage.setItem(ON, '1'); on = sessionStorage.getItem(ON) === '1'; } catch (e) { /* blocked storage: only with ?review */ }
  if (!on) return;

  const $ = (s, r = document) => r.querySelector(s);
  // review mode's own timers keep the real clock, so slow motion only slows the store
  const later = window.setTimeout.bind(window), frame = window.requestAnimationFrame.bind(window);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Google Apps Script web app URL from tools/review-sheet.gs; empty keeps comments on this device only
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyIdUV2k7x63p800wluyHXTep0wn75DTpMdP9AAMuqC_VhSArNgiq0Kh2GTXICJj96e/exec';
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  let notes = S.get('reviewNotes', []);
  notes.forEach((n) => { n.id = n.id || newId(); n.rev = n.rev || 1; });
  // n.sent is the revision the sheet has; `gone` holds ids deleted here that the sheet still shows
  let gone = S.get('reviewGone', []);
  const save = () => { S.set('reviewNotes', notes); S.set('reviewGone', gone); sync(); };
  const drop = (test) => {
    notes.forEach((n) => { if (test(n) && n.sent) gone.push(n.id); });
    notes = notes.filter((n) => !test(n));
    save();
  };
  let mode = 'browse', hoverEl = null, picked = null, widen = [], editing = null;
  // people whose comments are hidden everywhere (pins and list), in either view; click their chip to toggle
  let hidden = S.get('reviewHidden', []);
  const shown = (n) => !hidden.includes(byName(n));
  // "sheet" shows everyone's comments (read-only) as fetched from the Google Sheet instead of this laptop's
  let source = SHEET_URL && S.get('reviewSource', 'local') === 'sheet' ? 'sheet' : 'local', sheet = [], sheetState = source === 'sheet' ? 'loading' : 'idle', loads = 0;
  const list = () => (source === 'sheet' ? sheet : notes);
  // removing a name from `people` only takes it off the switcher; their comments keep their `by`
  let people = S.get('reviewPeople', []), who = S.get('reviewWho', null);
  if (who && !people.includes(who)) who = null;
  const savePeople = () => { S.set('reviewPeople', people); S.set('reviewWho', who); };
  const COLORS = ['#ff5a1f', '#2563eb', '#16a34a', '#9333ea', '#db2777', '#0891b2', '#ca8a04', '#4f46e5'];
  // each new name gets the next unused color, remembered so a person keeps theirs
  const colorOf = S.get('reviewColors', {});
  const color = (name) => {
    if (!name) return '#8a857c';
    if (!(name in colorOf)) {
      const used = Object.values(colorOf);
      let i = 0;
      while (used.includes(i) && i < COLORS.length) i++;
      colorOf[name] = i < COLORS.length ? i : used.length % COLORS.length;
      S.set('reviewColors', colorOf);
    }
    return COLORS[colorOf[name]];
  };
  const byName = (n) => n.by || 'No name';

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
  .rv-pop .rv-txt { white-space: pre-wrap; word-break: break-word; max-height: 40vh; overflow-y: auto; }
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
  .rv-sync { font-size: 12px; color: #6b665d; margin: -4px 0 10px; }
  .rv-sync.rv-warn { color: #c4321a; }
  .rv-sync .rv-btn { margin-left: 6px; }
  .rv-key { display: flex; gap: 6px; margin: 0 0 10px; }
  .rv-key input { flex: 1; min-width: 0; padding: 7px 10px; border-radius: 10px; border: 1px solid #d9d3c8; background: #faf8f4; color: #1b1a17; outline: none; }
  .rv-key input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.18); }
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
  .rv-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex: none; }
  .rv-bar .rv-who { display: inline-flex; align-items: center; gap: 7px; color: #fff; max-width: 150px; }
  .rv-bar .rv-who .rv-nm { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rv-bar .rv-sep { width: 1px; background: rgba(255,255,255,.18); margin: 6px 2px; }
  .rv-scrim { z-index: 2147483640; inset: 0; background: rgba(10,10,14,.45); display: grid; place-items: center; padding: 16px; }
  .rv-card { width: min(380px, 100%); padding: 20px; border-radius: 18px; background: #fff; color: #1b1a17; box-shadow: 0 24px 70px rgba(0,0,0,.35); }
  .rv-card h3 { font-size: 18px; font-weight: 700; margin: 0 0 4px; color: #1b1a17; }
  .rv-card .rv-sub { font-size: 13px; color: #6b665d; margin: 0 0 14px; }
  .rv-card input { flex: 1; min-width: 0; padding: 10px 12px; border-radius: 10px; border: 1px solid #d9d3c8; background: #faf8f4; color: #1b1a17; outline: none; }
  .rv-card input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.18); }
  .rv-label { font-size: 12px; font-weight: 700; color: #6b665d; text-transform: uppercase; letter-spacing: .06em; margin: 18px 0 6px; }
  .rv-person { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
  .rv-person .rv-pick { flex: 1; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; border: 1px solid #eee8de; background: #faf8f4; color: #1b1a17; text-align: left; font-weight: 600; }
  .rv-person .rv-pick:hover { border-color: #d9d3c8; }
  .rv-person .rv-pick[aria-current="true"] { border-color: #1b1a17; background: #fff; }
  .rv-person .rv-pick small { margin-left: auto; font-size: 12px; color: #6b665d; font-weight: 500; }
  .rv-x { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e6e1d8; background: #fff; color: #6b665d; padding: 0; font-size: 15px; line-height: 1; }
  .rv-x:hover { color: #c4321a; border-color: #c4321a; }
  .rv-kbd { font-size: 12px; color: #6b665d; margin-top: 14px; }
  .rv-kbd kbd, .rv-hint kbd { font: 700 11px/1 "DM Sans", system-ui, sans-serif; padding: 2px 6px; border-radius: 5px; border: 1px solid currentColor; opacity: .85; }
  .rv-hud { z-index: 2147483650; left: 50%; top: 50%; transform: translate(-50%, -50%); min-width: 220px; padding: 10px; border-radius: 20px; background: rgba(30,30,32,.82); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); box-shadow: 0 20px 60px rgba(0,0,0,.35); pointer-events: none; opacity: 0; transition: opacity .18s; }
  .rv-hud.rv-show { opacity: 1; transition: none; }
  .rv-hud div { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 12px; color: rgba(255,255,255,.75); font-size: 16px; font-weight: 600; }
  .rv-hud div.rv-cur { background: rgba(255,255,255,.18); color: #fff; }
  .rv-filters { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .rv-chip { display: inline-flex; align-items: center; gap: 6px; border: 1px solid #e6e1d8; background: #fff; color: #1b1a17; border-radius: 999px; padding: 4px 10px; font-size: 12px; font-weight: 600; }
  .rv-chip[aria-pressed="true"] { background: #1b1a17; color: #fff; border-color: #1b1a17; }
  .rv-chip.rv-off { color: #8a857c; border-style: dashed; text-decoration: line-through; }
  .rv-chip.rv-off .rv-dot { opacity: .35; }
  .rv-item .rv-by { font-weight: 700; color: #1b1a17; }
  .rv-danger { margin-top: 28px; padding: 14px; border-radius: 12px; border: 1px dashed #e3b3a8; background: #fff8f6; }
  .rv-danger .rv-label { margin-top: 0; color: #c4321a; }
  .rv-danger p { font-size: 12px; color: #6b665d; margin: 0 0 10px; }
  .rv-danger .rv-row { margin-top: 6px; }
  .rv-ico { width: 16px; height: 16px; vertical-align: -3px; margin-right: 6px; }
  .rv-welcome { overflow-y: auto; align-items: start; }
  .rv-wl { width: min(980px, 100%); margin: auto; padding: 28px 30px 26px; border-radius: 22px; background: #fff; color: #1b1a17; box-shadow: 0 24px 70px rgba(0,0,0,.35); }
  .rv-wl .rv-kick { font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #ff5a1f; margin: 0 0 8px; }
  .rv-wl h2 { font-size: 30px; line-height: 1.15; font-weight: 700; letter-spacing: -.01em; margin: 0 0 8px; color: #1b1a17; }
  .rv-wl .rv-lede { font-size: 15px; color: #6b665d; margin: 0 0 20px; max-width: 62ch; }
  .rv-wl-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .rv-wl-step { background: #faf8f4; border: 1px solid #eee8de; border-radius: 18px; padding: 14px 14px 16px; }
  .rv-wl-step .rv-n { display: inline-grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: #1b1a17; color: #fff; font-size: 12px; font-weight: 700; margin: 12px 0 6px; }
  .rv-wl-step h3 { font-size: 15px; font-weight: 700; margin: 0 0 4px; color: #1b1a17; }
  .rv-wl-step p { font-size: 13px; color: #6b665d; margin: 0; }
  .rv-wl-keys { display: flex; flex-wrap: wrap; gap: 8px 16px; margin: 18px 0 0; font-size: 13px; color: #6b665d; }
  .rv-wl-keys kbd { font: 700 11px/1 "DM Sans", system-ui, sans-serif; padding: 3px 7px; border-radius: 6px; border: 1px solid #d9d3c8; border-bottom-width: 2px; color: #1b1a17; margin-right: 6px; }
  .rv-wl-foot { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-top: 20px; }
  .rv-wl-foot p { font-size: 13px; color: #6b665d; margin: 0; }
  .rv-wl-go { font-size: 15px; padding: 12px 22px; }
  /* the step drawings: little looping demos */
  .rv-art { position: relative; height: 112px; border-radius: 12px; background: #fff; border: 1px solid #eee8de; overflow: hidden; }
  .rv-art i { position: absolute; display: block; font-style: normal; }
  .wl-field { left: 14px; right: 14px; top: 22px; height: 30px; border-radius: 9px; border: 1.5px solid #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); padding: 0 10px; font-size: 13px; font-weight: 600; line-height: 28px; white-space: nowrap; }
  .wl-field b { display: inline-block; overflow: hidden; vertical-align: top; width: 0; animation: wlType 6s steps(6) infinite; }
  .wl-field u { display: inline-block; width: 1.5px; height: 15px; background: #1b1a17; vertical-align: -3px; text-decoration: none; animation: wlBlink 1s steps(1) infinite; }
  .wl-chip { top: 66px; height: 24px; padding: 0 10px 0 8px; border-radius: 99px; border: 1px solid #e6e1d8; font-size: 12px; font-weight: 600; line-height: 22px; background: #fff; }
  .wl-chip::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; background: var(--c); }
  .wl-chip.c1 { left: 14px; --c: #ff5a1f; animation: wlPop 6s ease infinite; }
  .wl-chip.c2 { left: 96px; --c: #2563eb; }
  .wl-bar { left: 0; right: 0; top: 0; height: 14px; background: #f1ede5; }
  .wl-head { left: 14px; top: 26px; width: 58%; height: 16px; border-radius: 4px; background: #e6e1d8; }
  .wl-txt { left: 14px; top: 48px; width: 44%; height: 7px; border-radius: 3px; background: #efeae1; }
  .wl-btn { left: 14px; top: 66px; width: 32%; height: 18px; border-radius: 9px; background: #c9d2ff; }
  .wl-out { border: 2px solid #3b82f6; background: rgba(59,130,246,.1); border-radius: 5px; animation: wlOut 7s ease infinite; }
  .wl-bub { left: 44%; top: 58px; padding: 5px 9px; border-radius: 9px; background: #1b1a17; color: #fff; font-size: 11px; font-weight: 600; white-space: nowrap; opacity: 0; animation: wlBub 7s ease infinite; }
  .wl-cur { width: 16px; height: 16px; animation: wlCur 7s cubic-bezier(.45,0,.25,1) infinite; }
  .wl-hud { left: 50%; top: 12px; width: 120px; margin-left: -60px; padding: 5px; border-radius: 12px; background: #2a2a2d; }
  .wl-hud span { position: relative; z-index: 1; display: flex; align-items: center; gap: 7px; height: 22px; padding: 0 8px; color: #fff; font-size: 12px; font-weight: 600; }
  .wl-hud span::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--c); }
  .wl-sel { left: 5px; right: 5px; top: 5px; height: 22px; border-radius: 8px; background: rgba(255,255,255,.2); animation: wlSel 6s cubic-bezier(.3,0,.2,1) infinite; }
  .wl-key { left: 50%; bottom: 10px; margin-left: -13px; width: 26px; height: 22px; border-radius: 6px; border: 1px solid #d9d3c8; border-bottom-width: 3px; background: #fff; font-size: 12px; font-weight: 700; text-align: center; line-height: 18px; animation: wlKey 6s ease infinite; }
  .wl-row { left: 14px; right: 14px; height: 16px; border-bottom: 1px solid #f1ede5; opacity: 0; animation: wlRow 7s ease infinite; }
  .wl-row::before { content: ''; position: absolute; left: 0; top: 4px; width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
  .wl-row::after { content: ''; position: absolute; left: 16px; top: 5px; height: 6px; width: var(--w); border-radius: 3px; background: #e6e1d8; }
  .wl-th { left: 14px; right: 14px; top: 12px; height: 14px; border-radius: 4px; background: #f1ede5; }
  @keyframes wlType { 0%, 8% { width: 0; } 40%, 92% { width: 3.6em; } 100% { width: 0; } }
  @keyframes wlBlink { 50% { opacity: 0; } }
  @keyframes wlPop { 0%, 44% { transform: scale(.6); opacity: 0; } 52%, 92% { transform: none; opacity: 1; } 100% { opacity: 0; } }
  @keyframes wlOut { 0%, 6% { left: 12px; top: 24px; width: 58%; height: 20px; opacity: 0; } 12%, 30% { left: 12px; top: 24px; width: 58%; height: 20px; opacity: 1; border-color: #3b82f6; }
    42% { left: 12px; top: 64px; width: 33%; height: 22px; border-color: #3b82f6; background: rgba(59,130,246,.1); } 47%, 86% { left: 12px; top: 64px; width: 33%; height: 22px; border-color: #ff5a1f; background: rgba(255,90,31,.12); opacity: 1; } 94%, 100% { left: 12px; top: 64px; width: 33%; height: 22px; opacity: 0; } }
  @keyframes wlBub { 0%, 48% { opacity: 0; transform: translateY(6px) scale(.9); } 54%, 86% { opacity: 1; transform: none; } 94%, 100% { opacity: 0; } }
  @keyframes wlCur { 0% { left: 88%; top: 80%; opacity: 0; } 8% { opacity: 1; } 22%, 30% { left: 52%; top: 30px; } 42% { left: 30%; top: 70px; transform: none; } 45% { transform: scale(.8); } 48%, 86% { left: 30%; top: 70px; transform: none; opacity: 1; } 96%, 100% { left: 30%; top: 70px; opacity: 0; } }
  @keyframes wlSel { 0%, 22% { transform: none; } 30%, 55% { transform: translateY(22px); } 63%, 88% { transform: translateY(44px); } 96%, 100% { transform: none; } }
  @keyframes wlKey { 0%, 20%, 28%, 53%, 61%, 86%, 94%, 100% { transform: none; border-bottom-width: 3px; } 24%, 57%, 90% { transform: translateY(2px); border-bottom-width: 1px; } }
  @keyframes wlRow { 0% { opacity: 0; transform: translateY(6px); } 10%, 90% { opacity: 1; transform: none; } 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .rv-art *, .rv-art *::before { animation: none !important; } .wl-field b { width: 3.6em; } .wl-out { left: 12px; top: 64px; width: 33%; height: 22px; border-color: #ff5a1f; } .wl-bub, .wl-row, .wl-chip.c1 { opacity: 1; } .wl-cur { left: 30%; top: 70px; } }
  @media (max-width: 860px) { .rv-wl-steps { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) {
    .rv-wl { padding: 22px 18px 18px; }
    .rv-wl h2 { font-size: 24px; }
    .rv-wl-steps { grid-template-columns: 1fr; }
    .rv-wl-go { width: 100%; }
    .rv-bar [data-slow] .rv-ico { margin-right: 0; }
    .rv-bar button { padding: 10px 10px; }
    .rv-bar .rv-who { max-width: 96px; }
    .rv-bar .rv-lbl { display: none; }
    .rv-bar { left: 50%; right: auto; transform: translateX(-50%); bottom: 12px; }
    .rv-bar.rv-filtered { flex-wrap: wrap; justify-content: center; width: calc(100vw - 24px); border-radius: 26px; }
    .rv-bar.rv-filtered [data-only] { order: -1; flex: 0 0 100%; }
    .rv-bar.rv-filtered .rv-only .rv-who { max-width: 240px; }
    .rv-bar.rv-filtered .rv-only .rv-lbl { display: inline; }
    .rv-bar.rv-filtered ~ .rv-hint { bottom: 124px; }
    .rv-hint { left: 16px; right: 16px; bottom: 70px; text-align: center; }
    .rv-pop { left: 8px !important; right: 8px; top: auto !important; bottom: 8px; width: auto; }
  }
  </style>`);

  /* ---------- UI shell ---------- */
  const ui = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); const el = d.firstChild; el.classList.add('rv'); el.dataset.rv = ''; document.body.appendChild(el); return el; };
  const bar = ui(`<div class="rv-bar" role="toolbar" aria-label="Review mode">
    <button class="rv-who" data-who title="Who's commenting (N to switch)"><span class="rv-dot"></span><span class="rv-nm"></span></button>
    <span class="rv-sep"></span>
    <button class="rv-only" data-only hidden title="Show everyone's comments again"><span class="rv-who"><span class="rv-dot"></span><span class="rv-lbl">Hiding:</span><span class="rv-nm"></span>×</span></button>
    <button data-m="browse" aria-pressed="true">Browse</button>
    <button data-m="comment" aria-pressed="false">Comment</button>
    <button data-slow aria-pressed="false" title="Slow motion (S): the store's animations at quarter speed"><svg class="rv-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="14" r="7.5"/><path d="M12 14V10.5M10 3h4M12 3v3.5M18.5 7l1.5-1.5"/></svg><span class="rv-lbl">Slow-mo</span></button>
    <button data-list><span class="rv-lbl">Comments</span><span class="rv-count">0</span></button></div>`);
  const hint = ui('<div class="rv-hint" hidden>Click anything to comment on it · <kbd>C</kbd> toggle · <kbd>F</kbd> whole page · <kbd>B</kbd> browse · <kbd>N</kbd> person · <kbd>S</kbd> slow-mo · <kbd>Esc</kbd> stop</div>');
  const picker = ui('<div class="rv-scrim" hidden></div>');
  const hud = ui('<div class="rv-hud" aria-live="polite"></div>');
  const welcome = ui('<div class="rv-scrim rv-welcome" hidden></div>');
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
    if (m === 'comment' && !who) { openPicker('comment'); return; }
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
    if ('who' in b.dataset) openPicker();
    if ('slow' in b.dataset) setSlow(rate === 1, true);
    if ('only' in b.dataset) { setHidden([]); paint(); }
  });

  /* ---------- who's commenting ---------- */
  let afterPick = null;
  function showWho() {
    $('.rv-dot', bar).style.background = color(who);
    $('.rv-nm', bar).textContent = who || 'Add name';
  }
  function setWho(name, flash) {
    who = name;
    savePeople();
    showWho();
    if (flash && who) showHud();
  }
  function renderPicker() {
    const count = (p) => notes.filter((n) => n.by === p).length;
    picker.innerHTML = `<div class="rv-card" role="dialog" aria-modal="true" aria-label="Who's commenting">
      <h3>Who's commenting?</h3>
      <p class="rv-sub">Your comments are saved under this name. Switch any time the laptop changes hands.</p>
      <form class="rv-row" style="margin:0" data-add><input placeholder="Type your name" maxlength="40" autocomplete="off"><button class="rv-btn rv-main">Start</button></form>
      ${people.length ? `<div class="rv-label">On this device</div>` + people.map((p) => `<div class="rv-person">
        <button class="rv-pick" data-pick="${esc(p)}" aria-current="${p === who}"><span class="rv-dot" style="background:${color(p)}"></span>${esc(p)}<small>${count(p)} comment${count(p) === 1 ? '' : 's'}</small></button>
        <button class="rv-x" data-unlist="${esc(p)}" title="Take ${esc(p)} off this list (keeps their comments)" aria-label="Remove ${esc(p)} from the list">×</button></div>`).join('') : ''}
      <div class="rv-row"><span class="rv-kbd">Press <kbd>N</kbd> to switch people${people.length > 1 ? '' : ' once there are two'}</span><span class="rv-grow"></span><button class="rv-btn rv-sm" data-later>${who ? 'Done' : 'Not now'}</button></div>
    </div>`;
  }
  function openPicker(then) {
    afterPick = then || null;
    closePop();
    closePanel();
    renderPicker();
    picker.hidden = false;
    $('input', picker).focus();
  }
  function closePicker() {
    picker.hidden = true;
    const then = afterPick;
    afterPick = null;
    if (then === 'comment' && who) setMode('comment');
    if (then === 'page' && who) { widen = []; openPop(null); }
  }
  picker.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('input', picker).value.replace(/\s+/g, ' ').trim();
    if (!name) { $('input', picker).focus(); return; }
    const same = people.find((p) => p.toLowerCase() === name.toLowerCase());
    if (!same) people.push(name);
    setWho(same || name, true);
    closePicker();
  });
  picker.addEventListener('click', (e) => {
    if (e.target === picker || e.target.closest('[data-later]')) { closePicker(); return; }
    const pick = e.target.closest('[data-pick]'), un = e.target.closest('[data-unlist]');
    if (pick) { setWho(pick.dataset.pick, true); closePicker(); }
    if (un) {
      people = people.filter((p) => p !== un.dataset.unlist);
      if (who === un.dataset.unlist) who = null;
      savePeople();
      showWho();
      renderPicker();
      $('input', picker).focus();
    }
  });

  // like the keyboard-language switcher: a list mid-screen with the current person lit, fading after the last press
  let hudTimer = 0;
  function showHud(html) {
    hud.innerHTML = html || people.map((p) => `<div class="${p === who ? 'rv-cur' : ''}"><span class="rv-dot" style="background:${color(p)}"></span>${esc(p)}</div>`).join('');
    hud.classList.add('rv-show');
    clearTimeout(hudTimer);
    hudTimer = later(() => hud.classList.remove('rv-show'), 900);
  }
  function cycleWho(step) {
    if (!people.length) { openPicker(); return; }
    const i = people.indexOf(who);
    setWho(people[(i + step + people.length) % people.length], true);
  }

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
    if (mode !== 'comment' || !pop.hidden || !pickable(e.target)) return;
    hoverEl = target(e.target);
    box(hoverEl);
  }, true);
  document.addEventListener('mouseleave', () => { if (mode === 'comment' && !picked) hl.hidden = tag.hidden = true; });

  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName) || (document.activeElement && document.activeElement.isContentEditable);
    if (e.key === 'Escape') {
      if (!welcome.hidden) closeWelcome();
      else if (!picker.hidden) closePicker();
      else if (!pop.hidden) { closePop(); e.preventDefault(); }
      else if (!panel.hidden) closePanel();
      else if (mode === 'comment') setMode('browse');
      return;
    }
    if (typing || e.metaKey || e.ctrlKey || e.altKey || !picker.hidden || !welcome.hidden) return;
    if (e.key === 's' || e.key === 'S') setSlow(rate === 1, true);
    if (e.key === '?') openWelcome();
    if (e.key === 'c' || e.key === 'C') { closePop(); setMode(mode === 'comment' ? 'browse' : 'comment'); }
    if (e.key === 'b' || e.key === 'B') { closePop(); setMode('browse'); }
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault(); // else the "f" is typed into the box that just took focus
      closePop();
      if (who) { widen = []; openPop(null); } else openPicker('page');
    }
    if (e.key === 'n' || e.key === 'N') cycleWho(e.shiftKey ? -1 : 1);
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
    if (note && note.ro) {
      pop.innerHTML = `
      <div class="rv-what"><span class="rv-dot" style="background:${color(note.by)}"></span><b title="${esc(byName(note) + ' · ' + note.what)}">${esc(byName(note))} · ${esc(note.what)}</b></div>
      <div class="rv-txt">${esc(note.body)}</div>
      <div class="rv-row"><span class="rv-grow"></span><button class="rv-btn rv-main" data-a="cancel">Close</button></div>`;
      pop.hidden = false;
      placePop(el);
      $('[data-a="cancel"]', pop).focus();
      return;
    }
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
    const act = a.dataset.a, ta = $('textarea', pop), body = ta ? ta.value.trim() : '';
    if (act === 'wider' && picked.parentElement && pickable(picked.parentElement)) { const p = picked.parentElement; widen.push(picked); openPop(p); }
    else if (act === 'narrower' && widen.length) openPop(widen.pop());
    else if (act === 'cancel') closePop();
    else if (act === 'delete') { if (confirm('Delete this comment?')) { const gone1 = editing; drop((n) => n === gone1); closePop(); paint(); } }
    else if (act === 'done') { editing.done = !editing.done; editing.rev++; save(); closePop(); paint(); }
    else if (act === 'save') {
      if (!body) { ta.focus(); return; }
      if (editing) { editing.body = body; editing.rev++; }
      else {
        const el = picked;
        if (hidden.includes(who || 'No name')) setHidden(hidden.filter((h) => h !== (who || 'No name')));
        notes.push({
          id: newId(), rev: 1, n: notes.reduce((m, x) => Math.max(m, x.n), 0) + 1,
          by: who, page: route(), sel: el ? selectorOf(el) : null, text: el ? snippet(el) : '', what: el ? describe(el) : 'Whole page',
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
  function setHidden(h) {
    hidden = h;
    S.set('reviewHidden', h);
    const b = $('[data-only]', bar), one = h.length === 1;
    b.hidden = !h.length;
    bar.classList.toggle('rv-filtered', !!h.length);
    $('.rv-dot', b).style.display = one ? '' : 'none'; // the class sets display, so `hidden` wouldn't hide it
    if (one) $('.rv-dot', b).style.background = color(h[0] === 'No name' ? null : h[0]);
    $('.rv-nm', b).textContent = one ? h[0] : `${h.length} people`;
  }
  function paint() {
    const all = list();
    // a hidden name with no comments left drops off, but only once the list it applies to has loaded
    if (hidden.length && (source === 'local' || sheetState === 'ok')) { const left = hidden.filter((h) => all.some((n) => byName(n) === h)); if (left.length !== hidden.length) setHidden(left); }
    bar.querySelector('.rv-count').textContent = all.filter((n) => !n.done).length;
    const here = all.filter((n) => n.page === route() && n.sel && shown(n));
    pins.innerHTML = here.map((n) => `<button class="rv rv-pin${n.done ? ' rv-done' : ''}" data-n="${n.n}" data-rv title="${esc(byName(n) + ': ' + n.body)}" style="pointer-events:auto${n.done ? '' : ';background:' + color(n.by)}">${n.n}</button>`).join('');
    if (!panel.hidden) renderPanel();
  }
  function track() {
    pins.querySelectorAll('.rv-pin').forEach((p) => {
      const n = list().find((x) => x.n === +p.dataset.n), el = n && find(n);
      const r = el && el.getBoundingClientRect();
      if (!r || (!r.width && !r.height)) { p.style.display = 'none'; return; }
      p.style.display = '';
      p.style.left = Math.max(14, Math.min(r.left + 4, innerWidth - 14)) + 'px';
      p.style.top = Math.max(14, r.top + 4) + 'px';
      p.style.visibility = r.bottom < 0 || r.top > innerHeight ? 'hidden' : '';
    });
    if (picked && !pop.hidden) box(picked, 'rv-picked');
    if (rate !== 1) retime();
    frame(track);
  }
  pins.addEventListener('click', (e) => {
    const p = e.target.closest('.rv-pin');
    if (!p) return;
    const n = list().find((x) => x.n === +p.dataset.n);
    if (n) openPop(find(n), n);
  });
  window.addEventListener('hashchange', () => { closePop(); later(paint, 50); });

  /* ---------- the list of all comments ---------- */
  function renderPanel() {
    const typed = $('[data-key] input', panel), keep = typed && [typed.value, document.activeElement === typed];
    const all = list(), mine = source === 'local';
    const authors = [...new Set(all.map(byName))];
    const visible = all.filter(shown);
    const pages = [...new Set(visible.map((n) => n.page))];
    const count = (a) => all.filter((n) => byName(n) === a).length;
    panel.innerHTML = `<header>
        <h2><span class="rv-grow">Comments (${all.length})</span><button class="rv-btn rv-sm" data-p="close" aria-label="Close">✕</button></h2>
        ${SHEET_URL ? `<div class="rv-filters" style="margin:0 0 10px"><button class="rv-chip" data-src="local" aria-pressed="${mine}">This laptop</button><button class="rv-chip" data-src="sheet" aria-pressed="${!mine}">Everyone (sheet)</button></div>
        <div class="rv-sync">${syncText()}</div>
        ${!mine && sheetState === 'locked' ? `<form class="rv-key" data-key><input type="password" placeholder="Password" aria-label="Password for everyone's comments" autocomplete="current-password"><button class="rv-btn rv-sm rv-main">Unlock</button></form>` : ''}` : ''}
        <div class="rv-tools">
          <button class="rv-btn rv-sm rv-main" data-p="page">+ Comment on this page</button>
          ${mine || sheetState === 'locked' ? '' : '<button class="rv-btn rv-sm" data-p="refresh">Refresh</button><button class="rv-btn rv-sm" data-p="lock">Lock</button>'}
          <button class="rv-btn rv-sm" data-p="copy"${all.length ? '' : ' disabled'}>Copy all</button>
          <button class="rv-btn rv-sm" data-p="download"${all.length ? '' : ' disabled'}>Download</button>
          ${mine ? `<button class="rv-btn rv-sm rv-red" data-p="clear"${all.length ? '' : ' disabled'}>Clear all</button>` : ''}
          <button class="rv-btn rv-sm" data-p="guide">How it works</button>
          <button class="rv-btn rv-sm" data-p="exit">Exit review</button>
        </div>
        ${authors.length > 1 ? `<div class="rv-filters">` +
          authors.map((a) => `<button class="rv-chip${hidden.includes(a) ? ' rv-off' : ''}" data-f="${esc(a)}" aria-pressed="${!hidden.includes(a)}" title="${hidden.includes(a) ? 'Show' : 'Hide'} ${esc(a)}'s comments"><span class="rv-dot" style="background:${color(a === 'No name' ? null : a)}"></span>${esc(a)} (${count(a)})</button>`).join('') +
          (hidden.length ? '<button class="rv-chip" data-f="">Show everyone</button>' : '') + '</div>' : ''}
      </header>
      <div class="rv-list">${all.length ? pages.map((p) => `<div class="rv-page">${esc(pageName(p))}</div>` +
        visible.filter((n) => n.page === p).map((n) => `<button class="rv-item${n.done ? ' rv-done' : ''}" data-go="${n.n}">
          <span class="rv-pin${n.done ? ' rv-done' : ''}"${n.done ? '' : ` style="background:${color(n.by)}"`}>${n.n}</span>
          <span><div class="rv-el"><span class="rv-by">${esc(byName(n))}</span> · ${esc(n.what)}</div><div class="rv-txt">${esc(n.body)}</div></span></button>`).join('')).join('') +
          (mine ? `<div class="rv-danger"><div class="rv-label">Delete one person's comments</div>
            <p>Separate from taking a name off the switcher. This permanently removes what they wrote.</p>
            ${authors.map((a) => `<div class="rv-row"><span class="rv-dot" style="background:${color(a === 'No name' ? null : a)}"></span><span class="rv-grow">${esc(a)} · ${count(a)}</span><button class="rv-btn rv-sm rv-red" data-del-by="${esc(a)}">Delete ${count(a)}</button></div>`).join('')}
          </div>` : '')
        : mine || sheetState === 'ok' ? '<p class="rv-empty">No comments yet. Switch to <b>Comment</b> and click any part of the page.</p>' : ''}</div>`;
    const input = $('[data-key] input', panel);
    if (input && keep) { input.value = keep[0]; if (keep[1]) input.focus(); }
  }
  function openPanel() { closePop(); setMode('browse'); renderPanel(); panel.hidden = false; }
  function closePanel() { panel.hidden = true; }

  function exportText() {
    const day = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const all = list(), authors = [...new Set(all.map(byName))];
    let out = `PEPSOMA — REVIEW COMMENTS (${all.length}) · ${day}\nFrom: ${authors.map((a) => `${a} (${all.filter((n) => byName(n) === a).length})`).join(', ')}\n`;
    [...new Set(all.map((n) => n.page))].forEach((p) => {
      out += `\n${pageName(p).toUpperCase()}  (#${p})\n`;
      all.filter((n) => n.page === p).forEach((n) => {
        out += `${n.n}. [${byName(n)}] ${n.what}${n.done ? '  [done]' : ''}\n   ${n.body.replace(/\n/g, '\n   ')}\n   (${device(n)}${n.sel ? ` · ${[n.cls, n.sel].filter(Boolean).join(' · ')}` : ''})\n`;
      });
    });
    return out;
  }
  panel.addEventListener('click', async (e) => {
    const go = e.target.closest('[data-go]');
    if (go) {
      const n = list().find((x) => x.n === +go.dataset.go);
      closePanel();
      if (route() !== n.page) location.hash = '#' + n.page;
      later(() => {
        const el = find(n);
        if (!el) { openPop(null, n); return; }
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        later(() => openPop(el, n), 450);
      }, 120);
      return;
    }
    const f = e.target.closest('[data-f]'), src = e.target.closest('[data-src]');
    if (f) { const a = f.dataset.f; setHidden(!a ? [] : hidden.includes(a) ? hidden.filter((h) => h !== a) : [...hidden, a]); paint(); return; }
    if (src) { setSource(src.dataset.src); return; }
    const del = e.target.closest('[data-del-by]');
    if (del) {
      const a = del.dataset.delBy, k = notes.filter((n) => byName(n) === a).length;
      if (confirm(`Delete all ${k} of ${a}'s comments? This can't be undone.`)) { drop((n) => byName(n) === a); paint(); }
      return;
    }
    const b = e.target.closest('[data-p]');
    if (!b) return;
    const act = b.dataset.p;
    if (act === 'close') closePanel();
    else if (act === 'page') { widen = []; openPop(null); }
    else if (act === 'refresh') load();
    else if (act === 'guide') openWelcome();
    else if (act === 'lock') { setKey(''); keyMsg = ''; sheet = []; sheetState = 'locked'; paint(); }
    else if (act === 'copy') {
      try { await navigator.clipboard.writeText(exportText()); b.textContent = 'Copied ✓'; }
      catch (err) { prompt('Copy the comments:', exportText()); }
      later(() => { b.textContent = 'Copy all'; }, 1600);
    }
    else if (act === 'download') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([exportText()], { type: 'text/plain' }));
      a.download = `pepsoma-review-${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      later(() => URL.revokeObjectURL(a.href), 1000);
    }
    else if (act === 'clear') { if (confirm(`Delete all ${notes.length} comments? Copy or download them first if you need them.`)) { drop(() => true); paint(); } }
    else if (act === 'exit') {
      if (!confirm('Turn off review mode in this tab? Your comments stay saved; add ?review to the address to come back.')) return;
      try { sessionStorage.removeItem(ON); } catch (e) { /* ignore */ }
      // drop ?review if it's there; otherwise the address doesn't change, so reload outright
      if (location.search) location.href = location.pathname + location.hash; else location.reload();
    }
  });

  /* ---------- sending to the Google Sheet ---------- */
  // Plain-text POST keeps it a "simple" request, so the browser skips the CORS preflight Apps Script can't answer.
  let syncing = false, syncFailed = false, retry = 0;
  const device = (n) => n.device || `${n.width < 700 ? 'phone' : n.width < 1100 ? 'tablet' : 'desktop'} ${n.width}px, ${n.theme}`;
  const unsent = () => notes.filter((n) => n.sent !== n.rev);
  function syncText() {
    if (source === 'sheet' && sheetState === 'loading') return 'Loading comments from the sheet…';
    if (source === 'sheet' && sheetState === 'locked') return keyMsg ? `<span class="rv-warn">${esc(keyMsg)}</span>` : "Enter the password to see everyone's comments.";
    if (source === 'sheet' && sheetState === 'error') return `<span class="rv-warn">Couldn't load the sheet — check the connection</span><button class="rv-btn rv-sm" data-p="refresh">Retry</button>`;
    const k = unsent().length + gone.length;
    if (syncing) return 'Sending to the Google Sheet…';
    if (!k) return 'All comments sent to the Google Sheet ✓';
    return `<span class="rv-warn">${k} change${k === 1 ? '' : 's'} not sent to the Google Sheet yet${syncFailed ? ' (offline? retrying)' : ''}</span>`;
  }
  function showSync() { const el = $('.rv-sync', panel); if (el) el.innerHTML = syncText(); }
  async function sync() {
    if (!SHEET_URL || syncing) return;
    const rows = unsent().map((n) => ({ n, rev: n.rev })), removing = gone.slice();
    if (!rows.length && !removing.length) return;
    syncing = true;
    showSync();
    try {
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          save: rows.map(({ n }) => ({ id: n.id, at: n.at, by: byName(n), page: location.origin + location.pathname + '#' + n.page, what: n.what, body: n.body, done: !!n.done, device: device(n), sel: n.sel || '' })),
          remove: removing,
        }),
      };
      let res = null;
      try { res = await fetch(SHEET_URL, req); } catch (e) { /* the reply may not be readable cross-site; send again without reading it */ }
      if (res) { const out = await res.json(); if (!out.ok) throw new Error(out.error); }
      else await fetch(SHEET_URL, { ...req, mode: 'no-cors' }); // still throws when offline; saves are matched by id, so a repeat can't duplicate
      rows.forEach(({ n, rev }) => { n.sent = rev; });
      gone = gone.filter((id) => !removing.includes(id));
      S.set('reviewNotes', notes);
      S.set('reviewGone', gone);
      syncFailed = false;
      if (source === 'sheet') load();
    } catch (e) {
      syncFailed = true;
      clearTimeout(retry);
      retry = later(sync, 15000);
    }
    syncing = false;
    showSync();
    if (!syncFailed && (unsent().length || gone.length)) sync();
  }
  window.addEventListener('online', sync);

  /* ---------- everyone's comments, read from the sheet ---------- */
  // sheet rows hold the full address; only rows from this site's own page count, and the part after # becomes the route
  const where = (u) => { try { const x = new URL(u); return [x.origin + x.pathname, x.hash.slice(1).split('?')[0] || '/']; } catch (e) { return []; } };
  // the password is checked by the Apps Script (its ADMIN_KEY property); this tab remembers it until it closes or Lock
  const KEY = 'pepsoma.reviewKey';
  let key = '', keyMsg = '';
  try { key = sessionStorage.getItem(KEY) || ''; } catch (e) { /* blocked storage: ask each time */ }
  const setKey = (k) => { key = k; try { k ? sessionStorage.setItem(KEY, k) : sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ } };
  async function load() {
    const mine = ++loads;
    if (!key) { sheet = []; sheetState = 'locked'; paint(); return; }
    sheetState = 'loading';
    paint();
    try {
      // POST so the password never sits in a URL
      const out = await (await fetch(SHEET_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ list: true, key }) })).json();
      if (mine !== loads) return;
      if (out.locked) { setKey(''); keyMsg = out.error || 'Wrong password.'; sheet = []; sheetState = 'locked'; paint(); const i = $('[data-key] input', panel); if (i) i.focus(); return; }
      if (!out.ok) throw new Error(out.error);
      const here = location.origin + location.pathname;
      sheet = out.comments.filter((c) => where(c.page)[0] === here).map((c, i) => ({ ...c, ro: true, n: i + 1, page: where(c.page)[1] }));
      sheetState = 'ok';
    } catch (e) {
      if (mine !== loads) return;
      sheetState = 'error';
    }
    paint();
  }
  function setSource(s) {
    source = s;
    S.set('reviewSource', s);
    closePop();
    if (s === 'sheet') load(); else paint();
    const input = $('[data-key] input', panel);
    if (input) input.focus();
  }
  panel.addEventListener('submit', (e) => {
    if (!e.target.closest('[data-key]')) return;
    e.preventDefault();
    const v = $('input', e.target).value;
    if (!v) return;
    setKey(v);
    keyMsg = '';
    load();
  });

  /* ---------- slow motion (S): the store's animations at quarter speed ---------- */
  // CSS and Web Animations get a playbackRate; rAF timestamps, performance.now and timer delays stretch to match, so
  // JS-driven motion (count-up stats, the molecule network) and timed steps (the cart opening after the fly-in) stay in step
  const SLOW = 0.25, SLOW_KEY = 'pepsoma.reviewSlow';
  const realNow = performance.now.bind(performance), realInterval = window.setInterval.bind(window);
  let rate = 1, vBase = 0, rBase = 0;
  const vnow = () => vBase + (realNow() - rBase) * rate;
  performance.now = vnow;
  window.requestAnimationFrame = (cb) => frame((t) => cb(vBase + (t - rBase) * rate));
  window.setTimeout = (fn, ms, ...a) => later(fn, (ms || 0) / rate, ...a);
  window.setInterval = (fn, ms, ...a) => realInterval(fn, (ms || 0) / rate, ...a);
  function retime() {
    document.getAnimations().forEach((a) => {
      const want = (a.playbackRate < 0 ? -1 : 1) * rate;
      if (a.playbackRate !== want && !isUI(a.effect && a.effect.target)) a.playbackRate = want;
    });
  }
  function setSlow(on, flash) {
    vBase = vnow();
    rBase = realNow();
    rate = on ? SLOW : 1;
    retime();
    const b = $('[data-slow]', bar);
    b.setAttribute('aria-pressed', String(on));
    $('.rv-lbl', b).textContent = on ? '¼ speed' : 'Slow-mo';
    try { on ? sessionStorage.setItem(SLOW_KEY, '1') : sessionStorage.removeItem(SLOW_KEY); } catch (e) { /* ignore */ }
    if (flash) showHud(`<div class="rv-cur">${on ? 'Slow motion · ¼ speed' : 'Normal speed'}</div>`);
  }

  /* ---------- the welcome guide: first visit on this device, then "How it works" or ? ---------- */
  const STEPS = [
    ['Add your name', 'Each comment is signed, so we know who said what. You\'ll type it next.',
      '<i class="wl-field"><b>Kareem</b><u></u></i><i class="wl-chip c1">Kareem</i><i class="wl-chip c2">Sam</i>'],
    ['Press C, then click anything', 'Hovering outlines what you\'ll comment on. Click it, write a note, save. Bigger ↑ grabs the whole section.',
      '<i class="wl-bar"></i><i class="wl-head"></i><i class="wl-txt"></i><i class="wl-btn"></i><i class="wl-out"></i><i class="wl-bub">Make it navy?</i><i class="wl-cur"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 3l13 7.5-5.6 1.4 3.3 6-2.4 1.3-3.3-6L6 17z" fill="#1b1a17" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></i>'],
    ['Passing the laptop? Press N', 'N switches to the next person and Shift+N goes back. Everyone gets their own color.',
      '<i class="wl-hud"><i class="wl-sel"></i><span style="--c:#ff5a1f">Kareem</span><span style="--c:#2563eb">Sam</span><span style="--c:#16a34a">Alex</span></i><i class="wl-key">N</i>'],
    ['It all lands in one sheet', 'Comments save as you go. The Comments panel lists them and can show or hide each person.',
      '<i class="wl-th"></i>' + [['#ff5a1f', '62%', 0], ['#2563eb', '48%', .5], ['#16a34a', '70%', 1], ['#ff5a1f', '40%', 1.5]].map(([c, w, d], i) => `<i class="wl-row" style="top:${32 + i * 18}px;--c:${c};--w:${w};animation-delay:${d}s"></i>`).join('')],
  ];
  const WELCOME = `<div class="rv-wl" role="dialog" aria-modal="true" aria-label="How review mode works">
    <p class="rv-kick">Pepsoma · review mode</p>
    <h2>Leave notes right on the site</h2>
    <p class="rv-lede">This is the real store with a comment layer on top. Point at anything you'd change, say why, and it lands in a shared sheet. There are no wrong answers.</p>
    <div class="rv-wl-steps">${STEPS.map(([h, p, art], i) => `<div class="rv-wl-step"><div class="rv-art" aria-hidden="true">${art}</div><span class="rv-n">${i + 1}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
    <div class="rv-wl-keys"><span><kbd>C</kbd>Comment mode</span><span><kbd>F</kbd>Whole page</span><span><kbd>B</kbd>Back to browsing</span><span><kbd>N</kbd>Next person</span><span><kbd>S</kbd>Slow motion</span><span><kbd>?</kbd>This guide</span></div>
    <div class="rv-wl-foot"><p>Saved automatically. Nothing on the store itself changes.</p><button class="rv-btn rv-main rv-wl-go" data-start>Let's start →</button></div>
  </div>`;
  function openWelcome() {
    closePop();
    closePanel();
    picker.hidden = true;
    welcome.innerHTML = WELCOME;
    welcome.hidden = false;
    welcome.scrollTop = 0;
    $('[data-start]', welcome).focus({ preventScroll: true });
  }
  function closeWelcome() {
    welcome.hidden = true;
    welcome.innerHTML = '';
    S.set('reviewWelcomed', true);
    if (!who) openPicker();
  }
  welcome.addEventListener('click', (e) => { if (e.target === welcome || e.target.closest('[data-start]')) closeWelcome(); });

  showWho();
  setHidden(hidden);
  if (source === 'sheet') load(); else paint();
  frame(track);
  sync();
  try { if (sessionStorage.getItem(SLOW_KEY)) setSlow(true); } catch (e) { /* ignore */ }
  if (!S.get('reviewWelcomed', false)) openWelcome();
  else if (!who) openPicker();
})();
