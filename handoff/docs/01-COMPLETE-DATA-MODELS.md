# 🎭 iHeartTheatre — Complete Data Models

---

## 1. MUSICAL

The top-level entity. Every musical contains multiple roles.

```json
{
  "id": "newsies",
  "title": "Newsies",
  "subtitle": "The Musical",
  "year_premiered": 2012,
  "genre": ["drama", "dance-heavy", "ensemble-driven"],
  "era": "modern",
  "composer": "Alan Menken",
  "lyricist": "Jack Feldman",
  "book_writer": "Harvey Fierstein",
  "setting_period": "1899",
  "setting_location": "New York City",
  "themes": ["rebellion", "justice", "brotherhood", "youth"],
  
  "vocal_style": ["belt", "contemporary-musical-theatre"],
  "dance_intensity": 5,
  "acting_intensity": 4,
  "overall_difficulty": 4,
  
  "cast_size_min": 25,
  "cast_size_max": 40,
  "ensemble_importance": 5,
  
  "age_range_overall": { "min": 10, "max": 30 },
  
  "description": "Based on the 1992 film, Newsies tells the story of Jack Kelly and his fellow newsboys as they strike against unfair working conditions imposed by newspaper publisher Joseph Pulitzer. A high-energy, dance-driven show that demands exceptional ensemble work.",
  
  "notable_productions": [
    "Broadway (2012–2014)",
    "US National Tour (2014–2016)",
    "West End (2023)"
  ],
  
  "tags": ["family-friendly", "youth-cast-friendly", "tap-heavy", "high-energy"],
  
  "image_url": "/images/musicals/newsies.jpg",
  "slug": "newsies"
}
```

### Musical Fields Reference

| Field | Type | Purpose |
|-------|------|---------|
| `id` | string | Unique identifier (URL slug) |
| `title` | string | Display name |
| `subtitle` | string | Optional subtitle |
| `year_premiered` | number | Year first staged |
| `genre` | string[] | Genre tags for filtering |
| `era` | string | classic / golden-age / modern / contemporary |
| `composer` | string | Music credit |
| `lyricist` | string | Lyrics credit |
| `book_writer` | string | Book credit |
| `setting_period` | string | When the story is set |
| `setting_location` | string | Where the story is set |
| `themes` | string[] | Thematic tags |
| `vocal_style` | string[] | Dominant vocal styles |
| `dance_intensity` | 1–5 | How dance-heavy the show is |
| `acting_intensity` | 1–5 | How acting-heavy the show is |
| `overall_difficulty` | 1–5 | General difficulty level |
| `cast_size_min` | number | Minimum cast size |
| `cast_size_max` | number | Typical maximum cast |
| `ensemble_importance` | 1–5 | How important ensemble is to the show |
| `age_range_overall` | object | Age range across all roles |
| `description` | string | Rich description of the show |
| `notable_productions` | string[] | Major productions |
| `tags` | string[] | Searchable tags |
| `image_url` | string | Cover/poster image |
| `slug` | string | URL-safe identifier |

---

## 2. ROLE

The core entity. Every role belongs to a musical and has detailed attributes for matching.

