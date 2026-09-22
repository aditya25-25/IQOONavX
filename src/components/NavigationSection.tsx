import React from 'react';
import { useNav } from '../context/NavContext';
import { MOCK_ROUTES } from '../data/mockNavigation';
import {
  Route,
  Navigation,
  Clock,
  Zap,
  Leaf,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const NavigationSection: React.FC = () => {
  const {
    activeRoute,
    setActiveRoute,
    startNavigation,
    navState,
    settings,
    toggleVoiceGuidance,
    setIsRouteDetailsOpen,
    setIsFullNavAppOpen,
  } = useNav();

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'Fastest':
        return <Zap className="w-3.5 h-3.5 text-[#FFC800]" />;
      case 'Eco':
        return <Leaf className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Route className="w-3.5 h-3.5 text-[#00F0FF]" />;
    }
  };

  return (
    <section id="preview" className="py-16 md:py-24 border-t border-white/5 bg-[#08090C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFC800] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Matrix Route Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Adaptive Live Navigation
            </h2>
            <p className="text-xs sm:text-sm text-[#8E95A5] mt-1 font-mono">
              Compare AI-calculated corridors and launch low-latency vector routing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleVoiceGuidance}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors ${
                settings.voiceGuidance
                  ? 'bg-[#FFC800]/10 border-[#FFC800]/30 text-[#FFC800]'
                  : 'bg-[#161922] border-white/10 text-[#8E95A5]'
              }`}
            >
              {settings.voiceGuidance ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>Voice Co-Pilot {settings.voiceGuidance ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullNavAppOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#161922] hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-[#00F0FF]" /> Fullscreen Cockpit
            </button>
          </div>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_ROUTES.map((route) => {
            const isSelected = activeRoute.id === route.id;

            return (
              <div
                key={route.id}
                onClick={() => setActiveRoute(route)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1A1E29] to-[#0F1117] border-[#FFC800] shadow-glow-yellow-sm scale-[1.02]'
                    : 'bg-[#0E1015] border-white/5 hover:border-white/20 hover:bg-[#141720]'
                }`}
              >
                {/* Top Row: Badge & Traffic */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
                      isSelected
                        ? 'bg-[#FFC800] text-black border-[#FFC800]'
                        : 'bg-white/5 text-[#8E95A5] border-white/10'
                    }`}
                  >
                    {getBadgeIcon(route.badge)}
                    <span>{route.badge}</span>
                  </span>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="capitalize">{route.trafficLevel} Flow</span>
                  </div>
                </div>

                {/* Route Name & Destination */}
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#FFC800]">
                  {route.name}
                </h3>
                <p className="text-xs text-[#8E95A5] font-mono mb-4">
                  {route.origin} → {route.destination}
                </p>

                {/* Main Stats Row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-center my-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8E95A5] block">Duration</span>
                    <span className="text-sm font-black font-mono text-white flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FFC800]" /> {route.durationMin}m
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8E95A5] block">Distance</span>
                    <span className="text-sm font-black font-mono text-white">
                      {route.distanceKm} km
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8E95A5] block">ETA</span>
                    <span className="text-sm font-black font-mono text-[#00F0FF]">
                      {route.eta}
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRoute(route);
                      setIsRouteDetailsOpen(true);
                    }}
                    className="text-xs text-[#8E95A5] hover:text-white font-mono flex items-center gap-1"
                  >
                    Maneuvers ({route.maneuvers.length}) <ChevronRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRoute(route);
                      startNavigation();
                    }}
                    className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected && navState === 'navigating'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-[#FFC800] hover:bg-[#FFE043] text-black shadow-sm'
                    }`}
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{isSelected && navState === 'navigating' ? 'Navigating' : 'Select'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
