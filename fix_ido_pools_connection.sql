-- Fix IDO Pools Connection to Project System
-- This script connects your existing ido_pools data to the project ecosystem

-- First, check what we have in ido_pools
SELECT 'Current ido_pools data:' as info;
SELECT * FROM ido_pools;

-- 1. Add missing columns to ido_pools if they don't exist
ALTER TABLE ido_pools 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES project_submissions(id),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create project_submissions entries for existing ido_pools data (if they don't have project_id)
-- This will create a project_submission for each ido_pool that doesn't have a project_id

INSERT INTO project_submissions (
    id,
    project_name,
    token_symbol,
    description,
    email,
    website,
    status,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid() as id,
    COALESCE(project_name, 'Project ' || token_symbol) as project_name,
    COALESCE(token_symbol, 'TOKEN') as token_symbol,
    COALESCE(description, 'Automated project entry for IDO Pool') as description,
    'admin@whalespad.io' as email,
    website as website,
    'approved' as status,
    COALESCE(created_at, NOW()) as created_at,
    NOW() as updated_at
FROM ido_pools 
WHERE project_id IS NULL
AND NOT EXISTS (
    SELECT 1 FROM project_submissions ps 
    WHERE ps.project_name = ido_pools.project_name 
    OR ps.token_symbol = ido_pools.token_symbol
);

-- 3. Update ido_pools to link to their corresponding project_submissions
UPDATE ido_pools 
SET project_id = ps.id
FROM project_submissions ps
WHERE ido_pools.project_id IS NULL
AND (
    ps.project_name = ido_pools.project_name 
    OR ps.token_symbol = ido_pools.token_symbol
);

-- 4. Create or replace the project_details_view that the frontend uses
CREATE OR REPLACE VIEW project_details_view AS
SELECT 
    ps.id,
    ps.project_name,
    ps.token_symbol,
    ps.description,
    ps.website,
    ps.telegram,
    ps.twitter,
    ps.email,
    ps.audit_link,
    ps.whitepaper,
    ps.logo_url,
    ps.banner_url,
    ps.category,
    ps.status,
    ps.created_at,
    ps.updated_at,
    -- IDO Pool information (if available)
    ip.id as ido_pool_id,
    ip.token_address,
    ip.total_supply,
    ip.hard_cap,
    ip.soft_cap,
    ip.presale_rate,
    ip.listing_rate,
    ip.start_date as ido_start_date,
    ip.end_date as ido_end_date,
    ip.status as ido_status,
    -- Additional computed fields
    CASE 
        WHEN ip.end_date < NOW() THEN 'completed'
        WHEN ip.start_date > NOW() THEN 'upcoming'
        ELSE 'active'
    END as computed_status
FROM project_submissions ps
LEFT JOIN ido_pools ip ON ps.id = ip.project_id
WHERE ps.status = 'approved';

-- 5. Enable RLS on project_details_view (views inherit from base tables)
-- The view will inherit RLS from project_submissions and ido_pools

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ido_pools_project_id ON ido_pools(project_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_status ON project_submissions(status);
CREATE INDEX IF NOT EXISTS idx_ido_pools_status ON ido_pools(status);

-- 7. Update any existing ido_pools status to match expected values
UPDATE ido_pools 
SET status = CASE 
    WHEN end_date < NOW() THEN 'completed'
    WHEN start_date > NOW() THEN 'upcoming'
    ELSE 'active'
END
WHERE status IS NULL OR status NOT IN ('upcoming', 'active', 'completed', 'cancelled');

-- 8. Show the results
SELECT 'Final project_details_view data:' as info;
SELECT * FROM project_details_view ORDER BY created_at DESC;

SELECT 'IDO Pools with project connections:' as info;
SELECT 
    ip.id,
    ip.project_name,
    ip.token_symbol,
    ip.status,
    ps.project_name as linked_project_name,
    ps.id as project_submission_id
FROM ido_pools ip
LEFT JOIN project_submissions ps ON ip.project_id = ps.id; 