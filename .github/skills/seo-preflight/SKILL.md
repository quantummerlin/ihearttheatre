---
name: seo-preflight
description: SEO verification pass for iHeartTheatre.com pages. Use after adding/changing pages, or before deploy. Checks meta descriptions, og tags, canonical URLs, JSON-LD, sitemap/feed currency, and heading hygiene per page; outputs issues with file:line. Does not rewrite content voice.
---

# seo-preflight

Static-site SEO verification. For each page (or the changed set), verify:

## Per-page checks
1. Exactly one `<title>`; ideally ≤ 60 chars, ends with brand suffix `| iHeartTheatre`.
2. `<meta name="description">` present, 70–160 chars, unique, no lorem.
3. Open Graph: `og:title`, `og:description` (if used), `og:type`, `og:image` (MUST exist on disk — absolute URL for reviews: `https://ihearttheatre.com/REVIEWERS/...`), `og:url` matching canonical.
4. `twitter:card` = `summary_large_image` wherever og:image exists.
5. `<link rel="canonical">` present on root content pages, matching the live URL.
6. JSON-LD: reviews → `Review` schema with `itemReviewed`; show pages → `Event`; role pages → `CreativeWork`. Validate via `node -e JSON.parse(...)` extract.
7. Single `<h1>` per page.
8. `theme-color` = `#e8b923`.

## Site-wide checks
- `sitemap.xml` regenerated (`node scripts/generate-sitemap.js`) — compare URL count to actual HTML count minus excluded set.
- `reviews/feed.xml` regenerated (`node scripts/generate-feed.js`) — newest item date sensible.
- No orphan pages in sitemap (deleted venues.html/role-finder.html stay out; Wayne pages out while unpublished).
- `robots.txt` allows `/` and points at sitemap.

## Output
Markdown table `file | issue | severity | fix`. Block deploy on CRITICAL items (broken og:image, malformed JSON-LD).
