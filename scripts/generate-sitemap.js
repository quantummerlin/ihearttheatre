/**
 * generate-sitemap.js
 * Rebuilds sitemap.xml from the actual files on disk.
 * Run: node scripts/generate-sitemap.js
 * Also run automatically in CI before deploy.
 *
 * Policy:
 * - Includes every .html at root, in reviews/, shows/, musicals/** (except hidden/placeholder pages)
 * - Excludes: 404.html, review-sample.html, archive/**, handoff/**, reviewer-wayne.html +
 *   review-wayne-* (placeholder, noindex until Wayne's content ships), actors/template/**
 * - Priority/changefreq heuristics by page type
 * - Never hand-edit sitemap.xml — regenerate with this script.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://ihearttheatre.com';
const TODAY = new Date().toISOString().slice(0, 10);

const EXCLUDE_FILES = new Set([
  '404.html',
  'review-sample.html',
  'reviewer-wayne.html' // hidden placeholder until bio/photo provided
]);

/** Pages deliberately excluded from the sitemap (placeholders / hidden). */
function isExcluded(relPath) {
  const base = relPath.replace(/\\/g, '/');
  if (base.startsWith('archive/') || base.startsWith('handoff/')) return true;
  if (base.startsWith('actors/template/')) return true;
  if (base.startsWith('reviews/review-wayne-')) return true;
  if (EXCLUDE_FILES.has(base)) return true;
  return false;
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (entry === '.git' || entry === 'node_modules' || entry === 'generated_images') continue;
      out.push(...walk(full));
    } else if (entry.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function priorityFor(relPath) {
  if (relPath === 'index.html') return { priority: '1.00', freq: 'daily' };
  const top = ['whats-on.html', 'shows.html', 'reviews.html'];
  if (top.includes(relPath)) return { priority: '0.95', freq: 'daily' };
  if (relPath.startsWith('reviews/')) return { priority: '0.85', freq: 'monthly' };
  if (relPath.startsWith('shows/')) return { priority: '0.80', freq: 'weekly' };
  if (relPath.startsWith('musicals/')) return { priority: '0.75', freq: 'monthly' };
  if (relPath.startsWith('actors/penelopequinn')) return { priority: '0.70', freq: 'monthly' };
  if (relPath.startsWith('submit-') || relPath === 'contact.html') return { priority: '0.65', freq: 'yearly' };
  return { priority: '0.80', freq: 'monthly' };
}

const htmlFiles = walk(ROOT)
  .map(f => path.relative(ROOT, f))
  .filter(f => !isExcluded(f))
  .sort((a, b) => {
    // stable, readable ordering: root first, then folder by name
    const da = a.includes(path.sep) || a.includes('/') ? 1 : 0;
    const db = b.includes(path.sep) || b.includes('/') ? 1 : 0;
    if (da !== db) return da - db;
    return a.localeCompare(b);
  });

const urls = htmlFiles.map(rel => {
  const norm = rel.replace(/\\/g, '/');
  const p = priorityFor(norm);
  return [
    '  <url>',
    `    <loc>${BASE}/${norm}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
    `    <changefreq>${p.freq}</changefreq>`,
    `    <priority>${p.priority}</priority>`,
    '  </url>'
  ].join('\n');
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  '</urlset>',
  ''
].join('\n');

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml regenerated with ${htmlFiles.length} URLs`);
