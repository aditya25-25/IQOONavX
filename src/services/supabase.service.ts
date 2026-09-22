import { getSupabaseAdmin, createScopedUserClient } from '../lib/supabaseClient';
import { SavedPlace, CreateSavedPlaceDTO, UpdateSavedPlaceDTO } from '../types/places.types';
import { RecentRoute, CreateRecentRouteDTO } from '../types/routes.types';
import { NavigationPreferences, UpdatePreferencesDTO } from '../types/preferences.types';
import { UserProfile } from '../types/auth.types';
import { NotFoundError } from '../lib/errors';
import { config } from '../config/env';

// In-memory fallback storage for development / tests when Supabase connection is offline
class MemoryStore {
  public savedPlaces: Map<string, SavedPlace[]> = new Map();
  public recentRoutes: Map<string, RecentRoute[]> = new Map();
  public preferences: Map<string, NavigationPreferences> = new Map();
  public profiles: Map<string, UserProfile> = new Map();

  constructor() {
    // Seed initial demo data for test pilot
    const demoUserId = '00000000-0000-0000-0000-000000000001';
    this.savedPlaces.set(demoUserId, [
      {
        id: 'place-1',
        user_id: demoUserId,
        name: 'iQOO Monster Esports Arena',
        latitude: 28.5355,
        longitude: 77.391,
        address: 'Grand Velocity Boulevard, Gate 1',
        category: 'track',
        created_at: new Date().toISOString(),
      },
      {
        id: 'place-2',
        user_id: demoUserId,
        name: 'Apex Cyber Heights',
        latitude: 28.4595,
        longitude: 77.0266,
        address: 'Sector 42, Cyber Hub',
        category: 'home',
        created_at: new Date().toISOString(),
      },
    ]);

    this.preferences.set(demoUserId, {
      id: 'pref-1',
      user_id: demoUserId,
      voice_enabled: true,
      dark_mode: true,
      travel_mode: 'driving',
      monster_mode_enabled: true,
      speed_unit: 'km/h',
      voice_language: 'en-US',
      created_at: new Date().toISOString(),
    });
  }
}

const memoryStore = new MemoryStore();

export class SupabaseService {
  /**
   * Helper to get appropriate client (user scoped if token provided, else admin)
   */
  private static getClient(token?: string) {
    if (token && config.hasSupabase) {
      const userClient = createScopedUserClient(token);
      if (userClient) return userClient;
    }
    return getSupabaseAdmin();
  }

  // ==========================================
  // SAVED PLACES
  // ==========================================

