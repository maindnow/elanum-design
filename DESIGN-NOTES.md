# ELANUM — Gestaltungsatlas 4.5

## Logo: Kreiskonstruktion (4.5)

Version 4.5 baut die Klangsignatur vollständig aus Kreisen auf. Die bisherigen Innenkonturen waren freie Bézier-Kurven: Innerhalb eines Bogens schwankte der Radius (z. B. 289 → 249 → 342), an den Übergängen sprang er (z. B. 245 → 289). Die Tangenten schlossen an, die Krümmung nicht. Dadurch wirkten die Rundungen unruhig. Die Kurvenkorrektur aus 4.4 hat nur Kontrollpunkte verschoben und konnte das nicht beheben.

Konstruktionsregeln:

- Jede Kontur ist eine Kette aus Kreisbögen. Zwei aufeinanderfolgende Bögen berühren sich tangential: Ihre Mittelpunkte liegen mit dem Übergangspunkt auf einer Geraden. Gemessener Knick an allen Übergängen: 0°.
- Rahmen: Aussenkreis R und Kreisöffnung r₀.
- Die beiden feinen Linien sind wie Schriftzüge gebaut. Eine Mittellinie aus Kreisbögen trägt die Form. Ihre Radien ändern sich stetig, von Bogen zu Bogen höchstens um etwa den Faktor 1,25; die obere Linie wächst von 144 auf 300. Der Linienkörper ist konzentrisch zur Mittellinie und überall gleich stark (obere Linie 6, untere 5 Einheiten). Erster und letzter Bogen der Mittellinie sind kurze Spitzenbögen (rund 110–150 Einheiten lang). Dort ersetzt je Kante ein Spitzenkreis den Körper; beide Spitzenkreise berühren sich im Endpunkt. Die Stärke nimmt dadurch gleichmässig von 0 auf den vollen Wert zu und am Ende wieder ab, ohne lange Haarlinien.
- Berührpunkte: E (obere Linie an der Öffnung), S (untere Linie an der Öffnung), T (obere Linie und Kerbe) und W (Spitze der unteren Linie). In T berühren sich vier Kreise in derselben Tangente: Die Linie geht über eine S-Kurve in die Kerbe über.
- Die Kerbe ist eine Mondsichel zweier Kreise, die sich in T berühren. Sie endet im Schnitt mit dem Aussenkreis.
- Die Farbkanten des Spektrums (vordere Fläche, Band, Schwanz) laufen auf Konstruktionskreisen. Die Farbkanten laufen auf den Mittellinien. Der Abschluss der vorderen Fläche setzt die untere Linie in W tangential fort. Bewusste Ecken bleiben nur an Abzweigungen, die schon im Original Ecken waren: an der Schwanzkante in T sowie am unteren Bandlappen, wo er von Linie 2 abzweigt und im ausgeblendeten Bereich umknickt.
- Das Farbnetz des Spektrums (Verläufe, Masken, Farben) ist unverändert aus der Kurvenkorrektur übernommen. Nur die fünf Clip-Pfade sind ersetzt.

Zwei Varianten, gleiche Topologie:

| | Nah am Original (`-Circles`) | Goldener Schnitt (`-Harmonic`) |
| --- | --- | --- |
| Radien | Ganzzahlige Leitkreise: 144, 158, 166, 169, 186, 191, 195, 204, 239, 240, 254, 264, 299, 300, 319, 370, 557 | Stufen der Reihe R · φ^(−k/4); vier Stufen ergeben genau den Goldenen Schnitt. Verwendet: k = 11, 10, 9, 8, 7, 6, 5, 4, 3, 0, −2 |
| Rahmen | R 460,54 · r₀ 122,05 (unverändert) | R 460,54 · r₀ = Stufe 11 = 122,62 |
| Max. Abweichung zur Kurvenkorrektur | 9,0 Einheiten im 960er-Raster (≈ 0,6 px bei 64 px) | 22,2 Einheiten; die obere Linie liegt weiter aussen, die Kerbe öffnet sich weiter |

