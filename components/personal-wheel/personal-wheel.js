/* ============================================================
   ELANUM, persönliches Rad im Bereich Ich
   Gestaltet nach Gestaltungsatlas 4.4, mobile-first.

   VERBINDLICHE GEOMETRIE
   Die Silhouette ist jederzeit ein mathematisch perfekter Kreis. Neun gleich
   grosse Segmente à exakt 40 Grad, darüber ein Ring aus drei Abschnitten à
   120 Grad, jeweils an drei Segmente gekoppelt. Alle Bögen teilen denselben
   Mittelpunkt. Alle Pfade werden aus Polarkoordinaten berechnet.

   Aus 4.4 übernommen:
   - Licht von links oben: Scheibe, Zentrum und das angehobene Stück sind
     Reliefflächen, die nicht mitdrehen, weil das Licht nicht mitdreht.
   - Neun Feldfarben. Stück, Ring, Icon und Ergebnis eines Bereichs tragen
     immer dieselbe Farbe; der Ring geht zwischen Nachbarn weich über.
   - "Die Öffnung zeigt, was nicht abgeschlossen ist": Der Rand eines Stücks
     ist geschlossen, wenn der Bereich ausgefüllt ist, und hat eine Öffnung,
     solange er offen ist.
   - Auswahl nie nur über Farbe oder Schatten: Bogen, Relief, Gewicht, Text
     und aria-selected tragen dieselbe Information.
   ============================================================ */
