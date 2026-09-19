# ELANUM — Gestaltungsatlas 4.4

## Soft 3D Relief

Version 4.4 ergänzt eine warme Reliefoberfläche (#F0ECE3): Licht von links oben, weiche Schatten rechts unten und vertiefte Eingaben. `relief.css` überschreibt die früheren Oberflächentokens. Die Basisfarbpalette und kopierbaren Canvas-Tokens sind angepasst.

Die Logo-Card verwendet nun explizit automatische Bildhöhe und quadratische Proportionen statt der festen 960-px-Bildhöhe. Die zusätzliche Ansicht „Relief“ nutzt die unveränderte Ink-Silhouette als eingebettete SVG-Maske. Original und Kurvenkorrektur bleiben umschaltbar. Keine Logo-Quelldatei wurde verändert. Die Prägung ist eine illustrative Materialanwendung; für kleine Grössen bleiben die flachen Varianten vorgesehen.

Beziehungskreise erhalten separate, gefüllte Reliefscheiben. Konturöffnungen und Verbindungen bleiben eigenständige Pfade; Füllung und Kontur atmen synchron. Die Scheiben bleiben mathematisch rund. Bedienzustände behalten zusätzlich Text, Fokusmarkierung und Auswahlkennzeichnung; Schatten allein vermitteln keine Funktion.

## Richtung

Offene digitale Flächen, klare Kreise, bewusst gesetzte Öffnungen und kurze Verbindungen. Yrsa bleibt die Stimme für ausgewählte Aussagen; Albert Sans übernimmt Navigation, Kapitel, Beschriftungen und Lesetext. Der dunkle Beziehungsraum konzentriert die Marke auf ein zentrales interaktives Visual. Gezielte Papierreliefs, eingedrückte Eingaben und angehobene Merkzettel ergänzen die offenen Flächen. Kapitel bauen sich beim ersten Scrollen weich auf; das Logo bleibt unverändert und unbewegt.

## Logo: Korrektur, kein Redesign

Die Dateien ohne Suffix sind die unveränderten Quellen. `-Curves.svg` bezeichnet eine separate Kurvenkorrektur. Aussensilhouette, Kreisöffnung, Kreisradien, Ankerpunkte, Pfadanzahl und Linienanordnung bleiben erhalten. Angepasst wurden nur Bézier-Kontrollpunkte an den vorhandenen Innenkurven, damit benachbarte Tangenten sauber anschliessen. Die bewusste Abzweigung an der Logo-Öffnung bleibt unverändert. Gemeinsame Grenzen der Farbebenen verwenden identische Kontrollpunkte.

Der Guide zeigt beide Versionen über „Original zum Vergleich anzeigen“. Die separate SVG-Konturüberlagerung stellt Original und Korrektur gegenüber. Invers ist die identische Ink-Datei in Weiss, kein weiteres geometrisches Logo.

Geometrischer Vergleich: 5 Pfade beim Spektrum, 2 bei Ink — jeweils gleich viele wie im Original. Alle Anker und Bogenparameter sind identisch. Die grösste abgetastete Abweichung der Innenkurven beträgt 5,33 Einheiten im 960er-Koordinatenraum, entsprechend etwa 0,36 Pixel bei einer 64-Pixel-Darstellung. Es handelt sich bewusst um eine minimale Korrektur, nicht um eine neue Kreis- oder Spiralform.

## Beziehungskonstruktion

- SVG-Koordinatenraum: 720 × 400.
- Kreisradius: 128, während der Atmung maximal 137,6. Horizontaler und vertikaler Radius sind immer identisch.
- Kreiszentren: x = 172 + 0,4 × Nähe und x = 720 − erstes Zentrum; y = 200.
- Konturöffnung: symmetrisch um den unteren Kreispunkt. Kein gestrecktes Oval, keine zufällige Lücke.
- Die Verbindung trifft die beiden einander zugewandten Kreispunkte exakt. Alle Teile werden aus demselben Zustand berechnet.
- Namen sind HTML-Text und werden nicht mit dem SVG verkleinert. Die Beschriftung atmet nicht mit.
- Werte sind illustrative Gestaltungsparameter, keine psychologischen Messwerte.

## Bewegung

Ein gemeinsamer, sanfter Zyklus: 3,4 Sekunden Raum geben und 4,4 Sekunden beruhigen. Die Kosinus-Interpolation hat an beiden Umkehrpunkten Geschwindigkeit null. Die Radiusänderung beträgt maximal 7,5 %. Es gibt weder Bounce noch Aufpoppen oder Wischblenden.

Die Beziehungskreise werden gemeinsam mit der Verbindung in einem einzigen requestAnimationFrame-Takt berechnet. Nur sichtbare Darstellungen werden aktualisiert. Bei ausgeblendeter Seite oder Pause steht der Atemtakt still. Ein globaler Pausenstatus gilt für alle Demos. `prefers-reduced-motion` setzt eine vollständig ruhende Darstellung; Systemeinstellungsänderungen werden auch während der Nutzung erkannt.

Regler reagieren direkt, die grafische Anpassung wird leicht gedämpft. Produkt-Tabs wechseln bei Pointer-Bedienung mit 240 ms, per Tastatur sofort. Kapitel erscheinen einmalig mit 850 ms und kurzem Versatz; Konturen zeichnen sich einmalig in 1,8 s auf. Eine globale Pause beendet auch diese Auftritte. Papier hebt sich bei Hover leicht an; Buttons geben beim Drücken nach. Reduzierte Bewegung deaktiviert diese Bewegungen.

## Farbe

Markenspektrum: Violet → Blue → Orchid → Rose → Pink. „Pink“ ist kein Statusname mehr. Auf dunklem Ink verwendet die Verbindung aufgehellte Spektralfarben für Lesbarkeit.

Neun Feldfarben sind in drei nummerierte Gruppen A–C gegliedert. Die Nummern sind Platzhalter, keine erfundenen fachlichen Kategorien. Farbe ergänzt die Gruppierung; Nummern, Position und Auswahlstärke tragen die gleiche Information.

Statusrollen sind separat: Signal/Hinweis #89560E, Info #286F9B, Fehler #A7394D. Jede Rolle besitzt zusätzlich ein Zeichen und Text. Kleine Texte stehen nicht weiss auf hellen Markenfarben. Sekundärtext verwendet #526166, zurückhaltender Text #617275.

## Interaktion & Bedienbarkeit

- Alle Demos funktionieren lokal, ohne Backend oder externe Font-Anfragen.
- Farbwerte und Tokens sind kopierbar; die Texteingabe verändert nur die aktuelle Vorschau.
- Produkt-Tabs unterstützen Pfeiltasten sowie Home/End und korrekte Tab-/Panel-Zuordnung.
- Auswahl, Logo-Modi und Pausenstatus sind auch für assistive Technik ausgezeichnet.
- 44-px-Ziele für Bedienelemente, sichtbarer Tastaturfokus, bewegungsreduzierte Darstellung.
- Die Prüfcheckliste ist eine Arbeitshilfe und vergibt keine automatische Designfreigabe.

## Dateien

`index.html`, `style.css`, `tactile.css`, `relief.css`, `app.js` und `assets/` gemeinsam behalten. `index.html` lässt sich direkt öffnen. Die Font-Dateien sind lokal; ihre OFL-Lizenzen liegen in `assets/fonts/`.
