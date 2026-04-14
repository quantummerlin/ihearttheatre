# 🎭 Melbourne/Victoria Shows Calendar — 2026

Data extracted from Robert's Facebook post listing all upcoming shows in Melbourne/Victoria.

---

## TECHNICAL NOTES ON CALENDAR FEATURES

### 1. Region Filtering (Clearable for non-Melbourne users)
- Calendar data tagged with `region: "melbourne-victoria"`
- Users can toggle: "Show Melbourne/Victoria listings" ON/OFF
- Stored as a preference in localStorage
- When OFF, only user's personal events show
- Future: add other regions as data becomes available

### 2. Phone Calendar Integration (from static/local)
**YES — this is very achievable from a static PWA. Here's how:**

#### Option A: `.ics` File Download (Simplest, works everywhere)
- Generate an `.ics` (iCalendar) file for any event
- User taps "Add to Calendar" → downloads `.ics` file
- iOS/Android/Desktop all natively open `.ics` files
- Opens the phone's default calendar app with event pre-filled
- User confirms → event added to their phone calendar
- **No backend needed — generated client-side with JavaScript**

#### Option B: Calendar URL Schemes (One-tap on mobile)
- Google Calendar: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...`
- Apple Calendar: `webcal://` scheme or `.ics` download
- Outlook: Similar URL scheme

#### Option C: "Add to Calendar" Button with Options
User taps button → dropdown:
- 📱 Add to Apple Calendar (.ics download)
- 📅 Add to Google Calendar (URL opens Google Calendar)
- 📋 Add to Outlook (.ics download)
- 📥 Download .ics file

**Recommended: Option C — gives users choice. All generated client-side from static data.**

#### Implementation (simple):
```javascript
function generateICS(event) {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(event.date_start)}
DTEND:${formatDate(event.date_end)}
SUMMARY:${event.show_title}
LOCATION:${event.venue}, ${event.location}
DESCRIPTION:${event.company} — ${event.show_title}\\nMore info: ihearttheatre.com
END:VEVENT
END:VCALENDAR`;
  
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  // Trigger download — phone opens native calendar
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.show_title}.ics`;
  a.click();
}
```

### 3. Editability
- Admin (you) can edit via simple admin panel
- Users can add PERSONAL events to their local calendar
- Users CANNOT edit the public listings (read-only for them)
- Users CAN: add notes, set target role, mark "interested"

---

## COMPLETE SHOW LISTINGS — 2026

### FEBRUARY 2026

| # | Dates | Show | Company/Venue | Location |
|---|-------|------|--------------|----------|
| 1 | Feb 7–11+ | Mamma Mia! | National Theatre | St Kilda |
| 2 | Feb 12–21 | Robot Song | Theatre Works | St Kilda |
| 3 | Feb 13–21 | Ride the Cyclone The Musical | PEP Productions, Doncaster Playhouse | Doncaster |
| 4 | Feb 14 | Orphée et Eurydice | Lyster Opera, Platform Arts Geelong | Courthouse Theatre, Geelong |
| 5 | Feb 14–15 | Frozen Jr | Red Door Dance and Theatre Co | Colac |
| 6 | Feb 15 | The Man They Call The Banjo | Armagh House | Toorak |
| 7 | Feb 16–17 | A Winter's Journey | Musica Viva Australia (concert) | — |
| 8 | Feb 21 | Orphée et Eurydice | Lyster Opera | Milawa Hall |
| 9 | Feb 26–Mar 8+ | & Juliet | Ballarat Lyric Theatre | Ballarat |
| 10 | Feb 27–Mar 7+ | Once Upon A One More Time | Doncaster Playhouse | Doncaster |
| 11 | Feb 27–Mar 15+ | The Taming of the Shrew | Melbourne Shakespeare Company | Central Park, Malvern |
| 12 | Feb 28 | The Deplorables | Bluestone Theatre | Kyneton |
| 13 | Feb 28 | Orphée et Eurydice | Lyster Opera, Phee Broadway Theatre | Castlemaine |
| 14 | Feb 28 | La Traviata | CPO, The Home Farm | Bunyip |
| 15 | Feb 28–Mar 9+ | The Arcadians | GSOV, The Knowe | Sassafras |
| 16 | Feb 28–Mar 15+ | Treasure Island | Melbourne Shakespeare Company | Central Park, Malvern |

