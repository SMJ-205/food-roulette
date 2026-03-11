# Implementation Plan

## Food Roulette

| | |
|---|---|
| **Author** | Sarif Mubdi Jantika |
| **Created** | 2026-03-11 |
| **PRD Reference** | [REQUIREMENTS.md](./REQUIREMENTS.md) |
| **Status** | Draft |

---

## 1. Overview

The app is a fully static, client-only web application deployed on Netlify Free Tier. It requires no build tools or frameworks — plain HTML, CSS, and JavaScript. Data is seeded from `resto.json` (already in the repo) and persisted via `localStorage`.

Development is proposed in **3 phases** to ship value quickly, validate each layer before building the next, and keep scope manageable.

---

## 2. Proposed Development Phases

```
Phase 1 ──► Phase 2 ──► Phase 3
Roulette     CRUD        Smart
(Core)       (Manage)    (Busyness)
```

| Phase | Name | Scope | Goal |
|-------|------|-------|------|
| **1** | Roulette Core | Spin + list view | Solve the core problem: picking a place fast |
| **2** | Restaurant CRUD | Add / Edit / Delete | Let curators keep the list fresh |
| **3** | Smart Suggestion | Busyness-aware filter & indicator | Avoid wait times |

> **Rationale**: Phase 1 alone already solves the original pain point. Each phase is independently deployable and usable. This avoids shipping a half-finished CRUD UI while the roulette (the primary value) isn't working yet.

---

## 3. Project Structure

```
food-roulette/
├── index.html          # Single HTML shell; all views rendered here
├── style.css           # Global styles, design tokens, animations
├── app.js              # Entry point — initialises app, wires modules
├── modules/
│   ├── storage.js      # localStorage read/write helpers
│   ├── roulette.js     # Spin logic + animation
│   ├── list.js         # Restaurant list rendering
│   ├── crud.js         # Add / Edit / Delete (Phase 2)
│   ├── filter.js       # Tag & rating filter (Phase 2)
│   ├── history.js      # Spin history (Phase 2)
│   └── busyness.js     # Busyness indicator & smart suggest (Phase 3)
├── resto.json          # Seed data (already exists)
├── REQUIREMENTS.md
└── IMPLEMENTATION_PLAN.md
```

---

## 4. Phase 1 — Roulette Core

**Goal**: Users can spin and get a random restaurant suggestion from `resto.json`.

### Features Covered
- US-1, US-2, US-3, US-4 (Spin & animation)
- US-5, US-6 (List view)

### Files to Create

#### `index.html`
- Page shell with two sections: Spin Area and Restaurant List
- Links `style.css` and `app.js`
- Contains static HTML slots that JS will populate

#### `style.css`
- Design token variables (colours, spacing, typography)
- Spin animation keyframes (slot-machine / wheel reveal effect)
- Card grid layout for restaurant list
- Responsive layout (mobile-first)
- Empty state styles

#### `modules/storage.js`
- `init()` — on first load, fetch `resto.json` and write to `localStorage`
- `getAll()` — return parsed restaurant array from `localStorage`
- `save(list)` — overwrite `localStorage` with updated array

#### `modules/roulette.js`
- `spin(restaurants)` — pick a random restaurant from the array
- Trigger spin animation, then display result (name, rating, address, tags)
- Show empty-state message if array is empty

#### `modules/list.js`
- `render(restaurants)` — build and inject restaurant cards into the DOM
- Each card shows: name, ⭐ rating, address, tag badges

#### `app.js`
- Call `storage.init()` on page load
- Render initial list via `list.render()`
- Wire Spin button to `roulette.spin()`

### Phase 1 Verification

| # | Test | Steps |
|---|------|-------|
| V1-1 | First-load seeding | Open `index.html` in browser → Check DevTools → Application → localStorage → confirm 10 restaurants loaded from `resto.json` |
| V1-2 | Spin picks a restaurant | Click Spin button → confirm animation plays → result card shows name, rating, address, tags |
| V1-3 | Result is random | Spin 10 times → confirm results vary (not always the same restaurant) |
| V1-4 | Empty state | Clear localStorage → remove all restaurants manually → Spin → confirm friendly empty-state message appears |
| V1-5 | List renders correctly | Page load → confirm all 10 restaurants appear as cards in the list |
| V1-6 | Responsive layout | Open in DevTools mobile view (375px) → confirm no overflow or broken layout |

---

## 5. Phase 2 — Restaurant CRUD

**Goal**: Curators can add, edit, and delete restaurants; users can filter and view spin history.

### Features Covered
- US-7, US-8 (Add)
- US-9 (Edit)
- US-10, US-11 (Delete with confirmation)
- US-12, US-13 (Filter by tag / rating)
- US-14, US-15 (Spin history)

### Files to Create / Modify

#### `modules/crud.js`
- `openAddForm()` — show modal with blank form
- `openEditForm(id)` — show modal pre-filled with restaurant data
- `save(formData)` — validate then write to localStorage
- `delete(id)` — show confirmation dialog, then remove from localStorage
- Validation rules per data model (name non-empty, rating 1.0–5.0, ≥1 tag)

