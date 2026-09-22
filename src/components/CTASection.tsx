import React from 'react';
import { useNav } from '../context/NavContext';
import { Zap, ArrowRight } from 'lucide-react';

export const CTASection: React.FC = () => {
  const { setIsFullNavAppOpen } = useNav();

  return (
    <section className="py-20 md:py-28 bg-[#08090C] border-t border-white/5 relative overflow-hidden text-center">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFC800]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-white/10 text-xs font-mono text-[#FFC800] mb-6">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Next-Gen iQOO Navigation</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          IQOO <span className="text-gradient-gold">NavX</span>
        </h2>

        <p className="mt-4 text-xl sm:text-2xl font-bold text-white/90">
          Ready when you are.
        </p>

        <p className="mt-2 text-xs sm:text-sm font-mono text-[#8E95A5] max-w-md mx-auto">
          Start your high-precision journey with 144Hz vector mapping and sub-meter positioning.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setIsFullNavAppOpen(true)}
            className="py-3.5 px-8 rounded-2xl bg-[#FFC800] hover:bg-[#FFE043] text-black font-extrabold text-sm tracking-wide transition-all shadow-glow-yellow hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2.5"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Launch NavX</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
