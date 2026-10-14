# ELANUM Glossar 4.9

<!-- Automatisch erzeugt aus assets/glossar.js mit `node tools/glossar-md.js`. Nicht von Hand bearbeiten. -->

Diese Begriffe sind verbindlich. Sie gelten in Produkt, Texten, Gestaltung und Code, genau in dieser Schreibweise, inklusive Gross- und Kleinschreibung und „&“. Neue Begriffe oder Änderungen nur mit Freigabe und einer neuen Atlas-Version.

> Mit ELANUM findest du zu dir, zueinander und miteinander. Resonanz zeigt den Weg.

## Marke

| Begriff | Bedeutung | Im Code |
|---|---|---|
| **ELANUM** | Die Marke. Immer in Versalien. |  |
| **ELANUM-Zeichen** | Das runde, farbige Symbol der Marke, vollständig aus Kreisbögen konstruiert, alle Radien im Goldenen Schnitt. Darstellungen: Spektrum, Ink, Invers, Relief, Blueprint. Seine Form bewegt sich nie, nur Licht und Farbe bewegen sich darin: im Zeichenaufbau, im Lichtlauf und im Farbatem. | `assets/ELANUM-*-Harmonic.svg · components/zeichen` |
| **Kreiskonstruktion** | Bauweise des ELANUM-Zeichens: jede Kontur ein Kreisbogen, alle Radien aus der Reihe R·φ^(−k/4) (Goldener Schnitt), Übergänge ohne Knick. | `tools/build_logo_circles.py` |
| **Blueprint** | Darstellung des ELANUM-Zeichens mit allen Konstruktionskreisen, Mittelpunkten und Berührpunkten. | `assets/ELANUM-Konstruktion-Harmonic.svg` |
| **Zeichenaufbau** | Bewegung des ELANUM-Zeichens, einmal und kräftig: Konstruktionskreise und Konturen zeichnen sich, dann füllt sich das Spektrum aus der Öffnung. Gut 3 s, danach steht das Zeichen. | `data-zeichen="aufbau"` |
| **Lichtlauf** | Bewegung des ELANUM-Zeichens, sanft und dauernd: Ein weicher Glanz wandert im Kreis durch das Zeichen, 24 s pro Umlauf. | `data-zeichen="lichtlauf"` |
| **Farbatem** | Bewegung des ELANUM-Zeichens, sanft und dauernd: Die Farben verschieben sich im Takt der Atmung im Spektrum und kehren zurück. | `data-zeichen="farbatem"` |
| **Resonanz** | Es schwingt zu dir, zu deinem Partner oder deinem Umfeld. |  |

## Kosmen

Die drei Räume von ELANUM. Der Resonanzkosmos ist der Einstieg, Datingkosmos und Erlebniskosmos stehen gleichwertig daneben.

| Begriff | Bedeutung | Im Code |
|---|---|---|
| **Kosmos** | Einer der drei Räume von ELANUM, jeder mit einem eigenen Satz. Mehrzahl: Kosmen. Der Name immer in einem Wort, wie Resonanzrad. |  |
| **Resonanzkosmos** | Resonanz in dir, in deiner Partnerschaft und in deinem Umfeld. Der Einstieg in ELANUM. | `Resonanzrad · Heute · Weg · Umfeld · Beziehungsraum` |
| **Datingkosmos** | Finde die eine Resonanz. Hier geht es nur ums Dating. |  |
| **Erlebniskosmos** | Resoniere mit anderen. Events, unabhängig vom Dating. |  |

## Resonanzrad

| Begriff | Bedeutung | Im Code |
|---|---|---|
| **Resonanzrad** | Das Zentrum von ELANUM. Es beschreibt einen Menschen in neun Elementen. Immer ein Wort. | `components/resonanzrad · ElanumResonanzrad` |
| **Ich** | Die Mitte des Resonanzrads. Das Rad beschreibt nur dich, nie andere. |  |
| **Element** | Einer der neun Teile des Resonanzrads: eine Grundlage, aus der Resonanz entsteht. Mehrzahl: Elemente. | `items[].id` |
| **Bereich** | Eine der drei Gruppen im Resonanzrad mit je drei Elementen und einer eigenen Farbe. | `sterne · ich · bezug` |
| **Sterne & Ursprung** | Bereich in Violett: Astrologie, Numerologie, Human Design. Alle drei gehen von deiner Geburt aus. | `sterne` |
| **Ich & Orientierung** | Bereich in Koralle: Lebensrichtung, Persönlichkeit, Werte. | `ich` |
| **Beziehung & Verbindung** | Bereich in Petrol: Bindungsstil, Nähe & Zuneigung, Konfliktstil. | `bezug` |
| **Ergebnis** | Was ein ausgefülltes Element über dich sagt, zum Beispiel „Jungfrau“ oder „Sicher“. |  |
| **ausgefüllt · offen** | Zustand eines Elements. Ausgefüllt: Fläche in der Farbe seines Bereichs. Offen: grau, gestrichelt umrandet, mit einem Plus zum Ausfüllen. | `done · --offen` |

