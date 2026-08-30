#!/usr/bin/env node
/**
 * generate-shows.js
 * Reads data/calendar.json, writes shows/[id].html for every entry.
 * Safe to re-run — idempotent, overwrites existing files.
 *
 * Usage:
 *   node scripts/generate-shows.js
 *   node scripts/generate-shows.js --dry-run   (prints count only)
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT      = path.join(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'data', 'calendar.json');
const OUT_DIR   = path.join(ROOT, 'shows');

const DRY_RUN = process.argv.includes('--dry-run');

// ─── Helpers ────────────────────────────────────────────────────────────────

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_LONG  = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

function parseDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

function formatDateRange(startIso, endIso, approx) {
  const s = parseDate(startIso);
  const e = parseDate(endIso);
  if (!s) return 'Dates TBA';

  let str;
  if (!e || startIso === endIso) {
    str = `${s.d} ${MONTH_SHORT[s.m - 1]} ${s.y}`;
  } else if (s.m === e.m && s.y === e.y) {
    str = `${s.d}–${e.d} ${MONTH_SHORT[s.m - 1]} ${s.y}`;
  } else {
    str = `${s.d} ${MONTH_SHORT[s.m - 1]} – ${e.d} ${MONTH_SHORT[e.m - 1]} ${s.y}`;
  }
  if (approx) str += '*';
  return str;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escJson(str) {
  if (!str) return '';
  return String(str).replace(/\\/g,'\\\\').replace(/"/g,'\\"');
}

function slugify(str) {
  return String(str).toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Badge HTML ──────────────────────────────────────────────────────────────

const PROD_BADGE = {
  professional: '<span class="badge badge-professional">Professional</span>',
  community:    '<span class="badge badge-community">Community</span>',
  school:       '<span class="badge badge-school">School</span>',
};

function genreBadges(genres) {
  if (!genres || !genres.length) return '';
  return genres.map(g =>
    `<span class="badge badge-genre">${esc(g.replace(/-/g,' '))}</span>`
  ).join('\n        ');
}

// ─── Related shows ───────────────────────────────────────────────────────────

function relatedShows(current, all) {
  const curGenres = new Set(current.genre || []);
  const curDate   = current.date_start || '';

  const scored = all
    .filter(s => s.id !== current.id)
    .map(s => {
      const overlap = (s.genre || []).filter(g => curGenres.has(g)).length;
      const dayDiff = Math.abs(
        new Date(s.date_start || '2099-01-01') - new Date(curDate || '2099-01-01')
      ) / 86400000;
      return { show: s, score: overlap * 1000 - dayDiff };
    })
    .filter(x => x.score > -1000) // at least some overlap or close in time
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (!scored.length) return '';

  const cards = scored.map(({ show: s }) => {
    const dates = formatDateRange(s.date_start, s.date_end, false);
    const comp  = s.company ? `<span class="related-card-meta">${esc(s.company)}</span>` : '';
    return `
        <a class="related-card" href="${s.id}.html">
          <div class="related-card-title">${esc(s.show_title)}</div>
          ${comp}
          <div class="related-card-meta">${esc(dates)}${s.venue ? ' · ' + esc(s.venue) : ''}</div>
        </a>`;
  }).join('');

  return `
    <section class="related-section">
      <h2>More like this</h2>
      <div class="related-grid">${cards}
      </div>
    </section>`;
}

// ─── Event JSON-LD ───────────────────────────────────────────────────────────

function buildJsonLd(show, datesDisplay) {
  const obj = {
    "@context": "https://schema.org",
    "@type":    "Event",
    "name":     show.show_title,
    "startDate": show.date_start || undefined,
    "endDate":   show.date_end   || undefined,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "url": `https://ihearttheatre.com/shows/${show.id}.html`
  };

  if (show.venue || show.location) {
    obj.location = {
      "@type": "Place",
      "name":  show.venue || show.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": show.location || undefined,
        "addressRegion":   "Victoria",
        "addressCountry":  "AU"
      }
    };
  }

  if (show.company) {
    obj.organizer = {
      "@type": "Organization",
      "name":  show.company
    };
  }

  // Remove undefined fields recursively
  function clean(o) {
    if (Array.isArray(o)) return o.map(clean);
    if (o && typeof o === 'object') {
      const r = {};
      for (const [k,v] of Object.entries(o)) {
        if (v !== undefined && v !== null) r[k] = clean(v);
      }
      return r;
    }
    return o;
  }

  return JSON.stringify(clean(obj), null, 4);
}

// ─── HTML Template ───────────────────────────────────────────────────────────

function buildPage(show, all) {
  const datesDisplay  = formatDateRange(show.date_start, show.date_end, show.dates_approximate);
  const venueDisplay  = show.venue || null;
  const compDisplay   = show.company || null;
  const prodBadge     = PROD_BADGE[show.production_type] || '';
  const genrePills    = genreBadges(show.genre);
  const jsonLd        = buildJsonLd(show, datesDisplay);
  const related       = relatedShows(show, all);

  // Meta description
  let metaDesc = `${show.show_title}`;
  if (compDisplay) metaDesc += ` by ${compDisplay}`;
  if (venueDisplay) metaDesc += ` at ${venueDisplay}`;
  else if (show.location) metaDesc += ` in ${show.location}`;
  metaDesc += `. ${datesDisplay}. Melbourne & Victoria theatre — iHeartTheatre.`;

  // Venue meta tile
  const venueTile = venueDisplay ? `
        <div class="show-meta-item">
          <div class="show-meta-label">Venue</div>
          <div class="show-meta-value">${esc(venueDisplay)}</div>
        </div>` : '';

  // Location meta tile
  const locationTile = show.location ? `
        <div class="show-meta-item">
          <div class="show-meta-label">Suburb / Area</div>
          <div class="show-meta-value">${esc(show.location)}</div>
        </div>` : '';

  // Company display
  const compHtml = compDisplay
    ? `<p class="show-company">Presented by <strong>${esc(compDisplay)}</strong></p>`
    : '';

  // Approx note
  const approxNote = show.dates_approximate
    ? `<p class="dates-note">* Dates are approximate — check with the company for exact session times.</p>` : '';

  // Description / placeholder
  const descHtml = `<p class="show-description no-description">Full production details haven't been added yet.${compDisplay ? ` Check back, or visit <strong>${esc(compDisplay)}</strong> directly for more information.` : ''}</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(show.show_title)}${compDisplay ? ' — ' + esc(compDisplay) : ''} | iHeartTheatre</title>
  <meta name="description" content="${esc(metaDesc)}">
  <link rel="canonical" href="https://ihearttheatre.com/shows/${show.id}.html">

  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(show.show_title)}${compDisplay ? ' — ' + esc(compDisplay) : ''} | iHeartTheatre">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:url" content="https://ihearttheatre.com/shows/${show.id}.html">
  <meta property="og:site_name" content="iHeartTheatre">
  <meta name="twitter:card" content="summary_large_image">

  <script type="application/ld+json">
${jsonLd}
  </script>

  <link rel="stylesheet" href="../css/shared.css?v=202605130001">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-RS9LV72HK8"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-RS9LV72HK8');
  </script>

  <style>
    :root {
      --bg:#0a0a0a; --surface:#111; --surface2:#1a1a1a;
      --border:rgba(255,255,255,0.08);
      --purple:#8b5cf6; --purple-d:#7c3aed; --gold:#f59e0b;
      --text:#f0f0f0; --text-muted:#9ca3af; --radius:12px;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}

    /* HERO */
    .show-hero{position:relative;background:linear-gradient(135deg,#0f0720 0%,#12082e 40%,#0a0a0a 100%);border-bottom:1px solid var(--border);padding:3.5rem 1.5rem 3rem}
    .show-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(139,92,246,.12) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(245,158,11,.06) 0%,transparent 50%);pointer-events:none}
    .show-hero-inner{max-width:860px;margin:0 auto;position:relative}
    .show-breadcrumb{font-size:.78rem;color:var(--text-muted);margin-bottom:1.25rem}
    .show-breadcrumb a{color:var(--text-muted);text-decoration:none}
    .show-breadcrumb a:hover{color:var(--purple)}
    .show-breadcrumb span{margin:0 .4rem}
    .show-badge-row{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem}
    .badge{display:inline-block;font-size:.72rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;padding:.28rem .7rem;border-radius:999px}
    .badge-professional{background:rgba(245,158,11,.15);color:var(--gold);border:1px solid rgba(245,158,11,.3)}
    .badge-community{background:rgba(139,92,246,.15);color:#c4b5fd;border:1px solid rgba(139,92,246,.3)}
    .badge-school{background:rgba(52,211,153,.12);color:#6ee7b7;border:1px solid rgba(52,211,153,.25)}
    .badge-genre{background:rgba(255,255,255,.07);color:var(--text-muted);border:1px solid var(--border)}
    .show-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3.25rem);font-weight:700;line-height:1.15;margin-bottom:.6rem}
    .show-company{font-size:1.05rem;color:var(--text-muted);margin-bottom:1.5rem}
    .show-company strong{color:var(--text);font-weight:500}
    .show-meta-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:1rem;margin-bottom:2rem}
    .show-meta-item{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius);padding:.85rem 1rem}
    .show-meta-label{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);margin-bottom:.3rem}
    .show-meta-value{font-size:.95rem;font-weight:500}
    .dates-note{font-size:.78rem;color:var(--text-muted);margin-top:.5rem}

    /* CONTENT */
    .show-content{max-width:860px;margin:0 auto;padding:2.5rem 1.5rem}
    .show-description{font-size:1.08rem;line-height:1.75;color:#d1d5db;margin-bottom:2rem}
    .show-description.no-description{color:var(--text-muted);font-style:italic}

    /* RELATED */
    .related-section{margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--border)}
    .related-section h2{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:600;margin-bottom:1.25rem}
    .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:1rem}
    .related-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;text-decoration:none;display:block;transition:border-color .2s,background .2s}
    .related-card:hover{border-color:rgba(139,92,246,.4);background:var(--surface2)}
    .related-card-title{font-family:'Playfair Display',serif;font-size:.95rem;font-weight:600;color:var(--text);margin-bottom:.3rem;line-height:1.3}
    .related-card-meta{font-size:.78rem;color:var(--text-muted);display:block;margin-top:.15rem}

    /* BACK */
    .back-link-row{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid var(--border)}
    .back-link{display:inline-flex;align-items:center;gap:.4rem;color:var(--purple);text-decoration:none;font-size:.9rem;font-weight:500;transition:gap .2s}
    .back-link:hover{gap:.7rem}

    @media(max-width:600px){
      .show-meta-grid{grid-template-columns:1fr 1fr}
      .show-hero{padding:2rem 1rem 1.75rem}
      .show-content{padding:1.75rem 1rem}
    }
  </style>
