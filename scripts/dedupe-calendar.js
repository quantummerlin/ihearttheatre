/**
 * dedupe-calendar.js
 * One-off maintenance (2026-08-30): entries mel-2026-107..134 came from a second
 * import pass and duplicate existing shows. For each duplicate, merge any
 * non-empty fields (venue, company, ticket_url, date fixes) into its matching
 * original, then delete the duplicate.
 *
 * Matching rule: same normalized title AND overlapping/adjacent dates.
 * Originals (lower ids) win on conflicts except for null-filling.
 *
 * Run: node scripts/dedupe-calendar.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const FILE = path.join(__dirname, '..', 'data', 'calendar.json');
const raw = fs.readFileSync(FILE, 'utf8').replace(/^\uFEFF/, '');
const cal = JSON.parse(raw);

const norm = s => (s || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '') // strip accents so "Bohème" == "Boheme"
  .toLowerCase()
  .replace(/[^\w\s]/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const numId = id => parseInt((id || '').split('-').pop(), 10);

const dupRange = cal.filter(s => numId(s.id) >= 107);
const originalRange = cal.filter(s => numId(s.id) < 107);

const MERGE_FIELDS = ['venue', 'company', 'ticket_url', 'location'];

function matchesDup(orig, dup) {
  if (norm(orig.show_title) !== norm(dup.show_title)) return false;
  // Dates overlap or are within 7 days of each other
  const a1 = new Date(orig.date_start), a2 = new Date(orig.date_end || orig.date_start);
  const b1 = new Date(dup.date_start), b2 = new Date(dup.date_end || dup.date_start);
  const gap = Math.max(a1 - b2, b1 - a2);
  return gap <= 7 * 24 * 3600 * 1000;
}

let removed = 0, merged = 0;
const keep = [];
const removedIds = [];

for (const show of cal) {
  const idNum = numId(show.id);
  if (idNum >= 107) {
    const orig = originalRange.find(o => matchesDup(o, show));
    if (orig) {
      // Null-fill merge: copy non-empty fields into the original
      for (const f of MERGE_FIELDS) {
        if (!orig[f] && show[f]) {
          if (norm(orig.venue || '') === norm(show.venue || '')) continue;
          orig[f] = show[f];
          merged++;
        }
      }
      removedIds.push(`${show.id} → merged into ${orig.id}`);
    } else {
      removedIds.push(`${show.id} → NO MATCH — kept!`);
      keep.push(show); // safety: don't drop unmatched entries
    }
    if (orig) removed++;
  } else {
    keep.push(show);
  }
}

keep.sort((a, b) => numId(a.id) - numId(b.id));

console.log(`Removed ${removed} duplicate entries, merged ${merged} field values.`);
for (const r of removedIds) console.log(' ', r);

if (!DRY_RUN) {
  fs.writeFileSync(FILE, JSON.stringify(keep, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${keep.length} entries to calendar.json`);
} else {
  console.log(`[DRY RUN] Would write ${keep.length} entries.`);
}
