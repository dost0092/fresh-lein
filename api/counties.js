const { json, setCors, requireApiKey } = require('./_lib/http');
const { getAdminClient } = require('./_lib/supabaseAdmin');

module.exports = async (req, res) => {
  if (setCors(req, res)) return;
  if (!requireApiKey(req, res)) return;

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('counties')
      .select('id, county_name, state, is_active')
      .order('state', { ascending: true })
      .order('county_name', { ascending: true });

    if (error) return json(res, 500, { error: error.message });
    json(res, 200, { counties: data ?? [] });
  } catch (e) {
    json(res, 500, { error: e.message || 'Server error' });
  }
};

