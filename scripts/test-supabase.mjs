import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const PAGE = 1000;
let all = [];
let from = 0;

while (true) {
  const { data, error } = await sb
    .from('foreclosure_cases')
    .select('id, property_address, counties(county_name)')
    .order('sale_date', { ascending: true })
    .range(from, from + PAGE - 1);

  if (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
  if (!data?.length) break;
  all.push(...data);
  if (data.length < PAGE) break;
  from += PAGE;
}

console.log('Total rows fetched:', all.length);
console.log('First:', all[0]?.property_address, all[0]?.counties?.county_name);
console.log('Last:', all.at(-1)?.property_address);
