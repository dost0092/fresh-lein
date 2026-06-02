# FreshLien

Foreclosure intelligence SaaS — marketing site, enterprise dashboard, and active foreclosure module.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Requires Supabase in `.env.local` for auth and live foreclosure data.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and set:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. In the Supabase SQL Editor, run `supabase/migrations/001_initial_schema.sql` (tables, RLS, county seed).
4. Enable Email auth under **Authentication → Providers**.
5. (Optional) Enable **Google** under **Authentication → Providers**.
6. Add your site URL to **Authentication → URL Configuration** (e.g. `http://localhost:5173` for dev).
7. Run migrations in Supabase SQL Editor (in order):
   - `005_trials_and_stripe_billing.sql` (users, trial, Stripe)
   - `006_full_app_schema.sql` (foreclosures RLS, saved properties, alerts — **run this if you skipped 001–004**)
8. Copy `.env.example` → `.env.local` and set your Supabase + Stripe test keys.

**Full production deploy guide:** see **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** (GitHub push, Vercel, Google, Stripe, webhooks).

## Stripe setup (subscriptions after 13-day trial)

1. Create a Stripe product + recurring price and copy the **Price ID**.
2. Set `VITE_STRIPE_PUBLISHABLE_KEY` in `.env.local`.
3. For Supabase Edge Functions, set secrets:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID`

4. Deploy Edge Functions (see **[supabase/STRIPE_TEST_SETUP.md](supabase/STRIPE_TEST_SETUP.md)** for full test flow).

5. Test checkout at `/dashboard/billing` with card `4242 4242 4242 4242`.

Live foreclosure data is loaded by the **[freshlien-crawler](../freshlien-crawler)** service. The app reads `foreclosure_cases` from Supabase.

## MVP features

- Enterprise UI (white background, brand green primary)
- Supabase auth (email/password + Google), forgot/reset password
- 13-day trial gate → Stripe subscription checkout on expiry
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
