# SoulResonance, Design Prompt

Hand this file to the agent working in the repository. It is the complete design
instruction for the SoulResonance interface language. The living reference
implementation is `docs/soulresonance-styleguide.html`; when this document and that
file disagree, the file wins and this document gets corrected.

---

## 0. Your job

Build interfaces in the SoulResonance language. Do not invent a new visual system, do
not soften this one into a generic SaaS look, and do not reach for a component library's
defaults. Every screen you produce has to pass the acceptance checklist in section 13
before you call it done.

The system is **digital first and human by texture**. It sits on warm paper, its
geometry is programmable SVG, and its colour is light: coloured lines glow, ink does not.

---

## 1. Non-negotiables

Break any of these and the work is wrong, regardless of how good it looks.

1. **The ground is warm paper light `#F6F1E5`.** Never white, never grey, never dark. There
   is no dark mode.
2. **Material ratio 40 / 20 / 40:** 40% warm air, 20% deeper paper, 40% resonance colour.
   Resonance is present, not rare.
3. **Every brand visual is constructible from SVG paths, circles, masks, gradients,
   clipping paths and opacity, animated with CSS or JavaScript.** No raster textures, no
   generative artwork, no hand-painted assets, no AI-generated imagery in brand elements.
4. **Coloured lines glow in their own colour. Ink never glows. Status never glows.**
5. **Surfaces are pressed out of the paper**, never boxed by a border.
6. **Shadows and glows are never clipped.** The only clipping surface in the system is a
   device frame.
7. **One narrow spectral edge per surface**, following the corner radius and fading out.
8. **Mobile first**, `min-width` queries only. There is not a single `max-width` query.

---

## 2. Design tokens

Copy this block verbatim into the project's global stylesheet. Do not rename tokens, do
not add a second palette next to it.

```css
:root{
  /* Ground and surfaces */
  --sr-canvas:#F6F1E5;        /* the ground, warm paper light */
  --sr-surface:#FFFCF5;       /* raised surface */
  --sr-surface-top:#FFFEFA;   /* top of the surface gradient */
  --sr-ink:#16363B;
  --sr-secondary:#5B6660;
  --sr-line:#E4DCCB;
  --sr-warm:#8A6B45;          /* the one shadow hue in the system */
  --sr-light-edge:rgba(255,255,255,.95);

  /* Paper, a deeper material for personal moments */
  --sr-paper:#EDE1C6;
  --sr-paper-light:#F4EBD6;
  --sr-paper-ink:#2A2118;

  /* Resonance */
  --sr-violet:#6756D9;
  --sr-blue:#4D7FE8;
  --sr-orchid:#9466DF;
  --sr-rose:#D85BA9;
  --sr-pink:#F0719A;
  --sr-spectrum:linear-gradient(90deg,#6756D9 0%,#4D7FE8 26%,#9466DF 52%,#D85BA9 78%,#F0719A 100%);

  /* Status, deliberately outside the spectrum */
  --sr-info:#33638F;      --sr-info-bg:rgba(51,99,143,.10);
  --sr-success:#3F7350;   --sr-success-bg:rgba(63,115,80,.11);
  --sr-warning:#8A5A16;   --sr-warning-bg:rgba(138,90,22,.12);
  --sr-danger:#A32F3C;    --sr-danger-bg:rgba(163,47,60,.10);
  --sr-neutral-status:#5B6660; --sr-neutral-status-bg:rgba(91,102,96,.09);

  /* Relief: pressed out of the paper */
  --sr-emboss:
    inset 0 1.5px 0 var(--sr-light-edge),
    inset 0 -2px 3px rgba(138,107,69,.13),
    0 1px 2px rgba(138,107,69,.10),
    0 12px 22px -10px rgba(138,107,69,.18),
    0 34px 64px -26px rgba(138,107,69,.26);
  --sr-emboss-raised:
    inset 0 1.5px 0 var(--sr-light-edge),
    inset 0 -2.5px 4px rgba(138,107,69,.15),
    0 2px 5px rgba(138,107,69,.12),
    0 20px 34px -14px rgba(138,107,69,.24),
    0 56px 92px -34px rgba(138,107,69,.30);
  --sr-elev-resonance:
    var(--sr-emboss-raised),
    0 4px 22px rgba(103,86,217,.16),
    0 14px 44px rgba(216,91,169,.14);

  /* Glow: three steps of the line's own hue */
  --sr-glow-violet:
    drop-shadow(0 0 2px rgba(103,86,217,.90))
    drop-shadow(0 0 7px rgba(103,86,217,.60))
    drop-shadow(0 0 18px rgba(103,86,217,.34));
  --sr-glow-blue:
    drop-shadow(0 0 2px rgba(77,127,232,.90))
    drop-shadow(0 0 7px rgba(77,127,232,.60))
    drop-shadow(0 0 18px rgba(77,127,232,.34));
  --sr-glow-orchid:
    drop-shadow(0 0 2px rgba(148,102,223,.90))
    drop-shadow(0 0 7px rgba(148,102,223,.60))
    drop-shadow(0 0 18px rgba(148,102,223,.34));
  --sr-glow-rose:
    drop-shadow(0 0 2px rgba(216,91,169,.90))
    drop-shadow(0 0 7px rgba(216,91,169,.60))
    drop-shadow(0 0 18px rgba(216,91,169,.34));
  --sr-glow-pink:
    drop-shadow(0 0 2px rgba(240,113,154,.90))
    drop-shadow(0 0 7px rgba(240,113,154,.60))
    drop-shadow(0 0 18px rgba(240,113,154,.34));
  --sr-glow-spectrum:
    drop-shadow(0 0 2px rgba(148,102,223,.85))
    drop-shadow(0 0 8px rgba(179,97,196,.55))
    drop-shadow(0 0 20px rgba(216,91,169,.34));

  /* Geometry and space */
  --sr-r-sm:8px; --sr-r-md:14px; --sr-r-lg:22px; --sr-r-xl:32px;
  --s1:4px; --s2:8px; --s3:12px; --s4:16px; --s5:24px;
  --s6:32px; --s7:48px; --s8:64px; --s9:96px;

  /* Type */
  --sr-sans:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  --sr-serif:'Instrument Serif','Iowan Old Style',serif;
  --sr-mono:'Geist Mono',ui-monospace,SFMono-Regular,Menlo,monospace;

  /* Easing */
  --sr-power2-out:cubic-bezier(.215,.61,.355,1);
  --sr-power3-out:cubic-bezier(.165,.84,.44,1);
  --sr-ease-out:cubic-bezier(.23,1,.32,1);
}
```