### MARCH 2026

| # | Dates | Show | Company/Venue | Location |
|---|-------|------|--------------|----------|
| 17 | Mar 6–28 | Cinderella (panto) | Altona Civic Theatre | Altona |
| 18 | Mar 8–9 | The Aristocats Kids | Musicworx | — |
| 19 | Mar 10 | Imagine – The Journey | The Potato Shed | — |
| 20 | Mar 13–15 | Mary Magdalene – The Musical | Kew High School Theatre | Kew East |
| 21 | Mar 13–28 | & Juliet | CentreStage | GAC, Geelong |
| 22 | Mar 14 | Orphée et Eurydice | Lyster Opera | Creswick |
| 23 | Mar 19–28 | Urinetown | Bottled Snail, Gasworks Arts Park | Albert Park |
| 24 | Mar 20–28 | Legally Blonde Jr | Diamond Valley Singers | Warrandyte |
| 25 | Mar 20–29 | The Sound of Music | Nova | — |
| 26 | Mar 21–Apr 4 | Fun Home | Fab Nobs | Bayswater |
| 27 | Mar 22 | The Arcadians | GSOV | Queenscliff Town Hall |
| 28 | Mar 25 | Breaking: The Musical | Riverlinks Westside | Shepparton |
| 29 | Mar 26–Apr 5+ | Evil Dead The Musical | Chapel Off Chapel | — |
| 30 | Mar 28 | Ned Kelly: The Musical | Her Majesty's Theatre | Ballarat |
| 31 | Mar 28 | Orphée et Eurydice | Lyster Opera, Irene Mitchell Studio | South Yarra |

### APRIL 2026

| # | Dates | Show | Company/Venue | Location |
|---|-------|------|--------------|----------|
| 32 | Apr/May | Shrek the Musical | Heathdale Christian College | Werribee |
| 33 | Apr 10–18 | Bonnie & Clyde | Theatre of the Damned | Geelong |
| 34 | Apr 10–19 | Les Misérables | Upstage Theatre Company | Berwick |
| 35 | Apr 14–17 | Diary of A Wimpy Kid: The Musical | Warragul Youth Theatre | Warragul |
| 36 | Apr 16–19 | Frozen Jr | Windmill, Cranbourne Community Theatre | Cranbourne |
| 37 | Apr 17–19 | Oshun | Wyndham Cultural Centre | Werribee |
| 38 | Apr 22–May 2+ | MARA | Theatre Works, St Kilda (schools) | St Kilda |
| 39 | Apr (dates TBC) | Once | AG Theatre, Chapel Off Chapel | — |

### MAY 2026

| # | Dates | Show | Company/Venue | Location |
|---|-------|------|--------------|----------|
| 40 | May (TBC) | The Wizard of Oz | Horsham Arts Council | Horsham |
| 41 | May (TBC) | Company | Williamstown Musical Theatre Company | Williamstown |
| 42 | May 1+ | Sister Act | Footlight Productions | Geelong |
| 43 | May 1–31 | Waitress | Her Majesty's Theatre | Melbourne |
| 44 | May 1–17 | & Juliet | The Forge Theatre | Bairnsdale |
| 45 | May 8–16 | La Traviata | Opera Australia, Regent Theatre | Melbourne |
| 46 | May 9 | AUTO-TUNE (rock opera) | Her Majesty's Theatre | Ballarat |
| 47 | May 9–17 | Matilda Jr | Seymour Performers Workshop | — |
| 48 | May 15–30 | The Hunchback of Notre Dame | CLOC Musical Theatre, The National Theatre | St Kilda |
| 49 | May 9–29 | The Magic Pudding: The Opera | Victorian Opera | Nunawading, Preston & Narre Warren |
| 50 | May 20–30 | Saining Joan | Theatre Works, Explosives Factory | St Kilda |
| 51 | May 21–31 | Frozen | BLOC, Her Majesty's Theatre | Ballarat |
| 52 | May 22–Jun 7+ | Beauty and the Beast | Geelong Lyric Theatre | GAC, Geelong |
| 53 | May 29–30 | The Magic Pudding: The Opera | Bunjil Place | — |
| 54 | May 29–Jun 7+ | 42nd Street | Babirra, The Round | Nunawading |

### JUNE 2026

