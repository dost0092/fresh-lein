# FreshLien

Foreclosure intelligence SaaS — marketing site, enterprise dashboard, and active foreclosure module.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app runs in **demo mode** with sample foreclosure data until Supabase is configured.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and set:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. In the Supabase SQL Editor, run `supabase/migrations/001_initial_schema.sql` (tables, RLS, county seed).
4. Enable Email auth under **Authentication → Providers**.
5. Add your site URL to **Authentication → URL Configuration** (e.g. `http://localhost:5173` for dev).

When your scraper is ready, insert rows into `foreclosure_cases` and `foreclosure_status_history`. The app will load live data automatically; until then, sample records are shown.

## MVP features

- Enterprise UI (white background, `#4257A7` primary)
- Marketing nav + auth (login, signup, forgot/reset password)
- Dashboard with stats cards
- Active foreclosures list (search, filters, pagination, CSV export)
- Foreclosure detail page with status timeline
- Updated pricing: Starter $15, Professional $25, Enterprise contact sales

## Scripts

| Command        | Description        |
|----------------|--------------------|
| `npm run dev`  | Development server |
| `npm run build`| Production build   |
| `npm run lint` | ESLint             |
