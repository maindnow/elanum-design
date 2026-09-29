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

Regler reagieren direkt, die grafische Anpassung wird leicht gedämpft. Produkt-Tabs wechseln bei Pointer-Bedienung mit 240 ms, per Tastatur sofort. Konturen zeichnen sich einmalig in 1,8 s auf. Eine globale Pause beendet auch diese Auftritte.

### Auftritte nach website-motion

Die Einsatz-Matrix des Skills ordnet den Styleguide als Doku-Site ein: dezente Reveals und Line-Draws, natives Scrollen ohne Lenis, kein Split-Text. Werte aus dem Katalog, nicht geschätzt: Reveal 0,9 s `power2.out` mit 2,4 rem Versatz (klein 1,6 rem, gross 3,2 rem), Start bei 88 % (92 % / 85 %), Staffel 0,12 s, Einstieg 0,14 s, Linie 1 s `power3.out`. Jeder Auftritt läuft einmal.

- Einstieg: Kopfzeile, Titel, Einleitung, Visual und Fuss nacheinander, zusammen 1,5 s.
- Beim Scrollen: Kapitelköpfe, Einleitungen, Paletten, Komponenten und Listen. Die Tageslinie unter „Heute“ zeichnet sich von oben nach unten.
- Rad: Scheibe, Ring, Stücke, Icons und Beschriftung bauen sich gestaffelt auf, danach zeichnen sich die Statusränder. Zum Schluss erscheinen Auswahlbogen und angehobenes Stück. Unter 1,5 s, nur Deckkraft und leichte Skalierung, kein Bounce. Der Lesebereich wechselt wie die Produkt-Tabs: 240 ms bei Zeigerbedienung, per Tastatur sofort.

Schutz, damit nichts verschwindet: Ohne JavaScript, bei reduzierter Bewegung oder wenn GSAP nicht lädt, ist alles sofort sichtbar; spätestens nach 5 s in jedem Fall. Auftritte nutzen nur Deckkraft und Transform, nie `visibility`, damit noch nicht gezeigte Elemente per Tab erreichbar bleiben; Fokus zeigt sie sofort. Nach dem Auftritt bleiben keine Inline-Styles zurück, der Endzustand ist pixelgleich mit der Seite ohne Auftritte. Papier hebt sich bei Hover leicht an; Buttons geben beim Drücken nach. Reduzierte Bewegung deaktiviert diese Bewegungen.

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

## Mobile-first

Die Stylesheets beschreiben zuerst das Telefon und ergänzen breitere Ansichten mit `min-width` (561, 801, 1101, 1500 px). Die Umstellung von `max-width` war verlustfrei: Bei 14 Breiten (in beiden Bewegungsmodi) und in acht Bedienzuständen bei sieben Breiten stimmte jede berechnete Eigenschaft mit dem vorherigen Stand überein. Danach bewusst geändert: Navigationslinks, Regler und Segmentknöpfe haben 44 px Höhe, der Logo-Prüflink ebenfalls. Das Klangrad lässt sich auf dem Telefon direkt antippen; jedes Feld hat dafür eine unsichtbare, grössere Trefferfläche.

## Persönliches Rad

`components/personal-wheel/` überträgt 4.4 auf den Bereich „Ich“. Anders als im Styleguide stehen hier echte Bereichsnamen und Beispielergebnisse; die Gruppen heissen Grundtöne, Ich & Orientierung sowie Beziehung & Verbindung.

- Geometrie im 320er-Raum: Zentrum 28, Icons auf Radius 48, Beschriftung auf Radius 92, Statusrand auf 124, Segmente 128, Auswahlbogen 131, Ring 134–154. Neun Segmente à 40 Grad, Gruppenabstand 4 Grad.
- Die Beschriftung liegt so weit aussen, dass auch die innerste Zeile oben ins Stück passt. Bei allen neun Drehstellungen gemessen: keine Zeile ragt sichtbar über ihr Stück.
- Farbe folgt dem Bereich: Stück, Ring, Icon, Statusrand und Ergebnis nutzen dieselbe Feldfarbe. Der Ring wird in 2-Grad-Schritten gezeichnet; um jede Stückgrenze gehen die Nachbarfarben über 16 Grad ineinander über. Die Deckkraft liegt auf der ganzen Gruppe, damit sich die Schritte nicht überlagern.
- Status: Der Rand eines Stücks ist geschlossen, wenn der Bereich ausgefüllt ist, und hat in der Mitte eine Öffnung von 12 Grad, solange er offen ist. Offene Stücke zeigen zusätzlich „offen“.
- Icons: neun Linien-Icons im 24er-Raster, Strich 1,6 px, als Kranz um „Ich“. Sie drehen gegen das Rad und bleiben aufrecht.
- Auswahl: Ein angehobenes Stück steht oben still und trägt den Relief-Schatten (hell links oben, dunkel rechts unten). Es erscheint erst, wenn das Rad ruht, weil das Licht nicht mitdreht.
- Schriftgrössen auf einem 390-px-Telefon: Namen 11,9 px, Ergebnisse 13,4 px, Ring 10,7 px, Icons 20 px.
- Ergebnisfarbe: Feldfarbe zu 55 % mit Ink gemischt, damit kleine Schrift lesbar bleibt.
- Drehung 420 ms mit der 4.4-Kurve, bei reduzierter Bewegung sofort. `touch-action: pan-y` hält senkrechtes Scrollen frei; bricht der Browser die Geste ab, rastet das Rad auf die aktuelle Auswahl zurück.

## Dateien

`index.html`, `style.css`, `tactile.css`, `relief.css`, `app.js` und `assets/` gemeinsam behalten. `index.html` lässt sich direkt öffnen. Die Font-Dateien sind lokal; ihre OFL-Lizenzen liegen in `assets/fonts/`. Unter `file://` laden die Seiten `assets/fonts/fonts-embedded.css` (erzeugt mit `tools/embed-fonts.py`), weil Chrome dort Schriftdateien blockiert.
