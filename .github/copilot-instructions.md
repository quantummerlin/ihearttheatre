# iHeartTheatre — Copilot Project Instructions

> Last updated: August 2026. This file documents the **actual current state** of the codebase. Previous versions were stale — trust this one.

## Project Overview
iHeartTheatre.com is a Melbourne theatre community PWA website run by **Deanna Amato** and her young daughter **Penelope Quinn**, the site's junior reviewer (plus guest reviewer **Wayne Michael**, profile pending). They publish theatre reviews celebrating Melbourne's theatre scene — from school halls to Broadway blockbusters — and host data-driven tools: What's On calendar, Role Finder, Song Browser, Career Builder.

**Brand voice:** warm, exuberant, community-first. "We ♥ Theatre" — reviewers, not critics. Real counts only; never inflate stats.

## Tech Stack
- **Static HTML** — No build system, no framework. Pages are self-contained HTML files with inline `<style>` + shared CSS/JS assets.
- **PWA** — `manifest.json`, `sw.js` (shim → `sw_v11.js`), icons in `icons/` and favicon SVG in `images/icons/iht-icon.svg`
- **Deployment** — GitHub Pages via `.github/workflows/deploy.yml` (runs Pagefind during deploy)
- **Search** — Pagefind (`pagefind.yml`), triggered by Cmd-K via `js/search.js` (only works on deployed site)
- **Domain** — ihearttheatre.com
- **Data layer** — `/data/*.json` consumed at runtime (fetch) and at build time (`scripts/*.js`)

## File Structure
```
index.html                  ← Homepage (canonical; app-shell with sidebar)
whats-on.html               ← Melbourne calendar view (data/calendar.json)
shows.html                  ← Shows hub (data/calendar.json)
auditions.html              ← Auditions noticeboard (data/noticeboard/submissions.json)
services.html               ← Service providers (data/providers/providers.json)
companies.html              ← Victorian theatre companies
musicals.html               ← Role Finder hub (data/musicals/*.json)
songs.html                  ← Audition song browser (data/audition-songs.json)
career-builder.html         ← Career tool
reviews.html, reviewers.html ← Review listing & profiles
reviewer-deanna.html, reviewer-penelope.html, reviewer-wayne.html
about.html, contact.html, manifesto.html, privacy.html, disclaimer.html
submit-*.html               ← Submission forms (Formspree)
reviews/                    ← Individual review pages
  review-deanna-*.html      ← Deanna's reviews
  review-penelope-*.html    ← Penelope's reviews
  phantom-of-the-opera-2024.html
shows/                      ← Generated show detail pages (mel-2026-*.html) — output of scripts/generate-shows.js; NEVER hand-edit
musicals/{show}/            ← Static role guide pages (shared.css + musicals.css)
REVIEWERS/                  ← Raw photos per reviewer (Deanna/, Penelope/)
generated_images/           ← AI-generated profile/hero images (deanna-profile.webp, penelope-profile.webp, hero-background.webp)
icons/                      ← PWA icons 72-512px (icon-192x192.png etc.)
images/                     ← Site imagery (musicals/, roles/, articles/, global/, per-section heroes)
css/shared.css              ← Legacy shared stylesheet (gold/red tokens, static nav/footer)
css/app.css                 ← App-shell stylesheet (sidebar, mobile nav, ticker, cards)
css/style.css               ← Thin token override layer (kept for app-shell cohort)
css/reviews.css, shows.css, musicals.css, submit-forms.css
js/shared.js                ← Legacy runtime: SW registration, GA4, forms, cookie banner
js/main.js                  ← App-shell runtime: sidebar/mobile nav injection, ticker, page transitions
js/search.js                ← Pagefind Cmd-K modal
scripts/generate-shows.js   ← Builds shows/mel-2026-*.html from data/calendar.json
scripts/merge-songs.js      ← Rebuilds data/audition-songs.json from _batch*.json with UTF-8
sw.js + sw_v11.js           ← Service worker (sw.js is a shim importing sw_v11.js)
manifest.json, sitemap.xml, robots.txt, 404.html
```

## Canonical Design System — gold/red curtain
The site's ONE canonical palette is the **gold/red curtain** theme. The purple palette (`#667eea`/`#764ba2`) is DEPRECATED and must never be re-introduced.

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` / `--bg` | `#050508` | Page background |
| `--bg-secondary` / `--bg-2` | `#0a0a0f` | Card/section backgrounds |
| `--bg-tertiary` / `--bg-3` | `#12121a` | Elevated surfaces |
| `--text-primary` / `--text` | `#f5f5f5` | Headings, body text |
| `--text-secondary` / `--text-2` | `#c0c0d0` (legacy `#a0a0b0`) | Muted text, dates, meta |
| `--accent-primary` / `--primary` | `#e8b923` | Links, badges, active states |
| `--accent-secondary` / `--secondary` | `#b91c1c` | Gradient end, accents |
| `--accent-gold` / `--gold` | `#ffd700` | Stars, highlights, premium |
| `--gradient-primary` / `--grad-primary` | `linear-gradient(135deg, #e8b923 0%, #b91c1c 100%)` | Buttons, headings, cards |
| `--gradient-gold` / `--grad-gold` | `linear-gradient(135deg, #ffd700 0%, #ffb347 100%)` | Stars, ratings |
| `--glass-bg` / `--glass` | `rgba(255, 255, 255, 0.03)` | Glassmorphism panels |
| `--glass-border` | `rgba(255, 255, 255, 0.08)` | Glass borders |