```json
{
  "id": "newsies-ensemble-dance",
  "musical_id": "newsies",
  "name": "Ensemble — Newsie (Dance Focus)",
  "role_type": "ensemble",
  "ensemble_subtype": "dance-heavy",
  "gender": "any",
  "gender_notes": "Traditionally male, but many productions cast all genders",
  
  "age_range": { "min": 12, "max": 25 },
  "age_ideal": { "min": 14, "max": 20 },
  
  "vocal": {
    "range_low": "A3",
    "range_high": "D5",
    "tessitura_low": "C4",
    "tessitura_high": "A4",
    "voice_type": ["baritone", "tenor"],
    "belt_required": false,
    "belt_level": 2,
    "mix_required": false,
    "head_voice_required": false,
    "vocal_stamina": 3,
    "harmony_required": true,
    "solo_singing": false,
    "vocal_difficulty": 2
  },
  
  "dance": {
    "level": 5,
    "styles_required": ["tap", "jazz", "acrobatics"],
    "styles_beneficial": ["ballet", "contemporary"],
    "choreography_complexity": 5,
    "stamina_required": 5,
    "pickup_speed_needed": 4,
    "dance_difficulty": 5
  },
  
  "acting": {
    "level": 3,
    "emotional_depth": 2,
    "comedic_timing": 3,
    "dramatic_intensity": 2,
    "accent_required": "New York (light)",
    "character_type": ["energetic", "youthful", "rebellious"],
    "acting_difficulty": 3
  },
  
  "performance": {
    "energy_type": ["high-energy", "physical", "ensemble-driven"],
    "stage_presence_needed": 3,
    "confidence_level_needed": 4,
    "improvisation_needed": 1,
    "audience_interaction": false
  },
  
  "casting_insights": {
    "spotlight_level": 4,
    "growth_value": 5,
    "casting_competitiveness": 3,
    "typical_cast_description": "Strong dancers with high energy and good tap technique. Often cast based heavily on dance call performance.",
    "what_directors_look_for": "Clean tap technique, high energy, ability to maintain characterisation while dancing, strong ensemble cohesion.",
    "common_mistakes": "Focusing too much on individual flashiness rather than ensemble synchronisation.",
    "underrated_aspects": "The ensemble in Newsies gets extended spotlight moments, particularly in 'King of New York'. This is NOT a background role."
  },
  
  "growth_profile": {
    "skills_developed": ["tap technique", "ensemble discipline", "stamina", "physical theatre", "character dancing"],
    "career_value": "Builds exceptional dance credentials and ensemble experience. Highly valued on a resume for future dance-heavy shows.",
    "leads_to_roles": ["Featured dancer roles", "Dance captain", "Ensemble leads in other shows"],
    "recommended_for": "Performers with strong dance backgrounds who want to showcase and develop their tap skills in a high-profile ensemble context."
  },
  
  "audition_guidance": {
    "what_to_prepare": "Strong 16-bar cut showing range (not necessarily high belt). Be ready for an extensive dance call — tap skills will be heavily assessed.",
    "song_styles_recommended": ["upbeat musical theatre", "character-driven", "not overly operatic"],
    "song_styles_avoid": ["classical soprano", "slow ballads", "pop"],
    "common_audition_format": "Group dance call (often first cut), followed by vocal audition, then callbacks for specific roles.",
    "tips": [
      "The dance call is where you win or lose this role",
      "Show personality while dancing — don't just execute steps",
      "Learn basic tap vocabulary before the audition if possible",
      "Bring character shoes AND tap shoes"
    ]
  },
  
  "key_songs": [
    {
      "title": "King of New York",
      "type": "ensemble_feature",
      "notes": "Major tap number — this is where ensemble shines"
    },
    {
      "title": "Carrying the Banner",
      "type": "opening_ensemble",
      "notes": "High-energy opener with choreography"
    },
    {
      "title": "Seize the Day",
      "type": "ensemble_feature",
      "notes": "Dance break + powerful ensemble moment"
    }
  ],
  
  "description": "The Newsies ensemble is one of the most celebrated ensemble roles in modern musical theatre. Far from a background role, the dancing newsboys are the heartbeat of the show, with multiple extended dance features including the show-stopping 'King of New York' tap number. This role demands exceptional physical stamina, strong tap skills, and the ability to maintain high energy throughout.",
  
  "who_this_role_is_best_for": "Performers with strong tap dance experience who want a role where dance is the primary skill showcased. Ideal for those who may not be the strongest vocalists but excel in movement and physicality. Particularly valuable for younger performers building dance-heavy resumes.",
  
  "tags": ["dance-heavy", "tap", "ensemble-spotlight", "high-energy", "youth"],
  "slug": "ensemble-dance",
  "image_url": "/images/roles/newsies-ensemble.jpg"
}
```

### Role Fields Reference — Key Sections

#### Vocal Object
| Field | Type | Purpose |
|-------|------|---------|
| `range_low` | note | Lowest note required |
| `range_high` | note | Highest note required |
| `tessitura_low` | note | Comfortable low range |
| `tessitura_high` | note | Comfortable high range |
| `voice_type` | string[] | Voice classification(s) |
| `belt_required` | boolean | Whether belting is needed |
| `belt_level` | 1–5 | How strong the belt needs to be |
| `mix_required` | boolean | Mix voice needed |
| `head_voice_required` | boolean | Head voice needed |
| `vocal_stamina` | 1–5 | How demanding vocally over the run |
| `harmony_required` | boolean | Needs to sing harmony |
| `solo_singing` | boolean | Has solo moments |
| `vocal_difficulty` | 1–5 | Overall vocal difficulty |

