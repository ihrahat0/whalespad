-- SIMPLE FIX: Just create the relationship between ido_pools and project_submissions

-- Step 1: Add project_id column to ido_pools table
ALTER TABLE ido_pools 
ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES project_submissions(id);

-- Step 2: Create index for better performance  
CREATE INDEX IF NOT EXISTS idx_ido_pools_project_id ON ido_pools(project_id);

-- Step 3: Add logo_url column to project_submissions (safe if exists)
ALTER TABLE project_submissions 
ADD COLUMN IF NOT EXISTS logo_url text;

-- That's it! The relationship is now established.
-- You can verify with:
-- SELECT COUNT(*) FROM ido_pools;
-- SELECT COUNT(*) FROM project_submissions; 