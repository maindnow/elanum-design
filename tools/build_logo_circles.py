#!/usr/bin/env python3
"""ELANUM – Kreiskonstruktion des Logos.

Erzeugt aus wenigen Konstruktionskreisen die Logo-Dateien:

  assets/ELANUM-System-Ink-<V>.svg
  assets/ELANUM-Master-Spektrum-<V>.svg   (Farbnetz aus -Curves, neue Konturen)
  assets/ELANUM-Konstruktion-<V>.svg      (Blueprint mit allen Kreisen)
  components/zeichen/zeichen.js           (Konstruktion für den Zeichenaufbau, Zeile "var K")

<V> = Harmonic: alle Radien aus der Reihe R * phi^(-k/4) (Goldener Schnitt).
Das ist das gültige ELANUM-Zeichen. CIRCLES (nah am Original) bleibt nur als
Definition für den Prüfbericht stehen und wird nicht mehr geschrieben.

Jede Kontur ist eine Kette aus Kreisbögen. Aufeinanderfolgende Bögen berühren sich
tangential (ihre Mittelpunkte liegen mit dem Übergangspunkt auf einer Geraden).
Die einzigen Ecken sind bewusst gesetzte Abzweigungen und die Schnitte mit dem
Aussenkreis. Die feinen Linien folgen einer Mittellinie mit stetig wechselnden
Radien: Ihr Körper ist konzentrisch und gleich stark, an den Enden laufen sie in
zwei sich berührenden Spitzenkreisen aus.

Nur Python-Standardbibliothek. Aufruf aus dem Repository-Wurzelverzeichnis:

  python3 tools/build_logo_circles.py
"""

import base64
import json
import math
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'assets')
TAU = 2 * math.pi
INK = '#16363B'
VIEWBOX = '144 132 960 960'


# ---------------------------------------------------------------- Vektoren

def add(a, b): return (a[0] + b[0], a[1] + b[1])
def sub(a, b): return (a[0] - b[0], a[1] - b[1])
def mul(a, s): return (a[0] * s, a[1] * s)
def dot(a, b): return a[0] * b[0] + a[1] * b[1]
def norm(a): return math.hypot(a[0], a[1])
def unit(angle): return (math.cos(angle), math.sin(angle))
def deg(a): return math.radians(a)
# Linke Normale. Im SVG-Koordinatensystem (y nach unten) zeigt sie, in Laufrichtung
# gesehen, nach rechts. Ein positiver Radius dreht deshalb im Uhrzeigersinn (sweep = 1).
def normal(t): return (-t[1], t[0])


# ---------------------------------------------------------------- Bögen

class Arc:
    """Kreisbogen mit vorzeichenbehaftetem Radius rho (> 0: im Uhrzeigersinn)."""

    def __init__(self, center, rho, start, phi):
        self.c = center
        self.rho = rho
        self.r = abs(rho)
        self.a0 = math.atan2(start[1] - center[1], start[0] - center[0])
        self.phi = phi
        self.name = ''

    @property
    def sign(self): return 1 if self.rho > 0 else -1

    def at(self, u):
        a = self.a0 + self.sign * self.phi * u
        return (self.c[0] + self.r * math.cos(a), self.c[1] + self.r * math.sin(a))

    def tangent(self, u):
        a = self.a0 + self.sign * self.phi * u
        return (-self.sign * math.sin(a), self.sign * math.cos(a))

    @property
    def start(self): return self.at(0)
    @property
    def end(self): return self.at(1)

    def param_of(self, p):
        """Anteil u in [0, 1] eines Punktes auf dem Kreis, oder None ausserhalb des Bogens."""
        a = math.atan2(p[1] - self.c[1], p[0] - self.c[0])
        d = (self.sign * (a - self.a0)) % TAU
        if d <= self.phi + 1e-9:
            return d / self.phi if self.phi else 0.0
        return None

    def part(self, u0, u1):
        """Teilbogen von u0 bis u1; u1 < u0 ergibt den rückwärts laufenden Bogen."""
        p0 = self.at(u0)
        if u1 >= u0:
            return Arc(self.c, self.rho, p0, self.phi * (u1 - u0))
        return Arc(self.c, -self.rho, p0, self.phi * (u0 - u1))

    def reversed(self): return self.part(1, 0)

    def svg(self):
        x, y = self.end
        return 'A %s %s 0 %d %d %s %s' % (f(self.r), f(self.r), int(self.phi > math.pi),
                                         1 if self.rho > 0 else 0, f(x), f(y))


