-- Complete Database Fix - Create all missing tables and fix issues
-- Run this file to resolve all database errors

-- 1. Create ido_pools table
CREATE TABLE IF NOT EXISTS ido_pools (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES project_submissions(id),
    token_address text NOT NULL,
    total_supply bigint NOT NULL,
    hard_cap numeric NOT NULL,
    soft_cap numeric,
    min_allocation numeric,
    max_allocation numeric,
    presale_rate numeric NOT NULL,
    listing_rate numeric,
    start_date timestamptz NOT NULL,
    end_date timestamptz NOT NULL,
    liquidity_percentage numeric,
    liquidity_unlock_date timestamptz,
    owner_wallet text NOT NULL,
    status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

-- 2. Add missing columns to project_submissions
ALTER TABLE project_submissions 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS medium TEXT,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'DeFi',
ADD COLUMN IF NOT EXISTS full_description TEXT,
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS total_supply BIGINT,
ADD COLUMN IF NOT EXISTS initial_market_cap TEXT,
ADD COLUMN IF NOT EXISTS liquidity_percent TEXT DEFAULT '75%',
ADD COLUMN IF NOT EXISTS liquidity_lock_time TEXT DEFAULT '365 days',
ADD COLUMN IF NOT EXISTS presale_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS presale_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS listing_price DECIMAL(18,8),
ADD COLUMN IF NOT EXISTS min_contribution DECIMAL(18,8) DEFAULT 0.1,
ADD COLUMN IF NOT EXISTS max_contribution DECIMAL(18,8) DEFAULT 10.0,
ADD COLUMN IF NOT EXISTS soft_cap DECIMAL(18,8),
ADD COLUMN IF NOT EXISTS hard_cap DECIMAL(18,8),
ADD COLUMN IF NOT EXISTS current_raised DECIMAL(18,8) DEFAULT 0,
ADD COLUMN IF NOT EXISTS investor_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS presale_price DECIMAL(18,8),
ADD COLUMN IF NOT EXISTS expected_roi TEXT,
ADD COLUMN IF NOT EXISTS vesting_schedule TEXT,
ADD COLUMN IF NOT EXISTS team_tokens_lock TEXT DEFAULT '12 months',
ADD COLUMN IF NOT EXISTS contract_address TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT;

-- 3. Create related tables
CREATE TABLE IF NOT EXISTS project_team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES project_submissions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    experience TEXT,
    linkedin_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_tokenomics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES project_submissions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    percentage INTEGER NOT NULL,
    amount BIGINT NOT NULL,
    color TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_roadmap (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES project_submissions(id) ON DELETE CASCADE,
    quarter TEXT NOT NULL,
    phase TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'upcoming')),
    description TEXT NOT NULL,
    tasks TEXT[],
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_partnerships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES project_submissions(id) ON DELETE CASCADE,
    partner_name TEXT NOT NULL,
    partner_logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_ido_pools_project_id ON ido_pools(project_id);
