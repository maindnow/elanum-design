/* ============================================================
   ELANUM Motion 4.5
   Nach dem website-motion-Katalog: GSAP + ScrollTrigger, SplitText,
   DrawSVG. Nur dieses Modul spricht mit GSAP. Das Markup sagt mit
   data-anim, was sich bewegt:

     hero         P03/P05  Einstieg: Titelzeilen maskiert, dann Text, < 1,5 s
     title        P05      Kapiteltitel steigt zeilenweise auf
     reveal       P07      Block erscheint einmal
     stagger      P08      Kinder nacheinander, 0,12 s
     ramp         P08/P09  Farbrampe baut sich von Tief nach Hauch auf
     beziehung    Szene    Kreise rücken zusammen, Regler laufen mit
     resonanzrad  P10      Rad baut sich Bereich für Bereich auf;
                           mit data-pin auf breiten Schirmen festgehalten
     umfeld       Szene    Menschen rücken auf ihre Nähe, Verbindungen zeichnen sich
     track        P09      Spur wächst, Stationen erscheinen beim Erreichen;
                           mit data-scrub an den Scroll gekoppelt

   Guards: boot.js versteckt nur bis motion-ready (5-s-Timeout, P28).
   Sichtbares beim Laden erscheint sofort (P29). Titel erst nach
   fonts.ready gesplittet, SplitText setzt aria-label (P32). Nur opacity
   und transform, nie visibility. Tastatur, Fokus auf etwas Unsichtbarem,
   die globale Pause und reduzierte Bewegung beenden alle Auftritte.
   ============================================================ */