#### Dance Object
| Field | Type | Purpose |
|-------|------|---------|
| `level` | 1–5 | Overall dance requirement |
| `styles_required` | string[] | Must-have dance styles |
| `styles_beneficial` | string[] | Helpful but not required |
| `choreography_complexity` | 1–5 | How complex the choreo is |
| `stamina_required` | 1–5 | Physical endurance needed |
| `pickup_speed_needed` | 1–5 | How fast they need to learn |
| `dance_difficulty` | 1–5 | Overall dance difficulty |

#### Acting Object
| Field | Type | Purpose |
|-------|------|---------|
| `level` | 1–5 | Overall acting requirement |
| `emotional_depth` | 1–5 | Emotional range needed |
| `comedic_timing` | 1–5 | Comedy skill needed |
| `dramatic_intensity` | 1–5 | Dramatic weight |
| `accent_required` | string | Any accent needed |
| `character_type` | string[] | Character energy tags |
| `acting_difficulty` | 1–5 | Overall acting difficulty |

#### Casting Insights Object
| Field | Type | Purpose |
|-------|------|---------|
| `spotlight_level` | 1–5 | How much stage time / visibility |
| `growth_value` | 1–5 | How much this role develops skills |
| `casting_competitiveness` | 1–5 | How many people compete for it |
| `typical_cast_description` | string | Who usually gets cast |
| `what_directors_look_for` | string | Casting priorities |
| `common_mistakes` | string | What auditionees get wrong |
| `underrated_aspects` | string | Hidden value of this role |

#### Growth Profile Object
| Field | Type | Purpose |
|-------|------|---------|
| `skills_developed` | string[] | What you gain from this role |
| `career_value` | string | How it helps your resume |
| `leads_to_roles` | string[] | What doors it opens |
| `recommended_for` | string | Who should aim for this |

---

## 3. USER PROFILE

Stored locally (IndexedDB) with optional cloud sync.

