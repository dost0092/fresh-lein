-- FreshLien acquisition pipeline (Step 2)
-- Additive: does not alter foreclosure_cases, users, subscriptions, or CRM tables.
-- Apply in Supabase SQL Editor or: supabase db push
-- Safe/idempotent: re-running will not error on existing objects.

-- ---------------------------------------------------------------------------
-- Clients (B2B service accounts — wholesalers, investors, funds)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_name TEXT,
  phone TEXT,
  notes TEXT NOT NULL DEFAULT '',
  owner_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'churned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clients_owner_user_idx ON public.clients(owner_user_id);
CREATE INDEX IF NOT EXISTS clients_status_idx ON public.clients(status);

-- ---------------------------------------------------------------------------
-- Engagements (what a client is buying — drives which filings become leads)
-- config JSON example:
-- {
--   "counties": ["Atlantic", "Ocean"],
--   "states": ["NJ"],
--   "source_domains": ["foreclosure"],
--   "outreach": { "channel": "sms", "sequence_days": 3 },
--   "crm": { "provider": null }
-- }
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Default engagement',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS engagements_client_idx ON public.engagements(client_id);
CREATE INDEX IF NOT EXISTS engagements_status_idx ON public.engagements(status);

-- ---------------------------------------------------------------------------
-- Leads (acquisition pipeline — one filing per client, optional engagement)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES public.engagements(id) ON DELETE SET NULL,
  foreclosure_case_id UUID REFERENCES public.foreclosure_cases(id) ON DELETE SET NULL,
  parcel_id TEXT,
  source_domain TEXT NOT NULL DEFAULT 'foreclosure'
    CHECK (source_domain IN ('foreclosure', 'tax', 'probate', 'nod', 'manual', 'other')),
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN (
      'new', 'skip_traced', 'contacted', 'interested',
      'under_contract', 'closed', 'dead'
    )),
  score NUMERIC(6, 2),
  score_reason TEXT,
  owner_contact JSONB NOT NULL DEFAULT '{}'::jsonb,
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  offer_amount NUMERIC(12, 2),
  estimated_value NUMERIC(12, 2),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (client_id, foreclosure_case_id)
);

CREATE INDEX IF NOT EXISTS leads_client_status_idx ON public.leads(client_id, status);
CREATE INDEX IF NOT EXISTS leads_engagement_idx ON public.leads(engagement_id);
CREATE INDEX IF NOT EXISTS leads_case_idx ON public.leads(foreclosure_case_id);
CREATE INDEX IF NOT EXISTS leads_assigned_idx ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS leads_updated_idx ON public.leads(updated_at DESC);

-- ---------------------------------------------------------------------------
-- Lead activities (full audit trail)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL
    CHECK (activity_type IN (
      'call', 'sms', 'mail', 'email', 'status_change', 'note',
      'skip_trace', 'crm_sync', 'offer', 'system'
    )),
  content TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_activities_lead_idx
  ON public.lead_activities(lead_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Buyers (per-client buyer list for under-contract matching)
-- criteria JSON: { "price_min", "price_max", "counties", "states", "property_types" }
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'inactive')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS buyers_client_idx ON public.buyers(client_id);
CREATE INDEX IF NOT EXISTS buyers_status_idx ON public.buyers(client_id, status);

-- ---------------------------------------------------------------------------
-- updated_at helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS clients_set_updated_at ON public.clients;
CREATE TRIGGER clients_set_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS engagements_set_updated_at ON public.engagements;
CREATE TRIGGER engagements_set_updated_at
  BEFORE UPDATE ON public.engagements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS leads_set_updated_at ON public.leads;
CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS buyers_set_updated_at ON public.buyers;
CREATE TRIGGER buyers_set_updated_at
  BEFORE UPDATE ON public.buyers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: staff (owner or super admin) manages their clients; service role bypasses
-- ---------------------------------------------------------------------------
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_pipeline_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.is_super_admin = TRUE
  );
$$;

DROP POLICY IF EXISTS clients_staff_all ON public.clients;
CREATE POLICY clients_staff_all ON public.clients
  FOR ALL TO authenticated
  USING (owner_user_id = auth.uid() OR public.is_pipeline_staff())
  WITH CHECK (owner_user_id = auth.uid() OR public.is_pipeline_staff());

DROP POLICY IF EXISTS engagements_staff_all ON public.engagements;
CREATE POLICY engagements_staff_all ON public.engagements
  FOR ALL TO authenticated
  USING (
    public.is_pipeline_staff()
    OR EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = engagements.client_id AND c.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_pipeline_staff()
    OR EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = engagements.client_id AND c.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS leads_staff_all ON public.leads;
CREATE POLICY leads_staff_all ON public.leads
  FOR ALL TO authenticated
  USING (
    public.is_pipeline_staff()
    OR assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = leads.client_id AND c.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_pipeline_staff()
    OR EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = leads.client_id AND c.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS lead_activities_staff_all ON public.lead_activities;
CREATE POLICY lead_activities_staff_all ON public.lead_activities
  FOR ALL TO authenticated
  USING (
    public.is_pipeline_staff()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      JOIN public.clients c ON c.id = l.client_id
      WHERE l.id = lead_activities.lead_id
        AND (c.owner_user_id = auth.uid() OR l.assigned_to = auth.uid())
    )
  )
  WITH CHECK (
    public.is_pipeline_staff()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      JOIN public.clients c ON c.id = l.client_id
      WHERE l.id = lead_activities.lead_id
        AND (c.owner_user_id = auth.uid() OR l.assigned_to = auth.uid())
    )
  );

DROP POLICY IF EXISTS buyers_staff_all ON public.buyers;
CREATE POLICY buyers_staff_all ON public.buyers
  FOR ALL TO authenticated
  USING (
    public.is_pipeline_staff()
    OR EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = buyers.client_id AND c.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_pipeline_staff()
    OR EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = buyers.client_id AND c.owner_user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.clients IS 'B2B service clients for acquisition automation engagements';
COMMENT ON TABLE public.engagements IS 'Scoped delivery + outreach config per client';
COMMENT ON TABLE public.leads IS 'Acquisition lead pipeline statuses';
COMMENT ON TABLE public.lead_activities IS 'Audit trail for lead outreach and status changes';
COMMENT ON TABLE public.buyers IS 'Per-client cash buyer lists for under-contract matching';
