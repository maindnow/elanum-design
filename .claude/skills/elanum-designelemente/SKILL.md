---
name: elanum-designelemente
description: Baut Designelemente und Screens für elanum im SoulResonance-System, warmes Papier #F6F1E5, Emboss statt Rahmen, SVG-Grammatik, eine Spektralkante pro Fläche. Trigger: "Designelement für elanum", "elanum Komponente bauen", "Card im SoulResonance-Stil", "elanum UI umsetzen", "elanum Screen". Nicht triggern bei: BEYONDER Corporate Design, LinkedIn-Karussells und Social-Grafiken, Logo- oder Brandkit-Aufgaben, generischem Frontend ohne elanum-Bezug. Endresultat: fertiges HTML, CSS und SVG auf --sr-canvas, das die Acceptance-Checkliste besteht und check_design.py fehlerfrei durchläuft.
---

# elanum Designelemente

Baut Oberflächen in der SoulResonance-Sprache: digital gedacht, menschlich in der
Textur. Der Grund ist warmes Papier, die Geometrie ist programmierbares SVG, Farbe
verhält sich wie Licht.

## Source of Truth (Rangfolge)

1. `docs/soulresonance-styleguide.html`, die lebende Referenz. Bei Widerspruch gewinnt sie.
2. `docs/soulresonance-design-prompt.md`, die Designanweisung im Volltext.
3. Dieser Skill, die Arbeitsanleitung mit kopierfertigen Bausteinen.

Wenn Styleguide und Skill sich widersprechen: Styleguide umsetzen, danach den Skill
korrigieren und den Widerspruch in `references/learnings.md` notieren.

## Goldene Regeln (nicht verhandelbar)

1. **Grund ist `#F6F1E5`.** Kein Weiss, kein Grau, kein Dark Mode. Es gibt keinen Dark Mode.
2. **Materialverhältnis 40 / 20 / 40:** 40% warme Luft, 20% tieferes Papier, 40% Resonanzfarbe.
3. **Flächen werden aus dem Papier gepresst, nie umrandet.** `border:0` plus Emboss-Token.
4. **Farbige Linien leuchten in ihrer eigenen Farbe. Tinte leuchtet nie. Status leuchtet nie.**
5. **Nichts beschneidet Schatten oder Glow.** `svg{overflow:visible}`, kein `overflow:hidden`
   ausser auf einem Geräterahmen.
6. **Genau eine schmale Spektralkante pro Fläche**, folgt dem Eckenradius, blendet aus.
7. **Jedes Markenvisual ist aus SVG konstruierbar.** Keine Raster-Texturen, keine generierten
   Bilder in Markenelementen.
8. **Mobile first, nur `min-width`-Queries.** Keine einzige `max-width`-Query.
9. **Keine Gedankenstriche in sichtbarem Text.** Komma, Doppelpunkt, Punkt oder Bindestrich.

## Modus erkennen

| User-Signal | Modus | Sprung zu |
|---|---|---|
| "Baue einen Button / eine Card / ein Feld" | **BUILD** | Schritt 1 |
| "Ganzer Screen", "Seite", "Dashboard", "Ansicht" | **SCREEN** | Schritt 4 |
| "Neues Markenvisual", "Illustration", "Diagramm" | **VISUAL** | Schritt 7 |
| "Prüfe das Design", "Review", "passt das zum System" | **AUDIT** | Schritt 9 |

Wenn unklar: einmal kurz nachfragen, dann eindeutig in einen Modus.

---

## BUILD, Einzelne Komponente

### Schritt 1: Token-Basis sicherstellen

Prüfe, ob der `:root`-Block schon im Projekt liegt. Falls nicht, `assets/base.css`
einbinden. Tokens niemals umbenennen, keine zweite Palette danebenstellen.
Vollständige Liste und Bedeutung: `references/tokens.md`.

### Schritt 2: Komponente aus dem Katalog holen

Kopierfertiges Markup und CSS für Card, Button, Input, Badge, Metric-Tile,
Statusmeldung, Papier, Divider, Skeleton, Navigation: `references/komponenten.md`.

Radius nach Rolle, nicht nach Gefühl: 8px Skeleton und Inline-Chip, 14px Feld,
Metrik-Kachel und Statusmeldung, 22px Card und Papier, 32px Demo-Bühne und
Geräterahmen, volle Pille für alles Interaktive. Der einzige bewusste Bruch ist
die 52px-Ecke für ein gespeichertes Artefakt.

### Schritt 3: Kante und Glow setzen

Höchstens eine Kante pro Fläche. `e-bottom` für etwas, das gerade resoniert hat,
`e-left` für das aktive Element in Listen und Navigation, `sr-corner` plus
`e-corner` für gespeicherte Artefakte, `e-partial` für unfertigen Fortschritt.
Regeln, Masken und Fallstricke: `references/komponenten.md`, Abschnitt Spektralkanten.

Danach weiter zu Schritt 9 (Audit).

---

## SCREEN, Ganze Ansicht

### Schritt 4: Layout-Gerüst wählen

`assets/starter.html` als Skelett nehmen. Breakpoints, Grid-Spans und die
Editorial-Disziplin (gestapelte Section-Köpfe, ein Eyebrow pro drei Sections,
keine Haarlinie unter jeder Zeile): `references/layout-responsive.md`.