```json
{
  "id": "local-uuid-generated",
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-06-01T14:22:00Z",
  
  "personal": {
    "display_name": "Penelope S.",
    "age": 14,
    "age_range": "12-16",
    "gender": "female",
    "location": "Melbourne, Australia",
    "headshot_url": "/local/headshots/penelope.jpg",
    "bio": "Passionate performer with strong dance background, especially tap."
  },
  
  "vocal": {
    "range_low": "G3",
    "range_high": "E5",
    "tessitura_low": "Bb3",
    "tessitura_high": "C5",
    "voice_type": "mezzo-soprano",
    "belt_strength": 3,
    "mix_control": 2,
    "head_voice_strength": 3,
    "falsetto_strength": 2,
    "vocal_stamina": 3,
    "pitch_accuracy": 4,
    "harmony_ability": 3,
    "sight_reading": 2,
    "tone_tags": ["warm", "soulful", "belt-oriented"],
    "similar_artists": ["Adele", "Sara Bareilles"],
    "vocal_confidence": 3,
    "vocal_notes": "Strong mid-range belt, developing upper register"
  },
  
  "dance": {
    "overall_level": 4,
    "styles": {
      "tap": 5,
      "jazz": 3,
      "ballet": 2,
      "contemporary": 2,
      "hip_hop": 1,
      "acrobatics": 1
    },
    "pickup_speed": 4,
    "stamina": 4,
    "performance_quality": 4,
    "years_training": 3,
    "dance_confidence": 4,
    "dance_notes": "Strong tap dancer — 3 years training. Currently developing jazz and ballet."
  },
  
  "acting": {
    "overall_level": 3,
    "emotional_depth": 3,
    "comedic_timing": 3,
    "dramatic_intensity": 2,
    "accent_skills": ["Australian (native)", "American (basic)"],
    "improvisation": 2,
    "character_range": ["youthful", "energetic", "comedic"],
    "acting_confidence": 3,
    "acting_notes": "Natural comedic instinct. Working on dramatic range."
  },
  
  "performance": {
    "stage_presence": 3,
    "confidence_level": 3,
    "energy_type": ["high-energy", "comedic", "physical"],
    "audience_comfort": 3,
    "ensemble_skills": 4,
    "leadership_on_stage": 2
  },
  
  "musicality": {
    "rhythm_accuracy": 4,
    "musicianship": 3,
    "instruments": ["piano (basic)"],
    "music_reading": 2
  },
  
  "experience": {
    "years_performing": 2,
    "total_shows": 2,
    "lead_roles": 0,
    "supporting_roles": 1,
    "ensemble_roles": 1,
    "experience_level": "beginner-intermediate",
    "training_history": [
      {
        "type": "dance",
        "focus": "Tap Dancing",
        "institution": "Melbourne Dance Academy",
        "years": "2023–present",
        "level": "Intermediate-Advanced"
      },
      {
        "type": "vocal",
        "focus": "Musical Theatre Voice",
        "institution": "Private Teacher",
        "years": "2025–present",
        "level": "Beginner-Intermediate"
      }
    ]
  },
  
  "credits": [
    {
      "id": "credit-001",
      "show": "Oliver!",
      "role": "Ensemble",
      "company": "Melbourne Youth Theatre",
      "year": 2025,
      "role_type": "ensemble",
      "notes": "First show. Learned ensemble discipline."
    },
    {
      "id": "credit-002",
      "show": "Newsies",
      "role": "Ensemble (Newsie — Dance Focus)",
      "company": "Community Theatre Group",
      "year": 2026,
      "role_type": "ensemble",
      "notes": "Featured tap dancer. Key role in King of New York."
    }
  ],
  
  "goals": {
    "short_term": "Build ensemble experience in dance-heavy shows",
    "medium_term": "Land a supporting role within 12 months",
    "long_term": "Transition to lead roles in community theatre",
    "focus_areas": ["vocal development", "acting range", "audition confidence"],
    "strategy_mode": "growth"
  },
  
  "preferences": {
    "preferred_role_types": ["ensemble", "supporting"],
    "preferred_genres": ["modern", "dance-heavy"],
    "willing_to_travel": false,
    "max_travel_distance_km": 30,
    "available_days": ["weekday-evenings", "weekends"]
  },
  
  "settings": {
    "theme": "dark",
    "notifications": true,
    "ai_tier": "free",
    "byo_api_key": null,
    "premium_member": false
  }
}
```

---

## 4. AUDITION SONG

```json
{
  "id": "song-pulled",
  "title": "Pulled",
  "musical_source": "The Addams Family",
  "composer": "Andrew Lippa",
  
  "vocal": {
    "range_low": "G3",
    "range_high": "E5",
    "tessitura_low": "Bb3",
    "tessitura_high": "C5",
    "voice_type": ["mezzo-soprano", "alto"],
    "belt_level": 4,
    "mix_level": 2,
    "head_voice_level": 1,
    "vocal_difficulty": 3
  },
  
  "style_tags": ["comedic", "quirky", "belt", "character-driven", "upbeat"],
  "energy_type": ["comedic", "dark-humour", "playful"],
  "age_suitability": ["teen", "young-adult"],
  "gender_suitability": ["female", "non-binary"],
  
  "audition_context": {
    "good_for_roles": ["comedic characters", "quirky supporting roles", "Wednesday-type energy"],
    "shows_off": ["belt strength", "comedic timing", "character commitment"],
    "overdone_level": 3,
    "impact_potential": 4,
    "safe_choice": true,
    "standout_potential": 3
  },
  
  "recommended_cut": {
    "start_bar": 17,
    "end_bar": 48,
    "duration_seconds": 45,
    "notes": "Start from 'I'm being pulled in a new direction' — shows range and character quickly"
  },
  
  "similar_songs": ["song-what-is-this-feeling", "song-popular", "song-little-voice"],
  
  "character_types": ["confident", "quirky", "dark-humour", "rebellious"],
  "difficulty": 3,
  "energy_level": 4,
  
  "description": "A comedic belt piece perfect for performers with strong mid-range and good character instinct. Shows personality quickly — ideal for auditions where you need to stand out.",
  
  "tags": ["belt", "comedic", "female", "mezzo", "teen-appropriate"],
  "slug": "pulled"
}
```

### Song Matching Score Formula

Each song is scored against both the user AND the target role:

