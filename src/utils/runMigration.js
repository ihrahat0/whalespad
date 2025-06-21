// Run this script to add the banner_image_url column to your blogs table
// You can execute this SQL in your Supabase SQL editor:

const migration = `
-- Add banner_image_url column to blogs table if it doesn't exist
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS banner_image_url TEXT;
`;

console.log("Please run the following SQL in your Supabase SQL editor:");
console.log("=======================================================");
console.log(migration);
console.log("=======================================================");
console.log("\nSteps:");
console.log("1. Go to your Supabase dashboard");
console.log("2. Navigate to the SQL editor");
console.log("3. Copy and paste the SQL above");
console.log("4. Click 'Run' to execute the migration");
console.log("\nThis will add the banner_image_url column to store blog cover images."); 