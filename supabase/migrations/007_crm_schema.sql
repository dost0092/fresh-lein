-- FreshLien CRM — multi-tenant schema (run AFTER 006)
-- Each row is scoped to an agent via user_id with RLS, mirroring the
-- saved_properties / alerts pattern from migration 006.
-- Safe/idempotent: re-running will not error.

-- ---------------------------------------------------------------------------
-- Contacts (leads owned by an agent)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  neighborhood TEXT NOT NULL DEFAULT '',
  property_type TEXT NOT NULL DEFAULT '',
  stage TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  opt_in BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, email)
);
CREATE INDEX IF NOT EXISTS crm_contacts_user_idx ON public.crm_contacts(user_id);
CREATE INDEX IF NOT EXISTS crm_contacts_tags_idx ON public.crm_contacts USING GIN(tags);

-- ---------------------------------------------------------------------------
-- Suppression list (unsubscribes, bounces, complaints) — never email again
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_suppressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT 'unsubscribe', -- unsubscribe | bounce | complaint
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, email)
);
CREATE INDEX IF NOT EXISTS crm_suppressions_user_idx ON public.crm_suppressions(user_id);

-- ---------------------------------------------------------------------------
-- Campaigns
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled campaign',
  channel TEXT NOT NULL DEFAULT 'email',
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  audience_tag TEXT NOT NULL DEFAULT 'all',
  status TEXT NOT NULL DEFAULT 'draft', -- draft | queued | sending | sent | failed
  total INT NOT NULL DEFAULT 0,
  sent_count INT NOT NULL DEFAULT 0,
  failed_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS crm_campaigns_user_idx ON public.crm_campaigns(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Messages = the send queue. One row per recipient.
-- The worker drains 'pending' rows in batches so a single request never has
-- to loop over thousands of sends (avoids Vercel serverless timeouts).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.crm_campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  reply_to TEXT,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | sending | sent | failed
  error TEXT,
  provider TEXT,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS crm_messages_campaign_idx ON public.crm_messages(campaign_id);
CREATE INDEX IF NOT EXISTS crm_messages_pending_idx
  ON public.crm_messages(created_at)
  WHERE status = 'pending';

-- ---------------------------------------------------------------------------
-- Row Level Security: an agent can only ever see/touch their own rows.
-- The serverless worker uses the service_role key, which bypasses RLS.
-- ---------------------------------------------------------------------------
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crm_contacts_own" ON public.crm_contacts;
CREATE POLICY "crm_contacts_own" ON public.crm_contacts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "crm_suppressions_own" ON public.crm_suppressions;
CREATE POLICY "crm_suppressions_own" ON public.crm_suppressions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "crm_campaigns_own" ON public.crm_campaigns;
CREATE POLICY "crm_campaigns_own" ON public.crm_campaigns
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "crm_messages_own" ON public.crm_messages;
CREATE POLICY "crm_messages_own" ON public.crm_messages
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
