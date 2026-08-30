/* ============================================================
   Persönliches Rad, elanum
   Navigationsinstrument, kein Chart.

   Trennung, die alles trägt:
     geometryNodes  = 12   die Klangsignatur bestimmt die Form
     navigationItems = 9   die Inhalte sind Positionen entlang dieser Form

   Die 9 Inhalte blasen die 12 Knoten nicht auf. Wer den Inhalt ändert,
   ändert ITEMS. Wer die Signatur ändert, ändert CFG.radii.
   ============================================================ */
(function () {
  'use strict';

  var CFG = {
    cx: 160, cy: 160,
    rCenter: 68,     // Ich, negativer Raum
    rInner: 92,      // innere Referenzspur, trägt die Gruppenrhythmik
    rSig: 112,       // Klangsignatur
    rNode: 132,      // Interaktionspunkte
    rTouch: 25,      // Trefferzone, ergibt bei 320px Viewport 45px, also über dem Minimum
    geometryNodes: 12,
    gapDeg: 30,      // die Öffnung, Autonomie und Entwicklung
    gapCenter: 180,  // im Radraum auf 6 Uhr, dreht mit
    slot: 34,        // Grad je Navigationsposition
    groupGap: 12,    // zusätzlicher Abstand zwischen den drei Gruppen
    groupMark: 44,   // Länge des Gruppenstrichs in Grad, deutlich kürzer als die Gruppe
    echoOffset: 3,   // Versatz des Echos in Nutzereinheiten
    // Die persönliche Signatur. Zwölf Radien, leicht ungleich,
    // daraus entsteht die charakteristische Asymmetrie.
    radii: [.84, .91, .88, .96, .82, .90, .93, .86, .97, .89, .83, .92],
    duration: 560,   // Rotation, ruhiges Ausklingen ohne Nachschwingen
    startIndex: 4    // Ruhezustand: Gap auf 6 Uhr, Persönlichkeit an der Leseposition
  };

  var ITEMS = [
    { id: 'astrology',    group: 'grundtoene',  label: 'Astrologie' },
    { id: 'numerology',   group: 'grundtoene',  label: 'Numerologie' },
    { id: 'human-design', group: 'grundtoene',  label: 'Human Design' },
    { id: 'direction',    group: 'orientation', label: 'Lebensrichtung' },
    { id: 'personality',  group: 'orientation', label: 'Persönlichkeit' },
    { id: 'values',       group: 'orientation', label: 'Werte' },
    { id: 'attachment',   group: 'connection',  label: 'Bindungsstil' },
    { id: 'closeness',    group: 'connection',  label: 'Nähe und Zuneigung' },
    { id: 'conflict',     group: 'connection',  label: 'Konfliktstil' }
  ];

  var GROUPS = {
    grundtoene:  'Grundtöne',
    orientation: 'Ich und Orientierung',
    connection:  'Beziehung und Verbindung'
  };

  var SVGNS = 'http://www.w3.org/2000/svg';
  var TAU = Math.PI / 180;

  function norm(d) { return ((d % 360) + 360) % 360; }
  function r2(n) { return Math.round(n * 100) / 100; }
  function point(r, a) { return [CFG.cx + r * Math.sin(a * TAU), CFG.cy - r * Math.cos(a * TAU)]; }

  /* Sichtbarer Bogen: beginnt hinter dem Gap, läuft 330 Grad im Uhrzeigersinn. */
  var ARC_START = CFG.gapCenter + CFG.gapDeg / 2;
  var ARC_SPAN = 360 - CFG.gapDeg;

  /* Die neun Navigationswinkel. Drei Gruppen, dazwischen ein kleiner Abstand,
     der die Markenidee Gap noch einmal aufgreift, ohne den grossen zu schwächen. */
  function itemAngles() {
    var out = [], cur = ARC_START, i;
    for (i = 0; i < ITEMS.length; i++) {
      if (i > 0 && i % 3 === 0) cur += CFG.groupGap;
      out.push(norm(cur + CFG.slot / 2));
      cur += CFG.slot;
    }
    return out;
  }

  /* Catmull-Rom durch die Stützpunkte, als offene Kette kubischer Béziers.
     Offen, nicht geschlossen: der Gap ist Teil der Signatur. */
  function smoothPath(pts) {
    var d = 'M' + r2(pts[0][0]) + ' ' + r2(pts[0][1]), i, p0, p1, p2, p3, c1, c2;
    for (i = 0; i < pts.length - 1; i++) {
      p0 = pts[i - 1] || pts[i];
      p1 = pts[i];
      p2 = pts[i + 1];
      p3 = pts[i + 2] || p2;
      c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += 'C' + r2(c1[0]) + ' ' + r2(c1[1]) + ',' + r2(c2[0]) + ' ' + r2(c2[1]) +
           ',' + r2(p2[0]) + ' ' + r2(p2[1]);
    }
    return d;
  }

  /* Die Radienfaktoren werden auf Mittel 1 normiert. Damit liegt die Signatur
     wirklich um rSig herum, und die Interaktionspunkte auf rNode sitzen dicht
     an ihr statt in einem leeren Ring darum. Die Asymmetrie bleibt erhalten. */
  var RADII_MEAN = CFG.radii.reduce(function (a, b) { return a + b; }, 0) / CFG.radii.length;
  function sigFactor(i) { return CFG.radii[i] / RADII_MEAN; }

  function signaturePoints(offset) {
    var pts = [], i, a;
    for (i = 0; i < CFG.geometryNodes; i++) {
      a = ARC_START + i * (ARC_SPAN / (CFG.geometryNodes - 1));
      pts.push(point(CFG.rSig * sigFactor(i) + (offset || 0), a));
    }
    return pts;
  }

  /* Radius der Signatur an einem beliebigen Winkel, damit die aktive Spur
     wirklich auf der Signatur liegt und nicht daneben. */
  function sigRadius(angle) {
    var rel = Math.max(0, Math.min(ARC_SPAN, norm(angle - ARC_START)));
    var step = ARC_SPAN / (CFG.geometryNodes - 1);
    var t = rel / step;
    var i = Math.max(0, Math.min(CFG.geometryNodes - 2, Math.floor(t)));
    var u = t - i, R = CFG.radii;
    var p0 = i > 0 ? sigFactor(i - 1) : sigFactor(i);
    var p1 = sigFactor(i), p2 = sigFactor(i + 1);
    var p3 = i + 2 < R.length ? sigFactor(i + 2) : p2;
    var v = 0.5 * ((2 * p1) + (-p0 + p2) * u +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u +
            (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
    return CFG.rSig * v;
  }

  /* Kurzer Abschnitt der Signatur um den aktiven Winkel. Nur hier darf
     das Spektrum auftauchen, nie als kompletter Kreis. */
  function activePath(angle) {
    var half = CFG.slot / 2, d = '', a, p, first = true;
    for (a = angle - half; a <= angle + half + 0.01; a += 2) {
      p = point(sigRadius(a), a);
      d += (first ? 'M' : 'L') + r2(p[0]) + ' ' + r2(p[1]);
      first = false;
    }
    return d;
  }

  function arcPath(r, a0, a1) {
    var p0 = point(r, a0), p1 = point(r, a1);
    var large = norm(a1 - a0) > 180 ? 1 : 0;
    return 'M' + r2(p0[0]) + ' ' + r2(p0[1]) +
           'A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + r2(p1[0]) + ' ' + r2(p1[1]);
  }

  function el(name, attrs) {
    var n = document.createElementNS(SVGNS, name), k;
    for (k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    return n;
  }

  function build(root) {
    var svg = root.querySelector('.wheel-svg');
    var rotors = root.querySelectorAll('[data-rotor]');
    var rotor = rotors[0];
    var groupLayer = root.querySelector('.wheel-groups');
    var hitLayer = root.querySelector('.wheel-hitareas');
    var traceMain = root.querySelector('.trace-main');
    var traceEcho = root.querySelector('.trace-echo');
    var traceActive = root.querySelector('.trace-active');
    var readerLabel = root.querySelector('.wheel-reader__label');
    var readerLead = root.querySelector('.wheel-reader__lead');
    var readerGroup = root.querySelector('.wheel-reader__group');
    var panels = root.querySelectorAll('[data-panel]');
    var prevBtn = root.querySelector('[data-nav="prev"]');
    var nextBtn = root.querySelector('[data-nav="next"]');
    if (!svg || !rotor) return;

    var angles = itemAngles();
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* Ebene 1 bleibt unsichtbar. Sie ist reine Konstruktionsgeometrie:
       ARC_START, ARC_SPAN und rInner tragen die Gruppenrhythmik darunter.
       Ein zweiter sichtbarer Ring würde als eigene Form gelesen. */

    /* Ebene 3b, die drei Gruppen als leise Rhythmusabschnitte,
       nicht als drei farbige Tortenstücke. */
    ['grundtoene', 'orientation', 'connection'].forEach(function (g, gi) {
      var a0 = ARC_START + gi * (3 * CFG.slot + CFG.groupGap);
      var mid = a0 + 1.5 * CFG.slot;
      // Kurzer Strich in der Mitte der Gruppe, nicht die ganze Gruppenbreite.
      // Drei fast geschlossene Bögen würden als zweiter Ring gelesen.
      groupLayer.appendChild(el('path', {
        class: 'wheel-group-mark',
        'data-group': g,
        d: arcPath(CFG.rInner, mid - CFG.groupMark / 2, mid + CFG.groupMark / 2)
      }));
    });

    /* Ebene 2, die persönliche Klangsignatur, plus ihr Echo. */
    traceMain.setAttribute('d', smoothPath(signaturePoints(0)));
    traceEcho.setAttribute('d', smoothPath(signaturePoints(CFG.echoOffset)));

    /* Ebene 3, die neun Positionen. Punkt sichtbar, Trefferzone gross. */
    var tabs = angles.map(function (a, i) {
      var item = ITEMS[i], p = point(CFG.rNode, a);
      var g = el('g', {
        class: 'wheel-hit',
        role: 'tab',
        tabindex: '-1',
        'aria-selected': 'false',
        'aria-label': item.label,
        'aria-controls': 'panel-' + item.id,
        id: 'tab-' + item.id,
        'data-index': i
      });
      g.appendChild(el('circle', { class: 'hit-zone', cx: r2(p[0]), cy: r2(p[1]), r: CFG.rTouch }));
      g.appendChild(el('circle', { class: 'hit-ring', cx: r2(p[0]), cy: r2(p[1]), r: 9 }));
      g.appendChild(el('circle', { class: 'hit-dot',  cx: r2(p[0]), cy: r2(p[1]), r: 2.6 }));
      hitLayer.appendChild(g);
      return g;
    });

    /* Zeichenlängen für den Line-Draw, gemessen statt geschätzt. */
    [traceMain, traceEcho].forEach(function (p) {
      p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 1);
    });

    var index = -1;
    var rotation = -angles[CFG.startIndex];   // fortlaufend, nie modulo, sonst dreht es die weite Runde

    function applyRotation(animate) {
      Array.prototype.forEach.call(rotors, function (g) {
        g.classList.toggle('is-dragging', !animate);
        g.style.transform = 'rotate(' + rotation + 'deg)';
      });
    }

    /* Die Rotation, die ein Element an die Leseposition bringt, in der
       Umdrehung, die dem aktuellen Stand am nächsten liegt. */
    function targetFor(i) {
      var desired = -angles[i];
      return desired + Math.round((rotation - desired) / 360) * 360;
    }

    function select(i, animate) {
      i = ((i % ITEMS.length) + ITEMS.length) % ITEMS.length;
      var item = ITEMS[i];
      if (i !== index) {
        index = i;
        traceActive.setAttribute('d', activePath(angles[i]));
        tabs.forEach(function (t, k) {
          t.setAttribute('aria-selected', k === i ? 'true' : 'false');
          t.setAttribute('tabindex', k === i ? '0' : '-1');
          t.classList.toggle('is-active', k === i);
        });
        readerGroup.textContent = GROUPS[item.group];
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
      drag = {
        startPointer: pointerAngle(e),
        startRotation: rotation,
        last: pointerAngle(e),
        lastTime: e.timeStamp,
        velocity: 0,
        moved: 0,
        target: e.target.closest ? e.target.closest('.wheel-hit') : null
      };
      svg.setPointerCapture(e.pointerId);
    });

    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var a = pointerAngle(e);
      var delta = a - drag.last;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      var dt = Math.max(1, e.timeStamp - drag.lastTime);
      drag.velocity = delta / dt;
      drag.last = a;
      drag.lastTime = e.timeStamp;
      drag.moved += Math.abs(delta);
      if (drag.moved > 2) {
        rotation += delta;
        applyRotation(false);
      }
    });

    function endDrag(e) {
      if (!drag) return;
      var d = drag;
      drag = null;
      if (svg.hasPointerCapture && svg.hasPointerCapture(e.pointerId)) {
        svg.releasePointerCapture(e.pointerId);
      }
      if (d.moved <= 2) {                       // Tap
        if (d.target) select(Number(d.target.getAttribute('data-index')));
        else applyRotation(true);
        return;
      }
      // Kurzer Impuls trägt höchstens zwei Positionen weit.
      var impulse = 0;
      if (Math.abs(d.velocity) > 0.35) {
        impulse = Math.sign(d.velocity) * Math.min(2, Math.round(Math.abs(d.velocity) * 3));
      }
      var best = 0, bestDiff = Infinity;
      angles.forEach(function (a, i) {
        var t = -a + Math.round((rotation + impulse * CFG.slot + a) / 360) * 360;
        var diff = Math.abs(t - (rotation + impulse * CFG.slot));
        if (diff < bestDiff) { bestDiff = diff; best = i; }
      });
      select(best);
    }
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);

    /* Tastatur: das Rad ist Navigation, also muss es ohne Zeigegerät gehen. */
    hitLayer.addEventListener('keydown', function (e) {
      var k = e.key, next = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') next = index + 1;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') next = index - 1;
      else if (k === 'Home') next = 0;
      else if (k === 'End') next = ITEMS.length - 1;
      else if (k === 'Enter' || k === ' ') {
        var t = e.target.closest && e.target.closest('.wheel-hit');
        if (t) { next = Number(t.getAttribute('data-index')); }
      }
      if (next === null) return;
      e.preventDefault();
      select(next);
      tabs[index].focus();
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { select(index - 1); tabs[index].focus(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { select(index + 1); tabs[index].focus(); });

    select(CFG.startIndex, false);
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
