'use strict';
/**
 * /api/crm/smtp-send
 * 
 * Sends a campaign using the user's own connected Gmail/Outlook/SMTP inbox.
 * The user's credentials are fetched from sender_accounts, decrypted in memory,
 * and NEVER returned to the client.
 * 
 * POST body:
 * {
 *   campaignId: string,          // existing campaign id (optional — creates one if omitted)
 *   senderAccountId: string,     // required: which connected inbox to use
 *   subject: string,
 *   body: string,                // HTML or plain text template with {{variables}}
 *   recipients: [                // array of contacts
 *     { email, name, ...mergeVars }
 *   ]
 * }
 */
const nodemailer = require('nodemailer');
const { getUserFromRequest } = require('../_lib/authUser');
const { getAdminClient } = require('../_lib/supabaseAdmin');
const { decrypt } = require('../_lib/encryption');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

const SITE_URL = process.env.VITE_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://freshlien.com';

/** Replace {{variable}} placeholders in a string. */
function interpolate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : ''
  );
}

/** Build the final HTML adding unsubscribe footer + tracking pixel. */
function buildHtml(rawHtml, vars, unsubUrl, trackingUrl) {
  let html = interpolate(rawHtml, vars);
  if (trackingUrl) {
    html += `<img src="${trackingUrl}" width="1" height="1" style="display:none" alt=""/>`;
  }
  if (unsubUrl) {
    html += `
<br/><br/>
<div style="font-size:11px;color:#999;border-top:1px solid #eee;padding-top:10px;margin-top:16px;font-family:sans-serif">
  You received this because you own property at the address referenced above.<br/>
  <a href="${unsubUrl}" style="color:#999;text-decoration:underline">Unsubscribe</a>
</div>`;
  }
  return html;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.writeHead(204, CORS).end();
  }
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { user, error: authError } = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: authError || 'unauthorized' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { senderAccountId, subject, body: emailBody, recipients, campaignName } = body;
  if (!senderAccountId || !subject || !emailBody || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'senderAccountId, subject, body, and recipients[] required' });
  }

  const supabase = getAdminClient();

  // Fetch the sender account — verify ownership
  const { data: sender, error: senderErr } = await supabase
    .from('sender_accounts')
    .select('*')
    .eq('id', senderAccountId)
    .eq('user_id', user.id)
    .single();

  if (senderErr || !sender) {
    return res.status(404).json({ error: 'Sender account not found or access denied' });
  }
  if (sender.status !== 'active') {
    return res.status(400).json({ error: `Sender account is ${sender.status}. Please reconnect.` });
  }

  // Decrypt password in memory — never returned to client
  let plainPassword;
  try {
    plainPassword = decrypt(sender.smtp_password_encrypted);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to decrypt sender credentials. Re-connect the inbox.' });
  }

  // Create SMTP transporter with user's own credentials
  const transporter = nodemailer.createTransport({
    host: sender.smtp_host,
    port: sender.smtp_port,
    secure: false,
    auth: { user: sender.smtp_user, pass: plainPassword },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
  });

  // Create/find a campaign record
  let campaignId = body.campaignId;
  if (!campaignId) {
    const { data: camp, error: campErr } = await supabase
      .from('crm_campaigns')
      .insert({
        user_id: user.id,
        name: campaignName || `Campaign ${new Date().toLocaleDateString()}`,
        subject,
        body: emailBody,
        sender_account_id: senderAccountId,
        status: 'sending',
        channel: 'email',
        audience_tag: 'custom',
      })
      .select('id')
      .single();
    if (!campErr && camp) campaignId = camp.id;
  }

  // Send emails
  const results = { sent: [], failed: [], total: recipients.length };
  const DEMO_LIMIT = 500; // per SMTP call; daily limit enforced by sender_accounts.daily_limit
  const toSend = recipients.slice(0, DEMO_LIMIT);

  for (const recipient of toSend) {
    const vars = {
      name: recipient.name || recipient.owner_name || 'Homeowner',
      email: recipient.email,
      first_name: (recipient.name || recipient.owner_name || 'Homeowner').split(' ')[0],
      property_address: recipient.property_address || '',
      county: recipient.county || '',
      state: recipient.state || '',
      equity: recipient.equity || '',
      lien_type: recipient.lien_type || '',
      foreclosure_date: recipient.foreclosure_date || '',
      tax_amount: recipient.tax_amount || '',
      market_value: recipient.market_value || '',
      ...recipient,
    };

    const personalSubject = interpolate(subject, vars);
    const unsubUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(recipient.email)}`;
    const trackingUrl = campaignId
      ? `${SITE_URL}/api/crm/analytics/open?c=${campaignId}&e=${encodeURIComponent(recipient.email)}`
      : null;
    const html = buildHtml(emailBody, vars, unsubUrl, trackingUrl);

    try {
      await transporter.sendMail({
        from: `"${sender.display_name}" <${sender.smtp_user}>`,
        to: recipient.email,
        subject: personalSubject,
        html,
        headers: {
          'List-Unsubscribe': `<${unsubUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          'X-Mailer': 'FreshLien CRM',
        },
      });
      results.sent.push(recipient.email);

      // Record in crm_messages if campaign exists
      if (campaignId) {
        supabase.from('crm_messages').insert({
          campaign_id: campaignId,
          user_id: user.id,
          to_email: recipient.email,
          subject: personalSubject,
          status: 'sent',
        }).then(() => {});
      }
    } catch (err) {
      results.failed.push({ email: recipient.email, error: err.message });
    }
  }

  // Update sender sent_today counter
  await supabase
    .from('sender_accounts')
    .update({ sent_today: (sender.sent_today || 0) + results.sent.length })
    .eq('id', senderAccountId);

  // Update campaign status
  if (campaignId) {
    const status = results.failed.length === 0 ? 'sent'
      : results.sent.length === 0 ? 'failed' : 'partial';
    await supabase
      .from('crm_campaigns')
      .update({ status, sent_at: new Date().toISOString() })
      .eq('id', campaignId);
  }

  transporter.close();

  return res.status(200).json({
    success: results.sent.length > 0,
    sent: results.sent.length,
    failed: results.failed.length,
    total: results.total,
    failedDetails: results.failed,
    campaignId,
    message: results.sent.length === results.total
      ? `All ${results.sent.length} emails sent via ${sender.email}`
      : `${results.sent.length} sent, ${results.failed.length} failed via ${sender.email}`,
  });
};
