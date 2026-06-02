import { differenceInDays, parseISO } from 'date-fns';
import { getCountyCentroid } from '@/data/countyCentroids';

export function daysToSale(saleDate) {
  if (!saleDate) return null;
  try {
    return Math.max(0, differenceInDays(parseISO(saleDate), new Date()));
  } catch {
    return null;
  }
}

function parseCoord(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Resolve lat/lng from record fields or county centroid */
export function resolveCoordinates(row) {
  const lat = parseCoord(row.latitude);
  const lng = parseCoord(row.longitude);

  if (lat != null && lng != null) {
    return { latitude: lat, longitude: lng };
  }

  const county = getCountyCentroid(row.county_name, row.state);
  if (county) {
    return county;
  }

  return { latitude: null, longitude: null };
}

export function getDashboardStats(cases = []) {
  const today = new Date().toISOString().split('T')[0];
  const scheduled = cases.filter((c) => c.status === 'Scheduled');
  const counties = new Set(cases.map((c) => `${c.county_name}-${c.state}`));
  const upcoming = scheduled.filter((c) => c.sale_date >= today);
  const newToday = cases.filter((c) => {
    const created = c.created_at?.split('T')[0];
    return created === today;
  });

  return {
    activeForeclosures: scheduled.length,
    countiesCovered: counties.size,
    upcomingAuctions: upcoming.length,
    newListingsToday: newToday.length,
  };
}

/** Normalize API rows for map, list, and drawer */
export function enrichForeclosure(row) {
  if (!row) return null;
  const days = daysToSale(row.sale_date);
  const { latitude, longitude } = resolveCoordinates(row);

  return {
    ...row,
    latitude,
    longitude,
    address_full:
      row.address_full ||
      `${row.property_address}, ${row.city}, ${row.state} ${row.zip_code || ''}`.trim(),
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

export function filterForeclosures(
  rows,
  { search = '', county = 'all', state = 'all', status = 'all', dateFrom = '', dateTo = '' }
) {
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

/** Records that can be plotted on the map */
export function getMappableFilings(filings) {
  return filings.filter((f) => {
    const lat = parseCoord(f.latitude);
    const lng = parseCoord(f.longitude);
    return lat != null && lng != null;
  });
}
