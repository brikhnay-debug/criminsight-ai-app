# Deployment Guide

This guide walks through taking CrimInsight AI from your local machine to a live production URL on Vercel, with a GitHub repository for version control and CI.

---

## 1. Push to GitHub

If you haven't already initialized a repository:

```bash
cd criminsight-ai
git init
git add .
git commit -m "Initial commit: CrimInsight AI"
```

Create a new **empty** repository on GitHub (do not initialize it with a README — you already have one), then:

```bash
git remote add origin https://github.com/your-org/criminsight-ai.git
git branch -M main
git push -u origin main
```

Once pushed, the included GitHub Actions workflow (`.github/workflows/ci.yml`) will automatically run lint, type-check, and a production build on every push and pull request against `main`. Check the **Actions** tab on GitHub to confirm it's green before deploying.

> **Never commit `.env.local`.** It's already listed in `.gitignore` — double check with `git status` before your first commit that it isn't staged.

---

## 2. Set Up Supabase (Production Project)

You can reuse the same Supabase project from local development, or create a fresh one for production — either works. If creating a new one:

1. Go to [supabase.com](https://supabase.com) → **New Project**.
2. Once it's provisioned, open the **SQL Editor** and run, in order:
   - `supabase/migrations/0001_profiles_and_auth.sql`
   - `supabase/migrations/0002_chat.sql`
3. Under **Authentication → URL Configuration**, set:
   - **Site URL**: `https://your-domain.vercel.app` (or your custom domain)
   - **Redirect URLs**: add `https://your-domain.vercel.app/api/auth/callback`
4. Under **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3. Get a Gemini API Key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Create an API key.
3. Keep it secret — you'll paste it into Vercel's environment variables, never into client-side code.

---

## 4. Deploy to Vercel

### Option A — Vercel Dashboard (recommended for first deploy)

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
2. Vercel auto-detects Next.js — no build settings need to change.
3. Before deploying, expand **Environment Variables** and add:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `GEMINI_API_KEY` | Your Gemini API key |
   | `GEMINI_MODEL` | `gemini-1.5-flash` (optional) |
   | `NEXT_PUBLIC_APP_URL` | Leave blank for now — see step 5 |

4. Click **Deploy**.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add GEMINI_API_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
vercel --prod
```

---

## 5. Set `NEXT_PUBLIC_APP_URL` and Redeploy

After your first deploy, Vercel gives you a URL like `https://criminsight-ai.vercel.app`.

1. Go to **Project Settings → Environment Variables** and set `NEXT_PUBLIC_APP_URL` to that URL (or your custom domain once attached).
2. Go back to Supabase → **Authentication → URL Configuration** and make sure the Site URL / Redirect URLs match this exact URL (including `https://`, no trailing slash) — otherwise email confirmation and password reset links will redirect incorrectly.
3. Trigger a redeploy in Vercel (**Deployments → ⋯ → Redeploy**) so the new env var takes effect — env var changes don't apply to already-built deployments.

---

## 6. (Optional) Attach a Custom Domain

1. In Vercel: **Project Settings → Domains → Add**.
2. Follow Vercel's instructions to point your DNS (usually a `CNAME` or `A` record) at Vercel.
3. Once verified, update `NEXT_PUBLIC_APP_URL` and your Supabase redirect URLs to the custom domain, and redeploy.

---

## 7. Post-Deploy Checklist

- [ ] Sign up for a new account on the live URL and confirm you receive the confirmation email
- [ ] Log in and confirm the dashboard loads
- [ ] Send a message in **Ask AI** and confirm it streams a response
- [ ] Refresh the page mid-session and confirm you're still logged in (session persistence)
- [ ] Log out and confirm you're redirected and can no longer access `/dashboard` directly
- [ ] Check the browser console and Vercel's **Logs** tab for unexpected errors

## 8. Ongoing Deploys

Every push to `main` that passes CI will auto-deploy via Vercel's GitHub integration. For safer releases, consider working in feature branches and merging via pull request — Vercel automatically creates a **preview deployment** for every PR so you can test changes before they hit production.
