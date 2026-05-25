-- Migration: Create personal_assets table
-- Stores items (bienes) registered in the Personal section

CREATE TABLE IF NOT EXISTS personal_assets (
    id          VARCHAR(9)    PRIMARY KEY,          -- 9-digit random serial, set by server
    object      TEXT          NOT NULL,             -- Description of the asset (Objeto)
    files       JSONB         NOT NULL DEFAULT '[]', -- Array of {name, url, resource_type}
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ   NULL                  -- Soft delete
);

-- Index to speed up soft-delete queries
CREATE INDEX IF NOT EXISTS idx_personal_assets_deleted_at ON personal_assets (deleted_at);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_personal_assets_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_personal_assets_updated_at
BEFORE UPDATE ON personal_assets
FOR EACH ROW EXECUTE FUNCTION update_personal_assets_timestamp();
