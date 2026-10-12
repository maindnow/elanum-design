/* ============================================================
   ELANUM Glossar · verbindliche Benennung
   Die eine Quelle für Begriffe. Der Atlas (Kapitel Glossar) zeigt sie,
   GLOSSAR.md wird daraus erzeugt:  node tools/glossar-md.js
   Begriffe nur mit Freigabe und neuer Atlas-Version ändern.
   ============================================================ */
window.ELANUM_GLOSSAR = {
  version: '4.8',
  rule: 'Diese Begriffe sind verbindlich. Sie gelten in Produkt, Texten, Gestaltung und Code, genau in dieser Schreibweise, inklusive Gross- und Kleinschreibung und „&“. Neue Begriffe oder Änderungen nur mit Freigabe und einer neuen Atlas-Version.',
  sentence: 'Mit ELANUM findest du zu dir, zueinander und miteinander. Resonanz zeigt den Weg.',
  groups: [
    { title: 'Marke', terms: [
      { term: 'ELANUM', meaning: 'Die Marke. Immer in Versalien.' },
      { term: 'ELANUM-Zeichen', meaning: 'Das runde, farbige Symbol der Marke, vollständig aus Kreisbögen konstruiert, alle Radien im Goldenen Schnitt. Darstellungen: Spektrum, Ink, Invers, Relief, Blueprint. Es bewegt sich nie.', code: 'assets/ELANUM-*-Harmonic.svg' },
      { term: 'Kreiskonstruktion', meaning: 'Bauweise des ELANUM-Zeichens: jede Kontur ein Kreisbogen, alle Radien aus der Reihe R·φ^(−k/4) (Goldener Schnitt), Übergänge ohne Knick.', code: 'tools/build_logo_circles.py' },
      { term: 'Blueprint', meaning: 'Darstellung des ELANUM-Zeichens mit allen Konstruktionskreisen, Mittelpunkten und Berührpunkten.', code: 'assets/ELANUM-Konstruktion-Harmonic.svg' },
      { term: 'Resonanz', meaning: 'Es schwingt zu dir, zu deinem Partner oder deinem Umfeld.' }
    ] },
    { title: 'Kosmen', intro: 'Die drei Räume von ELANUM. Der Resonanzkosmos ist der Einstieg, Datingkosmos und Erlebniskosmos stehen gleichwertig daneben.', terms: [
      { term: 'Kosmos', meaning: 'Einer der drei Räume von ELANUM, jeder mit einem eigenen Satz. Mehrzahl: Kosmen. Der Name immer in einem Wort, wie Resonanzrad.' },
      { term: 'Resonanzkosmos', meaning: 'Resonanz in dir, in deiner Partnerschaft und in deinem Umfeld. Der Einstieg in ELANUM.', code: 'Resonanzrad · Heute · Weg · Umfeld · Beziehungsraum' },
      { term: 'Datingkosmos', meaning: 'Finde die eine Resonanz. Hier geht es nur ums Dating.' },
      { term: 'Erlebniskosmos', meaning: 'Resoniere mit anderen. Events, unabhängig vom Dating.' }
    ] },
    { title: 'Resonanzrad', terms: [
      { term: 'Resonanzrad', meaning: 'Das Zentrum von ELANUM. Es beschreibt einen Menschen in neun Elementen. Immer ein Wort.', code: 'components/resonanzrad · ElanumResonanzrad' },
      { term: 'Ich', meaning: 'Die Mitte des Resonanzrads. Das Rad beschreibt nur dich, nie andere.' },
      { term: 'Element', meaning: 'Einer der neun Teile des Resonanzrads: eine Grundlage, aus der Resonanz entsteht. Mehrzahl: Elemente.', code: 'items[].id' },
      { term: 'Bereich', meaning: 'Eine der drei Gruppen im Resonanzrad mit je drei Elementen und einer eigenen Farbe.', code: 'sterne · ich · bezug' },
      { term: 'Sterne & Ursprung', meaning: 'Bereich in Violett: Astrologie, Numerologie, Human Design. Alle drei gehen von deiner Geburt aus.', code: 'sterne' },
      { term: 'Ich & Orientierung', meaning: 'Bereich in Koralle: Lebensrichtung, Persönlichkeit, Werte.', code: 'ich' },
      { term: 'Beziehung & Verbindung', meaning: 'Bereich in Petrol: Bindungsstil, Nähe & Zuneigung, Konfliktstil.', code: 'bezug' },
      { term: 'Ergebnis', meaning: 'Was ein ausgefülltes Element über dich sagt, zum Beispiel „Jungfrau“ oder „Sicher“.' },
      { term: 'ausgefüllt · offen', meaning: 'Zustand eines Elements. Ausgefüllt: Fläche in der Farbe seines Bereichs. Offen: grau, gestrichelt umrandet, mit einem Plus zum Ausfüllen.', code: 'done · --offen' }
    ] },
    { title: 'Bausteine', intro: 'Gestaltete Darstellungen mit eigener Seite und gleichem Code im Atlas.', terms: [
      { term: 'Baustein', meaning: 'Eine gestaltete Darstellung wie Resonanzrad, Umfeld oder Weg.', code: 'components/' },
      { term: 'Heute', meaning: 'Dein Tag. Zeigt die Tageslinie. Gehört zum Resonanzkosmos.' },
      { term: 'Tageslinie', meaning: 'Momente eines Tages als Stationen, ohne Feed.', code: '.track' },
      { term: 'Weg', meaning: 'Deine Entwicklung als Stationen bis jetzt, danach eine Unterbrechung.', code: 'components/weg' },
      { term: 'Station', meaning: 'Ein Punkt auf Weg oder Tageslinie: erledigt (gefüllt), jetzt (Ring), offen (Kontur mit Öffnung).', code: 'data-state="done · now · open"' },
      { term: 'Umfeld', meaning: 'Ich in der Mitte, Menschen als eigene Kreise nach Nähe und Resonanz.', code: 'components/umfeld' },
      { term: 'Beziehungsraum', meaning: 'Zwei eigene Räume und die Verbindung dazwischen.', code: 'components/beziehungsraum' },
      { term: 'Verbindung', meaning: 'Die Linie zwischen zwei Kreisen. Sie trifft beide Konturen exakt.' },
      { term: 'Nähe · Resonanz · Freiraum', meaning: 'Die drei Werte einer Beziehung: Abstand der Kreise, Stärke der Verbindung, Grösse der Öffnung. Gestaltungswerte, keine Messung.', code: 'proximity · resonance · openness' },
      { term: 'Atmung', meaning: 'Der gemeinsame Bewegungstakt der Kreise: 3,4 s Raum geben, 4,4 s zur Ruhe kommen.' }
    ] },
    { title: 'Farbe und Material', terms: [
      { term: 'Canvas · Papier · Ink', meaning: 'Grundfläche, warme Fläche für Persönliches, Schriftfarbe.', code: '--canvas · --paper · --ink' },
      { term: 'Bereichsfarbe', meaning: 'Die Farbe eines Bereichs in drei Stufen: Tief (Schrift), Fläche (ausgefüllte Elemente, eine Farbe für alle drei Elemente des Bereichs), Hauch (Ring, Flächen hinter Text).', code: '--sterne-tief · --sterne-flaeche · --sterne-hauch' },
      { term: 'Markenspektrum', meaning: 'Violett bis Pink. Nur für das ELANUM-Zeichen, die Verbindung und den Glührand.', code: '--spectrum-stops' },
      { term: 'Glührand', meaning: 'Rand im Markenspektrum, der bei Hover, Fokus und Auswahl im Kreis wandert, dazu ein weiches Glühen.', code: '.glow-edge · --edge-stops' },
      { term: 'Status', meaning: 'Info, Hinweis, Fehler, Erfolg. Immer mit Zeichen, Balken und Text, nie nur Farbe.', code: 'data-role' },
      { term: 'Relief', meaning: 'Licht von links oben. Bedienbares ist angehoben, Eingaben sind vertieft.', code: '--raised · --pressed' }
    ] }
  ],
  avoid: [
    ['Soul Resonance', 'ELANUM'],
    ['Soul Kosmos', 'Resonanzkosmos'],
    ['Dating Kosmos, Dating-Plattform', 'Datingkosmos'],
    ['Event Kosmos', 'Erlebniskosmos'],
    ['Zu dir, Zueinander, Miteinander (als Name)', 'Resonanzkosmos, Datingkosmos, Erlebniskosmos'],
    ['Phase, Phasen (für die drei Räume)', 'Kosmos, Kosmen'],
    ['Klangrad, persönliches Rad', 'Resonanzrad'],
    ['Klangsignatur, Logo-Signatur', 'ELANUM-Zeichen'],
    ['Kurvenkorrektur (als aktuelles Zeichen)', 'Kreiskonstruktion'],
    ['Sechs Grundkreise, Nah am Original (als aktuelles Zeichen)', 'ELANUM-Zeichen'],
    ['Eigenklang, Klang', 'Resonanz'],
    ['Grundtöne', 'Sterne & Ursprung'],
    ['Felder, Stücke', 'Elemente'],
    ['Kategorie, Gruppe A–C', 'Bereich']
  ]
};