  static async getSavedPlaces(userId: string, token?: string): Promise<SavedPlace[]> {
    const client = this.getClient(token);
    if (!client) {
      return memoryStore.savedPlaces.get(userId) || [];
    }

    const { data, error } = await client
      .from('saved_places')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getSavedPlaceById(id: string, userId: string, token?: string): Promise<SavedPlace> {
    const client = this.getClient(token);
    if (!client) {
      const userPlaces = memoryStore.savedPlaces.get(userId) || [];
      const found = userPlaces.find((p) => p.id === id);
      if (!found) throw new NotFoundError(`Saved place with ID ${id} not found.`);
      return found;
    }

    const { data, error } = await client
      .from('saved_places')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Saved place with ID ${id} not found.`);
    }

    return data;
  }

  static async createSavedPlace(userId: string, dto: CreateSavedPlaceDTO, token?: string): Promise<SavedPlace> {
    const client = this.getClient(token);
    if (!client) {
      const newPlace: SavedPlace = {
        id: `sp-${Date.now()}`,
        user_id: userId,
        name: dto.name,
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address || null,
        category: dto.category || 'favorite',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const existing = memoryStore.savedPlaces.get(userId) || [];
      memoryStore.savedPlaces.set(userId, [newPlace, ...existing]);
      return newPlace;
    }

    const { data, error } = await client
      .from('saved_places')
      .insert({
        user_id: userId,
        name: dto.name,
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
        category: dto.category || 'favorite',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSavedPlace(id: string, userId: string, dto: UpdateSavedPlaceDTO, token?: string): Promise<SavedPlace> {
    const client = this.getClient(token);
    if (!client) {
      const userPlaces = memoryStore.savedPlaces.get(userId) || [];
      const placeIndex = userPlaces.findIndex((p) => p.id === id);
      if (placeIndex === -1) throw new NotFoundError(`Saved place with ID ${id} not found.`);

      const updated = {
        ...userPlaces[placeIndex],
        ...dto,
        updated_at: new Date().toISOString(),
      };
      userPlaces[placeIndex] = updated;
      memoryStore.savedPlaces.set(userId, userPlaces);
      return updated;
    }

    const { data, error } = await client
      .from('saved_places')
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundError(`Saved place with ID ${id} not found.`);
    }

    return data;
  }

  static async deleteSavedPlace(id: string, userId: string, token?: string): Promise<boolean> {
    const client = this.getClient(token);
    if (!client) {
      const userPlaces = memoryStore.savedPlaces.get(userId) || [];
      const filtered = userPlaces.filter((p) => p.id !== id);
      if (filtered.length === userPlaces.length) {
        throw new NotFoundError(`Saved place with ID ${id} not found.`);
      }
      memoryStore.savedPlaces.set(userId, filtered);
      return true;
    }

    const { error, count } = await client
      .from('saved_places')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    if (count === 0) throw new NotFoundError(`Saved place with ID ${id} not found.`);
    return true;
  }

  // ==========================================
  // RECENT ROUTES
  // ==========================================

  static async getRecentRoutes(userId: string, limit = 10, token?: string): Promise<RecentRoute[]> {
    const client = this.getClient(token);
    if (!client) {
      const routes = memoryStore.recentRoutes.get(userId) || [];
      return routes.slice(0, limit);
    }

    const { data, error } = await client
      .from('recent_routes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  static async createRecentRoute(userId: string, dto: CreateRecentRouteDTO, token?: string): Promise<RecentRoute> {
    const client = this.getClient(token);
    if (!client) {
      const newRoute: RecentRoute = {
        id: `rr-${Date.now()}`,
        user_id: userId,
        source_name: dto.source_name,
        destination_name: dto.destination_name,
        source_latitude: dto.source_latitude || null,
        source_longitude: dto.source_longitude || null,
        dest_latitude: dto.dest_latitude || null,
        dest_longitude: dto.dest_longitude || null,
        distance: dto.distance,
        duration: dto.duration,
        travel_mode: dto.travel_mode || 'driving',
        created_at: new Date().toISOString(),
      };
      const existing = memoryStore.recentRoutes.get(userId) || [];
      memoryStore.recentRoutes.set(userId, [newRoute, ...existing]);
      return newRoute;
    }

    const { data, error } = await client
      .from('recent_routes')
      .insert({
        user_id: userId,
        source_name: dto.source_name,
        destination_name: dto.destination_name,
        source_latitude: dto.source_latitude,
        source_longitude: dto.source_longitude,
        dest_latitude: dto.dest_latitude,
        dest_longitude: dto.dest_longitude,
        distance: dto.distance,
        duration: dto.duration,
        travel_mode: dto.travel_mode || 'driving',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteRecentRoute(id: string, userId: string, token?: string): Promise<boolean> {
    const client = this.getClient(token);
    if (!client) {
      const userTrips = memoryStore.recentRoutes.get(userId) || [];
      const filtered = userTrips.filter((r) => r.id !== id);
      if (filtered.length === userTrips.length) {
        throw new NotFoundError(`Recent route with ID ${id} not found.`);
      }
      memoryStore.recentRoutes.set(userId, filtered);
      return true;
    }

    const { error, count } = await client
      .from('recent_routes')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    if (count === 0) throw new NotFoundError(`Recent route with ID ${id} not found.`);
    return true;
  }

  // ==========================================
  // NAVIGATION PREFERENCES
  // ==========================================

  static async getPreferences(userId: string, token?: string): Promise<NavigationPreferences> {
    const client = this.getClient(token);
    if (!client) {
      let pref = memoryStore.preferences.get(userId);
      if (!pref) {
        pref = {
          id: `pref-${Date.now()}`,
          user_id: userId,
          voice_enabled: true,
          dark_mode: true,
          travel_mode: 'driving',
          monster_mode_enabled: true,
          speed_unit: 'km/h',
          voice_language: 'en-US',
          created_at: new Date().toISOString(),
        };
        memoryStore.preferences.set(userId, pref);
      }
      return pref;
    }

    const { data, error } = await client
      .from('navigation_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // Create default preferences on demand
      const defaultPref = {
        user_id: userId,
        voice_enabled: true,
        dark_mode: true,
        travel_mode: 'driving',
        monster_mode_enabled: true,
        speed_unit: 'km/h',
        voice_language: 'en-US',
      };
      const { data: created, error: createError } = await client
        .from('navigation_preferences')
        .insert(defaultPref)
        .select()
        .single();

      if (createError) throw createError;
      return created;
    }

    return data;
  }

  static async updatePreferences(userId: string, dto: UpdatePreferencesDTO, token?: string): Promise<NavigationPreferences> {
    const client = this.getClient(token);
    if (!client) {
      const existing = await this.getPreferences(userId);
      const updated: NavigationPreferences = {
        ...existing,
        ...dto,
        updated_at: new Date().toISOString(),
      };
      memoryStore.preferences.set(userId, updated);
      return updated;
    }

    const { data, error } = await client
      .from('navigation_preferences')
      .upsert({
        user_id: userId,
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
