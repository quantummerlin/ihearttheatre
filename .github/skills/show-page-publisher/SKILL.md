---
name: show-page-publisher
description: Add or update a Melbourne theatre show on iHeartTheatre.com. Use when asked to add/list/schedule a show to the calendar, What's On, or shows listing. Edits data/calendar.json as the single source of truth, regenerates shows/mel-2026-*.html via scripts/generate-shows.js, and verifies hub wiring. DO NOT hand-edit generated show pages.
---

# show-page-publisher

The Melbourne shows system is **data-driven**: `data/calendar.json` is the single source of truth, `scripts/generate-shows.js` builds the 106+ static detail pages, and `shows.html` / `whats-on.html` fetch the JSON at runtime.

## Adding a show

1. Read `data/calendar.json`, find the highest `mel-2026-NNN` id, and add a new object as `mel-2026-{next}` with all standard fields (study 2 existing entries for the exact schema: id, show_title, company, venue, location, date_start, date_end, genre[], production_type, tags[]).
2. Run `node scripts/generate-shows.js` (add `--dry-run` first if unsure). Confirm the new `shows/mel-2026-{id}.html` appears and old untouched pages are unchanged.
3. Show detail pages are already linked automatically:
   - `shows.html` card footer → "View details" → `shows/{id}.html`
   - `whats-on.html` cards link `shows/{id}.html` when `show.id` exists
   No extra wiring needed.
4. Optionally add a ticker item in `data/ticker.json` (badge NOW SHOWING / OPENING SOON / CLOSING SOON, text, link `/whats-on.html`), keeping the array ≤ 8 items.
5. CI regenerates show pages + sitemap on deploy, but run `node scripts/generate-sitemap.js` locally after large additions.

## Editing / removing a show

- Edit the JSON entry and rerun `node scripts/generate-shows.js`.
- Never hand-edit any `shows/mel-2026-*.html` — it will be overwritten.
- Only delete JSON entries for shows that were mistakes; past shows may remain (they filter out of "upcoming" automatically by date).

## Verification
- `node -e "JSON.parse(require('fs').readFileSync('data/calendar.json','utf8'))"` — valid JSON, correct UTF-8 accents.
- Generated page exists and contains JSON-LD Event schema.
- No `mel-XXXX-999` gaps introduced accidentally.

## Hard rules
- Melbourne/Victoria only — the UK show lineage was deleted; never reintroduce it.
- Real data only: exact company/venue/dates from the source the user provides; never invent show data.
