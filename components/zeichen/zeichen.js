/* ============================================================
   ELANUM Zeichen
   Das ELANUM-Zeichen in Bewegung. Seine Form bewegt sich nie: Das
   Spektrum liegt unverändert als Bild darunter, nur eine leichte Ebene
   darüber bewegt sich. Gross wie klein.

     aufbau      Zeichenaufbau, einmal, knapp 3 s: Aussenkreis und Öffnung
                 zeichnen sich als feine Linie im Markenspektrum, dann
                 füllt sich das Zeichen sanft mit Farbe. Startet, sobald
                 das Zeichen zu sehen ist.
     lichtlauf   Lichtlauf, dauernd: ein weicher Glanz wandert im Kreis, 24 s.

   Das Spektrum wird nur einmal gezeichnet. Bewegt werden Deckkraft und
   Drehung eigener Ebenen; das rechnet die Grafikkarte, ohne das schwere
   Farbnetz neu zu zeichnen.

   Ohne Skript, bei reduzierter Bewegung und in der Pause
   (body[data-motion=off] und elanum:motion) steht das ruhende Zeichen.
   Tab beendet einen laufenden Zeichenaufbau wie jeden Auftritt.

   Markup: <div class="zeichen" data-zeichen="aufbau"><img src="…/ELANUM-Master-Spektrum-Harmonic.svg" alt="ELANUM" width="960" height="960"></div>
   API: ElanumZeichen.mount(root, { bewegung }) gibt { play(), stop(), parts } zurück.
        mountAll(scope) montiert jedes [data-zeichen]. play() baut neu auf.
   ============================================================ */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  /* Form und Kontur aus tools/build_logo_circles.py. Diese Zeile nie von Hand ändern. */
  var K = {"viewBox":"144 132 960 960","mitte":[624.65,613.27],"radius":460.54,"form":"M 1079.8656 543.4426 A 460.54 460.54 0 1 0 1085.1899 613.5839 A 198.3988 198.3988 0 0 1 809 540 A 155.9715 155.9715 0 0 0 1079.8656 543.4426 Z M 653.7672 632.98 A 122.6172 122.6172 0 1 1 408.5328 632.98 A 122.6172 122.6172 0 1 1 653.7672 632.98 Z","kontur":["M 1079.8656 543.4426 A 460.54 460.54 0 1 0 1085.1899 613.5839 A 198.3988 198.3988 0 0 1 809 540 A 155.9715 155.9715 0 0 0 1079.8656 543.4426","M 653.7672 632.98 A 122.6172 122.6172 0 1 1 408.5328 632.98 A 122.6172 122.6172 0 1 1 653.7672 632.98 Z"]};
  var script = document.currentScript;
  var SRC = new URL('../../assets/ELANUM-Master-Spektrum-Harmonic.svg', script ? script.src : location.href).href;
  var VB = K.viewBox.split(' ').map(Number);
  /* Silhouette als Maske, eingebettet, damit sie auch unter file:// greift */
  var FORM = 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="' + NS + '" viewBox="' + K.viewBox + '"><path fill-rule="evenodd" d="' + K.form + '"/></svg>') + '") 0 0 / 100% 100% no-repeat';
  var SPEKTRUM = ['#6756D9', '#4D7FE8', '#9466DF', '#D85BA9', '#F0719A'];
  /* Zeichenaufbau in ms: Linie, Öffnung, Farbe (nach Linienbeginn), Linie aus (nach Farbbeginn) */
  var PLAN = { linie: [0, 1700], oeffnung: [350, 1200], farbe: [1100, 1400], aus: [800, 900], ein: 400 };
  var SANFT = 'cubic-bezier(.45,0,.2,1)';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var mounted = [], count = 0;

  function motionOn() { return !reduced.matches && document.body.dataset.motion !== 'off'; }
  function node(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function pct(v, axis) { return ((v - VB[axis]) / VB[axis + 2] * 100).toFixed(2) + '%'; }
  function size(v) { return (v / VB[2] * 100).toFixed(2) + '%'; }
  function wait(ms) { return new Promise(function (done) { setTimeout(done, ms); }); }
  function spectrumStops() {
    var stops = getComputedStyle(document.documentElement).getPropertyValue('--spectrum-stops').split(',')
      .map(function (s) { return s.trim(); }).filter(Boolean);
    return stops.length > 1 ? stops : SPEKTRUM;
  }

  function mount(root, opts) {
    if (root._zeichen) return root._zeichen;
    opts = opts || {};
    var uid = 'zeichen' + (++count);
    var bewegung = opts.bewegung || root.getAttribute('data-zeichen') || '';
    root.classList.add('zeichen');
    root.setAttribute('data-zeichen', bewegung);
    var img = root.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.src = SRC; img.alt = 'ELANUM'; img.width = 960; img.height = 960;
      root.appendChild(img);
    }
    img.classList.add('zeichen__bild');
    var api = { play: play, stop: stop, bewegung: bewegung, parts: { bild: img } };
    var layer = null, anims = [], run = 0, observer = null;
    var m = K.mitte, R = K.radius;

    if (bewegung === 'lichtlauf') {
      /* Ein weicher Glanz auf einer eigenen Ebene. Die Maske steht still, nur der Glanz dreht sich. */
      layer = document.createElement('span');
      layer.className = 'zeichen__ebene zeichen__licht';
      layer.setAttribute('aria-hidden', 'true');
      layer.style.setProperty('-webkit-mask', FORM);
      layer.style.setProperty('mask', FORM);
      var schimmer = document.createElement('span');
      schimmer.className = 'zeichen__schimmer';
      schimmer.style.transformOrigin = pct(m[0], 0) + ' ' + pct(m[1], 1);
      schimmer.style.background = 'radial-gradient(' + size(R * 0.56) + ' ' + size(R * 0.3) + ' at ' + pct(m[0], 0) + ' ' + pct(m[1] - R * 0.64, 1) +
        ', #FFFFFFF2, #FFFFFF6B 45%, #FFFFFF00)';
      layer.appendChild(schimmer);
      api.parts.schimmer = schimmer;
    } else if (bewegung === 'aufbau') {
      /* Nur Aussenkontur und Öffnung, als feine Linie im Markenspektrum */
      layer = node('svg', { 'class': 'zeichen__ebene zeichen__aufbau', viewBox: K.viewBox, 'aria-hidden': 'true', focusable: 'false' });
      var dx = Math.sin(110 * Math.PI / 180) * R, dy = -Math.cos(110 * Math.PI / 180) * R, stops = spectrumStops();
      var verlauf = node('linearGradient', { id: uid + '-spektrum', gradientUnits: 'userSpaceOnUse', x1: m[0] - dx, y1: m[1] - dy, x2: m[0] + dx, y2: m[1] + dy }, node('defs', {}, layer));
      stops.forEach(function (c, i) { node('stop', { offset: i / (stops.length - 1), 'stop-color': c }, verlauf); });
      api.parts.kontur = K.kontur.map(function (d) {
        return node('path', { d: d, pathLength: 1, 'class': 'zeichen__linie', stroke: 'url(#' + uid + '-spektrum)' }, layer);
      });
    }
    if (layer) { root.appendChild(layer); api.parts.ebene = layer; }

    /* ---------- Zeichenaufbau ---------- */
    function hold() {
      root.classList.add('is-aufbau');
      img.style.opacity = '0';
    }
    function stop() {
      run++;
      anims.forEach(function (a) { a.cancel(); });
      anims = [];
      img.style.opacity = '';
      root.classList.remove('is-aufbau');
    }
    function animate(target, frames, options) {
      var a = target.animate(frames, Object.assign({ fill: 'both' }, options));
      anims.push(a);
      return a;
    }
    function play() {
      if (bewegung !== 'aufbau') return;
      stop();
      if (!motionOn()) return;
      var me = run, width = root.getBoundingClientRect().width || VB[2];
      /* Linie in echten Pixeln, egal wie gross das Zeichen ist */
      root.style.setProperty('--zeichen-einheit', (VB[2] / width).toFixed(3));
      hold();
      animate(layer, [{ opacity: 0 }, { opacity: 1 }], { duration: PLAN.ein, easing: 'ease-out', fill: 'forwards' });
      var k = api.parts.kontur;
      animate(k[0], [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay: PLAN.linie[0], duration: PLAN.linie[1], easing: SANFT });
      animate(k[1], [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay: PLAN.oeffnung[0], duration: PLAN.oeffnung[1], easing: SANFT });
      /* Die Farbe kommt erst, wenn das Bild bereit ist. */
      var decoded = img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      Promise.all([decoded, wait(PLAN.farbe[0])]).then(function () {
        if (me !== run) return;
        animate(img, [{ opacity: 0 }, { opacity: 1 }], { duration: PLAN.farbe[1], easing: SANFT });
        return animate(layer, [{ opacity: 1 }, { opacity: 0 }], { delay: PLAN.aus[0], duration: PLAN.aus[1], easing: 'ease-in-out' }).finished;
      }).then(function () { if (me === run) stop(); }, function () {});
    }

    if (bewegung === 'aufbau' && motionOn()) {
      /* Bis das Zeichen zu sehen ist, wartet es leer, statt kurz voll dazustehen. */
      hold();
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(function (entries) {
          if (!entries.some(function (e) { return e.isIntersecting; })) return;
          observer.disconnect();
          play();
        }, { threshold: 0.35 });
        observer.observe(root);
      } else play();
    }
    root.classList.add('is-bereit');
    root._zeichen = api;
    mounted.push(api);
    return api;
  }

  function mountAll(scope) {
    return Array.prototype.map.call((scope || document).querySelectorAll('[data-zeichen]'), function (n) { return mount(n); });
  }
  function stopAll() { mounted.forEach(function (api) { api.stop(); }); }

  document.addEventListener('elanum:motion', function (e) { if (e.detail && e.detail.off) stopAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Tab') stopAll(); }, true);
  reduced.addEventListener('change', function () { if (reduced.matches) stopAll(); });

  window.ElanumZeichen = { mount: mount, mountAll: mountAll, src: SRC };
})();
