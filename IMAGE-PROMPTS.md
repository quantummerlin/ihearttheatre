# iHeartTheatre — Image Generation Prompt Bank

> Model targets: **Nano Banana / Gemini** (also works with Flux/Midjourney with minor tweaks).
> All site art is dark, painterly, theatrical. **No purple/violet, no text, no logos, no recognizable people.**
> Save as `.webp` where possible. Every prompt below starts from the shared Style DNA.

## Shared Style DNA (prepend to every prompt)

```
Painterly cinematic theatre artwork. Deep near-black stage environment (#050508 tones),
a warm gold spotlight raking from stage right, burgundy velvet curtain edges just visible
in frame, subtle atmospheric haze, gold and amber rim-lighting, dramatic chiaroscuro.
Rich, theatrical, warm. No text, no logos, no watermarks, no recognizable real people —
use silhouettes, backs, scenery or empty stages only.
```

---

## A. Live & upcoming show art (priority — these pages exist but are imageless)

Save to `images/shows/{id}.webp` (16:9). Wire into show detail pages when the calendar gains an `image` field.

1. **Jersey Boys** (Frankston Arts Centre, closes Aug 31)
   `{DNA} 1960s four-part harmony group as silhouettes under a single amber spotlight, retro microphone stands, smoke curling. 16:9.`

2. **Pretty Woman — The Musical** (Regent Theatre, to Sep 9)
   `{DNA} Romantic city night: rain-slicked sidewalk reflecting warm marquee lights, a red umbrella abandoned on the stage floor. 16:9.`

3. **SIX The Musical** (Comedy Theatre, to Oct 23)
   `{DNA} Six crowns floating above a dark concert stage, concert-haze spotlights in gold and deep red, pop-concert energy with period costume silhouettes. 16:9.`

4. **Newsies Jr** (Williamstown, Aug)
   `{DNA} Young newsboys silhouetted mid-leap with newspapers scattering through a golden spotlight, turn-of-century city backdrop. 16:9.`

5. **A Beautiful Noise — Neil Diamond Musical** (Princess Theatre, to Sep 27)
   `{DNA} A lone microphone on a dark stage inside a warm golden glow, subtle sparkles floating like stage glitter. 16:9.`

6. **After-Light: Prog-Rock Opera** (The Mount Players, Macedon, to Aug 30)
   `{DNA} Dramatic rock-opera stage: electric guitar silhouette backlit by red and gold beams, storm-cloud backdrop lit from within. 16:9.`

7. **The Deplorables** (Theatre Works, St Kilda, to Aug 29)
   `{DNA} Sharp comedy satire mood: a single wooden chair centre-stage under an interrogation-style gold lamp, long stage shadow. 16:9.`

8. **Oliver Jr** (Bellarine Jongleurs, The Jetty Shed, Aug 28–30)
   `{DNA} Victorian street scene: a small flat-capped child silhouette holding an empty bowl, gas-lamp glow, cobblestones. 16:9.`

9. **Ride the Cyclone** (Theatre of the Damned, Geelong, Sep)
   `{DNA} A vintage amusement-park cyclone ride glowing gold against a starless night sky, eerie and magical. 16:9.`

10. **General fallback for community musicals**
    `{DNA} A silhouetted ensemble mid-number on a community theatre stage, one warm golden spot, house seats dark in foreground. 16:9.`

---

## B. Section hero banners (folders with only one generic image)

Save to the matching `images/{section}/` folder (wide 16:9, negative space left for headline text).

