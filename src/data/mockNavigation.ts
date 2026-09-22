import { RouteOption, SavedPlace, RecentRoute, TelemetryData, AppSettings } from '../types/navigation';

export const INITIAL_TELEMETRY: TelemetryData = {
  currentSpeed: 68,
  speedLimit: 80,
  gpsAccuracyMeters: 0.4,
  satelliteCount: 28,
  refreshRateHz: 144,
  socThermalTempC: 34.2,
  monsterModeActive: true,
  batteryOptimized: true,
};

export const DEFAULT_SETTINGS: AppSettings = {
  voiceGuidance: true,
  voiceLanguage: 'en-US',
  speedUnit: 'km/h',
  monsterRenderEngine: true,
  offlinePackDownloaded: true,
  soundVolume: 85,
  hudGlowAccent: 'iqoo-yellow',
};

export const MOCK_ROUTES: RouteOption[] = [
  {
    id: 'route-monster-fast',
    name: 'iQOO HyperFlow Expressway',
    badge: 'Fastest',
    durationMin: 14,
    distanceKm: 12.8,
    trafficLevel: 'smooth',
    origin: 'Cyber City Terminal 3',
    destination: 'iQOO Monster Esports Arena',
    eta: '17:34',
    energyScore: 98,
    pathPoints: [
      { x: 12, y: 78 },
      { x: 26, y: 64 },
      { x: 38, y: 45 },
      { x: 55, y: 42 },
      { x: 68, y: 28 },
      { x: 86, y: 22 }
    ],
    maneuvers: [
      {
        id: 'm1',
        type: 'straight',
        instruction: 'Head northeast on Cyber Boulevard',
        distance: '400 m',
        distanceMeters: 400,
        streetName: 'Cyber Boulevard',
        laneInfo: { totalLanes: 4, activeLaneIndex: 2 }
      },
      {
        id: 'm2',
        type: 'slight-right',
        instruction: 'Take the flyover towards iQOO Ring Expressway',
        distance: '1.2 km',
        distanceMeters: 1200,
        streetName: 'iQOO Ring Expressway',
        laneInfo: { totalLanes: 3, activeLaneIndex: 2 }
      },
      {
        id: 'm3',
        type: 'turn-right',
        instruction: 'Turn right into Arena Tech Boulevard',
        distance: '650 m',
        distanceMeters: 650,
        streetName: 'Arena Tech Boulevard',
        laneInfo: { totalLanes: 2, activeLaneIndex: 1 }
      },
      {
        id: 'm4',
        type: 'destination',
        instruction: 'Arrive at iQOO Monster Esports Arena',
        distance: '100 m',
        distanceMeters: 100,
        streetName: 'Arena Gate 1'
      }
    ]
  },
  {
    id: 'route-direct-arterial',
    name: 'Sector 5 Grand Boulevard',
    badge: 'Direct',
    durationMin: 18,
    distanceKm: 11.2,
    trafficLevel: 'moderate',
    origin: 'Cyber City Terminal 3',
    destination: 'iQOO Monster Esports Arena',
    eta: '17:38',
    energyScore: 91,
    pathPoints: [
      { x: 12, y: 78 },
      { x: 30, y: 72 },
      { x: 48, y: 60 },
      { x: 62, y: 48 },
      { x: 74, y: 35 },
      { x: 86, y: 22 }
    ],
    maneuvers: [
      {
        id: 'm1-alt',
        type: 'straight',
        instruction: 'Continue on Sector 5 Main Avenue',
        distance: '1.8 km',
        distanceMeters: 1800,
        streetName: 'Sector 5 Main Ave'
      },
      {
        id: 'm2-alt',
        type: 'turn-left',
        instruction: 'Turn left onto Innovation Corridor',
        distance: '800 m',
        distanceMeters: 800,
        streetName: 'Innovation Corridor'
      },
      {
        id: 'm3-alt',
        type: 'destination',
        instruction: 'Arrive at destination',
        distance: '200 m',
        distanceMeters: 200,
        streetName: 'Arena Gate 1'
      }
    ]
  },
  {
    id: 'route-eco-bypass',
    name: 'Eco Green Corridor',
    badge: 'Eco',
    durationMin: 21,
    distanceKm: 14.5,
    trafficLevel: 'smooth',
    origin: 'Cyber City Terminal 3',
    destination: 'iQOO Monster Esports Arena',
    eta: '17:41',
    energyScore: 99,
    pathPoints: [
      { x: 12, y: 78 },
      { x: 22, y: 88 },
      { x: 45, y: 84 },
      { x: 70, y: 68 },
      { x: 82, y: 44 },
      { x: 86, y: 22 }
    ],
    maneuvers: [
      {
        id: 'm1-eco',
        type: 'straight',
        instruction: 'Follow Eco Bypass Parkway',
        distance: '3.4 km',
        distanceMeters: 3400,
        streetName: 'Eco Bypass'
      },
      {
        id: 'm2-eco',
        type: 'slight-left',
        instruction: 'Merge onto North Connector',
        distance: '1.5 km',
        distanceMeters: 1500,
        streetName: 'North Connector'
      }
    ]
  }
];

export const SAVED_PLACES: SavedPlace[] = [
  {
    id: 'sp-1',
    title: 'Home Base (Cyber Hub)',
    category: 'home',
    address: 'Apt 14B, Apex Cyber Heights, Sector 42',
    distanceKm: 4.2,
    travelTimeMin: 8,
    iconName: 'Home'
  },
  {
    id: 'sp-2',
    title: 'iQOO HQ & Design Labs',
    category: 'work',
    address: 'Tower 9, Innovation Matrix Park, Tech District',
    distanceKm: 8.5,
    travelTimeMin: 12,
    iconName: 'Building2'
  },
  {
    id: 'sp-3',
    title: 'iQOO Monster Esports Arena',
    category: 'track',
    address: 'Grand Velocity Boulevard, Gate 1',
    distanceKm: 12.8,
    travelTimeMin: 14,
    iconName: 'Flame'
  },
  {
    id: 'sp-4',
    title: 'International Skyport Terminal 2',
    category: 'station',
    address: 'Aero City Access Expressway',
    distanceKm: 22.4,
    travelTimeMin: 25,
    iconName: 'Plane'
  }
];

export const RECENT_ROUTES: RecentRoute[] = [
  {
    id: 'rr-1',
    title: 'Apex Cyber Heights → Tech Matrix Park',
    timestamp: 'Today, 09:15 AM',
    distanceKm: 8.4,
    durationMin: 11,
    avgSpeedKmh: 54,
    mode: 'car'
  },
  {
    id: 'rr-2',
    title: 'Tech Matrix Park → iQOO Flagship Studio',
    timestamp: 'Yesterday, 07:40 PM',
    distanceKm: 5.1,
    durationMin: 7,
    avgSpeedKmh: 49,
    mode: 'monster'
  },
  {
    id: 'rr-3',
    title: 'West Grand Avenue Circuit Sprint',
    timestamp: '20 Sep, 10:20 PM',
    distanceKm: 18.2,
    durationMin: 16,
    avgSpeedKmh: 76,
    mode: 'car'
  },
  {
    id: 'rr-4',
    title: 'City Center Loop Walk',
    timestamp: '19 Sep, 06:10 AM',
    distanceKm: 3.2,
    durationMin: 35,
    avgSpeedKmh: 5.4,
    mode: 'walk'
  }
];
