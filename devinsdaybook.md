# Devin's Daybook — Europe Travel Journal PWA
## Product Requirements Document

---

## Overview

A Progressive Web App (installable on iOS via Safari "Add to Home Screen") that serves as a personal travel journal for a 6-week Europe trip. Dark cinematic aesthetic — midnight navy backgrounds, warm amber/gold accents, Playfair Display italic headings.

---

## Tech Stack

- **React + Vite** (fast, PWA-ready)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **LocalStorage** for entry records
- **IndexedDB** (via `idb` npm package) for photo Blob storage
- **React Router** for navigation
- **vite-plugin-pwa** for PWA/service worker

**Google Fonts:** `Playfair Display` (display/italic), `Cormorant Garamond` (body), `DM Mono` (labels/metadata)

---

## Color Palette

```css
--bg-page:        #f5f8f7   /* light mint-grey page background */
--bg-card:        #ffffff   /* white card surfaces */
--bg-sidebar:     #1a3a35   /* deep forest green sidebar */
--bg-header:      #1a3a35   /* card image header background */
--bg-tag:         #f0fbf8   /* tag pill fill */

--teal-primary:   #1a6a58   /* primary accent — location labels, buttons */
--teal-bright:    #4dc4a8   /* bright accent — active indicators, progress */
--teal-muted:     #7ec4b0   /* sidebar secondary text */
--teal-dim:       #3a7060   /* sidebar section labels */
--teal-dark:      #2a5a50   /* sidebar borders */

--border-card:    #d0e8e2   /* card borders */
--border-tag:     #c0e0d8   /* tag pill borders */

--text-primary:   #0f2520   /* near-black body text */
--text-secondary: #4a7068   /* muted body / preview text */
--text-meta:      #a0c8c0   /* day numbers, timestamps */
--text-sidebar:   #e8f4f0   /* sidebar primary text (on dark bg) */
```

---

## Trip Itinerary

**Start:** May 27, 2025 · **End:** July 6, 2025 · **Duration:** 41 days

| City | Country | Arrival | Departure | Day Trips |
|---|---|---|---|---|
| Venice | IT | May 27 | May 29 | — |
| Florence | IT | May 29 | June 1 | — |
| Rome | IT | June 1 | June 3 | — |
| Amalfi | IT | June 3 | June 5 | — |
| Nice | FR | June 5 | June 9 | Eze, Monaco |
| Lyon | FR | June 9 | June 12 | Geneva |
| Paris | FR | June 12 | June 17 | — |
| Brussels | BE | June 17 | June 20 | Antwerp |
| Amsterdam | NL | June 20 | June 25 | Rotterdam |
| Berlin | DE | June 25 | June 30 | Hamburg |
| Munich | DE | June 30 | July 6 | — |

---

## Pages / Views

### 1. Journal Feed (Home)

- **"This day in your trip" banner** at the very top — a contextual strip that changes based on the current date:
  - Default: "Day 14 · Paris"
  - First day of trip: "Day 1 · The adventure begins"
  - First day in a new city: "Welcome to Amsterdam"
  - Last day in a city: "Last day in Paris"
  - Halfway point (day 21): "Halfway there · 21 days in"
  - Last day of trip: "Day 41 · Last day"
  - After trip ends: hidden
- Top bar: app title "Devin's Daybook" in Playfair italic + current date + "+ New Entry" button
- City filter pills appear above the card grid — one pill per city, but **only once at least one entry exists for that city**. Pills appear in chronological order of first entry. Starts empty on day 1 and builds up as the trip progresses.
- Each entry card contains:
  - Colored header (CSS gradient + subtle SVG city illustration — Eiffel Tower, Colosseum, canal curves, etc.)
  - Location stamp (top-right, monospace border box)
  - City · Day number · Date (metadata row)
  - Title in Playfair italic
  - 2-line preview pulled from the first section that has content
  - Small icons indicating which sections have content (Activities, Food & Drinks, People I Met, Other Notes)

### 2. Entry Detail View

- Full-screen slide-up animation (Framer Motion)
- Large city illustration header (full bleed, dark gradient overlay)
- Entry metadata: city, day, date
- Four sections displayed in order — only sections with content are shown: Activities, Food & Drinks, People I Met, Other Notes
- Each section shows its heading, body text in Cormorant Garamond 18px with generous line height, and a photo grid of up to 3 images
- Back arrow to feed

### 3. New Entry Composer

- Slide-up sheet (mobile-native feel)
- Fields:
  - City (dropdown pre-populated with: Venice, Florence, Rome, Amalfi, Nice, Lyon, Paris, Brussels, Amsterdam, Berlin, Munich — plus Eze, Monaco, Geneva, Antwerp, Rotterdam, Hamburg as day trip options — plus a "+ Add city" option at the bottom for freeform text entry if plans change)
  - Date (auto-fills today)
  - Title (large Playfair italic input)