| # | Dates | Show | Company/Venue | Location |
|---|-------|------|--------------|----------|
| 55 | Jun (TBC) | & Juliet | Windmill, Bunjil Place Theatre | — |
| 56 | Jun 3–13 | Katzenmusik | Theatre Works, Explosives Factory | St Kilda |
| 57 | Jun 12–21 | Beauty and the Beast | MDMS, Karralyka | Ringwood |
| 58 | Jun 13–22 | Mary Poppins | Sleeping Star Productions, Karralyka | Ringwood |
| 59 | Jun 18–Jul 11+ | Pride and Prejudice* (*sort of) | Athenaeum | Melbourne |
| 60 | Jun 20–27 | Seussical | GSODA | GAC, Geelong |
| 61 | Jun 21 | Sea Wolves Howl | Berninneit | Cowes |
| 62 | Jun 27–28 | Bluey's Big Play The Stage Show | — | Wangaratta |
| 63 | Jun 30 | Spike the Echidna | Yan Yean Theatre | Yan Yean |
| 64 | Jun 30–Jul 4+ | The Coronation of Poppea | Palais Theatre | Melbourne |

### JULY 2026

| # | Dates | Show | Company/Venue | Location |
|---|-------|------|--------------|----------|
| 65 | Jul–Aug | Jersey Boys | PLOS | FAC, Frankston |
| 66 | Jul 1–12 | Bluey's Big Play The Stage Show | Comedy Theatre | Melbourne |
| 67 | Jul 3–11 | The Lightning Thief | Peoples Playhouse, Cranbourne Community Theatre | Cranbourne |
| 68 | Jul 3–12 | Matilda Jr | Fab Nobs | Bayswater |
| 69 | Jul 8 | Robot Song | BLOC | Ballarat |
| 70 | Jul 10–12 | Patience | GSOV, Alexander Theatre | Clayton |
| 71 | Jul 14–Sep 9+ | Pretty Woman | Regent Theatre | Melbourne |
| 72 | Jul 15–16 | Bluey's Big Play The Stage Show | — | Ballarat |
| 73 | Jul 18–19 | Bluey's Big Play The Stage Show | — | Bendigo |
| 74 | Jul 22–23 | Bluey's Big Play The Stage Show | — | GAC, Geelong |
| 75 | Jul 22–Aug 8+ | When We Dead Awaken (We Have Never Lived) | Doppelgangster, Explosives Factory | St Kilda |
| 76 | Jul 23 | Don Giovanni | Opera Australia, The Round | Nunawading |
| 77 | Jul 24–Oct 23+ | SIX The Musical | Comedy Theatre | Melbourne |

### AUGUST 2026

| # | Dates | Show | Company/Venue | Location |
|---|-------|------|--------------|----------|
| 78 | Aug (TBC) | Newsies Jr | Williamstown Musical Theatre Company | Williamstown |
| 79 | Aug 1 | Don Giovanni | Opera Australia, Ulumbarra Theatre | Bendigo |
| 80 | Aug 1–2 | Bluey's Big Play The Stage Show | — | Drum, Dandenong |
| 81 | Aug 5 | Bluey's Big Play The Stage Show | — | Horsham |
| 82 | Aug 5–Sep 27+ | A Beautiful Noise: The Neil Diamond Musical | Princess Theatre | Melbourne |
| 83 | Aug 14 | The Deplorables | Portland Arts Centre | Portland |
| 84 | Aug 14–30 | After-Light: The Dramatic Prog-Rock Opera | The Mount Players | Macedon |
| 85 | Aug 15 | The Deplorables | Lighthouse Studio | Warrnambool |
| 86 | Aug 19–20 | Bluey's Big Play The Stage Show | — | Mildura |
| 87 | Aug 19–29 | The Deplorables | Theatre Works | St Kilda |
| 88 | Aug 20–22 | Frozen | Horsham College | Horsham |
| 89 | Aug 25 | Robot Song | — | Bendigo |
| 90 | Aug 28–30 | Oliver Jr | Bellarine Jongleurs, The Jetty Shed | Drysdale/Geelong |
| 91 | Aug (TBC) | Red Door Dance and Theatre Co Senior Musical | — | Colac |

### SEPTEMBER 2026

