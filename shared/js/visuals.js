/* Pepsoma — generated product imagery (SVG vials), lot records and COA documents.
   Vials are drawn in code so the demo needs no photography; swap for real
   product photos by returning an <img> from PS.vial(). */
(function () {
  const PS = window.PS;
  let uid = 0;

  /* ---------- SVG vial ---------- */
  PS.vial = function (p, opts) {
    opts = opts || {};
    const theme = opts.theme || 'light';
    const id = 'v' + ++uid;
    const size = opts.size || (p.sizes[0] && p.sizes[0].label) || '';
    const lines = p.vial || [p.name];
    const longest = Math.max(...lines.map((l) => l.length));
    const fs = longest > 12 ? 9 : longest > 9 ? 11 : longest > 6 ? 13 : 15;
    const lot = PS.lots(p)[0];
    const powder = p.liquid ? null : p.powder || (theme === 'dark' ? '#e9e4d8' : '#f4f1ff');
    const esc = PS.esc;
    const nameY = lines.length > 1 ? 146 : 152;
    const nameText = lines.map((l, i) => `<tspan x="60" dy="${i ? fs + 1 : 0}">${esc(l)}</tspan>`).join('');
    const liquid = p.liquid ? `<rect x="19" y="120" width="82" height="108" rx="12" fill="url(#${id}liq)"/>` : '';
    const cake = powder ? `<path d="M22 214 Q26 204 40 206 Q60 200 80 206 Q94 204 98 214 L98 222 Q98 230 88 230 L32 230 Q22 230 22 222Z" fill="${powder}" opacity=".95"/>` : '';

    let cap, label, glassTint, glassStroke;
    if (theme === 'dark') {
      glassTint = 'rgba(255,255,255,.06)'; glassStroke = 'rgba(255,255,255,.28)';
      cap = `
        <defs>
          <linearGradient id="${id}m" x1="0" x2="1"><stop offset="0" stop-color="#6f6f6f"/><stop offset=".25" stop-color="#e9e9e9"/><stop offset=".5" stop-color="#9a9a9a"/><stop offset=".8" stop-color="#f2f2f2"/><stop offset="1" stop-color="#707070"/></linearGradient>
          <linearGradient id="${id}t" x1="0" x2="1"><stop offset="0" stop-color="#121212"/><stop offset=".5" stop-color="#2b2b2b"/><stop offset="1" stop-color="#0c0c0c"/></linearGradient>
          <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="rgba(255,255,255,.18)"/><stop offset=".15" stop-color="rgba(255,255,255,.04)"/><stop offset=".85" stop-color="rgba(255,255,255,.02)"/><stop offset="1" stop-color="rgba(255,255,255,.14)"/></linearGradient>
          <linearGradient id="${id}liq" x1="0" y1="0" y2="1"><stop offset="0" stop-color="rgba(220,230,240,.12)"/><stop offset="1" stop-color="rgba(220,230,240,.28)"/></linearGradient>
        </defs>
        <rect x="30" y="6" width="60" height="30" rx="5" fill="url(#${id}t)"/>
        <rect x="30" y="6" width="60" height="6" rx="3" fill="#3a3a3a"/>
        <rect x="25" y="34" width="70" height="22" rx="3" fill="url(#${id}m)"/>`;
      label = `
        <rect x="16" y="104" width="88" height="96" fill="#0b0b0b"/>
        <g opacity=".9"><path d="M16 104 L30 104 L16 124Z" fill="#a98f55"/><path d="M36 104 L44 104 L16 144 L16 132Z" fill="#a98f55" opacity=".55"/></g>
        <text x="60" y="124" text-anchor="middle" font-family="Inter Tight, Inter, sans-serif" font-size="6" letter-spacing="2.2" fill="#a98f55" font-weight="600">PEPSOMA</text>
        <text x="60" y="${nameY}" text-anchor="middle" font-family="Inter Tight, Inter, sans-serif" font-weight="800" font-size="${fs}" fill="#f4f1ea">${nameText}</text>
        <rect x="38" y="${nameY + (lines.length > 1 ? fs + 8 : 10)}" width="44" height="12" rx="6" fill="none" stroke="#f4f1ea" stroke-opacity=".5"/>
        <text x="60" y="${nameY + (lines.length > 1 ? fs + 16.5 : 18.5)}" text-anchor="middle" font-family="Inter, sans-serif" font-size="6.5" fill="#f4f1ea">${esc(size)}</text>
        <text x="60" y="193" text-anchor="middle" font-family="Inter, sans-serif" font-size="4.6" letter-spacing="1" fill="#8a857a">${lot ? esc(lot.code) + ' · ' : ''}RESEARCH USE ONLY</text>`;
    } else {
      glassTint = 'rgba(224,215,255,.28)'; glassStroke = 'rgba(31,10,89,.18)';
      cap = `
        <defs>
          <linearGradient id="${id}m" x1="0" x2="1"><stop offset="0" stop-color="#b9b3c9"/><stop offset=".3" stop-color="#f4f2f8"/><stop offset=".6" stop-color="#cfc9dc"/><stop offset="1" stop-color="#a9a2bc"/></linearGradient>
          <linearGradient id="${id}t" x1="0" x2="1"><stop offset="0" stop-color="${p.accent}" stop-opacity=".85"/><stop offset=".5" stop-color="${p.accent}"/><stop offset="1" stop-color="${p.accent}" stop-opacity=".8"/></linearGradient>
          <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="rgba(255,255,255,.7)"/><stop offset=".2" stop-color="rgba(255,255,255,.15)"/><stop offset=".8" stop-color="rgba(255,255,255,.05)"/><stop offset="1" stop-color="rgba(255,255,255,.5)"/></linearGradient>
          <linearGradient id="${id}liq" x1="0" y1="0" y2="1"><stop offset="0" stop-color="rgba(160,190,230,.18)"/><stop offset="1" stop-color="rgba(160,190,230,.4)"/></linearGradient>
        </defs>
        <rect x="30" y="6" width="60" height="30" rx="8" fill="url(#${id}t)"/>
        <rect x="25" y="34" width="70" height="22" rx="3" fill="url(#${id}m)"/>`;
      label = `
        <rect x="16" y="104" width="88" height="96" fill="#fff"/>
        <rect x="16" y="104" width="88" height="7" fill="${p.accent}"/>
        <text x="60" y="126" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-weight="600" font-size="9" fill="#1f0a59">pepsoma</text>
        <text x="60" y="${nameY}" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="${fs}" fill="#1f0a59">${nameText}</text>
        <text x="60" y="${nameY + (lines.length > 1 ? fs + 16 : 18)}" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="7.5" fill="#5b5277">${esc(size)}${p.purity ? ' · ≥' + Math.floor(p.purity) + '%' : ''}</text>
        <text x="60" y="193" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="4.6" letter-spacing="1" fill="#7a6e96">${lot ? esc(lot.code) + ' · ' : ''}RESEARCH USE ONLY</text>`;
    }

    return `<svg class="vial-svg" viewBox="0 0 120 240" role="img" aria-label="${esc(p.name)} ${esc(size)} vial">
      ${cap}
      <rect x="33" y="56" width="54" height="10" fill="${glassTint}" stroke="${glassStroke}"/>
      <path d="M33 66 Q16 70 16 88 L16 220 Q16 234 30 234 L90 234 Q104 234 104 220 L104 88 Q104 70 87 66Z" fill="${glassTint}" stroke="${glassStroke}"/>
      ${liquid}${cake}${label}
      <path d="M33 66 Q16 70 16 88 L16 220 Q16 234 30 234 L90 234 Q104 234 104 220 L104 88 Q104 70 87 66Z" fill="url(#${id}g)"/>
      <rect x="22" y="80" width="5" height="140" rx="2.5" fill="#fff" opacity="${theme === 'dark' ? '.10' : '.55'}"/>
    </svg>`;
  };

  // Image for any product (bundles show their component vials)
  PS.productImage = function (p, opts) {
    opts = opts || {};
    if (p.includes) {
      const vials = p.includes.map(([id, s]) => {
        const c = PS.getProduct(id);
        return `<span class="vial-item">${PS.vial(c, { theme: opts.theme, size: PS.getSize(c, s).label })}</span>`;
      }).join('');
      return `<span class="vial-group n${p.includes.length}">${vials}</span>`;
    }
    return `<span class="vial-single">${PS.vial(p, opts)}</span>`;
  };

  /* ---------- lots & COA data (deterministic demo data) ---------- */
  const LOT_DATES = [[2026, 8, 4], [2026, 6, 18], [2026, 4, 27]];
  const cache = {};
  PS.lots = function (p) {
    if (!p || p.noCoa || p.includes) return [];
    if (cache[p.id]) return cache[p.id];
    const r = PS.rng(PS.hash(p.id));
    const mg = parseFloat(p.sizes[0].label);
    cache[p.id] = LOT_DATES.map(([y, m, d], i) => {
      const dt = new Date(y, m, d - Math.floor(r() * 9));
      const code = `PS-${p.code}-${String(y).slice(2)}${String(m + 1).padStart(2, '0')}${'ABC'[i]}`;
      const purity = (i === 0 ? p.purity : Math.min(99.9, p.purity - 0.35 + r() * 0.6)).toFixed(1);
      const observed = p.mw ? (p.mw + (r() - 0.5) * 0.6).toFixed(1) : null;
      return {
        code, product: p.id, current: i === 0, tested: dt.getTime(), purity,
        identity: p.mw ? { expected: p.mw.toFixed(1), observed } : null,
        content: `${(mg * (1.005 + r() * 0.04)).toFixed(mg >= 100 ? 1 : 2)} mg / vial (label ${p.sizes[0].label})`,
        endotoxin: (0.08 + r() * 0.3).toFixed(2),
        water: (2 + r() * 3.5).toFixed(1),
        appearance: p.appearance || 'White lyophilized powder',
        seed: PS.hash(code),
      };
    });
    return cache[p.id];
  };
  PS.allLots = () => PS.products.flatMap((p) => PS.lots(p));
  PS.findLot = (code) => PS.allLots().find((l) => l.code.toLowerCase() === String(code).trim().toLowerCase());

  /* ---------- HPLC chromatogram (SVG path) ---------- */
  PS.chromatogram = function (lot) {
    const r = PS.rng(lot.seed);
    const imp = (100 - lot.purity) / 100;
    const peaks = [
      { t: 2.1, h: 8 + r() * 6, w: 0.12 },
      { t: 10.2 + r() * 1.5, h: 100, w: 0.16 },
      { t: 8.6 + r(), h: 100 * imp * 1.6, w: 0.14 },
      { t: 12.6 + r(), h: 100 * imp * 0.9, w: 0.14 },
    ];
    const W = 520, H = 150, tmax = 20;
    let d = '';
    for (let t = 0; t <= tmax; t += 0.025) {
      let y = 0;
      peaks.forEach((p) => { y += p.h * Math.exp(-Math.pow(t - p.t, 2) / (2 * p.w * p.w)); });
      y += (r() - 0.5) * 0.35;
      const x = (t / tmax) * W, yy = H - 10 - y * 1.25;
      d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + yy.toFixed(1);
    }
    const main = peaks[1];
    const ticks = [0, 5, 10, 15, 20].map((t) => `<text x="${(t / tmax) * W}" y="${H + 6}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".6">${t}</text>`).join('');
    return `<svg class="chromatogram" viewBox="-6 -4 ${W + 12} ${H + 14}" preserveAspectRatio="none" role="img" aria-label="HPLC chromatogram, main peak ${lot.purity}%">
      <line x1="0" y1="${H - 10}" x2="${W}" y2="${H - 10}" stroke="currentColor" opacity=".25"/>
      <path d="${d}" fill="none" stroke="var(--chrom, currentColor)" stroke-width="1.3"/>
      <text x="${(main.t / tmax) * W + 8}" y="16" font-size="9" fill="currentColor">${main.t.toFixed(2)} min · ${lot.purity}%</text>
      ${ticks}
    </svg>`;
  };

  /* ---------- COA document ---------- */
  PS.coaDoc = function (lot) {
    const p = PS.getProduct(lot.product);
    const esc = PS.esc;
    const row = (test, method, spec, result) => `<tr><td>${test}</td><td>${method}</td><td>${spec}</td><td><strong>${result}</strong></td><td><span class="coa-pass">Pass</span></td></tr>`;
    return `<article class="coa-doc">
      <div class="coa-watermark" aria-hidden="true">SAMPLE DATA</div>
      <header class="coa-head">
        <div><div class="coa-brand">${esc(PS.company.name)}</div><div class="coa-kicker">Certificate of Analysis</div></div>
        <div class="coa-meta"><div><span>Lot</span><strong>${esc(lot.code)}</strong></div><div><span>Tested</span><strong>${PS.date(lot.tested)}</strong></div></div>
      </header>
      <div class="coa-product">
        <div><span>Product</span><strong>${esc(p.name)}</strong><em>${esc(p.full || '')}</em></div>
        <div><span>CAS</span><strong>${esc(p.cas)}</strong></div>
        <div><span>Formula</span><strong>${esc(p.formula)}</strong></div>
        <div><span>Mol. weight</span><strong>${p.mw ? p.mw + ' g/mol' : '—'}</strong></div>
      </div>
      <div class="coa-chart"><div class="coa-label">RP-HPLC chromatogram · C18 · 220 nm · retention time (min)</div>${PS.chromatogram(lot)}</div>
      <div class="coa-table-wrap"><table class="coa-table">
        <thead><tr><th>Test</th><th>Method</th><th>Specification</th><th>Result</th><th></th></tr></thead>
        <tbody>
          ${row('Purity', 'RP-HPLC', '≥ 98.0%', lot.purity + '%')}
          ${lot.identity ? row('Identity', 'ESI-MS', `${lot.identity.expected} ± 1.0 Da`, lot.identity.observed + ' Da') : row('Identity', 'HPLC co-elution', 'Matches reference', 'Conforms')}
          ${row('Net content', 'Gravimetric / HPLC', '≥ 100% of label', esc(lot.content))}
          ${row('Endotoxin', 'LAL (USP ⟨85⟩)', '< 1.0 EU/mg', lot.endotoxin + ' EU/mg')}
          ${row('Heavy metals', 'ICP-MS', 'Pb, As, Cd, Hg < 0.5 ppm', 'All < 0.5 ppm')}
          ${row('Sterility', 'USP ⟨71⟩', 'No growth', 'No growth')}
          ${row('Water content', 'Karl Fischer', '≤ 8.0%', lot.water + '%')}
          ${row('Appearance', 'Visual', 'Conforms to description', esc(lot.appearance))}
        </tbody>
      </table></div>
      <footer class="coa-foot">
        <p>Tested by an independent ISO/IEC 17025-accredited laboratory. Results apply only to the lot identified above.</p>
        <p><strong>For research use only.</strong> Not for human or veterinary use. Demo certificate — illustrative values only.</p>
      </footer>
    </article>`;
  };
})();
