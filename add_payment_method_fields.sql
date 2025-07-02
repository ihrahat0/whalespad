-- Migration: Add payment method fields to project_submissions table
-- Date: $(date)
-- Description: Add support for payment method selection (native vs USDT) in presales

-- First, check if columns exist and add them if they don't
DO $$ 
BEGIN
    -- Add payment method column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'project_submissions' 
        AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE project_submissions 
        ADD COLUMN payment_method VARCHAR(10) DEFAULT 'native' 
        CHECK (payment_method IN ('native', 'usdt'));
    END IF;

    -- Add USDT token address column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'project_submissions' 
        AND column_name = 'usdt_token_address'
    ) THEN
        ALTER TABLE project_submissions 
        ADD COLUMN usdt_token_address VARCHAR(42);
    END IF;

    -- Add token address column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'project_submissions' 
        AND column_name = 'token_address'
    ) THEN
        ALTER TABLE project_submissions 
        ADD COLUMN token_address VARCHAR(42);
    END IF;
END $$;

-- Add comments for clarity
COMMENT ON COLUMN project_submissions.payment_method IS 'Payment method for presale: native token or USDT';
COMMENT ON COLUMN project_submissions.usdt_token_address IS 'USDT token contract address when payment_method is usdt';
COMMENT ON COLUMN project_submissions.token_address IS 'Token contract address (different from presale contract)';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_submissions_payment_method ON project_submissions(payment_method);
CREATE INDEX IF NOT EXISTS idx_project_submissions_token_address ON project_submissions(token_address);

-- Update existing records to have 'native' as default payment method
UPDATE project_submissions 
SET payment_method = 'native' 
WHERE payment_method IS NULL;

-- Show current state of relevant columns
SELECT 
    project_name,
    slug,
    payment_method,
    usdt_token_address,
    token_address,
    contract_address as presale_contract_address
FROM project_submissions 
ORDER BY created_at DESC 
LIMIT 10;

-- Add payment method fields to ido_pools table as well for consistency
ALTER TABLE ido_pools 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(10) DEFAULT 'native' CHECK (payment_method IN ('native', 'usdt'));

ALTER TABLE ido_pools 
ADD COLUMN IF NOT EXISTS usdt_token_address VARCHAR(42);

-- Add comment for clarity
COMMENT ON COLUMN ido_pools.payment_method IS 'Payment method for IDO pool: native token or USDT';
COMMENT ON COLUMN ido_pools.usdt_token_address IS 'USDT token contract address when payment_method is usdt';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ido_pools_payment_method ON ido_pools(payment_method);

-- Update existing ido_pools records to have default payment method
UPDATE ido_pools 
SET payment_method = 'native' 
WHERE payment_method IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
AND column_name IN ('payment_method', 'usdt_token_address')
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'ido_pools' 
AND column_name IN ('payment_method', 'usdt_token_address')
ORDER BY ordinal_position;

-- Test queries to ensure everything works
SELECT project_name, payment_method, usdt_token_address 
FROM project_submissions 
LIMIT 5;

SELECT id, payment_method, usdt_token_address 
FROM ido_pools 
LIMIT 5; 