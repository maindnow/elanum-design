/* ============================================================
   ELANUM Resonanzrad
   Wiederhergestellt aus dem persönlichen Rad (Repo-Stand 8995945) und
   für 4.5 überarbeitet.

   VERBINDLICHE GEOMETRIE
   Die Silhouette ist jederzeit ein exakter Kreis. Neun gleich grosse
   Stücke à 40 Grad, darüber ein Ring aus drei Bereichen à 120 Grad. Alle
   Bögen teilen denselben Mittelpunkt und werden aus Polarkoordinaten
   berechnet.

   BEDEUTUNG
   - Ein Bereich, eine Farbe: Sterne & Ursprung Violett, Ich & Orientierung
     Koralle, Beziehung & Verbindung Petrol (tokens.css), ausgeglichen in
     Helligkeit und Sättigung.
   - Farbe heisst ausgefüllt: Alle ausgefüllten Stücke eines Bereichs
     tragen dieselbe Fläche. Keine Nuancen, denn Helligkeit liest sich
     sonst als Menge.
   - Offen ist grau, gestrichelt umrandet und trägt ein Plus in Ink:
     Hier fehlt noch etwas, hier kannst du ausfüllen.
   - Im Rad stehen ab 500 px Name und Ergebnis (oder Plus), darunter nur
     Icons. Das gewählte Element steht direkt unter dem Rad, Namen und
     Ergebnisse in der Liste und im Lesebereich, nie kleiner als 15 px.
   - Der Ring zeigt die drei Bereiche gleich stark; er hebt nichts hervor.
   - Auswahl nie nur über Farbe: Bogen, Relief, Liste, Text und
     aria-selected tragen dieselbe Information.

   API:  ElanumResonanzrad.mount(root, { heading: 'h2'|'h3' })
         gibt { select(i), parts } zurück; parts dient motion.js.
         ElanumResonanzrad.mini(root, { done: [ids], focus: id, label })
         zeichnet ein kleines Rad für Karten, gibt { done, total } zurück.
   Klassisches Skript, damit es auch unter file:// lädt.
   ============================================================ */
