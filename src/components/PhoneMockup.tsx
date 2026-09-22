import React from 'react';
import { useNav } from '../context/NavContext';
import {
  Volume2,
  VolumeX,
  Zap,
  Play,
  Pause,
  Compass,
  Clock,
  Sparkles,
  Signal,
  Wifi,
  Battery
} from 'lucide-react';

export const PhoneMockup: React.FC = () => {
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
  } = useNav();

  return (
    <section id="mockup" className="py-16 md:py-24 bg-[#08090C] border-t border-white/5 relative overflow-hidden">
      {/* Glow Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFC800]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text / Specs Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-white/10 text-xs font-mono text-[#FFC800]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flagship Device Integration</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Native Experience on <span className="text-gradient-gold">iQOO Devices</span>
            </h2>

            <p className="text-sm text-[#8E95A5] leading-relaxed">
              Engineered exclusively for iQOO's high refresh rate AMOLED displays and Snapdragon thermal architecture.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#0F1117] border border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-white">Dynamic 144Hz Vector Frame Pacing</span>
                <span className="text-xs font-mono font-bold text-[#FFC800]">Active</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0F1117] border border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-white">Snapdragon L1+L5 Dual GNSS</span>
                <span className="text-xs font-mono font-bold text-emerald-400">0.4m Sub-Meter</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0F1117] border border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-white">Monster Vapor Chamber Thermal Guard</span>
                <span className="text-xs font-mono font-bold text-[#00F0FF]">Optimal</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsFullNavAppOpen(true)}
                className="py-3 px-6 rounded-xl bg-[#161922] hover:bg-[#1E2330] border border-[#FFC800]/40 text-[#FFC800] font-bold text-xs tracking-wider uppercase font-mono transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4" /> Open Cockpit Simulator
              </button>
            </div>
          </div>

          {/* Right Phone Mockup Container */}
          <div className="lg:col-span-7 flex justify-center">
            {/* Realistic Smartphone Chassis */}
            <div className="relative w-[310px] sm:w-[350px] h-[640px] sm:h-[680px] bg-[#12141A] rounded-[48px] p-3 shadow-phone border-[4px] border-[#2A2E3B] ring-1 ring-white/10">
              {/* Phone Side Buttons */}
              <div className="absolute -left-[7px] top-28 w-[4px] h-12 bg-[#2A2E3B] rounded-l" />
              <div className="absolute -left-[7px] top-44 w-[4px] h-12 bg-[#2A2E3B] rounded-l" />
              <div className="absolute -right-[7px] top-32 w-[4px] h-16 bg-[#FFC800] rounded-r opacity-90 shadow-sm" />

              {/* Inner Bezel Screen */}
              <div className="relative w-full h-full bg-[#08090C] rounded-[38px] overflow-hidden flex flex-col justify-between border border-white/10">
                {/* Punch-hole camera & top notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full border border-white/20 z-30" />

                {/* Status Bar */}
                <div className="relative z-20 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-mono text-white/90">
                  <span>17:34</span>
                  <div className="flex items-center gap-1.5 text-white/80">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Simulated In-Phone Navigation App Screen */}
                <div className="relative flex-1 px-3 py-2 flex flex-col justify-between overflow-hidden">
                  {/* Top Maneuver HUD inside Phone */}
                  <div className="relative z-20 p-3 rounded-2xl bg-[#0F1117]/90 backdrop-blur-md border border-white/10 shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FFC800] text-black font-extrabold flex items-center justify-center text-sm shrink-0">
                        ↱
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] font-mono text-[#FFC800] font-bold uppercase">
                          In 400 m
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          iQOO Monster Arena
                        </div>
                        <div className="text-[10px] text-[#8E95A5] font-mono truncate">
                          HyperFlow Expressway
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Map Center SVG Visual */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                    <svg viewBox="0 0 350 500" className="w-full h-full">
                      {/* Roads */}
                      <path d="M 0,250 L 350,250" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                      <path d="M 120,0 L 120,500" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                      <path d="M 260,0 L 260,500" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                      {/* Active Route Curve */}
                      <path
                        d="M 60,420 C 140,350 180,240 280,120"
                        fill="none"
                        stroke="rgba(255,200,0,0.2)"
                        strokeWidth="16"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 60,420 C 140,350 180,240 280,120"
                        fill="none"
                        stroke="#FFC800"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 60,420 C 140,350 180,240 280,120"
                        fill="none"
                        stroke="#FFF"
                        strokeWidth="2"
                        strokeDasharray="6 12"
                        className="animate-route-dash"
                      />

                      {/* Origin & Destination */}
                      <circle cx="60" cy="420" r="6" fill="#00F0FF" />
                      <circle cx="280" cy="120" r="7" fill="#FFC800" />

                      {/* Animated Car Puck in phone */}
                      {(() => {
                        const t = tripProgress / 100;
                        const posX = 60 + t * (280 - 60);
                        const posY = 420 - t * (420 - 120);
                        return (
                          <g transform={`translate(${posX}, ${posY})`}>
                            <circle cx="0" cy="0" r="10" fill="#08090C" stroke="#FFC800" strokeWidth="2" />
                            <polygon points="0,-5 4,4 0,2 -4,4" fill="#FFC800" />
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Phone Speedometer Widget */}
                  <div className="relative z-20 self-start p-2.5 rounded-xl bg-[#0F1117]/90 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <div className="text-xl font-black font-mono text-white">
                      {telemetry.currentSpeed}
                    </div>
                    <div className="text-[9px] font-mono text-[#8E95A5] uppercase">
                      KM/H
                    </div>
                  </div>

                  {/* Phone Bottom Control Bar */}
                  <div className="relative z-20 p-3 rounded-2xl bg-[#0F1117]/95 backdrop-blur-md border border-white/10 shadow-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FFC800]" /> {activeRoute.eta}
                        </div>
                        <div className="text-[10px] text-[#8E95A5] font-mono">
                          {activeRoute.distanceKm} km • {activeRoute.durationMin} min
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={toggleVoiceGuidance}
                          className="p-1.5 rounded-lg bg-white/5 text-[#FFC800]"
                        >
                          {settings.voiceGuidance ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={toggleMonsterMode}
                          className={`p-1.5 rounded-lg text-xs font-mono font-bold ${
                            telemetry.monsterModeActive ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 flex gap-2">
                      {navState === 'navigating' ? (
                        <button
                          type="button"
                          onClick={pauseNavigation}
                          className="w-full py-1.5 rounded-lg bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <Pause className="w-3 h-3 text-[#FFC800]" /> Pause
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startNavigation}
                          className="w-full py-1.5 rounded-lg bg-[#FFC800] text-black font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Play className="w-3 h-3 fill-black" /> Drive
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Home Indicator bar */}
                <div className="relative z-20 pb-2 flex justify-center">
                  <div className="w-28 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
