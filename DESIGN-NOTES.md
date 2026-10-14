# ELANUM — Gestaltungsatlas 4.10

4.10 zeigt ELANUM als App. Neuer Baustein App-Rahmen unter `components/app/`, acht Screens als echte, responsive Seiten und im Atlas das Kapitel „In der App“ mit einer Gerätevorschau: Telefon und Desktop nebeneinander oder in freier Breite von 320 bis 1440 px. Grundlage ist die heutige App unter soulresonance.ch. Das Zeichen steht als Marke überall in Spektrum, in Navigation und Kopf der App mit Lichtlauf, beim ersten Start im Zeichenaufbau.

4.9 lässt das ELANUM-Zeichen sich bewegen. Seine Form bewegt sich nie, nur Licht und Farbe bewegen sich darin: einmal im Zeichenaufbau oder sanft und dauernd im Lichtlauf, gross wie klein. Der Einstieg baut das Zeichen auf. Neuer Baustein `components/zeichen/`, zwei neue Begriffe im Glossar.

4.8 benennt den violetten Bereich des Resonanzrads neu: Sterne & Ursprung statt Grundtöne, im Code `sterne` statt `grund`. Resonanz heisst im Glossar nur noch: Es schwingt zu dir, zu deinem Partner oder deinem Umfeld. Der lokale Server `tools/serve.py` liefert jede Datei frisch aus.

4.7 fasst den Begriff Resonanz neu: Es schwingt zu dir, zu deinem Partner oder deinem Umfeld.

4.6 benennt die drei Phasen neu. Sie heissen jetzt Kosmen: Resonanzkosmos, Datingkosmos, Erlebniskosmos. Gestaltung und Werte bleiben wie in 4.5.

4.5 beruhigt den Atlas: weniger Schriftwechsel, mehr Raum, mehr Kontrast. Die Farben folgen jetzt den drei Bereichen des Resonanzrads. Das Rad, das Umfeld, der Beziehungsraum und der Weg sind echte Bausteine mit eigenen Seiten. Die neun Teile des Resonanzrads heissen Elemente. Die Bewegung erklärt, wie etwas funktioniert, statt nur einzublenden. Eine Quelle für alle Werte ist `tokens.css`.

## In der App (4.10)

### Grundlage

Die heutige App (Repository `maindnow/soulresonance.ch`, Stand 14.10.2026) hat drei streng getrennte Bereiche mit eigener Leiste: Soul Kosmos (Jetzt, Ich, Umfeld, Mein Weg), Resonanzen (Entdecken, Likes, Chats, Mein Profil) und Gemeinsam erleben (Aktivitäten, Meine Aktivitäten, Events), jeweils mit „Menü“ am Ende. Gewechselt wird bewusst über „Bereich wechseln“. Ab 1024 px ersetzt eine Seitenleiste von 240 px Kopf und Leiste. Die Fläche ist dunkel mit Glas, die Säulen tragen Cyan, Magenta und Purple, Passung im Dating steht als Prozent-Score, Labels stehen in Versalien unter 15 px.

4.9 übernimmt die Struktur und übersetzt sie in ELANUM: dieselben Kosmen mit eigenen Zielen, dieselbe Grenze von 1024 px, dieselbe Regel für Gesten. Fläche, Farbe, Schrift und Sprache kommen aus dem Atlas.

| Thema | Heute in der App | In ELANUM |
|---|---|---|
| Namen der Bereiche | Soul Kosmos, Resonanzen, Gemeinsam erleben | Resonanzkosmos, Datingkosmos, Erlebniskosmos |
| Ziele im Resonanzkosmos | Jetzt, Ich, Umfeld, Mein Weg | Heute, Ich, Umfeld, Weg |
| Fläche | dunkel, Glas | warmes Relief, Licht von links oben, ein dunkler Hauptmoment pro Screen |
| Farbe der Elemente | Cyan, Magenta, Purple je Säule | Violett, Koralle, Petrol je Bereich |
| Passung im Dating | Score in Prozent | Beobachtungen in Worten, an Elementen festgemacht, dazu der Beziehungsraum |
| Schrift | Versalien unter 15 px | Yrsa und Albert Sans, nichts unter 15 px |
| Tablet | Leiste unten bis 1023 px | Schiene ab 600 px |
| Bleibt | | Seitenleiste ab 1024 px, getrennte Kosmen mit Menü, jede Geste mit Knopf, kein Online-Status, keine Zähler |

