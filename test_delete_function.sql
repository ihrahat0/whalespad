-- Test script to verify delete functionality
-- DO NOT RUN THIS ON PRODUCTION DATA!
-- This is just for testing purposes

-- Show current IDO pools
SELECT 'Current IDO Pools:' as info;
SELECT id, project_id, token_address, status FROM ido_pools ORDER BY created_at DESC;

-- EXAMPLE: How to test delete (COMMENTED OUT - DO NOT RUN)
-- DELETE FROM ido_pools WHERE id = 'some-test-id';

-- Check if user has proper permissions (this should work)
SELECT 'Testing permissions:' as info;
SELECT has_table_privilege('ido_pools', 'DELETE') as can_delete;

-- Verify RLS policies allow delete for authenticated users
SELECT 'Delete policies:' as info;
SELECT policyname, cmd, roles, qual 
FROM pg_policies 
WHERE tablename = 'ido_pools' 
AND cmd = 'DELETE' 
OR cmd = 'ALL'; 