```
song_match_score = (
    vocal_match × 0.30 +
    character_match × 0.25 +
    skill_showcase × 0.20 +
    audition_strategy × 0.15 +
    performance_history × 0.10
) × 100
```

**Vocal Match (30%):** Range overlap + belt compatibility + tessitura alignment  
**Character Match (25%):** Does the song energy match the target ROLE energy?  
**Skill Showcase (20%):** Does the song highlight the user's strongest abilities?  
**Audition Strategy (15%):** Not overdone + appropriate for role type + impact potential  
**Performance History (10%):** Based on user's past success with similar songs (from song tracking data)

### Song Recommendation Categories

| Category | Description | When to Recommend |
|----------|-------------|-------------------|
| 🟢 **Safe Song** | Reliable, strong fit, consistent | When user needs reliability |
| 🟡 **Standout Song** | Slightly unique, helps differentiate | When user wants to be memorable |
| 🔥 **Power Song** | High impact if executed well | When user has high reflection scores and needs to make a statement |

### Audition Pack Output

When a user selects a target role, the system generates a complete audition plan:

```json
{
  "target_role": "Katherine (Newsies)",
  "song_recommendations": {
    "safe": { "song_id": "song-pulled", "score": 82, "reason": "Strong belt match, shows character quickly" },
    "standout": { "song_id": "song-watch-what-happens-reprise", "score": 78, "reason": "Mirrors Katherine's energy perfectly" },
    "power": { "song_id": "song-she-used-to-be-mine", "score": 75, "reason": "High emotional depth — if executed well, this elevates the audition" }
  },
  "focus_areas": ["Emphasise storytelling", "Show confidence early", "Lead with character, not just voice"],
  "things_to_avoid": ["Over-singing", "Songs outside comfortable range", "Overdone choices (overdone_level >= 4)"],
  "prep_timeline_days": 14
}
```

---

## 4B. SONG TRACKING (User-Specific)

Tracks how each song performs for THIS user over time — the learning system.

```json
{
  "user_id": "local-uuid",
  "song_id": "song-pulled",
  "title": "Pulled",
  
  "times_used": 3,
  "auditions_used_in": ["aud-001", "aud-004", "aud-007"],
  
  "results": {
    "callbacks": 2,
    "cast": 1,
    "no_callback": 0,
    "callback_rate": 0.67,
    "cast_rate": 0.33
  },
  
  "average_confidence": 4.0,
  "average_panel_reaction": "positive",
  
  "best_for": ["comedic roles", "belt auditions"],
  "less_effective_for": ["dramatic roles"],
  
  "last_used": "2026-08-15",
  "notes": "Works really well when I commit to the character. Less effective when I play it safe."
}
```

### Song Learning Insights

After enough data (3+ uses), the system generates:

```
"You perform best with comedic belt songs — your callback rate is 67% 
 with uptempo character pieces vs 30% with ballads."

"You've used 'Pulled' in 3 auditions with strong results. Consider 
 refreshing your repertoire — panels notice repeated songs."

"Your highest-confidence songs correlate with your highest callback rates. 
 Trust that preparation = results."
```

---

## 5. CALENDAR EVENT — Opportunity (Admin-Managed)

```json
{
  "id": "opp-newsies-melb-2026",
  "type": "audition",
  "status": "open",
  
  "show": {
    "musical_id": "newsies",
    "title": "Newsies",
    "company": "Melbourne Community Theatre",
    "production_type": "community",
    "director": "Jane Smith",
    "choreographer": "Mark Johnson"
  },
  
  "location": {
    "venue": "Richmond Theatre",
    "city": "Melbourne",
    "state": "Victoria",
    "country": "Australia"
  },
  
  "dates": {
    "audition_dates": ["2026-06-10", "2026-06-12"],
    "callback_date": "2026-06-15",
    "rehearsal_start": "2026-07-01",
    "show_dates": ["2026-09-05", "2026-09-06", "2026-09-12", "2026-09-13"]
  },
  
  "roles_available": [
    {
      "role_id": "newsies-jack-kelly",
      "name": "Jack Kelly",
      "open": true
    },
    {
      "role_id": "newsies-katherine",
      "name": "Katherine",
      "open": true
    },
    {
      "role_id": "newsies-les",
      "name": "Les",
      "open": true
    },
    {
      "role_id": "newsies-ensemble-dance",
      "name": "Ensemble (Dance)",
      "open": true
    }
  ],
  
  "requirements": {
    "age_range": { "min": 10, "max": 30 },
    "dance_audition": true,
    "vocal_audition": true,
    "prepare": "16-bar cut of a musical theatre song + dance shoes (tap if possible)",
    "notes": "Open auditions — no experience required but dance experience preferred"
  },
  
  "source": "admin",
  "source_url": "https://facebook.com/melbournetheatre/post/12345",
  "created_at": "2026-05-01T10:00:00Z",
  "updated_at": "2026-05-15T14:30:00Z",
  
  "tags": ["community", "all-ages", "dance-heavy", "melbourne"]
}
```

