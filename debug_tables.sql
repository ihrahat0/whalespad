-- DEBUG: Check table structures and relationships

-- Check if ido_pools table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'ido_pools'
) AS ido_pools_exists;

-- Check if project_submissions table exists  
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'project_submissions'
) AS project_submissions_exists;

-- Check ido_pools table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'ido_pools' 
ORDER BY ordinal_position;

-- Check project_submissions table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
ORDER BY ordinal_position;

-- Check foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND (tc.table_name = 'ido_pools' OR tc.table_name = 'project_submissions');

-- Count records in each table
SELECT 'ido_pools' as table_name, COUNT(*) as record_count FROM ido_pools
UNION ALL
SELECT 'project_submissions' as table_name, COUNT(*) as record_count FROM project_submissions; 