def f(v):
    s = '%.4f' % v
    s = s.rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def arc_from(p, t, rho, phi):
    return Arc(add(p, mul(normal(t), rho)), rho, p, phi)


def turn(t_from, t_to, rho):
    a = math.atan2(t_to[1], t_to[0]) - math.atan2(t_from[1], t_from[0])
    return a % TAU if rho > 0 else (-a) % TAU


def chain(p, t, spec):
    arcs = []
    for rho, phi in spec:
        a = arc_from(p, t, rho, phi)
        arcs.append(a)
        p, t = a.end, a.tangent(1)
    return arcs


def biarc(p, t, rho_a, p1, t1):
    """Bogen rho_a ab (p, t), dann ein zweiter Bogen, der tangential in (p1, t1) endet."""
    ca = add(p, mul(normal(t), rho_a))
    n1 = normal(t1)
    d = sub(ca, p1)
    den = 2 * (dot(d, n1) - rho_a)
    if abs(den) < 1e-12:
        return None
    rho_b = (dot(d, d) - rho_a ** 2) / den
    cb = add(p1, mul(n1, rho_b))
    if abs(rho_a - rho_b) < 1e-9:
        return None
    n = mul(sub(ca, cb), 1 / (rho_a - rho_b))
    j = sub(ca, mul(n, rho_a))
    tj = (n[1], -n[0])
    return turn(t, tj, rho_a), rho_b, turn(tj, t1, rho_b)


def solve(fn, lo, hi, hint, steps=600):
    """Nullstelle von fn in [lo, hi], die hint am nächsten liegt (Abtasten, dann Bisektion)."""
    roots = []
    prev_x, prev_y = lo, fn(lo)
    for i in range(1, steps + 1):
        x = lo + (hi - lo) * i / steps
        y = fn(x)
        # Vorzeichenwechsel ohne Sprung: echte Nullstelle, kein Pol
        if prev_y is not None and y is not None and prev_y * y <= 0 and abs(prev_y - y) < 20:
            a, b, fa = prev_x, x, prev_y
            for _ in range(80):
                m = (a + b) / 2
                fm = fn(m)
                if fa * fm <= 0:
                    b = m
                else:
                    a, fa = m, fm
            roots.append((a + b) / 2)
        prev_x, prev_y = x, y
    if not roots:
        raise ValueError('keine Lösung im Intervall')
    return min(roots, key=lambda r: abs(r - hint))


def closed_chain(p0, t0, radii, phis, hint, p1, t1):
    """Kette mit vorgegebenen Radien von (p0, t0) nach (p1, t1).

    phis gibt die Drehwinkel der ersten Bögen vor. Der Winkel des drittletzten Bogens
    wird so bestimmt, dass die letzten beiden Bögen exakt die vorgegebenen Radien
    erhalten und tangential in p1 enden.
    """
    fixed = list(zip(radii, phis))

    def build(x):
        arcs = chain(p0, t0, fixed + [(radii[len(phis)], x)])
        q, tq = arcs[-1].end, arcs[-1].tangent(1)
        res = biarc(q, tq, radii[-2], p1, t1)
        return arcs, q, tq, res

    def err(x):
        res = build(x)[3]
        if res is None or res[0] > math.pi or res[2] > math.pi:
            return None
        return res[1] - radii[-1]

    x = solve(err, hint - 0.6, hint + 0.6, hint)
    arcs, q, tq, (pa, rb, pb) = build(x)
    return arcs + chain(q, tq, [(radii[-2], pa), (rb, pb)])