## Bausteine

Gestaltete Darstellungen mit eigener Seite und gleichem Code im Atlas.

| Begriff | Bedeutung | Im Code |
|---|---|---|
| **Baustein** | Eine gestaltete Darstellung wie Resonanzrad, Umfeld oder Weg. | `components/` |
| **Heute** | Dein Tag. Zeigt die Tageslinie. Gehört zum Resonanzkosmos. |  |
| **Tageslinie** | Momente eines Tages als Stationen, ohne Feed. | `.track` |
| **Weg** | Deine Entwicklung als Stationen bis jetzt, danach eine Unterbrechung. | `components/weg` |
| **Station** | Ein Punkt auf Weg oder Tageslinie: erledigt (gefüllt), jetzt (Ring), offen (Kontur mit Öffnung). | `data-state="done · now · open"` |
| **Umfeld** | Ich in der Mitte, Menschen als eigene Kreise nach Nähe und Resonanz. | `components/umfeld` |
| **Beziehungsraum** | Zwei eigene Räume und die Verbindung dazwischen. | `components/beziehungsraum` |
| **Verbindung** | Die Linie zwischen zwei Kreisen. Sie trifft beide Konturen exakt. |  |
| **Nähe · Resonanz · Freiraum** | Die drei Werte einer Beziehung: Abstand der Kreise, Stärke der Verbindung, Grösse der Öffnung. Gestaltungswerte, keine Messung. | `proximity · resonance · openness` |
| **Atmung** | Der gemeinsame Bewegungstakt der Kreise und des Farbatems: 3,4 s Raum geben, 4,4 s zur Ruhe kommen. |  |

## Farbe und Material

| Begriff | Bedeutung | Im Code |
|---|---|---|
| **Canvas · Papier · Ink** | Grundfläche, warme Fläche für Persönliches, Schriftfarbe. | `--canvas · --paper · --ink` |
| **Bereichsfarbe** | Die Farbe eines Bereichs in drei Stufen: Tief (Schrift), Fläche (ausgefüllte Elemente, eine Farbe für alle drei Elemente des Bereichs), Hauch (Ring, Flächen hinter Text). | `--sterne-tief · --sterne-flaeche · --sterne-hauch` |
| **Markenspektrum** | Violett bis Pink. Nur für das ELANUM-Zeichen, die Verbindung und den Glührand. | `--spectrum-stops` |
| **Glührand** | Rand im Markenspektrum, der bei Hover, Fokus und Auswahl im Kreis wandert, dazu ein weiches Glühen. | `.glow-edge · --edge-stops` |
| **Status** | Info, Hinweis, Fehler, Erfolg. Immer mit Zeichen, Balken und Text, nie nur Farbe. | `data-role` |
| **Relief** | Licht von links oben. Bedienbares ist angehoben, Eingaben sind vertieft. | `--raised · --pressed` |

## Nicht mehr verwenden

| Alt | Stattdessen |
|---|---|
| ~~Soul Resonance~~ | **ELANUM** |
| ~~Soul Kosmos~~ | **Resonanzkosmos** |
| ~~Dating Kosmos, Dating-Plattform~~ | **Datingkosmos** |
| ~~Event Kosmos~~ | **Erlebniskosmos** |
| ~~Zu dir, Zueinander, Miteinander (als Name)~~ | **Resonanzkosmos, Datingkosmos, Erlebniskosmos** |
| ~~Phase, Phasen (für die drei Räume)~~ | **Kosmos, Kosmen** |
| ~~Klangrad, persönliches Rad~~ | **Resonanzrad** |
| ~~Klangsignatur, Logo-Signatur~~ | **ELANUM-Zeichen** |
| ~~Kurvenkorrektur (als aktuelles Zeichen)~~ | **Kreiskonstruktion** |
| ~~Sechs Grundkreise, Nah am Original (als aktuelles Zeichen)~~ | **ELANUM-Zeichen** |
| ~~Eigenklang, Klang~~ | **Resonanz** |
| ~~Grundtöne~~ | **Sterne & Ursprung** |
| ~~Felder, Stücke~~ | **Elemente** |
| ~~Kategorie, Gruppe A–C~~ | **Bereich** |
