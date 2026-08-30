# SVG-Grammatik: Trace, Echo, Gap, Bridge, Spectrum

Die fünf Verhalten sind die Bildsprache von elanum. Jedes bedeutende Visual kombiniert
mindestens drei davon. Nicht jedes Element trägt alle, Zurückhaltung gehört zur Identität.

Voraussetzung: `svg{overflow:visible}` global gesetzt, sonst beschneidet der
SVG-Viewport den Glow.

## Trace

Ein Trace steht für eine Person, einen Zustand, einen Prozess oder eine Richtung.

Parameter: kubische Bézier, Strichstärke 1.25 bis 2px, runde Enden, kein Fill, wenige
Richtungswechsel, kontrollierte Asymmetrie. **Nie eine beliebige Sinuskurve.**

```html
<svg viewBox="0 0 400 150">
  <path class="sr-draw" style="--len:460"
        d="M20 118C74 112 96 42 158 48S258 116 380 62"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

Ein Trace in Tinte (`currentColor`) leuchtet nicht. Nur ein farbiger Trace bekommt
seine Glow-Klasse.

## Echo

Ein zweiter Trace, der dem ersten in 2 bis 4px Versatz folgt, bei 30 bis 55% Deckkraft,
in Violet, Blue, Rose oder Pink. Bedeutung: Resonanz, Erinnerung, Einfluss. Er trägt
den Glow seiner eigenen Farbe.

```html
<svg viewBox="0 0 400 150">
  <path class="sr-draw" style="--len:460"
        d="M20 112C74 106 96 36 158 42S258 110 380 56"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path class="glow-violet sr-draw sr-draw--echo" style="--len:460"
        d="M20 115C74 109 96 39 158 45S258 113 380 59"
        fill="none" stroke="#6756D9" stroke-width="1.25" stroke-linecap="round" opacity=".5"/>
  <path class="glow-rose sr-draw sr-draw--echo" style="--len:460"
        d="M20 118.5C74 112.5 96 42.5 158 48.5S258 116.5 380 62.5"
        fill="none" stroke="#D85BA9" stroke-width="1.25" stroke-linecap="round" opacity=".42"/>
</svg>
```

Der Versatz entsteht durch Addition auf die Y-Werte des Primärpfads, nicht durch
`transform`. So bleibt die Kurvenform identisch und das Echo folgt wirklich.

## Gap

Wichtige Formen bleiben bewusst unvollständig: Autonomie, Potenzial, Luft,
unaufgelöste Möglichkeit.

```html
<svg viewBox="0 0 400 150">
  <circle cx="112" cy="75" r="52" fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-dasharray="252 75" transform="rotate(-52 112 75)"/>
  <circle cx="248" cy="75" r="30" fill="none" stroke="var(--sr-line)" stroke-width="1.5"
          stroke-linecap="round" stroke-dasharray="140 48" transform="rotate(120 248 75)"/>
  <path d="M312 75h68" stroke="var(--sr-line)" stroke-width="1.5"
        stroke-linecap="round" stroke-dasharray="26 14"/>
</svg>
```

Kreise nutzen `stroke-dasharray` mit **einer klaren Öffnung**, nicht mit einer
gleichmässigen Strichelung. Die Rotation setzt die Öffnung dorthin, wo sie erzählt.

Gaps leben auch ausserhalb von SVG: in Dividern, Zeitleisten und Navigation.

## Bridge

Eine kurze kubische Bézier, die zwei sonst unabhängige Traces verbindet. Bedeutung:
Beziehung. Optional mit Spektralstrich. Keine Pfeile, kein technischer Konnektor-Stil.

```html
<svg viewBox="0 0 400 150">
  <defs>
    <linearGradient id="spec-bridge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6756D9"/>
      <stop offset="50%" stop-color="#9466DF"/>
      <stop offset="100%" stop-color="#F0719A"/>
    </linearGradient>
  </defs>
  <path d="M18 46C62 40 96 58 140 52" fill="none" stroke="currentColor"
        stroke-width="1.5" stroke-linecap="round"/>
  <path d="M262 112C304 106 340 122 384 114" fill="none" stroke="currentColor"
        stroke-width="1.5" stroke-linecap="round"/>
  <path class="glow-spectrum sr-draw" style="--len:180" d="M140 52C176 52 214 108 262 111"
        fill="none" stroke="url(#spec-bridge)" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="140" cy="52" r="3.2" fill="currentColor"/>
  <circle cx="262" cy="111" r="3.2" fill="currentColor"/>
