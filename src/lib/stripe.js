import { loadStripe } from '@stripe/stripe-js';

let stripePromise = null;

export function getStripe() {
  const key = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim();
  if (!key) return null;

  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

