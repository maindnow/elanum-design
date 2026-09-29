/* ============================================================
   ELANUM Motion
   Nach dem website-motion-Katalog (BEYONDER), abgestimmt auf 4.4.
   Deklarativ: Das Markup sagt mit data-anim, was sich bewegt; nur
   dieses Modul spricht mit GSAP.

     data-anim="hero"      P03  Einstieg beim Laden, gestaffelt, unter 1,5 s
     data-anim="reveal"    P07  Block erscheint einmal beim Scrollen
                                data-anim-size="small|normal|large"
     data-anim="stagger"   P08  2–6 gleichartige Kinder nacheinander;
                                Trigger ist der Container
     data-anim="line"      P09  Linie zeichnet sich; setzt --draw von 0 auf 1
     data-anim="wheel"     P03  Aufbau des persönlichen Rads
     data-no-anim               Opt-out für einen Teilbaum

   Guards (P27–P29) stehen im <head> jeder Seite: Runtime nach dem ersten
   Paint, Versteck-Guard mit 5-s-Timeout, Above-the-Fold sofort.
   Zusätzlich für 4.4:
   - Nur opacity und transform, nie visibility: Noch nicht gezeigte
     Elemente bleiben per Tab erreichbar, und Fokus zeigt sie sofort.
   - Tastaturbedienung zeigt sofort; die globale Pause des Styleguides
     beendet alle laufenden Auftritte.
   - Nach jedem Auftritt clearProps, damit Hover-Zustände aus CSS greifen.
   ============================================================ */
