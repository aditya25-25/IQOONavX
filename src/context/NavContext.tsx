import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RouteOption, TravelMode, TelemetryData, AppSettings, MapViewMode, SavedPlace, NavigationManeuver } from '../types/navigation';
import { MOCK_ROUTES, INITIAL_TELEMETRY, DEFAULT_SETTINGS } from '../data/mockNavigation';
import { apiClient } from '../services/apiClient';
import { useAuth } from './AuthContext';

interface RouteCalculateParams {
  origin: { latitude: number; longitude: number; name?: string };
  destination: { latitude: number; longitude: number; name?: string };
  travelMode?: TravelMode;
  monsterOptimization?: boolean;
}

interface NavContextType {
  activeRoute: RouteOption;
  availableRoutes: RouteOption[];
  setActiveRoute: (route: RouteOption) => void;
  selectRouteById: (routeId: string) => void;
  calculateBackendRoute: (params: RouteCalculateParams) => Promise<boolean>;
  isCalculatingRoute: boolean;
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
  const { user } = useAuth();

  const [availableRoutes, setAvailableRoutes] = useState<RouteOption[]>(MOCK_ROUTES);
  const [activeRoute, setActiveRoute] = useState<RouteOption>(MOCK_ROUTES[0]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

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

  // Load preferences from backend when user is authenticated
  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      try {
        const prefs = await apiClient.get<any>('/preferences');
        if (prefs) {
          setSettings((prev) => ({
            ...prev,
            voiceGuidance: prefs.voice_enabled ?? prev.voiceGuidance,
            voiceLanguage: (prefs.voice_language as any) || prev.voiceLanguage,
            speedUnit: (prefs.speed_unit as any) || prev.speedUnit,
            monsterRenderEngine: prefs.monster_mode_enabled ?? prev.monsterRenderEngine,
          }));
          if (prefs.travel_mode) {
            const mappedMode = prefs.travel_mode === 'driving' ? 'car' : prefs.travel_mode;
            setTravelMode(mappedMode as TravelMode);
          }
        }
      } catch (err: any) {
        console.warn('Could not load preferences from backend:', err.message);
      }
    };

    loadPreferences();
  }, [user]);

  // Sync settings updates to backend
  const updateSettings = useCallback(
    async (newSettings: Partial<AppSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        if (user) {
          const backendDTO: any = {};
          if (newSettings.voiceGuidance !== undefined) backendDTO.voice_enabled = newSettings.voiceGuidance;
          if (newSettings.voiceLanguage !== undefined) backendDTO.voice_language = newSettings.voiceLanguage;
          if (newSettings.speedUnit !== undefined) backendDTO.speed_unit = newSettings.speedUnit;
          if (newSettings.monsterRenderEngine !== undefined) backendDTO.monster_mode_enabled = newSettings.monsterRenderEngine;

          apiClient.put('/preferences', backendDTO).catch((e) => {
            console.warn('Failed to sync preferences to backend:', e.message);
          });
        }
        return updated;
      });
    },
    [user]
  );

  const selectRouteById = (routeId: string) => {
    const found = availableRoutes.find((r) => r.id === routeId) || MOCK_ROUTES.find((r) => r.id === routeId);
    if (found) {
      setActiveRoute(found);
      setTripProgress(0);
    }
  };

  /**
   * Calculates live route via backend POST /api/v1/navigation/route (OSRM / Matrix)
   */
  const calculateBackendRoute = async (params: RouteCalculateParams): Promise<boolean> => {
    setIsCalculatingRoute(true);
    try {
      const mappedTravelMode =
        params.travelMode === 'monster'
          ? 'driving'
          : params.travelMode === 'car'
          ? 'driving'
          : params.travelMode === 'bike'
          ? 'cycling'
          : 'walking';

      const response = await apiClient.post<any>('/navigation/route', {
        origin: { latitude: params.origin.latitude, longitude: params.origin.longitude },
        destination: { latitude: params.destination.latitude, longitude: params.destination.longitude },
        travelMode: mappedTravelMode,
        monsterOptimization: params.monsterOptimization ?? (params.travelMode === 'monster'),
      });

      if (response && response.primaryRoute) {
        const primary = response.primaryRoute;
        const distKm = +(primary.distanceMeters / 1000).toFixed(1);
        const durMin = Math.ceil(primary.durationSeconds / 60);

        const mappedManeuvers: NavigationManeuver[] = (primary.steps || []).map((s: any, idx: number) => ({
          id: `step-${idx}`,
          type: s.maneuver?.includes('left') ? 'turn-left' : s.maneuver?.includes('right') ? 'turn-right' : idx === (primary.steps.length - 1) ? 'destination' : 'straight',
          instruction: s.instruction || 'Continue on route',
          distance: s.distanceText || `${s.distanceMeters || 100} m`,
          distanceMeters: s.distanceMeters || 100,
          streetName: s.streetName || 'Corridor Avenue',
        }));

        const calculatedRoute: RouteOption = {
          id: `route-backend-${Date.now()}`,
          name: params.destination.name || 'Calculated Matrix Corridor',
          badge: params.travelMode === 'monster' ? 'Fastest' : 'Direct',
          durationMin: durMin,
          distanceKm: distKm,
          trafficLevel: primary.trafficLevel || 'smooth',
          origin: params.origin.name || 'Starting Point',
          destination: params.destination.name || 'Target Destination',
          eta: `${new Date(Date.now() + durMin * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          energyScore: 96,
          pathPoints: [
            { x: 12, y: 78 },
            { x: 35, y: 55 },
            { x: 65, y: 35 },
            { x: 86, y: 22 },
          ],
          maneuvers: mappedManeuvers.length > 0 ? mappedManeuvers : MOCK_ROUTES[0].maneuvers,
        };

        setActiveRoute(calculatedRoute);
        setAvailableRoutes([calculatedRoute, ...MOCK_ROUTES.slice(1)]);
        setTripProgress(0);
        return true;
      }
      return false;
    } catch (err: any) {
      console.warn('Backend route calculation fallback to local cache:', err.message);
      return false;
    } finally {
      setIsCalculatingRoute(false);
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
    // Save to recent routes if completed or ended
    if (user && tripProgress > 10) {
      apiClient.post('/routes/recent', {
        source_name: activeRoute.origin,
        destination_name: activeRoute.destination,
        distance: activeRoute.distanceKm,
        duration: activeRoute.durationMin,
        travel_mode: travelMode,
      }).catch(() => {});
    }
    setTripProgress(0);
  };

  const toggleVoiceGuidance = () => {
    updateSettings({ voiceGuidance: !settings.voiceGuidance });
  };

  const toggleMonsterMode = () => {
    const nextVal = !telemetry.monsterModeActive;
    setTelemetry((prev) => ({ ...prev, monsterModeActive: nextVal }));
    updateSettings({ monsterRenderEngine: nextVal });
  };

  const routeToSavedPlace = (place: SavedPlace) => {
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
          // Complete trip
          if (user) {
            apiClient.post('/routes/recent', {
              source_name: activeRoute.origin,
              destination_name: activeRoute.destination,
              distance: activeRoute.distanceKm,
              duration: activeRoute.durationMin,
              travel_mode: travelMode,
            }).catch(() => {});
          }
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
  }, [navState, travelMode, user, activeRoute]);

  return (
    <NavContext.Provider
      value={{
        activeRoute,
        availableRoutes,
        setActiveRoute,
        selectRouteById,
        calculateBackendRoute,
        isCalculatingRoute,
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
