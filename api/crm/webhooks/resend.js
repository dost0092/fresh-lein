/**
 * POST /api/crm/webhooks/resend
 *
 * Receives Resend delivery events. On a hard bounce or spam complaint we add the
 * recipient to that agent's suppression list so they're never emailed again —
 * this is what keeps complaint rates under the 0.3% threshold ISPs enforce.
 *
 * Configure in Resend: Webhooks -> add endpoint -> this URL. (Signature
 * verification via RESEND_WEBHOOK_SECRET can be layered on later with svix.)
 */

const { getAdminClient } = require('../../_lib/supabaseAdmin');

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

const SUPPRESS_EVENTS = {
  'email.bounced': 'bounce',
  'email.complained': 'complaint',
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  let event;
  try {
    event = await readBody(req);
  } catch {
    return json(res, 400, { error: 'invalid_body' });
  }

  const type = event?.type || event?.event;
  const reason = SUPPRESS_EVENTS[type];
  if (!reason) return json(res, 200, { ignored: type || 'unknown' });

  // Resend payloads put the recipient under data.to (array or string).
  const toField = event?.data?.to;
  const email = (Array.isArray(toField) ? toField[0] : toField || event?.data?.email || '')
    .toString()
    .toLowerCase()
    .trim();
  if (!email) return json(res, 200, { ignored: 'no_email' });

  const supabase = getAdminClient();

  // Find which agent(s) sent to this address, then suppress it for them.
  const { data: msgs } = await supabase
    .from('crm_messages')
    .select('user_id')
    .eq('to_email', email)
    .limit(50);

  const userIds = Array.from(new Set((msgs || []).map((m) => m.user_id)));
  if (userIds.length === 0) return json(res, 200, { ignored: 'no_owner' });

  const rows = userIds.map((user_id) => ({ user_id, email, reason }));
  await supabase.from('crm_suppressions').upsert(rows, { onConflict: 'user_id,email' });

  // Also flag the contact as opted-out.
  await supabase
    .from('crm_contacts')
    .update({ opt_in: false })
    .in('user_id', userIds)
    .eq('email', email);

  return json(res, 200, { suppressed: email, reason, agents: userIds.length });
};
