-- Fix Database Constraints for project_submissions Table
-- This removes NOT NULL constraints that are causing submission failures

-- First, let's see what constraints exist
SELECT 
    column_name, 
    is_nullable, 
    column_default,
    data_type
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
AND is_nullable = 'NO'
ORDER BY column_name;

-- Remove NOT NULL constraints from columns that should be optional
ALTER TABLE project_submissions 
ALTER COLUMN project_name DROP NOT NULL,
ALTER COLUMN token_symbol DROP NOT NULL,
ALTER COLUMN email DROP NOT NULL,
ALTER COLUMN description DROP NOT NULL,
ALTER COLUMN token_address DROP NOT NULL,
ALTER COLUMN website DROP NOT NULL,
ALTER COLUMN whitepaper DROP NOT NULL,
ALTER COLUMN telegram DROP NOT NULL,
ALTER COLUMN twitter DROP NOT NULL,
ALTER COLUMN discord DROP NOT NULL,
ALTER COLUMN github DROP NOT NULL,
ALTER COLUMN wallet_address DROP NOT NULL,
ALTER COLUMN chain_id DROP NOT NULL,
ALTER COLUMN has_kyc DROP NOT NULL,
ALTER COLUMN kyc_link DROP NOT NULL,
ALTER COLUMN has_audit DROP NOT NULL,
ALTER COLUMN audit_link DROP NOT NULL,
ALTER COLUMN status DROP NOT NULL,
ALTER COLUMN submitted_at DROP NOT NULL;

-- Set default values for important columns
ALTER TABLE project_submissions 
ALTER COLUMN status SET DEFAULT 'pending',
ALTER COLUMN has_kyc SET DEFAULT FALSE,
ALTER COLUMN has_audit SET DEFAULT FALSE,
ALTER COLUMN chain_id SET DEFAULT 1,
ALTER COLUMN submitted_at SET DEFAULT NOW();

-- Verify the changes
SELECT 
    column_name, 
    is_nullable, 
    column_default,
    data_type
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
ORDER BY ordinal_position; 