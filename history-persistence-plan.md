# History Persistence Plan (localStorage — Option A)

## Confirmed Design Decisions

1. **Shared ResultsView refactor** — Extract results rendering into `components/interview/results-view.tsx`; live `/interview/results` page delegates to it and must look/behave identically.
2. **Replace Results nav link with History** — Header nav shows Home · Interview · History. The `app/results/page.tsx` file is NOT deleted.
3. **Dynamic route** — `app/history/[id]/page.tsx` uses `"use client"` with `useParams()` (not `generateStaticParams`). Shows a "session not found" state with a link back to `/history` if the id is missing from localStorage.

---

## Overview

Add browser-local persistence for completed interview sessions. After `/api/interview/evaluate`
returns an `InterviewResult`, save it to `localStorage` under a versioned key. Add a `/history`
route that lists all saved sessions and links to a full per-session results view. Add delete-one
and clear-all controls. Cap at 50 sessions. All localStorage access is SSR-safe and
crash-resistant.

No new dependencies, no database, no env vars required.

---

## Sub-Task 1 — localStorage helper (`lib/history-storage.ts`)

**Status:** `[x] done`

### Intent
Centralise all localStorage reads and writes in one module. This module is the single place that
knows the storage key, the version, the 50-session cap, and the safe-serialisation rules. Every
other file imports from here — nothing else ever touches `localStorage` directly for history.

### Expected Outcomes
- `lib/history-storage.ts` exists and exports the public API listed below.
- Calling any function in a Node.js/SSR context (where `window` is undefined) returns gracefully
  without throwing.
- Feeding corrupted JSON to `getHistory()` returns `[]` instead of throwing.
- `saveSession()` generates a `uuid` and `savedAt` timestamp, prepends the new record, slices to
  50, and writes back.
- `deleteSession(id)` removes the matching record and writes back.
- `clearHistory()` removes the key entirely.

### Todo List
- [ ] Create `lib/history-storage.ts`
- [ ] Define `HistoryEntry` type: `InterviewResult & { id: string; savedAt: string }`
- [ ] Define `STORAGE_KEY = "interviewHistory_v1"`
- [ ] Implement `isClient(): boolean` guard (`typeof window !== "undefined"`)
- [ ] Implement `getHistory(): HistoryEntry[]` — SSR-safe, try/catch JSON.parse, return `[]` on
      any error
- [ ] Implement `saveSession(result: InterviewResult): HistoryEntry` — generates `id`
      (`crypto.randomUUID()`), sets `savedAt` to ISO string, prepends, caps at 50, writes,
      returns the new entry
- [ ] Implement `deleteSession(id: string): void`
- [ ] Implement `clearHistory(): void`
- [ ] Export `HistoryEntry` type

### Relevant Context
- `lib/interview-types.ts` — `InterviewResult` interface (the object being persisted); note
  `overallScore` is already 0–100 (multiplied in the evaluate route)
- `lib/interview-context.tsx` — pattern for how the rest of the app uses these types
- `crypto.randomUUID()` is available in Next.js 16 / Node 19+ and in all modern browsers

---

## Sub-Task 2 — Save session after evaluation completes

**Status:** `[x] done`

### Intent
Wire `saveSession()` into the existing post-evaluation flow so that every completed interview is
automatically persisted without changing the current navigation or UX.

### Expected Outcomes
- After `POST /api/interview/evaluate` succeeds in `app/interview/session/page.tsx`, the result
  is saved to localStorage before `router.push("/interview/results")`.
- The call is wrapped in a try/catch so a storage failure (e.g. private browsing quota exceeded)
  never blocks navigation or shows an error to the user.
- No change to any type, context field, or API route.

### Todo List
- [ ] In `app/interview/session/page.tsx`, import `saveSession` from `@/lib/history-storage`
- [ ] After `const result: InterviewResult = await response.json()`, call
      `saveSession(result)` inside a try/catch (log failure, do not rethrow)
- [ ] Confirm `setResult(result)` and `router.push("/interview/results")` remain unchanged

### Relevant Context
- `app/interview/session/page.tsx` lines 67–83 — the exact block where evaluate response is
  received and `setResult` / `router.push` are called
- The try/catch already present in that block covers AI fetch failure; the `saveSession` call
  should be inside the success path, before the push

---

## Sub-Task 3 — History list page (`app/history/page.tsx`)

**Status:** `[x] done`

### Intent
Create a `/history` route that reads all saved sessions from localStorage client-side and renders
them as a list. Each row shows role, company, date, overall score, and a delete button. A
"Clear history" button at the top removes all sessions. Clicking a row navigates to
`/history/[id]` (built in Sub-Task 4). Empty and loading states are handled.

### Expected Outcomes
- `GET /history` renders the history list page.
- On initial render (SSR), shows a loading skeleton or empty state (no localStorage access during
  SSR).
- After mount (`useEffect`), reads `getHistory()` and renders the list.
- Each row displays: role, company (or "—" if absent), interview type, difficulty, date
  (`savedAt` formatted), overall score as a coloured percentage, and a delete icon button.
- Deleting a session calls `deleteSession(id)` and removes the row from local state immediately.
- "Clear history" calls `clearHistory()` and empties the list.
- Empty state shows a message and a link to `/interview`.
- Follows existing IBM Carbon Design conventions: `#f4f4f4` background, `#161616` dark header
  bar, `#0f62fe` IBM blue accents, `--radius: 0` (no rounded corners), `cn()` for class merging,
  lucide-react icons.
