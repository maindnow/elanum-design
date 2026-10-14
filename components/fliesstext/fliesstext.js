/* ============================================================
   ELANUM Fliesstext 4.11
   Ein gesetzter Text, der zu einem Menschen spricht. Kernaussagen sind
   leise unterstrichen. Am Ende jeder Aussage steht für jedes Element,
   aus dem sie stammt, eine runde Quelle mit dessen Icon. Antippen
   markiert die Aussage und öffnet die Quellenkarte „Woher kommt diese
   Aussage?“ mit dem Satz, dem Element und seiner Herleitung.

   Zwei Stufen:
     .fliesstext            Stimme: Yrsa in der Stufe Titel, für den Moment,
                            in dem ELANUM zu dir spricht (z. B. dein erstes Muster)
     .fliesstext--leise     Text: Albert Sans in der Stufe Text, in Karten

   Markup (ohne Skript bleibt es ein ruhiger Text mit Unterstrich):
     <div class="fliesstext" data-fliesstext>
       <p><mark class="fliesstext__aussage" data-quellen="human-design astrology">Ein Satz.</mark> Weiter im Text.</p>
     </div>
     <ul class="fliesstext-legende" data-fliesstext-legende="astrology numerology human-design"></ul>
   data-quellen nennt Elemente des Resonanzrads (items[].id). Farbe und
   Icon kommen aus ihrem Bereich, nie eine eigene Farbe je Quelle.

   API:  ElanumFliesstext.mount(root, { quellen, titel }) gibt { open(aussage, id), close() }
           quellen   { 'human-design': { text, href }, … } oder function (id, aussage)
           titel     Titel der Quellenkarte, Standard „Woher kommt diese Aussage?“
         ElanumFliesstext.mountAll(opts) montiert jedes [data-fliesstext].
         ElanumFliesstext.legende(el) füllt eine Legende aus data-fliesstext-legende.
   Setzt resonanzrad.js voraus (Namen, Bereich und Icon der Elemente).
   Klassisches Skript, damit es auch unter file:// lädt.
   ============================================================ */
