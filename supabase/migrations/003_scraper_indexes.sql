-- Optional: run after 001 + 002 for faster scraper upserts and lookups

-- Prevent duplicate sheriff sales per county (adjust if your source uses court_case_number instead)
CREATE UNIQUE INDEX IF NOT EXISTS idx_foreclosure_cases_sheriff_county
  ON public.foreclosure_cases (county_id, sheriff_number)
  WHERE sheriff_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_sale_date ON public.foreclosure_cases (sale_date);
CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_status ON public.foreclosure_cases (status);
CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_county ON public.foreclosure_cases (county_id);

-- Service role bypasses RLS — use SUPABASE_SERVICE_ROLE_KEY in your scraper only (never in the browser)
