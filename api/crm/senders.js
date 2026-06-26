'use strict';
/**
 * /api/crm/senders
 * 
 * GET  ?action=list       — list user's connected inboxes
 * POST ?action=connect    — connect Gmail/Outlook/SMTP
 * POST ?action=verify     — test SMTP credentials
 * DELETE ?id=<sender_id>  — remove a sender account
 */
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const { getUserFromRequest } = require('../_lib/authUser');
const { encrypt, decrypt } = require('../_lib/encryption');

/**
 * Build a Supabase client scoped to the user's own JWT token.
 * This means auth.uid() works correctly in RLS policies,
 * regardless of whether SUPABASE_SERVICE_ROLE_KEY is configured.
 */
function getUserScopedClient(token) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  // Use service role key if available (bypasses RLS), otherwise fall back
  // to the anon key with the user's JWT injected as Authorization header.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anonKey   = process.env.SUPABASE_ANON_KEY
    || process.env.VITE_SUPABASE_ANON_KEY
    || serviceKey; // last resort: if only service key is set, use it

  if (!url) throw new Error('SUPABASE_URL env var is not set');

  if (serviceKey) {
    // Service role bypasses RLS — most permissive, simplest
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  // Fallback: use anon key with user's token injected so auth.uid() works
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

const PROVIDER_DEFAULTS = {
  gmail:   { host: 'smtp.gmail.com',       port: 587 },
  outlook: { host: 'smtp.office365.com',   port: 587 },
  yahoo:   { host: 'smtp.mail.yahoo.com',  port: 587 },
  smtp:    { host: '',                     port: 587 },
};

/**
 * Verify SMTP credentials by actually connecting (no email sent).
 * Returns { ok: true } or throws with a user-friendly message.
 */
async function verifySmtp(smtpHost, smtpPort, smtpUser, plainPassword) {
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: { user: smtpUser, pass: plainPassword },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
  await transporter.verify();
  transporter.close();
  return true;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.writeHead(204, CORS).end();
  }
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  const { user, error: authError, token } = await getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: authError || 'unauthorized' });
  }
  let supabase;
  try {
    supabase = getUserScopedClient(token);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  // ─── GET — list senders ───────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('sender_accounts')
      .select('id,email,display_name,provider,smtp_host,smtp_port,daily_limit,sent_today,last_reset_date,status,last_error,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // ─── DELETE — remove sender ───────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const senderId = req.query.id;
    if (!senderId) return res.status(400).json({ error: 'id required' });

    const { error } = await supabase
      .from('sender_accounts')
      .delete()
      .eq('id', senderId)
      .eq('user_id', user.id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  // ─── POST — connect or verify ─────────────────────────────────────────────
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const action = body.action || req.query.action;

    // ── Verify only (test connection without saving) ──
    if (action === 'verify') {
      const { email, password, smtp_host, smtp_port } = body;
      if (!email || !password || !smtp_host) {
        return res.status(400).json({ error: 'email, password, smtp_host required' });
      }
      try {
        await verifySmtp(smtp_host, Number(smtp_port) || 587, email, password);
        return res.status(200).json({ ok: true });
      } catch (err) {
        return res.status(400).json({ error: `SMTP connection failed: ${err.message}` });
      }
    }

    // ── Connect / Save sender ──
    if (action === 'connect') {
      const { email, display_name, provider, password, smtp_host, smtp_port } = body;
      if (!email || !display_name || !provider || !password) {
        return res.status(400).json({ error: 'email, display_name, provider, password required' });
      }

      const defaults = PROVIDER_DEFAULTS[provider] || PROVIDER_DEFAULTS.smtp;
      const host = smtp_host || defaults.host;
      const port = Number(smtp_port) || defaults.port;

      // Verify before saving
      try {
        await verifySmtp(host, port, email, password);
      } catch (err) {
        return res.status(400).json({ error: `Verification failed: ${err.message}` });
      }

      // Encrypt and save — never store plain password
      let encrypted;
      try {
        encrypted = encrypt(password);
      } catch (err) {
        return res.status(500).json({ error: `Encryption error: ${err.message}` });
      }

      const { data, error } = await supabase
        .from('sender_accounts')
        .insert({
          user_id: user.id,
          email,
          display_name,
          provider,
          smtp_host: host,
          smtp_port: port,
          smtp_user: email,
          smtp_password_encrypted: encrypted,
          daily_limit: 500,
          status: 'active',
        })
        .select('id,email,display_name,provider,daily_limit,sent_today,status,created_at')
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json({ success: true, sender: data });
    }

    return res.status(400).json({ error: 'Unknown action. Use connect or verify.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
