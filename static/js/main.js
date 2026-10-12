/* Protocol2TTE project page — interactions
   (no build step; plain ES2017, works on GitHub Pages and file://) */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SVGNS = 'http://www.w3.org/2000/svg';

  /* ── TABLE II data (manuscript) ─────────────────────────── */
  // [name, slug, FC[PKO,Concept,Code,Final] | null, RAG[...], bestMode, bestFinal, rank]
  const MODELS = [
    ['DeepSeek-R1 14B', 'deepseek-r1:14b', [0.536, 0.545, 0.706, 0.573], [0.369, 0.357, 0.476, 0.387], 'FC', 0.573, 1],
    ['Llama 3.1 8B', 'llama3.1:8b', [0.600, 0.409, 0.667, 0.556], [0.366, 0.296, 0.556, 0.383], 'FC', 0.556, 2],
    ['GPT-OSS 20B', 'gpt-oss:20b', [0.515, 0.400, 0.667, 0.511], [0.435, 0.316, 0.625, 0.437], 'FC', 0.511, 3],
    ['MedGemma 27B', 'alibayram/medgemma:27b', [0.449, 0.462, 0.625, 0.488], [0.462, 0.435, 0.588, 0.479], 'FC', 0.488, 4],
    ['Mistral Small 24B', 'mistral-small:24b', [0.435, 0.421, 0.556, 0.455], [0.368, 0.140, 0.286, 0.283], 'FC', 0.455, 5],
    ['Mistral 7B', 'mistral:7b', [0.387, 0.435, 0.571, 0.438], [0.299, 0.321, 0.632, 0.372], 'FC', 0.438, 6],
    ['Phi-4 14B', 'phi4:14b', null, [0.381, 0.286, 0.706, 0.417], 'RAG', 0.417, 7],
    ['Gemma 3 12B', 'gemma3:12b', [0.356, 0.386, 0.526, 0.399], [0.345, 0.490, 0.421, 0.404], 'RAG', 0.404, 8],
    ['Qwen3 32B', 'qwen3:32b', [0.391, 0.377, 0.429, 0.394], [0.330, 0.292, 0.333, 0.319], 'FC', 0.394, 9],
    ['Qwen2.5 7B Instruct', 'qwen2.5:7b-instruct', [0.286, 0.151, 0.400, 0.268], [0.344, 0.246, 0.500, 0.346], 'RAG', 0.346, 10],
    ['Llama 3.2 3B', 'llama3.2:3b', [0.000, 0.111, 0.200, 0.073], [0.361, 0.353, 0.211, 0.328], 'RAG', 0.328, 11],
    ['Qwen3 8B', 'qwen3:8b', [0.300, 0.255, 0.400, 0.306], [0.269, 0.211, 0.316, 0.261], 'FC', 0.306, 12]
  ];
  const METRICS = ['PKO', 'Concept', 'Code', 'Final'];
  const f3 = (v) => (v == null ? '—' : v.toFixed(3));

  /* ── Navbar: burger + scroll spy + back-to-top ──────────── */
  const burger = $('#navBurger'), links = $('#navLinks');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => {
    links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
  }));
  const navMap = $$('#navLinks a').map((a) => [a, document.querySelector(a.getAttribute('href'))]).filter((x) => x[1]);
  const btt = $('#backToTop');
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  let ticking = false;
  function onScroll() {
    const y = window.scrollY + 120;
    let cur = null;
    navMap.forEach(([a, sec]) => { if (sec.offsetTop <= y) cur = a; });
    navMap.forEach(([a]) => a.classList.toggle('active', a === cur));
    btt.classList.toggle('show', window.scrollY > 700);
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ── Reveal + counters + hero bars ──────────────────────── */
  function runCounter(el) {
    const to = +el.dataset.to, sep = el.dataset.sep === '1', t0 = performance.now(), dur = 1300;
    const fmt = (n) => (sep ? n.toLocaleString('en-US') : String(n));
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(to * e));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      if (el.classList.contains('counter')) reduce ? (el.textContent = (+el.dataset.to).toLocaleString('en-US')) : runCounter(el);
      io.unobserve(el);
    });
  }, { threshold: 0.12 }) : null;
  $$('.reveal, .counter, .ring').forEach((el) => {
    if (io) io.observe(el); else { el.classList.add('in'); if (el.classList.contains('counter')) el.textContent = (+el.dataset.to).toLocaleString('en-US'); }
  });
  setTimeout(() => $$('.bar-fill').forEach((b) => { b.style.width = (+b.dataset.w / 22 * 100) + '%'; }), 250);

  /* ── Tabs ───────────────────────────────────────────────── */
  $$('[data-tabs]').forEach((box) => {
    const btns = $$('.tab-btn', box), panes = $$('.tab-pane', box);
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.classList.toggle('active', x === b));
      panes.forEach((p, i) => p.classList.toggle('active', i === +b.dataset.tab));
    }));
  });

  /* ── Image zoom modal ───────────────────────────────────── */
  const modal = $('#imgModal'), mImg = $('#modalImg'), mCap = $('#modalCap');
  function openModal(img) {
    mImg.src = img.currentSrc || img.src; mImg.alt = img.alt;
    const fig = img.closest('figure'), cap = fig && (fig.querySelector('figcaption') || (fig.parentElement && fig.parentElement.querySelector('.figcap')));
    mCap.textContent = cap ? cap.textContent.replace('Click to zoom', '').trim() : img.alt;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  }
  function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  document.addEventListener('click', (e) => { const img = e.target.closest('img.zoomable'); if (img) openModal(img); });
  modal.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  /* ── Generic sortable table helper ──────────────────────── */
  function parseCell(t) {
    const s = String(t).replace(/,/g, '').trim();
    const m = s.match(/^[<>≤≥]?\s*([-−+]?\d*\.?\d+)/);
    return m ? parseFloat(m[1].replace('−', '-')) : null;
  }
  function makeSortable(table, getRows, render) {
    let state = { col: null, dir: 1 };
    $$('th.sortable-col', table).forEach((th) => {
      th.addEventListener('click', () => {
        const col = +th.dataset.col;
        state.dir = state.col === col ? -state.dir : (th.dataset.desc ? -1 : 1);
        state.col = col;
        $$('th.sortable-col', table).forEach((x) => x.classList.remove('sort-asc', 'sort-desc'));
        th.classList.add(state.dir === 1 ? 'sort-asc' : 'sort-desc');
        const rows = getRows().slice().sort((a, b) => {
          const va = a.key[col], vb = b.key[col];
          const na = typeof va === 'number', nb = typeof vb === 'number';
          if (va == null && vb == null) return 0;
          if (va == null) return 1; if (vb == null) return -1;
          if (na && nb) return (va - vb) * state.dir;
          return String(va).localeCompare(String(vb), undefined, { numeric: true }) * state.dir;
        });
        render(rows);
      });
    });
    return () => { state = { col: null, dir: 1 }; };
  }

  /* ── Leaderboard (TABLE II) ─────────────────────────────── */
  const lb = $('#leaderboard');
  let lbMode = 'both';
  function colMax(idx, mode) {
    const vals = MODELS.map((m) => (mode === 'FC' ? m[2] : m[3])).filter(Boolean).map((v) => v[idx]);
    return Math.max.apply(null, vals);
  }
  function buildLeaderboard() {
    const showFC = lbMode !== 'RAG', showRAG = lbMode !== 'FC';
    let h = '<thead>';
    if (lbMode === 'both') {
      h += '<tr><th rowspan="2" class="sortable-col" data-col="0">Rank</th><th rowspan="2" class="sortable-col" data-col="1">Model</th>' +
        '<th colspan="4" class="grp-fc" style="text-align:center">Full Context (FC)</th><th colspan="4" class="grp-rag" style="text-align:center">RAG (Nomic)</th>' +
        '<th rowspan="2" class="sortable-col" data-col="10">Best mode</th><th rowspan="2" class="num sortable-col" data-col="11" data-desc="1">Best final</th></tr><tr>';
      METRICS.forEach((m, i) => { h += `<th class="num sortable-col" data-col="${2 + i}" data-desc="1">${m}</th>`; });
      METRICS.forEach((m, i) => { h += `<th class="num sortable-col" data-col="${6 + i}" data-desc="1">${m}</th>`; });
      h += '</tr>';
    } else {
      h += `<tr><th class="sortable-col" data-col="0">Rank</th><th class="sortable-col" data-col="1">Model</th>`;
      METRICS.forEach((m, i) => { h += `<th class="num sortable-col ${lbMode === 'FC' ? 'grp-fc' : 'grp-rag'}" data-col="${(lbMode === 'FC' ? 2 : 6) + i}" data-desc="1">${m}</th>`; });
      h += `<th class="sortable-col" data-col="10">Best mode</th><th class="num sortable-col" data-col="11" data-desc="1">Best final</th></tr>`;
    }
    h += '</thead><tbody></tbody>';
    lb.innerHTML = h;
    const maxFC = METRICS.map((_, i) => colMax(i, 'FC')), maxRAG = METRICS.map((_, i) => colMax(i, 'RAG'));
    const rows = MODELS.map((m) => {
      const key = [m[6], m[0]].concat(m[2] || [null, null, null, null], m[3], [m[4], m[5]]);
      const cells = (arr, mx, cls) => METRICS.map((_, i) => {
        if (!arr) return `<td class="num ${cls} na">—</td>`;
        const v = arr[i], isMax = v === mx[i];
        if (i === 3) return `<td class="num ${cls}${isMax ? ' col-max' : ''}"><div class="score-cell">${f3(v)}<span class="score-bar"><span style="width:${(v / 0.6) * 100}%"></span></span></div></td>`;
        return `<td class="num ${cls}${isMax ? ' col-max' : ''}">${f3(v)}</td>`;
      }).join('');
      const html = `<tr class="${m[6] === 1 ? 'top' : ''}"><td><span class="rank-badge">${m[6]}</span></td>` +
        `<td><span class="model-name">${esc(m[0])}</span><span class="model-slug">${esc(m[1])}</span></td>` +
        (showFC ? cells(m[2], maxFC, 'fc-cell') : '') + (showRAG ? cells(m[3], maxRAG, 'rag-cell') : '') +
        `<td><span class="mode-pill ${m[4]}">${m[4]}</span></td><td class="num best-cell">${f3(m[5])}</td></tr>`;
      return { key, html };
    });
    const tb = $('tbody', lb);
    const render = (rs) => { tb.innerHTML = rs.map((r) => r.html).join(''); };
    render(rows);
    makeSortable(lb, () => rows, render);
  }
  $$('#lbMode .seg-btn').forEach((b) => b.addEventListener('click', () => {
    $$('#lbMode .seg-btn').forEach((x) => x.classList.toggle('active', x === b));
    lbMode = b.dataset.mode; buildLeaderboard();
  }));
  buildLeaderboard();

  /* ── Model explorer ─────────────────────────────────────── */
  const sel = $('#modelSelect'), exBody = $('#explorerBody');
  sel.innerHTML = MODELS.map((m, i) => `<option value="${i}">#${m[6]} · ${esc(m[0])}</option>`).join('');
  function renderExplorer() {
    const m = MODELS[+sel.value];
    let h = `<div class="ex-meta"><span>Ollama tag: <b>${esc(m[1])}</b></span><span>Best mode: <b>${m[4]}</b></span><span>Overall rank: <b>${m[6]} / 12</b></span></div>`;
    METRICS.forEach((name, i) => {
      const fc = m[2] ? m[2][i] : null, rag = m[3][i];
      h += `<div class="ex-row"><div class="ex-lbl">${name === 'Final' ? 'Final score' : name + ' F1'}</div><div class="ex-bars">` +
        `<div class="ex-bar"><div class="ex-track"><div class="ex-fill fc" style="width:0" data-w="${fc == null ? 0 : fc / 0.75 * 100}"></div></div><span class="ex-val">${f3(fc)}</span></div>` +
        `<div class="ex-bar"><div class="ex-track"><div class="ex-fill rag" style="width:0" data-w="${rag / 0.75 * 100}"></div></div><span class="ex-val">${f3(rag)}</span></div>` +
        `</div></div>`;
    });
    if (m[2]) {
      const d = m[2][3] - m[3][3];
      h += `<div class="ex-delta">FC − RAG on the final score: <b style="color:${d >= 0 ? 'var(--fc)' : '#94600a'}">${d >= 0 ? '+' : '−'}${Math.abs(d).toFixed(3)}</b> → ${d >= 0 ? 'Full Context' : 'RAG'} is the stronger configuration.</div>`;
    } else {
      h += `<div class="ex-delta">Only a validated RAG run is available for this model.</div>`;
    }
    exBody.innerHTML = h;
    setTimeout(() => $$(".ex-fill", exBody).forEach((f) => { f.style.width = f.dataset.w + "%"; }), 30);
  }
  sel.addEventListener('change', renderExplorer);
  renderExplorer();

  /* ── Dumbbell chart: FC vs RAG ──────────────────────────── */
  function el(tag, attrs, text) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  (function dumbbell() {
    const host = $('#dumbbell'); if (!host) return;
    const data = MODELS.filter((m) => m[2]).map((m) => ({ name: m[0], fc: m[2][3], rag: m[3][3], d: m[2][3] - m[3][3] }))
      .sort((a, b) => b.d - a.d);
    const W = 560, L = 138, R = 64, rowH = 30, T = 10, H = T + data.length * rowH + 30;
    const x = (v) => L + (v / 0.6) * (W - L - R);
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' });
    const ax = el('g', { class: 'axis' });
    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].forEach((t) => {
      ax.appendChild(el('line', { x1: x(t), x2: x(t), y1: T - 4, y2: H - 24 }));
      ax.appendChild(el('text', { x: x(t), y: H - 8, 'text-anchor': 'middle' }, t.toFixed(1)));
    });
    svg.appendChild(ax);
    data.forEach((r, i) => {
      const y = T + i * rowH + rowH / 2;
      const g = el('g', { class: 'row' });
      g.appendChild(el('rect', { class: 'bg-row', x: 0, y: y - rowH / 2, width: W, height: rowH, fill: 'transparent' }));
      g.appendChild(el('text', { x: L - 10, y: y + 4, 'text-anchor': 'end' }, r.name));
      g.appendChild(el('line', { x1: x(Math.min(r.fc, r.rag)), x2: x(Math.max(r.fc, r.rag)), y1: y, y2: y, stroke: '#b9c2d3', 'stroke-width': 3, 'stroke-linecap': 'round' }));
      const c1 = el('circle', { cx: x(r.rag), cy: y, r: 6.5, fill: 'var(--rag)', stroke: '#fff', 'stroke-width': 1.5 });
      c1.appendChild(el('title', {}, `${r.name} · RAG ${r.rag.toFixed(3)}`));
      const c2 = el('circle', { cx: x(r.fc), cy: y, r: 6.5, fill: 'var(--fc)', stroke: '#fff', 'stroke-width': 1.5 });
      c2.appendChild(el('title', {}, `${r.name} · FC ${r.fc.toFixed(3)}`));
      g.appendChild(c1); g.appendChild(c2);
      const lbl = (r.d >= 0 ? '+' : '−') + Math.abs(r.d).toFixed(3);
      g.appendChild(el('text', { x: W - R + 10, y: y + 4, style: `font-family:var(--mono);font-size:11px;fill:${r.d >= 0 ? 'var(--fc)' : '#94600a'};font-weight:500` }, lbl));
      svg.appendChild(g);
    });
    host.appendChild(svg);
  })();

  /* ── Forest plot (Supplementary Table S7) ───────────────── */
  (function forest() {
    const host = $('#forest'); if (!host || !window.SUPP_TABLES) return;
    const s7 = window.SUPP_TABLES.find((t) => t.id === 'S7'); if (!s7) return;
    const parse = (t) => { const m = String(t).match(/([\d.]+)\s*\(([\d.]+)\s*to\s*([\d.]+)\)/); return m ? [+m[1], +m[2], +m[3]] : null; };
    const short = { 'Anterior-circulation ischemic stroke': 'Anterior ischemic stroke', 'Posterior-circulation ischemic stroke': 'Posterior ischemic stroke', 'Ischemic stroke, location unspecified': 'Unspecified ischemic stroke', 'Stroke or death composite': 'Stroke or death' };
    const rows = {}; let contrast = null;
    s7.panels[0].body.forEach((r) => {
      if (!Array.isArray(r)) { if (/versus IMM/.test(r.g)) contrast = r.g.startsWith('CAS') ? 'CAS' : 'CEA'; return; }
      const name = short[r[0]] || r[0];
      rows[name] = rows[name] || {};
      rows[name][contrast] = [parse(r[3]), parse(r[5]), parse(r[7])]; // overall, early, late
    });
    const order = ['Stroke or death', 'All-cause death', 'Any stroke', 'Any ischemic stroke', 'Anterior ischemic stroke', 'Posterior ischemic stroke', 'Unspecified ischemic stroke', 'Intracerebral hemorrhage'];
    const W = 560, L = 170, R = 16, rowH = 34, T = 8;
    const lo = 0.1, hi = 4;
    const lx = (v) => L + (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) * (W - L - R);
    function draw(win) {
      host.innerHTML = '';
      const H = T + order.length * rowH + 30;
      const svg = el('svg', { viewBox: `0 0 ${W} ${H}` });
      const ax = el('g', { class: 'axis' });
      [0.1, 0.25, 0.5, 1, 2, 4].forEach((t) => {
        ax.appendChild(el('line', { x1: lx(t), x2: lx(t), y1: T, y2: H - 24, 'stroke-dasharray': t === 1 ? '' : '2 3', style: t === 1 ? 'stroke:var(--ink);stroke-width:1.2' : '' }));
        ax.appendChild(el('text', { x: lx(t), y: H - 8, 'text-anchor': 'middle' }, String(t)));
      });
      svg.appendChild(ax);
      order.forEach((name, i) => {
        const y0 = T + i * rowH;
        const g = el('g', { class: 'row' });
        g.appendChild(el('rect', { class: 'bg-row', x: 0, y: y0, width: W, height: rowH, fill: 'transparent' }));
        g.appendChild(el('text', { x: L - 12, y: y0 + rowH / 2 + 4, 'text-anchor': 'end', style: name === 'Stroke or death' ? 'font-weight:600;fill:var(--ink)' : '' }, name));
        [['CAS', 'var(--treat)', -6], ['CEA', 'var(--cea)', 6]].forEach(([c, col, dy]) => {
          const v = rows[name] && rows[name][c] && rows[name][c][win];
          const y = y0 + rowH / 2 + dy;
          if (!v) { g.appendChild(el('text', { x: lx(1) + 6, y: y + 4, style: 'font-size:10px;fill:var(--muted)' }, `${c}: suppressed`)); return; }
          const [hr, a, b] = v;
          g.appendChild(el('line', { x1: lx(Math.max(a, lo)), x2: lx(Math.min(b, hi)), y1: y, y2: y, stroke: col, 'stroke-width': 2 }));
          const sq = el('rect', { x: lx(hr) - 4.5, y: y - 4.5, width: 9, height: 9, fill: col, rx: 1.5 });
          sq.appendChild(el('title', {}, `${name} · ${c} vs IMM: HR ${hr.toFixed(2)} (${a.toFixed(2)}–${b.toFixed(2)})`));
          g.appendChild(sq);
        });
        svg.appendChild(g);
      });
      host.appendChild(svg);
    }
    let win = 0; draw(win);
    $$('#forestWin .seg-btn').forEach((b) => b.addEventListener('click', () => {
      $$('#forestWin .seg-btn').forEach((x) => x.classList.toggle('active', x === b));
      win = +b.dataset.win; draw(win);
    }));
  })();

  /* ── Sensitivity range visual ───────────────────────────── */
  (function ranges() {
    const host = $('#rangeViz'); if (!host) return;
    const block = (title, unit, min, max, nullV, items) => {
      const pct = (v) => ((v - min) / (max - min)) * 100;
      let h = `<div class="rv-row"><div class="rv-lbl"><span>${title}</span><span>${unit}</span></div>`;
      items.forEach((it) => {
        h += `<div class="rv-lbl" style="font-weight:500;margin-top:.4rem"><span>${it.name}</span><span>${it.text}</span></div>` +
          `<div class="rv-track" style="--zero:${pct(nullV)}%"><div class="rv-zero"></div>` +
          `<div class="rv-range ${it.cls}" style="left:${pct(it.lo)}%;width:${pct(it.hi) - pct(it.lo)}%" title="Range across 7 specifications"></div>` +
          `<div class="rv-pt" style="left:${pct(it.pt)}%" title="Primary ATO estimate"></div></div>`;
      });
      h += `<div class="rv-axis"><span>${min}</span><span>null = ${nullV}</span><span>${max}</span></div></div>`;
      return h;
    };
    host.innerHTML =
      block('Four-year stroke or death: risk difference', 'percentage points', -17, 3, 0, [
        { name: 'CAS vs IMM', text: '−4.92 to −1.62 (primary −3.89)', lo: -4.92, hi: -1.62, pt: -3.89, cls: '' },
        { name: 'CEA vs IMM', text: '−15.73 to −3.97 (primary −5.40)', lo: -15.73, hi: -3.97, pt: -5.40, cls: 'cea' }
      ]) +
      block('Four-year stroke or death: risk ratio', 'ratio', 0.4, 1.2, 1, [
        { name: 'CAS vs IMM', text: '0.70 to 0.90 (primary 0.80)', lo: 0.70, hi: 0.90, pt: 0.80, cls: '' },
        { name: 'CEA vs IMM', text: '0.48 to 0.77 (primary 0.73)', lo: 0.48, hi: 0.77, pt: 0.73, cls: 'cea' }
      ]) +
      '<div class="rv-legend">Bar = range across 7 specifications<i style="background:var(--l4)"></i>primary ATO estimate<i style="background:var(--ok-soft);border:1px solid #bfe3cd"></i>favors revascularization</div>';
  })();

  /* ── Supplementary table browser ────────────────────────── */
  (function supp() {
    const data = window.SUPP_TABLES; if (!data) return;
    const tabs = $('#suppTabs'), table = $('#suppTable'), search = $('#suppSearch');
    const files = { S1: 'S1', S2: 'S2', S3: 'S3', S4: 'S4', S5A: 'S5A', S5B: 'S5B', S6: 'S6', S7: 'S7', S8: 'S8', S9: 'S9' };
    let cur = 0, panel = 0, sortReset = null, rowsCache = [];
    tabs.innerHTML = data.map((t, i) => `<button class="supp-tab" role="tab" data-i="${i}"><b>${t.id}</b><span>${esc(t.short)}</span></button>`).join('');
    $$('.supp-tab', tabs).forEach((b) => b.addEventListener('click', () => show(+b.dataset.i, 0)));

    function cellText(c) { return typeof c === 'string' ? c : c.t; }
    function hl(text, q) {
      const t = esc(text);
      if (!q) return t;
      const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      return t.replace(re, '<mark>$1</mark>');
    }
    function renderBody(rows, q) {
      const tb = $('tbody', table); const p = data[cur].panels[panel];
      tb.innerHTML = rows.map((r) => {
        if (r.g) return `<tr class="${r.note ? 'note' : 'grp'}"><td colspan="${p.ncols}">${hl(r.g, q)}</td></tr>`;
        return '<tr>' + r.cells.map((c) => {
          const t = cellText(c), cs = typeof c === 'string' ? 1 : c.cs || 1;
          return `<td${cs > 1 ? ` colspan="${cs}"` : ''}${t.length > 60 ? ' class="wide"' : ''}>${hl(t, q)}</td>`;
        }).join('') + '</tr>';
      }).join('');
      const n = rows.filter((r) => !r.g).length;
      $('#suppCount').textContent = `${n} row${n === 1 ? '' : 's'}${q ? ' matching “' + q + '”' : ''}`;
    }
    function filtered() {
      const q = search.value.trim().toLowerCase();
      if (!q) return rowsCache;
      // keep group headers that precede matching rows
      const out = []; let pendingGroup = null;
      rowsCache.forEach((r) => {
        if (r.g && !r.note) { pendingGroup = r; if (r.g.toLowerCase().includes(q)) { out.push(r); pendingGroup = null; } return; }
        if (r.g && r.note) { if (r.g.toLowerCase().includes(q)) out.push(r); return; }
        if (r.cells.some((c) => cellText(c).toLowerCase().includes(q))) {
          if (pendingGroup) { out.push(pendingGroup); pendingGroup = null; }
          out.push(r);
        }
      });
      return out;
    }
    function show(i, p) {
      cur = i; panel = p; search.value = '';
      const t = data[i], pn = t.panels[p];
      $$('.supp-tab', tabs).forEach((b, j) => { b.classList.toggle('active', j === i); b.setAttribute('aria-selected', j === i); });
      $('#suppId').textContent = 'SUPPLEMENTARY TABLE ' + t.id;
      $('#suppTitle').textContent = t.title;
      $('#suppDownload').href = `static/supplementary/supplementary_table_${files[t.id]}.docx`;
      const pp = $('#suppPanels');
      pp.innerHTML = t.panels.length > 1 ? t.panels.map((x, j) => `<button class="seg-btn${j === p ? ' active' : ''}" data-p="${j}">${esc((x.name || 'Panel ' + (j + 1)).replace(/^Panel\s+S1-/, 'Panel '))}</button>`).join('') : '';
      $$('.seg-btn', pp).forEach((b) => b.addEventListener('click', () => show(cur, +b.dataset.p)));
      const hasGroups = pn.body.some((r) => !Array.isArray(r));
      const twoRow = pn.head.length > 1;
      // header
      let h = '<thead>';
      pn.head.forEach((row, ri) => {
        h += '<tr>' + row.map((c, ci) => {
          const attrs = (c.cs ? ` colspan="${c.cs}"` : '') + (c.rs ? ` rowspan="${c.rs}"` : '');
          const sortable = !hasGroups && !twoRow && !c.cs;
          return `<th${attrs}${sortable ? ` class="sortable-col" data-col="${ci}"` : ''}>${esc(c.t)}</th>`;
        }).join('') + '</tr>';
      });
      table.innerHTML = h + '</thead><tbody></tbody>';
      table.classList.toggle('sortable', !hasGroups && !twoRow);
      $('#suppSortHint').style.display = (!hasGroups && !twoRow) ? '' : 'none';
      rowsCache = pn.body.map((r) => Array.isArray(r) ? { cells: r, key: r.map((c) => { const t = cellText(c); const n = parseCell(t); return n == null ? t : n; }) } : r);
      renderBody(rowsCache, '');
      if (!hasGroups && !twoRow) makeSortable(table, () => filtered(), (rs) => renderBody(rs, search.value.trim()));
      $('#suppNotes').innerHTML = t.notes.map((n) => `<p>${esc(n)}</p>`).join('');
    }
    search.addEventListener('input', () => renderBody(filtered(), search.value.trim()));
    show(0, 0);

    // deep links from the page body: <a data-open-supp="S6">
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-open-supp]'); if (!a) return;
      const idx = data.findIndex((t) => t.id === a.dataset.openSupp);
      if (idx >= 0) {
        e.preventDefault(); show(idx, 0);
        $('#suppBrowser').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  })();

  /* ── BibTeX copy ────────────────────────────────────────── */
  $('#copyBib').addEventListener('click', function () {
    const txt = $('#bibtex').innerText, btn = this;
    const done = () => { btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied'; setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, () => {});
    else { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (_) {} ta.remove(); }
  });

  /* ── KaTeX ──────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    if (window.renderMathInElement) {
      renderMathInElement(document.body, {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }],
        throwOnError: false
      });
    }
  });
})();
