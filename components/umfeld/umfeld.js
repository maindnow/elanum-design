/* ============================================================
   ELANUM Umfeld
   "Ich" in der Mitte, Menschen als eigene, geschlossene Kreise darum.
   Abstand zeigt Nähe. Null bis drei Linien im Verlauf um die Person zeigen
   die Resonanz (wie im Beziehungsraum), keine Linie führt zur Mitte. Ohne
   aktive Resonanz bleibt nur der Abstand. Der Freiraum fehlt, das Umfeld
   kennt den Wert nicht.
   Aufbau und Bedienung wie beim Resonanzrad (Screen „Ich“): Bild, darunter
   eine Zeile mit Pfeilen und dem gewählten Menschen, darunter der Lesebereich
   ohne Karte. Dort stehen Nähe und Resonanz als Pillen, die Überschrift, die
   Notiz und der Knopf. Die Kreise im Bild sind Knöpfe, der Lesebereich lässt
   sich ziehen (Finger oder Maus), Kreis, Zeile und Lesebereich bleiben im
   Gleichschritt. Eine Liste gibt es nicht.
   Das Bild ist senkrecht auf seinen Inhalt beschnitten (Rand 16 Einheiten),
   damit Zeile und Lesebereich früh im Sichtfeld stehen.

   Mobile-first: Unter 560 px Breite gilt ein Hochformat mit grösseren
   Kreisen, damit Namen in echten 15 px in ihren Kreis passen. Wird das
   Element breiter oder schmaler, baut sich das Bild neu auf.

   API: ElanumUmfeld.mount(root, { link: 'pfad/zum/beziehungsraum/', heading: 'h3' })
        gibt { select(i), parts } zurück. select(i) wählt den Menschen i (läuft um).
   ============================================================ */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  /* ring: Abstand der Linien um die Person. Im Hochformat enger, damit sie im Bild bleiben. */
  var LAYOUTS = {
    wide: { W: 720, H: 600, CX: 360, CY: 300, ME: 62, R: 46, base: 150, k: 1.1, edge: 330, ring: 8 },
    tall: { W: 400, H: 560, CX: 200, CY: 280, ME: 52, R: 44, base: 120, k: 0.8, edge: 260, ring: 6 }
  };
  var PEOPLE = [
    { name: 'Mara', angle: -58, proximity: 84, resonance: 86, note: 'Ihr teilt viel, ohne dasselbe zu brauchen.' },
    { name: 'Jonas', angle: 38, proximity: 52, resonance: 34, note: 'Ein ruhiger Kontakt. Die Verbindung ist leise, aber da.' },
    { name: 'Lea', angle: 128, proximity: 24, resonance: 64, note: 'Weit weg im Alltag, trotzdem spürbar verbunden.' },
    { name: 'Sam', angle: 214, proximity: 70, resonance: 0, note: 'Oft nah, im Moment ohne aktive Resonanz.' }
  ];
  function near(p) { return p.proximity < 34 ? 'weit' : p.proximity < 75 ? 'nah' : 'sehr nah'; }
  function res(p) { return p.resonance === 0 ? 'keine Resonanz' : p.resonance < 40 ? 'leise Resonanz' : p.resonance < 80 ? 'spürbare Resonanz' : 'starke Resonanz'; }
  function words(p) { return near(p) + ' · ' + res(p); }
  function el(name, attrs) { var n = document.createElementNS(NS, name); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }

  var count = 0;
  function mount(root, opts) {
    opts = opts || {};
    var uid = 'uf' + (++count), heading = opts.heading || 'h2', link = opts.link || '../beziehungsraum/';
    root.classList.add('umfeld');
    var ARROW_PREV = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6"/></svg>';
    var ARROW_NEXT = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg>';
    root.innerHTML = '<div class="umfeld__stage">' +
        '<div class="umfeld__scene"></div>' +
        '<div class="umfeld__nav">' +
          '<button class="button button--secondary button--icon glow-edge" type="button" data-nav="prev" aria-label="Vorheriger Mensch">' + ARROW_PREV + '</button>' +
          '<p class="umfeld__current" aria-hidden="true"></p>' +
          '<button class="button button--secondary button--icon glow-edge" type="button" data-nav="next" aria-label="Nächster Mensch">' + ARROW_NEXT + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="umfeld__reader" role="group" aria-roledescription="Karussell" aria-label="Menschen in deinem Umfeld">' +
        '<div class="umfeld__slides"></div>' +
        '<p class="umfeld__live" aria-live="polite"></p>' +
      '</div>';
    var stage = root.querySelector('.umfeld__scene'), slider = root.querySelector('.umfeld__slides');
    var current = root.querySelector('.umfeld__current'), live = root.querySelector('.umfeld__live');
    var selected = 0, layoutName = '', api = { parts: {} };
    var calm = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };

    var slides = PEOPLE.map(function (p) {
      var href = link + '?person=' + encodeURIComponent(p.name) + '&proximity=' + p.proximity + '&resonance=' + p.resonance;
      var s = document.createElement('div');
      s.className = 'umfeld__slide'; s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', 'Folie');
      s.innerHTML = '<div class="umfeld__pills"><span class="element-chip umfeld__pill">' + near(p) + '</span>' +
        '<span class="element-chip area umfeld__pill">' + res(p) + '</span></div>' +
        '<' + heading + ' class="umfeld__title t-title">Du &amp; ' + p.name + '</' + heading + '>' +
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

    /* Das Bild: aus einem Layout berechnet, bei Bedarf neu gezeichnet. */
    function draw(name) {
      var L = LAYOUTS[name];
      layoutName = name;
      /* Lage aller Menschen zuerst: daraus wird das Bild senkrecht auf den Inhalt beschnitten. */
      var geo = PEOPLE.map(function (p) {
        var dist = L.base + (100 - p.proximity) * L.k, a = p.angle * Math.PI / 180;
        var level = p.resonance === 0 ? 0 : p.resonance < 40 ? 1 : p.resonance < 80 ? 2 : 3;
        return { dist: dist, level: level, x: L.CX + dist * Math.sin(a), y: L.CY - dist * Math.cos(a) };
      });
      var minY = L.CY - L.ME, maxY = L.CY + L.ME;
      geo.forEach(function (g) { var r = L.R + L.ring * g.level; minY = Math.min(minY, g.y - r); maxY = Math.max(maxY, g.y + r); });
      var vbY = Math.floor(minY - 16), vbH = Math.ceil(maxY + 16) - vbY;
      var fy = function (y) { return (y - vbY) / vbH * 100; };
      stage.innerHTML = '<svg class="umfeld__svg" viewBox="0 ' + vbY + ' ' + L.W + ' ' + vbH + '" aria-hidden="true"><defs></defs></svg>';
      stage.dataset.layout = name;
      var svg = stage.firstChild, defs = svg.firstChild;
      var relief = el('linearGradient', { id: uid + '-relief', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
      relief.appendChild(el('stop', { offset: 0, 'stop-color': '#FCF9F0' })); relief.appendChild(el('stop', { offset: 1, 'stop-color': '#E2DBCD' }));
      defs.appendChild(relief);
      var rings = el('g', { class: 'umfeld__rings' }), discs = el('g', {}), lines = el('g', { class: 'umfeld__contours' });
      svg.appendChild(rings); svg.appendChild(discs); svg.appendChild(lines);
      discs.appendChild(el('circle', { cx: L.CX, cy: L.CY, r: L.ME - 5, fill: 'url(#' + uid + '-relief)', class: 'relief-disc' }));
      var me = el('circle', { cx: L.CX, cy: L.CY, r: L.ME, class: 'umfeld__contour umfeld__me', 'data-contour': '' });
      lines.appendChild(me);
      /* Name im Bild („Ich“, ruht): eingemittet über `translate`. */
      var label = function (text, x, y, cls) {
        var s = document.createElement('span'); s.className = 'umfeld__name' + (cls ? ' ' + cls : ''); s.textContent = text;
        s.style.left = x / L.W * 100 + '%'; s.style.top = fy(y) + '%'; stage.appendChild(s); return s;
      };
      /* Mensch: Knopf über dem ganzen Kreis. Er sitzt über left/top und Grösse genau auf dem Kreis, ohne Verschiebung:
         GSAP schreibt `translate` beim ersten Tween in `transform` um und verlöre die Einmittung. */
      var pick = function (p, i, x, y) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'umfeld__name umfeld__pick'; b.textContent = p.name;
        b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', p.name + ', ' + words(p));
        b.style.left = (x - L.R) / L.W * 100 + '%'; b.style.top = fy(y - L.R) + '%';
        b.style.width = 2 * L.R / L.W * 100 + '%'; b.style.height = 2 * L.R / vbH * 100 + '%';
        b.addEventListener('click', function () { select(i); });
        b.addEventListener('keydown', function (e) {
          var at = PEOPLE.indexOf(p), d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
          if (!d) return;
          e.preventDefault(); select(at + d);
          var q = api.parts.people[selected]; if (q) q.name.focus();
        });
        stage.appendChild(b); return b;
      };
      label('Ich', L.CX, L.CY, 'umfeld__name--me');

      var people = PEOPLE.map(function (p, i) {
        var g = geo[i], dist = g.dist, x = g.x, y = g.y, level = g.level;
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
        var disc = el('circle', { cx: x, cy: y, r: L.R - 4, fill: 'url(#' + uid + '-relief)', class: 'relief-disc' });
        discs.appendChild(disc);
        var contour = el('circle', { cx: x, cy: y, r: L.R, class: 'umfeld__contour', 'data-contour': '' });
        lines.appendChild(contour);
        return { person: p, rings: ringList, disc: disc, contour: contour, name: pick(p, i, x, y),
          from: { x: L.CX + ux * L.edge, y: L.CY + uy * L.edge }, at: { x: x, y: y }, width: L.W };
      });
      api.parts = { svg: svg, me: me, people: people, width: L.W, top: vbY, height: vbH };
      mark();
    }

    function mark() {
      (api.parts.people || []).forEach(function (q, k) {
        var on = k === selected;
        q.contour.classList.toggle('is-active', on);
        q.name.classList.toggle('is-active', on);
        q.rings.forEach(function (r) { r.classList.toggle('is-active', on); });
      });
      (api.parts.people || []).forEach(function (q, k) { q.name.setAttribute('aria-pressed', String(k === selected)); });
    }
    function select(i, fromScroll) {
      i = ((i % PEOPLE.length) + PEOPLE.length) % PEOPLE.length;
      var first = !api.ready;
      selected = i; mark();
      var p = PEOPLE[i];
      slides.forEach(function (s, k) {
        var on = k === i;
        if (on) { s.removeAttribute('inert'); s.removeAttribute('aria-hidden'); } else { s.setAttribute('inert', ''); s.setAttribute('aria-hidden', 'true'); }
        s.querySelector('a').tabIndex = on ? 0 : -1;
      });
      current.innerHTML = '<span><strong>' + p.name + '</strong><span>' + words(p) + '</span></span>';
      if (!first) live.textContent = 'Du & ' + p.name + ', ' + words(p);
      if (!fromScroll) slideTo(i, !first);
    }
    var pickLayout = function () { var w = stage.getBoundingClientRect().width || root.getBoundingClientRect().width; return w && w < 560 ? 'tall' : 'wide'; };
    draw(pickLayout());
    select(0);
    api.ready = true;
    if (window.ResizeObserver) new ResizeObserver(function () { var n = pickLayout(); if (n !== layoutName) draw(n); slideTo(selected, false); }).observe(root);
    api.select = select;
    root._umfeld = api;
    return api;
  }
  window.ElanumUmfeld = { mount: mount, people: PEOPLE };
})();
