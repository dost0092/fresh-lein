/** Acquisition pipeline constants and helpers (client + server share vocabulary). */

export const LEAD_STATUSES = [
  'new',
  'skip_traced',
  'contacted',
  'interested',
  'under_contract',
  'closed',
  'dead',
];

export const LEAD_STATUS_LABELS = {
  new: 'New',
  skip_traced: 'Skip traced',
  contacted: 'Contacted',
  interested: 'Interested',
  under_contract: 'Under contract',
  closed: 'Closed',
  dead: 'Dead',
};

export const LEAD_STATUS_ORDER = Object.fromEntries(LEAD_STATUSES.map((s, i) => [s, i]));

export const ACTIVITY_TYPES = [
  'call',
  'sms',
  'mail',
  'email',
  'status_change',
  'note',
  'skip_trace',
  'crm_sync',
  'offer',
  'system',
];

export const SOURCE_DOMAINS = ['foreclosure', 'tax', 'probate', 'nod', 'manual', 'other'];

export function isValidLeadStatus(status) {
  return LEAD_STATUSES.includes(status);
}

export function funnelCounts(leads = []) {
  const counts = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]));
  for (const lead of leads) {
    if (counts[lead.status] != null) counts[lead.status] += 1;
  }
  return counts;
}

export function roughRoi({ leadsDelivered = 0, dealsClosed = 0, avgDealValue = 0 } = {}) {
  const closeRate = leadsDelivered > 0 ? dealsClosed / leadsDelivered : 0;
  return {
    leadsDelivered,
    dealsClosed,
    closeRate,
    estimatedValue: dealsClosed * (Number(avgDealValue) || 0),
  };
}

/** Match a buyer criteria JSON against a lead + optional case fields. */
export function buyerMatchesLead(buyer, lead, caseRow = {}) {
  if (!buyer || buyer.status !== 'active') return false;
  const c = buyer.criteria || {};
  const price = Number(lead.offer_amount ?? lead.estimated_value ?? caseRow.appraised_value ?? caseRow.starting_bid);
  if (c.price_min != null && Number.isFinite(price) && price < Number(c.price_min)) return false;
  if (c.price_max != null && Number.isFinite(price) && price > Number(c.price_max)) return false;

  const county = caseRow.county_name || caseRow.counties?.county_name;
  if (Array.isArray(c.counties) && c.counties.length > 0 && county) {
    const set = new Set(c.counties.map((x) => String(x).toLowerCase()));
    if (!set.has(String(county).toLowerCase())) return false;
  }

  const state = caseRow.state;
  if (Array.isArray(c.states) && c.states.length > 0 && state) {
    const set = new Set(c.states.map((x) => String(x).toUpperCase()));
    if (!set.has(String(state).toUpperCase())) return false;
  }

  return true;
}

export function defaultEngagementConfig() {
  return {
    counties: [],
    states: [],
    source_domains: ['foreclosure'],
    outreach: { channel: null, sequence_days: 3, templates: {} },
    crm: { provider: null },
    auto_skip_trace: false,
  };
}