11. **Auditions** → `images/auditions/hero-mic.wav-prompt`: `{DNA} An empty stage with a single spotlight on a microphone stand, sheet music scattered at its base. Wide banner, negative space left.`
12. **Songs** → `images/songs/`: `{DNA} A grand piano and open sheet music bathed in a warm spotlight, dust motes glowing. Wide banner, negative space left.`
13. **Career Builder** → `images/career-builder/`: `{DNA} Dressing-room mirror framed with warm bulbs, costumes hanging on a rail, one gold spotlight. Wide banner.`
14. **Actors/Performers** → `images/actors/`: `{DNA} Rows of empty red theatre seats facing a brightly lit empty stage, sense of anticipation. Wide banner.`
15. **Companies** → `images/companies/`: `{DNA} A curtain rising over a packed dark auditorium, golden house lights bokeh. Wide banner.`
16. **What's On** → `images/whats-on/`: `{DNA} A theatre marquee glowing warm gold against a deep blue-black Melbourne dusk, blank where titles would go. Wide banner, no text.`
17. **Junior & Kids** → `images/junior/`: `{DNA} Small performers in costume silhouetted in a joyful bow under a big warm golden spot, paper confetti drifting. Wide banner.`
18. **Holiday programs** → `images/holiday/`: `{DNA} A bright rehearsal studio, ballet barre and jazz shoes in a pool of warm light, school-holiday energy. Wide banner.`

---

## C. Review article / OG images (for upcoming NEW reviews)

One per review; save `images/articles/rev-{show-slug}.webp`; set the review's `og:image` to it (absolute URL).

```
{DNA} Theatrical key-art evoking the show "{TITLE}": {ONE ICONIC MOTIF from the production —
e.g. lanterns cascading into an auditorium for A Christmas Carol; pine trees in a foyer for
Into the Woods}. Mood matching the review's stars. 16:9.
```

Templates by genre:
19. **Musical**: `{DNA} Orchestra pit glowing up onto an empty stage, conductor's podium silhouetted. 16:9.`
20. **Play/drama**: `{DNA} Two empty chairs facing each other under a single warm lamp on a dark stage. 16:9.`
21. **Comedy**: `{DNA} A single mic stand and an upturned stool under playful warm light, confetti shadows. 16:9.`
22. **Kids/family**: `{DNA} A child's perspective: giant story-book props and a glowing stage beyond, wonder and warmth. 16:9.`

---

## D. Role-page heroes (15 existing pages have art; the other ~255 roles don't)

Portrait 2:3, save `images/roles/{musical}-{role}.webp`.

23. `{DNA} Character study for {ROLE} in {MUSICAL}: performer in full costume seen from behind in a golden spot, capturing {CHARACTER ESSENCE — e.g. "defiant power" for Elphaba, "innocent mischief" for Matilda}. No face visible. Portrait 2:3.`

Priority batch (top searched roles): Wicked Glinda/Elphaba (done), Les Mis Valjean/Éponine (done), Matilda, Frozen Elsa, Annie — then Six queens, Mamma Mia Donna, Newsies Jack.

---

## E. Utility / empty-state art

24. **Ghost light (404 / offline)**: `{DNA} A lone ghost light at centre of an empty dark stage, single warm bulb, faint red curtain edges, dust in the beam. Square 1:1.`
25. **Coming soon**: `{DNA} Closed red velvet curtain with a thin line of gold light leaking underneath. Square 1:1.`
26. **Site OG card replacement** (for pages without specific art): `{DNA} Elegant theatre proscenium arch glowing gold and red over darkness, subtle sparkle. Exact 1200×630.`

---

## Generation & placement workflow

1. Generate with the prompt; download at 16:9 (heroes/OG) or 2:3 (roles/square for empty states).
2. Convert to `.webp` (quality 80, max ~90 KB ideally).
3. Save under the `images/` subfolder shown above.
4. Update the referencing HTML/og tag; verify the file exists before referencing (site rule 7).
5. For reviews, also update the review's `og:image` and `twitter:image`.

## Constraints recap
- Gold (#e8b923/#ffd700) + curtain red (#b91c1c) only — **never purple** (#667eea/#764ba2).
- No recognizable real performers, no text/logos in art (avoids copyright/likeness issues with named shows — motifs only).
- Match existing `images/articles/hero-*.webp` look for consistency with the homepage slideshow.
