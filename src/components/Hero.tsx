import React from 'react';
import { HeroMapVisual } from './HeroMapVisual';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavContext';
import { Zap, Car, Bike, ArrowRight, ShieldCheck } from 'lucide-react';
import { TravelMode } from '../types/navigation';

export const Hero: React.FC = () => {
  const { openAuthModal, user } = useAuth();
  const {
    setIsFullNavAppOpen,
    travelMode,
    setTravelMode,
    telemetry,
  } = useNav();

  const modes: { id: TravelMode; label: string; icon: React.ReactNode }[] = [
    { id: 'monster', label: 'Monster Boost', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'car', label: 'Automotive', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'bike', label: 'Two-Wheeler', icon: <Bike className="w-3.5 h-3.5" /> },
  ];

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial-gradient pointer-events-none opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Minimal Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Ecosystem badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161922] border border-white/10 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FFC800] animate-pulse" />
            <span className="text-[11px] font-mono font-semibold tracking-wider text-[#8E95A5] uppercase">
              Engineered for iQOO Performance Architecture
            </span>
            <span className="text-[10px] font-mono font-bold text-[#FFC800] bg-[#FFC800]/10 px-1.5 py-0.5 rounded border border-[#FFC800]/25">
              144Hz
            </span>
          </div>

          {/* Punchy Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
            IQOO <span className="text-gradient-gold">NavX</span>
          </h1>

          {/* Minimal 3-word core punchline */}
          <p className="mt-4 text-lg sm:text-2xl font-bold tracking-tight text-white/90">
            Precision. Speed. Your route.
          </p>

          <p className="mt-2 text-xs sm:text-sm font-mono text-[#8E95A5]">
            Sub-meter GPS telemetry • Snapdragon GPU acceleration • Real-time traffic matrix
          </p>

          {/* Minimal Action Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsFullNavAppOpen(true)}
              className="py-3 px-6 sm:px-8 rounded-xl bg-[#FFC800] hover:bg-[#FFE043] text-black font-bold text-sm tracking-wide transition-all shadow-glow-yellow hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Explore NavX</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!user?.isLoggedIn ? (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="py-3 px-6 rounded-xl bg-[#161922] hover:bg-[#1E2330] border border-white/10 hover:border-white/20 text-white font-semibold text-sm transition-all"
              >
                Sign In
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsFullNavAppOpen(true)}
                className="py-3 px-6 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-sm flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Pilot Connected
              </button>
            )}
          </div>

          {/* Mode Selector Pill */}
          <div className="mt-8 inline-flex p-1 rounded-2xl bg-[#0F1117] border border-white/10">
            {modes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setTravelMode(m.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  travelMode === m.id
                    ? 'bg-[#FFC800] text-black font-bold shadow-sm'
                    : 'text-[#8E95A5] hover:text-white'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Dominant Map Visual */}
        <div className="relative mx-auto max-w-5xl">
          <HeroMapVisual />
        </div>

        {/* Telemetry Micro-Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto text-center">
          <div className="p-3 rounded-xl bg-[#0F1117] border border-white/5">
            <span className="text-[10px] uppercase font-mono text-[#8E95A5] block">GPS Latency</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400">4.2 ms (Zero Lag)</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0F1117] border border-white/5">
            <span className="text-[10px] uppercase font-mono text-[#8E95A5] block">Engine Refresh</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-[#FFC800]">{telemetry.refreshRateHz} Hz Native</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0F1117] border border-white/5">
            <span className="text-[10px] uppercase font-mono text-[#8E95A5] block">Dual-Band Sat</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-white">L1 + L5 Carrier</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0F1117] border border-white/5">
            <span className="text-[10px] uppercase font-mono text-[#8E95A5] block">Thermals</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-[#00F0FF]">{telemetry.socThermalTempC}°C Nominal</span>
          </div>
        </div>
      </div>
    </section>
  );
};
