import { differenceInDays, parseISO } from 'date-fns';
import { getCountyCentroid } from '@/data/countyCentroids';

/** Per-record coordinates (property-level) for sample MVP data */
const SAMPLE_PROPERTY_COORDS = {
  'sample-1': { latitude: 40.7357, longitude: -74.1724 },
  'sample-2': { latitude: 26.7153, longitude: -80.0534 },
  'sample-3': { latitude: 33.5092, longitude: -112.034 },
  'sample-4': { latitude: 40.5853, longitude: -105.0844 },
  'sample-5': { latitude: 40.744, longitude: -74.0324 },
  'sample-6': { latitude: 39.9526, longitude: -75.1652 },
  'sample-7': { latitude: 42.3636, longitude: -87.8448 },
  'sample-8': { latitude: 31.5493, longitude: -97.1467 },
  'sample-9': { latitude: 39.3643, longitude: -74.4229 },
  'sample-10': { latitude: 41.1384, longitude: -81.8637 },
  'sample-11': { latitude: 33.5022, longitude: -112.039 },
  'sample-12': { latitude: 40.0712, longitude: -74.8649 },
};

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

/** Resolve lat/lng from record fields, sample lookup, or county centroid */
export function resolveCoordinates(row) {
  let lat = parseCoord(row.latitude);
  let lng = parseCoord(row.longitude);

  if (lat != null && lng != null) {
    return { latitude: lat, longitude: lng };
  }

  const sample = SAMPLE_PROPERTY_COORDS[row.id];
  if (sample) {
    return { latitude: sample.latitude, longitude: sample.longitude };
  }

  const county = getCountyCentroid(row.county_name, row.state);
  if (county) {
    return county;
  }

  return { latitude: null, longitude: null };
}

/** Normalize API/sample rows for map, list, and drawer */
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
