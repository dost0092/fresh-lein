# FreshLien — Complete Push & Deploy Guide

Everything you need to go from your Mac → GitHub → live production.

**Your project IDs (keep these handy):**

| Service | Value |
|---------|--------|
| GitHub repo | `https://github.com/dost0092/fresh-lein` |
| Supabase project ref | `mhodxzrbcaammqobvcnu` |
| Supabase URL | `https://mhodxzrbcaammqobvcnu.supabase.co` |

---

## Overview (do in this order)

```
1. Supabase database migrations     ← run SQL once
2. Supabase Auth (Google + URLs)    ← enable providers
3. Stripe products + secrets        ← billing
4. Deploy Stripe Edge Functions     ← checkout API
5. Stripe webhook                   ← subscription sync
6. Git commit + push to GitHub      ← save your code
7. Deploy frontend (Vercel)         ← live website
8. Update production URLs           ← Google, Supabase, Stripe
9. Test end-to-end                  ← login, data, checkout
```

---

## Part 1 — Local setup (your Mac)

### 1.1 Install dependencies

```bash
cd "/Users/mac/MY SAAS/freshlien/fresh-lein"
npm install
```

### 1.2 Environment file (never commit this)

Create `.env.local` in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://mhodxzrbcaammqobvcnu.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard

VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxx

# Optional — checkout without Edge Functions:
# VITE_STRIPE_PAYMENT_LINK_STARTER=https://buy.stripe.com/test_xxxxx
# VITE_STRIPE_PAYMENT_LINK_PRO=https://buy.stripe.com/test_xxxxx
```

**Where to find Supabase keys:**  
[Dashboard → Project Settings → API](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/settings/api)  
→ **Project URL** and **anon public** key.

### 1.3 Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Part 2 — Supabase database (run once)

Open [Supabase SQL Editor](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/sql/new).

Run these files **in order** (paste each file’s full contents → Run):

| Order | File | What it does |
|-------|------|--------------|
| 1 | `supabase/migrations/005_trials_and_stripe_billing.sql` | Users, 13-day trial, Stripe tables, super admins |
| 2 | `supabase/migrations/006_full_app_schema.sql` | Foreclosures RLS, counties, alerts, saved properties |

> If you already ran 001–004, still run 005 and 006 — they are safe/idempotent.

**Verify data exists:**

In SQL Editor:

```sql
SELECT COUNT(*) FROM foreclosure_cases;
SELECT COUNT(*) FROM counties;
SELECT COUNT(*) FROM users;
```

You should see ~2,320 foreclosures and ~63 counties.

---

## Part 3 — Supabase Auth

### 3.1 Email login (should already work)

[Authentication → Providers → Email](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/auth/providers)  
→ Ensure **Email** is enabled.

### 3.2 Google login

Full steps: **[supabase/GOOGLE_AUTH_SETUP.md](supabase/GOOGLE_AUTH_SETUP.md)**

**Short version:**

1. **Google Cloud Console** → OAuth client (Web application)
2. Redirect URI (exact):
   ```
   https://mhodxzrbcaammqobvcnu.supabase.co/auth/v1/callback
   ```
3. **Supabase → Auth → Providers → Google** → Enable + paste Client ID & Secret
4. **Auth → URL Configuration:**
   - Site URL: `http://localhost:5173` (dev) — change to production URL after deploy
   - Redirect URLs:
     ```
     http://localhost:5173/**
     http://localhost:5173/dashboard
     https://YOUR-PRODUCTION-DOMAIN.com/**
     ```

### 3.3 Super admin emails (full access, no paywall)

Already in migration 005:

- `waqasdostdost0092@gmail.com`
- `waqaskhan.dost0092@gmail.com`

To add more, run in SQL Editor:

```sql
UPDATE public.users SET is_super_admin = TRUE WHERE lower(email) = 'you@example.com';
```

---

## Part 4 — Stripe billing

Full steps: **[supabase/STRIPE_SETUP_GUIDE.md](supabase/STRIPE_SETUP_GUIDE.md)**

