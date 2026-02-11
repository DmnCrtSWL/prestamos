-- Migration: Add user column to clients table
-- Description: Add user column to track which user created the client

-- Add user column (nullable for now, will be populated when roles are established)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS user VARCHAR(100);

-- Add index on user for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user) WHERE deleted_at IS NULL;

-- Add comment to column
COMMENT ON COLUMN clients.user IS 'Username of the user who created this client record';
