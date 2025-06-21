-- Test Insert for project_submissions Table
-- Run this to test if the table accepts data properly

-- Test insert with minimal required data
INSERT INTO project_submissions (
    project_name,
    token_symbol,
    email,
    description,
    wallet_address,
    status
) VALUES (
    'Test Project',
    'TEST',
    'test@example.com',
    'This is a test project submission',
    '0x1234567890123456789012345678901234567890',
    'pending'
);

-- Check if the insert worked
SELECT * FROM project_submissions WHERE project_name = 'Test Project';

-- Clean up the test record
DELETE FROM project_submissions WHERE project_name = 'Test Project'; 