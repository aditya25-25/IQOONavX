import React from 'react';
import { Modal } from '../common/Modal';
import { useNav } from '../../context/NavContext';
import { Navigation, Clock, ShieldCheck, ArrowRight, CornerDownRight, MoveUp, MapPin } from 'lucide-react';

export const RouteDetailsModal: React.FC = () => {
  const { isRouteDetailsOpen, setIsRouteDetailsOpen, activeRoute, startNavigation } = useNav();

  const getManeuverIcon = (type: string) => {
    switch (type) {
      case 'turn-right':
      case 'slight-right':
        return <CornerDownRight className="w-4 h-4 text-[#FFC800]" />;
      case 'turn-left':
      case 'slight-left':
        return <CornerDownRight className="w-4 h-4 text-[#FFC800] -scale-x-100" />;
      case 'destination':
        return <MapPin className="w-4 h-4 text-emerald-400" />;
      default:
        return <MoveUp className="w-4 h-4 text-[#00F0FF]" />;
    }
  };

  return (
    <Modal
      isOpen={isRouteDetailsOpen}
      onClose={() => setIsRouteDetailsOpen(false)}
      title="Route Profile & Turn-by-Turn Guidance"
      subtitle={`${activeRoute.name} • ${activeRoute.distanceKm} km • ${activeRoute.durationMin} mins`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Origin to Destination Bar */}
        <div className="p-4 rounded-xl bg-[#161922] border border-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00F0FF] ring-4 ring-[#00F0FF]/20 shrink-0" />
            <div className="text-xs">
              <span className="text-[#8E95A5] uppercase font-mono block text-[10px]">Start Location</span>
              <span className="text-white font-medium">{activeRoute.origin}</span>
            </div>
          </div>
          <div className="ml-1.5 h-4 border-l border-dashed border-white/20" />
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#FFC800] ring-4 ring-[#FFC800]/20 shrink-0" />
            <div className="text-xs">
              <span className="text-[#8E95A5] uppercase font-mono block text-[10px]">Destination Target</span>
              <span className="text-white font-bold">{activeRoute.destination}</span>
            </div>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-xl bg-[#161922] border border-white/5">
            <div className="text-[10px] text-[#8E95A5] uppercase font-mono">Estimated ETA</div>
            <div className="text-base font-bold font-mono text-white flex items-center justify-center gap-1 mt-0.5">
              <Clock className="w-4 h-4 text-[#FFC800]" /> {activeRoute.eta}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#161922] border border-white/5">
            <div className="text-[10px] text-[#8E95A5] uppercase font-mono">Traffic Flow</div>
            <div className="text-xs font-bold font-mono text-emerald-400 capitalize flex items-center justify-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {activeRoute.trafficLevel}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#161922] border border-white/5">
            <div className="text-[10px] text-[#8E95A5] uppercase font-mono">Efficiency</div>
            <div className="text-xs font-bold font-mono text-[#00F0FF] mt-1">
              {activeRoute.energyScore}%
            </div>
          </div>
        </div>

        {/* Turn by turn maneuvers list */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E95A5] mb-2.5">
            Itinerary Maneuvers ({activeRoute.maneuvers.length} steps)
          </h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {activeRoute.maneuvers.map((m) => (
              <div key={m.id} className="p-2.5 rounded-lg bg-[#08090C] border border-white/5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#161922] border border-white/10 flex items-center justify-center shrink-0">
                  {getManeuverIcon(m.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{m.instruction}</p>
                  <span className="text-[10px] text-[#8E95A5] font-mono">{m.streetName}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#FFC800] shrink-0">{m.distance}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setIsRouteDetailsOpen(false);
              startNavigation();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#FFC800] hover:bg-[#FFE043] text-black font-bold text-sm tracking-wide transition-all shadow-glow-yellow-sm flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" /> Start Drive Along This Route <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
