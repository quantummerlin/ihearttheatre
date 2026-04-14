# iHeartTheatre — Developer Handoff

> **Date:** June 2025
> **From:** Product / Content team
> **To:** Developer
> **Domain:** ihearttheatre.com.au
> **Email routing:** Cloudflare catch-all → Gmail (already configured)

---

## 1. THE PIVOT

iHeartTheatre is pivoting from a **review-only site** to a **community hub for musical theatre in Melbourne & Victoria**. The new site will have multiple sections:

### New Site Structure

```
ihearttheatre.com.au/
├── /                          → Landing / Home page (needs building)
├── /auditions                 → Audition Noticeboard (PROVIDED ✅)
├── /services                  → Service Provider Directory (PROVIDED ✅)
├── /reviews                   → Show Reviews (EXISTING — keep & enhance)
├── /shows                     → Show Database & Calendar (data provided, page needs building)
└── /about                     → About page (needs building)
```

### What stays from the old site
- **Review pages** — keep the existing review system. Anyone can submit a review. Production teams can forward reviews to share with their cast/crew.
- Existing domain, hosting, DNS, Cloudflare setup

### What's new
- **Audition Noticeboard** — companies submit audition links via email, we post them
- **Service Provider Directory** — vocal coaches, dance schools, accompanists, headshot photographers, etc.
- **Show Database** — 22 musicals on the 2026 Melbourne/Victoria calendar with full role breakdowns (270 roles)
- **Community focus** — the site becomes a one-stop shop for the Victorian musical theatre community

---

## 2. WHAT'S IN THIS PACKAGE

### 📁 `/pages/` — Ready-to-integrate HTML pages

| File | Description | Status |
|------|-------------|--------|
| `auditions/auditions.html` | Audition Noticeboard — full page with search, filters, cards, demo data | ✅ Ready |
| `auditions/auditions.css` | Standalone CSS for auditions page | ✅ Ready |
| `providers/providers.html` | Service Provider Directory — category pills, search, region filter, cards | ✅ Ready |
| `providers/providers.css` | Standalone CSS for providers page | ✅ Ready |

**Integration notes:**
- Both pages are self-contained HTML+CSS+JS (vanilla, no frameworks)
- The JS is inline in each HTML file — can be extracted to separate .js files if preferred
- Both pages load data from JSON files. Currently fetches from relative paths — **update paths to match your CMS/API setup**
- Both pages include demo/fallback data inline in JS so they work even without the JSON endpoint
- The nav bar and footer are included in each page — **replace with your site's shared nav/footer**
- Dark theme uses CSS custom properties (`:root` vars) — easy to adjust to match your existing design system
- Both pages are mobile-responsive

### 📁 `/data/` — JSON data files

| Directory | Contents | Notes |
|-----------|----------|-------|
| `musicals/` | 22 JSON files — one per musical | Full role data: vocal range, role type, scoring, audition tips |
| `noticeboard/` | `submissions.json` — audition listings | Demo data structure; replace with CMS/database |
| `providers/` | `providers.json` — service provider listings | Demo data structure; replace with CMS/database |

### 📁 `/docs/` — Reference documentation

| File | Description |
|------|-------------|
| `00-PRODUCT-BIBLE.md` | Full product vision, features, UX philosophy |
| `01-COMPLETE-DATA-MODELS.md` | Complete data model schemas for all entities |
| `10-MELBOURNE-VICTORIA-CALENDAR-2026.md` | Full 2026 show calendar for Melbourne/Victoria |
| `11-CALENDAR-EVENTS-JSON.json` | Calendar data in structured JSON |

### 📁 `/outreach/` — Marketing materials (not for dev, but included for reference)

| File | Description |
|------|-------------|
| `outreach-email-template.md` | Email template for reaching out to theatre companies |
| `companies-to-contact.md` | ~50 Victorian theatre companies with tracking |

---

## 3. DATA ARCHITECTURE

### 3.1 Musical JSON Schema (per show)

Each of the 22 musical files follows this structure:

