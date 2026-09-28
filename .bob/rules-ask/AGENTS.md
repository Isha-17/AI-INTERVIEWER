# Project Documentation Context (Non-Obvious Only)

- **The project title is "IBM Watson Interview AI"** (`app/layout.tsx` metadata) — it presents as an IBM product but is a Next.js app using Groq/Llama, not IBM Watson services.
- **`lib/interview-types.ts` is both types AND data** — it exports TypeScript interfaces AND runtime lookup arrays (roles, industries, difficulty levels, etc.) used by UI components. Changes here affect both type checking and rendered UI.
- **`app/interview/layout.tsx` is the context boundary** — `InterviewProvider` wraps only the `/interview` subtree. The root layout (`app/layout.tsx`) does NOT include the provider.
- **`app/results/page.tsx` is an orphan** — there is both `app/results/page.tsx` and `app/interview/results/page.tsx`. The actual results page used in the interview flow is the nested one under `/interview/results`.
- **No test files exist** — there is no testing framework configured. `package.json` has no test script.
- **shadcn/ui configuration** is in `components.json` (style: "new-york", baseColor: "neutral", cssVariables: true, no prefix). Icon library is lucide-react.
- **Tailwind v4 config** is in `app/globals.css` via `@import 'tailwindcss'` — there is no `tailwind.config.ts` file.
