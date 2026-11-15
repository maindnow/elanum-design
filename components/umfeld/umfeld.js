/* ============================================================
   ELANUM Umfeld
   "Ich" in der Mitte, Menschen als eigene, geschlossene Kreise darum.
   Abstand zeigt Nähe. Null bis drei Linien im Verlauf um die Person zeigen
   die Resonanz (wie im Beziehungsraum), keine Linie führt zur Mitte. Ohne
   aktive Resonanz bleibt nur der Abstand. Der Freiraum fehlt, das Umfeld
   kennt den Wert nicht.
   Die Liste darunter ist die Bedienung; das Bild zeigt dasselbe.

   Mobile-first: Unter 560 px Breite gilt ein Hochformat mit grösseren
   Kreisen, damit Namen in echten 15 px in ihren Kreis passen. Wird das
   Element breiter oder schmaler, baut sich das Bild neu auf.

   API: ElanumUmfeld.mount(root, { link: 'pfad/zum/beziehungsraum/', heading: 'h3' })
   ============================================================ */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var LAYOUTS = {
    wide: { W: 720, H: 600, CX: 360, CY: 300, ME: 62, R: 46, base: 150, k: 1.1, edge: 330 },
    tall: { W: 400, H: 560, CX: 200, CY: 280, ME: 52, R: 44, base: 120, k: 0.85, edge: 260 }
  };
  var PEOPLE = [
    { name: 'Mara', angle: -58, proximity: 84, resonance: 86, note: 'Ihr teilt viel, ohne dasselbe zu brauchen.' },
    { name: 'Jonas', angle: 38, proximity: 52, resonance: 34, note: 'Ein ruhiger Kontakt. Die Verbindung ist leise, aber da.' },
    { name: 'Lea', angle: 128, proximity: 24, resonance: 64, note: 'Weit weg im Alltag, trotzdem spürbar verbunden.' },
    { name: 'Sam', angle: 214, proximity: 70, resonance: 0, note: 'Oft nah, im Moment ohne aktive Resonanz.' }
  ];
  function words(p) {
    var near = p.proximity < 34 ? 'weit' : p.proximity < 75 ? 'nah' : 'sehr nah';
    var res = p.resonance === 0 ? 'keine Resonanz' : p.resonance < 40 ? 'leise Resonanz' : p.resonance < 80 ? 'spürbare Resonanz' : 'starke Resonanz';
    return near + ' · ' + res;
  }
  function el(name, attrs) { var n = document.createElementNS(NS, name); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }

  var count = 0;
  function mount(root, opts) {
    opts = opts || {};
    var uid = 'uf' + (++count), heading = opts.heading || 'h2', link = opts.link || '../beziehungsraum/';
    root.classList.add('umfeld');
    root.innerHTML = '<div class="umfeld__stage"></div>' +
      '<div class="umfeld__side"><ul class="umfeld__list" aria-label="Menschen in deinem Umfeld"></ul><div class="umfeld__detail" aria-live="polite"></div></div>';
    var stage = root.querySelector('.umfeld__stage'), list = root.querySelector('.umfeld__list'), detail = root.querySelector('.umfeld__detail');
    var selected = 0, layoutName = '', api = { parts: {} };

    var buttons = PEOPLE.map(function (p, i) {
      var li = document.createElement('li');
      li.innerHTML = '<button type="button" class="umfeld__person glow-edge" aria-pressed="false"><span class="umfeld__person-name">' + p.name + '</span><span class="umfeld__person-state">' + words(p) + '</span></button>';
      list.appendChild(li);
      li.firstChild.addEventListener('click', function () { select(i); });
      return li.firstChild;
    });

    /* Das Bild: aus einem Layout berechnet, bei Bedarf neu gezeichnet. */
    function draw(name) {
      var L = LAYOUTS[name];
      layoutName = name;
      stage.innerHTML = '<svg class="umfeld__svg" viewBox="0 0 ' + L.W + ' ' + L.H + '" aria-hidden="true"><defs></defs></svg>';
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
      var label = function (text, x, y, cls) {
        var s = document.createElement('span'); s.className = 'umfeld__name' + (cls ? ' ' + cls : ''); s.textContent = text;
        s.style.left = x / L.W * 100 + '%'; s.style.top = y / L.H * 100 + '%'; stage.appendChild(s); return s;
      };
      label('Ich', L.CX, L.CY, 'umfeld__name--me');

      var people = PEOPLE.map(function (p, i) {
        var dist = L.base + (100 - p.proximity) * L.k;
        var a = p.angle * Math.PI / 180, x = L.CX + dist * Math.sin(a), y = L.CY - dist * Math.cos(a);
        var ux = (x - L.CX) / dist, uy = (y - L.CY) / dist;
        var level = p.resonance === 0 ? 0 : p.resonance < 40 ? 1 : p.resonance < 80 ? 2 : 3;
        var stroke = null, ringList = [];
        if (level) {
          stroke = el('linearGradient', { id: uid + '-g' + i, gradientUnits: 'userSpaceOnUse', x1: x - (L.R + 24), y1: y, x2: x + (L.R + 24), y2: y });
          [[0, '#6756D9'], [.3, '#4D7FE8'], [.55, '#9466DF'], [1, '#F0719A']].forEach(function (st) { stroke.appendChild(el('stop', { offset: st[0], 'stop-color': st[1] })); });
          defs.appendChild(stroke);
        }
        for (var k = 1; k <= level; k++) {
          var ring = el('circle', { cx: x, cy: y, r: L.R + 8 * k, class: 'umfeld__ring', stroke: 'url(#' + uid + '-g' + i + ')', 'stroke-width': 1.8, 'data-ring': '' });
          rings.appendChild(ring); ringList.push(ring);
        }
        var disc = el('circle', { cx: x, cy: y, r: L.R - 4, fill: 'url(#' + uid + '-relief)', class: 'relief-disc' });
        discs.appendChild(disc);
        var contour = el('circle', { cx: x, cy: y, r: L.R, class: 'umfeld__contour', 'data-contour': '' });
        lines.appendChild(contour);
        return { person: p, rings: ringList, disc: disc, contour: contour, name: label(p.name, x, y),
          from: { x: L.CX + ux * L.edge, y: L.CY + uy * L.edge }, at: { x: x, y: y }, width: L.W };
      });
      api.parts = { svg: svg, me: me, people: people, width: L.W };
      mark();
    }

    function mark() {
      (api.parts.people || []).forEach(function (q, k) {
        var on = k === selected;
        q.contour.classList.toggle('is-active', on);
        q.name.classList.toggle('is-active', on);
        q.rings.forEach(function (r) { r.classList.toggle('is-active', on); });
      });
      buttons.forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === selected)); });
    }
    function select(i) {
      selected = i; mark();
      var p = PEOPLE[i];
      var href = link + '?person=' + encodeURIComponent(p.name) + '&proximity=' + p.proximity + '&resonance=' + p.resonance;
      detail.innerHTML = '<' + heading + ' class="t-title">Du &amp; ' + p.name + '</' + heading + '>' +
        '<p class="umfeld__state t-label">' + words(p) + '</p><p class="secondary">' + p.note + '</p>' +
        '<a class="button button--secondary glow-edge" href="' + href + '">Beziehungsraum öffnen <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/></svg></a>';
    }
    var pick = function () { var w = stage.getBoundingClientRect().width || root.getBoundingClientRect().width; return w && w < 560 ? 'tall' : 'wide'; };
    draw(pick());
    select(0);
    if (window.ResizeObserver) new ResizeObserver(function () { var n = pick(); if (n !== layoutName) draw(n); }).observe(root);
    api.select = select;
    root._umfeld = api;
    return api;
  }
  window.ElanumUmfeld = { mount: mount, people: PEOPLE };
})();
