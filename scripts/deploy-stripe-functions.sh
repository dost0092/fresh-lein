#!/usr/bin/env bash
# Deploy Stripe Edge Functions to Supabase (run once, or after code changes)
set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-mhodxzrbcaammqobvcnu}"

if ! command -v supabase >/dev/null 2>&1; then
  echo "Install Supabase CLI: https://supabase.com/docs/guides/cli"
  echo "  brew install supabase/tap/supabase"
  exit 1
fi

echo "Deploying to project ${PROJECT_REF}..."
supabase functions deploy stripe-create-checkout-session --project-ref "$PROJECT_REF"
supabase functions deploy stripe-create-portal-session --project-ref "$PROJECT_REF"
supabase functions deploy stripe-webhook --project-ref "$PROJECT_REF" --no-verify-jwt

echo "Done. Set secrets in Dashboard → Edge Functions → Secrets:"
echo "  STRIPE_SECRET_KEY, STRIPE_PRICE_ID_STARTER, STRIPE_PRICE_ID_PRO, STRIPE_WEBHOOK_SECRET"