(function () {
  'use strict';
  var html = document.documentElement;
  function ready() { html.classList.add('motion-ready'); }
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger || !matchMedia('(prefers-reduced-motion: no-preference)').matches) { ready(); return; }
  gsap.registerPlugin(ScrollTrigger, window.SplitText, window.DrawSVGPlugin);

  /* Katalog-Konstanten. Nicht raten, nachschlagen. */
  var M = {
    ease: { reveal: 'power2.out', title: 'expo.out', line: 'power3.out', move: 'expo.inOut' },
    stagger: { items: 0.12, hero: 0.14, amount: 0.48 },
    start: { small: 'top 92%', normal: 'top 88%', large: 'top 85%' },
    y: 24, duration: { reveal: 0.9, title: 1, line: 1, draw: 1.8 }
  };
  var CLEAR = 'transform,opacity';
  var all = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var css = function (name) { return getComputedStyle(html).getPropertyValue(name).trim(); };
  var aboveFold = function (el) { return el.getBoundingClientRect().top < innerHeight * 0.92; };
  var ctx = gsap.context(function () {}), mm = gsap.matchMedia(), stopped = false, observers = [], finishers = [];

  /* Szenen in ausgeblendeten Tabs: erst starten, wenn sie wirklich sichtbar sind. */
  function whenVisible(el, fn, threshold) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && !stopped) { io.disconnect(); ctx.add(function () { fn(); }); } });
    }, { threshold: threshold || 0.25 });
    io.observe(el); observers.push(io);
  }
  function hideUntilVisible(targets) { gsap.set(targets, { opacity: 0 }); }

  /* ---------- Einstieg (P03 + P05) ---------- */
  function hero() {
    var items = all('[data-anim="hero"]');
    if (!items.length) return;
    var tl = gsap.timeline({ defaults: { ease: M.ease.reveal } });
    items.forEach(function (el, i) {
      if (/^H1$/.test(el.tagName)) {
        var split = window.SplitText.create(el, { type: 'lines', mask: 'lines' });
        tl.from(split.lines, { yPercent: 100, duration: M.duration.title, ease: M.ease.title, stagger: M.stagger.hero }, 0);
      } else {
        tl.from(el, { y: M.y, opacity: 0, duration: M.duration.reveal, clearProps: CLEAR }, 0.3 + i * M.stagger.hero);
      }
    });
  }

  /* ---------- Kapiteltitel (P05) ---------- */
  function titles() {
    all('[data-anim="title"]').forEach(function (el) {
      if (aboveFold(el)) return;
      var split = window.SplitText.create(el, { type: 'lines', mask: 'lines' });
      gsap.from(split.lines, { yPercent: 100, duration: M.duration.title, ease: M.ease.title, stagger: M.stagger.hero,
        scrollTrigger: { trigger: el, start: M.start.large, once: true } });
    });
  }

  /* ---------- Blöcke und Gruppen (P07, P08) ---------- */
  function reveals() {
    all('[data-anim="reveal"]').forEach(function (el) {
      if (aboveFold(el)) return;
      gsap.from(el, { y: M.y, opacity: 0, duration: M.duration.reveal, ease: M.ease.reveal, clearProps: CLEAR,
        scrollTrigger: { trigger: el, start: M.start.normal, once: true } });
    });
    all('[data-anim="stagger"]').forEach(function (el) {
      if (aboveFold(el)) return;
      var kids = Array.prototype.slice.call(el.children);
      gsap.from(kids, { y: M.y, opacity: 0, duration: M.duration.reveal, ease: M.ease.reveal, clearProps: CLEAR,
        stagger: kids.length > 4 ? { amount: M.stagger.amount } : M.stagger.items,
        scrollTrigger: { trigger: el, start: M.start.normal, once: true } });
    });
    /* Farbrampen: jede Stufe wächst von links, tief zuerst. Die Abstufung wird sichtbar. */
    all('[data-anim="ramp"]').forEach(function (el) {
      if (aboveFold(el)) return;
      var card = el.closest('.area-card') || el;
      var tl = gsap.timeline({ scrollTrigger: { trigger: card, start: M.start.normal, once: true } });
      tl.from(card, { y: M.y, opacity: 0, duration: M.duration.reveal, ease: M.ease.reveal, clearProps: CLEAR })
        .from(all('.ramp__bar', el), { scaleX: 0, duration: M.duration.line, ease: M.ease.line, stagger: M.stagger.items }, 0.15)
        .from(all('.ramp button > span:not(.ramp__bar), .area-card__fields li', card), { opacity: 0, duration: 0.5, stagger: 0.05 }, 0.5);
    });
  }

  /* ---------- Beziehung: die Bewegung erklärt die Regler ---------- */
  function beziehung() {
    all('[data-anim="beziehung"]').forEach(function (frame) {
      var B = window.ElanumBeziehung; if (!B) return;
      var chapter = frame.closest('section, main') || frame;
      var sliders = ['proximity', 'resonance', 'openness'].map(function (id) { return chapter.querySelector('#' + id); });
      var has = sliders.every(Boolean);
      var goal = has ? sliders.map(function (s) { return +s.value; }) : [58, 72, 34];
      var from = [0, 0, 88];
      var apply = function (v) {
        if (has) sliders.forEach(function (s, i) { s.value = Math.round(v[i]); s.dispatchEvent(new Event('input')); });
        else B.set(frame, { proximity: v[0], resonance: v[1], openness: v[2] }, true);
      };
      apply(from);
      B.set(frame, { proximity: from[0], resonance: from[1], openness: from[2] }, true);
      var state = { p: from[0], r: from[1], o: from[2] };
      var tl = gsap.timeline({ paused: true });
      tl.from(all('[data-contour]', frame), { drawSVG: '0%', duration: 1.2, ease: M.ease.line, stagger: 0.15 })
        .from(all('.relationship-label', frame), { opacity: 0, y: 12, duration: 0.6, stagger: 0.12, clearProps: CLEAR }, 0.4)
        .to(state, { p: goal[0], r: goal[1], o: goal[2], duration: 1.8, ease: M.ease.move, id: 'approach',
          onUpdate: function () { apply([state.p, state.r, state.o]); } }, 0.9);
      var approach = tl.getById('approach');
      var end = function () { if (tl.progress() < 1) tl.progress(1); };
      sliders.forEach(function (s) { if (s) s.addEventListener('pointerdown', end, { once: true }); });
      ScrollTrigger.create({ trigger: frame, start: 'top 70%', once: true, onEnter: function () { tl.play(); } });
      var finished = false;
      finishers.push(function () { if (finished) return; finished = true; tl.progress(1); approach.eventCallback('onUpdate', null); apply(goal); });
    });
  }

  /* ---------- Resonanzrad (P10) ---------- */
  function wheelTimeline(scene, parts, steps) {
    var rad = scene.querySelector('.rad'), items = parts.items;
    var tint = function (it) { return css('--' + it.group + '-4'); };
    var final = function (it) { return css('--' + it.group + '-' + (it.done ? it.shade : 4)); };
    var original = parts.faces.map(function (f) { return f.style.fill; });
    var restore = function () { parts.faces.forEach(function (f, i) { f.style.fill = original[i]; }); };
    finishers.push(restore);
    var tl = gsap.timeline({ defaults: { ease: M.ease.reveal } });
    tl.call(function () { rad.classList.add('is-entering'); }, null, 0);
    tl.set(parts.faces, { fill: function (i) { return tint(items[i]); } }, 0);
    tl.set([parts.lift, parts.active], { opacity: 0 }, 0);
    var stepIn = function (i, at) {
      if (!steps) return;
      if (i > 0) tl.to(steps[i - 1], { opacity: 0, y: -16, duration: 0.4 }, at);
      tl.fromTo(steps[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, at + 0.15);
    };
    /* 1 · Im Zentrum stehst du */
    tl.from([parts.track, parts.plate], { scale: 0.85, opacity: 0, duration: 0.9, transformOrigin: '50% 50%', stagger: 0.1 }, 0)
      .from(parts.center, { scale: 0, opacity: 0, duration: 0.8, ease: 'back.out(1.6)', transformOrigin: '50% 50%' }, 0.3);
    stepIn(0, 0);
    /* 2 · Drei Bereiche, drei Farben */
    var chips = steps ? all('.rr-steps__areas li', steps[1]) : [];
    stepIn(1, 1.1);
    parts.bands.forEach(function (band, g) {
      var at = 1.4 + g * 0.55;
      tl.from(band, { opacity: 0, duration: 0.6 }, at)
        .from(parts.ringLabels[g], { opacity: 0, duration: 0.5 }, at + 0.2);
      if (chips[g]) tl.from(chips[g], { opacity: 0.25, x: -8, duration: 0.4 }, at);
    });
    /* 3 · Drei Felder pro Bereich: Stücke erscheinen, ausgefüllte füllen sich mit ihrer Nuance */
    stepIn(2, 3.2);
    tl.from(parts.faces, { opacity: 0, duration: 0.5, stagger: 0.07 }, 3.4)
      .from(parts.icons, { opacity: 0, duration: 0.5, stagger: 0.07 }, 3.6);
    items.forEach(function (it, i) {
      if (it.done) tl.to(parts.faces[i], { fill: final(it), duration: 0.6, ease: 'power1.inOut' }, 4.3 + Math.floor(i / 3) * 0.3 + (i % 3) * 0.1);
    });
    /* 4 · Farbe heisst ausgefüllt: Konturen schliessen sich oder bleiben offen */
    stepIn(3, 5.6);
    tl.from(parts.contours, { drawSVG: '0%', duration: 0.9, ease: M.ease.line, stagger: 0.06 }, 5.8)
      .to([parts.lift, parts.active], { opacity: 1, duration: 0.5 }, 6.6);
    if (steps) tl.to(steps[3], { opacity: 0, y: -16, duration: 0.4 }, 7.4);
    tl.from(parts.reader, { opacity: 0, y: M.y, duration: 0.6, clearProps: CLEAR }, steps ? 7.6 : 6.4)
      .from([parts.nav, parts.list], { opacity: 0, y: M.y, duration: 0.6, stagger: 0.1, clearProps: CLEAR }, steps ? 7.7 : 6.5)
      .call(function () { rad.classList.remove('is-entering'); restore(); });
    return tl;
  }
  function resonanzrad() {
    all('[data-anim="resonanzrad"]').forEach(function (scene) {
      var host = scene.querySelector('[data-resonanzrad]');
      if (!host || !host._resonanzrad) return;
      var parts = host._resonanzrad.parts, stepsList = scene.querySelector('.rr-steps');
      var pinnable = scene.hasAttribute('data-pin') && stepsList;
      mm.add({ wide: '(min-width: 900px)', narrow: '(max-width: 899.98px)' }, function (c) {
        if (c.conditions.wide && pinnable) {
          /* Festgehaltenes Kapitel: die Schritte liegen über dem Lesebereich. */
          stepsList.hidden = false;
          var steps = all(':scope > li', stepsList);
          var place = function () {
            var s = scene.getBoundingClientRect(), r = parts.reader.getBoundingClientRect(), w = parts.wheel.getBoundingClientRect();
            gsap.set(stepsList, { left: r.left - s.left, top: w.top - s.top + w.height * 0.18, width: r.width });
          };
          place();
          gsap.set(steps, { opacity: 0 });
          var tl = wheelTimeline(scene, parts, steps);
          ScrollTrigger.create({ trigger: scene, start: 'top 6%', end: '+=2600', pin: true, scrub: 1, anticipatePin: 1,
            animation: tl, invalidateOnRefresh: true, onRefreshInit: place });
          return function () { stepsList.hidden = true; };
        }
        var once = wheelTimeline(scene, parts, null).pause();
        once.timeScale(1.6);
        ScrollTrigger.create({ trigger: parts.wheel, start: 'top 75%', once: true, onEnter: function () { once.play(); } });
        if (aboveFold(parts.wheel)) once.play();
      });
    });
  }

  /* ---------- Umfeld ---------- */
  function umfeld() {
    all('[data-anim="umfeld"]').forEach(function (el) {
      var api = el._umfeld; if (!api) return;
      var people = api.parts.people;
      var stage = el.querySelector('.umfeld__stage');
      hideUntilVisible(people.map(function (p) { return p.name; }).concat(api.parts.me));
      whenVisible(stage, function () {
        var scale = stage.getBoundingClientRect().width / 720;
        var tl = gsap.timeline({ defaults: { ease: M.ease.title } });
        tl.fromTo(api.parts.me, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
          .from(api.parts.me, { drawSVG: '0%', duration: 1, ease: M.ease.line }, 0);
        people.forEach(function (p, i) {
          var dx = p.from.x - p.at.x, dy = p.from.y - p.at.y, at = 0.3 + i * M.stagger.items;
          tl.from([p.disc, p.contour, p.nodes], { x: dx, y: dy, opacity: 0, duration: 1.3 }, at)
            .fromTo(p.name, { x: dx * scale, y: dy * scale, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.3, clearProps: CLEAR }, at);
        });
        tl.from(people.filter(function (p) { return p.person.resonance > 0; }).map(function (p) { return p.bridge; }), { drawSVG: '0%', duration: 0.9, ease: M.ease.line, stagger: 0.15 }, 1.4)
          .from(all('.umfeld__person', el), { opacity: 0, y: 16, duration: 0.5, stagger: 0.08, clearProps: CLEAR }, 1.2)
          .from(el.querySelector('.umfeld__detail'), { opacity: 0, y: M.y, duration: 0.6, clearProps: CLEAR }, 1.6);
      }, 0.3);
    });
  }

  /* ---------- Stationslinien (Weg, Tageslinie) ---------- */
  function trackTimeline(el) {
    var horizontal = el.classList.contains('track--horizontal') && matchMedia('(min-width: 900px)').matches;
    var stations = all('.track__station', el), tl = gsap.timeline({ defaults: { ease: M.ease.reveal } });
    stations.forEach(function (st, i) {
      var at = i * 0.55;
      tl.from(st.querySelector('.track__marker'), { scale: 0, duration: 0.45, ease: 'back.out(2)' }, at)
        .from(st.querySelector('.track__marker + .track__seg + div'), { opacity: 0, y: 16, duration: 0.5, clearProps: CLEAR }, at + 0.1);
      var seg = st.querySelector('.track__seg');
      if (seg && i < stations.length - 1) tl.from(seg, horizontal ? { scaleX: 0, duration: 0.5, ease: 'none' } : { scaleY: 0, duration: 0.5, ease: 'none' }, at + 0.2);
    });
    return tl;
  }
  function tracks() {
    all('[data-anim="track"]').forEach(function (el) {
      if (el.hasAttribute('data-scrub')) {
        var tl = trackTimeline(el);
        ScrollTrigger.create({ trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: 1, animation: tl, invalidateOnRefresh: true });
        return;
      }
      hideUntilVisible(all('.track__station', el));
      whenVisible(el, function () {
        gsap.set(all('.track__station', el), { opacity: 1 });
        trackTimeline(el);
      }, 0.2);
    });
  }

  /* ---------- Mikro: Statuswechsel ---------- */
  document.addEventListener('elanum:status', function (e) {
    if (stopped) return;
    var el = e.detail && e.detail.element; if (!el) return;
    gsap.fromTo(el.querySelector('.status__sign'), { scale: 0.6 }, { scale: 1, duration: 0.4, ease: 'back.out(2)', clearProps: 'transform' });
    gsap.fromTo(el, { x: -6 }, { x: 0, duration: 0.3, ease: M.ease.reveal, clearProps: 'transform' });
  });

  /* ---------- Alles beenden: Pause, Tastatur, Fokus ---------- */
  function stopAll() {
    if (stopped) return;
    stopped = true;
    observers.forEach(function (io) { io.disconnect(); });
    finishers.forEach(function (fn) { fn(); });
    mm.revert(); ctx.revert();
    finishers.forEach(function (fn) { fn(); });
    all('.rr-steps').forEach(function (s) { s.hidden = true; });
    all('.rad.is-entering').forEach(function (r) { r.classList.remove('is-entering'); });
    ScrollTrigger.refresh();
    ready();
  }
  document.addEventListener('elanum:motion', function (e) { if (e.detail && e.detail.off) stopAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Tab') stopAll(); }, true);
  document.addEventListener('focusin', function (e) {
    for (var n = e.target; n && n !== document.body; n = n.parentElement) if (+getComputedStyle(n).opacity < 1) { stopAll(); return; }
  });
  document.addEventListener('elanum:layout', function () { if (!stopped) ScrollTrigger.refresh(); });

  /* Start nach fonts.ready, damit Titel mit der echten Schrift gesplittet werden. */
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
    if (document.body.dataset.motion === 'off') { ready(); return; }
    ctx.add(function () { hero(); titles(); reveals(); beziehung(); umfeld(); tracks(); });
    resonanzrad();
    ScrollTrigger.refresh();
    ready();
  });
})();
