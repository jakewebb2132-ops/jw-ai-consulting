import { createClient } from '@supabase/supabase-js';

// These variables must be set in your Vercel project environment
// and locally in a `.env.local` file for the app to connect.
// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase credentials missing. The application will not be able to save data persistently until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided in the environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
