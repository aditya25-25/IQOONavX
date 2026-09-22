import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showSubtext = false }) => {
  const textSize = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  const badgeSize = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
  }[size];

  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      {/* Precision Icon Mark */}
      <div className="relative flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C1F2B] to-[#0D0F15] border border-white/10 flex items-center justify-center group-hover:border-[#FFC800]/50 transition-colors shadow-sm">
          <svg className="w-4 h-4 text-[#FFC800] transform -rotate-45 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22L12 18L22 22L12 2Z" />
          </svg>
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FFC800] animate-pulse" />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className={`flex items-center gap-1.5 tracking-tight font-bold ${textSize}`}>
          <span className="font-extrabold tracking-tighter text-white">iQOO</span>
          <span className="text-[#FFC800] font-black tracking-normal">NavX</span>
          <span className={`rounded font-mono font-bold bg-[#FFC800]/15 text-[#FFC800] border border-[#FFC800]/30 uppercase tracking-widest ${badgeSize}`}>
            PROTOTYPE
          </span>
        </div>
        {showSubtext && (
          <span className="text-[10px] tracking-widest text-[#8E95A5] uppercase font-mono">
            Monster Performance Navigation
          </span>
        )}
      </div>
    </div>
  );
};
