const { getAdminClient } = require('./supabaseAdmin');

/**
 * Resolve the authenticated Supabase user from a request's Bearer token.
 * Returns the user object, or null if missing/invalid.
 */
async function getUserFromRequest(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return { user: null, error: null };
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return { user: null, error: error?.message || 'invalid_token' };
    return { user: data.user, error: null };
  } catch (err) {
    if (String(err?.message || '').includes('Missing SUPABASE')) {
      return { user: null, error: 'server_misconfigured' };
    }
    return { user: null, error: err?.message || 'auth_failed' };
  }
}

module.exports = { getUserFromRequest };
