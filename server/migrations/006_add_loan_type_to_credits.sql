-- Migration 006: Add loan_type column to credits table
ALTER TABLE credits
  ADD COLUMN IF NOT EXISTS loan_type VARCHAR(50) NOT NULL DEFAULT 'Tradicional';

COMMENT ON COLUMN credits.loan_type IS 'Tipo de crédito: Tradicional, 10% Semanal, Personalizado';
