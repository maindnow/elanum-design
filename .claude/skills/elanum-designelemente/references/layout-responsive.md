# Layout, Responsive, Editorial

## Mobile first, ausnahmslos

Die Basisregeln sind das Telefon. Jede Query ist `min-width` und fügt nur Kapazität
hinzu. Es gibt keine einzige `max-width`-Query im System.

| Ab | Was dazukommt |
|---|---|
| Basis | Eine Spalte, gestapelte Metriken, untere Navigation, Tabellen scrollen im eigenen Container |
| 640px | Zweite Spalte, echte Tabellen, grössere Section-Polsterung |
| 768px | Geteilter Hero, Zwölf-Spalten-Raster mit 5er- und 7er-Spans, Seitenleiste |
| 1024px | Vierer-Raster, fünf Swatches in einer Reihe, Navigation als volle Pille |
| 1180px | Der Scroll-Trace in der linken Randspalte |

## Harte Regeln

- Tap-Targets mindestens 44px auf jedem Viewport.
- `min-width:0` auf Grid-Kindern, sonst dehnt eine breite Tabelle die Seite.
- Breiter Inhalt scrollt im eigenen Container. Der Body scrollt nie seitwärts.
- `100dvh`, nie `100vh`.
- Die Seitenleiste wird nicht auf Telefongrösse geschrumpft. Sie wird zur unteren
  Leiste, deren aktives Element die Spektralkante trägt.

## Grid-Gerüst

```css
.sr-grid{display:grid;gap:var(--s6)}
.sr-grid>*{min-width:0}
/* Basis, Telefon: alles eine Spalte */
.sr-grid.c2,.sr-grid.c3,.sr-grid.c4,.sr-grid.c12{grid-template-columns:1fr}
.sp5,.sp7,.sp12{grid-column:auto}

@media (min-width:640px){
  .sr-grid.c2,.sr-grid.c4{grid-template-columns:repeat(2,1fr)}
}
@media (min-width:768px){
  .sr-grid.c3{grid-template-columns:repeat(3,1fr)}
  .sr-grid.c12{grid-template-columns:repeat(12,1fr)}
  .sp5{grid-column:span 5}
  .sp7{grid-column:span 7}
  .sp12{grid-column:span 12}
}
@media (min-width:1024px){
  .sr-grid.c4{grid-template-columns:repeat(4,1fr)}
}
```

Der Grid-Gap bleibt bei 32px, damit die Höfe der Flächen Platz haben. Enger gesetzt
überlappen die Schatten und das Relief wird schmutzig.

## Nichts beschneidet Schatten

```css
svg{overflow:visible}
section,.sr-wrap,.sr-grid,.sr-hero{overflow:visible}
```

Kein `overflow:hidden` auf gehobenen Flächen, Section-Wrappern oder SVGs, die einen
leuchtenden Pfad tragen. Die einzige Ausnahme im ganzen System ist ein Geräterahmen:

```css
.sr-app{
  background:var(--sr-canvas);border:0;border-radius:26px;
  overflow:hidden;                  /* der eine erlaubte Fall */
  box-shadow:var(--sr-emboss-raised);
}
```

## Tabellen

Auf dem Telefon scrollt die Tabelle in sich selbst, ab 640px wird sie zur echten Tabelle:

```css
.sr-table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch}
.sr-table th,.sr-table td{padding:10px;white-space:nowrap}
.sr-table td:last-child{white-space:normal;min-width:200px}
@media (min-width:640px){
  .sr-table{display:table;overflow:visible}
  .sr-table th,.sr-table td{padding:11px 14px;white-space:normal}
}
```

## Editorial-Disziplin

- **Keine geteilten Section-Köpfe.** Eine Section ist eine Headline mit ihrer einen
  Zeile Kontext darunter, maximal 62ch. Nie eine grosse Headline links und ein kleiner
  Erklärtext oben rechts.

```css
.sr-sec-head{display:grid;gap:10px;margin-bottom:var(--s6);max-width:62ch}
```

- **Höchstens ein Eyebrow pro drei Sections.** Die Headline allein reicht meistens.
- **Keine Haarlinie unter jeder Zeile.** Eine Liste aus Regeln bekommt genau eine
  Haarlinie, dort wo sie vom Tun ins Niemals kippt, sonst keine. Läuft eine Liste über
  fünf Punkte: gruppieren oder die Komponente wechseln, nicht die Liste verlängern.

```css
.sr-rule--do+.sr-rule--dont,.sr-rule--dont+.sr-rule--do{
  border-top:1px solid var(--sr-line);margin-top:10px;padding-top:16px}
```

- **Hero:** Eyebrow, Headline mit höchstens zwei Zeilen, Subtext mit höchstens 20
  Wörtern, höchstens eine primäre Aktion. Keine Zeile unter den Buttons, kein
  Trust-Strip, kein Versionslabel. Der Hero passt bei 900px Höhe auf den ersten Schirm.
- **Section-Layouts wiederholen sich nicht.** Über eine Seite hinweg mindestens vier
  verschiedene Layout-Familien, nie drei Bild-Text-Splits hintereinander.

## Copy

Schlichte Aussagesätze. Verboten sind:

- inszenierte Antithesen ("nicht X, sondern Y")
- rhythmische Dreier
- Meta-Kommentare über den eigenen Ton
- erfundene Präzision, Fantasiezahlen als echte Daten
- Emojis, Scroll-Hinweise, Versionslabels im Hero, Sektionsnummern als Eyebrow,
  dekorative Statuspunkte, Orts- oder Wetterzeilen
- **Gedankenstriche jeder Art in sichtbarem Text.** Komma, Doppelpunkt, Punkt oder
  einfacher Bindestrich.

Jeder sichtbare String wird vor dem Ausliefern noch einmal gelesen. Klingt ein Satz
klug statt klar, wird er ersetzt.
