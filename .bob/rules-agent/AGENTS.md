# Project Coding Rules (Non-Obvious Only)

- **TypeScript errors don't block builds** — `next.config.mjs` sets `ignoreBuildErrors: true`. Always run `npx tsc --noEmit` to validate types before reporting completion.
- **`@/*` resolves from project root**, not `src/`. Import as `@/lib/...`, `@/components/...`, `@/hooks/...` etc.
- **`cn()` from `lib/utils.ts`** is the only approved way to merge Tailwind classes — always use it for conditional/dynamic className props.
- **No rounded corners** — `--radius: 0` is set globally. Never add `rounded-*` classes; it violates the IBM Carbon design intent.
- **Inline hex colors for IBM Carbon palette** — Tailwind utility classes are not defined for IBM Carbon values. Use inline `style={{ color: "#0f62fe" }}` or hardcoded hex in className strings (e.g. `text-[#0f62fe]`).
- **Interview state is ephemeral** — `InterviewContext` holds all session data in memory. Any new page that depends on session state must guard with a `useEffect` redirect (see `app/interview/session/page.tsx` pattern).
- **Add types to `lib/interview-types.ts`** — all domain types and display lookup arrays belong there; do not scatter them across component files.
- **AI structured output pattern**: use `Output.object({ schema: zodSchema })` as the third argument to `generateText`. Do not use streaming for these routes.
- **Fallback questions/results are required** — both API routes must handle AI failure gracefully by returning hardcoded fallback data, not HTTP error responses.
- **`export const maxDuration`** must be set on API routes that call Groq (questions=60, evaluate=120) to avoid Vercel function timeouts.
- **`"use client"` is mandatory** on any file using React hooks, context, or router — server components are the default in App Router.
