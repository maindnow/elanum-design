# ELANUM — Gestaltungsatlas 4.5

4.5 beruhigt den Atlas: weniger Schriftwechsel, mehr Raum, mehr Kontrast. Die Farben folgen jetzt den drei Bereichen des Resonanzrads. Das Rad, das Umfeld, der Beziehungsraum und der Weg sind echte Bausteine mit eigenen Seiten. Die neun Teile des Resonanzrads heissen Elemente. Die Bewegung erklärt, wie etwas funktioniert, statt nur einzublenden. Eine Quelle für alle Werte ist `tokens.css`.

## Benennung

Verbindlich ist das **Glossar**: eine Quelle in `assets/glossar.js`, sichtbar im Atlas (Kapitel Glossar, mit Suche) und als `GLOSSAR.md`, erzeugt mit `node tools/glossar-md.js`. Begriffe gelten in Produkt, Texten, Gestaltung und Code genau in dieser Schreibweise. Änderungen nur mit Freigabe und einer neuen Atlas-Version.

Kurz: ELANUM begleitet in drei Phasen, **Zu dir**, **Zueinander**, **Miteinander**. Im Zentrum steht das **Resonanzrad** mit neun **Elementen** in drei **Bereichen**. Rad, Umfeld, Beziehungsraum und Weg sind **Bausteine**. Das Symbol heisst **ELANUM-Zeichen**. Ältere Arbeitsnamen (Soul Resonance, Soul Kosmos, Dating-Plattform, Klangrad, ELANUM-Zeichen, Felder) werden nicht mehr verwendet.

## Richtung

Offene Flächen, klare Kreise, bewusst gesetzte Öffnungen und kurze Verbindungen. Abstand gliedert, Linien trennen nur Kapitel. Der dunkle Beziehungsraum ist das einzige dunkle Kapitel. Das Zeichen bleibt unverändert und unbewegt.

## Typografie: fünf Stufen

In einer App ist die meiste Schrift klein, schnell und bedienbar: Buttons, Listen, Werte, Beschriftungen. Albert Sans trägt sie. Grosse x-Höhe und Tabellenziffern halten sie ab 15 px klar lesbar. Yrsa hat eine kleine x-Höhe und wirkt erst gross. Sie ist die persönliche Stimme für Titel, Namen und eine Aussage pro Kapitel. Kursiv gibt es nicht mehr, betont wird über Grösse, Gewicht oder Farbe.

| Stufe | Schrift | Telefon / Desktop | Einsatz |
|---|---|---|---|
| Display | Yrsa 400 | 52 / 96 px | H1, eine grosse Aussage |
| Titel | Yrsa 400 | 32 / 48 px | Kapitel, Namen, Rad-Zentrum |
| Überschrift | Albert Sans 600 | 20 / 22 px | Unterabschnitte, Karten, Werte |
| Text | Albert Sans 400 | 17 / 18 px | Fliesstext |
| Label | Albert Sans 500, betont 600 | 15 px | Beschriftung, Tabs, Buttons. Das Minimum. |

Sekundärtext ist `#3D5055` (7,2:1 auf Canvas). Im Rad werden Ringschrift und Icons auf echte 15 bzw. 30 px umgerechnet, egal wie gross das Rad gezeigt wird.

## Farbe: drei Rollen

**Neutral:** Canvas `#F0ECE3`, Papier `#F6F1E7`, Ink `#16363B`, Sekundärtext `#3D5055`.

**Bereiche des Resonanzrads:** Jeder Bereich hat einen Grundton. Die drei Bereiche sind ausgeglichen: gleiche Helligkeit auf jeder Stufe (OKLCH L 0,46 / 0,83 / 0,875 / 0,915 / 0,955) und angeglichene Sättigung (Petrol rund ×0,7, weil es sonst schwerer wirkt), damit kein Bereich dominiert. Die Elementstufen liegen bewusst eng und hell beieinander (benachbarte Stufen ΔE ≥ 4): Ein ausgefülltes Element wirkt nie schwerer als seine Nachbarn. Frühere Stände von 4.5 hatten Stufe 1 bei L 0,74; Astrologie und Bindungsstil wirkten dadurch zu stark.

| Bereich | Tief · Schrift | Element 1 | Element 2 | Element 3 | Hauch · Ring und offen |
|---|---|---|---|---|---|
| Grundtöne · Violett | `#59479A` | `#C6C1F0` | `#D5D1F7` | `#E2DFFB` | `#EFEEFE` |
| Ich & Orientierung · Koralle | `#8E3931` | `#EEB8AF` | `#F5CAC3` | `#FADBD5` | `#FFEBE7` |
| Beziehung & Verbindung · Petrol | `#006868` | `#A5D1D1` | `#BBDEDE` | `#CFE9E9` | `#E3F4F4` |

