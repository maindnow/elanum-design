# Motion

Die Konstanten sind fix. Sie werden nicht nach Gefühl geschätzt.

## Konstanten

| Moment | Werte |
|---|---|
| Reveal, normaler Block | `y 2.4rem / 0.9s / power2.out / einmal / Trigger top 88%` |
| Reveal, kleines Element | `y 1.6rem / Trigger top 92%` |
| Reveal, ganze Section | `y 3.2rem / Trigger top 85%` |
| Stagger | `Cards 0.12s / Zeichen 0.04s / Hero 0.14s` |
| Line-Draw | `scaleX 0 auf 1 / 1s / power3.out / origin left / top 92%` |
| Hover und Press | `150 bis 250ms / power2.out` |
| Zustandswechsel | `240ms / ease-out` |
| Gescrubbte Bewegung | `ease none, immer` |

```css
--sr-power2-out:cubic-bezier(.215,.61,.355,1);
--sr-power3-out:cubic-bezier(.165,.84,.44,1);
--sr-ease-out:cubic-bezier(.23,1,.32,1);
```

## Erlaubte Muster

Eine Produkt- oder Dokumentationsfläche nutzt genau vier Muster:

1. Basis-Reveal
2. Gestaffelte Gruppe
3. Line-Draw
4. Hover-Mikrointeraktion

Kein Smooth-Scroll-Layer, kein gepinntes Kapitel, keine Parallaxe, kein Ambient-Effekt.

Genau **ein** Dauersignal ist erlaubt, und nur dort, wo es etwas bedeutet. Beispiel:
der Endpunkt einer offenen Bridge atmet, solange die Verbindung offen ist.

## Reveal-CSS

```css
.sr-fade{opacity:0;transform:translateY(2.4rem)}
.sr-fade--sm{transform:translateY(1.6rem)}
.sr-fade--lg{transform:translateY(3.2rem)}
.is-in .sr-fade,.sr-fade.is-in{animation:sr-fade .9s var(--sr-power2-out) forwards}
@keyframes sr-fade{to{opacity:1;transform:none}}

/* Gestaffelte Gruppe, 0.12s zwischen Geschwistern, Container ist der Trigger */
.is-in .sr-fade:nth-child(2){animation-delay:.12s}
.is-in .sr-fade:nth-child(3){animation-delay:.24s}
.is-in .sr-fade:nth-child(4){animation-delay:.36s}
.is-in .sr-fade:nth-child(5){animation-delay:.48s}
```

## Reveal-JavaScript

IntersectionObserver, niemals ein Scroll-Listener. Jeder Reveal läuft einmal.

```js
(function(){
  var groups = [
    { sel:'[data-reveal="sm"]',            margin:'0px 0px -8% 0px'  },
    { sel:'[data-reveal="lg"], section',   margin:'0px 0px -15% 0px' },
    { sel:'[data-reveal], .sr-fade, .sr-rule-line', margin:'0px 0px -12% 0px' }
  ];
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('[data-reveal], .sr-fade, .sr-rule-line')
      .forEach(function(t){ t.classList.add('is-in'); });
    return;
  }
  groups.forEach(function(g){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    },{ threshold:0.01, rootMargin:g.margin });
    document.querySelectorAll(g.sel).forEach(function(t){ io.observe(t); });
  });
})();
```

Die `rootMargin`-Werte sind der Viewport-Offset, der genau die Triggerpunkte aus der
Tabelle erzeugt: -8% für 92%, -12% für 88%, -15% für 85%.

`io.unobserve` ist nicht optional. Es sorgt dafür, dass Zurückscrollen den Reveal nie
wiederholt.

## Scroll-Fortschritt ohne Scroll-Listener

Wenn eine Fortschrittsanzeige nötig ist, läuft sie über eine CSS-Scroll-Timeline:

```css
@supports (animation-timeline:scroll()){
  .sr-progress{opacity:1}
  .sr-progress__fill{animation:sr-progress linear;animation-timeline:scroll(root block)}
}
@keyframes sr-progress{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
```

Kein Main-Thread-Aufwand, kein Listener. Ohne `@supports` bleibt sie unsichtbar, das
ist ein gültiger Zustand.

## Guards, alle Pflicht

- **`prefers-reduced-motion`:** alles bleibt sichtbar, Bewegung verschwindet, Deckkraft
  bleibt, Schleifen stoppen. Nicht "keine Animation", sondern **keine Bewegung**.
- Reveals laufen einmal. Zurückscrollen wiederholt sie nie.
- Text-Splits warten auf `document.fonts.ready`.
- Nur `transform` und `opacity`. Nie `width`, `height`, `top`, `left`.
- `will-change` nur während der Sequenz, danach zurück auf `auto`.
- Hover hinter `(hover:hover) and (pointer:fine)`, jeweils mit `:focus-visible`-Äquivalent.
- **Kein Scroll-Listener.** IntersectionObserver oder CSS-Scroll-Timeline, sonst nichts.

## Reduced-Motion-Block

Diesen Block vollständig übernehmen, er ist Teil der Abnahme:

```css
@media (prefers-reduced-motion:reduce){
  .sr-draw,.is-in .sr-draw{stroke-dashoffset:0;animation:none}
  .sr-fade{opacity:0;transform:none;filter:none}
  .is-in .sr-fade{animation:sr-fade-opacity .25s ease forwards}
  @keyframes sr-fade-opacity{to{opacity:1}}
  .sr-skel::after{animation:none}
  .sr-pulse{animation:none}
  .sr-progress__fill{animation:none}
  .sr-btn:hover,.sr-btn:active{transform:none}
  .sr-rule-line,.is-in .sr-rule-line{transform:none;animation:none}
  .sr-edge{transition:none}
  html{scroll-behavior:auto}
}
```

Wichtig am Muster: `.sr-fade` startet weiterhin bei `opacity:0`, aber ohne
`translateY`. Der Inhalt blendet in 0.25s ein, bewegt sich aber nicht. So bleibt nichts
unsichtbar, falls der Observer nicht feuert, und es bewegt sich trotzdem nichts.
