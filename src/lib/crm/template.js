/**
 * Lightweight {{variable}} template engine for campaign personalization.
 * Supported variables map to contact fields with friendly fallbacks.
 */

export const TEMPLATE_VARIABLES = [
  { token: '{{first_name}}', label: 'First name', field: 'first_name', fallback: 'there' },
  { token: '{{last_name}}', label: 'Last name', field: 'last_name', fallback: '' },
  { token: '{{full_name}}', label: 'Full name', field: '__full_name', fallback: 'there' },
  { token: '{{email}}', label: 'Email', field: 'email', fallback: '' },
  { token: '{{neighborhood}}', label: 'Neighborhood', field: 'neighborhood', fallback: 'your area' },
  { token: '{{property_type}}', label: 'Property type', field: 'property_type', fallback: 'a home' },
  { token: '{{budget}}', label: 'Budget', field: 'budget', fallback: '' },
];

function valueFor(field, contact) {
  if (field === '__full_name') {
    return [contact.first_name, contact.last_name].filter(Boolean).join(' ').trim();
  }
  return contact?.[field];
}

export function renderTemplate(text, contact = {}) {
  if (!text) return '';
  return text.replace(/\{\{\s*([\w]+)\s*\}\}/g, (match, name) => {
    const variable = TEMPLATE_VARIABLES.find((v) => v.token === `{{${name}}}`);
    if (!variable) return match;
    const raw = valueFor(variable.field, contact);
    const value = raw == null ? '' : String(raw).trim();
    return value || variable.fallback;
  });
}

/** Convert plain text (with line breaks) to safe basic HTML paragraphs. */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function textToHtml(text) {
  const blocks = String(text || '')
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 16px;line-height:1.6;">${escapeHtml(block).replace(/\n/g, '<br/>')}</p>`)
    .join('');
  return blocks;
}

/** Build the full HTML email including a compliant unsubscribe footer. */
export function buildEmailHtml({ bodyText, contact, fromName, unsubscribeUrl = '#' }) {
  const rendered = renderTemplate(bodyText, contact);
  const inner = textToHtml(rendered);
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f6f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
    <div style="max-width:560px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border:1px solid #ececec;border-radius:12px;padding:28px;">
        ${inner}
      </div>
      <div style="text-align:center;color:#9aa0a6;font-size:12px;line-height:1.6;padding:18px 8px;">
        <p style="margin:0 0 6px;">Sent by ${escapeHtml(fromName || 'your agent')} via FreshLien CRM.</p>
        <p style="margin:0;">
          Don't want these emails?
          <a href="${unsubscribeUrl}" style="color:#135133;">Unsubscribe in one click</a>.
        </p>
      </div>
    </div>
  </body>
</html>`;
}

/** Count how many characters an SMS body renders to (for segment estimates). */
export function smsSegments(text) {
  const len = (text || '').length;
  if (len === 0) return 0;
  return len <= 160 ? 1 : Math.ceil(len / 153);
}
