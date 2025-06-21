-- Fix relationship for existing IDO pools
-- This script will connect your existing IDO pools to project submissions

-- Step 1: First, add the project_id column if it doesn't exist
ALTER TABLE ido_pools 
ADD COLUMN IF NOT EXISTS project_id uuid;

-- Step 2: Add missing columns to project_submissions if they don't exist
ALTER TABLE project_submissions 
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS banner_url text,
ADD COLUMN IF NOT EXISTS slug text;

-- Step 3: Create some sample projects for your existing IDO pools if none exist
INSERT INTO project_submissions (
    project_name,
    token_symbol,
    description,
    logo_url,
    banner_url,
    slug,
    status,
    category,
    total_supply,
    hard_cap,
    soft_cap,
    min_contribution,
    max_contribution,
    presale_start,
    presale_end
) 
SELECT 
    'Project for ' || COALESCE(ip.token_address, 'Unknown') as project_name,
    'TOKEN' || ROW_NUMBER() OVER (ORDER BY ip.created_at) as token_symbol,
    'Project description for IDO pool' as description,
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop&crop=center' as logo_url,
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&crop=center' as banner_url,
    'project-' || LOWER(REPLACE(ip.token_address, '0x', '')) as slug,
    'approved' as status,
    'DeFi' as category,
    ip.total_supply,
    ip.hard_cap,
    ip.soft_cap,
    ip.min_allocation as min_contribution,
    ip.max_allocation as max_contribution,
    ip.start_date as presale_start,
    ip.end_date as presale_end
FROM ido_pools ip
WHERE NOT EXISTS (
    SELECT 1 FROM project_submissions ps WHERE ps.id = ip.project_id
)
LIMIT (SELECT COUNT(*) FROM ido_pools WHERE project_id IS NULL);

-- Step 4: Connect existing IDO pools to projects
UPDATE ido_pools 
SET project_id = (
    SELECT ps.id 
    FROM project_submissions ps 
    WHERE ps.slug = 'project-' || LOWER(REPLACE(ido_pools.token_address, '0x', ''))
    LIMIT 1
)
WHERE project_id IS NULL;

-- Step 5: If some IDO pools still don't have projects, connect them to any available project
UPDATE ido_pools 
SET project_id = (
    SELECT ps.id 
    FROM project_submissions ps 
    WHERE ps.status = 'approved'
    LIMIT 1
)
WHERE project_id IS NULL;

-- Step 6: Add the foreign key constraint
ALTER TABLE ido_pools 
ADD CONSTRAINT fk_ido_pools_project 
FOREIGN KEY (project_id) REFERENCES project_submissions(id);

-- Step 7: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ido_pools_project_id ON ido_pools(project_id);

-- Step 8: Verify the connection works
SELECT 
    ip.id as ido_id,
    ip.hard_cap,
    ip.presale_rate,
    ip.status as ido_status,
    ps.project_name,
    ps.token_symbol,
    ps.logo_url,
    ps.banner_url,
    ps.slug
FROM ido_pools ip
LEFT JOIN project_submissions ps ON ip.project_id = ps.id
ORDER BY ip.created_at DESC; 