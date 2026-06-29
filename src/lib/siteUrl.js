/** Production site URL from Vercel env (e.g. https://freshlien.com). */
function configuredSiteOrigin() {
  const raw = import.meta.env.VITE_PUBLIC_SITE_URL || import.meta.env.VITE_SITE_URL;
  if (!raw) return null;
  try {
    return new URL(String(raw).trim()).origin;
  } catch {
    return null;
  }
}

/** Origin used in OAuth and email confirmation links sent to Supabase. */
export function getSiteOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return configuredSiteOrigin() || '';
}
