# Komponentenkatalog

Kopierfertiges Markup und CSS. Alles setzt den `:root`-Block aus `assets/base.css`
voraus. Jede Komponente hat `border:0` und ein Emboss-Token.

## Fläche, die Grundform

```css
.sr-card{
  background:linear-gradient(180deg,var(--sr-surface-top) 0%,var(--sr-surface) 62%,#FCF7EC 100%);
  border:0;
  border-radius:var(--sr-r-lg);
  padding:var(--s5);
  box-shadow:var(--sr-emboss);
  position:relative;              /* nie overflow:hidden */
}
.sr-card--flat{box-shadow:none}
.sr-card--resonance{box-shadow:var(--sr-elev-resonance)}
```

`position:relative` ist nötig, weil die Spektralkante absolut darin sitzt.
`overflow:hidden` ist verboten, es würde den Hof abschneiden.

## Spektralkanten

Eine Kante ist ein Ring auf der Flächenkontur, folgt also dem Eckenradius, und blendet
immer aus, statt hart abzubrechen.

```html
<div class="sr-card">
  <span class="sr-edge e-bottom"><i></i></span>
  …
</div>
```

```css
.sr-edge{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:1;
         transition:opacity 240ms var(--sr-ease-out)}
.sr-edge>i{
  position:absolute;inset:0;border-radius:inherit;padding:2px;
  background:var(--sr-spectrum);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;
  filter:var(--sr-glow-spectrum);
}
.e-bottom{mask-image:linear-gradient(to top,#000 0 9px,transparent 46px)}
.e-left  {mask-image:linear-gradient(to right,#000 0 9px,transparent 44px)}
.e-corner{mask-image:radial-gradient(124px 124px at 100% 0,#000 26%,transparent 64%)}
.sr-corner{border-top-right-radius:52px}
.e-partial{
  mask-image:linear-gradient(to top,#000 0 9px,transparent 44px),
             linear-gradient(to right,#000 0 42%,transparent 74%);
  mask-composite:intersect;
}
```

Das `<span>` trägt die Ausblendmaske, das `<i>` trägt den Ring. Für WebKit jeweils
die `-webkit-mask-*`-Varianten mitschreiben, `-webkit-mask-composite:source-in` statt
`intersect`.

| Kante | Bedeutung |
|---|---|
| `e-bottom` | Standard. Etwas hat gerade resoniert. |
| `e-left` | Aktives Element in Listen und Navigation. |
| `sr-corner` + `e-corner` | Gespeichertes oder exportiertes Artefakt. Die Ecke wird weggerundet, nicht abgeschnitten. |
| `e-partial` | Unfertiger Fortschritt. |

Regeln:

- Ausblendungen sind in **Pixeln**, damit eine Kante auf einer kleinen Metrik-Kachel
  gleich lang wirkt wie auf einer grossen Card. Die einzige Ausnahme ist der
  horizontale Schnitt der Teilkante, der bleibt in Prozent, weil seine Länge die
  Botschaft ist: wie weit die Arbeit kam.
- Nie zwei Kanten auf einer Fläche, nie ein voller Ring.

## Button

```css
.sr-btn{
  display:inline-flex;align-items:center;gap:10px;
  font:500 14px/1 var(--sr-sans);
  padding:11px 12px 11px 20px;border-radius:99px;border:0;min-height:44px;
  background:linear-gradient(180deg,var(--sr-surface-top),#FBF5EA);
  color:var(--sr-ink);cursor:pointer;box-shadow:var(--sr-emboss);
  transition:transform 160ms var(--sr-ease-out),box-shadow 200ms var(--sr-ease-out);
}
.sr-btn:not(:has(.sr-btn__icon)){padding:12px 20px}
.sr-btn__icon{width:30px;height:30px;border-radius:99px;display:grid;place-items:center;
  background:rgba(18,42,48,.05);transition:transform 200ms var(--sr-ease-out)}
.sr-btn--primary{background:var(--sr-ink);color:#fff}
.sr-btn--primary .sr-btn__icon{background:rgba(255,255,255,.14)}
.sr-btn--spectral{position:relative;background:var(--sr-surface);
  box-shadow:0 0 12px rgba(148,102,223,.22),0 0 26px rgba(216,91,169,.16),var(--sr-emboss)}
.sr-btn--spectral::before{
  content:"";position:absolute;inset:0;border-radius:inherit;padding:1.4px;
  background:var(--sr-spectrum);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;
}
.sr-btn--ghost{background:transparent;color:var(--sr-secondary)}
@media (hover:hover) and (pointer:fine){
  .sr-btn:hover{box-shadow:var(--sr-emboss-raised);transform:translateY(-1px)}
  .sr-btn:hover .sr-btn__icon{transform:translate(2px,-1px) scale(1.06)}
}
.sr-btn:active{transform:scale(.98);box-shadow:none}
```

Hover immer hinter `(hover:hover) and (pointer:fine)`, jeweils mit einem
`:focus-visible`-Äquivalent. Mindesthöhe 44px auf jedem Viewport.

## Eingabefeld

Das Feld ist die Umkehrung der Fläche, ins Papier hineingedrückt.

```css
.sr-input{
  width:100%;font:400 15px/1.4 var(--sr-sans);color:var(--sr-ink);
  background:#FBF6EC;border:0;border-radius:var(--sr-r-md);padding:12px 14px;outline:none;
  box-shadow:inset 0 2px 4px rgba(138,107,69,.14),inset 0 -1px 0 rgba(255,255,255,.8);
  transition:box-shadow .2s ease;
}
.sr-input:focus{
  box-shadow:inset 0 2px 4px rgba(138,107,69,.10),
             0 0 0 3px rgba(103,86,217,.13),
             0 0 14px rgba(148,102,223,.22);
}
.sr-input::placeholder{color:#9AA5A8}
```

