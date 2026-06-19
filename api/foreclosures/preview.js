const { json, setCors, parseIntParam } = require('../_lib/http');
const { getAdminClient } = require('../_lib/supabaseAdmin');

const PREVIEW_SELECT =
  'id, property_address, city, state, zip_code, sale_date, starting_bid, appraised_value, status, latitude, longitude, defendant, plaintiff, sheriff_number, county_id, counties(county_name, state)';

module.exports = async (req, res) => {
  if (setCors(req, res)) return;

  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const supabase = getAdminClient();
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const limit = parseIntParam(url.searchParams.get('limit'), { min: 1, max: 60, fallback: 40 });
    const today = new Date().toISOString().split('T')[0];

    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');

    let { data, error } = await supabase
      .from('foreclosure_cases')
      .select(PREVIEW_SELECT)
      .gte('sale_date', today)
      .order('sale_date', { ascending: true })
      .limit(limit);

    if (error) return json(res, 500, { error: error.message });

    if (!data?.length) {
      const fallback = await supabase
        .from('foreclosure_cases')
        .select(PREVIEW_SELECT)
        .order('sale_date', { ascending: true, nullsFirst: false })
        .limit(limit);

      if (fallback.error) return json(res, 500, { error: fallback.error.message });
      data = fallback.data;
    }

    const rows = (data ?? []).map((row) => {
      const { counties, ...rest } = row;
      return {
        ...rest,
        county_name: counties?.county_name ?? null,
      };
    });

    json(res, 200, { rows });
  } catch (e) {
    json(res, 500, { error: e.message || 'Server error' });
  }
};