### Navigation: drei Formen, dieselben Ziele

- **Bis 599 px Leiste unten** in der Daumenzone, höchstens fünf Ziele, das letzte ist „Menü“ (Kosmos wechseln, Wissen, Konto, Hilfe, Abmelden). Namen in echten 15 px, gemessen: „Entdecken“ 73 px, „Aktivitäten“ 75 px. Die Spalten sind mindestens so breit wie ihr Inhalt, darum passen fünf Ziele ab 340 px; unter 360 px rückt die Leiste zusammen, die Schrift bleibt 15 px.
- **600 bis 1023 px Schiene** links, Icon über dem Namen.
- **Ab 1024 px Seitenleiste** mit Namen, gegliedert nach Kosmos, darunter „Kosmos wechseln“ mit dem Satz jedes Kosmos aus dem Glossar.
- Ziele: Resonanzkosmos Heute, Ich, Umfeld, Weg · Datingkosmos Entdecken, Likes, Chats, Profil · Erlebniskosmos Aktivitäten, Events, Meine.
- Neues steht als Punkt, nie als Zahl.

### Führung und Feinheit

Rückmeldung nach dem ersten Stand (14.10.2026): Das Zeichen darf nicht Ink sein, alles wirkte fade, es braucht mehr Führung und mehr Feinfühligkeit. Daraus:

- **Zeichen in Spektrum** in Navigation, Kopf, Favicon und im Atlas. Ink bleibt für Einfarbiges. Seit dem Zusammenführen mit 4.9 bewegt es sich mit dem Baustein Zeichen: in Navigation und Kopf der App sanft und dauernd im Lichtlauf, beim ersten Start (Ankommen) einmal im Zeichenaufbau. Die Form steht.
- **Ein Moment pro Screen:** die Hauptfläche `.app-hero`. Heute: der Satz des Tages mit Tagesbogen. Weg: das aktuelle Kapitel. Entdecken: „Wo es schwingt“ mit dem Beziehungsraum. Aktivitäten: das eine Erlebnis der Woche. Ankommen: die Frage des Schritts.
- **Ein nächster Schritt:** Heute führt direkt unter dem Tag zum nächsten offenen Element, mit kleinem Resonanzrad und einer primären Handlung.
- **Tagesbogen:** Der Tag als offener Kreis, die Öffnung unten ist die Nacht. Bis „jetzt“ führt die Verbindung im Markenspektrum (wie die Spur der Tageslinie bis „jetzt“), danach bleibt der Bogen gestrichelt offen. Stationen sind Knoten, „jetzt“ ist ein Ring, der im Atemtakt glüht. Der Kreis atmet höchstens 3 %.
- **Wo du bist, glüht:** Der aktive Ort in der Navigation trägt den Glührand im Atemtakt. Beim Wechsel gleitet er zum neuen Ziel (View Transitions zwischen Seiten), Navigation und Kopf bleiben stehen, der Inhalt steigt weich auf.
- **Licht von links oben** auch auf der Grundfläche: eine warme Aufhellung oben links, ein Hauch Schatten unten rechts.
- **Drücken gibt nach:** Karten, Zeilen und Ziele der Leiste geben beim Tippen kurz nach (90 ms).
- **Resonanz ist Verbindung:** Die Nachricht „zeigt Resonanz auf“ im Chat trägt den Rand im Markenspektrum, neue Nachrichten einen Punkt im Spektrum.

Das Markenspektrum bleibt bei Zeichen, Verbindung und Glührand. Es wird nie Fläche.

