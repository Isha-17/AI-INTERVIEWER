# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS v4 · shadcn/ui (new-york style) · Vercel AI SDK (`ai` + `@ai-sdk/groq`) · Zod · lucide-react icons

## Commands
```bash
npm run dev       # start dev server
npm run build     # production build
npm run lint      # eslint
```
No test runner is configured — there are no tests in this project.

## Critical Non-Obvious Details

### TypeScript build errors are suppressed
`next.config.mjs` sets `typescript.ignoreBuildErrors: true`. TypeScript errors won't block `next build`, so type correctness must be verified manually with `tsc --noEmit`.

### `@/*` alias maps to project root (not `src/`)
`tsconfig.json` paths: `"@/*": ["./*"]` — the alias resolves from the workspace root, not from a `src/` directory.

### AI model: Groq only, hardcoded to `llama-3.3-70b-versatile`
Both API routes (`/api/interview/questions` and `/api/interview/evaluate`) use `createGroq` with `process.env.GROQ_API_KEY`. The AI SDK's structured output is used via `Output.object({ schema })` from the `ai` package — not streaming. Route timeouts: questions=60s, evaluate=120s (`export const maxDuration`).

### Interview state lives in React Context, not URL/storage
`lib/interview-context.tsx` wraps only the `/interview` subtree (via `app/interview/layout.tsx`). State is **in-memory only** — navigating away or refreshing loses all interview data. Session pages guard against missing state by redirecting to `/interview`.

### All types and lookup tables are co-located in `lib/interview-types.ts`
`InterviewConfig`, `InterviewQuestion`, `UserAnswer`, `QuestionFeedback`, `InterviewResult` types, plus display arrays (`interviewTypes`, `difficultyLevels`, `experienceLevels`, `industries`, etc.) all live in this single file.

### IBM Carbon Design System color palette — use raw hex values
The design uses IBM Carbon colors as CSS variables and inline hex. Key values:
- Background: `#f4f4f4` (gray-10), Dark surfaces: `#161616` (gray-100)
- IBM Blue (primary): `#0f62fe`, Hover: `#0353e9`
- Text primary: `#161616`, Text secondary: `#525252`, Muted: `#a8a8a8`
- Success: `#198038`, Warning: `#f1c21b`, Error: `#da1e28`
- Border/input: `#e0e0e0`
- `--radius: 0` — **no rounded corners anywhere by design**

### Fonts: IBM Plex Sans + IBM Plex Mono (loaded via `next/font/google`)
CSS variables `--font-ibm-plex-sans` and `--font-ibm-plex-mono` are applied in `app/layout.tsx`. Use `font-sans` and `font-mono` Tailwind utilities.

### shadcn/ui components live in `components/ui/` — do not edit them directly
Add new shadcn components via `npx shadcn@latest add <component>`. The `cn()` utility from `lib/utils.ts` (`clsx` + `tailwind-merge`) must be used for conditional class merging.

### `"use client"` directive is required for any component using hooks or context
Server components are the default in App Router. Pages using `useInterview()`, `useState`, `useEffect`, or `useRouter` must declare `"use client"` at the top.

### Error logging uses `[v0]` prefix in console
All `console.error` calls in API routes use the prefix `[v0]`. Follow this convention when adding error logging.
