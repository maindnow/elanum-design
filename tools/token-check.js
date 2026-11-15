#!/usr/bin/env node
/* ============================================================
   ELANUM Token-Prüfung
   Jeder Wert hat einen Namen: Farben, Schatten, Radien, Kurven,
   Dauern, Schriftgrössen, Ebenen und der Fokusring stehen als
   Wert nur in tokens.css. Dieses Skript
   liest das CSS des Pakets und meldet jeden Wert, der daneben
   steht. Aufruf im Repo-Ordner:  node tools/token-check.js
   Meldet es nichts, endet es mit 0, sonst mit 1.

   Geprüft werden style.css, base.css und components/<name>/<datei>.css,
   jede Deklaration in jeder Regel, auch eigene Variablen (--name).
   Kommentare zählen nicht. Die Skripte der Bausteine zeichnen
   SVG zum Teil noch mit festen Farben, sie sind nicht geprüft.

   Was erlaubt ist:
   - Farben: var(--name), color-mix() aus Namen, currentColor,
     transparent, inherit. Kein #hex, kein rgb(), kein hsl(),
     kein Farbname wie white oder black. Im Kontrastmodus des
     Systems (forced-colors) stehen die Systemfarben: Canvas,
     CanvasText, ButtonFace, ButtonText, Highlight, HighlightText,
     GrayText.
   - Radien: var(--radius-…), calc() mit einem Radius-Token
     (ein abgeleiteter Radius, etwa ein Drittel), 50 %, 0, inherit.
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
   - Schrift: Grössen in rem, em, cqi, vw oder als Token, nie
     in px. So wächst die Schrift mit, wenn ein Mensch sie
     grösser stellt. Ausnahme: Schrift im SVG, die mit --u
     gegen den Massstab der Zeichnung rechnet.
   - Ebenen: z-index ist var(--layer-…) oder calc() daraus.
     Innerhalb eines Bausteins sind -1 bis 3 erlaubt.
   - Fokus: outline trägt die Tokens --focus-width und
     --focus-color (oder none, oder eine Systemfarbe).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const LOOPS = ['edge-turn', 'zeichen-lichtlauf'];
const COLOR_WORDS = ['white', 'black', 'red', 'green', 'blue', 'gray', 'grey', 'silver', 'orange', 'yellow', 'purple', 'pink', 'brown',
  'navy', 'teal', 'aqua', 'lime', 'maroon', 'olive', 'fuchsia', 'gold', 'beige', 'ivory', 'crimson', 'coral', 'salmon', 'khaki',
  'violet', 'indigo', 'magenta', 'cyan', 'tan', 'orchid', 'plum', 'lavender', 'turquoise', 'tomato', 'snow', 'linen', 'wheat'];

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

/* Teilt an einem Zeichen, das nicht in Klammern steht. */
function split(value, at) {
  const out = []; let depth = 0, cur = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (at.includes(ch) && depth === 0) { if (cur.trim()) out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
const word = name => new RegExp('(?<![-\\w])' + name + '(?![-\\w(])');

const TIME = /(?<![\w.#(-])(\d*\.?\d+m?s)\b/g;
const SYSTEM = '(?:Canvas|CanvasText|ButtonFace|ButtonText|Highlight|HighlightText|GrayText)';
const COLOR_OK = '(?:var\\(--[a-z0-9-]+\\)|color-mix\\([^;]*\\)|currentColor|transparent|' + SYSTEM + ')';
const LEN = '(?:-?\\d*\\.?\\d+(?:px|em|rem)?|var\\(--[a-z0-9-]+\\))';
const RING = new RegExp('^(?:inset\\s+)?' + LEN + '\\s+' + LEN + '\\s+0(?:\\s+' + LEN + ')?\\s+' + COLOR_OK + '$');
const SHADOW_TOKEN = new RegExp('^var\\(--[a-z0-9-]+\\)(?:\\s+' + COLOR_OK + ')?$');
const RADIUS_PART = /^(?:var\(--radius-[a-z]+\)|calc\(var\(--radius-[a-z]+\).*\)|50%|0|inherit)$/;

const found = [];
for (const file of cssFiles()) {
  const raw = fs.readFileSync(path.join(ROOT, file), 'utf8');
  /* Kommentare und Zeichenketten durch Leerzeichen ersetzen, Zeilennummern bleiben stehen */
  const text = raw.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' ')).replace(/"[^"\n]*"|'[^'\n]*'/g, m => '"' + ' '.repeat(m.length - 2) + '"');
  const lineOf = index => text.slice(0, index).split('\n').length;
  const report = (index, rule, value) => found.push({ file, line: lineOf(index), rule, value: value.replace(/\s+/g, ' ').slice(0, 110) });

  /* Jede Regel: der Text zwischen { und }, ohne weitere Klammern darin. So zählen Selektoren nie als Wert. */
  for (const block of text.matchAll(/\{([^{}]*)\}/g)) {
    let offset = block.index + 1;
    for (const decl of block[1].split(';')) {
      const at = offset; offset += decl.length + 1;
      const colon = decl.indexOf(':'); if (colon < 0) continue;
      const prop = decl.slice(0, colon).trim(), value = decl.slice(colon + 1).trim();
      if (!/^(?:--)?[a-zA-Z][\w-]*$/.test(prop) || !value) continue;
      const index = at + decl.length - decl.trimStart().length;
      const own = prop.startsWith('--');

      /* Farben, in jeder Deklaration */
      const plain = value.replace(/var\([^()]*\)/g, ' ').replace(/url\([^)]*\)/g, ' ');
      for (const m of value.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g)) report(index, 'Farbe ohne Namen', prop + ':' + m[0]);
      if (!/^(?:font|font-family|animation|animation-name|transition|transition-property|will-change|content|grid-area|grid-template-areas)$/.test(prop))
        for (const c of COLOR_WORDS) if (word(c).test(plain)) report(index, 'Farbe ohne Namen', prop + ':' + c);

      /* Eigene Variablen: eine Dauer oder Kurve als Wert gehört nach tokens.css */
      if (own) {
        if (/^\d*\.?\d+m?s$/.test(value)) report(index, 'Dauer ohne Namen', prop + ':' + value);
        if (/cubic-bezier\(/.test(value)) report(index, 'Kurve ohne Namen', prop + ':' + value);
        continue;
      }

      if (/^border(?:-[a-z]+)*-radius$/.test(prop)) {
        for (const b of split(value, ' /')) if (!RADIUS_PART.test(b)) { report(index, 'Radius ohne Namen', prop + ':' + value); break; }
      }

      if (prop === 'box-shadow' || prop === 'text-shadow') {
        if (value !== 'none' && value !== 'inherit') {
          for (const p of split(value, ',')) if (!SHADOW_TOKEN.test(p) && !RING.test(p)) report(index, 'Schatten ohne Namen', prop + ':' + p);
        }
      }
      if (/^(?:-webkit-)?(?:backdrop-)?filter$/.test(prop) && /drop-shadow\(\s*-?\d/.test(value)) report(index, 'Schatten ohne Namen', prop + ':' + value);

      /* Schrift wächst mit: keine Grösse in px. Die Zeilenhöhe hinter dem Schrägstrich zählt nicht. */
      if (prop === 'font-size' || prop === 'font') {
        const size = prop === 'font' ? value.split('/')[0] : value;
        if (/(?<![\w.-])\d*\.?\d+px\b/.test(size.replace(/var\([^()]*\)/g, ' ')) && !/var\(--u\b/.test(size)) report(index, 'Schrift in px', prop + ':' + value);
      }
      if (prop === 'z-index' && !/^(?:-1|[0-3]|auto|var\(--layer-[a-z]+\)|calc\(var\(--layer-[a-z]+\) [-+] \d+\))$/.test(value)) report(index, 'Ebene ohne Namen', prop + ':' + value);
      if (prop === 'outline' && !/^(?:none|0)$/.test(value) && !/var\(--focus-width\)/.test(value) && !new RegExp('^\\d+px solid ' + SYSTEM + '$').test(value)) report(index, 'Fokus ohne Namen', prop + ':' + value);

      if (/^(?:transition|animation)(?:-duration|-timing-function)?$/.test(prop) && !/^none\b/.test(value)) {
        for (const p of split(value, ',')) {
          const loop = /\binfinite\b/.test(p), named = LOOPS.some(n => word(n).test(p));
          const bare = p.replace(/var\([^()]*\)|cubic-bezier\([^)]*\)/g, ' ');
          if (/(?<![-\w])(?:ease|ease-in|ease-out|ease-in-out)(?![-\w])/.test(bare)) report(index, 'Kurve ohne Namen', prop + ':' + p);
          if (/(?<![-\w])linear(?![-\w])/.test(bare) && !loop) report(index, 'linear ausserhalb einer Dauerschleife', prop + ':' + p);
          if (/cubic-bezier\(/.test(p)) report(index, 'Kurve ohne Namen', prop + ':' + p);
          /* Zeitwerte ausserhalb von var() und calc(): Der erste ist die Dauer, der zweite die Verzögerung.
             Steht die Dauer schon als Token da, ist jede Zahl eine Verzögerung. */
          const rest = p.replace(/calc\((?:[^()]|\([^()]*\))*\)|var\([^()]*\)/g, ' ');
          const times = [...rest.matchAll(TIME)].map(t => t[1]);
          const durationIsToken = /(?:var\(--motion-|calc\(var\(--motion-)/.test(p);
          if (prop.endsWith('-duration')) { if (times.length) report(index, 'Dauer ohne Namen', prop + ':' + p); }
          else if (prop !== 'animation-timing-function' && times.length && !durationIsToken && !(loop && named)) report(index, 'Dauer ohne Namen', prop + ':' + p);
        }
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
