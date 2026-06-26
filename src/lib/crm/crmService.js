/**
 * CRM data access.
 *
 * When Supabase is configured AND the agent is signed in, all data is stored
 * per-agent in Supabase (multi-tenant, RLS-protected) and sending goes through
 * the queue-backed /api/crm/campaigns/send endpoint.
 *
 * Otherwise it transparently falls back to the browser-local store so the demo
 * still works with zero backend setup.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { renderTemplate, buildEmailHtml } from '@/lib/crm/template';
import * as local from '@/lib/crm/crmStore';

export const DEMO_SEND_LIMIT = local.DEMO_SEND_LIMIT;

const CONTACT_FIELDS =
  'id, email, first_name, last_name, phone, budget, neighborhood, property_type, stage, notes, tags, opt_in, created_at';

function normalizeEmail(e) {
  return String(e || '').trim().toLowerCase();
}
function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(e));
}

async function getSessionWithRefresh() {
  if (!isSupabaseConfigured || !supabase) return null;
  let { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const expiresAt = (session.expires_at ?? 0) * 1000;
  if (Date.now() > expiresAt - 120_000) {
    const { data: refreshed, error } = await supabase.auth.refreshSession();
    if (!error && refreshed.session) session = refreshed.session;
  }
  return session;
}

/** Resolve the current backend mode + identity. */
export async function getMode() {
  const session = await getSessionWithRefresh();
  if (session?.user) {
    return {
      mode: 'supabase',
      userId: session.user.id,
      token: session.access_token,
      user: session.user,
    };
  }
  return { mode: 'local' };
}

async function parseJsonResponse(resp) {
  const text = await resp.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    if (/server error/i.test(text)) {
      throw new Error('Server error — please try again in a moment.');
    }
    throw new Error('Unexpected server response. Please try again.');
  }
}

async function sendViaDirectRelay(payload, contacts, fromName = 'Your agent', replyTo) {
  const audience = contacts.slice(0, DEMO_SEND_LIMIT);
  if (audience.length === 0) throw new Error('No recipients in this audience.');
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const displayName = payload.senderName || fromName;
  const reply = payload.replyToEmail || replyTo;
  const messages = audience.map((contact) => ({
    to: contact.email,
    reply_to: reply,
    subject: renderTemplate(payload.subject, contact),
    html: buildEmailHtml({
      bodyText: payload.body,
      contact,
      fromName: displayName,
      unsubscribeUrl: `${origin}/unsubscribe?e=${encodeURIComponent(contact.email)}`,
    }),
  }));
  const resp = await fetch('/api/crm/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, fromName: displayName, replyTo: reply }),
  });
  const data = await parseJsonResponse(resp);
  if (!resp.ok) throw new Error(data?.message || data?.error || 'Send failed');
  return {
    total: data.total,
    sent: data.sent,
    failed: data.failed,
    simulated: data.simulated,
    provider: data.provider,
    results: data.results || [],
  };
}

async function recordCampaignSent(payload, stats, userId) {
  const row = {
    user_id: userId,
    name: payload.name || 'Untitled campaign',
    channel: payload.channel || 'email',
    subject: payload.subject || '',
    body: payload.body || '',
    audience_tag: payload.audienceTag || 'all',
    status: 'sent',
    total: stats.total,
    sent_count: stats.sent,
    failed_count: stats.failed,
    sent_at: new Date().toISOString(),
  };
  if (payload.campaignId) {
    await supabase.from('crm_campaigns').update(row).eq('id', payload.campaignId).eq('user_id', userId);
  } else {
    await supabase.from('crm_campaigns').insert(row);
  }
}

/* ------------------------------- Contacts ------------------------------- */

export async function listContacts() {
  const { mode, userId } = await getMode();
  if (mode === 'local') return local.getContacts();
  const { data, error } = await supabase
    .from('crm_contacts')
    .select(CONTACT_FIELDS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function listSuppressions() {
  const { mode, userId } = await getMode();
  if (mode === 'local') return Array.from(local.getSuppressionSet());
  const { data, error } = await supabase
    .from('crm_suppressions')
    .select('email')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return (data || []).map((r) => normalizeEmail(r.email));
}

export async function listCampaigns() {
  const { mode, userId } = await getMode();
  if (mode === 'local') return local.getCampaigns();
  const { data, error } = await supabase
    .from('crm_campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map((c) => ({
    ...c,
    audienceTag: c.audience_tag,
    stats: { sent: c.sent_count, failed: c.failed_count, total: c.total },
    sent_at: c.sent_at,
  }));
}

/** Import a batch. Returns { added, updated, skipped }. */
export async function importContacts(rows = []) {
  const { mode, userId } = await getMode();
  if (mode === 'local') return local.addContacts(rows);

  // Normalize + dedupe valid rows.
  const byEmail = new Map();
  let skipped = 0;
  for (const r of rows) {
    const email = normalizeEmail(r.email);
    if (!isValidEmail(email)) {
      skipped += 1;
      continue;
    }
    byEmail.set(email, { ...r, email });
  }
  const incoming = Array.from(byEmail.values());
  if (incoming.length === 0) return { added: 0, updated: 0, skipped };

  // Merge tags with existing rows.
  const emails = incoming.map((r) => r.email);
  const { data: existing } = await supabase
    .from('crm_contacts')
    .select('email, tags')
    .eq('user_id', userId)
    .in('email', emails);
  const existingMap = new Map((existing || []).map((e) => [normalizeEmail(e.email), e.tags || []]));

  const payload = incoming.map((r) => ({
    user_id: userId,
    email: r.email,
    first_name: r.first_name || '',
    last_name: r.last_name || '',
    phone: r.phone || '',
    budget: r.budget || '',
    neighborhood: r.neighborhood || '',
    property_type: r.property_type || '',
    stage: r.stage || '',
    notes: r.notes || '',
    tags: Array.from(new Set([...(existingMap.get(r.email) || []), ...((r.tags) || [])])).filter(Boolean),
    opt_in: r.opt_in ?? true,
  }));

  const { error } = await supabase
    .from('crm_contacts')
    .upsert(payload, { onConflict: 'user_id,email' });
  if (error) throw new Error(error.message);

  const updated = existingMap.size;
  return { added: payload.length - updated, updated, skipped };
}