### Weiches Licht

Zweite Rückmeldung (14.10.2026): Die Auswahl über der Vorschau entsprach nicht dem Atlas, und gesamthaft soll es weich sein, aber zum Nutzen animieren, Freude und Neugier wecken. Einschätzung: Die Marke lebt im Zeichen (Spektrum, Tiefe, Bewegung), in der App kam davon zu wenig an. Viel Beige, gleich schwere Flächen, und die dunklen Flächen gaben Führung, aber Schwere statt Weichheit. Vor allem antwortete fast nichts auf Berührung. Daraus:

- **Licht statt Schwere:** Die Hauptfläche ist hell und trägt den Schleier der Fläche ihres Bereichs (`data-area`), darunter ein Glühen in Tief. Ohne Bereich ein warmer, neutraler Schleier. Dunkel ist nur noch das Dazwischen, `.app-hero--dark` für den Beziehungsraum, wie im Atlas.
- **Farbe mit Bedeutung:** Karten tragen die Farbe des Bereichs, aus dem ihr Inhalt kommt (`.app-card--tint`): „Diese Woche“ Violett (Sterne), „Umfeld“ Petrol (Beziehung), der nächste Schritt Koralle (Persönlichkeit). Im kleinen Rad hebt sich das Stück ab, das wartet, und glüht (`mini({ focus })`).
- **Bewegung, die antwortet:** Beim Öffnen steigt der Inhalt auf, der Tagesbogen zeichnet sich bis jetzt, jetzt blüht auf, das kleine Rad baut sich Stück für Stück auf. Rein in CSS, nur mit erlaubter Bewegung (`.app-in`), die Endwerte stehen in den Elementen.
- **Neugier:** „Eine Frage für heute“ zum Umdrehen (`.app-flip`), vorne die Frage aus einem Element, hinten ein Anstoss.
- **Resonanz als Moment:** Nach „Resonanz zeigen“ rücken im Sheet zwei eigene Kreise zusammen und die Verbindung entsteht. Weiter geht es erst mit „Weiter zu …“, ohne Konfetti.
- **Vorschau:** Die Screens stehen in einer Segmentleiste wie überall im Atlas, die Kosmen trennt nur Abstand. Darunter steht, wo man ist, rechts die Ansicht. Die Rahmen stehen unten bündig. Wer im Telefon tippt, nimmt den Desktop mit.

### Screens

- **Heute:** Begrüssung, dunkler Tag mit Satz, Herkunft (Element-Chips) und Tagesbogen, nächster Schritt, Tageslinie, Notiz auf Papier. Begleitspalte: Diese Woche, Umfeld.
- **Ich:** das Resonanzrad als Baustein, darunter der Weg bis jetzt.
- **Umfeld:** der Baustein Umfeld, verlinkt zum Beziehungsraum.
- **Weg:** das aktuelle Kapitel zuerst, dann Zeitstufe (Monat, Jahr, Leben) und die Spur, daneben ein gespeicherter Gedanke auf Papier.
- **Entdecken:** drei Menschen für heute, als Stationen oben (gesehen, jetzt, offen), jede Station ein Knopf. Kopf mit Name, Alter, Ort, dann Foto, Kopfsatz, „Wo es schwingt“ mit Beziehungsraum und drei Beobachtungen, eine davon „Hier seid ihr unterschiedlich“. Fragen mit Antwort, Resonanz gilt einer Antwort. Das kleine Resonanzrad der Person. Handlungen „Überspringen“ und „Resonanz zeigen“ in der Daumenzone. Nach dem dritten Menschen ein ruhiges Ende.
- **Chats:** Liste und Verlauf, ab 1024 px nebeneinander. Auf dem Telefon ersetzt der Kopf des Verlaufs (Zurück, Person, Beziehungsraum) Kopf und Leiste. Gesprächsideen, solange es still ist, in einer Zeile zum Wischen.
- **Aktivitäten:** ein hervorgehobenes Erlebnis, darunter Karten mit Datum als Kreis, wer dabei ist als Kreise und Plätze sachlich. Das Sheet zeigt Zeit, Ort (genaue Adresse am Vortag), Text, wer dabei ist und die Antwort Dabei, Vielleicht, Nicht dabei.
- **Ankommen:** Ablauf ohne Navigation. Schritte als Stationen, die Frage auf der dunklen Fläche, Geburtsdatum, Uhrzeit (mit „Uhrzeit unbekannt“ und Hinweis), Geburtsort. Ab 1024 px links das Zeichen und die Aussage.

