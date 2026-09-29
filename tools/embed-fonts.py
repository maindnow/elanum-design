#!/usr/bin/env python3
"""
embed-fonts.py, erzeugt assets/fonts/fonts-embedded.css.

Chrome und Edge laden unter file:// keine Schriftdateien, weil Schriften immer
im CORS-Modus angefordert werden. Wer index.html direkt aus dem Ordner oeffnet,
saehe sonst nur Ersatzschriften. Diese Datei enthaelt dieselben @font-face-Regeln
wie style.css, aber mit eingebetteten Schriften. index.html laedt sie nur unter
file://, gehostete Seiten fordern sie nie an.

Nach jeder Aenderung an den Schriften oder ihren @font-face-Regeln neu erzeugen:
    python3 tools/embed-fonts.py
"""
import base64, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
css = (ROOT / "style.css").read_text()
rules = re.findall(r"@font-face\{[^}]*\}", css)
if not rules:
    raise SystemExit("Keine @font-face-Regeln in style.css gefunden.")

out = ["/* Automatisch erzeugt von tools/embed-fonts.py. Nicht von Hand bearbeiten.\n"
       "   Wird nur beim Oeffnen ueber file:// geladen, siehe index.html. */"]
for rule in rules:
    m = re.search(r"url\(([^)]+)\)", rule)
    font = ROOT / m.group(1).strip("'\"")
    data = base64.b64encode(font.read_bytes()).decode("ascii")
    out.append(rule.replace(m.group(0), f"url(data:font/woff2;base64,{data})"))
    print(f"eingebettet: {font.relative_to(ROOT)} ({font.stat().st_size // 1024} KB)")

target = ROOT / "assets" / "fonts" / "fonts-embedded.css"
target.write_text("\n".join(out) + "\n")
print(f"geschrieben: {target.relative_to(ROOT)} ({target.stat().st_size // 1024} KB)")
