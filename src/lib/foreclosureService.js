import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SAMPLE_FORECLOSURES, getDashboardStats } from '@/data/sampleForeclosures';
import { enrichForeclosure } from '@/lib/foreclosureUtils';

const SUPABASE_PAGE_SIZE = 1000;

const LIST_SELECT = `
  *,
  counties ( county_name, state )
`;

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

async function fetchAllForeclosureRows() {
  const all = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('foreclosure_cases')
      .select(LIST_SELECT)
      .order('sale_date', { ascending: true })
      .range(from, from + SUPABASE_PAGE_SIZE - 1);

    if (error) {
      throw new Error(error.message);
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

export async function fetchForeclosures() {
  if (!isSupabaseConfigured) {
    return SAMPLE_FORECLOSURES.map(enrichForeclosure);
  }

  const data = await fetchAllForeclosureRows();

  return data.map((row) =>
    enrichForeclosure(
      mapRow({
        ...row,
        county_name: row.counties?.county_name,
      })
    )
  );
}

export async function fetchForeclosureById(id) {
  if (!isSupabaseConfigured || String(id).startsWith('sample-')) {
    const found = SAMPLE_FORECLOSURES.find((c) => c.id === id);
    return found ? enrichForeclosure(found) : null;
  }

  const { data, error } = await supabase
    .from('foreclosure_cases')
    .select(DETAIL_SELECT)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
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

export async function fetchDashboardStats() {
  const cases = await fetchForeclosures();
  return getDashboardStats(cases);
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
