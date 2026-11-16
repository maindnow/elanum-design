/* ============================================================
   ELANUM Umfeld
   "Ich" in der Mitte, Menschen als eigene, geschlossene Kreise darum.
   Abstand zeigt Nähe. Null bis drei Linien im Verlauf um die Person zeigen
   die Resonanz (wie im Beziehungsraum), keine Linie führt zur Mitte. Ohne
   aktive Resonanz bleibt nur der Abstand. Der Freiraum fehlt, das Umfeld
   kennt den Wert nicht.
   Der Winkel sagt die Art (KINDS: Partner, Familie, Freunde, Arbeit, im Uhrzeigersinn,
   die erste oben). Wer zusammengehört, steht beieinander. Ein feiner Bogen mit dem Wort
   der Art fasst jede Gruppe, wie die Bereiche des Resonanzrads. Das Wort misst am
   Bildschirm mindestens 15 px, das Bild baut sich bei Breitenwechsel neu auf.
   Aufbau: das Bild, darunter oder daneben ein einziges Panel (erhöhte Karte).
   Oben im Panel stehen die Pfeile mit dem Namen des gewählten Menschen (als
   Überschrift), direkt darunter im Lesebereich die Pillen für Nähe und
   Resonanz (die Art steht als erste Pille), die Notiz und der Knopf, alles zentriert. Jede Angabe steht nur
   einmal. Die Kreise im Bild sind Knöpfe, der Lesebereich lässt sich ziehen
   (Finger oder Maus), Kreis, Name und Lesebereich bleiben im Gleichschritt.
   Eine Liste gibt es nicht. Für Vorleser trägt das Panel die Rolle Karussell,
   und eine Live-Zeile sagt «Du & Name, Art, Nähe, Resonanz» an.
   Das Bild ist auf seinen Inhalt beschnitten (Rand 16 Einheiten),
   damit das Panel früh im Sichtfeld steht.

   Mobile-first: Unter 560 px Breite gilt das Hochformat. Neun Menschen waren dort bei 390 px zu eng
   (gemessen), darum steht über dem Bild eine Filterzeile: «Alle» ist die Übersicht, die Menschen
   stehen als kleine Punkte ohne Namen in ihren Gruppen (je Gruppe ein transparenter Knopf, Tipp wählt
   die Art). Eine Art zeigt nur ihre Menschen, gross und mit Namen, gleichmässig rund um «Ich», ohne
   Bögen. Der Filter folgt der Auswahl: Pfeile und Slider laufen durch alle Menschen, und wechselt man
   in eine andere Art, springt der Filter mit. Ab 560 px (wide) gibt es keinen Filter, das Bild zeigt
   alle mit Namen. Wird das Element breiter oder schmaler, baut sich das Bild neu auf, die Auswahl bleibt.

   API: ElanumUmfeld.mount(root, { link: 'pfad/zum/beziehungsraum/', heading: 'h3' })
        gibt { select(i), parts } zurück. select(i) wählt den Menschen i (läuft um).
        parts.people: je sichtbarem Menschen { index, person, disc, contour, rings, name (nur mit Namen), from, at, width },
        parts.groups: die Gruppen-Knöpfe der Übersicht, parts.view: 'wide', 'all' oder 'kind'.
   ============================================================ */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  /* ring: Abstand der Linien um die Person. In der Übersicht enger, damit sie im Bild bleiben.
     out: Radius der Bögen, fs0: Grundgrösse der Bogenwörter in Bildeinheiten, px0: Breite der Bühne, falls noch nicht messbar. */
  var LAYOUTS = {
    wide: { W: 760, H: 760, CX: 380, CY: 380, ME: 58, R: 40, base: 150, k: 1.15, edge: 340, ring: 7, out: 345, fs0: 17, px0: 640 },
    /* Übersicht auf dem Telefon: Menschen als kleine Punkte ohne Namen. */
    all: { W: 400, H: 400, CX: 200, CY: 200, ME: 38, R: 12, base: 92, k: 0.5, edge: 168, ring: 3, out: 172, fs0: 15, px0: 358 },
    /* Eine Art auf dem Telefon: gross, mit Namen, gleichmässig rund um «Ich», keine Bögen. */
    kind: { W: 400, H: 400, CX: 200, CY: 200, ME: 52, R: 44, base: 120, k: 0.8, edge: 200, ring: 6, out: 172, fs0: 15, px0: 358 }
  };
  /* Der Winkel sagt die Art. Die Reihenfolge der Arten läuft im Uhrzeigersinn, die erste steht oben. */
  var KINDS = ['Partner', 'Familie', 'Freunde', 'Arbeit'];
  var GAP = 16, MIN_WORD = 15;
  var PEOPLE = [
    { name: 'Mara', kind: 'Partner', proximity: 84, resonance: 86, note: 'Ihr teilt viel, ohne dasselbe zu brauchen.' },
    { name: 'Lea', kind: 'Familie', proximity: 24, resonance: 64, note: 'Weit weg im Alltag, trotzdem spürbar verbunden.' },
    { name: 'Tom', kind: 'Familie', proximity: 62, resonance: 30, note: 'Ihr seht euch oft. Die Verbindung ist leise.' },
    { name: 'Ana', kind: 'Familie', proximity: 80, resonance: 72, note: 'Sehr nah, und es schwingt spürbar.' },
    { name: 'Jonas', kind: 'Freunde', proximity: 52, resonance: 34, note: 'Ein ruhiger Kontakt. Die Verbindung ist leise, aber da.' },
    { name: 'Sam', kind: 'Freunde', proximity: 72, resonance: 0, note: 'Oft nah, im Moment ohne aktive Resonanz.' },
    { name: 'Nia', kind: 'Freunde', proximity: 38, resonance: 88, note: 'Selten da, und doch die stärkste Resonanz.' },
    { name: 'Ben', kind: 'Arbeit', proximity: 28, resonance: 20, note: 'Ihr arbeitet zusammen. Mehr ist es im Moment nicht.' },
    { name: 'Ida', kind: 'Arbeit', proximity: 58, resonance: 0, note: 'Nah im Alltag, ohne aktive Resonanz.' }
  ].sort(function (a, b) { return KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind); });
  function near(p) { return p.proximity < 34 ? 'weit' : p.proximity < 75 ? 'nah' : 'sehr nah'; }
  function res(p) { return p.resonance === 0 ? 'keine Resonanz' : p.resonance < 40 ? 'leise Resonanz' : p.resonance < 80 ? 'spürbare Resonanz' : 'starke Resonanz'; }
  function words(p) { return p.kind + ', ' + near(p) + ', ' + res(p); }
  function el(name, attrs) { var n = document.createElementNS(NS, name); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }

  var count = 0;
  function mount(root, opts) {
    opts = opts || {};
    var uid = 'uf' + (++count), heading = opts.heading || 'h2', link = opts.link || '../beziehungsraum/';
    root.classList.add('umfeld');
    var ARROW_PREV = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6"/></svg>';
    var ARROW_NEXT = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg>';
    root.innerHTML = '<div class="umfeld__stage"><div class="umfeld__filter segmented" role="group" aria-label="Gruppe wählen" hidden></div><div class="umfeld__scene"></div></div>' +
      '<div class="umfeld__panel" role="group" aria-roledescription="Karussell" aria-label="Menschen in deinem Umfeld">' +
        '<div class="umfeld__nav">' +
          '<button class="button button--secondary button--icon glow-edge" type="button" data-nav="prev" aria-label="Vorheriger Mensch">' + ARROW_PREV + '</button>' +
          '<' + heading + ' class="umfeld__current"></' + heading + '>' +
          '<button class="button button--secondary button--icon glow-edge" type="button" data-nav="next" aria-label="Nächster Mensch">' + ARROW_NEXT + '</button>' +
        '</div>' +
        '<div class="umfeld__reader">' +
          '<div class="umfeld__slides"></div>' +
        '</div>' +
        '<p class="umfeld__live" aria-live="polite"></p>' +
      '</div>';
    var stage = root.querySelector('.umfeld__scene'), filterBar = root.querySelector('.umfeld__filter'), slider = root.querySelector('.umfeld__slides');
    var current = root.querySelector('.umfeld__current'), live = root.querySelector('.umfeld__live');
    var selected = 0, layoutName = '', filter = 'all', api = { parts: {} };
    var calm = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };

    var slides = PEOPLE.map(function (p) {
      var href = link + '?person=' + encodeURIComponent(p.name) + '&proximity=' + p.proximity + '&resonance=' + p.resonance;
      var s = document.createElement('div');
      s.className = 'umfeld__slide'; s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', 'Folie');
      s.innerHTML = '<div class="umfeld__pills"><span class="element-chip umfeld__pill">' + p.kind + '</span>' +
        '<span class="element-chip umfeld__pill">' + near(p) + '</span>' +
        '<span class="element-chip area umfeld__pill">' + res(p) + '</span></div>' +
        '<p class="secondary">' + p.note + '</p>' +
        '<a class="button button--secondary glow-edge" href="' + href + '">Beziehungsraum öffnen <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/></svg></a>';
      slider.appendChild(s);
      return s;
    });
    slides.forEach(function (s, i) { s.setAttribute('aria-label', (i + 1) + ' von ' + PEOPLE.length); });
    root.querySelectorAll('[data-nav]').forEach(function (b) {
      b.addEventListener('click', function () { select(selected + (b.getAttribute('data-nav') === 'next' ? 1 : -1)); });
    });

    /* Abstand von Slide zu Slide (Breite eines Slides). */
    function pitch() { return slides[0].offsetWidth || slider.clientWidth; }
    function slideTo(i, smooth) {
      var left = i * pitch();
      if (Math.abs(slider.scrollLeft - left) < 1) return;
      slider.scrollTo({ left: left, behavior: smooth && !calm() ? 'smooth' : 'auto' });
    }
    /* Von Hand gescrollt: nach dem Einrasten den passenden Menschen wählen. */
    var settleTimer = 0, dragging = false;
    function settle() {
      clearTimeout(settleTimer);
      if (dragging) return;
      var w = pitch(); if (!w) return;
      var i = Math.max(0, Math.min(PEOPLE.length - 1, Math.round(slider.scrollLeft / w)));
      if (i !== selected) select(i, true);
    }
    slider.addEventListener('scroll', function () { clearTimeout(settleTimer); settleTimer = setTimeout(settle, 140); });
    slider.addEventListener('scrollend', settle);

    /* Ziehen mit der Maus. Berührung scrollt von selbst. */
    var drag = null, suppress = false;
    slider.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: slider.scrollLeft, moved: 0 };
    });
    document.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      drag.moved = Math.max(drag.moved, Math.abs(dx));
      if (!dragging && drag.moved > 6) { dragging = true; slider.classList.add('is-dragging'); }
      if (dragging) slider.scrollLeft = drag.left - dx;
    });
    function release() {
      if (!drag) return;
      var was = dragging; drag = null; dragging = false;
      slider.classList.remove('is-dragging');
      if (was) {
        suppress = true; setTimeout(function () { suppress = false; }, 0);
        var i = Math.max(0, Math.min(PEOPLE.length - 1, Math.round(slider.scrollLeft / pitch())));
        if (i !== selected) select(i); else slideTo(i, true);
      }
    }
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
    slider.addEventListener('click', function (e) { if (suppress) { e.preventDefault(); e.stopPropagation(); } }, true);
    slider.addEventListener('dragstart', function (e) { e.preventDefault(); });

    /* Filterzeile (nur im Hochformat): «Alle» und je eine vorhandene Art. */
    var KINDS_IN = KINDS.filter(function (k) { return PEOPLE.some(function (p) { return p.kind === k; }); });
    var filterButtons = ['Alle'].concat(KINDS_IN).map(function (label) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = label;
      b.setAttribute('aria-pressed', 'false'); b.setAttribute('data-filter', label === 'Alle' ? 'all' : label);
      b.addEventListener('click', function () { setFilter(label === 'Alle' ? 'all' : label); });
      filterBar.appendChild(b); return b;
    });
    function markFilter() {
      filterBar.hidden = layoutName === 'wide';
      filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === filter)); });
    }
    function firstOf(kind) { for (var i = 0; i < PEOPLE.length; i++) if (PEOPLE[i].kind === kind) return i; return 0; }
    function setFilter(f) {
      if (f === filter) return;
      filter = f;
      if (f !== 'all' && PEOPLE[selected].kind !== f) select(firstOf(f));
      render(true);
    }

    /* Das Bild: aus einem Layout berechnet, bei Bedarf neu gezeichnet.
       name: 'wide' oder 'tall'. Im Hochformat gilt je nach Filter die Übersicht ('all') oder eine Art ('kind'). */
    var lastW = -1;
    function render(fade) {
      draw(layoutName);
      if (fade && !calm()) { stage.classList.remove('is-fresh'); void stage.offsetWidth; stage.classList.add('is-fresh'); }
    }
    function draw(name) {
      /* Der Filter folgt der Auswahl: nach einem Wechsel von wide auf tall passt er sich an. */
      if (name === 'tall' && filter !== 'all' && PEOPLE[selected].kind !== filter) filter = PEOPLE[selected].kind;
      var mode = name === 'wide' ? 'wide' : filter === 'all' ? 'all' : 'kind';
      var L = LAYOUTS[mode];
      var hadFocus = stage.contains(document.activeElement);
      layoutName = name;
      var px = stage.getBoundingClientRect().width; lastW = px;
      /* Wer wird gezeichnet: alle, oder nur die gewählte Art. */
      var list = [];
      PEOPLE.forEach(function (p, i) { if (mode !== 'kind' || p.kind === filter) list.push({ p: p, i: i }); });
      /* Gruppen: Arten ohne Menschen bekommen keinen Platz. Jede Gruppe hat ihren Platz (slot), die Menschen stehen darin gleichmässig. */
      var kinds = mode === 'kind' ? [] : KINDS_IN;
      var per = (360 - GAP * kinds.length) / PEOPLE.length, at = 0;
      var groups = kinds.map(function (k, gi) {
        var n = PEOPLE.filter(function (p) { return p.kind === k; }).length;
        if (gi === 0) at = -per * n / 2;
        var g = { kind: k, a0: at, a1: at + per * n, mid: at + per * n / 2, n: n };
        at = g.a1 + GAP; return g;
      });
      var pos = function (a, d) { var r = a * Math.PI / 180; return [L.CX + d * Math.sin(r), L.CY - d * Math.cos(r)]; };
      var first = {};
      /* Lage aller Menschen zuerst: daraus wird das Bild auf den Inhalt beschnitten. */
      var geo = list.map(function (e, n) {
        var p = e.p, ang;
        if (mode === 'kind') ang = 360 / list.length * n;
        else { var gr = groups[kinds.indexOf(p.kind)], idx = first[p.kind] = (first[p.kind] === undefined ? 0 : first[p.kind] + 1); ang = gr.a0 + per * (idx + 0.5); }
        var dist = L.base + (100 - p.proximity) * L.k, xy = pos(ang, dist);
        var level = p.resonance === 0 ? 0 : p.resonance < 40 ? 1 : p.resonance < 80 ? 2 : 3;
        return { dist: dist, level: level, x: xy[0], y: xy[1] };
      });
      /* Wörter: Schriftgrösse so, dass sie am Bildschirm mindestens MIN_WORD px misst. Sie hängt an der Breite des Bildes,
         und die Breite an den Wörtern: wenige Durchgänge genügen. */
      var vbX = 0, vbW = L.W, fs = L.fs0, vbY = 0, vbH = L.H, items = [];
      for (var pass = 0; pass < 4; pass++) {
        fs = Math.max(L.fs0, MIN_WORD * vbW / (px || L.px0));
        var minX = L.CX - L.ME, maxX = L.CX + L.ME, minY = L.CY - L.ME, maxY = L.CY + L.ME;
        var grow = function (x, y) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); };
        geo.forEach(function (g) { var r = L.R + L.ring * g.level; grow(g.x - r, g.y - r); grow(g.x + r, g.y + r); });
        items = groups.map(function (gr) {
          var m = ((gr.mid % 360) + 360) % 360, bottom = m > 100 && m < 260;
          var tr = L.out + (bottom ? fs + 4 : 8), outer = bottom ? tr : tr + fs * 0.8;
          var b0 = gr.a0 + 4, b1 = gr.a1 - 4;
          var half = Math.min(40, (gr.kind.length * fs * 0.62 / 2 / tr) * 180 / Math.PI);
          [[b0, L.out], [gr.mid, L.out], [b1, L.out], [gr.mid - half, outer], [gr.mid, outer], [gr.mid + half, outer]].forEach(function (q) { var c = pos(q[0], q[1]); grow(c[0], c[1]); });
          /* Die Bögen dicht abtasten, damit auch die Achsenpunkte (oben, rechts, unten, links) zählen. */
          [[b0, b1, L.out], [gr.mid - half, gr.mid + half, outer]].forEach(function (r) {
            for (var a = r[0]; a <= r[1]; a += 1) { var c = pos(a, r[2]); grow(c[0], c[1]); }
          });
          /* Rechteck des Wortes (für den Gruppen-Knopf der Übersicht). */
          var lo = bottom ? tr - fs * 0.8 : tr, hi = bottom ? tr : tr + fs * 0.8, wx0 = 1e9, wx1 = -1e9, wy0 = 1e9, wy1 = -1e9;
          for (var wa = gr.mid - half; wa <= gr.mid + half; wa += 1) [lo, hi].forEach(function (d) { var c = pos(wa, d); wx0 = Math.min(wx0, c[0]); wx1 = Math.max(wx1, c[0]); wy0 = Math.min(wy0, c[1]); wy1 = Math.max(wy1, c[1]); });
          return { gr: gr, bottom: bottom, tr: tr, b0: b0, b1: b1, word: [wx0, wy0, wx1, wy1] };
        });
        var halfW = Math.max(L.W / 2, L.CX - minX + 8, maxX - L.CX + 8);
        vbX = L.CX - halfW; vbW = 2 * halfW;
        vbY = Math.floor(minY - 16); vbH = Math.ceil(maxY + 16) - vbY;
      }
      vbX = Math.floor(vbX * 10) / 10; vbW = Math.ceil(vbW * 10) / 10;
      var fx = function (x) { return (x - vbX) / vbW * 100; };
      var fy = function (y) { return (y - vbY) / vbH * 100; };
      stage.innerHTML = '<svg class="umfeld__svg" viewBox="' + vbX + ' ' + vbY + ' ' + vbW + ' ' + vbH + '" aria-hidden="true"><defs></defs></svg>';
      stage.dataset.layout = name; stage.dataset.view = mode;
      var svg = stage.firstChild, defs = svg.firstChild;
      var relief = el('linearGradient', { id: uid + '-relief', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
      relief.appendChild(el('stop', { offset: 0, 'stop-color': '#FCF9F0' })); relief.appendChild(el('stop', { offset: 1, 'stop-color': '#E2DBCD' }));
      defs.appendChild(relief);
      /* Bögen mit dem Wort der Art: unter allem anderen. Das Wort läuft in der unteren Hälfte andersherum, damit es nicht auf dem Kopf steht. */
      var arcG = el('g', { class: 'umfeld__arcs' }), arcs = [];
      svg.appendChild(arcG);
      items.forEach(function (it, gi) {
        var gr = it.gr, p0 = pos(it.b0, L.out), p1 = pos(it.b1, L.out);
        var arc = el('path', { class: 'umfeld__arc', d: 'M' + p0[0] + ' ' + p0[1] + 'A' + L.out + ' ' + L.out + ' 0 ' + (it.b1 - it.b0 > 180 ? 1 : 0) + ' 1 ' + p1[0] + ' ' + p1[1] });
        var w0 = pos(gr.mid - 40, it.tr), w1 = pos(gr.mid + 40, it.tr), id = uid + '-k' + gi;
        defs.appendChild(el('path', { id: id, d: it.bottom ? 'M' + w1[0] + ' ' + w1[1] + 'A' + it.tr + ' ' + it.tr + ' 0 0 0 ' + w0[0] + ' ' + w0[1] : 'M' + w0[0] + ' ' + w0[1] + 'A' + it.tr + ' ' + it.tr + ' 0 0 1 ' + w1[0] + ' ' + w1[1] }));
        var word = el('text', { class: 'umfeld__kind', 'font-size': fs });
        var tp = el('textPath', { href: '#' + id, startOffset: '50%', 'text-anchor': 'middle' }); tp.textContent = gr.kind;
        word.appendChild(tp); arcG.appendChild(arc); arcG.appendChild(word); arcs.push(arc, word);
      });
      var rings = el('g', { class: 'umfeld__rings' }), discs = el('g', {}), lines = el('g', { class: 'umfeld__contours' });
      svg.appendChild(rings); svg.appendChild(discs); svg.appendChild(lines);
      discs.appendChild(el('circle', { cx: L.CX, cy: L.CY, r: L.ME - 5, fill: 'url(#' + uid + '-relief)', class: 'relief-disc' }));
      var me = el('circle', { cx: L.CX, cy: L.CY, r: L.ME, class: 'umfeld__contour umfeld__me', 'data-contour': '' });
      lines.appendChild(me);
      /* Name im Bild („Ich“, ruht): eingemittet über `translate`. */
      var label = function (text, x, y, cls) {
        var s = document.createElement('span'); s.className = 'umfeld__name' + (cls ? ' ' + cls : ''); s.textContent = text;
        s.style.left = fx(x) + '%'; s.style.top = fy(y) + '%'; stage.appendChild(s); return s;
      };
      /* Mensch: Knopf über dem ganzen Kreis. Er sitzt über left/top und Grösse genau auf dem Kreis, ohne Verschiebung:
         GSAP schreibt `translate` beim ersten Tween in `transform` um und verlöre die Einmittung. */
      var pick = function (p, i, x, y) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'umfeld__name umfeld__pick'; b.textContent = p.name;
        b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', p.name + ', ' + words(p));
        b.style.left = fx(x - L.R) + '%'; b.style.top = fy(y - L.R) + '%';
        b.style.width = 2 * L.R / vbW * 100 + '%'; b.style.height = 2 * L.R / vbH * 100 + '%';
        b.addEventListener('click', function () { select(i); });
        b.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
          if (!d) return;
          e.preventDefault(); select(i + d); focusSelected();
        });
        stage.appendChild(b); return b;
      };
      label('Ich', L.CX, L.CY, 'umfeld__name--me');

      var people = list.map(function (e, n) {
        var p = e.p, i = e.i, g = geo[n], dist = g.dist, x = g.x, y = g.y, level = g.level;
        var ux = (x - L.CX) / dist, uy = (y - L.CY) / dist;
        var stroke = null, ringList = [];
        if (level) {
          stroke = el('linearGradient', { id: uid + '-g' + i, gradientUnits: 'userSpaceOnUse', x1: x - (L.R + 24), y1: y, x2: x + (L.R + 24), y2: y });
          [[0, '#6756D9'], [.3, '#4D7FE8'], [.55, '#9466DF'], [1, '#F0719A']].forEach(function (st) { stroke.appendChild(el('stop', { offset: st[0], 'stop-color': st[1] })); });
          defs.appendChild(stroke);
        }
        for (var k = 1; k <= level; k++) {
          var ring = el('circle', { cx: x, cy: y, r: L.R + L.ring * k, class: 'umfeld__ring', stroke: 'url(#' + uid + '-g' + i + ')', 'stroke-width': 1.8, 'data-ring': '' });
          rings.appendChild(ring); ringList.push(ring);
        }
        var disc = el('circle', { cx: x, cy: y, r: L.R - (mode === 'all' ? 2 : 4), fill: 'url(#' + uid + '-relief)', class: 'relief-disc' });
        discs.appendChild(disc);
        var contour = el('circle', { cx: x, cy: y, r: L.R, class: 'umfeld__contour', 'data-contour': '' });
        lines.appendChild(contour);
        return { index: i, person: p, rings: ringList, disc: disc, contour: contour, name: mode === 'all' ? null : pick(p, i, x, y),
          from: { x: L.CX + ux * L.edge, y: L.CY + uy * L.edge }, at: { x: x, y: y }, width: vbW, r: L.R + L.ring * level };
      });

      /* Übersicht: über jeder Gruppe ein transparenter Knopf. Fläche = Punkte samt Ringen plus Wort, mindestens 44 px.
         Schneiden sich zwei Flächen, gilt für diese nur die Fläche der Punkte samt Ringen. */
      var groupBtns = [];
      if (mode === 'all') {
        var minU = 44 / ((px || L.px0) / vbW), minV = 44 / ((px || L.px0) / vbH);
        var boxes = items.map(function (it) {
          var d = [1e9, 1e9, -1e9, -1e9];
          people.forEach(function (q) {
            if (q.person.kind !== it.gr.kind) return;
            d = [Math.min(d[0], q.at.x - q.r), Math.min(d[1], q.at.y - q.r), Math.max(d[2], q.at.x + q.r), Math.max(d[3], q.at.y + q.r)];
          });
          return { dots: d, full: [Math.min(d[0], it.word[0]), Math.min(d[1], it.word[1]), Math.max(d[2], it.word[2]), Math.max(d[3], it.word[3])] };
        });
        var atLeast = function (b) {
          var cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, w = Math.max(b[2] - b[0], minU), h = Math.max(b[3] - b[1], minV);
          return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
        };
        var cut = function (a, b) { return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]; };
        var rect = boxes.map(function (b) { return atLeast(b.full); }), mode2 = rect.map(function () { return 'wort'; });
        rect.forEach(function (a, x) { rect.forEach(function (b, y) { if (x < y && cut(a, b)) mode2[x] = mode2[y] = 'punkte'; }); });
        rect = boxes.map(function (b, x) { return atLeast(mode2[x] === 'wort' ? b.full : b.dots); });
        items.forEach(function (it, gi) {
          var r = rect[gi], b = document.createElement('button'), n = it.gr.n;
          b.type = 'button'; b.className = 'umfeld__group'; b.setAttribute('data-kind', it.gr.kind); b.setAttribute('data-fit', mode2[gi]);
          b.setAttribute('aria-label', it.gr.kind + ', ' + n + (n === 1 ? ' Mensch' : ' Menschen') + ', öffnen');
          b.style.left = fx(r[0]) + '%'; b.style.top = fy(r[1]) + '%';
          b.style.width = (r[2] - r[0]) / vbW * 100 + '%'; b.style.height = (r[3] - r[1]) / vbH * 100 + '%';
          b.addEventListener('click', function () { setFilter(it.gr.kind); });
          stage.appendChild(b); groupBtns.push(b);
        });
      }
      api.parts = { svg: svg, me: me, people: people, arcs: arcs, groups: groupBtns, view: mode, width: vbW, top: vbY, height: vbH };
      mark(); markFilter();
      /* Fokus geht beim Neuzeichnen nicht verloren. */
      if (hadFocus) focusSelected();
    }

    /* Fokus auf den Knopf des gewählten Menschen, in der Übersicht auf den Knopf seiner Gruppe. */
    function focusSelected() {
      var q = (api.parts.people || []).filter(function (x) { return x.index === selected; })[0];
      if (q && q.name) { q.name.focus(); return; }
      var g = (api.parts.groups || []).filter(function (x) { return x.getAttribute('data-kind') === PEOPLE[selected].kind; })[0];
      if (g) g.focus();
    }

    function mark() {
      (api.parts.people || []).forEach(function (q) {
        var on = q.index === selected;
        q.contour.classList.toggle('is-active', on);
        q.rings.forEach(function (r) { r.classList.toggle('is-active', on); });
        if (q.name) { q.name.classList.toggle('is-active', on); q.name.setAttribute('aria-pressed', String(on)); }
      });
    }
    function select(i, fromScroll) {
      i = ((i % PEOPLE.length) + PEOPLE.length) % PEOPLE.length;
      var first = !api.ready;
      selected = i;
      var p = PEOPLE[i];
      /* Gehört der Mensch zu einer anderen Art, wechselt der Filter mit (nur im Hochformat). */
      if (layoutName === 'tall' && filter !== 'all' && p.kind !== filter) { filter = p.kind; render(true); } else mark();
      slides.forEach(function (s, k) {
        var on = k === i;
        if (on) { s.removeAttribute('inert'); s.removeAttribute('aria-hidden'); } else { s.setAttribute('inert', ''); s.setAttribute('aria-hidden', 'true'); }
        s.querySelector('a').tabIndex = on ? 0 : -1;
      });
      current.textContent = p.name;
      if (!first) live.textContent = 'Du & ' + p.name + ', ' + words(p);
      if (!fromScroll) slideTo(i, !first);
    }
    /* Die Breite der Bühne (Spalte), nicht der Szene: im Hochformat ist die Szene höchstens 440 px breit und käme sonst nie mehr zurück auf wide. */
    var column = root.querySelector('.umfeld__stage');
    var pickLayout = function () { var w = column.getBoundingClientRect().width || root.getBoundingClientRect().width; return w && w < 560 ? 'tall' : 'wide'; };
    draw(pickLayout());
    select(0);
    api.ready = true;
    if (window.ResizeObserver) new ResizeObserver(function () {
      var n = pickLayout(), w = stage.getBoundingClientRect().width;
      /* Neu zeichnen, wenn das Layout wechselt oder die Bühne ihre Breite ändert: die Wörter bleiben so mindestens 15 px gross. */
      if (n !== layoutName || Math.abs(w - lastW) > 0.5) draw(n);
      slideTo(selected, false);
    }).observe(root);
    api.select = select;
    root._umfeld = api;
    return api;
  }
  window.ElanumUmfeld = { mount: mount, people: PEOPLE };
})();