export async function updateContact(id, patch) {
  const { mode, userId } = await getMode();
  if (mode === 'local') return local.updateContact(id, patch);
  const { error } = await supabase.from('crm_contacts').update(patch).eq('id', id).eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export async function deleteContacts(ids = []) {
  const { mode, userId } = await getMode();
  if (mode === 'local') return local.deleteContacts(ids);
  const { error } = await supabase.from('crm_contacts').delete().in('id', ids).eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export async function addTagToContacts(ids = [], tag) {
  const clean = String(tag || '').trim();
  if (!clean || ids.length === 0) return;
  const { mode, userId } = await getMode();
  if (mode === 'local') return local.addTagToContacts(ids, clean);
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('id, tags')
    .in('id', ids)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  await Promise.all(
    (data || []).map((c) =>
      supabase
        .from('crm_contacts')
        .update({ tags: Array.from(new Set([...(c.tags || []), clean])) })
        .eq('id', c.id)
        .eq('user_id', userId)
    )
  );
}

/* ------------------------------ Campaigns ------------------------------ */

export async function deleteCampaign(id) {
  const { mode, userId } = await getMode();
  if (mode === 'local') return local.deleteCampaign(id);
  const { error } = await supabase.from('crm_campaigns').delete().eq('id', id).eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export async function saveDraft(campaign) {
  const { mode, userId } = await getMode();
  if (mode === 'local') return local.saveCampaign({ ...campaign, status: 'draft' });
  const row = {
    user_id: userId,
    name: campaign.name || 'Untitled campaign',
    channel: campaign.channel || 'email',
    subject: campaign.subject || '',
    body: campaign.body || '',
    audience_tag: campaign.audienceTag || 'all',
    status: 'draft',
  };
  if (campaign.id) {
    const { error } = await supabase.from('crm_campaigns').update(row).eq('id', campaign.id).eq('user_id', userId);
    if (error) throw new Error(error.message);
    return { id: campaign.id };
  }
  const { data, error } = await supabase.from('crm_campaigns').insert(row).select('id').single();
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Send a campaign. In Supabase mode this hits the queue-backed endpoint; in
 * local mode it renders client-side and posts to the simple relay.
 */
export async function sendCampaign(payload) {
  const mode = await getMode();

  if (mode.mode === 'supabase') {
    const fromName = mode.user?.user_metadata?.full_name || mode.user?.email || 'Your agent';
    let contacts = await listContacts();
    const suppressed = await listSuppressions();
    const audience = audienceFor(contacts, suppressed, payload.audienceTag || 'all');

    // Try the full multi-tenant queue endpoint first.
    try {
      const resp = await fetch('/api/crm/campaigns/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mode.token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await parseJsonResponse(resp);
      if (!resp.ok) {
        const err = new Error(data?.message || data?.error || 'Send failed');
        err.status = resp.status;
        throw err;
      }
      return {
        total: data.total,
        sent: data.sent,
        failed: data.failed,
        simulated: data.simulated,
        provider: data.provider,
        results: data.results || [],
      };
    } catch (err) {
      // Fallback: send directly via relay (works without service_role on Vercel).
      const retryable =
        err.status === 401 ||
        err.status === 403 ||
        err.status === 503 ||
        err.status >= 500 ||
        /unauthorized|server error|misconfigured/i.test(err?.message || '');
      if (!retryable) throw err;

      const stats = await sendViaDirectRelay(payload, audience, fromName);
      try {
        await recordCampaignSent(payload, stats, mode.userId);
      } catch {
        // Sending succeeded; campaign record is best-effort.
      }
      return stats;
    }
  }

  // Local-only demo (not logged in).
  const audience = local.getAudience({ tag: payload.audienceTag || 'all' });
  const stats = await sendViaDirectRelay(payload, audience);
  local.saveCampaign({
    id: payload.campaignId,
    name: payload.name,
    channel: payload.channel,
    subject: payload.subject,
    body: payload.body,
    audienceTag: payload.audienceTag,
    status: 'sent',
    sent_at: new Date().toISOString(),
    stats: { sent: stats.sent, failed: stats.failed, total: stats.total },
  });
  return stats;
}

/* -------------------------------- Helpers ------------------------------- */

export function deriveTags(contacts = []) {
  const set = new Set();
  for (const c of contacts) (c.tags || []).forEach((t) => set.add(t));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function audienceFor(contacts = [], suppressed = [], tag = 'all') {
  const supp = new Set(suppressed.map(normalizeEmail));
  return contacts.filter((c) => {
    if (!c.opt_in) return false;
    if (supp.has(normalizeEmail(c.email))) return false;
    if (tag !== 'all' && !(c.tags || []).includes(tag)) return false;
    return true;
  });
}
