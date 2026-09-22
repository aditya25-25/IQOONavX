import React from 'react';
import { Modal } from '../common/Modal';
import { useNav } from '../../context/NavContext';
import { RECENT_ROUTES } from '../../data/mockNavigation';
import { Clock, Gauge, Route, Zap, Car, Footprints } from 'lucide-react';

export const RecentRoutesModal: React.FC = () => {
  const { isRecentRoutesOpen, setIsRecentRoutesOpen, selectRouteById } = useNav();

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
        {RECENT_ROUTES.map((trip) => (
          <div
            key={trip.id}
            onClick={() => {
              selectRouteById('route-monster-fast');
              setIsRecentRoutesOpen(false);
            }}
            className="p-4 rounded-xl bg-[#161922] border border-white/5 hover:border-[#FFC800]/40 transition-all cursor-pointer group"
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

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#8E95A5] uppercase">
                {trip.mode} mode
              </span>
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
        ))}

        <div className="text-center pt-2">
          <p className="text-[11px] text-[#8E95A5] font-mono">
            Encrypted local telemetry cache • Synced with iQOO Monster Engine
          </p>
        </div>
      </div>
    </Modal>
  );
};
