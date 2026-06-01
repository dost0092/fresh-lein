-- FreshLien MVP schema
-- Run in Supabase SQL Editor or via: supabase db push

-- Users profile (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Counties
CREATE TABLE IF NOT EXISTS public.counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_name TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (county_name, state)
);

-- Foreclosure cases
CREATE TABLE IF NOT EXISTS public.foreclosure_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_id UUID REFERENCES public.counties(id),
  sheriff_number TEXT,
  court_case_number TEXT,
  sale_date DATE,
  plaintiff TEXT,
  defendant TEXT,
  property_address TEXT,
  city TEXT,
  state CHAR(2),
  zip_code TEXT,
  parcel_number TEXT,
  attorney_name TEXT,
  starting_bid NUMERIC(12, 2),
  appraised_value NUMERIC(12, 2),
  status TEXT DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.foreclosure_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foreclosure_case_id UUID REFERENCES public.foreclosure_cases(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  status_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  foreclosure_case_id UUID REFERENCES public.foreclosure_cases(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, foreclosure_case_id)
);

CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  county_id UUID REFERENCES public.counties(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan_name TEXT,
  status TEXT DEFAULT 'inactive',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foreclosure_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foreclosure_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Counties & foreclosures: readable by authenticated users
CREATE POLICY "counties_read" ON public.counties FOR SELECT TO authenticated USING (true);
CREATE POLICY "foreclosures_read" ON public.foreclosure_cases FOR SELECT TO authenticated USING (true);
CREATE POLICY "status_history_read" ON public.foreclosure_status_history FOR SELECT TO authenticated USING (true);

-- Allow anon read for public marketing demo (optional — remove for production)
CREATE POLICY "counties_read_anon" ON public.counties FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "foreclosures_read_anon" ON public.foreclosure_cases FOR SELECT TO anon USING (true);
CREATE POLICY "status_history_read_anon" ON public.foreclosure_status_history FOR SELECT TO anon USING (true);

-- Users: own row only
CREATE POLICY "users_select_own" ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Saved properties & alerts: own rows
CREATE POLICY "saved_own" ON public.saved_properties FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "alerts_own" ON public.alerts FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_own" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Seed counties (MVP list)
INSERT INTO public.counties (county_name, state) VALUES
  ('Allen', 'OH'), ('Ascension Parish', 'LA'), ('Atlantic', 'NJ'), ('Bergen', 'NJ'),
  ('Burlington', 'NJ'), ('Camden', 'NJ'), ('Canyon', 'ID'), ('Cape May', 'NJ'),
  ('Champaign', 'IL'), ('Cumberland', 'NJ'), ('Deschutes', 'OR'), ('Essex', 'NJ'),
  ('Gloucester', 'NJ'), ('Guadalupe', 'TX'), ('Hudson', 'NJ'), ('Hunterdon', 'NJ'),
  ('Josephine', 'OR'), ('Kent', 'DE'), ('Lake', 'IL'), ('Larimer', 'CO'),
  ('Lehigh', 'PA'), ('Lorain', 'OH'), ('Maricopa', 'AZ'), ('McLennan', 'TX'),
  ('Medina', 'OH'), ('Middlesex', 'NJ'), ('Monmouth', 'NJ'), ('Montgomery', 'PA'),
  ('Morris', 'NJ'), ('New Castle', 'DE'), ('Ocean', 'NJ'), ('Orleans Parish', 'LA'),
  ('Palm Beach', 'FL'), ('Passaic', 'NJ'), ('Philadelphia', 'PA'), ('Pottawattamie', 'IA'),
  ('Pulaski', 'AR'), ('Richland', 'OH'), ('Rockwall', 'TX'), ('Salem', 'NJ'),
  ('Santa Rosa', 'FL'), ('Scott', 'IA'), ('Shawnee', 'KS'), ('Snohomish', 'WA'),
  ('Stearns', 'MN'), ('Story', 'IA'), ('Sussex', 'DE'), ('Union', 'NJ')
ON CONFLICT (county_name, state) DO NOTHING;