def stroke(spine, width):
    """Linie um eine Mittellinie.

    Der Körper ist konzentrisch zur Mittellinie und hat überall dieselbe Stärke.
    Den ersten und letzten Bogen der Mittellinie ersetzt je Kante ein Spitzenkreis:
    Er geht durch den Endpunkt der Mittellinie und berührt den versetzten Nachbarbogen.
    Die beiden Spitzenkreise einer Seite berühren sich im Endpunkt, dort läuft die Linie aus."""
    p0, t0 = spine[0].start, spine[0].tangent(0)
    p1, t1 = spine[-1].end, spine[-1].tangent(1)

    def tip_circle(p, t, c, rho):
        n = normal(t)
        d = sub(p, c)
        r = (rho ** 2 - dot(d, d)) / (2 * (dot(d, n) + rho))
        return (add(p, mul(n, r)), r)

    edges = []
    for d in (width / 2, -width / 2):
        body = [(a.c, a.rho - d) for a in spine[1:-1]]
        circles = [tip_circle(p0, t0, *body[0])] + body + [tip_circle(p1, t1, *body[-1])]
        joints = [p0]
        for (ca, ra), (cb, rb) in zip(circles, circles[1:]):
            n = mul(sub(ca, cb), 1 / (ra - rb))
            joints.append(sub(ca, mul(n, ra)))
        joints.append(p1)
        arcs = []
        for (c, rho), a, b in zip(circles, joints, joints[1:]):
            na, nb = mul(sub(c, a), 1 / rho), mul(sub(c, b), 1 / rho)
            arcs.append(Arc(c, rho, a, turn((na[1], -na[0]), (nb[1], -nb[0]), rho)))
        edges.append(arcs)
    return edges


def circle_hits(c1, r1, c2, r2):
    d = norm(sub(c2, c1))
    if d == 0 or d > r1 + r2 or d < abs(r1 - r2):
        return []
    a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    h = math.sqrt(max(r1 * r1 - a * a, 0))
    e = mul(sub(c2, c1), 1 / d)
    m = add(c1, mul(e, a))
    return [add(m, mul(normal(e), h)), sub(m, mul(normal(e), h))]


def until_circle(p, t, rho, c, r):
    """Bogen ab (p, t) bis zum ersten Schnitt mit dem Kreis (c, r)."""
    a = arc_from(p, t, rho, TAU - 1e-9)
    best = None
    for x in circle_hits(a.c, a.r, c, r):
        u = a.param_of(x)
        if u is not None and u > 1e-9 and (best is None or u < best):
            best = u
    if best is None:
        raise ValueError('kein Schnitt mit dem Kreis')
    return a.part(0, best)


def first_hit(arc, others):
    """Erster Schnitt des Bogens mit einer Bogenkette. Liefert (u_arc, index, u_other)."""
    best = None
    for i, o in enumerate(others):
        for x in circle_hits(arc.c, arc.r, o.c, o.r):
            u, v = arc.param_of(x), o.param_of(x)
            if u is not None and v is not None and u > 1e-6 and (best is None or u < best[0]):
                best = (u, i, v)
    if best is None:
        raise ValueError('kein Schnitt')
    return best


def at_bearing(arcs, center, angle):
    """Punkt der Kette in Richtung angle (Grad) vom Punkt center aus. Liefert (index, u)."""
    target = unit(deg(angle))

    def side(i, u):
        p = sub(arcs[i].at(u), center)
        return p[0] * target[1] - p[1] * target[0], dot(p, target)

    for i in range(len(arcs)):
        steps = 200
        prev = side(i, 0)
        for k in range(1, steps + 1):
            cur = side(i, k / steps)
            if prev[0] * cur[0] <= 0 and cur[1] > 0:
                a, b = (k - 1) / steps, k / steps
                for _ in range(60):
                    m = (a + b) / 2
                    if side(i, a)[0] * side(i, m)[0] <= 0:
                        b = m
                    else:
                        a = m
                return i, (a + b) / 2
            prev = cur
    raise ValueError('keine Richtung gefunden')


def path(arcs, move=True):
    out = ['M %s %s' % (f(arcs[0].start[0]), f(arcs[0].start[1]))] if move else []
    return ' '.join(out + [a.svg() for a in arcs])


def reverse(arcs): return [a.reversed() for a in reversed(arcs)]


def kink(arcs):
    """Grösster Tangentenknick (Grad) zwischen aufeinanderfolgenden Bögen."""
    worst = 0.0
    for a, b in zip(arcs, arcs[1:]):
        t1, t2 = a.tangent(1), b.tangent(0)
        worst = max(worst, math.degrees(math.acos(max(-1, min(1, dot(t1, t2))))))
        worst = max(worst, norm(sub(a.end, b.start)) * 1000)  # Lücke würde auffallen
    return worst