---

## 3. The five behaviours

Every significant visual combines at least three of them. Not every element carries all
of them; restraint is part of the identity.

**Trace.** A person, state, process or direction. SVG cubic Bézier, 1.25 to 2px stroke,
round caps, no fill, few directional changes, controlled asymmetry. Never an arbitrary
sine wave.

**Echo.** A second trace following the primary at 2 to 4px offset, 30 to 55% opacity, in
Violet, Blue, Rose or Pink. It means resonance, memory, influence. It carries the glow of
its own colour.

**Gap.** Important shapes stay deliberately incomplete: autonomy, potential, breathing
room, unresolved possibility. Circles use `stroke-dasharray` with one clear opening;
dividers, timelines and navigation carry gaps too.

**Bridge.** A short cubic Bézier connecting two otherwise independent traces, meaning
relationship. Optional spectral stroke. No arrows, no technical connector styling.

**Spectrum.** Violet, Blue, Orchid, Rose, Pink, in that fixed order. It marks everything
that changes, connects, activates or becomes meaningful. Never a generic background.

---

## 4. Surfaces and relief

```css
.surface{
  background:linear-gradient(180deg,var(--sr-surface-top) 0%,var(--sr-surface) 62%,#FCF7EC 100%);
  border:0;                       /* no border, ever */
  border-radius:var(--sr-r-lg);
  box-shadow:var(--sr-emboss);
  position:relative;              /* no overflow:hidden */
}
```

- Light edge on top, warm inner shade underneath, wide warm halo below. The halo is wider
  than the surface on purpose, so a raised element overlaps the paper instead of sitting
  inside a box.
- Inputs are the inverse: pressed **into** the paper with
  `inset 0 2px 4px rgba(138,107,69,.14)` and no border.
- A raised element that needs extra separation adds a soft outer ring:
  `0 0 0 9px rgba(138,107,69,.035), 0 0 0 10px rgba(138,107,69,.05)` plus the raised
  emboss, with 10px of margin so nothing crops it.
- Shadow hue is always the warm one, `rgba(138,107,69, …)`. Never black, never blue-grey.
- No glassmorphism, no neumorphism, no hard drop shadow.

**One radius scale, one role each.** `8px` skeletons and inline chips, `14px` fields,
metric tiles and status messages, `22px` cards and paper, `32px` demo stages and device
frames, full pill for everything interactive (buttons, badges, eyebrows, navigation). The
single deliberate break is the `52px` rounded corner that marks a saved artefact. Do not
mix systems: no square cards on a page of pill buttons.

**Nothing clips a shadow.** No `overflow:hidden` on raised surfaces, section wrappers or
SVGs carrying a glowing path. Set `svg{overflow:visible}` globally and keep grid gaps at
32px so halos have room. The single exception is a device frame.

---

## 5. Spectral edges

One narrow edge per surface. It is a ring on the surface outline, so it follows the
corner radius, and it always fades out instead of stopping on a hard cut.

