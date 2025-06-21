-- Quick Check for project_submissions Table Structure
-- Run this to verify all columns exist

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'project_submissions' 
ORDER BY ordinal_position; 