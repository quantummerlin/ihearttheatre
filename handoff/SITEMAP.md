# iHeartTheatre — Site Map

```
ihearttheatre.com
│
├── 🏠 HOME (/)
│   ├── Hero: "Melbourne's Musical Theatre Community Hub"
│   ├── Quick links to all sections
│   ├── Featured upcoming auditions (pulls from /auditions data)
│   ├── Featured service providers (pulls from /services data)
│   ├── Latest reviews (pulls from /reviews data)
│   └── Upcoming shows calendar preview
│
├── 🎭 AUDITION NOTICEBOARD (/auditions) ✅ PROVIDED
│   ├── Search & filter auditions
│   ├── Audition listing cards (Open / Soon / Closed)
│   ├── Submit CTA → auditions@ihearttheatre.com
│   └── "How it works" section
│
├── 🌟 SERVICE PROVIDER DIRECTORY (/services) ✅ PROVIDED
│   ├── Category pill filters (10 categories)
│   ├── Region filter (Melbourne / Regional VIC)
│   ├── Search across all provider data
│   ├── Provider cards with contact info
│   ├── Featured provider badges
│   ├── Submit CTA → promotions@ihearttheatre.com
│   └── "How it works" section
│
├── ⭐ REVIEWS (/reviews) — EXISTING (enhance)
│   ├── /reviews → Browse all reviews
│   │   ├── Filter by show, company, rating, date
│   │   └── Search reviews
│   ├── /reviews/[show-slug] → Reviews for a show title
│   ├── /reviews/[show-slug]/[company-year] → Specific production reviews
│   ├── Submit a review form (public, moderated)
│   └── Share link for production teams
│
├── 🎪 SHOWS (/shows) — DATA PROVIDED, PAGE NEEDS BUILDING
│   ├── /shows → 2026 Melbourne/Victoria Calendar
│   │   ├── Timeline / calendar view
│   │   ├── Filter by month, venue, genre
│   │   └── Show cards with key info
│   ├── /shows/[show-slug] → Individual show page
│   │   ├── Show metadata (composer, book, setting, themes)
│   │   ├── All roles with full breakdowns
│   │   ├── Vocal ranges, audition tips, scoring
│   │   ├── Smart labels (spotlight, growth)
│   │   ├── Upcoming productions of this show
│   │   └── Link to reviews for this show
│   └── 22 shows ready with 270 roles
│
├── ℹ️ ABOUT (/about) — NEEDS BUILDING
│   ├── What is iHeartTheatre
│   ├── The team / mission
│   ├── "For companies" — how to submit auditions & get listed
│   └── Contact info
│
└── 📧 EMAIL INFRASTRUCTURE (configured)
    ├── auditions@ihearttheatre.com → Gmail
    ├── promotions@ihearttheatre.com → Gmail
    └── *@ihearttheatre.com → Gmail (catch-all)
```

## User Flows

### Flow 1: Performer finds an audition
```
Home → Auditions → Search/Filter → Click "Full Details" → External audition page
```

### Flow 2: Performer finds a vocal coach
```
Home → Services → Filter "Vocal Coaches" → Browse cards → Click Website/Email/Call
```

### Flow 3: Theatre company submits an audition
```
Auditions page → "Submit an Audition" → Pre-filled email to auditions@ihearttheatre.com
(Admin manually adds listing to CMS/JSON)
```

### Flow 4: Service provider requests listing
```
Services page → "Get Listed Free" → Pre-filled email to promotions@ihearttheatre.com
(Admin manually adds listing to CMS/JSON)
```

### Flow 5: Anyone submits a review
```
Reviews → "Write a Review" → Fill form → Moderation queue → Published
```

### Flow 6: Production team shares reviews
```
Reviews/[show]/[production] → "Share" button → Copy link / pre-written message → Send to cast/crew
```

### Flow 7: Performer researches a role
```
Shows → Browse calendar → Click show → View all roles → Read breakdown, vocal range, audition tips
```