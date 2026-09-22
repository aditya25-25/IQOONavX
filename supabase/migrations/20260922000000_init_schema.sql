-- ==============================================================================
-- IQOO NavX — Initial Database Schema & Row Level Security (RLS)
-- Platform: Supabase / PostgreSQL
-- ==============================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. SAVED_PLACES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL CHECK (latitude >= -90.0 AND latitude <= 90.0),
    longitude DOUBLE PRECISION NOT NULL CHECK (longitude >= -180.0 AND longitude <= 180.0),
    address TEXT,
    category TEXT DEFAULT 'favorite',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index on user_id for high-performance lookups
CREATE INDEX IF NOT EXISTS idx_saved_places_user_id ON public.saved_places(user_id);

-- Enable RLS on saved_places
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;

-- Saved Places Policies
CREATE POLICY "Users can view their own saved places"
    ON public.saved_places FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved places"
    ON public.saved_places FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved places"
    ON public.saved_places FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved places"
    ON public.saved_places FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. RECENT_ROUTES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recent_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    source_latitude DOUBLE PRECISION,
    source_longitude DOUBLE PRECISION,
    dest_latitude DOUBLE PRECISION,
    dest_longitude DOUBLE PRECISION,
    distance DOUBLE PRECISION NOT NULL, -- Distance in Kilometers
    duration DOUBLE PRECISION NOT NULL, -- Duration in Minutes
    travel_mode TEXT DEFAULT 'driving',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index on user_id and created_at for fast chronologically sorted trip history
CREATE INDEX IF NOT EXISTS idx_recent_routes_user_date ON public.recent_routes(user_id, created_at DESC);

-- Enable RLS on recent_routes
ALTER TABLE public.recent_routes ENABLE ROW LEVEL SECURITY;

-- Recent Routes Policies
CREATE POLICY "Users can view their own recent routes"
    ON public.recent_routes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recent routes"
    ON public.recent_routes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recent routes"
    ON public.recent_routes FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 4. NAVIGATION_PREFERENCES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.navigation_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    voice_enabled BOOLEAN DEFAULT true NOT NULL,
    dark_mode BOOLEAN DEFAULT true NOT NULL,
    travel_mode TEXT DEFAULT 'driving' NOT NULL CHECK (travel_mode IN ('driving', 'walking', 'cycling', 'two_wheeler', 'monster')),
    monster_mode_enabled BOOLEAN DEFAULT true NOT NULL,
    speed_unit TEXT DEFAULT 'km/h' NOT NULL CHECK (speed_unit IN ('km/h', 'mph')),
    voice_language TEXT DEFAULT 'en-US' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on navigation_preferences
ALTER TABLE public.navigation_preferences ENABLE ROW LEVEL SECURITY;

-- Navigation Preferences Policies
CREATE POLICY "Users can view their own preferences"
    ON public.navigation_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON public.navigation_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON public.navigation_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. AUTOMATIC TRIGGER FOR NEW AUTH SIGNUPS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create default profile
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Create default navigation preferences
    INSERT INTO public.navigation_preferences (user_id, voice_enabled, dark_mode, travel_mode, monster_mode_enabled, speed_unit, voice_language)
    VALUES (NEW.id, true, true, 'driving', true, 'km/h', 'en-US')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger firing on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
