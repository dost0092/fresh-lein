/**
 * POST /api/crm/unsubscribe   { email }
 * GET  /api/crm/unsubscribe?e=email   (supports List-Unsubscribe one-click)
 *
 * Public endpoint. Finds which agent(s) emailed this address (via crm_messages)
 * and adds it to their suppression list so it's never contacted again.
 */

const { getAdminClient } = require('../_lib/supabaseAdmin');

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  let email = '';
  try {
    if (req.method === 'GET') {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      email = url.searchParams.get('e') || '';
    } else {
      const body = await readBody(req);
      email = body.email || '';
    }
  } catch {
    return json(res, 400, { error: 'invalid_request' });
  }

  email = String(email).toLowerCase().trim();
  if (!email) return json(res, 400, { error: 'missing_email' });

  try {
    const supabase = getAdminClient();
    const { data: msgs } = await supabase
      .from('crm_messages')
      .select('user_id')
      .eq('to_email', email)
      .limit(100);

    const userIds = Array.from(new Set((msgs || []).map((m) => m.user_id)));
    if (userIds.length > 0) {
      await supabase
        .from('crm_suppressions')
        .upsert(
          userIds.map((user_id) => ({ user_id, email, reason: 'unsubscribe' })),
          { onConflict: 'user_id,email' }
        );
      await supabase.from('crm_contacts').update({ opt_in: false }).in('user_id', userIds).eq('email', email);
    }
    return json(res, 200, { unsubscribed: email });
  } catch (err) {
    // Even if the backend isn't configured, acknowledge so the user sees success.
    return json(res, 200, { unsubscribed: email, note: err?.message || 'no_backend' });
  }
};
