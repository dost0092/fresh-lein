import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { enrichForeclosure, getDashboardStats, sortByUpcomingSale } from '@/lib/foreclosureUtils';
import { inferCountyFromCoordinates } from '@/data/countyCentroids';

const SUPABASE_PAGE_SIZE = 1000;
const QUERY_TIMEOUT_MS = 20000;

const LIST_SELECT = `
  *,
  counties ( county_name, state )
`;

const LIST_SELECT_PLAIN = '*';

const DETAIL_SELECT = `
  *,
  counties ( county_name, state ),
  foreclosure_status_history ( status, status_date, created_at )
`;

function mapRow(row) {
  if (!row) return null;
  const county = row.counties || row.county;
  return {
    id: row.id,
    county_id: row.county_id,
    sheriff_number: row.sheriff_number,
    court_case_number: row.court_case_number,
    sale_date: row.sale_date,
    plaintiff: row.plaintiff,
    defendant: row.defendant,
    property_address: row.property_address,
    city: row.city,
    state: row.state,
    zip_code: row.zip_code,
    parcel_number: row.parcel_number,
    attorney_name: row.attorney_name,
    starting_bid: row.starting_bid,
    appraised_value: row.appraised_value,
    status: row.status,
    latitude: row.latitude,
    longitude: row.longitude,
    county_name: county?.county_name ?? row.county_name,
    status_history: row.status_history || [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapStatusHistory(rows = []) {
  return rows
    .sort((a, b) => new Date(a.status_date) - new Date(b.status_date))
    .map((h) => ({ status: h.status, status_date: h.status_date }));
}

function assertSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local');
  }
}

function withQueryTimeout(promise, ms = QUERY_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('Foreclosure data request timed out. Check your connection and try again.')),
        ms
      );
    }),
  ]);
}

let countiesCache = null;

async function getCountiesMap() {
  if (countiesCache) return countiesCache;
  const { data, error } = await supabase.from('counties').select('id, county_name, state');
  if (error) throw new Error(error.message);
  countiesCache = new Map((data ?? []).map((c) => [c.id, c]));
  return countiesCache;
}

function attachCounty(row, countyMap) {
  const county = row.counties || countyMap?.get(row.county_id);
  let county_name = county?.county_name ?? row.county_name;
  if (!county_name) {
    county_name = inferCountyFromCoordinates(row.latitude, row.longitude, row.state);
  }
  return mapRow({
    ...row,
    county_name,
  });
}

async function fetchAllForeclosureRows() {
  assertSupabase();
  const all = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('foreclosure_cases')
      .select(LIST_SELECT)
      .order('sale_date', { ascending: true })
      .range(from, from + SUPABASE_PAGE_SIZE - 1);

    if (error) {
      const hint =
        error.code === 'PGRST301' || error.message?.includes('permission')
          ? ' Check Supabase RLS policies (run migration 006).'
          : '';
      throw new Error(`${error.message}${hint}`);
    }

    if (!data?.length) break;

    all.push(...data);
    if (data.length < SUPABASE_PAGE_SIZE) break;
    from += SUPABASE_PAGE_SIZE;
  }

  return all;
}

export function isUsingLiveData() {
  return isSupabaseConfigured;
}

function mapListRows(rows, countyMap) {
  return rows.map((row) => enrichForeclosure(attachCounty(row, countyMap)));
}

function applyListFilters(query, filters = {}, countyMap) {
  const { search = '', county = 'all', state = 'all', status = 'all', dateFrom = '', dateTo = '' } = filters;

  if (state !== 'all') query = query.eq('state', state);
  if (status !== 'all') query = query.eq('status', status);
  if (dateFrom) query = query.gte('sale_date', dateFrom);
  if (dateTo) query = query.lte('sale_date', dateTo);

  if (county !== 'all' && countyMap) {
    const match = [...countyMap.values()].find((c) => c.county_name === county);
    query = query.eq('county_id', match?.id ?? '00000000-0000-0000-0000-000000000000');
  }

  const q = search.trim().replace(/[%_]/g, '');
  if (q) {
    query = query.or(
      [
        `property_address.ilike.%${q}%`,
        `defendant.ilike.%${q}%`,
        `plaintiff.ilike.%${q}%`,
        `sheriff_number.ilike.%${q}%`,
        `city.ilike.%${q}%`,
        `parcel_number.ilike.%${q}%`,
      ].join(',')
    );
  }

  return query;
}

