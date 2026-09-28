# Project Architecture Rules (Non-Obvious Only)

- **Interview flow is strictly sequential and stateful**: Setup page (`/interview`) → session page (`/interview/session`) → results page (`/interview/results`). All state flows through `InterviewContext`; skipping steps causes an automatic redirect back to `/interview`.
- **Two separate API routes, not one**: Question generation (`POST /api/interview/questions`) and evaluation (`POST /api/interview/evaluate`) are independent routes. The session page calls evaluate only after the final answer is submitted, passing the full accumulated answers array.
- **`overallScore` is stored as percentage (0–100)**, not 0–10. The evaluate route multiplies the AI's 0–10 score by 10: `Math.round(overallScore * 10)`. Do not double-convert when displaying.
- **No persistence layer** — there is no database, localStorage, or session storage. Results exist only in React state for the lifetime of the browser session. Adding persistence requires adding `InterviewContext` persistence or a new storage layer.
- **Groq is the sole AI provider** — `createGroq` is instantiated directly in each route file. Switching models or providers requires editing both route files. The `GROQ_API_KEY` env var must be set for any AI functionality.
- **Fallback question bank is fully embedded** in `app/api/interview/questions/route.ts` — a `questionBank` object with 6 types × 4 difficulty levels × 5 questions each (120 questions total). This is the backup when Groq is unavailable.
- **IBM Carbon Design enforces zero border-radius globally** (`--radius: 0`). Any new UI must follow this flat/square aesthetic — it is intentional, not a bug.
- **`components/ui/` is managed by shadcn** — plan new UI additions as shadcn component installs, not custom builds, to preserve consistency with the existing component set.
