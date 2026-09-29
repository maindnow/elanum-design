/* ============================================================
   ELANUM, persönliches Rad im Bereich Ich
   Gestaltet nach Gestaltungsatlas 4.4, mobile-first.

   VERBINDLICHE GEOMETRIE
   Die Silhouette ist jederzeit ein mathematisch perfekter Kreis. Neun gleich
   grosse Segmente à exakt 40 Grad, darüber ein Ring aus drei Abschnitten à
   120 Grad, jeweils an drei Segmente gekoppelt. Alle Bögen teilen denselben
   Mittelpunkt. Alle Pfade werden aus Polarkoordinaten berechnet.

   Aus 4.4 übernommen:
   - Licht von links oben: Scheibe und Zentrum sind erhabene HTML-Flächen
     mit dem Relief-Schatten aus relief.css. Sie drehen nicht mit, weil das
     Licht nicht mitdreht.
   - Neun Feldfarben in drei Familien, als Tönung, nie als satte Fläche.
   - Offener Kreis heisst offen: "Die Öffnung zeigt, was nicht abgeschlossen ist."
   - Auswahl nie nur über Farbe oder Schatten: Bogen, Gewicht, Text und
     aria-selected tragen dieselbe Information.
   ============================================================ */
(function () {
  'use strict';

  var CFG = {
    size: 320,
    cx: 160, cy: 160,
    centerRadius: 30,       // Zentrum "Ich", liegt über den Spitzen der Segmente
    segmentRadius: 114,     // Aussenradius aller neun Segmente, für alle gleich
    markerRadius: 43,       // Ausfüllstatus: neun Punkte als Kranz direkt um "Ich"
    groupInner: 125,        // bewusster Abstand zum Segmentkreis
    groupOuter: 149,
    labelRadius: 82,        // Name und Ergebnis; weit genug aussen, damit auch die innerste Zeile oben ins Stück passt
    labelLine: 10.5,        // Zeilenabstand der Namen
    resultGap: 3.5,         // zusätzliche Luft vor dem Ergebnis
    segmentDeg: 40,         // 360 / 9, exakt
    groupGapDeg: 4,         // grosse Abstände trennen Gruppen (4.4)
    activeInsetDeg: 3,      // Auswahlbogen etwas kürzer als das Segment
    hoverShift: 2           // radiale Anhebung bei Hover, nur mit feinem Zeiger
  };

  /* Feldfarben in der Reihenfolge des 4.4-Feldpalette: A kühl, B warm, C Erde. */
  var GROUPS = [
    { id: 'grundtoene',  label: 'Grundtöne',              family: 'A' },
    { id: 'orientation', label: 'Ich & Orientierung',     family: 'B' },
    { id: 'connection',  label: 'Beziehung & Verbindung', family: 'C' }
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

  function build(root) {
    var svg = root.querySelector('.wheel__svg');
    var rotor = root.querySelector('.wheel__rotor');
    var defs = svg.querySelector('defs');
    var ringLayer = root.querySelector('.wheel__ring');
    var ringLabels = root.querySelector('.wheel__ring-labels');
    var segLayer = root.querySelector('.wheel__segments');
    var labelLayer = root.querySelector('.wheel__labels');
    var activeArc = root.querySelector('.wheel__active');
    var track = root.querySelector('.wheel__track');
    var plate = root.querySelector('.wheel__plate');
    var center = root.querySelector('.wheel__center');
    var readerGroup = root.querySelector('[data-reader-group]');
    var readerName = root.querySelector('[data-reader-name]');
    var readerLead = root.querySelector('[data-reader-lead]');
    var panels = root.querySelectorAll('[data-panel]');
    var progress = root.querySelector('[data-progress]');
    if (!svg || !rotor) return;

    var half = CFG.segmentDeg / 2;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* Rille, Scheibe und Zentrum als HTML-Flächen, damit die Relief-Schatten
       aus 4.4 exakt gelten. Grösse aus derselben Geometrie wie das SVG. */
    [[track, CFG.groupOuter], [plate, CFG.segmentRadius], [center, CFG.centerRadius]].forEach(function (p) {
      if (!p[0]) return;
      p[0].style.left = p[0].style.top = pct(CFG.cx - p[1]);
      p[0].style.width = p[0].style.height = pct(2 * p[1]);
    });

    function panelOf(id) { return root.querySelector('[data-panel="' + id + '"]'); }
    function isDone(id) { var p = panelOf(id); return !!p && p.getAttribute('data-done') === 'true'; }
    function resultOf(id) { var p = panelOf(id); return p ? (p.getAttribute('data-result') || '') : ''; }

    /* Ring: drei Abschnitte à 120 Grad, an je drei Segmente gekoppelt. */
    var rMid = (CFG.groupInner + CFG.groupOuter) / 2, tracks = [];
    GROUPS.forEach(function (g, gi) {
      var a0 = segAngle(gi * 3) - half + CFG.groupGapDeg / 2;
      var a1 = segAngle(gi * 3 + 2) + half - CFG.groupGapDeg / 2;
      var band = el('path', { class: 'wheel__band', 'data-group': g.id, d: ringPath(a0, a1, CFG.groupInner, CFG.groupOuter) });
      band.style.setProperty('--field', 'var(--elanum-' + ITEMS[gi * 3 + 1].color + ')');
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
    var segs = ITEMS.map(function (item, i) {
      var a = segAngle(i), done = isDone(item.id), result = done ? resultOf(item.id) : '';
      var field = 'var(--elanum-' + item.color + ')';
      var status = done ? 'ausgefüllt: ' + result : 'noch offen';
      var g = el('g', {
        class: 'wheel__slice' + (done ? ' is-done' : ''), role: 'tab', tabindex: '-1',
        'aria-selected': 'false', 'aria-label': item.label + ', ' + status,
        'aria-controls': 'panel-' + item.id, id: 'tab-' + item.id, 'data-index': i
      });
      g.style.setProperty('--field', field);
      var face = el('path', { class: 'wheel__face', d: sectorPath(a - half, a + half, CFG.segmentRadius) });
      face.style.setProperty('--ox', r2(CFG.hoverShift * Math.sin(a * TAU)) + 'px');
      face.style.setProperty('--oy', r2(-CFG.hoverShift * Math.cos(a * TAU)) + 'px');
      g.appendChild(face);
      var m = pt(CFG.markerRadius, a);
      g.appendChild(el('circle', { class: 'wheel__marker', cx: m[0], cy: m[1], r: 3.4 }));
      segLayer.appendChild(g);

      /* Name in Albert Sans, Ergebnis in Yrsa. Drehen gegen, bleiben aufrecht. */
      var p = pt(CFG.labelRadius, a);
      var text = el('text', { class: 'wheel__label' + (done ? ' is-done' : ''), x: p[0], y: p[1],
                              'text-anchor': 'middle', 'aria-hidden': 'true' });
      text.style.setProperty('--field', field);
      var rows = item.lines.length + (result ? 1 : 0);
      var top = -(rows - 1) * CFG.labelLine / 2 + (result ? -CFG.resultGap / 2 : 0);
      item.lines.forEach(function (line, li) {
        var t = el('tspan', { x: p[0], y: r2(p[1] + top + li * CFG.labelLine), 'dominant-baseline': 'central' });
        t.textContent = line; text.appendChild(t);
      });
      if (result) {
        var rs = el('tspan', { class: 'wheel__result', x: p[0], 'dominant-baseline': 'central',
                               y: r2(p[1] + top + item.lines.length * CFG.labelLine + CFG.resultGap) });
        rs.textContent = result; text.appendChild(rs);
      }
      labelLayer.appendChild(text);
      return { g: g, label: text, done: done };
    });

    if (progress) {
      var n = segs.filter(function (s) { return s.done; }).length;
      progress.textContent = n + ' von ' + ITEMS.length + ' ausgefüllt';
    }

    var index = -1, rotation = 0;
    function applyRotation(animate) {
      rotor.classList.toggle('is-still', !animate);
      rotor.style.transform = 'rotate(' + rotation + 'deg)';
      segs.forEach(function (s) {
        s.label.classList.toggle('is-still', !animate);
        s.label.style.transform = 'rotate(' + (-rotation) + 'deg)';
      });
      tracks.forEach(function (t) {
        var onScreen = norm(t.center + rotation);
        t.path.setAttribute('href', '#track-' + t.id + (onScreen > 90 && onScreen < 270 ? '-flip' : ''));
      });
    }
    function targetFor(i) {
      var want = -segAngle(i);
      return want + Math.round((rotation - want) / 360) * 360;
    }

    function select(i, animate) {
      i = ((i % ITEMS.length) + ITEMS.length) % ITEMS.length;
      var item = ITEMS[i], a = segAngle(i);
      if (i !== index) {
        index = i;
        activeArc.setAttribute('d', arcPath(CFG.segmentRadius, a - half + CFG.activeInsetDeg, a + half - CFG.activeInsetDeg));
        activeArc.style.setProperty('--field', 'var(--elanum-' + item.color + ')');
        segs.forEach(function (s, k) {
          s.g.setAttribute('aria-selected', String(k === i));
          s.g.setAttribute('tabindex', k === i ? '0' : '-1');
          s.g.classList.toggle('is-active', k === i);
          s.label.classList.toggle('is-active', k === i);
        });
        Array.prototype.forEach.call(ringLayer.children, function (b) {
          b.classList.toggle('is-active', b.getAttribute('data-group') === item.group);
        });
        Array.prototype.forEach.call(ringLabels.children, function (t) {
          t.classList.toggle('is-active', t.getAttribute('data-group') === item.group);
        });
        readerGroup.textContent = groupOf(item.group).label;
        readerGroup.style.setProperty('--field', 'var(--elanum-' + item.color + ')');
        readerName.textContent = item.label;
        Array.prototype.forEach.call(panels, function (p) {
          var on = p.getAttribute('data-panel') === item.id;
          p.hidden = !on;
          if (on) readerLead.textContent = p.getAttribute('data-lead') || '';
        });
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