CREATE INDEX IF NOT EXISTS idx_ido_pools_status ON ido_pools(status);
CREATE INDEX IF NOT EXISTS idx_project_team_project_id ON project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tokenomics_project_id ON project_tokenomics(project_id);
CREATE INDEX IF NOT EXISTS idx_project_roadmap_project_id ON project_roadmap(project_id);
CREATE INDEX IF NOT EXISTS idx_project_partnerships_project_id ON project_partnerships(project_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_slug ON project_submissions(slug);

-- 5. Enable RLS
ALTER TABLE ido_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tokenomics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_partnerships ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies
-- IDO Pools policies
DROP POLICY IF EXISTS "Allow public read access on ido_pools" ON ido_pools;
DROP POLICY IF EXISTS "Allow authenticated insert/update on ido_pools" ON ido_pools;

CREATE POLICY "Allow public read access on ido_pools" 
ON ido_pools FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated insert/update on ido_pools" 
ON ido_pools FOR ALL TO authenticated USING (true);

-- Team members policies
DROP POLICY IF EXISTS "Allow public read access on project_team_members" ON project_team_members;
CREATE POLICY "Allow public read access on project_team_members" 
ON project_team_members FOR SELECT TO public USING (true);

-- Tokenomics policies
DROP POLICY IF EXISTS "Allow public read access on project_tokenomics" ON project_tokenomics;
CREATE POLICY "Allow public read access on project_tokenomics" 
ON project_tokenomics FOR SELECT TO public USING (true);

-- Roadmap policies
DROP POLICY IF EXISTS "Allow public read access on project_roadmap" ON project_roadmap;
CREATE POLICY "Allow public read access on project_roadmap" 
ON project_roadmap FOR SELECT TO public USING (true);

-- Partnerships policies
DROP POLICY IF EXISTS "Allow public read access on project_partnerships" ON project_partnerships;
CREATE POLICY "Allow public read access on project_partnerships" 
ON project_partnerships FOR SELECT TO public USING (true);

-- 7. Insert sample project with corrected slug
DO $$
DECLARE
    sample_project_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
BEGIN

-- Delete existing data first to avoid conflicts
DELETE FROM project_partnerships WHERE project_id = sample_project_id;
DELETE FROM project_roadmap WHERE project_id = sample_project_id;
DELETE FROM project_tokenomics WHERE project_id = sample_project_id;
DELETE FROM project_team_members WHERE project_id = sample_project_id;
DELETE FROM project_submissions WHERE id = sample_project_id;

INSERT INTO project_submissions (
    id,
    project_name,
    token_symbol,
    category,
    description,
    full_description,
    features,
    rating,
    logo_url,
    banner_url,
    website,
    telegram,
    twitter,
    discord,
    medium,
    whitepaper,
    audit_link,
    has_audit,
    total_supply,
    presale_price,
    listing_price,
    min_contribution,
    max_contribution,
    soft_cap,
    hard_cap,
    current_raised,
    investor_count,
    presale_start,
    presale_end,
    liquidity_percent,
    liquidity_lock_time,
    expected_roi,
    status,
    slug
) VALUES (
    sample_project_id,
    'QuantumChain Protocol',
    'QCP',
    'DeFi Infrastructure',
    'Revolutionary DeFi infrastructure enabling cross-chain quantum-resistant transactions.',
    'QuantumChain Protocol represents the next evolution in decentralized finance, combining quantum-resistant cryptography with cross-chain interoperability. Our platform enables secure, fast, and scalable transactions across multiple blockchain networks while providing advanced privacy features.',
    ARRAY['Quantum-resistant cryptography', 'Cross-chain interoperability', 'Advanced privacy features', 'Institutional-grade security', 'Scalable architecture', 'Low transaction fees'],
    9.5,
    'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=400&fit=crop&crop=center',
    'https://quantumchain.io',
    'https://t.me/quantumchain',
    'https://twitter.com/quantumchain',
    'https://discord.gg/quantumchain',
    'https://medium.com/@quantumchain',
    'https://quantumchain.io/whitepaper.pdf',
    'https://audit.quantumchain.io',
    true,
    1000000000,
    0.0045,
    0.0055,
    0.1,
    10.0,
    500,
    1000,
    435,
    3247,
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '10 days',
    '75%',
    '365 days',
    '+340%',
    'approved',
    'quantumchain-protocol' -- Fixed slug without extra hyphen
);

-- Insert sample team members
INSERT INTO project_team_members (project_id, name, position, experience, linkedin_url, image_url) VALUES
(sample_project_id, 'Dr. Sarah Chen', 'CEO & Founder', '15+ years in cryptography and blockchain technology. Former lead researcher at MIT.', 'https://linkedin.com/in/sarahchen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
(sample_project_id, 'Michael Rodriguez', 'CTO', '12+ years in distributed systems. Ex-Google senior engineer.', 'https://linkedin.com/in/mrodriguez', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
(sample_project_id, 'Emily Watson', 'Head of DeFi', '10+ years in financial technology. Former Goldman Sachs VP.', 'https://linkedin.com/in/emilywatson', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face');

-- Insert sample tokenomics
INSERT INTO project_tokenomics (project_id, name, percentage, amount, color, description) VALUES
(sample_project_id, 'Presale', 15, 150000000, '#00d4ff', 'Public presale allocation'),
(sample_project_id, 'Liquidity', 25, 250000000, '#00ff88', 'DEX liquidity pool'),
(sample_project_id, 'Team', 20, 200000000, '#8b5cf6', 'Team allocation (locked)'),
(sample_project_id, 'Marketing', 10, 100000000, '#ffd700', 'Marketing & partnerships'),
(sample_project_id, 'Development', 15, 150000000, '#ff6b35', 'Ongoing development'),
(sample_project_id, 'Treasury', 15, 150000000, '#4f8fff', 'Treasury reserve');

-- Insert sample roadmap
INSERT INTO project_roadmap (project_id, quarter, phase, status, description, tasks, order_index) VALUES
(sample_project_id, 'Q4 2024', 'Launch Phase', 'in-progress', 'Presale launch and community building', ARRAY['Complete presale', 'DEX listing', 'Community growth', 'Initial partnerships'], 1),
(sample_project_id, 'Q1 2025', 'Development Phase', 'upcoming', 'Core protocol development and testing', ARRAY['Smart contract audit', 'Beta testing', 'Cross-chain integration', 'Mobile app launch'], 2),
(sample_project_id, 'Q2 2025', 'Expansion Phase', 'upcoming', 'Platform expansion and new features', ARRAY['Multi-chain support', 'Advanced trading features', 'Institutional partnerships', 'Governance launch'], 3),
(sample_project_id, 'Q3 2025', 'Ecosystem Phase', 'upcoming', 'Ecosystem growth and global adoption', ARRAY['DeFi integrations', 'Enterprise solutions', 'Global partnerships', 'Layer 2 scaling'], 4);

-- Insert sample partnerships
INSERT INTO project_partnerships (project_id, partner_name, partner_logo_url, description) VALUES
(sample_project_id, 'Chainlink', null, 'Oracle integration for price feeds'),
(sample_project_id, 'Polygon', null, 'Layer 2 scaling solution'),
(sample_project_id, 'Uniswap', null, 'Liquidity provision partnership'),
(sample_project_id, 'CoinGecko', null, 'Market data and analytics');

END $$;

-- 8. Create project_details_view
CREATE OR REPLACE VIEW project_details_view AS
SELECT 
    ps.*,
    -- Calculate progress percentage
    CASE 
        WHEN ps.hard_cap > 0 THEN ROUND((ps.current_raised / ps.hard_cap) * 100, 0)
        ELSE 0 
    END as progress_percentage,
    -- Calculate time left
    CASE 
        WHEN ps.presale_end > NOW() THEN 
            EXTRACT(DAYS FROM ps.presale_end - NOW()) || 'd ' || 
            EXTRACT(HOURS FROM ps.presale_end - NOW()) % 24 || 'h'
        ELSE 'Ended'
    END as time_left,
    -- Get team members
    (
        SELECT json_agg(
            json_build_object(
                'name', name,
                'position', position,
                'experience', experience,
                'linkedin', linkedin_url,
                'image', image_url
            )
        )
        FROM project_team_members 
        WHERE project_id = ps.id
    ) as team,
    -- Get tokenomics
    (
        SELECT json_agg(
            json_build_object(
                'name', name,
                'percentage', percentage,
                'amount', amount,
                'color', color,
                'description', description
            )
        )
        FROM project_tokenomics 
        WHERE project_id = ps.id
    ) as tokenomics,
    -- Get roadmap
    (
        SELECT json_agg(
            json_build_object(
                'quarter', quarter,
                'phase', phase,
                'status', status,
                'description', description,
                'tasks', tasks
            ) ORDER BY order_index
        )
        FROM project_roadmap 
        WHERE project_id = ps.id
    ) as roadmap,
    -- Get partnerships
    (
        SELECT json_agg(
            json_build_object(
                'name', partner_name,
                'logo', partner_logo_url,
                'description', description
            )
        )
        FROM project_partnerships 
        WHERE project_id = ps.id
    ) as partnerships
FROM project_submissions ps
WHERE ps.status IN ('approved', 'live');

-- Grant permissions
GRANT SELECT ON project_details_view TO public;

-- Create a sample IDO pool for the QuantumChain project
INSERT INTO ido_pools (
    project_id,
    token_address,
    total_supply,
    hard_cap,
    soft_cap,
    min_allocation,
    max_allocation,
    presale_rate,
    listing_rate,
    start_date,
    end_date,
    liquidity_percentage,
    liquidity_unlock_date,
    owner_wallet,
    status
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '0x742d35cc6b8B9a1e3598C8b55b6c3E7d57b7E32B',
    1000000000,
    1000,
    500,
    0.1,
    10.0,
    222.22,
    181.82,
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '10 days',
    75,
    NOW() + INTERVAL '375 days',
    '0x742d35cc6b8B9a1e3598C8b55b6c3E7d57b7E32B',
    'upcoming'
) ON CONFLICT DO NOTHING;

-- Verification
SELECT 'Database setup completed successfully!' as message;
SELECT COUNT(*) as ido_pools_count FROM ido_pools;
SELECT COUNT(*) as projects_count FROM project_submissions WHERE slug = 'quantumchain-protocol';