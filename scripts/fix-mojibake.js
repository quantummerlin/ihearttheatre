/**
 * fix-mojibake.js — replace PowerShell/ANSI mojibake with correct UTF-8 in 4 known files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const files = [
  'data/musicals-index.json',
  'musicals/frozen/frozen-elsa.html',
  'musicals/into-the-woods/the-witch.html',
  'musicals/matilda/matilda-matilda.html'
];

// Common mojibake -> correct characters
// (UTF-8 bytes misread as Windows-1252, then saved as UTF-8)
const repl = [
  ['\u00e2\u20ac\u201d', '\u2014'], // 0xE2 0x80 0x94 read as cp1252 -> — em dash
  ['\u00e2\u20ac\u201c', '\u2013'], // 0xE2 0x80 0x93 -> – en dash
  ['\u00e2\u20ac\u0153', '\u201c'], // 0xE2 0x80 0x9C -> “ left double quote
  ['\u00e2\u20ac\u02dc', '\u2018'], // 0xE2 0x80 0x98 -> ‘
  ['\u00e2\u20ac\u2122', '\u2019'], // 0xE2 0x80 0x99 -> ’
  ['\u00e2\u20ac\u00a2', '\u2022'], // 0xE2 0x80 0xA2 -> •
  ['\u00e2\u20ac\u00a6', '\u2026'], // 0xE2 0x80 0xA6 -> …
  ['\u00c3\u00a9', '\u00e9'],       // 0xC3 0xA9 -> é
  ['\u00c3\u00a8', '\u00e8'],       // 0xC3 0xA8 -> è
];

for (const f of files) {
  const full = path.join(ROOT, f);
  if (!fs.existsSync(full)) { console.log('skip (missing):', f); continue; }
  let s = fs.readFileSync(full, 'utf8');
  let changed = 0;
  for (const [from, to] of repl) {
    if (s.includes(from)) {
      const n = s.split(from).length - 1;
      s = s.split(from).join(to);
      changed += n;
    }
  }
  fs.writeFileSync(full, s, 'utf8');
  console.log(f, '-> replaced', changed, 'occurrences');
}
console.log('done');