| # | Dates | Show | Company/Venue | Location |
|---|-------|------|--------------|----------|
| 92 | Sep (TBC) | Ride the Cyclone The Musical | Theatre of the Damned | Geelong |
| 93 | Sep (TBC) | Red Door Dance and Theatre Co Musical | — | Birregurra |
| 94 | Sep 4–5 | Into the Woods | BLOC | Ballarat |
| 95 | Sep 17 | Room on the Broom | — | Bendigo |
| 96 | Sep 22–26 | The Eternally Hopeful | Explosives Factory | St Kilda |
| 97 | Sep 29–Oct 1+ | The Turn of the Screw | Palais Theatre | Melbourne |

### OCTOBER 2026

| # | Dates | Show | Company/Venue | Location |
|---|-------|------|--------------|----------|
| 98 | Oct 7–10 | The Spare Room | Palais Theatre | Melbourne |
| 99 | Oct 8–24 | Young Frankenstein | Theatre Works | St Kilda |
| 100 | Oct 14 | Sea Wolves Howl | Cardinia Cultural Centre | Pakenham |
| 101 | Oct 23–Nov 7+ | Dirty Rotten Scoundrels | Malvern Theatre Company | Malvern |
| 102 | Oct 25 | Sea Wolves Howl | Karralyka | Ringwood |

### NOVEMBER 2026

| # | Dates | Show | Company/Venue | Location |
|---|-------|------|--------------|----------|
| 103 | Nov (TBC) | & Juliet | Williamstown Musical Theatre Company | Williamstown |
| 104 | Nov 7–18 | La Bohème | Opera Australia, Regent Theatre | Melbourne |
| 105 | Nov 19–22 | A G&S Christmas Carol | GSOV | Malvern |
| 106 | Nov 21–28 | Watershed The Death of Dr Duncan | Opera Australia, Playhouse | Melbourne |

---

## PRODUCTION COMPANIES DIRECTORY

| Abbreviation | Full Name | Location |
|-------------|-----------|----------|
| ARTS | Ararat Regional Theatre Society | Ararat |
| BATS | Broadford Amateur Theatrical Society | Broadford |
| BLOC | Ballarat Light Opera Company | Ballarat |
| CLOC | CLOC Musical Theatre | — |
| DVS | Diamond Valley Singers | Warrandyte |
| EMTC | Echuca Moama Theatre Company | Echuca |
| Fab Nobs | Fab Nobs | Bayswater |
| GAC | Geelong Arts Centre | Geelong |
| GSODA | Geelong Society of Operatic and Dramatic Arts | Geelong |
| GSOV | Gilbert & Sullivan Opera Victoria | Various |
| Holiday Actors | Holiday Actors | Warrnambool |
| KBT | KBT Community Theatre | Northern suburbs |
| MDMS | Mountain District Music Society | — |
| MTC | Melbourne Theatre Company | Melbourne |
| MTS | Masquerade Talent Studios | — |
| MUST | Monash University Student Theatre | — |
| MYP | Masquerade Youth Productions | — |
| Out of the Wings | Out of the Wings | Knox Community Arts Centre |
| PEP | PEP Productions | Eastern Suburbs |
| PLOS | Peninsula Light Opera Society | Frankston |
| Phoenix | Phoenix Theatre Company | East Doncaster |
| SMaD | Old Scotch Music and Drama Club | — |
| SPW | Seymour Performers Workshop | — |
| STAG | Shepparton Theatre Arts Group | Shepparton |
| Stage Left | Stage Left | Inner East to Rowville |
| The Motley Bauhaus | The Motley Bauhaus | Carlton |
| UMMTA | University of Melbourne Music Theatre Association | — |
| UTC | Upstage Theatre Company | — |
| WCPA | Wendouree Centre for Performing Arts | Wendouree |
| WGAC | West Gippsland Arts Centre | — |
| WTC | Windmill Theatre Company | Rowville & Narre Warren |

*Thanks to Abbi Haynes for help with the Production Companies list.*

---

## DATA NOTES

- Dates marked with "+" indicate the end date extends into the next month (e.g., "Feb 26–8+1" means Feb 26–Mar 8)
- Dates marked "TBC" or "xxx" were not fully specified in the source
- Some venues may have slight name variations from the original post
- This data was extracted from Robert's Facebook post (Melbourne theatre listings)
- Total shows listed: **106**
- Date range: **February 2026 – November 2026**

---