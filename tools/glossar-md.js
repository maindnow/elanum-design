#!/usr/bin/env node
/* Erzeugt GLOSSAR.md aus assets/glossar.js, der einen Quelle der Begriffe.
   Aufruf im Repo-Ordner:  node tools/glossar-md.js */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
new Function('window', fs.readFileSync(path.join(root, 'assets/glossar.js'), 'utf8'))(sandbox.window);
const g = sandbox.window.ELANUM_GLOSSAR;
const cell = s => String(s || '').replace(/\|/g, '\\|');
let md = `# ELANUM Glossar ${g.version}\n\n`;
md += '<!-- Automatisch erzeugt aus assets/glossar.js mit `node tools/glossar-md.js`. Nicht von Hand bearbeiten. -->\n\n';
md += `${g.rule}\n\n> ${g.sentence}\n`;
g.groups.forEach(group => {
  md += `\n## ${group.title}\n\n`;
  if (group.intro) md += `${group.intro}\n\n`;
  md += '| Begriff | Bedeutung | Im Code |\n|---|---|---|\n';
  group.terms.forEach(t => { md += `| **${cell(t.term)}** | ${cell(t.meaning)} | ${t.code ? '`' + cell(t.code) + '`' : ''} |\n`; });
});
md += '\n## Nicht mehr verwenden\n\n| Alt | Stattdessen |\n|---|---|\n';
g.avoid.forEach(([old, now]) => { md += `| ~~${cell(old)}~~ | **${cell(now)}** |\n`; });
fs.writeFileSync(path.join(root, 'GLOSSAR.md'), md);
console.log('geschrieben: GLOSSAR.md');
