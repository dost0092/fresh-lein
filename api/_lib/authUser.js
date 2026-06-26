const { getAdminClient } = require('./supabaseAdmin');

/**
 * Resolve the authenticated Supabase user from a request's Bearer token.
 * Returns the user object, or null if missing/invalid.
 */
async function getUserFromRequest(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return null;
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

module.exports = { getUserFromRequest };
