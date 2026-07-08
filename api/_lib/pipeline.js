/**
 * Shared helpers for acquisition pipeline API routes (status updates, later skip-trace/SMS).
 */
const { getAdminClient } = require('./supabaseAdmin');
const { getUserFromRequest } = require('./authUser');

const LEAD_STATUSES = [
  'new', 'skip_traced', 'contacted', 'interested',
  'under_contract', 'closed', 'dead',
];

async function requirePipelineUser(req, res, json) {
  const { user, error } = await getUserFromRequest(req);
  if (error === 'server_misconfigured') {
    json(res, 500, { error: 'Server not configured for Supabase auth.' });
    return null;
  }
  if (!user) {
    json(res, 401, { error: 'Unauthorized' });
    return null;
  }
  return user;
}

async function assertClientAccess(supabase, userId, clientId) {
  const { data: profile } = await supabase
    .from('users')
    .select('is_super_admin')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.is_super_admin) return true;

  const { data: client } = await supabase
    .from('clients')
    .select('id, owner_user_id')
    .eq('id', clientId)
    .maybeSingle();

  return Boolean(client && client.owner_user_id === userId);
}

module.exports = {
  LEAD_STATUSES,
  getAdminClient,
  requirePipelineUser,
  assertClientAccess,
};
