/**
 * GET/POST /api/crm/worker  — background queue drainer.
 *
 * Invoked by Vercel Cron (see vercel.json). When CRON_SECRET is set, Vercel
 * automatically attaches `Authorization: Bearer <CRON_SECRET>` to cron requests,
 * which we verify here so the endpoint can't be triggered by the public.
 *
 * Each run drains a batch of pending messages within the serverless time budget,
 * so even a 10,000-recipient campaign is delivered steadily across many runs.
 */

const { getAdminClient } = require('../_lib/supabaseAdmin');
const { drainMessages } = require('../_lib/crmSend');

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  const secret = (process.env.CRON_SECRET || '').trim();
  if (secret) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${secret}`) return json(res, 401, { error: 'unauthorized' });
  }

  const supabase = getAdminClient();

  // Drain in rounds while we have time budget (~50s) and work remains.
  const deadline = Date.now() + 50_000;
  let totalProcessed = 0;
  let totalSent = 0;
  let totalFailed = 0;
  let provider = 'simulation';

  try {
    while (Date.now() < deadline) {
      const round = await drainMessages(supabase, { limit: 100 });
      provider = round.provider;
      totalProcessed += round.processed;
      totalSent += round.sent;
      totalFailed += round.failed;
      if (round.processed === 0) break;
    }
  } catch (err) {
    return json(res, 500, { error: err?.message || 'worker_failed', processed: totalProcessed });
  }

  return json(res, 200, { processed: totalProcessed, sent: totalSent, failed: totalFailed, provider });
};
