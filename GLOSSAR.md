# ELANUM Glossar 4.5

<!-- Automatisch erzeugt aus assets/glossar.js mit `node tools/glossar-md.js`. Nicht von Hand bearbeiten. -->

Diese Begriffe sind verbindlich. Sie gelten in Produkt, Texten, Gestaltung und Code, genau in dieser Schreibweise, inklusive Gross- und Kleinschreibung und „&“. Neue Begriffe oder Änderungen nur mit Freigabe und einer neuen Atlas-Version.

> Mit ELANUM findest du zu dir, zueinander und miteinander. Resonanz zeigt den Weg.

## Marke

| Begriff | Bedeutung | Im Code |
|---|---|---|
| **ELANUM** | Die Marke. Immer in Versalien. |  |
| **ELANUM-Zeichen** | Das runde, farbige Symbol der Marke, vollständig aus Kreisbögen konstruiert. Darstellungen: Spektrum, Ink, Invers, Relief, Blueprint. Es bewegt sich nie. | `assets/ELANUM-*-Circles.svg` |
| **Kreiskonstruktion** | Bauweise des ELANUM-Zeichens: jede Kontur ein Kreisbogen, Übergänge ohne Knick. Zwei Varianten: Nah am Original und Goldener Schnitt. | `tools/build_logo_circles.py · -Circles · -Harmonic` |
| **Blueprint** | Darstellung des ELANUM-Zeichens mit allen Konstruktionskreisen, Mittelpunkten und Berührpunkten. | `assets/ELANUM-Konstruktion-*.svg` |
| **Resonanz** | Das Leitthema: Etwas schwingt mit, zu dir selbst oder zu einem anderen Menschen. |  |

## Phasen

Der Weg mit ELANUM, in dieser Reihenfolge.

| Begriff | Bedeutung | Im Code |
|---|---|---|
| **Zu dir** | Phase 1: der Weg zu dir selbst. Der erste und wichtigste Schritt. | `Resonanzrad · Weg · Heute` |
| **Zueinander** | Phase 2: Menschen finden, mit denen Resonanz entsteht, für Liebe, Freundschaft oder Gleichgesinnte. | `Umfeld · Beziehungsraum` |
| **Miteinander** | Phase 3: gemeinsam etwas erleben, bei Aktivitäten mit anderen. |  |

## Resonanzrad

| Begriff | Bedeutung | Im Code |
|---|---|---|
| **Resonanzrad** | Das Zentrum von ELANUM. Es beschreibt einen Menschen in neun Elementen. Immer ein Wort. | `components/resonanzrad · ElanumResonanzrad` |
| **Ich** | Die Mitte des Resonanzrads. Das Rad beschreibt nur dich, nie andere. |  |
| **Element** | Einer der neun Teile des Resonanzrads: eine Grundlage, aus der Resonanz entsteht. Mehrzahl: Elemente. | `items[].id` |
| **Bereich** | Eine der drei Gruppen im Resonanzrad mit je drei Elementen und einer eigenen Farbe. | `grund · ich · bezug` |
| **Grundtöne** | Bereich in Violett: Astrologie, Numerologie, Human Design. | `grund` |
| **Ich & Orientierung** | Bereich in Koralle: Lebensrichtung, Persönlichkeit, Werte. | `ich` |
| **Beziehung & Verbindung** | Bereich in Petrol: Bindungsstil, Nähe & Zuneigung, Konfliktstil. | `bezug` |
| **Ergebnis** | Was ein ausgefülltes Element über dich sagt, zum Beispiel „Jungfrau“ oder „Sicher“. |  |
| **ausgefüllt · offen** | Zustand eines Elements. Ausgefüllt: in seiner Farbe, Kontur geschlossen. Offen: im Hauch, Kontur mit Öffnung. | `done` |

## Bausteine

Gestaltete Darstellungen mit eigener Seite und gleichem Code im Atlas.

| Begriff | Bedeutung | Im Code |
|---|---|---|
| **Baustein** | Eine gestaltete Darstellung wie Resonanzrad, Umfeld oder Weg. | `components/` |
| **Heute** | Dein Tag. Zeigt die Tageslinie. Gehört zu Zu dir. |  |
| **Tageslinie** | Momente eines Tages als Stationen, ohne Feed. | `.track` |
| **Weg** | Deine Entwicklung als Stationen bis jetzt, danach eine Unterbrechung. | `components/weg` |
| **Station** | Ein Punkt auf Weg oder Tageslinie: erledigt (gefüllt), jetzt (Ring), offen (Kontur mit Öffnung). | `data-state="done · now · open"` |
| **Umfeld** | Ich in der Mitte, Menschen als eigene Kreise nach Nähe und Resonanz. | `components/umfeld` |
| **Beziehungsraum** | Zwei eigene Räume und die Verbindung dazwischen. | `components/beziehungsraum` |
| **Verbindung** | Die Linie zwischen zwei Kreisen. Sie trifft beide Konturen exakt. |  |
| **Nähe · Resonanz · Freiraum** | Die drei Werte einer Beziehung: Abstand der Kreise, Stärke der Verbindung, Grösse der Öffnung. Gestaltungswerte, keine Messung. | `proximity · resonance · openness` |
| **Atmung** | Der gemeinsame Bewegungstakt der Kreise: 3,4 s Raum geben, 4,4 s zur Ruhe kommen. |  |

## Farbe und Material

| Begriff | Bedeutung | Im Code |
|---|---|---|
| **Canvas · Papier · Ink** | Grundfläche, warme Fläche für Persönliches, Schriftfarbe. | `--canvas · --paper · --ink` |
| **Bereichsfarbe** | Die Farbe eines Bereichs in fünf Stufen: Tief (Schrift), Stufe 1 bis 3 (Elemente), Hauch (Ring, offen, Flächen). | `--grund-tief … --grund-hauch` |
| **Markenspektrum** | Violett bis Pink. Nur für das ELANUM-Zeichen, die Verbindung und den Glührand. | `--spectrum-stops` |
| **Glührand** | Rand im Markenspektrum, der bei Hover, Fokus und Auswahl im Kreis wandert, dazu ein weiches Glühen. | `.glow-edge · --edge-stops` |
| **Status** | Info, Hinweis, Fehler, Erfolg. Immer mit Zeichen, Balken und Text, nie nur Farbe. | `data-role` |
| **Relief** | Licht von links oben. Bedienbares ist angehoben, Eingaben sind vertieft. | `--raised · --pressed` |

## Nicht mehr verwenden

| Alt | Stattdessen |
|---|---|
| ~~Soul Resonance~~ | **ELANUM** |
| ~~Soul Kosmos~~ | **Zu dir** |
| ~~Dating-Plattform~~ | **Zueinander** |
| ~~Klangrad, persönliches Rad~~ | **Resonanzrad** |
| ~~Klangsignatur, Logo-Signatur~~ | **ELANUM-Zeichen** |
| ~~Kurvenkorrektur (als aktuelles Zeichen)~~ | **Kreiskonstruktion** |
| ~~Eigenklang, Klang~~ | **Resonanz** |
| ~~Felder, Stücke~~ | **Elemente** |
| ~~Kategorie, Gruppe A–C~~ | **Bereich** |
