const fs = require('fs');
const path = require('path');

console.log('=== IDO POOLS CONNECTION FIX ===\n');
console.log('This will connect your existing ido_pools data to the project system.\n');

try {
  const sqlPath = path.join(__dirname, '../../fix_ido_pools_connection.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  console.log('Please copy and paste the following SQL into your Supabase SQL Editor:\n');
  console.log('='.repeat(80));
  console.log(sqlContent);
  console.log('='.repeat(80));
  console.log('\nThis script will:');
  console.log('1. Connect your existing ido_pools to project_submissions');
  console.log('2. Create project_details_view that the frontend uses');
  console.log('3. Set up proper relationships and indexes');
  console.log('4. Preserve your existing ido_pools data');
  console.log('\nAfter running this, your frontend should display the live/upcoming projects correctly!');
} catch (error) {
  console.error('Error reading SQL file:', error.message);
} 