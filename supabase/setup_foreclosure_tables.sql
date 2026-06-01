-- =============================================================================
-- FreshLien — Run this entire script in Supabase → SQL Editor → New query → Run
-- Creates: counties, foreclosure_cases, foreclosure_status_history
-- Plus: read policies + 12 sample foreclosure rows (matches the app demo data)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) COUNTIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_name TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (county_name, state)
);

-- -----------------------------------------------------------------------------
-- 2) FORECLOSURE CASES (main table your scraper fills)
-- -----------------------------------------------------------------------------
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3) STATUS HISTORY (timeline on detail page)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.foreclosure_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foreclosure_case_id UUID NOT NULL REFERENCES public.foreclosure_cases(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  status_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_county ON public.foreclosure_cases (county_id);
CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_sale_date ON public.foreclosure_cases (sale_date);
CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_status ON public.foreclosure_cases (status);
CREATE INDEX IF NOT EXISTS idx_foreclosure_cases_coords
  ON public.foreclosure_cases (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_status_history_case
  ON public.foreclosure_status_history (foreclosure_case_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_foreclosure_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_foreclosure_cases_updated_at ON public.foreclosure_cases;
CREATE TRIGGER trg_foreclosure_cases_updated_at
  BEFORE UPDATE ON public.foreclosure_cases
  FOR EACH ROW EXECUTE FUNCTION public.set_foreclosure_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security (app reads with anon or authenticated key)
-- -----------------------------------------------------------------------------
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foreclosure_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foreclosure_status_history ENABLE ROW LEVEL SECURITY;

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

-- Scraper: use service_role key to INSERT/UPDATE (bypasses RLS). Never expose in frontend.

-- -----------------------------------------------------------------------------
-- Seed counties used by sample foreclosures (+ MVP list)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- Seed 12 sample foreclosure_cases (matches src/data/sampleForeclosures.js)
-- Sale dates are relative to today so the demo stays fresh
-- -----------------------------------------------------------------------------
INSERT INTO public.foreclosure_cases (
  county_id, sheriff_number, court_case_number, sale_date,
  plaintiff, defendant, property_address, city, state, zip_code,
  parcel_number, attorney_name, starting_bid, appraised_value, status,
  latitude, longitude
)
SELECT
  c.id, v.sheriff_number, v.court_case_number, v.sale_date,
  v.plaintiff, v.defendant, v.property_address, v.city, v.prop_state, v.zip_code,
  v.parcel_number, v.attorney_name, v.starting_bid, v.appraised_value, v.status,
  v.latitude, v.longitude
FROM (VALUES
  ('Essex', 'NJ', '2024-SH-1847', 'CV-2024-009182', (CURRENT_DATE + 14),
   'Wells Fargo Bank NA', 'James R. Mitchell', '1428 Oakwood Ave', 'Newark', 'NJ', '07104',
   '14-0284-0001-00005', 'McCarter & English LLP', 185000, 312000, 'Scheduled', 40.7357, -74.1724),
  ('Palm Beach', 'FL', '2024-SH-2103', 'CV-2024-011445', (CURRENT_DATE + 28),
   'JPMorgan Chase Bank', 'Maria Elena Rodriguez', '892 Palm Beach Lakes Blvd', 'West Palm Beach', 'FL', '33401',
   '00-43-46-24-18-000-0180', 'Greenberg Traurig PA', 245000, 425000, 'Scheduled', 26.7153, -80.0534),
  ('Maricopa', 'AZ', '2024-SH-0892', 'CV-2023-088721', (CURRENT_DATE + 7),
   'Bank of America NA', 'Robert T. Henderson', '3347 N 7th St', 'Phoenix', 'AZ', '85014',
   '159-12-045', 'Quarles & Brady LLP', 198500, 289000, 'Scheduled', 33.5092, -112.034),
  ('Larimer', 'CO', '2024-SH-0561', 'CV-2024-004512', (CURRENT_DATE - 5),
   'US Bank National Association', 'Linda K. Patterson', '156 Main St', 'Fort Collins', 'CO', '80521',
   'R1234567', 'Holland & Hart LLP', 320000, 485000, 'Sold', 40.5853, -105.0844),
  ('Hudson', 'NJ', '2024-SH-1204', 'CV-2024-007891', (CURRENT_DATE + 21),
   'Citibank NA', 'David & Susan Chen', '78 River Rd', 'Hoboken', 'NJ', '07030',
   '08-0287-0002-00012', 'Gibbons PC', 425000, 675000, 'Scheduled', 40.744, -74.0324),
  ('Philadelphia', 'PA', '2024-SH-0338', 'CV-2024-002104', (CURRENT_DATE + 45),
   'PNC Bank NA', 'Michael J. O''Brien', '2210 Market St', 'Philadelphia', 'PA', '19103',
   '88-088-000', 'Cozen O''Connor', 156000, 245000, 'Appraisal', 39.9526, -75.1652),
  ('Lake', 'IL', '2024-SH-0991', 'CV-2023-055612', (CURRENT_DATE + 10),
   'Nationstar Mortgage LLC', 'Patricia A. Williams', '445 Lake Shore Dr', 'Waukegan', 'IL', '60085',
   '14-12-204-015', 'Baker & Hostetler LLP', 112000, 198000, 'Scheduled', 42.3636, -87.8448),
  ('McLennan', 'TX', '2024-SH-0445', 'CV-2024-003301', (CURRENT_DATE - 2),
   'Flagstar Bank FSB', 'Thomas W. Greene', '901 Commerce St', 'Waco', 'TX', '76701',
   'R-1234-5678', 'Haynes and Boone LLP', 89000, 142000, 'Cancelled', 31.5493, -97.1467),
  ('Atlantic', 'NJ', '2024-SH-1678', 'CV-2024-008234', (CURRENT_DATE + 35),
   'TD Bank NA', 'Jennifer L. Adams', '12 Harbor View Ln', 'Atlantic City', 'NJ', '08401',
   '01-00012-0001-00004', 'Lowenstein Sandler LLP', 178000, 295000, 'Scheduled', 39.3643, -74.4229),
  ('Medina', 'OH', '2024-SH-0789', 'CV-2024-005678', (CURRENT_DATE + 18),
   'Rocket Mortgage LLC', 'Steven & Karen Mueller', '567 Birchwood Ct', 'Medina', 'OH', '44256',
   'M-12-045-067', 'Brouse McDowell LLP', 165000, 248000, 'Scheduled', 41.1384, -81.8637),
  ('Maricopa', 'AZ', '2024-SH-1456', 'CV-2024-009901', (CURRENT_DATE + 42),
   'Ally Bank', 'Christopher J. Barnes', '2300 E Camelback Rd Unit 412', 'Phoenix', 'AZ', '85016',
   '159-28-112', 'Snell & Wilmer LLP', 92000, 165000, 'Appraisal', 33.5022, -112.039),
  ('Burlington', 'NJ', '2024-SH-2012', 'CV-2024-010567', (CURRENT_DATE + 5),
   'NewRez LLC', 'Angela M. Foster', '88 King St', 'Burlington', 'NJ', '08016',
   '06-00045-0001-00008', 'Parker McCay PA', 198000, 315000, 'Scheduled', 40.0712, -74.8649)
) AS v(county_name, county_state, sheriff_number, court_case_number, sale_date,
       plaintiff, defendant, property_address, city, prop_state, zip_code,
       parcel_number, attorney_name, starting_bid, appraised_value, status, latitude, longitude)
JOIN public.counties c ON c.county_name = v.county_name AND c.state = v.county_state
WHERE NOT EXISTS (
  SELECT 1 FROM public.foreclosure_cases fc
  WHERE fc.sheriff_number = v.sheriff_number AND fc.county_id = c.id
);

-- Status history for each seeded case (by sheriff_number)
INSERT INTO public.foreclosure_status_history (foreclosure_case_id, status, status_date)
SELECT fc.id, h.status, h.status_date
FROM public.foreclosure_cases fc
JOIN (VALUES
  ('2024-SH-1847', 'Appraisal', (CURRENT_DATE - 90)),
  ('2024-SH-1847', 'Scheduled', (CURRENT_DATE - 30)),
  ('2024-SH-2103', 'Appraisal', (CURRENT_DATE - 120)),
  ('2024-SH-2103', 'Scheduled', (CURRENT_DATE - 45)),
  ('2024-SH-0892', 'Appraisal', (CURRENT_DATE - 75)),
  ('2024-SH-0892', 'Scheduled', (CURRENT_DATE - 20)),
  ('2024-SH-0561', 'Appraisal', (CURRENT_DATE - 150)),
  ('2024-SH-0561', 'Scheduled', (CURRENT_DATE - 60)),
  ('2024-SH-0561', 'Sold', (CURRENT_DATE - 5)),
  ('2024-SH-1204', 'Appraisal', (CURRENT_DATE - 100)),
  ('2024-SH-1204', 'Scheduled', (CURRENT_DATE - 35)),
  ('2024-SH-0338', 'Appraisal', (CURRENT_DATE - 14)),
  ('2024-SH-0991', 'Appraisal', (CURRENT_DATE - 80)),
  ('2024-SH-0991', 'Scheduled', (CURRENT_DATE - 25)),
  ('2024-SH-0445', 'Appraisal', (CURRENT_DATE - 110)),
  ('2024-SH-0445', 'Scheduled', (CURRENT_DATE - 40)),
  ('2024-SH-0445', 'Cancelled', (CURRENT_DATE - 2)),
  ('2024-SH-1678', 'Appraisal', (CURRENT_DATE - 95)),
  ('2024-SH-1678', 'Scheduled', (CURRENT_DATE - 28)),
  ('2024-SH-0789', 'Appraisal', (CURRENT_DATE - 70)),
  ('2024-SH-0789', 'Scheduled', (CURRENT_DATE - 22)),
  ('2024-SH-1456', 'Appraisal', (CURRENT_DATE - 10)),
  ('2024-SH-2012', 'Appraisal', (CURRENT_DATE - 85)),
  ('2024-SH-2012', 'Scheduled', (CURRENT_DATE - 18))
) AS h(sheriff_number, status, status_date) ON h.sheriff_number = fc.sheriff_number
WHERE NOT EXISTS (
  SELECT 1 FROM public.foreclosure_status_history sh
  WHERE sh.foreclosure_case_id = fc.id AND sh.status = h.status AND sh.status_date = h.status_date
);

-- Done
SELECT 'counties' AS table_name, COUNT(*)::int AS rows FROM public.counties
UNION ALL
SELECT 'foreclosure_cases', COUNT(*)::int FROM public.foreclosure_cases
UNION ALL
SELECT 'foreclosure_status_history', COUNT(*)::int FROM public.foreclosure_status_history;
