# 🔧 WhalesPad Database Setup

## Problem
If you're seeing errors like "Could not find a relationship between 'ido_pools' and 'project_submissions'" in the admin dashboard, this means the database schema needs to be updated.

## Quick Fix

### Step 1: Generate the SQL
Run this command in your terminal:
```bash
node src/utils/fixIdoDatabase.js
```

### Step 2: Execute the SQL
1. Copy the SQL output from the terminal
2. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
3. Navigate to **SQL Editor**
4. Paste the SQL and click **Run**

## What This Fixes

✅ **Creates proper relationship** between `ido_pools` and `project_submissions` tables  
✅ **Adds missing columns** like `logo_url` and `banner_url`  
✅ **Creates sample data** for testing (3 demo projects with IDO pools)  
✅ **Sets up permissions** for admin operations  
✅ **Enables logo/banner display** on the frontend  

## After Running the Fix

- ✨ Admin dashboard will show existing IDO pools
- 🖼️ Project logos and banners will display properly  
- 🗑️ Delete functionality will work correctly
-  Sample projects will appear on the landing page

## Troubleshooting

- **Safe to run multiple times**: The script is idempotent
- **No data loss**: Existing data won't be affected
- **Sample data**: Only adds data if none exists

## Manual Setup (Alternative)

If you prefer to set up the database manually, you can also copy the contents of `fix_ido_admin_complete.sql` directly into your Supabase SQL editor.

---

After setup, refresh your admin dashboard and you should see the IDO pools! 🚀 