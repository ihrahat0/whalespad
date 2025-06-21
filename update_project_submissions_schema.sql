-- SQL Script to Update project_submissions Table Schema
-- Run this in your Supabase SQL Editor

-- Add missing columns to project_submissions table
ALTER TABLE project_submissions 
ADD COLUMN IF NOT EXISTS chain_id INTEGER,
ADD COLUMN IF NOT EXISTS discord TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS has_kyc BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS kyc_link TEXT,
ADD COLUMN IF NOT EXISTS has_audit BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS audit_link TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have default values for new columns
UPDATE project_submissions 
SET 
    chain_id = 1, -- Default to Ethereum
    has_kyc = FALSE,
    has_audit = FALSE,
    submitted_at = NOW()
WHERE chain_id IS NULL;

-- Add comments to describe the columns
COMMENT ON COLUMN project_submissions.chain_id IS 'Blockchain network ID (1=Ethereum, 56=BSC, 137=Polygon, 42161=Arbitrum)';
COMMENT ON COLUMN project_submissions.discord IS 'Discord server link or username';
COMMENT ON COLUMN project_submissions.github IS 'GitHub repository or organization link';
COMMENT ON COLUMN project_submissions.has_kyc IS 'Whether the project team has completed KYC';
COMMENT ON COLUMN project_submissions.kyc_link IS 'Link to KYC report or certificate';
COMMENT ON COLUMN project_submissions.has_audit IS 'Whether smart contracts have been audited';
COMMENT ON COLUMN project_submissions.audit_link IS 'Link to audit report';
COMMENT ON COLUMN project_submissions.submitted_at IS 'Timestamp when project was submitted';

-- Create an index on chain_id for better query performance
CREATE INDEX IF NOT EXISTS idx_project_submissions_chain_id ON project_submissions(chain_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_status ON project_submissions(status);
CREATE INDEX IF NOT EXISTS idx_project_submissions_submitted_at ON project_submissions(submitted_at);

-- Display current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'project_submissions'
ORDER BY ordinal_position; 