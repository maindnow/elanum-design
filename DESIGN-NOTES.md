# ELANUM — Gestaltungsatlas 5.0

5.0 fasst Beziehungsraum und Umfeld neu, damit sie ohne Regler lesbar sind. Im Beziehungsraum ist Nähe der Abstand zweier Kreise, Freiraum die helle Fläche um jeden und Resonanz das Feld um beide. Im Umfeld stehen Menschen derselben Art beieinander, der Abstand zeigt die Nähe, Linien um den Kreis die Resonanz. Verbindungslinien und Öffnungen entfallen, darum eine neue Hauptversion.

4.12 gibt der Bewegung ein Vokabular und jedem Wert einen Namen. Zwei Kurven und fünf Dauern stehen als Tokens. Farben, Schatten und Radien stehen als Wert nur noch in `tokens.css`, `tools/token-check.js` prüft das. Je Screen atmet ein Ort, der Glührand wandert nur noch, wenn man ihn berührt. Sheet und Quellenkarte schliessen mit Übergang, der Button kennt die Zustände «läuft» und «bestätigt», und in der App steht der Seitentitel in der Stufe Überschrift. Grundlage ist ein Vergleich mit fünf Referenz-Clips, freigegeben von Chris am 15.11.2026.

4.11 bringt den Baustein Fliesstext: ein Text, der zu einem Menschen spricht und bei jeder Kernaussage zeigt, woher sie kommt. Grundlage ist Chris’ Entwurf „Christopher, das bist du.“ (14.10.2026), übersetzt in die Regeln des Atlas. Eigene Seite unter `components/fliesstext/` mit dem ersten Muster als Beispiel, im Atlas im Kapitel Sprache, in der App auf Heute.

4.10 zeigt ELANUM als App. Neuer Baustein App-Rahmen unter `components/app/`, acht Screens als echte, responsive Seiten und im Atlas das Kapitel „In der App“ mit einer Gerätevorschau: Telefon und Desktop nebeneinander oder in freier Breite von 320 bis 1440 px. Grundlage ist die heutige App unter soulresonance.ch. Das Zeichen steht als Marke überall in Spektrum, in Navigation und Kopf der App mit Lichtlauf, beim ersten Start im Zeichenaufbau.

4.9 lässt das ELANUM-Zeichen sich bewegen. Seine Form bewegt sich nie, nur Licht und Farbe bewegen sich darin: einmal im Zeichenaufbau oder sanft und dauernd im Lichtlauf, gross wie klein. Der Einstieg baut das Zeichen auf. Neuer Baustein `components/zeichen/`, zwei neue Begriffe im Glossar.

4.8 benennt den violetten Bereich des Resonanzrads neu: Sterne & Ursprung statt Grundtöne, im Code `sterne` statt `grund`. Resonanz heisst im Glossar nur noch: Es schwingt zu dir, zu deinem Partner oder deinem Umfeld. Der lokale Server `tools/serve.py` liefert jede Datei frisch aus.

4.7 fasst den Begriff Resonanz neu: Es schwingt zu dir, zu deinem Partner oder deinem Umfeld.

4.6 benennt die drei Phasen neu. Sie heissen jetzt Kosmen: Resonanzkosmos, Datingkosmos, Erlebniskosmos. Gestaltung und Werte bleiben wie in 4.5.

4.5 beruhigt den Atlas: weniger Schriftwechsel, mehr Raum, mehr Kontrast. Die Farben folgen jetzt den drei Bereichen des Resonanzrads. Das Rad, das Umfeld, der Beziehungsraum und der Weg sind echte Bausteine mit eigenen Seiten. Die neun Teile des Resonanzrads heissen Elemente. Die Bewegung erklärt, wie etwas funktioniert, statt nur einzublenden. Eine Quelle für alle Werte ist `tokens.css`.

## Profil eines Elements (5.2)

