# Übergabe: ELANUM Gestaltungsatlas

Stand 4. November 2026. Auf `main` liegt **Atlas 4.10** (Paket `@elanum/design` 4.10.0, Tag `v4.10.0`). Diese Datei fasst alles zusammen, was es zum Weiterarbeiten braucht, auch Entscheide, die bisher nur in Gesprächen mit Claude standen.

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

1. **Entwurf 4.11 „Fliesstext“ ist nicht gemergt:** PR #18, Branch `claude/kind-sagan-jkyhkj`. Ein neuer Baustein `components/fliesstext/`: Aussagen mit ihrer Quelle, Quellenkarte „Woher kommt diese Aussage?“, eingebunden im Atlas und auf Heute. Paket 4.11.0. Der Branch bleibt auf GitHub erhalten. Nach dem Merge den Tag `v4.11.0` mit der Vorlage in `CLAUDE.md` setzen und die App darauf anheben (Abschnitt „In der App“). Ansehen:

   ```bash
   cd ~
   [ -d elanum-design ] || git clone https://github.com/maindnow/elanum-design.git
   cd ~/elanum-design
   git merge --abort 2>/dev/null
   lsof -ti:4173 | xargs kill -9 2>/dev/null
   git fetch origin
   git reset --hard
   git checkout -B claude/kind-sagan-jkyhkj origin/claude/kind-sagan-jkyhkj
   git log --oneline -1
   (sleep 1 && open http://127.0.0.1:4173) & python3 tools/serve.py
   ```
2. **Leitsatz nennt noch die alten Phasen:** „Mit ELANUM findest du zu dir, zueinander und miteinander. Resonanz zeigt den Weg.“ steht im Glossar, im Einstieg des Atlas und auf dem App-Screen Ankommen. Er blieb bewusst stehen, entschieden ist noch nichts. Vorschlag von Claude: „Mit ELANUM findest du Resonanz: in dir, in der Liebe und mit anderen.“
3. **Partner oder Partnerschaft:** Resonanz sagt „zu deinem Partner“ (so von Chris formuliert), der Resonanzkosmos „in deiner Partnerschaft“. Beides ist so freigegeben. „Partner“ schliesst Partnerinnen sprachlich aus. Bei Gelegenheit angleichen, falls gewünscht.
4. **Namen in der App noch ohne Freigabe im Glossar:** Entdecken, Likes, Chats, Profil, Aktivitäten, Events, Meine, Menü, dazu App-Rahmen, Leiste, Schiene, Seitenleiste, Sheet, Hauptfläche, Tagesbogen, „Eine Frage für heute“, „Resonanz zeigen“. Liste in `DESIGN-NOTES.md`, „Offene Freigaben“.
5. **Kapitel Haltung im Atlas:** Bei Datingkosmos und Erlebniskosmos steht unter „Darin“ noch „folgt“, obwohl es seit 4.10 die Screens Entdecken, Chats und Aktivitäten gibt. Beim nächsten Atlas-Stand nachführen.
6. **Alter Branch `codex/elanum-styleguide-2026-09-18`:** zwei Commits vom 18. September, älter als Stand 4.4 und durch alles Spätere ersetzt. Kann gelöscht werden. Alle anderen `claude/*`-Branches sind vollständig in `main`.
7. **Rosa als Token (Lücke L1/L2 der App):** Die App nutzt für „gemeinsam“ (Paar-Ansichten, Personenfarben) den Wert `#B5387F` (4,86:1 auf Papier). Das Paket hat dafür kein Token (gemessen am 4. November 2026: kein Treffer in `tokens.css`). Vorschlag: als Token ins Paket (Minor), danach in der App ersetzen. Entscheid Chris.

## In der App (`maindnow/soulresonance.ch`)

- **Stand:** Die App pinnt `github:maindnow/elanum-design#v4.10.0` (gemessen am 4. November 2026 auf `integration` und `main`). ELANUM ist dort seit dem 20. Oktober 2026 live.
- **Dein Zweig:** `chris`, Pull Requests gehen nur nach `integration`, das Release macht Tris. Anleitung `docs/INFO-CHRIS.md`, Abläufe `docs/RUNBOOK-LOKAL.md`, dein Stand `.planning/stand/chris.md`.
- **Design-Lücken:** `docs/elanum-migration.md` führt 75 Lücken L1 bis L75 zwischen App und Paket. Geschlossen werden sie hier im Paket, nie mit lokalen Werten in der App.
- **Neue Paketversion in die App holen:**
    1. Hier mergen und den Tag setzen (`CLAUDE.md`, „Versionen“).
    2. Im Hauptrepo auf `chris` die Zeile `@elanum/design` in `package.json` auf den neuen Tag ändern, dann `npm install`.
    3. `tests/design/elanum-theme.test.js` prüft den Tag, die Ladereihenfolge und dass jedes genannte Token im Paket existiert. Ein entferntes oder umbenanntes Token (Major) fällt dort auf.
    4. Pull Request nach `integration`.
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
| 4.11 | Entwurf, PR #18 (siehe Offen) |

Das Glossar trägt die Version 4.9, weil es sich in 4.10 nicht geändert hat.

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
- **Ablauf:** Claude arbeitet auf einem Branch `claude/…` und eröffnet einen PR als Entwurf. Chris prüft lokal mit dem Block aus `CLAUDE.md` und mergt selbst. Danach den Block für `main` und, bei neuer Paketversion, den Block für den Tag.
- **Glossar ändern:** nur mit Freigabe von Chris und mit neuer Atlas-Version. Immer `assets/glossar.js` bearbeiten, dann `node tools/glossar-md.js`. `GLOSSAR.md` nie von Hand.
- **Versionen und Tags:** Regeln in `CLAUDE.md`, „Versionen“. Die App verlässt sich auf die Tags: nie verschieben oder löschen.
- **Vor jedem Push:** die Prüfungen aus `CLAUDE.md`, dazu der Atlas im Browser (Desktop, Tablet, Telefon, ohne Konsolenfehler).
- **Lehre aus der Arbeit:** Chris sah lange einen alten Stand, weil sein lokaler Ordner nicht nachgezogen war. Deshalb gibt es `tools/serve.py` (ohne Browser-Cache), und nach jedem Merge gehört der Block für `main` in die Antwort.

## Wo was liegt

| Datei oder Ordner | Inhalt |
|---|---|
| `index.html`, `style.css`, `app.js` | Der Atlas mit allen Kapiteln |
| `tokens.css`, `base.css` | Alle Werte und die gemeinsamen Grundlagen |
| `components/` | Bausteine als eigene Seiten: Resonanzrad, Umfeld, Beziehungsraum, Weg, Zeichen, App (mit den acht Screens) |
| `assets/` | Zeichen (SVG), Schriften, Bewegung (`motion.js`, GSAP), Glossar |
| `tools/` | Zeichen erzeugen, Schriften einbetten, Glossar erzeugen, Screenshots, lokaler Server |
| `docs/screenshots/` | Bilder für das README |
| `README.md` | Überblick, Aufbau, Verwendung in der App, Prüfen |
| `DESIGN-NOTES.md` | Entscheide und Begründungen, nach Version |
| `GLOSSAR.md` | Alle verbindlichen Begriffe und was nicht mehr verwendet wird |
| `CLAUDE.md` | Arbeitsregeln, Befehlsvorlagen, Versionen |