- Reuses `<Header />` and `<Footer />` from `components/`.

### Todo List
- [ ] Create `app/history/page.tsx` as a `"use client"` component
- [ ] Import `getHistory`, `deleteSession`, `clearHistory`, `HistoryEntry` from
      `@/lib/history-storage`
- [ ] Use `useState<HistoryEntry[] | null>(null)` (null = loading, [] = empty)
- [ ] Use `useEffect` to call `getHistory()` once on mount and set state
- [ ] Render loading spinner (reuse `Loader2` from lucide-react) while state is `null`
- [ ] Render empty state with link to `/interview` when state is `[]`
- [ ] Render dark header band (matching `/interview` page hero pattern) with title "Interview
      History" and a "Clear All" button (disabled when list is empty)
- [ ] Render a list/table of session rows with columns: Role, Company, Type, Date, Score, Actions
- [ ] Score cell uses inline colour matching `getScoreColor` logic from
      `app/interview/results/page.tsx` (score >= 80 → `#198038`, >= 60 → `#0f62fe`, >= 40 →
      `#f1c21b`, else `#da1e28`)
- [ ] Delete button per row calls `deleteSession(entry.id)` and filters local state
- [ ] "Clear All" button calls `clearHistory()` and sets state to `[]`; add a confirmation
      (`window.confirm`) before clearing
- [ ] Each row (or a "View" link) navigates to `/history/[id]`

### Relevant Context
- `app/interview/page.tsx` and `app/interview/results/page.tsx` — pattern for page layout,
  dark hero header band, IBM Carbon colour usage, `<Header />` / `<Footer />` placement
- `components/header.tsx` — Header component (already `"use client"`)
- `components/footer.tsx` — Footer component
- `lib/interview-types.ts` — `InterviewConfig` fields available per entry: `role`, `company`,
  `type`, `difficulty`, `mode`

---

## Sub-Task 4 — Per-session results page (`app/history/[id]/page.tsx`)

**Status:** `[x] done`

### Intent
Allow users to re-read the full results of any past session by navigating to `/history/[id]`.
This page finds the matching `HistoryEntry` by id from localStorage and renders the same
detailed results UI already built in `app/interview/results/page.tsx`, without duplicating the
rendering logic.

### Expected Outcomes
- `GET /history/[id]` renders the full results for the matching session.
- If the id is not found (deleted, localStorage cleared), shows a "session not found" message
  and a back link.
- The results layout and visual design is identical to `app/interview/results/page.tsx` — all
  the same scoring cards, question-by-question breakdown, STAR analysis.
- The action buttons differ: "Back to History" (`/history`) and "Start New Interview"
  (`/interview`) — no "Back to Home" button.
- No duplication of the `InterviewContext` — reads directly from `getHistory()`.

### Todo List
- [ ] Create `app/history/[id]/page.tsx` as a `"use client"` component
- [ ] Extract the results rendering logic from `app/interview/results/page.tsx` into a shared
      component `components/interview/results-view.tsx` that accepts an `InterviewResult` as a
      prop (no context dependency)
- [ ] Update `app/interview/results/page.tsx` to use `<ResultsView result={result} />` instead
      of inline rendering; action buttons remain in the page wrapper (not in `ResultsView`)
- [ ] In `app/history/[id]/page.tsx`, read `getHistory()` in `useEffect`, find entry by
      `params.id`, render `<ResultsView result={entry} />` with history-specific action buttons
- [ ] Handle not-found case with a message and a link back to `/history`

### Relevant Context
- `app/interview/results/page.tsx` — the full results rendering to be extracted; note that
  `result` comes from `useInterview()` context today; after refactor it becomes a prop
- `InterviewResult` fields: `config`, `answers`, `feedback`, `overallScore`, `recommendation`,
  `summary`, `totalDuration`, `completedAt`
- `HistoryEntry` extends `InterviewResult` with `id` and `savedAt`; `ResultsView` only needs the
  `InterviewResult` fields, so passing a `HistoryEntry` as an `InterviewResult` prop is valid

---

## Sub-Task 5 — Add History link to header nav

**Status:** `[x] done`

### Intent
Surface the history page through the existing navigation so users can find it naturally.

### Expected Outcomes
- Desktop nav shows: Home · Interview · History · Results (in that order).
- Mobile nav drawer includes History in the same position.
- The existing "Results" link remains (it navigates to `/results` which currently exists as an
  orphan page — leave as-is).
- Active/current-route highlighting is not required (not present elsewhere in the header today).

### Todo List
- [ ] In `components/header.tsx`, add a `<Link href="/history">` entry in the desktop `<nav>`
      between the Interview and Results links, with identical className styling
- [ ] Add the same link in the mobile nav section, with `onClick={() => setMobileMenuOpen(false)}`

### Relevant Context
- `components/header.tsx` lines 43–62 (desktop nav) and 86–108 (mobile nav)
- Existing link className: `"px-4 py-3 text-sm hover:bg-[#393939] transition-colors"`
- Mobile link className: `"block px-4 py-3 text-sm hover:bg-[#393939] transition-colors border-b border-[#393939]"`
