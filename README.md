# ELANUM Designsystem

Dieses Repository enthält das **gesamte ELANUM-Designsystem**, nicht nur das persönliche Rad: Markenreferenzen, Logo- und Gestaltungssprache, Farben, Typografie, Material, Bewegung, UI-Prototypen und Werkzeuge für die Umsetzung.

Das persönliche Rad ist eine einzelne Produktkomponente. Der interaktive **Gestaltungsatlas 4.4** entwickelt die Gestaltung in Richtung **Soft 3D Relief / Neumorphic Relief** weiter.

## Direkt zum richtigen Bereich

| Bereich | Inhalt | Verfügbarkeit |
| --- | --- | --- |
| [Gestaltungsatlas 4.4](https://github.com/maindnow/elanum-design/tree/codex/elanum-styleguide-2026-09-18/docs/elanum-gestaltungsatlas) | Logo, Typografie, Farbsystem, Relief, Beziehungen, Animationen und Bedienung | Separater Arbeitsbranch, noch nicht in `main` |
| [SoulResonance-Referenz](docs/soulresonance-styleguide.html) | Bestehende interaktive Designreferenz | In `main` |
| [Designanweisung](docs/soulresonance-design-prompt.md) | Gestaltungsregeln im Volltext | In `main` |
| [Persönliches Rad](components/personal-wheel/standalone.html) | Navigationsprototyp mit neun Bereichen in drei Gruppen | In `main` |
| [Projekt-Skill](.claude/skills/elanum-designelemente/SKILL.md) | Vorlagen, Regeln und Prüfwerkzeuge für SoulResonance | In `main` |

GitHub zeigt HTML-Dateien als Quelltext. Für die interaktiven Ansichten die Dateien lokal im Browser öffnen oder über einen lokalen Webserver bereitstellen.

## Aktuelle Designrichtung: Soft 3D Relief

Der Gestaltungsatlas kombiniert warme Papierflächen mit Licht von links oben, weichen Schatten, erhabenen Elementen und vertieften Eingaben. Yrsa setzt persönliche Aussagen; Albert Sans führt durch Bedienung und Lesetext.

- **Logo:** Spektrum, Ink, Invers und eine zusätzliche Relief-Prägung. Die freigegebene Grundform bleibt erhalten; Originaldateien und separate Kurvenkorrekturen sind enthalten.
- **Beziehungen:** mathematisch runde, gefüllte Reliefebenen mit offenen Konturen und angeschlossenen Verbindungslinien.
- **Bewegung:** sanfte Atmung, einmaliger Aufbau beim Scrollen, Druck- und Hoverzustände sowie globale Bewegungspause und reduzierte Bewegung.
- **Farbe:** neun Feldfarben in drei Gruppen, ergänzt um separate Info-, Signal- und Fehlerfarben.
- **Interaktion:** Schriftprobe, kopierbare Farbwerte und Tokens, lokale Formulardemos, Produkt-Tabs und eine manuelle Prüfcheckliste.

Die fachlichen Feldnamen im Atlas sind noch Platzhalter. Sie dürfen nicht automatisch mit den benannten Bereichen des persönlichen Rads gleichgesetzt werden.

[Designentscheidungen zum Atlas](https://github.com/maindnow/elanum-design/blob/codex/elanum-styleguide-2026-09-18/docs/elanum-gestaltungsatlas/DESIGN-NOTES.md) · [Prüfstand und bekannte Abweichungen](https://github.com/maindnow/elanum-design/blob/codex/elanum-styleguide-2026-09-18/docs/elanum-gestaltungsatlas/IMPORT-NOTES.md)

## Lokal starten

Voraussetzungen: Git und ein aktueller Browser. Python 3 wird nur für den optionalen lokalen Webserver benötigt.

### Bestehendes System auf main

```bash
git clone --branch main https://github.com/maindnow/elanum-design.git
cd elanum-design
python3 -m http.server 4173 --bind 127.0.0.1
```

[Lokalen Einstieg öffnen](http://127.0.0.1:4173/). Die Startseite verlinkt SoulResonance und das persönliche Rad. Den Server mit `Ctrl+C` beenden.

### Neuen Relief-Atlas ansehen

In einer separaten Arbeitskopie:

```bash
git clone --branch codex/elanum-styleguide-2026-09-18 https://github.com/maindnow/elanum-design.git elanum-relief
cd elanum-relief
python3 -m http.server 4174 --bind 127.0.0.1
```

[Relief-Atlas lokal öffnen](http://127.0.0.1:4174/docs/elanum-gestaltungsatlas/index.html).

Alternativ die jeweilige HTML-Datei direkt im Browser öffnen. Beim Atlas den vollständigen Ordner mit CSS, JavaScript und Assets zusammen behalten. Er benötigt keinen Build, kein Backend und keinen externen Font-Dienst. Die Eingabedemos versenden oder speichern keine Daten dauerhaft.

## Struktur von main

```text
index.html                           Einstieg zur bisherigen Referenz und zum Rad
docs/
  soulresonance-styleguide.html       Interaktive SoulResonance-Referenz
  soulresonance-design-prompt.md      Designanweisung
components/personal-wheel/            Quellen und generierte Rad-Vorschauen
assets/                              Gemeinsame SoulResonance-Styles und Bewegung
.claude/skills/elanum-designelemente/  Projekt-Skill, Vorlagen und Prüfskripte
CLAUDE.md                            Projektregeln und Referenzrangfolge
```

Der Arbeitsbranch ergänzt `docs/elanum-gestaltungsatlas/` mit eigenem HTML, CSS, JavaScript, SVG-Assets, lokalen Fonts und Designnotizen. Dieser Ordner ist noch nicht Bestandteil von `main`.

## Referenzen und Pflege

Für das bestehende SoulResonance-System gilt die Rangfolge aus [CLAUDE.md](CLAUDE.md):

1. Interaktive SoulResonance-Referenz.
2. Designanweisung.
3. Projekt-Skill.

Der Relief-Atlas ist eine separate Weiterentwicklung und ersetzt diese Regeln nicht stillschweigend. Für eine gemeinsame verbindliche Basis müssen Referenz, Tokens, Projekt-Skill und Dokumentation bewusst zusammengeführt werden.

Logo-Geometrie nicht als gewöhnliche Stylingänderung behandeln. Originale erhalten und Änderungen an Konturen separat abstimmen. Bei Änderungen am Atlas auch die sichtbare Farbpalette, den Tokenblock und die Designnotizen pflegen.

## Das persönliche Rad weiterentwickeln

Das Rad ist eine Navigationskomponente mit neun Segmenten à 40 Grad und drei zugehörigen Gruppenbereichen à 120 Grad. Die Kreisgeometrie wird aus Polarkoordinaten berechnet.

In `personal-wheel.js` stehen Inhalte in `ITEMS` und Geometriewerte in `CFG`. Ausfüllstatus und Ergebnisse kommen aus dem HTML-Markup, unter anderem aus `data-done` und `data-result`. Die Vorschau enthält Beispieldaten.

Nach Änderungen an den Quellen die Ausgaben neu erzeugen:

```bash
python3 components/personal-wheel/build-standalone.py
```

Das Skript erstellt `standalone.html` und `artifact.html`. Lokale Styles und Skripte werden eingebettet; externe Google-Font-Verweise bleiben bestehen. Anders als der Atlas ist die Schriftversorgung des Rads daher nicht vollständig lokal.

## Qualität und Prüfungen

Für Änderungen am bestehenden SoulResonance-System:

```bash
python3 .claude/skills/elanum-designelemente/scripts/check_design.py docs/soulresonance-styleguide.html
python3 .claude/skills/elanum-designelemente/scripts/verify_render.py docs/soulresonance-styleguide.html
git diff --check
```

Der Rendercheck benötigt Python Playwright und einen passenden Chromium-Browser. Er prüft verschiedene Bildschirmbreiten mit normaler und reduzierter Bewegung. Die Befehle sind eine Prüfanleitung, keine Aussage, dass der jeweilige Stand alle Prüfungen besteht.

Beim Atlas zusätzlich JavaScript-Syntax, lokale Dateiverweise, Logo-Proportionen, mobile Überläufe, Tastaturbedienung und Bewegungspause prüfen. Sein dokumentierter Stand enthält 14 Abweichungen zu den bisherigen SoulResonance-Linterregeln. Eine vollständige Barrierefreiheitsfreigabe wird nicht behauptet.

## Branches und Veröffentlichung

`main` enthält das bisherige System und diese Projektübersicht. Der Relief-Atlas liegt unter `codex/elanum-styleguide-2026-09-18`. Weitere Arbeitsbranches können unabhängig davon fortgeführt werden.

Am 19. September 2026 verweist der Standardbranch des Repositorys auf `claude/elanum-designelemente-skill-wv45uu`, nicht auf `main`. Deshalb kann die allgemeine GitHub-Startseite eine andere README anzeigen. [Diese README direkt auf main öffnen](https://github.com/maindnow/elanum-design/blob/main/README.md).

Ein Push ist weder ein Merge noch ein Deployment. Der aktuelle GitHub-Pages-Status wird hier nicht vorausgesetzt. Bei einer Veröffentlichung müssen alle benötigten Dateien im tatsächlich veröffentlichten Branch oder Build-Artefakt enthalten sein.

## Nutzungsrechte

Die lokal eingebundenen Fonts des Atlas enthalten ihre OFL-Lizenzen im jeweiligen Font-Ordner. Daraus folgt keine allgemeine Nutzungsfreigabe der ELANUM-Markenassets. Eine allgemeine Repository-Lizenz wird hier nicht vorausgesetzt.
