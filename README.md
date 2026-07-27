<div align="center">

# CrimInsight AI

**An AI-powered study assistant for criminology students.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E)](https://supabase.com)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

### 🔗 [**Live App — try it here**](https://REPLACE-WITH-YOUR-VERCEL-URL.vercel.app)

</div>

---

## Problem Statement

I'm in my final semester of a Master's in Criminology, and I also teach as visiting faculty in the same department — so I run into this problem from both sides. As a student, I've lost countless late-night hours re-reading dense theoretical papers, trying to work out which theory actually explains a given case study, and drafting interview guides for research methods coursework with no one around to ask "does this actually hold up, or am I missing something?" As faculty, I see the same handful of questions come up in office hours every semester — Strain Theory vs. Social Disorganization Theory, why a case fits Routine Activity Theory, how to structure a research interview for a victim versus an offender — because students have nowhere to quickly check their understanding outside of scheduled office hours. Generic AI chatbots don't really solve this either: they'll confidently invent a citation or flatten a genuinely contested academic debate into a tidy, wrong answer.

## Solution

CrimInsight AI is the tool I wished existed on both sides of my desk. At its core is an AI assistant that behaves like a careful criminology professor rather than a generic chatbot — it explains concepts in plain English before layering in academic terminology, actively flags uncertainty instead of guessing, refuses to invent citations, and pushes students toward critical thinking rather than just handing over conclusions. Wrapped around that assistant is a real, deployed web application with proper user accounts, persistent conversation history, and a production-grade foundation — built as the applied project for my AI course this semester, where the brief was to ship something that actually works end to end, not a notebook demo.

## Features

- 🔐 **Full authentication** — signup, login, logout, forgot/reset password, protected dashboard, persistent sessions
- 💬 **Ask AI** — real-time streaming chat with a criminology-professor-grade system prompt
- 🎨 **Modern glassmorphic UI** — blue/white theme, rounded cards, fully responsive across mobile/tablet/desktop
- ♿ **Accessible by design** — visible focus states, `aria-live` regions, keyboard-navigable menus and modals, labeled form controls
- 🗄️ **Row-Level-Security-backed database** — every table enforces per-user data isolation at the database layer, not just in application code
- 🛡️ **Production hardening** — error boundaries, custom 404, security headers, SEO metadata, CI pipeline

> Additional study tools (Research Summary, Case Study Analysis, Interview Question Generator, Quiz Generator, Saved Notes) are planned as dedicated pages built on the same AI infrastructure — see [Future Improvements](#future-improvements).

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS |
| Backend | Next.js API Routes & Server Actions |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Authentication | Supabase Auth (email/password, session cookies) |
| AI | Google Gemini API (`@google/generative-ai`), streaming responses |
| State Management | Zustand |
| Validation | Zod |
| Hosting | Vercel |
| CI | GitHub Actions |

## AI Features

The assistant is powered by the Google Gemini API and is designed around six core academic use cases:

1. **Answering criminology questions** — definitions, comparisons, historical context, key scholars
2. **Explaining theories in simple language** — core idea → key thinkers → concrete example → critiques
3. **Analyzing crime case studies** — connects real/hypothetical cases back to relevant theory
4. **Generating research interview questions** — categorized (rapport-building, core, sensitive, closing), trauma-informed by default
5. **Summarizing research articles** — overview, key findings, methodology notes, limitations
6. **Generating quizzes** — multiple-choice with explanations, grounded strictly in the given topic/source

Responses stream token-by-token to the browser and render as formatted Markdown (headings, bold key terms, lists) via `react-markdown`.

## System Prompt

The assistant's behavior is governed by a single, carefully written system prompt (`src/lib/gemini/prompts.ts`) that establishes an **experienced criminology professor** persona with a strict anti-hallucination policy. Key excerpt:

```
You are an experienced criminology professor acting as the AI Study
Assistant inside CrimInsight AI...

## The single most important rule: never hallucinate
This overrides every other instruction in this prompt.
- Never invent facts, statistics, case details, dates, or study findings.
- Never fabricate citations, references, journal names, page numbers, or
  quotes. If unsure of exact details, say so plainly and point the
  student to a real source (Google Scholar, JSTOR, their library).
- State your uncertainty whenever the evidence is weak, contested, or
  you are simply unsure.

## How you explain things
- Simple English first — plain language any first-year student could
  follow.
- Academic language when it matters — precise scholarly terminology
  layered in once the core idea is clear.

## Encourage critical thinking — always
- Surface competing theoretical explanations and their critiques.
- Don't just hand over conclusions — explain the reasoning and the
  debate behind it.
```

The full prompt also defines specific output formats for each of the six AI features listed above, plus explicit boundaries (no operational crime instructions, no fabricated references, academic register only, Pakistani-context awareness when asked, international examples when useful). See the complete prompt in [`src/lib/gemini/prompts.ts`](./src/lib/gemini/prompts.ts).

## Installation

### Prerequisites

- Node.js **18.18+** (Node 20 recommended)
- A free [Supabase](https://supabase.com) account
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)
- Git

### Clone and install dependencies

```bash
git clone https://github.com/your-org/criminsight-ai.git
cd criminsight-ai
npm install
```

### Set up the database

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run each file in `supabase/migrations/` **in order**:
   - `0001_profiles_and_auth.sql`
   - `0002_chat.sql`
3. Under **Authentication → URL Configuration**, add `http://localhost:3000/api/auth/callback` to the redirect allow-list for local development.

## Environment Variables

Copy the example file and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|:---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL (Project Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | optional | Reserved for future server-only routes — not used yet, never expose to the browser |
| `GEMINI_API_KEY` | ✅ | Your Google Gemini API key |
| `GEMINI_MODEL` | optional | Defaults to `gemini-1.5-flash` |
| `NEXT_PUBLIC_APP_URL` | ✅ | `http://localhost:3000` locally; your live domain in production |

`.env.local` is already excluded via `.gitignore` — it will never be committed.

## How to Run

```bash
# Start the local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up for an account, confirm your email (Supabase sends a real confirmation email), log in, and try **Ask AI**.

| Script | Purpose |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript with no output |
| `npm run format` | Run Prettier (auto-sorts Tailwind classes) |

## Deployment

CrimInsight AI is designed to deploy to **Vercel** in minutes, with Supabase as the managed backend. Full step-by-step instructions — production Supabase setup, environment variables, custom domains, and a post-deploy checklist — are in **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

Quick version:

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables listed above in the Vercel dashboard.
4. Deploy — Vercel auto-detects Next.js, no configuration needed.
5. Update `NEXT_PUBLIC_APP_URL` and your Supabase redirect URLs to the live domain, then redeploy.

GitHub Actions (`.github/workflows/ci.yml`) automatically lints, type-checks, and builds every push and pull request against `main`.

## Screenshots

> Screenshots will be added here once the remaining pages (Research Summary, Case Study Analysis, Quiz Generator, etc.) are built out.

| Landing Page | Ask AI | Dashboard |
|---|---|---|
| `screenshots/landing.png` | `screenshots/ask-ai.png` | `screenshots/dashboard.png` |

| Login | Signup |
|---|---|
| `screenshots/login.png` | `screenshots/signup.png` |


## Development Process

This app was built through an iterative, conversational process with **Claude (Anthropic)** as an AI pair-programmer — architecture and planning first, then implementation step by step, verified at each stage (type-checking, linting, and real production builds), with a dedicated round of self-review afterward to find and document security, performance, and accessibility issues before submission. The full step-by-step account — what was built in what order, what tools were used, what I'd do differently — is in **[BUILD_PROCESS.md](./BUILD_PROCESS.md)**.

## Author

Built by **[Brikhna]** — Master's student in Criminology (final semester) and visiting faculty in the same department.
This project was built for my AI course, applying AI-assisted development to a problem I experience directly on both sides of the classroom.
Reach out — Brikhnay@gmail.com · [GitHub](https://github.com/brikhnay-debug) · [LinkedIn]www.linkedin.com/in/brikhna-noor-514a9527b

## License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.
