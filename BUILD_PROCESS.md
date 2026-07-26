# Build Process

This document is an honest account of how CrimInsight AI was actually built, for transparency and for the "reporting" component of my AI course project. My course's guidelines explicitly allow building the app entirely with AI assistance, so rather than obscure that, I'm documenting the process in detail — what I asked for, in what order, and how I verified the result at each stage.

## Approach

I worked with **Claude (Anthropic)** as an AI pair-programmer, in a conversational, staged process rather than one giant prompt. Each stage produced real, runnable code that was checked before moving to the next — I didn't accept a stage as "done" without seeing evidence it actually worked (type-checking, linting, and eventually a full production build), and I asked for a final independent review pass to surface issues before submission rather than assuming the first version was production-ready.

## Stage-by-stage

### 1. Architecture design (no code)
Before any code was written, I had Claude design the full system on paper first: folder structure, database schema (Supabase/Postgres tables and Row Level Security policy shape), a complete feature list, user flow, API routes, component breakdown, the AI workflow, and a deployment plan. This gave me something to review and push back on before any implementation time was spent.

### 2. UI/UX design (no code)
Same approach for the interface: a full design system (blue/white glassmorphism theme, typography, spacing, accessibility principles) and a page-by-page written spec for every screen — landing, login, register, dashboard, chat, and the other planned tool pages — before any component was built.

### 3. Project scaffolding
Next.js 14 (App Router) + TypeScript + Tailwind CSS project created from scratch: `package.json`, `tailwind.config.ts` (translating the design system into real design tokens), `tsconfig.json`, ESLint/Prettier config, and the full folder structure. Verified with `npm install`, `tsc --noEmit`, and a Tailwind compile check — not just "it looks right," but that it actually builds.

### 4. Authentication
Full Supabase Auth integration: signup, login, logout, forgot/reset password, session persistence via cookies, and a protected dashboard route enforced in two places (middleware + a server-side check in the layout, so one bypassing the other isn't a single point of failure). Included a real Postgres migration for a `profiles` table with Row Level Security and a trigger to auto-create a profile on signup. Validation via Zod on every form, with accessible error states (labeled fields, `aria-invalid`, `role="alert"`).

### 5. The AI Assistant ("Ask AI")
This is the AI-powered feature required by the course brief. Built with the Google Gemini API (`@google/generative-ai`), with:
- A streaming chat API route (`/api/chat`) that persists conversation history to Postgres and streams the model's response back to the browser token-by-token
- A Zustand store managing the client-side streaming state
- Markdown rendering of AI responses (`react-markdown` + `remark-gfm`), a typing indicator, and proper error handling for network/model failures
- **A system prompt I wrote and then iterated on**, described in full in the main README's [System Prompt](./README.md#system-prompt) section and in [`src/lib/gemini/prompts.ts`](./src/lib/gemini/prompts.ts) — this went through a deliberate revision pass to sharpen it into a specific persona (an experienced criminology professor) with explicit anti-hallucination rules, a dual plain-English/academic-language explanation style, and support for Pakistani-context questions alongside international examples

### 6. Production hardening
A dedicated pass focused specifically on making the app deployable, not just functional locally:
- Security headers, removed the `X-Powered-By` header, tree-shaking config for large dependencies
- A real error-boundary strategy (`error.tsx`, `global-error.tsx`, custom `not-found.tsx`, route-level loading states) so failures show a recoverable screen instead of a blank page
- SEO basics (`robots.ts`, `sitemap.ts`, a programmatically generated favicon/OG image so no binary asset files were needed)
- A GitHub Actions CI workflow that lints, type-checks, and builds on every push/PR
- I specifically asked for a **real production build**, not just a type-check — and it caught a genuine bug (a missing Tailwind plugin that meant all AI-generated Markdown would have rendered unstyled) that lint/type-check alone had missed. That's documented in the Step 3 history of this project and is a good example of why "it compiles" isn't the same as "it works."

### 7. System prompt rewrite
After the initial build, I asked for the system prompt to be rewritten as a distinct, more deliberate pass — moving from a general "study assistant" framing to a specific professor persona with explicit rules: never hallucinate, state uncertainty when evidence is weak, never fabricate references, encourage critical thinking rather than handing over conclusions, and support Pakistani context specifically alongside international examples.

### 8. Self-review pass
Before finalizing, I asked for an independent senior-engineer-style review of the whole codebase — not just "does it work" but security issues, performance issues, UI/accessibility gaps, missing features versus the original spec, deployment risks, and code duplication. That review surfaced several real, specific issues (documented separately), including:
- A genuine logic bug in the password-reset flow (the middleware could redirect an already-authenticated recovery session away from the "set new password" page before the user could complete it)
- No rate limiting on the AI endpoint (a real cost/abuse risk)
- Zustand store subscriptions causing unnecessary re-renders during streaming
- Duplicated mobile-drawer UI code with incomplete accessibility semantics (`aria-modal` set without an actual focus trap)

I'm including that review honestly rather than hiding it — a large part of the point of this exercise, for me, was learning to read and critique AI-generated code rather than just accepting it, and I think showing that process is more useful than presenting a polished result with no visible seams.

## Tools & Services Used

| Tool | Purpose |
|---|---|
| Claude (Anthropic) | AI pair-programmer for the entire build |
| Next.js 14 / React 18 / TypeScript | Application framework |
| Tailwind CSS | Styling |
| Supabase | Postgres database, Auth, Row Level Security |
| Google Gemini API | The AI Assistant feature |
| Vercel | Hosting/deployment |
| GitHub Actions | CI (lint, type-check, build on every push) |
| Zustand | Client-side state for the chat feature |
| Zod | Form and API input validation |

## What I'd Do Differently

Being honest about the review findings above — if I had more time before submission, the next things I'd fix are: add basic rate limiting to the `/api/chat` endpoint, fix the password-reset middleware bug, and build a real focus-trapped mobile drawer component instead of the current duplicated version. These are documented as known issues rather than fixed silently, because I think that's a more accurate picture of where the project actually stands.
