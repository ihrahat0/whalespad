-- Simple fix: Just ensure required columns accept NULL
-- Run this if the emergency fix doesn't work

ALTER TABLE project_submissions ALTER COLUMN project_name DROP NOT NULL;
ALTER TABLE project_submissions ALTER COLUMN token_symbol DROP NOT NULL;
ALTER TABLE project_submissions ALTER COLUMN email DROP NOT NULL;
ALTER TABLE project_submissions ALTER COLUMN description DROP NOT NULL;
ALTER TABLE project_submissions ALTER COLUMN wallet_address DROP NOT NULL;

-- If the column is named differently, try this:
ALTER TABLE project_submissions ALTER COLUMN project_symbol DROP NOT NULL;

-- Set defaults
ALTER TABLE project_submissions ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE project_submissions ALTER COLUMN has_kyc SET DEFAULT false;
ALTER TABLE project_submissions ALTER COLUMN has_audit SET DEFAULT false;

-- Check what we have now
SELECT column_name, is_nullable FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
AND is_nullable = 'NO'; 