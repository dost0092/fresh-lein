/**
 * Parse contacts from CSV, Excel, or pasted text into normalized rows.
 * Output rows: { email, first_name, last_name, phone, budget, neighborhood,
 *   property_type, stage, notes, tags[] }
 */
import { isValidEmail, normalizeEmail } from '@/lib/crm/crmStore';

const HEADER_ALIASES = {
  email: ['email', 'e-mail', 'email address', 'mail', 'emailaddress'],
  first_name: ['first name', 'first', 'firstname', 'fname', 'given name'],
  last_name: ['last name', 'last', 'lastname', 'lname', 'surname', 'family name'],
  phone: ['phone', 'phone number', 'mobile', 'cell', 'telephone', 'tel'],
  budget: ['budget', 'price range', 'max budget'],
  neighborhood: ['neighborhood', 'neighbourhood', 'area', 'location', 'preferred neighborhood'],
  property_type: ['property type', 'type', 'propertytype'],
  stage: ['stage', 'status', 'lead stage', 'pipeline'],
  notes: ['notes', 'note', 'comment', 'comments'],
  name: ['name', 'full name', 'fullname', 'contact'],
};

function matchField(header) {
  const h = String(header || '').trim().toLowerCase();
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(h)) return field;
  }
  return null;
}

function splitName(full) {
  const parts = String(full || '').trim().split(/\s+/);
  if (parts.length <= 1) return { first_name: parts[0] || '', last_name: '' };
  return { first_name: parts[0], last_name: parts.slice(1).join(' ') };
}

function rowsFromObjects(objects) {
  if (!objects.length) return [];
  const headers = Object.keys(objects[0]);
  const map = {};
  headers.forEach((h) => {
    const field = matchField(h);
    if (field) map[h] = field;
  });

  // If no email column matched, try to find any column that looks like emails.
  const hasEmail = Object.values(map).includes('email');
  if (!hasEmail) {
    for (const h of headers) {
      const sample = objects.slice(0, 5).map((o) => o[h]);
      if (sample.some((v) => isValidEmail(v))) {
        map[h] = 'email';
        break;
      }
    }
  }

  return objects.map((obj) => {
    const out = { tags: [] };
    for (const [header, value] of Object.entries(obj)) {
      const field = map[header];
      if (!field) continue;
      if (field === 'name') {
        const { first_name, last_name } = splitName(value);
        out.first_name = out.first_name || first_name;
        out.last_name = out.last_name || last_name;
      } else {
        out[field] = String(value ?? '').trim();
      }
    }
    return out;
  });
}

export async function parseCsv(text) {
  const { default: Papa } = await import('papaparse');
  const result = Papa.parse(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return rowsFromObjects(result.data || []);
}

export async function parseExcelFile(file) {
  const XLSX = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const objects = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return rowsFromObjects(objects);
}

export async function parseFile(file) {
  const name = (file.name || '').toLowerCase();
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return parseExcelFile(file);
  }
  const text = await file.text();
  return parseCsv(text);
}

/**
 * Parse pasted text. Supports:
 * - One email per line
 * - Comma / semicolon / space separated emails
 * - "Name <email>" format
 * - CSV with a header row (auto-detected)
 */
export async function parsePasted(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return [];

  const firstLine = trimmed.split(/\r?\n/)[0] || '';
  const looksLikeCsv = firstLine.includes(',') && /email|name|phone/i.test(firstLine);
  if (looksLikeCsv) return parseCsv(trimmed);

  const tokens = trimmed.split(/[\n,;]+/).map((t) => t.trim()).filter(Boolean);
  return tokens.map((token) => {
    const angle = token.match(/^(.*)<([^>]+)>$/);
    if (angle) {
      const name = angle[1].trim().replace(/["']/g, '');
      const email = angle[2].trim();
      const parts = name.split(/\s+/);
      return {
        email,
        first_name: parts[0] || '',
        last_name: parts.slice(1).join(' ') || '',
        tags: [],
      };
    }
    return { email: token, first_name: '', last_name: '', tags: [] };
  });
}

/** Validate + dedupe parsed rows. Returns { valid, invalid, duplicates }. */
export function validateRows(rows) {
  const seen = new Set();
  const valid = [];
  const invalid = [];
  let duplicates = 0;

  for (const row of rows) {
    const email = normalizeEmail(row.email);
    if (!isValidEmail(email)) {
      if (email || Object.values(row).some((v) => v && v !== row.tags))
        invalid.push({ ...row, email });
      continue;
    }
    if (seen.has(email)) {
      duplicates += 1;
      continue;
    }
    seen.add(email);
    valid.push({ ...row, email });
  }

  return { valid, invalid, duplicates };
}
