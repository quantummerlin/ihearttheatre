/**
 * scan-mojibake.js — diagnostic: find real encoding corruption in HTML files.
 * Mojibake from PowerShell/ANSI typically looks like â€” (should be —),
 * Ã© (should be é), Â· etc.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const patterns = ['â€”', 'â€œ', 'â€', 'â€¢', 'â€¢', 'Ã©', 'Ã¨', 'Ã¢', 'â‰', 'â€¦'];

function walk(dir, depth) {
  if (depth > 2) return;
  for (const entry of fs.readdirSync(dir)) {
    if (entry === '.git' || entry === 'node_modules') continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, depth + 1);
    else if (entry.endsWith('.html') || entry.endsWith('.json')) {
      const s = fs.readFileSync(full, 'utf8');
      for (const p of patterns) {
        if (s.includes(p)) {
          const idx = s.indexOf(p);
          console.log(full.replace(ROOT + '\\', ''), '| found', JSON.stringify(p), '| ctx:', JSON.stringify(s.slice(Math.max(0, idx - 20), idx + 20)));
          break;
        }
      }
    }
  }
}

walk(ROOT, 0);
console.log('scan complete');
