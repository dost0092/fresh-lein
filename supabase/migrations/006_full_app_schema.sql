-- FreshLien full app schema (run AFTER 005)
-- Safe/idempotent: creates anything missing from 001–004 without breaking users/billing from 005.
-- Your foreclosure data is kept as-is.

-- ---------------------------------------------------------------------------
-- Counties (reference + scraper metadata)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_name TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (county_name, state)
);

ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS civilview_county_id TEXT;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS last_scraped_at TIMESTAMPTZ;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS scraper_status TEXT DEFAULT 'pending';

-- ---------------------------------------------------------------------------
-- Foreclosure cases + status history
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.foreclosure_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_id UUID REFERENCES public.counties(id) ON DELETE SET NULL,
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
  status TEXT NOT NULL DEFAULT 'Scheduled',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  civilview_property_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.foreclosure_cases ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.foreclosure_cases ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE public.foreclosure_cases ADD COLUMN IF NOT EXISTS civilview_property_id TEXT;
ALTER TABLE public.foreclosure_cases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS public.foreclosure_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foreclosure_case_id UUID NOT NULL REFERENCES public.foreclosure_cases(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  status_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- User features: saved properties + county alerts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  foreclosure_case_id UUID NOT NULL REFERENCES public.foreclosure_cases(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, foreclosure_case_id)
);

CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  county_id UUID NOT NULL REFERENCES public.counties(id) ON DELETE CASCADE,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, county_id)
);

-- ---------------------------------------------------------------------------
-- Scraper ops (004)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scraper_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  counties_total INT DEFAULT 0,
  counties_ok INT DEFAULT 0,
  counties_failed INT DEFAULT 0,
  properties_found INT DEFAULT 0,
  properties_upserted INT DEFAULT 0,
  properties_failed INT DEFAULT 0,
  error_summary TEXT,
  log_excerpt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Indexes (002 + 003 + 004)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_coords
  ON public.foreclosure_cases (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_foreclosure_cases_sheriff_county
  ON public.foreclosure_cases (county_id, sheriff_number)
  WHERE sheriff_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_sale_date ON public.foreclosure_cases (sale_date);
CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_status ON public.foreclosure_cases (status);
CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_county ON public.foreclosure_cases (county_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_counties_civilview_id
  ON public.counties (civilview_county_id)
  WHERE civilview_county_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_foreclosure_cases_civilview_property
  ON public.foreclosure_cases (county_id, civilview_property_id)
  WHERE civilview_property_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_status_history_case
  ON public.foreclosure_status_history (foreclosure_case_id);

CREATE INDEX IF NOT EXISTS idx_scraper_runs_started ON public.scraper_runs (started_at DESC);

-- Auto-update updated_at on foreclosure edits
CREATE OR REPLACE FUNCTION public.set_foreclosure_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_foreclosure_cases_updated_at ON public.foreclosure_cases;
CREATE TRIGGER trg_foreclosure_cases_updated_at
  BEFORE UPDATE ON public.foreclosure_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.set_foreclosure_updated_at();

-- ---------------------------------------------------------------------------
-- County seed (no-op if already present)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Row Level Security + policies
-- ---------------------------------------------------------------------------
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foreclosure_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foreclosure_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraper_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "counties_read_authenticated" ON public.counties;
CREATE POLICY "counties_read_authenticated" ON public.counties
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "counties_read_anon" ON public.counties;
CREATE POLICY "counties_read_anon" ON public.counties
  FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS "foreclosures_read_authenticated" ON public.foreclosure_cases;
CREATE POLICY "foreclosures_read_authenticated" ON public.foreclosure_cases
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "foreclosures_read_anon" ON public.foreclosure_cases;
CREATE POLICY "foreclosures_read_anon" ON public.foreclosure_cases
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "status_history_read_authenticated" ON public.foreclosure_status_history;
CREATE POLICY "status_history_read_authenticated" ON public.foreclosure_status_history
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "status_history_read_anon" ON public.foreclosure_status_history;
CREATE POLICY "status_history_read_anon" ON public.foreclosure_status_history
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "saved_own" ON public.saved_properties;
CREATE POLICY "saved_own" ON public.saved_properties
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "alerts_own" ON public.alerts;
CREATE POLICY "alerts_own" ON public.alerts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "scraper_runs_read_authenticated" ON public.scraper_runs;
CREATE POLICY "scraper_runs_read_authenticated" ON public.scraper_runs
  FOR SELECT TO authenticated USING (true);

-- Legacy policy names from 001 (avoid duplicates)
DROP POLICY IF EXISTS "counties_read" ON public.counties;
DROP POLICY IF EXISTS "foreclosures_read" ON public.foreclosure_cases;
DROP POLICY IF EXISTS "status_history_read" ON public.foreclosure_status_history;

-- ---------------------------------------------------------------------------
-- API grants (Supabase REST)
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON public.counties, public.foreclosure_cases, public.foreclosure_status_history TO anon, authenticated;
GRANT SELECT ON public.scraper_runs TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_properties TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Summary
SELECT 'counties' AS table_name, COUNT(*)::int AS rows FROM public.counties
UNION ALL SELECT 'foreclosure_cases', COUNT(*)::int FROM public.foreclosure_cases
UNION ALL SELECT 'foreclosure_status_history', COUNT(*)::int FROM public.foreclosure_status_history
UNION ALL SELECT 'saved_properties', COUNT(*)::int FROM public.saved_properties
UNION ALL SELECT 'alerts', COUNT(*)::int FROM public.alerts
UNION ALL SELECT 'users', COUNT(*)::int FROM public.users
UNION ALL SELECT 'subscriptions', COUNT(*)::int FROM public.subscriptions;
