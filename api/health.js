const { json, setCors, requireApiKey } = require('./_lib/http');

module.exports = async (req, res) => {
  if (setCors(req, res)) return;
  if (!requireApiKey(req, res)) return;
  json(res, 200, { ok: true, service: 'freshlien-api' });
};

