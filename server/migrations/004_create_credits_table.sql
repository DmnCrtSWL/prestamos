-- Migration: Create credits table
-- Description: Table to store all credit/loan information from simulator and approval process

CREATE TABLE IF NOT EXISTS credits (
  id SERIAL PRIMARY KEY,
  
  -- Client Information (Foreign Key)
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  
  -- Loan Details
  loan_amount DECIMAL(10, 2) NOT NULL, -- Monto solicitado (prestamo)
  retention_amount DECIMAL(10, 2) NOT NULL, -- Gastos administrativos (10%)
  net_received DECIMAL(10, 2) NOT NULL, -- Monto neto que recibe el cliente
  weekly_payment DECIMAL(10, 2) NOT NULL, -- Pago semanal
  total_to_pay DECIMAL(10, 2) NOT NULL, -- Total a pagar
  weeks INTEGER NOT NULL DEFAULT 12, -- Número de semanas
  
  -- User who granted the loan
  "user" VARCHAR(100), -- Usuario que otorga el préstamo
  
  -- Guarantor (Aval) Information
  guarantor_name VARCHAR(255) NOT NULL,
  guarantor_phone VARCHAR(20) NOT NULL,
  guarantor_address TEXT NOT NULL,
  guarantor_ine_front TEXT, -- Path to INE frontal image
  guarantor_ine_back TEXT, -- Path to INE reverso image
  guarantor_address_proof TEXT, -- Path to comprobante de domicilio
  
  -- Payment Schedule (stored as JSON)
  payment_schedule JSONB, -- Array of payment dates and amounts
  
  -- Credit Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, active, completed, defaulted
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL, -- For soft deletes
  
  -- Constraints
  CONSTRAINT positive_loan_amount CHECK (loan_amount > 0),
  CONSTRAINT positive_weekly_payment CHECK (weekly_payment > 0),
  CONSTRAINT valid_weeks CHECK (weeks > 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed', 'defaulted'))
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_credits_client_id ON credits(client_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_credits_status ON credits(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_credits_user ON credits("user") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_credits_created_at ON credits(created_at DESC) WHERE deleted_at IS NULL;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_credits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_credits_updated_at
  BEFORE UPDATE ON credits
  FOR EACH ROW
  EXECUTE FUNCTION update_credits_updated_at();

-- Comments for documentation
COMMENT ON TABLE credits IS 'Stores all credit/loan information including client, guarantor, and payment details';
COMMENT ON COLUMN credits.client_id IS 'Reference to the client receiving the loan';
COMMENT ON COLUMN credits.loan_amount IS 'Original loan amount requested';
COMMENT ON COLUMN credits.retention_amount IS 'Administrative fees (10% of loan amount)';
COMMENT ON COLUMN credits.net_received IS 'Net amount client receives after retention';
COMMENT ON COLUMN credits.weekly_payment IS 'Amount to be paid each week';
COMMENT ON COLUMN credits.total_to_pay IS 'Total amount to be repaid (loan + interest)';
COMMENT ON COLUMN credits.payment_schedule IS 'JSON array of scheduled payment dates and amounts';
COMMENT ON COLUMN credits.status IS 'Current status of the credit';
COMMENT ON COLUMN credits."user" IS 'Username of the user who granted the loan';
