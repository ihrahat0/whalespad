-- Partners Table Setup Script for WhalesPad
-- Run this in your Supabase SQL editor

-- Drop existing table and policies if needed (uncomment if starting fresh)
-- DROP TABLE IF EXISTS partners CASCADE;

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    logo_url TEXT NOT NULL,
    website_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active);
CREATE INDEX IF NOT EXISTS idx_partners_display_order ON partners(display_order);
CREATE INDEX IF NOT EXISTS idx_partners_created_at ON partners(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to active partners" ON partners;
DROP POLICY IF EXISTS "Allow admin full access to partners" ON partners;

-- Create RLS policies
-- Public read access for active partners
CREATE POLICY "Allow public read access to active partners" ON partners
    FOR SELECT USING (is_active = true);

-- Admin full access (insert, update, delete)
CREATE POLICY "Allow admin full access to partners" ON partners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

-- Insert default partner (SolidProof)
INSERT INTO partners (name, logo_url, website_url, is_active, display_order) 
VALUES 
    ('SolidProof', 'https://solidproof.io/storage/logos/logo.png', 'https://solidproof.io', true, 1)
ON CONFLICT (name) DO UPDATE SET
    logo_url = EXCLUDED.logo_url,
    website_url = EXCLUDED.website_url,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order,
    updated_at = TIMEZONE('utc'::text, NOW());

-- Grant necessary permissions
GRANT SELECT ON partners TO anon;
GRANT ALL ON partners TO authenticated;
GRANT ALL ON partners TO service_role; 