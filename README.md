# ELANUM Design

Interaktive Designreferenzen, SVG-Assets und UI-Prototypen für ELANUM. Das Repository macht Gestaltung direkt im Browser erlebbar: von Logo und Typografie über Farbe und Material bis zu Bewegung und Bedienung.

Der aktuelle Gestaltungsatlas **4.4** untersucht **Soft 3D Relief / Neumorphic Relief**: warme Papierflächen, sanfte Prägungen und klare, runde Geometrie. Die bestehende SoulResonance-Referenz und das persönliche Rad bleiben als eigenständige Bestandteile erhalten.

[Gestaltungsatlas](docs/elanum-gestaltungsatlas/index.html) · [Designentscheidungen](docs/elanum-gestaltungsatlas/DESIGN-NOTES.md) · [Prüfstatus](docs/elanum-gestaltungsatlas/IMPORT-NOTES.md)

> GitHub zeigt HTML-Dateien als Quelltext. Für die interaktive Ansicht das Repository lokal öffnen oder über einen lokalen Webserver bereitstellen.

## Schnellstart

Voraussetzungen: Git und ein aktueller Browser. Python 3 wird nur für den optionalen Webserver und die Prüfskripte benötigt; Node.js für die JavaScript-Syntaxprüfung.

Diese Befehle laden gezielt den Branch mit dem Relief-Atlas:

```bash
git clone --branch codex/elanum-styleguide-2026-09-18 https://github.com/maindnow/elanum-design.git
cd elanum-design
python3 -m http.server 4173 --bind 127.0.0.1
```

