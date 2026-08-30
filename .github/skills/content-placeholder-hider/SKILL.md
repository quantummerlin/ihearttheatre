---
name: content-placeholder-hider
description: Detect and hide placeholder/demo content on iHeartTheatre.com before launch. Use when preparing a release or when told a section feels fake/demo. Finds fabricated stats, example.com providers, demo- id data, empty template reviews, coming-soon alert buttons; hides or removes them and updates nav/sitemap accordingly. DO NOT silently delete real content.
---

# content-placeholder-hider

Placeholder content destroys trust on a community-first site. This skill finds and hides it.

## Detection patterns

| Pattern | Where | Action |
|---|---|---|
| `example.com` / `demo-v**` / `demo-0**` ids | `data/providers/providers.json`, `data/noticeboard/submissions.json` | Empty the array; empty-state on the page links to the relevant submit-* form |
| `FILL IN`, `PLACEHOLDER`, `{Reviewer}: ... goes here` comments | `reviews/review-*.html` | Unpublish the review page (remove from sitemap + nav + reviews.html) until written |
| Emoji avatar with "Replace the emoji" comment | `reviewer-*.html` | Hide the reviewer from reviewers.html + nav until photo supplied |
| Stats claimed vs real ("40+ Reviews", "10,000+ theatre lovers") | about/hero copy | Replace with the exact real count computed from files |
| `coming soon` + `alert()` buttons | any page | Remove buttons or convert to mailto/contact CTA |
| Dead company/profile grids (`/companies/*.html` style) | about.html | Replace with CTA to the real directory page |

## Rules
- Hide first, never delete source files (Wayne review pages stay on disk, just unlinked/noindexed).
- After hiding, run `node scripts/generate-sitemap.js` + `node scripts/generate-feed.js`.
- Real counts only: compute them (e.g. `reviews.html` REVIEWS array length).
- Empty states must stay honest and offer the submission path ("No auditions listed yet — submit yours").