</head>
<body>

<nav>
<div class="nav-container">
<a href="../index.html" class="logo">iHeartTheatre</a>
<div class="hamburger" aria-label="Toggle navigation">
<span></span>
<span></span>
<span></span>
</div>
<div class="nav-links"><a href="../index.html">Home</a><a href="../whats-on.html" class="active">What's On</a><a href="../auditions.html">Auditions</a><a href="../reviews.html">Reviews</a><a href="../about.html">About</a><a href="../contact.html">Contact</a><a href="../musicals.html">Musicals</a><a href="../career-builder.html">Career Builder</a></div>
</div>
</nav>

<header class="show-hero">
  <div class="show-hero-inner">
    <nav class="show-breadcrumb" aria-label="Breadcrumb">
      <a href="../index.html">Home</a><span>›</span>
      <a href="../whats-on.html">What's On</a><span>›</span>
      <span>${esc(show.show_title)}</span>
    </nav>
    <div class="show-badge-row">
      ${prodBadge}
      ${genrePills}
    </div>
    <h1 class="show-title">${esc(show.show_title)}</h1>
    ${compHtml}
    <div class="show-meta-grid">
      <div class="show-meta-item">
        <div class="show-meta-label">Dates</div>
        <div class="show-meta-value">${esc(datesDisplay)}</div>
        ${approxNote}
      </div>${venueTile}${locationTile}
    </div>
  </div>
