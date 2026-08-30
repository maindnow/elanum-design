# Learnings, elanum-designelemente

> Erstellt: 2026-08-30
> Letztes Pruning: 2026-08-30
> Eintragsanzahl: 9

---

## Aktive Regeln (immer anwenden)

<!--
Verifizierte Regeln, die der Skill bei jedem Lauf anwenden soll. Format:

1. <Regel mit kurzer Begründung>

Eintrag nur, wenn die Regel mindestens 2x bestätigt wurde.
-->

1. **Reveal-Elemente im untersten Bereich einer kurzen Seite mit `rootMargin: 0px`
   beobachten.** Ein Element, das nach `scrollHeight - innerHeight` immer noch unterhalb
   der verschobenen Triggerlinie liegt, wird sonst nie sichtbar. `assets/reveal.js`
   prüft das und schaltet für solche Elemente auf den Rand 0 um. Gefunden am 2026-08-30
   am persönlichen Rad, dort blieb die Navigation unter dem Inhalt dauerhaft auf
   `opacity:0`. Nie wieder einen Inline-Observer in eine Seite schreiben, immer
   `assets/reveal.js` einbinden.
2. **Radienfaktoren einer Signatur auf Mittel 1 normieren.** Wer Faktoren wie
   `.84 bis .97` direkt mit dem Nennradius multipliziert, erhält eine Kurve, die
   komplett innerhalb dieses Radius liegt. Alles, was auf dem Nennradius sitzt,
   schwebt dann in einem leeren Ring darum.

---

## Beobachtete Muster

### Was funktioniert

- **Echo mit einer im Bildraum feststehenden Maske**, 2026-08-30, persönliches Rad.
  Das Echo soll nur an der Leseposition deutlich sein. Die Maske gehört auf einen
  Wrapper ausserhalb der rotierenden Gruppe, die Rotation auf eine innere Gruppe.
  Mehrere Rotoren über ein gemeinsames `[data-rotor]` synchron setzen.
- **Monochrom-Test per `filter:grayscale(1)` im Browser**, 2026-08-30. Beweist Punkt 3
  der Checkliste in Sekunden, statt ihn zu behaupten.

### Was nicht funktioniert

- **Gruppenmarkierungen über die volle Gruppenbreite**, 2026-08-30, persönliches Rad.
  Drei Bögen von je 98 Grad mit 16 Grad Abstand lesen sich als zweiter geschlossener
  Ring und konkurrieren mit der Signatur. Deutlich unter der halben Gruppenbreite
  bleiben, hier 44 Grad.
- **Eine zusätzliche sichtbare Führungsspur neben der Signatur**, 2026-08-30. Sie wird
  als eigene Form gelesen. Konstruktionsgeometrie bleibt unsichtbar.

---

## Abweichungen Styleguide gegen Skill

<!--
Wenn docs/soulresonance-styleguide.html und dieser Skill sich widersprechen:
Styleguide gewinnt, Skill wird korrigiert, Widerspruch hier notieren.

- <Datum>: <Was widersprach>, <wie korrigiert>
-->

- **2026-08-30, Kuchenstück-Geometrie schlägt Trace-Geometrie.** Für das
  persönliche Rad gilt eine vom Auftraggeber gesetzte Sondervorgabe: die äussere
  Silhouette ist jederzeit ein mathematisch perfekter Kreis, neun Segmente à exakt
  40 Grad, darüber ein Ring aus drei Abschnitten à 120 Grad. Keine Bézier-Verformung,
  keine variierenden Radien. Trace, Echo und Spectrum sind dort ausschliesslich
  sekundäre Effekte entlang dieser festen Geometrie. Der erste Entwurf liess die
  Klangsignatur die Form bestimmen und wurde als Blob gelesen, nicht als Rad.
  Merksatz: **Kreis und Segmente sind die Informationsarchitektur, SoulResonance
  ist die Sprache darüber.** Gilt für Instrumente, nicht für freie Markenvisuals.
- **2026-08-30, Hairline auf den Segmenten ist hier gewollt.** Das System verbietet
  Rahmen auf Flächen. Die Segmente tragen trotzdem `stroke:rgba(22,54,59,.16)` mit
  1px, weil neun angrenzende Stücke ohne Trennung nicht als Stücke lesbar sind. Vom
  Auftraggeber ausdrücklich so gesetzt. Nicht auf Cards, Buttons oder Felder
  übertragen, dort gilt weiter Emboss ohne Rahmen.
- **2026-08-30, kein Korn auf dem Gruppenring.** Papierflächen sollen dunkler und
  körniger sein. Der Ring bleibt bewusst flach, weil die Vorgabe ihn als visuell
  ruhigste Ebene definiert und Korn dort Unruhe stiften würde.

---

## Skill-spezifische Kennzahlen

<!--
Numerische Werte mit Kontext, zum Beispiel:
- Typische --len-Werte pro Trace-Länge
- Resonanzanteil, der auf einem Dashboard tatsächlich als 40% liest
-->

- **Trefferzone im SVG:** bei `viewBox="0 0 320 320"` und einem Rad, das bei 320px
  Viewport 288px breit rendert, ergibt Radius 25 genau 45px. Radius 24 ergibt 43px und
  reisst das 44px-Minimum. Erfasst 2026-08-30.
- **Rotationsdauer eines drehbaren Instruments:** 560ms mit `--sr-power3-out`. Die
  Motion-Tabelle kennt keine Rotationsgeste, dieser Wert stammt aus der Radspezifikation
  und klingt ohne Nachschwingen aus. Erfasst 2026-08-30.

---

## Offene Fragen / zu testen

<!--
Hypothesen, die noch nicht verifiziert sind.
-->

_(noch keine offenen Fragen)_

---

## Pruning-Notizen

<!--
- <Datum>: <Anzahl> Einträge entfernt, Grund: <Duplikat/veraltet/Single-Event>
-->

_(noch nicht gepruned)_
