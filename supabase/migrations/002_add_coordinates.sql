-- Add map coordinates to foreclosure cases (populate via geocoding when scraping)
ALTER TABLE public.foreclosure_cases
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_coords
  ON public.foreclosure_cases (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