```json
{
  "musical": {
    "id": "jersey-boys",
    "title": "Jersey Boys",
    "subtitle": "The Story of Frankie Valli & The Four Seasons",
    "music_by": "Bob Gaudio",
    "lyrics_by": "Bob Crewe",
    "book_by": "Marshall Brickman & Rick Elice",
    "setting": "1950s-1980s, Newark/New York",
    "themes": ["fame", "friendship", "loyalty"],
    "difficulty_level": "advanced",
    "ensemble_size": "medium",
    "dance_intensity": "moderate",
    "vocal_style": ["pop", "rock", "doo-wop"]
  },
  "roles": [
    {
      "id": "jersey-boys-frankie-valli",
      "name": "Frankie Valli",
      "role_type": "lead",
      "voice_type": "Tenor (Countertenor)",
      "vocal_range": { "low": "Bb2", "high": "Eb6" },
      "gender": "male",
      "age_range": "teens-40s",
      "description": "...",
      "key_songs": ["Can't Take My Eyes Off You", "Sherry", "Big Girls Don't Cry"],
      "character_traits": ["determined", "talented", "loyal"],
      "audition_tips": ["...", "..."],
      "scoring": {
        "spotlight_visibility": 5,
        "growth_potential": 3,
        "skill_utilisation_percent": 95,
        "smart_labels": {
          "spotlight": "🌟 Show-Stealer",
          "growth": "📈 Solid Builder"
        },
        "decision_engine_tags": ["best_to_stand_out", "best_to_get_cast"]
      },
      "casting_notes": "..."
    }
  ]
}
```

**Note:** `frozen.json` has a slightly different structure — the top-level keys (`id`, `title`, etc.) are NOT nested under a `musical` key. Handle both formats.

### 3.2 Role Types (4 tiers)
- `lead` — Principal roles
- `supporting` — Named supporting characters
- `featured_ensemble` — Named parts often played by ensemble members
- `ensemble` — General ensemble / chorus

### 3.3 Smart Labels System
- **Spotlight:** 🌟 Show-Stealer (5) → ⭐ High Visibility (4) → ✨ Solid Spotlight (3) → 💡 Supporting Glow (2) → 🔧 Ensemble Foundation (1)
- **Growth:** 🚀 Skill Accelerator (5) → 🔥 Strong Development (4) → 📈 Solid Builder (3) → 🌱 Gentle Growth (2)

### 3.4 Audition Submissions Schema

```json
{
  "id": "001",
  "show_title": "Into the Woods",
  "company": "Fab Nobs Theatre",
  "type": "musical",
  "audition_date": "2026-07-15",
  "closing_date": "2026-07-10",
  "audition_location": "Wangaratta, VIC",
  "region": "regional",
  "submission_link": "https://...",
  "roles_available": "All principal and ensemble roles",
  "notes": "Prepare 32 bars...",
  "submitted_by": "email@company.com",
  "date_posted": "2025-06-15",
  "status": "active",
  "tags": ["musical", "all ages", "regional"]
}
```

### 3.5 Service Provider Schema

```json
{
  "id": "v01",
  "name": "Sarah Mitchell Vocal Studio",
  "category": "vocal-coach",
  "tagline": "Musical theatre voice specialist",
  "description": "...",
  "services": ["Private lessons", "Audition coaching", "Belt technique"],
  "location": "Richmond, Melbourne",
  "region": "melbourne",
  "website": "https://...",
  "email": "sarah@example.com",
  "phone": "0412 345 678",
  "price_range": "$$",
  "experience": "15+ years",
  "tags": ["musical theatre", "belt", "audition prep"],
  "featured": true,
  "date_listed": "2025-06-15"
}
```

### 3.6 Provider Categories

| ID | Label | Icon |
|----|-------|------|
| `vocal-coach` | Vocal Coaches | 🎤 |
| `dance-school` | Dance Schools | 💃 |
| `acting-coach` | Acting Coaches | 🎭 |
| `accompanist` | Accompanists / Répétiteurs | 🎹 |
| `headshots` | Headshot Photographers | 📸 |
| `audition-prep` | Audition Prep / Coaching | ⭐ |
| `music-director` | Music Directors for Hire | 🎼 |
| `choreographer` | Choreographers for Hire | 🩰 |
| `costume` | Costume Makers / Hire | 👗 |
| `other` | Other Services | 🔧 |

---

## 4. REVIEW SYSTEM (PIVOT ENHANCEMENT)

The existing review system should be enhanced to support this flow:

