import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

function pathFromRedirectUrl(redirectTo) {
  try {
    const url = new URL(redirectTo, window.location.origin);
    return `${url.pathname}${url.search}` || '/dashboard';
  } catch {
    return '/dashboard';
  }
}

/** Parses OAuth hash/query on any route and sends the user to the dashboard. */
export default function AuthCallbackHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const hash = window.location.hash;
    const search = window.location.search;
    const hasAuthHash = hash.includes('access_token=') || hash.includes('error=');
    const hasAuthCode = search.includes('code=');

    if (!hasAuthHash && !hasAuthCode) return;

    let cancelled = false;

    const finish = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (cancelled) return;

      if (session) {
        const stored = sessionStorage.getItem('auth_redirect');
        sessionStorage.removeItem('auth_redirect');
        const target = stored || '/dashboard';
        window.history.replaceState({}, '', target);
        navigate(target, { replace: true });
        return;
      }

      if (hasAuthHash && hash.includes('error=')) {
        const params = new URLSearchParams(hash.slice(1));
        const message = params.get('error_description') || params.get('error') || 'Sign-in failed';
        window.history.replaceState({}, '', '/login');
        navigate('/login', { replace: true, state: { authError: message } });
        return;
      }

      if (error) {
        window.history.replaceState({}, '', '/login');
        navigate('/login', { replace: true, state: { authError: error.message } });
      }
    };

    finish();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled || !session) return;
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const stored = sessionStorage.getItem('auth_redirect');
        sessionStorage.removeItem('auth_redirect');
        const target = stored || '/dashboard';
        window.history.replaceState({}, '', target);
        navigate(target, { replace: true });
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return null;
}

export { pathFromRedirectUrl };
