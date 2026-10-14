/* ============================================================
   ELANUM App-Rahmen 4.9
   Navigation, Kopf und Sheet für jede Seite der App. Mobile zuerst.

   NAVIGATION
   Jeder Kosmos hat eigene Ziele. Dating und Resonanz bleiben getrennt,
   gewechselt wird bewusst über das Menü (Telefon, Schiene) oder die
   Seitenleiste (Desktop). Bis 599 px Leiste unten, 600–1023 px Schiene,
   ab 1024 px Seitenleiste. Höchstens fünf Ziele in der Leiste, jedes mit
   Icon und Namen in echten 15 px.

   API:  ElanumApp.mount({ kosmos, current, href, base })
           baut Navigation und Menü, verbindet Kopf und Sheets.
         ElanumApp.nav(el, opts)       nur die Navigation
         ElanumApp.sheet(dialog)       gibt { open(trigger), close() }
         ElanumApp.dayArc(el, { now, stations, from, to })  Tagesbogen
         ElanumApp.kosmen, icons, iconSvg(id)
   Klassisches Skript, damit es auch unter file:// lädt.
   ============================================================ */
(function () {
  'use strict';

  /* Linien-Icons im 24er-Raster, 1,6 px, runde Enden, keine Füllung.
     Sprache aus Kreisen, Öffnungen und Verbindungen wie im Zeichen. */
  var ICONS = {
    heute: '<path d="M3.5 17.5h17"/><path d="M7 17.5a5 5 0 0 1 10 0"/><path d="M12 6.4v2.4M6.1 9.1l1.6 1.6M17.9 9.1l-1.6 1.6"/>',
    ich: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.8"/><path d="M12 3.5v5.7M19.36 16.25l-4.94-2.85M4.64 16.25l4.94-2.85"/>',
    umfeld: '<circle cx="12" cy="13" r="3.2"/><circle cx="5" cy="6.5" r="2.2"/><circle cx="19" cy="7.5" r="2.2"/><circle cx="17.5" cy="19.5" r="2"/><path d="M9.65 10.82L6.61 8M14.52 11.02l2.75-2.16M14.07 15.44l2.14 2.53"/>',
    weg: '<path d="M3.2 12h8.3"/><path d="M17.8 12h3" stroke-dasharray=".1 3"/><circle cx="5" cy="12" r="1.5"/><circle cx="14.6" cy="12" r="3"/>',
    entdecken: '<path d="M3.68 15.73A4.5 4.5 0 1 1 8.72 15.73"/><path d="M15.28 15.73A4.5 4.5 0 1 1 20.32 15.73"/><path d="M10.7 12q1.3 1.3 2.6 0"/>',
    likes: '<circle cx="12" cy="12" r="2.2"/><path d="M8.1 15.9a5.5 5.5 0 0 1 0-7.8M15.9 8.1a5.5 5.5 0 0 1 0 7.8"/><path d="M5.3 18.7a9.5 9.5 0 0 1 0-13.4M18.7 5.3a9.5 9.5 0 0 1 0 13.4"/>',
    chats: '<path d="M12 4a8 8 0 1 1-3.9 15l-4.1 1 1.1-3.9A8 8 0 0 1 12 4z"/>',
    profil: '<circle cx="12" cy="8.6" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    aktivitaeten: '<circle cx="12" cy="12.6" r="4"/><circle cx="12" cy="4.2" r="1.6"/><circle cx="19.2" cy="16.8" r="1.6"/><circle cx="4.8" cy="16.8" r="1.6"/>',
    events: '<rect x="4" y="5.5" width="16" height="14.5" rx="3.5"/><path d="M4 10.2h16M8.5 3.5v4M15.5 3.5v4"/><circle cx="12" cy="15.2" r="1.9"/>',
    meine: '<rect x="4" y="5.5" width="16" height="14.5" rx="3.5"/><path d="M4 10.2h16M8.5 3.5v4M15.5 3.5v4"/><path d="M9.2 15.2l2 2 3.8-3.9"/>',
    menue: '<path d="M4 9h16M4 15h16"/>',
    suche: '<circle cx="10.6" cy="10.6" r="6.1"/><path d="M15.2 15.2l4.8 4.8"/>',
    filter: '<path d="M4 7.5h9.4M18.6 7.5H20M4 16.5h3.4M12.6 16.5H20"/><circle cx="16" cy="7.5" r="2.6"/><circle cx="10" cy="16.5" r="2.6"/>',
    kalender: '<rect x="4" y="5.5" width="16" height="14.5" rx="3.5"/><path d="M4 10.2h16M8.5 3.5v4M15.5 3.5v4"/>',
    zurueck: '<path d="M14.5 6l-6 6 6 6"/>',
    weiter: '<path d="M9.5 6l6 6-6 6"/>',
    schliessen: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    senden: '<path d="M5 12h13M12.5 6.5L18 12l-5.5 5.5"/>',
    pfeil: '<path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>',
    plus: '<path d="M12 5.5v13M5.5 12h13"/>',
    ort: '<path d="M12 20.5s-6.3-5.5-6.3-10.6a6.3 6.3 0 0 1 12.6 0c0 5.1-6.3 10.6-6.3 10.6z"/><circle cx="12" cy="9.9" r="2.3"/>',
    uhr: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.6V12l3 2"/>',
    wissen: '<path d="M4 5.6c3-1.3 5.6-1 8 .8 2.4-1.8 5-2.1 8-.8v13c-3-1.3-5.6-1-8 .8-2.4-1.8-5-2.1-8-.8z"/><path d="M12 6.4v13"/>',
    konto: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="10.2" r="2.9"/><path d="M6.6 18.3a6.2 6.2 0 0 1 10.8 0"/>',
    hilfe: '<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.6a2.4 2.4 0 1 1 3.3 2.2c-.6.3-1 .8-1 1.5v.6"/><path d="M12 16.7v.1"/>',
    abmelden: '<path d="M14 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14"/><path d="M4.5 12H14M8.5 8l-4 4 4 4"/>',
    umdrehen: '<path d="M19 12a7 7 0 0 1-12.4 4.5"/><path d="M5 12a7 7 0 0 1 12.4-4.5"/><path d="M17.6 3.6v3.9h-3.9M6.4 20.4v-3.9h3.9"/>'
  };
  function iconSvg(id, cls) { return '<svg class="' + (cls || 'icon') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[id] || '') + '</svg>'; }

  /* Die drei Kosmen und ihre Ziele. Namen und Sätze aus dem Glossar. */
  var KOSMEN = [
    { id: 'resonanz', name: 'Resonanzkosmos', sentence: 'Resonanz in dir, in deiner Partnerschaft und in deinem Umfeld.', items: [
      { id: 'heute', label: 'Heute', icon: 'heute' },
      { id: 'ich', label: 'Ich', icon: 'ich' },
      { id: 'umfeld', label: 'Umfeld', icon: 'umfeld' },
      { id: 'weg', label: 'Weg', icon: 'weg' }
    ] },
    { id: 'dating', name: 'Datingkosmos', sentence: 'Finde die eine Resonanz.', items: [
      { id: 'entdecken', label: 'Entdecken', icon: 'entdecken' },
      { id: 'likes', label: 'Likes', icon: 'likes' },
      { id: 'chats', label: 'Chats', icon: 'chats', news: 'neue Nachricht' },
      { id: 'profil', label: 'Profil', icon: 'profil' }
    ] },
    { id: 'erleben', name: 'Erlebniskosmos', sentence: 'Resoniere mit anderen.', items: [
      { id: 'aktivitaeten', label: 'Aktivitäten', icon: 'aktivitaeten' },
      { id: 'events', label: 'Events', icon: 'events' },
      { id: 'meine', label: 'Meine', name: 'Meine Aktivitäten', icon: 'meine' }
    ] }
  ];
  var MORE = [
    { id: 'wissen', label: 'Wissen', text: 'Lektionen, Begriffe, Beispiele', icon: 'wissen' },
    { id: 'konto', label: 'Konto', text: 'Einstellungen, Sichtbarkeit, Daten', icon: 'konto' },
    { id: 'hilfe', label: 'Hilfe und Rückmeldungen', text: 'Fragen, Kontakt, Hinweise', icon: 'hilfe' },
    { id: 'abmelden', label: 'Abmelden', icon: 'abmelden' }
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function kosmosOf(id) { return KOSMEN.filter(function (k) { return k.id === id; })[0] || KOSMEN[0]; }

  /* ---------- Navigation ---------- */
  function nav(el, opts) {
    opts = opts || {};
    var k = kosmosOf(opts.kosmos), href = opts.href || function (id) { return id + '.html'; }, base = opts.base || '';
    var me = opts.me || { name: 'Lina', initial: 'L' };
    var item = function (it) {
      var on = it.id === opts.current;
      return '<li><a class="app-nav__item glow-edge" href="' + esc(href(it.id)) + '"' + (on ? ' aria-current="page"' : '') + '>' +
        '<span class="app-nav__icon">' + iconSvg(it.icon) + (it.news ? '<span class="app-dot"></span>' : '') + '</span>' +
        '<span class="app-nav__label">' + esc(it.label) + '</span>' +
        (it.name ? '<span class="visually-hidden"> (' + esc(it.name) + ')</span>' : '') +
        (it.news ? '<span class="visually-hidden">, ' + esc(it.news) + '</span>' : '') + '</a></li>';
    };
    el.classList.add('app-nav');
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Hauptnavigation');
    el.innerHTML =
      '<a class="app-nav__brand glow-edge" href="' + esc(href(k.items[0].id)) + '" aria-label="ELANUM, ' + esc(k.name) + '"><img src="' + base + 'assets/ELANUM-Master-Spektrum-Harmonic.svg" alt="" width="36" height="36"><span>ELANUM</span></a>' +
      '<ul class="app-nav__list">' +
        '<li class="app-nav__kosmos">' + esc(k.name) + '</li>' +
        k.items.map(item).join('') +
        '<li class="app-nav__menu"><button class="app-nav__item glow-edge" type="button" data-app-menu aria-haspopup="dialog"><span class="app-nav__icon">' + iconSvg('menue') + '</span><span class="app-nav__label">Menü</span></button></li>' +
      '</ul>' +
      '<div class="app-nav__switch"><p class="app-nav__kosmos">Kosmos wechseln</p>' +
        KOSMEN.filter(function (o) { return o.id !== k.id; }).map(function (o) {
          return '<a class="app-switch glow-edge" href="' + esc(href(o.items[0].id)) + '"><strong>' + esc(o.name) + '</strong><span>' + esc(o.sentence) + '</span></a>';
        }).join('') +
      '</div>' +
      '<div class="app-nav__foot"><a class="app-me glow-edge" href="' + esc(href('konto')) + '" aria-label="' + esc(me.name) + ', Konto"><span class="person person--sm" aria-hidden="true">' + esc(me.initial) + '</span>' +
        '<span class="app-me__name">' + esc(me.name) + '<small>Konto</small></span></a></div>';
  }

  /* ---------- Sheet: <dialog>, von unten, in der Mitte oder von rechts ---------- */
  function sheet(dialog) {
    if (dialog._sheet) return dialog._sheet;
    var opener = null;
    var api = {
      open: function (trigger) { opener = trigger || document.activeElement; if (!dialog.open) dialog.showModal(); },
      close: function () { if (dialog.open) dialog.close(); }
    };
    /* Fokus zurück zum Auslöser. Wurde er neu gezeichnet, hilft data-sheet-return. */
    dialog.addEventListener('close', function () {
      var back = opener && opener.isConnected ? opener : document.querySelector(dialog.getAttribute('data-sheet-return') || 'x-none');
      if (back) back.focus();
    });
    dialog.classList.add('app-sheet');
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) api.close();                       /* Tipp auf den Hintergrund */
      if (e.target.closest && e.target.closest('[data-close]')) api.close();
    });
    dialog._sheet = api;
    return api;
  }

  /* Menü: Kosmos wechseln und alles, was nicht in die Leiste passt. */
  function menu(opts) {
    var k = kosmosOf(opts.kosmos), href = opts.href || function (id) { return id + '.html'; };
    var d = document.createElement('dialog');
    d.id = 'app-menu'; d.setAttribute('aria-labelledby', 'app-menu-title');
    d.innerHTML =
      '<span class="app-sheet__grip" aria-hidden="true"></span>' +
      '<div class="app-sheet__head"><h2 class="t-heading" id="app-menu-title">Menü</h2>' +
        '<button class="app-icon-button glow-edge" type="button" data-close aria-label="Menü schliessen">' + iconSvg('schliessen') + '</button></div>' +
      '<div class="app-sheet__body">' +
        '<section class="app-section" aria-labelledby="app-menu-kosmos"><h3 class="app-kicker" id="app-menu-kosmos">Kosmos wechseln</h3><div class="app-kosmen">' +
          KOSMEN.map(function (o) {
            var on = o.id === k.id;
            return '<a class="app-kosmos glow-edge" href="' + esc(href(o.items[0].id)) + '"' + (on ? ' aria-current="true"' : '') + '>' +
              '<strong>' + esc(o.name) + '</strong><span>' + esc(o.sentence) + '</span>' + (on ? '<span class="app-kosmos__here">Du bist hier</span>' : '') + '</a>';
          }).join('') +
        '</div></section>' +
        '<ul class="app-list">' + MORE.map(function (m) {
          return '<li><a class="app-row app-row--compact glow-edge" href="' + esc(href(m.id)) + '">' + iconSvg(m.icon) +
            '<span class="app-row__body"><span class="app-row__title">' + esc(m.label) + '</span>' + (m.text ? '<span class="app-row__text">' + esc(m.text) + '</span>' : '') + '</span>' +
            iconSvg('weiter') + '</a></li>';
        }).join('') + '</ul>' +
      '</div>';
    document.body.appendChild(d);
    sheet(d);
    return d;
  }

  /* ---------- Kopf: Linie beim Scrollen, kleiner Titel ab dem grossen ---------- */
  function head(el) {
    var title = document.querySelector('.app-title'), small = el.querySelector('.app-head__title');
    if (small && title && !small.textContent.trim()) small.textContent = title.textContent;
    var onScroll = function () { el.classList.toggle('is-scrolled', scrollY > 4); };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    if (title && small && window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { el.classList.toggle('is-titled', !e.isIntersecting && e.boundingClientRect.top < 80); });
      }, { rootMargin: '-72px 0px 0px 0px' }).observe(title);
    }
  }

  /* ---------- Bewegung: Pause aus dem Atlas, reduzierte Bewegung ---------- */
  function motion() {
    var reduced = matchMedia('(prefers-reduced-motion: reduce)');
    var set = function (off) {
      document.body.dataset.motion = off ? 'off' : 'on';
      if (window.ElanumBeziehung) window.ElanumBeziehung.setPaused(off);
      if (off) document.dispatchEvent(new CustomEvent('elanum:motion', { detail: { off: true } }));
    };
    set(reduced.matches);
    reduced.addEventListener('change', function () { set(reduced.matches); });
    /* Der Atlas zeigt Seiten in Rahmen und schickt seine Pause mit. */
    addEventListener('message', function (e) { if (e.data && e.data.elanum === 'motion') set(!!e.data.off || reduced.matches); });
  }

  /* ---------- Tagesbogen ----------
     Der Tag als offener Kreis, die Öffnung unten ist die Nacht. Bis jetzt
     führt die Verbindung im Markenspektrum, danach bleibt der Bogen offen.
     Stationen sind Knoten, jetzt ist ein Ring, der im Atemtakt glüht.
     Auf der Hauptfläche (.app-hero), hell oder dunkel. Rein darstellend:
     die Zeiten stehen daneben als Text und in der Tageslinie. */
  var arcCount = 0;
  function dayArc(el, opts) {
    opts = opts || {};
    var from = opts.from == null ? 6 : opts.from, to = opts.to == null ? 24 : opts.to;
    var hours = function (t) { var p = String(t).split(':'); return +p[0] + (+p[1] || 0) / 60; };
    var C = 120, R = 92, START = 205, SPAN = 310;                       /* Öffnung unten: 155° bis 205° */
    var ang = function (t) { return START + Math.max(0, Math.min(1, (hours(t) - from) / (to - from))) * SPAN; };
    var pt = function (a) { var r = a * Math.PI / 180; return [(C + R * Math.sin(r)).toFixed(2), (C - R * Math.cos(r)).toFixed(2)]; };
    var arc = function (a0, a1) { var p0 = pt(a0), p1 = pt(a1); return 'M' + p0.join(' ') + ' A' + R + ' ' + R + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + p1.join(' '); };
    var now = opts.now || '12:00', aNow = ang(now), pNow = pt(aNow), p0 = pt(START), id = 'day-arc-' + (++arcCount);
    el.classList.add('day-arc');
    el.innerHTML = '<svg viewBox="0 0 240 240" aria-hidden="true" focusable="false"><defs><linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="' + p0[0] + '" y1="' + p0[1] + '" x2="' + pNow[0] + '" y2="' + pNow[1] + '">' +
        '<stop stop-color="#6756D9"/><stop offset=".55" stop-color="#9466DF"/><stop offset="1" stop-color="#D85BA9"/></linearGradient></defs>' +
      '<circle class="day-arc__disc" cx="' + C + '" cy="' + C + '" r="70"/>' +
      '<g class="day-arc__ring">' +
        '<path class="day-arc__open" d="' + arc(aNow, START + SPAN) + '"/>' +
        '<path class="day-arc__done" pathLength="1" stroke="url(#' + id + ')" d="' + arc(START, aNow) + '"/>' +
        (opts.stations || []).map(function (t) { var q = pt(ang(t)); return '<circle class="day-arc__station" cx="' + q[0] + '" cy="' + q[1] + '" r="3.3"/>'; }).join('') +
        '<circle class="day-arc__now" cx="' + pNow[0] + '" cy="' + pNow[1] + '" r="7"/>' +
      '</g></svg>' +
      '<span class="day-arc__time"><strong>' + esc(now) + '</strong><span>' + esc(opts.label || 'jetzt') + '</span></span>';
  }

  /* <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" data-icon="uhr"></svg> bekommt seine Linien. */
  function fillIcons(root) {
    (root || document).querySelectorAll('svg[data-icon]').forEach(function (s) { s.innerHTML = ICONS[s.getAttribute('data-icon')] || ''; });
  }

  /* Eine Frage zum Umdrehen: <button class="app-flip" data-flip aria-pressed="false"> */
  function flips(root) {
    (root || document).addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-flip]'); if (!b) return;
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      var front = b.querySelector('.app-flip__face--front'), back = b.querySelector('.app-flip__face--back');
      if (front) front.setAttribute('aria-hidden', String(on));
      if (back) back.setAttribute('aria-hidden', String(!on));
    });
  }

  function mount(opts) {
    opts = opts || {};
    fillIcons();
    flips();
    var navEl = document.querySelector('[data-app-nav]');
    if (navEl) {
      nav(navEl, opts);
      var m = menu(opts);
      navEl.querySelector('[data-app-menu]').addEventListener('click', function () { sheet(m).open(); });
    }
    var headEl = document.querySelector('.app-head');
    if (headEl) head(headEl);
    document.querySelectorAll('dialog[data-sheet]').forEach(sheet);
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-sheet-open]');
      if (!t) return;
      var d = document.getElementById(t.getAttribute('data-sheet-open'));
      if (d) { e.preventDefault(); sheet(d).open(); }
    });
    motion();
    /* Auftritt nur, wenn Bewegung erlaubt ist (app.css, Abschnitt Auftritt). */
    if (document.body.dataset.motion !== 'off') document.documentElement.classList.add('app-in');
  }

  window.ElanumApp = { mount: mount, nav: nav, sheet: sheet, dayArc: dayArc, fillIcons: fillIcons, kosmen: KOSMEN, more: MORE, icons: ICONS, iconSvg: iconSvg };
})();
