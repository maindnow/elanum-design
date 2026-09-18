# Separater Gestaltungsatlas, Arbeitsstand 18. September 2026

Dieser Ordner übernimmt den lokal erarbeiteten ELANUM-Gestaltungsatlas unverändert. Einstieg: `index.html`. HTML, CSS, JavaScript und Assets zusammen behalten; keine Installation erforderlich.

Die bestehende Referenz `docs/soulresonance-styleguide.html` wird weder ersetzt noch durch diesen Import als Source of Truth abgelöst. Eine gestalterische Zusammenführung ist nicht Teil dieses Imports.

## Prüfstatus

- JavaScript-Syntaxprüfung mit `node --check` bestanden.
- Importdateien byteweise mit dem lokalen Deliverable verglichen.
- Desktop- und mobile Darstellung, Bewegungspause und reduzierte Bewegung wurden vor dem Import lokal im Browser geprüft.
- Der vorhandene SoulResonance-Linter meldet 12 Regelabweichungen: fünf Gedankenstriche, zwei weisse Hintergründe und fünf max-width-Media-Queries. Dieser Arbeitsstand ist daher ausdrücklich nicht als SoulResonance-konform freigegeben.
- Der repositoryeigene Playwright-Rendercheck wurde nicht ausgeführt; die Browserprüfung erfolgte über die zugelassene Browseroberfläche.
- Kein Build-System, Backend oder Migrationsschritt für diesen statischen Ordner erforderlich. Kein Deployment Teil dieser Übernahme.

Logo, Typografie und Interaktionen wurden beim Git-Import nicht verändert.
