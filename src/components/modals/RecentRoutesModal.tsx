import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { useNav } from '../../context/NavContext';
import { useAuth } from '../../context/AuthContext';
import { RECENT_ROUTES } from '../../data/mockNavigation';
import { RecentRoute, TravelMode } from '../../types/navigation';
import { apiClient } from '../../services/apiClient';
import { Clock, Gauge, Route, Zap, Car, Footprints, Trash2, Loader2, AlertCircle } from 'lucide-react';

export const RecentRoutesModal: React.FC = () => {
  const { isRecentRoutesOpen, setIsRecentRoutesOpen, selectRouteById } = useNav();
  const { user } = useAuth();

  const [routes, setRoutes] = useState<RecentRoute[]>(RECENT_ROUTES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapBackendRoute = (br: any): RecentRoute => {
    const formatTime = (iso: string) => {
      try {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } catch {
        return 'Recently';
      }
    };

    const dist = +(br.distance || 10).toFixed(1);
    const dur = Math.max(1, Math.round(br.duration || 15));
    const avgSpeed = Math.round((dist / (dur / 60)) || 50);

    return {
      id: br.id,
      title: `${br.source_name} → ${br.destination_name}`,
      timestamp: br.created_at ? formatTime(br.created_at) : 'Just now',
      distanceKm: dist,
      durationMin: dur,
      avgSpeedKmh: avgSpeed,
      mode: (br.travel_mode as TravelMode) || 'car',
    };
  };

  const fetchRecentRoutes = useCallback(async () => {
    if (!user) {
      setRoutes(RECENT_ROUTES);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<any[]>('/routes/recent');
      if (Array.isArray(data) && data.length > 0) {
        setRoutes(data.map(mapBackendRoute));
      } else {
        setRoutes([]);
      }
    } catch (err: any) {
      console.warn('Could not fetch recent routes from backend, using fallback cache:', err.message);
      setRoutes(RECENT_ROUTES);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isRecentRoutesOpen) {
      fetchRecentRoutes();
    }
  }, [isRecentRoutesOpen, fetchRecentRoutes]);

  const handleDeleteRoute = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (user && !id.startsWith('rr-')) {
        await apiClient.delete(`/routes/recent/${id}`);
      }
      setRoutes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete route log.');
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'monster':
        return <Zap className="w-4 h-4 text-[#FFC800]" />;
      case 'walk':
        return <Footprints className="w-4 h-4 text-emerald-400" />;
      default:
        return <Car className="w-4 h-4 text-[#00F0FF]" />;
    }
  };

  return (
    <Modal
      isOpen={isRecentRoutesOpen}
      onClose={() => setIsRecentRoutesOpen(false)}
      title="Recent NavX Telemetry & Trips"
      subtitle="Historical telemetry, speed logs and route efficiency"
      maxWidth="lg"
    >
      <div className="space-y-3">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-[#8E95A5]">
            <Loader2 className="w-6 h-6 animate-spin text-[#FFC800]" />
            <span>Loading telemetry history from Supabase...</span>
          </div>
        ) : routes.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#8E95A5] border border-dashed border-white/10 rounded-xl p-6">
            <p className="font-semibold text-white mb-1">No recent trips recorded.</p>
            <p>Complete a navigation session to automatically log telemetry and corridor efficiency.</p>
          </div>
        ) : (
          routes.map((trip) => (
            <div
              key={trip.id}
              onClick={() => {
                selectRouteById('route-monster-fast');
                setIsRecentRoutesOpen(false);
              }}
              className="p-4 rounded-xl bg-[#161922] border border-white/5 hover:border-[#FFC800]/40 transition-all cursor-pointer group relative"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#08090C] border border-white/10">
                    {getModeIcon(trip.mode)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FFC800] transition-colors">
                      {trip.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-[#8E95A5] mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{trip.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#8E95A5] uppercase">
                    {trip.mode} mode
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteRoute(trip.id, e)}
                    className="p-1.5 rounded-lg bg-white/5 text-[#8E95A5] hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="Delete Trip Log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5 text-center">
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#8E95A5]">Distance</div>
                  <div className="text-xs font-bold font-mono text-white flex items-center justify-center gap-1">
                    <Route className="w-3 h-3 text-[#FFC800]" /> {trip.distanceKm} km
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#8E95A5]">Duration</div>
                  <div className="text-xs font-bold font-mono text-white">{trip.durationMin} mins</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#8E95A5]">Avg Velocity</div>
                  <div className="text-xs font-bold font-mono text-[#00F0FF] flex items-center justify-center gap-1">
                    <Gauge className="w-3 h-3" /> {trip.avgSpeedKmh} km/h
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="text-center pt-2">
          <p className="text-[11px] text-[#8E95A5] font-mono">
            Encrypted Supabase Telemetry Sync • iQOO Matrix Route Engine
          </p>
        </div>
      </div>
    </Modal>
  );
};
