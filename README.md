# ELANUM Styleguide 4.4

Der interaktive ELANUM-Gestaltungsatlas im Stil **Soft 3D Relief / Neumorphic Relief**. Dieses Repository enthält ausschliesslich den Styleguide 4.4 mit seinen Assets und seiner Dokumentation.

[Styleguide-Datei](index.html) · [Designnotizen](DESIGN-NOTES.md)

## Was der Styleguide zeigt

- **Logo:** Spektrum, Ink, Invers und Papierrelief. Original und kurvenbereinigte Fassung sind vergleichbar; die freigegebene Grundform bleibt erhalten.
- **Typografie:** Yrsa für persönliche Aussagen, Albert Sans für Orientierung und Bedienung.
- **Farbe:** neun Feldfarben in drei Gruppen sowie getrennte Info-, Signal- und Fehlerfarben.
- **Material:** warme Oberflächen, Licht von links oben, erhabene Flächen und vertiefte Eingaben.
- **Beziehungen:** runde Reliefebenen, offene Konturen und angeschlossene Verbindungslinien.
- **Bewegung:** sanfte Atmung, Linienaufbau, Scroll-Auftritte und haptische Bedienzustände.
- **Interaktion:** Farbkopieren, Schriftprobe, lokale Eingabedemos, Produkt-Tabs und eine manuelle Prüfcheckliste.

Das ist ein vollständiger Styleguide, nicht nur eine Rad-Komponente. Die Feldnamen und Gruppen A bis C sind strukturelle Platzhalter, keine fertige fachliche Klassifikation.

## Lokal öffnen

Das Repository herunterladen und `index.html` im Browser öffnen. Alle Dateien und den Ordner `assets/` zusammen behalten. GitHub selbst zeigt HTML als Quelltext.

Alternativ mit Git und Python 3:

```bash
git clone --branch main https://github.com/maindnow/elanum-design.git
cd elanum-design
python3 -m http.server 4173 --bind 127.0.0.1
```

Danach [http://127.0.0.1:4173](http://127.0.0.1:4173) öffnen. Den Server mit `Ctrl+C` beenden.

Kein Paketmanager, Build oder Backend erforderlich. Schriften und SVG-Assets liegen lokal. Die Eingaben dienen nur der aktuellen Vorschau, ohne Versand oder dauerhafte Speicherung.

## Aufbau

| Datei | Aufgabe |
| --- | --- |
| [index.html](index.html) | Direkter Einstieg mit allen Kapiteln |
| [style.css](style.css) | Basislayout und responsive Darstellung |
| [tactile.css](tactile.css) | Papiertextur und haptische Zustände |
| [relief.css](relief.css) | Soft-3D-Oberflächen und Logo-Card |
| [app.js](app.js) | SVG-Geometrie, Bewegung und Bedienlogik |
| [assets/](assets/) | Logos, Konturvergleich und lokale Fonts |
| [DESIGN-NOTES.md](DESIGN-NOTES.md) | Gestaltungs- und Konstruktionsentscheidungen |

Die Stylesheets werden in der Reihenfolge `style.css`, `tactile.css`, `relief.css` geladen. Die Relief-Regeln überschreiben gezielt die Basis.

## Gestaltungsregeln

### Logo bewahren

Dateien ohne `-Curves` sind die unveränderten Ausgangsdateien. Die kurvenbereinigten Fassungen erhalten Silhouette, Ankerpunkte und Linienanordnung. Relief ist eine zusätzliche Materialanwendung, kein neues Logo. Für kleine Darstellungen bleiben die flachen Varianten vorgesehen.

Die Relief-Masken sind zusätzlich in `app.js` eingebettet, damit die lokale Dateiansicht funktioniert. Freigegebene Änderungen an Logo-Assets und Masken gemeinsam pflegen. Das Logo selbst wird nicht animiert.

### Tiefe und Bedienbarkeit verbinden

Schatten vermitteln Material, aber nicht allein die Funktion. Text, Fokusmarkierungen und Auswahlzustände bleiben erkennbar. Licht fällt konsistent von links oben; Eingaben liegen vertieft, ausgewählte Flächen können sich anheben.

### Bewegung kontrollierbar halten

Die Kreise atmen in einem gemeinsamen Zyklus: 3,4 Sekunden Ausdehnung und 4,4 Sekunden Beruhigung, maximal 7,5 Prozent Radiusänderung. Füllung, Kontur und Verbindung bleiben synchron. Beschriftungen bleiben ruhig.

Globale Pause und `prefers-reduced-motion` berücksichtigen. Unsichtbare Beziehungsdarstellungen und ausgeblendete Seiten lassen den Atemtakt ruhen. Keine Animation darf Inhalte dauerhaft verstecken.

### Dokumentation mitpflegen

Bei Farb- und Tokenänderungen die sichtbare Palette, den kopierbaren Tokenblock und die Designnotizen aktualisieren. Die Checkliste im Styleguide ist eine manuelle Arbeitshilfe, keine automatische Design- oder Accessibility-Freigabe.

## Prüfen

JavaScript-Syntax und Diff prüfen:

```bash
node --check app.js
git diff --check
```

Zusätzlich im Browser:

- Desktop und Mobil: keine horizontalen Überläufe, lesbare Beschriftungen.
- Logo: alle vier Modi und Originalvergleich ohne Verzerrung.
- Interaktion: Regler, Formulare, Farbkopieren und Produkt-Tabs.
- Tastatur: sichtbarer Fokus und bedienbare Steuerelemente.
- Bewegung: globale Pause und reduzierte Bewegung.
- Assets: keine fehlenden Dateien oder Browser-Konsolenfehler.

Vor der Repository-Umstellung wurden Desktop- und mobile Ansichten lokal kontrolliert. Die Relief-Logo-Card wurde bei 390 px ohne horizontalen Überlauf geprüft. Syntax, lokale Dateiverweise und identische Übernahme des freigegebenen Deliverables werden bei der Umstellung kontrolliert. Ein vollständiger Barrierefreiheits- oder geräteübergreifender Audit liegt nicht vor.

## Stand und Historie

Seit der Umstellung am 19. September 2026 ist Styleguide 4.4 der einzige aktuelle Designstand in `main`. Die frühere SoulResonance-Referenz, die separate persönliche Rad-Komponente und deren Projekt-Skill wurden aus dem aktuellen Dateibaum entfernt.

Die Git-Historie bleibt erhalten. Der letzte `main`-Stand vor der Ablösung ist Commit `94071d8671c4da6dfab7b06ba855977cf5eea8a9`. Alte Arbeitsbranches können ebenfalls noch vorhanden sein; sie sind keine aktuelle Referenz.

Ein Push auf GitHub ist kein Deployment. Ein öffentlicher Hosting-Status wird hier nicht vorausgesetzt. Für statisches Hosting das gesamte Repository mit `index.html` als Einstieg bereitstellen.

## Schriften und Nutzungsrechte

Yrsa und Albert Sans sind lokal eingebunden. Ihre OFL-Lizenzen liegen unter [assets/fonts/](assets/fonts/). Diese Font-Lizenzen erteilen keine allgemeine Nutzungsfreigabe für ELANUM-Markenassets.
