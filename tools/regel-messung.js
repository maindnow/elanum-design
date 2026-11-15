#!/usr/bin/env node
/* ============================================================
   ELANUM Regel-Messung
   Misst im Browser, was sich im CSS nicht ablesen lässt. Jede Seite
   des Atlas, jeder Baustein und jeder App-Screen wird in sechs
   Breiten geladen und gegen fünf Regeln geprüft:

   1 Bedienziel     Jedes Bedienelement trifft man auf mindestens
                    44 × 44 px (--target). Die Fläche eines Labels und
                    eine unsichtbare Trefferfläche (::before) zählen mit.
                    Links im laufenden Satz sind ausgenommen.
   2 Berührung      Zwei Texte in einer Zeile halten mindestens 6 px
                    Abstand. Nichts stösst an, nichts überlappt.
   3 Einsames Wort  Ein Absatz endet nicht mit einem einzelnen Wort
                    auf der letzten Zeile (text-wrap: pretty). Im
                    Fliesstext hängt die Quelle am letzten Wort, dort
                    gleicht der Browser nicht aus: ausgenommen.
   4 Titel          Ein Text in den Stufen Display, Titel oder
                    Überschrift mit zwei bis vier Zeilen verteilt sich
                    gleichmässig (text-wrap: balance). Lauftext in
                    grosser Schrift (LAUFTEXT) ist ausgenommen.
   5 Überlauf       Keine Seite lässt sich waagrecht schieben.

   Vorher im Repository einen Server starten:  python3 tools/serve.py
   Dann:  node tools/regel-messung.js
   Mit grösserer Schrift (die App kennt 112,5 und 125 Prozent):
          SCHRIFT=125 node tools/regel-messung.js
   Braucht Playwright (npm i -D playwright oder PLAYWRIGHT=/pfad/zu/playwright).
   Meldet es nichts, endet es mit 0, sonst mit 1.
   ============================================================ */
'use strict';
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const BASE = process.env.ATLAS_URL || 'http://127.0.0.1:4173/';
const SCHRIFT = Number(process.env.SCHRIFT) || 100;
const SCREENS = ['heute', 'ich', 'umfeld', 'weg', 'entdecken', 'chats', 'aktivitaeten', 'ankommen'].map(s => ['App · ' + s, 'components/app/' + s + '.html']);
const BAUSTEINE = ['resonanzrad', 'umfeld', 'beziehungsraum', 'weg', 'zeichen', 'fliesstext'].map(k => ['Baustein · ' + k, 'components/' + k + '/index.html']);
const SEITEN = [...SCREENS, ...BAUSTEINE, ['Atlas', 'index.html']];
const BREITEN = [[320, 640], [390, 844], [834, 1112], [1024, 768], [1280, 800], [1440, 900]];

