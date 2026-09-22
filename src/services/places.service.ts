import { PlaceSearchResult } from '../types/places.types';
import { config } from '../config/env';
import { logger } from '../lib/logger';

const MOCK_PLACES_CATALOG: PlaceSearchResult[] = [
  {
    id: 'poi-1',
    name: 'iQOO Monster Esports Arena',
    formattedAddress: 'Grand Velocity Boulevard, Gate 1, Tech City',
    location: { latitude: 28.5355, longitude: 77.391 },
    types: ['stadium', 'entertainment', 'point_of_interest'],
    rating: 4.9,
    userRatingsTotal: 3420,
  },
  {
    id: 'poi-2',
    name: 'Cyber City Hub & Innovation Matrix',
    formattedAddress: 'Cyber Hub DLF Phase 2, Sector 24',
    location: { latitude: 28.4905, longitude: 77.0898 },
    types: ['business_park', 'transit_station'],
    rating: 4.8,
    userRatingsTotal: 12500,
  },
  {
    id: 'poi-3',
    name: 'iQOO Flagship Supercharger & Tech Center',
    formattedAddress: 'Sector 54, Golf Course Road Corridor',
    location: { latitude: 28.4358, longitude: 77.1086 },
    types: ['electric_vehicle_charging_station', 'electronics_store'],
    rating: 4.9,
    userRatingsTotal: 840,
  },
  {
    id: 'poi-4',
    name: 'International Airport Terminal 3',
    formattedAddress: 'Indira Gandhi International Airport, New Delhi',
    location: { latitude: 28.5562, longitude: 77.1000 },
    types: ['airport', 'transit_hub'],
    rating: 4.7,
    userRatingsTotal: 84900,
  },
  {
    id: 'poi-5',
    name: 'Apex Grand Boulevard Circuit',
    formattedAddress: 'West Expressway Ring, Sector 82',
    location: { latitude: 28.4021, longitude: 76.9942 },
    types: ['route', 'point_of_interest'],
    rating: 4.8,
    userRatingsTotal: 610,
  },
];

export class PlacesService {
  /**
   * Searches for places by query text and optional location bias.
   */
  static async searchPlaces(query: string, latitude?: number, longitude?: number): Promise<PlaceSearchResult[]> {
    if (!query || query.trim().length === 0) return [];

    if (config.hasGooglePlaces) {
      try {
        const googleResults = await this.callGooglePlacesApi(query, latitude, longitude);
        if (googleResults && googleResults.length > 0) {
          return googleResults;
        }
      } catch (err) {
        logger.warn('Google Places API search failed, falling back to local POI index:', err);
      }
    }

    // Fallback: Local search against curated POI dataset
    const q = query.toLowerCase();
    const filtered = MOCK_PLACES_CATALOG.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.formattedAddress.toLowerCase().includes(q) ||
        p.types?.some((t) => t.toLowerCase().includes(q))
    );

    if (filtered.length > 0) return filtered;

    // Generate dynamic fallback result for custom queries
    return [
      {
        id: `dyn-poi-${Date.now()}`,
        name: query,
        formattedAddress: `${query}, City Tech Corridor`,
        location: {
          latitude: latitude || 28.4595 + (Math.random() - 0.5) * 0.05,
          longitude: longitude || 77.0266 + (Math.random() - 0.5) * 0.05,
        },
        types: ['establishment', 'point_of_interest'],
        rating: 4.5,
      },
      ...MOCK_PLACES_CATALOG.slice(0, 3),
    ];
  }

  private static async callGooglePlacesApi(
    query: string,
    latitude?: number,
    longitude?: number
  ): Promise<PlaceSearchResult[] | null> {
    const apiKey = config.GOOGLE_PLACES_API_KEY || config.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;

    const url = 'https://places.googleapis.com/v1/places:searchText';

    const requestBody: any = {
      textQuery: query,
      maxResultCount: 10,
    };

    if (latitude !== undefined && longitude !== undefined) {
      requestBody.locationBias = {
        circle: {
          center: { latitude, longitude },
          radius: 15000.0, // 15km
        },
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.userRatingCount',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      logger.warn(`Google Places API returned ${response.status}: ${errText}`);
      return null;
    }

    const data = (await response.json()) as any;
    if (!data.places || data.places.length === 0) return [];

    return data.places.map((p: any) => ({
      id: p.id,
      name: p.displayName?.text || 'Location',
      formattedAddress: p.formattedAddress || '',
      location: {
        latitude: p.location?.latitude || 0,
        longitude: p.location?.longitude || 0,
      },
      types: p.types || [],
      rating: p.rating,
      userRatingsTotal: p.userRatingCount,
    }));
  }
}
