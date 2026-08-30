---
name: melbourne-spotlight
description: Feature a new review or show across iHeartTheatre's discovery surfaces. Use just after publishing a review or show, or when asked to launch/highlight/promote upcoming content. Adds the item to the homepage hero slideshow pool, ticker, reviews grid ordering, and writes a social-share caption. Depends on new-review-launcher / show-page-publisher having run.
---

# melbourne-spotlight

After content is published, wire it into every place visitors discover it.

## For a NEW review
1. **Homepage hero** — `index.html` slideshow pulls `images/articles/hero-*.webp`. If the review has generated art (`images/articles/rev-{slug}.webp` from image-prompter), add it to the slide pool array; otherwise reuse an existing hero slot (do not fabricate art).
2. **Ticker** — prepend a `NEW REVIEW` item to `data/ticker.json` (badge, text ≤ 90 chars with stars, link to the review); keep ≤ 8 items, drop the oldest `REVIEW`. Also update the `TICKER_FALLBACK` array in `js/main.js` if the lead item changes.
3. **Reviews grid** — the REVIEWS array in `reviews.html` renders in order; ensure the new entry sits among the first entries so 'All Reviews' shows it early.
4. **Social caption** — draft one for Instagram/Facebook:
   `{EMOJI} {TITLE} — {COMPANY} at {VENUE} {STARS}\n"{one-line excerpt}"\nRead the full review: ihearttheatre.com/reviews/review-{slug}.html`

## For a NEW show (mel-2026-*)
1. Ticker item with correct status badge: `OPENING SOON` (>7 days out), `NOW SHOWING` (running), `CLOSING SOON` (≤7 days left) → link `/whats-on.html`.
2. Verify the detail link renders on `shows.html` + `whats-on.html` (fetch-driven, automatic).
3. If opening within 30 days, mention it in the homepage ticker lead.

## Verification
- `data/ticker.json` parses; main.js fallback array edited if needed.
- Homepage renders the new slide (check slide count in index.html JS).
- No duplicate ticker ids.