- Four collapsible sections below the title, each optional. Collapsed by default, tapping the header expands them:
  - **Activities** — freeform textarea + up to 3 photos
  - **Food & Drinks** — freeform textarea + up to 3 photos
  - **People I Met** — freeform textarea + up to 3 photos
  - **Other Notes** — freeform textarea + up to 3 photos (this is the general freeform writing area)
- Each section header shows a subtle indicator when it has content, so you can see at a glance which sections are filled
- Save button at the bottom → returns to feed with new card animated in

### 4. Map View

- Static SVG illustration of Europe
- Teal dots with pulse animation at each of the 11 main cities, hardcoded with exact coordinates
- Dot size or opacity scales with number of entries written in that city
- Tap dot → shows city name, dates stayed, entry count, and thumbnail of latest entry
- Day trip locations (Eze, Monaco, Geneva, Antwerp, Rotterdam, Hamburg) shown as smaller secondary dots
- No map API — purely a beautiful static SVG

### 5. Photo Roll

- Grid of all photos across all entries and all sections
- Tap to expand in a full-screen lightbox with the entry title, date, and section name overlaid
- Dark lightbox modal

### 6. City Summaries

- Accessible from the sidebar — lists all cities that have at least one entry
- Each city summary page shows:
  - City name + country, dates visited, total days, total entries written
  - All photos from that city in a chronological grid
  - All entries from that city listed in order with title and date
  - **Postcard generator** at the bottom — a "Create Postcard" button

### 7. Postcard Generator

- Triggered from a city's summary page
- Generates a single PNG image using the Canvas API, styled as a vintage postcard:
  - City SVG illustration (full bleed, teal-toned)
  - "Devin sends you greetings from [City]" in large Playfair Display italic
  - Country · dates visited (e.g. "France · June 12–17") in DM Mono
  - A one-line caption the user writes themselves before generating
- Tapping "Share" invokes the **iOS Web Share API** (`navigator.share`) with the PNG as a file attachment — opens the native iOS share sheet (iMessage, AirDrop, Instagram, etc.)
- Also offers a "Save to Camera Roll" fallback via a download link

### 8. Sidebar / Drawer

- Slide-in from left on mobile
- App title + subtitle ("Devin's Daybook · Europe 2025")
- Navigation links: All Entries, Map View, Photo Roll, City Summaries
- City filter list (only shows cities that have at least one entry — populates as the trip progresses)
- Trip progress bar: days elapsed out of 41 (May 27 – July 6), total entry count

---

## Data Model

Entry records are stored as a JSON array in `localStorage['journal_entries']`. Photos are stored separately in IndexedDB (see Photo Storage section).

```js
// Entry (localStorage)
{
  id: uuid,
  city: "Paris",
  country: "FR",
  date: "2025-06-14",
  // dayNumber is derived: differenceInDays(date, "2025-05-27") + 1
  title: "The city lit up like a secret being told",
  sections: {
    activities:  { text: "...", photoIds: [] },   // up to 3 photos
    food:        { text: "...", photoIds: [] },   // up to 3 photos
    people:      { text: "...", photoIds: [] },   // up to 3 photos
    other:       { text: "...", photoIds: [] },   // up to 3 photos
  },
  // max 12 photos per entry total (3 per section × 4 sections)
  createdAt: timestamp
}

// Photo (IndexedDB)
{
  id: uuid,
  entryId: uuid,      // reference back to the entry
  blob: Blob,         // compressed JPEG, ~200–400KB
  createdAt: timestamp
}
```

## Photo Storage

Photos are stored as compressed Blobs in **IndexedDB** (not localStorage). This keeps the app fully offline and self-contained with no backend required.

**On ingest (when a photo is attached to an entry):**
- Resize to a maximum of 1200px on the longest side
- Compress to 70% JPEG quality
- Store as a Blob in IndexedDB, keyed by a generated photo ID
- Expected size per photo: ~200–400KB (down from 3–8MB raw iPhone photo)

**Limits:**
- Maximum **3 photos per section**, 4 sections = up to 12 photos per entry
- If the user tries to add a 4th photo to a section, show a gentle inline message: "3 photo limit reached for this section"

**Data relationship:**
- Each entry stores an array of photo IDs (not the Blobs themselves)
- Photos are fetched from IndexedDB by ID when an entry is opened
- Deleting an entry also deletes its associated photo Blobs from IndexedDB