### 4.1 Create products (Stripe Dashboard, Test mode)

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Test mode** ON
2. **Product catalog** → create:
   - **FreshLien Starter** — $15/month recurring → copy `price_...`
   - **FreshLien Pro** — $25/month recurring → copy `price_...`
3. **Developers → API keys** → copy `sk_test_...` (secret) and `pk_test_...` (publishable)

### 4.2 Supabase Edge Function secrets

[Project Settings → Edge Functions → Secrets](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/settings/functions)

| Secret name | Value |
|-------------|--------|
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_PRICE_ID_STARTER` | `price_...` ($15) |
| `STRIPE_PRICE_ID_PRO` | `price_...` ($25) |

### 4.3 Deploy Edge Functions

Install Supabase CLI once:

```bash
brew install supabase/tap/supabase
supabase login
```

Deploy from project root:

```bash
cd "/Users/mac/MY SAAS/freshlien/fresh-lein"
chmod +x scripts/deploy-stripe-functions.sh
./scripts/deploy-stripe-functions.sh
```

Or manually:

```bash
supabase functions deploy stripe-create-checkout-session --project-ref mhodxzrbcaammqobvcnu
supabase functions deploy stripe-create-portal-session --project-ref mhodxzrbcaammqobvcnu
supabase functions deploy stripe-webhook --project-ref mhodxzrbcaammqobvcnu --no-verify-jwt
```

### 4.4 Stripe webhook (subscription status in app)

1. Stripe → **Developers → Webhooks → Add endpoint**
2. URL:
   ```
   https://mhodxzrbcaammqobvcnu.supabase.co/functions/v1/stripe-webhook
   ```
3. Events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy signing secret `whsec_...` → Supabase secret **`STRIPE_WEBHOOK_SECRET`**

### 4.5 Test checkout

1. Log in → **Billing** (`/dashboard/billing`)
2. Click **Subscribe with Stripe**
3. Card: `4242 4242 4242 4242`, any future expiry, any CVC

---

## Part 5 — Push code to GitHub

### 5.1 What NOT to commit

These must **never** go to GitHub:

- `.env.local` (real keys)
- `supabase/.temp/`

They are already in `.gitignore`.

### 5.2 Commit all changes

```bash
cd "/Users/mac/MY SAAS/freshlien/fresh-lein"

git status
git add .
git reset supabase/.temp/ 2>/dev/null || true

git commit -m "$(cat <<'EOF'
Add auth, billing, landing dashboard, and Supabase integrations.

Stripe checkout, Google OAuth support, server-paginated foreclosures,
and production deployment docs.
EOF
)"
```

### 5.3 Push to GitHub

```bash
git push origin main
```

If prompted, sign in to GitHub (HTTPS or SSH).

**Repo:** [github.com/dost0092/fresh-lein](https://github.com/dost0092/fresh-lein)

---

## Part 6 — Deploy frontend (Vercel — recommended)

Vite + React works best on **Vercel** (free tier, automatic HTTPS).

### 6.1 Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New Project** → Import `dost0092/fresh-lein`
3. Framework preset: **Vite**
4. Build settings (usually auto-detected):
   - Build command: `npm run build`
   - Output directory: `dist`
5. **Do not deploy yet** — add env vars first (step 6.2)

### 6.2 Environment variables on Vercel

In Vercel project → **Settings → Environment Variables**, add:

| Name | Value | Environments |
|------|--------|--------------|
| `VITE_SUPABASE_URL` | `https://mhodxzrbcaammqobvcnu.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | your anon key | Production, Preview, Development |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | Production, Preview, Development |

Optional Payment Links:

| Name | Value |
|------|--------|
| `VITE_STRIPE_PAYMENT_LINK_STARTER` | `https://buy.stripe.com/...` |
| `VITE_STRIPE_PAYMENT_LINK_PRO` | `https://buy.stripe.com/...` |

Click **Deploy**.

### 6.3 Custom domain (optional)

Vercel → **Settings → Domains** → add e.g. `app.freshlien.com`  
Follow DNS instructions (CNAME to `cname.vercel-dns.com`).

Your live URL will look like: `https://fresh-lein.vercel.app` or your custom domain.

---