# ---------------------------------------------------------------- Varianten
#
# Radien mit Vorzeichen: positiv = Bogen im Uhrzeigersinn. Winkel in Grad.

PHI = (1 + 5 ** 0.5) / 2

CIRCLES = {
    'name': 'Circles',
    'title': 'nah am Original',
    'O': (624.65, 613.27), 'R': 460.54,          # Aussenkreis (unverändert)
    'H': (531.15, 632.98), 'r0': 122.05,         # Öffnung (unverändert)
    'T': (809.0, 540.0), 'thT': 61,              # Knotenpunkt von Linie und Kerbe
    'S': -114.1,                                 # Abzweig der unteren Linie an der Öffnung
    # Mittellinien. Obere Linie von E nach T: Radien, vorgegebene Winkel, Startwert.
    # Erster und letzter Bogen sind die kurzen Spitzen. Radien wachsen stetig;
    # der dritte Winkel wird so gelöst, dass die Kette tangential in T ankommt.
    'L1': ([144, 158, 195, 240, 300], [64, 109], 33.1),
    'w1': 6,                                     # Linienstärke
    # Untere Linie ab S mit freier Spitze W: (Radius, Winkel)
    'L2': [(264, 25.0), (191, 70.2), (239, 98.6), (299, 27.2), (370, 21.6)],
    'w2': 5,
    'NU': -166, 'NL': -204,
    'TB': (76.3, [(-319, 34)], -169),
    'FC': 186,
    'LA': (5.37, 60.1, 557, 15.6),               # Abzweig an Linie 2: Richtung von H, Winkel, Radius, Drehung
    'LB': (8.4, -254),
}

# Harmonic: Alle Radien sind Stufen der Reihe R * q^-k mit q = phi^(1/4).
# Vier Stufen ergeben genau den Goldenen Schnitt. Die Öffnung ist Stufe 11.
Q = PHI ** 0.25


def step(k):
    return 460.54 * Q ** -k


HARMONIC = {
    'name': 'Harmonic',
    'title': 'Radien im Goldenen Schnitt',
    'O': (624.65, 613.27), 'R': step(0),
    'H': (531.15, 632.98), 'r0': step(11),
    'T': (809.0, 540.0), 'thT': 61,
    'S': -113.7,
    'L1': ([step(10), step(8), step(6), step(5), step(3)], [83, 120], 39.6),
    'w1': 6,
    'L2': [(step(5), 27.1), (step(7), 60.5), (step(6), 81.0), (step(4), 42.8), (step(3), 33.2)],
    'w2': 5,
    'NU': -step(9), 'NL': -step(7),
    'TB': (76.3, [(-step(3), 34)], -step(8)),
    'FC': step(8),
    'LA': (5.37, 60.1, step(-2), 15.6),
    'LB': (8.4, -step(5)),
}


# ---------------------------------------------------------------- Konstruktion

def construct(v):
    O, R, H, r0 = v['O'], v['R'], v['H'], v['r0']
    T = v['T']
    tT = unit(deg(v['thT']))
    E = (H[0] + r0, H[1])
    aS = deg(v['S'])
    S = add(H, mul(unit(aS), r0))
    tS = unit(aS + math.pi / 2)

    g = {}
    radii, phis, hint = v['L1']
    g['L1c'] = closed_chain(E, (0, 1), radii, [deg(x) for x in phis], deg(hint), T, tT)
    g['L2c'] = chain(S, tS, [(r, deg(p)) for r, p in v['L2']])
    W, tW = g['L2c'][-1].end, g['L2c'][-1].tangent(1)
    g['L1i'], g['L1o'] = stroke(g['L1c'], v['w1'])
    g['L2i'], g['L2o'] = stroke(g['L2c'], v['w2'])
    g['NU'] = [until_circle(T, tT, v['NU'], O, R)]
    g['NL'] = [until_circle(T, tT, v['NL'], O, R)]
    a_tb, spec_tb, last_tb = v['TB']
    tb = chain(T, unit(deg(a_tb)), [(r, deg(p)) for r, p in spec_tb])
    tb.append(until_circle(tb[-1].end, tb[-1].tangent(1), last_tb, O, R))
    g['TB'] = tb

    # Abschluss der vorderen Fläche: setzt Linie 2 an der Spitze tangential fort
    fc = arc_from(W, tW, v['FC'], TAU - 1e-9)
    u, i, w = first_hit(fc, g['L1c'])
    g['FC'] = [fc.part(0, u)]
    g['FC_hit'] = (i, w)

    # Untere Bandkante: Abzweig an Linie 2, Ecke, Bogen bis zur Schwanzkante
    bearing, ang, rho, turn_deg = v['LA']
    i, u = at_bearing(g['L2c'], H, bearing)
    la = arc_from(g['L2c'][i].at(u), unit(deg(ang)), rho, deg(turn_deg))
    g['LA_at'] = (i, u)
    ang_b, rho_b = v['LB']
    lb = arc_from(la.end, unit(deg(ang_b)), rho_b, TAU - 1e-9)
    u, i, w = first_hit(lb, g['TB'])
    g['LA'], g['LB'] = [la], [lb.part(0, u)]
    g['LB_hit'] = (i, w)

    g.update(O=O, R=R, H=H, r0=r0, E=E, S=S, T=T, W=W)
    return g


