/* ============================================================
   ELANUM Beziehungsraum
   Zwei Menschen, jeder Wert mit eigenem Zeichen:
   - Nähe ist der Abstand der zwei Personenkreise. Sie überlappen nie.
   - Freiraum ist die helle Fläche um jede Person. Eine feine Linie zeigt,
     wie gross sie höchstens wird. In der Mitte endet der eigene Platz dort,
     wo der des anderen beginnt.
   - Resonanz ist das Feld um beide: null bis drei leuchtende Linien, die
     übrigen stehen gepunktet da.
   Unter dem Bild stehen die drei Werte als Wort. Ohne: data-skala="aus".
   Eine Uhr bewegt alle Darstellungen gemeinsam: 3,4 s Raum geben, 4,4 s zur
   Ruhe kommen. Es atmet nur der Freiraum (höchstens 5 %) und das Leuchten.

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
  /* Masse im SVG-Raum 720 × 400. */
  var CY = 170, PERSON = 50, ROOM = [66, 112], ROOM_MAX = 118, FIELD = [132, 146, 160], GAP = [190, 10];
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
      dt.textContent = SCALE[k].label; items[k] = dd;
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
    if (f.scale) KEYS.forEach(function (k) { f.scale[k].textContent = w[k]; });
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
    var id = frames.length, ink = dark ? '#E8EEEA' : '#16363B', quiet = dark ? '#CBD9D6' : '#3D5055';
    var defs = svgEl('defs', {});
    var gradient = svgEl('linearGradient', { id: 'bz-gradient-' + id, gradientUnits: 'userSpaceOnUse', x1: 0, y1: CY, x2: 720, y2: CY });
    var colors = dark ? ['#B4A4FF', '#8DBBFF', '#D7B0F1', '#F4A5C7', '#F9B8CD'] : ['#6756D9', '#4D7FE8', '#9466DF', '#D85BA9', '#F0719A'];
    [0, .28, .53, .77, 1].forEach(function (o, i) { gradient.appendChild(svgEl('stop', { offset: o, 'stop-color': colors[i] })); });
    var relief = svgEl('linearGradient', { id: 'bz-relief-' + id, x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
    relief.appendChild(svgEl('stop', { offset: 0, 'stop-color': dark ? '#4A686E' : '#FCF9F0' }));
    relief.appendChild(svgEl('stop', { offset: 1, 'stop-color': dark ? '#2A474D' : '#E2DBCD' }));
    /* Der eigene Platz endet in der Mitte, wo der des anderen beginnt. */
    var clipA = svgEl('clipPath', { id: 'bz-left-' + id }), clipB = svgEl('clipPath', { id: 'bz-right-' + id });
    clipA.appendChild(svgEl('rect', { x: 0, y: 0, width: 358.5, height: 400 }));
    clipB.appendChild(svgEl('rect', { x: 361.5, y: 0, width: 358.5, height: 400 }));
    [gradient, relief, clipA, clipB].forEach(function (n) { defs.appendChild(n); });
    svg.appendChild(defs);
    var field = FIELD.map(function () {
      var n = svgEl('path', { fill: 'none', 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', 'data-field': '' });
      svg.appendChild(n); return n;
    });
    var side = function (clip) {
      var g = svgEl('g', { 'clip-path': 'url(#' + clip + id + ')' });
      var limit = svgEl('circle', { cy: CY, r: ROOM_MAX, fill: 'none', stroke: quiet, 'stroke-width': 1, opacity: dark ? .3 : .4, 'vector-effect': 'non-scaling-stroke', 'data-room-limit': '' });
      var room = svgEl('circle', { cy: CY, fill: dark ? '#DCE8E4' : '#16363B', opacity: dark ? .2 : .1, 'data-room': '' });
      g.appendChild(limit); g.appendChild(room); svg.appendChild(g);
      return { limit: limit, room: room };
    };
    var roomA = side('bz-left-'), roomB = side('bz-right-');
    var disc = function () { var n = svgEl('circle', { cy: CY, r: PERSON, fill: 'url(#bz-relief-' + id + ')', class: 'relief-disc' }); svg.appendChild(n); return n; };
    var discA = disc(), discB = disc();
    var contour = function () { var n = svgEl('circle', { cy: CY, r: PERSON, fill: 'none', stroke: ink, 'stroke-width': 1.6, 'vector-effect': 'non-scaling-stroke', 'data-contour': '' }); svg.appendChild(n); return n; };
    var a = contour(), b = contour();
    var start = {
      proximity: +(container.getAttribute('data-proximity') || 58),
      resonance: +(container.getAttribute('data-resonance') || 72),
      openness: +(container.getAttribute('data-openness') || 34)
    };
    var frame = {
      container: container, svg: svg, gradient: gradient, field: field, roomA: roomA, roomB: roomB, discA: discA, discB: discB, a: a, b: b,
      ink: ink, quiet: quiet, id: id, mode: 'spectrum', visible: false, target: Object.assign({}, start), current: Object.assign({}, start),
      labelA: container.querySelector('[data-person=a]'), labelB: container.querySelector('[data-person=b]'), width: 0, wide: 0,
      scale: buildScale(container), scaleKey: '', img: container.getAttribute('role') === 'img', base: '', label: null
    };
    frames.push(frame);
    container._beziehung = frame;
    measure(frame);
    draw(frame, 0);
    observer.observe(container);
    if (sizes) sizes.observe(container);
    return frame;
  }

  /* Die Namen stehen unter den Personen. Stehen zwei Menschen sehr nah, rücken
     die Namen so weit auseinander, dass sie sich nicht berühren. */
  function measure(f) {
    f.width = f.svg.getBoundingClientRect().width;
    f.wide = ((f.labelA ? f.labelA.offsetWidth : 0) + (f.labelB ? f.labelB.offsetWidth : 0)) / 2 + 16;
    var tall = Math.max(f.labelA ? f.labelA.offsetHeight : 0, f.labelB ? f.labelB.offsetHeight : 0);
    f.svg.style.marginBottom = Math.max(0, Math.ceil(tall - f.width * 54 / 720)) + 'px';
  }

  function draw(f, breath) {
    var s = f.current;
    var gap = GAP[0] + (GAP[1] - GAP[0]) * s.proximity / 100;
    var cxA = 360 - gap / 2 - PERSON, cxB = 720 - cxA;
    var room = (ROOM[0] + (ROOM[1] - ROOM[0]) * Math.max(0, Math.min(100, s.openness)) / 100) * (1 + .05 * breath);
    [[f.roomA, cxA], [f.roomB, cxB]].forEach(function (r) {
      r[0].limit.setAttribute('cx', r[1]); r[0].room.setAttribute('cx', r[1]); r[0].room.setAttribute('r', room);
    });
    [[f.discA, cxA], [f.discB, cxB], [f.a, cxA], [f.b, cxB]].forEach(function (d) { d[0].setAttribute('cx', d[1]); });
    var lvl = level('resonance', s.resonance);
    f.field.forEach(function (n, i) {
      var R = FIELD[i], on = i < lvl;
      n.setAttribute('d', 'M' + cxA + ' ' + (CY - R) + 'L' + cxB + ' ' + (CY - R) + 'A' + R + ' ' + R + ' 0 0 1 ' + cxB + ' ' + (CY + R) + 'L' + cxA + ' ' + (CY + R) + 'A' + R + ' ' + R + ' 0 0 1 ' + cxA + ' ' + (CY - R) + 'Z');
      n.setAttribute('stroke', on ? (f.mode === 'ink' ? f.ink : 'url(#bz-gradient-' + f.id + ')') : f.quiet);
      n.setAttribute('stroke-width', on ? 1.8 : 1);
      n.setAttribute('stroke-dasharray', on ? 'none' : '1 5');
      n.setAttribute('opacity', on ? .86 + .14 * breath : .5);
      if (on) n.setAttribute('data-on', ''); else n.removeAttribute('data-on');
    });
    f.gradient.setAttribute('x1', cxA - FIELD[2]); f.gradient.setAttribute('x2', cxB + FIELD[2]);
    var push = f.width ? Math.max(0, (f.wide - (cxB - cxA) / 720 * f.width) / 2) : 0;
    if (f.labelA) f.labelA.style.left = 'calc(' + cxA / 720 * 100 + '% - ' + push + 'px)';
    if (f.labelB) f.labelB.style.left = 'calc(' + cxB / 720 * 100 + '% + ' + push + 'px)';
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
  var sizes = window.ResizeObserver ? new ResizeObserver(function (entries) {
    entries.forEach(function (e) { var f = e.target._beziehung; if (f) { measure(f); draw(f, reduced.matches ? 0 : breathAt(elapsed)); } });
  }) : null;
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { frames.forEach(function (f) { measure(f); draw(f, reduced.matches ? 0 : breathAt(elapsed)); }); });
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
