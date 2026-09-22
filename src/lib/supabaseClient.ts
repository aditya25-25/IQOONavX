import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import { logger } from './logger';

let adminClient: SupabaseClient | null = null;

/**
 * Initializes or returns the Supabase Admin (Service Role) client.
 */
export const getSupabaseAdmin = (): SupabaseClient | null => {
  if (adminClient) return adminClient;

  if (!config.SUPABASE_URL || (!config.SUPABASE_SERVICE_ROLE_KEY && !config.SUPABASE_PUBLISHABLE_KEY)) {
    logger.warn('Supabase URL or keys not configured. Database operations will run in local demo mode.');
    return null;
  }

  const key = config.SUPABASE_SERVICE_ROLE_KEY || config.SUPABASE_PUBLISHABLE_KEY!;
  adminClient = createClient(config.SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
};

/**
 * Creates a Supabase client scoped to the authenticated user's JWT token.
 * This guarantees that Supabase Row Level Security (RLS) policies are enforced.
 */
export const createScopedUserClient = (jwtToken: string): SupabaseClient | null => {
  if (!config.SUPABASE_URL || !config.SUPABASE_PUBLISHABLE_KEY) {
    return null;
  }

  return createClient(config.SUPABASE_URL, config.SUPABASE_PUBLISHABLE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