</header>

<main class="show-content">
  ${descHtml}
  ${related}
  <div class="back-link-row">
    <a class="back-link" href="../whats-on.html">← Back to What's On</a>
  </div>
</main>

<footer>
<div class="footer-content">
<div class="footer-links">
<a href="../index.html">Home</a>
<a href="../whats-on.html">What's On</a>
<a href="../auditions.html">Auditions</a>
<a href="../reviews.html">Reviews</a>
<a href="../junior-kids-schools.html">Junior &amp; Kids</a>
<a href="../services.html">Services</a>
<a href="../musicals.html">Role Guides</a>
<a href="../companies.html">Companies</a>
<a href="../about.html">About</a>
<a href="../contact.html">Contact</a>
<a href="../privacy.html">Privacy</a>
<a href="../disclaimer.html">Disclaimer</a>
</div>
<p class="footer-copy">&copy; 2026 iHeartTheatre &bull; For Theatre Lovers Everywhere</p>
</div>
</footer>

<script src="../js/shared.js?v=202605130001"></script>
</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

// Strip a UTF-8 BOM if present (some Windows editors prepend one and JSON.parse rejects it)
const calendar = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8').replace(/^\uFEFF/, ''));

if (!DRY_RUN) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let written = 0;
for (const show of calendar) {
  const html = buildPage(show, calendar);
  const outFile = path.join(OUT_DIR, `${show.id}.html`);
  if (!DRY_RUN) {
    fs.writeFileSync(outFile, html, 'utf8');
  }
  written++;
}

// Prune stale generated pages that no longer exist in calendar.json
// (e.g. after dedupe-calendar.js removes duplicate entries)
const validIds = new Set(calendar.map(s => `${s.id}.html`));
let pruned = 0;
for (const f of fs.readdirSync(OUT_DIR)) {
  if (!/^mel-\d{4}-\d+\.html$/.test(f)) continue;
  if (validIds.has(f)) continue;
  if (!DRY_RUN) fs.unlinkSync(path.join(OUT_DIR, f));
  pruned++;
}
if (pruned) console.log(`Pruned ${pruned} stale show ${pruned === 1 ? 'page' : 'pages'}`);

console.log(`${DRY_RUN ? '[DRY RUN] Would write' : 'Written'} ${written} show pages to shows/`);
if (!DRY_RUN) {
  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.html') && f !== 'TEMPLATE.html');
  console.log(`shows/ directory now contains ${files.length} .html files`);
}