def regions(g):
    R, H, r0, E, S = g['R'], g['H'], g['r0'], g['E'], g['S']
    nu, nl = g['NU'][0], g['NL'][0]
    A, B = nu.end, nl.end
    hole = 'M %s %s A %s %s 0 1 1 %s %s A %s %s 0 1 1 %s %s Z' % (
        f(E[0]), f(E[1]), f(r0), f(r0), f(2 * H[0] - E[0]), f(E[1]),
        f(r0), f(r0), f(E[0]), f(E[1]))
    # Aussenkreis von A gegen den Uhrzeigersinn um das Logo herum bis B
    outer = 'M %s %s A %s %s 0 1 0 %s %s' % (f(A[0]), f(A[1]), f(R), f(R), f(B[0]), f(B[1]))
    silhouette = outer + ' ' + path([nl.reversed(), nu], move=False) + ' Z ' + hole

    line1 = path(g['L1i']) + ' ' + path(reverse(g['L1o']), move=False) + ' Z'
    line2 = path(g['L2i']) + ' ' + path(reverse(g['L2o']), move=False) + ' Z'
    ink = silhouette + ' ' + line1 + ' ' + line2

    # Vordere Fläche: Linie 2 bis zur Spitze, Fortsetzung bis Linie 1, Linie 1 zurück zur Öffnung
    i, w = g['FC_hit']
    l1back = [g['L1c'][i].part(w, 0)] + reverse(g['L1c'][:i])
    top_ccw = 'A %s %s 0 0 0 %s %s' % (f(r0), f(r0), f(S[0]), f(S[1]))
    top_cw = 'A %s %s 0 0 1 %s %s' % (f(r0), f(r0), f(E[0]), f(E[1]))
    front = path(g['L2c'] + g['FC'] + l1back) + ' ' + top_ccw + ' Z'

    # Band: Linie 1 bis T, Schwanzkante, untere Bandkante, Linie 2 zurück zur Öffnung
    i, w = g['LB_hit']
    tb_part = g['TB'][:i] + [g['TB'][i].part(0, w)]
    i, u = g['LA_at']
    l2back = [g['L2c'][i].part(u, 0)] + reverse(g['L2c'][:i])
    band = path(g['L1c'] + tb_part + reverse(g['LB']) + reverse(g['LA']) + l2back) + ' ' + top_cw + ' Z'

    # Schwanz: Schwanzkante bis zum Aussenkreis, Aussenkreis hinauf bis B, Kerbe zurück
    tail = (path(g['TB']) + ' A %s %s 0 0 0 %s %s ' % (f(R), f(R), f(B[0]), f(B[1]))
            + path([nl.reversed()], move=False) + ' Z')
    # Aussenkontur in Zeichenrichtung: Aussenkreis von A bis B, dann die Kerbe zurück zu A
    outline = outer + ' ' + path([nl.reversed(), nu], move=False)
    return {'silhouette': silhouette, 'ink': ink, 'front': front, 'band': band, 'tail': tail,
            'A': A, 'B': B, 'outline': outline, 'hole': hole}


# ---------------------------------------------------------------- Ausgabe

def ink_svg(rg):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="960" height="960" viewBox="%s">'
            '<defs><clipPath id="i-system-limit"><path d="%s" clip-rule="evenodd"/></clipPath></defs>'
            '<path d="%s" fill="%s" fill-rule="evenodd" clip-path="url(#i-system-limit)"/></svg>\n'
            % (VIEWBOX, rg['silhouette'], rg['ink'], INK))


