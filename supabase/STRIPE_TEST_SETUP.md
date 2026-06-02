# Stripe test setup (FreshLien)

## 1. Stripe Dashboard (test mode)

1. Turn on **Test mode** in Stripe.
2. Create products with recurring prices:
   - **Starter** — $15/month → copy `price_...` to `STRIPE_PRICE_ID_STARTER`
   - **Professional** — $25/month → copy `price_...` to `STRIPE_PRICE_ID_PRO`
3. (Optional fallback) `STRIPE_PRICE_ID` used if plan-specific IDs are missing.
4. Copy **Publishable key** (`pk_test_...`) → `.env.local` as `VITE_STRIPE_PUBLISHABLE_KEY`.
5. Copy **Secret key** (`sk_test_...`) → Supabase secrets (never in the frontend).

## 2. Supabase Edge Function secrets

In **Supabase Dashboard → Project Settings → Edge Functions → Secrets**, set:

| Secret | Example |
|--------|---------|
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_PRICE_ID_STARTER` | `price_...` ($15 plan) |
| `STRIPE_PRICE_ID_PRO` | `price_...` ($25 plan) |
| `STRIPE_PRICE_ID` | optional fallback |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (after step 4) |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are usually provided automatically.

## 3. Deploy functions (required — without this, checkout shows "Opening Stripe" forever)

From the project root (with [Supabase CLI](https://supabase.com/docs/guides/cli) installed):

```bash
chmod +x scripts/deploy-stripe-functions.sh
./scripts/deploy-stripe-functions.sh
```

Or manually:

```bash
supabase functions deploy stripe-create-checkout-session --project-ref mhodxzrbcaammqobvcnu
supabase functions deploy stripe-create-portal-session --project-ref mhodxzrbcaammqobvcnu
supabase functions deploy stripe-webhook --project-ref mhodxzrbcaammqobvcnu --no-verify-jwt
```

The app redirects using the **Checkout Session URL** (not `redirectToCheckout`, which was removed in Stripe.js v5).

Or deploy each function from the Supabase Dashboard → Edge Functions → Deploy.

**Note:** Checkout/portal require a logged-in user (JWT). Only the **webhook** should disable JWT verification.

## 4. Stripe webhook (test)

1. Stripe → **Developers → Webhooks → Add endpoint**
2. URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
3. Events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET` in Supabase.

For local webhook testing use [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook
```

## 5. Test in the app

1. Log in (not super admin if you want to test paywall).
2. Go to **Billing** (`/dashboard/billing`).
3. Click **Test checkout** / **Subscribe now**.
4. Pay with: `4242 4242 4242 4242`, any future date, any CVC.
5. After redirect, subscription status should become `active` (webhook may take a few seconds).

## Troubleshooting

| Error | Fix |
|-------|-----|
| Edge Function not found | Deploy functions (step 3) |
| Missing STRIPE_PRICE_ID | Set secret + redeploy |
| Checkout works but status stays inactive | Configure webhook (step 4) |
| 401 on checkout | Log in first; ensure anon key + session are valid |
