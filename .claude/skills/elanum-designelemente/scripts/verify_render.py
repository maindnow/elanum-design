#!/usr/bin/env python3
"""
verify_render.py, oeffnet einen elanum-Screen wirklich im Browser und prueft die
Punkte, die kein Linter sehen kann: horizontaler Scroll, gelaufene Reveals, der
Grundton und das Verhalten unter prefers-reduced-motion.

Ein korrekt aussehender Diff ist kein Beweis. Dieses Script liefert Zahlen.

Usage:
    python verify_render.py <datei.html|http-url> [--shots <ordner>]

Voraussetzung:
    pip install playwright     (Chromium liegt in dieser Umgebung unter /opt/pw-browsers)

Exit-Codes:
    0: alle Viewports sauber
    2: mindestens ein Verstoss
"""

import glob
import os
import pathlib
import sys

VIEWPORTS = ((320, 800), (375, 812), (768, 1024), (1440, 900))
CANVAS_RGB = "rgb(246, 241, 229)"   # #F6F1E5


def find_chromium():
    for pattern in ("/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                    "/opt/pw-browsers/chromium/chrome-linux/chrome"):
        hits = glob.glob(pattern)
        if hits:
            return hits[0]
    return None


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        print(__doc__)
        return 2
    target = args[0]
    if not target.startswith("http"):
        target = pathlib.Path(target).resolve().as_uri()

    shots = None
    if "--shots" in sys.argv:
        shots = sys.argv[sys.argv.index("--shots") + 1]
        os.makedirs(shots, exist_ok=True)

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("playwright fehlt. pip install playwright", file=sys.stderr)
        return 2

    failures = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=find_chromium())
        for label, reduced in (("normal", "no-preference"), ("reduced-motion", "reduce")):
            for w, h in VIEWPORTS:
                ctx = browser.new_context(viewport={"width": w, "height": h},
                                          reduced_motion=reduced,
                                          device_scale_factor=2 if shots else 1)
                # Externe Requests abschneiden, sonst haengt der Lauf an Webfonts.
                # file:// bleibt erlaubt, sonst laedt die Seite selbst nicht.
                ctx.route("http://**", lambda r: r.abort())
                ctx.route("https://**", lambda r: r.abort())
                page = ctx.new_page()
                page.goto(target, wait_until="load")
                # Smooth-Scroll wuerde das schrittweise Durchfahren verfaelschen
                page.add_style_tag(content="html{scroll-behavior:auto!important}")
                page.evaluate("""async () => {
                  const H = document.documentElement.scrollHeight;
                  for (let y = 0; y <= H; y += 200) {
                    window.scrollTo(0, y);
                    await new Promise(r => setTimeout(r, 40));
                  }
                  window.scrollTo(0, 0);
                }""")
                page.wait_for_timeout(1200)

                sw = page.evaluate("document.documentElement.scrollWidth")
                iw = page.evaluate("window.innerWidth")
                ground = page.evaluate("getComputedStyle(document.body).backgroundColor")
                total = page.evaluate("document.querySelectorAll('.sr-fade,[data-reveal]').length")
                visible = page.evaluate("""() =>
                    [...document.querySelectorAll('.sr-fade,[data-reveal]')]
                      .filter(e => getComputedStyle(e).opacity !== '0').length""")
                moved = page.evaluate("""() =>
                    [...document.querySelectorAll('.sr-fade,[data-reveal]')]
                      .filter(e => getComputedStyle(e).transform !== 'none').length""")

                problems = []
                if sw > iw:
                    problems.append(f"horizontaler Body-Scroll ({sw} > {iw})")
                if total and visible < total:
                    problems.append(f"{total - visible} Element(e) bleiben unsichtbar")
                if ground != CANVAS_RGB:
                    problems.append(f"Grundton ist {ground}, erwartet {CANVAS_RGB}")
                if reduced == "reduce" and moved:
                    problems.append(f"{moved} Element(e) tragen unter reduced-motion "
                                    "noch ein transform")

                status = "OK" if not problems else "VERSTOSS"
                print(f"{label:15s} {w:>4}x{h:<4} scrollWidth={sw:<5} innerWidth={iw:<5} "
                      f"reveal {visible}/{total} transform={moved:<2} {status}")
                for p in problems:
                    print(f"                  -> {p}")
                    failures.append(f"{label} {w}x{h}: {p}")

                if shots and reduced == "no-preference":
                    page.screenshot(path=f"{shots}/render-{w}.png", full_page=True)
                ctx.close()
        browser.close()

    print()
    if failures:
        print(f"{len(failures)} Verstoss/Verstoesse. Nicht abliefern, bevor das behoben ist.")
        return 2
    print("Alle Viewports sauber. Jetzt das gerenderte Ergebnis anschauen, dann "
          "references/acceptance-checkliste.md durchgehen.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
