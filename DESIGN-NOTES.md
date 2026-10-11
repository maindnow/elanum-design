# ELANUM — Gestaltungsatlas 4.5

4.5 beruhigt den Atlas: weniger Schriftwechsel, mehr Raum, mehr Kontrast. Die Farben folgen jetzt den drei Bereichen des Resonanzrads. Das Rad, das Umfeld, der Beziehungsraum und der Weg sind echte Elemente mit eigenen Seiten. Die Bewegung erklärt, wie etwas funktioniert, statt nur einzublenden. Eine Quelle für alle Werte ist `tokens.css`.

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

**Bereiche des Resonanzrads:** Jeder Bereich hat einen Grundton. Die drei Bereiche sind ausgeglichen: gleiche Helligkeit auf jeder Stufe (OKLCH L 0,46 / 0,66 / 0,75 / 0,84 / 0,93) und angeglichene Sättigung (Koralle ×0,9, Petrol ×0,72), damit kein Bereich dominiert. In 4.5 vor dieser Korrektur wirkten Violett und ein tief gefärbter aktiver Ring zu laut.

| Bereich | Tief · Schrift | Feld 1 | Feld 2 | Feld 3 | Hauch · Ring und offen |
|---|---|---|---|---|---|
| Grundtöne · Violett | `#59479A` | `#9187CB` | `#ADA6DE` | `#C9C5F0` | `#E7E5FB` |
| Ich & Orientierung · Koralle | `#8E3931` | `#C37D73` | `#D89D95` | `#ECBEB7` | `#FAE2DE` |
| Beziehung & Verbindung · Petrol | `#006868` | `#59A0A0` | `#83BAB9` | `#ABD4D3` | `#D8EDEC` |

Violett, Koralle und Petrol wurden gegen andere Trios getestet, auch für Farbsehschwächen. Merkbar sind sie über ihre Bedeutung: Violett für Herkunft und Tiefe, Koralle für Wärme und das Selbst, Petrol für Verbindung und die Nähe zum Ink.

Regeln: Weisse Schrift nur auf Tief (mindestens 6,6:1). Tief als Schriftfarbe auf Canvas und Hauch (mindestens 5,4:1). Ink auf dem Hauch (mindestens 10:1). Die Felder 1 bis 3 tragen nur Icons in Ink (mindestens 4:1). Der Ring zeigt alle drei Bereiche gleich stark im Hauch und hebt nichts hervor. Die frühere Feldpalette aus 4.4 (Blue, Orchid, Pink, Amber, Moss, Teal in Gruppen A–C) ist ersetzt.

**Markenspektrum** Violet → Blue → Orchid → Rose → Pink: nur für das Zeichen und die Verbindungslinie zwischen zwei Menschen. Keine Fläche, keine Kategorie.

**Status:** Info `#2863AB`, Hinweis `#875500`, Fehler `#B02A2D`, Erfolg `#2B7440`, je mit eigener Hauchfläche. Text auf der Fläche hat mindestens 5:1. Jeder Status hat einen 4-px-Balken, ein gefülltes Zeichen im Kreis und ein Label. Weil Koralle-Tief nahe am Fehler-Rot liegt, unterscheidet die Form: Status hat immer Zeichen und Balken, Bereiche nie.

## Material

Warme Reliefoberfläche, Licht von links oben. Was man bedienen kann, hebt sich an (`--raised`), Eingaben liegen vertieft (`--pressed`). Radien: Control 12 px, Button 16 px, Fläche 28 px. Schatten tragen nie allein eine Funktion; Auswahl hat immer auch Text, Fokus oder ein Zeichen.

Buttons blitzen nicht mehr: Die Grundfarbe liegt unter dem Verlauf, und Hover hellt über eine eigene Ebene auf, statt den Hintergrund zu tauschen. In 4.4 tauschte die Hover-Regel den Verlauf gegen eine Fläche, die von transparent einblendete; dazwischen schien die helle Fläche durch.

## Logo: Korrektur, kein Redesign

