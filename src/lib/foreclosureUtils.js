import { differenceInDays, parseISO } from 'date-fns';

const SAMPLE_COORDS = {
  'sample-1': [40.7357, -74.1724],
  'sample-2': [26.7153, -80.0534],
  'sample-3': [33.5092, -112.034],
  'sample-4': [40.5853, -105.0844],
  'sample-5': [40.744, -74.0324],
  'sample-6': [39.9526, -75.1652],
  'sample-7': [42.3636, -87.8448],
  'sample-8': [31.5493, -97.1467],
  'sample-9': [39.3643, -74.4229],
  'sample-10': [41.1384, -81.8637],
  'sample-11': [33.5092, -112.039],
  'sample-12': [40.0712, -74.8649],
};

export function daysToSale(saleDate) {
  if (!saleDate) return null;
  try {
    return Math.max(0, differenceInDays(parseISO(saleDate), new Date()));
  } catch {
    return null;
  }
}

/** Normalize API/sample rows for map, list, and drawer */
export function enrichForeclosure(row) {
  if (!row) return null;
  const days = daysToSale(row.sale_date);
  const coords = SAMPLE_COORDS[row.id];
  return {
    ...row,
    latitude: row.latitude ?? coords?.[0],
    longitude: row.longitude ?? coords?.[1],
    address_full: row.address_full || `${row.property_address}, ${row.city}, ${row.state} ${row.zip_code || ''}`.trim(),
    auction_date: row.sale_date,
    defendant_primary: row.defendant,
    days_to_auction: days,
    estimated_equity:
      row.appraised_value && row.starting_bid
        ? Number(row.appraised_value) - Number(row.starting_bid)
        : null,
    equity_pct:
      row.appraised_value && row.starting_bid
        ? ((Number(row.appraised_value) - Number(row.starting_bid)) / Number(row.appraised_value)) * 100
        : null,
  };
}

export function filterForeclosures(rows, { search = '', county = 'all', state = 'all', status = 'all', dateFrom = '', dateTo = '' }) {
  const q = search.toLowerCase().trim();
  return rows.filter((r) => {
    if (county !== 'all' && r.county_name !== county) return false;
    if (state !== 'all' && r.state !== state) return false;
    if (status !== 'all' && r.status !== status) return false;
    if (dateFrom && r.sale_date < dateFrom) return false;
    if (dateTo && r.sale_date > dateTo) return false;
    if (!q) return true;
    const hay = [
      r.sheriff_number,
      r.plaintiff,
      r.defendant,
      r.property_address,
      r.city,
      r.parcel_number,
      r.attorney_name,
      r.county_name,
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}
