-- FreshLien: users profile + 13-day trial + Stripe billing
-- Safe to run even if migration 001 was never applied (creates tables first).

-- ---------------------------------------------------------------------------
-- 1) public.users (profile linked to auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
  trial_started_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ---------------------------------------------------------------------------
-- 2) public.subscriptions (Stripe sync)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_name TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  price_id TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS plan_name TEXT;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'inactive';
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS price_id TEXT;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_id_unique ON public.subscriptions(user_id);

-- ---------------------------------------------------------------------------
-- 3) Backfill profiles from auth.users (existing signups)
-- ---------------------------------------------------------------------------
INSERT INTO public.users (id, email, full_name, trial_started_at, trial_ends_at, created_at)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE(u.created_at, NOW()),
  COALESCE(u.created_at, NOW()) + INTERVAL '13 days',
  COALESCE(u.created_at, NOW())
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.users p WHERE p.id = u.id);

-- Fill trial dates on rows that are missing them
UPDATE public.users
SET
  trial_started_at = COALESCE(trial_started_at, created_at, NOW()),
  trial_ends_at = COALESCE(trial_ends_at, COALESCE(trial_started_at, created_at, NOW()) + INTERVAL '13 days')
WHERE trial_started_at IS NULL OR trial_ends_at IS NULL;

-- ---------------------------------------------------------------------------
-- 4) Super admins (full access, no paywall)
-- ---------------------------------------------------------------------------
UPDATE public.users
SET is_super_admin = TRUE
WHERE lower(email) IN (
  'waqasdostdost0092@gmail.com',
  'waqaskhan.dost0092@gmail.com',
  'waqasdost0092@gmail.com'
);

-- Active subscription row for super admins (app treats as paid)
INSERT INTO public.subscriptions (user_id, plan_name, status)
SELECT u.id, 'Super Admin', 'active'
FROM public.users u
WHERE u.is_super_admin = TRUE
ON CONFLICT (user_id) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  status = 'active';

-- ---------------------------------------------------------------------------
-- 5) Signup trigger (profile + 13-day trial + super admin by email)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_super BOOLEAN;
BEGIN
  v_is_super := lower(NEW.email) IN (
    'waqasdostdost0092@gmail.com',
    'waqaskhan.dost0092@gmail.com',
    'waqasdost0092@gmail.com'
  );

  INSERT INTO public.users (id, email, full_name, is_super_admin, trial_started_at, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    v_is_super,
    NOW(),
    NOW() + INTERVAL '13 days'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    is_super_admin = public.users.is_super_admin OR EXCLUDED.is_super_admin;

  IF v_is_super THEN
    INSERT INTO public.subscriptions (user_id, plan_name, status)
    VALUES (NEW.id, 'Super Admin', 'active')
    ON CONFLICT (user_id) DO UPDATE SET
      plan_name = EXCLUDED.plan_name,
      status = 'active';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 6) Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "subscriptions_own" ON public.subscriptions;
CREATE POLICY "subscriptions_own"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
