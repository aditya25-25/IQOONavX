import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables exposed via Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Browser-safe Supabase client initialized with public publishable/anon key.
 * Used strictly for Client-Side Auth, session storage and identity token retrieval.
 * NEVER exposes service-role keys or server secrets.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'iqoo-navx-auth-token',
    },
  }
);

/**
 * Helper to check if client-side Supabase credentials are configured.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('YOUR_PROJECT')
  );
};
