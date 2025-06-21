-- Check the project_details_view structure and data
-- This is likely what the frontend is actually using

-- 1. Check if project_details_view exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'project_details_view' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check the view definition
SELECT 
    table_name,
    view_definition
FROM information_schema.views 
WHERE table_name = 'project_details_view' 
AND table_schema = 'public';

-- 3. Show actual data in project_details_view
SELECT * FROM project_details_view 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Count records in each table to see which has data
SELECT 'ido_pools' as table_name, COUNT(*) as record_count FROM ido_pools
UNION ALL
SELECT 'project_submissions' as table_name, COUNT(*) as record_count FROM project_submissions
UNION ALL
SELECT 'project_details_view' as table_name, COUNT(*) as record_count FROM project_details_view
UNION ALL
SELECT 'project_partnerships' as table_name, COUNT(*) as record_count FROM project_partnerships
UNION ALL
SELECT 'project_roadmap' as table_name, COUNT(*) as record_count FROM project_roadmap;

-- 5. Check if there are any other project-related tables with data
SELECT 
    schemaname,
    tablename,
    n_tup_ins as insert_count
FROM pg_stat_user_tables 
WHERE tablename LIKE '%project%' 
OR tablename LIKE '%ido%'
ORDER BY n_tup_ins DESC; 