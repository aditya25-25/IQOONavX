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
  SUPABASE_SECRET_KEY: z.string().optional(),

  // OpenStreetMap Services (OSRM & Nominatim)
  OSRM_BASE_URL: z.string().default('https://router.project-osrm.org'),
  NOMINATIM_BASE_URL: z.string().default('https://nominatim.openstreetmap.org'),

  // Google Maps / Routing APIs (Optional)
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

  // Supabase key normalization
  const supabaseKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;
  const hasSupabase = Boolean(env.SUPABASE_URL && supabaseKey);
  const hasGoogleRoutes = Boolean(env.GOOGLE_ROUTES_API_KEY || env.GOOGLE_MAPS_API_KEY);
  const hasGooglePlaces = Boolean(env.GOOGLE_PLACES_API_KEY || env.GOOGLE_MAPS_API_KEY);
  const hasGoogleGeocoding = Boolean(env.GOOGLE_GEOCODING_API_KEY || env.GOOGLE_MAPS_API_KEY);
  const hasGemini = Boolean(env.GEMINI_API_KEY);

  return {
    ...env,
    SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY,
    hasSupabase,
    hasGoogleRoutes,
    hasGooglePlaces,
    hasGoogleGeocoding,
    hasGemini,
  };
};

export const config = parseEnv();
