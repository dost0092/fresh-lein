import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function fetchSavedProperties() {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('saved_properties')
    .select(`
      id,
      created_at,
      foreclosure_case_id,
      foreclosure_cases (
        id,
        sheriff_number,
        sale_date,
        property_address,
        city,
        state,
        zip_code,
        status,
        counties ( county_name, state )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function isPropertySaved(foreclosureCaseId) {
  if (!isSupabaseConfigured || !foreclosureCaseId) return false;

  const { data, error } = await supabase
    .from('saved_properties')
    .select('id')
    .eq('foreclosure_case_id', foreclosureCaseId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Boolean(data?.id);
}

export async function saveProperty(foreclosureCaseId) {
  if (!isSupabaseConfigured) throw new Error('Sign in with Supabase to save properties.');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in to save properties.');

  const { error } = await supabase.from('saved_properties').insert({
    user_id: user.id,
    foreclosure_case_id: foreclosureCaseId,
  });

  if (error) throw new Error(error.message);
}

export async function unsaveProperty(foreclosureCaseId) {
  if (!isSupabaseConfigured) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('saved_properties')
    .delete()
    .eq('user_id', user.id)
    .eq('foreclosure_case_id', foreclosureCaseId);

  if (error) throw new Error(error.message);
}
