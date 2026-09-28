# SkillUp Ace
> **AI-Powered Interview Readiness Platform**

SkillUp Ace is an AI-powered interview preparation platform designed to help candidates practice role-specific interviews, simulate real-world technical and behavioral interview sessions, and receive structured, actionable performance feedback.

---

## Key Features

- **Role & Company Specifics:** Tailor mock interviews to target job roles, levels, and specific companies.
- **Dynamic AI Question Generation:** Adapts questions in real time based on user inputs and responses.
- **Realistic Interview Simulation:** Recreates real-world interview conditions and workflows.
- **Automated Performance Analysis:** Evaluates responses and provides detailed feedback and scoring.
- **Session History & Persistence:** Saves up to 50 interview sessions locally for review, analysis, or deletion.
- **Modern & Responsive UI:** Designed with a clean, accessible interface for seamless navigation across devices.

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling & UI:** Tailwind CSS, shadcn/ui, Radix UI
- **AI Engine:** Groq API (Llama Models)
- **Form & Validation:** Zod, React Hook Form
- **Data Visualization:** Recharts
- **Storage:** Browser `localStorage`

---

## Development Workflow & AI Agent Integration

### 1. Analysis (`/init`)
An initial automated codebase analysis established guidance documentation (`AGENTS.md`, `.bob/rules-agent/AGENTS.md`, `.bob/rules-ask/AGENTS.md`, `.bob/rules-plan/AGENTS.md`) and identified structural liabilities:
- Suppressed TypeScript errors during production builds.
- Critical application state residing strictly in memory.
- Orphaned components (e.g., `app/results/page.tsx`).
- Legacy "IBM Watson" branding present despite runtime execution on Groq / Llama APIs.

### 2. Planning (Plan Mode)
Evaluated session persistence architectures (Hosted DB vs. Hybrid vs. `localStorage`). Selected `localStorage` for zero-friction client-side persistence and detailed the execution roadmap in `history-persistence-plan.md`.

### 3. Implementation (Agent Mode)
Refactored and added the local session storage pipeline:

| File | Changes Made |
| :--- | :--- |
| `lib/history-storage.ts` | Created centralized storage helper (`save`, `get`, `delete`, `clear`) capped at 50 sessions. |
| `components/interview/results-view.tsx` | Extracted standalone shared results component from the results page. |
| `app/history/page.tsx` | Created primary interview history listing page. |
| `app/history/[id]/page.tsx` | Created single-session detail view with invalid route handling. |
| `app/interview/session/page.tsx` | Added automated persistence upon interview completion. |
| `app/interview/results/page.tsx` | Refactored to utilize `ResultsView` (reduced lines from ~379 to ~79). |
| `components/header.tsx` | Updated navigation targets from "Results" to "History". |

---

## Known Issues & Open Technical Debt

While core persistence features are committed, the following technical items remain open for verification and refactoring:

- **Routing & Navigation Integrity:** Verification required on navigation paths to ensure header links direct correctly to `/history` rather than nested legacy paths like `/results/history`.
- **End-to-End Testing:** End-to-end user testing is required to verify that full interview runs persist, list, and render past sessions accurately across browser environments.
- **Type Safety & Build Checks:** `tsc` and local production builds need to run cleanly without suppressed build errors.
- **Branding Realignment:** Replacing lingering "IBM Watson" assets and text with accurate Groq/Llama API references.
- **Dead Code Elimination:** Cleanup of orphaned routes and unused pages across the codebase.

---

## Team — Team SkillWire

- **Isha Sonawane**
- **Aqsa Waikar**