(function () {
  'use strict';

  var TITEL = 'Woher kommt diese Aussage?';
  var karte = null, offen = null, opener = null;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function element(id) {
    var R = window.ElanumResonanzrad;
    var it = R && R.items.filter(function (i) { return i.id === id; })[0];
    return { id: id, name: it ? it.label : id, area: it ? it.group : 'sterne' };
  }
  function icon(id) {
    var R = window.ElanumResonanzrad;
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + ((R && R.icons[id]) || '<circle cx="12" cy="12" r="4"/>') + '</svg>';
  }
  function chip(id, tag) {
    var e = element(id);
    return '<' + tag + ' class="element-chip area" data-area="' + e.area + '">' + icon(id) + esc(e.name) + '</' + tag + '>';
  }

  /* Eine Aussage bekommt ihre Quellen. Das letzte Wort bleibt mit ihnen
     zusammen, damit nie eine Quelle allein in eine neue Zeile rutscht. */
  function setze(mark) {
    if (mark._fliesstext) return;
    var ids = (mark.getAttribute('data-quellen') || '').split(/\s+/).filter(Boolean);
    if (!ids.length) return;
    var satz = mark.textContent.replace(/\s+/g, ' ').trim();
    mark.classList.add('area');
    mark.setAttribute('data-area', element(ids[0]).area);

    var ende = document.createElement('span');
    ende.className = 'fliesstext__ende';
    var last = mark.lastChild;
    if (last && last.nodeType === 3) {
      var t = last.nodeValue.replace(/\s+$/, ''), i = t.lastIndexOf(' ');
      last.nodeValue = t.slice(0, i + 1);
      ende.textContent = t.slice(i + 1);
    }
    var q = document.createElement('span');
    q.className = 'fliesstext__quellen';
    q.innerHTML = ids.map(function (id) {
      var e = element(id);
      return '<button class="fliesstext__quelle area glow-edge" type="button" data-area="' + e.area + '" data-quelle="' + esc(id) + '" aria-haspopup="dialog" aria-label="Quelle: ' + esc(e.name) + '">' +
        icon(id) + '<span class="fliesstext__name" aria-hidden="true">' + esc(e.name) + '</span></button>';
    }).join('');
    ende.appendChild(q);
    mark.appendChild(ende);
    mark._fliesstext = { ids: ids, satz: satz };
  }

  /* Der Name über der Quelle bleibt im Fenster, auch am Rand. */
  function ruecke(button) {
    var name = button.querySelector('.fliesstext__name');
    if (!name) return;
    button.style.setProperty('--ruck', '0px');
    var b = button.getBoundingClientRect(), w = name.offsetWidth, rand = 12;
    var links = b.left + b.width / 2 - w / 2;
    var ziel = Math.min(Math.max(links, rand), Math.max(rand, innerWidth - w - rand));
    button.style.setProperty('--ruck', Math.round(ziel - links) + 'px');
  }

  /* ---------- Quellenkarte: ein <dialog> für die ganze Seite ---------- */
  function baueKarte() {
    var d = document.createElement('dialog');
    d.className = 'fliesstext-karte';
    d.setAttribute('aria-labelledby', 'fliesstextKarteTitel');
    d.setAttribute('aria-describedby', 'fliesstextKarteText');
    d.innerHTML =
      '<span class="fliesstext-karte__griff" aria-hidden="true"></span>' +
      '<div class="fliesstext-karte__kopf">' +
        '<h2 class="fliesstext-karte__titel" id="fliesstextKarteTitel"></h2>' +
        '<button class="fliesstext-karte__schliessen glow-edge" type="button" data-schliessen aria-label="Quellenkarte schliessen">' +
          '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg></button>' +
      '</div>' +
      '<div class="fliesstext-karte__inhalt">' +
        '<blockquote class="fliesstext-karte__satz" data-satz></blockquote>' +
        '<div class="fliesstext-karte__wahl" data-wahl></div>' +
        '<p class="fliesstext-karte__text" id="fliesstextKarteText" data-text></p>' +
        '<a class="fliesstext-karte__mehr" data-mehr href="#" hidden><span data-mehr-name></span>' +
          '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13.5M13.5 7l5 5-5 5"/></svg></a>' +
      '</div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) {
      if (e.target === d) { d.close(); return; }                      /* Tipp auf den Hintergrund */
      var t = e.target.closest ? e.target : e.target.parentNode;
      if (t.closest('[data-schliessen]')) { d.close(); return; }
      var w = t.closest('[data-wahl-quelle]');
      if (w) zeige(w.getAttribute('data-wahl-quelle'));
    });
    d.addEventListener('close', function () {
      if (offen) offen.mark.classList.remove('is-offen');
      offen = null;
      if (opener && opener.isConnected) opener.focus();
      opener = null;
    });
    return d;
  }

  function lies(opts, id, mark) {
    var q = opts.quellen;
    var info = typeof q === 'function' ? q(id, mark) : (q && q[id]);
    return info || {};
  }

  function zeige(id) {
    if (!offen) return;
    var e = element(id), info = lies(offen.opts, id, offen.mark);
    Array.prototype.forEach.call(karte.querySelectorAll('[data-wahl-quelle]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-wahl-quelle') === id));
    });
    karte.querySelector('[data-text]').textContent = info.text || '';
    var mehr = karte.querySelector('[data-mehr]');
    mehr.hidden = !info.href;
    if (info.href) { mehr.href = info.href; karte.querySelector('[data-mehr-name]').textContent = info.mehr || 'Mehr über ' + e.name; }
  }

  function oeffne(mark, id, opts, trigger) {
    if (!mark || !mark._fliesstext) return;
    karte = karte || baueKarte();
    if (offen) offen.mark.classList.remove('is-offen');
    var ids = mark._fliesstext.ids;
    offen = { mark: mark, opts: opts || {} };
    mark.classList.add('is-offen');
    karte.querySelector('#fliesstextKarteTitel').textContent = offen.opts.titel || TITEL;
    karte.querySelector('[data-satz]').textContent = mark._fliesstext.satz;
    var wahl = karte.querySelector('[data-wahl]');
    if (ids.length > 1) {
      wahl.className = 'fliesstext-karte__wahl segmented';
      wahl.setAttribute('role', 'group');
      wahl.setAttribute('aria-label', 'Quelle wählen');
      wahl.innerHTML = ids.map(function (q) {
        var e = element(q);
        return '<button class="area glow-edge" type="button" data-area="' + e.area + '" data-wahl-quelle="' + esc(q) + '" aria-pressed="false">' + icon(q) + esc(e.name) + '</button>';
      }).join('');
    } else {
      wahl.className = 'fliesstext-karte__wahl';
      wahl.removeAttribute('role');
      wahl.removeAttribute('aria-label');
      wahl.innerHTML = chip(ids[0], 'p');
    }
    zeige(ids.indexOf(id) < 0 ? ids[0] : id);
    opener = trigger || null;
    if (!karte.open) karte.showModal();
    sichtbar(mark);
  }

  /* Die markierte Aussage bleibt über der Karte zu sehen: liegt ihr Ende
     dahinter, rollt die Seite so weit, dass es knapp darüber steht. */
  function sichtbar(mark) {
    var unten = parseFloat(getComputedStyle(karte).bottom) || 0;
    var oben = innerHeight - unten - karte.offsetHeight - 20;
    var zuViel = mark.getBoundingClientRect().bottom - oben;
    if (zuViel <= 0) return;
    var ruhig = document.body.getAttribute('data-motion') === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollBy({ top: zuViel, behavior: ruhig ? 'auto' : 'smooth' });
  }

  function legende(el) {
    var ids = (el.getAttribute('data-fliesstext-legende') || '').split(/\s+/).filter(Boolean);
    el.innerHTML = ids.map(function (id) { return chip(id, 'li'); }).join('');
  }

  function mount(root, opts) {
    root.querySelectorAll('.fliesstext__aussage[data-quellen]').forEach(setze);
    root._fliesstextOpts = opts || root._fliesstextOpts || {};
    if (!root._fliesstextBound) {
      root._fliesstextBound = true;
      root.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.fliesstext__quelle');
        if (!b || !root.contains(b)) return;
        oeffne(b.closest('.fliesstext__aussage'), b.getAttribute('data-quelle'), root._fliesstextOpts, b);
      });
      var vor = function (e) { var b = e.target.closest && e.target.closest('.fliesstext__quelle'); if (b) ruecke(b); };
      root.addEventListener('pointerover', vor);
      root.addEventListener('focusin', vor);
    }
    return {
      open: function (mark, id) { oeffne(mark, id, root._fliesstextOpts, null); },
      close: function () { if (karte && karte.open) karte.close(); }
    };
  }

  function mountAll(opts) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-fliesstext-legende]'), legende);
    return Array.prototype.map.call(document.querySelectorAll('[data-fliesstext]'), function (n) { return mount(n, opts); });
  }

  window.ElanumFliesstext = { mount: mount, mountAll: mountAll, legende: legende };
})();
