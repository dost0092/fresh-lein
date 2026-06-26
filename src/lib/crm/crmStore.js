/**
 * CRM data layer (browser-local for the demo).
 *
 * Stores contacts, tags, campaigns, and a suppression list in localStorage so
 * the full CRM flow works with zero backend setup. The API surface here is kept
 * small and async-friendly so it can later be swapped for Supabase tables
 * without changing the UI.
 */

const KEYS = {
  contacts: 'freshlien_crm_contacts',
  campaigns: 'freshlien_crm_campaigns',
  suppression: 'freshlien_crm_suppression',
};

export const DEMO_SEND_LIMIT = 50;

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('freshlien-crm-change', { detail: { key } }));
  } catch (err) {
    console.warn('CRM store write failed:', err?.message);
  }
}

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

/* ----------------------------- Contacts ----------------------------- */

export function getContacts() {
  return read(KEYS.contacts, []);
}

export function getSuppressionSet() {
  return new Set(read(KEYS.suppression, []).map(normalizeEmail));
}

export function getContactById(id) {
  return getContacts().find((c) => c.id === id) || null;
}

/**
 * Upsert a batch of contacts by email. Returns counts.
 * Each input row: { email, first_name, last_name, phone, tags[], opt_in, notes,
 *   budget, neighborhood, property_type, stage }
 */
export function addContacts(rows = []) {
  const existing = getContacts();
  const byEmail = new Map(existing.map((c) => [normalizeEmail(c.email), c]));
  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const email = normalizeEmail(row.email);
    if (!isValidEmail(email)) {
      skipped += 1;
      continue;
    }
    const prev = byEmail.get(email);
    const merged = {
      id: prev?.id || uid('c'),
      email,
      first_name: row.first_name ?? prev?.first_name ?? '',
      last_name: row.last_name ?? prev?.last_name ?? '',
      phone: row.phone ?? prev?.phone ?? '',
      budget: row.budget ?? prev?.budget ?? '',
      neighborhood: row.neighborhood ?? prev?.neighborhood ?? '',
      property_type: row.property_type ?? prev?.property_type ?? '',
      stage: row.stage ?? prev?.stage ?? '',
      notes: row.notes ?? prev?.notes ?? '',
      tags: Array.from(new Set([...(prev?.tags || []), ...(row.tags || [])])).filter(Boolean),
      opt_in: row.opt_in ?? prev?.opt_in ?? true,
      created_at: prev?.created_at || new Date().toISOString(),
    };
    byEmail.set(email, merged);
    if (prev) updated += 1;
    else added += 1;
  }

  write(KEYS.contacts, Array.from(byEmail.values()));
  return { added, updated, skipped };
}

export function updateContact(id, patch) {
  const next = getContacts().map((c) => (c.id === id ? { ...c, ...patch } : c));
  write(KEYS.contacts, next);
}

export function deleteContacts(ids = []) {
  const idSet = new Set(ids);
  write(
    KEYS.contacts,
    getContacts().filter((c) => !idSet.has(c.id))
  );
}

export function getAllTags() {
  const set = new Set();
  for (const c of getContacts()) (c.tags || []).forEach((t) => set.add(t));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function addTagToContacts(ids = [], tag) {
  const clean = String(tag || '').trim();
  if (!clean) return;
  const idSet = new Set(ids);
  write(
    KEYS.contacts,
    getContacts().map((c) =>
      idSet.has(c.id)
        ? { ...c, tags: Array.from(new Set([...(c.tags || []), clean])) }
        : c
    )
  );
}

/* --------------------------- Suppression ---------------------------- */

export function suppressEmails(emails = []) {
  const set = getSuppressionSet();
  emails.map(normalizeEmail).filter(Boolean).forEach((e) => set.add(e));
  write(KEYS.suppression, Array.from(set));
}

export function isSuppressed(email) {
  return getSuppressionSet().has(normalizeEmail(email));
}

/* ----------------------------- Audience ----------------------------- */

/** Returns sendable contacts for a tag (or all), excluding opt-outs + suppressed. */
export function getAudience({ tag = 'all' } = {}) {
  const suppressed = getSuppressionSet();
  return getContacts().filter((c) => {
    if (!c.opt_in) return false;
    if (suppressed.has(normalizeEmail(c.email))) return false;
    if (tag !== 'all' && !(c.tags || []).includes(tag)) return false;
    return true;
  });
}

/* ----------------------------- Campaigns ---------------------------- */

export function getCampaigns() {
  return read(KEYS.campaigns, []).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
}

export function saveCampaign(campaign) {
  const list = read(KEYS.campaigns, []);
  const idx = list.findIndex((c) => c.id === campaign.id);
  const record = {
    id: campaign.id || uid('camp'),
    name: campaign.name || 'Untitled campaign',
    channel: campaign.channel || 'email',
    subject: campaign.subject || '',
    body: campaign.body || '',
    audienceTag: campaign.audienceTag || 'all',
    status: campaign.status || 'draft',
    stats: campaign.stats || null,
    created_at: campaign.created_at || new Date().toISOString(),
    sent_at: campaign.sent_at || null,
  };
  if (idx >= 0) list[idx] = record;
  else list.push(record);
  write(KEYS.campaigns, list);
  return record;
}

export function deleteCampaign(id) {
  write(
    KEYS.campaigns,
    read(KEYS.campaigns, []).filter((c) => c.id !== id)
  );
}

export function getCrmStats() {
  const contacts = getContacts();
  const optedIn = contacts.filter((c) => c.opt_in).length;
  const campaigns = getCampaigns();
  const sent = campaigns.filter((c) => c.status === 'sent');
  const totalSent = sent.reduce((sum, c) => sum + (c.stats?.sent || 0), 0);
  return {
    contacts: contacts.length,
    optedIn,
    tags: getAllTags().length,
    suppressed: getSuppressionSet().size,
    campaigns: campaigns.length,
    emailsSent: totalSent,
  };
}
