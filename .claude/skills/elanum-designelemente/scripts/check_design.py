#!/usr/bin/env python3
"""
check_design.py, prueft elanum-Dateien gegen die maschinell pruefbaren Regeln
des SoulResonance-Systems.

Usage:
    python check_design.py <datei.html|datei.css>
    python check_design.py <ordner>

Exit-Codes:
    0: sauber
    1: nur Warnungen
    2: mindestens ein harter Verstoss, nicht abliefern
"""

import re
import sys
from pathlib import Path

EXTS = {".html", ".htm", ".css", ".jsx", ".tsx", ".vue", ".svelte"}

CANVAS = "#F6F1E5"
RESONANCE = ("6756D9", "4D7FE8", "9466DF", "D85BA9", "F0719A")
STATUS = ("33638F", "3F7350", "8A5A16", "A32F3C", "5B6660")

# (Regex, Schwere, Meldung). Schwere: "error" blockt, "warn" meldet nur.
RULES = [
    (r"@media[^{]*\bmax-width\s*:", "error",
     "max-width-Media-Query. Das System ist mobile first, nur min-width."),
    (r"background(?:-color)?\s*:\s*(?:#fff(?:fff)?\b|white\b)", "error",
     "Weisser Hintergrund. Der Grund ist #F6F1E5."),
    (r"(?:color|background|border|box-shadow)[^;{}]*#000000\b", "error",
     "Reines Schwarz #000000 ist verboten."),
    (r"\bbackdrop-filter\s*:\s*blur", "error",
     "Glassmorphism ist verboten."),
    (r"[–—]", "error",
     "Gedankenstrich oder Halbgeviertstrich. Komma, Doppelpunkt, Punkt oder Bindestrich."),
    (r"\b100vh\b", "warn",
     "100vh gefunden. Das System nutzt 100dvh."),
    (r"window\.(?:addEventListener\(\s*['\"]scroll|onscroll)", "error",
     "Scroll-Listener. IntersectionObserver oder CSS-Scroll-Timeline, sonst nichts."),
    (r"transition[^;{}]*\b(?:width|height|top|left)\b", "warn",
     "Animierte Layout-Eigenschaft. Nur transform und opacity."),
]

SURFACE_CLASSES = ("sr-card", "sr-demo", "sr-paper", "sr-metric", "sr-badge",
                   "sr-btn", "sr-eyebrow", "sr-swatch")


def strip_comments(text, is_css):
    text = re.sub(r"/\*.*?\*/", " ", text, flags=re.S)
    if not is_css:
        text = re.sub(r"<!--.*?-->", " ", text, flags=re.S)
    return text


def visible_mask(html):
    """Blendet alles Unsichtbare aus, behaelt aber jede Position und jeden
    Zeilenumbruch, damit gemeldete Zeilennummern exakt stimmen."""
    chars = list(html)

    def blank(match, keep_groups=()):
        for i in range(match.start(), match.end()):
            if chars[i] != "\n":
                chars[i] = " "
        for g in keep_groups:
            if match.group(g) is None:
                continue
            for i in range(match.start(g), match.end(g)):
                chars[i] = html[i]

    for m in re.finditer(r"<(script|style)\b.*?</\1>", html, re.S | re.I):
        blank(m)
    for m in re.finditer(r"<!--.*?-->", html, re.S):
        blank(m)
    # Tags ausblenden, aber sichtbare Attributwerte stehen lassen
    for m in re.finditer(r"<[^>]*>", "".join(chars), re.S):
        inner = m.group(0)
        keep = []
        for a in re.finditer(r'\b(?:alt|title|aria-label|placeholder)\s*=\s*"([^"]*)"',
                             inner, re.I):
            keep.append((m.start() + a.start(1), m.start() + a.end(1)))
        for i in range(m.start(), m.end()):
            if chars[i] != "\n" and not any(a <= i < b for a, b in keep):
                chars[i] = " "
    return "".join(chars)


