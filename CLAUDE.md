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
