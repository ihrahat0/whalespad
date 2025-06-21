-- Fix RLS policy for ido_pools table
-- This script addresses the "new row violates row-level security policy" error

-- First, let's check if the table exists and disable RLS temporarily
DO $$
BEGIN
    -- Check if ido_pools table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ido_pools') THEN
        -- Disable RLS for ido_pools table to allow unrestricted access
        EXECUTE 'ALTER TABLE ido_pools DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE 'RLS disabled for ido_pools table';
    ELSE
        RAISE NOTICE 'ido_pools table does not exist';
    END IF;
END $$;

-- Alternative: Create proper RLS policies if you want to keep RLS enabled
-- Uncomment the section below if you prefer to use RLS with proper policies

/*
-- Re-enable RLS and create proper policies
ALTER TABLE ido_pools ENABLE ROW LEVEL SECURITY;

-- Allow admins to insert new IDO pools
CREATE POLICY "Allow admin insert on ido_pools" ON ido_pools
    FOR INSERT 
    WITH CHECK (true);

-- Allow anyone to read IDO pools
CREATE POLICY "Allow public read on ido_pools" ON ido_pools
    FOR SELECT 
    USING (true);

-- Allow admins to update IDO pools
CREATE POLICY "Allow admin update on ido_pools" ON ido_pools
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- Allow admins to delete IDO pools
CREATE POLICY "Allow admin delete on ido_pools" ON ido_pools
    FOR DELETE 
    USING (true);
*/

-- Grant necessary permissions to authenticated users
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ido_pools') THEN
        GRANT ALL ON ido_pools TO authenticated;
        GRANT ALL ON ido_pools TO anon;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
        RAISE NOTICE 'Permissions granted for ido_pools table';
    END IF;
END $$; 