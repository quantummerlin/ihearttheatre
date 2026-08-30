/**
 * generate-feed.js
 * Rebuilds reviews/feed.xml from the review pages in reviews/.
 * Run: node scripts/generate-feed.js
 *
 * Reads each review-*.html and phantom-of-the-opera-2024.html, extracts the
 * JSON-LD Review block (fallback: title/meta description), and emits an RSS 2.0
 * feed sorted newest-first. Replaces the hand-maintained feed.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REVIEWS_DIR = path.join(ROOT, 'reviews');
const BASE = 'https://ihearttheatre.com';
const MAX_ITEMS = 40;

function escXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extractJsonLd(html) {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    return null;
  }
}

function metaContent(html, prop) {
  const re = new RegExp('<meta[^>]+(?:name|property)="' + prop + '"[^>]+content="([^"]*)"', 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

function titleFromHtml(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].split('|')[0].trim() : null;
}

const items = [];
for (const file of fs.readdirSync(REVIEWS_DIR)) {
  if (!file.endsWith('.html')) continue;
  const full = path.join(REVIEWS_DIR, file);
  const html = fs.readFileSync(full, 'utf8');
  const jsonld = extractJsonLd(html);

  let title = null, author = null, rating = null, description = null, itemName = null;
  if (jsonld && jsonld['@type'] === 'Review') {
    title = jsonld.name || null;
    itemName = jsonld.itemReviewed && jsonld.itemReviewed.name ? jsonld.itemReviewed.name : null;
    author = jsonld.author && jsonld.author.name ? jsonld.author.name : null;
    rating = jsonld.reviewRating && jsonld.reviewRating.ratingValue ? jsonld.reviewRating.ratingValue : null;
    description = jsonld.description || (typeof jsonld.reviewBody === 'string' ? jsonld.reviewBody : null);
  }
  title = title || itemName || titleFromHtml(html) || file.replace(/\.html$/, '');
  description = description || metaContent(html, 'description') || '';
  const pubDate = new Date().toUTCString(); // reviews have no stable machine date; use file mtime
  const mtime = fs.statSync(full).mtime.toUTCString();

  items.push({
    title,
    author,
    rating,
    description,
    link: `${BASE}/reviews/${file}`,
    guid: `${BASE}/reviews/${file}`,
    pubDate: mtime,
    file
  });
}

// Newest first by file mtime
items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
const top = items.slice(0, MAX_ITEMS);

const xmlItems = top.map(it => {
  const ratingStars = it.rating ? `${it.rating} ★ — ` : '';
  return [
    '    <item>',
    `      <title>${escXml(ratingStars + it.title)}</title>`,
    `      <link>${escXml(it.link)}</link>`,
    `      <guid isPermaLink="true">${escXml(it.guid)}</guid>`,
    `      <pubDate>${escXml(it.pubDate)}</pubDate>`,
    it.author ? `      <author>${escXml(it.author)} (iHeartTheatre)</author>` : null,
    `      <description>${escXml(it.description)}</description>`,
    '    </item>'
  ].filter(Boolean).join('\n');
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  '  <channel>',
  '    <title>iHeartTheatre — Reviews</title>',
  `    <link>${BASE}/reviews.html</link>`,
  '    <description>Passionate Melbourne theatre reviews by Deanna Amato and Penelope Quinn — reviewers, not critics. Real counts, real love for the stage.</description>',
  '    <language>en-au</language>',
  `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
  `    <atom:link href="${BASE}/reviews/feed.xml" rel="self" type="application/rss+xml"/>`,
  '    <image>',
  `      <url>${BASE}/images/icons/icon-192x192.png</url>`,
  '      <title>iHeartTheatre</title>',
  `      <link>${BASE}</link>`,
  '    </image>',
  ...xmlItems,
  '  </channel>',
  '</rss>',
  ''
].join('\n');

fs.writeFileSync(path.join(REVIEWS_DIR, 'feed.xml'), xml, 'utf8');
console.log(`reviews/feed.xml regenerated with ${top.length} items`);
