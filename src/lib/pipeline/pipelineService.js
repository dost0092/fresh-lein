/**
 * Acquisition pipeline data access (clients, engagements, leads, buyers).
 * Uses authenticated Supabase + RLS. Service role APIs can be added later
 * for skip-trace / SMS workers without touching this client surface.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { isValidLeadStatus, LEAD_STATUS_LABELS } from '@/data/pipeline';

const CLIENT_FIELDS =
  'id, name, contact_email, contact_name, phone, notes, owner_user_id, status, created_at, updated_at';

const ENGAGEMENT_FIELDS =
  'id, client_id, name, status, config, starts_at, ends_at, created_at, updated_at';

const LEAD_FIELDS = `
  id, client_id, engagement_id, foreclosure_case_id, parcel_id, source_domain,
  status, score, score_reason, owner_contact, assigned_to, offer_amount,
  estimated_value, notes, created_at, updated_at,
  foreclosure_cases (
    id, property_address, city, state, zip_code, defendant, plaintiff,
    parcel_number, sale_date, starting_bid, appraised_value, status, county_id,
    counties ( county_name, state )
  )
`;

const ACTIVITY_FIELDS =
  'id, lead_id, activity_type, content, metadata, created_by, created_at';

const BUYER_FIELDS =
  'id, client_id, name, email, phone, criteria, status, notes, created_at, updated_at';

function assertConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Pipeline needs a live project.');
  }
}

async function requireUserId() {
  assertConfigured();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) throw new Error('Sign in to manage the acquisition pipeline.');
  return session.user.id;
}

// ── Clients ───────────────────────────────────────────────────────────────

export async function listClients() {
  assertConfigured();
  const { data, error } = await supabase
    .from('clients')
    .select(CLIENT_FIELDS)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createClient({ name, contact_email, contact_name, phone, notes } = {}) {
  const userId = await requireUserId();
  if (!name?.trim()) throw new Error('Client name is required.');
  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: name.trim(),
      contact_email: contact_email?.trim() || null,
      contact_name: contact_name?.trim() || null,
      phone: phone?.trim() || null,
      notes: notes || '',
      owner_user_id: userId,
      status: 'active',
    })
    .select(CLIENT_FIELDS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateClient(id, patch) {
  assertConfigured();
  const { data, error } = await supabase
    .from('clients')
    .update(patch)
    .eq('id', id)
    .select(CLIENT_FIELDS)
    .single();
  if (error) throw error;
  return data;
}

// ── Engagements ───────────────────────────────────────────────────────────

export async function listEngagements(clientId) {
  assertConfigured();
  let q = supabase.from('engagements').select(ENGAGEMENT_FIELDS).order('created_at', { ascending: false });
  if (clientId) q = q.eq('client_id', clientId);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function createEngagement({ client_id, name, config, status = 'active' } = {}) {
  assertConfigured();
  if (!client_id) throw new Error('client_id is required.');
  const { data, error } = await supabase
    .from('engagements')
    .insert({
      client_id,
      name: name?.trim() || 'Default engagement',
      config: config || {},
      status,
      starts_at: new Date().toISOString(),
    })
    .select(ENGAGEMENT_FIELDS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateEngagement(id, patch) {
  assertConfigured();
  const { data, error } = await supabase
    .from('engagements')
    .update(patch)
    .eq('id', id)
    .select(ENGAGEMENT_FIELDS)
    .single();
  if (error) throw error;
  return data;
}

// ── Leads ─────────────────────────────────────────────────────────────────

export async function listLeads({ clientId, status, limit = 200 } = {}) {
  assertConfigured();
  let q = supabase
    .from('leads')
    .select(LEAD_FIELDS)
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (clientId) q = q.eq('client_id', clientId);
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(normalizeLead);
}

function normalizeLead(row) {
  if (!row) return row;
  const fc = row.foreclosure_cases;
  return {
    ...row,
    property_address: fc?.property_address || null,
    city: fc?.city || null,
    state: fc?.state || null,
    defendant: fc?.defendant || null,
    parcel_number: fc?.parcel_number || row.parcel_id || null,
    appraised_value: fc?.appraised_value ?? null,
    starting_bid: fc?.starting_bid ?? null,
    county_name: fc?.counties?.county_name || null,
    case_status: fc?.status || null,
    sale_date: fc?.sale_date || null,
  };
}

export async function getLead(id) {
  assertConfigured();
  const { data, error } = await supabase
    .from('leads')
    .select(LEAD_FIELDS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return normalizeLead(data);
}

export async function createLead({
  client_id,
  engagement_id,
  foreclosure_case_id,
  parcel_id,
  source_domain = 'foreclosure',
  status = 'new',
  score,
  score_reason,
  owner_contact = {},
  assigned_to,
  offer_amount,
  estimated_value,
  notes = '',
} = {}) {
  const userId = await requireUserId();
  if (!client_id) throw new Error('client_id is required.');

  const { data, error } = await supabase
    .from('leads')
    .insert({
      client_id,
      engagement_id: engagement_id || null,
      foreclosure_case_id: foreclosure_case_id || null,
      parcel_id: parcel_id || null,
      source_domain,
      status: isValidLeadStatus(status) ? status : 'new',
      score: score ?? null,
      score_reason: score_reason || null,
      owner_contact: owner_contact || {},
      assigned_to: assigned_to || userId,
      offer_amount: offer_amount ?? null,
      estimated_value: estimated_value ?? null,
      notes,
    })
    .select(LEAD_FIELDS)
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('This filing is already a lead for this client.');
    }
    throw error;
  }

  await addLeadActivity({
    lead_id: data.id,
    activity_type: 'system',
    content: 'Lead created',
    created_by: userId,
  });

  return normalizeLead(data);
}

export async function updateLeadStatus(leadId, nextStatus, { note, created_by } = {}) {
  assertConfigured();
  if (!isValidLeadStatus(nextStatus)) {
    throw new Error(`Invalid status: ${nextStatus}`);
  }

  const { data: current, error: readErr } = await supabase
    .from('leads')
    .select('id, status')
    .eq('id', leadId)
    .single();
  if (readErr) throw readErr;

  if (current.status === nextStatus) {
    return getLead(leadId);
  }

  const { data, error } = await supabase
    .from('leads')
    .update({ status: nextStatus })
    .eq('id', leadId)
    .select(LEAD_FIELDS)
    .single();
  if (error) throw error;

  const fromLabel = LEAD_STATUS_LABELS[current.status] || current.status;
  const toLabel = LEAD_STATUS_LABELS[nextStatus] || nextStatus;
  await addLeadActivity({
    lead_id: leadId,
    activity_type: 'status_change',
    content: note?.trim() || `Status: ${fromLabel} → ${toLabel}`,
    metadata: { from: current.status, to: nextStatus },
    created_by: created_by || null,
  });

  return normalizeLead(data);
}

export async function updateLead(leadId, patch) {
  assertConfigured();
  const allowed = [
    'score', 'score_reason', 'owner_contact', 'assigned_to',
    'offer_amount', 'estimated_value', 'notes', 'parcel_id', 'engagement_id',
  ];
  const clean = {};
  for (const key of allowed) {
    if (patch[key] !== undefined) clean[key] = patch[key];
  }
  const { data, error } = await supabase
    .from('leads')
    .update(clean)
    .eq('id', leadId)
    .select(LEAD_FIELDS)
    .single();
  if (error) throw error;
  return normalizeLead(data);
}

// ── Activities ────────────────────────────────────────────────────────────

export async function listLeadActivities(leadId, { limit = 100 } = {}) {
  assertConfigured();
  const { data, error } = await supabase
    .from('lead_activities')
    .select(ACTIVITY_FIELDS)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function addLeadActivity({
  lead_id,
  activity_type,
  content = '',
  metadata = {},
  created_by,
} = {}) {
  assertConfigured();
  if (!lead_id || !activity_type) throw new Error('lead_id and activity_type are required.');
  let userId = created_by;
  if (!userId) {
    try {
      userId = await requireUserId();
    } catch {
      userId = null;
    }
  }
  const { data, error } = await supabase
    .from('lead_activities')
    .insert({
      lead_id,
      activity_type,
      content,
      metadata,
      created_by: userId,
    })
    .select(ACTIVITY_FIELDS)
    .single();
  if (error) throw error;
  return data;
}

// ── Buyers ────────────────────────────────────────────────────────────────

export async function listBuyers(clientId) {
  assertConfigured();
  let q = supabase.from('buyers').select(BUYER_FIELDS).order('created_at', { ascending: false });
  if (clientId) q = q.eq('client_id', clientId);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function createBuyer({ client_id, name, email, phone, criteria = {}, notes = '' } = {}) {
  assertConfigured();
  if (!client_id || !name?.trim()) throw new Error('client_id and name are required.');
  const { data, error } = await supabase
    .from('buyers')
    .insert({
      client_id,
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      criteria,
      notes,
      status: 'active',
    })
    .select(BUYER_FIELDS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateBuyer(id, patch) {
  assertConfigured();
  const { data, error } = await supabase
    .from('buyers')
    .update(patch)
    .eq('id', id)
    .select(BUYER_FIELDS)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Pull recent foreclosure cases that match an engagement config and insert as leads.
 * Does not overwrite existing (client_id, foreclosure_case_id) pairs.
 */
