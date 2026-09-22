import React from 'react';
import { Cpu, HardDrive, Compass, Layers, ShieldCheck } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      number: '01',
      title: 'Smart Routing',
      subtitle: 'Dynamic multi-variable path solver.',
      metric: '99.4% Accuracy',
      icon: <Compass className="w-5 h-5 text-[#FFC800]" />,
      badge: 'Real-time Matrix',
      details: 'Sub-second recalculation via neural road graph models.',
    },
    {
      number: '02',
      title: 'Offline Navigation',
      subtitle: 'Zero network dependency.',
      metric: '0.0 ms Latency',
      icon: <HardDrive className="w-5 h-5 text-[#00F0FF]" />,
      badge: 'Local Vector Store',
      details: 'Full city vector data stored locally on device storage.',
    },
    {
      number: '03',
      title: 'iQOO Monster Engine',
      subtitle: 'Hardware-level graphics pipeline.',
      metric: '144 FPS Rendering',
      icon: <Cpu className="w-5 h-5 text-[#FFC800]" />,
      badge: 'Snapdragon Turbo',
      details: 'Direct Adreno GPU compute with intelligent thermal throttling.',
    },
    {
      number: '04',
      title: 'Context-Aware Guidance',
      subtitle: 'Adaptive visual & lane intelligence.',
      metric: 'Sub-Meter Precision',
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      badge: 'Augmented HUD',
      details: 'Dual-frequency L1+L5 carrier signals for high-density city streets.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-[#0A0C10] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Minimal Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono font-bold text-[#FFC800] uppercase tracking-wider mb-2">
            Engineered Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Designed for Performance
          </h2>
          <p className="text-xs sm:text-sm text-[#8E95A5] mt-1 font-mono">
            Purpose-built navigation architecture for iQOO devices.
          </p>
        </div>

        {/* Features 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((feat) => (
            <div
              key={feat.number}
              className="p-6 rounded-2xl bg-[#0F1117] border border-white/5 hover:border-[#FFC800]/40 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black font-mono text-white/20 group-hover:text-[#FFC800]/60 transition-colors">
                    {feat.number}
                  </span>
                  <div className="p-2.5 rounded-xl bg-[#161922] border border-white/10 group-hover:border-[#FFC800]/30 transition-colors">
                    {feat.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#FFC800] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#8E95A5] mb-3">
                  {feat.subtitle}
                </p>

                <p className="text-xs text-white/70 font-mono leading-relaxed border-t border-white/5 pt-3">
                  {feat.details}
                </p>
              </div>

              {/* Bottom Metric & Badge */}
              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#FFC800]" /> {feat.metric}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8E95A5] border border-white/5 uppercase">
                  {feat.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
