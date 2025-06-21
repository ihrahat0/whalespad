import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ijjcnwaaaikpkifxgbyq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqamNud2FhYWlrcGtpZnhnYnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDMzNzEsImV4cCI6MjA2NTY3OTM3MX0.DsUbnkjA9kyVAK58YC6lPu-Q27QZzPma7F2V_hmS084"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anonymous key. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 