Violett, Koralle und Petrol wurden gegen andere Trios getestet, auch für Farbsehschwächen. Merkbar sind sie über ihre Bedeutung: Violett für Herkunft und Tiefe, Koralle für Wärme und das Selbst, Petrol für Verbindung und die Nähe zum Ink.

Regeln: Weisse Schrift nur auf Tief (mindestens 6,6:1). Tief als Schriftfarbe auf Canvas und Hauch (mindestens 5,4:1). Ink auf dem Hauch (mindestens 10:1). Auf den Stufen 1 bis 3 stehen Icon, Name und Ergebnis in Ink (mindestens 7,5:1). Diese Stufen sind bewusst hell, damit das Rad auch nach dem Aufbau ruhig bleibt. Der Ring zeigt alle drei Bereiche gleich stark im Hauch und hebt nichts hervor. Der Auswahlbogen über dem gewählten Element steht in Tief seines Bereichs und glüht in derselben Farbe, nie im Markenspektrum: Violett auf Petrol oder Koralle wirkt fremd. Die frühere Feldpalette aus 4.4 (Blue, Orchid, Pink, Amber, Moss, Teal in Gruppen A–C) ist ersetzt.

**Markenspektrum** Violet → Blue → Orchid → Rose → Pink: für das Zeichen, die Verbindungslinie und den Glührand. Keine Fläche, keine Kategorie.

**Verläufe als Liste** (auch im Atlas kopierbar, Werte in `tokens.css`):

- Markenspektrum: `#6756D9, #4D7FE8, #9466DF, #D85BA9, #F0719A`
- Verbindung: `#6756D9, #D85BA9`
- Glührand, geschlossener Kreis: `#6756D9, #4D7FE8, #9466DF, #D85BA9, #F0719A, #6756D9`
- Grundtöne, tief bis Hauch: `#59479A, #C6C1F0, #D5D1F7, #E2DFFB, #EFEEFE`
- Ich & Orientierung, tief bis Hauch: `#8E3931, #EEB8AF, #F5CAC3, #FADBD5, #FFEBE7`
- Beziehung & Verbindung, tief bis Hauch: `#006868, #A5D1D1, #BBDEDE, #CFE9E9, #E3F4F4`

**Status:** Info `#2863AB`, Hinweis `#875500`, Fehler `#B02A2D`, Erfolg `#2B7440`, je mit eigener Hauchfläche. Text auf der Fläche hat mindestens 5:1. Jeder Status hat einen 4-px-Balken, ein gefülltes Zeichen im Kreis und ein Label. Weil Koralle-Tief nahe am Fehler-Rot liegt, unterscheidet die Form: Status hat immer Zeichen und Balken, Bereiche nie.

## Material

Warme Reliefoberfläche, Licht von links oben. Was man bedienen kann, hebt sich an (`--raised`), Eingaben liegen vertieft (`--pressed`). Radien: Control 12 px, Button 16 px, Fläche 28 px. Schatten tragen nie allein eine Funktion; Auswahl hat immer auch Text, Fokus oder ein Zeichen.

**Glührand und Hover:** Bedienbare Flächen zeigen bei Hover, Fokus und Auswahl einen Rand, dessen Farbe dem Markenspektrum entlang im Kreis wandert (6 s pro Umlauf), dazu ein weiches Glühen. Ausgewählte Flächen (gewähltes Element, gewählte Person, aktiver Tab, bewusste Auswahl) glühen im Atemtakt. Jeder Hover ist gut sichtbar: Karten heben sich und glühen, Listen und Navigation bekommen eine Fläche, Links werden violett mit kräftigerer Unterstreichung, Buttons hellen auf und heben sich. Ohne Bewegung steht der Verlauf still.

Der Glührand gilt durchgängig für alles, was man bedienen kann: Buttons (über `.button` automatisch), Segmente, Tabs, Listen, Navigation, Links mit Klasse, Farbstufen, Kopieren-Knöpfe, Checkbox-Zeilen und Pause-Schalter. Eingabefelder und Textfelder liegen in einer Hülle `.field.glow-edge`, die Vertiefung und Rand trägt; sie leuchtet bei Hover und sobald das Feld den Fokus hat. Schieberegler zeigen den wandernden Rand als Ring um den Griff. Ausnahmen: das ELANUM-Zeichen als Link, Textlinks im Fliesstext und der Sprunglink (Fokusring).

