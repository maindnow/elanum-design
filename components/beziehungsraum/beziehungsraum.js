/* ============================================================
   ELANUM Beziehungsraum
   Zwei runde, offene Konturen und eine kurze Verbindung. Eine Uhr
   bewegt alle Darstellungen gemeinsam: 3,4 s Raum geben, 4,4 s zur Ruhe
   kommen, maximal 7,5 % Radiusänderung. Kreise bleiben immer rund, die
   Verbindung trifft beide Konturen exakt.

   Markup:  <div data-beziehung [data-dark]><svg viewBox="0 0 720 400"></svg>
              <div class="relationship-label" data-person="a">…</div>
              <div class="relationship-label" data-person="b">…</div></div>
   API:     ElanumBeziehung.set(el, {proximity, resonance, openness}, immediate)
            ElanumBeziehung.setMode(el, 'spectrum'|'ink') · setPaused(bool)
            ElanumBeziehung.onPhase(fn) · ElanumBeziehung.redraw()
   Als klassisches Skript, damit es auch unter file:// lädt.
   ============================================================ */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var BREATH = 7800, EXPAND = 3400, CALM = 4400;
  var reduced = matchMedia('(prefers-reduced-motion:reduce)');
  var paused = false, elapsed = 0, lastTime = 0, frameId = 0, phaseListeners = [], lastPhase = '';
  var frames = [];

  function svgEl(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function breathAt(t) {
    t = t % BREATH;
    return t < EXPAND ? (1 - Math.cos(Math.PI * t / EXPAND)) / 2 : (1 + Math.cos(Math.PI * (t - EXPAND) / CALM)) / 2;
  }
  function moving() { return !paused && !reduced.matches && !document.hidden; }

  function mount(container) {
    if (container._beziehung) return container._beziehung;
    var svg = container.querySelector('svg'), dark = container.hasAttribute('data-dark');
    var id = frames.length, ink = dark ? '#E8EEEA' : '#16363B';
    var defs = svgEl('defs', {});
    var gradient = svgEl('linearGradient', { id: 'bz-gradient-' + id, gradientUnits: 'userSpaceOnUse', x1: 320, y1: 200, x2: 400, y2: 200 });
    var colors = dark ? ['#B4A4FF', '#8DBBFF', '#D7B0F1', '#F4A5C7', '#F9B8CD'] : ['#6756D9', '#4D7FE8', '#9466DF', '#D85BA9', '#F0719A'];
    [0, .28, .53, .77, 1].forEach(function (o, i) { gradient.appendChild(svgEl('stop', { offset: o, 'stop-color': colors[i] })); });
    var relief = svgEl('linearGradient', { id: 'bz-relief-' + id, x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
    relief.appendChild(svgEl('stop', { offset: 0, 'stop-color': dark ? '#365359' : '#FCF9F0' }));
    relief.appendChild(svgEl('stop', { offset: 1, 'stop-color': dark ? '#1A343A' : '#E2DBCD' }));
    defs.appendChild(gradient); defs.appendChild(relief); svg.appendChild(defs);
    var discA = svgEl('circle', { fill: 'url(#bz-relief-' + id + ')', class: 'relief-disc' }), discB = discA.cloneNode();
    var contour = function () { return svgEl('path', { fill: 'none', stroke: ink, 'stroke-width': 1.6, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', 'data-contour': '' }); };
    var a = contour(), b = contour();
    var bridge = svgEl('path', { fill: 'none', stroke: 'url(#bz-gradient-' + id + ')', 'stroke-width': 2.8, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', 'data-bridge': '' });
    var nodeA = svgEl('circle', { r: 3.3, fill: ink, 'data-node': '' }), nodeB = nodeA.cloneNode();
    [discA, discB, a, b, bridge, nodeA, nodeB].forEach(function (n) { svg.appendChild(n); });
    var start = {
      proximity: +(container.getAttribute('data-proximity') || 58),
      resonance: +(container.getAttribute('data-resonance') || 72),
      openness: +(container.getAttribute('data-openness') || 34)
    };
    var frame = {
      container: container, gradient: gradient, discA: discA, discB: discB, a: a, b: b, bridge: bridge, nodeA: nodeA, nodeB: nodeB,
      ink: ink, id: id, mode: 'spectrum', visible: false, target: Object.assign({}, start), current: Object.assign({}, start),
      labelA: container.querySelector('[data-person=a]'), labelB: container.querySelector('[data-person=b]')
    };
    frames.push(frame);
    container._beziehung = frame;
    draw(frame, 0);
    observer.observe(container);
    return frame;
  }

  function draw(f, breath) {
    var s = f.current, radius = 128 * (1 + .075 * breath), cy = 200;
    var cxA = 172 + s.proximity * .4, cxB = 720 - cxA;
    [[f.discA, cxA], [f.discB, cxB]].forEach(function (d) { d[0].setAttribute('cx', d[1]); d[0].setAttribute('cy', cy); d[0].setAttribute('r', radius - 5); });
    var half = (8 + s.openness * .4) * Math.PI / 180, dx = radius * Math.sin(half), dy = radius * Math.cos(half);
    var path = function (cx) { return 'M' + (cx - dx) + ' ' + (cy + dy) + ' A' + radius + ' ' + radius + ' 0 1 1 ' + (cx + dx) + ' ' + (cy + dy); };
    f.a.setAttribute('d', path(cxA)); f.b.setAttribute('d', path(cxB));
    var xA = cxA + radius, xB = cxB - radius, distance = xB - xA;
    var bend = Math.min(28, distance * .3) * (1 - .65 * breath);
    f.bridge.setAttribute('d', 'M' + xA + ' ' + cy + ' C' + (xA + distance * .32) + ' ' + (cy + bend) + ' ' + (xB - distance * .32) + ' ' + (cy + bend) + ' ' + xB + ' ' + cy);
    f.bridge.setAttribute('opacity', s.resonance <= .5 ? 0 : (.25 + .75 * s.resonance / 100) * (.82 + .18 * breath));
    f.bridge.setAttribute('stroke-width', 1.5 + s.resonance * .018);
    f.bridge.setAttribute('stroke', f.mode === 'ink' ? f.ink : 'url(#bz-gradient-' + f.id + ')');
    f.gradient.setAttribute('x1', xA); f.gradient.setAttribute('x2', xB);
    [[f.nodeA, xA], [f.nodeB, xB]].forEach(function (n) { n[0].setAttribute('cx', n[1]); n[0].setAttribute('cy', cy); n[0].setAttribute('opacity', s.resonance <= .5 ? 0 : 1); });
    if (f.labelA) f.labelA.style.left = cxA / 720 * 100 + '%';
    if (f.labelB) f.labelB.style.left = cxB / 720 * 100 + '%';
  }

  function unsettled(f) { return Object.keys(f.target).some(function (k) { return Math.abs(f.target[k] - f.current[k]) > .02; }); }
  function phaseText() {
    if (reduced.matches) return 'Reduzierte Bewegung · ruhende Darstellung';
    if (paused) return 'Bewegung pausiert';
    return elapsed % BREATH < EXPAND ? 'Raum geben' : 'Zur Ruhe kommen';
  }
  function render(time) {
    frameId = 0;
    var dt = lastTime ? Math.min(48, time - lastTime) : 0; lastTime = time;
    var anyVisible = frames.some(function (f) { return f.visible; });
    if (moving() && anyVisible) elapsed += dt;
    var smoothing = reduced.matches ? 1 : 1 - Math.exp(-dt / 75), busy = false;
    var breath = reduced.matches ? 0 : breathAt(elapsed);
    frames.forEach(function (f) {
      Object.keys(f.target).forEach(function (k) {
        f.current[k] += (f.target[k] - f.current[k]) * smoothing;
        if (Math.abs(f.target[k] - f.current[k]) < .02) f.current[k] = f.target[k];
      });
      if (unsettled(f)) busy = true;
      if (f.visible) draw(f, breath);
    });
    var phase = phaseText();
    if (phase !== lastPhase) { lastPhase = phase; phaseListeners.forEach(function (fn) { fn(phase); }); }
    if ((moving() && anyVisible) || busy) frameId = requestAnimationFrame(render); else lastTime = 0;
  }
  function request() { if (!frameId) { lastTime = 0; frameId = requestAnimationFrame(render); } }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var f = e.target._beziehung; if (!f) return;
      f.visible = e.isIntersecting;
      if (f.visible) draw(f, reduced.matches ? 0 : breathAt(elapsed));
    });
    request();
  }, { threshold: .05 });
  document.addEventListener('visibilitychange', function () { lastTime = 0; request(); });
  reduced.addEventListener('change', function () { frames.forEach(function (f) { draw(f, 0); }); request(); });

  window.ElanumBeziehung = {
    mount: mount,
    mountAll: function (root) { (root || document).querySelectorAll('[data-beziehung]').forEach(mount); return frames; },
    set: function (el, values, immediate) {
      var f = mount(el);
      Object.keys(values).forEach(function (k) { f.target[k] = values[k]; if (immediate || reduced.matches) f.current[k] = values[k]; });
      if (immediate) draw(f, reduced.matches ? 0 : breathAt(elapsed));
      request();
    },
    setMode: function (el, mode) { var f = mount(el); f.mode = mode; draw(f, reduced.matches ? 0 : breathAt(elapsed)); },
    setPaused: function (value) { paused = value; request(); },
    isPaused: function () { return paused; },
    onPhase: function (fn) { phaseListeners.push(fn); fn(phaseText()); },
    redraw: function () { frames.forEach(function (f) { draw(f, reduced.matches ? 0 : breathAt(elapsed)); }); request(); }
  };
})();
