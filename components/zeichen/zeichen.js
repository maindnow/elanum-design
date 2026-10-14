/* ============================================================
   ELANUM Zeichen
   Das ELANUM-Zeichen in Bewegung. Seine Form bewegt sich nie: Das
   Spektrum liegt unverändert als Bild darunter. Darüber liegt eine
   SVG-Ebene mit Konstruktion oder Glanz, beim Farbatem eine zweite
   Farbstellung desselben Bildes. Gross wie klein.

     aufbau      Zeichenaufbau, einmal, gut 3 s: Konstruktionskreise und
                 Konturen zeichnen sich, dann füllt sich das Spektrum aus
                 der Öffnung. Startet, sobald das Zeichen zu sehen ist.
     lichtlauf   Lichtlauf, dauernd: ein Schimmer wandert im Kreis, 24 s.
     farbatem    Farbatem, dauernd: die Farben atmen im Takt der Atmung,
                 3,4 s Raum geben, 4,4 s zur Ruhe.

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
  /* Konstruktion aus tools/build_logo_circles.py. Diese Zeile nie von Hand ändern. */
  var K = {"viewBox":"144 132 960 960","mitte":[624.65,613.27],"oeffnung":[531.15,632.98,122.6172],"form":"M 1079.8656 543.4426 A 460.54 460.54 0 1 0 1085.1899 613.5839 A 198.3988 198.3988 0 0 1 809 540 A 155.9715 155.9715 0 0 0 1079.8656 543.4426 Z M 653.7672 632.98 A 122.6172 122.6172 0 1 1 408.5328 632.98 A 122.6172 122.6172 0 1 1 653.7672 632.98 Z","kreise":[[624.65,613.27,460.54,"rahmen"],[531.15,632.98,122.6172,"rahmen"],[515.4748,632.98,138.2924,"linie"],[510.8903,595.6422,175.9106,"linie"],[554.9375,614.3391,223.7618,"linie"],[568.0927,639.74,252.3671,"linie"],[528.2331,695.6316,321.016,"linie"],[583.3027,751.7872,252.3671,"linie"],[586.5034,697.9138,198.3988,"linie"],[563.7267,709.072,223.7618,"linie"],[528.7275,659.2732,284.6294,"linie"],[533.6028,623.2147,321.016,"linie"],[945.4157,464.3835,155.9715,"kerbe"],[982.5235,443.8144,198.3988,"kerbe"],[1120.8828,463.9712,321.016,"kante"],[1023.2251,571.2956,175.9106,"kante"],[438.5964,732.893,175.9106,"kante"],[273.3799,948.5087,585.8159,"kante"],[877.9113,554.1529,252.3671,"kante"]],"konturen":[["rahmen","M 1079.8656 543.4426 A 460.54 460.54 0 1 0 1085.1899 613.5839 A 198.3988 198.3988 0 0 1 809 540 A 155.9715 155.9715 0 0 0 1079.8656 543.4426"],["rahmen","M 653.7672 632.98 A 122.6172 122.6172 0 1 1 408.5328 632.98 A 122.6172 122.6172 0 1 1 653.7672 632.98 Z"],["linie","M 653.7672 632.98 A 138.2924 138.2924 0 0 1 532.3284 770.2416 A 175.9106 175.9106 0 0 1 348.9637 526.9084 A 223.7618 223.7618 0 0 1 452.0325 415.6436 A 252.3671 252.3671 0 0 1 714.6248 434.271 A 321.016 321.016 0 0 1 809 540"],["linie","M 481.8643 520.704 A 252.3671 252.3671 0 0 1 598.2697 499.8642 A 198.3988 198.3988 0 0 1 764.6709 610.6304 A 223.7618 223.7618 0 0 1 692.3909 892.1426 A 284.6294 284.6294 0 0 1 490.5911 941.3361 A 321.016 321.016 0 0 1 323.4206 865.8557"],["kante","M 809 540 A 321.016 321.016 0 0 0 904.835 701.4046 A 175.9106 175.9106 0 0 0 1066.9223 741.6925"],["kante","M 323.4206 865.8557 A 175.9106 175.9106 0 0 1 335.0495 590.6869"],["kante","M 781.2218 656.4866 A 585.8159 585.8159 0 0 1 841.0447 803.8127 A 252.3671 252.3671 0 0 0 1041.5869 746.2453"]]};
  var script = document.currentScript;
  var SRC = new URL('../../assets/ELANUM-Master-Spektrum-Harmonic.svg', script ? script.src : location.href).href;
  var VB = K.viewBox.split(' ').map(Number);
  /* Zeitplan des Zeichenaufbaus in ms: [Beginn, Dauer]. Klein läuft er schneller und ohne Hilfskreise. */
  var PLAN = { rahmen: [0, 1000], oeffnung: [150, 700], kreise: [100, 700], kreisVersatz: 45, linie: [600, 1000], kante: [850, 800], spektrum: [1300, 1100], aus: [500, 700] };
  var KLEIN = 120;
  var EASE = { line: 'cubic-bezier(.33,1,.68,1)', move: 'cubic-bezier(.65,0,.35,1)' };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var mounted = [], count = 0;

  function motionOn() { return !reduced.matches && document.body.dataset.motion !== 'off'; }
  function node(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function layerSvg(className) {
    return node('svg', { 'class': 'zeichen__ebene ' + className, viewBox: K.viewBox, 'aria-hidden': 'true', focusable: 'false' });
  }
  /* Kreis als Pfad, oben beginnend und im Uhrzeigersinn: so zeichnet er sich wie eine Kontur. */
  function circlePath(c) {
    var x = c[0], y = c[1], r = c[2];
    return 'M ' + x + ' ' + (y - r) + ' A ' + r + ' ' + r + ' 0 1 1 ' + x + ' ' + (y + r) + ' A ' + r + ' ' + r + ' 0 1 1 ' + x + ' ' + (y - r);
  }
  function wait(ms) { return new Promise(function (done) { setTimeout(done, ms); }); }

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

    if (bewegung === 'lichtlauf') {
      /* Ein weicher Glanz, auf die Form des Zeichens zugeschnitten, kreist um die Mitte. */
      var R = K.kreise[0][2], m = K.mitte;
      layer = layerSvg('zeichen__licht');
      var defs = node('defs', {}, layer);
      node('path', { d: K.form, 'clip-rule': 'evenodd' }, node('clipPath', { id: uid + '-form' }, defs));
      var glanz = node('radialGradient', { id: uid + '-glanz' }, defs);
      [[0, 0.95], [0.45, 0.42], [1, 0]].forEach(function (s) { node('stop', { offset: s[0], 'stop-color': '#FFFFFF', 'stop-opacity': s[1] }, glanz); });
      var schimmer = node('g', { 'class': 'zeichen__schimmer', style: 'transform-origin:' + m[0] + 'px ' + m[1] + 'px' }, node('g', { 'clip-path': 'url(#' + uid + '-form)' }, layer));
      node('ellipse', { cx: m[0], cy: m[1] - R * 0.64, rx: R * 0.56, ry: R * 0.3, fill: 'url(#' + uid + '-glanz)' }, schimmer);
      api.parts.schimmer = schimmer;
    } else if (bewegung === 'farbatem') {
      /* Dasselbe Bild in einer zweiten Farbstellung, im Atemtakt darüber geblendet. */
      layer = img.cloneNode(false);
      layer.removeAttribute('id');
      layer.alt = '';
      layer.className = 'zeichen__ebene zeichen__atem';
      layer.setAttribute('aria-hidden', 'true');
    } else if (bewegung === 'aufbau') {
      layer = layerSvg('zeichen__aufbau');
      /* Hilfskreise laufen über das Zeichen hinaus: ausserhalb des Aussenkreises blenden sie weich aus. */
      var rand = node('radialGradient', { id: uid + '-rand', gradientUnits: 'userSpaceOnUse', cx: K.mitte[0], cy: K.mitte[1], r: K.kreise[0][2] * 1.18 }, node('defs', {}, layer));
      [[0, 1], [0.85, 1], [1, 0]].forEach(function (s) { node('stop', { offset: s[0], 'stop-color': '#FFFFFF', 'stop-opacity': s[1] }, rand); });
      var maske = node('mask', { id: uid + '-maske', maskUnits: 'userSpaceOnUse', x: VB[0], y: VB[1], width: VB[2], height: VB[3] }, layer.firstChild);
      node('rect', { x: VB[0], y: VB[1], width: VB[2], height: VB[3], fill: 'url(#' + uid + '-rand)' }, maske);
      var kreise = node('g', { 'class': 'zeichen__kreise', mask: 'url(#' + uid + '-maske)' }, layer), konturen = node('g', { 'class': 'zeichen__konturen' }, layer);
      api.parts.kreise = K.kreise.map(function (c) {
        return node('path', { d: circlePath(c), pathLength: 1, 'class': 'zeichen__kreis zeichen__kreis--' + c[3] }, kreise);
      });
      api.parts.konturen = K.konturen.map(function (k) {
        return node('path', { d: k[1], pathLength: 1, 'class': 'zeichen__kontur zeichen__kontur--' + k[0] }, konturen);
      });
    }
    if (layer) { root.appendChild(layer); api.parts.ebene = layer; }

    /* ---------- Zeichenaufbau ---------- */
    var hx = (K.oeffnung[0] - VB[0]) / VB[2] * 100, hy = (K.oeffnung[1] - VB[1]) / VB[3] * 100;
    var r0 = K.oeffnung[2] / VB[2] * 100;
    function clip(r) { return 'circle(' + r + '% at ' + hx + '% ' + hy + '%)'; }
    function hold() {
      root.classList.add('is-aufbau');
      img.style.clipPath = clip(0);
    }
    function stop() {
      run++;
      anims.forEach(function (a) { a.cancel(); });
      anims = [];
      img.style.clipPath = '';
      root.classList.remove('is-aufbau');
    }
    function draw(target, at, length, speed) {
      var a = target.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
        { delay: at * speed, duration: length * speed, easing: EASE.line, fill: 'both' });
      anims.push(a);
    }
    function play() {
      if (bewegung !== 'aufbau') return;
      stop();
      if (!motionOn()) return;
      var me = run, width = root.getBoundingClientRect().width || VB[2];
      var klein = width < KLEIN, speed = klein ? 0.7 : 1;
      /* Linien in echten Pixeln, egal wie gross das Zeichen ist */
      root.style.setProperty('--zeichen-einheit', (VB[2] / width).toFixed(3));
      root.classList.toggle('is-klein', klein);
      hold();
      var k = api.parts.konturen;
      draw(k[0], PLAN.rahmen[0], PLAN.rahmen[1], speed);
      draw(k[1], PLAN.oeffnung[0], PLAN.oeffnung[1], speed);
      if (!klein) {
        api.parts.kreise.forEach(function (c, i) { draw(c, PLAN.kreise[0] + i * PLAN.kreisVersatz, PLAN.kreise[1], speed); });
      }
      k.slice(2).forEach(function (c) {
        var p = c.classList.contains('zeichen__kontur--linie') ? PLAN.linie : PLAN.kante;
        draw(c, p[0], p[1], speed);
      });
      /* Das Spektrum füllt sich erst, wenn das Bild bereit ist. */
      var decoded = img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      Promise.all([decoded, wait(PLAN.spektrum[0] * speed)]).then(function () {
        if (me !== run) return;
        var fill = img.animate([{ clipPath: clip(r0 * 0.9) }, { clipPath: clip(60) }],
          { duration: PLAN.spektrum[1] * speed, easing: EASE.move, fill: 'both' });
        var out = layer.animate([{ opacity: 1 }, { opacity: 0 }],
          { delay: PLAN.aus[0] * speed, duration: PLAN.aus[1] * speed, easing: 'ease-in-out', fill: 'both' });
        anims.push(fill, out);
        return out.finished;
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
