const { FRESHLIEN_SYSTEM_PROMPT } = require('./_lib/assistantPrompt');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'x-ai/grok-4-fast:free';

const MAX_HISTORY = 12;
const MAX_CONTENT_CHARS = 4000;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function setCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

function getApiKey() {
  return (
    process.env.GROK_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENROUTER_KEY ||
    process.env.OPENAI_API_KEY ||
    ''
  ).trim();
}

async function readBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function sanitizeMessages(input) {
  if (!Array.isArray(input)) return [];
  return input
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_CONTENT_CHARS),
    }));
}

module.exports = async (req, res) => {
  if (setCors(req, res)) return;

  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    json(res, 503, {
      error: 'assistant_unconfigured',
      message: 'The assistant is not configured yet. Add GROK_KEY in your environment.',
    });
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    json(res, 400, { error: 'invalid_body' });
    return;
  }

  const messages = sanitizeMessages(body.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    json(res, 400, { error: 'no_user_message' });
    return;
  }

  const model = (process.env.OPENROUTER_MODEL || DEFAULT_MODEL).trim();
  const referer = process.env.PUBLIC_SITE_URL || 'https://freshlien.com';

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': referer,
        'X-Title': 'FreshLien Assistant',
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 700,
        messages: [{ role: 'system', content: FRESHLIEN_SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.warn('assistant upstream error', upstream.status, detail.slice(0, 500));
      json(res, 502, {
        error: 'upstream_error',
        message: 'The assistant had trouble responding. Please try again in a moment.',
      });
      return;
    }

    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      json(res, 502, {
        error: 'empty_reply',
        message: 'The assistant did not return a response. Please try again.',
      });
      return;
    }

    json(res, 200, { reply });
  } catch (err) {
    console.warn('assistant error', err?.message);
    json(res, 500, {
      error: 'server_error',
      message: 'Something went wrong reaching the assistant. Please try again.',
    });
  }
};