Danach [den Gestaltungsatlas lokal öffnen](http://127.0.0.1:4173/docs/elanum-gestaltungsatlas/index.html). Den Server mit `Ctrl+C` beenden.

Alternativ lässt sich `docs/elanum-gestaltungsatlas/index.html` direkt im Browser öffnen. Den gesamten Ordner samt CSS, JavaScript, Fonts und SVGs zusammen behalten. Für den Atlas sind weder Paketinstallation noch Build, Backend oder externer Font-Dienst nötig. Eingaben bleiben eine lokale Vorschau, ohne Versand oder dauerhafte Speicherung.

## Was gehört wohin?

| Bereich | Einstieg | Rolle |
| --- | --- | --- |
| Gestaltungsatlas 4.4 | [Atlas öffnen](docs/elanum-gestaltungsatlas/index.html) | Aktuelle Relief-Designrichtung mit interaktiven Beispielen |
| SoulResonance | [Referenz](docs/soulresonance-styleguide.html) und [Designanweisung](docs/soulresonance-design-prompt.md) | Bisheriges Designsystem und Grundlage der vorhandenen Projektregeln |
| Persönliches Rad | [Standalone-Vorschau](components/personal-wheel/standalone.html) | Eigenständiger Navigationsprototyp mit neun Bereichen in drei Gruppen |
| Repository-Einstieg | [index.html](index.html) | Bestehende Startseite für SoulResonance und das persönliche Rad |
| Projekt-Skill | [elanum-designelemente](.claude/skills/elanum-designelemente/SKILL.md) | Arbeitsanleitung, Vorlagen und Prüfwerkzeuge für SoulResonance |

Der Atlas ersetzt die bestehende Source of Truth nicht automatisch. Für SoulResonance gilt weiterhin die Rangfolge aus [CLAUDE.md](CLAUDE.md): Referenzimplementierung, Designanweisung, Projekt-Skill. Die Übernahme des Atlas als gemeinsame verbindliche Grundlage erfordert eine separate Abstimmung und Anpassung dieser Regeln.

Die Feldnummern und Gruppen A bis C im Atlas sind Platzhalter. Sie sind nicht mit den fachlich benannten Bereichen des persönlichen Rads gleichzusetzen.

## Gestaltungsatlas 4.4

### Form und Identität

Die Logo-Grundform, Linienanordnung und Ankerpunkte bleiben erhalten. Separate `-Curves.svg`-Dateien glätten die inneren Kurven; die unveränderten Ausgangsdateien liegen daneben. Kapitel 03 erlaubt den Vergleich und bietet vier Darstellungen:

- **Spektrum:** farbige Klangsignatur.
- **Ink:** einfarbige Signatur.
- **Invers:** dieselbe Ink-Geometrie in Weiss.
- **Relief:** dieselben Konturen als helle Papierprägung, ohne neues Logo.

Die Reliefdarstellung ist eine Materialanwendung. Für kleine Grössen bleiben die flachen Varianten vorgesehen. Das Logo selbst wird nicht animiert.

### Material, Schrift und Farbe

Licht fällt von links oben ein. Weiche Schatten heben Flächen an; Eingaben liegen leicht vertieft. Beschriftungen, Fokus und Auswahlzustände tragen die Bedienung auch unabhängig vom Schatten.

Yrsa setzt persönliche Aussagen, Albert Sans führt durch Navigation und Lesetext. Beide Fonts und ihre OFL-Lizenzen liegen lokal im Atlas.

Neun Feldfarben sind in drei Gruppen organisiert. Info, Signal und Fehler besitzen getrennte Farbrollen und ergänzende Texte oder Zeichen. Konkrete Werte und Konstruktionen stehen in den [Designnotizen](docs/elanum-gestaltungsatlas/DESIGN-NOTES.md) und im Kapitel „Assets & Tokens“.

### Bewegung und Interaktion

Die Beziehungskreise bleiben rund. Füllungen, Konturen und angeschlossene Linien bewegen sich gemeinsam: 3,4 Sekunden Ausdehnung, 4,4 Sekunden Beruhigung, maximal 7,5 Prozent Radiusänderung.

Einmaliger Linienaufbau und weiche Kapitelauftritte begleiten das Scrollen. Buttons reagieren auf Druck, Papierflächen auf Hover. Eine globale Pause und `prefers-reduced-motion` reduzieren die Bewegung; der Atemtakt ruht ausserhalb sichtbarer Bereiche und bei ausgeblendeter Seite.

Der Atlas enthält ausserdem Farbkopieren, eine Schriftprobe, lokale Eingabedemos, Produkt-Tabs mit Tastaturbedienung und eine manuelle Gestaltungscheckliste. Diese Checkliste ist keine automatische Qualitäts- oder Barrierefreiheitsfreigabe.

## Dateien und Pflege

```text
docs/elanum-gestaltungsatlas/
├── index.html          Kapitel, Texte und interaktive Beispiele
├── style.css           Basislayout und responsive Darstellung
├── tactile.css         Papiertextur und erste haptische Zustände
├── relief.css          Aktuelle Soft-3D-Oberflächen und Logo-Card
├── app.js              SVG-Geometrie, Bewegung und Bedienlogik
├── assets/             Originale, Kurvenkorrekturen und lokale Fonts
├── DESIGN-NOTES.md     Gestaltungs- und Konstruktionsentscheidungen
└── IMPORT-NOTES.md     Einordnung, Prüfungen und bekannte Abweichungen
```

Die CSS-Dateien werden in dieser Reihenfolge geladen: `style.css`, `tactile.css`, `relief.css`. Spätere Regeln überschreiben die Basis. Bei Tokenänderungen auch die sichtbare Farbpalette und den kopierbaren Tokenblock aktualisieren.

Die SVG-Masken für das Relief-Logo sind zusätzlich in `app.js` eingebettet, damit die Prägung beim direkten Öffnen als lokale Datei funktioniert. Bei einer ausdrücklich freigegebenen Logoänderung müssen Assets und eingebettete Masken gemeinsam gepflegt werden.

Änderungen an der bestehenden Logo-Geometrie sind kein normaler Styling-Schritt. Originaldateien erhalten und geometrische Änderungen separat abstimmen.

## Persönliches Rad

Das [persönliche Rad](components/personal-wheel/) ist ein Navigationsinstrument. Es verwendet neun gleich grosse Segmente à 40 Grad und drei zugehörige Gruppenbereiche à 120 Grad. Die Kreisgeometrie entsteht aus Polarkoordinaten.

In `personal-wheel.js` trennt `ITEMS` die Inhalte von der Geometriekonfiguration `CFG`. Ausfüllstatus und Ergebnisse stammen aus dem HTML-Markup: `data-done`, `data-result` und die Detailangaben im jeweiligen Panel. Die Vorschau enthält Beispieldaten.

Quellen bearbeiten, generierte Fassungen anschliessend neu erstellen:

```bash
python3 components/personal-wheel/build-standalone.py
```

Das Skript erzeugt `standalone.html` als vollständiges Dokument und `artifact.html` als einbettbare Fassung. Lokale Stylesheets und Skripte werden eingebettet; externe Google-Font-Verweise bleiben bestehen. Die Schriftversorgung unterscheidet sich damit vom vollständig lokal bestückten Atlas.

## Prüfen vor einer Änderung

Für den Atlas:

```bash
node --check docs/elanum-gestaltungsatlas/app.js
git diff --check
```

Danach die betroffenen Ansichten im Browser prüfen:

- Logo-Modi und Originalvergleich: keine Verzerrung oder abgeschnittenen Konturen.
- Desktop und Mobil: keine horizontalen Überläufe, lesbare Beschriftungen.
- Regler, Produkt-Tabs und Formulardemos: verständliche Zustände und Tastaturbedienung.
- Bewegung: Pause, reduzierte Bewegung und ruhende Beschriftungen.
- Lokale Assets und Fonts: keine fehlenden Dateien oder Konsolenfehler.

Für die bisherige SoulResonance-Regelbasis stehen zusätzlich diese Werkzeuge bereit:

```bash
python3 .claude/skills/elanum-designelemente/scripts/check_design.py docs/elanum-gestaltungsatlas
python3 .claude/skills/elanum-designelemente/scripts/verify_render.py docs/elanum-gestaltungsatlas/index.html
```

Der Rendercheck benötigt Python Playwright und einen passenden Chromium-Browser. Er prüft 320, 375, 768 und 1440 Pixel, jeweils mit normaler und reduzierter Bewegung. Beide Werkzeuge sind auf SoulResonance ausgerichtet, nicht auf die abweichende Relief-Designrichtung.

**Bekannter Stand:** Der SoulResonance-Linter meldet für Atlas 4.4 insgesamt 14 Regelabweichungen bei Gedankenstrichen, Hintergrunddeklarationen und `max-width`-Queries. Ein fehlerfreier SoulResonance-Check oder vollständiger Accessibility-Audit wird nicht behauptet. Durchgeführte Prüfungen und Einschränkungen sind in den [Prüfnotizen](docs/elanum-gestaltungsatlas/IMPORT-NOTES.md) dokumentiert.

## Veröffentlichung und Zusammenarbeit

Ein Push auf einen Arbeitsbranch ist weder ein Merge nach `main` noch ein Deployment. Der aktuelle Hosting-Status wird in dieser README nicht vorausgesetzt.

Für eine spätere statische Veröffentlichung müssen die vollständigen Atlas-Dateien im tatsächlich veröffentlichten Branch oder Build-Artefakt enthalten sein. Der Einstiegspfad lautet `docs/elanum-gestaltungsatlas/index.html`. Die Root-Startseite verlinkt den Atlas derzeit noch nicht.

Änderungen auf einem separaten Branch halten, nur betroffene Dateien committen und Prüfresultate nachvollziehbar dokumentieren. Eine Zusammenführung mit SoulResonance muss neben dem Design auch Tokens, Projekt-Skill und Referenzdokumentation berücksichtigen. Bestehende Regeln nicht stillschweigend durch eine neue Oberfläche ersetzen.

## Schriften und Nutzungsrechte

Die Font-Lizenzen liegen unter [assets/fonts](docs/elanum-gestaltungsatlas/assets/fonts/). Eine allgemeine Repository-Lizenz wird hier nicht erklärt oder vorausgesetzt; aus den Font-Lizenzen folgt keine Freigabe der ELANUM-Markenassets.
