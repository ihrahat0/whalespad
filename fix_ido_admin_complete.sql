-- Complete fix for IDO pools and project submissions relationship
-- This script will:
-- 1. Ensure proper foreign key relationship
-- 2. Add missing columns
-- 3. Create sample data for testing
-- 4. Set up proper constraints

-- Step 1: Ensure both tables exist and have proper structure
CREATE TABLE IF NOT EXISTS project_submissions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_name text NOT NULL,
    token_symbol text NOT NULL,
    description text,
    full_description text,
    features text[],
    rating numeric DEFAULT 9.5,
    logo_url text,
    banner_url text,
    website text,
    telegram text,
    twitter text,
    discord text,
    medium text,
    whitepaper text,
    audit_link text,
    has_audit boolean DEFAULT false,
    total_supply bigint,
    presale_price numeric,
    listing_price numeric,
    min_contribution numeric,
    max_contribution numeric,
    soft_cap numeric,
    hard_cap numeric,
    current_raised numeric DEFAULT 0,
    investor_count integer DEFAULT 0,
    presale_start timestamp with time zone,
    presale_end timestamp with time zone,
    liquidity_percent text,
    liquidity_lock_time text,
    expected_roi text,
    contract_address text,
    slug text UNIQUE,
    status text DEFAULT 'pending',
    chain_id integer DEFAULT 1,
    presale_contract_address text,
    native_token_symbol text DEFAULT 'ETH',
    category text DEFAULT 'DeFi',
    submitted_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Step 2: Create IDO pools table with proper structure
CREATE TABLE IF NOT EXISTS ido_pools (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES project_submissions(id) ON DELETE CASCADE,
    token_address text NOT NULL,
    total_supply bigint NOT NULL,
    hard_cap numeric NOT NULL,
    soft_cap numeric,
    min_allocation numeric,
    max_allocation numeric,
    presale_rate numeric NOT NULL,
    listing_rate numeric,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    liquidity_percentage numeric,
    liquidity_unlock_date timestamp with time zone,
    owner_wallet text NOT NULL,
    chain_id integer DEFAULT 1,
    presale_contract_address text NOT NULL,
    native_token_symbol text DEFAULT 'ETH',
    status text DEFAULT 'upcoming',
    created_at timestamp with time zone DEFAULT now()
);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ido_pools_project_id ON ido_pools(project_id);
CREATE INDEX IF NOT EXISTS idx_ido_pools_status ON ido_pools(status);
CREATE INDEX IF NOT EXISTS idx_project_submissions_status ON project_submissions(status);
CREATE INDEX IF NOT EXISTS idx_project_submissions_slug ON project_submissions(slug);

