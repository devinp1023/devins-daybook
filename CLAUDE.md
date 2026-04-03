# Devin's Daybook

## Project Overview
A Progressive Web App travel journal for a 6-week Europe trip (May 27 - July 6, 2025). Built with React + Vite, designed mobile-first for iPhone.

## Tech Stack
- React + Vite (v8)
- Tailwind CSS v4 (via `@tailwindcss/vite`) — **NOTE: many Tailwind utility classes don't work reliably (e.g. `pl-14` computes to 0px). Use inline `style={}` objects instead of Tailwind classes for layout/spacing/colors.**
- Framer Motion for animations
- React Router for navigation
- localStorage for entry data, IndexedDB (via `idb`) for photo Blob storage
- vite-plugin-pwa for offline/service worker
- Google Fonts: Playfair Display, Cormorant Garamond, DM Mono

## Workflow
- **Do not use preview tools or take screenshots.** The user will QA in the browser and provide feedback or request fixes directly.
- Make changes, explain what was done, and wait for user feedback.

## Commands
- `npm run dev` — start dev server (port 5173)
- `npm run build` — production build (must pass with zero errors before finishing a sprint)

## Architecture
- `src/data/` — data layer (entries CRUD, photo storage, trip constants/helpers, seed data)
- `src/pages/` — route-level components (Feed, EntryDetail, NewEntry, MapView, PhotoRoll, CitySummaries)
- `src/components/` — shared components (Sidebar, CityIllustration, Lightbox)
- Color palette defined as CSS custom properties in `src/index.css`
- App is wrapped in a 430px max-width mobile shell for desktop viewing

## Sprint Status
- **Sprint 1** — DONE — Project foundation, data layer, routing, design system, seed data
- **Sprint 2** — DONE — Journal feed with city illustrations, entry detail view, lightbox
- **Sprint 3** — DONE — New entry composer, edit, delete with photo upload
- **Sprint 4** — DONE — Map View (static SVG Europe map) + Photo Roll
- **Sprint 5** — TODO — City Summaries + Postcard Generator
- **Sprint 6** — TODO — Test Data + Dev Tools (hidden screen)
- **Sprint 7** — TODO — Mobile Optimization (touch targets, iOS Safari fixes, safe areas)
- **Sprint 8** — TODO — Polish + Pre-Trip QA

## UI Guidelines
- **Use inline styles, not Tailwind classes** for anything layout-critical. Tailwind v4 class generation is unreliable in this setup.
- The app must look professionally polished — not just functional. Every element should have proper spacing, rounded corners (10-16px), consistent font usage, and deliberate shadows.
- Hamburger menu is part of the header flow (not a floating overlay). It's passed as `onMenuOpen` prop from App to pages.
- Cards use `border: 1px solid var(--border-card)` + `boxShadow` + `borderRadius: 16px`.
- Section icons are 28x28px square pills with `var(--bg-tag)` background.
- Sidebar uses all inline styles with icons on nav items, close button, and a progress bar with percentage.
- Composer uses shared `inputStyle` object for consistent form fields.
- The full PRD with itinerary, data model, and sprint details is in `devinsdaybook.md`.
