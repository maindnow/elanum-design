/* ELANUM Beziehungsraum · Seite. Übernimmt Person und Werte aus dem Umfeld (?person=&proximity=&resonance=). */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var frame = $('[data-beziehung]'), params = new URLSearchParams(location.search);
  var person = (params.get('person') || 'Mara').slice(0, 40);
  frame.querySelector('[data-name]').textContent = person;
  ['proximity', 'resonance'].forEach(function (k) {
    var v = params.get(k);
    if (v !== null && v !== '' && !isNaN(+v)) $('#' + k).value = Math.max(0, Math.min(100, +v));
  });
  ElanumBeziehung.mount(frame);
  function update() {
    var s = { proximity: +$('#proximity').value, resonance: +$('#resonance').value, openness: +$('#openness').value };
    var w = {
      proximity: s.proximity < 34 ? 'weit' : s.proximity < 75 ? 'nah' : 'sehr nah',
      resonance: s.resonance === 0 ? 'keine' : s.resonance < 40 ? 'leise' : s.resonance < 80 ? 'spürbar' : 'stark',
      openness: s.openness < 30 ? 'klein' : s.openness < 60 ? 'offen' : 'weit offen'
    };
    Object.keys(w).forEach(function (k) { $('#' + k + 'Value').textContent = w[k]; $('#' + k).setAttribute('aria-valuetext', w[k]); });
    $('#labReading').textContent = 'Du & ' + person + ' · ' + w.proximity + ' · ' + (s.resonance === 0 ? 'keine aktive Resonanz' : w.resonance + 'e Resonanz');
    ElanumBeziehung.set(frame, s);
  }
  ['proximity', 'resonance', 'openness'].forEach(function (id) { $('#' + id).addEventListener('input', update); });
  update();
  var reduced = matchMedia('(prefers-reduced-motion: reduce)'), paused = false;
  var toggle = $('[data-motion-toggle]');
  function sync() {
    var off = paused || reduced.matches;
    document.body.dataset.motion = off ? 'off' : 'on';
    ElanumBeziehung.setPaused(paused);
    toggle.setAttribute('aria-pressed', String(off)); toggle.disabled = reduced.matches;
    toggle.textContent = reduced.matches ? 'Bewegung reduziert' : paused ? 'Bewegung fortsetzen' : 'Bewegung pausieren';
    document.dispatchEvent(new CustomEvent('elanum:motion', { detail: { off: off } }));
  }
  toggle.addEventListener('click', function () { paused = !paused; sync(); });
  reduced.addEventListener('change', sync);
  sync();
})();
