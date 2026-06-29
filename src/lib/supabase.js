import { createClient } from '@supabase/supabase-js';

function normalizeEnvValue(value) {
  if (value == null) return '';
  const v = String(value).trim();
  // Vercel env values are often pasted with quotes.
  return v.replace(/^['"]+/, '').replace(/['"]+$/, '');
}

function isValidUrl(value) {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function jwtRole(key) {
  try {
    const payload = key.split('.')[1];
    if (!payload) return null;
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json.role ?? null;
  } catch {
    return null;
  }
}

const supabaseUrl = normalizeEnvValue(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = normalizeEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY);
const anonKeyRole = supabaseAnonKey ? jwtRole(supabaseAnonKey) : null;

export const isSupabaseKeyMisconfigured = anonKeyRole === 'service_role';

export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)) && !isSupabaseKeyMisconfigured;

if (isSupabaseKeyMisconfigured) {
  console.error(
    '[FreshLien] VITE_SUPABASE_ANON_KEY is a service role key. Use the anon (public) key from Supabase → Settings → API.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
      },
    })
  : null;
