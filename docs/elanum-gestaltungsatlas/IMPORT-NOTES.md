# Separater Gestaltungsatlas 4.4, Soft 3D Relief

Dieser Ordner übernimmt den lokal erarbeiteten ELANUM-Gestaltungsatlas unverändert. Einstieg: `index.html`. HTML, CSS, JavaScript und Assets zusammen behalten; keine Installation erforderlich.

Die bestehende Referenz `docs/soulresonance-styleguide.html` wird weder ersetzt noch durch diesen Import als Source of Truth abgelöst. Eine gestalterische Zusammenführung ist nicht Teil dieses Imports.

## Prüfstatus

- JavaScript-Syntaxprüfung mit `node --check` bestanden.
- Importdateien byteweise mit dem lokalen Deliverable verglichen.
- Desktop- und mobile Darstellung, Bewegungspause und reduzierte Bewegung wurden vor dem Import lokal im Browser geprüft.
- Der vorhandene SoulResonance-Linter meldet 14 Regelabweichungen: fünf Gedankenstriche, zwei weisse Hintergrunddeklarationen im Basis-CSS und sieben max-width-Media-Queries. Relief-Overrides ändern die tatsächliche Darstellung, beseitigen aber nicht diese Quelltextbefunde. Dieser Arbeitsstand ist daher ausdrücklich nicht als SoulResonance-konform freigegeben.
- Version 4.4: Logo-Card und Relief-Variante auf Desktop und bei 390 px Breite kontrolliert; auf Mobil beträgt die Dokumentbreite ebenfalls 390 px, ohne horizontalen Überlauf. Keine Browser-Konsolenfehler bei dieser Prüfung. Die Logo-Quelldateien sind gegenüber dem vorherigen Import unverändert.
- Der repositoryeigene Playwright-Rendercheck wurde nicht ausgeführt; die Browserprüfung erfolgte über die zugelassene Browseroberfläche.
- Kein Build-System, Backend oder Migrationsschritt für diesen statischen Ordner erforderlich. Kein Deployment Teil dieser Übernahme.

Logo, Typografie und Interaktionen wurden beim Git-Import nicht verändert.