## Part 7 — After deploy (update all URLs)

Replace `YOUR-DOMAIN` with your Vercel URL (e.g. `https://fresh-lein.vercel.app`).

### 7.1 Supabase Auth URLs

[Auth → URL Configuration](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/auth/url-configuration)

| Field | Value |
|-------|--------|
| Site URL | `https://YOUR-DOMAIN` |
| Redirect URLs | `https://YOUR-DOMAIN/**` |

### 7.2 Google Cloud Console

Add to **Authorized JavaScript origins:**

```
https://YOUR-DOMAIN
```

Keep redirect URI as Supabase callback (unchanged):

```
https://mhodxzrbcaammqobvcnu.supabase.co/auth/v1/callback
```

### 7.3 Stripe (when going live)

1. Switch Stripe to **Live mode**
2. Create live products/prices
3. Update Supabase secrets with live keys (`sk_live_...`, live `price_...`)
4. Add live webhook endpoint (same Supabase URL)
5. Update Vercel env: `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...`

---

## Part 8 — Production test checklist

Run through on your **live URL**:

- [ ] Landing page loads (`/`)
- [ ] Register with email + password
- [ ] Login with email
- [ ] Google login works
- [ ] Dashboard shows landing-style home (`/dashboard`)
- [ ] Foreclosures list loads with data (`/dashboard/foreclosures`)
- [ ] Map view works
- [ ] Log out works → redirects to login
- [ ] Logo goes to dashboard (when logged in)
- [ ] Products dropdown opens
- [ ] Billing / Stripe checkout opens
- [ ] After test payment, subscription shows active (webhook)
- [ ] Super admin bypasses paywall

---

## Quick reference — all env vars

### Frontend (`.env.local` + Vercel)

| Variable | Required | Where |
|----------|----------|--------|
| `VITE_SUPABASE_URL` | Yes | Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase → Settings → API |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe → Developers → API keys |
| `VITE_STRIPE_PAYMENT_LINK_STARTER` | Optional | Stripe → Payment Links |
| `VITE_STRIPE_PAYMENT_LINK_PRO` | Optional | Stripe → Payment Links |

### Supabase Edge Function secrets (server only)

| Secret | Required |
|--------|----------|
| `STRIPE_SECRET_KEY` | Yes |
| `STRIPE_PRICE_ID_STARTER` | Yes |
| `STRIPE_PRICE_ID_PRO` | Yes |
| `STRIPE_WEBHOOK_SECRET` | Yes (for subscription sync) |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Google: `provider is not enabled` | Enable Google in Supabase Auth providers |
| Google: `redirect_uri_mismatch` | Redirect URI must be Supabase callback URL exactly |
| Stripe: Missing price for starter | Add `STRIPE_PRICE_ID_STARTER` in Supabase secrets |
| Stripe: function not found | Run `./scripts/deploy-stripe-functions.sh` |
| Dashboard empty / no data | Run migration 006; check RLS |
| Paywall when you should be admin | Log in with super admin email; run migration 005 |
| 404 on refresh (production) | `vercel.json` rewrites are included — redeploy Vercel |
| Env vars not working on Vercel | Must start with `VITE_`; redeploy after adding |

---

## Related docs in this repo

| File | Topic |
|------|--------|
| [supabase/GOOGLE_AUTH_SETUP.md](supabase/GOOGLE_AUTH_SETUP.md) | Google OAuth step-by-step |
| [supabase/STRIPE_SETUP_GUIDE.md](supabase/STRIPE_SETUP_GUIDE.md) | Stripe products + secrets |
| [supabase/STRIPE_TEST_SETUP.md](supabase/STRIPE_TEST_SETUP.md) | Stripe test cards + webhook |
| [README.md](README.md) | Dev quick start |

---

## One-page command cheat sheet

```bash
# Local dev
npm install && npm run dev

# Build (test before deploy)
npm run build

# Git push
git add .
git commit -m "Your message"
git push origin main

# Deploy Stripe functions
./scripts/deploy-stripe-functions.sh
```

After Vercel connects to GitHub, every `git push origin main` **auto-deploys** the website.
