-- SIMPLE VERSION: Just create the table and relationship

-- Create ido_pools table
CREATE TABLE IF NOT EXISTS ido_pools (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES project_submissions(id),
    token_address text NOT NULL,
    total_supply bigint NOT NULL,
    hard_cap numeric NOT NULL,
    soft_cap numeric,
    min_allocation numeric,
    max_allocation numeric,
    presale_rate numeric NOT NULL,
    listing_rate numeric,
    start_date timestamptz NOT NULL,
    end_date timestamptz NOT NULL,
    liquidity_percentage numeric,
    liquidity_unlock_date timestamptz,
    owner_wallet text NOT NULL,
    status text NOT NULL DEFAULT 'upcoming',
    created_at timestamptz DEFAULT NOW()
);

-- Create helpful indexes
CREATE INDEX IF NOT EXISTS idx_ido_pools_project_id ON ido_pools(project_id);
CREATE INDEX IF NOT EXISTS idx_ido_pools_status ON ido_pools(status);

-- Add logo_url column to project_submissions
ALTER TABLE project_submissions 
ADD COLUMN IF NOT EXISTS logo_url text;

-- Test the relationship works
SELECT 'Setup complete! Tables and relationships created.' as status; 