/* ============================================================
   ELANUM Boot, im <head> jeder Seite, synchron und klein.
   <script src="assets/boot.js" data-base=""></script>

   - P28 Versteck-Guard: [data-anim] ist nur unsichtbar, solange Bewegung
     erlaubt ist und motion.js noch nicht bereit ist. Nach 5 s ist alles
     sichtbar, egal was passiert. Ohne JavaScript ist nie etwas versteckt.
   - P27 Runtime nach dem ersten Paint: GSAP und motion.js werden erst
     nach zwei Frames nachgeladen.
   - Chrome lädt unter file:// keine Schriftdateien. Nur dann kommen die
     eingebetteten Schriften (tools/embed-fonts.py).
   ============================================================ */
(function () {
  var script = document.currentScript, base = (script && script.getAttribute('data-base')) || '';
  var root = document.documentElement;
  root.classList.add('js');
  if (location.protocol === 'file:') {
    var link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = base + 'assets/fonts/fonts-embedded.css';
    document.head.appendChild(link);
  }
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  root.classList.add('motion-pending');
  setTimeout(function () { if (!root.classList.contains('motion-ready')) root.classList.add('motion-timeout'); }, 5000);
  var files = ['gsap.min.js', 'ScrollTrigger.min.js', 'SplitText.min.js', 'DrawSVGPlugin.min.js'].map(function (f) { return 'assets/vendor/gsap/' + f; }).concat('assets/motion.js');
  var started = false;
  function inject() {
    if (started) return; started = true;
    files.forEach(function (f) {
      var s = document.createElement('script');
      s.src = base + f; s.async = false;
      document.body.appendChild(s);
    });
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(inject, 0); }); });
  addEventListener('load', inject);
  setTimeout(inject, 2500);
})();