### 4.1 How Reviews Work Now
- Anyone can submit a show review via a form
- Reviews appear on the site

### 4.2 Enhancements Needed

**Public Review Submission:**
- Anyone can submit a review for any show/production
- Form fields: Show name, Company, Reviewer name (optional / anonymous), Star rating (1-5), Review text, Date attended
- Reviews go into a moderation queue before publishing

**Production Team Forwarding:**
- Production teams (directors, producers, stage managers) can share a link to their show's review page
- They can email this link to cast, crew, and stakeholders
- Suggested feature: A "Share Reviews" button on each production page that generates a shareable link or copies a pre-written message

**Review Page Structure:**
```
/reviews                     → Browse all reviews (by show, company, date)
/reviews/[show-slug]         → All reviews for a specific show title
/reviews/[show-slug]/[company-year]  → Reviews for a specific production
```

**Suggested Review Schema:**
```json
{
  "id": "rev-001",
  "show_title": "Sister Act",
  "company": "Whitehorse Musical Theatre",
  "production_year": 2026,
  "reviewer_name": "Jane D.",
  "anonymous": false,
  "rating": 4,
  "review_text": "A fantastic community production with incredible energy...",
  "date_attended": "2026-05-15",
  "date_submitted": "2025-05-18",
  "status": "published",
  "moderated_by": "admin",
  "tags": ["musical", "comedy", "community theatre"]
}
```

---

## 5. EMAIL INFRASTRUCTURE (ALREADY CONFIGURED)

| Address | Purpose | Routing |
|---------|---------|---------|
| `auditions@ihearttheatre.com.au` | Audition submissions from companies | → Gmail via Cloudflare catch-all |
| `promotions@ihearttheatre.com.au` | Service provider listing requests | → Gmail via Cloudflare catch-all |
| `*@ihearttheatre.com.au` | Any other address | → Gmail via Cloudflare catch-all |

Outbound sending is configured via Brevo SMTP in Gmail (can send FROM custom addresses).

---

## 6. INTEGRATION CHECKLIST FOR DEVELOPER

### Immediate (Phase 1)
- [ ] Add `/auditions` route → integrate `auditions.html` into site framework
- [ ] Add `/services` route → integrate `providers.html` into site framework
- [ ] Replace hardcoded nav/footer with shared site components
- [ ] Update JSON fetch paths to match your data layer (CMS, API, or static files)
- [ ] Adapt CSS variables to match existing site design system (or keep as-is)
- [ ] Ensure mobile responsiveness with existing site layout

### Short-term (Phase 2)
- [ ] Set up a simple CMS or admin panel for adding audition listings (replacing manual JSON edits)
- [ ] Set up a simple CMS for adding service providers
- [ ] Build `/shows` page using the 22 musical JSON files + calendar data
- [ ] Enhance review system with moderation queue and production team sharing

### Medium-term (Phase 3)
- [ ] Build landing/home page that showcases all sections
- [ ] Add SEO metadata for each page
- [ ] Set up analytics
- [ ] Consider user accounts for saved shows / review history (optional)

---

## 7. DESIGN TOKENS (CSS CUSTOM PROPERTIES)

Both pages use these shared design tokens. Adjust to match your site:

```css
/* Shared across both pages */
--bg-dark: #0d0d1a;
--bg-mid: #141428;
--bg-card: #1a1a36;
--bg-card-hover: #222248;
--red: #c0392b;           /* Auditions accent */
--red-light: #e74c3c;
--gold: #f5a623;           /* Shared highlight */
--purple: #8e44ad;         /* Providers accent */
--purple-light: #a855f7;
--text-primary: #f0f0f5;
--text-secondary: #a0a0b8;
--text-muted: #6a6a82;
--border: #2a2a4a;
--radius: 12px;
--radius-sm: 8px;
```

---

## 8. TOTAL DATA SUMMARY

| Category | Count |
|----------|-------|
| Musicals in database | 22 |
| Total roles across all shows | 270 |
| Demo audition listings | 6 |
| Demo service providers | 8 |
| Provider categories | 10 |
| Companies to contact (outreach) | ~50 |
| HTML pages ready | 2 |
| CSS files | 2 |
| JSON data files | 24 |

---

## Questions? Reach out to the product team or email auditions@ihearttheatre.com.au