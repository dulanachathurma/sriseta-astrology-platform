# Deployment Guide

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 2. Deploy to Vercel

1. Go to https://vercel.com/new and import the GitHub repository.
2. Vercel auto-detects the Vite framework from `vercel.json` — no manual
   configuration is required:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
3. The `api/` folder is automatically deployed as Vercel Serverless
   Functions — no separate backend hosting is needed.
4. (Optional) Add environment variables under **Project Settings → Environment
   Variables** if you want to override defaults:
   - `HOROSCOPE_SOURCE_URL`
   - `HOROSCOPE_CACHE_SECONDS`
   - `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` (for the AI
     Assistant, once you wire a provider in `api/assistant.js`)
5. Click **Deploy**.

Every subsequent push to `main` redeploys automatically.

## 3. Verify after deploy

- `https://<your-project>.vercel.app/` — site loads, splash screen plays.
- `https://<your-project>.vercel.app/api/weekly-horoscope` — returns JSON.
- `https://<your-project>.vercel.app/api/assistant` (POST) — returns a reply.

## Local production build check

```bash
npm run build
npm run preview
```

This serves the built `dist/` folder locally so you can sanity-check the
production bundle before deploying. Note that `/api` routes only run under
`vercel dev` or on Vercel itself — `vite preview` serves the frontend only.

## Custom domain

Add it under **Project Settings → Domains** in the Vercel dashboard; no code
changes are required.
