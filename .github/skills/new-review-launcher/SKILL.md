---
name: new-review-launcher
description: Publish a new theatre review end-to-end on iHeartTheatre.com. Use when given review text + photos for Deanna or Penelope and asked to publish/add/launch a review. Handles page creation from the canonical template, REVIEWS array update in reviews.html, gallery wiring from REVIEWERS/ photos, feed/sitemap regeneration, and launch verification. DO NOT USE FOR show listings (use show-page-publisher).
---

# new-review-launcher

End-to-end workflow for publishing a review on iHeartTheatre.com (static site, gold/red canonical design).

## Required inputs
Reviewer (deanna|penelope) · show title · venue · date seen · rating (x or x.5, max 5) · full review text · photo filenames in `REVIEWERS/{Deanna|Penelope}/`.

## Steps (all REQUIRED, in order)

1. **Verify photos exist** — list `REVIEWERS/{Reviewer}/` and confirm every referenced file exists before writing any `<img>`. If a photo has a space/comma/accent in its name, rename to slug form first and keep the old name's usage out of HTML.
2. **Create the page** at `reviews/review-{reviewer}-{show-slug}.html`:
   - Copy the structure of a recent review (e.g. `review-deanna-the-lucky-country.html`), NOT the `.github/prompts/review-publisher.prompt.md` template (it contains deprecated purple tokens).
   - Head: `<meta name="theme-color" content="#e8b923">`, manifest `../manifest.json`, apple-touch-icon `../icons/icon-192x192.png`, `/css/style.css` + `../css/app.css` + `../css/reviews.css`.
   - `og:image` must use the best real photo: `https://ihearttheatre.com/REVIEWERS/{Reviewer}/{best-photo}`. Never the generic og-social-share image when a real photo exists.
   - Include JSON-LD `Review` schema with `itemReviewed` (`TheaterEvent`), realistic `reviewBody` first sentence, rating, author with profile URL, and publisher `iHeartTheatre` → `https://ihearttheatre.com`.
   - Load `../js/main.js` at end of body. Do NOT hand-write nav (main.js injects it).
   - Gallery block: `<div class="gallery">` with one `<img src="../REVIEWERS/{Reviewer}/{file}" alt="{Show Title} production" loading="lazy">` per photo.
3. **Update `reviews.html`**:
   - Add one entry to the `REVIEWS` array with `id:'r{next}'`, title, genre, stars, reviewer, date (`'Mon YYYY'`), company, a one-sentence excerpt, and `href:'/reviews/review-{reviewer}-{show-slug}.html'`.
   - Increment the count in the page-hero sub ("N Melbourne theatre productions reviewed…") to the real new total.
4. **Regenerate artifacts** — run:
   - `node scripts/generate-feed.js`
   - `node scripts/generate-sitemap.js`
5. **Update reviewer profile count** — on `reviewer-{reviewer}.html`, bump the "Reviews Published" stat by 1.
6. **Verification checklist**:
   - Page has theme-color `#e8b923`, no purple `#667eea`/`#764ba2` anywhere
   - All `<img>` srcs resolve to real files
   - REVIEWS array entry sorts/displays (search for the title in reviews.html source)
   - `node --check` on any touched JS

## Hard rules
- Real counts only — never invent stats.
- Voice: warm, exuberant, reviewers-not-critics. Penelope pieces keep child-appropriate enthusiasm.
- Never add third-party scripts.
- Copyright year stays 2026.
