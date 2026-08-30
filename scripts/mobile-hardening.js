/**
 * mobile-hardening.js
 * One-off migration (2026-08-30):
 * 1. Add viewport-fit=cover to every page's viewport meta (enables
 *    env(safe-area-inset-*) on iPhones with a home indicator).
 * 2. Skip review-sample.html (stub) and handoff/archive pages.
 * Run: node scripts/mobile-hardening.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = path.join(__dirname, '..');

function walk(dir, depth = 0) {
  const out = [];
  for (const entry of fs.readdirSync(dir)) {
    if (entry === '.git' || entry === 'node_modules' || entry === 'archive' || entry === 'handoff') continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...walk(full, depth + 1));
    else if (entry.endsWith('.html') && entry !== 'offline.html') out.push(full);
  }
  return out;
}

const OLD = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
const NEW = '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">';
const OLD_COMPACT = '<meta name="viewport" content="width=device-width,initial-scale=1">';
const NEW_COMPACT = '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">';

let changed = 0, skipped = 0;
for (const file of walk(ROOT)) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('viewport-fit=cover')) { skipped++; continue; }
  if (s.includes(OLD)) {
    s = s.split(OLD).join(NEW); changed++;
  } else if (s.includes(OLD_COMPACT)) {
    s = s.split(OLD_COMPACT).join(NEW_COMPACT); changed++;
  } else {
    skipped++; continue;
  }
  if (!DRY_RUN) fs.writeFileSync(file, s);
}
console.log(`${DRY_RUN ? '[DRY RUN] Would update' : 'Updated'} ${changed} pages; ${skipped} already covered or no exact match.`);