def spectrum_svg(rg):
    src = open(os.path.join(ASSETS, 'ELANUM-Master-Spektrum-Curves.svg'), encoding='utf-8').read()
    swap = {'h-silhouette': rg['silhouette'], 'h-clip-base': rg['silhouette'],
            'h-clip-front': rg['front'], 'h-clip-band': rg['band'], 'h-clip-tail': rg['tail']}
    for cid, d in swap.items():
        pat = re.compile(r'(<clipPath[^>]*id="%s"[^>]*>\s*<path[^>]*?\bd=")[^"]*(")' % cid)
        src, n = pat.subn(lambda m: m.group(1) + d + m.group(2), src)
        if n != 1:
            raise RuntimeError('clipPath %s nicht gefunden' % cid)
    return src


def construction_circles(v, g):
    """Konstruktionskreise (Mittelpunkt, Radius, Stufe, Rolle) und die gezeigten Bögen."""
    circles = []          # (center, radius, label, role)
    seen = set()

    def add_circle(c, r, label, role):
        key = (round(c[0], 2), round(c[1], 2), round(r, 2))
        if key not in seen:
            seen.add(key)
            circles.append((c, r, label, role))

    add_circle(g['O'], g['R'], label_for(v, g['R']), 'main')
    add_circle(g['H'], g['r0'], label_for(v, g['r0']), 'main')
    used = []
    spine_centers = {(round(a.c[0], 6), round(a.c[1], 6)) for k in ('L1c', 'L2c') for a in g[k]}
    for key in ('L1c', 'L2c', 'L1i', 'L1o', 'L2i', 'L2o', 'NU', 'NL', 'TB', 'FC', 'LA', 'LB'):
        for a in g[key]:
            if key in ('L1c', 'L2c'):
                role = 'line'
            elif key[0] == 'L' and key[1] in '12':
                # Körperbögen sind konzentrisch zur Mittellinie und folgen aus der Linienstärke
                role = 'body' if (round(a.c[0], 6), round(a.c[1], 6)) in spine_centers else 'tip'
            else:
                role = 'notch' if key in ('NU', 'NL') else 'aux'
            # Körper- und Spitzenbögen folgen aus Mittellinie und Linienstärke: nur als Bogen gezeigt
            if role not in ('body', 'tip'):
                add_circle(a.c, a.r, label_for(v, a.r), role)
            if key not in ('L1c', 'L2c'):
                used.append((a, key))
    return circles, used


