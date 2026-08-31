/* ============================================================
   Persönliches Rad, elanum

   VERBINDLICHE GEOMETRIE, nicht verhandelbar:
   Die äussere Silhouette ist jederzeit ein mathematisch perfekter Kreis.
   Neun gleich grosse radiale Kuchenstücke à exakt 40 Grad. Je drei
   aufeinanderfolgende Stücke werden durch einen konzentrischen äusseren
   Ringabschnitt à 120 Grad zu einer Oberkategorie zusammengefasst.
   Alle Kreisbögen teilen denselben Mittelpunkt.

   Keine Bézier-Verformung. Keine variierenden Radien. Keine asymmetrische
   Aussenkontur. Alle Pfade werden aus Polarkoordinaten berechnet, keiner
   wird von Hand gezeichnet.

   Trace, Echo und Spectrum sind ausschliesslich sekundäre visuelle Effekte
   entlang dieser festen Kreisgeometrie. Kreis und Segmente sind die
   Informationsarchitektur, SoulResonance ist die Sprache darüber.
   ============================================================ */
(function () {
  'use strict';

  var CFG = {
    cx: 160, cy: 160,
    centerRadius: 32,        // Zentrum, liegt über den Spitzen der Kuchenstücke
    segmentRadius: 112,      // Aussenradius aller neun Stücke, für alle gleich
    markerRadius: 99,        // Ausfüllstatus, innerhalb des eigenen Stücks
    groupInnerRadius: 124,   // bewusster Gap von 12 Einheiten zum Segmentkreis
    groupOuterRadius: 148,
    labelRadius: 68,         // volle Bezeichnung, zweizeilig, in der Mitte des Stücks
    segmentDeg: 40,          // 360 / 9, exakt
    groupGapDeg: 4,          // Trennung zwischen den drei Ringabschnitten
    edgeInsetDeg: 1.5,       // Spektralkante etwas kürzer als das Stück
    echoOffset: 5,           // Echo, fünf Einheiten ausserhalb der Kante, im Gap zum Ring
    labelLine: 9,            // Zeilenabstand der Beschriftung
    hoverShift: 3,           // radiale Anhebung beim Hover
    duration: 560            // Rotation, ruhiges Ausklingen ohne Nachschwingen
  };

  /* Im Uhrzeigersinn, beginnend an der Leseposition oben.
     short bleibt kurz genug, um im Stück lesbar zu sein. */
  var ITEMS = [
    { id: 'astrology',    group: 'grundtoene',  label: 'Astrologie',       lines: ['Astro-', 'logie'] },
    { id: 'numerology',   group: 'grundtoene',  label: 'Numerologie',      lines: ['Numero-', 'logie'] },
    { id: 'human-design', group: 'grundtoene',  label: 'Human Design',     lines: ['Human', 'Design'] },
    { id: 'direction',    group: 'orientation', label: 'Lebensrichtung',   lines: ['Lebens-', 'richtung'] },
    { id: 'personality',  group: 'orientation', label: 'Persönlichkeit',   lines: ['Persön-', 'lichkeit'] },
    { id: 'values',       group: 'orientation', label: 'Werte',            lines: ['Werte'] },
    { id: 'attachment',   group: 'connection',  label: 'Bindungsstil',     lines: ['Bindungs-', 'stil'] },
    { id: 'closeness',    group: 'connection',  label: 'Nähe & Zuneigung', lines: ['Nähe &', 'Zuneigung'] },
    { id: 'conflict',     group: 'connection',  label: 'Konfliktstil',     lines: ['Konflikt-', 'stil'] }
  ];

  /* Je Kategorie eine Resonanzfarbe, entnommen aus dem Spektrum in seiner
     festen Reihenfolge: Violet, Blue, Rose. Keine neuen Farben. */
  var GROUPS = [
    { id: 'grundtoene',  label: 'Grundtöne',              color: '#6756D9' },
    { id: 'orientation', label: 'Ich & Orientierung',     color: '#4D7FE8' },
    { id: 'connection',  label: 'Beziehung & Verbindung', color: '#D85BA9' }
  ];
  function groupOf(id) {
    return GROUPS.filter(function (g) { return g.id === id; })[0];
  }

  var SVGNS = 'http://www.w3.org/2000/svg';
  var TAU = Math.PI / 180;

  function r2(n) { return Math.round(n * 100) / 100; }
  /* Polarkoordinate. Winkel 0 ist oben, positiv im Uhrzeigersinn. */
  function pt(r, a) {
    return [r2(CFG.cx + r * Math.sin(a * TAU)), r2(CFG.cy - r * Math.cos(a * TAU))];
  }

  /* Mittelwinkel des Stücks i. Stück 1 sitzt bei 0 Grad, also an der Leseposition. */
  function segmentAngle(i) { return i * CFG.segmentDeg; }

  /* Kuchenstück: von der Mitte zum Aussenradius, ein Kreisbogen dazwischen. */
  function sectorPath(a0, a1, ro) {
    var o0 = pt(ro, a0), o1 = pt(ro, a1);
    var large = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + CFG.cx + ' ' + CFG.cy +
           ' L' + o0[0] + ' ' + o0[1] +
           ' A' + ro + ' ' + ro + ' 0 ' + large + ' 1 ' + o1[0] + ' ' + o1[1] + ' Z';
  }

  /* Ringabschnitt: zwei konzentrische Bögen, radial geschlossen. */
  function ringPath(a0, a1, ri, ro) {
    var o0 = pt(ro, a0), o1 = pt(ro, a1), i1 = pt(ri, a1), i0 = pt(ri, a0);
    var large = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + o0[0] + ' ' + o0[1] +
           ' A' + ro + ' ' + ro + ' 0 ' + large + ' 1 ' + o1[0] + ' ' + o1[1] +
           ' L' + i1[0] + ' ' + i1[1] +
           ' A' + ri + ' ' + ri + ' 0 ' + large + ' 0 ' + i0[0] + ' ' + i0[1] + ' Z';
  }

  /* Reiner Kreisbogen, für Spektralkante und Echo. */
  function arcPath(r, a0, a1) {
    var p0 = pt(r, a0), p1 = pt(r, a1);
    var large = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + p0[0] + ' ' + p0[1] +
           ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + p1[0] + ' ' + p1[1];
  }

  /* Derselbe Bogen rückwärts. Text darauf liest von aussen betrachtet
     richtig herum, wenn der Abschnitt in der unteren Hälfte steht. */
  function arcPathRev(r, a1, a0) {
    var p1 = pt(r, a1), p0 = pt(r, a0);
    var large = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + p1[0] + ' ' + p1[1] +
           ' A' + r + ' ' + r + ' 0 ' + large + ' 0 ' + p0[0] + ' ' + p0[1];
  }

  function el(name, attrs) {
    var n = document.createElementNS(SVGNS, name), k;
    for (k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    return n;
  }

  function build(root) {
    var svg = root.querySelector('.wheel-svg');
    var rotor = root.querySelector('[data-rotor]');
    var groupLayer = root.querySelector('.wheel-groups');
    var groupLabelLayer = root.querySelector('.wheel-group-labels');
    var groupTracks = [];
    var segLayer = root.querySelector('.wheel-segments');
    var labelLayer = root.querySelector('.wheel-labels');
    var edge = root.querySelector('.segment-edge');
    var echo = root.querySelector('.segment-echo');
    var readerLabel = root.querySelector('.wheel-reader__label');
    var readerLead = root.querySelector('.wheel-reader__lead');
    var readerGroup = root.querySelector('.wheel-reader__group');
    var panels = root.querySelectorAll('[data-panel]');
    var prevBtn = root.querySelector('[data-nav="prev"]');
    var nextBtn = root.querySelector('[data-nav="next"]');
    if (!svg || !rotor) return;

    var half = CFG.segmentDeg / 2;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* Äusserer Ring: drei Abschnitte à 120 Grad, geometrisch an je drei
       innere Stücke gekoppelt, nicht frei gestaltet. */
    var defs = svg.querySelector('defs');
    var rMid = (CFG.groupInnerRadius + CFG.groupOuterRadius) / 2;

    GROUPS.forEach(function (g, gi) {
      var a0 = segmentAngle(gi * 3) - half + CFG.groupGapDeg / 2;
      var a1 = segmentAngle(gi * 3 + 2) + half - CFG.groupGapDeg / 2;
      var band = el('path', {
        class: 'wheel-group', 'data-group': g.id,
        d: ringPath(a0, a1, CFG.groupInnerRadius, CFG.groupOuterRadius)
      });
      band.style.setProperty('--cat', g.color);
      band.appendChild(el('title', {})).textContent = g.label;
      groupLayer.appendChild(band);

      /* Zwei Textbahnen auf demselben Ring. Welche gilt, entscheidet die
         aktuelle Lage des Abschnitts, damit die Beschriftung nie auf dem
         Kopf steht. Sie sitzt auf der Ringgeometrie, sie schwebt nicht. */
      defs.appendChild(el('path', {
        id: 'track-' + g.id, fill: 'none',
        d: arcPath(rMid, a0 + 3, a1 - 3)
      }));
      defs.appendChild(el('path', {
        id: 'track-' + g.id + '-flip', fill: 'none',
        d: arcPathRev(rMid, a1 - 3, a0 + 3)
      }));

      var text = el('text', { class: 'group-label', 'data-group': g.id, 'aria-hidden': 'true' });
      text.style.setProperty('--cat', g.color);
      var tp = el('textPath', {
        href: '#track-' + g.id, startOffset: '50%', 'text-anchor': 'middle'
      });
      tp.textContent = g.label;
      text.appendChild(tp);
      groupLabelLayer.appendChild(text);
      groupTracks.push({ id: g.id, center: segmentAngle(gi * 3 + 1), path: tp });
    });

    /* Neun Kuchenstücke. Alle mit demselben Aussenradius. */
    /* Der Ausfüllstatus steht im Markup, damit Inhalt und Zustand an einer
       Stelle gepflegt werden und die Seite auch ohne JavaScript stimmt. */
    function isDone(id) {
      var panel = root.querySelector('[data-panel="' + id + '"]');
      return !!panel && panel.getAttribute('data-done') === 'true';
    }

    /* Helle Grundfläche unter allen Stücken. Die Tönung der Kategorie liegt
       darüber, sonst verliert die Scheibe ihr gehobenes Papier. */
    segLayer.appendChild(el('circle', {
      class: 'wheel-plate', cx: CFG.cx, cy: CFG.cy, r: CFG.segmentRadius
    }));

    var segs = ITEMS.map(function (item, i) {
      var a = segmentAngle(i);
      var cat = groupOf(item.group).color;
      var done = isDone(item.id);
      var g = el('g', {
        class: 'wheel-segment' + (done ? ' is-done' : ''),
        role: 'tab', tabindex: '-1',
        'aria-selected': 'false',
        'aria-label': item.label + (done ? ', ausgefüllt' : ', noch offen'),
        'aria-controls': 'panel-' + item.id, id: 'tab-' + item.id, 'data-index': i
      });
      g.style.setProperty('--cat', cat);
      var face = el('path', {
        class: 'segment-face', 'data-id': item.id,
        d: sectorPath(a - half, a + half, CFG.segmentRadius)
      });
      /* Radiale Anhebung beim Hover, in Richtung des eigenen Mittelwinkels. */
      face.style.setProperty('--ox', r2(CFG.hoverShift * Math.sin(a * TAU)) + 'px');
      face.style.setProperty('--oy', r2(-CFG.hoverShift * Math.cos(a * TAU)) + 'px');
      g.appendChild(el('title', {})).textContent =
        item.label + (done ? ', ausgefüllt' : ', noch offen');
      g.appendChild(face);

      /* Ausgefüllt ist ein voller Punkt, offen ist ein offener Kreis.
         Die Öffnung ist die Gap-Sprache: noch nicht abgeschlossen. */
      var m = pt(CFG.markerRadius, a);
      g.appendChild(el('circle', {
        class: 'segment-marker', cx: m[0], cy: m[1], r: 3.2
      }));
      segLayer.appendChild(g);

      /* Volle Bezeichnung, zweizeilig, dreht gegen und bleibt aufrecht. */
      var p = pt(CFG.labelRadius, a);
      var text = el('text', {
        class: 'segment-label', x: p[0], y: p[1],
        'text-anchor': 'middle', 'aria-hidden': 'true', 'data-index': i
      });
      var top = -(item.lines.length - 1) * CFG.labelLine / 2;
      item.lines.forEach(function (line, li) {
        var tspan = el('tspan', { x: p[0], y: r2(p[1] + top + li * CFG.labelLine) });
        tspan.textContent = line;
        text.appendChild(tspan);
      });
      labelLayer.appendChild(text);
      return { g: g, face: face, label: text, angle: a, done: done };
    });

    /* Fortschritt, ohne erfundene Genauigkeit: schlicht gezählt. */
    var progress = root.querySelector('[data-progress]');
    if (progress) {
      var doneCount = segs.filter(function (s) { return s.done; }).length;
      progress.textContent = doneCount + ' von ' + ITEMS.length + ' ausgefüllt';
    }

    var index = -1;
    var rotation = 0;

    function applyRotation(animate) {
      rotor.classList.toggle('is-dragging', !animate);
      rotor.style.transform = 'rotate(' + rotation + 'deg)';
      /* Die Kurzbezeichnungen drehen gegen, damit sie immer aufrecht stehen. */
      segs.forEach(function (s) {
        s.label.classList.toggle('is-dragging', !animate);
        s.label.style.transform = 'rotate(' + (-rotation) + 'deg)';
      });
      /* Die Ringbeschriftung wechselt auf die rückwärts laufende Bahn,
         sobald ihr Abschnitt in die untere Hälfte wandert. */
      groupTracks.forEach(function (t) {
        var onScreen = ((t.center + rotation) % 360 + 360) % 360;
        var flip = onScreen > 90 && onScreen < 270;
        t.path.setAttribute('href', '#track-' + t.id + (flip ? '-flip' : ''));
      });
    }

    function targetFor(i) {
      var desired = -segmentAngle(i);
      return desired + Math.round((rotation - desired) / 360) * 360;
    }

    function select(i, animate) {
      i = ((i % ITEMS.length) + ITEMS.length) % ITEMS.length;
      var item = ITEMS[i];
      if (i !== index) {
        index = i;
        var a = segmentAngle(i), inset = CFG.edgeInsetDeg;
        /* Spectrum nur als Kante am Aussenbogen, nie als Fläche. */
        edge.setAttribute('d', arcPath(CFG.segmentRadius, a - half + inset, a + half - inset));
        /* Echo, dieselbe Bewegung, vier Einheiten weiter aussen. */
        echo.setAttribute('d', arcPath(CFG.segmentRadius + CFG.echoOffset,
                                       a - half + inset * 2, a + half - inset * 2));
        segs.forEach(function (s, k) {
          s.g.setAttribute('aria-selected', k === i ? 'true' : 'false');
          s.g.setAttribute('tabindex', k === i ? '0' : '-1');
          s.g.classList.toggle('is-active', k === i);
          s.label.classList.toggle('is-active', k === i);
        });
        /* Der äussere Ring ist an die Stücke gekoppelt, also schaltet er mit. */
        Array.prototype.forEach.call(groupLayer.children, function (g) {
          g.classList.toggle('is-active', g.getAttribute('data-group') === item.group);
        });
        Array.prototype.forEach.call(groupLabelLayer.children, function (g) {
          g.classList.toggle('is-active', g.getAttribute('data-group') === item.group);
        });
        readerGroup.textContent = (GROUPS.filter(function (g) {
          return g.id === item.group;
        })[0] || {}).label || '';
        readerLabel.textContent = item.label;
        Array.prototype.forEach.call(panels, function (p) {
          var on = p.getAttribute('data-panel') === item.id;
          p.hidden = !on;
          if (on) readerLead.textContent = p.getAttribute('data-lead') || '';
        });
      }
      rotation = targetFor(i);
      applyRotation(animate === false || reduced.matches ? false : true);
    }

    /* Drag: das Rad folgt dem Finger, beim Loslassen rastet es ein. */
    var drag = null;
    function pointerAngle(e) {
      var r = svg.getBoundingClientRect();
      return Math.atan2(e.clientX - (r.left + r.width / 2),
                        -(e.clientY - (r.top + r.height / 2))) / TAU;
    }

    svg.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      var a = pointerAngle(e);
      drag = {
        last: a, lastTime: e.timeStamp, velocity: 0, moved: 0,
        target: e.target.closest ? e.target.closest('.wheel-segment') : null
      };
      svg.setPointerCapture(e.pointerId);
    });

    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var a = pointerAngle(e), delta = a - drag.last;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      drag.velocity = delta / Math.max(1, e.timeStamp - drag.lastTime);
      drag.last = a;
      drag.lastTime = e.timeStamp;
      drag.moved += Math.abs(delta);
      if (drag.moved > 2) { rotation += delta; applyRotation(false); }
    });

    function endDrag(e) {
      if (!drag) return;
      var d = drag;
      drag = null;
      if (svg.hasPointerCapture && svg.hasPointerCapture(e.pointerId)) {
        svg.releasePointerCapture(e.pointerId);
      }
      if (d.moved <= 2) {
        if (d.target) select(Number(d.target.getAttribute('data-index')));
        else applyRotation(true);
        return;
      }
      /* Ein kurzer Impuls trägt höchstens zwei Stücke weit. */
      var impulse = Math.abs(d.velocity) > 0.35
        ? Math.sign(d.velocity) * Math.min(2, Math.round(Math.abs(d.velocity) * 3)) : 0;
      var aim = rotation + impulse * CFG.segmentDeg;
      var best = 0, bestDiff = Infinity;
      ITEMS.forEach(function (_, i) {
        var want = -segmentAngle(i);
        var t = want + Math.round((aim - want) / 360) * 360;
        var diff = Math.abs(t - aim);
        if (diff < bestDiff) { bestDiff = diff; best = i; }
      });
      select(best);
    }
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);

    segLayer.addEventListener('keydown', function (e) {
      var k = e.key, next = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') next = index + 1;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') next = index - 1;
      else if (k === 'Home') next = 0;
      else if (k === 'End') next = ITEMS.length - 1;
      else if (k === 'Enter' || k === ' ') {
        var t = e.target.closest && e.target.closest('.wheel-segment');
        if (t) next = Number(t.getAttribute('data-index'));
      }
      if (next === null) return;
      e.preventDefault();
      select(next);
      segs[index].g.focus();
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { select(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { select(index + 1); });

    select(0, false);
    root.classList.add('is-ready');
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.personal-wheel'), build);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