Das Papier (gespeicherter Gedanke) hat dieselben 28 px Radius wie jede Fläche und einen eigenen, ruhigeren Schatten (`--paper-shadow`).

Buttons blitzen nicht mehr: Die Grundfarbe liegt unter dem Verlauf, und Hover hellt über eine eigene Ebene auf, statt den Hintergrund zu tauschen. In 4.4 tauschte die Hover-Regel den Verlauf gegen eine Fläche, die von transparent einblendete; dazwischen schien die helle Fläche durch.

## Das ELANUM-Zeichen: sechs Grundkreise

Das ELANUM-Zeichen stammt aus dem ELANUM-Geometrie-Paket, Konstruktionsversion 4. Es ist auf das Nötigste reduziert: sechs Grundkreise und fünf benannte Brücken.

| Grundkreis | Aufgabe | Radius |
| --- | --- | --- |
| C1 Mantel | Runde Aussenform, Mittelpunkt und Radius wie bisher | 460,54 |
| C2 Zentrum | Kreisöffnung; P1 und P2 liegen auf diesem Kreis | 122,05 |
| C3 Oberbogen | Wölbung oberhalb des Zentrums | 248,38 |
| C4 Unterbogen | Grosser Schwung unterhalb des Zentrums | 211,60 |
| C5 Mündung oben | Oberkante der rechten Öffnung | 161,90 |
| C6 Mündung unten | Unterkante der rechten Öffnung | 187,74 |

| Brücke | Verbindung | Regel |
| --- | --- | --- |
| B1 Rücklauf | P2 am Zentrum zu C3 | Krümmung nimmt linear vom Zentrums- zum Oberbogenradius ab |
| B2 Anschluss oben | P1 am Zentrum zu C4 | Kurzer Übergang öffnet die untere Aussparung |
| B3 Öffnung | C3 zu C5 und C6 | Linearer Krümmungswechsel mit genau einem Wendepunkt |
| B4 Lippen | C5 und C6 zu C1 | Rundet die beiden Enden der rechten Öffnung |
| B5 Auslauf | C4 zum linken Spaltende | Spaltbreite nimmt durchgehend bis null ab |

Kreisabschnitte sind echte SVG-Bögen. Die Brücken sind kubische B-Splines, exportiert als SVG-Bézierkurven, intern krümmungsstetig. An allen 209 Anschlüssen stimmen Lage, Tangente und Krümmung überein (G2). Die Spalte haben 4,5 Einheiten Breite. Der obere Spalt läuft ohne Einschnürung über B3 in die Öffnung. Beide Spalte beginnen am Zentrum mit Breite null und liegen ausserhalb der Kreisöffnung. Im Spektrum sind alle Farbverläufe aus dem Master erhalten; verdeckte Flächenschliessungen sind Bézierkurven, die Überblendung der linken Farbfläche ist an die neue Kontur angepasst.

`tools/build_logo_geometrie.py` erzeugt Ink, Spektrum, Blueprint, die Detailansicht von B3 und B5, den Formvergleich zur Kurvenkorrektur und `ELANUM-Konstruktion-Geometrisch.json` mit allen Parametern und Prüfwerten. Der Konstruktor ist aus dem Paket übernommen, nur die Pfade sind angepasst. Er benötigt numpy und scipy (`tools/requirements.txt`). Der Lauf reproduziert die SVGs des Pakets byte-genau.

Die Zeichen-Karte im Atlas zeigt Spektrum, Ink, Invers, Relief und Blueprint und blendet auf Wunsch das unveränderte Original ein. „Relief“ nutzt die Ink-Silhouette als eingebettete SVG-Maske.

### Entstehung

Die bisherigen Innenkonturen waren freie Bézier-Kurven. Innerhalb eines Bogens schwankte der Radius (z. B. 289 → 249 → 342), an den Übergängen sprang er (z. B. 245 → 289). Die Tangenten schlossen an, die Krümmung nicht, deshalb wirkten die Rundungen unruhig.

Als Zwischenstufen entstanden Fassungen nur aus Kreisbögen, eine nah am Original und eine mit Radien im Goldenen Schnitt. Sie wurden verworfen. Reine Kreisbögen lassen an jedem Übergang einen kleinen Krümmungssprung, und sie brauchten deutlich mehr Kreise. Die Brücken mit stetiger Krümmung sind ruhiger und kommen mit sechs Grundkreisen aus.

## Frühere Stufe: Kurvenkorrektur (4.4)

