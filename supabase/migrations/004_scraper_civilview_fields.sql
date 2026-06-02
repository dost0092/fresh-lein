-- CivilView scraper: county/source IDs, property IDs, run logs

ALTER TABLE public.counties
  ADD COLUMN IF NOT EXISTS civilview_county_id TEXT,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS last_scraped_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS scraper_status TEXT DEFAULT 'pending';

ALTER TABLE public.foreclosure_cases
  ADD COLUMN IF NOT EXISTS civilview_property_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_counties_civilview_id
  ON public.counties (civilview_county_id)
  WHERE civilview_county_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_foreclosure_cases_civilview_property
  ON public.foreclosure_cases (county_id, civilview_property_id)
  WHERE civilview_property_id IS NOT NULL;

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

CREATE INDEX IF NOT EXISTS idx_scraper_runs_started ON public.scraper_runs (started_at DESC);

ALTER TABLE public.scraper_runs ENABLE ROW LEVEL SECURITY;

-- Read-only for authenticated (admin UI later); scraper uses service_role
DROP POLICY IF EXISTS "scraper_runs_read_authenticated" ON public.scraper_runs;
CREATE POLICY "scraper_runs_read_authenticated" ON public.scraper_runs
  FOR SELECT TO authenticated USING (true);
