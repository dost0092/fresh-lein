const { createClient } = require('@supabase/supabase-js');

function normalize(value) {
  if (value == null) return '';
  return String(value).trim().replace(/^['"]+/, '').replace(/['"]+$/, '');
}

function getAdminClient() {
  const url = normalize(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
  const key = normalize(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

module.exports = { getAdminClient };