def blueprint_svg(v, g, rg):
    name = v['name']
    circles, used = construction_circles(v, g)
    parts = []
    parts.append('<rect x="-400" y="-400" width="2200" height="2200" fill="#F6F1E7"/>')
    grid = []
    for k in range(-400, 1800, 48):
        grid.append('M %d -400 V 1800 M -400 %d H 1800' % (k, k))
    parts.append('<path d="%s" stroke="#16363B" stroke-opacity=".05" stroke-width="1"/>' % ' '.join(grid))
    parts.append('<path d="%s" fill="%s" fill-opacity=".10" fill-rule="evenodd"/>' % (rg['ink'], INK))
    colors = {'main': '#16363B', 'line': '#6756D9', 'tip': '#6756D9', 'notch': '#3E898D', 'aux': '#D85BA9'}
    for c, r, label, role in circles:
        parts.append('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-opacity="%s" stroke-width="%s"%s/>'
                     % (f(c[0]), f(c[1]), f(r), colors[role], {'main': '.6', 'aux': '.22'}.get(role, '.45'),
                        '1.4' if role == 'main' else '.9', ' stroke-dasharray="4 6"' if role == 'aux' else ''))
    for a, key in used:
        parts.append('<path d="%s" fill="none" stroke="%s" stroke-width="2.2" stroke-linecap="round"/>'
                     % (path([a]), '#D85BA9' if key in ('TB', 'FC', 'LA', 'LB') else '#16363B'))
    for c, r, label, role in circles:
        if role != 'aux' and -200 < c[0] < 1500 and -200 < c[1] < 1500:
            parts.append('<path d="M %s %s h 12 M %s %s v 12" stroke="%s" stroke-width="1.2"/>'
                         % (f(c[0] - 6), f(c[1]), f(c[0]), f(c[1] - 6), colors[role]))
    joints = []
    for key in ('L1c', 'L2c', 'TB'):
        joints += [a.end for a in g[key][:-1]]
    for p in joints:
        parts.append('<circle cx="%s" cy="%s" r="3.2" fill="#F6F1E7" stroke="#16363B" stroke-width="1.2"/>' % (f(p[0]), f(p[1])))
    for key in ('E', 'S', 'T', 'W'):
        p = g[key]
        parts.append('<circle cx="%s" cy="%s" r="5.5" fill="#16363B"/>' % (f(p[0]), f(p[1])))
        parts.append('<text x="%s" y="%s" font-family="sans-serif" font-size="17" fill="#16363B">%s</text>'
                     % (f(p[0] + 10), f(p[1] - 10), key))
    for p in (rg['A'], rg['B']):
        parts.append('<circle cx="%s" cy="%s" r="4" fill="#D85BA9"/>' % (f(p[0]), f(p[1])))
    legend = ['ELANUM / Kreiskonstruktion · %s' % v['title'],
              'Ink: Aussenkreis R und Öffnung r₀ · Violett: Mittellinien · Petrol: Kerbe',
              'Magenta, gestrichelt: Hilfskreise für die Farbkanten des Spektrums · Ringe: Bogenübergänge',
              'Linienkörper und Spitzen folgen aus Mittellinie und Linienstärke · E, S, T, W: Punkte, in denen Linien und Kerbe auslaufen']
    for k, line in enumerate(legend):
        parts.append('<text x="64" y="%d" font-family="sans-serif" font-size="%d" fill="#16363B"%s>%s</text>'
                     % (60 + 28 * k, 22 if k == 0 else 15, '' if k == 0 else ' fill-opacity=".7"', line))
    given = []
    for _, r, label, role in sorted(circles, key=lambda c: c[1]):
        if role != 'aux' and label not in given:
            given.append(label)
    if v['name'] == 'Harmonic':
        foot = 'Radius = R · φ^(−k/4), vier Stufen ergeben den Goldenen Schnitt · verwendete Stufen k: %s' % ' · '.join(
            x.strip('k') for x in given)
    else:
        foot = 'Radien der Leitkreise: %s' % ' · '.join(given)
    parts.append('<text x="64" y="1188" font-family="sans-serif" font-size="14" fill="#16363B" fill-opacity=".7">'
                 '%s</text>' % foot)
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1240" viewBox="4 -8 1240 1240">'
            '<title>ELANUM — Kreiskonstruktion %s</title>'
            '<desc>Blueprint des ELANUM-Logos. Alle Konturen sind Bögen der gezeigten Kreise; '
            'aufeinanderfolgende Bögen berühren sich tangential.</desc>%s</svg>\n' % (name, ''.join(parts)))


ZEICHEN_JS = os.path.join(ROOT, 'components', 'zeichen', 'zeichen.js')


def zeichen_data(v, g, rg):
    """Konstruktion für den Zeichenaufbau im Baustein Zeichen, im Raster des Zeichens (VIEWBOX)."""
    num = lambda x: float(f(x))
    role = {'main': 'rahmen', 'line': 'linie', 'notch': 'kerbe', 'aux': 'kante'}
    circles, _ = construction_circles(v, g)
    return {
        'viewBox': VIEWBOX,
        'mitte': [num(g['O'][0]), num(g['O'][1])],
        'oeffnung': [num(g['H'][0]), num(g['H'][1]), num(g['r0'])],
        'form': rg['silhouette'],
        'kreise': [[num(c[0]), num(c[1]), num(r), role[ro]] for c, r, _, ro in circles],
        'konturen': [['rahmen', rg['outline']], ['rahmen', rg['hole']],
                     ['linie', path(g['L1c'])], ['linie', path(g['L2c'])],
                     ['kante', path(g['TB'])], ['kante', path(g['FC'])], ['kante', path(g['LA'] + g['LB'])]],
    }


def write_zeichen_js(data):
    src = open(ZEICHEN_JS, encoding='utf-8').read()
    line = '  var K = %s;' % json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    src, n = re.subn(r'^  var K = .*;$', lambda m: line, src, count=1, flags=re.M)
    if n != 1:
        raise RuntimeError('Zeile "var K" in components/zeichen/zeichen.js nicht gefunden')
    with open(ZEICHEN_JS, 'w', encoding='utf-8') as fh:
        fh.write(src)