#### `modules/filter.js`
- `render(tags)` — display multi-select tag chips above the list
- `apply(restaurants, selectedTags, minRating)` — return filtered subset
- Sync filtered list back to `roulette.spin()` to spin only matching restaurants

#### `modules/history.js`
- `record(restaurant)` — push result to a history array in `localStorage`
- `render()` — display recent picks in a collapsible panel
- `clear()` — wipe history from `localStorage`

#### Modifications to existing files
- `index.html` — add modal/form HTML, filter bar, history panel, Edit/Delete buttons on cards
- `list.js` — add Edit and Delete action buttons to each card render
- `app.js` — wire form submit, filter changes, history calls

### Phase 2 Verification

| # | Test | Steps |
|---|------|-------|
| V2-1 | Add restaurant | Click "Add Restaurant" → fill form → submit → confirm new card appears in list and in localStorage |
| V2-2 | Add validation — empty name | Submit form with blank name → confirm error message shown, data not saved |
| V2-3 | Add validation — bad rating | Enter rating `6.0` → confirm error, not saved |
| V2-4 | Add validation — no tags | Submit with no tags → confirm error, not saved |
| V2-5 | Edit restaurant | Click Edit on a card → change name → save → confirm card updates in list and localStorage |
| V2-6 | Delete restaurant | Click Delete → confirm dialog appears → confirm deletion → card removed from list and localStorage |
| V2-7 | Delete cancel | Click Delete → cancel confirmation → confirm card remains |
| V2-8 | Filter by tag | Select "korean" tag chip → list updates to show only Chingu Cafe; Spin only spins from filtered set |
| V2-9 | Filter by rating | Set minimum rating to 4.7 → list updates to show only restaurants rated ≥ 4.7 |
| V2-10 | Spin history | Spin 3 times → open history panel → confirm 3 entries appear in order |
| V2-11 | Clear history | Click Clear History → confirm panel is empty and localStorage history is gone |

---

## 6. Phase 3 — Smart Suggestion (Busyness-Aware)

**Goal**: The app helps users avoid busy restaurants by showing busyness indicators and optionally excluding peak-busy places from the spin.

### Features Covered
- US-16, US-17, US-18, US-19 (Smart suggestion, busyness indicator, dining time input, Skip Busy mode)

### Files to Create / Modify

#### `modules/busyness.js`
- `getLevelAt(restaurant, day, hour)` — return busyness level string (`"quiet"` / `"moderate"` / `"busy"` / `"peak"` / `"unknown"`)
- `getBadge(level)` — return HTML badge element with colour-coded label
- `filterBusy(restaurants, day, hour)` — return restaurants with level not `"peak"` (for Skip Busy mode)

#### Modifications to existing files
- `index.html` — add dining time input (time picker) and "Skip Busy" toggle to spin controls
- `list.js` — inject busyness badge on each card (auto-updates when dining time changes)
- `crud.js` — extend Add/Edit form with optional busyness schedule editor (day/hour grid)
- `roulette.js` — if Skip Busy mode is on, pass filtered list from `busyness.filterBusy()` to spin
- `app.js` — wire dining time input and Skip Busy toggle; re-render badges on change

### Phase 3 Verification

| # | Test | Steps |
|---|------|-------|
| V3-1 | Busyness badge renders | Add busyness data to a restaurant → reload → confirm badge shows correct level for current time |
| V3-2 | Unknown for no data | Restaurant with no busyness data → confirm badge shows "Unknown" |
| V3-3 | Dining time picker | Change dining time to 13:00 → confirm badges update to reflect that hour's busyness level |
| V3-4 | Skip Busy mode | Enable "Skip Busy" → manually set all but one restaurant to "peak" at selected time → Spin → confirm only the non-peak restaurant is picked |
| V3-5 | Skip Busy all-peak edge case | Enable "Skip Busy" with all restaurants at "peak" → Spin → confirm empty-state message appears |
| V3-6 | Busyness data editable | Open Edit form for a restaurant → input busyness schedule → save → badge updates correctly |

---

## 7. Deployment Plan (Netlify Free Tier)

### Repository Setup
1. The project root (`food-roulette/`) is already a Git repository.
2. Push to a GitHub/GitLab repository.

### Netlify Configuration
1. Connect Netlify to the repository.
2. **Build settings**:
   - **Base directory**: `/` (root)
   - **Build command**: *(leave empty — no build step needed)*
   - **Publish directory**: `/` (root)
3. `index.html` at the root will be served automatically.

### `netlify.toml` (to be created)
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deploy Flow
```
git push origin main
      │
      ▼
Netlify detects push
      │
      ▼
Copies static files to CDN
      │
      ▼
Site live at https://food-roulette.netlify.app
```

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| `localStorage` per-browser means officemates have separate lists | Medium | Acceptable for MVP; document clearly. Future: export/import JSON feature |
| No build step = no code bundling / tree-shaking | Low | Keep JS files small; use native ES modules (`type="module"`) |
| Busyness data is manually maintained and can go stale | Medium | Show "Based on typical patterns, not live data" disclaimer in UI |
| Netlify 100 GB bandwidth exceeded | Very Low | App is tiny; risk is negligible |
