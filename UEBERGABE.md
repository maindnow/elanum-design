# Übergabe ELANUM-Gestaltungsatlas

Stand: 4. November 2026. Geschrieben am Ende der Arbeit vom 14. Oktober 2026, damit nach einem neuen Klonen nichts fehlt. Wer hier weiterarbeitet (Mensch oder Agent), liest zuerst diese Datei, dann [CLAUDE.md](CLAUDE.md), dann [DESIGN-NOTES.md](DESIGN-NOTES.md).

## Kurz

Dieses Repository ist die einzige Designquelle der App ELANUM (`maindnow/soulresonance.ch`). Die App bindet es als Paket `@elanum/design` über einen Tag ein. Auf `main` steht Atlas 4.10. Atlas 4.11 mit dem neuen Baustein Fliesstext und dieser Übergabe liegt im Zweig `claude/kind-sagan-jkyhkj` und wartet als PR #18 auf den Merge.

## Wo was steht

| Was | Stand |
| --- | --- |
| `main` | Atlas 4.10.0, Commit `ef7c18d`, Tag `v4.10.0` |
| `claude/kind-sagan-jkyhkj` | Atlas 4.11.0: Fliesstext, diese Übergabe, Originalentwurf |
| PR #18 | https://github.com/maindnow/elanum-design/pull/18, Entwurf, offen, am 14.10.2026 ohne Konflikt, ohne Kommentare, ohne Prüfungen |
| Tags auf GitHub | `v4.8.0`, `v4.9.0`, `v4.10.0`. `v4.11.0` fehlt noch und kommt erst nach dem Merge |
| Andere Zweige | Alle in `main` enthalten, ausser `codex/elanum-styleguide-2026-09-18` (zwei alte Commits vom 18.09.2026, nicht geprüft, vermutlich überholt) |

Ohne Merge bekommt man den ganzen Stand mit `git clone --branch claude/kind-sagan-jkyhkj https://github.com/maindnow/elanum-design.git`.

## Als Nächstes, in dieser Reihenfolge

1. **PR #18 mergen.** Auf GitHub den PR öffnen, „Ready for review“, dann „Merge pull request“. Erst danach steht 4.11 und diese Übergabe auf `main`.
2. **Tag `v4.11.0` setzen.** Block unten. Er setzt den Tag nur, wenn `main` schon Version 4.11.0 trägt, und zeigt danach `main` im Browser.
3. **Offene Entscheide** unten treffen (Glossar, Abgleich mit der App).
4. **In der App** das Paket auf `"@elanum/design": "github:maindnow/elanum-design#v4.11.0"` heben, sobald der Fliesstext dort gebraucht wird.

Tag nach dem Merge (aus CLAUDE.md, mit 4.11.0 ausgefüllt):

```bash
cd ~
[ -d elanum-design ] || git clone https://github.com/maindnow/elanum-design.git
cd ~/elanum-design
git merge --abort 2>/dev/null
lsof -ti:4173 | xargs kill -9 2>/dev/null
git fetch origin --tags --force
git reset --hard
git checkout -B main origin/main
git log --oneline -1
if git ls-remote --exit-code --tags origin refs/tags/v4.11.0 >/dev/null; then echo "Tag v4.11.0 ist schon auf GitHub."; elif grep -q '"version": "4.11.0"' package.json; then git tag -f v4.11.0 && git push origin v4.11.0; else echo "STOPP: Auf main steht noch nicht Version 4.11.0. Zuerst den PR mergen, dann diesen Block nochmals einfügen."; fi
git ls-remote --tags origin v4.11.0
(sleep 1 && open http://127.0.0.1:4173) & python3 tools/serve.py
```

Der Block öffnet den Atlas auf dem Stand von `main`. Beenden mit Ctrl+C.

## Offene Entscheide (nur Chris)

Das Glossar (`assets/glossar.js`, `GLOSSAR.md`) ist bewusst unverändert. Neue Begriffe kommen nur mit Freigabe und einer neuen Atlas-Version hinein. Danach `node tools/glossar-md.js` ausführen.