-- Step 4: Create sample project submissions if none exist
INSERT INTO project_submissions (
    project_name,
    token_symbol,
    description,
    full_description,
    features,
    rating,
    logo_url,
    banner_url,
    website,
    telegram,
    twitter,
    category,
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
    contract_address,
    slug,
    status,
    chain_id,
    presale_contract_address,
    native_token_symbol
) VALUES 
(
    'QuantumChain Protocol',
    'QCP',
    'Revolutionary DeFi infrastructure for the next generation of Web3 applications',
    'QuantumChain Protocol is building the most advanced DeFi infrastructure with quantum-resistant security, lightning-fast transactions, and unparalleled scalability. Our innovative approach combines cutting-edge cryptography with user-friendly interfaces.',
    ARRAY['Quantum-Resistant Security', 'Ultra-Fast Transactions', 'Cross-Chain Compatibility', 'Advanced DeFi Tools'],
    9.5,
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&crop=center',
    'https://quantumchain.io',
    'https://t.me/quantumchain',
    'https://twitter.com/quantumchain',
    'DeFi',
    1000000000,
    0.001,
    0.0012,
    0.1,
    10,
    50,
    100,
    87.5,
    3247,
    now() - interval '5 days',
    now() + interval '25 days',
    '70%',
    '12 months',
    '+340%',
    '0x1234567890123456789012345678901234567890',
    'quantumchain-protocol',
    'approved',
    1,
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    'ETH'
),
(
    'MetaVerse Gaming Hub',
    'MVG',
    'The ultimate gaming ecosystem bridging Web2 and Web3 gaming experiences',
    'MetaVerse Gaming Hub creates an immersive gaming ecosystem where players can seamlessly transition between traditional and blockchain gaming. Features include cross-game asset portability, play-to-earn mechanics, and social gaming experiences.',
    ARRAY['Cross-Game Assets', 'Play-to-Earn', 'Social Gaming', 'VR Integration'],
    9.2,
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop&crop=center',
    'https://metaversegaming.io',
    'https://t.me/metaversegaming',
    'https://twitter.com/metaversegaming',
    'GameFi',
    500000000,
    0.002,
    0.0025,
    0.2,
    15,
    75,
    120,
    113.4,
    5892,
    now() - interval '10 days',
    now() + interval '18 hours',
    '65%',
    '6 months',
    '+280%',
    '0x2345678901234567890123456789012345678901',
    'metaverse-gaming-hub',
    'approved',
    137,
    '0xbcdefabcdefabcdefabcdefabcdefabcdefabcde',
    'MATIC'
),
(
    'Neural Network AI',
    'NNA',
    'Advanced AI-powered trading algorithms for cryptocurrency markets',
    'Neural Network AI leverages machine learning and artificial intelligence to provide sophisticated trading algorithms, market analysis tools, and automated trading strategies for both retail and institutional investors.',
    ARRAY['AI Trading Bots', 'Market Analysis', 'Risk Management', 'Portfolio Optimization'],
    9.7,
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center',
    'https://neuralnetworkai.io',
    'https://t.me/neuralnetworkai',
    'https://twitter.com/neuralnetworkai',
    'AI',
    750000000,
    0.0015,
    0.002,
    0.5,
    25,
    40,
    80,
    72,
    2156,
    now() + interval '1 day',
    now() + interval '8 days',
    '80%',
    '18 months',
    '+420%',
    '0x3456789012345678901234567890123456789012',
    'neural-network-ai',
    'approved',
    42161,
    '0xcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    'ETH'
) ON CONFLICT (slug) DO NOTHING;

-- Step 5: Create IDO pools for the sample projects
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
    chain_id,
    presale_contract_address,
    native_token_symbol,
    status
)
SELECT 
    ps.id,
    ps.contract_address,
    ps.total_supply,
    ps.hard_cap,
    ps.soft_cap,
    ps.min_contribution,
    ps.max_contribution,
    (1 / ps.presale_price)::numeric,
    CASE WHEN ps.listing_price > 0 THEN (1 / ps.listing_price)::numeric ELSE NULL END,
    ps.presale_start,
    ps.presale_end,
    CASE 
        WHEN ps.liquidity_percent LIKE '%70%' THEN 70
        WHEN ps.liquidity_percent LIKE '%65%' THEN 65
        WHEN ps.liquidity_percent LIKE '%80%' THEN 80
        ELSE 70
    END,
    ps.presale_end + interval '1 month',
    '0x' || substring(md5(ps.project_name) from 1 for 40),
    ps.chain_id,
    ps.presale_contract_address,
    ps.native_token_symbol,
    CASE 
        WHEN ps.presale_start <= now() AND ps.presale_end > now() THEN 'active'
        WHEN ps.presale_end <= now() THEN 'completed'
        ELSE 'upcoming'
    END
FROM project_submissions ps
WHERE ps.status = 'approved'
AND NOT EXISTS (
    SELECT 1 FROM ido_pools ip WHERE ip.project_id = ps.id
);

-- Step 6: Enable Row Level Security (RLS) 
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ido_pools ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies for read access
CREATE POLICY "Allow public read access on project_submissions" ON project_submissions
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on ido_pools" ON ido_pools
    FOR SELECT USING (true);

-- Step 8: Create admin policies (assuming you have admin role)
-- These allow full access for admin operations
CREATE POLICY "Allow admin full access on project_submissions" ON project_submissions
    FOR ALL USING (true);

CREATE POLICY "Allow admin full access on ido_pools" ON ido_pools
    FOR ALL USING (true);

-- Step 9: Verify the setup
-- This query should return data if everything is working
SELECT 
    ip.id as ido_id,
    ip.status as ido_status,
    ip.hard_cap,
    ip.presale_rate,
    ps.project_name,
    ps.token_symbol,
    ps.logo_url,
    ps.banner_url,
    ps.slug,
    ps.category
FROM ido_pools ip
JOIN project_submissions ps ON ip.project_id = ps.id
ORDER BY ip.created_at DESC; 