---

## 6. CALENDAR EVENT — User Personal

```json
{
  "id": "user-event-001",
  "user_id": "local-uuid",
  "type": "audition",
  "status": "planned",
  
  "linked_opportunity_id": "opp-newsies-melb-2026",
  "target_role_id": "newsies-ensemble-dance",
  "target_role_name": "Ensemble (Dance)",
  
  "date": "2026-06-10",
  "time": "14:00",
  
  "preparation": {
    "song_selected": "song-good-morning-baltimore",
    "song_cut_ready": true,
    "dance_prep_done": false,
    "monologue_ready": false,
    "headshot_updated": true,
    "resume_updated": true,
    "confidence_level": 3,
    "prep_notes": "Need to practice tap combo. Song is ready."
  },
  
  "outcome": {
    "attended": null,
    "callback_received": null,
    "role_offered": null,
    "role_accepted": null,
    "feedback": null,
    "learnings": null
  },
  
  "ai_recommendation": {
    "fit_score": 88,
    "growth_score": 95,
    "recommendation": "strong-match",
    "reasoning": "Your tap experience aligns perfectly with this dance-heavy ensemble. High growth value.",
    "alternative_roles": [
      {
        "role_id": "newsies-les",
        "fit_score": 72,
        "note": "Good acting fit but underutilises your dance strengths"
      }
    ]
  },
  
  "prep_timeline": [
    { "week": -6, "task": "Choose audition song", "done": true },
    { "week": -4, "task": "Practice vocal cut daily", "done": true },
    { "week": -4, "task": "Review tap fundamentals", "done": false },
    { "week": -2, "task": "Run full mock audition", "done": false },
    { "week": -1, "task": "Polish + rest voice", "done": false }
  ],
  
  "created_at": "2026-05-20T10:00:00Z"
}
```

---

## 7. AUDITION LOG (Post-Audition Record)

```json
{
  "id": "log-001",
  "user_id": "local-uuid",
  "linked_event_id": "user-event-001",
  
  "show": "Newsies",
  "company": "Melbourne Community Theatre",
  "date": "2026-06-10",
  
  "role_targeted": "Ensemble (Dance)",
  "role_received": "Ensemble (Dance)",
  "outcome": "cast",
  
  "songs_performed": [
    {
      "song_id": "song-good-morning-baltimore",
      "title": "Good Morning Baltimore",
      "felt_good": true,
      "panel_reaction": "positive",
      "notes": "Panel smiled, asked me to do it again with more energy"
    }
  ],
  
  "dance_call": {
    "attended": true,
    "felt_strong": true,
    "style_tested": ["tap", "jazz"],
    "notes": "Tap combo was challenging but I nailed it. Jazz was okay."
  },
  
  "acting_component": {
    "attended": false,
    "notes": "No separate acting call for ensemble"
  },
  
  "callback": true,
  "callback_notes": "Called back for dance ensemble specifically",
  
  "feedback_received": "Director said tap was strongest in the group",
  
  "self_reflection": {
    "performance_score": 4,
    "performance_label": "strong",
    
    "confidence_before": 3,
    "confidence_after": 4,
    
    "what_went_well": ["dance", "energy", "confidence", "preparation"],
    "what_to_improve": ["vocal_control", "jazz_technique", "acting_in_dance"],
    
    "overall_feeling": "great",
    "role_difficulty_felt": "just_right",
    "would_do_again": true,
    "notes": "Felt really strong in the tap section. Jazz was my weakest moment but I recovered well."
  },
  
  "tags": ["success", "dance-strength", "ensemble"],
  "created_at": "2026-06-10T18:00:00Z"
}
```

