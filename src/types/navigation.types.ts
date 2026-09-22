import { SupportedTravelMode } from './preferences.types';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RouteRequestDTO {
  origin: Coordinates;
  destination: Coordinates;
  travelMode?: SupportedTravelMode;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  monsterOptimization?: boolean;
}

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
  distanceText: string;
  durationText: string;
  startLocation: Coordinates;
  endLocation: Coordinates;
  maneuver?: string;
  streetName?: string;
}

export interface RouteOption {
  distanceMeters: number;
  durationSeconds: number;
  distanceText: string;
  durationText: string;
  polyline: string;
  steps: RouteStep[];
  trafficLevel: 'smooth' | 'moderate' | 'heavy';
  tag?: 'fastest' | 'eco' | 'direct' | 'monster_boost';
}

export interface RouteCalculationResponse {
  primaryRoute: RouteOption;
  alternatives: RouteOption[];
  origin: Coordinates;
  destination: Coordinates;
  travelMode: SupportedTravelMode;
  provider: 'google_routes' | 'iqoo_matrix_engine';
  isCachedOfflineReady: boolean;
}

export interface GeocodeResult {
  formattedAddress: string;
  location: Coordinates;
  placeId?: string;
  addressComponents?: {
    streetNumber?: string;
    route?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}
