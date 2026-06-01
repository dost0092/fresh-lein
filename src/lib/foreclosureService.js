import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SAMPLE_FORECLOSURES, getDashboardStats } from '@/data/sampleForeclosures';
import { enrichForeclosure } from '@/lib/foreclosureUtils';

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

export async function fetchForeclosures() {
  if (!isSupabaseConfigured) {
    return SAMPLE_FORECLOSURES.map(enrichForeclosure);
  }

  const { data, error } = await supabase
    .from('foreclosure_cases')
    .select(`
      *,
      counties ( county_name, state ),
      foreclosure_status_history ( status, status_date, created_at )
    `)
    .order('sale_date', { ascending: true });

  if (error || !data?.length) {
    console.warn('Supabase foreclosures:', error?.message || 'empty — using sample data');
    return SAMPLE_FORECLOSURES.map(enrichForeclosure);
  }

  return data.map((row) =>
    enrichForeclosure(
    mapRow({
      ...row,
      county_name: row.counties?.county_name,
      status_history: (row.foreclosure_status_history || [])
        .sort((a, b) => new Date(a.status_date) - new Date(b.status_date))
        .map((h) => ({ status: h.status, status_date: h.status_date })),
    }))
  );
}

export async function fetchForeclosureById(id) {
  if (!isSupabaseConfigured || String(id).startsWith('sample-')) {
    const found = SAMPLE_FORECLOSURES.find((c) => c.id === id);
    return found ? enrichForeclosure(found) : null;
  }

  const { data, error } = await supabase
    .from('foreclosure_cases')
    .select(`
      *,
      counties ( county_name, state ),
      foreclosure_status_history ( status, status_date, created_at )
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    const found = SAMPLE_FORECLOSURES.find((c) => c.id === id);
    return found ? enrichForeclosure(found) : null;
  }

  return enrichForeclosure(mapRow({
    ...data,
    county_name: data.counties?.county_name,
    status_history: (data.foreclosure_status_history || [])
      .sort((a, b) => new Date(a.status_date) - new Date(b.status_date))
      .map((h) => ({ status: h.status, status_date: h.status_date })),
  }));
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