export async function intakeLeadsFromEngagement(engagementId, { limit = 40 } = {}) {
  assertConfigured();
  const userId = await requireUserId();

  const { data: engagement, error: engErr } = await supabase
    .from('engagements')
    .select(ENGAGEMENT_FIELDS)
    .eq('id', engagementId)
    .single();
  if (engErr) throw engErr;
  if (engagement.status !== 'active') {
    throw new Error('Engagement must be active to intake leads.');
  }

  const config = engagement.config || {};
  const states = Array.isArray(config.states) ? config.states.map((s) => String(s).toUpperCase()) : [];
  const counties = Array.isArray(config.counties)
    ? config.counties.map((c) => String(c).toLowerCase())
    : [];

  let caseQuery = supabase
    .from('foreclosure_cases')
    .select('id, parcel_number, property_address, city, state, appraised_value, starting_bid, county_id, counties(county_name, state)')
    .order('sale_date', { ascending: true })
    .limit(Math.min(200, Math.max(limit * 3, 40)));

  if (states.length === 1) caseQuery = caseQuery.eq('state', states[0]);
  else if (states.length > 1) caseQuery = caseQuery.in('state', states);

  const { data: cases, error: caseErr } = await caseQuery;
  if (caseErr) throw caseErr;

  let filtered = cases || [];
  if (counties.length > 0) {
    const set = new Set(counties);
    filtered = filtered.filter((row) => {
      const name = row.counties?.county_name;
      return name && set.has(String(name).toLowerCase());
    });
  }

  filtered = filtered.slice(0, limit);

  const created = [];
  const skipped = [];

  for (const row of filtered) {
    try {
      const lead = await createLead({
        client_id: engagement.client_id,
        engagement_id: engagement.id,
        foreclosure_case_id: row.id,
        parcel_id: row.parcel_number || null,
        source_domain: 'foreclosure',
        status: 'new',
        estimated_value: row.appraised_value ?? null,
        assigned_to: userId,
      });
      created.push(lead);
    } catch (err) {
      skipped.push({ caseId: row.id, reason: err.message });
    }
  }

  return { created, skipped, scanned: filtered.length };
}
