-- FINAL BULLETPROOF FIX
-- Only removes constraints from columns that actually exist

-- First, see what columns we actually have
SELECT column_name, is_nullable, data_type
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
ORDER BY ordinal_position;

-- Remove NOT NULL constraints only from existing columns
DO $$
DECLARE
    col_name TEXT;
    columns_to_fix TEXT[] := ARRAY[
        'project_name', 'token_symbol', 'token_address', 'chain_id',
        'website', 'whitepaper', 'telegram', 'twitter', 'discord', 'github',
        'description', 'email', 'wallet_address', 'has_kyc', 'kyc_link',
        'has_audit', 'audit_link', 'status', 'submitted_at', 'created_at', 'updated_at'
    ];
BEGIN
    FOREACH col_name IN ARRAY columns_to_fix
    LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'project_submissions' 
            AND column_name = col_name
        ) THEN
            EXECUTE format('ALTER TABLE project_submissions ALTER COLUMN %I DROP NOT NULL', col_name);
            RAISE NOTICE 'Removed NOT NULL constraint from column: %', col_name;
        ELSE
            RAISE NOTICE 'Column % does not exist, skipping', col_name;
        END IF;
    END LOOP;
END $$;

-- Set defaults for columns that exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_submissions' AND column_name = 'status') THEN
        ALTER TABLE project_submissions ALTER COLUMN status SET DEFAULT 'pending';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_submissions' AND column_name = 'has_kyc') THEN
        ALTER TABLE project_submissions ALTER COLUMN has_kyc SET DEFAULT FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_submissions' AND column_name = 'has_audit') THEN
        ALTER TABLE project_submissions ALTER COLUMN has_audit SET DEFAULT FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_submissions' AND column_name = 'chain_id') THEN
        ALTER TABLE project_submissions ALTER COLUMN chain_id SET DEFAULT 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_submissions' AND column_name = 'submitted_at') THEN
        ALTER TABLE project_submissions ALTER COLUMN submitted_at SET DEFAULT NOW();
    END IF;
END $$;

-- Final verification
SELECT 
    column_name, 
    is_nullable, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
ORDER BY ordinal_position; 