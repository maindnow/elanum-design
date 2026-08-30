# Pruning der learnings.md

Ohne Pruning wächst `references/learnings.md` zur Megalith-Datei und wird bei jedem
Skill-Lauf mitgeladen. Genau das soll Progressive Disclosure verhindern.

**Rhythmus:** wöchentlich, Sonntag morgen.
**Gesunde Grösse:** 50 bis 150 Zeilen. Ab 200 Zeilen ist Pruning überfällig.

## Der Prompt

```
Pruning-Lauf für den Skill elanum-designelemente.

1. Lade .claude/skills/elanum-designelemente/references/learnings.md
2. Entferne:
   - Duplikate, also dieselbe Regel zweimal formuliert
   - Single-Event-Notizen ohne erkennbares Muster
   - Hypothesen älter als vier Wochen, die nie verifiziert wurden
   - Muster, die durch eine neuere, präzisere Formulierung ersetzt sind
   - Regeln, die schon im Body der SKILL.md stehen
3. Behalte:
   - verifizierte Muster mit Mehrfachbestätigung
   - numerische Kennzahlen mit Datum
   - Edge-Cases, die die SKILL.md nicht abdeckt
   - alle Einträge unter "Abweichungen Styleguide gegen Skill"
4. Aktualisiere den Header: Letztes Pruning, Eintragsanzahl.
5. Melde: Anzahl entfernter Einträge, aktuelle Eintragsanzahl, und eine Warnung,
   falls danach weniger als 5 oder mehr als 150 aktive Regeln stehen.
```

## Einrichtung

Diese Session lief ohne CoWork-CLI, die Task ist also noch nicht automatisiert.
Drei Wege, den Prompt wöchentlich auszulösen:

- **Claude Routine:** eine wiederkehrende Routine mit Cron `0 8 * * 0` (Sonntag 09:00
  in der Schweiz während der Sommerzeit, `0 8` in UTC). Der Prompt oben wird
  unverändert eingesetzt.
- **Kalender-Reminder:** wiederkehrender Termin Sonntag 09:00, den Prompt in die
  Beschreibung, sonntags in Claude Code ausführen.
- **Cron lokal:** `0 9 * * 0 cd <repo> && claude "<Prompt>"`.

Faustregel für jeden Eintrag: verändert er in den nächsten fünf Skill-Läufen den
Output? Wenn nein, gehört er raus.