**Implementation:**
- Use the `idb` npm package for a clean IndexedDB wrapper
- Use the browser Canvas API for client-side resize and compression (no extra library needed)
- Photo object store schema: `{ id: uuid, entryId: uuid, blob: Blob, createdAt: timestamp }`

---

## PWA Configuration

- `manifest.json`:
  - `name`: "Devin's Daybook"
  - `short_name`: "Daybook"
  - `theme_color`: `#1a3a35`
  - `background_color`: `#f5f8f7`
  - `display`: `standalone`
  - Icons at 192×192 and 512×512 (white italic "D" on deep teal `#1a3a35` background)
- Service worker via `vite-plugin-pwa`: cache-first strategy for full offline support
- Add to `index.html`: `<meta name="apple-mobile-web-app-capable" content="yes">`

---

## Animations (Framer Motion)

| Trigger | Animation |
|---|---|
| Feed load | Entry cards stagger fade-up |
| New entry | Sheet slides up from bottom |
| Entry detail | Full-screen slide in from right |
| Map view | City dots pulse with amber glow rings |
| Sidebar | Slides in from left with dark overlay |

---

## Seed Data

Include 3 sample entries on first load so the app looks great out of the box:

```js
[
  {
    id: "seed-1",
    city: "Paris",
    country: "FR",
    date: "2025-06-14",
    title: "The city lit up like a secret being told",
    sections: {
      activities: { text: "Climbed to Sacré-Cœur in the dark for Bastille Day. Shoulder to shoulder with strangers who sang in French. I didn't understand a word. I understood everything.", photoIds: [] },
      food:       { text: "", photoIds: [] },
      people:     { text: "", photoIds: [] },
      other:      { text: "", photoIds: [] }
    },
    createdAt: 1749859200000
  },
  {
    id: "seed-2",
    city: "Rome",
    country: "IT",
    date: "2025-06-02",
    title: "Gelato, ruins & a three-hour lunch",
    sections: {
      activities: { text: "Wandered through the Forum in the morning heat.", photoIds: [] },
      food:       { text: "Ordered by pointing. Ate in the shade of something two thousand years old. There is no better way to spend an afternoon.", photoIds: [] },
      people:     { text: "", photoIds: [] },
      other:      { text: "", photoIds: [] }
    },
    createdAt: 1748822400000
  },
  {
    id: "seed-3",
    city: "Amsterdam",
    country: "NL",
    date: "2025-06-22",
    title: "Rain on the canal, a borrowed umbrella",
    sections: {
      activities: { text: "Cycled along the Prinsengracht in the drizzle.", photoIds: [] },
      food:       { text: "", photoIds: [] },
      people:     { text: "", photoIds: [] },
      other:      { text: "The kind of grey that makes everything look like a painting you'd hang in a house you'll never own.", photoIds: [] }
    },
    createdAt: 1750550400000
  }
]
```

---

## Development Sprints

Each sprint is a self-contained Claude Code session. Start each session by sharing the PRD and telling Claude which sprint you're working on. End each sprint by running `npm run build` and confirming zero errors before moving on.

---

### Sprint 1 — Project Foundation
*Goal: working shell, data layer, routing, design system*