Die Dateien ohne Suffix sind die unveränderten Quellen. `-Curves.svg` bezeichnet eine separate Kurvenkorrektur. Aussensilhouette, Kreisöffnung, Kreisradien, Ankerpunkte, Pfadanzahl und Linienanordnung bleiben erhalten. Angepasst wurden nur Bézier-Kontrollpunkte an den vorhandenen Innenkurven, damit benachbarte Tangenten sauber anschliessen. Die bewusste Abzweigung an der Logo-Öffnung bleibt unverändert. Gemeinsame Grenzen der Farbebenen verwenden identische Kontrollpunkte.

Die separate SVG-Konturüberlagerung stellt Original und Korrektur gegenüber. Seit 4.5 ersetzt die Konstruktion aus sechs Grundkreisen die Kurvenkorrektur im Atlas; die Dateien bleiben zum Download. Invers ist die identische Ink-Datei in Weiss, kein weiteres geometrisches Logo.

Geometrischer Vergleich: 5 Pfade beim Spektrum, 2 bei Ink — jeweils gleich viele wie im Original. Alle Anker und Bogenparameter sind identisch. Die grösste abgetastete Abweichung der Innenkurven beträgt 5,33 Einheiten im 960er-Koordinatenraum, entsprechend etwa 0,36 Pixel bei einer 64-Pixel-Darstellung. Es handelt sich bewusst um eine minimale Korrektur, nicht um eine neue Kreis- oder Spiralform.

## Bausteine

Im Zentrum steht das Resonanzrad mit neun Elementen: den Grundlagen, aus denen Resonanz entsteht. Alle Bausteine liegen unter `components/` und laufen als eigene Seite sowie eingebettet im Atlas, mit demselben Code. Sie sind klassische Skripte mit einer `mount()`-Funktion, weil Chrome ES-Module unter `file://` nicht lädt.

**Resonanzrad** (`components/resonanzrad/`), wiederhergestellt aus dem persönlichen Rad (Repo-Stand `8995945`) und überarbeitet:
- Geometrie unverändert verbindlich: exakter Kreis, neun Stücke à 40°, drei Bereiche à 120°, ein gemeinsamer Mittelpunkt.
- Farbe heisst ausgefüllt: Ein ausgefülltes Stück trägt seine Nuance (tief, mittel, hell), ein offenes nur den Hauch seines Bereichs. Die Kontur bestätigt es: geschlossen oder mit Öffnung.
- Im Rad stehen Icon, Name und Ergebnis jedes Elements in echten 15 px, weil man sich Icons allein nicht merkt. Ist das Rad schmaler als 420 px, steht im Stück nur der Name; Icon und Ergebnis zeigt dann die Zeile direkt unter dem Rad. Der Auswahlbogen steht in der Farbe seines Bereichs und glüht im Atemtakt. Namen, Ergebnisse und Status stehen in der Liste und im Lesebereich. Die Liste ist die Tastaturbedienung (Pfeile, Home, End).
- Der Ring zeigt die drei Bereiche gleich stark und hebt nichts hervor. Icons, Konturen und Auswahlbogen sind Ink.

**Umfeld** (`components/umfeld/`): Ich in der Mitte, Menschen als eigene, offene Kreise. Abstand zeigt Nähe, die Stärke der Linie die Resonanz, ohne aktive Resonanz gibt es keine Linie. Eine Liste ist die Bedienung, der gewählte Mensch öffnet den Beziehungsraum mit seinen Werten. So trägt das Umfeld mehr als eine einzelne Beziehung. Unter 560 px Breite gilt ein Hochformat mit grösseren Kreisen, damit die Namen in echten 15 px hineinpassen.

**Beziehungsraum** (`components/beziehungsraum/`):
- SVG-Raum 720 × 400, Kreisradius 128, in der Atmung höchstens 137,6, horizontal und vertikal immer gleich.
- Zentren x = 172 + 0,4 × Nähe und x = 720 − erstes Zentrum, y = 200.
- Öffnung symmetrisch um den unteren Kreispunkt. Die Verbindung trifft beide Konturen exakt.
- Namen sind HTML-Text und atmen nicht mit. Werte sind Gestaltungsparameter, keine Messung.

**Weg und Tageslinie** (`components/weg/`, Baustein `.track` in `base.css`): Stationen erledigt (gefüllter Punkt), jetzt (Ring) und offen (Kontur mit Öffnung unten). Bis „jetzt“ führt die Spur, danach eine Unterbrechung. Labels stehen in einer eigenen Spalte und kreuzen die Linie nie. Waagrecht ab 900 px, darunter senkrecht.

