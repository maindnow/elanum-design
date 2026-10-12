# ELANUM — Gestaltungsatlas 4.7

4.7 fasst den Begriff Resonanz neu: Es schwingt zu dir, zu deinem Partner oder deinem Umfeld.

4.6 benennt die drei Phasen neu. Sie heissen jetzt Kosmen: Resonanzkosmos, Datingkosmos, Erlebniskosmos. Gestaltung und Werte bleiben wie in 4.5.

4.5 beruhigt den Atlas: weniger Schriftwechsel, mehr Raum, mehr Kontrast. Die Farben folgen jetzt den drei Bereichen des Resonanzrads. Das Rad, das Umfeld, der Beziehungsraum und der Weg sind echte Bausteine mit eigenen Seiten. Die neun Teile des Resonanzrads heissen Elemente. Die Bewegung erklärt, wie etwas funktioniert, statt nur einzublenden. Eine Quelle für alle Werte ist `tokens.css`.

## Benennung

Verbindlich ist das **Glossar**: eine Quelle in `assets/glossar.js`, sichtbar im Atlas (Kapitel Glossar, mit Suche) und als `GLOSSAR.md`, erzeugt mit `node tools/glossar-md.js`. Begriffe gelten in Produkt, Texten, Gestaltung und Code genau in dieser Schreibweise. Änderungen nur mit Freigabe und einer neuen Atlas-Version.

Kurz: ELANUM hat drei **Kosmen**. Der **Resonanzkosmos** ist der Einstieg: Resonanz in dir, in deiner Partnerschaft und in deinem Umfeld. Daneben stehen gleichwertig der **Datingkosmos** mit „Finde die eine Resonanz“ und der **Erlebniskosmos** mit „Resoniere mit anderen“. Im Zentrum steht das **Resonanzrad** mit neun **Elementen** in drei **Bereichen**. Rad, Umfeld, Beziehungsraum und Weg sind **Bausteine**. Das Symbol heisst **ELANUM-Zeichen**. Ältere Arbeitsnamen (Soul Resonance, Soul Kosmos, Dating Kosmos, Event Kosmos, Dating-Plattform, Zu dir, Zueinander und Miteinander als Namen, Klangrad, Klangsignatur, Felder) werden nicht mehr verwendet.

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

**Bereiche des Resonanzrads:** Jeder Bereich hat drei Farben: Tief für Schrift, eine Fläche für ausgefüllte Elemente und den Hauch für den Ring. Gleiche Helligkeit in allen drei Bereichen (OKLCH L 0,46 / 0,864 / 0,94), die Sättigung pro Farbton angeglichen (Koralle und Petrol etwas zurückgenommen, weil sie sonst schwerer wirken).

| Bereich | Tief · Schrift | Fläche · ausgefüllt | Hauch · Ring |
|---|---|---|---|
| Grundtöne · Violett | `#59479A` | `#D1CDF4` | `#EFEEFE` |
| Ich & Orientierung · Koralle | `#8E3931` | `#EFC8C1` | `#FFEBE7` |
| Beziehung & Verbindung · Petrol | `#006868` | `#B8DADA` | `#E3F4F4` |

Offene Elemente: Grau `#E5E0D6` (`--offen`).

**Ein Zustand, ein Zeichen.** Im Resonanzrad heisst Farbe ausgefüllt: alle ausgefüllten Elemente eines Bereichs in derselben Fläche. Offen heisst grau, gestrichelt umrandet und mit einem Plus in Ink, das zum Ausfüllen einlädt. Früher trug jedes Element eine eigene Nuance (Stufe 1 bis 3) und zusätzlich eine geschlossene oder geöffnete Kontur. Helligkeit las sich dabei als Menge: Bindungsstil (Stufe 1) wirkte „voller“ als Werte (Stufe 3), obwohl beide gleich ausgefüllt waren. Deshalb gibt es keine Nuancen mehr, die Elemente eines Bereichs unterscheiden sich über Icon und Name.

Violett, Koralle und Petrol wurden gegen andere Trios getestet, auch für Farbsehschwächen. Merkbar sind sie über ihre Bedeutung: Violett für Herkunft und Tiefe, Koralle für Wärme und das Selbst, Petrol für Verbindung und die Nähe zum Ink.

