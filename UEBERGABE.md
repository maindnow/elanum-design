# Übergabe: ELANUM Gestaltungsatlas

Stand 16. November 2026. Auf `main` steht **Atlas 4.13** (PR #22 «Feinschliff» und PR #23 sind gemergt, Paket `@elanum/design` 4.13.0). Mit PR #24 kommt **Atlas 5.0** (Paket 5.0.0): Beziehungsraum und Umfeld sind neu gefasst, das ist eine Hauptversion, und die App muss ihre zwei Bausteine nachbauen (Abschnitt «Atlas 5.0 in die App holen»). Die Tags `v4.11.0`, `v4.11.1` und `v4.13.0` fehlen noch, der letzte Tag ist `v4.10.0`; `v4.12.0` gibt es als eigenen Stand auf `main` nicht. Die App nutzt `v4.10.0`. Mergen darf nur Tris (`CLAUDE.md`, «Mergen»). Diese Datei fasst alles zusammen, was es zum Weiterarbeiten braucht, auch Entscheide, die bisher nur in Gesprächen mit Claude standen.

**Nachtrag 21. November 2026:** Atlas 5.0 ist auf `main`, der Tag `v5.0.0` steht, die App zeigt in soulresonance.ch PR #81 darauf. Der Entwurfs-PR «Resonanzrad, zweite Runde» bringt **Atlas 5.1** (Paket 5.1.0): Kernsatz am Telefon, «Mehr lesen», zugeklappte Liste, Blatt in zwei Stufen, kleinere Mitte, Tablet hochkant. Nach dem Merge der Tag `v5.1.0`. Offen dazu: `DESIGN-NOTES.md`, „Offen nach 5.1“.

**Nachtrag 21. November 2026, abends:** Der Entwurfs-PR «Heute, Für deinen Tag» bringt **5.1.1** (Patch): der App-Screen Heute folgt der Überarbeitung in soulresonance.ch (Stimme allein in der Hauptfläche, Chips bleiben, Hinweis «Deutung», Karte «Für deinen Tag», «Heute aus deiner Woche» in der Wochenkarte). Nach dem Merge der Tag `v5.1.1`. Offen dazu: `DESIGN-NOTES.md`, „Offen nach 5.1.1“.

## In zwei Minuten

- **Was:** der interaktive Gestaltungsatlas der App ELANUM (Stil Soft 3D Relief). Er ist die einzige Designquelle der App: Tokens, Bausteine, Zeichen, Glossar und acht App-Screens.
- **Wo:** dieses Repository `github.com/maindnow/elanum-design`. Die App liegt in `maindnow/soulresonance.ch` und bindet den Atlas als Paket über einen Tag ein (siehe README, „In der App verwenden“).
- **Ohne Build:** reines HTML, CSS und JavaScript. Zum Ansehen genügt `python3 tools/serve.py` im Repo-Ordner, dann http://127.0.0.1:4173.
- **Verbindlich:** die Begriffe im Glossar (`assets/glossar.js`, daraus `GLOSSAR.md`) und die Werte in `tokens.css`. Begründungen stehen in `DESIGN-NOTES.md`, Arbeitsregeln in `CLAUDE.md`.

## Weitermachen

**Mit Claude Code:** das Repository in einer neuen Session öffnen oder klonen. `CLAUDE.md` wird automatisch gelesen und verweist hierher. Am Anfang schreiben: „Lies UEBERGABE.md und mach dort weiter.“

**Lokal ansehen (Mac, zsh):** diesen Block ins Terminal kopieren. Er klont das Repo nach `~/elanum-design`, falls es fehlt, beendet einen alten Server, setzt den Ordner genau auf den Stand von `main` und öffnet den Atlas. Beenden mit Ctrl+C.

```bash
cd ~
[ -d elanum-design ] || git clone https://github.com/maindnow/elanum-design.git
cd ~/elanum-design
git merge --abort 2>/dev/null
lsof -ti:4173 | xargs kill -9 2>/dev/null
git fetch origin
git reset --hard
git checkout -B main origin/main
git log --oneline -1
(sleep 1 && open http://127.0.0.1:4173) & python3 tools/serve.py
```

## Offen

1. **Tags setzen:** `v4.11.0` auf den Merge von PR #18 (`2f6776f`), `v4.11.1` auf den Merge von PR #21 (`b2e2114`), `v4.13.0` nach dem Merge des PR «Feinschliff», je mit der Vorlage in `CLAUDE.md`. Danach die App auf den neuesten Tag anheben (Abschnitt „In der App“).
1b. **Reife 4.13, offene Entscheide:** Abstände der Bausteine ins 4er-Raster (170 Stellen), Lesespalte 62ch oder 56ch, Karte «Wo es schwingt» hell wie in der App (L36), Sheet am Computer in der Mitte wie in der App (L52). Liste in `DESIGN-NOTES.md`, „Reife (4.13)“.
1a. **Feinschliff 4.12, offene Punkte:** grösste Schrift noch mehrfach auf Ich und Aktivitäten, feste Farben in den Skripten der Bausteine, Wörter am Button ohne Glossar-Freigabe. Liste in `DESIGN-NOTES.md`, „Feinschliff (4.12)“.
1. **PR #24 (Atlas 5.0):** Tris prüft und mergt, danach der Tag `v5.0.0` mit der Vorlage in `CLAUDE.md`. Die App springt von `v4.10.0` direkt auf `v5.0.0`, sofern sie 4.13 nicht vorher einzeln holt.
1. **Freigaben von Chris zu 5.0, noch offen:** der Wortlaut der Glossar-Einträge Umfeld, Art, Beziehungsraum, Feld, «Nähe · Resonanz · Freiraum» und Atmung (in `assets/glossar.js` eingetragen, «Verbindung» ist gestrichen); die neuen Masse in `DESIGN-NOTES.md`, Abschnitt Bausteine.
1. **Nähe in der App braucht einen eigenen Wert je Mensch.** Heute leitet die App die Nähe fest aus der Art ab (`NAEHE_JE_KATEGORIE` in `src/lib/components/elanum/umfeldGeometrie.js`: Partnerschaft 100, Familie 70, Freundschaft und Innerer Weg 40, Arbeit 10). Im Umfeld 5.0 sagt schon der Winkel die Art. Mit der festen Ableitung stünden alle Menschen einer Gruppe gleich weit weg, und der Abstand sagte nichts Eigenes mehr. Entscheid Chris und Tris: Woher kommt die Nähe (vom Menschen selbst gesetzt, oder aus der Rechnung)?
1. **Freiraum in der App:** Der Beziehungsraum zeigt ihn als helle Fläche um jede Person. Die App führt den Wert nicht und setzt den Startwert 34. Entweder liefert die App einen Wert, oder sie blendet das Wort «Freiraum» aus (`data-skala="aus"` und eigene Zeile).
1. **Muster `.person` in `components/app/app.css`:** zeichnet Menschen noch als Kreis mit Öffnung unten. Nicht Teil von 5.0, bei Gelegenheit angleichen.
2. **Glossar, Namen aus dem Fliesstext (4.11):** Fliesstext, Aussage, Quelle, Quellenkarte. Noch ohne Freigabe.
3. **Abgleich mit dem Muster M1 „Herkunft je Satz“ der App** (`src/lib/components/signatur/AbsatzMitHerkunft.svelte` in `maindnow/soulresonance.ch`, gelesen am 14.10.2026). Gleich sind das Zeichen am Satzende als Knopf, die Markierung beim Antippen, Esc und Fokus zurück. Anders sind drei Dinge:
   - Im Fliesstext ist die Aussage auch in Ruhe leise unterstrichen, in M1 erst beim Antippen.
   - Die Herleitung steht hier in der Quellenkarte, in M1 als Aufklapper unter dem Absatz.
   - Die Farben folgen hier den drei Bereichen des Resonanzrads, in M1 hat jedes System eine eigene Quellenfarbe.

   Empfehlung: den Fliesstext als Vorgabe nehmen. In der App entscheidet der Founder über Muster, eine neue Form geht ihm vorher als Frage mit Bild zu (`.planning/MUSTER-VERBINDLICH.md`).
4. **Wort „Resonanzraum“** im Text „Dein erstes Muster“: kein Glossarbegriff, liegt nah an „Beziehungsraum“. Steht so, wie Chris es geschrieben hat.
5. **Leitsatz nennt noch die alten Phasen:** „Mit ELANUM findest du zu dir, zueinander und miteinander. Resonanz zeigt den Weg.“ steht im Glossar, im Einstieg des Atlas und auf dem App-Screen Ankommen. Er blieb bewusst stehen, entschieden ist noch nichts. Vorschlag von Claude: „Mit ELANUM findest du Resonanz: in dir, in der Liebe und mit anderen.“
6. **Partner oder Partnerschaft:** Resonanz sagt „zu deinem Partner“ (so von Chris formuliert), der Resonanzkosmos „in deiner Partnerschaft“. Beides ist so freigegeben. „Partner“ schliesst Partnerinnen sprachlich aus. Bei Gelegenheit angleichen, falls gewünscht.
7. **Namen in der App noch ohne Freigabe im Glossar:** Entdecken, Likes, Chats, Profil, Aktivitäten, Events, Meine, Menü, dazu App-Rahmen, Leiste, Schiene, Seitenleiste, Sheet, Hauptfläche, Tagesbogen, „Eine Frage für heute“, „Resonanz zeigen“. Liste in `DESIGN-NOTES.md`, „Offene Freigaben“.
8. **Kapitel Haltung im Atlas:** Bei Datingkosmos und Erlebniskosmos steht unter „Darin“ noch „folgt“, obwohl es seit 4.10 die Screens Entdecken, Chats und Aktivitäten gibt. Beim nächsten Atlas-Stand nachführen.
9. **Alter Branch `codex/elanum-styleguide-2026-09-18`:** zwei Commits vom 18. September, älter als Stand 4.4 und durch alles Spätere ersetzt. Kann gelöscht werden. PR #20 (Übergabe: App-Seite) ist in PR #18 enthalten, alle anderen `claude/*`-Branches sind in `main`.
10. **Rosa als Token (Lücke L1/L2 der App):** Die App nutzt für „gemeinsam“ (Paar-Ansichten, Personenfarben) den Wert `#B5387F` (4,86:1 auf Papier). Das Paket hat dafür kein Token (gemessen am 4. November 2026: kein Treffer in `tokens.css`). Vorschlag: als Token ins Paket (Minor), danach in der App ersetzen. Entscheid Chris.

## In der App (`maindnow/soulresonance.ch`)

- **Stand:** Die App pinnt `github:maindnow/elanum-design#v4.10.0` (gemessen am 16. November 2026 auf `main`). ELANUM ist dort seit dem 20. Oktober 2026 live.
- **Zweig von Chris:** `chris-design` (seit 11. November 2026, vorher `chris`). Chris committet nie auf `main`, jede Änderung geht als Entwurfs-PR, das Release macht Tris. Anleitung `docs/INFO-CHRIS.md`, Abläufe `docs/RUNBOOK-LOKAL.md`, dein Stand `.planning/stand/chris.md`.
- **Design-Lücken:** `docs/elanum-migration.md` führt 75 Lücken L1 bis L75 zwischen App und Paket. Geschlossen werden sie hier im Paket, nie mit lokalen Werten in der App.
- **Neue Paketversion in die App holen:**
    1. Hier mergen und den Tag setzen (`CLAUDE.md`, „Versionen“).
    2. Im Hauptrepo auf `chris-design` die Zeile `@elanum/design` in `package.json` auf den neuen Tag ändern, dann `npm install`.
    3. `tests/design/elanum-theme.test.js` prüft den Tag, die Ladereihenfolge und dass jedes genannte Token im Paket existiert. Ein entferntes oder umbenanntes Token (Major) fällt dort auf.
    4. Entwurfs-PR mit den angepassten Seiten und Screenshots.
### Atlas 5.0 in die App holen (für Tris)

Gelesen im App-Repo am 16. November 2026 (`main`, Commit `4f9662fc`). Die App baut Umfeld und Beziehungsraum als Svelte-Bausteine nach und übernimmt vom Paket nur das Stylesheet (Entscheid 16 in `docs/elanum-migration.md`). Darum reicht es nicht, den Tag anzuheben.

**Was bricht, sobald der Tag auf `v5.0.0` steht**

- `tests/design/elanum-umfeld-bausteine.test.js` schlägt absichtlich fehl: Er sucht im Quelltext des Pakets die alten Masse (Layouts 720 × 600 und 400 × 560, Öffnung 16°, Strich `1.4 + p.resonance * .022`, Radius 128, Zentren `172 + 0.4 × Nähe`, Umschalten unter 560 px).
- `beziehungsraum.css`: `.relationship-label` steht neu unter den Personen (`top:46.944cqw`, `.relationship-frame` ist ein Container), die Regel für `[data-bridge]` gibt es nicht mehr.
- `umfeld.css`: Entfernt sind `.umfeld__bridge`, `.umfeld__bridges`, `.umfeld__nodes`, `.umfeld__list`, `.umfeld__person`, `.umfeld__person-name`, `.umfeld__person-state`, `.umfeld__detail`, `.umfeld__side`. `Umfeld.svelte` nutzt alle davon.

**Was neu zu bauen ist**

| Datei in der App | Neu |
|---|---|
| `src/lib/components/elanum/umfeldGeometrie.js` | Geometrie aus `components/beziehungsraum/beziehungsraum.js` (Konstanten `CY`, `PERSON`, `ROOM`, `FIELD`, `GAP`, Funktion `draw`) und `components/umfeld/umfeld.js` (Layouts `wide`, `all`, `kind`, Gruppen nach Art, Bögen, Ringe). Offene Kontur, Verbindung und Knoten entfallen |
| `Beziehungsraum.svelte` | Zwei Personenkreise (`.relief-disc`, `[data-contour]`), je eine helle Fläche `[data-room]` mit `clip-path` an der Mitte, drei Feldlinien `[data-field]`, Namen unter den Personen, darunter `.relationship-scale` (`dl` mit Nähe, Resonanz, Freiraum) |
| `Umfeld.svelte` | Geschlossene Kreise, Ringe `.umfeld__ring` statt Linie zur Mitte, Bögen `.umfeld__arc` mit Wort `.umfeld__kind`, Kreis-Knöpfe `.umfeld__name.umfeld__pick`, Panel `.umfeld__panel` (Pfeile mit Name, Pillen, Notiz, Knopf) statt Liste, auf dem Telefon Filter `.umfeld__filter` und Gruppen-Knöpfe `.umfeld__group` |
| `tests/design/elanum-umfeld-bausteine.test.js` | Wächter auf die neuen Masse und Klassen umschreiben |

**Wörter und Stufen:** `ElanumBeziehung.SCALE` und `ElanumBeziehung.words()` in `beziehungsraum.js` tragen die Stufen (Nähe: weit, nah, sehr nah; Resonanz: keine, leise, spürbar, stark; Freiraum: klein, offen, weit offen) mit ihren Grenzen. Die Resonanz-Stufen der App (1 bis 5, mal 20) fallen so auf null bis drei Linien: 0 keine, 20 eine, 40 und 60 zwei, 80 und 100 drei.

**Arten:** Das Umfeld nimmt die fünf Arten der App (`partner`, `family`, `friend`, `spiritual`, `work`) mit ihren Wörtern Partnerschaft, Familie, Freundschaft, Innerer Weg, Arbeit, in dieser Reihenfolge im Uhrzeigersinn. Das Skript des Pakets lässt sich jetzt auch mit eigenen Daten montieren: `ElanumUmfeld.mount(root, { link, heading, people, kinds })`, siehe README.

**Regeln der App, die im Paket nicht stehen und beim Nachbau neu zu entscheiden sind** (alle aus `umfeldGeometrie.js`): Foto im Kreis mit Name darunter; gestrichelter Kreis ohne Rechnung; Kinder ohne Stufe mit einheitlicher Linie (neu: Wie viele Linien?); viele Menschen rücken nach aussen; der Kreis als Zeigerziel (Ticket 267) und die Fokusführung über die Liste (die Liste gibt es im Paket nicht mehr, die Kreise sind Knöpfe, die Pfeile im Panel wechseln). Das Panel ist ein neues Bedienmuster: nach `.planning/MUSTER-VERBINDLICH.md` geht es dem Founder vorher als Frage mit Bild zu. Bilder liegen unter `docs/pruefung/` in diesem Repo und im PR #24.

**Geprüft im Atlas:** 320 bis 1440 px, mit und ohne reduzierte Bewegung, kein waagrechter Überlauf, keine Schrift unter 15 px, keine Konsolenfehler. Nicht geprüft: Wischen mit dem Finger auf einem echten Telefon (nur simuliert), Vorleser.

- **Geschichte:** Das Paket entstand am 13. Oktober 2026 mit 4.8.0 (PR #15). Am 14. Oktober folgte Etappe 1 der Umstellung in der App (`maindnow/soulresonance.ch` PR #6, Konzept `.planning/KONZEPT-ELANUM-UMSTELLUNG-2026-10-13.md`). Eine Zusammenfassung für den Owner vom 14. Oktober lag nur als Claude-Docs-Dokument im Konto von Chris; sie ist überholt, die Fakten stehen hier und in `.planning/stand/chris.md`.

## Versionen bis heute

| Stand | Inhalt |
|---|---|
| 4.4 | Freigegebener Stand (`abb9939`), Kurvenkorrektur des Zeichens |
| 4.5 | Ruhe, fünf Schriftstufen, Bereichsfarben des Resonanzrads, echte Bausteine, erklärende Bewegung, Glossar, Zeichen als Kreiskonstruktion im Goldenen Schnitt |
| 4.6 | Phasen heissen Kosmen: Resonanzkosmos, Datingkosmos, Erlebniskosmos |
| 4.7 | Resonanz neu gefasst |
| 4.8 | „Sterne & Ursprung“ statt „Grundtöne“ (Code `sterne`), Resonanz ohne „Das Leitthema:“, Server ohne Cache. Paket 4.8.0, Tag `v4.8.0` |
| 4.9 | Das Zeichen bewegt sich, seine Form steht: Zeichenaufbau und Lichtlauf, Baustein `components/zeichen/`. Tag `v4.9.0` |
| 4.10 | ELANUM als App, mobile zuerst: App-Rahmen `components/app/`, acht Screens, Kapitel „In der App“. Tag `v4.10.0` |
| 4.11 | Fliesstext: Aussagen mit ihrer Quelle, Quellenkarte „Woher kommt diese Aussage?“, Baustein `components/fliesstext/`, im Atlas und auf Heute. PR #18 gemergt, Tag `v4.11.0` fehlt noch |
| 4.11.1 | Das Resonanzrad steht still. PR #21 gemergt, Tag `v4.11.1` fehlt noch |
| 4.12 | Feinschliff: zwei Kurven und fünf Dauern als Tokens, ein Ort im Atemtakt je Screen, Schliessen mit Übergang, Button mit «läuft» und «bestätigt», jeder Wert mit Namen, `tools/token-check.js`. Kein eigener Tag, geht in 4.13 auf |
| 4.13 | Reife: Schrift in rem, Abstände, Trefferfläche, Fokus und Ebenen als Tokens, Kante der Felder, ausgeglichener Umbruch, Antwort auf Druck überall, Kontrastmodus des Systems, `.button--compact`, `.button--danger`, `tokens.json`, `tools/regel-messung.js`. Schliesst die Lücken L7, L8, L9, L11, L35, L41, L53, L55 der App. Tag `v4.13.0` nach dem Merge |
| 5.0 | Beziehungsraum und Umfeld neu, ohne Regler lesbar: Abstand, Platz um jeden, Feld um beide; Umfeld in Gruppen nach Art, Linien um den Kreis, Karte mit Pfeilen, Filter auf dem Telefon. Enthält 4.11.2 (Seitentitel bei 320 px). PR #24, Tag `v5.0.0` nach dem Merge |

Das Glossar trägt die Version 5.0.

## Entscheide zur Benennung (12. Oktober 2026, mit Chris)

Freigegeben und umgesetzt:

| Begriff | Satz | Darin |
|---|---|---|
| **Resonanzkosmos** | Resonanz in dir, in deiner Partnerschaft und in deinem Umfeld. | Resonanzrad, Heute, Weg, Umfeld, Beziehungsraum. Der Einstieg. |
| **Datingkosmos** | Finde die eine Resonanz. | nur Dating |
| **Erlebniskosmos** | Resoniere mit anderen. | Events, unabhängig vom Dating |
| **Resonanz** | Es schwingt zu dir, zu deinem Partner oder deinem Umfeld. | |
| **Sterne & Ursprung** | Bereich in Violett: Astrologie, Numerologie, Human Design. Alle drei gehen von deiner Geburt aus. | Code `sterne`, Tokens `--sterne-*` |

- Die drei heissen **Kosmen**, nicht Phasen: Datingkosmos und Erlebniskosmos stehen gleichwertig neben dem Resonanzkosmos, es gibt keine feste Reihenfolge. Namen immer in einem Wort, wie Resonanzrad.
- Der Beziehungsraum gehört zum Resonanzkosmos (Partnerschaft), nicht zum Dating.

Verworfen, damit es nicht wieder vorgeschlagen wird:

- Soul Kosmos, Dating Kosmos, Event Kosmos: passten nicht; Englisch, zu eng.
- Ich-Kosmos, Du-Kosmos, Wir-Kosmos: „Ich“ passt nicht, im ersten Kosmos geht es um dich und andere.
- „Finde die gegenseitige Resonanz“: „gegen“ klingt negativ.
- „Grosse Resonanz“: heisst im Deutschen „viel Echo“, also Beliebtheit.
- „Erlebe Resonanz mit anderen“: Chris wählte „Resoniere mit anderen“.
- Für den violetten Bereich: „Grundtöne“ sagt nichts aus. „Anlage & Ursprung“ und „Geburt & Anlage“: „Anlage“ passt nicht. „Herkunft“: klingt nach Familie oder Nationalität.

Die weiteren Entscheide zu Zeichen, Bewegung und App (zum Beispiel: Farbatem verworfen, Zeichen in der App in Spektrum, Dating ohne Prozent-Score) stehen mit Datum und Begründung in `DESIGN-NOTES.md`.

## Arbeitsweise

- **Sprache:** Deutsch, Schweizer Schreibweise („ss“ statt „ß“). Begriffe genau wie im Glossar.
- **Ablauf:** Claude arbeitet auf einem Branch `claude/…` und eröffnet einen PR als Entwurf mit einem Abschnitt «Für Tris». Chris prüft lokal mit dem Block aus `CLAUDE.md`. **Mergen darf nur Tris** (Chris, 15.11.2026), weder Chris noch Claude mergen. Nach dem Merge den Block für `main` und, bei neuer Paketversion, den Block für den Tag. PR #18 und #21 hat Claude am 15.11.2026 noch auf Chris' Wort gemergt, bevor diese Regel feststand.
- **Glossar ändern:** nur mit Freigabe von Chris und mit neuer Atlas-Version. Immer `assets/glossar.js` bearbeiten, dann `node tools/glossar-md.js`. `GLOSSAR.md` nie von Hand.
- **Versionen und Tags:** Regeln in `CLAUDE.md`, „Versionen“. Die App verlässt sich auf die Tags: nie verschieben oder löschen.
- **Vor jedem Push:** die Prüfungen aus `CLAUDE.md`, dazu der Atlas im Browser (Desktop, Tablet, Telefon, ohne Konsolenfehler).
- **Lehre aus der Arbeit:** Chris sah lange einen alten Stand, weil sein lokaler Ordner nicht nachgezogen war. Deshalb gibt es `tools/serve.py` (ohne Browser-Cache), und nach jedem Merge gehört der Block für `main` in die Antwort.

## Was gebaut ist

**5.0 Beziehungsraum und Umfeld neu** (PR #24): Beide Bausteine sind ohne Regler lesbar, jeder Wert hat ein eigenes Zeichen.
- Beziehungsraum (`components/beziehungsraum/`): Nähe ist der Abstand zweier Personenkreise, Freiraum die helle Fläche um jeden, Resonanz das Feld um beide (null bis drei Linien im Spektrum). Namen stehen unter den Personen, darunter die drei Werte als Wort.
- Umfeld (`components/umfeld/`): Menschen derselben Art stehen beieinander, ein Bogen mit Wort fasst jede Gruppe. Abstand ist die Nähe, Linien um den Kreis sind die Resonanz. Kreise sind Knöpfe; ein Panel zeigt Name, Pillen (Art, Nähe, Resonanz), Notiz und «Beziehungsraum öffnen», mit Pfeilen und zum Ziehen.
- Auf dem Telefon (unter 520 px Bühnenbreite) wählt man über dem Bild «Alle» oder eine Art: «Alle» zeigt die Gruppen als Punkte, eine Art ihre Menschen gross.
- Was verworfen wurde und warum, steht in DESIGN-NOTES, Abschnitt Bausteine. Bilder unter `docs/pruefung/`.

**4.11 Fliesstext** (`components/fliesstext/`, PR #18): Ein Text, der zu einem Menschen spricht und bei jeder Kernaussage zeigt, woher sie kommt.
- Aussage leise unterstrichen in der Bereichsfarbe, am Satzende ein runder Knopf je Element mit dessen Icon, Tippfläche 44 px.
- Quellenkarte „Woher kommt diese Aussage?“ als `<dialog>`: Telefon von unten, sonst schwebend; Auswahl bei mehreren Quellen; die Seite rollt die Aussage über die Karte.
- Zwei Stufen: Stimme (Yrsa) und leise (Albert Sans).
- Eingebunden auf der eigenen Seite („Dein erstes Muster“), im Atlas (Kapitel Sprache, Karte bei den Bausteinen) und in der App auf Heute.
- API und Markup im [README](README.md), Abschnitt Fliesstext.
- Der Originalentwurf liegt unter [docs/entwuerfe/2026-10-14-fliesstext-entwurf.html](docs/entwuerfe/2026-10-14-fliesstext-entwurf.html). Was beim Übersetzen geändert wurde und warum, steht in DESIGN-NOTES, Abschnitt „Fliesstext (4.11)“.
- Nebenbei: `.element-chip` liegt jetzt in `base.css`. Die Ansicht-Auswahl im Kapitel „In der App“ bricht unter 360 px um statt überzulaufen.

**4.10 App-Rahmen** (`components/app/`, auf `main`): Navigation in drei Formen (Leiste unten bis 599 px, Schiene bis 1023 px, Seitenleiste ab 1024 px), Kopf, Sheet, Hauptfläche in weichem Licht, Tagesbogen, Frage zum Umdrehen. Acht Screens als echte Seiten: Heute, Ich, Umfeld, Weg, Entdecken, Chats, Aktivitäten, Ankommen, dazu ein Platzhalter für Ziele ohne eigene Vorschau. Im Atlas das Kapitel „In der App“ mit Gerätevorschau (Telefon steuert Desktop, freie Breite 320 bis 1440 px).

**4.9 Zeichen in Bewegung** (`components/zeichen/`, auf `main`): Zeichenaufbau (einmal) und Lichtlauf (dauernd), die Form bewegt sich nie.

Ältere Stände: README, Abschnitt „Stand und Historie“.

## Was gilt (aus Chris’ Rückmeldungen)

- **Mobile zuerst und voll responsiv.** Jede Fläche auf 320, 390, 834, 1280 und 1440 px prüfen.
- **Das Zeichen ist nie Ink**, immer Spektrum, auch auf den Seiten der Bausteine.
- **Das bewegte Zeichen bleibt:** Lichtlauf in Navigation und Kopf, Zeichenaufbau beim ersten Start.
- **Auswahlen sind Segmentleisten** wie im Atlas (`.segmented`), keine eigenen Knopfreihen.
- **Weich, aber einladend:** helle Hauptflächen in weichem Licht, Farbe der Bereiche, Glührand und sanfte Bewegung. Es soll Freude und Neugier wecken, mit mehr Führung und Feinheit.
- **Designregeln:** fünf Schriftstufen, nichts unter 15 px, kein Kursiv, keine Versalien als Grössenersatz. Das Markenspektrum nur für Zeichen, Verbindung und Glührand, nie als Fläche. Raum statt Rahmen.

## Aufträge bisher, wörtlich

14.10.2026:
1. „Wir brauchen basierend auf der aktuellen Website ein paar Mockups und Beispiele zur Integration im Atlas, damit die App eine Grundlage hat. Sowohl Mobile als auch Desktop. Ich will zukünftig Mobile First und fully Reponsive. Analysiere das bestehende Design und recherchiere vergleichbare Plattformen, sowie neue und moderne Konzepte. Implementiere diese, Loope mit der NUtzung und bring das beste ERgebnis hervor.“ → App-Rahmen und Screens, 4.10.
2. „Wichtig, das Logo darf nicht die Ink Version sein. Es wirkt aktuell alles noch sehr fade. Es braucht mehr Führung und mehr Feinfüligkeit, muss sich aber geil anfühlen. Weisst du, was ich meine?“ → Spektrum überall, mehr Führung.
3. „Die Anordnung der BUttons sieht scheisse aus und entspricht nicht dem Design. Bitte anpassen. Gesamthaft gefällt mir das Erscheinungsbild noch zu wenig. Es soll weich sein, aber animieren zu nutzen. Freude machen, Neugierig machen. Was würdest du als Brand und UX Experte sagen?“ → eine Segmentleiste, „Weiches Licht“.
4. „gut, ich habe noch einen merge mit Logo ANpassung gemacht, führ alles zusammen.“ → Zeichen in Bewegung (4.9) und App-Rahmen zusammengeführt.
5. „Ich will dass das animierte Logo aus dem anderen merge bleibt.“ → Lichtlauf und Zeichenaufbau in der App, PR #16 gemergt, Tags v4.9.0 und v4.10.0.
6. Entwurf `elanum-flowtext.html` mit „Bitte als Element integrieren und beschreiben.“ → Baustein Fliesstext, 4.11, PR #18.

04.11.2026:
7. „Ich muss den Account schliessen, commite alles in das Repo mit allen Informationen für eine Übergabe, sodass ich beim nächsten Repo Kloning alles habe.“ → diese Datei.

## Prüfen und neue Bausteine

- **Im Browser prüfen** (mit Playwright, mit und ohne reduzierte Bewegung): kein horizontaler Überlauf, kein sichtbarer Text unter 15 px, keine Konsolenfehler, Bedienung mit Tastatur, Esc und Fokus zurück. Bekannter Fehlalarm: `<small>Konto</small>` in der Seitenleiste ist unter 1024 px ausgeblendet und wirkt in einer reinen Schriftgrössen-Suche wie 12,5 px.
- **Neuer Baustein:** eigener Ordner `components/<name>/` mit `<name>.css`, `<name>.js` (klassisches Skript mit `mount()`, läuft auch unter `file://`) und einer Seite `index.html`. Beide Dateien in `files` der `package.json`, Version als Minor anheben, „Gestaltungsatlas X.Y“ in allen Seiten nachziehen, Karte im Kapitel Bausteine, API im README, Begründung in DESIGN-NOTES.

## Wo was liegt

| Datei oder Ordner | Inhalt |
|---|---|
| `index.html`, `style.css`, `app.js` | Der Atlas mit allen Kapiteln |
| `tokens.css`, `base.css` | Alle Werte und die gemeinsamen Grundlagen |
| `components/` | Bausteine als eigene Seiten: Resonanzrad, Umfeld, Beziehungsraum, Weg, Zeichen, Fliesstext, App (mit den acht Screens) |
| `assets/` | Zeichen (SVG), Schriften, Bewegung (`motion.js`, GSAP), Glossar |
| `tools/` | Zeichen erzeugen, Schriften einbetten, Glossar erzeugen, Screenshots, lokaler Server |
| `docs/screenshots/` | Bilder für das README |
| `README.md` | Überblick, Aufbau, Verwendung in der App, Prüfen |
| `DESIGN-NOTES.md` | Entscheide und Begründungen, nach Version |
| `GLOSSAR.md` | Alle verbindlichen Begriffe und was nicht mehr verwendet wird |
| `CLAUDE.md` | Arbeitsregeln, Befehlsvorlagen, Versionen |

## Bezug zur App

- Repository `maindnow/soulresonance.ch`, eigene Regeln in dessen `CLAUDE.md` und `AGENTS.md`. Muster der App: `.planning/MUSTER-VERBINDLICH.md`. Ein früherer Fliesstext-Entwurf der App liegt dort unter `.planning/bausteine/flowtext-2026-09-18/`.
- Grundlage der App-Screens im Atlas war die App mit Stand 14.10.2026 (siehe DESIGN-NOTES, „In der App (4.10)“, mit Recherche zu vergleichbaren Plattformen).
