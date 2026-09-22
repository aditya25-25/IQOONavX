import React from 'react';
import { useNav } from '../context/NavContext';
import {
  Clock,
  Zap,
  MapPin,
  Play,
  Pause,
  Compass,
  Volume2,
  VolumeX,
  ShieldAlert,
  Navigation,
} from 'lucide-react';

export const HeroMapVisual: React.FC = () => {
  const {
    activeRoute,
    navState,
    startNavigation,
    pauseNavigation,
    tripProgress,
    telemetry,
    settings,
    toggleVoiceGuidance,
    toggleMonsterMode,
    setIsFullNavAppOpen,
    setIsRouteDetailsOpen,
  } = useNav();

  const currentStep = activeRoute.maneuvers[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-[#0A0C10] shadow-glass group">
      {/* Background Grid & Cyber Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#FFC800]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Vector Map Canvas Visual */}
      <div className="relative h-[380px] sm:h-[460px] md:h-[500px] w-full flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 900 520"
          className="w-full h-full object-cover [transform:perspective(800px)_rotateX(15deg)_scale(1.05)] transition-transform duration-700 group-hover:scale-110"
        >
          <defs>
            <linearGradient id="heroRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="60%" stopColor="#FFC800" />
              <stop offset="100%" stopColor="#FF5500" />
            </linearGradient>

            <filter id="heroGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Secondary road network */}
          <path d="M 0,260 L 900,260" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <path d="M 220,0 L 220,520" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <path d="M 680,0 L 680,520" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <path d="M 100,500 C 300,380 500,400 800,480" stroke="rgba(255,255,255,0.04)" strokeWidth="8" fill="none" />
          <path d="M 50,120 Q 450,180 850,80" stroke="rgba(255,255,255,0.04)" strokeWidth="8" fill="none" />

          {/* District Zones */}
          <rect x="250" y="80" width="140" height="90" rx="8" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.03)" />
          <text x="320" y="130" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="monospace" textAnchor="middle">CYBER HUB</text>

          <rect x="520" y="320" width="160" height="100" rx="8" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.03)" />
          <text x="600" y="375" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="monospace" textAnchor="middle">iQOO MATRIX PARK</text>

          {/* Glowing Route Trace */}
          <path
            d="M 120,440 C 260,370 360,260 520,240 S 720,160 800,90"
            fill="none"
            stroke="rgba(255,200,0,0.2)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 120,440 C 260,370 360,260 520,240 S 720,160 800,90"
            fill="none"
            stroke="url(#heroRouteGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#heroGlow)"
          />
          {/* Animated dashes */}
          <path
            d="M 120,440 C 260,370 360,260 520,240 S 720,160 800,90"
            fill="none"
            stroke="#FFF"
            strokeWidth="2.5"
            strokeDasharray="10 20"
            className="animate-route-dash"
          />

          {/* Origin Marker */}
          <g transform="translate(120, 440)">
            <circle cx="0" cy="0" r="14" fill="#00F0FF" opacity="0.3" className="animate-ping-slow" />
            <circle cx="0" cy="0" r="7" fill="#00F0FF" />
            <circle cx="0" cy="0" r="3" fill="#08090C" />
          </g>

          {/* Destination Marker */}
          <g transform="translate(800, 90)">
            <circle cx="0" cy="0" r="18" fill="#FFC800" opacity="0.4" className="animate-ping-slow" />
            <circle cx="0" cy="0" r="9" fill="#FFC800" />
            <circle cx="0" cy="0" r="4" fill="#08090C" />
          </g>

          {/* Dynamic Car Navigation Puck */}
          {(() => {
            const t = tripProgress / 100;
            const p0 = { x: 120, y: 440 };
            const p1 = { x: 360, y: 260 };
            const p2 = { x: 520, y: 240 };
            const p3 = { x: 800, y: 90 };

            const cx = 3 * (p1.x - p0.x);
            const bx = 3 * (p2.x - p1.x) - cx;
            const ax = p3.x - p0.x - cx - bx;

            const cy = 3 * (p1.y - p0.y);
            const by = 3 * (p2.y - p1.y) - cy;
            const ay = p3.y - p0.y - cy - by;

            const posX = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
            const posY = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;

            return (
              <g transform={`translate(${posX}, ${posY})`}>
                <circle cx="0" cy="0" r="24" fill="rgba(255, 200, 0, 0.2)" />
                <circle cx="0" cy="0" r="14" fill="#08090C" stroke="#FFC800" strokeWidth="2.5" />
                <polygon points="0,-8 6,6 0,3 -6,6" fill="#FFC800" />
              </g>
            );
          })()}
        </svg>

        {/* Floating Maneuver Turn HUD (Top Left) */}
        <div className="absolute top-4 left-4 max-w-[240px] sm:max-w-xs p-3.5 rounded-2xl bg-[#0F1117]/85 backdrop-blur-md border border-white/15 shadow-glass">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC800] text-black font-extrabold flex items-center justify-center text-lg shrink-0 shadow-glow-yellow-sm">
              ↱
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-[#FFC800] uppercase">
                In {currentStep.distance}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                {currentStep.instruction}
              </h4>
              <p className="text-[10px] text-[#8E95A5] font-mono">{currentStep.streetName}</p>
            </div>
          </div>
        </div>

        {/* Floating Live Telemetry HUD (Bottom Left) */}
        <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-[#0F1117]/85 backdrop-blur-md border border-white/15 shadow-glass flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {telemetry.currentSpeed}
            </div>
            <div className="text-[9px] font-mono text-[#8E95A5] uppercase">
              {settings.speedUnit}
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          {/* Dual GPS Sat Indicator */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>L1+L5 GPS: {telemetry.gpsAccuracyMeters}m</span>
            </div>
            <div className="text-[10px] font-mono text-[#8E95A5]">
              Rate: <span className="text-[#FFC800] font-bold">{telemetry.refreshRateHz}Hz</span>
            </div>
          </div>
        </div>

        {/* Floating Route Info / Destination Pill (Top Right) */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0F1117]/85 backdrop-blur-md border border-white/15 shadow-glass text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs text-white font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#FFC800]" />
              <span className="truncate max-w-[140px] sm:max-w-[180px]">{activeRoute.destination}</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-[11px] font-mono text-[#8E95A5] mt-0.5">
              <span className="text-white font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#FFC800]" /> {activeRoute.eta}
              </span>
              <span>•</span>
              <span>{activeRoute.distanceKm} km</span>
            </div>
          </div>

          {/* Quick Boost Toggle */}
          <button
            type="button"
            onClick={toggleMonsterMode}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              telemetry.monsterModeActive
                ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/10'
                : 'bg-[#0F1117]/80 text-[#8E95A5] border-white/10'
            }`}
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>{telemetry.monsterModeActive ? 'MONSTER ACTIVE' : 'STANDARD'}</span>
          </button>
        </div>

        {/* Action Bar Floating (Bottom Right) */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleVoiceGuidance}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-colors ${
              settings.voiceGuidance
                ? 'bg-[#FFC800]/15 border-[#FFC800]/40 text-[#FFC800]'
                : 'bg-[#0F1117]/85 border-white/10 text-[#8E95A5]'
            }`}
            title="Voice guidance"
          >
            {settings.voiceGuidance ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {navState === 'navigating' ? (
            <button
              type="button"
              onClick={pauseNavigation}
              className="py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-md transition-colors"
            >
              <Pause className="w-3.5 h-3.5 text-[#FFC800]" /> Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={startNavigation}
              className="py-2.5 px-4 rounded-xl bg-[#FFC800] hover:bg-[#FFE043] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-yellow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-black" /> Simulate Drive
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsFullNavAppOpen(true)}
            className="p-2.5 rounded-xl bg-[#161922] hover:bg-[#1E2330] border border-white/15 text-[#FFC800] backdrop-blur-md transition-colors"
            title="Expand into Cockpit mode"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Summary Strip */}
      <div className="px-5 py-3 bg-[#0E1015] border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#8E95A5] font-mono">Live Route:</span>
          <span className="font-semibold text-white">{activeRoute.name}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[10px]">
            {activeRoute.trafficLevel.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsRouteDetailsOpen(true)}
            className="text-xs text-[#FFC800] hover:underline flex items-center gap-1 font-semibold"
          >
            <Compass className="w-3.5 h-3.5" /> View Route Itinerary
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#8E95A5]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>AI Reroute Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