/** Filter dropdown options (small queries). */
export async function fetchForeclosureFilterOptions() {
  assertSupabase();
  const countyMap = await getCountiesMap();
  const counties = [...countyMap.values()]
    .map((c) => c.county_name)
    .filter(Boolean)
    .sort();
  const states = [...new Set([...countyMap.values()].map((c) => c.state).filter(Boolean))].sort();

  const { data: statusRows, error } = await withQueryTimeout(
    supabase.from('foreclosure_cases').select('status').limit(800),
    8000
  );
  if (error) throw new Error(error.message);
  const fromDb = [...new Set((statusRows ?? []).map((r) => r.status).filter(Boolean))];
  const statuses = [...new Set([...fromDb, 'Scheduled', 'Appraisal', 'Sold', 'Cancelled'])].sort();

  return { counties, states, statuses };
}

const LIST_LEAN_COLUMNS =
  'id, property_address, city, state, zip_code, sale_date, starting_bid, appraised_value, status, latitude, longitude, defendant, plaintiff, sheriff_number, parcel_number, attorney_name, county_id, created_at, updated_at';

/** Server-side paginated list — single query (fast for dashboard / guest try). */
export async function fetchForeclosuresPage({ page = 1, pageSize = 20, filters = {} } = {}) {
  assertSupabase();
  const countyMap = await getCountiesMap();
  const offset = (page - 1) * pageSize;
  const today = new Date().toISOString().split('T')[0];
  const { search = '', dateFrom = '', dateTo = '', status = 'all' } = filters;
  const upcomingOnly = !dateFrom && !dateTo && status === 'all' && !search.trim();

  let query = applyListFilters(
    supabase.from('foreclosure_cases').select(LIST_LEAN_COLUMNS, { count: 'exact' }),
    filters,
    countyMap
  );

  if (upcomingOnly) {
    query = query.gte('sale_date', today);
  }

  const { data, error, count } = await withQueryTimeout(
    query.order('sale_date', { ascending: true, nullsFirst: false }).range(offset, offset + pageSize - 1),
    18000
  );

  if (error) throw new Error(error.message);

  return {
    rows: mapListRows(data ?? [], countyMap),
    total: count ?? 0,
  };
}

const LANDING_PREVIEW_COLUMNS =
  'id, property_address, city, state, zip_code, sale_date, starting_bid, appraised_value, status, latitude, longitude, defendant, plaintiff, sheriff_number, county_id, counties(county_name)';

const LANDING_PREVIEW_SELECT = LANDING_PREVIEW_COLUMNS;