/* Läuft in der Seite. */
function messen(faktor) {
  const LAUFTEXT = '.fliesstext,.fliesstext-karte';
  const ZIEL = 43.5;   /* 44 px gelten bei jeder Schriftgrösse */
  const res = { ziel: [], beruehrung: [], einsam: [], titel: [], ueberlauf: 0 };
  const sichtbarEl = el => {
    const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[hidden],[inert],dialog:not([open])');
  };
  const name = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 56);
  const wort = el => (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 36);
  /* Textknoten, die man sieht: nicht versteckt für Vorleser, nicht durchsichtig. */
  const knoten = el => {
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: n => {
      if (!n.textContent.trim() || n.parentElement.closest('.visually-hidden,[hidden]')) return NodeFilter.FILTER_REJECT;
      for (let a = n.parentElement; a && a !== el.parentElement; a = a.parentElement) if (+getComputedStyle(a).opacity < 0.05) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    } });
    const out = []; let n; while ((n = walk.nextNode())) out.push(n); return out;
  };
  const rechtecke = el => knoten(el).flatMap(n => { const r = document.createRange(); r.selectNodeContents(n); return [...r.getClientRects()].filter(b => b.width > 0); });
  const kasten = el => { const rs = rechtecke(el); return rs.length ? { left: Math.min(...rs.map(r => r.left)), right: Math.max(...rs.map(r => r.right)), top: Math.min(...rs.map(r => r.top)), bottom: Math.max(...rs.map(r => r.bottom)) } : null; };
  const zeilen = el => { const ys = []; for (const r of rechtecke(el)) { const l = ys.find(y => Math.abs(y.top - r.top) < r.height * 0.6); if (l) { l.left = Math.min(l.left, r.left); l.right = Math.max(l.right, r.right); } else ys.push({ top: r.top, left: r.left, right: r.right }); } return ys.sort((a, b) => a.top - b.top); };
  /* Der Text der letzten Zeile, Zeichen für Zeichen von hinten gelesen. */
  const letzteZeile = el => {
    const ns = knoten(el); let text = '', top = null;
    for (let k = ns.length - 1; k >= 0; k--) {
      const n = ns[k];
      for (let i = n.length; i > 0; i--) {
        const r = document.createRange(); r.setStart(n, i - 1); r.setEnd(n, i); const b = r.getBoundingClientRect();
        if (b.width > 0) { if (top === null) top = b.top; else if (Math.abs(b.top - top) > b.height * 0.6) return text.trim(); }
        text = n.data[i - 1] + text;
      }
    }
    return text.trim();
  };

  /* 1 Bedienziel */
  for (const el of document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=tab],[tabindex]:not([tabindex="-1"]),summary')) {
    if (!sichtbarEl(el)) continue;
    let r = el.getBoundingClientRect(), w = r.width, h = r.height;
    const label = el.closest('label') || (el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]'));
    if (label) { const l = label.getBoundingClientRect(); w = Math.max(w, l.width); h = Math.max(h, l.height); }
    const vor = getComputedStyle(el, '::before');
    if (vor.content !== 'none' && vor.position === 'absolute') { w = Math.max(w, parseFloat(vor.width) || 0); h = Math.max(h, parseFloat(vor.height) || 0); }
    const imSatz = getComputedStyle(el).display === 'inline' && el.closest('p,li,dd,blockquote');
    const bereich = el.matches('pre,[role=region],main,section') && el.tabIndex === 0;   /* Bereich zum Rollen, kein Knopf */
    if ((w < ZIEL || h < ZIEL) && !imSatz && !bereich) res.ziel.push(name(el) + ' «' + wort(el) + '» ' + Math.round(w) + ' × ' + Math.round(h) + ' px');
  }

  /* 2 Berührung: Geschwister in einer Zeile */
  for (const reihe of document.querySelectorAll('*')) {
    if (!/flex|grid/.test(getComputedStyle(reihe).display) || !sichtbarEl(reihe)) continue;
    const kinder = [...reihe.children].filter(k => sichtbarEl(k) && getComputedStyle(k).position !== 'absolute');
    for (let i = 0; i < kinder.length - 1; i++) {
      const A = kasten(kinder[i]), B = kasten(kinder[i + 1]); if (!A || !B) continue;
      const abstand = B.left - A.right;
      if (Math.abs(A.top - B.top) < 14 && A.bottom - A.top < 40 && B.bottom - B.top < 40 && abstand < 6 && abstand > -200 && A.right - A.left > 4 && B.right - B.left > 4)
        res.beruehrung.push('«' + wort(kinder[i]) + '» und «' + wort(kinder[i + 1]) + '» ' + Math.round(abstand) + ' px in ' + name(reihe));
    }
  }

  /* 3 und 4 Umbruch */
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,dd,blockquote,figcaption,span,strong,div')) {
    if (!sichtbarEl(el) || el.closest('.visually-hidden') || el.closest('pre,code')) continue;
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
    /* Nur Text, der selbst umbricht: Ein Kind als eigener Block (Name über Zusatz) ist kein Umbruch. */
    if ([...el.children].some(c => !getComputedStyle(c).display.startsWith('inline') && c.textContent.trim())) continue;
    const ls = zeilen(el); if (ls.length < 2) continue;
    const s = getComputedStyle(el), stil = s.textWrapStyle || s.textWrap || '';
    const gross = parseFloat(s.fontSize) >= 20 * faktor - 0.5;
    if (gross && !el.closest(LAUFTEXT)) {
      if (ls.length <= 4 && !/balance/.test(stil)) res.titel.push(name(el) + ' «' + wort(el) + '» ' + ls.length + ' Zeilen');
    } else if (/^(P|LI|DD|FIGCAPTION)$/.test(el.tagName) && !el.closest(LAUFTEXT)) {
      const breit = Math.max(...ls.map(l => l.right - l.left)), ende = ls[ls.length - 1];
      const rest = letzteZeile(el);
      if ((ende.right - ende.left) / breit < 0.2 && rest && !/\s/.test(rest)) res.einsam.push(name(el) + ' endet mit «' + rest + '»');
    }
  }

  /* 5 Überlauf */
  res.ueberlauf = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
  return res;
}

(async () => {
  const browser = await chromium.launch();
  const funde = { ziel: new Map(), beruehrung: new Map(), einsam: new Map(), titel: new Map(), ueberlauf: new Map() };
  const merke = (regel, text, ort) => { const m = funde[regel]; if (!m.has(text)) m.set(text, []); m.get(text).push(ort); };
  let ladungen = 0;
  for (const [breite, hoehe] of BREITEN) {
    const context = await browser.newContext({ viewport: { width: breite, height: hoehe }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const [titel, pfad] of SEITEN) {
      await page.goto(BASE + pfad, { waitUntil: 'networkidle' });
      if (SCHRIFT !== 100) await page.addStyleTag({ content: 'html{font-size:' + SCHRIFT + '%!important}' });
      await page.waitForTimeout(500);
      const r = await page.evaluate(messen, SCHRIFT / 100); ladungen++;
      const ort = titel + ' @' + breite;
      for (const regel of ['ziel', 'beruehrung', 'einsam', 'titel']) r[regel].forEach(t => merke(regel, t, ort));
      if (r.ueberlauf > 0) merke('ueberlauf', titel + ': ' + r.ueberlauf + ' px zu breit', '@' + breite);
    }
    await context.close();
  }
  await browser.close();

  const NAMEN = { ziel: '1 Bedienziel unter 44 px', beruehrung: '2 Berührung', einsam: '3 Einsames Wort', titel: '4 Titel ohne Ausgleich', ueberlauf: '5 Überlauf' };
  let summe = 0;
  for (const [regel, m] of Object.entries(funde)) {
    const n = [...m.values()].reduce((s, o) => s + o.length, 0); summe += n;
    console.log(NAMEN[regel] + ': ' + (n ? n + ' Fund' + (n === 1 ? '' : 'e') + ' an ' + m.size + ' Stelle' + (m.size === 1 ? '' : 'n') : 'nichts'));
    for (const [text, orte] of m) console.log('   ' + text + '  [' + orte.slice(0, 4).join(', ') + (orte.length > 4 ? ' und ' + (orte.length - 4) + ' weitere' : '') + ']');
  }
  console.log('\nRegel-Messung: ' + ladungen + ' Seitenaufrufe, Schrift ' + SCHRIFT + ' %, ' + (summe ? summe + ' Fund' + (summe === 1 ? '' : 'e') + '.' : 'nichts zu melden.'));
  process.exit(summe ? 1 : 0);
})();
