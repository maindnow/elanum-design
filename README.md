# elanum-design

Designsystem von elanum, in der SoulResonance-Sprache: warmes Papier als Grund,
programmierbare SVG-Geometrie, Farbe, die sich wie Licht verhält.

## Inhalt

| Pfad | Was es ist |
|---|---|
| `docs/soulresonance-styleguide.html` | Die lebende Referenz. Im Browser öffnen. |
| `docs/soulresonance-design-prompt.md` | Die Designanweisung im Volltext. |
| `.claude/skills/elanum-designelemente/` | Der Skill für die tägliche Arbeit. |
| `assets/` | Projekt-Stylesheet und Reveal-Observer, aus den Skill-Assets. |
| `components/personal-wheel/` | Das persönliche Rad im Bereich Ich. |

## Das persönliche Rad

`components/personal-wheel/` ist ein Navigationsinstrument, kein Diagramm. Seine
Geometrie ist verbindlich und wird aus Polarkoordinaten berechnet:

- die äussere Silhouette ist jederzeit ein mathematisch perfekter Kreis
- neun gleich grosse radiale Segmente à exakt 40 Grad, alle mit demselben Aussenradius
- darüber ein konzentrischer Ring aus drei Abschnitten à 120 Grad, geometrisch an je
  drei Segmente gekoppelt
- Radien bei `viewBox="0 0 320 320"`: Zentrum 34, Segmente 112, Gruppenring 121 bis 145
- keine Bézier-Verformung, keine variierenden Radien, keine asymmetrische Aussenkontur

Trace, Echo und Spectrum kommen ausschliesslich als sekundäre Effekte entlang dieser
festen Geometrie vor. Kreis und Segmente sind die Informationsarchitektur,
SoulResonance ist die Sprache darüber.

Inhalt und Geometrie sind getrennt: `ITEMS` in `personal-wheel.js` bestimmt, was in den
Segmenten steht, `CFG` bestimmt die Geometrie. Wer ein Element umbenennt, fasst das SVG
nicht an.

### Kategorien und Ausfüllstatus

Jede der drei Kategorien trägt eine eigene Resonanzfarbe, entnommen aus dem Spektrum in
seiner festen Reihenfolge:

| Kategorie | Farbe |
|---|---|
| Grundtöne | Violet `#6756D9` |
| Ich und Orientierung | Blue `#4D7FE8` |
| Beziehung und Verbindung | Rose `#D85BA9` |

Die Farbe erscheint als Tönung zwischen 7 und 30 Prozent, nie als satte Fläche. Sie
sagt, zu welcher Kategorie ein Segment gehört. Ob es schon ausgefüllt ist, sagen die
Stärke der Tönung und der Punkt am äusseren Rand: voller Punkt heisst ausgefüllt,
offener Kreis heisst noch offen. Der offene Kreis ist die Gap-Sprache des Systems.

Der Ausfüllstatus steht im Markup, nicht im JavaScript. Ein Panel mit
`data-done="true"` färbt sein Segment ein und füllt den Punkt. So werden Inhalt und
Zustand an einer Stelle gepflegt, und die Seite stimmt auch ohne JavaScript.

Das Ergebnis steht an zwei Stellen, aber nur einmal gepflegt. Im Segment steht unter
dem Namen die Kurzform in der Farbe der Kategorie, etwa Jungfrau, Generator oder
Ehrlichkeit. Unter der Beschreibung steht sie ausführlich in einem Ergebnisbereich mit
mindestens 96px Höhe. Beide lesen aus demselben Markup: `data-result` trägt die
Kurzform, die Definitionsliste im Panel die Details.

Offene Bereiche zeigen im Segment keine Ergebniszeile, ihr offener Kreis sagt bereits,
dass noch nichts da ist. Im Panel steht dort ein Leerzustand mit der Aufforderung,
ihn auszufüllen. Die Ergebnisse in dieser Vorschau sind Beispieldaten.

Kurzformen im Rad müssen in ihr Segment passen. Die verfügbare Breite ist
`2 · r · sin(20°)` am Radius der Zeile, also rund 42 bis 56 Einheiten. `Lebenszahl 7`
brauchte 53 bei 44 verfügbaren und musste zu `7` gekürzt werden.

### Anschauen

`components/personal-wheel/standalone.html` im Browser öffnen. Die Datei enthält alles
inline und braucht weder Server noch Nachbardateien.

Sie ist erzeugt, nicht von Hand gepflegt. Nach jeder Änderung an `index.html`,
`personal-wheel.css` oder `personal-wheel.js`:

```bash
python components/personal-wheel/build-standalone.py
```

Das Script setzt alle lokalen Stylesheets und Skripte inline und schreibt zwei Dateien:
`standalone.html` als vollständiges Dokument und `artifact.html` als reinen Seiteninhalt
für die Veröffentlichung. Es bricht ab, wenn ein lokaler Verweis übrig bleibt.

## Den Skill nutzen

Der Skill liegt als Projekt-Skill in `.claude/skills/` und wird von Claude Code in
diesem Repository automatisch gefunden. Er greift bei Aufgaben wie
"Designelement für elanum", "elanum Komponente bauen" oder
"Card im SoulResonance-Stil".

```
.claude/skills/elanum-designelemente/
├── SKILL.md                          Arbeitsanleitung, vier Modi
├── references/
│   ├── tokens.md                     Palette, Relief, Radien, Materialverhältnis
│   ├── komponenten.md                Card, Kante, Button, Feld, Status, Papier
│   ├── svg-grammatik.md              Trace, Echo, Gap, Bridge, Spectrum
│   ├── motion.md                     Konstanten, Guards, Reveal-Code
│   ├── layout-responsive.md          Breakpoints, Grid, Editorial-Disziplin
│   ├── acceptance-checkliste.md      18 Punkte vor dem Abliefern
│   ├── pruning.md                    Wartung der learnings.md
│   └── learnings.md                  Gedächtnis des Skills, wächst durch wrap-up
├── assets/
│   ├── base.css                      Tokens, Reset, Primitive, Responsive
│   ├── reveal.js                     Reveal-Observer, inklusive Erreichbarkeitsprüfung
│   └── starter.html                  Seitenskelett
└── scripts/
    ├── check_design.py               Linter für die statisch prüfbaren Regeln
    └── verify_render.py              Render-Verifikation in Chromium
```

## Ein neues Element bauen

```bash
cp .claude/skills/elanum-designelemente/assets/base.css       ./
cp .claude/skills/elanum-designelemente/assets/reveal.js      ./
cp .claude/skills/elanum-designelemente/assets/starter.html   ./
# bauen, dann:
python .claude/skills/elanum-designelemente/scripts/check_design.py starter.html
python .claude/skills/elanum-designelemente/scripts/verify_render.py starter.html --shots ./shots
```

`verify_render.py` braucht `pip install playwright`. Chromium wird unter
`/opt/pw-browsers` gesucht, sonst nimmt Playwright seine eigene Installation.
