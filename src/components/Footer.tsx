import React from 'react';
import { BrandLogo } from './common/BrandLogo';
import { useNav } from '../context/NavContext';
import { Compass, Bookmark, History, Settings } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setIsSavedPlacesOpen,
    setIsRecentRoutesOpen,
    setIsSettingsOpen,
    setIsFullNavAppOpen,
  } = useNav();

  return (
    <footer className="bg-[#050608] border-t border-white/5 py-12 text-[#8E95A5] text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <BrandLogo size="sm" showSubtext />
          <p className="text-[11px] text-[#5B6275]">
            Hackathon prototype concept engineered for the iQOO smartphone ecosystem.
          </p>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setIsFullNavAppOpen(true)}
            className="hover:text-[#FFC800] transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" /> Cockpit
          </button>
          <button
            type="button"
            onClick={() => setIsSavedPlacesOpen(true)}
            className="hover:text-[#FFC800] transition-colors flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5" /> Saved Places
          </button>
          <button
            type="button"
            onClick={() => setIsRecentRoutesOpen(true)}
            className="hover:text-[#FFC800] transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" /> Telemetry
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-[#FFC800] transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>

        <div className="text-center md:text-right text-[10px] text-[#5B6275]">
          <div>Branch: <span className="text-white">Frontend</span> • Build: <span className="text-emerald-400 font-bold">PROTOTYPE READY</span></div>
          <div className="mt-0.5">© 2026 iQOO NavX Project</div>
        </div>
      </div>
    </footer>
  );
};