Anlass ist die Prüfung der Seite `/ich/astrologie` der App (soulresonance.ch PR #92, Chris Beyeler 22.11.2026). Gemessen am Telefon: 52 Einträge mit 8074 Wörtern standen offen, die Seite war 57 Bildschirme lang, der erste gedeutete Satz stand bei 2366 px, nach jedem Satz stand dasselbe Zeichen (483 Mal). Der Founder der App hat am 23.11.2026 drei Fragen mit «A, A, A» beantwortet. Dieser Stand gibt der App dafür die Vorlage. Der Screen zeigt die Astrologie, die Regeln gelten gleich für Human Design und Numerologie.

| Regel | Was gilt | Wo |
|---|---|---|
| Aussage zuerst | Seitenkopf mit Bereich, Titel und einem Satz Einleitung. Darunter drei Kurztexte (Sonne, Mond, Aszendent) als Hauptfläche. Der erste Kurztext steht am Telefon bei 403 px. | `astrologie.html`, `.vp-kern` |
| Jeder Kurztext führt zu seinem Eintrag | Die drei Zeilen der Hauptfläche sind Links. So liest niemand denselben Satz zweimal, ohne zu wissen, wo er steht. | `.vp-kern__zeile` |
| Rad vor Tabelle, Tabelle zugeklappt | Nach dem Rad folgt direkt der Kopf «Alle Stellungen». Die Tabelle bleibt im Dokument und ist der Textweg zum Rad. | `.vp-stellungen`, `.app-table` |
| Tabelle verschiebt nichts | Ab 760 px Platz stehen Hauptfläche und Rad nebeneinander, «Alle Stellungen» darunter über die ganze Breite. | `@container vp` |
| Kapitel sind die einzigen Linien | Ein Kapitel beginnt mit einer Linie, sein Titel steht in der Stufe Titel. | `.app-section--chapter` |
| Eintrag zeigt Titel und Kurztext | Der Titel steht in der Stufe Überschrift, der Kurztext in der Farbe des Bereichs. Der lange Text liegt in «Mehr lesen». Zu beim Laden. | `.app-entry`, `.app-fold` |
| Kopf des Aufklappers ist ein Wort | Nie eine Überschrift. Für Screenreader folgt der Titel des Eintrags, damit 52 gleiche Köpfe unterscheidbar sind. Pfeil rechts, er dreht beim Öffnen. | `.app-fold__head` |
| Ein Sprung öffnet den Eintrag | Aus Hauptfläche, Rad, Tabelle und Inhalt. Der Eintrag trägt danach Rand und Hauch des Bereichs, der Fokus steht auf seinem Titel. | `screens.js`, `.app-entry.is-target` |
| Kein Zeichen je Satz | Die Seite zeigt ein Element und nennt es im Titel. Die Herkunft steht je Eintrag in «Woher das kommt», am Ende des langen Texts. | `.app-facts` |
| Rückweg bleibt sichtbar | «Zurück zum Rad» steht ausserhalb des Aufklappers. | `.app-entry__back` |
| Lesespalte | Eintrag und Tabelle messen sich an `--measure`. Rand und Polster der Markierung liegen ausserhalb der Spalte. | `.app-entry` |

Gemessen am Screen (23.11.2026, Beispiel mit 27 von 52 Einträgen): Telefon 390 px 10,9 Bildschirme, Laptop 1280 px 9,5 Bildschirme, kein waagrechter Überlauf.

### Offen nach 5.2

- **Wörter ohne Freigabe im Glossar:** «Alle Stellungen», «Mehr lesen» am Eintrag, «Woher das kommt», «Inhalt», «Nach oben», «Zurück zum Rad», «Allgemein erklärt». «Mehr lesen» und «Woher das kommt» stehen so schon in der App. Das Glossar ist nicht angefasst.
- **Einleitung und Hinweis am Rad:** «Drei Sätze zu deinem Geburtsmoment. Darunter stehen alle Stellungen zum Nachlesen.» und «Tippe ein Zeichen im Rad an. Alle Stellungen stehen darunter.» Chris hat den Screen mit diesem Wortlaut am 24.11.2026 freigegeben («passt»). Im Glossar stehen die Sätze nicht.
- **Fünf Fragen des Founders der App sind offen** (A11y-Vorprüfung der App vom 23.11.2026, F1 bis F5). Der Screen folgt je der Empfehlung: Kopf «Mehr lesen» mit dem Titel für Screenreader (F1), nichts wird gemerkt (F2), kein Einzelknopf je Eintrag (F3), neuer Hinweis am Rad (F4), Kurztexte der Hauptfläche als Links (F5). Entscheidet der Founder anders, zieht der Screen nach.
- **Ort von «Woher das kommt»:** hier am Ende des langen Texts, also im geöffneten «Mehr lesen». Die App zeigt es heute direkt am Eintrag.
- **Human Design und Numerologie:** Der Screen zeigt nur die Astrologie. Was dort die Hauptfläche trägt und was «Alle Stellungen» ersetzt (Liste der Zentren, Tafel), ist offen (F5).
- **Das Rad ist ein Standbild.** Die App zeichnet das Geburtsrad selbst. Ein Baustein dafür fehlt im Paket.
- **Beispieltexte:** Titel, Kurztexte und der lange Text zu «Sonne im Widder» stammen aus der App (Testkonto). Die übrigen langen Texte sind Platzhalter.

## Heute, Für deinen Tag (5.1.1)

Nachzug aus der App (soulresonance.ch, Konzept `.planning/KONZEPT-HEUTE-STARTSEITE-2026-11-21.md`, freigegeben von Chris Beyeler am 21.11.2026 im Freigabe-Artefakt, Runden 1 und 2). Nur der App-Screen Heute, keine neuen Werte, darum ein Patch.

| Was | Warum | Wo |
|---|---|---|
| Die Hauptfläche trägt nur die Stimme | Chris: «muss optisch besser aufgeteilt sein» (E1), Variante 2 gewählt (L1). Die Stimme ist die Aussage des Tages, mit Quelle wie im Fliesstext. | `heute.html`, `[data-day-voice]`, `.day [data-day-voice] p` |
| Chips bleiben unter der Stimme | Chris E4 Variante B: «Mond in den Fischen» und «Persönlicher Tag 7» bleiben, zusätzlich zur Quelle am Satz. Das nimmt die Regel aus 4.11 («der Fliesstext ersetzt die Chips») für Heute zurück. | `heute.html`, `.element-chips` |
| «Mehr zu deinem Tag» statt «Weiter vertiefen» | Wortlaut der App. | `heute.html` |
| Hinweis «Deutung» am Ende der Hauptfläche | Regel M8 der App: einmal je Fläche, Wortlaut der App. | `.day__deutung` |
| Karte «Für deinen Tag» auf Papier | Die zwei Zeilen «Im Gespräch» und «Dein Fokus» stehen unter der Hauptfläche, Titel in Ink-2, Etiketten in Tief des Bereichs. | `.day-lines` |
| «Heute aus deiner Woche» in «Diese Woche» | Chris G1: die Tageszeile aus dem Wochenimpuls zieht in die Wochenkarte, dazu «Ganze Woche lesen». | `heute.html`, Begleitspalte |

### Offen nach 5.1.1

- **Wörter ohne Freigabe im Glossar:** «Für deinen Tag», «Im Gespräch», «Dein Fokus», «Heute aus deiner Woche», «Ganze Woche lesen», «Mehr zu deinem Tag». Im Wortlaut der App, das Glossar ist nicht angefasst.
- **Hintergrund des Tages:** In der App stehen Werte des Himmels, Mondphase und Tagesmotiv in einem Aufklapper «Hintergrund des Tages». Der Screen hier zeigt ihn nicht.
- **Begrüssung und Umschalter in der App:** Die App grüsst jetzt wie hier. Den Umschalter Woche und Tag entfernt sie erst nach dem Wort des Founders (soulresonance.ch Issue #85).

## Resonanzrad, zweite Runde (5.1)

Anlass war die Rückmeldung von Chris zum Live-Stand der App vom 15.11.2026: «Man tippt durch und erhält keine Information» und «zu unruhig». Die App hat den neuen Aufbau am 16.11.2026 bekommen (soulresonance.ch, PR #81). Dieser Stand zieht das Paket nach, damit es wieder die Quelle ist.

| Regel | Was gilt | Wo |
|---|---|---|
| Wer durchtippt, erfährt etwas | Unter dem gewählten Wort steht der Kernsatz, auch am Telefon. Drei Zeilen fest (bis 700 px Höhe zwei), damit beim Durchtippen nichts springt. 4.13 hatte den Satz am Telefon ausgeblendet. | `.rad-karte__satz` |
| Lesen ist leise, Ausfüllen ist die Handlung | «Mehr lesen» trägt die helle Form (`.button--secondary`), «Ausfüllen» die dunkle. | `resonanzrad.js`, `select` |
| Die Liste ist der zweite Weg | Zugeklappt zu einer Zeile «Alle neun Elemente», ohne Linien, in normaler Stärke. Rad und Element tragen die Seite. | `.rad-liste-klappe`, natives `details` |
| Erst das Wesentliche | Das Blatt zeigt zuerst Name, Wort und Kernsatz. «Alle Details» zeigt Fachzeile und Text im selben Blatt, der Fokus geht auf den neuen Teil. | `renderDetail`, `.rad-detail-stufe` |
| Die Mitte tritt zurück | «Ich» in der Mitte misst 1,25 rem statt 2 rem. Die grösste Schrift im Bild ist das gewählte Wort. | `.rad--blatt .rad__center` |
| Die Handlung steht im Bild | Das Rad richtet sich nach der Höhe des Fensters, neu auch auf dem Tablet hochkant (600 bis 899 px). Vorgabe für `--rad-rest`: 30 rem am Telefon, 26,25 rem bis 700 px Höhe, 37,5 rem auf dem Tablet. Mindestens 13 rem. | `.rad--blatt .rad__wheel` |

### Offen nach 5.1

- **Satz über dich im Kopf der Seite:** Die App zeigt über dem Rad den ersten Satz des Portraits und den Weg «Dein Portrait lesen». Der App-Screen Ich im Atlas hat kein Portrait, darum steht der Satz hier noch nicht. Entscheid Chris, ob der Screen Ich ein Portrait bekommt.
- **Wörter ohne Freigabe im Glossar:** «Mehr lesen», «Alle Details», «Alle neun Elemente». Im Wortlaut der App, das Glossar ist nicht angefasst.
- **Herkunft im Blatt:** Die App zeigt in der ersten Stufe auch das Herkunftszeichen und «Woher das kommt». Der Baustein hier führt keine Herkunft.

## Reife (4.13)

Chris wollte am 15.11.2026 mehr Regeln im Design und alles auf dem neusten Stand. Diese Runde hat drei Quellen. Erstens die Lückenliste der App (`docs/elanum-migration.md` in soulresonance.ch, L1 bis L61): Sie nennt, was dem Paket fehlt. Zweitens sieben Kits und Regelwerke als Messlatte: Untitled UI, Magic UI, SmoothUI, RetroUI, die Skills von shadcn/ui, React Bits und `ui-ux-pro-max` mit 120 Regeln. Drittens eine Messung im Browser: jede Seite des Atlas, jeder Baustein und jeder App-Screen in sechs Breiten, 90 Seitenaufrufe, vorher und nachher mit demselben Skript (`tools/regel-messung.js`: 310 Funde vorher, keiner nachher).

| Regel | Was gilt | Gemessen vorher, nachher | Wo |
|---|---|---|---|
| Die Schrift wächst mit | Jede Schriftgrösse steht in rem. Stellt ein Mensch im Browser oder in der App eine grössere Schrift ein, wächst jede Stufe mit. Jede Stufe gibt es als Ganzes (`--type-…`) und einzeln (`--size-…`, `--leading-…`). Bei 100 % bleibt jede Grösse gleich. | Schrift in px: 12 Stellen, 0 | `tokens.css`, `node tools/token-check.js` |
| Ein Titel verteilt sich | Titel und Stimme verteilen sich gleichmässig auf ihre Zeilen (`text-wrap: balance`). Lauftext endet nicht mit einem einsamen Wort (`text-wrap: pretty`). Zeiten und Plätze, die untereinander stehen, tragen Tabellenziffern. | Titel ohne Ausgleich: 141, 0. Einsame Wörter: 73, 0 | `base.css`, Titelklassen der Bausteine |
| Alles ist treffbar, nichts berührt sich | Jedes Bedienelement trifft man auf 44 × 44 px (`--target`). In der Liste des Resonanzrads stiessen Name und Stand aneinander; ohne Farbfeld haben beide Platz. | Ziele unter 44 px: 87, 0. Berührungen: 8, 0. Überlauf: 1, 0 | `base.css`, `components/resonanzrad/resonanzrad.css` |
| Ein Feld hat eine Kante | Die Vertiefung allein hebt ein Feld nur mit etwa 1,5:1 vom Grund ab. Darum trägt es eine feine Kante (`--line-control`, 3,6:1 auf Canvas). Fokus bleibt das Glühen, ein Fehler der Ring in der Fehlerfarbe. | Kontrast der Feldgrenze: 1,5:1, 3,6:1 | `.field` in `base.css` |
| Fokus und Ebenen haben Namen | Der Fokusring steht als `--focus-width`, `--focus-offset`, `--focus-color`. Was über was liegt, steht als `--layer-…`. | Feste Ebenen: 10, 0. Fester Fokusring: 2, 0 | `tokens.css`, `node tools/token-check.js` |
| Drücken antwortet sofort | Jedes Bedienelement gibt beim Drücken in 90 ms nach (`--motion-press`), auch die leisen: Zeichen-Knopf, Link mit Pfeil, Rückweg, Quelle im Fliesstext, Zeile im Rad und im Umfeld, Karte zum Umdrehen. Der Haken im Zustand «bestätigt» zeichnet sich in einem Zug. | Arten von Bedienelementen ohne Antwort auf Druck: 16, 0 (282 geprüft) | `base.css`, `components/app/app.css`, `assets/button.js` |
| Das System hat das letzte Wort | ELANUM sagt dem Browser, dass es hell ist (`color-scheme`). Im Kontrastmodus des Systems bekommt jede Fläche eine Kontur und jede Auswahl die Auswahlfarbe, kein Satz verschwindet. Verlangt das System mehr Kontrast, wird Sekundärtext zu Ink und jede Linie kräftiger. Verlangt es weniger Durchsicht, stehen die Leisten ohne Schleier. | Im Kontrastmodus unsichtbar: Aussagen im Fliesstext, Stationen, Auswahl, Feldgrenzen. Jetzt sichtbar | `@media` in `tokens.css`, `base.css`, `components/app/app.css`, `components/fliesstext/fliesstext.css`, `components/resonanzrad/resonanzrad.css` |
| Der Name kommt aus dem sichtbaren Text | Was ein Vorleser sagt, beginnt mit dem, was man sieht. Zusätze stehen unsichtbar im Text, nicht in einem abweichenden `aria-label`. | axe: 2 Arten von Verstössen, 0 | `components/resonanzrad/resonanzrad.js`, `components/app/app.js` |
| Ein Seitenwechsel ohne Fahrt | Navigation und Kopf bleiben stehen. Der alte Inhalt blendet in 180 ms aus, der neue in 360 ms ein, der aktive Ort gleitet. Der getippte Ort ist sofort markiert. Die neue Seite steht oben, sie rollt nicht von der alten Stelle herauf. Die App setzt keine eigenen Regeln daneben. | In der App gemessen (15.11.2026): 1,3 bis 1,5 s Fahrt über 6812 px, mit der Regel keine | `components/app/app.css`, `html[data-seitenwechsel]` in `base.css` |

**Neue Namen in `tokens.css`.**

- Schrift: `--size-display`, `--size-title`, `--size-heading`, `--size-body`, `--size-label` und dazu `--leading-…`. Die fünf `--type-…` setzen sich daraus zusammen.
- Abstände: `--space-1` bis `--space-16`, zehn Stufen im 4er-Raster in rem. Die Zahl im Namen mal 4 ergibt Pixel.
- Bedienung: `--target` (44 px), `--button-height` (52 px), `--focus-width`, `--focus-offset`, `--focus-color`, `--focus-color-dark`.
- Ebenen: `--layer-float`, `--layer-head`, `--layer-nav`, `--layer-toast`, `--layer-skip`. Sheets und Karten brauchen keine Ebene, sie liegen als `dialog` zuoberst.
- Linie: `--line-control`, die Kante eines Bedienelements.

**Neu am Rahmen der App.** `data-kopf-titel-sofort` am Seitenkopf zeigt den Seitentitel am Telefon sofort im Kopf der App, die `h1` bleibt für Vorleser. So gebaut in der App für das Resonanzrad.

**Neue Varianten.** `.button--compact` für Zeilen und Leisten (44 px hoch). `.button--danger` für Löschen und Auflösen: ruhig wie die zweite Handlung, das Wort in der Fehlerfarbe. `.app-row--danger` für dieselbe Handlung als Zeile.

**Neu im Paket.** `tokens.json` listet jedes Token mit Name, Wert, Gruppe und Notiz, erzeugt aus `tokens.css` (`node tools/tokens-json.js`). Werkzeuge und Agenten lesen die Werte, ohne CSS zu zerlegen.

**Zwei Prüfungen.** `tools/token-check.js` prüft neu auch Schrift in px, Ebenen und den Fokusring. `tools/regel-messung.js` misst im Browser, was sich im CSS nicht ablesen lässt: Bedienziel, Berührung, einsames Wort, Titel ohne Ausgleich, Überlauf oder abgeschnittener Text, ein Wort auf zwei Zeilen. Es lädt 17 Seiten in sieben Breiten (119 Seitenaufrufe). Mit `SCHRIFT=125` misst es dieselben Regeln bei grösserer Schrift.

**Aus der App zurück in den Atlas.** Chris hat am 15.11.2026 den Seitenwechsel der App freigegeben (Zweig `claude/focused-bell-gs6h2s` in soulresonance.ch, Punkte E1 bis E8). Die App hat ihre eigenen Übergänge entfernt und nutzt die des Pakets. Zwei Dinge daraus stehen jetzt im Paket, damit beide gleich bleiben: Während eines Seitenwechsels setzt die App `data-seitenwechsel` auf `<html>`, dann rollt nichts (das weiche Rollen des Pakets gilt nur für Sprünge innerhalb einer Seite). Und das Detail im Umfeld blendet in 180 ms ein, bei jedem Wechsel des Menschen, weil der Inhalt bewegt wird und nicht der Rahmen. Die Fahrt hat die App gemessen, nicht dieser Atlas.

**Sichtbar anders.** Eingabefelder haben eine feine Kante. Der Datumskreis der Erlebnisse misst auf jeder Karte 5 rem (80 px) statt 72 px. Titel brechen ausgeglichen um («Abendessen / zu sechst» statt «Abendessen zu / sechst»). Das Resonanzrad hat den Aufbau der App: nichts gewählt beim Öffnen, das gewählte Element unter dem Rad, das Detail als Blatt, die Liste ohne Farbfeld (Abschnitt Bausteine). Auf dem Screen Ich steht der Seitentitel am Telefon im Kopf der App (`data-kopf-titel-sofort`). Der Beziehungsraum ist ohne Regler lesbar (Zweig `claude/beziehungsraum-lesbar`, zusammengeführt): Abstand, Platz um jeden, Feld um beide, darunter die drei Werte als Wort. Die Karte eines Erlebnisses zeigt bis 19 rem Inhaltsbreite den Datumskreis mittig und den Titel darunter, wie in der App (Lücke L43). Die Seitenleiste des Atlas ist 68 px länger, weil ihre Links 44 statt 40 px hoch sind. Auf Telefonen unter 400 px wird der Seitentitel der Bausteinseiten mit dem Fenster kleiner, damit «Beziehungsraum» ganz bleibt (dieselbe Zeile wie in PR #23). Die Regler im Beziehungsraum sind 44 statt 36 px hoch.

**Lücken der App, die damit schliessen.** L7 (Schrift in rem), L8 (Abstandsskala, die breite Lesespalte fehlt weiter), L9 (Trefferfläche und Fokus), L11 (Knopfhöhe als Token, kompakt, Löschen), L35 (Kante der Felder), L41 (Datumskreis), L43 (schmale Karte eines Erlebnisses), L53 (Zeile für gefährliche Handlungen), L55 (Masse des Rahmens gelten ausserhalb von `.app`). Schon mit 4.12 geschlossen: L10, L31, L33, L46, L54.

**Aus den Kits übernommen.**

- Untitled UI: Grösse und Zeilenhöhe als Paar je Stufe. Abstände als benannte Skala im 4er-Raster. Der Fokusring als Teil des Systems. Die Prüfung des Kontrasts an jeder Farbe gab es im Atlas schon.
- SmoothUI: Die Kurve fürs Erscheinen ist dieselbe wie bei ELANUM (`cubic-bezier(.23,1,.32,1)`). Übernommen ist die Liste je Baustein: Tastatur, Namen für Vorleser, reduzierte Bewegung. Sie ist hier als Messung gebaut, nicht als Tabelle.
- shadcn/ui Skills und React Bits: Ein Paket beschreibt sich so, dass ein Agent es lesen kann. Daraus ist `tokens.json` entstanden.
- `ui-ux-pro-max`: die Regeln zu Trefferfläche, Umbruch, Tabellenziffern, Antwort auf Druck, Systemeinstellungen und zum Namen aus dem sichtbaren Text.

**Bewusst nicht übernommen.**

- Schmuckbewegung aus Magic UI und React Bits: Laufbänder, Zahlen, die hochzählen, wandernde Hintergründe, Textzerfall, Zeiger-Effekte. Bei ELANUM hat jede Bewegung einen Grund.
- Federn mit Überschwingen (SmoothUI). ELANUM läuft aus, es federt nicht.
- Die Pixel-Ästhetik von RetroUI. Sie zeigt, wie stark ein System wirkt, das eine Idee durchzieht. Die Idee von ELANUM ist das warme Relief.
- Eine Schatten-Skala von klein bis gross (Untitled UI). ELANUM benennt Schatten nach ihrer Aufgabe (erhaben, vertieft, schwebend), nicht nach ihrer Grösse.
- Eine dunkle Darstellung. Chris hat am 15.10.2026 für die App entschieden, dass es keinen dunklen Hintergrund mehr gibt (Entscheid 35 in `docs/elanum-migration.md`).
- Eigene Formen für Kästchen und Auswahlfelder. Das Kästchen des Browsers in Ink ist bedienbar, bekannt und im Kontrastmodus sicher.

**Offen nach 4.13.**

- Abstände in den Bausteinen: 415 von 585 liegen im 4er-Raster, 170 auf Zwischenwerten (6, 10, 14, 18, 22 px). Die Skala steht in `tokens.css`, die Bausteine nutzen sie noch nicht. Angleichen würde an 170 Stellen 2 px verschieben.
- Die Lesespalte `--measure` (62ch) ergibt gemessen 83 bis 88 Zeichen je Zeile. Als gut lesbar gelten 60 bis 75. Mit 56ch wären es rund 75.
- Die Karte «Wo es schwingt» ist im Screen Entdecken dunkel. In der App ist sie hell gebaut (Lücke L36).
- Das Sheet steht ab 1024 px am rechten Rand. In der App steht es in der Mitte (Lücke L52).
- `screens.css` liegt nicht im Paket (Lücke L25). Ein eigener Baustein für Meldung, Auswahlfeld, Tabelle und Fortschritt fehlt (Lücke L16).
- Die Schrift im Resonanzrad und im Umfeld ist Teil der Zeichnung und wächst nicht mit (Lücke L60).
- Resonanzrad auf dem Screen Ich, gemessen am Telefon: «Lesen» ist ohne Scrollen sichtbar ab 360 × 780 px (14 px Luft zur Leiste), bei 375 × 667 und 390 × 844 px mit 41 px. Bei 320 × 640 px liegt der Knopf 2 px unter der Kante der Leiste, das Rad hat dort schon sein Minimum von 10 rem.
- Das Detail im Blatt zeigt im Atlas Beispieltext. Die Wege der App (Einzelbefund, Profil der Lehre, «Alle Details») und der Fragebogen sind nicht nachgebaut.
- Die Wörter der Bedienung im Resonanzrad kommen aus der App («Element wählen», «Lesen», «Ausfüllen», «Noch offen», «Deine neun Elemente») und stehen noch nicht im Glossar.
- Bei 125 % Schrift bleiben im Atlas selbst 7 Funde (gemessen): 8 px Überlauf auf der Bausteinseite Fliesstext bei 320 px, 25 px Überlauf im Atlas und auf der Übersicht der App bei 360 px, und die Titel der drei Kosmen brechen bei 320 und 360 px mitten im Wort. In den App-Screens bleibt keiner.
- Die zweite Prüfung hat Lücken der Werkzeuge benannt, die offen sind: `tools/token-check.js` übersieht Schrift in einer eigenen Variablen und einzelne `outline`-Angaben. `tools/regel-messung.js` misst keine Zustände und nichts in geschlossenen Dialogen.
- Der Kontrastmodus ist in Chromium nachgestellt geprüft (hell und dunkel), nicht auf einem Gerät mit Windows.
- Silbentrennung ist nicht eingeschaltet. Lange Wörter brechen nur im Notfall, dann ohne Trennstrich.
- `tools/regel-messung.js` braucht Playwright und läuft darum nicht mit den Prüfbefehlen vor jedem Push.

## Feinschliff (4.12)

Chris hat am 15.11.2026 fünf Clips eines Studios und ein Markenbrett als Messlatte geschickt. Sie wurden Bild für Bild vermessen, ELANUM mit denselben Massen. Ergebnis: Zurückhaltung, Zeiten und Staffelung von ELANUM lagen schon auf der Höhe der Referenz (Auftritt 700 ms gegen 700–770 ms, Staffelung 90 ms gegen rund 100 ms), bei der Lesbarkeit ist ELANUM strenger. Es fehlte an Entschiedenheit im Einzelnen. Acht Regeln standen zur Freigabe, sieben sind gebaut.

| Regel | Was gilt | Wo |
|---|---|---|
| Ein Moment, eine Grösse | Der Seitentitel der App steht in der Stufe Überschrift. Die grösste Schrift gehört dem einen Moment des Screens. | `.app-title` in `components/app/app.css` |
| Zwei Kurven mit Namen | `--ease-out` für alles, was erscheint oder antwortet. `--ease-in-out` für alles, was den Ort wechselt (der Wert, den der Zeichenaufbau schon nutzte). `linear` nur in Dauerschleifen. `--ease` bleibt als zweiter Name von `--ease-out`. | `tokens.css` |
| Fünf Dauern mit Namen | `--motion-press` 90 ms, `--motion-ui` 180 ms, `--motion-enter` 360 ms, `--motion-move` 520 ms, `--motion-reveal` 700 ms, dazu `--motion-stagger` 90 ms als Versatz. Längere Abläufe sind ein Vielfaches (`calc`). Verzögerungen dürfen Zahlen sein. | `tokens.css` |
| Was kommt, geht auch | Sheet und Quellenkarte laufen beim Schliessen denselben Weg zurück, in zwei Dritteln der Zeit. Erst danach schliesst der Dialog, auch mit Esc. Ohne Bewegung schliesst er sofort. | `components/app/app.js`, `components/fliesstext/fliesstext.js` |
| Antwort am Ort der Handlung | Wer speichert oder sendet, sieht am selben Knopf Ruhe, läuft, bestätigt. «läuft» erscheint erst nach 300 ms und trägt `aria-busy`, «bestätigt» zeigt Haken und Wort. Beides wird angesagt. | `assets/button.js`, `.button__sign` in `base.css` |
| Dauerschleifen sind die Ausnahme | Der Glührand wandert nur bei Hover und Fokus, in der Auswahl steht er. Je Screen atmet ein Ort, neben dem ELANUM-Zeichen im Lichtlauf. Schleifen bewegen nur Deckkraft und Lage. | `base.css`, Abschnitte Glührand und Atemtakt |
| Jeder Wert hat einen Namen | Farben, Schatten und Radien stehen als Wert nur in `tokens.css`. | `node tools/token-check.js` |

**Ein Ort im Atemtakt.** Rangfolge je Screen: «jetzt» im Tagesbogen, der Auswahlbogen im Resonanzrad, «jetzt» auf der Spur, sonst der aktive Ort der Navigation. Wo der Beziehungsraum atmet, atmet die Navigation nicht. Solange eine Spur noch verdeckt ist, atmet ihr «jetzt» nicht, und ausserhalb des Fensters ruht jede Schleife. Jeder dieser Orte hat eine eigene Glüh-Ebene, im Atemtakt bewegt sich nur ihre Deckkraft. Alle anderen Orte glühen ruhig: die Auswahl, das wartende Stück im kleinen Rad, der Kreis des Tagesbogens. Gemessen auf Heute bei vierfach gedrosseltem Prozessor: vorher 21 Dauerschleifen, davon 14 unsichtbar, und 63 % Last auf dem Hauptfaden. Nachher 2 Schleifen und 9 %.

**Neue Namen in `tokens.css`.**

- Farben: `--paper-light`, `--sand`, `--sand-deep`, `--ink-soft`, `--on-dark`, `--white`, `--black` und die fünf Stopps des Markenspektrums einzeln als `--violet`, `--blue`, `--orchid`, `--rose`, `--pink`. Stufen der Deckkraft entstehen mit `color-mix(in srgb, <Name> <Anteil>, transparent)`.
- Relief: `--raised-button`, `--cast`, `--lifted`, `--lifted-deep`, `--lifted-dark`, `--sheen`, `--under`, `--under-far`, `--sheet-shadow`, `--float-shadow`, `--bar-shadow`, `--pressed-ink`, `--raised-dark`, `--pressed-dark`, `--text-lift`.
- Runde Formen (als `filter`): `--relief-disc`, `--relief-disc-sm`, `--relief-disc-soft`, `--relief-disc-dark`, `--relief-zeichen`, `--relief-line-dark`, `--drop-soft`, `--drop-line`.
- Glühen: `--glow-line`, `--glow-rose`, `--glow-now`, `--glow-dot`, `--glow-thumb`.
- Form: `--radius-round`.

Zusammengeführt: Sechs fast gleiche Papiertöne sind `--paper` und `--paper-light`, sieben Beigetöne sind `--offen`, zehn Radien stehen auf Control, Button, Fläche oder rund. Eine Kontur oder Linie ohne Weichzeichnung (`0 0 0 2px Farbe`) gilt nicht als Schatten und darf im CSS stehen, wenn ihre Farbe einen Namen hat. Ein abgeleiteter Radius steht als `calc()` aus einem Token: ein Drittel von Control (4 px) am Status und an der Aussage, zwei Drittel (8 px) an der Ecke der Sprechblase.

**Geänderter Wert.** `--motion-reveal` steht neu auf 700 ms statt 900 ms. Im Paket nutzte bisher keine Regel das Token, die App nutzt es nicht (gemessen im Klon der App). Die Auftritte im Atlas laufen weiter mit 900 ms, sie kommen aus `assets/motion.js`.

**Sichtbar anders durch die Namen.** Die Hauptfläche hat 28 statt 32 px Radius, Sprechblasen und Gesprächsideen 28 statt 22 px, Composer und Handlungsleiste 28 statt 26 px, das Ziel der Leiste 16 statt 18 px. Im Atlas haben das dunkle Kapitel und die Gerätevorschau 28 px Radius und einen leichteren Schatten. Notiz, Papierkarte, Rad-Zentrum und Bühnen sind einen Hauch dunkler (`--paper` und `--offen` statt eigener Töne). Der Bildplatz auf Entdecken ist aus benannten Farben gemischt.

**Bewusst nicht übernommen.** Die Clips sind Werbung für erfundene Produkte. Diese sechs Dinge machen dort Eindruck und würden ELANUM schaden:

- Kleine Schrift in Versalien. ELANUM bleibt bei 15 px als Minimum.
- Dunkles Glas über Foto. ELANUM gehört das warme Relief.
- Kursiv als Betonung. Kursiv gibt es nicht mehr.
- Kamerafahrt, animierte Unschärfe und Ton.
- Zahlen, die hochzählen. ELANUM zeigt keine Zähler und keine Scores.
- Die Zeiten der Clips für direkte Rückmeldung. Was am Finger antwortet, bleibt bei 180 ms.

**Abgelehnt.** Die Hauptfläche trägt weiter den Schleier ihres Bereichs, nicht dessen volle Fläche.

**Bestätigt von Chris am 15.11.2026:** der Seitentitel in der Stufe Überschrift, die Begrenzung der Dauerschleifen samt Rangfolge des Atemtakts, die sichtbaren Folgen der Namen (Radien, Papiertöne, Schatten im Atlas) und `--motion-reveal` mit 700 ms.

**Offen nach 4.12.**

- Die grösste Schrift steht noch mehrfach auf Ich (Rad-Zentrum und Name des gewählten Elements) und auf Aktivitäten (Datum im Kreis und Titel des Erlebnisses), am Desktop auch auf Weg und Ankommen. Freigegeben war nur der Schritt am Seitentitel.
- Die Skripte der Bausteine zeichnen SVG noch mit festen Farben (Beziehungsraum, Umfeld, Zeichen, Tagesbogen, Resonanzrad, 38 Stellen). `tools/token-check.js` prüft nur das CSS.
- Die Szenen in `assets/motion.js` haben eigene Zeiten und Kurven. Sie sind Erzählung, nicht Bedienung. Einzelne Skripte nennen Kurven noch beim Schlüsselwort (`app.js` des Atlas, `components/zeichen/zeichen.js`).
- Zweimal Esc kurz hintereinander schliesst ein Sheet ohne Übergang, das macht der Browser. Der Fokus kehrt trotzdem zurück.
- Ausserhalb des Fensters ruhen Lichtlauf und Atemtakt nur, wenn `assets/motion.js` geladen ist. Ohne das Skript laufen sie dort weiter.
- Im Beziehungsraum rücken die Kreise über eine eigene Näherung zusammen, dort gibt es keine Kurve zum Tauschen.
- Die Zusage im Sheet (Dabei, Vielleicht, Nicht dabei) ist eine Auswahl mit Status darunter und hat die Zustände des Buttons nicht.
- Wörter am Button ohne Freigabe im Glossar: «Einen Moment» und «Erledigt» als Vorgabe, in den Screens «Wird gesendet», «Gesendet», «Speichert», «Gespeichert», «Wird behalten», «Behalten», «Wird übernommen», «Übernommen».

## Fliesstext (4.11)

Der Entwurf zeigt, was ELANUM nach dem Ankommen als Erstes sagt: ein persönlicher Text in grosser Schrift, die Kernaussagen unterstrichen, am Satzende runde Zeichen für Astrologie, Numerologie und Human Design, beim Antippen eine Karte „Woher kommt diese Aussage?“. Das Prinzip trägt: Lesen bleibt ruhig, und wer wissen will, woher ein Satz kommt, findet es genau dort, wo der Satz steht. Übernommen sind Aufbau, Texte, Reihenfolge und die Bedienung (Karte unten, Esc, Fokus zurück, Name im Fenster gehalten).

Übersetzt in den Atlas:

- **Schrift:** Yrsa statt Iowan, Albert Sans statt Avenir. Der gelesene Text steht in der Stufe Titel (32 bis 48 px) mit ruhiger Zeilenhöhe 1,36, der Name im Muster in der Stufe Display. Kleine Versalien mit Sperrung (0,72 bis 0,78 rem) gibt es nicht: Kicker, Legende und Hinweis stehen in 15 px, normal geschrieben.
- **Farbe:** Der Entwurf gibt jeder Quelle eine eigene Farbe (Violett, Blau, Rosé). Im Atlas sind Astrologie, Numerologie und Human Design Elemente desselben Bereichs Sterne & Ursprung und tragen alle dessen Violett. Unterschieden wird über das Icon des Elements aus dem Resonanzrad. Eine Aussage aus einem Element von Ich & Orientierung oder Beziehung & Verbindung trägt Koralle oder Petrol. Kein Rauschen im Grund, die Fläche bleibt Canvas.
- **Aussage:** Unterstrich in der Bereichsfarbe mit 42 % Deckkraft, damit sie nie wie ein Link aussieht (der ist Ink mit 1 px). Geöffnet bekommt die Aussage den Hauch ihres Bereichs als Grund und den vollen Unterstrich.
- **Quelle:** Ring 1,6 px in der Bereichsfarbe, Grund im Hauch, Icon mit 1,6 px. Sichtbar 0,86 em, Trefferfläche 44 px statt der knapp 30 px im Entwurf. Hover und Fokus zeigen den Glührand und den Namen in 15 px auf Papier. Das letzte Wort bleibt mit den Quellen in einer Zeile.
- **Quellenkarte:** ein echtes `<dialog>`, damit Fokus, Esc und Hintergrund von selbst stimmen. Auf dem Telefon von unten wie ein Sheet, ab 600 px schwebend über dem unteren Rand, so bleibt der Text darüber lesbar. Die Karte zeigt zusätzlich den Satz selbst, und bei zwei Quellen eine Auswahl. „Mehr dazu“ heisst „Mehr über Astrologie“ und erscheint nur mit Ziel. Liegt die Aussage hinter der Karte, rollt die Seite sie darüber.
- **Linien:** Der Entwurf trennt Kopf, Text und Schluss mit Haarlinien. Im Atlas trennt Raum.
- **Zwei Stufen:** Stimme (Yrsa) für den Moment, in dem ELANUM zu dir spricht, leise (Albert Sans, Stufe Text) in Karten. Auf Heute ersetzt der leise Fliesstext die Chips „Mond in den Fischen“ und „Persönlicher Tag 7“ unter dem Tagestext: Die Herkunft steht jetzt beim Satz, den sie betrifft.

Abgleich mit der App: soulresonance.ch hat dasselbe Prinzip schon als Muster M1 „Herkunft je Satz“ (`AbsatzMitHerkunft.svelte`). Gleich sind Zeichen am Satzende als Knopf, Markierung des Satzes beim Antippen, Esc und Fokus zurück. Anders sind drei Dinge, die vor dem Nachzug in der App zu entscheiden sind: (1) Im Fliesstext ist die Kernaussage auch in Ruhe leise unterstrichen, in M1 erst beim Antippen. (2) Die Herleitung steht hier in der Quellenkarte, in M1 als Aufklapper unter dem Absatz. (3) Die Farben folgen hier den Bereichen des Rads, in M1 hat jedes System eine eigene Quellenfarbe.

### Offene Freigaben (Fliesstext)

Diese Namen stehen im Baustein, aber noch nicht im Glossar: Fliesstext, Aussage, Quelle, Quellenkarte. Das Glossar ist unverändert, bis sie freigegeben sind.

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
- **Tagesbogen:** Der Tag als offener Kreis, die Öffnung unten ist die Nacht. Bis „jetzt“ führt die Verbindung im Markenspektrum (wie die Spur der Tageslinie bis „jetzt“), danach bleibt der Bogen gestrichelt offen. Stationen sind Knoten, „jetzt“ ist ein Ring, der im Atemtakt glüht. Der Kreis steht seit 4.12 still.
- **Wo du bist, glüht:** Der aktive Ort in der Navigation trägt den Glührand. Seit 4.12 steht der Rand, und der Ort atmet nur, wenn der Screen keinen eigenen Ort im Atemtakt hat. Beim Wechsel gleitet er zum neuen Ziel (View Transitions zwischen Seiten), Navigation und Kopf bleiben stehen, der Inhalt steigt weich auf.
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

In der App steht der Seitentitel seit 4.12 in der Stufe Überschrift, damit die grösste Schrift dem einen Moment des Screens gehört.

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

**Glührand und Hover:** Bedienbare Flächen zeigen bei Hover, Fokus und Auswahl einen Rand im Markenspektrum, dazu ein weiches Glühen. Bei Hover und Fokus wandert die Farbe im Kreis (6 s pro Umlauf). In der Auswahl (gewähltes Element, gewählte Person, aktiver Tab, bewusste Auswahl) steht der Rand seit 4.12, und die Fläche glüht ruhig. Jeder Hover ist gut sichtbar: Karten heben sich und glühen, Listen und Navigation bekommen eine Fläche, Links werden violett mit kräftigerer Unterstreichung, Buttons hellen auf und heben sich. Ohne Bewegung steht der Verlauf still.

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
- Farbe heisst ausgefüllt: Ein ausgefülltes Stück trägt die Fläche seines Bereichs, alle drei Elemente eines Bereichs gleich. Ein offenes Stück ist grau, gestrichelt umrandet und trägt ein Plus in Ink. In der Liste steht „+ Ausfüllen“; ein Tipp darauf wählt das Element und öffnet sein Blatt mit „Jetzt ausfüllen“. Das Plus hat eine eigene Zeile mit Abstand und überlappt nie Icon oder Name.
- Beschriftung im Rad, gemessen so gesetzt, dass nichts überlappt und nichts über sein Stück hinausragt (2 px Rand, für jede der neun Auswahlen geprüft): Ab 500 px Raddurchmesser stehen Name und darunter Ergebnis oder Plus, in echten 15 px. Darunter zeigt jedes Stück nur sein Icon, offene Stücke zusätzlich das Plus (ab 300 px). Name und Ergebnis stehen dann in der Zeile direkt unter dem Rad. Im Atlas bekommt das Rad ab 1280 px Fensterbreite seine vollen 520 px, damit Name und Ergebnis auf üblichen Laptops im Stück stehen. Icon, Name und Ergebnis zusammen sind für ein 40°-Stück zu gross; frühere Stände überlappten deshalb an den Rändern. Der Auswahlbogen steht in der Farbe seines Bereichs und glüht im Atemtakt. Namen, Ergebnisse und Status stehen in der Liste und im Lesebereich. Die Liste ist die Tastaturbedienung (Pfeile, Home, End).
- Der Ring zeigt die drei Bereiche gleich stark und hebt nichts hervor. Icons, Konturen und Auswahlbogen sind Ink.
- Seit 4.11.1 steht das Rad still: Ein Tipp wählt das Stück an seinem Platz, nichts dreht und nichts lässt sich ziehen. Seit 4.13 hat der Baustein den Aufbau der App (dort live seit dem 15.11.2026): Beim Öffnen ist nichts gewählt. Rad und Pfeile wählen nur. Unter dem Rad steht das gewählte Element mit den Pfeilen neben dem Namen, dem eigenen Wort in der Stufe Titel, einem Satz und «Lesen» oder «Ausfüllen». «Lesen» und die Liste öffnen das Detail als Blatt (`dialog`, Telefon von unten, ab 600 px in der Mitte). Im Blatt stehen Name klein, Wort gross, Fachzeile, Kernsatz und Text. Am Telefon steht das Element ohne Rahmen, und das Rad richtet sich nach der Höhe des Fensters (`--rad-rest`), damit «Lesen» ohne Scrollen sichtbar ist. Die Liste trägt kein Farbfeld und keine Legende mehr, das Zeichen in der Bereichsfarbe genügt. Die Regeln der früheren Form (`.rad__nav`, `.rad__current`, `.rad__swatch`, `.rad__legend`, `.rad__result`) bleiben im Stylesheet gültig.

**Umfeld** (`components/umfeld/`): Ich in der Mitte, Menschen als eigene, geschlossene Kreise. Der Abstand zeigt die Nähe. Null bis drei Linien im Verlauf um die Person zeigen die Resonanz, wie im Beziehungsraum; ohne aktive Resonanz gibt es keine Linie. Keine Linie führt zur Mitte, und einen Freiraum gibt es nicht, weil das Umfeld den Wert nicht kennt. Die Kreise sind Knöpfe: Ein Klick auf Kreis oder Name wählt den Menschen. Aufbau: das Bild, darunter ein einziges Panel (erhöhte Karte, ohne Trennstrich). Oben im Panel stehen die Pfeile (wie beim Resonanzrad) mit dem Namen des gewählten Menschen, direkt darunter Nähe und Resonanz als Pillen, die Notiz und der Knopf, alles zentriert. Jede Angabe steht nur einmal: kein „Du & Name“ und keine zweite Zustandszeile. Der Lesebereich lässt sich mit Finger oder Maus ziehen, Kreis, Name und Lesebereich bleiben im Gleichschritt. Die Liste entfällt, und die Karte mit Zähler ebenso (Rückmeldung Chris vom 15.11.2026: Design wie Ich-Übersicht, gleiche Pfeile, Pillen, mehr Raum und früher sichtbar; Rückmeldung Chris vom 16.11.2026: eine Einheit, jede Angabe einmal). Das Bild ist senkrecht auf den Inhalt beschnitten, damit das Panel früh im Sichtfeld steht, und im Auftritt erscheint es als Ganzes nach 0,4 Sekunden. Ab 900 px steht das Panel rechts neben dem Bild, zur Bildmitte ausgerichtet. Der Lesebereich öffnet den Beziehungsraum mit den Werten des Menschen. So trägt das Umfeld mehr als eine einzelne Beziehung. Unter 520 px Bühnenbreite Breite der Bühne gilt das Hochformat (Telefon): Über dem Bild steht eine Filterzeile nach Art («Alle», Partnerschaft, Familie, Freundschaft, Innerer Weg, Arbeit). «Alle» ist die Übersicht, die Menschen stehen als kleine Punkte ohne Namen in ihren Gruppen, über jeder Gruppe liegt ein einziger Knopf (Tipp wählt die Art und den ersten Menschen). Eine Art zeigt nur ihre Menschen, gross und mit Namen in echten 15 px, gleichmässig rund um «Ich», ohne Bögen. Pfeile und Slider laufen weiter durch alle Menschen, der Filter folgt der Auswahl. Grund: Neun Menschen waren bei 390 px zu eng, gemessen (Ringe überlappten um 4 bis 6 px, bei 320 px ragte «Jonas» aus dem Kreis). Entscheid Chris vom 16.11.2026. Ab 520 px Bühnenbreite gibt es keinen Filter, das Bild zeigt alle mit Namen. Entwurf vom 15.11.2026, die Version ist noch nicht freigegeben. Cluster nach Art: Der Winkel ist die Art, der Abstand die Nähe, die Linien sind die Resonanz. Wer zusammengehört, steht beieinander. Ein feiner Bogen mit dem Wort der Art fasst jede Gruppe, wie die Bereiche des Resonanzrads (Wort mindestens 15 px, in der unteren Hälfte andersherum, damit es nicht auf dem Kopf steht). Arten ohne Menschen bekommen keinen Platz, zwischen den Gruppen liegen 16°, die erste Gruppe steht oben. Die Art steht als erste Pille beim Menschen. Die Liste Partnerschaft, Familie, Freundschaft, Innerer Weg, Arbeit hat Chris am 16.11.2026 freigegeben. Der Glossar-Eintrag dazu steht noch aus. Der Filter nach Art auf dem Telefon ist umgesetzt (siehe oben).

**Beziehungsraum** (`components/beziehungsraum/`), neue Darstellung vom 15.11.2026 (Entwurf, PR 24). Der Baustein wird in der App ohne Regler gezeigt, darum muss das Bild allein lesbar sein. Jeder Wert hat ein eigenes Zeichen:
- SVG-Raum 720 × 400, Mitte y = 170. Die Person ist ein Kreis mit Radius 50, immer gleich gross.
- **Nähe** ist der Abstand der zwei Personenkreise: Lücke 190 bei «weit» bis 10 bei «sehr nah» (190 − 1,8 × Nähe). Sie überlappen nie.
- **Freiraum** ist die helle Fläche um jede Person, Radius 66 bis 112 (in der Atmung höchstens 117,6).  In der Mitte endet der eigene Platz dort, wo der des anderen beginnt.
- **Resonanz** ist das Feld um beide: drei Linien im Abstand 132, 146 und 160 um beide Personen. Null bis drei stehen im Spektrum da, bei jedem Abstand gleich gut lesbar. Das Bild zeigt nur, was gilt: keine Hilfslinien, keine gepunkteten Linien, kein Leuchten. Eine erste Fassung zeigte das Höchstmass des Freiraums als feine Linie und die nicht geltenden Feldlinien gepunktet; das waren bis zu neun Linien und zu unruhig (Entscheid Chris, 15.11.2026). Die Stufe trägt das Wort darunter.
- Unter dem Bild stehen die drei Werte als Wort (`.relationship-scale`, vom Skript erzeugt): Name leise oben, Wert kräftig darunter. Abschalten mit `data-skala="aus"` (Match-Moment in der App, Bewegungsbeispiel im Atlas). Der Vorlesetext des Bilds nennt die drei Stufen.
- Namen sind HTML-Text unter den Personen. Stehen zwei Menschen sehr nah, rücken die Namen so weit auseinander, dass sie sich nicht berühren. Werte sind Gestaltungsparameter, keine Messung.
- Es atmet nur der Freiraum (5 %), das Feld wird im Atem leicht kräftiger.
- Verworfen: die frühere Form mit zwei grossen Kreisen (Radius 128), Verbindungslinie und Öffnung unten. Bei grosser Nähe war die Resonanz nicht lesbar, die Öffnung sagte nichts über Freiraum, und es fehlte jede Referenz für Minimum und Maximum. Ebenfalls verworfen: Wortreihen mit allen Stufen, Messlinien, Beschriftung im Bild, Freiraum als Grösse des Personenkreises.
- Seit 4.11.2 wird der Seitentitel der Bausteinseiten (`.page-intro h1`) unter 400 px Fensterbreite mit dem Fenster kleiner (13vw, bei 320 px sind das 41,6 px). Vorher war «Beziehungsraum» in 52 px 325 px breit, Platz waren 272 px.

- Die fünf Arten sind die der App (`partner`, `family`, `friend`, `spiritual`, `work`), mit ihren Wörtern: Partnerschaft, Familie, Freundschaft, Innerer Weg, Arbeit (Entscheid Chris, 16.11.2026). Eine erste Fassung hatte vier eigene Wörter (Partner, Familie, Freunde, Arbeit). Der Baustein nimmt jede Liste an (`opts.kinds`).

- Zwei Spalten (Bild neben Karte) gelten, sobald der Baustein selbst 61rem breit ist. Zuerst waren es 52rem: Dann war die Bildspalte aber unter 520 px breit und zeigte neben der Karte die Telefon-Ansicht (gemessen in der App bei 1280 px, 16.11.2026). Das Skript misst ihn und setzt `data-cols`. Vorher schaltete die Breite des Fensters (900 px): Im App-Rahmen mit Seitenleiste und bei 125 % Schrift wurde die Karte so schmal, dass der Name umbrach (gemessen bei 1024 px).

- Lange Namen im Kreis: der volle Name, wenn er passt, sonst der Vorname, sonst gekürzt mit Auslassung. Der volle Name steht in der Pfeilzeile und im Vorlesetext. Die Regel kommt aus der App; mit ihren Daten lief «Imaginärer Solo-Partner» aus dem Kreis (gemessen 16.11.2026, Entscheid Chris).

- `resonanzrad.css` trug seit 4.13 eine überzählige schliessende Klammer (Zeile 86). Browser übergehen sie, der Bau der App (postcss) bricht daran ab. In 5.0 entfernt; gefunden beim Einbinden in die App am 16.11.2026.

**Weg und Tageslinie** (`components/weg/`, Baustein `.track` in `base.css`): Stationen erledigt (gefüllter Punkt), jetzt (Ring) und offen (Kontur mit Öffnung unten). Bis „jetzt“ führt die Spur, danach eine Unterbrechung. Labels stehen in einer eigenen Spalte und kreuzen die Linie nie. Waagrecht ab 900 px, darunter senkrecht.

**Zeichen in Bewegung** (`components/zeichen/`): Zeichenaufbau und Lichtlauf, siehe oben beim ELANUM-Zeichen. Markup `<div class="zeichen" data-zeichen="aufbau | lichtlauf">` mit dem Spektrum als `<img>`; ohne Skript steht das Bild.

**Fliesstext** (`components/fliesstext/`): Aussage, Quelle und Quellenkarte, siehe oben unter Fliesstext. Markup `<mark class="fliesstext__aussage" data-quellen="…">` in einem `[data-fliesstext]`; ohne Skript bleibt ein ruhiger Text mit leise unterstrichenen Aussagen.

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
| Umfeld | Menschen rücken aus dem Rand auf ihre Nähe, danach blenden die Linien um die Person ein. |
| Weg und Tageslinie | Die Spur wächst, Stationen erscheinen beim Erreichen. Auf der Element-Seite an den Scroll gekoppelt. |
| Status | Das Zeichen federt beim Wechsel kurz ein. |
| Glühen | Je Screen atmet ein Ort (Feinschliff 4.12), alle anderen glühen ruhig; Verbindungslinien leuchten weich. |
| Bedienung | 180 ms (`--motion-ui`), Drücken 90 ms (`--motion-press`), ohne Blitz. |
| Schliessen | Sheet und Quellenkarte laufen denselben Weg zurück, in zwei Dritteln der Zeit. |
| Antwort | Der Button zeigt «läuft» und «bestätigt» am Ort der Handlung. |
| Zeichen | Zeichenaufbau einmal, sobald das Zeichen zu sehen ist. Lichtlauf dauernd, wo er gesetzt ist. Die Form steht. |
| Immer | Nur die Atmung: 3,4 s Raum geben, 4,4 s zur Ruhe, höchstens 7,5 % Radius. Im Zeichen dazu der Lichtlauf, wo gesetzt. |

Alle Auftritte setzen ihre Endwerte ausdrücklich, und der Versteck-Guard wird vor dem Anlegen gelöst; vorher sprangen manche Blöcke am Ende schlagartig auf. Das festgehaltene Kapitel wird zuerst angelegt, damit alle Auftritte dahinter zur richtigen Stelle auslösen, und jeder einmalige Auftritt gilt bis zum Seitenende, damit auch schnelles Scrollen oder ein Sprung über die Navigation ihn auslöst. Ohne Festhalten (Telefon) baut sich nur das Rad auf, Lesebereich und Liste sind sofort da.

Kein Auftritt versteckt Inhalte. Ohne JavaScript und bei reduzierter Bewegung ist alles sofort sichtbar, spätestens nach 5 s auch dann, wenn GSAP nicht lädt. Was beim Laden schon im Bild ist, erscheint ohne Auftritt. Versteckt wird nur über die Deckkraft, damit alles per Tab erreichbar bleibt. Tastatur, Fokus auf etwas noch Unsichtbarem und die globale Pause beenden alle Auftritte und lösen das festgehaltene Kapitel. Titel werden erst nach dem Laden der Schriften gesplittet, Screenreader lesen den ganzen Satz.

## Interaktion und Bedienbarkeit

- Alles läuft lokal, ohne Backend und ohne externe Anfragen. Unter `file://` lädt `assets/boot.js` eingebettete Schriften.
- Farbwerte und Tokens sind kopierbar; der Tokenblock liest die Werte live aus `tokens.css`.
- Tabs, Rad-Liste und Umfeld (Kreise und Karte) sind per Tastatur bedienbar und für assistive Technik ausgezeichnet.
- 44-px-Ziele, sichtbarer Fokus, bewegungsreduzierte Darstellung.
- Die Prüfcheckliste ist eine Arbeitshilfe und keine automatische Freigabe.