Alle Ziele ohne eigene Vorschau (Likes, Profil, Events, Meine, Wissen, Konto, Hilfe) zeigen einen ruhigen Platzhalter mit derselben Navigation.

### Recherche

Übernommen wird, was beim Wählen hilft; was zum Weitermachen belohnt, bleibt draussen.

- **Hinge:** endliche Auswahl am Tag, Like auf eine bestimmte Antwort statt auf den ganzen Menschen → „Resonanz zeigen“ auf eine Frage.
- **Once, The League:** wenige, kuratierte Menschen pro Tag → „Drei Menschen für heute“ mit Ende.
- **Co-Star, The Pattern:** Text zuerst, ruhige Typografie, Beziehung als Perspektive, nicht als Urteil. Kritik an Co-Star: abstrakte Icons ohne Namen verwirren → Icons tragen immer Namen.
- **Headspace, Stoic:** ein Satz pro Tag, Morgen und Abend als Rhythmus, langsame Übergänge → Heute mit Tagesbogen und Tageslinie.
- **Timeleft, Luma, Partiful:** wer dabei ist, sichtbar vor der Zusage, Antwort in natürlicher Reihenfolge, Ort am Vortag.
- **Material 3 (adaptive Navigation), Apple (Tab-Leiste zu Seitenleiste, Liquid Glass):** Leiste, Schiene und Seitenleiste mit denselben Zielen. Sheets mit Griff, Schliessen-Knopf, Esc und Fokus zurück (WCAG 2.2: jede Geste mit Alternative, Ziele ab 44 px).
- **Mobile zuerst 2026:** Container Queries statt nur Fensterbreiten, Safe Areas und dynamische Höhe (`dvh`), View Transitions zwischen Seiten.

### Offene Freigaben

Diese Namen stehen in der App, aber noch nicht im Glossar: die Ziele Entdecken, Likes, Chats, Profil, Aktivitäten, Events, Meine und Menü (aus der heutigen App übernommen), dazu App-Rahmen, Leiste, Schiene, Seitenleiste, Sheet, Hauptfläche, Tagesbogen, „Eine Frage für heute“ und „Resonanz zeigen“. Das Glossar ist unverändert, bis sie freigegeben sind.

## Benennung

Verbindlich ist das **Glossar**: eine Quelle in `assets/glossar.js`, sichtbar im Atlas (Kapitel Glossar, mit Suche) und als `GLOSSAR.md`, erzeugt mit `node tools/glossar-md.js`. Begriffe gelten in Produkt, Texten, Gestaltung und Code genau in dieser Schreibweise. Änderungen nur mit Freigabe und einer neuen Atlas-Version.

Kurz: ELANUM hat drei **Kosmen**. Der **Resonanzkosmos** ist der Einstieg: Resonanz in dir, in deiner Partnerschaft und in deinem Umfeld. Daneben stehen gleichwertig der **Datingkosmos** mit „Finde die eine Resonanz“ und der **Erlebniskosmos** mit „Resoniere mit anderen“. Im Zentrum steht das **Resonanzrad** mit neun **Elementen** in drei **Bereichen**. Rad, Umfeld, Beziehungsraum und Weg sind **Bausteine**. Das Symbol heisst **ELANUM-Zeichen**. Ältere Arbeitsnamen (Soul Resonance, Soul Kosmos, Dating Kosmos, Event Kosmos, Dating-Plattform, Zu dir, Zueinander und Miteinander als Namen, Klangrad, Klangsignatur, Felder) werden nicht mehr verwendet.

