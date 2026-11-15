/* ============================================================
   ELANUM Beziehungsraum
   Zwei runde, offene Konturen und eine kurze Verbindung. Eine Uhr
   bewegt alle Darstellungen gemeinsam: 3,4 s Raum geben, 4,4 s zur Ruhe
   kommen, maximal 7,5 % Radiusänderung. Kreise bleiben immer rund, die
   Verbindung trifft beide Konturen exakt.

   Lesbar ohne Regler: Bei «weit» stehen die Kreise aussen, bei «sehr nah»
   berühren sie sich im Atem, sie überlappen nie. Resonanz hat vier Stufen
   (keine Linie, fein, kräftig, kräftig mit Glühen). Unter dem Bild steht die
   Skala: alle Stufen von Nähe, Resonanz und Freiraum, die geltende ist
   hervorgehoben. Ohne Skala: data-skala="aus".

   Markup:  <div data-beziehung [data-dark]><svg viewBox="0 0 720 400"></svg>
              <div class="relationship-label" data-person="a">…</div>
              <div class="relationship-label" data-person="b">…</div></div>
   API:     ElanumBeziehung.set(el, {proximity, resonance, openness}, immediate)
            ElanumBeziehung.setMode(el, 'spectrum'|'ink') · setPaused(bool)
            ElanumBeziehung.onPhase(fn) · ElanumBeziehung.redraw()
            ElanumBeziehung.words({proximity, resonance, openness}) · ElanumBeziehung.SCALE
   Als klassisches Skript, damit es auch unter file:// lädt.
   ============================================================ */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var BREATH = 7800, EXPAND = 3400, CALM = 4400;
  var reduced = matchMedia('(prefers-reduced-motion:reduce)');
  var paused = false, elapsed = 0, lastTime = 0, frameId = 0, phaseListeners = [], lastPhase = '';
  var frames = [];
  /* Die Stufen jedes Werts: Name, dann je Stufe [Wort, gilt unterhalb von]. */
  var SCALE = {
    proximity: { label: 'Nähe', steps: [['weit', 34], ['nah', 75], ['sehr nah', Infinity]] },
    resonance: { label: 'Resonanz', steps: [['keine', .5], ['leise', 40], ['spürbar', 80], ['stark', Infinity]] },
    openness: { label: 'Freiraum', steps: [['klein', 30], ['offen', 60], ['weit offen', Infinity]] }
  };
  var KEYS = ['proximity', 'resonance', 'openness'];
  var BRIDGE = [[0, 0], [1.6, .6], [2.8, 1], [4.4, 1]];
  function level(key, value) {
    var steps = SCALE[key].steps, i = 0;
    while (i < steps.length - 1 && value >= steps[i][1]) i++;
    return i;
  }
  function words(values) {
    var out = {};
    KEYS.forEach(function (k) { if (values[k] != null) out[k] = SCALE[k].steps[level(k, values[k])][0]; });
    return out;
  }
  function buildScale(container) {
    if (container.getAttribute('data-skala') === 'aus') return null;
    var dl = document.createElement('dl'), items = {};
    dl.className = 'relationship-scale'; dl.setAttribute('aria-hidden', 'true');
    KEYS.forEach(function (k) {
      var row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = SCALE[k].label;
      items[k] = SCALE[k].steps.map(function (step) {
        var span = document.createElement('span'); span.textContent = step[0]; dd.appendChild(span); return span;
      });
      row.appendChild(dt); row.appendChild(dd); dl.appendChild(row);
    });
    container.appendChild(dl);
    return items;
  }
  function readScale(f) {
    var key = KEYS.map(function (k) { return level(k, f.target[k]); }).join('');
    var label = f.img ? f.container.getAttribute('aria-label') || '' : '';
    if (key === f.scaleKey && label === f.label) return;
    f.scaleKey = key;
    var w = words(f.target);
    if (f.scale) KEYS.forEach(function (k) {
      var on = level(k, f.target[k]);
      f.scale[k].forEach(function (span, i) { if (i === on) span.setAttribute('data-on', ''); else span.removeAttribute('data-on'); });
    });
    if (!f.img) return;
    /* Die Stufen hängen am Text der Einbettung. Setzt sie ihn neu, gilt der neue. */
    if (label !== f.label) f.base = label;
    f.label = (f.base + ' Nähe: ' + w.proximity + '. Resonanz: ' + w.resonance + '. Freiraum: ' + w.openness + '.').trim();
    f.container.setAttribute('aria-label', f.label);
  }
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
      labelA: container.querySelector('[data-person=a]'), labelB: container.querySelector('[data-person=b]'),
      scale: buildScale(container), scaleKey: '', img: container.getAttribute('role') === 'img', base: '', label: null
    };
    frames.push(frame);
    container._beziehung = frame;
    draw(frame, 0);
    observer.observe(container);
    return frame;
  }

  function draw(f, breath) {
    var s = f.current, radius = 128 * (1 + .075 * breath), cy = 200;
    var cxA = 142 + s.proximity * .8, cxB = 720 - cxA;
    [[f.discA, cxA], [f.discB, cxB]].forEach(function (d) { d[0].setAttribute('cx', d[1]); d[0].setAttribute('cy', cy); d[0].setAttribute('r', radius - 5); });
    var half = (6 + s.openness * .54) * Math.PI / 180, dx = radius * Math.sin(half), dy = radius * Math.cos(half);
    var path = function (cx) { return 'M' + (cx - dx) + ' ' + (cy + dy) + ' A' + radius + ' ' + radius + ' 0 1 1 ' + (cx + dx) + ' ' + (cy + dy); };
    f.a.setAttribute('d', path(cxA)); f.b.setAttribute('d', path(cxB));
    var xA = cxA + radius, xB = cxB - radius, distance = xB - xA;
    var bend = Math.min(28, distance * .3) * (1 - .65 * breath);
    f.bridge.setAttribute('d', 'M' + xA + ' ' + cy + ' C' + (xA + distance * .32) + ' ' + (cy + bend) + ' ' + (xB - distance * .32) + ' ' + (cy + bend) + ' ' + xB + ' ' + cy);
    var lvl = level('resonance', s.resonance);
    f.bridge.setAttribute('opacity', BRIDGE[lvl][1] * (.82 + .18 * breath));
    f.bridge.setAttribute('stroke-width', BRIDGE[lvl][0]);
    f.bridge.setAttribute('data-level', lvl);
    f.bridge.setAttribute('stroke', f.mode === 'ink' ? f.ink : 'url(#bz-gradient-' + f.id + ')');
    f.gradient.setAttribute('x1', xA); f.gradient.setAttribute('x2', xB);
    [[f.nodeA, xA], [f.nodeB, xB]].forEach(function (n) { n[0].setAttribute('cx', n[1]); n[0].setAttribute('cy', cy); n[0].setAttribute('opacity', lvl ? 1 : 0); });
    if (f.labelA) f.labelA.style.left = cxA / 720 * 100 + '%';
    if (f.labelB) f.labelB.style.left = cxB / 720 * 100 + '%';
    readScale(f);
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
    words: words, SCALE: SCALE,
    redraw: function () { frames.forEach(function (f) { draw(f, reduced.matches ? 0 : breathAt(elapsed)); }); request(); }
  };
})();
