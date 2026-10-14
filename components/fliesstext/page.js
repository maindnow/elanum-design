/* ELANUM Fliesstext · Seite. Montiert das Muster und das leise Beispiel mit eigenen Herleitungen. */
(function () {
  'use strict';
  var rad = '../resonanzrad/index.html';
  if (window.ElanumZeichen) ElanumZeichen.mountAll();
  ElanumFliesstext.mountAll({
    quellen: {
      'astrology': { text: 'Relevante Stellungen und Häuser aus Geburtsort, Geburtszeit und Planetenkonstellation.', href: rad },
      'numerology': { text: 'Zahlenmuster deines Geburtsdatums und die Beziehungen zwischen ihren zentralen Werten.', href: rad },
      'human-design': { text: 'Profil 4/6: deine bewusste und unbewusste Linie sowie die Art, wie du auf Situationen reagierst.', href: rad }
    }
  });
  ElanumFliesstext.mount(document.querySelector('[data-beispiel]'), {
    quellen: {
      'astrology': { text: 'Mond in den Fischen. Der Mond wechselt etwa alle zweieinhalb Tage das Zeichen. In den Fischen färbt er, wie du Stimmungen wahrnimmst.', href: rad },
      'values': { text: 'Dein Ergebnis Ehrlichkeit aus dem Element Werte: Was dir am wichtigsten ist, wenn du dich entscheiden musst.', href: rad },
      'attachment': { text: 'Dein Ergebnis Sicher aus dem Element Bindungsstil: Nähe und Eigenständigkeit dürfen bei dir nebeneinander stehen.', href: rad }
    }
  });
})();
