-- Sender accounts: users connect their own Gmail/Outlook inbox
CREATE TABLE IF NOT EXISTS sender_accounts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email          TEXT NOT NULL,
  display_name   TEXT NOT NULL,
  provider       TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook', 'smtp')),
  smtp_host      TEXT NOT NULL DEFAULT 'smtp.gmail.com',
  smtp_port      INTEGER NOT NULL DEFAULT 587,
  smtp_user      TEXT NOT NULL,
  smtp_password_encrypted TEXT NOT NULL,
  daily_limit    INTEGER NOT NULL DEFAULT 500,
  sent_today     INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  status         TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  last_error     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE sender_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own senders"
  ON sender_accounts FOR ALL
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_sender_accounts_user ON sender_accounts(user_id);

-- Add sender_account_id to existing campaigns table (nullable — old campaigns still work)
ALTER TABLE crm_campaigns
  ADD COLUMN IF NOT EXISTS sender_account_id UUID REFERENCES sender_accounts(id) ON DELETE SET NULL;

-- Reset sent_today daily (called by cron). Safe to run multiple times.
CREATE OR REPLACE FUNCTION reset_sender_daily_counts()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE sender_accounts
  SET sent_today = 0, last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
END;
$$;
