/**
 * CRM send engine (CommonJS).
 *
 * `drainMessages` pulls a batch of `pending` rows from crm_messages, sends each
 * through a vetted provider (Resend or SendGrid, auto-detected), and records the
 * outcome. It is safe to call from both the campaign endpoint (small inline
 * drain for instant demo feedback) and the Vercel Cron worker (drains the rest).
 *
 * Multi-tenant sender model (Approach A): every email goes FROM a single
 * verified FreshLien address, with Reply-To set to the agent's own email so
 * replies reach the agent. No provider key => simulation mode.
 */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function senderConfig() {
  const resendKey = (process.env.RESEND_API_KEY || '').trim();
  const sendgridKey = (process.env.SENDGRID_API_KEY || '').trim();
  const fromEmail = (process.env.CRM_FROM_EMAIL || 'onboarding@resend.dev').trim();
  const fromName = (process.env.CRM_FROM_NAME || 'FreshLien CRM').trim();
  const siteUrl = (process.env.PUBLIC_SITE_URL || 'https://freshlien.com').replace(/\/$/, '');
  const provider = resendKey ? 'resend' : sendgridKey ? 'sendgrid' : 'simulation';
  return { resendKey, sendgridKey, fromEmail, fromName, siteUrl, provider, from: `${fromName} <${fromEmail}>` };
}

async function sendViaResend(cfg, msg, unsubscribeUrl) {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: cfg.from,
      to: [msg.to_email],
      reply_to: msg.reply_to || undefined,
      subject: msg.subject,
      html: msg.html,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    return { ok: false, error: (detail || `HTTP ${resp.status}`).slice(0, 240) };
  }
  return { ok: true };
}

async function sendViaSendgrid(cfg, msg, unsubscribeUrl) {
  const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.sendgridKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: msg.to_email }] }],
      from: { email: cfg.fromEmail, name: cfg.fromName },
      reply_to: msg.reply_to ? { email: msg.reply_to } : undefined,
      subject: msg.subject,
      content: [{ type: 'text/html', value: msg.html }],
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
    }),
  });
  if (resp.status >= 200 && resp.status < 300) return { ok: true };
  const detail = await resp.text().catch(() => '');
  return { ok: false, error: (detail || `HTTP ${resp.status}`).slice(0, 240) };
}

async function sendOne(cfg, msg) {
  const unsubscribeUrl = `${cfg.siteUrl}/unsubscribe?e=${encodeURIComponent(msg.to_email)}`;
  if (cfg.provider === 'resend') return sendViaResend(cfg, msg, unsubscribeUrl);
  if (cfg.provider === 'sendgrid') return sendViaSendgrid(cfg, msg, unsubscribeUrl);
  return { ok: true, simulated: true };
}

async function reconcileCampaign(supabase, campaignId) {
  const { data: rows } = await supabase
    .from('crm_messages')
    .select('status')
    .eq('campaign_id', campaignId);
  const list = rows || [];
  const sent = list.filter((r) => r.status === 'sent').length;
  const failed = list.filter((r) => r.status === 'failed').length;
  const pending = list.filter((r) => r.status === 'pending' || r.status === 'sending').length;
  const status = pending > 0 ? 'sending' : 'sent';
  const patch = { sent_count: sent, failed_count: failed, status };
  if (pending === 0) patch.sent_at = new Date().toISOString();
  await supabase.from('crm_campaigns').update(patch).eq('id', campaignId);
}

/**
 * @param {object} supabase  admin (service_role) client
 * @param {object} opts      { limit, pacingMs }
 * @returns {Promise<{processed:number, sent:number, failed:number, provider:string}>}
 */
async function drainMessages(supabase, { limit = 100, pacingMs, campaignId, fromName } = {}) {
  const cfg = senderConfig();
  if (fromName) cfg.from = `${fromName} <${cfg.fromEmail}>`;
  const pace = pacingMs != null ? pacingMs : cfg.provider === 'simulation' ? 5 : 120;

  let query = supabase
    .from('crm_messages')
    .select('id, campaign_id, user_id, to_email, reply_to, subject, html')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit);
  if (campaignId) query = query.eq('campaign_id', campaignId);

  const { data: pending, error } = await query;

  if (error) throw new Error(error.message);
  if (!pending || pending.length === 0) {
    return { processed: 0, sent: 0, failed: 0, provider: cfg.provider };
  }

  const ids = pending.map((m) => m.id);
  await supabase.from('crm_messages').update({ status: 'sending' }).in('id', ids);

  let sent = 0;
  let failed = 0;
  const campaigns = new Set();

  for (const msg of pending) {
    campaigns.add(msg.campaign_id);
    let result;
    try {
      result = await sendOne(cfg, msg);
    } catch (err) {
      result = { ok: false, error: err?.message || 'send_failed' };
    }

    await supabase
      .from('crm_messages')
      .update({
        status: result.ok ? 'sent' : 'failed',
        error: result.ok ? null : result.error || 'failed',
        provider: cfg.provider,
        attempts: 1,
        sent_at: result.ok ? new Date().toISOString() : null,
      })
      .eq('id', msg.id);

    if (result.ok) sent += 1;
    else failed += 1;

    await sleep(pace);
  }

  for (const campaignId of campaigns) {
    await reconcileCampaign(supabase, campaignId);
  }

  return { processed: pending.length, sent, failed, provider: cfg.provider };
}

module.exports = { drainMessages, senderConfig };