## Richtung

Offene Flächen, klare Kreise, bewusst gesetzte Öffnungen und kurze Verbindungen. Abstand gliedert, Linien trennen nur Kapitel. Der dunkle Beziehungsraum ist das einzige dunkle Kapitel. Die Form des Zeichens bleibt unverändert und unbewegt; Licht und Farbe dürfen sich darin bewegen.

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
| Sterne & Ursprung · Violett | `#59479A` | `#D1CDF4` | `#EFEEFE` |
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
- Sterne & Ursprung, tief bis Hauch: `#59479A, #D1CDF4, #EFEEFE`
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

### Bewegung des Zeichens (4.9)

Die Form bewegt sich nie: kein Skalieren, Drehen oder Verformen. Unter jeder Bewegung liegt die unveränderte Datei `ELANUM-Master-Spektrum-Harmonic.svg`, am Ende steht immer genau sie. Das Farbnetz hat 697 Verläufe. Es wird nur einmal gezeichnet und nie animiert. Bewegt werden Deckkraft und Drehung eigener, leichter Ebenen (`components/zeichen/`); das rechnet die Grafikkarte.

- **Zeichenaufbau**, einmal, knapp 3 s: Aussenkreis mit Kerbe und Öffnung zeichnen sich als feine Linie (1,4 px) im Markenspektrum, weich beschleunigt und gebremst. Ab 1,1 s blendet die Farbe in 1,4 s sanft ein, danach verschwindet die Linie. Keine Hilfskreise, keine Mittellinien. Die Kontur schreibt `tools/build_logo_circles.py` in die Zeile `var K` von `zeichen.js`.
- **Lichtlauf**, dauernd: ein weicher, weisser Glanz, auf die Silhouette zugeschnitten, kreist um die Mitte des Aussenkreises, 24 s pro Umlauf, Überblendung „screen“ mit 60 % Deckkraft. Wie der Glührand, nur langsamer. Die Maske steht still, nur der Glanz dreht sich als eigene HTML-Ebene.

Ohne Skript, bei reduzierter Bewegung und in der Pause steht das ruhende Zeichen. Tab beendet einen laufenden Zeichenaufbau.

Im Atlas: Der Einstieg baut das Zeichen auf. Das Kapitel Zeichen zeigt beide Bewegungen gross, in 64 und 40 px und in der Marke mit 30 px. Im Kapitel Farbe steht das Zeichen im Lichtlauf neben dem Markenspektrum.

Entscheid (14.10.2026): Chris gibt die Bewegung frei. „Es darf sich auch in Klein bewegen, aber sanft dauernd oder einmal intensiv im Aufbau.“ Der Satz „Das Zeichen bewegt sich nie“ heisst jetzt „Seine Form bewegt sich nie, nur Licht und Farbe bewegen sich darin“.

Nach der ersten Durchsicht (14.10.2026):

- Der Farbatem ist verworfen. Er legte eine farbverschobene Kopie des Spektrums im Atemtakt darüber; das Ergebnis war unbrauchbar.
- Der Zeichenaufbau zeigte zuerst die ganze Konstruktion: alle Kreise wie im Blueprint, Mittellinien und Farbkanten in Ink, dann ein harter Kreis, der das Spektrum aus der Öffnung freilegte. Das war zu technisch. Jetzt bleiben nur Aussenkontur und Öffnung, und die Farbe blendet weich ein.
- Der Lichtlauf stockte. Gemessen in Chrome auf der ganzen Atlas-Seite mit Retina-Auflösung: Der erste Zeichenaufbau zeichnete das Farbnetz bei jedem Bild neu, 2,3 s Rechenarbeit in 3,2 s, und bremste damit alles andere. Jetzt sind es 0,09 s, weil Linie und Farbe auf eigenen Ebenen liegen und nur die Deckkraft wechselt; das Bild hat dafür dauerhaft eine eigene Ebene. Die Drehung des Glanzes lief schon vorher ohne Neuzeichnen. Sie läuft jetzt aber als eigene HTML-Ebene statt innerhalb einer SVG, denn Safari beschleunigt Drehungen in SVG-Elementen nicht. Die frühere Angabe „60 Bilder pro Sekunde“ beruhte auf einer Messung, die das Neuzeichnen nicht erfasst. Sie war deshalb falsch.

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