```html
<div class="surface">
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
.sr-corner{border-top-right-radius:52px}   /* the corner is rounded away, not cut */
.e-partial{
  mask-image:linear-gradient(to top,#000 0 9px,transparent 44px),
             linear-gradient(to right,#000 0 42%,transparent 74%);
  mask-composite:intersect;
}
```

Rules:

- Fades are in **pixels**, so an edge is the same visible length on a small metric tile
  and on a large card. The one exception is the partial edge's horizontal cut, which stays
  in percent because its length is the message: how far the work got.
- `bottom` is the default for something that just resonated, `left` marks the active item
  in lists and navigation, the rounded corner marks saved or exported artefacts, `partial`
  marks unfinished progress.
- Never two edges on one surface, never a full ring.

---

## 6. Glow

- Glow is three `drop-shadow` steps of the line's **own** hue at 2px, 7px and 18px. No
  white core, no foreign warm ring, no `box-shadow` bloom on text.
- Ink traces never glow. Status colours never glow. Only resonance carries light.
- Spectral edges, the spectrum bar, active indicators and the resonance badge glow.
- On a surface, the glow lights the paper immediately around the line. That is the point:
  colour behaves like light on this ground.

---

## 7. Paper

Paper is the deeper material for journal moments, personal insights, quotes, saved
reflections and key emotional summaries.

```css
.paper{
  background:
    radial-gradient(120% 80% at 50% 0%,rgba(255,255,255,.55) 0%,rgba(255,255,255,0) 60%),
    linear-gradient(180deg,var(--sr-paper-light) 0%,var(--sr-paper) 62%,#E6D8B8 100%);
  color:var(--sr-paper-ink);
  border:0;border-radius:var(--sr-r-lg);
}
```

Grain: 3.5% monochrome, procedural (`feTurbulence` in an inline SVG data URI), on a
pseudo-element with `border-radius:inherit` and `mix-blend-mode:multiply`. Never a raster
texture file.

Because the ground is already paper, this material has to be **darker and grainier**, not
just tinted. It never exceeds 20% of the surface budget and never becomes the application
background.

---

## 8. Status colours

Status is the system talking to the person and is kept apart from the spectrum: spectrum
means something connected, status means something needs to be known.

| Role | Text | Surface |
|---|---|---|
| Info | `#33638F` | `rgba(51,99,143,.10)` |
| Success | `#3F7350` | `rgba(63,115,80,.11)` |
| Warning | `#8A5A16` | `rgba(138,90,22,.12)` |
| Danger | `#A32F3C` | `rgba(163,47,60,.10)` |
| Neutral | `#5B6660` | `rgba(91,102,96,.09)` |

- A status message is icon plus text on a 10 to 12% tint of its own colour, with
  `inset 0 1px 0 rgba(255,255,255,.6)`. Nothing else.
- Every message says what happened and what follows. No bare error codes.
- Danger is never Rose or Pink; those are brand colours and would read as resonance.
- Errors report inline. No modal for something a line of text can carry.
- All five pass WCAG AA on both the ground and a surface.

---

## 9. Typography

| Role | Family | Size / line | Weight / tracking |
|---|---|---|---|
| Display | Geist | clamp(34 to 58px) / 1.15 | 300 / -.035em |
| Section | Geist | clamp(24 to 34px) / 1.15 | 400 / -.03em |
| Body | Geist | 16px / 1.65, max 62ch | 400 / 0 |
| Eyebrow pill | Geist | 10px / 1.4 | 500 / .2em uppercase |
| Paper quote | Instrument Serif | 22px / 1.4 | 400 / 0 |
| Code, tokens | Geist Mono | 13px / 1.6 | 400 / 0 |

Headlines are light and tightly tracked, never bold. Serif appears **only** on paper
surfaces. Hierarchy comes from weight and colour, not from raw scale. At most one eyebrow
per three sections.

---

## 10. Motion

Constants are fixed. Do not estimate them by feel.

| Moment | Values |
|---|---|
| Reveal, normal block | `y 2.4rem / 0.9s / power2.out / once / trigger top 88%` |
| Reveal, small element | `y 1.6rem / trigger top 92%` |
| Reveal, whole section | `y 3.2rem / trigger top 85%` |
| Stagger | `cards 0.12s / chars 0.04s / hero 0.14s` |
| Line draw | `scaleX 0 to 1 / 1s / power3.out / origin left / top 92%` |
| Hover and press | `150 to 250ms / power2.out` |
| State change | `240ms / ease-out` |
| Scrubbed motion | `ease none, always` |

A product or documentation surface uses only: basic reveal, staggered group, line draw,
hover micro-interactions. No smooth-scroll layer, no pinned chapter, no parallax, no
ambient effect. Exactly one perpetual signal is allowed, and only where it means something
(an open connection breathing, for example).

Guards, all mandatory:

- `prefers-reduced-motion`: everything visible, movement removed, opacity kept, loops
  stopped. Not "no animation", but no *movement*.
