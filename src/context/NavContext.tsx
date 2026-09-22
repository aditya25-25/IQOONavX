import React, { createContext, useContext, useState, useEffect } from 'react';
import { RouteOption, TravelMode, TelemetryData, AppSettings, MapViewMode, SavedPlace } from '../types/navigation';
import { MOCK_ROUTES, INITIAL_TELEMETRY, DEFAULT_SETTINGS } from '../data/mockNavigation';

interface NavContextType {
  activeRoute: RouteOption;
  setActiveRoute: (route: RouteOption) => void;
  selectRouteById: (routeId: string) => void;
  navState: 'idle' | 'navigating' | 'paused';
  startNavigation: () => void;
  pauseNavigation: () => void;
  stopNavigation: () => void;
  tripProgress: number; // 0 to 100
  travelMode: TravelMode;
  setTravelMode: (mode: TravelMode) => void;
  mapViewMode: MapViewMode;
  setMapViewMode: (mode: MapViewMode) => void;
  telemetry: TelemetryData;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleVoiceGuidance: () => void;
  toggleMonsterMode: () => void;
  // Modals state
  isSavedPlacesOpen: boolean;
  setIsSavedPlacesOpen: (open: boolean) => void;
  isRecentRoutesOpen: boolean;
  setIsRecentRoutesOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isRouteDetailsOpen: boolean;
  setIsRouteDetailsOpen: (open: boolean) => void;
  isFullNavAppOpen: boolean;
  setIsFullNavAppOpen: (open: boolean) => void;
  routeToSavedPlace: (place: SavedPlace) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState<RouteOption>(MOCK_ROUTES[0]);
  const [navState, setNavState] = useState<'idle' | 'navigating' | 'paused'>('idle');
  const [tripProgress, setTripProgress] = useState<number>(18);
  const [travelMode, setTravelMode] = useState<TravelMode>('monster');
  const [mapViewMode, setMapViewMode] = useState<MapViewMode>('3D');
  const [telemetry, setTelemetry] = useState<TelemetryData>(INITIAL_TELEMETRY);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Modals
  const [isSavedPlacesOpen, setIsSavedPlacesOpen] = useState(false);
  const [isRecentRoutesOpen, setIsRecentRoutesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRouteDetailsOpen, setIsRouteDetailsOpen] = useState(false);
  const [isFullNavAppOpen, setIsFullNavAppOpen] = useState(false);

  const selectRouteById = (routeId: string) => {
    const found = MOCK_ROUTES.find((r) => r.id === routeId);
    if (found) {
      setActiveRoute(found);
      setTripProgress(0);
    }
  };

  const startNavigation = () => {
    setNavState('navigating');
  };

  const pauseNavigation = () => {
    setNavState('paused');
  };

  const stopNavigation = () => {
    setNavState('idle');
    setTripProgress(0);
  };

  const toggleVoiceGuidance = () => {
    setSettings((prev) => ({ ...prev, voiceGuidance: !prev.voiceGuidance }));
  };

  const toggleMonsterMode = () => {
    setTelemetry((prev) => ({ ...prev, monsterModeActive: !prev.monsterModeActive }));
    setSettings((prev) => ({ ...prev, monsterRenderEngine: !prev.monsterRenderEngine }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const routeToSavedPlace = (place: SavedPlace) => {
    // Dynamically adjust current active route destination
    setActiveRoute((prev) => ({
      ...prev,
      destination: place.title,
      distanceKm: place.distanceKm,
      durationMin: place.travelTimeMin,
    }));
    setIsSavedPlacesOpen(false);
    startNavigation();
  };

  // Simulated GPS drive loop when in navigating state
  useEffect(() => {
    if (navState !== 'navigating') return;

    const interval = setInterval(() => {
      setTripProgress((prev) => {
        if (prev >= 100) {
          return 0; // loop simulation
        }
        return prev + 0.8;
      });

      // Realistic speed variation
      setTelemetry((prev) => {
        const speedDelta = (Math.random() - 0.48) * 4;
        const targetBaseSpeed = travelMode === 'monster' ? 84 : travelMode === 'car' ? 65 : travelMode === 'bike' ? 28 : 5;
        const newSpeed = Math.max(0, Math.min(130, Math.round(targetBaseSpeed + speedDelta)));
        return {
          ...prev,
          currentSpeed: newSpeed,
          gpsAccuracyMeters: +(0.3 + Math.random() * 0.2).toFixed(2),
          satelliteCount: Math.floor(26 + Math.random() * 6),
        };
      });
    }, 400);

    return () => clearInterval(interval);
  }, [navState, travelMode]);

  return (
    <NavContext.Provider
      value={{
        activeRoute,
        setActiveRoute,
        selectRouteById,
        navState,
        startNavigation,
        pauseNavigation,
        stopNavigation,
        tripProgress,
        travelMode,
        setTravelMode,
        mapViewMode,
        setMapViewMode,
        telemetry,
        settings,
        updateSettings,
        toggleVoiceGuidance,
        toggleMonsterMode,
        isSavedPlacesOpen,
        setIsSavedPlacesOpen,
        isRecentRoutesOpen,
        setIsRecentRoutesOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isRouteDetailsOpen,
        setIsRouteDetailsOpen,
        isFullNavAppOpen,
        setIsFullNavAppOpen,
        routeToSavedPlace,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
};
