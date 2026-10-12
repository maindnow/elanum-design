#!/usr/bin/env python3
"""Lokaler Server für den Atlas, ohne Browser-Cache.

Aufruf im Repo-Ordner:  python3 tools/serve.py
Danach http://127.0.0.1:4173 öffnen, beenden mit Ctrl+C.

Jede Datei kommt bei jedem Laden frisch vom Datenträger. So zeigt der
Browser nach einem Wechsel des Branches nie einen alten Stand.
Nur Python-Standardbibliothek.
"""
import functools
import http.server
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 4173


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


server = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), functools.partial(Handler, directory=ROOT))
print(f'Atlas läuft auf http://127.0.0.1:{PORT} · Beenden mit Ctrl+C', flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
