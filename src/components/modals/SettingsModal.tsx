import React from 'react';
import { Modal } from '../common/Modal';
import { useNav } from '../../context/NavContext';
import { Volume2, VolumeX, Cpu, HardDrive, Compass, Check, Sliders } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, settings, updateSettings, telemetry, toggleMonsterMode } = useNav();

  return (
    <Modal
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      title="iQOO NavX Engine Settings"
      subtitle="Configure hardware acceleration, HUD theme and voice guidance"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Monster Engine GPU acceleration toggle */}
        <div className="p-4 rounded-xl bg-[#161922] border border-[#FFC800]/20 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC800]/10 border border-[#FFC800]/30 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-[#FFC800]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Monster Graphics Acceleration (144Hz)
                <span className="text-[10px] bg-[#FFC800] text-black font-extrabold px-1.5 py-0.5 rounded font-mono">
                  iQOO EXCLUSIVE
                </span>
              </div>
              <p className="text-xs text-[#8E95A5] mt-0.5">
                Utilizes Snapdragon Adreno GPU compute pipeline for 144 FPS smooth vector map interpolation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleMonsterMode}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ml-3 ${
              telemetry.monsterModeActive ? 'bg-[#FFC800]' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                telemetry.monsterModeActive ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Audio & Voice Guidance */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8E95A5] flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#FFC800]" /> Audio & Co-Pilot Voice
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => updateSettings({ voiceGuidance: !settings.voiceGuidance })}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                settings.voiceGuidance
                  ? 'bg-[#161922] border-[#FFC800]/50 text-white'
                  : 'bg-[#08090C] border-white/5 text-[#8E95A5]'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                {settings.voiceGuidance ? <Volume2 className="w-4 h-4 text-[#FFC800]" /> : <VolumeX className="w-4 h-4" />}
                <span>Turn-by-Turn Voice Co-Pilot</span>
              </div>
              {settings.voiceGuidance && <Check className="w-4 h-4 text-[#FFC800]" />}
            </div>

            <div className="p-3 rounded-xl bg-[#161922] border border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#8E95A5]">Voice Engine</span>
              <select
                value={settings.voiceLanguage}
                onChange={(e) => updateSettings({ voiceLanguage: e.target.value as any })}
                className="bg-[#08090C] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#FFC800]"
              >
                <option value="en-US">iQOO AI (English US)</option>
                <option value="en-GB">Velocity AI (English UK)</option>
                <option value="hi-IN">iQOO AI (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Velocity Units & Offline Pack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Units */}
          <div className="p-3.5 rounded-xl bg-[#161922] border border-white/5 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8E95A5] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#00F0FF]" /> Speedometer Unit
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ speedUnit: 'km/h' })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  settings.speedUnit === 'km/h' ? 'bg-[#FFC800] text-black' : 'bg-[#08090C] text-[#8E95A5]'
                }`}
              >
                Metric (KM/H)
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ speedUnit: 'mph' })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  settings.speedUnit === 'mph' ? 'bg-[#FFC800] text-black' : 'bg-[#08090C] text-[#8E95A5]'
                }`}
              >
                Imperial (MPH)
              </button>
            </div>
          </div>

          {/* Offline Pack */}
          <div className="p-3.5 rounded-xl bg-[#161922] border border-white/5 flex items-center justify-between">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8E95A5] flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> Offline Vector Pack
              </label>
              <p className="text-[11px] text-[#8E95A5] mt-0.5">Metropolis Region (184 MB)</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              CACHED
            </span>
          </div>
        </div>

        {/* HUD Color Accents */}
        <div className="p-3.5 rounded-xl bg-[#161922] border border-white/5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8E95A5] flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#FFC800]" /> HUD Hologram Accent
          </label>
          <div className="flex gap-2">
            {[
              { id: 'iqoo-yellow', name: 'iQOO Monster Yellow', color: '#FFC800' },
              { id: 'cyber-cyan', name: 'Cyber Neon Cyan', color: '#00F0FF' },
              { id: 'racing-red', name: 'Apex Track Red', color: '#FF3B30' },
            ].map((accent) => (
              <button
                key={accent.id}
                type="button"
                onClick={() => updateSettings({ hudGlowAccent: accent.id as any })}
                className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  settings.hudGlowAccent === accent.id
                    ? 'border-[#FFC800] bg-white/5 text-white'
                    : 'border-white/5 bg-[#08090C] text-[#8E95A5]'
                }`}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent.color }} />
                <span>{accent.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
