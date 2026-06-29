import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured, isSupabaseKeyMisconfigured } from '@/lib/supabase';
import { APP_HOME, authCallbackUrl, pathFromRedirectUrl } from '@/lib/routes';
import { getSiteOrigin } from '@/lib/siteUrl';

const AuthContext = createContext(null);

const SUPER_ADMIN_EMAILS = new Set([
  'waqasdostdost0092@gmail.com',
  'waqaskhan.dost0092@gmail.com',
]);

const PROFILE_LOAD_TIMEOUT_MS = 5000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isProfileReady, setIsProfileReady] = useState(false);
  const profileLoadRef = useRef(0);
  const activeUserIdRef = useRef(null);

  const loadProfile = useCallback(async (userId) => {
    if (!isSupabaseConfigured || !userId) return null;
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, created_at, trial_started_at, trial_ends_at, is_super_admin')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.warn('loadProfile:', error.message);
      return null;
    }
    return data;
  }, []);

  const loadSubscription = useCallback(async (userId) => {
    if (!isSupabaseConfigured || !userId) return null;
    const { data } = await supabase
      .from('subscriptions')
      .select('id, user_id, plan_name, status, stripe_customer_id, stripe_subscription_id, price_id, current_period_end, cancel_at_period_end, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data || null;
  }, []);

  /** Sync session into React state immediately; load profile in background. */
  const applySession = useCallback(
    (s, event) => {
      setSession(s);
      setUser(s?.user ?? null);
      setIsLoadingAuth(false);

      if (!s?.user) {
        activeUserIdRef.current = null;
        setProfile(null);
        setSubscription(null);
        setIsProfileReady(true);
        return;
      }

      const userId = s.user.id;
      const sameUser = activeUserIdRef.current === userId;

      // Token refresh for the same user — update session only (don't unmount dashboard / cancel data fetches).
      if (sameUser && (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
        return;
      }

      activeUserIdRef.current = userId;
      const loadId = ++profileLoadRef.current;
      setIsProfileReady(false);

      const timeoutId = setTimeout(() => {
        if (profileLoadRef.current !== loadId) return;
        setIsProfileReady(true);
      }, PROFILE_LOAD_TIMEOUT_MS);

      Promise.all([loadProfile(userId), loadSubscription(userId)])
        .then(([p, sub]) => {
          if (profileLoadRef.current !== loadId) return;
          setProfile(p);
          setSubscription(sub);
        })
        .finally(() => {
          clearTimeout(timeoutId);
          if (profileLoadRef.current !== loadId) return;
          setIsProfileReady(true);
        });
    },
    [loadProfile, loadSubscription]
  );

  const applySessionAndWait = useCallback(
    async (s) => {
      if (!s?.user) {
        applySession(s);
        return;
      }
      setSession(s);
      setUser(s.user);
      activeUserIdRef.current = s.user.id;
      const [p, sub] = await Promise.all([loadProfile(s.user.id), loadSubscription(s.user.id)]);
      setProfile(p);
      setSubscription(sub);
      setIsLoadingAuth(false);
      setIsProfileReady(true);
    },
    [loadProfile, loadSubscription]
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoadingAuth(false);
      return;
    }

    let mounted = true;

    const safetyTimer = setTimeout(() => {
      if (mounted) setIsLoadingAuth(false);
    }, 4000);

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        if (mounted) applySession(s, 'INITIAL_SESSION');
      })
      .catch((err) => {
        console.warn('getSession:', err);
        if (mounted) setIsLoadingAuth(false);
      })
      .finally(() => {
        clearTimeout(safetyTimer);
      });

    // Must NOT be async — async onAuthStateChange deadlocks Supabase Auth (spinner forever).
    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((event, s) => {
      if (mounted) applySession(s, event);
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      authSub.unsubscribe();
    };
  }, [applySession]);

  const signUp = async ({ email, password, fullName }) => {
    if (isSupabaseKeyMisconfigured) {
      throw new Error(
        'VITE_SUPABASE_ANON_KEY is wrong (service role key detected). Use the anon public key in Vercel env vars.'
      );
    }
    if (!isSupabaseConfigured) {
      throw new Error('Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: authCallbackUrl(),
      },
    });
    if (error) throw error;
    if (data.session) await applySessionAndWait(data.session);
    return data;
  };

  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.session) await applySessionAndWait(data.session);
    return data;
  };

  const signInWithGoogle = async (postAuthRedirect = `${window.location.origin}${APP_HOME}`) => {
    if (!isSupabaseConfigured) {
      throw new Error('Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
    }
    sessionStorage.setItem('auth_redirect', pathFromRedirectUrl(postAuthRedirect));
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: authCallbackUrl() },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
    } catch (err) {
      console.warn('signOut:', err.message);
    } finally {
      activeUserIdRef.current = null;
      profileLoadRef.current += 1;
      applySession(null, 'SIGNED_OUT');
    }
  };

  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      throw new Error('Configure Supabase in .env.local to reset passwords.');
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteOrigin()}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const displayUser = profile || (user ? { email: user.email, full_name: user.user_metadata?.full_name } : null);
  const isAuthenticated = Boolean(user);

  const trialEndsAt = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const isTrialActive = Boolean(trialEndsAt && trialEndsAt.getTime() > Date.now());
  const subscriptionStatus = subscription?.status || 'inactive';
  const emailLower = user?.email?.toLowerCase() ?? '';
  const isSuperAdmin = Boolean(profile?.is_super_admin) || SUPER_ADMIN_EMAILS.has(emailLower);
  const hasActiveSubscription = ['active', 'trialing'].includes(subscriptionStatus);
  // Paywall only when we have a profile row with an expired trial (not while profile is still loading / missing).
  const requiresPayment =
    isSupabaseConfigured &&
    isAuthenticated &&
    isProfileReady &&
    profile != null &&
    !isSuperAdmin &&
    !hasActiveSubscription &&
    !isTrialActive;

  const refreshBilling = useCallback(async () => {
    if (!isSupabaseConfigured || !user?.id) return;
    const [p, sub] = await Promise.all([loadProfile(user.id), loadSubscription(user.id)]);
    setProfile(p);
    setSubscription(sub);
  }, [loadProfile, loadSubscription, user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: displayUser,
        rawProfile: profile,
        session,
        subscription,
        isAuthenticated,
        isLoadingAuth,
        isProfileReady,
        isSupabaseConfigured,
        isSupabaseKeyMisconfigured,
        isTrialActive,
        trialEndsAt,
        isSuperAdmin,
        requiresPayment,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        refreshBilling,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
