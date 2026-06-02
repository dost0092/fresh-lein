import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function fetchCounties() {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('counties')
    .select('id, county_name, state, is_active')
    .eq('is_active', true)
    .order('state')
    .order('county_name');

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchAlerts() {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('alerts')
    .select(`
      id,
      email_enabled,
      created_at,
      county_id,
      counties ( county_name, state )
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createAlert(countyId) {
  if (!isSupabaseConfigured) throw new Error('Configure Supabase to use alerts.');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in to create alerts.');

  const { error } = await supabase.from('alerts').insert({
    user_id: user.id,
    county_id: countyId,
    email_enabled: true,
  });

  if (error) throw new Error(error.message);
}

export async function deleteAlert(alertId) {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase.from('alerts').delete().eq('id', alertId);
  if (error) throw new Error(error.message);
}
