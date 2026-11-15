#!/usr/bin/env node
/* Erzeugt tokens.json aus tokens.css, der einen Quelle der Werte.
   Die Liste ist für Werkzeuge und Agenten: Name, Wert, Gruppe und Notiz
   jedes Tokens, ohne CSS zu lesen. Aufruf im Repo-Ordner:
     node tools/tokens-json.js
   Die Gruppe ist die erste Zeile des Kommentars über einem Block, die Notiz
   der Kommentar hinter der Zeile. tokens.json nie von Hand bearbeiten. */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'tokens.css'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

/* Der Inhalt eines Blocks ab einer öffnenden Klammer, Klammern darin mitgezählt. */
function block(from) {
  let depth = 0;
  for (let i = from; i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}' && --depth === 0) return css.slice(from + 1, i);
  }
  throw new Error('tokens.css: Block ohne Ende');
}
const clean = s => s.replace(/\s+/g, ' ').trim();

function read(text) {
  const tokens = [];
  let group = '';
  for (const line of text.split('\n')) {
    /* Ein Kommentar, der die Zeile beginnt, benennt die Gruppe. Er kann über mehrere Zeilen laufen:
       Dann zählt nur seine erste Zeile, die Folgezeilen tragen keine Deklaration. */
    const head = line.match(/^\s*\/\*\s*(.*?)\s*(?:\*\/\s*)?$/);
    if (head && !/--[a-z0-9-]+\s*:/.test(line)) { group = clean(head[1]).split(/[:.]/)[0]; continue; }
    const note = (line.match(/\/\*\s*(.*?)\s*\*\/\s*$/) || [])[1] || '';
    for (const m of line.replace(/\/\*.*?\*\//g, '').matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);?/g))
      tokens.push({ name: m[1], value: clean(m[2]), group, note: clean(note) });
  }
  return tokens;
}

const first = css.indexOf(':root{');
const tokens = read(block(first + 5));
const more = css.indexOf('@media(prefers-contrast:more)');
const contrast = more < 0 ? [] : read(block(css.indexOf(':root{', more) + 5));

const out = {
  name: pkg.name,
  version: pkg.version,
  source: 'tokens.css',
  generated: 'Automatisch erzeugt mit node tools/tokens-json.js. Nicht von Hand bearbeiten.',
  tokens,
  prefersContrastMore: Object.fromEntries(contrast.map(t => [t.name, t.value]))
};
fs.writeFileSync(path.join(root, 'tokens.json'), JSON.stringify(out, null, 2) + '\n');
console.log('tokens.json: ' + tokens.length + ' Tokens in ' + new Set(tokens.map(t => t.group)).size + ' Gruppen, Version ' + pkg.version + '.');
