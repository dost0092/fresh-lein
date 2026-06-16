function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function setCors(req, res) {
  // Public API: allow browser clients + server-to-server.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

function getApiKey(req) {
  const header = req.headers['x-api-key'];
  if (typeof header === 'string' && header.trim()) return header.trim();
  return null;
}

function requireApiKey(req, res) {
  const required = process.env.FRESHLien_API_KEY;
  if (!required) {
    json(res, 500, { error: 'Server not configured: missing FRESHLien_API_KEY' });
    return false;
  }
  const provided = getApiKey(req);
  if (!provided || provided !== required) {
    json(res, 401, { error: 'Unauthorized' });
    return false;
  }
  return true;
}

function parseIntParam(value, { min = 0, max = 1000, fallback } = {}) {
  const n = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

module.exports = {
  json,
  setCors,
  requireApiKey,
  parseIntParam,
};
