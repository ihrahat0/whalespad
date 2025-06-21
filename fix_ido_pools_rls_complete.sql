-- Comprehensive fix for IDO pools RLS and missing fields
-- Run this in your Supabase SQL Editor

-- 1. First, let's check if the ido_pools table exists and see its structure
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ido_pools') THEN
        -- Create ido_pools table if it doesn't exist
        CREATE TABLE ido_pools (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            project_id UUID REFERENCES project_submissions(id) ON DELETE CASCADE,
            token_address TEXT,
            total_supply BIGINT,
            hard_cap DECIMAL(20,8),
            soft_cap DECIMAL(20,8),
            min_allocation DECIMAL(20,8),
            max_allocation DECIMAL(20,8),
            presale_rate DECIMAL(20,8),
            listing_rate DECIMAL(20,8),
            start_date TIMESTAMPTZ,
            end_date TIMESTAMPTZ,
            liquidity_percentage DECIMAL(5,2),
            liquidity_unlock_date TIMESTAMPTZ,
            owner_wallet TEXT,
            status TEXT DEFAULT 'upcoming',
            current_raised DECIMAL(20,8) DEFAULT 0,
            investor_count INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        RAISE NOTICE 'Created ido_pools table';
    ELSE
        RAISE NOTICE 'ido_pools table already exists';
    END IF;
END $$;

-- 2. Add new columns if they don't exist
ALTER TABLE ido_pools 
ADD COLUMN IF NOT EXISTS chain_id INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS presale_contract_address TEXT,
ADD COLUMN IF NOT EXISTS native_token_symbol TEXT DEFAULT 'ETH';

-- 3. Add new columns to project_submissions if they don't exist
ALTER TABLE project_submissions 
ADD COLUMN IF NOT EXISTS chain_id INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS presale_contract_address TEXT,
ADD COLUMN IF NOT EXISTS native_token_symbol TEXT DEFAULT 'ETH';

-- 4. Drop ALL existing RLS policies on ido_pools table
DROP POLICY IF EXISTS "Allow authenticated insert/update on ido_pools" ON ido_pools;
DROP POLICY IF EXISTS "Allow authenticated users to manage ido_pools" ON ido_pools;
DROP POLICY IF EXISTS "Allow select on ido_pools" ON ido_pools;
DROP POLICY IF EXISTS "Allow insert on ido_pools" ON ido_pools;
DROP POLICY IF EXISTS "Allow update on ido_pools" ON ido_pools;
DROP POLICY IF EXISTS "Allow delete on ido_pools" ON ido_pools;
DROP POLICY IF EXISTS "ido_pools_select_policy" ON ido_pools;
DROP POLICY IF EXISTS "ido_pools_insert_policy" ON ido_pools;
DROP POLICY IF EXISTS "ido_pools_update_policy" ON ido_pools;
DROP POLICY IF EXISTS "ido_pools_delete_policy" ON ido_pools;

-- 5. Disable RLS temporarily to clean up
ALTER TABLE ido_pools DISABLE ROW LEVEL SECURITY;

-- 6. Enable RLS again
ALTER TABLE ido_pools ENABLE ROW LEVEL SECURITY;

-- 7. Create new comprehensive RLS policies
-- Allow public to SELECT (read) ido_pools
CREATE POLICY "Allow public select on ido_pools" 
ON ido_pools FOR SELECT 
TO public
USING (true);

-- Allow authenticated users to INSERT ido_pools
CREATE POLICY "Allow authenticated insert on ido_pools" 
ON ido_pools FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to UPDATE ido_pools
CREATE POLICY "Allow authenticated update on ido_pools" 
ON ido_pools FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to DELETE ido_pools
CREATE POLICY "Allow authenticated delete on ido_pools" 
ON ido_pools FOR DELETE 
TO authenticated
USING (true);

-- 8. Grant necessary permissions
GRANT ALL ON ido_pools TO authenticated;
GRANT SELECT ON ido_pools TO anon;
GRANT SELECT ON ido_pools TO public;

-- 9. Update the project_details_view to include new fields
DROP VIEW IF EXISTS project_details_view;

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
    ) as partnerships,
    -- Get IDO pool info if exists
    (
        SELECT json_build_object(
            'presale_contract_address', presale_contract_address,
            'chain_id', chain_id,
            'native_token_symbol', native_token_symbol,
            'total_supply', total_supply,
            'hard_cap', hard_cap,
            'soft_cap', soft_cap,
            'min_allocation', min_allocation,
            'max_allocation', max_allocation,
            'presale_rate', presale_rate,
            'listing_rate', listing_rate,
            'start_date', start_date,
            'end_date', end_date,
            'status', status
        )
        FROM ido_pools 
        WHERE project_id = ps.id
        LIMIT 1
    ) as ido_pool_info