### Typography
- **Headings:** `'Playfair Display', serif` — weights 400–900
- **Body:** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` — weights 300–700
- **Fonts:** preconnect + async preload pattern (see any hub page `<head>`)

### Visual language
- Dark stage (#050508) with glassmorphism (`backdrop-filter: blur(16-20px)`)
- Gold spotlight / curtain-red gradients; gold star ratings
- Progress bar: gold→red gradient fixed at top
- Animations: subtle fade-ins, translateY reveals, hover scale/glow effects

## Two Page Cohorts

### A. App-shell pages (new standard — use for NEW pages)
`index.html`, hub pages (`shows.html`, `whats-on.html`, `auditions.html`, `reviews.html`, `musicals.html`, `songs.html`, `career-builder.html`, `about.html`, `contact.html`…) and all `reviews/*.html`.
- Load `/css/style.css` + `/css/app.css` (+ `reviews.css` for review articles)
- Load `/js/main.js` — it injects the sidebar (≥768px) and mobile bottom nav (≤767px) from its `NAV_ITEMS` config. **Do NOT hand-write nav markup on these pages.**
- Active-page detection in `main.js#getActivePage()` — update it when adding nav targets.

### B. Legacy static pages
`musicals/{show}/*.html` role guides and `shows/mel-2026-*.html` generated pages.
- Load `../../css/shared.css` + page stylesheet (`musicals.css` / `shows.css`) with `?v=` cache-buster
- Hand-written static nav + hamburger + `js/shared.js`
- `shows/mel-2026-*.html` are generated — edit `scripts/generate-shows.js` + `data/calendar.json` instead.

## Required Head Tags

App-shell pages (absolute paths):
```html
<meta name="theme-color" content="#e8b923">
<link rel="icon" type="image/svg+xml" href="/images/icons/iht-icon.svg">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">
<link rel="manifest" href="/manifest.json">
```

Legacy pages inside subfolders (relative paths):
```html
<meta name="theme-color" content="#e8b923">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="manifest" href="../manifest.json">   <!-- or ../../manifest.json -->
<link rel="apple-touch-icon" href="../icons/icon-192x192.png">
<link rel="stylesheet" href="../css/shared.css?v=20260515">
```

## Forms
All submission forms (`submit-*.html`, contact) use **Formspree** endpoints with `submitFormHelper()` fallback. Do NOT re-introduce mailto-only submission; do NOT log submissions to console.

## Data Conventions
- `data/calendar.json` — single source of truth for Melbourne shows (ids `mel-2026-001`…). Run `node scripts/generate-shows.js` after editing.
- `data/audition-songs.json` — generated by `node scripts/merge-songs.js` (UTF-8 safe). Never hand-edit; edit `_batch*.json` and re-merge.
- `data/ticker.json` — homepage ticker items.
- JSON files must be valid UTF-8 (Windows PowerShell 5.1 corrupts accents — use Node for merges).

## Review Page Convention
- Naming: `reviews/review-{reviewer}-{show-slug}.html`
- Photos live in `REVIEWERS/{Reviewer}/` and are referenced as `../REVIEWERS/{Reviewer}/{file}`
- Include JSON-LD Review schema, og:image (ideally a real show photo), progress bar, related-reviews section
- Use `.github/prompts/review-publisher.prompt.md` as the publishing workflow
- After adding a review: update `reviews.html` REVIEWS array, reviewer profile page count, and re-run sitemap generation if present

## Rules
1. **NEVER use light backgrounds.** All pages use dark theme (#050508).
2. **NEVER use purple (#667eea/#764ba2).** Canonical palette is gold/red (#e8b923/#b91c1c).
3. **NEVER reference index-v2.html.** The canonical homepage is `index.html`.
4. **NEVER add third-party scripts** (no trackers, no ninja/myninja scripts).
5. **Copyright year is 2026.** Keep it current.
6. **Never hand-edit `shows/mel-2026-*.html`** — regenerate via script.
7. **Image files must exist before referencing them** — check with a dir listing; use a fallback (hide-on-error) for optional art.
8. **Test on mobile.** App-shell pages get the injected mobile bottom nav; legacy pages need working hamburger.
9. **Update sitemap.xml** when adding new pages.
10. **Update `sw_v11.js` PRECACHE_URLS** (not `sw.js`) when adding critical assets.
11. **Update reviews.html** when adding new reviews (the listing page).
12. **Real counts only** — no fake stats, no invented social proof.