1. **Glossar, Namen aus der App (seit 4.10):** die Ziele Entdecken, Likes, Chats, Profil, Aktivitäten, Events, Meine und Menü (aus der heutigen App übernommen), dazu App-Rahmen, Leiste, Schiene, Seitenleiste, Sheet, Hauptfläche, Tagesbogen, „Eine Frage für heute“ und „Resonanz zeigen“.
2. **Glossar, Namen aus dem Fliesstext (4.11):** Fliesstext, Aussage, Quelle, Quellenkarte.
3. **Abgleich mit dem Muster M1 „Herkunft je Satz“ der App** (`src/lib/components/signatur/AbsatzMitHerkunft.svelte` in `maindnow/soulresonance.ch`, gelesen am 14.10.2026). Gleich sind das Zeichen am Satzende als Knopf, die Markierung beim Antippen, Esc und Fokus zurück. Anders sind drei Dinge:
   - Im Fliesstext ist die Aussage auch in Ruhe leise unterstrichen, in M1 erst beim Antippen.
   - Die Herleitung steht hier in der Quellenkarte, in M1 als Aufklapper unter dem Absatz.
   - Die Farben folgen hier den drei Bereichen des Resonanzrads, in M1 hat jedes System eine eigene Quellenfarbe.

   Empfehlung: den Fliesstext als Vorgabe nehmen. Entscheiden muss es, wer in der App über Muster entscheidet. Dort gilt: Entscheide trifft der Founder, und eine neue Form geht ihm vorher als Frage mit Bild zu (`.planning/MUSTER-VERBINDLICH.md`).
4. **Wort „Resonanzraum“** im Text „Dein erstes Muster“: Es ist kein Glossarbegriff und liegt nah an „Beziehungsraum“. Es steht so, wie Chris es geschrieben hat.

## Was gebaut ist

**4.11 Fliesstext** (`components/fliesstext/`, im PR #18): Ein Text, der zu einem Menschen spricht und bei jeder Kernaussage zeigt, woher sie kommt.
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

## Weiterarbeiten

- **Regeln:** [CLAUDE.md](CLAUDE.md). Befehle für Chris immer als ein vollständiger Block, Antworten auf Deutsch mit „ss“, Begriffe nur aus dem Glossar, Versionen nach Major, Minor und Patch.
- **Lokal ansehen:** Vorlage in CLAUDE.md, Server immer `python3 tools/serve.py` auf Port 4173.
- **Prüfen vor jedem Push:** `node --check` über alle Skripte, `python3 tools/build_logo_circles.py`, `node tools/glossar-md.js`, `git diff --check`, bei neuen Dateien im Paket `npm pack --dry-run`.
- **Im Browser prüfen** (mit Playwright, mit und ohne reduzierte Bewegung): kein horizontaler Überlauf, kein sichtbarer Text unter 15 px, keine Konsolenfehler, Bedienung mit Tastatur, Esc und Fokus zurück. Bekannter Fehlalarm: `<small>Konto</small>` in der Seitenleiste ist unter 1024 px ausgeblendet und wirkt in einer reinen Schriftgrössen-Suche wie 12,5 px.
- **Screenshots für das README:** Server starten, dann `node tools/screenshots.js` (braucht Playwright, siehe Kopf der Datei).
- **Neuer Baustein:** eigener Ordner `components/<name>/` mit `<name>.css`, `<name>.js` (klassisches Skript mit `mount()`, läuft auch unter `file://`) und einer Seite `index.html`. Beide Dateien in `files` der `package.json`, Version als Minor anheben, „Gestaltungsatlas X.Y“ in allen Seiten nachziehen, Karte im Kapitel Bausteine, API im README, Begründung in DESIGN-NOTES.

## Bezug zur App

- Repository `maindnow/soulresonance.ch`, eigene Regeln in dessen `CLAUDE.md` und `AGENTS.md`. Muster der App: `.planning/MUSTER-VERBINDLICH.md`. Ein früherer Fliesstext-Entwurf der App liegt dort unter `.planning/bausteine/flowtext-2026-09-18/`.
- Grundlage der App-Screens im Atlas war die App mit Stand 14.10.2026 (siehe DESIGN-NOTES, „In der App (4.10)“, mit Recherche zu vergleichbaren Plattformen).
