import { createStripeCheckoutSession } from '@/lib/billing';
import { getStripePaymentLink, isCheckoutPlanId } from '@/lib/checkoutPlans';

/**
 * Redirect to Stripe Checkout (Payment Link fallback, or Edge Function session URL).
 */
export async function startPlanCheckout(planId) {
  if (!isCheckoutPlanId(planId)) {
    throw new Error('Invalid plan selected.');
  }

  const paymentLink = getStripePaymentLink(planId);
  if (paymentLink) {
    window.location.assign(paymentLink);
    return;
  }

  const publishableKey = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim();
  if (!publishableKey) {
    throw new Error('Add VITE_STRIPE_PUBLISHABLE_KEY to .env.local');
  }

  const { url } = await createStripeCheckoutSession({
    planId,
    successUrl: `${window.location.origin}/dashboard/billing?checkout=success&plan=${planId}`,
    cancelUrl: `${window.location.origin}/dashboard/billing?checkout=cancel&plan=${planId}`,
  });

  if (!url) {
    throw new Error(
      'Stripe checkout URL missing. Add VITE_STRIPE_PAYMENT_LINK_STARTER in .env.local, or deploy the stripe-create-checkout-session Edge Function.'
    );
  }

  window.location.assign(url);
}