**Linien-System:** Kontur 1,6 px, Verbindung 2,8 px, Knoten 3,3 px Radius. **Icons:** 24er-Raster, 1,6 px, runde Enden, keine Füllung, Sprache aus Kreisen, Öffnungen und Verbindungen.

## Bewegung

Bewegung erklärt: Kreise rücken zusammen, das Rad baut sich Bereich für Bereich auf, eine Spur zeichnet sich bis zu dir. GSAP 3.15 mit ScrollTrigger, SplitText und DrawSVG liegt lokal unter `assets/vendor/gsap/`; nur `assets/motion.js` spricht damit. Die Ziele stehen als `data-anim` im Markup. Kein Smooth-Scroll; die beiden Scroll-gekoppelten Szenen nutzen `scrub: 1`.

| Moment | Was sich bewegt |
|---|---|
| Einstieg | Titelzeilen steigen maskiert auf (140 ms Versatz), Text und Link folgen, unter 1,5 s. Das Zeichen steht. |
| Kapiteltitel | Zeilen steigen einmal auf, ab 85 % Fensterhöhe. |
| Blöcke und Gruppen | Einmal, 900 ms, 24 px, ab 88 %; Gruppen 120 ms Versatz, höchstens 0,48 s. |
| Beziehung | Kreise starten weit, Konturen zeichnen sich, dann rücken sie auf „nah“, die Verbindung entsteht. Die Regler laufen mit und zeigen, was sie bedeuten. Wer einen Regler anfasst, übernimmt sofort. |
| Resonanzrad | Das einzige festgehaltene Kapitel (ab 900 px): Zentrum, drei Bereiche nacheinander, Stücke, Füllung der ausgefüllten Elemente, Konturen. Daneben erklären vier Schritte, was geschieht. Schmaler läuft dieselbe Folge einmal ohne Festhalten. |
| Farbe | Jede Rampe wächst von Tief nach Hauch. |
| Umfeld | Menschen rücken aus dem Rand auf ihre Nähe, danach zeichnen sich die Verbindungen. |
| Weg und Tageslinie | Die Spur wächst, Stationen erscheinen beim Erreichen. Auf der Element-Seite an den Scroll gekoppelt. |
| Status | Das Zeichen federt beim Wechsel kurz ein. |
| Glühen | Die Station „jetzt“, der Auswahlbogen im Rad und ausgewählte Flächen glühen im Atemtakt; Verbindungslinien leuchten weich. |
| Bedienung | 160–220 ms, ohne Blitz. |
| Immer | Nur die Atmung: 3,4 s Raum geben, 4,4 s zur Ruhe, höchstens 7,5 % Radius. |

Alle Auftritte setzen ihre Endwerte ausdrücklich, und der Versteck-Guard wird vor dem Anlegen gelöst; vorher sprangen manche Blöcke am Ende schlagartig auf. Das festgehaltene Kapitel wird zuerst angelegt, damit alle Auftritte dahinter zur richtigen Stelle auslösen, und jeder einmalige Auftritt gilt bis zum Seitenende, damit auch schnelles Scrollen oder ein Sprung über die Navigation ihn auslöst. Ohne Festhalten (Telefon) baut sich nur das Rad auf, Lesebereich und Liste sind sofort da.

Kein Auftritt versteckt Inhalte. Ohne JavaScript und bei reduzierter Bewegung ist alles sofort sichtbar, spätestens nach 5 s auch dann, wenn GSAP nicht lädt. Was beim Laden schon im Bild ist, erscheint ohne Auftritt. Versteckt wird nur über die Deckkraft, damit alles per Tab erreichbar bleibt. Tastatur, Fokus auf etwas noch Unsichtbarem und die globale Pause beenden alle Auftritte und lösen das festgehaltene Kapitel. Titel werden erst nach dem Laden der Schriften gesplittet, Screenreader lesen den ganzen Satz.

## Interaktion und Bedienbarkeit

- Alles läuft lokal, ohne Backend und ohne externe Anfragen. Unter `file://` lädt `assets/boot.js` eingebettete Schriften.
- Farbwerte und Tokens sind kopierbar; der Tokenblock liest die Werte live aus `tokens.css`.
- Tabs, Rad-Liste und Umfeld-Liste sind per Tastatur bedienbar und für assistive Technik ausgezeichnet.
- 44-px-Ziele, sichtbarer Fokus, bewegungsreduzierte Darstellung.
- Die Prüfcheckliste ist eine Arbeitshilfe und keine automatische Freigabe.
