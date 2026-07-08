/**
 * POST /api/pipeline/leads/status
 * Body: { lead_id, status, note? }
 * Auth: Bearer Supabase access token
 *
 * Updates lead status and writes a lead_activities row.
 * Ready for Step 3+ hooks (skip trace, SMS, CRM) on status transitions.
 */
const { json } = require('../../_lib/http');
const {
  LEAD_STATUSES,
  getAdminClient,
  requirePipelineUser,
  assertClientAccess,
} = require('../../_lib/pipeline');

function setCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

module.exports = async (req, res) => {
  if (setCors(req, res)) return;
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const user = await requirePipelineUser(req, res, json);
  if (!user) return;

  let body;
  try {
    body = await readBody(req);
  } catch {
    json(res, 400, { error: 'Invalid JSON body' });
    return;
  }

  const leadId = body.lead_id;
  const status = body.status;
  const note = typeof body.note === 'string' ? body.note.trim() : '';

  if (!leadId || !LEAD_STATUSES.includes(status)) {
    json(res, 400, { error: 'lead_id and a valid status are required' });
    return;
  }

  try {
    const supabase = getAdminClient();

    const { data: lead, error: leadErr } = await supabase
      .from('leads')
      .select('id, client_id, status')
      .eq('id', leadId)
      .maybeSingle();

    if (leadErr || !lead) {
      json(res, 404, { error: 'Lead not found' });
      return;
    }

    const ok = await assertClientAccess(supabase, user.id, lead.client_id);
    if (!ok) {
      json(res, 403, { error: 'Forbidden' });
      return;
    }

    if (lead.status === status) {
      json(res, 200, { lead, unchanged: true });
      return;
    }

    const { data: updated, error: updErr } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId)
      .select('*')
      .single();

    if (updErr) {
      json(res, 500, { error: updErr.message });
      return;
    }

    await supabase.from('lead_activities').insert({
      lead_id: leadId,
      activity_type: 'status_change',
      content: note || `Status: ${lead.status} → ${status}`,
      metadata: { from: lead.status, to: status },
      created_by: user.id,
    });

    json(res, 200, { lead: updated });
  } catch (err) {
    json(res, 500, { error: err.message || 'Failed to update lead' });
  }
};