Regeln: Weisse Schrift nur auf Tief (mindestens 6,6:1). Tief als Schriftfarbe auf Canvas und Hauch (mindestens 5,4:1). Ink auf dem Hauch (mindestens 10:1). Auf der Fläche stehen Icon, Name und Ergebnis in Ink (mindestens 8,4:1), auf Grau stehen Icon und Name in Sekundärtext (6,4:1). Die Flächen sind bewusst hell, damit das Rad auch nach dem Aufbau ruhig bleibt. Der Ring zeigt alle drei Bereiche gleich stark im Hauch und hebt nichts hervor. Der Auswahlbogen über dem gewählten Element steht in Tief seines Bereichs und glüht in derselben Farbe, nie im Markenspektrum: Violett auf Petrol oder Koralle wirkt fremd. Die frühere Feldpalette aus 4.4 (Blue, Orchid, Pink, Amber, Moss, Teal in Gruppen A–C) ist ersetzt.

**Markenspektrum** Violet → Blue → Orchid → Rose → Pink: für das Zeichen, die Verbindungslinie und den Glührand. Keine Fläche, keine Kategorie.

**Verläufe als Liste** (auch im Atlas kopierbar, Werte in `tokens.css`):

- Markenspektrum: `#6756D9, #4D7FE8, #9466DF, #D85BA9, #F0719A`
- Verbindung: `#6756D9, #D85BA9`
- Glührand, geschlossener Kreis: `#6756D9, #4D7FE8, #9466DF, #D85BA9, #F0719A, #6756D9`
- Grundtöne, tief bis Hauch: `#59479A, #D1CDF4, #EFEEFE`
- Ich & Orientierung, tief bis Hauch: `#8E3931, #EFC8C1, #FFEBE7`
- Beziehung & Verbindung, tief bis Hauch: `#006868, #B8DADA, #E3F4F4`

**Status:** Info `#2863AB`, Hinweis `#875500`, Fehler `#B02A2D`, Erfolg `#2B7440`, je mit eigener Hauchfläche. Text auf der Fläche hat mindestens 5:1. Jeder Status hat einen 4-px-Balken, ein gefülltes Zeichen im Kreis und ein Label. Weil Koralle-Tief nahe am Fehler-Rot liegt, unterscheidet die Form: Status hat immer Zeichen und Balken, Bereiche nie.

## Material

Warme Reliefoberfläche, Licht von links oben. Was man bedienen kann, hebt sich an (`--raised`), Eingaben liegen vertieft (`--pressed`). Radien: Control 12 px, Button 16 px, Fläche 28 px. Schatten tragen nie allein eine Funktion; Auswahl hat immer auch Text, Fokus oder ein Zeichen.

**Glührand und Hover:** Bedienbare Flächen zeigen bei Hover, Fokus und Auswahl einen Rand, dessen Farbe dem Markenspektrum entlang im Kreis wandert (6 s pro Umlauf), dazu ein weiches Glühen. Ausgewählte Flächen (gewähltes Element, gewählte Person, aktiver Tab, bewusste Auswahl) glühen im Atemtakt. Jeder Hover ist gut sichtbar: Karten heben sich und glühen, Listen und Navigation bekommen eine Fläche, Links werden violett mit kräftigerer Unterstreichung, Buttons hellen auf und heben sich. Ohne Bewegung steht der Verlauf still.

Der Glührand gilt durchgängig für alles, was man bedienen kann: Buttons (über `.button` automatisch), Segmente, Tabs, Listen, Navigation, Links mit Klasse, Farbstufen, Kopieren-Knöpfe, Checkbox-Zeilen und Pause-Schalter. Eingabefelder und Textfelder liegen in einer Hülle `.field.glow-edge`, die Vertiefung und Rand trägt; sie leuchtet bei Hover und sobald das Feld den Fokus hat. Schieberegler zeigen den wandernden Rand als Ring um den Griff. Ausnahmen: das ELANUM-Zeichen als Link, Textlinks im Fliesstext und der Sprunglink (Fokusring).

Das Papier (gespeicherter Gedanke) hat dieselben 28 px Radius wie jede Fläche und einen eigenen, ruhigeren Schatten (`--paper-shadow`).

