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
