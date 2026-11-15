#!/usr/bin/env node
/* ============================================================
   ELANUM Token-Prüfung
   Jeder Wert hat einen Namen: Farben, Schatten, Radien, Kurven
   und Dauern stehen als Wert nur in tokens.css. Dieses Skript
   liest das CSS des Pakets und meldet jeden Wert, der daneben
   steht. Aufruf im Repo-Ordner:  node tools/token-check.js
   Meldet es nichts, endet es mit 0, sonst mit 1.

   Geprüft werden style.css, base.css und components/<name>/<datei>.css.
   Kommentare zählen nicht. Die Skripte der Bausteine zeichnen
   SVG zum Teil noch mit festen Farben, sie sind nicht geprüft.

   Was erlaubt ist:
   - Farben: var(--name), color-mix() aus Namen, currentColor,
     transparent, inherit. Kein #hex, kein rgb(), kein hsl().
   - Radien: var(--radius-…), calc() mit einem Radius-Token,
     50 %, 0, inherit.
   - Schatten: var(--name), auch als Mass mit Farbe dahinter
     (var(--under) color-mix(…)). Eine Kontur oder Linie ohne
     Weichzeichnung (0 0 0 2px Farbe, 0 1px 0 Farbe) ist kein
     Schatten und darf stehen, wenn ihre Farbe einen Namen hat.
     Kein drop-shadow() mit Zahlen, dafür gibt es Tokens.
   - Kurven: var(--ease-out), var(--ease-in-out). linear nur in
     Dauerschleifen (infinite).
   - Dauern: var(--motion-…) und calc() daraus. Verzögerungen
     dürfen Zahlen sein. Die Dauerschleifen in LOOPS haben
     eigene Dauern.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const LOOPS = ['edge-turn', 'zeichen-lichtlauf'];

function cssFiles() {
  const list = ['style.css', 'base.css'];
  const dir = path.join(ROOT, 'components');
  for (const name of fs.readdirSync(dir).sort()) {
    const sub = path.join(dir, name);
    if (!fs.statSync(sub).isDirectory()) continue;
    for (const f of fs.readdirSync(sub).sort()) if (f.endsWith('.css')) list.push(path.join('components', name, f));
  }
  return list;
}

/* Teilt an Kommas, die nicht in Klammern stehen. */
function parts(value) {
  const out = []; let depth = 0, cur = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/* Teilt an Leerzeichen und Schrägstrichen, die nicht in Klammern stehen: calc(…) bleibt ein Stück. */
function words(value) {
  const out = []; let depth = 0, cur = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if ((ch === ' ' || ch === '/') && depth === 0) { if (cur) out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

const TIME = /(?<![\w.#(-])(\d*\.?\d+m?s)\b/g;
const COLOR_OK = '(?:var\\(--[a-z0-9-]+\\)|color-mix\\([^;]*\\)|currentColor|transparent)';
const LEN = '(?:-?\\d*\\.?\\d+(?:px|em|rem)?|var\\(--[a-z0-9-]+\\))';
const RING = new RegExp('^(?:inset\\s+)?' + LEN + '\\s+' + LEN + '\\s+0(?:\\s+' + LEN + ')?\\s+' + COLOR_OK + '$');
const SHADOW_TOKEN = new RegExp('^var\\(--[a-z0-9-]+\\)(?:\\s+' + COLOR_OK + ')?$');
const RADIUS_PART = /^(?:var\(--radius-[a-z]+\)|calc\(var\(--radius-[a-z]+\).*\)|50%|0|inherit)$/;

const found = [];
for (const file of cssFiles()) {
  const raw = fs.readFileSync(path.join(ROOT, file), 'utf8');
  /* Kommentare durch Leerzeichen ersetzen, Zeilennummern bleiben stehen */
  const text = raw.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  const lineOf = index => text.slice(0, index).split('\n').length;
  const report = (index, rule, value) => found.push({ file, line: lineOf(index), rule, value: value.replace(/\s+/g, ' ').slice(0, 110) });

  /* Farben */
  for (const m of text.matchAll(/#[0-9a-fA-F]{3,8}\b(?![^{]*\{)|\b(?:rgba?|hsla?)\(/g)) report(m.index, 'Farbe ohne Namen', m[0]);

  /* Deklarationen */
  for (const m of text.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)/g)) {
    const prop = m[1], value = m[2].trim();

    if (/^border(?:-[a-z]+)*-radius$/.test(prop)) {
      const bits = words(value);
      for (const b of bits) if (!RADIUS_PART.test(b)) { report(m.index, 'Radius ohne Namen', prop + ':' + value); break; }
    }

    if (prop === 'box-shadow' || prop === 'text-shadow') {
      if (value !== 'none' && value !== 'inherit') {
        for (const p of parts(value)) if (!SHADOW_TOKEN.test(p) && !RING.test(p)) { report(m.index, 'Schatten ohne Namen', prop + ':' + p); }
      }
    }
    if ((prop === 'filter' || prop === 'backdrop-filter' || prop === '-webkit-backdrop-filter') && /drop-shadow\(\s*-?\d/.test(value)) report(m.index, 'Schatten ohne Namen', prop + ':' + value);

    if (/^(?:transition|animation)(?:-duration|-timing-function)?$/.test(prop) && !/^none\b/.test(value)) {
      for (const p of parts(value)) {
        const loop = /\binfinite\b/.test(p), named = LOOPS.some(n => new RegExp('\\b' + n + '\\b').test(p));
        const bare = p.replace(/var\([^)]*\)|cubic-bezier\([^)]*\)/g, ' ');
        if (/(?<![-\w])(?:ease|ease-in|ease-out|ease-in-out)(?![-\w])/.test(bare)) report(m.index, 'Kurve ohne Namen', prop + ':' + p);
        if (/(?<![-\w])linear(?![-\w])/.test(bare) && !loop) report(m.index, 'linear ausserhalb einer Dauerschleife', prop + ':' + p);
        if (/cubic-bezier\(/.test(p)) report(m.index, 'Kurve ohne Namen', prop + ':' + p);
        const times = [...p.replace(/var\([^)]*\)/g, ' ').matchAll(TIME)].map(t => t[1]);
        /* Der erste Zeitwert ist die Dauer, der zweite die Verzögerung. Steht die Dauer als Token da, ist jede Zahl eine Verzögerung. */
        const durationIsToken = /^\s*(?:[a-z-]+\s+)?(?:var\(--motion-|calc\(var\(--motion-)/.test(p.replace(/^[a-z-]+\s+(?=\d)/, '')) || /var\(--motion-[a-z]+\)|calc\(var\(--motion-/.test(p.split(/\s+/).slice(0, 2).join(' '));
        if (prop.endsWith('-duration')) { if (times.length) report(m.index, 'Dauer ohne Namen', prop + ':' + p); }
        else if (prop !== 'animation-timing-function' && times.length && !durationIsToken && !(loop && named)) report(m.index, 'Dauer ohne Namen', prop + ':' + p);
      }
    }
  }
}

const files = cssFiles().length;
if (!found.length) {
  console.log('Token-Prüfung: nichts zu melden (' + files + ' Dateien).');
  process.exit(0);
}
found.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
for (const f of found) console.log(f.file + ':' + f.line + '  ' + f.rule + '  ' + f.value);
console.log('\nToken-Prüfung: ' + found.length + ' Stelle' + (found.length === 1 ? '' : 'n') + ' in ' + new Set(found.map(f => f.file)).size + ' Datei(en). Der Wert gehört nach tokens.css, hier steht sein Name.');
process.exit(1);
