# Product Requirements Document (PRD)

## Food Roulette

| | |
|---|---|
| **Author** | Sarif Mubdi Jantika |
| **Created** | 2026-03-11 |
| **Status** | Draft |

---

## 1. Problem Statement

Deciding where to eat lunch with officemates is a daily, time-consuming debate. With many nearby restaurant options but no structured way to choose, the group often wastes time going back and forth or defaults to the same few places out of convenience. Even after deciding, arriving at a packed restaurant and facing a long waiting list makes the experience worse.

## 2. Objective

Build a **Food Roulette** application that eliminates lunch-decision fatigue by randomly selecting a restaurant from a curated list. The app should also allow users to manage (add, view, edit, delete) the restaurant list so it stays up-to-date as new places open or preferences change. Additionally, the app should be able to suggest restaurants that are likely **less busy** at the user's intended dining time, helping avoid long waiting lists.

### Success Metrics

| Metric | Target |
|--------|--------|
| Time to decide where to eat | Reduced to < 10 seconds (one spin) |
| Restaurant list freshness | Users can update the list without technical knowledge |
| Waiting list encounters | Reduced by suggesting less-busy restaurants at dining time |
| Adoption | Officemates use the app daily during lunch hour |

---

## 3. Target Users

| Persona | Description |
|---------|-------------|
| **The Indecisive Officemate** | Wants a quick, fair, fun way to pick a restaurant without debating. Just wants to press a button and go. |
| **The Foodie Curator** | Knows the local food scene and wants to manage the restaurant list — adding new finds, removing closed places, updating ratings. |
| **The Efficiency-Minded Diner** | Hates waiting in line. Wants to pick a place that's likely to have seats available at the time they plan to eat. |

---

## 4. User Stories

### 4.1 Roulette / Random Pick

| ID | User Story | Priority |
|----|------------|----------|
| US-1 | As a user, I want to **spin a roulette** so that a restaurant is randomly chosen for me. | **P0** |
| US-2 | As a user, I want to **see a fun animation** during the spin so the experience feels exciting and game-like. | **P0** |
| US-3 | As a user, I want to **see the chosen restaurant's details** (name, rating, address, tags) after the spin. | **P0** |
| US-4 | As a user, I want to be **informed when no restaurants are available** to spin (empty list or no filter matches). | **P0** |

### 4.2 View Restaurants

| ID | User Story | Priority |
|----|------------|----------|
| US-5 | As a user, I want to **browse all saved restaurants** so I can see what options are available. | **P0** |
| US-6 | As a user, I want to **see each restaurant's name, rating, address, and tags** at a glance. | **P0** |

### 4.3 Add Restaurant

| ID | User Story | Priority |
|----|------------|----------|
| US-7 | As a curator, I want to **add a new restaurant** with its name, rating, address, and tags. | **P0** |
| US-8 | As a curator, I want the app to **validate my input** (e.g. rating must be 1.0–5.0, name cannot be empty) so bad data doesn't get saved. | **P0** |

### 4.4 Edit Restaurant

| ID | User Story | Priority |
|----|------------|----------|
| US-9 | As a curator, I want to **edit an existing restaurant's details** in case information changes (e.g. new rating, corrected address). | **P0** |

### 4.5 Delete Restaurant

| ID | User Story | Priority |
|----|------------|----------|
| US-10 | As a curator, I want to **delete a restaurant** that has closed or is no longer relevant. | **P0** |
| US-11 | As a curator, I want to **confirm before deleting** so I don't accidentally remove a restaurant. | **P0** |

### 4.6 Filter Before Spin

| ID | User Story | Priority |
|----|------------|----------|
| US-12 | As a user, I want to **filter restaurants by tag** (e.g. "korean", "coffee") before spinning so the result matches my current craving. | **P1** |
| US-13 | As a user, I want to **filter by minimum rating** so only highly-rated places are eligible. | **P1** |

### 4.7 Spin History

| ID | User Story | Priority |
|----|------------|----------|
| US-14 | As a user, I want to **see my recent spin results** so I can avoid repeating the same place. | **P1** |
| US-15 | As a user, I want to **clear my spin history** when I want a fresh start. | **P1** |

### 4.8 Smart Suggestion (Busyness-Aware)

| ID | User Story | Priority |
|----|------------|----------|
| US-16 | As a user, I want the app to **suggest restaurants that are likely less busy** at my intended dining time so I can avoid long waits. | **P1** |
| US-17 | As a user, I want to **see a busyness indicator** (e.g. "Quiet", "Moderate", "Busy", "Peak") for each restaurant based on the current time or a selected time. | **P1** |
| US-18 | As a user, I want to **set my planned dining time** (defaulting to "now") so the suggestion accounts for when I'll actually arrive. | **P1** |
| US-19 | As a user, I want to **optionally enable a "Skip Busy" mode** for the roulette so the spin automatically excludes restaurants that are at peak busyness. | **P1** |

---

## 5. Scope

### In Scope (MVP — P0)

- Random restaurant picker with visual spin animation
- Restaurant list view showing all entries
- Add new restaurant with validated form
- Edit existing restaurant details
- Delete restaurant with confirmation
- Data seeded from existing `resto.json` on first use
- Data persists across sessions (no data loss on page reload)

### In Scope (Post-MVP — P1)

