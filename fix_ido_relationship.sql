-- Fix IDO pools relationship with project_submissions
-- This script ensures proper foreign key relationship and creates sample IDO pools

-- First check if the project_id column exists in ido_pools table
ALTER TABLE ido_pools 
ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES project_submissions(id);

-- Create an index on project_id for better performance
CREATE INDEX IF NOT EXISTS idx_ido_pools_project_id ON ido_pools(project_id);

-- Update any existing IDO pools to link to actual projects (if any exist)
-- This is a placeholder - in production you'd map them properly
UPDATE ido_pools 
SET project_id = (
    SELECT id FROM project_submissions 
    WHERE status = 'approved' 
    LIMIT 1
)
WHERE project_id IS NULL;

-- Create a sample IDO pool for the first approved project (if any)
INSERT INTO ido_pools (
    project_id,
    token_address, 
    total_supply,
    hard_cap,
    soft_cap,
    min_allocation,
    max_allocation,
    presale_rate,
    listing_rate,
    start_date,
    end_date,
    liquidity_percentage,
    liquidity_unlock_date,
    owner_wallet,
    status
)
SELECT 
    ps.id as project_id,
    '0x1234567890123456789012345678901234567890' as token_address,
    1000000 as total_supply,
    100 as hard_cap,
    50 as soft_cap,
    0.1 as min_allocation,
    10 as max_allocation,
    1000 as presale_rate,
    800 as listing_rate,
    NOW() + INTERVAL '1 day' as start_date,
    NOW() + INTERVAL '7 days' as end_date,
    80 as liquidity_percentage,
    NOW() + INTERVAL '30 days' as liquidity_unlock_date,
    ps.wallet_address as owner_wallet,
    'upcoming' as status
FROM project_submissions ps
WHERE ps.status = 'approved'
AND NOT EXISTS (
    SELECT 1 FROM ido_pools ip WHERE ip.project_id = ps.id
)
LIMIT 1;

-- Verify the relationship works
SELECT 
    ip.*,
    ps.project_name,
    ps.token_symbol,
    ps.logo_url
FROM ido_pools ip
JOIN project_submissions ps ON ip.project_id = ps.id; 