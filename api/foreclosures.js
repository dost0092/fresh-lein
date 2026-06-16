const { json, setCors, requireApiKey, parseIntParam } = require('./_lib/http');
const { getAdminClient } = require('./_lib/supabaseAdmin');

// Keep payload lean for speed.
const SELECT_COLUMNS =
  'id, county_id, sheriff_number, court_case_number, sale_date, plaintiff, defendant, property_address, city, state, zip_code, parcel_number, attorney_name, starting_bid, appraised_value, status, latitude, longitude, created_at, updated_at';

function cleanLike(value) {
  return String(value ?? '')
    .trim()
    .slice(0, 120)
    .replace(/[%_]/g, '');
}

module.exports = async (req, res) => {
  if (setCors(req, res)) return;
  if (!requireApiKey(req, res)) return;

  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const supabase = getAdminClient();

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const q = cleanLike(url.searchParams.get('q'));
    const state = (url.searchParams.get('state') || '').trim().toUpperCase();
    const status = (url.searchParams.get('status') || '').trim();
    const countyId = (url.searchParams.get('county_id') || '').trim();
    const dateFrom = (url.searchParams.get('date_from') || '').trim();
    const dateTo = (url.searchParams.get('date_to') || '').trim();

    const limit = parseIntParam(url.searchParams.get('limit'), { min: 1, max: 500, fallback: 50 });
    const offset = parseIntParam(url.searchParams.get('offset'), { min: 0, max: 20000, fallback: 0 });

    let query = supabase
      .from('foreclosure_cases')
      .select(SELECT_COLUMNS, { count: 'exact' })
      .order('sale_date', { ascending: true, nullsFirst: false })
      .range(offset, offset + limit - 1);

    if (state) query = query.eq('state', state);
    if (status) query = query.eq('status', status);
    if (countyId) query = query.eq('county_id', countyId);
    if (dateFrom) query = query.gte('sale_date', dateFrom);
    if (dateTo) query = query.lte('sale_date', dateTo);

    if (q) {
      query = query.or(
        [
          `property_address.ilike.%${q}%`,
          `city.ilike.%${q}%`,
          `defendant.ilike.%${q}%`,
          `plaintiff.ilike.%${q}%`,
          `sheriff_number.ilike.%${q}%`,
          `parcel_number.ilike.%${q}%`,
        ].join(',')
      );
    }

    const { data, error, count } = await query;
    if (error) return json(res, 500, { error: error.message });

    json(res, 200, {
      total: count ?? 0,
      limit,
      offset,
      rows: data ?? [],
    });
  } catch (e) {
    json(res, 500, { error: e.message || 'Server error' });
  }
};

