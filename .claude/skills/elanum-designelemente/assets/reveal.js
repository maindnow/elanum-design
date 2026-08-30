/* ============================================================
   Reveal, elanum
   IntersectionObserver, nie ein Scroll-Listener. Jeder Reveal genau einmal.
   Triggerpunkte aus references/motion.md:
     kleines Element   top 92%   ->  rootMargin -8%
     normaler Block    top 88%   ->  rootMargin -12%
     ganze Section     top 85%   ->  rootMargin -15%

   Warum die Erreichbarkeitsprüfung nötig ist:
   Ein Element in den untersten Prozenten einer kurzen Seite erreicht die
   verschobene Triggerlinie nie, weil die Seite nicht weit genug scrollt.
   Ohne diese Prüfung bleibt es dauerhaft unsichtbar. Solche Elemente werden
   deshalb ohne Rand beobachtet und zeigen sich, sobald sie ins Bild kommen.
   ============================================================ */
(function () {
  'use strict';

  var GROUPS = [
    { sel: '[data-reveal="sm"]', margin: 8 },
    { sel: '[data-reveal="lg"], section', margin: 15 },
    { sel: '[data-reveal], .sr-demo, .sr-fade, .sr-rule-line', margin: 12 }
  ];
  var ALL = '[data-reveal], .sr-demo, .sr-fade, .sr-rule-line, section';

  function reveal(el) { el.classList.add('is-in'); }

  function run() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(ALL).forEach(reveal);
      return;
    }

    var vh = window.innerHeight;
    var maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);

    /* Kann dieses Element die um marginPct verschobene Linie überhaupt erreichen,
       wenn die Seite ganz nach unten gescrollt ist? */
    function reachable(el, marginPct) {
      var absTop = el.getBoundingClientRect().top + window.scrollY;
      return (absTop - maxScroll) < vh * (1 - marginPct / 100);
    }

    var observers = {};
    function observerFor(marginPct) {
      if (!observers[marginPct]) {
        observers[marginPct] = new IntersectionObserver(function (entries, io) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
          });
        }, { threshold: 0.01, rootMargin: '0px 0px -' + marginPct + '% 0px' });
      }
      return observers[marginPct];
    }

    var claimed = new WeakSet();
    GROUPS.forEach(function (g) {
      document.querySelectorAll(g.sel).forEach(function (el) {
        if (claimed.has(el)) return;
        claimed.add(el);
        observerFor(reachable(el, g.margin) ? g.margin : 0).observe(el);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
