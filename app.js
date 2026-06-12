'use strict';

/* ============================================================
   Predefiniowane liniatury.
   Wartości nib-based: asc/x/desc w szerokościach stalówki.
   Wartości mm-based (pointed pen): bezpośrednio w mm.
   slantAngle: odchylenie od pionu w stopniach.
   ============================================================ */
const PRESETS = {
  textura: {
    name: 'Tekstura kwadratowa', sub: 'Blackletter XIII–XV w.',
    info: 'Pismo gotyckie XIII–XV w. Wysokość x: 5 szerokości stalówki, krótkie wydłużenia.',
    mode: 'nib', nib: 3.8, asc: 2, x: 5, desc: 2,
    gap: 8, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  rotunda: {
    name: 'Rotunda', sub: 'Gotyk włoski',
    info: 'Gotyk włoski, bardziej zaokrąglony. Wysokość x: 4 szerokości stalówki.',
    mode: 'nib', nib: 3.8, asc: 2, x: 4, desc: 2,
    gap: 8, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  uncial: {
    name: 'Uncjała', sub: 'Pismo obłe IV–VIII w.',
    info: 'Pismo majuskułowe IV–VIII w. Wysokość x: 4 szerokości stalówki, minimalne wydłużenia.',
    mode: 'nib', nib: 3.8, asc: 1, x: 4, desc: 1,
    gap: 10, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  halfUncial: {
    name: 'Półuncjała', sub: 'Wczesne średniowiecze',
    info: 'Pismo wczesnośredniowieczne (np. Book of Kells). Wysokość x: 4 szerokości stalówki.',
    mode: 'nib', nib: 3.8, asc: 2, x: 4, desc: 2,
    gap: 9, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  carolingian: {
    name: 'Minuskuła karolińska', sub: 'IX–XII w.',
    info: 'Pismo IX–XII w., smukłe wydłużenia. Wysokość x: 3 szerokości stalówki.',
    mode: 'nib', nib: 3.8, asc: 3, x: 3, desc: 3,
    gap: 8, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  foundational: {
    name: 'Pismo fundacyjne', sub: 'Krągła ręka Johnstona',
    info: 'Krój Edwarda Johnstona oparty na Ramseyowskim psałterzu. Wysokość x: 4 szerokości stalówki.',
    mode: 'nib', nib: 3.8, asc: 3, x: 4, desc: 3,
    gap: 8, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  italic: {
    name: 'Italika', sub: 'Kursywa, 5–10°',
    info: 'Renesansowa kancelareska. Wysokość x: 5 szerokości stalówki, nachylenie ok. 5–10°.',
    mode: 'nib', nib: 3.8, asc: 4, x: 5, desc: 4,
    gap: 7, slant: true, slantAngle: 7, slantSpacing: 20,
  },
  fraktur: {
    name: 'Fraktura', sub: 'Gotyk XVI w.',
    info: 'Pismo gotyckie XVI w. Wysokość x: 5 szerokości stalówki.',
    mode: 'nib', nib: 3.8, asc: 2.5, x: 5, desc: 2.5,
    gap: 8, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  copperplate: {
    name: 'Angielka', sub: 'Copperplate 55°',
    info: 'Pismo stalówki ostrej, proporcje 3:2:3, nachylenie 55° od linii bazowej (35° od pionu).',
    mode: 'mm', ascMm: 7.5, xMm: 5, descMm: 7.5,
    gap: 6, slant: true, slantAngle: 35, slantSpacing: 12,
  },
  spencerian: {
    name: 'Spencerian', sub: 'XIX w., 52°',
    info: 'Amerykańska kaligrafia XIX w., proporcje 2:1:2, nachylenie 52° od linii bazowej.',
    mode: 'mm', ascMm: 8, xMm: 4, descMm: 8,
    gap: 6, slant: true, slantAngle: 38, slantSpacing: 12,
  },
  custom: {
    name: 'Niestandardowa', sub: 'Własne wymiary',
    info: 'Ustaw wszystkie parametry samodzielnie.',
    mode: 'nib', nib: 2, asc: 3, x: 4, desc: 3,
    gap: 8, slant: false, slantAngle: 10, slantSpacing: 15,
  },
};

const A4 = { w: 210, h: 297 };

const $ = (id) => document.getElementById(id);

/* stan interfejsu nieprzechowywany w polach formularza */
const ui = {
  preset: 'textura',
  mode: 'nib',
  slant: false,
  orientation: 'portrait',
  footer: true,
  fills: { asc: false, x: true, desc: false },
  zoom: 1,
};

/* ---------- odczyt pełnego stanu ---------- */
function readState() {
  let asc, x, desc;
  if (ui.mode === 'nib') {
    const nib = parseFloat($('nibWidth').value) || 1;
    asc = nib * (parseFloat($('ascR').value) || 0);
    x = nib * (parseFloat($('xR').value) || 1);
    desc = nib * (parseFloat($('descR').value) || 0);
  } else {
    asc = parseFloat($('ascMm').value) || 0;
    x = parseFloat($('xMm').value) || 1;
    desc = parseFloat($('descMm').value) || 0;
  }
  const portrait = ui.orientation === 'portrait';
  return {
    asc, x, desc,
    gap: parseFloat($('gap').value) || 0,
    slant: ui.slant,
    slantAngle: parseFloat($('slantAngle').value) || 0,
    slantSpacing: Math.max(1, parseFloat($('slantSpacing').value) || 15),
    pageW: portrait ? A4.w : A4.h,
    pageH: portrait ? A4.h : A4.w,
    orientation: ui.orientation,
    marginTB: parseFloat($('marginTB').value) || 0,
    marginLR: parseFloat($('marginLR').value) || 0,
    footer: ui.footer,
    presetKey: ui.preset,
    colors: {
      base: $('colBase').value,
      waist: $('colWaist').value,
      ext: $('colExt').value,
      slant: $('colSlant').value,
    },
    fills: {
      asc: ui.fills.asc ? $('fillAsc').value : null,
      x: ui.fills.x ? $('fillX').value : null,
      desc: ui.fills.desc ? $('fillDesc').value : null,
    },
  };
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* ============================================================
   Geometria liniatury — wszystko w mm.
   Zwraca linie { x1, y1, x2, y2, kind } i prostokąty wypełnień.
   kind: 'base' | 'waist' | 'ext' | 'slant'
   ============================================================ */
function buildLines(s) {
  const lines = [];
  const rects = [];
  const left = s.marginLR;
  const right = s.pageW - s.marginLR;
  const rowH = s.asc + s.x + s.desc;
  const footerSpace = s.footer ? 8 : 0;
  const bottom = s.pageH - s.marginTB - footerSpace;

  if (rowH <= 0 || right <= left) return { lines, rects, rows: 0 };

  let rows = 0;
  let top = s.marginTB;
  while (top + rowH <= bottom + 0.001) {
    const yAsc = top;
    const yWaist = top + s.asc;
    const yBase = top + s.asc + s.x;
    const yDesc = top + rowH;

    if (s.fills.asc && s.asc > 0) rects.push({ x: left, y: yAsc, w: right - left, h: s.asc, color: s.fills.asc });
    if (s.fills.x) rects.push({ x: left, y: yWaist, w: right - left, h: s.x, color: s.fills.x });
    if (s.fills.desc && s.desc > 0) rects.push({ x: left, y: yBase, w: right - left, h: s.desc, color: s.fills.desc });

    if (s.asc > 0) lines.push({ x1: left, y1: yAsc, x2: right, y2: yAsc, kind: 'ext' });
    lines.push({ x1: left, y1: yWaist, x2: right, y2: yWaist, kind: 'waist' });
    lines.push({ x1: left, y1: yBase, x2: right, y2: yBase, kind: 'base' });
    if (s.desc > 0) lines.push({ x1: left, y1: yDesc, x2: right, y2: yDesc, kind: 'ext' });

    if (s.slant && Math.abs(s.slantAngle) < 89) {
      // linia pochyła: od dołu wiersza do góry, odchylona od pionu o slantAngle
      const dx = rowH * Math.tan((s.slantAngle * Math.PI) / 180);
      const start = dx > 0 ? left : left + Math.abs(dx);
      for (let xb = start; xb <= right + Math.abs(dx); xb += s.slantSpacing) {
        const clipped = clipSegment(xb, yDesc, xb + dx, yAsc, left, right, yAsc, yDesc);
        if (clipped) lines.push({ ...clipped, kind: 'slant' });
      }
    }

    rows++;
    top += rowH + s.gap;
  }
  return { lines, rects, rows };
}

/* przycinanie odcinka do prostokąta (Liang–Barsky) */
function clipSegment(x1, y1, x2, y2, xmin, xmax, ymin, ymax) {
  let t0 = 0, t1 = 1;
  const dx = x2 - x1, dy = y2 - y1;
  const p = [-dx, dx, -dy, dy];
  const q = [x1 - xmin, xmax - x1, y1 - ymin, ymax - y1];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) { if (q[i] < 0) return null; continue; }
    const r = q[i] / p[i];
    if (p[i] < 0) { if (r > t1) return null; if (r > t0) t0 = r; }
    else { if (r < t0) return null; if (r < t1) t1 = r; }
  }
  return {
    x1: x1 + t0 * dx, y1: y1 + t0 * dy,
    x2: x1 + t1 * dx, y2: y1 + t1 * dy,
  };
}

/* ---------- style linii (wspólne dla SVG i PDF); kolory z formularza ---------- */
const LINE_STYLE = {
  base:  { width: 0.3,  dash: null },
  waist: { width: 0.2,  dash: null },
  ext:   { width: 0.16, dash: [2, 1.5] },
  slant: { width: 0.13, dash: [1, 1] },
};

function footerText(s) {
  const p = PRESETS[s.presetKey];
  const fmt = (v) => (Math.round(v * 100) / 100).toString().replace('.', ',');
  let t = `${p ? p.name : 'Liniatura'} — wydłużenia górne ${fmt(s.asc)} mm / wysokość x ${fmt(s.x)} mm / wydłużenia dolne ${fmt(s.desc)} mm, odstęp ${fmt(s.gap)} mm`;
  if (s.slant) t += `, nachylenie ${fmt(s.slantAngle)}° od pionu`;
  return t;
}

/* ============================================================
   Podgląd SVG — viewBox w mm, identyczna geometria jak PDF
   ============================================================ */
function renderPreview() {
  const s = readState();
  const { lines, rects, rows } = buildLines(s);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${s.pageW} ${s.pageH}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  for (const r of rects) {
    const el = document.createElementNS(ns, 'rect');
    el.setAttribute('x', r.x.toFixed(3));
    el.setAttribute('y', r.y.toFixed(3));
    el.setAttribute('width', r.w.toFixed(3));
    el.setAttribute('height', r.h.toFixed(3));
    el.setAttribute('fill', r.color);
    svg.appendChild(el);
  }

  for (const ln of lines) {
    const st = LINE_STYLE[ln.kind];
    const el = document.createElementNS(ns, 'line');
    el.setAttribute('x1', ln.x1.toFixed(3));
    el.setAttribute('y1', ln.y1.toFixed(3));
    el.setAttribute('x2', ln.x2.toFixed(3));
    el.setAttribute('y2', ln.y2.toFixed(3));
    el.setAttribute('stroke', s.colors[ln.kind]);
    el.setAttribute('stroke-width', st.width);
    if (st.dash) el.setAttribute('stroke-dasharray', st.dash.join(' '));
    svg.appendChild(el);
  }

  if (s.footer) {
    const txt = document.createElementNS(ns, 'text');
    txt.setAttribute('x', s.marginLR);
    txt.setAttribute('y', s.pageH - s.marginTB + 1);
    txt.setAttribute('font-size', '2.6');
    txt.setAttribute('fill', '#A2967F');
    txt.setAttribute('font-family', "'Hanken Grotesk', Helvetica, sans-serif");
    txt.textContent = footerText(s);
    svg.appendChild(txt);
  }

  const page = $('page');
  page.innerHTML = '';
  page.appendChild(svg);
  page.style.aspectRatio = `${s.pageW} / ${s.pageH}`;
  page.style.height = `${ui.zoom * 100}%`;

  $('orientName').textContent = s.orientation === 'portrait' ? 'pionowo' : 'poziomo';
  $('rowInfo').textContent = `${rows} ${rowsWord(rows)} po ${(s.asc + s.x + s.desc).toFixed(1).replace('.', ',')} mm`;
  $('zoomPct').textContent = `${Math.round(ui.zoom * 100)}%`;
}

function rowsWord(n) {
  if (n === 1) return 'wiersz';
  const d = n % 10, h = n % 100;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return 'wiersze';
  return 'wierszy';
}

/* ============================================================
   PDF — jsPDF w mm, geometria 1:1 z podglądem
   ============================================================ */
function downloadPdf() {
  const s = readState();
  const { lines, rects } = buildLines(s);
  const doc = new window.jspdf.jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: s.orientation,
    compress: true,
  });

  for (const r of rects) {
    doc.setFillColor(...hexToRgb(r.color));
    doc.rect(r.x, r.y, r.w, r.h, 'F');
  }

  for (const ln of lines) {
    const st = LINE_STYLE[ln.kind];
    doc.setDrawColor(...hexToRgb(s.colors[ln.kind]));
    doc.setLineWidth(st.width);
    doc.setLineDashPattern(st.dash || [], 0);
    doc.line(ln.x1, ln.y1, ln.x2, ln.y2);
  }
  doc.setLineDashPattern([], 0);

  if (s.footer) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(162, 150, 127);
    // jsPDF nie ma polskich znaków w fontach standardowych — transliteracja
    doc.text(stripDiacritics(footerText(s)), s.marginLR, s.pageH - s.marginTB + 2);
    doc.text('Drukuj w skali 100%', s.pageW - s.marginLR, s.pageH - s.marginTB + 2, { align: 'right' });
  }

  const preset = PRESETS[s.presetKey];
  const slug = preset
    ? stripDiacritics(preset.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'liniatura';
  doc.save(`liniatura-${slug}-${s.orientation === 'portrait' ? 'pion' : 'poziom'}.pdf`);
}

function stripDiacritics(str) {
  const map = { 'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z',
                'Ą':'A','Ć':'C','Ę':'E','Ł':'L','Ń':'N','Ó':'O','Ś':'S','Ź':'Z','Ż':'Z' };
  return str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (ch) => map[ch]);
}

/* ============================================================
   Miniaturki krojów na kartach presetów
   ============================================================ */
function presetThumb(key, p) {
  const asc = p.mode === 'nib' ? p.asc : p.ascMm;
  const x = p.mode === 'nib' ? p.x : p.xMm;
  const desc = p.mode === 'nib' ? p.desc : p.descMm;
  const block = asc + x + desc;
  const W = 100, H = 46, pad = 7;
  const sc = (H - 2 * pad) / block;
  const yA = pad, yW = pad + asc * sc, yB = pad + (asc + x) * sc, yD = pad + block * sc;
  const lx0 = pad + 1, lx1 = W - pad - 1;
  let inner = `<rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>`;
  inner += `<rect x="${lx0}" y="${yW.toFixed(2)}" width="${lx1 - lx0}" height="${(yB - yW).toFixed(2)}" fill="#FBF6EC"/>`;
  if (p.slant) {
    const tan = Math.tan((p.slantAngle * Math.PI) / 180);
    let slants = '';
    for (let xx = lx0 + 4; xx < lx1; xx += 11) {
      slants += `<line x1="${xx}" y1="${yD.toFixed(2)}" x2="${(xx + (yD - yA) * tan).toFixed(2)}" y2="${yA}" stroke="#D7A38C" stroke-width="0.7"/>`;
    }
    inner += `<defs><clipPath id="thc-${key}"><rect x="${lx0}" y="${yA}" width="${lx1 - lx0}" height="${(yD - yA).toFixed(2)}"/></clipPath></defs>`;
    inner += `<g clip-path="url(#thc-${key})">${slants}</g>`;
  }
  inner += `<line x1="${lx0}" y1="${yA}" x2="${lx1}" y2="${yA}" stroke="#CBD6DC" stroke-width="0.8"/>`;
  inner += `<line x1="${lx0}" y1="${yW.toFixed(2)}" x2="${lx1}" y2="${yW.toFixed(2)}" stroke="#9CB0BC" stroke-width="1"/>`;
  inner += `<line x1="${lx0}" y1="${yB.toFixed(2)}" x2="${lx1}" y2="${yB.toFixed(2)}" stroke="#2E5066" stroke-width="1.5"/>`;
  inner += `<line x1="${lx0}" y1="${yD.toFixed(2)}" x2="${lx1}" y2="${yD.toFixed(2)}" stroke="#CBD6DC" stroke-width="0.8"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${inner}</svg>`;
}

/* ============================================================
   Obsługa interfejsu
   ============================================================ */
function buildPresetCards() {
  const grid = $('presetGrid');
  grid.innerHTML = '';
  for (const [key, p] of Object.entries(PRESETS)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-card';
    btn.dataset.key = key;
    btn.innerHTML = `${presetThumb(key, p)}<span class="pc-name">${p.name}</span><span class="pc-sub">${p.sub}</span>`;
    btn.addEventListener('click', () => { applyPreset(key); renderPreview(); });
    grid.appendChild(btn);
  }
}

function markActivePreset() {
  for (const card of document.querySelectorAll('.preset-card')) {
    card.classList.toggle('active', card.dataset.key === ui.preset);
  }
  $('presetDesc').textContent = PRESETS[ui.preset].info;
}

function applyPreset(key) {
  const p = PRESETS[key];
  if (!p) return;
  ui.preset = key;
  if (key !== 'custom') {
    setMode(p.mode, true);
    if (p.mode === 'nib') {
      $('nibWidth').value = p.nib;
      $('ascR').value = p.asc;
      $('xR').value = p.x;
      $('descR').value = p.desc;
    } else {
      $('ascMm').value = p.ascMm;
      $('xMm').value = p.xMm;
      $('descMm').value = p.descMm;
    }
    $('gap').value = p.gap;
    setSlant(p.slant);
    $('slantAngle').value = p.slantAngle;
    $('slantSpacing').value = p.slantSpacing;
  }
  markActivePreset();
}

function switchToCustom() {
  if (ui.preset !== 'custom') {
    ui.preset = 'custom';
    markActivePreset();
  }
}

function setMode(mode, keepPreset) {
  ui.mode = mode;
  $('modeNib').classList.toggle('active', mode === 'nib');
  $('modeMm').classList.toggle('active', mode === 'mm');
  $('nibFields').hidden = mode !== 'nib';
  $('mmFields').hidden = mode !== 'mm';
  if (!keepPreset) switchToCustom();
}

function setSlant(on) {
  ui.slant = on;
  $('slantOn').setAttribute('aria-pressed', on);
  $('slantFields').hidden = !on;
}

function setFill(zone, on) {
  ui.fills[zone] = on;
  const cap = zone[0].toUpperCase() + zone.slice(1);
  $(`fill${cap}On`).setAttribute('aria-pressed', on);
  $(`fill${cap}Row`).classList.toggle('off', !on);
}

function syncSwatches() {
  for (const sw of document.querySelectorAll('[data-swatch-for]')) {
    sw.style.background = $(sw.dataset.swatchFor).value;
  }
  for (const hx of document.querySelectorAll('[data-hex-for]')) {
    hx.textContent = $(hx.dataset.hexFor).value.toUpperCase();
  }
}

function setOrientation(o) {
  ui.orientation = o;
  $('orientPortrait').classList.toggle('active', o === 'portrait');
  $('orientLandscape').classList.toggle('active', o === 'landscape');
}

function init() {
  buildPresetCards();

  // akordeon
  for (const sec of document.querySelectorAll('.acc')) {
    sec.querySelector('.acc-head').addEventListener('click', () => sec.classList.toggle('open'));
  }
  document.querySelector('.acc[data-key="kroj"]').classList.add('open');
  document.querySelector('.acc[data-key="wymiary"]').classList.add('open');

  // zakładki mobilne
  document.body.classList.add('view-preview');
  $('tabSettings').addEventListener('click', () => {
    document.body.classList.replace('view-preview', 'view-settings');
    $('tabSettings').classList.add('active');
    $('tabPreview').classList.remove('active');
  });
  $('tabPreview').addEventListener('click', () => {
    document.body.classList.replace('view-settings', 'view-preview');
    $('tabPreview').classList.add('active');
    $('tabSettings').classList.remove('active');
  });

  // tryb wymiarów
  $('modeNib').addEventListener('click', () => { setMode('nib'); renderPreview(); });
  $('modeMm').addEventListener('click', () => { setMode('mm'); renderPreview(); });

  // przełączniki
  $('slantOn').addEventListener('click', () => { setSlant(!ui.slant); switchToCustom(); renderPreview(); });
  $('footerOn').addEventListener('click', () => {
    ui.footer = !ui.footer;
    $('footerOn').setAttribute('aria-pressed', ui.footer);
    renderPreview();
  });
  for (const zone of ['asc', 'x', 'desc']) {
    const cap = zone[0].toUpperCase() + zone.slice(1);
    $(`fill${cap}On`).addEventListener('click', () => { setFill(zone, !ui.fills[zone]); renderPreview(); });
    $(`fill${cap}`).addEventListener('input', () => {
      if (!ui.fills[zone]) setFill(zone, true);
      syncSwatches();
      renderPreview();
    });
  }

  // orientacja
  $('orientPortrait').addEventListener('click', () => { setOrientation('portrait'); renderPreview(); });
  $('orientLandscape').addEventListener('click', () => { setOrientation('landscape'); renderPreview(); });

  // zmiana parametrów pisma przełącza na liniaturę niestandardową
  for (const id of ['nibWidth', 'ascR', 'xR', 'descR', 'ascMm', 'xMm', 'descMm', 'gap', 'slantAngle', 'slantSpacing']) {
    $(id).addEventListener('input', () => { switchToCustom(); renderPreview(); });
  }

  // ustawienia strony i kolory linii nie zmieniają presetu
  for (const id of ['marginTB', 'marginLR']) {
    $(id).addEventListener('input', renderPreview);
  }
  for (const id of ['colBase', 'colWaist', 'colExt', 'colSlant']) {
    $(id).addEventListener('input', () => { syncSwatches(); renderPreview(); });
  }

  // zoom
  $('zoomIn').addEventListener('click', () => { ui.zoom = Math.min(2.2, +(ui.zoom + 0.1).toFixed(2)); renderPreview(); });
  $('zoomOut').addEventListener('click', () => { ui.zoom = Math.max(0.5, +(ui.zoom - 0.1).toFixed(2)); renderPreview(); });

  $('downloadBtn').addEventListener('click', downloadPdf);

  applyPreset('textura');
  syncSwatches();
  renderPreview();
}

document.addEventListener('DOMContentLoaded', init);