(function () {
  'use strict';

  var CFG = {
    size: 320, cx: 160, cy: 160,
    centerRadius: 34,
    labelRadius: 90,
    labelRadiusCompact: 82,
    fullFrom: 500,
    plusFrom: 300,
    contourRadius: 120,
    contourInsetDeg: 5,
    segmentRadius: 126,
    activeRadius: 129,
    groupInner: 133,
    groupOuter: 157,
    segmentDeg: 40,
    groupGapDeg: 4,
    activeInsetDeg: 5,
    hoverShift: 2
  };

  var GROUPS = [
    { id: 'sterne', label: 'Sterne & Ursprung' },
    { id: 'ich', label: 'Ich & Orientierung' },
    { id: 'bezug', label: 'Beziehung & Verbindung' }
  ];

  /* Inhalte der Demo. done/result zeigen den Ausfüllstatus. */
  var ITEMS = [
    { id: 'astrology', group: 'sterne', label: 'Astrologie', lines: ['Astro-', 'logie'], done: true, result: 'Jungfrau',
      lead: 'Die Konstellation zum Zeitpunkt deiner Geburt.',
      text: 'Sonne, Mond und Aszendent ergeben ein Bild, in dem sich viele Menschen wiedererkennen. Es ist eine Sprache für Muster, keine Vorhersage.',
      rows: [['Sonne', 'Jungfrau'], ['Mond', 'Fische'], ['Aszendent', 'Waage']] },
    { id: 'numerology', group: 'sterne', label: 'Numerologie', lines: ['Numero-', 'logie'], done: true, result: '7',
      lead: 'Zahlen als Muster deines Namens und Datums.',
      text: 'Aus Geburtsdatum und Namen entsteht ein wiederkehrendes Muster. Es zeigt Themen, die sich durch dein Leben ziehen.',
      rows: [['Lebenszahl', '7, der Suchende'], ['Namenszahl', '3, der Vermittler']] },
    { id: 'human-design', group: 'sterne', label: 'Human Design', lines: ['Human', 'Design'], done: true, result: 'Generator',
      lead: 'Wie du Energie aufnimmst und entscheidest.',
      text: 'Typ, Autorität und offene Zentren beschreiben, woher deine Energie kommt und woran du merkst, dass eine Entscheidung stimmig ist.',
      rows: [['Typ', 'Generator'], ['Autorität', 'Sakral'], ['Profil', '3 / 5']] },
    { id: 'direction', group: 'ich', label: 'Lebensrichtung', lines: ['Lebens-', 'richtung'], done: false,
      lead: 'Wohin du dich gerade bewegst.',
      text: 'Was dich zieht, woran du festhältst und was du gerade hinter dir lässt. Die Richtung darf sich ändern, sie ist kein Ergebnis.' },
    { id: 'personality', group: 'ich', label: 'Persönlichkeit', lines: ['Persön-', 'lichkeit'], done: false,
      lead: 'Wie du wahrnimmst, entscheidest und handelst.',
      text: 'Deine Art zu denken, zu fühlen und zu reagieren. Im Alltag, und noch deutlicher unter Druck.' },
    { id: 'values', group: 'ich', label: 'Werte', lines: ['Werte'], done: true, result: 'Ehrlichkeit',
      lead: 'Woran du misst, was zählt.',
      text: 'Die wenigen Dinge, für die du Unbequemes in Kauf nimmst. Werte zeigen sich weniger im Reden als in dem, was du wirklich wählst.',
      rows: [['Zuerst', 'Ehrlichkeit, auch wenn sie kostet'], ['Dann', 'Eigenständigkeit'], ['Dann', 'Verlässlichkeit']] },
    { id: 'attachment', group: 'bezug', label: 'Bindungsstil', lines: ['Bindungs-', 'stil'], done: true, result: 'Sicher',
      lead: 'Wie du Nähe und Abstand regelst.',
      text: 'Was in dir passiert, wenn jemand näher kommt, und was, wenn jemand geht. Bindung ist ein Muster, kein Urteil.',
      rows: [['Grundmuster', 'Sicher'], ['Unter Stress', 'Leicht vermeidend']] },
    { id: 'closeness', group: 'bezug', label: 'Nähe & Zuneigung', lines: ['Nähe &', 'Zuneigung'], done: false,
      lead: 'Wie du Zuneigung zeigst und annimmst.',
      text: 'Worin du Zuwendung ausdrückst und woran du sie erkennst. Zwei Menschen meinen oft dasselbe und zeigen es völlig verschieden.' },
    { id: 'conflict', group: 'bezug', label: 'Konfliktstil', lines: ['Konflikt-', 'stil'], done: false,
      lead: 'Was du im Streit tust.',
      text: 'Ob du zugehst, ausweichst oder zumachst. Und was dich danach wieder erreichbar macht.' }
  ];

  /* Linien-Icons im 24er-Raster: Kreise, Öffnungen, Verbindungen. */
  var ICONS = {
    'astrology': '<circle cx="12" cy="12" r="3.6"/><path d="M4.6 15.4A8 8 0 0 1 12 4a8 8 0 0 1 7.4 4.9"/><path d="M19.4 15.1A8 8 0 0 1 8 19"/><circle cx="19.6" cy="12" r="1.3"/>',
    'numerology': '<circle cx="6" cy="17" r="2"/><circle cx="12" cy="12" r="2.6"/><circle cx="18.2" cy="6.4" r="1.6"/><path d="M7.5 15.6l2.6-2.2M13.9 10.2l3.1-2.7"/>',
    'human-design': '<circle cx="12" cy="4.8" r="2.2"/><path d="M12 7v2.4M12 9.4l6 5.6-6 5.6-6-5.6z"/><path d="M9 15h6"/>',
    'direction': '<path d="M16.6 7.4A7 7 0 1 0 19 12"/><path d="M12 12l7.6-7.6M15 4.4h4.6V9"/>',
    'personality': '<circle cx="12" cy="12" r="1.6"/><path d="M8.3 14.4A4.4 4.4 0 1 1 16.4 12"/><path d="M5 15.6A7.8 7.8 0 1 1 19.8 12.4"/>',
    'values': '<path d="M5 9.2L8.4 4.8h7.2L19 9.2 12 19.4z"/><path d="M5 9.2h14M9.6 9.2L12 19.4l2.4-10.2"/>',
    'attachment': '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
    'closeness': '<path d="M12 19c-5.4-3.6-7.6-6.6-7.6-9.4A3.8 3.8 0 0 1 12 8.1a3.8 3.8 0 0 1 7.6 1.5c0 2.8-2.2 5.8-7.6 9.4z"/>',
    'conflict': '<path d="M8.4 5.6A7.4 7.4 0 0 0 8.4 18.4M15.6 5.6a7.4 7.4 0 0 1 0 12.8"/><path d="M12.8 6.6l-2 4.8 2.6 1.4-2 4.6"/>'
  };

  var NS = 'http://www.w3.org/2000/svg', RAD = Math.PI / 180;
  function r2(n) { return Math.round(n * 100) / 100; }
  function pt(r, a) { return [r2(CFG.cx + r * Math.sin(a * RAD)), r2(CFG.cy - r * Math.cos(a * RAD))]; }
  function segAngle(i) { return i * CFG.segmentDeg; }
  function norm(d) { return ((d % 360) + 360) % 360; }
  function sectorPath(a0, a1, ro) {
    var o0 = pt(ro, a0), o1 = pt(ro, a1);
    return 'M' + CFG.cx + ' ' + CFG.cy + ' L' + o0.join(' ') + ' A' + ro + ' ' + ro + ' 0 0 1 ' + o1.join(' ') + ' Z';
  }
  function ringPath(a0, a1, ri, ro) {
    var o0 = pt(ro, a0), o1 = pt(ro, a1), i1 = pt(ri, a1), i0 = pt(ri, a0);
    return 'M' + o0.join(' ') + ' A' + ro + ' ' + ro + ' 0 0 1 ' + o1.join(' ') + ' L' + i1.join(' ') + ' A' + ri + ' ' + ri + ' 0 0 0 ' + i0.join(' ') + ' Z';
  }
  function arcPath(r, a0, a1) { var p0 = pt(r, a0), p1 = pt(r, a1); return 'M' + p0.join(' ') + ' A' + r + ' ' + r + ' 0 0 1 ' + p1.join(' '); }
  function arcPathRev(r, a1, a0) { var p1 = pt(r, a1), p0 = pt(r, a0); return 'M' + p1.join(' ') + ' A' + r + ' ' + r + ' 0 0 0 ' + p0.join(' '); }
  function el(name, attrs) { var n = document.createElementNS(NS, name); for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]); return n; }
  function html(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function tone(item, step) { return 'var(--' + item.group + '-' + step + ')'; }
  function fill(item) { return item.done ? tone(item, 'flaeche') : 'var(--offen)'; }
  function iconSvg(id, cls) { return '<svg class="' + (cls || 'icon') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[id] + '</svg>'; }

  var count = 0;
  function mount(root, opts) {
    opts = opts || {};
    var uid = 'rr' + (++count), heading = opts.heading || 'h2';
    var reduced = matchMedia('(prefers-reduced-motion: reduce)');
    var half = CFG.segmentDeg / 2;

    /* ---------- Gerüst ---------- */
    root.classList.add('rad');
    root.innerHTML =
      '<div class="rad__stage">' +
        '<div class="rad__wheel" data-rad-wheel>' +
          '<div class="rad__track" aria-hidden="true"></div>' +
          '<div class="rad__plate" aria-hidden="true"></div>' +
          '<svg class="rad__svg" viewBox="0 0 320 320" aria-hidden="true" focusable="false"><defs></defs>' +
            '<g class="rad__rotor"><g class="rad__ring"></g><g class="rad__ring-labels"></g><g class="rad__faces"></g></g>' +
            '<path class="rad__lift"></path>' +
            '<g class="rad__rotor"><g class="rad__contours"></g><g class="rad__icons"></g><path class="rad__active"></path></g>' +
          '</svg>' +
          '<div class="rad__center" aria-hidden="true"><span>Ich</span></div>' +
        '</div>' +
        '<div class="rad__nav">' +
          '<button class="button button--secondary button--icon glow-edge" type="button" data-nav="prev" aria-label="Vorheriges Element"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6"/></svg></button>' +
          '<p class="rad__current" data-current aria-hidden="true"></p>' +
          '<button class="button button--secondary button--icon glow-edge" type="button" data-nav="next" aria-label="Nächstes Element"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg></button>' +
        '</div>' +
      '</div>' +
      '<section class="rad__reader" role="tabpanel" id="' + uid + '-panel" aria-live="polite"></section>' +
      '<div class="rad__overview"><p class="rad__progress t-label" data-progress></p>' +
      '<div class="rad__list" role="tablist" aria-label="Elemente im Resonanzrad"></div></div>';

    var svg = root.querySelector('.rad__svg'), defs = svg.querySelector('defs');
    var rotors = root.querySelectorAll('.rad__rotor');
    var ring = root.querySelector('.rad__ring'), ringLabels = root.querySelector('.rad__ring-labels');
    var faces = root.querySelector('.rad__faces'), contours = root.querySelector('.rad__contours');
    var icons = root.querySelector('.rad__icons'), active = root.querySelector('.rad__active'), lift = root.querySelector('.rad__lift');
    var wheel = root.querySelector('[data-rad-wheel]'), reader = root.querySelector('.rad__reader'), list = root.querySelector('.rad__list');
    var current = root.querySelector('[data-current]');

    [[root.querySelector('.rad__track'), CFG.groupOuter + 6], [root.querySelector('.rad__plate'), CFG.segmentRadius], [root.querySelector('.rad__center'), CFG.centerRadius]].forEach(function (p) {
      p[0].style.left = p[0].style.top = (CFG.cx - p[1]) / CFG.size * 100 + '%';
      p[0].style.width = p[0].style.height = 2 * p[1] / CFG.size * 100 + '%';
    });

    var filter = el('filter', { id: uid + '-lift', x: '-40%', y: '-40%', width: '180%', height: '180%', 'color-interpolation-filters': 'sRGB' });
    filter.appendChild(el('feDropShadow', { dx: 3.6, dy: 3.6, stdDeviation: 4.2, 'flood-color': '#a39b8a', 'flood-opacity': 0.8 }));
    filter.appendChild(el('feDropShadow', { dx: -2.6, dy: -2.6, stdDeviation: 3, 'flood-color': '#ffffff', 'flood-opacity': 0.95 }));
    defs.appendChild(filter);
    lift.setAttribute('d', sectorPath(-half, half, CFG.segmentRadius));
    lift.setAttribute('filter', 'url(#' + uid + '-lift)');

    /* ---------- Ring: drei Bereiche ---------- */
    var rMid = (CFG.groupInner + CFG.groupOuter) / 2, tracks = [], bands = [];
    GROUPS.forEach(function (g, gi) {
      var a0 = segAngle(gi * 3) - half + CFG.groupGapDeg / 2, a1 = segAngle(gi * 3 + 2) + half - CFG.groupGapDeg / 2;
      var band = el('path', { class: 'rad__band', 'data-group': g.id, d: ringPath(a0, a1, CFG.groupInner, CFG.groupOuter) });
      band.style.setProperty('--band', 'var(--' + g.id + '-hauch)');
      ring.appendChild(band); bands.push(band);
      defs.appendChild(el('path', { id: uid + '-t-' + g.id, d: arcPath(rMid, a0 + 2, a1 - 2) }));
      defs.appendChild(el('path', { id: uid + '-t-' + g.id + '-flip', d: arcPathRev(rMid, a1 - 2, a0 + 2) }));
      var text = el('text', { class: 'rad__ring-label', 'data-group': g.id, 'dominant-baseline': 'central' });
      var tp = el('textPath', { href: '#' + uid + '-t-' + g.id, startOffset: '50%', 'text-anchor': 'middle' });
      tp.textContent = g.label; text.appendChild(tp); ringLabels.appendChild(text);
      tracks.push({ id: g.id, center: segAngle(gi * 3 + 1), path: tp, text: text });
    });

    /* ---------- Neun Stücke, Konturen, Icons, Liste ---------- */
    var upright = [], groupLists = {};
    GROUPS.forEach(function (g) {
      var box = html('div', 'rad__group area'); box.setAttribute('data-area', g.id);
      var title = html('p', 'chip', g.label); box.appendChild(title);
      var ul = html('div', 'rad__items'); box.appendChild(ul);
      list.appendChild(box); groupLists[g.id] = ul;
    });
    var segs = ITEMS.map(function (item, i) {
      var a = segAngle(i);
      var face = el('path', { class: 'rad__face' + (item.done ? ' is-done' : ''), 'data-index': i, d: sectorPath(a - half, a + half, CFG.segmentRadius) });
      face.style.fill = fill(item);
      face.style.setProperty('--ox', r2(CFG.hoverShift * Math.sin(a * RAD)) + 'px');
      face.style.setProperty('--oy', r2(-CFG.hoverShift * Math.cos(a * RAD)) + 'px');
      faces.appendChild(face);

      /* Kontur nur bei offenen Stücken: ein gestrichelter Bogen. */
      var contour = null;
      if (!item.done) {
        contour = el('path', { class: 'rad__contour', d: arcPath(CFG.contourRadius, a - half + CFG.contourInsetDeg, a + half - CFG.contourInsetDeg) });
        contours.appendChild(contour);
      }

      /* Beschriftung im Stück: Icon, Name, Ergebnis. Steht aufrecht, auch wenn das Rad dreht. */
      var icon = el('g', { class: 'rad__icon' });
      var glyph = el('g', { class: 'rad__glyph' });
      glyph.innerHTML = '<rect width="24" height="24" fill="none" stroke="none"/>' + ICONS[item.id];
      var name = el('text', { class: 'rad__name-in', 'text-anchor': 'middle' });
      var lines = item.lines.map(function (line) { var t = el('tspan', {}); t.textContent = line; name.appendChild(t); return t; });
      /* Ausgefüllt: das Ergebnis. Offen: ein Plus im Kreis statt eines Worts. */
      var result;
      if (item.done) {
        result = el('text', { class: 'rad__result-in', 'text-anchor': 'middle' });
        result.textContent = item.result;
      } else {
        result = el('g', { class: 'rad__plus' });
        result.innerHTML = '<circle cx="0" cy="0" r="8.5"/><path d="M-4 0H4M0 -4V4"/>';
      }
      icon.classList.toggle('is-open', !item.done);
      icon.appendChild(glyph); icon.appendChild(name); icon.appendChild(result); icons.appendChild(icon);
      upright.push(icon);

      var tab = html('button', 'rad__item glow-edge'); tab.type = 'button';
      tab.setAttribute('role', 'tab'); tab.id = uid + '-tab-' + item.id;
      tab.setAttribute('aria-controls', uid + '-panel'); tab.setAttribute('aria-selected', 'false'); tab.tabIndex = -1;
      tab.dataset.index = i;
      if (!item.done) tab.classList.add('is-open');
      tab.innerHTML = '<span class="rad__swatch' + (item.done ? ' is-done' : '') + '" style="--swatch:' + tone(item, 'flaeche') + '"></span>' +
        iconSvg(item.id) + '<span class="rad__item-name">' + item.label + '</span>' +
        (item.done ? '<span class="rad__item-state">' + item.result + '</span>'
                   : '<span class="rad__item-state rad__fill-cta" aria-hidden="true">+ Ausfüllen</span>');
      tab.setAttribute('aria-label', item.label + ', ' + (item.done ? 'ausgefüllt: ' + item.result : 'noch offen'));
      groupLists[item.group].appendChild(tab);
      return { face: face, contour: contour, icon: icon, glyph: glyph, name: name, lines: lines, result: result, tab: tab, angle: a };
    });
    var doneCount = ITEMS.filter(function (it) { return it.done; }).length, openCount = ITEMS.length - doneCount;
    root.querySelector('[data-progress]').innerHTML = '<span>' + doneCount + ' von ' + ITEMS.length + ' ausgefüllt' +
      (openCount ? ' · ' + openCount + (openCount === 1 ? ' wartet' : ' warten') + ' auf dich' : '') + '</span>' +
      '<span class="rad__legend" aria-hidden="true"><span><i class="rad__swatch is-done" style="--swatch:var(--sterne-flaeche)"></i>ausgefüllt</span>' +
      '<span><i class="rad__swatch"></i>offen</span></span>';

    /* Beschriftung im Stück, gemessen so gesetzt, dass nichts überlappt und
       nichts über das Stück hinausragt (2 px Rand, geprüft für jede Auswahl):
       - ab 500 px Rad: Name und darunter Ergebnis oder Plus, ohne Icon;
       - darunter: nur das Icon, bei offenen Elementen darunter das Plus
         (ab 300 px Rad). Name und Ergebnis stehen dann in der Zeile unter
         dem Rad und in der Liste.
       Schrift in echten 15 px, Plus 17 px mit 4 px Abstand in eigener Zeile. */
    function layoutIcons() {
      var w = wheel.getBoundingClientRect().width || 320, u = CFG.size / w, full = w >= CFG.fullFrom, withPlus = full || w >= CFG.plusFrom;
      root.style.setProperty('--u', u);
      root.classList.toggle('is-compact', !full);
      root.classList.toggle('is-tiny', !withPlus);
      var line = 18 * u, icon = full ? 0 : 22 * u, s = 22 / 24 * u, plus = 17 * u, plusGap = 4 * u;
      var radius = full ? CFG.labelRadius : CFG.labelRadiusCompact;
      segs.forEach(function (s0, i) {
        var item = ITEMS[i], p = pt(radius, s0.angle);
        var rows = full ? item.lines.length * line : 0;
        var tail = item.done ? (full ? line : 0) : (withPlus ? plusGap + plus : 0);
        var height = icon + rows + tail, top = p[1] - height / 2, below = top + icon + rows;
        s0.glyph.setAttribute('transform', 'translate(' + r2(p[0] - 12 * s) + ' ' + r2(top) + ') scale(' + r2(s) + ')');
        s0.lines.forEach(function (t, k) { t.setAttribute('x', p[0]); t.setAttribute('y', r2(top + (k + 0.78) * line)); });
        if (item.done) { s0.result.setAttribute('x', p[0]); s0.result.setAttribute('y', r2(below + 0.78 * line)); }
        else s0.result.setAttribute('transform', 'translate(' + r2(p[0]) + ' ' + r2(below + plusGap + plus / 2) + ') scale(' + r2(u) + ')');
        s0.icon.style.transformOrigin = p[0] + 'px ' + p[1] + 'px';
      });
    }
    if (window.ResizeObserver) new ResizeObserver(layoutIcons).observe(wheel);
    layoutIcons();

    /* ---------- Auswahl und Drehung ---------- */
    var index = -1, rotation = 0, restTimer = 0;
    function applyRotation(animate) {
      rotors.forEach(function (r) { r.classList.toggle('is-still', !animate); r.style.transform = 'rotate(' + rotation + 'deg)'; });
      upright.forEach(function (u) { u.classList.toggle('is-still', !animate); u.style.transform = 'rotate(' + (-rotation) + 'deg)'; });
      tracks.forEach(function (t) {
        var onScreen = norm(t.center + rotation);
        t.path.setAttribute('href', '#' + uid + '-t-' + t.id + (onScreen > 90 && onScreen < 270 ? '-flip' : ''));
      });
      clearTimeout(restTimer);
      var off = norm(rotation + segAngle(index));
      if (off > 0.01 && off < 359.99) { root.classList.add('is-turning'); return; }
      if (animate) { root.classList.add('is-turning'); restTimer = setTimeout(function () { root.classList.remove('is-turning'); }, 380); }
      else root.classList.remove('is-turning');
    }
    function targetFor(i) { var want = -segAngle(i); return want + Math.round((rotation - want) / 360) * 360; }

    function renderReader(item) {
      var g = GROUPS.filter(function (x) { return x.id === item.group; })[0];
      var body = '<p class="chip area" data-area="' + item.group + '">' + g.label + '</p>' +
        '<' + heading + ' class="rad__name t-title">' + item.label + '</' + heading + '>' +
        '<p class="rad__lead t-heading">' + item.lead + '</p>' +
        '<p class="rad__text secondary">' + item.text + '</p>';
      if (item.done) {
        body += '<div class="rad__result area" data-area="' + item.group + '"><p class="t-label">Dein Ergebnis</p><dl>' +
          item.rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl></div>';
      } else {
        body += '<div class="rad__open"><div class="status" data-role="info"><span class="status__sign" aria-hidden="true">i</span><div><strong class="status__title">Noch offen</strong><p class="status__text">Dieser Bereich bleibt leer, bis du ihn ausfüllst.</p></div></div>' +
          '<button class="button" type="button" data-fill>Jetzt ausfüllen</button><p class="rad__note secondary" data-fill-note aria-live="polite"></p></div>';
      }
      reader.innerHTML = body;
      var fillButton = reader.querySelector('[data-fill]');
      if (fillButton) fillButton.addEventListener('click', function () {
        reader.querySelector('[data-fill-note]').textContent = 'Nur diese Vorschau. Kein Versand, keine Speicherung.';
      });
    }

    var viaKeyboard = false;
    root.addEventListener('keydown', function () { viaKeyboard = true; }, true);
    root.addEventListener('pointerdown', function () { viaKeyboard = false; }, true);

    function select(i, animate) {
      i = ((i % ITEMS.length) + ITEMS.length) % ITEMS.length;
      var item = ITEMS[i], a = segAngle(i), first = index < 0;
      if (i !== index) {
        index = i;
        active.setAttribute('d', arcPath(CFG.activeRadius, a - half + CFG.activeInsetDeg, a + half - CFG.activeInsetDeg));
        lift.style.fill = fill(item);
        /* Auswahlbogen in der Farbe seines Bereichs, nicht im Markenspektrum */
        root.style.setProperty('--arc', tone(item, 'tief'));
        segs.forEach(function (s, k) {
          var on = k === i;
          s.tab.setAttribute('aria-selected', String(on)); s.tab.tabIndex = on ? 0 : -1;
          s.face.classList.toggle('is-active', on);
        });
        reader.setAttribute('aria-labelledby', segs[i].tab.id);
        current.innerHTML = iconSvg(item.id) + '<span><strong>' + item.label + '</strong><span>' + (item.done ? item.result : '+ Ausfüllen') + '</span></span>';
        current.style.setProperty('--tone', tone(item, 'tief'));
        renderReader(item);
        if (!first && animate !== false && !reduced.matches && !viaKeyboard && reader.animate) {
          reader.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.23,1,.32,1)' });
        }
      }
      rotation = targetFor(i);
      applyRotation(animate !== false && !reduced.matches);
    }

    /* Ziehen dreht, Loslassen rastet ein; ein Tipp wählt das Stück. */
    var drag = null;
    function pointerAngle(e) { var r = svg.getBoundingClientRect(); return Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) / RAD; }
    wheel.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      drag = { last: pointerAngle(e), t: e.timeStamp, v: 0, moved: 0, target: e.target.closest ? e.target.closest('.rad__face') : null };
      wheel.setPointerCapture(e.pointerId);
    });
    wheel.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var a = pointerAngle(e), d = a - drag.last;
      if (d > 180) d -= 360; if (d < -180) d += 360;
      drag.v = d / Math.max(1, e.timeStamp - drag.t); drag.last = a; drag.t = e.timeStamp; drag.moved += Math.abs(d);
      if (drag.moved > 3) { rotation += d; applyRotation(false); }
    });
    function endDrag(e, cancelled) {
      if (!drag) return;
      var d = drag; drag = null;
      if (wheel.hasPointerCapture && wheel.hasPointerCapture(e.pointerId)) wheel.releasePointerCapture(e.pointerId);
      if (cancelled) { select(index); return; }
      if (d.moved <= 3) { if (d.target) select(Number(d.target.getAttribute('data-index'))); return; }
      var impulse = Math.abs(d.v) > 0.35 ? Math.sign(d.v) * Math.min(2, Math.round(Math.abs(d.v) * 3)) : 0;
      var aim = rotation + impulse * CFG.segmentDeg, best = 0, bestDiff = Infinity;
      ITEMS.forEach(function (_, i) { var want = -segAngle(i), t = want + Math.round((aim - want) / 360) * 360; if (Math.abs(t - aim) < bestDiff) { bestDiff = Math.abs(t - aim); best = i; } });
      select(best);
    }
    wheel.addEventListener('pointerup', function (e) { endDrag(e, false); });
    wheel.addEventListener('pointercancel', function (e) { endDrag(e, true); });

    list.addEventListener('click', function (e) {
      var t = e.target.closest('.rad__item'); if (!t) return;
      select(Number(t.dataset.index));
      /* „+ Ausfüllen“ führt direkt zum Knopf im Lesebereich. */
      if (e.target.closest('.rad__fill-cta')) { var f = reader.querySelector('[data-fill]'); if (f) f.focus(); }
    });
    list.addEventListener('keydown', function (e) {
      var k = e.key, next = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') next = index + 1;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') next = index - 1;
      else if (k === 'Home') next = 0;
      else if (k === 'End') next = ITEMS.length - 1;
      if (next === null) return;
      e.preventDefault(); select(next); segs[index].tab.focus();
    });
    root.querySelectorAll('[data-nav]').forEach(function (b) {
      b.addEventListener('click', function () { select(index + (b.getAttribute('data-nav') === 'next' ? 1 : -1)); });
    });
    reduced.addEventListener('change', function () { applyRotation(false); });
    select(0, false);
    root.classList.add('is-ready');

    var api = {
      select: select,
      parts: {
        wheel: wheel, plate: root.querySelector('.rad__plate'), track: root.querySelector('.rad__track'), center: root.querySelector('.rad__center'),
        bands: bands, ringLabels: tracks.map(function (t) { return t.text; }),
        faces: segs.map(function (s) { return s.face; }), contours: segs.map(function (s) { return s.contour; }).filter(Boolean),
        icons: segs.map(function (s) { return s.icon; }), lift: lift, active: active,
        groups: GROUPS.map(function (g) { return g.id; }), items: ITEMS, list: root.querySelector('.rad__overview'), reader: reader, nav: root.querySelector('.rad__nav')
      }
    };
    root._resonanzrad = api;
    return api;
  }

  /* ---------- Kleines Rad für Karten ----------
     Dieselbe Geometrie, nur Ring, Flächen, Fugen und offene Konturen.
     Keine Schrift im Rad: Name und Stand stehen daneben. Ohne Drehung,
     ohne Auswahl. opts.done: Liste der ausgefüllten Element-ids, sonst
     gilt der Stand der Demo. opts.focus: id des Elements, das als Nächstes
     wartet; sein Stück hebt sich ab und glüht im Atemtakt (app.css). */
  function mini(root, opts) {
    opts = opts || {};
    var half = CFG.segmentDeg / 2, count = 0;
    var isDone = opts.done ? function (it) { return opts.done.indexOf(it.id) >= 0; } : function (it) { return it.done; };
    var ring = GROUPS.map(function (g, gi) {
      var a0 = segAngle(gi * 3) - half + CFG.groupGapDeg / 2, a1 = segAngle(gi * 3 + 2) + half - CFG.groupGapDeg / 2;
      return '<path d="' + ringPath(a0, a1, CFG.groupInner, CFG.groupOuter) + '" fill="var(--' + g.id + '-hauch)"/>';
    }).join('');
    var faces = ITEMS.map(function (item, i) {
      var a = segAngle(i), done = isDone(item);
      if (done) count++;
      var focus = opts.focus === item.id;
      return '<g class="rad-mini__face' + (focus ? ' is-focus' : '') + '" style="--i:' + i + '">' +
        '<path d="' + sectorPath(a - half, a + half, CFG.segmentRadius + (focus ? 6 : 0)) + '" fill="' + (done ? tone(item, 'flaeche') : focus ? tone(item, 'hauch') : 'var(--offen)') + '" stroke="' + (focus ? tone(item, 'tief') : 'var(--canvas)') + '" stroke-width="' + (focus ? 2.4 : 5) + '" stroke-linejoin="round"' + (focus ? ' vector-effect="non-scaling-stroke"' : '') + '/>' +
        (done ? '' : '<path d="' + arcPath(CFG.contourRadius - 8, a - half + 7, a + half - 7) + '" fill="none" stroke="' + (focus ? tone(item, 'tief') : 'var(--ink-2)') + '" stroke-width="1.6" stroke-dasharray="3 4" stroke-linecap="round" vector-effect="non-scaling-stroke"/>') + '</g>';
    }).join('');
    var label = opts.label || 'Resonanzrad: ' + count + ' von ' + ITEMS.length + ' Elementen ausgefüllt';
    root.innerHTML = '<svg class="rad-mini" viewBox="0 0 320 320" role="img" aria-label="' + label + '">' + ring + faces +
      '<circle cx="' + CFG.cx + '" cy="' + CFG.cy + '" r="' + CFG.centerRadius + '" fill="var(--paper)"/></svg>';
    return { done: count, total: ITEMS.length };
  }

  window.ElanumResonanzrad = {
    mount: mount,
    mini: mini,
    groups: GROUPS, items: ITEMS, icons: ICONS,
    iconSvg: iconSvg
  };
})();
