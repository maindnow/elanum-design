/* ============================================================
   ELANUM Button 4.13 · Antwort am Ort der Handlung
   Wer etwas speichert oder sendet, sieht drei Zustände am selben
   Knopf: Ruhe, läuft, bestätigt. Darstellung in base.css.

     ElanumButton.commit(button, work, opts)
       work   Funktion, die ein Promise liefert, oder ein Promise
       opts   { busy: 'Wird gesendet', done: 'Gesendet', back: 2400 }
              busy und done auch als data-busy und data-done am Knopf.
              back: nach so vielen Millisekunden zurück zur Ruhe.
              back: 0 lässt den Knopf bestätigt stehen.

   Liefert ein Promise mit dem Ergebnis von work, sobald der Knopf
   «bestätigt» zeigt. «läuft» erscheint erst nach 300 ms, damit bei
   schneller Antwort nichts blitzt, und bleibt dann mindestens 400 ms.
   Scheitert work, kehrt der Knopf zur Ruhe zurück und das Promise
   scheitert mit; den Fehler zeigt die Seite als Status.

   «läuft» trägt aria-busy. Beide Zustände werden angesagt (role=status).
   Solange der Knopf nicht in Ruhe ist, löst ein Klick nichts aus.
   ============================================================ */
(function () {
  'use strict';
  var WARTEN = 300, MINDESTENS = 400, ZURUECK = 2400;
  var HAKEN = '<svg class="icon" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* Ansage neben dem Knopf: Ein Wechsel im Knopf selbst wird nicht verlässlich vorgelesen. */
  function sage(button, text) {
    var live = button._elanumLive;
    if (!live || !live.isConnected) {
      live = document.createElement('span');
      live.className = 'visually-hidden';
      live.setAttribute('role', 'status');
      button.insertAdjacentElement('afterend', live);
      button._elanumLive = live;
    }
    live.textContent = text;
  }

  function commit(button, work, opts) {
    opts = opts || {};
    if (button._elanumCommit) return button._elanumCommit;
    var ruhe = button.innerHTML, name = button.getAttribute('aria-label');
    var busy = opts.busy || button.getAttribute('data-busy') || 'Einen Moment';
    var done = opts.done || button.getAttribute('data-done') || 'Erledigt';
    var back = opts.back == null ? ZURUECK : opts.back;
    var nurZeichen = button.classList.contains('button--icon');
    var gezeigt = 0;

    button.style.minWidth = Math.ceil(button.getBoundingClientRect().width) + 'px';
    button.setAttribute('aria-disabled', 'true');
    sage(button, '');                 /* Ansage früh anlegen: Ein Bereich, der mit Text entsteht, wird oft nicht vorgelesen */

    function zeige(zustand, zeichen, wort) {
      button.innerHTML = '<span class="button__sign button__sign--' + zustand + '" aria-hidden="true">' + zeichen + '</span>' +
        (nurZeichen ? '' : '<span>' + esc(wort) + '</span>');
      if (nurZeichen) button.setAttribute('aria-label', wort);
      sage(button, wort);
    }
    function zurRuhe() {
      button.removeAttribute('aria-busy');
      button.removeAttribute('data-state');
      button.removeAttribute('aria-disabled');
      button.innerHTML = ruhe;
      if (name != null) button.setAttribute('aria-label', name); else button.removeAttribute('aria-label');
      button.style.minWidth = '';
      button._elanumCommit = null;
      if (button._elanumLive) button._elanumLive.textContent = '';
    }

    var uhr = setTimeout(function () {
      gezeigt = Date.now();
      button.setAttribute('aria-busy', 'true');
      zeige('busy', '', busy);
    }, WARTEN);

    var lauf = Promise.resolve().then(function () { return typeof work === 'function' ? work() : work; }).then(function (wert) {
      clearTimeout(uhr);
      var rest = gezeigt ? Math.max(0, MINDESTENS - (Date.now() - gezeigt)) : 0;
      return new Promise(function (weiter) {
        setTimeout(function () {
          button.removeAttribute('aria-busy');
          button.setAttribute('data-state', 'done');
          zeige('done', HAKEN, done);
          if (back) setTimeout(zurRuhe, back);
          weiter(wert);
        }, rest);
      });
    }, function (fehler) {
      clearTimeout(uhr);
      zurRuhe();
      throw fehler;
    });
    button._elanumCommit = lauf;
    return lauf;
  }

  /* Solange ein Knopf läuft oder bestätigt zeigt, löst ein Klick nichts aus. */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.button[aria-disabled=true]');
    if (b) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  window.ElanumButton = { commit: commit };
})();
