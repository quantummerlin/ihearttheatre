---
name: release-prep
description: Pre-launch verification runner for iHeartTheatre.com. Use before a launch, after a batch of changes, or when asked to check/readiness-review the site. Detects broken asset references, dead internal links, purple palette drift, stale placeholders, missing og:image and manifest issues; outputs a go/no-go report. DOES NOT make content decisions on its own.
---

# release-prep

Pre-launch verification for the static iHeartTheatre site. Run each check and compile a go/no-go report.

## Checks (ordered by severity)

### 1. Broken assets (CRITICAL)
Scan every `.html` for `src=`/`href=` referencing local files; verify each exists on disk (account for relative paths per folder depth). Report:
- Missing images/CSS/JS/manifests
- `images/icons/icon-192.png` or `icon-512.png` (deprecated paths — must be `/icons/icon-192x192.png` / `icon-512x512.png`)

### 2. Manifest + PWA
- `manifest.json` icons exist on disk; `theme_color` is `#e8b923`
- No page links the wrong icon paths
- `offline.html` exists; `sw_v11.js` PRECACHE_URLS all exist

### 3. Palette drift (design-guardian pass)
Search all HTML/CSS for `#667eea`, `#764ba2`, and any `<meta name="theme-color" content="#667eea">`. Must be zero.

### 4. Placeholder content audit (HIGH)
Flag any live page still containing: `example.com`, `demo-`, `PLACEHOLDER`, `FILL IN`, `coming soon` in body content (not comments). Confirm Wayne pages stay excluded from nav/sitemap while unpublished.

### 5. Data health
- `data/calendar.json`, `data/audition-songs.json`, `data/ticker.json`, `data/noticeboard/submissions.json`, `data/providers/providers.json` parse as valid UTF-8 JSON (`node -e JSON.parse`)
- No mojibake (`â€”`, `Ã©` sequences) in HTML/JSON — run `node scripts/scan-mojibake.js`

### 6. SEO basics
- `reviews.html` REVIEWS array count matches page-hero text count
- Every review page has og:image; sitemap regenerated (`node scripts/generate-sitemap.js`) and feed (`node scripts/generate-feed.js`)
- No `noindex` on pages that should be indexed

### 7. JS syntax
`node --check js/shared.js js/main.js` plus any script touched.

## Report format
| # | Severity | Check | Result | Details |
Then a single GO / NO-GO line with the blocking items list.
