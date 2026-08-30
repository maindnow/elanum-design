# Tokens, Palette, Material

Der komplette `:root`-Block liegt kopierfertig in `assets/base.css`. Diese Datei
erklärt, was die Tokens bedeuten und wo sie gelten. Tokens nie umbenennen, nie eine
zweite Palette danebenstellen.

## Grund und Flächen

| Token | Wert | Rolle |
|---|---|---|
| `--sr-canvas` | `#F6F1E5` | Der Grund. Warmes Papierlicht. Nie Weiss, nie Grau, nie dunkel. |
| `--sr-surface` | `#FFFCF5` | Gehobene Fläche |
| `--sr-surface-top` | `#FFFEFA` | Oberer Punkt des Flächenverlaufs |
| `--sr-ink` | `#16363B` | Tinte, der einzige Textton für Primärtext |
| `--sr-secondary` | `#5B6660` | Sekundärtext |
| `--sr-line` | `#E4DCCB` | Haarlinie, sparsam einsetzen |
| `--sr-warm` | `#8A6B45` | Der eine Schattenton im System |
| `--sr-light-edge` | `rgba(255,255,255,.95)` | Lichtkante oben auf jeder Fläche |

Es gibt genau einen Schattenton: `rgba(138,107,69, …)`. Nie Schwarz, nie Blaugrau.

## Papier, das tiefere Material

| Token | Wert |
|---|---|
| `--sr-paper` | `#EDE1C6` |
| `--sr-paper-light` | `#F4EBD6` |
| `--sr-paper-ink` | `#2A2118` |

Papier ist für Journal-Momente, persönliche Einsichten, Zitate, gespeicherte
Reflexionen und emotionale Zusammenfassungen. Weil der Grund schon Papier ist, muss
dieses Material **dunkler und körniger** sein, nicht nur getönt.

## Resonanz

| Token | Wert | Name |
|---|---|---|
| `--sr-violet` | `#6756D9` | Violet |
| `--sr-blue` | `#4D7FE8` | Blue |
| `--sr-orchid` | `#9466DF` | Orchid |
| `--sr-rose` | `#D85BA9` | Rose |
| `--sr-pink` | `#F0719A` | Pink |

Die Reihenfolge ist fix: Violet, Blue, Orchid, Rose, Pink.

```css
--sr-spectrum:linear-gradient(90deg,#6756D9 0%,#4D7FE8 26%,#9466DF 52%,#D85BA9 78%,#F0719A 100%);
```

Das Spektrum markiert alles, was sich ändert, verbindet, aktiviert oder bedeutsam
wird. Nie ein generischer Hintergrund, nie ein Regenbogenrahmen um jede Komponente.

## Status, bewusst ausserhalb des Spektrums

| Rolle | Text | Fläche |
|---|---|---|
| Info | `#33638F` | `rgba(51,99,143,.10)` |
| Success | `#3F7350` | `rgba(63,115,80,.11)` |
| Warning | `#8A5A16` | `rgba(138,90,22,.12)` |
| Danger | `#A32F3C` | `rgba(163,47,60,.10)` |
| Neutral | `#5B6660` | `rgba(91,102,96,.09)` |

Spektrum heisst: etwas ist verbunden. Status heisst: etwas muss gewusst werden.
Danger ist nie Rose oder Pink, das würde als Resonanz gelesen. Alle fünf bestehen
WCAG AA auf dem Grund und auf einer Fläche.

## Relief

```css
--sr-emboss:
  inset 0 1.5px 0 var(--sr-light-edge),
  inset 0 -2px 3px rgba(138,107,69,.13),
  0 1px 2px rgba(138,107,69,.10),
  0 12px 22px -10px rgba(138,107,69,.18),
  0 34px 64px -26px rgba(138,107,69,.26);
```

Lichtkante oben, warmer Innenschatten unten, breiter warmer Hof darunter. Der Hof ist
absichtlich breiter als die Fläche, damit ein gehobenes Element das Papier überlappt,
statt in einer Box zu sitzen.

- `--sr-emboss-raised` für stärker gehobene Elemente (Topbar, Demo-Bühne, Geräterahmen)
- `--sr-elev-resonance` für den Moment, in dem etwas resoniert: Raised plus zwei
  farbige Höfe in Violet und Rose