(function () {
  'use strict';

  var html = document.documentElement;

  /* Katalog-Konstanten (kzero/terminal/five). Nicht raten, nachschlagen. */
  var MOTION = {
    ease: { reveal: 'power2.out', line: 'power3.out' },
    stagger: { items: 0.12, hero: 0.14, fine: 0.04 },
    start: { small: 'top 92%', normal: 'top 88%', large: 'top 85%' },
    y: { small: '1.6rem', normal: '2.4rem', large: '3.2rem' },
    duration: { reveal: 0.9, line: 1 }
  };
  var CLEAR = 'transform,opacity';

  function ready() { html.classList.add('motion-ready'); }
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function paused() { return document.body.getAttribute('data-motion') === 'off'; }
  function keyboard() { return document.body.getAttribute('data-input') === 'keyboard'; }
  function aboveFold(el) { return el.classList.contains('reveal-instant') || el.getBoundingClientRect().top < window.innerHeight; }
  function all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  var entries = [];   // { el, tl } für Fokus und Pause
  function register(el, tl) { entries.push({ el: el, tl: tl }); }
  function finish(tl) { if (tl.progress() < 1) tl.progress(1, false); }   // false: Callbacks laufen mit, Aufräumen inklusive
  function finishAll() {
    entries.forEach(function (e) { finish(e.tl); });
    ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
  }

  /* P07 / P08 */
  function scrollReveal(el, type) {
    var group = type === 'stagger';
    var size = el.getAttribute('data-anim-size') || (group ? 'large' : 'normal');
    var items = group ? Array.prototype.slice.call(el.children) : [el];
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(items,
      { opacity: 0, y: MOTION.y[group ? 'normal' : size] },
      { opacity: 1, y: 0, duration: MOTION.duration.reveal, ease: MOTION.ease.reveal,
        stagger: group ? MOTION.stagger.items : 0, clearProps: CLEAR, immediateRender: true });
    ScrollTrigger.create({
      trigger: el, start: MOTION.start[size], once: true,
      onEnter: function () { if (keyboard()) finish(tl); else tl.play(); }
    });
    register(el, tl);
  }

  /* P09: Die Linie selbst liest --draw (siehe CSS), damit auch Pseudo-Elemente zeichnen. */
  function lineDraw(el) {
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(el, { '--draw': 0 }, { '--draw': 1, duration: MOTION.duration.line, ease: MOTION.ease.line,
      immediateRender: true, onComplete: function () { el.style.removeProperty('--draw'); } });
    ScrollTrigger.create({
      trigger: el, start: MOTION.start.small, once: true,
      onEnter: function () { if (keyboard()) finish(tl); else tl.play(); }
    });
    register(el, tl);
  }

  /* P03 für das persönliche Rad: Scheibe, Ring, Stücke, Status, Auswahl.
     Gesamtdauer unter 1,5 s; nur Deckkraft und leichte Skalierung, kein Bounce. */
  function wheelIntro(el, tl, at) {
    /* CSS-Übergänge der Komponente würden gegen die Timeline laufen. */
    el.classList.add('is-entering');
    tl.call(function () { el.classList.remove('is-entering'); }, null, at + 1.45);
    var fade = function (sel, vars, pos) {
      var t = all(el, sel);
      if (!t.length) return;
      vars.clearProps = vars.clearProps || 'opacity';
      tl.from(t, vars, at + pos);
    };
    fade('.wheel__track, .wheel__plate', { opacity: 0, scale: 0.96, duration: 0.9, ease: MOTION.ease.reveal, clearProps: CLEAR }, 0);
    fade('.wheel__center', { opacity: 0, scale: 0.9, duration: 0.7, ease: MOTION.ease.reveal, clearProps: CLEAR }, 0.1);
    fade('.wheel__band', { opacity: 0, duration: 0.6, ease: MOTION.ease.reveal, stagger: MOTION.stagger.hero }, 0.2);
    fade('.wheel__ring-label', { opacity: 0, duration: 0.6, ease: MOTION.ease.reveal, stagger: MOTION.stagger.hero }, 0.3);
    fade('.wheel__face', { opacity: 0, duration: 0.5, ease: MOTION.ease.reveal, stagger: MOTION.stagger.fine }, 0.25);
    fade('.wheel__icon, .wheel__label', { opacity: 0, duration: 0.5, ease: MOTION.ease.reveal, stagger: MOTION.stagger.fine / 2 }, 0.4);
    /* Statusrand zeichnet sich wie die Konturen im Styleguide auf. */
    var contours = all(el, '.wheel__contour');
    if (contours.length) {
      contours.forEach(function (p) { p.setAttribute('pathLength', '1'); });
      /* Lücke länger als der Pfad und Start knapp davor: keine runden Kappen-Punkte vor dem Zeichnen. */
      tl.fromTo(contours, { strokeDasharray: '1 2', strokeDashoffset: 1.05 },
        { strokeDashoffset: 0, duration: 0.7, ease: MOTION.ease.line, stagger: { amount: 0.24 },
          immediateRender: true,
          onComplete: function () {
            contours.forEach(function (p) {
              p.removeAttribute('pathLength');
              p.style.removeProperty('stroke-dasharray');
              p.style.removeProperty('stroke-dashoffset');
            });
          } }, at + 0.55);
    }
    fade('.wheel__active, .wheel__lift', { opacity: 0, duration: 0.4, ease: MOTION.ease.reveal }, 1.05);
  }

  /* Wer mit der Tastatur arbeitet, bekommt Inhalte ohne Auftritt. */
  document.addEventListener('keydown', function () { document.body.setAttribute('data-input', 'keyboard'); }, true);
  document.addEventListener('pointerdown', function () { document.body.setAttribute('data-input', 'pointer'); }, true);

  function init() {
    if (!window.gsap || !window.ScrollTrigger) { ready(); return; }
    gsap.registerPlugin(ScrollTrigger);
    /* Reduzierte Bewegung oder Pause: nichts verstecken, nichts bewegen. */
    if (reduced() || paused()) { ready(); return; }

    var intro = gsap.timeline({ paused: true, defaults: { ease: MOTION.ease.reveal } });
    var heroIndex = 0;
    all(document, '[data-anim]').forEach(function (el) {
      if (el.parentElement && el.parentElement.closest('[data-no-anim]')) return;
      var type = el.getAttribute('data-anim');
      if (type === 'hero') {
        intro.fromTo(el, { opacity: 0, y: MOTION.y.small },
          { opacity: 1, y: 0, duration: MOTION.duration.reveal, clearProps: CLEAR, immediateRender: true },
          heroIndex++ * MOTION.stagger.hero);
        return;
      }
      if (type === 'wheel') { wheelIntro(el, intro, 0.15); return; }
      /* P29: Was beim Start schon sichtbar ist, bleibt einfach stehen. */
      if (aboveFold(el)) return;
      if (type === 'reveal' || type === 'stagger') scrollReveal(el, type);
      else if (type === 'line') lineDraw(el);
    });
    register(document.body, intro);
    ready();
    if (keyboard()) finish(intro); else intro.play();

    /* Fokus auf ein noch unsichtbares Element zeigt es sofort. */
    document.addEventListener('focusin', function (e) {
      entries.forEach(function (en) { if (en.el !== document.body && en.el.contains(e.target)) finish(en.tl); });
    });
    /* Globale Pause (Styleguide) beendet alle Auftritte. */
    new MutationObserver(function () { if (paused()) finishAll(); })
      .observe(document.body, { attributes: true, attributeFilter: ['data-motion'] });
    /* Schriften und nachgeladene Inhalte verschieben Trigger-Positionen. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  init();
})();