### Self-Reflection Score System

The self-reflection system is a core feedback loop that makes the matching engine smarter over time. It captures honest self-assessment after every role or audition.

#### Performance Score Scale (1–5)

| Score | Label | Meaning | Description |
|-------|-------|---------|-------------|
| 5 | 🔥 Exceptional | Exceeded expectations | "I smashed it — loads of compliments, nailed every moment" |
| 4 | 💪 Strong | Very solid performance | "Really solid work, felt confident, minor areas to improve" |
| 3 | 👍 Good | Did the role well | "Decent job, nothing went wrong but nothing exceptional" |
| 2 | ⚠️ Developing | Some gaps / inconsistencies | "Could have prepared more, some moments felt shaky" |
| 1 | 🧱 Needs Work | Role was too big or underprepared | "Overwhelmed, underprepared, or the role was beyond my current level" |

#### What Went Well / What to Improve Options

**What went well** (multi-select):
- `vocals` — Singing was strong
- `dance` — Dance/movement was a highlight
- `acting` — Character work was convincing
- `energy` — Brought great energy to the performance
- `confidence` — Felt confident on stage
- `preparation` — Was well-prepared
- `stamina` — Maintained quality throughout
- `audience_connection` — Connected well with the audience
- `teamwork` — Worked well with the cast
- `improvisation` — Handled unexpected moments well

**What to improve** (multi-select):
- `vocal_control` — Pitch, tone, or breath support needs work
- `vocal_stamina` — Voice tired during the run
- `dance_precision` — Choreography execution needs polishing
- `jazz_technique` — Jazz-specific technique needs work
- `tap_technique` — Tap-specific technique needs work
- `acting_depth` — Character portrayal could be deeper
- `acting_in_dance` — Maintaining character while dancing
- `nerves` — Anxiety affected performance
- `preparation` — Didn't prepare enough
- `stamina` — Physical endurance was an issue
- `memorisation` — Lines or choreography wasn't fully memorised
- `projection` — Needed more vocal projection

#### Role Difficulty Felt

| Value | Meaning |
|-------|---------|
| `too_easy` | "I could have taken on more" |
| `just_right` | "Challenging but I handled it" |
| `slightly_hard` | "Pushed me — good growth" |
| `too_hard` | "I was overwhelmed — role was too big" |

#### How This Feeds the Algorithm

