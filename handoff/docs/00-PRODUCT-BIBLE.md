# 🎭 iHeartTheatre — Product Bible
## The Performer Career Intelligence Platform

---

## 1. VISION & MISSION

### Vision
To become the essential career tool for every musical theatre performer — from first audition to professional stage.

### Mission
Help performers make smarter career decisions by combining comprehensive role intelligence, personalized matching, AI-powered coaching, and professional resume tools into one seamless platform.

### One-Line Pitch
**"The smart way to build your performing career."**

### What We Are
- A decision engine + growth strategist for performers
- IMDb for theatre roles + AI career coach
- A performer's operating system

### What We Are NOT
- A casting site (we don't connect performers to directors)
- A generic theatre database
- A social network for performers
- A general AI chatbot

---

## 2. CORE PHILOSOPHY

Every feature must answer one of these four questions:

| Question | Module |
|----------|--------|
| **What should I go for?** | Role Intelligence |
| **What should I perform?** | Song Intelligence |
| **What should I improve?** | Career Tracking & AI Coach |
| **What should I do next?** | Planner & Calendar |

If a feature doesn't serve one of these → cut it.

---

## 3. TARGET USERS

### Primary: Young Performers (Ages 12–30)
- Students, community theatre participants, semi-professional performers
- Still developing skills and building experience
- Need guidance, confidence, and strategic direction
- Use phones primarily

### Secondary: Parents & Guardians
- Want clarity on what roles suit their child
- Don't understand casting nuance
- Need smart decisions explained simply
- Value their child's growth over ego

### Tertiary: Theatre Educators & Directors
- Want a reference tool for casting decisions
- May recommend the platform to students

### User Persona: "Penelope" (archetype)
- 14 years old, Melbourne
- 3 years tap dance experience
- Mezzo belt vocal range (similar to Adele)
- Has done 2 community shows
- Parents helping navigate career
- Wants to know: "What role is best for me in Newsies?"

---

## 4. PRODUCT STRUCTURE (Two-Part Architecture)

### Part 1: 🌐 Public Exploration Layer (ihearttheatre.com)
**"Learn the world of roles"**

- Open to everyone, no login required
- Fully searchable database of musicals and roles
- SEO-driven content pages
- Discovery and education focused
- Conversion funnel into Career Builder

### Part 2: 🤖 Career Builder (App Layer)
**"Now let's apply this to YOU"**

- Personalized experience (local storage, optional accounts)
- AI-powered recommendations
- Resume builder
- Career planning and tracking
- Freemium model

### The Bridge
On every public role page:
> 👉 **"See how YOU match this role"** → Takes user into Career Builder

---

## 5. CORE MODULES (5 Pillars)

### Module 1: 🎭 Role Intelligence
**Purpose:** Help performers understand every role in every musical
- Complete role breakdowns with attributes
- "Who is this role good for?" insights
- "What this role develops" growth information
- Strategic casting tips
- Fully searchable and filterable

### Module 2: 🎵 Song Intelligence
**Purpose:** Help performers choose the right audition songs
- Curated song database with vocal analysis
- Role-matched song recommendations
- "Safe / Standout / Power" song categories
- Song effectiveness tracking over time
- Overdone song warnings

### Module 3: 🗓️ Opportunity & Planning
**Purpose:** Help performers plan their career timeline
- Dual calendar (global opportunities + personal events)
- Admin-curated audition listings (Melbourne-first)
- Smart preparation timelines
- "Should I audition?" scoring
- AI-generated weekly plans

### Module 4: 📈 Career Tracking & AI Coach
**Purpose:** Help performers understand their growth
- Audition logging with outcomes
- Pattern detection (what works, what doesn't)
- Skill gap analysis
- Progress visualization
- AI coaching (freemium)

### Module 5: 📄 Resume Builder
**Purpose:** Help performers present themselves professionally
- Guided resume creation
- Smart suggestions based on profile
- Role-specific resume tuning
- Multiple versions (general, dance-focused, acting-focused)
- Beautiful PDF export
- Local storage with auto-save
- Headshot integration

---

## 6. INFORMATION ARCHITECTURE

```
ihearttheatre.com/
│
├── / (homepage — discovery + value prop)
│
├── /musicals (browse all musicals)
│   ├── /musicals/newsies
│   │   ├── /musicals/newsies/jack-kelly
│   │   ├── /musicals/newsies/katherine
│   │   ├── /musicals/newsies/les
│   │   ├── /musicals/newsies/ensemble-dance
│   │   └── ...all roles
│   ├── /musicals/wicked
│   ├── /musicals/hamilton
│   └── ...
│
├── /search (advanced filters — age, vocal, dance, etc.)
│
├── /songs (browse audition songs)
│   ├── /songs?vocal_type=mezzo
│   ├── /songs?style=belt
│   └── ...
│
├── /calendar (public opportunity listings)
│
├── /career-builder (app — personalized)
│   ├── /career-builder/profile
│   ├── /career-builder/matches
│   ├── /career-builder/songs
│   ├── /career-builder/planner
│   ├── /career-builder/resume
│   ├── /career-builder/ai-coach
│   └── /career-builder/insights
│
├── /about
├── /pricing
└── /blog (SEO content — audition tips, guides)
```

---

## 7. TECH STACK

### Frontend (PWA)
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **State:** Zustand or Context API
- **Storage:** localStorage + IndexedDB (Dexie.js)
- **PDF Generation:** react-pdf or jsPDF
- **PWA:** Service Worker + Web App Manifest
- **Routing:** React Router

### Hosting & Infrastructure
- **Static Site:** Cloudflare Pages (via GitHub)
- **Backend API:** Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite at edge)
- **Key-Value Store:** Cloudflare KV (rate limiting, sessions)
- **File Storage:** Cloudflare R2 (headshots, images)
- **Domain:** ihearttheatre.com

### AI Layer
- **Free Tier:** Free LLM models (e.g., Llama via Cloudflare Workers AI)
- **Paid Tier:** Premium model (GPT-4o / Claude via API)
- **BYO API Key:** Users can bring their own API key
- **Rate Limiting:** 10 requests/day free, unlimited paid

### Data
- **Musical/Role Database:** Static JSON files (loaded at build time)
- **Song Database:** Static JSON files
- **User Data:** Local storage (MVP), Cloudflare D1 (accounts)
- **Calendar Data:** Cloudflare D1 (admin), local storage (user)

---

## 8. DESIGN DIRECTION

### Visual Identity: "Backstage Pro"
- **Primary Background:** Deep charcoal (#1a1a2e) / near-black (#0f0f1a)
- **Accent Primary:** Theatre gold (#d4a843)
- **Accent Secondary:** Deep crimson (#8b1a1a)
- **Success/Match:** Emerald (#2ecc71)
- **Warning/Stretch:** Amber (#f39c12)
- **Risk:** Soft red (#e74c3c)
- **Text Primary:** Off-white (#f0ece2)
- **Text Secondary:** Warm grey (#9a9a9a)
- **Cards:** Dark grey (#252540) with subtle border glow
- **Typography:** Clean sans-serif (Inter or similar)
- **Feel:** Clean, modern, slightly theatrical — like a backstage call sheet meets premium app

### Design Principles
1. **Mobile-first** (most users on phones)
2. **Progressive disclosure** (don't overwhelm)
3. **Confidence-building** (never discouraging)
4. **Fast** (instant interactions)
5. **Theatrical but professional** (not childish, not corporate)

### Key UI Patterns
- Score meters that animate (fit %, growth %)
- Colour-coded match levels (green/amber/red)
- Card-based layouts for roles and songs
- Bottom navigation on mobile (5 tabs)
- Subtle glow effects on strong matches

---

## 9. MONETISATION MODEL

### Free Tier
- Full musical/role browsing
- Basic role matcher (top 5 matches)
- Limited AI (10 prompts/day via free model)
- 1 resume template
- Basic calendar view
- Local storage only

### Premium Tier ($5–10/month)
- Unlimited AI coaching (premium model)
- Advanced matching insights (growth scores, strategy modes)
- Multiple resume templates + role-specific tuning
- Prep timelines + audition planning
- Song effectiveness tracking
- Priority opportunity alerts
- Cloud sync (save across devices)
- Multiple resume versions

### BYO API Key (free feature)
- Users can input their own LLM API key
- Bypasses rate limiting
- Uses their preferred model
- No cost to you

---

## 10. MVP SCOPE (Phase 1)

### What to Build First
- **20 musicals** with COMPLETE casts (every role including ensemble) — see Starter 20 list in `08-STARTER-MUSICAL-DATABASE.md`
- Start with 3 fully built (Newsies → Matilda → Grease), then expand by tier
- Role browsing + search/filter
- Basic user profile (local storage)
- Role matching (fit + growth + spotlight scores with smart labels)
- Self-reflection system on completed roles
- Resume builder (1 template, PDF export)
- Static calendar (admin-managed, Melbourne/Victoria first — 106 shows loaded)
- Basic AI coach (10/day, free model)
- Audition song recommendations (curated starter set of 30–50 songs)

### What to Defer
- Full song database expansion (Phase 2)
- Advanced career tracking + pattern detection (Phase 2)
- Accounts + cloud sync (Phase 3)
- Community submissions (Phase 4)
- Multiple cities/regions (Phase 4)

---

## 11. BUILD ORDER

| Phase | Features | Timeline |
|-------|----------|----------|
| **Phase 1** | Musical/role database, browsing, search, basic profile, basic matching | Weeks 1–3 |
| **Phase 2** | Resume builder, PDF export, AI coach (basic) | Weeks 4–5 |
| **Phase 3** | Calendar system, opportunity matching | Weeks 6–7 |
| **Phase 4** | Song database, song recommendations | Weeks 8–9 |
| **Phase 5** | Career tracking, audition logging, insights | Weeks 10–12 |
| **Phase 6** | Accounts, cloud sync, premium tier | Weeks 13–16 |
| **Phase 7** | Community features, expansion | Ongoing |

---

## 12. SUCCESS METRICS

### Engagement
- Daily active users
- Roles browsed per session
- Resume exports per week
- AI prompts used per day

### Retention
- Return rate (7-day, 30-day)
- Profile completion rate
- Audition log entries per user

### Conversion
- Free → Premium conversion rate
- Time to first resume export
- Time to first AI interaction

### Growth
- New musicals added per month
- Calendar listings per month
- SEO traffic growth

---

*This document is the single source of truth for the iHeartTheatre product.*
*All feature decisions, design choices, and development priorities reference this bible.*