(function () {
  'use strict';

  var CFG = {
    size: 320,
    cx: 160, cy: 160,
    centerRadius: 28,       // Zentrum "Ich", liegt über den Spitzen der Segmente
    iconRadius: 48,         // Icons als Kranz um "Ich"
    iconSize: 18,
    labelRadius: 92,        // Name und Ergebnis; weit genug aussen, damit auch die innerste Zeile oben ins Stück passt
    labelLine: 12,          // Zeilenabstand der Namen
    resultGap: 3,           // zusätzliche Luft vor dem Ergebnis
    contourRadius: 124,     // Rand, der den Ausfüllstatus zeigt
    contourInsetDeg: 4,
    openingDeg: 12,         // Öffnung im Rand offener Stücke
    segmentRadius: 128,     // Aussenradius aller neun Segmente, für alle gleich
    activeRadius: 131,      // Auswahlbogen in der Rille zwischen Scheibe und Ring
    groupInner: 134,        // schlanker Ring, damit die Stücke Fläche bekommen
    groupOuter: 154,
    segmentDeg: 40,         // 360 / 9, exakt
    groupGapDeg: 4,         // grosse Abstände trennen Gruppen (4.4)
    ringStepDeg: 2,         // Feinheit des Farbverlaufs im Ring
    activeInsetDeg: 4,
    hoverShift: 2           // radiale Anhebung bei Hover, nur mit feinem Zeiger
  };

  var GROUPS = [
    { id: 'grundtoene',  label: 'Grundtöne' },
    { id: 'orientation', label: 'Ich & Orientierung' },
    { id: 'connection',  label: 'Beziehung & Verbindung' }
  ];
  var ITEMS = [
    { id: 'astrology',    group: 'grundtoene',  label: 'Astrologie',       lines: ['Astro-', 'logie'],     color: 'violet' },
    { id: 'numerology',   group: 'grundtoene',  label: 'Numerologie',      lines: ['Numero-', 'logie'],    color: 'blue' },
    { id: 'human-design', group: 'grundtoene',  label: 'Human Design',     lines: ['Human', 'Design'],     color: 'orchid' },
    { id: 'direction',    group: 'orientation', label: 'Lebensrichtung',   lines: ['Lebens-', 'richtung'], color: 'rose' },
    { id: 'personality',  group: 'orientation', label: 'Persönlichkeit',   lines: ['Persön-', 'lichkeit'], color: 'pink' },
    { id: 'values',       group: 'orientation', label: 'Werte',            lines: ['Werte'],               color: 'coral' },
    { id: 'attachment',   group: 'connection',  label: 'Bindungsstil',     lines: ['Bindungs-', 'stil'],   color: 'amber' },
    { id: 'closeness',    group: 'connection',  label: 'Nähe & Zuneigung', lines: ['Nähe &', 'Zuneigung'], color: 'moss' },
    { id: 'conflict',     group: 'connection',  label: 'Konfliktstil',     lines: ['Konflikt-', 'stil'],   color: 'teal' }
  ];

  /* Linien-Icons im 24er-Raster, Sprache aus 4.4: Kreise, Öffnungen,
     Verbindungen. Strich 1,6 px, runde Enden, keine Füllung. */
  var ICONS = {
    'astrology':    '<circle cx="12" cy="12" r="3.6"/><path d="M4.6 15.4A8 8 0 0 1 12 4a8 8 0 0 1 7.4 4.9"/><path d="M19.4 15.1A8 8 0 0 1 8 19"/><circle cx="19.6" cy="12" r="1.3"/>',
    'numerology':   '<circle cx="6" cy="17" r="2"/><circle cx="12" cy="12" r="2.6"/><circle cx="18.2" cy="6.4" r="1.6"/><path d="M7.5 15.6l2.6-2.2M13.9 10.2l3.1-2.7"/>',
    'human-design': '<circle cx="12" cy="4.8" r="2.2"/><path d="M12 7v2.4M12 9.4l6 5.6-6 5.6-6-5.6z"/><path d="M9 15h6"/>',
    'direction':    '<path d="M16.6 7.4A7 7 0 1 0 19 12"/><path d="M12 12l7.6-7.6M15 4.4h4.6V9"/>',
    'personality':  '<circle cx="12" cy="12" r="1.6"/><path d="M8.3 14.4A4.4 4.4 0 1 1 16.4 12"/><path d="M5 15.6A7.8 7.8 0 1 1 19.8 12.4"/>',
    'values':       '<path d="M5 9.2L8.4 4.8h7.2L19 9.2 12 19.4z"/><path d="M5 9.2h14M9.6 9.2L12 19.4l2.4-10.2"/>',
    'attachment':   '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
    'closeness':    '<path d="M12 19c-5.4-3.6-7.6-6.6-7.6-9.4A3.8 3.8 0 0 1 12 8.1a3.8 3.8 0 0 1 7.6 1.5c0 2.8-2.2 5.8-7.6 9.4z"/>',
    'conflict':     '<path d="M8.4 5.6A7.4 7.4 0 0 0 8.4 18.4M15.6 5.6a7.4 7.4 0 0 1 0 12.8"/><path d="M12.8 6.6l-2 4.8 2.6 1.4-2 4.6"/>'
  };

  var SVGNS = 'http://www.w3.org/2000/svg';
  var TAU = Math.PI / 180;
  function r2(n) { return Math.round(n * 100) / 100; }
  /* Polarkoordinate. 0 Grad ist oben, positiv im Uhrzeigersinn. */
  function pt(r, a) { return [r2(CFG.cx + r * Math.sin(a * TAU)), r2(CFG.cy - r * Math.cos(a * TAU))]; }
  function segAngle(i) { return i * CFG.segmentDeg; }
  function norm(d) { return ((d % 360) + 360) % 360; }

  function sectorPath(a0, a1, ro) {
    var o0 = pt(ro, a0), o1 = pt(ro, a1), large = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + CFG.cx + ' ' + CFG.cy + ' L' + o0.join(' ') + ' A' + ro + ' ' + ro + ' 0 ' + large + ' 1 ' + o1.join(' ') + ' Z';
  }
  function ringPath(a0, a1, ri, ro) {
    var o0 = pt(ro, a0), o1 = pt(ro, a1), i1 = pt(ri, a1), i0 = pt(ri, a0), large = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + o0.join(' ') + ' A' + ro + ' ' + ro + ' 0 ' + large + ' 1 ' + o1.join(' ') +
           ' L' + i1.join(' ') + ' A' + ri + ' ' + ri + ' 0 ' + large + ' 0 ' + i0.join(' ') + ' Z';
  }
  function arcPath(r, a0, a1) {
    var p0 = pt(r, a0), p1 = pt(r, a1), large = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + p0.join(' ') + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + p1.join(' ');
  }
  /* Derselbe Bogen rückwärts, damit Ringtext auch unten aufrecht liest. */
  function arcPathRev(r, a1, a0) {
    var p1 = pt(r, a1), p0 = pt(r, a0), large = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + p1.join(' ') + ' A' + r + ' ' + r + ' 0 ' + large + ' 0 ' + p0.join(' ');
  }
  function el(name, attrs) {
    var n = document.createElementNS(SVGNS, name), k;
    for (k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    return n;
  }
  function groupOf(id) { return GROUPS.filter(function (g) { return g.id === id; })[0]; }
  function pct(v) { return (v / CFG.size * 100) + '%'; }
  function field(item) { return 'var(--elanum-' + item.color + ')'; }

  /* Farbmischung für den Ringverlauf, aus den echten Token-Werten. */
  function hexRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); });
  }
  function mix(a, b, t) {
    return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(',') + ')';
  }
  function smooth(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

  function build(root) {
    var svg = root.querySelector('.wheel__svg');
    var rotors = root.querySelectorAll('.wheel__rotor');
    var defs = svg.querySelector('defs');
    var ringLayer = root.querySelector('.wheel__ring');
    var ringLabels = root.querySelector('.wheel__ring-labels');
    var segLayer = root.querySelector('.wheel__segments');
    var contourLayer = root.querySelector('.wheel__contours');
    var iconLayer = root.querySelector('.wheel__icons');
    var labelLayer = root.querySelector('.wheel__labels');
    var activeArc = root.querySelector('.wheel__active');
    var lift = root.querySelector('.wheel__lift');
    var track = root.querySelector('.wheel__track');
    var plate = root.querySelector('.wheel__plate');
    var center = root.querySelector('.wheel__center');
    var readerGroup = root.querySelector('[data-reader-group]');
    var readerIcon = root.querySelector('[data-reader-icon]');
    var readerName = root.querySelector('[data-reader-name]');
    var readerLead = root.querySelector('[data-reader-lead]');
    var panels = root.querySelectorAll('[data-panel]');
    var progress = root.querySelector('[data-progress]');
    if (!svg || !rotors.length) return;

    var half = CFG.segmentDeg / 2;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var tokens = getComputedStyle(root);
    var rgb = ITEMS.map(function (item) { return hexRgb(tokens.getPropertyValue('--elanum-' + item.color).trim() || '#888888'); });

    /* Rille, Scheibe und Zentrum als HTML-Flächen, damit die Relief-Schatten
       aus 4.4 exakt gelten. Grösse aus derselben Geometrie wie das SVG. */
    [[track, CFG.groupOuter], [plate, CFG.segmentRadius], [center, CFG.centerRadius]].forEach(function (p) {
      if (!p[0]) return;
      p[0].style.left = p[0].style.top = pct(CFG.cx - p[1]);
      p[0].style.width = p[0].style.height = pct(2 * p[1]);
    });

    /* Relief des angehobenen Stücks: heller Schatten links oben, dunkler
       rechts unten, wie .raised in relief.css. */
    var filter = el('filter', { id: 'wheel-lift', x: '-40%', y: '-40%', width: '180%', height: '180%', 'color-interpolation-filters': 'sRGB' });
    filter.appendChild(el('feDropShadow', { dx: 3.6, dy: 3.6, stdDeviation: 4.2, 'flood-color': '#a39b8a', 'flood-opacity': 0.8 }));
    filter.appendChild(el('feDropShadow', { dx: -2.6, dy: -2.6, stdDeviation: 3, 'flood-color': '#ffffff', 'flood-opacity': 0.95 }));
    defs.appendChild(filter);
    lift.setAttribute('d', sectorPath(-half, half, CFG.segmentRadius));
    lift.setAttribute('filter', 'url(#wheel-lift)');

    function panelOf(id) { return root.querySelector('[data-panel="' + id + '"]'); }
    function isDone(id) { var p = panelOf(id); return !!p && p.getAttribute('data-done') === 'true'; }
    function resultOf(id) { var p = panelOf(id); return p ? (p.getAttribute('data-result') || '') : ''; }

    /* Ring: drei Abschnitte à 120 Grad. Über jedem Stück liegt dessen
       Farbe; zwischen zwei Stücken geht sie in feinen Schritten über. */
    var rMid = (CFG.groupInner + CFG.groupOuter) / 2, tracks = [];
    GROUPS.forEach(function (g, gi) {
      var a0 = segAngle(gi * 3) - half + CFG.groupGapDeg / 2;
      var a1 = segAngle(gi * 3 + 2) + half - CFG.groupGapDeg / 2;
      var band = el('g', { class: 'wheel__band', 'data-group': g.id });
      for (var a = a0; a < a1 - 1e-6; a += CFG.ringStepDeg) {
        var b = Math.min(a1, a + CFG.ringStepDeg), mid = (a + b) / 2;
        var pos = (mid - segAngle(gi * 3)) / CFG.segmentDeg;     // 0, 1, 2 = Mitten der drei Stücke
        var k = Math.max(0, Math.min(1, Math.floor(pos)));
        var t = smooth((pos - k - 0.3) / 0.4);                     // Übergang nur um die Stückgrenze
        var fill = mix(rgb[gi * 3 + k], rgb[gi * 3 + Math.min(2, k + 1)], pos < 0 ? 0 : t);
        /* Leichte Überlappung verhindert Haarlinien zwischen den Schritten. */
        band.appendChild(el('path', { d: ringPath(a, Math.min(a1, b + 0.35), CFG.groupInner, CFG.groupOuter), fill: fill }));
      }
      ringLayer.appendChild(band);
      defs.appendChild(el('path', { id: 'track-' + g.id, fill: 'none', d: arcPath(rMid, a0 + 3, a1 - 3) }));
      defs.appendChild(el('path', { id: 'track-' + g.id + '-flip', fill: 'none', d: arcPathRev(rMid, a1 - 3, a0 + 3) }));
      var text = el('text', { class: 'wheel__ring-label', 'data-group': g.id, 'aria-hidden': 'true' });
      var tp = el('textPath', { href: '#track-' + g.id, startOffset: '50%', 'text-anchor': 'middle' });
      tp.textContent = g.label;
      text.appendChild(tp); ringLabels.appendChild(text);
      tracks.push({ id: g.id, center: segAngle(gi * 3 + 1), path: tp });
    });

    /* Neun Segmente. */
    var upright = [];
    var segs = ITEMS.map(function (item, i) {
      var a = segAngle(i), done = isDone(item.id), result = done ? resultOf(item.id) : '';
      var status = done ? 'ausgefüllt: ' + result : 'noch offen';
      var g = el('g', {
        class: 'wheel__slice' + (done ? ' is-done' : ''), role: 'tab', tabindex: '-1',
        'aria-selected': 'false', 'aria-label': item.label + ', ' + status,
        'aria-controls': 'panel-' + item.id, id: 'tab-' + item.id, 'data-index': i
      });
      g.style.setProperty('--field', field(item));
      var face = el('path', { class: 'wheel__face', d: sectorPath(a - half, a + half, CFG.segmentRadius) });
      face.style.setProperty('--ox', r2(CFG.hoverShift * Math.sin(a * TAU)) + 'px');
      face.style.setProperty('--oy', r2(-CFG.hoverShift * Math.cos(a * TAU)) + 'px');
      g.appendChild(face);
      segLayer.appendChild(g);

      /* Rand: geschlossen = ausgefüllt, mit Öffnung in der Mitte = offen. */
      var c0 = a - half + CFG.contourInsetDeg, c1 = a + half - CFG.contourInsetDeg, gap = CFG.openingDeg / 2;
      var contour = el('path', {
        class: 'wheel__contour' + (done ? ' is-done' : ''),
        d: done ? arcPath(CFG.contourRadius, c0, c1)
                : arcPath(CFG.contourRadius, c0, a - gap) + ' ' + arcPath(CFG.contourRadius, a + gap, c1)
      });
      contour.style.setProperty('--field', field(item));
      contourLayer.appendChild(contour);

      /* Icon: aufrecht, dreht gegen das Rad. */
      var ip = pt(CFG.iconRadius, a), s = CFG.iconSize / 24;
      var icon = el('g', { class: 'wheel__icon' + (done ? ' is-done' : '') });
      icon.style.setProperty('--field', field(item));
      var glyph = el('g', { transform: 'translate(' + r2(ip[0] - 12 * s) + ' ' + r2(ip[1] - 12 * s) + ') scale(' + r2(s) + ')' });
      glyph.innerHTML = ICONS[item.id];
      /* Unsichtbare Fläche, damit die Drehachse die Icon-Mitte ist. */
      glyph.insertBefore(el('rect', { width: 24, height: 24, fill: 'none', stroke: 'none' }), glyph.firstChild);
      icon.appendChild(glyph);
      iconLayer.appendChild(icon);

      /* Name in Albert Sans, Ergebnis in Yrsa, sonst "offen". */
      var p = pt(CFG.labelRadius, a);
      var text = el('text', { class: 'wheel__label' + (done ? ' is-done' : ''), x: p[0], y: p[1], 'text-anchor': 'middle' });
      text.style.setProperty('--field', field(item));
      var rows = item.lines.length + 1;
      var top = -(rows - 1) * CFG.labelLine / 2 - CFG.resultGap / 2;
      item.lines.forEach(function (line, li) {
        var t = el('tspan', { x: p[0], y: r2(p[1] + top + li * CFG.labelLine), 'dominant-baseline': 'central' });
        t.textContent = line; text.appendChild(t);
      });
      var rs = el('tspan', { class: done ? 'wheel__result' : 'wheel__open', x: p[0], 'dominant-baseline': 'central',
                             y: r2(p[1] + top + item.lines.length * CFG.labelLine + CFG.resultGap) });
      rs.textContent = done ? result : 'offen';
      text.appendChild(rs);
      labelLayer.appendChild(text);
      upright.push(icon, text);
      return { g: g, label: text, icon: icon, contour: contour, done: done };
    });

    if (progress) {
      var n = segs.filter(function (s) { return s.done; }).length;
      progress.textContent = n + ' von ' + ITEMS.length + ' ausgefüllt';
    }

    var index = -1, rotation = 0, restTimer = 0;
    function applyRotation(animate) {
      Array.prototype.forEach.call(rotors, function (r) {
        r.classList.toggle('is-still', !animate);
        r.style.transform = 'rotate(' + rotation + 'deg)';
      });
      upright.forEach(function (u) {
        u.classList.toggle('is-still', !animate);
        u.style.transform = 'rotate(' + (-rotation) + 'deg)';
      });
      tracks.forEach(function (t) {
        var onScreen = norm(t.center + rotation);
        t.path.setAttribute('href', '#track-' + t.id + (onScreen > 90 && onScreen < 270 ? '-flip' : ''));
      });
      /* Das Relief erscheint erst, wenn das gewählte Stück oben ruht. */
      clearTimeout(restTimer);
      var off = norm(rotation + segAngle(index));
      if (off > 0.01 && off < 359.99) { root.classList.add('is-turning'); return; }
      if (animate) {
        root.classList.add('is-turning');
        restTimer = setTimeout(function () { root.classList.remove('is-turning'); }, 380);
      } else {
        root.classList.remove('is-turning');
      }
    }
    function targetFor(i) {
      var want = -segAngle(i);
      return want + Math.round((rotation - want) / 360) * 360;
    }

    /* Wechsel im Lesebereich wie die Produkt-Tabs in 4.4: 240 ms bei
       Zeigerbedienung, per Tastatur sofort. */
    var viaKeyboard = false;
    root.addEventListener('keydown', function () { viaKeyboard = true; }, true);
    root.addEventListener('pointerdown', function () { viaKeyboard = false; }, true);
    function crossfade(els) {
      els.forEach(function (n) {
        if (!n || !n.animate) return;
        n.getAnimations().forEach(function (an) { an.cancel(); });
        n.animate([{ opacity: 0.3, transform: 'translateY(9px)' }, { opacity: 1, transform: 'translateY(0)' }],
                  { duration: 240, easing: 'cubic-bezier(.23,1,.32,1)' });
      });
    }

    function select(i, animate) {
      i = ((i % ITEMS.length) + ITEMS.length) % ITEMS.length;
      var item = ITEMS[i], a = segAngle(i);
      if (i !== index) {
        var first = index < 0;
        index = i;
        activeArc.setAttribute('d', arcPath(CFG.activeRadius, a - half + CFG.activeInsetDeg, a + half - CFG.activeInsetDeg));
        activeArc.style.setProperty('--field', field(item));
        lift.style.setProperty('--field', field(item));
        lift.classList.toggle('is-done', segs[i].done);
        segs.forEach(function (s, k) {
          var on = k === i;
          s.g.setAttribute('aria-selected', String(on));
          s.g.setAttribute('tabindex', on ? '0' : '-1');
          [s.g, s.label, s.icon, s.contour].forEach(function (n) { n.classList.toggle('is-active', on); });
        });
        Array.prototype.forEach.call(ringLayer.children, function (b) {
          b.classList.toggle('is-active', b.getAttribute('data-group') === item.group);
        });
        Array.prototype.forEach.call(ringLabels.children, function (t) {
          t.classList.toggle('is-active', t.getAttribute('data-group') === item.group);
        });
        readerGroup.textContent = groupOf(item.group).label;
        readerGroup.parentNode.style.setProperty('--field', field(item));
        if (readerIcon) readerIcon.innerHTML = ICONS[item.id];
        readerName.textContent = item.label;
        Array.prototype.forEach.call(panels, function (p) {
          var on = p.getAttribute('data-panel') === item.id;
          p.hidden = !on;
          if (on) readerLead.textContent = p.getAttribute('data-lead') || '';
        });
        if (!first && animate !== false && !reduced.matches && !viaKeyboard) {
          crossfade([readerGroup.parentNode, readerName, readerLead, panelOf(item.id)]);
        }
      }
      rotation = targetFor(i);
      applyRotation(animate !== false && !reduced.matches);
    }

    /* Ziehen dreht das Rad, Loslassen rastet ein. touch-action:pan-y im CSS
       lässt senkrechtes Wischen die Seite scrollen; dann bricht der Browser
       die Geste ab, und das Rad springt auf die aktuelle Auswahl zurück. */
    var drag = null;
    function pointerAngle(e) {
      var r = svg.getBoundingClientRect();
      return Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) / TAU;
    }
    svg.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      drag = { last: pointerAngle(e), t: e.timeStamp, v: 0, moved: 0,
               target: e.target.closest ? e.target.closest('.wheel__slice') : null };
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var a = pointerAngle(e), d = a - drag.last;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      drag.v = d / Math.max(1, e.timeStamp - drag.t);
      drag.last = a; drag.t = e.timeStamp; drag.moved += Math.abs(d);
      if (drag.moved > 3) { rotation += d; applyRotation(false); }
    });
    function endDrag(e, cancelled) {
      if (!drag) return;
      var d = drag; drag = null;
      if (svg.hasPointerCapture && svg.hasPointerCapture(e.pointerId)) svg.releasePointerCapture(e.pointerId);
      if (cancelled) { select(index); return; }
      if (d.moved <= 3) { if (d.target) select(Number(d.target.getAttribute('data-index'))); return; }
      var impulse = Math.abs(d.v) > 0.35 ? Math.sign(d.v) * Math.min(2, Math.round(Math.abs(d.v) * 3)) : 0;
      var aim = rotation + impulse * CFG.segmentDeg, best = 0, bestDiff = Infinity;
      ITEMS.forEach(function (_, i) {
        var want = -segAngle(i), t = want + Math.round((aim - want) / 360) * 360;
        if (Math.abs(t - aim) < bestDiff) { bestDiff = Math.abs(t - aim); best = i; }
      });
      select(best);
    }
    svg.addEventListener('pointerup', function (e) { endDrag(e, false); });
    svg.addEventListener('pointercancel', function (e) { endDrag(e, true); });

    segLayer.addEventListener('keydown', function (e) {
      var k = e.key, next = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') next = index + 1;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') next = index - 1;
      else if (k === 'Home') next = 0;
      else if (k === 'End') next = ITEMS.length - 1;
      else if (k === 'Enter' || k === ' ') {
        var t = e.target.closest && e.target.closest('.wheel__slice');
        if (t) next = Number(t.getAttribute('data-index'));
      }
      if (next === null) return;
      e.preventDefault(); select(next); segs[index].g.focus();
    });

    root.querySelectorAll('[data-nav]').forEach(function (b) {
      b.addEventListener('click', function () { select(index + (b.getAttribute('data-nav') === 'next' ? 1 : -1)); });
    });

    /* Demo: nichts wird gespeichert. Das sagt der Knopf auch, statt stumm zu bleiben. */
    root.querySelectorAll('[data-fill]').forEach(function (b) {
      b.addEventListener('click', function () {
        var note = b.parentElement.querySelector('[data-fill-note]');
        if (note) note.textContent = 'Nur diese Vorschau. Kein Versand, keine Speicherung.';
      });
    });

    reduced.addEventListener('change', function () { applyRotation(false); });
    select(0, false);
    root.classList.add('is-ready');
  }

  function init() { document.querySelectorAll('[data-personal-wheel]').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