Mindestens vier verschiedene Layout-Familien pro Seite. Nie drei Bild-Text-Splits
hintereinander.

### Schritt 5: Materialbudget prüfen

Zähle grob durch: 40% warme Luft, 20% Papier, 40% Resonanz. Papier überschreitet
nie 20% und wird nie zum Anwendungshintergrund. Details: `references/tokens.md`,
Abschnitt Materialverhältnis.

### Schritt 6: Motion einbauen

Nur vier Muster: Basis-Reveal, gestaffelte Gruppe, Line-Draw, Hover-Mikrointeraktion.
Konstanten sind fix, nicht nach Gefühl geschätzt. IntersectionObserver, niemals ein
Scroll-Listener. Alle Guards sind Pflicht, `prefers-reduced-motion` entfernt Bewegung,
nicht Sichtbarkeit. Werte und fertiger Code: `references/motion.md`.

Danach weiter zu Schritt 9 (Audit).

---

## VISUAL, Markenvisual, Illustration, Diagramm

### Schritt 7: Verhalten kombinieren

Jedes bedeutende Visual kombiniert mindestens drei von: Trace, Echo, Gap, Bridge,
Spectrum. Nicht jedes Element trägt alle, Zurückhaltung gehört zur Identität.
Bedeutung, Pfad-Parameter und kopierfertige SVG: `references/svg-grammatik.md`.

### Schritt 8: Konstruktionstest bestehen

Sechs Fragen, alle müssen mit Ja beantwortbar sein:

1. Als SVG nachbaubar?
2. Geometrie parametrisierbar?
3. Mit CSS oder JavaScript animierbar?
4. Ohne Textur wiedererkennbar?
5. In Monochrom lesbar?
6. Bei 320px Breite noch verständlich?

Ein Nein heisst: neu konstruieren, nicht nachbessern.

---

## AUDIT, Prüfen vor dem Abliefern

### Schritt 9: Automatischer Check

```bash
python .claude/skills/elanum-designelemente/scripts/check_design.py <datei-oder-ordner>
```

Das Script prüft die maschinell prüfbaren Regeln: verbotene Hintergründe,
`max-width`-Queries, Rahmen auf Flächen, `overflow:hidden` auf gehobenen Flächen,
Gedankenstriche in sichtbarem Text, doppelte Kanten pro Fläche, Glow auf Statusfarben.

### Schritt 10: Acceptance-Checkliste

Die 18 Punkte in `references/acceptance-checkliste.md` einzeln durchgehen. Kein Punkt
wird angenommen, jeder wird geprüft.

### Schritt 11: Verifikation, keine Annahme

Ein korrekt aussehender Diff ist kein Beweis. Den Screen wirklich rendern:

```bash
python .claude/skills/elanum-designelemente/scripts/verify_render.py <datei.html> --shots ./shots
```

Das Script öffnet die Seite bei 320, 375, 768 und 1440px, einmal normal und einmal mit
`prefers-reduced-motion`, und meldet Zahlen: `scrollWidth` gegen `innerWidth`, wie viele
Reveals sichtbar geworden sind, den Grundton und ob unter reduced-motion noch ein
`transform` steht.

Danach die Screenshots tatsächlich anschauen. Ein grüner Lauf ersetzt den Blick nicht,
er stellt nur sicher, dass es etwas zu sehen gibt.

Dann berichten, was konkret geprüft wurde, mit den echten Werten. Nicht behaupten,
geprüft zu haben.

---

## Vertiefungen (nur bei Bedarf laden)

| Thema | Datei |
|---|---|
| Tokens, Palette, Materialverhältnis, Radien | `references/tokens.md` |
| Komponentenkatalog, Spektralkanten, Papier, Status | `references/komponenten.md` |
| Trace, Echo, Gap, Bridge, Spectrum als SVG | `references/svg-grammatik.md` |
| Motion-Konstanten, Guards, Reveal-Code | `references/motion.md` |
| Breakpoints, Grid, Editorial-Disziplin, Copy | `references/layout-responsive.md` |
| Acceptance-Checkliste, 18 Punkte | `references/acceptance-checkliste.md` |
| Pruning der learnings.md | `references/pruning.md` |
| Fertiges Basis-Stylesheet | `assets/base.css` |
| Seitenskelett | `assets/starter.html` |
| Reveal-Observer, fertig | `assets/reveal.js` |
| Regel-Linter | `scripts/check_design.py` |
| Render-Verifikation im Browser | `scripts/verify_render.py` |

## Verwandte Skills

Dieser Skill gilt ausschliesslich für elanum. Für BEYONDER-Material gilt
`beyonder-brand-guidelines`, für Texte in BEYONDER-Stimme `beyonder-brand-voice`.
Niemals die beiden Systeme mischen: elanum hat eigene Tokens, eigene Farben und
eine eigene Bildsprache.

## Eigene Learnings

Vor jedem Lauf: `references/learnings.md` lesen und die gesammelten Regeln anwenden.
Nach der Session: `wrap-up`-Skill nutzen, damit neue Muster dort landen.
