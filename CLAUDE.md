# Arbeitsregeln für dieses Repository

## Befehle für Chris

Chris testet lokal auf einem Mac (zsh). Jede Anleitung muss idiotensicher sein:

- Befehle immer in **einem** Codeblock, vollständig zum Kopieren und Einfügen, ohne Erklärtext oder `#`-Kommentare darin (zsh führt Kommentare in eingefügten Befehlen nicht als Kommentar aus).
- Immer mit `cd ~/elanum-design` beginnen. Falls der Ordner fehlen kann, ihn im selben Block klonen.
- Den Block so bauen, dass er aus jedem Zustand funktioniert: laufenden Merge abbrechen, alten Server auf Port 4173 beenden, auf den richtigen Branch wechseln und genau auf den Stand von GitHub setzen.
- Danach in einem Satz sagen, was passiert und wie man es beendet (Ctrl+C).
- Nie voraussetzen, dass ein vorheriger Schritt geklappt hat.
- Nach jedem Merge, den Chris ansehen soll, den Block für `main` mitgeben. Ohne ihn zeigt sein Browser weiter den alten Stand.
- Als Server immer `python3 tools/serve.py` (ohne Browser-Cache), nicht `python3 -m http.server`.

Vorlage zum Testen eines Branches:

```bash
cd ~
[ -d elanum-design ] || git clone https://github.com/maindnow/elanum-design.git
cd ~/elanum-design
git merge --abort 2>/dev/null
lsof -ti:4173 | xargs kill -9 2>/dev/null
git fetch origin
git reset --hard
git checkout -B BRANCH origin/BRANCH
git log --oneline -1
(sleep 1 && open http://127.0.0.1:4173) & python3 tools/serve.py
```

## Sprache und Begriffe

- Antworten auf Deutsch (Schweizer Schreibweise, „ss“ statt „ß“).
- Begriffe nur so verwenden wie im Glossar (`assets/glossar.js`, im Atlas Kapitel Glossar, `GLOSSAR.md`). Änderungen am Glossar nur mit Freigabe.

## Prüfen vor jedem Push

```bash
for f in app.js assets/*.js components/*/*.js; do node --check "$f"; done
python3 tools/build_logo_circles.py
node tools/glossar-md.js
git diff --check
```

## Versionen

Dieses Repo ist die einzige Designquelle der App ELANUM (`maindnow/soulresonance.ch`). Die App bindet es als Paket `@elanum/design` über einen Tag ein: `"@elanum/design": "github:maindnow/elanum-design#vX.Y.Z"`. Die Paketversion ist die Atlas-Version: Atlas 4.8 ist `4.8.0`.

- Jede freigegebene Änderung hebt `version` in `package.json` an und bekommt nach dem Merge auf `main` einen Tag `vX.Y.Z`.
- **Major:** Ein Token oder eine Baustein-API wird entfernt oder umbenannt.
- **Minor:** Ein neuer Token oder ein neuer Baustein.
- **Patch:** Eine Korrektur ohne neue Werte.
- Ein neuer Baustein kommt mit CSS und JS in `files` von `package.json`. `npm pack --dry-run` zeigt, was ausgeliefert wird.
- Gepushte Tags nie verschieben oder löschen. Die App verlässt sich darauf.

Vorlage zum Setzen des Tags nach dem Merge (`X.Y.Z` ersetzen). Der Tag kommt nur, wenn `main` schon diese Version trägt:

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
if git ls-remote --exit-code --tags origin refs/tags/vX.Y.Z >/dev/null; then echo "Tag vX.Y.Z ist schon auf GitHub."; elif grep -q '"version": "X.Y.Z"' package.json; then git tag -f -a vX.Y.Z -m "ELANUM Design X.Y.Z" && git push origin vX.Y.Z; else echo "STOPP: Auf main steht noch nicht Version X.Y.Z. Zuerst den PR mergen, dann diesen Block nochmals einfügen."; fi
git ls-remote --tags origin vX.Y.Z
(sleep 1 && open http://127.0.0.1:4173) & python3 tools/serve.py
```
