import { getSiteOrigin } from '@/lib/siteUrl';

/** Single entry point for the product app (search, map, filters). */
export const APP_HOME = '/dashboard/foreclosures';

/** Supabase OAuth redirect target (must be whitelisted in Supabase Auth URL config). */
export const AUTH_CALLBACK = '/auth/callback';

export function authCallbackUrl() {
  const origin = getSiteOrigin();
  return `${origin}${AUTH_CALLBACK}`;
}

export function pathFromRedirectUrl(redirectTo) {
  try {
    const url = new URL(redirectTo, getSiteOrigin() || window.location.origin);
    return `${url.pathname}${url.search}` || APP_HOME;
  } catch {
    return APP_HOME;
  }
}
