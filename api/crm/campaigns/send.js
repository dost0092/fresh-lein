/**
 * POST /api/crm/campaigns/send
 *
 * Multi-tenant campaign sender. Authenticates the agent via their Supabase
 * Bearer token, builds the recipient list from THEIR contacts (RLS-safe via
 * user_id), renders a personalized message per recipient, enqueues them in
 * crm_messages, then drains the queue inline (demo batch <= 50 fits well within
 * the serverless window. Demo sends (<= 50) are drained inline in this request.
 */

const { getAdminClient } = require('../../_lib/supabaseAdmin');
const { getUserFromRequest } = require('../../_lib/authUser');
const { renderTemplate, buildEmailHtml } = require('../../_lib/crmTemplate');
const { drainMessages, senderConfig } = require('../../_lib/crmSend');

const DEMO_LIMIT = 50;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

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
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const { user, error: authError } = await getUserFromRequest(req);
  if (authError === 'server_misconfigured') {
    return json(res, 503, { error: 'server_misconfigured', message: 'Add SUPABASE_SERVICE_ROLE_KEY in Vercel.' });
  }
  if (!user) return json(res, 401, { error: 'unauthorized' });

  let body;
  try {
    body = await readBody(req);
  } catch {
    return json(res, 400, { error: 'invalid_body' });
  }

  const name = String(body.name || 'Untitled campaign').slice(0, 200);
  const channel = body.channel === 'sms' ? 'sms' : 'email';
  const subject = String(body.subject || '').slice(0, 300);
  const bodyText = String(body.body || '');
  const audienceTag = String(body.audienceTag || 'all');

  if (channel !== 'email') return json(res, 400, { error: 'unsupported_channel' });
  if (!subject.trim()) return json(res, 400, { error: 'missing_subject' });
  if (!bodyText.trim()) return json(res, 400, { error: 'missing_body' });

  const supabase = getAdminClient();

  // Suppression set for this agent.
  const { data: supp } = await supabase
    .from('crm_suppressions')
    .select('email')
    .eq('user_id', user.id);
  const suppressed = new Set((supp || []).map((s) => String(s.email).toLowerCase()));

  // Eligible recipients from the agent's own contacts.
  let contactsQuery = supabase
    .from('crm_contacts')
    .select('email, first_name, last_name, neighborhood, property_type, budget')
    .eq('user_id', user.id)
    .eq('opt_in', true);
  if (audienceTag !== 'all') contactsQuery = contactsQuery.contains('tags', [audienceTag]);

  const { data: contacts, error: contactsErr } = await contactsQuery;
  if (contactsErr) return json(res, 500, { error: contactsErr.message });

  const recipients = (contacts || [])
    .filter((c) => c.email && !suppressed.has(String(c.email).toLowerCase()))
    .slice(0, DEMO_LIMIT);

  if (recipients.length === 0) return json(res, 400, { error: 'no_recipients' });

  const cfg = senderConfig();
  const agentName = body.senderName || user.user_metadata?.full_name || user.email || 'Your agent';
  const replyTo = body.replyToEmail || user.email || null;

  // Create the campaign record (or reuse an existing draft).
  let campaignId = body.campaignId || null;
  const campaignRow = {
    user_id: user.id,
    name,
    channel,
    subject,
    body: bodyText,
    audience_tag: audienceTag,
    status: 'queued',
    total: recipients.length,
    sent_count: 0,
    failed_count: 0,
  };

  if (campaignId) {
    const { error } = await supabase
      .from('crm_campaigns')
      .update(campaignRow)
      .eq('id', campaignId)
      .eq('user_id', user.id);
    if (error) return json(res, 500, { error: error.message });
    // Clear any stale messages from a previous attempt on this campaign.
    await supabase.from('crm_messages').delete().eq('campaign_id', campaignId);
  } else {
    const { data, error } = await supabase
      .from('crm_campaigns')
      .insert(campaignRow)
      .select('id')
      .single();
    if (error) return json(res, 500, { error: error.message });
    campaignId = data.id;
  }

  // Enqueue one rendered message per recipient.
  const messages = recipients.map((contact) => ({
    campaign_id: campaignId,
    user_id: user.id,
    to_email: contact.email,
    reply_to: replyTo,
    subject: renderTemplate(subject, contact),
    html: buildEmailHtml({
      bodyText,
      contact,
      fromName: agentName,
      unsubscribeUrl: `${cfg.siteUrl}/unsubscribe?e=${encodeURIComponent(contact.email)}`,
    }),
  }));

  const { error: insertErr } = await supabase.from('crm_messages').insert(messages);
  if (insertErr) return json(res, 500, { error: insertErr.message });

  // Demo: drain all recipients inline (<= 50 fits within the serverless window).
  let result = { sent: 0, failed: 0, provider: cfg.provider };
  try {
    result = await drainMessages(supabase, { campaignId, limit: DEMO_LIMIT, fromName: agentName });
  } catch (err) {
    return json(res, 500, { error: err?.message || 'send_failed', campaignId });
  }

  return json(res, 200, {
    campaignId,
    total: recipients.length,
    sent: result.sent,
    failed: result.failed,
    provider: result.provider,
    simulated: result.provider === 'simulation',
  });
};
