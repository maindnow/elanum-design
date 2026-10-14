/* ============================================================
   ELANUM Gerätevorschau
   Zeigt die App-Screens als echte Seiten in Rahmen: Telefon und
   Desktop nebeneinander oder in freier Breite von 320 bis 1440 px.
   Für den Atlas und die Übersicht unter components/app/. Nicht Teil
   des Pakets.

   API: ElanumVorschau.mount(root, { base: 'components/app/' })
        ElanumVorschau.setMotion(off)  Pause an alle Rahmen weitergeben
   ============================================================ */
(function () {
  'use strict';
  var SCREENS = [
    { id: 'heute', label: 'Heute', kosmos: 'Resonanzkosmos' },
    { id: 'ich', label: 'Ich', kosmos: 'Resonanzkosmos' },
    { id: 'umfeld', label: 'Umfeld', kosmos: 'Resonanzkosmos' },
    { id: 'weg', label: 'Weg', kosmos: 'Resonanzkosmos' },
    { id: 'entdecken', label: 'Entdecken', kosmos: 'Datingkosmos' },
    { id: 'chats', label: 'Chats', kosmos: 'Datingkosmos' },
    { id: 'aktivitaeten', label: 'Aktivitäten', kosmos: 'Erlebniskosmos' },
    { id: 'ankommen', label: 'Ankommen', kosmos: 'Erster Start' }
  ];
  var PRESETS = [[360, 'Kleines Telefon'], [390, 'Telefon'], [834, 'Tablet'], [1280, 'Laptop'], [1440, 'Desktop']];
  var motionOff = false, frames = [];
  function heightFor(w) { return w < 600 ? 844 : w < 1024 ? 1112 : 800; }
  function formFor(w) { return w < 600 ? 'Leiste unten' : w < 1024 ? 'Schiene' : 'Seitenleiste'; }
  function send(frame) { try { frame.contentWindow.postMessage({ elanum: 'motion', off: motionOff }, '*'); } catch (e) { /* Rahmen noch leer */ } }

  var count = 0;
  function mount(root, opts) {
    opts = opts || {};
    var base = opts.base || '', uid = 'vs' + (++count);
    var state = { screen: 'heute', mode: 'pair', width: 390 };
    root.classList.add('vorschau');
    root.innerHTML =
      '<div class="vorschau__bar">' +
        '<div class="vorschau__screens" role="group" aria-label="Screen wählen">' + SCREENS.map(function (s) {
          return '<button type="button" class="glow-edge" data-screen="' + s.id + '" aria-pressed="' + (s.id === state.screen) + '"><span>' + s.label + '</span><small>' + s.kosmos + '</small></button>';
        }).join('') + '</div>' +
        '<div class="segmented vorschau__mode" role="group" aria-label="Ansicht">' +
          '<button type="button" class="glow-edge" data-mode="pair" aria-pressed="true">Telefon und Desktop</button>' +
          '<button type="button" class="glow-edge" data-mode="free" aria-pressed="false">Freie Breite</button></div>' +
      '</div>' +
      '<div class="vorschau__width" hidden>' +
        '<div class="vorschau__width-head"><label for="' + uid + '-w">Breite</label><output id="' + uid + '-out" for="' + uid + '-w"></output></div>' +
        '<input type="range" id="' + uid + '-w" min="320" max="1440" step="2" value="390">' +
        '<div class="vorschau__presets">' + PRESETS.map(function (p) { return '<button type="button" class="glow-edge" data-preset="' + p[0] + '">' + p[1] + ' · ' + p[0] + '</button>'; }).join('') + '</div>' +
      '</div>' +
      '<div class="vorschau__stage"></div>';
    var stage = root.querySelector('.vorschau__stage'), range = root.querySelector('input[type=range]'), out = root.querySelector('output');

    function device(kind, w) {
      var s = SCREENS.filter(function (x) { return x.id === state.screen; })[0];
      var fig = document.createElement('figure');
      fig.className = 'device device--' + kind;
      fig.innerHTML = '<div class="device__frame"><iframe loading="lazy" title="ELANUM App, ' + s.label + ', ' + (kind === 'desktop' ? 'Desktop' : kind === 'phone' ? 'Telefon' : 'freie Breite') + '"></iframe></div>' +
        '<figcaption><span data-caption></span><a class="vorschau__open" href="' + base + s.id + '.html" target="_blank" rel="noopener">Einzeln öffnen</a></figcaption>';
      var frame = fig.querySelector('iframe');
      frame.src = base + s.id + '.html';
      frame.addEventListener('load', function () { send(frame); });
      fig._w = w;
      return fig;
    }
    function build() {
      stage.innerHTML = ''; frames = frames.filter(function (f) { return f.isConnected; });
      stage.dataset.mode = state.mode;
      if (state.mode === 'pair') { stage.appendChild(device('phone', 390)); stage.appendChild(device('desktop', 1280)); }
      else stage.appendChild(device('free', state.width));
      stage.querySelectorAll('iframe').forEach(function (f) { frames.push(f); });
      layout();
    }
    /* Jeder Rahmen hat seine echte Breite; skaliert wird nur die Darstellung. */
    function place(fig, w, scale) {
      var h = heightFor(w), frame = fig.querySelector('iframe'), box = fig.querySelector('.device__frame');
      frame.width = w; frame.height = h;
      frame.style.width = w + 'px'; frame.style.height = h + 'px';
      frame.style.transform = 'scale(' + scale + ')';
      box.style.width = Math.round(w * scale) + 'px'; box.style.height = Math.round(h * scale) + 'px';
      fig.querySelector('[data-caption]').textContent = w + ' px · ' + formFor(w) + (scale < 0.995 ? ' · ' + Math.round(scale * 100) + ' %' : '');
    }
    function layout() {
      var W = stage.clientWidth || 360, figs = stage.querySelectorAll('.device');
      if (state.mode === 'pair') {
        var side = W >= 900, gap = 40;
        var sp = side ? Math.min(0.8, (W * 0.34) / 390) : Math.min(1, W / 390);
        var sd = side ? Math.min(1, (W - 390 * sp - gap) / 1280) : W / 1280;
        stage.classList.toggle('is-side', side);
        place(figs[0], 390, sp); place(figs[1], 1280, sd);
      } else {
        var w = state.width, h = heightFor(w);
        place(figs[0], w, Math.min(1, W / w, 880 / h));
        out.textContent = w + ' px · ' + formFor(w);
        range.setAttribute('aria-valuetext', w + ' Pixel, ' + formFor(w));
      }
    }
    root.querySelector('.vorschau__screens').addEventListener('click', function (e) {
      var b = e.target.closest('[data-screen]'); if (!b) return;
      state.screen = b.dataset.screen;
      root.querySelectorAll('[data-screen]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      build();
    });
    root.querySelector('.vorschau__mode').addEventListener('click', function (e) {
      var b = e.target.closest('[data-mode]'); if (!b) return;
      state.mode = b.dataset.mode;
      root.querySelectorAll('[data-mode]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      root.querySelector('.vorschau__width').hidden = state.mode !== 'free';
      build();
    });
    /* Ziehen ändert nur die Breite des Rahmens; neu geladen wird nichts. */
    range.addEventListener('input', function () { state.width = +range.value; var f = stage.querySelector('.device'); if (f) { f._w = state.width; layout(); } });
    root.querySelector('.vorschau__presets').addEventListener('click', function (e) {
      var b = e.target.closest('[data-preset]'); if (!b) return;
      state.width = +b.dataset.preset; range.value = state.width; layout();
    });
    if (window.ResizeObserver) new ResizeObserver(layout).observe(stage); else addEventListener('resize', layout);
    build();
    return { select: function (id) { var b = root.querySelector('[data-screen="' + id + '"]'); if (b) b.click(); } };
  }

  window.ElanumVorschau = {
    mount: mount,
    screens: SCREENS,
    setMotion: function (off) { motionOff = !!off; frames.forEach(send); }
  };
})();
