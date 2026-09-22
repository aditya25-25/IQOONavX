# IQOO NavX — Database & Supabase Architecture

## Database Engine
- **Platform:** Supabase (PostgreSQL 15+)
- **Security:** Row Level Security (RLS) enabled on all tables
- **Authentication:** Supabase Auth (JWT bearer verification)

---

## Tables Overview

### 1. `profiles`
User profile synchronization table linked to `auth.users`.
- `id` (UUID, PK, FK -> `auth.users.id`)
- `email` (TEXT, NOT NULL)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 2. `saved_places`
Favorite locations, home, work, and iQOO event arenas.
- `id` (UUID, PK)
- `user_id` (UUID, FK -> `auth.users.id`)
- `name` (TEXT, NOT NULL)
- `latitude` (DOUBLE PRECISION, CHECK -90 to 90)
- `longitude` (DOUBLE PRECISION, CHECK -180 to 180)
- `address` (TEXT)
- `category` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 3. `recent_routes`
Historical route telemetry logs.
- `id` (UUID, PK)
- `user_id` (UUID, FK -> `auth.users.id`)
- `source_name` (TEXT, NOT NULL)
- `destination_name` (TEXT, NOT NULL)
- `distance` (DOUBLE PRECISION)
- `duration` (DOUBLE PRECISION)
- `travel_mode` (TEXT)
- `created_at` (TIMESTAMPTZ)

### 4. `navigation_preferences`
Custom navigation and device performance preferences.
- `id` (UUID, PK)
- `user_id` (UUID, UNIQUE, FK -> `auth.users.id`)
- `voice_enabled` (BOOLEAN)
- `dark_mode` (BOOLEAN)
- `travel_mode` (TEXT)
- `monster_mode_enabled` (BOOLEAN)
- `speed_unit` (TEXT)
- `voice_language` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

---

## Row Level Security (RLS) Policies
Every table is locked down so authenticated users can ONLY read and write their own records:
```sql
CREATE POLICY "Users can access own saved places"
    ON public.saved_places FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

## Migration Execution
Execute [`supabase/migrations/20260922000000_init_schema.sql`](../supabase/migrations/20260922000000_init_schema.sql) in your Supabase SQL editor to create all tables, indexes, and triggers.