def check_file(path):
    findings = []
    raw = path.read_text(encoding="utf-8", errors="replace")
    is_css = path.suffix == ".css"
    code = strip_comments(raw, is_css)
    lines = raw.splitlines()

    for pattern, severity, message in RULES:
        scope = code
        # Gedankenstriche nur in sichtbarem Text, nicht in Kommentaren oder Code
        if "–" in pattern:
            if is_css:
                continue
            scope = visible_mask(raw)
        for m in re.finditer(pattern, scope, re.I):
            line = scope[:m.start()].count("\n") + 1
            snippet = m.group(0).strip()[:70]
            findings.append((severity, line, message, snippet))

    # Rahmen auf einer Systemflaeche
    for m in re.finditer(r"\.(" + "|".join(SURFACE_CLASSES) + r")\b[^{]*\{([^}]*)\}", code):
        block = m.group(2)
        if re.search(r"(?<!-)\bborder\s*:\s*(?!0\b|none\b)", block):
            line = code[:m.start()].count("\n") + 1
            findings.append(("error", line,
                             "Rahmen auf einer Flaeche. Flaechen werden gepresst, nicht umrandet.",
                             "." + m.group(1)))
        if re.search(r"\boverflow\s*:\s*hidden", block):
            line = code[:m.start()].count("\n") + 1
            findings.append(("error", line,
                             "overflow:hidden auf einer gehobenen Flaeche. Der Hof wird beschnitten.",
                             "." + m.group(1)))

    # Glow auf einer Statusfarbe
    for m in re.finditer(r"(drop-shadow|box-shadow)\s*\([^)]*\)|--sr-glow[\w-]*", code):
        seg = code[max(0, m.start() - 300):m.end() + 300]
        if any(s.lower() in seg.lower() for s in STATUS) and "glow" in m.group(0).lower():
            line = code[:m.start()].count("\n") + 1
            findings.append(("warn", line,
                             "Glow in der Naehe einer Statusfarbe. Status leuchtet nie.",
                             m.group(0)[:70]))

    # Zwei Spektralkanten auf einer Flaeche
    if not is_css:
        for m in re.finditer(r"<(div|section|article|li|a|button)\b[^>]*>", raw):
            start = m.end()
            depth_slice = raw[start:start + 4000]
            edges = re.findall(r'class="[^"]*\bsr-edge\b[^"]*"', depth_slice.split("</div>")[0])
            if len(edges) > 1:
                line = raw[:m.start()].count("\n") + 1
                findings.append(("warn", line,
                                 "Mehr als eine Spektralkante in einer Flaeche.",
                                 f"{len(edges)} Kanten"))

    # svg{overflow:visible} muss gesetzt sein, wenn SVG vorkommt
    if "<svg" in raw or is_css:
        has_svg_rule = re.search(r"\bsvg\s*\{[^}]*overflow\s*:\s*visible", code)
        links_css = re.search(r'<link[^>]+rel\s*=\s*"?stylesheet', raw, re.I)
        if "<svg" in raw and not has_svg_rule and not is_css and not links_css:
            findings.append(("warn", 1,
                             "svg{overflow:visible} fehlt und es ist kein Stylesheet "
                             "verlinkt. Der Glow wird beschnitten.", "<svg>"))

    return findings


def main():
    targets = sys.argv[1:]
    if not targets:
        print(__doc__)
        return 2

    files = []
    for t in targets:
        p = Path(t)
        if p.is_dir():
            files += [f for f in sorted(p.rglob("*")) if f.suffix.lower() in EXTS]
        elif p.is_file():
            files.append(p)
        else:
            print(f"nicht gefunden: {t}", file=sys.stderr)

    errors = warns = 0
    for f in files:
        found = check_file(f)
        if not found:
            print(f"OK   {f}")
            continue
        print(f"\n{f}")
        for severity, line, message, snippet in sorted(found, key=lambda x: x[1]):
            mark = "FEHLER " if severity == "error" else "WARNUNG"
            print(f"  {mark} Zeile {line}: {message}")
            print(f"          gefunden: {snippet}")
            if severity == "error":
                errors += 1
            else:
                warns += 1

    print(f"\n{len(files)} Datei(en), {errors} Fehler, {warns} Warnungen.")
    if errors:
        print("Harter Verstoss. Nicht abliefern, bevor das behoben ist.")
        return 2
    if warns:
        print("Nur Warnungen. Jede einzeln pruefen, dann die Acceptance-Checkliste durchgehen.")
        return 1
    print("Sauber. Jetzt references/acceptance-checkliste.md durchgehen.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
