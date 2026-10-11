/* ============================================================
   ELANUM Umfeld
   "Ich" in der Mitte, Menschen als eigene, offene Kreise darum.
   Abstand zeigt Nähe, Stärke der Verbindung zeigt Resonanz. Ohne aktive
   Resonanz bleibt nur der Abstand, keine Linie. Kreise bleiben rund,
   Öffnungen unten, Verbindungen treffen beide Konturen exakt.
   Die Liste darunter ist die Bedienung; das Bild zeigt dasselbe.

   API: ElanumUmfeld.mount(root, { link: 'pfad/zum/beziehungsraum/', heading: 'h3' })
   ============================================================ */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var W = 720, H = 600, CX = 360, CY = 300, ME = 62, R = 46;
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
  function openCircle(cx, cy, r) {
    var half = 16 * Math.PI / 180, dx = r * Math.sin(half), dy = r * Math.cos(half);
    return 'M' + (cx - dx) + ' ' + (cy + dy) + ' A' + r + ' ' + r + ' 0 1 1 ' + (cx + dx) + ' ' + (cy + dy);
  }
  var count = 0;
  function mount(root, opts) {
    opts = opts || {};
    var uid = 'uf' + (++count), heading = opts.heading || 'h2', link = opts.link || '../beziehungsraum/';
    root.classList.add('umfeld');
    root.innerHTML = '<div class="umfeld__stage"><svg class="umfeld__svg" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true"><defs></defs></svg></div>' +
      '<div class="umfeld__side"><ul class="umfeld__list" aria-label="Menschen in deinem Umfeld"></ul><div class="umfeld__detail" aria-live="polite"></div></div>';
    var svg = root.querySelector('svg'), defs = svg.querySelector('defs'), stage = root.querySelector('.umfeld__stage');
    var list = root.querySelector('.umfeld__list'), detail = root.querySelector('.umfeld__detail');

    var relief = el('linearGradient', { id: uid + '-relief', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
    relief.appendChild(el('stop', { offset: 0, 'stop-color': '#FCF9F0' })); relief.appendChild(el('stop', { offset: 1, 'stop-color': '#E2DBCD' }));
    defs.appendChild(relief);

    var bridges = el('g', { class: 'umfeld__bridges' }), discs = el('g', {}), lines = el('g', { class: 'umfeld__contours' });
    svg.appendChild(bridges); svg.appendChild(discs); svg.appendChild(lines);
    discs.appendChild(el('circle', { cx: CX, cy: CY, r: ME - 5, fill: 'url(#' + uid + '-relief)', class: 'relief-disc umfeld__me-disc' }));
    lines.appendChild(el('path', { d: openCircle(CX, CY, ME), class: 'umfeld__contour umfeld__me', 'data-contour': '' }));
    var meLabel = document.createElement('span'); meLabel.className = 'umfeld__name umfeld__name--me'; meLabel.textContent = 'Ich';
    meLabel.style.left = CX / W * 100 + '%'; meLabel.style.top = CY / H * 100 + '%'; stage.appendChild(meLabel);

    var parts = PEOPLE.map(function (p, i) {
      var dist = 150 + (100 - p.proximity) * 1.1;
      var a = p.angle * Math.PI / 180, x = CX + dist * Math.sin(a), y = CY - dist * Math.cos(a);
      var ux = (x - CX) / dist, uy = (y - CY) / dist;
      var x0 = CX + ux * ME, y0 = CY + uy * ME, x1 = x - ux * R, y1 = y - uy * R;
      var mx = (x0 + x1) / 2 - uy * 14, my = (y0 + y1) / 2 + ux * 14;
      var grad = el('linearGradient', { id: uid + '-g' + i, gradientUnits: 'userSpaceOnUse', x1: x0, y1: y0, x2: x1, y2: y1 });
      grad.appendChild(el('stop', { offset: 0, 'stop-color': '#6756D9' })); grad.appendChild(el('stop', { offset: 1, 'stop-color': '#D85BA9' }));
      defs.appendChild(grad);
      var bridge = el('path', { d: 'M' + x0 + ' ' + y0 + ' Q' + mx + ' ' + my + ' ' + x1 + ' ' + y1, class: 'umfeld__bridge', stroke: 'url(#' + uid + '-g' + i + ')', 'stroke-width': (1.4 + p.resonance * .022).toFixed(2), 'data-bridge': '' });
      if (p.resonance === 0) bridge.style.display = 'none';   /* ohne aktive Resonanz keine Linie, nur Abstand */
      bridges.appendChild(bridge);
      var disc = el('circle', { cx: x, cy: y, r: R - 4, fill: 'url(#' + uid + '-relief)', class: 'relief-disc' });
      discs.appendChild(disc);
      var contour = el('path', { d: openCircle(x, y, R), class: 'umfeld__contour', 'data-contour': '' });
      lines.appendChild(contour);
      var nodes = el('g', { class: 'umfeld__nodes' });
      if (p.resonance > 0) { nodes.appendChild(el('circle', { cx: x0, cy: y0, r: 3.3 })); nodes.appendChild(el('circle', { cx: x1, cy: y1, r: 3.3 })); }
      lines.appendChild(nodes);
      var name = document.createElement('span'); name.className = 'umfeld__name'; name.textContent = p.name;
      name.style.left = x / W * 100 + '%'; name.style.top = y / H * 100 + '%'; stage.appendChild(name);
      var li = document.createElement('li');
      li.innerHTML = '<button type="button" class="umfeld__person" aria-pressed="false"><span class="umfeld__person-name">' + p.name + '</span><span class="umfeld__person-state">' + words(p) + '</span></button>';
      list.appendChild(li);
      var button = li.firstChild;
      button.addEventListener('click', function () { select(i); });
      return { person: p, bridge: bridge, disc: disc, contour: contour, nodes: nodes, name: name, button: button, from: { x: CX + ux * 330, y: CY + uy * 330 }, at: { x: x, y: y } };
    });

    function select(i) {
      parts.forEach(function (q, k) {
        var on = k === i;
        q.button.setAttribute('aria-pressed', String(on));
        q.contour.classList.toggle('is-active', on);
        q.name.classList.toggle('is-active', on);
        q.bridge.classList.toggle('is-active', on);
      });
      var p = parts[i].person;
      var href = link + '?person=' + encodeURIComponent(p.name) + '&proximity=' + p.proximity + '&resonance=' + p.resonance;
      detail.innerHTML = '<' + heading + ' class="t-title">Du &amp; ' + p.name + '</' + heading + '>' +
        '<p class="umfeld__state t-label">' + words(p) + '</p><p class="secondary">' + p.note + '</p>' +
        '<a class="button button--secondary" href="' + href + '">Beziehungsraum öffnen <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/></svg></a>';
    }
    select(0);
    var api = { select: select, parts: { svg: svg, me: lines.querySelector('.umfeld__me'), people: parts } };
    root._umfeld = api;
    return api;
  }
  window.ElanumUmfeld = { mount: mount, people: PEOPLE };
})();
