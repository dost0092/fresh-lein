import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const INVOKE_TIMEOUT_MS = 20000;

function withTimeout(promise, ms = INVOKE_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Stripe request timed out. Check your connection or deploy Edge Functions.')), ms);
    }),
  ]);
}

async function parseInvokeError(error, data) {
  if (data?.error) return new Error(String(data.error));
  if (data?.code === 'NOT_FOUND' || data?.message?.includes('not found')) {
    return new Error(
      'Stripe checkout function is not deployed. Add Payment Links in .env.local (VITE_STRIPE_PAYMENT_LINK_STARTER) or run: supabase functions deploy stripe-create-checkout-session'
    );
  }

  if (error) {
    try {
      const ctx = error.context;
      if (ctx && typeof ctx.json === 'function') {
        const body = await ctx.json();
        if (body?.error) return new Error(String(body.error));
        if (body?.message) return new Error(String(body.message));
        if (body?.code === 'NOT_FOUND') {
          return new Error(
            'Stripe checkout is not deployed. Set VITE_STRIPE_PAYMENT_LINK_STARTER in .env.local or deploy Edge Functions.'
          );
        }
      }
    } catch {
      /* ignore */
    }

    const msg = error.message || '';
    if (msg.includes('Failed to send') || msg.includes('NOT_FOUND') || msg.includes('non-2xx')) {
      return new Error(
        'Stripe checkout unavailable. Add VITE_STRIPE_PAYMENT_LINK_STARTER to .env.local (Stripe Dashboard → Payment Links), or deploy Edge Functions.'
      );
    }
    return new Error(msg || 'Billing request failed.');
  }

  return new Error('Billing request failed.');
}

export async function createStripeCheckoutSession({ planId = 'starter', successUrl, cancelUrl } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('Configure Supabase first (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  }

  const invokePromise = supabase.functions.invoke('stripe-create-checkout-session', {
    body: {
      planId,
      successUrl: successUrl ?? `${window.location.origin}/dashboard/billing?checkout=success&plan=${planId}`,
      cancelUrl: cancelUrl ?? `${window.location.origin}/dashboard/billing?checkout=cancel&plan=${planId}`,
    },
  });

  const { data, error } = await withTimeout(invokePromise);

  if (error) throw await parseInvokeError(error, data);
  if (data?.error) throw new Error(data.error);

  const checkoutUrl = data?.url;
  const sessionId = data?.sessionId;

  if (!checkoutUrl && !sessionId) {
    throw new Error(
      'Stripe session not created. Set Payment Link env vars or deploy Edge Functions with STRIPE_PRICE_ID_STARTER.'
    );
  }

  return { sessionId, url: checkoutUrl };
}

export async function createStripePortalUrl() {
  if (!isSupabaseConfigured) {
    throw new Error('Configure Supabase first (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  }

  const { data, error } = await withTimeout(
    supabase.functions.invoke('stripe-create-portal-session', {
      body: {
        returnUrl: `${window.location.origin}/dashboard/billing`,
      },
    })
  );

  if (error) throw await parseInvokeError(error, data);
  if (data?.error) throw new Error(data.error);
  if (!data?.url) throw new Error('Stripe portal session not created.');
  return data.url;
}

export function isStripeTestMode() {
  const key = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim();
  return key.startsWith('pk_test_');
}