Eingabefelder sind die Umkehrung, ins Papier **hineingedrückt**:
`inset 0 2px 4px rgba(138,107,69,.14)`, kein Rahmen.

Braucht ein gehobenes Element extra Trennung, kommt ein weicher Aussenring dazu:

```css
.sr-bezel{
  margin:10px;
  box-shadow:0 0 0 9px rgba(138,107,69,.035),
             0 0 0 10px rgba(138,107,69,.05),
             var(--sr-emboss-raised);
}
```

Die 10px Margin sind Pflicht, sonst wird der Ring beschnitten.

Kein Glassmorphism, kein Neumorphism, kein harter Schlagschatten.

## Glow

Glow sind drei `drop-shadow`-Stufen in der **eigenen** Farbe der Linie, bei 2px, 7px
und 18px. Kein weisser Kern, kein fremder warmer Ring, kein `box-shadow`-Bloom auf Text.

```css
--sr-glow-violet:
  drop-shadow(0 0 2px rgba(103,86,217,.90))
  drop-shadow(0 0 7px rgba(103,86,217,.60))
  drop-shadow(0 0 18px rgba(103,86,217,.34));
```

Analog für Blue `77,127,232`, Orchid `148,102,223`, Rose `216,91,169`, Pink `240,113,154`.
Das Spektrum-Glow mischt: `148,102,223` bei .85, `179,97,196` bei .55, `216,91,169` bei .34.

**Was leuchtet:** Spektralkanten, Spektrum-Balken, aktive Indikatoren, das
Resonanz-Badge, farbige Traces und Echos.
**Was nie leuchtet:** Tinte, Fliesstext, alle fünf Statusfarben.

## Geometrie und Raum

```css
--sr-r-sm:8px; --sr-r-md:14px; --sr-r-lg:22px; --sr-r-xl:32px;
--s1:4px; --s2:8px; --s3:12px; --s4:16px; --s5:24px;
--s6:32px; --s7:48px; --s8:64px; --s9:96px;
```

Eine Radius-Skala, eine Rolle pro Stufe:

| Radius | Rolle |
|---|---|
| 8px | Skeleton, Inline-Chip |
| 14px | Feld, Metrik-Kachel, Statusmeldung |
| 22px | Card, Papier |
| 32px | Demo-Bühne, Geräterahmen |
| Pille (99px) | Alles Interaktive: Button, Badge, Eyebrow, Navigation |
| 52px | Der eine bewusste Bruch: markiert ein gespeichertes Artefakt |

Nie Systeme mischen. Keine eckigen Cards auf einer Seite mit Pillen-Buttons.

## Typografie

| Rolle | Familie | Grösse / Zeile | Gewicht / Laufweite |
|---|---|---|---|
| Display | Geist | clamp(34 bis 58px) / 1.15 | 300 / -.035em |
| Section | Geist | clamp(24 bis 34px) / 1.15 | 400 / -.03em |
| Body | Geist | 16px / 1.65, max 62ch | 400 / 0 |
| Eyebrow-Pille | Geist | 10px / 1.4 | 500 / .2em uppercase |
| Papier-Zitat | Instrument Serif | 22px / 1.4 | 400 / 0 |
| Code, Tokens | Geist Mono | 13px / 1.6 | 400 / 0 |

Headlines sind leicht und eng gesetzt, nie fett. Serif erscheint **nur** auf
Papierflächen. Hierarchie kommt aus Gewicht und Farbe, nicht aus roher Grösse.

## Materialverhältnis 40 / 20 / 40

- **40% warme Luft:** der Grund selbst, Abstände, leere Flächen
- **20% tieferes Papier:** Papierflächen, dunklere Materialmomente
- **40% Resonanzfarbe:** Traces, Echos, Kanten, Spektrum-Elemente, aktive Zustände

Resonanz ist präsent, nicht selten. Wenn ein Screen grau und leer wirkt, fehlt
Resonanz, nicht Kontrast. Papier überschreitet nie 20% und wird nie zum
Anwendungshintergrund.
