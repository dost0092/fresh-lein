# Stripe setup — step by step (FreshLien)

Your Supabase project: **mhodxzrbcaammqobvcnu**

You saw: `Missing Stripe price for plan "starter". Set STRIPE_PRICE_ID_STARTER...`  
That means the **Edge Function is deployed** but **secrets are not set yet**. Follow these steps in order.

---

## Part A — Create prices in Stripe (5 minutes)

1. Open [https://dashboard.stripe.com](https://dashboard.stripe.com) and log in.
2. Turn **Test mode** ON (toggle top-right — should say “Test mode”).
3. Go to **Product catalog** → **+ Add product**.

### Starter plan ($15/mo)

4. Name: `FreshLien Starter`
5. Description: optional
6. Under **Pricing**, choose **Recurring** → **Monthly** → **$15.00 USD**
7. Click **Save product**
8. Open the product → under **Pricing**, copy the **Price ID** (starts with `price_...`)  
   Example: `price_1ABC123xyz...`  
   **Save this — this is `STRIPE_PRICE_ID_STARTER`**

### Pro plan ($25/mo)

9. **+ Add product** again
10. Name: `FreshLien Pro`
11. Recurring → Monthly → **$25.00 USD**
12. Save and copy the **Price ID** → **`STRIPE_PRICE_ID_PRO`**

### API keys

13. Go to **Developers** → **API keys**
14. Copy **Publishable key** (`pk_test_...`) → already in your `.env.local` as `VITE_STRIPE_PUBLISHABLE_KEY`
15. Click **Reveal** on **Secret key** (`sk_test_...`) → you will paste this in Supabase as `STRIPE_SECRET_KEY`  
    **Never put the secret key in `.env.local` or commit it to git.**

---

## Part B — Add secrets in Supabase (3 minutes)

1. Open [https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/settings/functions](https://supabase.com/dashboard/project/mhodxzrbcaammqobvcnu/settings/functions)
2. Scroll to **Edge Function Secrets**
3. Click **Add new secret** for each row:

| Name | Value |
|------|--------|
| `STRIPE_SECRET_KEY` | `sk_test_...` from Stripe |
| `STRIPE_PRICE_ID_STARTER` | `price_...` for $15 plan |
| `STRIPE_PRICE_ID_PRO` | `price_...` for $25 plan |

4. Save each secret.

Secrets are picked up automatically — you do **not** need to redeploy the function after adding secrets (Supabase injects them at runtime).

---

## Part C — Test checkout in the app

1. Restart dev server if running: `npm run dev`
2. Log in to FreshLien
3. Go to **Billing** (`/dashboard/billing`)
4. Choose **Starter $15/mo** or **Pro $25/mo**
5. Click **Subscribe with Stripe**
6. On Stripe Checkout use test card:
   - Number: `4242 4242 4242 4242`
   - Expiry: any future date
   - CVC: any 3 digits
   - ZIP: any 5 digits
7. After payment you return to Billing with a success message.

---

## Part D — Webhook (so subscription shows “Active”)

Without a webhook, payment succeeds in Stripe but your app may still show “Trial” until you add this:

1. Stripe → **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL:
   ```
   https://mhodxzrbcaammqobvcnu.supabase.co/functions/v1/stripe-webhook
   ```
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Click **Add endpoint**
5. Open the endpoint → **Signing secret** → Reveal → copy `whsec_...`
6. Supabase → Edge Function Secrets → add:
   - Name: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...`
7. Ensure `stripe-webhook` function is deployed with **JWT verification OFF** (see deploy script below).

---

## Part E — Deploy Edge Functions (if checkout says “not found”)

If you get “function not found” instead of “missing price”, deploy from your project folder:

```bash
# Install Supabase CLI once: https://supabase.com/docs/guides/cli
supabase login
supabase functions deploy stripe-create-checkout-session --project-ref mhodxzrbcaammqobvcnu
supabase functions deploy stripe-create-portal-session --project-ref mhodxzrbcaammqobvcnu
supabase functions deploy stripe-webhook --project-ref mhodxzrbcaammqobvcnu --no-verify-jwt
```

Or run: `./scripts/deploy-stripe-functions.sh`

---

## Faster alternative — Payment Links (no Edge Functions)

If you want checkout working **without** deploying functions:

1. Stripe → **Payment Links** → **+ New**
2. Select your **Starter** product → create link → copy URL
3. Repeat for **Pro**
4. Add to `.env.local`:
   ```
   VITE_STRIPE_PAYMENT_LINK_STARTER=https://buy.stripe.com/test_xxxxx
   VITE_STRIPE_PAYMENT_LINK_PRO=https://buy.stripe.com/test_xxxxx
   ```
5. Restart `npm run dev` — checkout opens Stripe directly.

Note: Payment Links do not auto-update `subscriptions` in Supabase unless you configure webhooks separately.

---

## Troubleshooting

| Message | Fix |
|---------|-----|
| Missing Stripe price for plan "starter" | Add `STRIPE_PRICE_ID_STARTER` in Supabase secrets (Part B) |
| Stripe checkout unavailable / 404 | Deploy functions (Part E) or use Payment Links |
| Payment works but status stays inactive | Add webhook (Part D) |
| 401 Unauthorized | Log in first, then try checkout again |