def label_for(v, r):
    if v['name'] != 'Harmonic':
        return '%g' % round(r, 2)
    return 'k%d' % round(math.log(460.54 / r, Q))


# ---------------------------------------------------------------- Prüfung

def sample_original():
    """Abtastpunkte der kurvenbereinigten Ink-Konturen (Bezier) zum Vergleich."""
    d = re.findall(r' d="([^"]+)"', open(os.path.join(ASSETS, 'ELANUM-System-Ink-Curves.svg')).read())[1]
    pts, toks, cur = [], re.findall(r'[MCAZ]|-?\d+\.?\d*', d), None
    i = 0
    cmd = None
    while i < len(toks):
        if toks[i] in 'MCAZ':
            cmd = toks[i]
            i += 1
            continue
        if cmd == 'M':
            cur = (float(toks[i]), float(toks[i + 1]))
            i += 2
        elif cmd == 'A':
            cur = (float(toks[i + 5]), float(toks[i + 6]))
            i += 7
        elif cmd == 'C':
            p = [cur] + [(float(toks[i + 2 * k]), float(toks[i + 2 * k + 1])) for k in range(3)]
            if norm(sub(p[0], (624.65, 613.27))) < 459:   # nur Innenkonturen
                for s in range(1, 25):
                    t = s / 25
                    pts.append(tuple(sum(c * pp[j] for c, pp in zip(
                        ((1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3), p)) for j in (0, 1)))
            cur = p[3]
            i += 6
    return pts


def deviation(g, pts):
    arcs = [a for k in ('L1i', 'L1o', 'L2i', 'L2o', 'NU', 'NL') for a in g[k]]
    dense = [a.at(s / 60) for a in arcs for s in range(61)]
    worst = 0.0
    for p in pts:
        worst = max(worst, min(norm(sub(p, q)) for q in dense))
    return worst


def report(v, g, rg):
    print('== %s' % v['name'])
    for key in ('L1c', 'L1i', 'L1o', 'L2c', 'L2i', 'L2o', 'NU', 'NL', 'TB', 'FC', 'LA', 'LB'):
        arcs = g[key]
        print('  %-4s Knick %.6f°  Radien %s' % (key, kink(arcs), ', '.join('%.2f' % a.r for a in arcs)))
    for a, b in (('L1i', 'L1o'), ('L2i', 'L2o')):
        inner = [x.at(k / 200) for x in g[a] for k in range(201)]
        widths = [min(norm(sub(p, q)) for q in inner) for x in g[b] for p in [x.at(k / 40) for k in range(1, 40)]]
        print('  Linie %s: Breite %.2f bis %.2f, Endkreise %s' % (a[:2], min(widths), max(widths),
              ', '.join('%.2f' % abs(x.rho) for x in (g[b][0], g[b][-1]))))
    for key in ('ink', 'front', 'band', 'tail'):
        if re.search(r'[CLQS]', rg[key]):
            raise RuntimeError('%s enthält Nicht-Kreis-Segmente' % key)
    print('  max. Abweichung zur Kurvenkorrektur: %.2f Einheiten' % deviation(g, sample_original()))


def mask_uri(svg):
    return 'data:image/svg+xml;base64,' + base64.b64encode(svg.encode('utf-8')).decode('ascii')


def main():
    write_masks = '--masks' in sys.argv
    for v in (HARMONIC,):
        g = construct(v)
        rg = regions(g)
        report(v, g, rg)
        ink = ink_svg(rg)
        out = {
            'ELANUM-System-Ink-%s.svg' % v['name']: ink,
            'ELANUM-Master-Spektrum-%s.svg' % v['name']: spectrum_svg(rg),
            'ELANUM-Konstruktion-%s.svg' % v['name']: blueprint_svg(v, g, rg),
        }
        for fn, content in out.items():
            with open(os.path.join(ASSETS, fn), 'w', encoding='utf-8') as fh:
                fh.write(content)
        write_zeichen_js(zeichen_data(v, g, rg))
        if write_masks:
            print('  Relief-Maske %s: %s' % (v['name'], mask_uri(ink)))


if __name__ == '__main__':
    main()
