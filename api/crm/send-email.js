/**
 * CRM bulk email relay.
 *
 * Accepts a small batch of pre-rendered, personalized messages and relays them
 * through a vetted provider (Resend or SendGrid, auto-detected from env).
 * If no provider key is configured it runs in SIMULATION mode so the full CRM
 * flow can be demoed and tested end to end without sending real mail.
 *
 * Hard demo cap: 50 recipients per request.
 *
 * Env:
 *   RESEND_API_KEY       Resend key (https://resend.com)
 *   SENDGRID_API_KEY     SendGrid key (alternative)
 *   CRM_FROM_EMAIL       Verified from address (default: onboarding@resend.dev)
 *   CRM_FROM_NAME        Display name for the sender
 *   PUBLIC_SITE_URL      Used to build the unsubscribe link
 */

const DEMO_LIMIT = 50;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function setCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sendViaResend({ apiKey, from, message, unsubscribeUrl }) {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [message.to],
      reply_to: message.reply_to || undefined,
      subject: message.subject,
      html: message.html,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    return { ok: false, error: detail.slice(0, 200) || `HTTP ${resp.status}` };
  }
  return { ok: true };
}

async function sendViaSendgrid({ apiKey, from, fromName, message, unsubscribeUrl }) {
  const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: message.to }] }],
      from: { email: from, name: fromName },
      subject: message.subject,
      content: [{ type: 'text/html', value: message.html }],
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
    }),
  });
  if (resp.status >= 200 && resp.status < 300) return { ok: true };
  const detail = await resp.text().catch(() => '');
  return { ok: false, error: detail.slice(0, 200) || `HTTP ${resp.status}` };
}

module.exports = async (req, res) => {
  if (setCors(req, res)) return;
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  let body;
  try {
    body = await readBody(req);
  } catch {
    return json(res, 400, { error: 'invalid_body' });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) return json(res, 400, { error: 'no_messages' });
  if (messages.length > DEMO_LIMIT) {
    return json(res, 400, {
      error: 'limit_exceeded',
      message: `Demo limit is ${DEMO_LIMIT} recipients per campaign.`,
    });
  }

  const valid = messages.filter((m) => isValidEmail(m.to) && m.subject && m.html);
  if (valid.length === 0) return json(res, 400, { error: 'no_valid_messages' });

  const resendKey = (process.env.RESEND_API_KEY || '').trim();
  const sendgridKey = (process.env.SENDGRID_API_KEY || '').trim();
  const fromEmail = (process.env.CRM_FROM_EMAIL || 'onboarding@resend.dev').trim();
  const fromName = (body.fromName || process.env.CRM_FROM_NAME || 'FreshLien CRM').trim();
  const defaultReplyTo = (body.replyTo || '').trim();
  const from = `${fromName} <${fromEmail}>`;
  const siteUrl = (process.env.PUBLIC_SITE_URL || 'https://freshlien.com').replace(/\/$/, '');

  const provider = resendKey ? 'resend' : sendgridKey ? 'sendgrid' : 'simulation';

  const results = [];
  let sent = 0;
  let failed = 0;

  for (const message of valid) {
    const unsubscribeUrl = `${siteUrl}/unsubscribe?e=${encodeURIComponent(message.to)}`;
    const enriched = {
      ...message,
      reply_to: message.reply_to || defaultReplyTo || undefined,
    };
    let result;
    try {
      if (provider === 'resend') {
        result = await sendViaResend({ apiKey: resendKey, from, message: enriched, unsubscribeUrl });
      } else if (provider === 'sendgrid') {
        result = await sendViaSendgrid({
          apiKey: sendgridKey,
          from: fromEmail,
          fromName,
          message: enriched,
          unsubscribeUrl,
        });
      } else {
        result = { ok: true, simulated: true };
      }
    } catch (err) {
      result = { ok: false, error: err?.message || 'send_failed' };
    }

    if (result.ok) sent += 1;
    else failed += 1;
    results.push({ to: message.to, ok: result.ok, error: result.error || null });

    // Natural pacing so it never looks like a robotic instant blast.
    await sleep(provider === 'simulation' ? 15 : 120);
  }

  return json(res, 200, {
    provider,
    simulated: provider === 'simulation',
    total: valid.length,
    sent,
    failed,
    results,
  });
};