- Scaffold project: `npm create vite@latest devins-daybook -- --template react`
- Install all dependencies: `tailwindcss`, `framer-motion`, `react-router-dom`, `vite-plugin-pwa`, `uuid`, `idb`, `date-fns`
- Set up PWA manifest and `vite-plugin-pwa` with cache-first offline strategy
- Add iOS meta tags to `index.html`: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`
- Define full color palette as CSS variables
- Import Google Fonts: Playfair Display, Cormorant Garamond, DM Mono
- Build data layer:
  - localStorage CRUD for entries
  - IndexedDB (via `idb`) for photo Blob storage
  - Client-side Canvas compression (max 1200px, 70% JPEG quality)
  - `dayNumber` derivation helper from trip start date (May 27, 2025)
  - Trip itinerary constants (all 11 cities + day trips with coordinates and date ranges)
- Set up React Router with placeholder routes for all 8 views
- Seed 3 example entries on first load if localStorage is empty

---

### Sprint 2 — Journal Feed + Entry Detail
*Goal: the core read experience feels polished end to end*

- Build the "This day in your trip" contextual banner with all milestone states
- Build the Journal Feed:
  - City filter pills (only cities with entries)
  - Entry cards with city illustration headers, metadata, section content preview, section icons
  - Stagger fade-up animation on load
- Build Entry Detail view:
  - Full-screen slide-in from right
  - City illustration header (full bleed)
  - Four sections — only renders sections with content
  - Photo grid per section (tappable, opens lightbox)
  - Back navigation
- Build the dark lightbox modal for photos

---

### Sprint 3 — New Entry Composer
*Goal: writing and saving an entry works completely*

- Build the slide-up composer sheet
- City dropdown with pre-populated list + "+ Add city" freeform option
- Date picker auto-filled to today
- Playfair italic title input
- Four collapsible sections (Activities, Food & Drinks, People I Met, Other Notes):
  - Each with freeform textarea (autogrow)
  - Each with photo upload (up to 3, with Canvas compression pipeline)
  - Filled indicator on section header when content exists
- Save → animate new card into feed
- Edit existing entry (same composer, pre-filled)
- Delete entry (with confirmation) — also purges photo Blobs from IndexedDB

---

### Sprint 4 — Map View + Photo Roll
*Goal: the two visual browsing views*

- Build static SVG Europe map:
  - All 11 main cities hardcoded with exact coordinates and pulsing teal dots
  - Dot opacity/size scales with entry count per city
  - 6 day trip locations as smaller secondary dots
  - Tap dot → city popover (name, dates, entry count, latest entry thumbnail)
- Build Photo Roll:
  - Chronological grid of all photos across all entries and sections
  - Lightbox tap with entry title, date, and section name overlay

---

### Sprint 5 — City Summaries + Postcard Generator
*Goal: the city departure ritual end to end*

- Build City Summaries page:
  - Lists all cities with at least one entry
  - Each city page: name, country, dates visited, days count, entry count
  - Chronological photo grid for that city
  - All entries from that city listed with title and date
  - "Create Postcard" button at the bottom
- Build Postcard Generator:
  - Canvas-rendered PNG: city SVG illustration, "Devin sends you greetings from [City]", country + dates in DM Mono, one-line user-written caption
  - Teal color treatment consistent with app palette
  - "Share" button → `navigator.share` with PNG file → iOS native share sheet
  - "Save to Camera Roll" fallback via download link

---

### Sprint 6 — Test Data + Reset Tools
*Goal: be able to fully test the app before the trip, then wipe it clean*

- Build a hidden **Dev Tools screen** (accessible via a long-press on the app title or a secret tap sequence — not visible in normal navigation)
- Dev Tools contains:
  - **"Load test data"** — populates the app with a full set of realistic fake entries spread across all 11 cities, multiple sections filled per entry, varied dates across the 41-day trip range. Enough data to test every view, filter, and feature
  - **"Clear all data"** — wipes all entries from localStorage AND all photo Blobs from IndexedDB, returning the app to a clean first-launch state. Requires a confirmation tap: "This will delete everything. Are you sure?"
  - **"Clear test data only"** — removes only entries flagged as test data (add a `isTestData: true` field to seed/test entries), leaving any real entries untouched
- Test data set should include:
  - At least 2 entries per city across all 11 cities
  - Entries with all four sections filled
  - Entries with only one or two sections filled
  - A mix of entries with and without photos (use placeholder colored blocks if real photos aren't practical)
  - Entries that trigger all banner milestone states (first day, last day in city, halfway point, etc.)

---

### Sprint 7 — Mobile Optimization
*Goal: the app feels completely native on iPhone*

- Audit and fix all touch targets — minimum 44×44pt per Apple HIG
- Ensure smooth 60fps scrolling on the feed — add `will-change` and avoid layout thrashing
- Fix iOS Safari quirks:
  - 100vh viewport height bug (use `dvh` units or JS fix)
  - Rubber-band scroll containment on sheets and modals
  - Safe area insets (`env(safe-area-inset-*)`) for notch and home indicator
  - Prevent double-tap zoom on buttons and inputs
- Keyboard behavior:
  - Composer sheet scrolls up correctly when keyboard appears
  - Inputs never hidden behind keyboard
- PWA polish:
  - Splash screen on launch
  - Status bar color matches app header
  - Verify "Add to Home Screen" flow works correctly in Safari
- Test all views at iPhone SE size (375px) and iPhone Pro Max size (430px)
- Framer Motion: reduce or disable animations if `prefers-reduced-motion` is set
- Run Lighthouse PWA audit and resolve any failing checks

---

### Sprint 8 — Polish + Pre-Trip QA
*Goal: ship-ready*

- Full run-through of every user flow end to end
- Fix any visual inconsistencies across views
- Unify city landmark SVGs: extract path data into a shared module so `CityIllustration.jsx` (React SVG) and the postcard generator (Canvas 2D) use the same tokenized assets instead of duplicate implementations
- Verify offline mode works completely (no network, all features functional)
- Test Web Share API postcard flow on a real iPhone
- Test "Add to Home Screen" and launch from home screen
- Verify IndexedDB photo storage and retrieval under load (use test data from Sprint 6)
- Final `npm run build` — zero errors, zero warnings