FROM project_submissions ps
WHERE ps.status IN ('approved', 'live');

-- Grant permissions on the view
GRANT SELECT ON project_details_view TO public;
GRANT SELECT ON project_details_view TO anon;
GRANT SELECT ON project_details_view TO authenticated;

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ido_pools_project_id ON ido_pools(project_id);
CREATE INDEX IF NOT EXISTS idx_ido_pools_chain_id ON ido_pools(chain_id);
CREATE INDEX IF NOT EXISTS idx_ido_pools_status ON ido_pools(status);
CREATE INDEX IF NOT EXISTS idx_project_submissions_chain_id ON project_submissions(chain_id);

-- 11. Update existing sample data
UPDATE project_submissions 
SET chain_id = 1, native_token_symbol = 'ETH'
WHERE slug = 'quantumchain-protocol' AND chain_id IS NULL;

-- 12. Create a function to get chain info
CREATE OR REPLACE FUNCTION get_chain_info(chain_id_param INTEGER)
RETURNS JSON AS $$
BEGIN
    RETURN CASE chain_id_param
        WHEN 1 THEN '{"name": "Ethereum", "symbol": "ETH", "rpc": "https://mainnet.infura.io/v3/"}'::JSON
        WHEN 56 THEN '{"name": "BNB Smart Chain", "symbol": "BNB", "rpc": "https://bsc-dataseed.binance.org/"}'::JSON
        WHEN 137 THEN '{"name": "Polygon", "symbol": "MATIC", "rpc": "https://polygon-rpc.com/"}'::JSON
        WHEN 42161 THEN '{"name": "Arbitrum", "symbol": "ETH", "rpc": "https://arb1.arbitrum.io/rpc"}'::JSON
        WHEN 10 THEN '{"name": "Optimism", "symbol": "ETH", "rpc": "https://mainnet.optimism.io/"}'::JSON
        ELSE '{"name": "Unknown", "symbol": "ETH", "rpc": ""}'::JSON
    END;
END;
$$ LANGUAGE plpgsql;

-- 13. Test the setup by attempting to create a test IDO (will be rolled back)
DO $$
DECLARE
    test_project_id UUID;
    test_ido_id UUID;
BEGIN
    -- Get a test project ID
    SELECT id INTO test_project_id FROM project_submissions LIMIT 1;
    
    IF test_project_id IS NOT NULL THEN
        -- Try to insert a test IDO
        INSERT INTO ido_pools (
            project_id,
            token_address,
            total_supply,
            hard_cap,
            soft_cap,
            presale_rate,
            start_date,
            end_date,
            owner_wallet,
            chain_id,
            presale_contract_address,
            native_token_symbol,
            status
        ) VALUES (
            test_project_id,
            '0x1234567890123456789012345678901234567890',
            1000000,
            100.0,
            50.0,
            1000.0,
            NOW(),
            NOW() + INTERVAL '30 days',
            '0x1234567890123456789012345678901234567890',
            1,
            '0x9876543210987654321098765432109876543210',
            'ETH',
            'upcoming'
        ) RETURNING id INTO test_ido_id;
        
        -- Clean up test data
        DELETE FROM ido_pools WHERE id = test_ido_id;
        
        RAISE NOTICE 'SUCCESS: IDO pools table is working correctly!';
    ELSE
        RAISE NOTICE 'No test project found, but table setup should be complete';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR during test: %', SQLERRM;
    RAISE NOTICE 'You may need to check your authentication or policies';
END $$;

-- Final verification
SELECT 
    'IDO Pools Setup Complete!' as status,
    COUNT(*) as existing_ido_count 
FROM ido_pools;

SELECT 
    'Project Submissions with Chain Info' as status,
    COUNT(*) as projects_with_chain_info 
FROM project_submissions 
WHERE chain_id IS NOT NULL;

-- Display current RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'ido_pools'
ORDER BY policyname; 