Buttons blitzen nicht mehr: Die Grundfarbe liegt unter dem Verlauf, und Hover hellt über eine eigene Ebene auf, statt den Hintergrund zu tauschen. In 4.4 tauschte die Hover-Regel den Verlauf gegen eine Fläche, die von transparent einblendete; dazwischen schien die helle Fläche durch.

## Das ELANUM-Zeichen: Kreiskonstruktion im Goldenen Schnitt

Das ELANUM-Zeichen ist vollständig aus Kreisen gebaut, alle Radien stammen aus einer Reihe im Goldenen Schnitt. Die bisherigen Innenkonturen waren freie Bézier-Kurven: Innerhalb eines Bogens schwankte der Radius (z. B. 289 → 249 → 342), an den Übergängen sprang er (z. B. 245 → 289). Die Tangenten schlossen an, die Krümmung nicht. Dadurch wirkten die Rundungen unruhig. Die Kurvenkorrektur aus 4.4 hat nur Kontrollpunkte verschoben und konnte das nicht beheben.

Konstruktionsregeln:

- Jede Kontur ist eine Kette aus Kreisbögen. Zwei aufeinanderfolgende Bögen berühren sich tangential: Ihre Mittelpunkte liegen mit dem Übergangspunkt auf einer Geraden. Gemessener Knick an allen Übergängen: 0°.
- Radien: Stufen der Reihe R · φ^(−k/4); vier Stufen ergeben genau den Goldenen Schnitt. Verwendet: k = 11, 10, 9, 8, 7, 6, 5, 4, 3, 0, −2.
- Rahmen: Aussenkreis R 460,54 und Kreisöffnung r₀ = Stufe 11 = 122,62.
- Die beiden feinen Linien sind wie Schriftzüge gebaut. Eine Mittellinie aus Kreisbögen trägt die Form, ihre Radien ändern sich stetig. Der Linienkörper ist konzentrisch zur Mittellinie und überall gleich stark (obere Linie 6, untere 5 Einheiten). An den Enden ersetzen je zwei sich berührende Spitzenkreise den Körper, die Stärke nimmt gleichmässig von 0 auf den vollen Wert zu und am Ende wieder ab.
- Berührpunkte: E (obere Linie an der Öffnung), S (untere Linie an der Öffnung), T (obere Linie und Kerbe) und W (Spitze der unteren Linie). In T berühren sich vier Kreise in derselben Tangente. Die Kerbe ist eine Mondsichel zweier Kreise, die sich in T berühren.
- Die Farbkanten des Spektrums laufen auf Konstruktionskreisen. Das Farbnetz (Verläufe, Masken, Farben) ist unverändert aus der Kurvenkorrektur übernommen, nur die Clip-Pfade sind ersetzt.
- Abweichung zur Kurvenkorrektur: 22,2 Einheiten im 960er-Raster. Die obere Linie liegt weiter aussen, die Kerbe öffnet sich weiter. Das ist gewollt: Die alten Kurven hatten selbst Dellen, die Konstruktion übernimmt sie nicht.

`tools/build_logo_circles.py` (nur Python-Standardbibliothek) erzeugt `ELANUM-System-Ink-Harmonic.svg`, `ELANUM-Master-Spektrum-Harmonic.svg` und das Blueprint `ELANUM-Konstruktion-Harmonic.svg`. Es prüft dabei die Knicke und die Abweichung. Mit `--masks` gibt es die Relief-Maske für `app.js` aus. Die Originale und die Kurvenkorrektur bleiben als Referenz im Repository, der Atlas verlinkt sie nicht mehr.

Die Zeichen-Karte im Atlas zeigt nur dieses Zeichen: Spektrum, Ink, Invers, Relief und Blueprint. „Relief“ nutzt die Ink-Silhouette als eingebettete Maske.

### Entscheid (12.10.2026)

