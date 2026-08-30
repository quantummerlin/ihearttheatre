/**
 * calendar-check.js — date-freshness audit for the Melbourne calendar
 * as of a given date (default: today).
 * Run: node scripts/calendar-check.js [YYYY-MM-DD]
 */
const fs = require('fs');
const path = require('path');

const TODAY = process.argv[2] ? new Date(process.argv[2] + 'T12:00:00') : new Date();
const cal = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'calendar.json'), 'utf8').replace(/^\uFEFF/, '')
);

// Timezone-safe yyyy-mm-dd using local date parts (works for Date objects and date strings)
function fmt(d) {
  const dd = d instanceof Date ? d : new Date(d + 'T12:00:00');
  const y = dd.getFullYear();
  const m = String(dd.getMonth() + 1).padStart(2, '0');
  const day = String(dd.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Parse a calendar date string as local noon (avoids UTC midnight drift)
function dt(str) { return new Date(str + 'T12:00:00'); }

// 1. Shows still marked running/upcoming
const live = cal.filter(s => dt(s.date_end || s.date_start) >= TODAY);
const ended = cal.filter(s => dt(s.date_end || s.date_start) < TODAY);
const openingSoon = live.filter(s => dt(s.date_start) > TODAY);
const endedThisMonth = ended.filter(s => dt(s.date_end) >= new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));

console.log(`=== Calendar check as of ${fmt(TODAY)} ===`);
console.log(`Total entries: ${cal.length}`);
console.log(`Still running/upcoming: ${live.length}`);
console.log(`Ended (all time): ${ended.length}`);
console.log(`Ended this month: ${endedThisMonth.length}`);
console.log('');
console.log('--- LIVE / UPCOMING ---');
for (const s of live.sort((a, b) => a.date_start.localeCompare(b.date_start))) {
  console.log(`${s.id} | ${fmt(s.date_start)} → ${fmt(s.date_end)} | ${s.show_title} | ${s.company || '(no company)'} | ${s.venue || s.location}`);
}
console.log('');

// 2. Duplicate titles
const byTitle = new Map();
for (const s of cal) {
  const k = (s.show_title || '').toLowerCase().trim();
  if (!byTitle.has(k)) byTitle.set(k, []);
  byTitle.get(k).push(s);
}
const dupes = [...byTitle.entries()].filter(([, arr]) => arr.length > 1);
console.log('--- DUPLICATE TITLES ---');
if (!dupes.length) console.log('none');
for (const [title, arr] of dupes) {
  console.log(`"${title}" x${arr.length}: ${arr.map(s => `${s.id} (${s.company || '?'} @ ${s.venue || s.location})`).join(' | ')}`);
}
console.log('');

// 3. Data quality issues
console.log('--- DATA GAPS ---');
for (const s of live) {
  const issues = [];
  if (!s.company) issues.push('no company');
  if (!s.venue) issues.push('no venue');
  if (!s.date_end) issues.push('no end date');
  if (s.date_end && s.date_end < s.date_start) issues.push('end before start!');
  const start = new Date(s.date_start); const end = new Date(s.date_end);
  if (end - start > 320 * 24 * 3600 * 1000) issues.push(`oddly long run (${Math.round((end - start) / 86400000)} days)`);
  if (issues.length) console.log(`${s.id} | ${s.show_title}: ${issues.join(', ')}`);
}

// 4. Shows that END today (last day!)
const endsToday = live.filter(s => fmt(s.date_end) === fmt(TODAY));
if (endsToday.length) {
  console.log('');
  console.log('--- ENDING TODAY ---');
  for (const s of endsToday) console.log(`${s.id} | ${s.show_title} at ${s.venue || s.location}`);
}
