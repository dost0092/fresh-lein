/** Plan ids used in URLs and Stripe checkout (must match pricingPlans + Edge Function secrets). */
export const CHECKOUT_PLAN_IDS = ['starter', 'pro'];

export function isCheckoutPlanId(value) {
  return CHECKOUT_PLAN_IDS.includes(value);
}

export const CHECKOUT_PLAN_LABELS = {
  starter: 'Starter ($15/mo)',
  pro: 'Professional ($25/mo)',
};

/** Optional Stripe Payment Links (Dashboard → Payment Links) — works without Edge Functions */
export function getStripePaymentLink(planId) {
  const key =
    planId === 'starter'
      ? 'VITE_STRIPE_PAYMENT_LINK_STARTER'
      : planId === 'pro'
        ? 'VITE_STRIPE_PAYMENT_LINK_PRO'
        : null;
  if (!key) return null;
  const url = (import.meta.env[key] || '').trim();
  return url || null;
}
