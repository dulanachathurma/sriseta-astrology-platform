# ශ්‍රී සෙත ජ්‍යොතිෂ සේවය — React + Vite

A premium, animated React rebuild of the Sri Seta Astrology site. All original
Sinhala content is preserved exactly; only the UI, UX, animations, performance
and code structure were modernized.

<img width="1422" height="794" alt="Screenshot 2026-07-04 at 16 35 01" src="https://github.com/user-attachments/assets/e0f0db6c-e883-4b9b-95b5-f78b9e5c4028" />

<img width="1422" height="750" alt="Screenshot 2026-07-04 at 16 32 07" src="https://github.com/user-attachments/assets/3f11a4dd-7a99-4384-ab24-7bcb159b7f68" />


<img width="1414" height="760" alt="Screenshot 2026-07-04 at 16 44 58" src="https://github.com/user-attachments/assets/3f45a074-bab3-488a-b06e-a96ee63b8c77" />

<img width="1422" height="794" alt="Screenshot 2026-07-04 at 16 33 08" src="https://github.com/user-attachments/assets/df35e07c-c708-42c7-9fc4-c2b016135622" />

<img width="1422" height="794" alt="Screenshot 2026-07-04 at 16 32 20" src="https://github.com/user-attachments/assets/38375849-3cd5-4234-8dd2-20b70414aa06" />

<img width="1422" height="794" alt="Screenshot 2026-07-04 at 16 33 14" src="https://github.com/user-attachments/assets/4dae6b70-2f56-4209-aebf-546fd88366b8" />




## Stack

React 19 · Vite · React Router · Tailwind CSS · Framer Motion · Lucide React ·
Axios · Cheerio (serverless scraper) · Vercel Serverless Functions

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Project structure

```
api/                     Vercel serverless functions
  weekly-horoscope.js    Scrapes divaina.lk with axios + cheerio
  assistant.js           Connection-ready stub for the AI Assistant widget
public/
  images/                Drop your real photos here (see README inside)
  logo.png, favicon.png  Splash screen logo / browser tab icon
src/
  assets/                Bundled/imported assets
  components/            Reusable UI components
  pages/                 Route-level pages (Home, ...)
  data/                  Static content (lagna data, developer info)
  hooks/                 Custom hooks
  services/              Frontend API clients (axios)
  utils/                 Constants + small pure helpers
  context/               Reserved for future global state
```

## Replacing images

All images have graceful `onError` placeholder fallbacks, so the site never
breaks with missing assets. Drop your real files into `public/images/` (see
`public/images/README.md` for exact filenames) and replace `public/logo.png`,
`public/favicon.png`, `public/og-image.jpg`.

## Weekly horoscope ("සතියේ පලාපල")

`GET /api/weekly-horoscope` scrapes the latest article from
`https://www.divaina.lk/nakatha/84589` live — no horoscope text is hardcoded
anywhere in the codebase. The function:

- Fetches the page with Axios and parses it with Cheerio.
- Filters out navigation, ads and related-article noise.
- Groups paragraphs under each of the 12 rashi names.
- Caches results in-memory for `HOROSCOPE_CACHE_SECONDS` (default 1 hour) and
  sets a matching `Cache-Control` header, so Vercel's edge network also caches
  the response.
- Falls back to the last good cached copy if a fetch fails, and returns a
  clear `error` field if the page's markup ever changes enough to break the
  heuristic parser.

If Divaina's markup changes significantly, adjust the CSS selectors in
`api/weekly-horoscope.js` (`extractArticleText`) — the frontend component
(`src/components/WeeklyHoroscope.jsx`) needs no changes.

## AI Assistant

`src/components/AIAssistant.jsx` is a fully working floating chat widget UI.
It posts messages to `/api/assistant`, which currently replies with a
friendly "not configured yet" message. To connect a real model, add the
relevant API key as an environment variable in your Vercel project
(`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `GEMINI_API_KEY`) and fill in the
commented-out fetch call in `api/assistant.js`.

## Environment variables

See `.env.example`. None are required for local development — the weekly
horoscope and AI assistant stub both work out of the box.

## Deployment

See `DEPLOYMENT.md`.
