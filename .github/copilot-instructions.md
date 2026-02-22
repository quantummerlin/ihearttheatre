# iHeartTheatre — Copilot Project Instructions

## Project Overview
iHeartTheatre.com is a Melbourne theatre community PWA website run by **Deanna Amato** and her 7-year-old daughter **Penelope Quinn**. They publish theatre reviews celebrating Melbourne's theatre scene — from school halls to Broadway blockbusters.

## Tech Stack
- **Static HTML** — No build system, no framework. Pages are self-contained HTML files with inline `<style>` + shared assets.
- **PWA** — `manifest.json`, `sw.js` (service worker), icons in `icons/`
- **Deployment** — GitHub Pages via `.github/workflows/deploy.yml`
- **Domain** — ihearttheatre.com

## File Structure
```
index.html                  ← Homepage (canonical)
reviews.html                ← Reviews archive/listing page
reviewers.html              ← Reviewer profiles
reviewer-deanna.html        ← Deanna's profile page
reviewer-penelope.html      ← Penelope's profile page
about.html, contact.html    ← Info pages
junior-kids-schools.html    ← Kids/schools section
holiday-programs.html       ← Holiday programs
submit-review.html          ← Review submission form
submit-show.html            ← Show submission form
submit-holiday-program.html ← Holiday program submission
promote-show.html           ← Show promotion page
manifesto.html              ← Site manifesto
privacy.html, disclaimer.html ← Legal pages
review-sample.html          ← Sample review template
reviews/                    ← 33 individual review HTML pages
  review-deanna-*.html      ← Deanna's reviews (26)
  review-penelope-*.html    ← Penelope's reviews (7)
REVIEWERS/                  ← Raw content & images
  Deanna/                   ← Deanna's source text + photos
  Penelope/                 ← Penelope's source text + photos
generated_images/           ← AI-generated profile/hero images
icons/                      ← PWA icons (72-512px)
css/shared.css              ← Shared stylesheet
js/shared.js                ← Shared JS (SW, PWA, particles, hamburger, achievements)
sw.js                       ← Service worker
manifest.json               ← PWA manifest
sitemap.xml                 ← SEO sitemap
robots.txt                  ← SEO robots
404.html                    ← Error page
```

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#050508` | Page background |
| `--bg-secondary` | `#0a0a0f` | Card/section backgrounds |
| `--bg-tertiary` | `#12121a` | Elevated surfaces |
| `--text-primary` | `#f5f5f5` | Headings, body text |
| `--text-secondary` | `#a0a0b0` | Muted text, dates, meta |
| `--accent-primary` | `#667eea` | Links, badges, active states |
| `--accent-secondary` | `#764ba2` | Gradient end, accents |
| `--accent-gold` | `#ffd700` | Stars, highlights, premium |
| `--gradient-primary` | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` | Buttons, headings, cards |
| `--gradient-gold` | `linear-gradient(135deg, #ffd700 0%, #ffb347 100%)` | Stars, ratings |
| `--glass-bg` | `rgba(255, 255, 255, 0.03)` | Glassmorphism panels |
| `--glass-border` | `rgba(255, 255, 255, 0.08)` | Glass borders |

### Typography
- **Headings:** `'Playfair Display', serif` — weights 400-700
- **Body:** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` — weights 300-700
- **Google Fonts link:** `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap`

### Visual Effects
- **Glassmorphism:** `backdrop-filter: blur(20px)` + glass-bg/glass-border
- **Floating particles:** Purple (#667eea at 30% opacity) floating dots
- **Progress bar:** Gradient purple bar fixed at top
- **Confetti:** On 90% scroll achievement
- **Animations:** Subtle fade-ins, translateY reveals, hover scale effects

## Navigation Pattern
Every page MUST have this nav structure:

### Root-level pages:
```html
<nav>
  <div class="nav-container">
    <a href="index.html" class="logo">iHeartTheatre</a>
    <div class="hamburger"><span></span><span></span><span></span></div>
    <div class="nav-links">
      <a href="index.html">Home</a>
      <a href="whats-on.html">What's On</a>
      <a href="reviews.html">Reviews</a>
      <a href="reviewers.html">Reviewers</a>
      <a href="junior-kids-schools.html">Junior & Kids</a>
      <a href="holiday-programs.html">Holiday Programs</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
    </div>
  </div>
</nav>
```

### Pages inside `reviews/` subfolder:
Same structure but all `href` values prefixed with `../`:
```html
<a href="../index.html" class="logo">iHeartTheatre</a>
<!-- ... -->
<a href="../index.html">Home</a>
<a href="../whats-on.html">What's On</a>
<a href="../reviews.html">Reviews</a>
<!-- etc. -->
```

## Footer Pattern
```html
<footer>
  <div class="footer-content">
    <div class="footer-links">
      <a href="index.html">Home</a>
      <a href="reviewers.html">Reviewers</a>
      <a href="reviews.html">Reviews</a>
      <a href="about.html">About</a>
      <a href="privacy.html">Privacy</a>
      <a href="disclaimer.html">Disclaimer</a>
      <a href="contact.html">Contact</a>
    </div>
    <p class="footer-copy">&copy; 2026 iHeartTheatre &bull; The Theatre Renaissance Has Already Started</p>
  </div>
</footer>
```
(Use `../` prefix for pages in `reviews/`)

## Required Head Tags (every page)
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#667eea">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="manifest" href="manifest.json">   <!-- or ../manifest.json in reviews/ -->
<link rel="apple-touch-icon" href="icons/icon-192x192.png">  <!-- or ../icons/ -->
<link rel="stylesheet" href="css/shared.css">  <!-- or ../css/ -->
```

## Required Body Elements (every page)
```html
<div class="progress-bar" id="progressBar"></div>
<div class="particles" id="particles"></div>
<!-- ... page content ... -->
<!-- PWA Install Banner -->
<div id="pwa-install-banner" class="pwa-install-banner">
  <img src="icons/icon-96x96.png" alt="iHeartTheatre" class="pwa-icon">
  <div class="pwa-text">
    <h4>Install iHeartTheatre</h4>
    <p>Add to home screen for the best experience</p>
  </div>
  <button class="pwa-install-btn" onclick="installPWA()">Install</button>
  <button class="pwa-dismiss" onclick="dismissPWA()">&times;</button>
</div>
<button id="backToTop" class="back-to-top" aria-label="Back to top">&uarr;</button>
<script src="js/shared.js"></script>  <!-- or ../js/ -->
```

## Review Page Template Convention
Review files follow naming: `review-{reviewer}-{show-slug}.html`
- Deanna's: `reviews/review-deanna-{show}.html`
- Penelope's: `reviews/review-penelope-{show}.html`

Each review page includes:
1. Reviewer badge with profile image
2. Show title (h1, Playfair Display)
3. Meta info (venue, dates, rating stars)
4. Hero image from `REVIEWERS/{Name}/`
5. Review body content
6. Image gallery (if multiple photos)
7. Related reviews section

## Rules
1. **NEVER use light backgrounds.** All pages use dark theme (#050508).
2. **NEVER reference index-v2.html.** The canonical homepage is `index.html`.
3. **Copyright year is 2026.** Keep it current.
4. **All inline styles stay inline.** shared.css handles nav/footer/common elements; page-specific styles remain in `<style>` tags.
5. **Test on mobile.** Hamburger menu must work on all pages.
6. **Update sitemap.xml** when adding new pages.
7. **Update sw.js PRECACHE_URLS** when adding important new pages.
8. **Update reviews.html** when adding new reviews (the listing page).
