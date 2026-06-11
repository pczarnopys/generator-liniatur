'use strict';

/* ============================================================
   Predefiniowane liniatury.
   Wartości nib-based: asc/x/desc w szerokościach stalówki.
   Wartości mm-based (pointed pen): bezpośrednio w mm.
   slantAngle: odchylenie od pionu w stopniach.
   ============================================================ */
const PRESETS = {
  textura: {
    name: 'Tekstura kwadratowa (textura quadrata)',
    desc: 'Pismo gotyckie XIII–XV w. Wysokość x: 5 szerokości stalówki, krótkie wydłużenia.',
    mode: 'nib', nib: 3.8, asc: 2, x: 5, desc: 2,
    gap: 8, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  rotunda: {
    name: 'Rotunda',
    desc: 'Gotyk włoski, bardziej zaokrąglony. Wysokość x: 4 szerokości stalówki.',
    mode: 'nib', nib: 3.8, asc: 2, x: 4, desc: 2,
    gap: 8, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  uncial: {
    name: 'Uncjała',
    desc: 'Pismo majuskułowe IV–VIII w. Wysokość x: 4 szerokości stalówki, minimalne wydłużenia.',
    mode: 'nib', nib: 3.8, asc: 1, x: 4, desc: 1,
    gap: 10, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  halfUncial: {
    name: 'Półuncjała',
    desc: 'Pismo wczesnośredniowieczne (np. Book of Kells). Wysokość x: 4 szerokości stalówki.',
    mode: 'nib', nib: 3.8, asc: 2, x: 4, desc: 2,
    gap: 9, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  carolingian: {
    name: 'Minuskuła karolińska',
    desc: 'Pismo IX–XII w., smukłe wydłużenia. Wysokość x: 3 szerokości stalówki.',
    mode: 'nib', nib: 3.8, asc: 3, x: 3, desc: 3,
    gap: 8, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  foundational: {
    name: 'Pismo fundacyjne (foundational hand)',
    desc: 'Krój Edwarda Johnstona oparty na Ramseyowskim psałterzu. Wysokość x: 4 szerokości stalówki.',
    mode: 'nib', nib: 3.8, asc: 3, x: 4, desc: 3,
    gap: 8, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  italic: {
    name: 'Italika (kursywa humanistyczna)',
    desc: 'Renesansowa kancelareska. Wysokość x: 5 szerokości stalówki, nachylenie ok. 5–10°.',
    mode: 'nib', nib: 3.8, asc: 4, x: 5, desc: 4,
    gap: 7, slant: true, slantAngle: 7, slantSpacing: 20,
  },
  fraktur: {
    name: 'Fraktura',
    desc: 'Pismo gotyckie XVI w. Wysokość x: 5 szerokości stalówki.',
    mode: 'nib', nib: 3.8, asc: 2.5, x: 5, desc: 2.5,
    gap: 8, slant: false, slantAngle: 0, slantSpacing: 15,
  },
  copperplate: {
    name: 'Angielka (copperplate)',
    desc: 'Pismo stalówki ostrej, proporcje 3:2:3, nachylenie 55° od linii bazowej (35° od pionu).',
    mode: 'mm', ascMm: 7.5, xMm: 5, descMm: 7.5,
    gap: 6, slant: true, slantAngle: 35, slantSpacing: 12,
  },
  spencerian: {
    name: 'Spencerian',
    desc: 'Amerykańska kaligrafia XIX w., proporcje 2:1:2, nachylenie 52° od linii bazowej.',
    mode: 'mm', ascMm: 8, xMm: 4, descMm: 8,
    gap: 6, slant: true, slantAngle: 38, slantSpacing: 12,
  },
  custom: {
    name: 'Własna liniatura',
    desc: 'Ustaw wszystkie parametry samodzielnie.',
    mode: 'nib', nib: 2, asc: 3, x: 4, desc: 3,
    gap: 8, slant: false, slantAngle: 10, slantSpacing: 15,
  },
};

const A4 = { w: 210, h: 297 };

const $ = (id) => document.getElementById(id);

/* ---------- odczyt stanu z formularza ---------- */
function readState() {
  const nibMode = $('modeNib').checked;
  let asc, x, desc;
  if (nibMode) {
    const nib = parseFloat($('nibWidth').value) || 1;
    asc = nib * (parseFloat($('ascR').value) || 0);
    x = nib * (parseFloat($('xR').value) || 1);
    desc = nib * (parseFloat($('descR').value) || 0);
  } else {
    asc = parseFloat($('ascMm').value) || 0;
    x = parseFloat($('xMm').value) || 1;
    desc = parseFloat($('descMm').value) || 0;
  }
  const portrait = $('orientPortrait').checked;
  return {
    asc, x, desc,
    gap: parseFloat($('gap').value) || 0,
    slant: $('slantOn').checked,
    slantAngle: parseFloat($('slantAngle').value) || 0,
    slantSpacing: Math.max(1, parseFloat($('slantSpacing').value) || 15),
    pageW: portrait ? A4.w : A4.h,
    pageH: portrait ? A4.h : A4.w,
    orientation: portrait ? 'portrait' : 'landscape',
    marginTB: parseFloat($('marginTB').value) || 0,
    marginLR: parseFloat($('marginLR').value) || 0,
    footer: $('footerOn').checked,
    presetKey: $('preset').value,
    colors: {
      base: $('colBase').value,
      waist: $('colWaist').value,
      ext: $('colExt').value,
      slant: $('colSlant').value,
    },
    fills: {
      asc: $('fillAscOn').checked ? $('fillAsc').value : null,
      x: $('fillXOn').checked ? $('fillX').value : null,
      desc: $('fillDescOn').checked ? $('fillDesc').value : null,
    },
  };
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* ============================================================
   Geometria liniatury — wszystko w mm.
   Zwraca listę linii { x1, y1, x2, y2, kind }.
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
      // pozycje na linii dolnej wiersza; clipping do [left, right]
      const start = dx > 0 ? left : left + Math.abs(dx);
      for (let xb = start; xb <= right + Math.abs(dx); xb += s.slantSpacing) {
        let x1 = xb, y1 = yDesc, x2 = xb + dx, y2 = yAsc;
        // przytnij do pola zapisu
        const clipped = clipSegment(x1, y1, x2, y2, left, right, yAsc, yDesc);
        if (clipped) lines.push({ ...clipped, kind: 'slant' });
      }
    }

    rows++;
    top += rowH + s.gap;
  }
  return { lines, rects, rows };
}

/* przycinanie odcinka do prostokąta (Liang–Barsky, tylko x, bo y już pasuje) */
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
  base:  { width: 0.35, dash: null },
  waist: { width: 0.25, dash: null },
  ext:   { width: 0.18, dash: [2, 1.5] },
  slant: { width: 0.15, dash: [1, 1] },
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
  svg.setAttribute('xmlns', ns);

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
    txt.setAttribute('fill', '#999');
    txt.setAttribute('font-family', 'Helvetica, Arial, sans-serif');
    txt.textContent = footerText(s);
    svg.appendChild(txt);
  }

  const wrap = $('preview');
  wrap.innerHTML = '';
  wrap.appendChild(svg);

  const rowH = s.asc + s.x + s.desc;
  $('rowInfo').textContent =
    `Wierszy na stronie: ${rows} · wysokość wiersza: ${rowH.toFixed(1)} mm (${s.asc.toFixed(1)} + ${s.x.toFixed(1)} + ${s.desc.toFixed(1)})`;

  // podgląd wartości mm przy trybie stalówki
  const nib = parseFloat($('nibWidth').value) || 0;
  $('ascMmOut').textContent = `= ${(nib * (parseFloat($('ascR').value) || 0)).toFixed(1)} mm`;
  $('xMmOut').textContent = `= ${(nib * (parseFloat($('xR').value) || 0)).toFixed(1)} mm`;
  $('descMmOut').textContent = `= ${(nib * (parseFloat($('descR').value) || 0)).toFixed(1)} mm`;
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
    doc.setTextColor(150);
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
   Obsługa formularza
   ============================================================ */
function applyPreset(key) {
  const p = PRESETS[key];
  if (!p) return;
  $('presetDesc').textContent = p.desc;
  if (p.mode === 'nib') {
    $('modeNib').checked = true;
    $('nibWidth').value = p.nib;
    $('ascR').value = p.asc;
    $('xR').value = p.x;
    $('descR').value = p.desc;
  } else {
    $('modeMm').checked = true;
    $('ascMm').value = p.ascMm;
    $('xMm').value = p.xMm;
    $('descMm').value = p.descMm;
  }
  $('gap').value = p.gap;
  $('slantOn').checked = p.slant;
  $('slantAngle').value = p.slantAngle;
  $('slantSpacing').value = p.slantSpacing;
  syncModeVisibility();
}

function syncModeVisibility() {
  const nibMode = $('modeNib').checked;
  $('nibFields').hidden = !nibMode;
  $('mmFields').hidden = nibMode;
}

function switchToCustom() {
  if ($('preset').value !== 'custom') {
    $('preset').value = 'custom';
    $('presetDesc').textContent = PRESETS.custom.desc;
  }
}

function init() {
  const sel = $('preset');
  for (const [key, p] of Object.entries(PRESETS)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = p.name;
    sel.appendChild(opt);
  }

  sel.addEventListener('change', () => { applyPreset(sel.value); renderPreview(); });

  // zmiana parametrów pisma przełącza na liniaturę własną
  const paramIds = ['nibWidth', 'ascR', 'xR', 'descR', 'ascMm', 'xMm', 'descMm',
                    'gap', 'slantOn', 'slantAngle', 'slantSpacing', 'modeNib', 'modeMm'];
  for (const id of paramIds) {
    $(id).addEventListener('input', () => { switchToCustom(); syncModeVisibility(); renderPreview(); });
  }

  // ustawienia strony i kolory nie zmieniają presetu
  for (const id of ['orientPortrait', 'orientLandscape', 'marginTB', 'marginLR', 'footerOn',
                    'colBase', 'colWaist', 'colExt', 'colSlant',
                    'fillAscOn', 'fillAsc', 'fillXOn', 'fillX', 'fillDescOn', 'fillDesc']) {
    $(id).addEventListener('input', renderPreview);
  }

  $('downloadBtn').addEventListener('click', downloadPdf);

  applyPreset('textura');
  renderPreview();
}

document.addEventListener('DOMContentLoaded', init);