## Badge, Punkt, Divider

```css
.sr-badge{
  display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;
  padding:5px 11px;border-radius:99px;border:0;color:var(--sr-secondary);
  background:linear-gradient(180deg,var(--sr-surface-top),var(--sr-surface));
  box-shadow:var(--sr-emboss);
}
.sr-badge--resonant{
  color:var(--sr-violet);background:rgba(103,86,217,.09);
  box-shadow:0 0 10px rgba(103,86,217,.20),inset 0 1px 0 rgba(255,255,255,.7);
}
.sr-dot{width:6px;height:6px;border-radius:99px;background:var(--sr-spectrum);
  box-shadow:0 0 6px rgba(216,91,169,.7)}
/* Divider mit Gap, die Lücke ist Absicht */
.sr-divider{display:block;width:100%;height:1px;border:0;background:
  linear-gradient(90deg,var(--sr-line) 0 34%,transparent 34% 46%,var(--sr-line) 46% 100%)}
```

Der Punkt ist erlaubt, weil er Resonanz bedeutet. Dekorative Statuspunkte ohne
Bedeutung sind verboten.

## Metrik-Kachel

```css
.sr-metric{
  background:linear-gradient(180deg,var(--sr-surface-top),var(--sr-surface));
  border:0;border-radius:var(--sr-r-md);padding:var(--s4);
  position:relative;box-shadow:var(--sr-emboss);
}
.sr-metric b{display:block;font-size:26px;font-weight:400;letter-spacing:-.02em;margin-bottom:2px}
.sr-metric span{font-size:12px;color:var(--sr-secondary)}
```

Keine erfundenen Zahlen, die als echte Daten auftreten.

## Statusmeldung

```css
.sr-msg{
  display:flex;gap:10px;align-items:flex-start;font-size:13.5px;line-height:1.55;
  border-radius:var(--sr-r-md);padding:12px 14px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.6);
}
.sr-msg--info{background:var(--sr-info-bg);color:var(--sr-info)}
.sr-msg--success{background:var(--sr-success-bg);color:var(--sr-success)}
.sr-msg--warning{background:var(--sr-warning-bg);color:var(--sr-warning)}
.sr-msg--danger{background:var(--sr-danger-bg);color:var(--sr-danger)}
.sr-msg--neutral{background:var(--sr-neutral-status-bg);color:var(--sr-neutral-status)}
```

Icon plus Text auf einem 10 bis 12% Ton der eigenen Farbe, sonst nichts. Kein Glow.
Jede Meldung sagt, was passiert ist und was daraus folgt. Keine nackten Fehlercodes.
Fehler melden inline, nie als Modal für etwas, das eine Textzeile tragen kann.

Beispiele, die den Ton treffen:
`Reflection saved. It now sits in your journal under 14 March.`
`Nothing changed today. That is a valid state, not an error.`

## Papier

```css
.sr-paper{
  background:
    radial-gradient(120% 80% at 50% 0%,rgba(255,255,255,.55) 0%,rgba(255,255,255,0) 60%),
    linear-gradient(180deg,var(--sr-paper-light) 0%,var(--sr-paper) 62%,#E6D8B8 100%);
  color:var(--sr-paper-ink);border:0;border-radius:var(--sr-r-lg);position:relative;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.7),
    inset 0 -1.5px 3px rgba(138,107,69,.14),
    0 2px 4px rgba(138,107,69,.10),
    0 18px 34px -16px rgba(138,107,69,.24),
    0 46px 84px -38px rgba(138,107,69,.26);
}
.sr-paper::before{
  content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;
  background-image:var(--sr-grain);background-size:160px 160px;
  opacity:.035;mix-blend-mode:multiply;
}
.sr-quote{font-family:var(--sr-serif);font-size:22px;line-height:1.45;font-weight:300}
```

Korn ist 3.5% monochrom und prozedural, aus `feTurbulence` in einem Inline-SVG-Data-URI.
Nie eine Rastertextur-Datei. Der Token dafür ist `--sr-grain` in `assets/base.css`.

## Skeleton und leerer Zustand

```css
.sr-skel{position:relative;overflow:hidden;background:#EFE7D6;border-radius:8px;height:12px}
.sr-skel::after{
  content:"";position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);
  transform:translateX(-100%);animation:sr-shimmer 1.6s linear infinite;
}
@keyframes sr-shimmer{to{transform:translateX(100%)}}
```

Das Skeleton ist die eine Stelle, an der `overflow:hidden` erlaubt ist, weil es keinen
Hof und keinen Glow trägt. Bei `prefers-reduced-motion` läuft der Shimmer nicht.

## Navigation

Aktives Element in der Seitenleiste bekommt eine 2px-Spektrallinie links:

```css
.sr-side a.is-active::before{
  content:"";position:absolute;left:-12px;top:22%;bottom:22%;width:2px;
  background:var(--sr-spectrum);border-radius:99px;
}
```

Auf dem Telefon wird die Seitenleiste nicht geschrumpft, sondern zur unteren Leiste.
Dort wandert dieselbe Linie unter das aktive Element:

```css
.sr-phone__nav a.is-active::after{
  content:"";position:absolute;left:26%;right:26%;bottom:2px;height:2px;border-radius:99px;
  background:var(--sr-spectrum);
  box-shadow:0 0 6px rgba(148,102,223,.75),0 0 14px rgba(216,91,169,.4);
}
```
