# elanum-design

Dieses Repository hält das Designsystem von elanum: die lebende Referenz, die
Designanweisung und den Skill, der beides in Arbeit übersetzt.

## Source of Truth, in dieser Rangfolge

1. `docs/soulresonance-styleguide.html`, die lebende Referenzimplementierung.
   Bei jedem Widerspruch gewinnt diese Datei.
2. `docs/soulresonance-design-prompt.md`, die Designanweisung im Volltext.
3. `.claude/skills/elanum-designelemente/`, die Arbeitsanleitung mit kopierfertigen
   Bausteinen, Linter und Render-Verifikation.

Wenn Styleguide und Skill auseinandergehen: den Styleguide umsetzen, danach den Skill
korrigieren und die Abweichung in
`.claude/skills/elanum-designelemente/references/learnings.md` notieren.

## Regeln, die immer gelten

Für jede Design- und Frontend-Arbeit in diesem Repository gilt der Skill
`elanum-designelemente`. Die neun goldenen Regeln stehen in seiner SKILL.md, die
harten Kurzfassungen hier:

- Der Grund ist `#F6F1E5`. Kein Weiss, kein Grau, kein Dark Mode.
- Flächen werden aus dem Papier gepresst, nie umrandet. `border:0` plus Emboss-Token.
- Farbige Linien leuchten in ihrer eigenen Farbe. Tinte und Status leuchten nie.
- Nichts beschneidet Schatten oder Glow. Einzige Ausnahme ist ein Geräterahmen.
- Genau eine Spektralkante pro Fläche.
- Mobile first, nur `min-width`-Queries.
- Keine Gedankenstriche in sichtbarem Text.

## Vor dem Abliefern

```bash
python .claude/skills/elanum-designelemente/scripts/check_design.py <pfad>
python .claude/skills/elanum-designelemente/scripts/verify_render.py <datei.html>
```

Erst wenn beide sauber durchlaufen, die Acceptance-Checkliste in
`.claude/skills/elanum-designelemente/references/acceptance-checkliste.md` durchgehen.
Ein korrekt aussehender Diff ist kein Beweis.

## Abgrenzung

elanum ist nicht BEYONDER. Die beiden Systeme haben eigene Tokens, eigene Farben und
eigene Bildsprachen. Für BEYONDER-Material gelten `beyonder-brand-guidelines` und
`beyonder-brand-voice`, und die Systeme werden nie gemischt.