Die Dateien ohne Suffix sind die unveränderten Quellen. `-Curves.svg` ist eine separate Kurvenkorrektur. Aussensilhouette, Kreisöffnung, Kreisradien, Ankerpunkte, Pfadanzahl und Linienanordnung bleiben erhalten. Angepasst wurden nur Bézier-Kontrollpunkte an den vorhandenen Innenkurven. Die grösste abgetastete Abweichung beträgt 5,33 Einheiten im 960er-Koordinatenraum, etwa 0,36 px bei 64 px Darstellung. Invers ist die identische Ink-Datei in Weiss. Relief ist eine Materialanwendung über eine eingebettete Maske der Ink-Silhouette.

## Elemente

Alle Elemente liegen unter `components/` und laufen als eigene Seite sowie eingebettet im Atlas, mit demselben Code. Sie sind klassische Skripte mit einer `mount()`-Funktion, weil Chrome ES-Module unter `file://` nicht lädt.

**Resonanzrad** (`components/resonanzrad/`), wiederhergestellt aus dem persönlichen Rad (Repo-Stand `8995945`) und überarbeitet:
- Geometrie unverändert verbindlich: exakter Kreis, neun Stücke à 40°, drei Bereiche à 120°, ein gemeinsamer Mittelpunkt.
- Farbe heisst ausgefüllt: Ein ausgefülltes Stück trägt seine Nuance (tief, mittel, hell), ein offenes nur den Hauch seines Bereichs. Die Kontur bestätigt es: geschlossen oder mit Öffnung.
- Im Rad stehen nur Icons. Das gewählte Feld steht direkt unter dem Rad zwischen den Pfeilen, damit es auch auf dem Telefon sofort sichtbar ist. Namen, Ergebnisse und Status stehen in der Liste und im Lesebereich. Die Liste ist die Tastaturbedienung (Pfeile, Home, End).
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
| Resonanzrad | Das einzige festgehaltene Kapitel (ab 900 px): Zentrum, drei Bereiche nacheinander, Stücke, Füllung der ausgefüllten Felder, Konturen. Daneben erklären vier Schritte, was geschieht. Schmaler läuft dieselbe Folge einmal ohne Festhalten. |
| Farbe | Jede Rampe wächst von Tief nach Hauch. |
| Umfeld | Menschen rücken aus dem Rand auf ihre Nähe, danach zeichnen sich die Verbindungen. |
| Weg und Tageslinie | Die Spur wächst, Stationen erscheinen beim Erreichen. Auf der Element-Seite an den Scroll gekoppelt. |
| Status | Das Zeichen federt beim Wechsel kurz ein. |
| Bedienung | 160–220 ms, ohne Blitz. |
| Immer | Nur die Atmung: 3,4 s Raum geben, 4,4 s zur Ruhe, höchstens 7,5 % Radius. |

Kein Auftritt versteckt Inhalte. Ohne JavaScript und bei reduzierter Bewegung ist alles sofort sichtbar, spätestens nach 5 s auch dann, wenn GSAP nicht lädt. Was beim Laden schon im Bild ist, erscheint ohne Auftritt. Versteckt wird nur über die Deckkraft, damit alles per Tab erreichbar bleibt. Tastatur, Fokus auf etwas noch Unsichtbarem und die globale Pause beenden alle Auftritte und lösen das festgehaltene Kapitel. Titel werden erst nach dem Laden der Schriften gesplittet, Screenreader lesen den ganzen Satz.

## Interaktion und Bedienbarkeit

- Alles läuft lokal, ohne Backend und ohne externe Anfragen. Unter `file://` lädt `assets/boot.js` eingebettete Schriften.
- Farbwerte und Tokens sind kopierbar; der Tokenblock liest die Werte live aus `tokens.css`.
- Tabs, Rad-Liste und Umfeld-Liste sind per Tastatur bedienbar und für assistive Technik ausgezeichnet.
- 44-px-Ziele, sichtbarer Fokus, bewegungsreduzierte Darstellung.
- Die Prüfcheckliste ist eine Arbeitshilfe und keine automatische Freigabe.
