# elanum-design

Designsystem von elanum, in der SoulResonance-Sprache: warmes Papier als Grund,
programmierbare SVG-Geometrie, Farbe, die sich wie Licht verhält.

## Inhalt

| Pfad | Was es ist |
|---|---|
| `docs/soulresonance-styleguide.html` | Die lebende Referenz. Im Browser öffnen. |
| `docs/soulresonance-design-prompt.md` | Die Designanweisung im Volltext. |
| `.claude/skills/elanum-designelemente/` | Der Skill für die tägliche Arbeit. |

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
│   └── starter.html                  Seitenskelett mit Reveal-Observer
└── scripts/
    ├── check_design.py               Linter für die statisch prüfbaren Regeln
    └── verify_render.py              Render-Verifikation in Chromium
```

## Ein neues Element bauen

```bash
cp .claude/skills/elanum-designelemente/assets/base.css       ./
cp .claude/skills/elanum-designelemente/assets/starter.html   ./
# bauen, dann:
python .claude/skills/elanum-designelemente/scripts/check_design.py starter.html
python .claude/skills/elanum-designelemente/scripts/verify_render.py starter.html --shots ./shots
```

`verify_render.py` braucht `pip install playwright`. Chromium wird unter
`/opt/pw-browsers` gesucht, sonst nimmt Playwright seine eigene Installation.
