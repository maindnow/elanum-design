/* ELANUM Zeichen · Seite. Montiert die Zeichen, baut auf Wunsch neu auf und pausiert alles. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  ElanumZeichen.mountAll();
  Array.prototype.forEach.call(document.querySelectorAll('[data-zeichen-nochmals]'), function (button) {
    button.addEventListener('click', function () {
      Array.prototype.forEach.call(button.closest('.bewegung').querySelectorAll('[data-zeichen=aufbau]'), function (n) { n._zeichen.play(); });
    });
  });
  var reduced = matchMedia('(prefers-reduced-motion: reduce)'), paused = false;
  var toggle = $('[data-motion-toggle]');
  function sync() {
    var off = paused || reduced.matches;
    document.body.dataset.motion = off ? 'off' : 'on';
    toggle.setAttribute('aria-pressed', String(off)); toggle.disabled = reduced.matches;
    toggle.textContent = reduced.matches ? 'Bewegung reduziert' : paused ? 'Bewegung fortsetzen' : 'Bewegung pausieren';
    Array.prototype.forEach.call(document.querySelectorAll('[data-zeichen-nochmals]'), function (b) { b.disabled = off; });
    document.dispatchEvent(new CustomEvent('elanum:motion', { detail: { off: off } }));
  }
  toggle.addEventListener('click', function () { paused = !paused; sync(); });
  reduced.addEventListener('change', sync);
  sync();
})();
