import { createClient } from '@supabase/supabase-js';

// These variables must be set in your Vercel project environment
// and locally in a `.env.local` file for the app to connect.
// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  supabaseUrl.includes('supabase.co') && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder');

if (!isSupabaseConfigured) {
  console.warn("⚠️ Supabase credentials missing or placeholders detected. The application will use Developer Bypass mode only.");
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co', 
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key'
);
