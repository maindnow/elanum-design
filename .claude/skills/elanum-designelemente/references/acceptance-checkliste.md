# Acceptance-Checkliste

Kein Screen und kein Element gilt als fertig, bevor jede Zeile wahr ist. Jeder Punkt
wird geprüft, keiner wird angenommen.

## Die 18 Punkte

- [ ] 1. Grund ist `#F6F1E5`. Es gibt keinen Dark Mode und keinen weissen Hintergrund.
- [ ] 2. Das Verhältnis liest sich ungefähr als 40 Luft, 20 Papier, 40 Resonanz.
- [ ] 3. Jedes Markenvisual ist SVG, parametrisierbar, animierbar, ohne Textur
      wiedererkennbar, in Monochrom lesbar und bei 320px verständlich.
- [ ] 4. Jedes grössere Visual kombiniert mindestens drei von Trace, Echo, Gap,
      Bridge, Spectrum.
- [ ] 5. Flächen nutzen die Emboss-Tokens, tragen keinen Rahmen, und nichts
      beschneidet ihren Hof.
- [ ] 6. `svg{overflow:visible}` ist gesetzt, und keine gehobene Fläche hat
      `overflow:hidden`.
- [ ] 7. Jede farbige Linie leuchtet in ihrer eigenen Farbe. Tinte und Status leuchten nicht.
- [ ] 8. Höchstens eine Spektralkante pro Fläche, sie folgt dem Radius und blendet in
      Pixeln aus.
- [ ] 9. Papier ist dunkler und körniger als der Grund und bleibt unter 20% der Fläche.
- [ ] 10. Alle fünf Statusfarben bestehen WCAG AA auf dem Grund und auf einer Fläche.
- [ ] 11. Motion nutzt die Konstanten aus `references/motion.md`, Reveals laufen
      einmal, es gibt keinen Scroll-Listener.
- [ ] 12. `prefers-reduced-motion` hält den Inhalt sichtbar und entfernt Bewegung.
- [ ] 13. Mobile first: keine `max-width`-Query, 44px Tap-Targets, kein horizontaler
      Body-Scroll bei 320, 375, 768 und 1440px.
- [ ] 14. Kein Gedankenstrich, kein Halbgeviertstrich in irgendeinem sichtbaren String.
- [ ] 15. Section-Köpfe sind gestapelt, nicht in Headline plus schwebenden Erklärtext geteilt.
- [ ] 16. Höchstens ein Eyebrow pro drei Sections.
- [ ] 17. Keine Haarlinie unter jeder Zeile, höchstens eine pro Wechsel von Tun zu Niemals.
- [ ] 18. Eine Radius-Skala, nach Rolle angewendet. Die Hero-Headline hat höchstens
      zwei Zeilen, der Subtext höchstens 20 Wörter, und der Hero passt bei 900px Höhe
      auf den ersten Schirm.

## Verboten, ausnahmslos

Diese Liste ersetzt keine Prüfung, sie fängt die häufigsten Rückfälle:

- Weisse oder dunkle Hintergründe, kalte graue Schatten, reines Schwarz `#000000`
- Rahmen auf Flächen, Haarlinien-Boxen, Glas, Neumorphism, harte Schlagschatten
- Das Spektrum als Hintergrund, ein Regenbogenrahmen um jede Komponente, zwei Kanten
  auf einer Fläche
- Glow auf Tinte, auf Fliesstext oder auf Statusfarben
- Rastertexturen oder generierte Bilder in Markenelementen
- Emojis, Scroll-Hinweise, Versionslabels im Hero, Sektionsnummern als Eyebrow,
  dekorative Statuspunkte, Orts- oder Wetterzeilen
- Gedankenstriche und Halbgeviertstriche in sichtbarer Copy
- Fantasiezahlen, die als echte Daten auftreten
- `max-width`-Media-Queries

## Automatischer Vorlauf

```bash
python .claude/skills/elanum-designelemente/scripts/check_design.py <datei-oder-ordner>
```

Das Script prüft die statisch prüfbaren Punkte: 5, 6, 7 (teilweise), 8, 13
(teilweise), 14 und die Verbotsliste. Es ersetzt die Checkliste nicht, es räumt nur
das Offensichtliche vorher weg. Exit-Code 2 bedeutet: harter Verstoss, nicht abliefern.

## Verifikation, keine Annahme

Ein korrekt aussehender Diff ist kein Beweis. Die Punkte 1, 11, 12 und 13 werden im
Browser gemessen, nicht gelesen:

```bash
python .claude/skills/elanum-designelemente/scripts/verify_render.py <datei.html> --shots ./shots
```

Das Script prüft bei 320, 375, 768 und 1440px, einmal normal und einmal mit
`prefers-reduced-motion`:

1. `document.documentElement.scrollWidth` gegen `window.innerWidth`. Grösser heisst
   horizontaler Body-Scroll, Punkt 13 ist verletzt.
2. Wie viele Reveal-Elemente nach dem Durchscrollen sichtbar sind. Weniger als alle
   heisst, ein Reveal ist nicht gelaufen, Punkt 11 ist verletzt.
3. Den Grundton von `body`, erwartet wird `rgb(246, 241, 229)`, Punkt 1.
4. Ob unter `prefers-reduced-motion` noch ein `transform` steht, Punkt 12.

Danach die Screenshots tatsächlich anschauen. Ein grüner Lauf sagt nur, dass es etwas
zu sehen gibt, nicht dass es richtig aussieht.

Danach berichten, was konkret geprüft wurde, mit den tatsächlichen Werten. Nicht
behaupten, geprüft zu haben.

## Häufigste Rückfälle aus der Praxis

| Symptom | Ursache | Fix |
|---|---|---|
| Kante bricht hart ab | Ausblendung fehlt oder in Prozent statt Pixeln | Maskenwerte aus `references/komponenten.md` |
| Hof wirkt abgeschnitten | `overflow:hidden` oder zu enger Grid-Gap | `overflow:visible`, Gap zurück auf 32px |
| Screen wirkt grau und leer | Resonanz unter 40% | Echos und Kanten ergänzen, nicht Kontrast erhöhen |
| Statusmeldung leuchtet | Glow-Klasse versehentlich vererbt | Glow nur auf Resonanzfarben |
| Seite scrollt seitwärts | fehlendes `min-width:0` auf Grid-Kindern | `.sr-grid>*{min-width:0}` |
| Zeichnung bricht ab | `--len` kleiner als die echte Pfadlänge | `--len` grosszügig aufrunden |
