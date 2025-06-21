-- SAFE FIX: Remove NOT NULL constraints without dropping the table
-- This preserves any existing data

-- First, check current constraints
SELECT 
    column_name, 
    is_nullable, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
ORDER BY ordinal_position;

-- Remove NOT NULL constraints from all columns except ID
ALTER TABLE project_submissions 
    ALTER COLUMN project_name DROP NOT NULL,
    ALTER COLUMN token_symbol DROP NOT NULL,
    ALTER COLUMN token_address DROP NOT NULL,
    ALTER COLUMN chain_id DROP NOT NULL,
    ALTER COLUMN website DROP NOT NULL,
    ALTER COLUMN whitepaper DROP NOT NULL,
    ALTER COLUMN telegram DROP NOT NULL,
    ALTER COLUMN twitter DROP NOT NULL,
    ALTER COLUMN discord DROP NOT NULL,
    ALTER COLUMN github DROP NOT NULL,
    ALTER COLUMN description DROP NOT NULL,
    ALTER COLUMN email DROP NOT NULL,
    ALTER COLUMN wallet_address DROP NOT NULL,
    ALTER COLUMN has_kyc DROP NOT NULL,
    ALTER COLUMN kyc_link DROP NOT NULL,
    ALTER COLUMN has_audit DROP NOT NULL,
    ALTER COLUMN audit_link DROP NOT NULL,
    ALTER COLUMN status DROP NOT NULL,
    ALTER COLUMN submitted_at DROP NOT NULL,
    ALTER COLUMN created_at DROP NOT NULL,
    ALTER COLUMN updated_at DROP NOT NULL;

-- Handle potential different column name
DO $$
BEGIN
    -- Try to drop NOT NULL constraint on project_symbol if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'project_submissions' 
        AND column_name = 'project_symbol'
    ) THEN
        ALTER TABLE project_submissions ALTER COLUMN project_symbol DROP NOT NULL;
    END IF;
END $$;

-- Set safe defaults
ALTER TABLE project_submissions 
    ALTER COLUMN status SET DEFAULT 'pending',
    ALTER COLUMN has_kyc SET DEFAULT FALSE,
    ALTER COLUMN has_audit SET DEFAULT FALSE,
    ALTER COLUMN chain_id SET DEFAULT 1,
    ALTER COLUMN submitted_at SET DEFAULT NOW();

-- Verify the fix worked
SELECT 
    column_name, 
    is_nullable, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
ORDER BY ordinal_position; 