Die Abweichung ist entlang der Innenkonturen abgetastet. Sie ist bewusst etwas grösser als bei einer reinen Nachzeichnung: Die alten Kurven hatten selbst Dellen, etwa den fast geraden Abschnitt mit anschliessendem engem Haken am Ende der unteren Linie. Die Konstruktion übernimmt diese Unruhe nicht. Die Blueprints `ELANUM-Konstruktion-Circles.svg` und `ELANUM-Konstruktion-Harmonic.svg` zeigen alle Kreise, Mittelpunkte, Übergänge und Berührpunkte. Gestrichelte Kreise sind die Spitzenkreise der Linien.

Alle Dateien erzeugt `tools/build_logo_circles.py` (nur Python-Standardbibliothek). Das Skript enthält die Kreisparameter beider Varianten, prüft Knicke und Abweichung und schreibt Ink, Spektrum und Blueprint. Mit `--masks` gibt es zusätzlich die Relief-Masken für `app.js` aus. Die Originale und die Kurvenkorrektur bleiben als Referenz unverändert erhalten.

## Soft 3D Relief

Version 4.4 ergänzt eine warme Reliefoberfläche (#F0ECE3): Licht von links oben, weiche Schatten rechts unten und vertiefte Eingaben. `relief.css` überschreibt die früheren Oberflächentokens. Die Basisfarbpalette und kopierbaren Canvas-Tokens sind angepasst.

Die Logo-Card verwendet automatische Bildhöhe und quadratische Proportionen statt der festen 960-px-Bildhöhe. Die Ansicht „Relief“ nutzt die Ink-Silhouette der gewählten Konstruktion als eingebettete SVG-Maske. Seit 4.5 schaltet die Card zwischen „Nah am Original“ und „Goldener Schnitt“ um, zeigt im Modus „Blueprint“ die Konstruktionskreise und blendet auf Wunsch das unveränderte Original ein. Die Prägung ist eine illustrative Materialanwendung; für kleine Grössen bleiben die flachen Varianten vorgesehen.

Beziehungskreise erhalten separate, gefüllte Reliefscheiben. Konturöffnungen und Verbindungen bleiben eigenständige Pfade; Füllung und Kontur atmen synchron. Die Scheiben bleiben mathematisch rund. Bedienzustände behalten zusätzlich Text, Fokusmarkierung und Auswahlkennzeichnung; Schatten allein vermitteln keine Funktion.

## Richtung

Offene digitale Flächen, klare Kreise, bewusst gesetzte Öffnungen und kurze Verbindungen. Yrsa bleibt die Stimme für ausgewählte Aussagen; Albert Sans übernimmt Navigation, Kapitel, Beschriftungen und Lesetext. Der dunkle Beziehungsraum konzentriert die Marke auf ein zentrales interaktives Visual. Gezielte Papierreliefs, eingedrückte Eingaben und angehobene Merkzettel ergänzen die offenen Flächen. Kapitel bauen sich beim ersten Scrollen weich auf; das Logo bleibt unbewegt.

## Frühere Stufe: Kurvenkorrektur (4.4)

Die Dateien ohne Suffix sind die unveränderten Quellen. `-Curves.svg` bezeichnet eine separate Kurvenkorrektur. Aussensilhouette, Kreisöffnung, Kreisradien, Ankerpunkte, Pfadanzahl und Linienanordnung bleiben erhalten. Angepasst wurden nur Bézier-Kontrollpunkte an den vorhandenen Innenkurven, damit benachbarte Tangenten sauber anschliessen. Die bewusste Abzweigung an der Logo-Öffnung bleibt unverändert. Gemeinsame Grenzen der Farbebenen verwenden identische Kontrollpunkte.

Die separate SVG-Konturüberlagerung stellt Original und Korrektur gegenüber. Seit 4.5 ersetzt die Kreiskonstruktion die Kurvenkorrektur im Styleguide; die Dateien bleiben zum Download. Invers ist die identische Ink-Datei in Weiss, kein weiteres geometrisches Logo.

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
