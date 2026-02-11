-- Migration: Create clients table
-- Description: Table to store client information including personal data and document images

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  curp VARCHAR(18) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  ine_front TEXT,  -- URL or path to INE front image
  ine_back TEXT,   -- URL or path to INE back image
  comprobant TEXT, -- URL or path to address proof document
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

-- Create index on deleted_at for efficient soft delete queries
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients(deleted_at);

-- Create index on curp for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_curp ON clients(curp) WHERE deleted_at IS NULL;

-- Create index on phone for search functionality
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone) WHERE deleted_at IS NULL;

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_clients_updated_at ON clients;
CREATE TRIGGER trigger_update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_clients_updated_at();

-- Add comment to table
COMMENT ON TABLE clients IS 'Stores client information including personal data and document images';
COMMENT ON COLUMN clients.ine_front IS 'URL or file path to INE front image';
COMMENT ON COLUMN clients.ine_back IS 'URL or file path to INE back image';
COMMENT ON COLUMN clients.comprobant IS 'URL or file path to address proof document';
COMMENT ON COLUMN clients.deleted_at IS 'Soft delete timestamp - NULL means active record';
