#!/usr/bin/env python3
"""
build-standalone.py, baut aus index.html eine eigenständige Fassung.

Alle verlinkten Stylesheets und Skripte werden inline gesetzt, damit die Seite
ohne Server und ohne Nachbardateien geöffnet werden kann.

Zwei Ausgaben:
    standalone.html   vollständiges Dokument, lokal im Browser zu öffnen
    artifact.html     nur Seiteninhalt, für die Veröffentlichung als Artifact

Usage:
    python build-standalone.py
"""

import pathlib
import re

HERE = pathlib.Path(__file__).parent
ROOT = HERE.parent.parent

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600'
         '&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" '
         'rel="stylesheet">')


def resolve(href):
    return (HERE / href).resolve()


def inline(html):
    """Ersetzt jedes lokale link/script durch seinen Inhalt."""
    def css(m):
        href = m.group(1)
        if href.startswith('http'):
            return m.group(0)
        return '<style>\n/* ' + href + ' */\n' + resolve(href).read_text() + '\n</style>'

    def js(m):
        src = m.group(1)
        if src.startswith('http'):
            return m.group(0)
        return '<script>\n/* ' + src + ' */\n' + resolve(src).read_text() + '\n</script>'

    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
    html = re.sub(r'<script src="([^"]+)"></script>', js, html)
    return html


def main():
    src = (HERE / 'index.html').read_text()
    full = inline(src)
    (HERE / 'standalone.html').write_text(full)

    # Für das Artifact: nur Titel, Stile, Inhalt und Skripte, ohne Dokumentgerüst.
    title = re.search(r'<title>(.*?)</title>', full, re.S).group(0)
    body = re.search(r'<body>(.*)</body>', full, re.S).group(1)
    styles = ''.join(re.findall(r'<style>.*?</style>', full, re.S))
    (HERE / 'artifact.html').write_text(title + '\n' + FONTS + '\n' + styles + '\n' + body.strip() + '\n')

    for name in ('standalone.html', 'artifact.html'):
        p = HERE / name
        print(f'{name}: {p.stat().st_size // 1024} KB')
        assert 'href="../../' not in p.read_text(), name + ' hat noch lokale Verweise'
    print('Alle lokalen Verweise aufgelöst.')


if __name__ == '__main__':
    main()
