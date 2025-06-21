-- Create ido_pools table if it doesn't exist

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
    status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

-- Create index on project_id for better performance
CREATE INDEX IF NOT EXISTS idx_ido_pools_project_id ON ido_pools(project_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_ido_pools_status ON ido_pools(status);

-- Add logo_url column to project_submissions if it doesn't exist
ALTER TABLE project_submissions 
ADD COLUMN IF NOT EXISTS logo_url text;

-- Add RLS (Row Level Security) policy for ido_pools
ALTER TABLE ido_pools ENABLE ROW LEVEL SECURITY;

-- Allow public read access to ido_pools
CREATE POLICY IF NOT EXISTS "Allow public read access on ido_pools" 
ON ido_pools FOR SELECT 
USING (true);

-- Allow authenticated users to insert/update ido_pools (for admin)
CREATE POLICY IF NOT EXISTS "Allow authenticated insert/update on ido_pools" 
ON ido_pools FOR ALL 
USING (auth.role() = 'authenticated');

-- Verify the table was created successfully
SELECT 
    'ido_pools' as table_name,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_name = 'ido_pools'; 