Zwei Fassungen standen zur Wahl: der Goldene Schnitt und eine Konstruktion aus sechs Grundkreisen mit fünf krümmungsstetigen Brücken (`-Geometrisch`, aus dem ELANUM-Geometrie-Paket, PR #9). Nach einem direkten Vergleich in Spektrum, Ink, Kleingrössen und Blueprint fiel der Entscheid auf den Goldenen Schnitt. Die Fassung „Sechs Grundkreise“ bleibt als geprüfte Alternative mit `tools/build_logo_geometrie.py` und `assets/*-Geometrisch.*` im Repository, sie wird nicht verwendet. Die frühere Variante „Nah am Original“ (`-Circles`) ist nicht mehr gültig.

## Frühere Stufe: Kurvenkorrektur (4.4)

Die Dateien ohne Suffix sind die unveränderten Quellen. `-Curves.svg` bezeichnet eine separate Kurvenkorrektur. Aussensilhouette, Kreisöffnung, Kreisradien, Ankerpunkte, Pfadanzahl und Linienanordnung bleiben erhalten. Angepasst wurden nur Bézier-Kontrollpunkte an den vorhandenen Innenkurven, damit benachbarte Tangenten sauber anschliessen. Die bewusste Abzweigung an der Logo-Öffnung bleibt unverändert. Gemeinsame Grenzen der Farbebenen verwenden identische Kontrollpunkte.

Die separate SVG-Konturüberlagerung stellt Original und Korrektur gegenüber. Seit 4.5 ersetzt die Kreiskonstruktion im Goldenen Schnitt die Kurvenkorrektur im Atlas; die Dateien bleiben als Referenz im Repository. Invers ist die identische Ink-Datei in Weiss, kein weiteres geometrisches Logo.

Geometrischer Vergleich: 5 Pfade beim Spektrum, 2 bei Ink — jeweils gleich viele wie im Original. Alle Anker und Bogenparameter sind identisch. Die grösste abgetastete Abweichung der Innenkurven beträgt 5,33 Einheiten im 960er-Koordinatenraum, entsprechend etwa 0,36 Pixel bei einer 64-Pixel-Darstellung. Es handelt sich bewusst um eine minimale Korrektur, nicht um eine neue Kreis- oder Spiralform.

## Bausteine

Im Zentrum steht das Resonanzrad mit neun Elementen: den Grundlagen, aus denen Resonanz entsteht. Alle Bausteine liegen unter `components/` und laufen als eigene Seite sowie eingebettet im Atlas, mit demselben Code. Sie sind klassische Skripte mit einer `mount()`-Funktion, weil Chrome ES-Module unter `file://` nicht lädt.

**Resonanzrad** (`components/resonanzrad/`), wiederhergestellt aus dem persönlichen Rad (Repo-Stand `8995945`) und überarbeitet:
- Geometrie unverändert verbindlich: exakter Kreis, neun Stücke à 40°, drei Bereiche à 120°, ein gemeinsamer Mittelpunkt.
- Farbe heisst ausgefüllt: Ein ausgefülltes Stück trägt die Fläche seines Bereichs, alle drei Elemente eines Bereichs gleich. Ein offenes Stück ist grau, gestrichelt umrandet und trägt ein Plus in Ink. In der Liste steht „+ Ausfüllen“; ein Tipp darauf wählt das Element und setzt den Fokus auf „Jetzt ausfüllen“. Das Plus hat eine eigene Zeile mit Abstand und überlappt nie Icon oder Name.
- Beschriftung im Rad, gemessen so gesetzt, dass nichts überlappt und nichts über sein Stück hinausragt (2 px Rand, für jede der neun Auswahlen geprüft): Ab 500 px Raddurchmesser stehen Name und darunter Ergebnis oder Plus, in echten 15 px. Darunter zeigt jedes Stück nur sein Icon, offene Stücke zusätzlich das Plus (ab 300 px). Name und Ergebnis stehen dann in der Zeile direkt unter dem Rad. Im Atlas bekommt das Rad ab 1280 px Fensterbreite seine vollen 520 px, damit Name und Ergebnis auf üblichen Laptops im Stück stehen. Icon, Name und Ergebnis zusammen sind für ein 40°-Stück zu gross; frühere Stände überlappten deshalb an den Rändern. Der Auswahlbogen steht in der Farbe seines Bereichs und glüht im Atemtakt. Namen, Ergebnisse und Status stehen in der Liste und im Lesebereich. Die Liste ist die Tastaturbedienung (Pfeile, Home, End).
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
