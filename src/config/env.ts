import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env if present
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  // Supabase Platform
  SUPABASE_URL: z.string().optional(),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Google Maps / Routing APIs
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  GOOGLE_ROUTES_API_KEY: z.string().optional(),
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  GOOGLE_GEOCODING_API_KEY: z.string().optional(),

  // Gemini AI Assistant
  GEMINI_API_KEY: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform((val) => parseInt(val, 10)), // 15 mins
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform((val) => parseInt(val, 10)),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.format();
    console.error('❌ Environment configuration validation error:', JSON.stringify(errorDetails, null, 2));
    throw new Error('Invalid environment variables.');
  }

  const env = result.data;

  // Verification helper for external service keys without leaking values
  const hasSupabase = Boolean(env.SUPABASE_URL && (env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY));
  const hasGoogleRoutes = Boolean(env.GOOGLE_ROUTES_API_KEY || env.GOOGLE_MAPS_API_KEY);
  const hasGooglePlaces = Boolean(env.GOOGLE_PLACES_API_KEY || env.GOOGLE_MAPS_API_KEY);
  const hasGoogleGeocoding = Boolean(env.GOOGLE_GEOCODING_API_KEY || env.GOOGLE_MAPS_API_KEY);
  const hasGemini = Boolean(env.GEMINI_API_KEY);

  return {
    ...env,
    hasSupabase,
    hasGoogleRoutes,
    hasGooglePlaces,
    hasGoogleGeocoding,
    hasGemini,
  };
};

export const config = parseEnv();
