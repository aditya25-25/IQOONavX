export type TravelMode = 'car' | 'bike' | 'walk' | 'monster';

export type MapViewMode = '2D' | '3D' | 'RADAR' | 'TERRAIN';

export interface LatLng {
  lat: number;
  lng: number;
  x?: number; // Normalized canvas coordinate (0-100)
  y?: number;
}

export interface NavigationManeuver {
  id: string;
  type: 'straight' | 'turn-left' | 'turn-right' | 'slight-left' | 'slight-right' | 'roundabout' | 'destination';
  instruction: string;
  distance: string;
  distanceMeters: number;
  streetName: string;
  laneInfo?: {
    totalLanes: number;
    activeLaneIndex: number;
  };
}

export interface RouteOption {
  id: string;
  name: string;
  tag?: string;
  badge?: 'Fastest' | 'Monster Mode' | 'Eco' | 'Direct';
  durationMin: number;
  distanceKm: number;
  trafficLevel: 'smooth' | 'moderate' | 'heavy';
  origin: string;
  destination: string;
  eta: string;
  energyScore: number;
  maneuvers: NavigationManeuver[];
  pathPoints: { x: number; y: number }[];
}

export interface SavedPlace {
  id: string;
  title: string;
  category: 'home' | 'work' | 'favorite' | 'station' | 'track';
  address: string;
  distanceKm: number;
  travelTimeMin: number;
  iconName: string;
}

export interface RecentRoute {
  id: string;
  title: string;
  timestamp: string;
  distanceKm: number;
  durationMin: number;
  avgSpeedKmh: number;
  mode: TravelMode;
}

export interface TelemetryData {
  currentSpeed: number; // km/h
  speedLimit: number; // km/h
  gpsAccuracyMeters: number;
  satelliteCount: number;
  refreshRateHz: number;
  socThermalTempC: number;
  monsterModeActive: boolean;
  batteryOptimized: boolean;
}

export interface AppSettings {
  voiceGuidance: boolean;
  voiceLanguage: 'en-US' | 'en-GB' | 'hi-IN';
  speedUnit: 'km/h' | 'mph';
  monsterRenderEngine: boolean; // 144Hz unlock
  offlinePackDownloaded: boolean;
  soundVolume: number;
  hudGlowAccent: 'iqoo-yellow' | 'cyber-cyan' | 'racing-red';
}
