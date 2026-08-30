---
name: image-prompter
description: Generate AI image-generation prompts in the iHeartTheatre visual DNA (dark painterly theatre art, gold spotlight, red curtain) for show artwork, review heroes/OG images, section heroes, role-page heroes, and empty-states. Produces copy-paste prompts for Nano Banana / Gemini. DO NOT generate images itself — only prompts + placement guidance.
---

# image-prompter

Produces image-generation prompts consistent with the existing site art (dark, painterly, AI-generated hero imagery) for Nano Banana / Gemini.

## Style DNA (include in every prompt)

> Painterly cinematic theatre art, deep near-black stage (#050508), warm gold spotlight from stage-right, burgundy velvet curtain edges in frame, subtle atmospheric haze, gold/amber rim light, dramatic chiaroscuro, rich and theatrical.
> **Constraints:** no text, no logos, no watermarks, no recognizable real people (silhouettes, backs, scenery and empty stages only).

## Prompt templates

### A. Review article / OG image (per show) — 16:9
```
{STYLE DNA} Scene for the show "{TITLE}" by {COMPANY} at {VENUE}: {KEY VISUAL MOTIF from the production — e.g. "a lone chandelier over a masquerade ball", "pine trees in a theatre foyer"}. Aspect ratio 16:9, dramatic stage composition.
```
Output: save to `images/articles/rev-{show-slug}.webp`, set as `og:image` on the review page.

### B. Show detail page artwork (`shows/mel-2026-*`) — 16:9
```
{STYLE DNA} Theatrical key-art for "{TITLE}" ({GENRE}), produced by {COMPANY} at {VENUE}: {MOTIF}. No text or cast faces. 16:9.
```
Note: 106 generated pages currently have NO artwork. Prioritise shows still running or upcoming in `data/calendar.json`; skip expired ones. Generic motif fallback for musicals: "silhouetted ensemble mid-number under a gold spot".

### C. Section hero banners (for empty/sparse images/ folders) — 16:9
About → warm company of silhouettes taking a bow. Auditions → empty stage with a single spotlight on a mic stand. Songs → grand piano and sheet music in a spotlight. Career/actors → dressing-room mirror lights with costumes on rails. Companies → curtain rise over a packed dark auditorium.
Format: `{STYLE DNA} {SCENE DESCRIPTION}. Wide 16:9 banner composition with negative space left-of-centre for headline text.`

### D. Role-page heroes (`images/roles/`) — portrait 2:3
```
{STYLE DNA} Costume and character study for {ROLE} from {MUSICAL} — a performer in full costume shot from behind or in silhouette, capturing the character's essence ({trait}). No recognizable face. Portrait 2:3.
```

### E. Empty-state / illustration (404, coming-soon) — square
```
{STYLE DNA} A single ghost light standing centre of an empty dark stage, one warm bulb glowing, faint red curtain at the edges. Square 1:1.
```

## Placement rules
- OG images: every review uses its own generated image (`og:image` absolute URL).
- Show pages get the image via `data-calendar` `image` field once wired (see Phase backlog).
- Keep painterly consistency: gold + burgundy only; never purple.
