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

async function getSession() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

/** Resolve the current backend mode + identity. */
export async function getMode() {
  const session = await getSession();
  if (session?.user) return { mode: 'supabase', userId: session.user.id, token: session.access_token };
  return { mode: 'local' };
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
  const { mode, token } = await getMode();

  if (mode === 'supabase') {
    const resp = await fetch('/api/crm/campaigns/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.message || data?.error || 'Send failed');
    return { total: data.total, sent: data.sent, failed: data.failed, simulated: data.simulated };
  }

  // Local fallback: render + relay client-side, then record the campaign.
  const audience = local.getAudience({ tag: payload.audienceTag || 'all' }).slice(0, DEMO_SEND_LIMIT);
  if (audience.length === 0) throw new Error('No recipients in this audience.');
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const messages = audience.map((contact) => ({
    to: contact.email,
    subject: renderTemplate(payload.subject, contact),
    html: buildEmailHtml({
      bodyText: payload.body,
      contact,
      fromName: 'Your agent',
      unsubscribeUrl: `${origin}/unsubscribe?e=${encodeURIComponent(contact.email)}`,
    }),
  }));
  const resp = await fetch('/api/crm/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.message || data?.error || 'Send failed');
  local.saveCampaign({
    id: payload.campaignId,
    name: payload.name,
    channel: payload.channel,
    subject: payload.subject,
    body: payload.body,
    audienceTag: payload.audienceTag,
    status: 'sent',
    sent_at: new Date().toISOString(),
    stats: { sent: data.sent, failed: data.failed, total: data.total },
  });
  return { total: data.total, sent: data.sent, failed: data.failed, simulated: data.simulated };
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
