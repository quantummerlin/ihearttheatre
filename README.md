# iHeartTheatre

> **All of it. All the time.**

iHeartTheatre is Melbourne and Victoria's complete theatre resource — every stage, every scale. What's on, what's casting, what to sing, what's worth seeing. Built by people who actually go.

Live at **[ihearttheatre.com](https://ihearttheatre.com)**.

---

## What's here

| Section | Purpose |
|---|---|
| `index.html` | Homepage |
| `whats-on.html` | Filterable index of every current Victorian theatre production |
| `shows/[slug].html` | Per-show pages (generated from `data/calendar.json` in W2-3 of the May 2026 sprint) |
| `musicals.html` | Role Finder — searchable database of 30 musicals and ~270 roles with vocal range, dance level, casting insights |
| `career-builder.html` | Free profile + role matcher + resume builder for performers, with localStorage autosave |
| `songs.html` | Audition song browser with role-matching cross-links (shipping in W5 of the May 2026 sprint) |
| `auditions.html` | Audition noticeboard for community, school and professional companies |
| `reviews/` (33 pages) | Honest theatre reviews from Deanna Amato (adult productions) and Penelope Quinn (family productions, from a junior reviewer's perspective) |
| `companies.html` | Production companies directory |
| `services.html` | Directory of vocal coaches, dance schools, accompanists, headshot photographers |
| `junior-kids-schools.html` | Hub for kids' and school theatre |
| `manifesto.html` | The "reviewer not critic" philosophy |
| `about.html`, `contact.html` | Site info + contact |
| `privacy.html`, `disclaimer.html`, `404.html` | Legal + error |

## Tech

- **Static HTML.** No framework, no build system. Each page is self-contained with inline `<style>` and shared assets via `/css/shared.css` and `/js/shared.js`.
- **PWA.** Installable via `manifest.json` and `sw.js` service worker.
- **Hosted on GitHub Pages.** Custom domain `ihearttheatre.com` via `CNAME`. Auto-deployed from `main` via `.github/workflows/deploy.yml`.
- **Data layer.** Show, role, song and provider data lives in `/data/` as JSON. Page generators read from there. See [`handoff/docs/01-COMPLETE-DATA-MODELS.md`](handoff/docs/01-COMPLETE-DATA-MODELS.md) for the canonical schemas.
- **Forms.** Wired to Formspree (free tier).
- **Analytics.** GA4 (`G-RS9LV72HK8`).
- **Email.** `auditions@ihearttheatre.com` and similar via Cloudflare catch-all to Gmail.

## Design system

The canonical design system lives in [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — start there before changing visual styles. Highlights:

- **Theme:** dark (`#050508` background, purple → gold gradient accents)
- **Typography:** Playfair Display for headings, Inter for body
- **Navigation (two-tier):**
  - **Discover** — Shows · Reviews · Companies · Junior & Kids
  - **Audition** — Auditions · Role Finder · Songs · Career Builder · Services
  - **About** — About · Manifesto · Contact
- **Required head + body elements** documented per page in `copilot-instructions.md`. Do not deviate.

## Contributing content

- **Reviews** — anyone can submit one via `submit-review.html`. They go to a moderation queue (email).
- **Shows** — production companies can submit via `submit-show.html` or email `auditions@ihearttheatre.com`.
- **Services** — vocal coaches, dance schools, accompanists, headshot photographers and others can request a free directory listing via the Services page Get-Listed form.

## Built by

[Deanna Amato](reviewer-deanna.html) and [Penelope Quinn](reviewer-penelope.html) — a mother-daughter project covering Melbourne and Victorian theatre at every scale, from a kid's first church-hall debut to a State Theatre opening night.

## Project state

Currently in the **Path C Bridge sprint** (8 weeks from May 2026). The aim is to finish the community hub on the static stack and expose the rich role/song data as public discovery pages, before deciding whether to pivot to a React-based performer career platform. The live plan and decision log lives in the project doc.

Key historical references (preserved for context but archiving to `/docs/archive/` at the end of the sprint):
- [`AUDIT-REPORT.md`](AUDIT-REPORT.md) — June 2025 comprehensive site audit
- [`handoff/docs/00-PRODUCT-BIBLE.md`](handoff/docs/00-PRODUCT-BIBLE.md) — Performer Career Intelligence Platform vision
- [`handoff/DEVELOPER-HANDOFF.md`](handoff/DEVELOPER-HANDOFF.md) — June 2025 developer handoff with data architecture