async function fetchLandingPreviewFromApi(limit) {
  if (typeof window === 'undefined') return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 28000);

  try {
    const res = await fetch(
      `${window.location.origin}/api/foreclosures/preview?limit=${limit}`,
      { signal: controller.signal, headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return null;
    const body = await res.json();
    if (!Array.isArray(body?.rows)) return null;
    return body.rows;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchLandingPreviewDirect(limit) {
  const today = new Date().toISOString().split('T')[0];
  const capped = Math.min(Math.max(limit, 1), 60);

  const run = (query) => withQueryTimeout(query, 28000);

  let { data, error } = await run(
    supabase
      .from('foreclosure_cases')
      .select(LANDING_PREVIEW_SELECT)
      .gte('sale_date', today)
      .order('sale_date', { ascending: true })
      .limit(capped)
  );

  if (error) throw new Error(error.message);

  if (!data?.length) {
    const fallback = await run(
      supabase
        .from('foreclosure_cases')
        .select(LANDING_PREVIEW_SELECT)
        .order('sale_date', { ascending: true, nullsFirst: false })
        .limit(capped)
    );
    if (fallback.error) throw new Error(fallback.error.message);
    data = fallback.data;
  }

  return data ?? [];
}

function normalizeLandingPreviewRows(rows) {
  return sortByUpcomingSale(
    rows.map((row) => {
      const countyName = row.county_name ?? row.counties?.county_name ?? null;
      return enrichForeclosure(
        mapRow({
          ...row,
          county_name: countyName,
        })
      );
    })
  );
}

/** Fast landing-page preview — server API first, Supabase fallback, county names included. */
export async function fetchLandingMapPreview({ limit = 40 } = {}) {
  assertSupabase();
  const capped = Math.min(Math.max(limit, 1), 60);

  const apiRows = await fetchLandingPreviewFromApi(capped);
  if (apiRows?.length) {
    return normalizeLandingPreviewRows(apiRows);
  }

  const [countyMap, directRows] = await Promise.all([
    getCountiesMap(),
    fetchLandingPreviewDirect(capped),
  ]);

  return sortByUpcomingSale(mapListRows(directRows, countyMap));
}

/** Map markers — lean single-query fetch (upcoming sales first). */
export async function fetchForeclosuresForMap({ filters = {}, limit = 150 } = {}) {
  assertSupabase();
  const today = new Date().toISOString().split('T')[0];
  const capped = Math.min(Math.max(limit, 1), 400);

  const [countyMap, primaryRes] = await Promise.all([
    getCountiesMap(),
    withQueryTimeout(
      applyListFilters(
        supabase.from('foreclosure_cases').select(LIST_LEAN_COLUMNS),
        filters,
        null
      )
        .gte('sale_date', today)
        .order('sale_date', { ascending: true })
        .limit(capped),
      15000
    ),
  ]);

  let { data, error } = primaryRes;
  if (error) throw new Error(error.message);

  if (!data?.length) {
    const fallback = await withQueryTimeout(
      applyListFilters(
        supabase.from('foreclosure_cases').select(LIST_LEAN_COLUMNS),
        filters,
        null
      )
        .order('sale_date', { ascending: true, nullsFirst: false })
        .limit(capped),
      15000
    );
    if (fallback.error) throw new Error(fallback.error.message);
    data = fallback.data;
  }

  return sortByUpcomingSale(mapListRows(data ?? [], countyMap));
}

/** Export all rows matching filters (paginated server fetch). */
export async function fetchForeclosuresForExport(filters = {}) {
  assertSupabase();
  const countyMap = await getCountiesMap();
  const all = [];
  let from = 0;

  while (true) {
    let query = supabase
      .from('foreclosure_cases')
      .select(LIST_SELECT_PLAIN)
      .order('sale_date', { ascending: true, nullsFirst: false });

    query = applyListFilters(query, filters, countyMap);

    const { data, error } = await withQueryTimeout(query.range(from, from + SUPABASE_PAGE_SIZE - 1));
    if (error) throw new Error(error.message);
    if (!data?.length) break;

    all.push(...mapListRows(data, countyMap));
    if (data.length < SUPABASE_PAGE_SIZE) break;
    from += SUPABASE_PAGE_SIZE;
  }

  return sortByUpcomingSale(all);
}

export async function fetchForeclosures() {
  const data = await fetchAllForeclosureRows();
  const countyMap = await getCountiesMap();
  return mapListRows(data, countyMap);
}

/** @deprecated Prefer fetchForeclosuresPage — kept for compatibility */
export async function fetchForeclosuresBatched(onBatch) {
  assertSupabase();
  const countyMap = await getCountiesMap();
  let from = 0;

  while (true) {
    const { data, error } = await withQueryTimeout(
      supabase
        .from('foreclosure_cases')
        .select(LIST_SELECT_PLAIN)
        .order('sale_date', { ascending: true })
        .range(from, from + SUPABASE_PAGE_SIZE - 1)
    );

    if (error) {
      const hint =
        error.code === 'PGRST301' || error.message?.includes('permission')
          ? ' Check Supabase RLS policies (run migration 006).'
          : '';
      throw new Error(`${error.message}${hint}`);
    }

    if (!data?.length) break;

    onBatch(mapListRows(data, countyMap), from === 0);

    if (data.length < SUPABASE_PAGE_SIZE) break;
    from += SUPABASE_PAGE_SIZE;
  }
}

export async function fetchForeclosureById(id) {
  assertSupabase();

  const { data, error } = await supabase
    .from('foreclosure_cases')
    .select(DETAIL_SELECT)
    .eq('id', id)
    .single();

  if (error) {
    const hint =
      error.code === 'PGRST301' || error.message?.includes('permission')
        ? ' Check Supabase RLS policies (run migration 006).'
        : '';
    throw new Error(`${error.message}${hint}`);
  }

  if (!data) return null;

  return enrichForeclosure(
    mapRow({
      ...data,
      county_name: data.counties?.county_name,
      status_history: mapStatusHistory(data.foreclosure_status_history),
    })
  );
}

/** Fast dashboard stats — count queries only (no loading 2000+ rows). */
export async function fetchDashboardStats() {
  assertSupabase();
  const today = new Date().toISOString().split('T')[0];

  const [totalRes, countiesRes, upcomingRes, newTodayRes] = await Promise.all([
    supabase.from('foreclosure_cases').select('id', { count: 'exact', head: true }),
    supabase.from('counties').select('id', { count: 'exact', head: true }),
    supabase
      .from('foreclosure_cases')
      .select('id', { count: 'exact', head: true })
      .gte('sale_date', today),
    supabase
      .from('foreclosure_cases')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`),
  ]);

  const firstErr = totalRes.error || countiesRes.error || upcomingRes.error || newTodayRes.error;
  if (firstErr) {
    const hint =
      firstErr.code === 'PGRST301' || firstErr.message?.includes('permission')
        ? ' Check Supabase RLS (run migration 006).'
        : '';
    throw new Error(`${firstErr.message}${hint}`);
  }

  return {
    activeForeclosures: totalRes.count ?? 0,
    countiesCovered: countiesRes.count ?? 0,
    upcomingAuctions: upcomingRes.count ?? 0,
    newListingsToday: newTodayRes.count ?? 0,
  };
}

/** Recent upcoming auctions for dashboard (soonest sale dates first). */
export async function fetchRecentForeclosures(limit = 5) {
  assertSupabase();
  const today = new Date().toISOString().split('T')[0];

  const [countyMap, result] = await Promise.all([
    getCountiesMap(),
    withQueryTimeout(
      supabase
        .from('foreclosure_cases')
        .select(LIST_LEAN_COLUMNS)
        .gte('sale_date', today)
        .order('sale_date', { ascending: true, nullsFirst: false })
        .limit(limit),
      12000
    ),
  ]);

  const { data, error } = result;
  if (error) throw new Error(error.message);

  return sortByUpcomingSale(mapListRows(data ?? [], countyMap));
}

export function exportForeclosuresCsv(rows) {
  const headers = [
    'Sheriff Number',
    'Sale Date',
    'Plaintiff',
    'Defendant',
    'Property Address',
    'Attorney',
    'Parcel Number',
    'County',
    'State',
    'Status',
  ];
  const lines = rows.map((r) =>
    [
      r.sheriff_number,
      r.sale_date,
      r.plaintiff,
      r.defendant,
      r.property_address,
      r.attorney_name,
      r.parcel_number,
      r.county_name,
      r.state,
      r.status,
    ]
      .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );
  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `freshlien-foreclosures-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
