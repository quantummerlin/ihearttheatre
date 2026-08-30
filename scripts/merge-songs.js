#!/usr/bin/env node
/**
 * merge-songs.js
 * Merges data/_batch1.json ... data/_batch7.json into data/audition-songs.json
 * with proper UTF-8 handling (replaces the old merge-songs.ps1 which corrupted
 * accented characters via PowerShell 5.1 code pages).
 *
 * Usage: node scripts/merge-songs.js
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BATCH_COUNT = 7;

const merged = Object.create(null);
for (let i = 1; i <= BATCH_COUNT; i++) {
  const file = path.join(DATA_DIR, `_batch${i}.json`);
  const batch = JSON.parse(fs.readFileSync(file, 'utf8'));
  const keys = Object.keys(batch.songs || {});
  for (const key of keys) {
    merged[key] = batch.songs[key];
  }
  console.log(`Batch ${i}: ${Object.keys(merged).length} total roles`);
}

const out = {
  version: 1,
  last_updated: new Date().toISOString().slice(0, 10),
  description: 'Audition song suggestions for every role across 22 musicals. Keyed by musical_id/role_id.',
  songs: merged,
};

const outFile = path.join(DATA_DIR, 'audition-songs.json');
fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`Wrote ${outFile} with ${Object.keys(merged).length} roles`);
