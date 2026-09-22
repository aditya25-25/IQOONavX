import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNav } from '../../context/NavContext';
import {
  X,
  Volume2,
  VolumeX,
  Zap,
  Layers,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  MapPin,
  Radio,
  Share2,
  Maximize2,
  Minimize2
} from 'lucide-react';

export const FullNavXModal: React.FC = () => {
  const {
    isFullNavAppOpen,
    setIsFullNavAppOpen,
    activeRoute,
    navState,
    startNavigation,
    pauseNavigation,
    stopNavigation,
    tripProgress,
    telemetry,
    settings,
    toggleVoiceGuidance,
    toggleMonsterMode,
    mapViewMode,
    setMapViewMode,
    setIsRouteDetailsOpen,
  } = useNav();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Cycle maneuvers as progress increases
  useEffect(() => {
    if (activeRoute.maneuvers.length === 0) return;
    const stepCount = activeRoute.maneuvers.length;
    const idx = Math.min(
      stepCount - 1,
      Math.floor((tripProgress / 100) * stepCount)
    );
    setCurrentStepIndex(idx);
  }, [tripProgress, activeRoute]);

  const activeManeuver = activeRoute.maneuvers[currentStepIndex] || activeRoute.maneuvers[0];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isFullNavAppOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl overflow-hidden">
        {/* Fullscreen Cockpit Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative w-full h-full max-w-[1600px] max-h-[1000px] p-2 sm:p-4 flex flex-col justify-between overflow-hidden"
        >
          {/* Top Bar / HUD Header */}
          <div className="relative z-20 flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-[#0F1117]/80 backdrop-blur-md border border-white/10 shadow-2xl">
            {/* Left: Brand & Route summary */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFC800] text-black font-black flex items-center justify-center text-sm shadow-glow-yellow-sm">
                X
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">IQOO NavX</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFC800]/15 text-[#FFC800] border border-[#FFC800]/30 font-bold uppercase">
                    LIVE DRIVE
                  </span>
                  {telemetry.monsterModeActive && (
                    <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold uppercase items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" /> 144Hz MONSTER
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#8E95A5] flex items-center gap-1 mt-0.5">
                  <span className="text-white font-medium">{activeRoute.destination}</span>
                  <span>•</span>
                  <span>{activeRoute.distanceKm} km remaining</span>
                </div>
              </div>
            </div>

            {/* Middle: Live telemetry indicators */}
            <div className="hidden md:flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[#8E95A5]">GPS Accuracy:</span>
                <span className="text-emerald-400 font-bold">{telemetry.gpsAccuracyMeters}m</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="text-[#8E95A5]">Satellites:</span>
                <span className="text-[#00F0FF] font-bold">{telemetry.satelliteCount} (L1+L5)</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                <Zap className="w-3.5 h-3.5 text-[#FFC800]" />
                <span className="text-[#8E95A5]">Render:</span>
                <span className="text-[#FFC800] font-bold">{telemetry.refreshRateHz} FPS</span>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoiceGuidance}
                className={`p-2.5 rounded-xl border transition-colors ${
                  settings.voiceGuidance
                    ? 'bg-[#FFC800]/10 border-[#FFC800]/40 text-[#FFC800]'
                    : 'bg-white/5 border-white/10 text-[#8E95A5]'
                }`}
                title="Toggle Voice Co-Pilot"
              >
                {settings.voiceGuidance ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#8E95A5] hover:text-white transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopNavigation();
                  setIsFullNavAppOpen(false);
                }}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:border-red-500/40 text-white transition-all border border-white/10"
                title="Exit NavX Live Drive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Map & Visual Cockpit */}
          <div className="relative flex-1 my-3 rounded-2xl overflow-hidden border border-white/10 bg-[#08090C] flex items-center justify-center">
            {/* Dynamic Map Vector Canvas Simulation */}
            <div className="absolute inset-0 bg-grid-pattern opacity-40" />

            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 pointer-events-none bg-radial-gradient opacity-60" />

            {/* Simulated 3D Road Perspective Container */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 1000 600"
                className={`w-full h-full transition-transform duration-700 ${
                  mapViewMode === '3D' ? 'scale-110 [transform:perspective(600px)_rotateX(25deg)]' : ''
                }`}
              >
                <defs>
                  {/* Glowing Route Gradient */}
                  <linearGradient id="routeGradientFull" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="50%" stopColor="#FFC800" />
                    <stop offset="100%" stopColor="#FF3B30" />
                  </linearGradient>

                  <filter id="glowGoldFull" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Secondary Grid Network / Roads */}
                <path d="M 0,300 L 1000,300" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <path d="M 150,0 L 150,600" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <path d="M 850,0 L 850,600" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <path d="M 200,600 C 400,450 600,450 800,600" stroke="rgba(255,255,255,0.04)" strokeWidth="12" fill="none" />
                <path d="M 0,150 Q 500,220 1000,150" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />

                {/* Primary High-Speed Expressway Route */}
                {/* Outer Glow Line */}
                <path
                  d="M 120,500 C 260,420 380,320 540,290 S 760,180 880,120"
                  fill="none"
                  stroke="rgba(255, 200, 0, 0.25)"
                  strokeWidth="24"
                  strokeLinecap="round"
                />
                {/* Core Glowing Track */}
                <path
                  d="M 120,500 C 260,420 380,320 540,290 S 760,180 880,120"
                  fill="none"
                  stroke="url(#routeGradientFull)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#glowGoldFull)"
                />
                {/* Animated Directional Arrows / Dash */}
                <path
                  d="M 120,500 C 260,420 380,320 540,290 S 760,180 880,120"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeDasharray="12 24"
                  className="animate-route-dash"
                />

                {/* Origin Marker */}
                <circle cx="120" cy="500" r="10" fill="#00F0FF" />
                <circle cx="120" cy="500" r="22" stroke="#00F0FF" strokeWidth="2" opacity="0.4" className="animate-ping-slow" />

                {/* Destination Arena Marker */}
                <g transform="translate(880, 120)">
                  <circle cx="0" cy="0" r="14" fill="#FFC800" />
                  <circle cx="0" cy="0" r="28" stroke="#FFC800" strokeWidth="2" opacity="0.5" className="animate-ping-slow" />
                  <text x="0" y="4" fill="#08090C" fontSize="12" fontWeight="bold" textAnchor="middle">★</text>
                </g>

                {/* Dynamic Vehicle Puck along curve according to tripProgress */}
                {(() => {
                  const t = tripProgress / 100;
                  // Approximate cubic bezier point calculation
                  const p0 = { x: 120, y: 500 };
                  const p1 = { x: 380, y: 320 };
                  const p2 = { x: 540, y: 290 };
                  const p3 = { x: 880, y: 120 };

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
                      {/* Vehicle Radar Aura */}
                      <circle cx="0" cy="0" r="30" fill="rgba(255, 200, 0, 0.15)" />
                      <circle cx="0" cy="0" r="18" fill="#08090C" stroke="#FFC800" strokeWidth="3" />
                      {/* Navigation Arrow */}
                      <polygon points="0,-10 8,8 0,4 -8,8" fill="#FFC800" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Floating Top Maneuver Overlay */}
            <div className="absolute top-4 left-4 z-20 max-w-sm w-full p-4 rounded-2xl bg-[#0F1117]/90 backdrop-blur-md border border-white/15 shadow-glass">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFC800] text-black flex items-center justify-center font-bold text-xl shadow-glow-yellow-sm">
                  ↱
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase text-[#FFC800] font-bold tracking-wider">
                    In {activeManeuver.distance}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {activeManeuver.instruction}
                  </h3>
                  <p className="text-xs text-[#8E95A5] font-mono">{activeManeuver.streetName}</p>
                </div>
              </div>

              {activeManeuver.laneInfo && (
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-mono text-[#8E95A5] mr-1">Lanes:</span>
                  {Array.from({ length: activeManeuver.laneInfo.totalLanes }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                        i === activeManeuver.laneInfo?.activeLaneIndex
                          ? 'bg-[#FFC800] text-black'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      ↑
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Floating Speedometer HUD */}
            <div className="absolute bottom-4 left-4 z-20 p-4 rounded-2xl bg-[#0F1117]/90 backdrop-blur-md border border-white/15 shadow-glass flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tighter">
                  {telemetry.currentSpeed}
                </div>
                <div className="text-[10px] uppercase font-mono text-[#8E95A5]">
                  {settings.speedUnit}
                </div>
              </div>

              <div className="h-10 w-[1px] bg-white/10" />

              {/* Speed limit badge */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full border-2 border-red-500 bg-white flex items-center justify-center font-black font-mono text-black text-xs">
                  {telemetry.speedLimit}
                </div>
                <span className="text-[9px] font-mono text-[#8E95A5] mt-0.5">LIMIT</span>
              </div>
            </div>

            {/* Layer & Perspective Controls Right Floating Bar */}
            <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setMapViewMode(mapViewMode === '3D' ? '2D' : '3D')}
                className={`p-3 rounded-xl border backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  mapViewMode === '3D'
                    ? 'bg-[#FFC800] text-black border-[#FFC800]'
                    : 'bg-[#0F1117]/90 text-white border-white/15 hover:border-white/30'
                }`}
                title="Toggle 2D / 3D Perspective"
              >
                <Layers className="w-4 h-4" /> {mapViewMode}
              </button>

              <button
                type="button"
                onClick={toggleMonsterMode}
                className={`p-3 rounded-xl border backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  telemetry.monsterModeActive
                    ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/30'
                    : 'bg-[#0F1117]/90 text-white border-white/15'
                }`}
                title="Toggle Monster Turbo Engine"
              >
                <Zap className="w-4 h-4" /> BOOST
              </button>

              <button
                type="button"
                onClick={() => setIsRouteDetailsOpen(true)}
                className="p-3 rounded-xl bg-[#0F1117]/90 border border-white/15 text-[#8E95A5] hover:text-white backdrop-blur-md transition-colors"
                title="Full Route Details"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Cockpit Control Bar */}
          <div className="relative z-20 p-4 rounded-2xl bg-[#0F1117]/90 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Trip Progress Line */}
            <div className="w-full sm:flex-1">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFC800]" /> {activeRoute.origin}
                </span>
                <span className="text-[#FFC800] font-bold">{Math.round(tripProgress)}% COMPLETED</span>
                <span className="text-white font-bold">{activeRoute.destination}</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00F0FF] via-[#FFC800] to-emerald-400 transition-all duration-300"
                  style={{ width: `${tripProgress}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              {navState === 'navigating' ? (
                <button
                  type="button"
                  onClick={pauseNavigation}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Pause className="w-4 h-4 text-[#FFC800]" /> Pause Simulation
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startNavigation}
                  className="py-2.5 px-5 rounded-xl bg-[#FFC800] hover:bg-[#FFE043] text-black font-bold text-xs flex items-center gap-2 transition-all shadow-glow-yellow-sm"
                >
                  <Play className="w-4 h-4 fill-current" /> {tripProgress > 0 ? 'Resume Drive' : 'Start Drive'}
                </button>
              )}

              <button
                type="button"
                onClick={stopNavigation}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E95A5] hover:text-white transition-colors"
                title="Reset Route"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => alert('Trip telemetry link copied to clipboard!')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E95A5] hover:text-white transition-colors"
                title="Share Live Telemetry"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