```
experience_quality = weighted_average(all_self_reflection_scores)

// Recent performances weighted higher
weight = 1.0 for last 2 roles
weight = 0.7 for roles 3-5
weight = 0.5 for roles 6+

// Adjusted fit score boost/reduction
adjusted_fit = fit_score × (0.8 + (experience_quality / 25))
// Score 5 → ×1.0 boost, Score 3 → ×0.92, Score 1 → ×0.84

// Pattern detection triggers
IF average(last_3_performance_scores) <= 2.5 AND role_difficulty_felt == "too_hard":
  → "overreaching" pattern detected
  → Recommend intermediate roles

IF average(performance_scores WHERE dance_level >= 4) >= 4:
  → "dance strength zone" detected
  → "Your strongest performances come from dance-heavy roles"

IF confidence_before consistently < confidence_after:
  → "confidence grows with experience" pattern
  → "You perform better than you expect — trust your preparation"

IF confidence_before consistently > performance_score:
  → "confidence gap" detected
  → "Focus on preparation depth to match your confidence level"
```
```

---

## 8. RESUME DATA MODEL

```json
{
  "id": "resume-001",
  "user_id": "local-uuid",
  "version_name": "General",
  "is_default": true,
  "template": "classic-theatre",
  "last_exported": "2026-06-01T10:00:00Z",
  
  "header": {
    "name": "Penelope Smith",
    "voice_type": "Mezzo-Soprano (Belt)",
    "age_range": "14–18",
    "height": "165cm",
    "location": "Melbourne, VIC",
    "email": "parent.email@example.com",
    "phone": null,
    "headshot_url": "/local/headshots/penelope.jpg",
    "website": null
  },
  
  "credits": [
    {
      "production": "Newsies",
      "role": "Ensemble (Dance Focus)",
      "company": "Melbourne Community Theatre",
      "year": 2026,
      "director": "Jane Smith",
      "highlight": true
    },
    {
      "production": "Oliver!",
      "role": "Ensemble",
      "company": "Melbourne Youth Theatre",
      "year": 2025,
      "director": "Mark Johnson",
      "highlight": false
    }
  ],
  
  "training": [
    {
      "discipline": "Tap Dance",
      "institution": "Melbourne Dance Academy",
      "teacher": null,
      "years": "2023–present",
      "level": "Intermediate-Advanced"
    },
    {
      "discipline": "Musical Theatre Voice",
      "institution": "Private Lessons",
      "teacher": "Sarah Williams",
      "years": "2025–present",
      "level": "Beginner-Intermediate"
    },
    {
      "discipline": "Acting",
      "institution": "School Drama Program",
      "teacher": null,
      "years": "2024–present",
      "level": "Intermediate"
    }
  ],
  
  "skills": {
    "dance": ["Tap (Advanced)", "Jazz (Intermediate)", "Ballet (Basic)"],
    "vocal": ["Belt", "Harmony", "Musical Theatre Style"],
    "acting": ["Comedic Characters", "Physical Theatre"],
    "accents": ["Australian (native)", "American (basic)"],
    "other": ["Piano (basic)", "Gymnastics (basic)"]
  },
  
  "special_notes": "Available for rehearsals weekday evenings and weekends.",
  
  "audition_songs": [
    {
      "title": "Good Morning Baltimore",
      "musical": "Hairspray",
      "type": "uptempo"
    },
    {
      "title": "Pulled",
      "musical": "The Addams Family",
      "type": "comedic"
    }
  ],
  
  "resume_strength_score": 68,
  "ai_suggestions": [
    "Consider adding more training to strengthen vocal section",
    "Your dance experience is your strongest asset — ensure it's prominently listed",
    "As you gain more credits, move training below credits section"
  ]
}
```

---

## 9. AI INTERACTION LOG

```json
{
  "id": "ai-001",
  "user_id": "local-uuid",
  "timestamp": "2026-06-05T14:30:00Z",
  "tier": "free",
  "model_used": "llama-3-8b",
  
  "context": {
    "active_page": "role-detail",
    "musical": "newsies",
    "role": "les",
    "user_profile_snapshot": { "...summary..." }
  },
  
  "prompt": "How should I prepare for the Les audition in Newsies?",
  
  "response": "Based on your profile, here's how to prepare for Les in Newsies...",
  
  "tokens_used": 450,
  "daily_count": 3,
  "daily_limit": 10
}
```

---

## 10. STANDARDISED VALUE TYPES

### Voice Types (Enumeration)
```
soprano
mezzo-soprano
alto
countertenor
tenor
baritone
bass-baritone
bass
```

### Dance Styles (Enumeration)
```
tap
jazz
ballet
contemporary
hip-hop
acrobatics
ballroom
swing
folk
character
lyrical
```

### Musical Genres (Enumeration)
```
classic-musical
golden-age
modern
contemporary
rock-musical
jukebox
operetta
revue
drama
comedy
dance-heavy
ensemble-driven
intimate
spectacle
```

### Energy Types (Enumeration)
```
high-energy
comedic
dramatic
romantic
villainous
quirky
intense
playful
mysterious
stoic
youthful
authoritative
vulnerable
powerful
```

### Experience Levels
```
beginner (0–1 shows)
beginner-intermediate (2–3 shows)
intermediate (4–8 shows)
intermediate-advanced (9–15 shows)
advanced (16+ shows)
semi-professional
professional
```

### Skill Levels (1–5 Scale)
```
1 = No experience / Not applicable
2 = Basic / Beginner
3 = Intermediate / Capable
4 = Strong / Advanced
5 = Exceptional / Professional-level
```

### Note Names (for vocal range)
```
Standard notation: C2 through C7
Middle C = C4
Concert A = A4
Example ranges:
  Bass: E2–E4
  Baritone: A2–A5
  Tenor: C3–C6
  Alto: F3–F5
  Mezzo: A3–A6
  Soprano: C4–C6+
```

---

*This data model document defines every entity in the iHeartTheatre system.*
*All development, AI prompting, and feature design should reference these models.*