- Reveals run once. Scrolling back never replays them.
- Text splits wait for `document.fonts.ready`.
- `transform` and `opacity` only. Never `width`, `height`, `top`, `left`.
- `will-change` during the sequence only, then back to `auto`.
- Hover behind `(hover:hover) and (pointer:fine)`, each with a `:focus-visible` equivalent.
- **No scroll listener.** IntersectionObserver, or a CSS scroll timeline
  (`animation-timeline: scroll(root block)`), nothing else.

---

## 11. Responsive, mobile first

Base rules are the phone. Every query is `min-width` and only adds capacity.

| From | What arrives |
|---|---|
| base | One column, stacked metrics, bottom navigation, tables scroll in their own container |
| 640px | Second column, real tables, larger section padding |
| 768px | Split hero, twelve-column grids with 5 and 7 spans, side rail |
| 1024px | Four-up grids, five swatches in a row, full-width nav pill |
| 1180px | The scroll trace in the left margin |

- Tap targets 44px minimum on every viewport.
- `min-width:0` on grid children, or a wide table stretches the page.
- Wide content scrolls inside its own container; the body never scrolls sideways.
- `100dvh`, never `100vh`.
- The side rail is not shrunk into a phone. It becomes a bottom bar whose active item
  carries the spectral edge.

---

## 12. Never

- White or dark backgrounds, cold grey shadows, pure black `#000000`
- Borders on surfaces, hairline boxes, glass, neumorphism, heavy drop shadows
- The spectrum as a background, a rainbow border around every component, two edges on one
  surface
- Glow on ink, on body text or on status colours
- Raster textures or generated imagery in brand elements
- Emojis, scroll cues ("scroll to explore"), version labels in a hero, section-number
  eyebrows, decorative status dots, locale or weather strips
- Em dashes and en dashes anywhere in visible copy. Use a comma, a colon, a period or a
  plain hyphen
- Fake-precise numbers presented as real data
- `max-width` media queries

---

## 12b. Layout and editorial discipline

- **No split headers.** A section is a headline with its one line of context stacked
  underneath, max 62ch. Never a big headline on the left with a small explainer floating
  in the top right.
- **At most one eyebrow per three sections.** The headline alone is usually enough.
- **No hairline under every row.** A list of rules or specs gets one hairline where it
  turns from what to do into what never to do, and nothing else. If a list runs past five
  items, group it or change the component; do not lengthen the list.
- **Hero:** eyebrow, headline of at most two lines, subtext of at most 20 words, and at
  most one primary action. No tagline under the buttons, no trust strip, no version label.
- **Section layouts do not repeat.** Across the page, use at least four different layout
  families, and never three image-and-text splits in a row.
- **Copy:** plain declarative sentences. No staged antithesis ("not X, but Y"), no rhythmic
  triples, no meta-commentary about the tone, no invented precision. Every visible string
  gets re-read before shipping; if a sentence sounds clever rather than clear, replace it.

---

## 13. Acceptance checklist

Do not report a screen as done until every line is true.

- [ ] Ground is `#F6F1E5`; there is no dark mode and no white background
- [ ] Ratio reads roughly 40 air / 20 paper / 40 resonance
- [ ] Every brand visual is SVG, parametrisable, animatable, recognisable without texture,
      readable in monochrome, and legible at 320px
- [ ] Each major visual combines at least three of Trace, Echo, Gap, Bridge, Spectrum
- [ ] Surfaces use the emboss tokens, carry no border, and nothing clips their halo
- [ ] `svg{overflow:visible}` is set and no raised surface has `overflow:hidden`
- [ ] Every coloured line glows in its own hue; ink and status do not glow
- [ ] At most one spectral edge per surface, following the radius, fading in pixels
- [ ] Paper is darker and grainier than the ground, under 20% of the surface
- [ ] All five status colours pass WCAG AA on ground and surface
- [ ] Motion uses the constants in section 10, reveals run once, no scroll listener
- [ ] `prefers-reduced-motion` keeps content visible and removes movement
- [ ] Mobile first: no `max-width` query, 44px tap targets, no horizontal body scroll at
      320, 375, 768 and 1440px
- [ ] No em dash or en dash in any visible string
- [ ] Section heads are stacked, not split into headline plus floating explainer
- [ ] At most one eyebrow per three sections
- [ ] No hairline under every row; one per do-to-never turn at most
- [ ] Hero headline is at most two lines, subtext at most 20 words, and the hero fits the
      first screen at 900px height
- [ ] One radius scale, applied by role

## 14. Verification, not assumption

A correct-looking diff is not evidence. Before reporting done, open the screen at 375px
and at 1440px, check `document.documentElement.scrollWidth` against the viewport width,
confirm the reveals actually ran, and look at the rendered result. State what you checked.