**Zeichen in Bewegung** (`components/zeichen/`): Zeichenaufbau und Lichtlauf, siehe oben beim ELANUM-Zeichen. Markup `<div class="zeichen" data-zeichen="aufbau | lichtlauf">` mit dem Spektrum als `<img>`; ohne Skript steht das Bild.

**Linien-System:** Kontur 1,6 px, Verbindung 2,8 px, Knoten 3,3 px Radius. **Icons:** 24er-Raster, 1,6 px, runde Enden, keine Füllung, Sprache aus Kreisen, Öffnungen und Verbindungen.

## Bewegung

Bewegung erklärt: Kreise rücken zusammen, das Rad baut sich Bereich für Bereich auf, eine Spur zeichnet sich bis zu dir. GSAP 3.15 mit ScrollTrigger, SplitText und DrawSVG liegt lokal unter `assets/vendor/gsap/`; nur `assets/motion.js` spricht damit. Die Ziele stehen als `data-anim` im Markup. Kein Smooth-Scroll; die beiden Scroll-gekoppelten Szenen nutzen `scrub: 1`.

| Moment | Was sich bewegt |
|---|---|
| Einstieg | Titelzeilen steigen maskiert auf (140 ms Versatz), Text und Link folgen, unter 1,5 s. Daneben baut sich das Zeichen auf, knapp 3 s. |
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
| Zeichen | Zeichenaufbau einmal, sobald das Zeichen zu sehen ist. Lichtlauf dauernd, wo er gesetzt ist. Die Form steht. |
| Immer | Nur die Atmung: 3,4 s Raum geben, 4,4 s zur Ruhe, höchstens 7,5 % Radius. Im Zeichen dazu der Lichtlauf, wo gesetzt. |

Alle Auftritte setzen ihre Endwerte ausdrücklich, und der Versteck-Guard wird vor dem Anlegen gelöst; vorher sprangen manche Blöcke am Ende schlagartig auf. Das festgehaltene Kapitel wird zuerst angelegt, damit alle Auftritte dahinter zur richtigen Stelle auslösen, und jeder einmalige Auftritt gilt bis zum Seitenende, damit auch schnelles Scrollen oder ein Sprung über die Navigation ihn auslöst. Ohne Festhalten (Telefon) baut sich nur das Rad auf, Lesebereich und Liste sind sofort da.

Kein Auftritt versteckt Inhalte. Ohne JavaScript und bei reduzierter Bewegung ist alles sofort sichtbar, spätestens nach 5 s auch dann, wenn GSAP nicht lädt. Was beim Laden schon im Bild ist, erscheint ohne Auftritt. Versteckt wird nur über die Deckkraft, damit alles per Tab erreichbar bleibt. Tastatur, Fokus auf etwas noch Unsichtbarem und die globale Pause beenden alle Auftritte und lösen das festgehaltene Kapitel. Titel werden erst nach dem Laden der Schriften gesplittet, Screenreader lesen den ganzen Satz.

## Interaktion und Bedienbarkeit

- Alles läuft lokal, ohne Backend und ohne externe Anfragen. Unter `file://` lädt `assets/boot.js` eingebettete Schriften.
- Farbwerte und Tokens sind kopierbar; der Tokenblock liest die Werte live aus `tokens.css`.
- Tabs, Rad-Liste und Umfeld-Liste sind per Tastatur bedienbar und für assistive Technik ausgezeichnet.
- 44-px-Ziele, sichtbarer Fokus, bewegungsreduzierte Darstellung.
- Die Prüfcheckliste ist eine Arbeitshilfe und keine automatische Freigabe.
