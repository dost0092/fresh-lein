const { json, setCors, requireApiKey } = require('../_lib/http');
const { getAdminClient } = require('../_lib/supabaseAdmin');

const SELECT_COLUMNS =
  '*, counties(county_name,state), foreclosure_status_history(status,status_date,created_at)';

module.exports = async (req, res) => {
  if (setCors(req, res)) return;
  if (!requireApiKey(req, res)) return;

  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const supabase = getAdminClient();
    const id = req.query?.id;
    if (!id) return json(res, 400, { error: 'Missing id' });

    const { data, error } = await supabase
      .from('foreclosure_cases')
      .select(SELECT_COLUMNS)
      .eq('id', id)
      .single();

    if (error) {
      const status = error.code === 'PGRST116' ? 404 : 500;
      return json(res, status, { error: error.message });
    }

    json(res, 200, { record: data });
  } catch (e) {
    json(res, 500, { error: e.message || 'Server error' });
  }
};

