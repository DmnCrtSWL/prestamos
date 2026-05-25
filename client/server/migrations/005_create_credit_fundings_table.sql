-- Migration: Create credit_fundings table
-- Description: Table to store how much each provider contributes to a credit

CREATE TABLE IF NOT EXISTS credit_fundings (
  id SERIAL PRIMARY KEY,
  credit_id INTEGER NOT NULL REFERENCES credits(id) ON DELETE CASCADE,
  provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_credit_fundings_credit_id ON credit_fundings(credit_id);
CREATE INDEX IF NOT EXISTS idx_credit_fundings_provider_id ON credit_fundings(provider_id);

-- Trigger for updated_at
CREATE TRIGGER update_credit_fundings_updated_at
  BEFORE UPDATE ON credit_fundings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add provider_id to incomes table to track which provider receives the payment
-- Or maybe we don't need this yet? The user said "Esta cantidad se resta del perfil de proveedor".
-- That implies taking money OUT of provider to give to client.
-- When client PAYS back, it goes back to providers?
-- User didn't specify return logic yet, just funding logic.
-- Focus on funding logic.

