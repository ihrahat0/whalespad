-- Complete Schema Update for project_submissions Table
-- Run this in your Supabase SQL Editor to add all missing columns

-- Add ALL missing columns that are being used in the form
ALTER TABLE project_submissions 
ADD COLUMN IF NOT EXISTS project_name TEXT,
ADD COLUMN IF NOT EXISTS token_symbol TEXT,
ADD COLUMN IF NOT EXISTS token_address TEXT,
ADD COLUMN IF NOT EXISTS chain_id INTEGER,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS whitepaper TEXT,
ADD COLUMN IF NOT EXISTS telegram TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS discord TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS has_kyc BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS kyc_link TEXT,
ADD COLUMN IF NOT EXISTS has_audit BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS audit_link TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records with default values where needed
UPDATE project_submissions 
SET 
    chain_id = COALESCE(chain_id, 1),
    status = COALESCE(status, 'pending'),
    has_kyc = COALESCE(has_kyc, FALSE),
    has_audit = COALESCE(has_audit, FALSE),
    submitted_at = COALESCE(submitted_at, NOW()),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE chain_id IS NULL OR status IS NULL OR submitted_at IS NULL;

-- Add helpful comments to describe each column
COMMENT ON COLUMN project_submissions.project_name IS 'Name of the project';
COMMENT ON COLUMN project_submissions.token_symbol IS 'Token ticker symbol (e.g., BTC, ETH)';
COMMENT ON COLUMN project_submissions.token_address IS 'Smart contract address of the token';
COMMENT ON COLUMN project_submissions.chain_id IS 'Blockchain network ID (1=Ethereum, 56=BSC, 137=Polygon, 42161=Arbitrum)';
COMMENT ON COLUMN project_submissions.website IS 'Project official website URL';
COMMENT ON COLUMN project_submissions.whitepaper IS 'Whitepaper or documentation URL';
COMMENT ON COLUMN project_submissions.telegram IS 'Telegram channel or group link';
COMMENT ON COLUMN project_submissions.twitter IS 'Twitter/X handle or profile link';
COMMENT ON COLUMN project_submissions.discord IS 'Discord server invite link';
COMMENT ON COLUMN project_submissions.github IS 'GitHub repository or organization link';
COMMENT ON COLUMN project_submissions.description IS 'Detailed project description';
COMMENT ON COLUMN project_submissions.email IS 'Contact email for the project team';
COMMENT ON COLUMN project_submissions.wallet_address IS 'Connected wallet address of submitter';
COMMENT ON COLUMN project_submissions.has_kyc IS 'Whether the project team has completed KYC';
COMMENT ON COLUMN project_submissions.kyc_link IS 'Link to KYC report or certificate';
COMMENT ON COLUMN project_submissions.has_audit IS 'Whether smart contracts have been audited';
COMMENT ON COLUMN project_submissions.audit_link IS 'Link to audit report';
COMMENT ON COLUMN project_submissions.status IS 'Application status (pending, approved, rejected, live, ended)';
COMMENT ON COLUMN project_submissions.submitted_at IS 'Timestamp when project was submitted';

-- Create useful indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_submissions_status ON project_submissions(status);
CREATE INDEX IF NOT EXISTS idx_project_submissions_chain_id ON project_submissions(chain_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_submitted_at ON project_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_submissions_email ON project_submissions(email);
CREATE INDEX IF NOT EXISTS idx_project_submissions_wallet ON project_submissions(wallet_address);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on record changes
DROP TRIGGER IF EXISTS update_project_submissions_updated_at ON project_submissions;
CREATE TRIGGER update_project_submissions_updated_at
    BEFORE UPDATE ON project_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Display final table structure to verify all columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    CASE 
        WHEN column_name IN ('project_name', 'token_symbol', 'email', 'description') THEN 'REQUIRED'
        WHEN column_name IN ('token_address', 'website', 'whitepaper') THEN 'OPTIONAL'
        WHEN column_name IN ('telegram', 'twitter', 'discord', 'github') THEN 'SOCIAL'
        WHEN column_name IN ('has_kyc', 'kyc_link', 'has_audit', 'audit_link') THEN 'COMPLIANCE'
        ELSE 'SYSTEM'
    END as field_category
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
ORDER BY 
    CASE 
        WHEN column_name IN ('project_name', 'token_symbol', 'email', 'description') THEN 1
        WHEN column_name IN ('token_address', 'website', 'whitepaper') THEN 2
        WHEN column_name IN ('telegram', 'twitter', 'discord', 'github') THEN 3
        WHEN column_name IN ('has_kyc', 'kyc_link', 'has_audit', 'audit_link') THEN 4
        ELSE 5
    END,
    ordinal_position; 