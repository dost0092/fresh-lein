/**
 * Server-side template + HTML builder for CRM campaigns (CommonJS).
 * Mirrors src/lib/crm/template.js so personalization is identical whether the
 * preview is rendered in the browser or the final email is rendered on Vercel.
 */

const VARIABLES = {
  first_name: { fallback: 'there' },
  last_name: { fallback: '' },
  full_name: { fallback: 'there' },
  email: { fallback: '' },
  neighborhood: { fallback: 'your area' },
  property_type: { fallback: 'a home' },
  budget: { fallback: '' },
};

function valueFor(name, contact) {
  if (name === 'full_name') {
    return [contact.first_name, contact.last_name].filter(Boolean).join(' ').trim();
  }
  return contact ? contact[name] : '';
}

function renderTemplate(text, contact = {}) {
  if (!text) return '';
  return String(text).replace(/\{\{\s*([\w]+)\s*\}\}/g, (match, name) => {
    const variable = VARIABLES[name];
    if (!variable) return match;
    const raw = valueFor(name, contact);
    const value = raw == null ? '' : String(raw).trim();
    return value || variable.fallback;
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function textToHtml(text) {
  return String(text || '')
    .split(/\n{2,}/)
    .map(
      (block) =>
        `<p style="margin:0 0 16px;line-height:1.6;">${escapeHtml(block).replace(/\n/g, '<br/>')}</p>`
    )
    .join('');
}

function buildEmailHtml({ bodyText, contact, fromName, unsubscribeUrl = '#' }) {
  const inner = textToHtml(renderTemplate(bodyText, contact));
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f6f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
    <div style="max-width:560px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border:1px solid #ececec;border-radius:12px;padding:28px;">
        ${inner}
      </div>
      <div style="text-align:center;color:#9aa0a6;font-size:12px;line-height:1.6;padding:18px 8px;">
        <p style="margin:0 0 6px;">Sent by ${escapeHtml(fromName || 'your agent')} via FreshLien CRM.</p>
        <p style="margin:0;">Don't want these emails? <a href="${unsubscribeUrl}" style="color:#135133;">Unsubscribe in one click</a>.</p>
      </div>
    </div>
  </body>
</html>`;
}

module.exports = { renderTemplate, buildEmailHtml };