</svg>
```

Die Endpunkte sitzen exakt auf den Enden der beiden Traces. Eine Bridge, die daneben
endet, liest sich als Fehler.

Ein offener Endpunkt darf atmen, das ist das eine erlaubte Dauersignal:

```css
.sr-pulse{transform-box:fill-box;transform-origin:center;
  animation:sr-breathe 2.6s ease-in-out infinite}
@keyframes sr-breathe{0%,100%{transform:scale(1);opacity:1}
                      50%{transform:scale(1.45);opacity:.55}}
```

## Spectrum

Violet, Blue, Orchid, Rose, Pink, in dieser festen Reihenfolge. Es markiert alles, was
sich ändert, verbindet, aktiviert oder bedeutsam wird. Nie ein generischer Hintergrund.

```css
.sr-spectrum-bar{
  background:var(--sr-spectrum);border-radius:99px;
  box-shadow:0 0 6px rgba(148,102,223,.70),0 0 16px rgba(148,102,223,.45),
             0 0 34px rgba(216,91,169,.35),0 2px 6px rgba(138,107,69,.14);
}
```

Für Verläufe in SVG immer einen `<linearGradient>` mit eindeutiger ID definieren. Bei
mehreren Instanzen auf einer Seite die IDs durchnummerieren, sonst greift die erste
Definition für alle.

## Line-Draw

Traces zeichnen sich einmal, wenn sie ins Bild kommen. Das Zeichnen ist die Marke, also
ist es das eine, was animiert.

```css
.sr-draw{stroke-dasharray:var(--len,600);stroke-dashoffset:var(--len,600)}
.is-in .sr-draw{animation:sr-draw 1s var(--sr-power3-out) forwards}
.is-in .sr-draw--echo{animation-delay:.12s}
@keyframes sr-draw{to{stroke-dashoffset:0}}
```

`--len` ist die ungefähre Pfadlänge, grosszügig aufgerundet. Zu klein geschätzt bricht
die Zeichnung ab, zu gross verzögert nur den sichtbaren Start.

## Instrumente: feste Geometrie zuerst

Ein Navigationsinstrument, also ein Rad, ein Regler, eine Skala, folgt einer anderen
Reihenfolge als ein freies Markenvisual. Bei einem Instrument ist die exakte Geometrie
die Informationsarchitektur, und Trace, Echo und Spectrum sind nur die Sprache darüber.

- Die Silhouette bleibt jederzeit exakt, ein Kreis bleibt ein Kreis.
- Alle Pfade werden aus Polarkoordinaten berechnet, keiner wird von Hand gezeichnet.
- Gleichartige Elemente teilen denselben Radius, keine variierenden Aussenkanten.
- Trace, Echo und Spectrum sitzen entlang dieser Geometrie, sie verformen sie nicht.

Wer die Signatur die Form eines Instruments bestimmen lässt, bekommt eine organische
Blob-Form, die nicht mehr als Instrument gelesen wird. Beispiel im Repository:
`components/personal-wheel/`.

## Konstruktionstest

Sechs Fragen. Alle müssen mit Ja beantwortbar sein, sonst wird das Visual neu
konstruiert, nicht nachgebessert.

1. Als SVG nachbaubar?
2. Geometrie parametrisierbar?
3. Mit CSS oder JavaScript animierbar?
4. Ohne Textur wiedererkennbar?
5. In Monochrom lesbar?
6. Bei 320px Breite noch verständlich?

Verboten in Markenelementen: Rastertexturen, generative Artworks, handgemalte Assets,
KI-generierte Bilder.

## Inline-Glyphe

Markengeometrie auf Texthöhe, nie ein Rasterbild:

```css
.sr-inline-glyph{display:inline-block;vertical-align:-.12em;height:.72em;width:auto;
  margin:0 .12em;border-radius:99px}
```