- Filter by tags and/or minimum rating before spinning
- Spin history log with clear option
- Smart Suggestion: busyness indicator per restaurant based on dining time
- "Skip Busy" mode to exclude peak-busyness restaurants from the spin
- Curator can manage busyness schedule per restaurant

### Out of Scope

- User authentication / multi-user accounts
- Backend server or database
- Server-side rendering or server-side logic
- Map integration or directions
- Online reviews or external API integrations
- Multi-language support

---

## 5A. Deployment & Hosting Constraints

The application will be hosted on **Netlify Free Tier**. All product decisions must respect these constraints:

| Constraint | Detail |
|------------|--------|
| **Hosting type** | Static site only — no server-side code execution |
| **Bandwidth** | 100 GB / month |
| **Build minutes** | 300 minutes / month |
| **Site size** | No hard limit, but assets should be kept lean |
| **Custom domain** | Supported (optional); default `*.netlify.app` subdomain provided |
| **HTTPS** | Automatic via Netlify |
| **Forms / Functions** | Not used — all logic runs client-side |

### Implications for the Product

1. **Fully static** — The app must be a static site (HTML, CSS, JS, JSON). No Node.js server, no SSR, no API routes.
2. **No shared database** — Each user's browser holds its own data in `localStorage`. There is no cross-device or cross-user sync.
3. **Seed data bundled** — `resto.json` is deployed as a static asset alongside the app and fetched on first load.
4. **Lightweight assets** — Keep total deployed size small (images, fonts, scripts) to stay well within bandwidth limits.
5. **Git-based deploy** — Code pushed to the linked Git repository auto-deploys via Netlify CI/CD.

---

## 6. Data Model

Each restaurant record contains:

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | string | Required, non-empty |
| `rating` | number | Required, range 1.0–5.0 |
| `address` | string | Required, non-empty |
| `tags` | string[] | Required, minimum 1 tag |
| `busyness` | BusynessSchedule (see below) | Optional (P1) |

#### Busyness Schedule (P1)

Each restaurant may optionally include a `busyness` object describing typical crowd levels throughout the week. This data is **curator-managed** (manually entered based on personal experience or observation).

| Field | Type | Description |
|-------|------|-------------|
| `busyness.[day]` | object | Day of week (`monday`–`sunday`) |
| `busyness.[day].[hour]` | string | Hour in 24h format (`"11"`, `"12"`, …). Value is one of: `"quiet"`, `"moderate"`, `"busy"`, `"peak"` |

Example:
```json
"busyness": {
  "monday": { "11": "quiet", "12": "busy", "13": "peak", "14": "moderate" },
  "tuesday": { "11": "quiet", "12": "moderate", "13": "busy", "14": "quiet" }
}
```

> If a restaurant has no busyness data, the app treats it as **"unknown"** and does not exclude it from smart suggestions.

Reference: see [`resto.json`](file:///Users/sarifmubdijantika/Documents/food-roulette/resto.json) for seed data (10 restaurants).

---

## 7. Key Functional Rules

1. **First-time seeding** — On first launch, the app loads data from `resto.json`. Subsequent visits use persisted data.
2. **Spin fairness** — Every eligible restaurant has an equal probability of being selected.
3. **Validation on save** — Both Add and Edit forms enforce the constraints in the data model (Section 6).
4. **Delete safety** — Deletion always requires explicit user confirmation.
5. **Empty state handling** — The app gracefully handles zero restaurants (no crash, shows a message encouraging the user to add one).
6. **Busyness defaults** — If a restaurant has no busyness data for the current day/hour, it is displayed as "Unknown" and is **not** excluded by the "Skip Busy" filter.
7. **Dining time default** — The smart suggestion dining time defaults to the current time but can be manually overridden by the user.
8. **Busyness is advisory** — Busyness data is based on curator input, not live data. The app should make this clear to users.

---

## 8. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Platform** | Runs in modern web browsers (Chrome, Firefox, Safari, Edge) |
| **Hosting** | Deployable as a static site on Netlify Free Tier (no server-side dependencies) |
| **Responsiveness** | Usable on both desktop and mobile screens |
| **Performance** | Spin result appears within 1 second (animation may extend for effect) |
| **Bundle size** | Total deployed assets should be under 5 MB to keep bandwidth usage minimal |
| **Accessibility** | Interactive elements are keyboard-navigable with appropriate labels |
| **Data Persistence** | No data is lost on page reload or browser restart (via `localStorage`) |
| **CI/CD** | Deploys automatically on `git push` via Netlify's build pipeline |

---

## 9. Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Should the spin exclude the most recent result to avoid back-to-back repeats? | 🟡 Open |
| 2 | Should tags be free-form text or selected from a predefined set? | 🟡 Open |
| 3 | Is there a maximum number of restaurants the list should support? | 🟡 Open |
| 4 | Should busyness levels use fixed options (`quiet` / `moderate` / `busy` / `peak`) or a numeric scale (1–5)? | 🟡 Open |
| 5 | What hour range should busyness cover? Lunch only (11:00–14:00) or full day? | 🟡 Open |
| 6 | Should the app pre-populate sample busyness data in `resto.json`, or start empty and let curators fill it in? | 🟡 Open |
| 7 | Should the Netlify site use a custom domain or the default `*.netlify.app` subdomain? | 🟡 Open |
| 8 | Since each browser has its own `localStorage`, is the lack of cross-device sync acceptable? | 🟡 Open |
