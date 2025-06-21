-- EMERGENCY FIX for project_submissions table
-- This will fix all issues once and for all

-- Check what columns actually exist
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
ORDER BY ordinal_position;

-- Drop the table and recreate it with proper structure
DROP TABLE IF EXISTS project_submissions CASCADE;

-- Create the table with correct structure and NO NOT NULL constraints except for ID
CREATE TABLE project_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_name TEXT,
    token_symbol TEXT,
    token_address TEXT,
    chain_id INTEGER DEFAULT 1,
    website TEXT,
    whitepaper TEXT,
    telegram TEXT,
    twitter TEXT,
    discord TEXT,
    github TEXT,
    description TEXT,
    email TEXT,
    wallet_address TEXT,
    has_kyc BOOLEAN DEFAULT FALSE,
    kyc_link TEXT,
    has_audit BOOLEAN DEFAULT FALSE,
    audit_link TEXT,
    status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_project_submissions_status ON project_submissions(status);
CREATE INDEX idx_project_submissions_submitted_at ON project_submissions(submitted_at DESC);

-- Enable Row Level Security (optional, for Supabase)
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations on project_submissions" ON project_submissions
FOR ALL USING (true) WITH CHECK (true);

-- Verify the table structure
SELECT column_name, is_nullable, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
ORDER BY ordinal_position; 