import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { APP_HOME } from '@/lib/routes';

/** Prevents duplicate PKCE exchange when React strict mode remounts or detectSessionInUrl races. */
let exchangePromise = null;

async function exchangeAuthCode(code) {
  if (!exchangePromise) {
    exchangePromise = supabase.auth.exchangeCodeForSession(code).finally(() => {
      exchangePromise = null;
    });
  }
  return exchangePromise;
}

/** Parses OAuth hash/query on any route and finishes sign-in. */
export default function AuthCallbackHandler() {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const hasAuthHash = hash.includes('access_token=') || hash.includes('error=');
    const hasAuthCode = Boolean(code);

    if (!hasAuthHash && !hasAuthCode) return;

    let cancelled = false;

    const failAuth = (message) => {
      if (cancelled || handledRef.current) return;
      handledRef.current = true;
      window.history.replaceState({}, '', '/login');
      navigate('/login', { replace: true, state: { authError: message } });
    };

    const succeedAuth = () => {
      if (cancelled || handledRef.current) return;
      handledRef.current = true;

      const pathname = window.location.pathname;

      // Password recovery: exchange code but stay on reset page.
      if (pathname === '/reset-password') {
        window.history.replaceState({}, '', pathname);
        return;
      }

      const stored = sessionStorage.getItem('auth_redirect');
      sessionStorage.removeItem('auth_redirect');
      const target = stored || APP_HOME;
      window.history.replaceState({}, '', target);
      navigate(target, { replace: true });
    };

    const finish = async () => {
      if (hasAuthCode && code) {
        const { data, error } = await exchangeAuthCode(code);
        if (cancelled) return;

        if (error) {
          // Code may already have been exchanged by a parallel init path.
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            succeedAuth();
            return;
          }
          failAuth(error.message);
          return;
        }

        if (data?.session) {
          succeedAuth();
          return;
        }
      }

      if (hasAuthHash) {
        if (hash.includes('error=')) {
          const hashParams = new URLSearchParams(hash.slice(1));
          failAuth(hashParams.get('error_description') || hashParams.get('error') || 'Sign-in failed');
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (session) {
          succeedAuth();
          return;
        }
        if (error) failAuth(error.message);
        else failAuth('Sign-in failed');
      }
    };

    finish();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled || handledRef.current || !session) return;
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
        succeedAuth();
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return null;
}
