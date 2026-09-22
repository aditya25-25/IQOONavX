import React, { useState, useEffect } from 'react';
import { BrandLogo } from './common/BrandLogo';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavContext';
import {
  Menu,
  X,
  Compass,
  Bookmark,
  History,
  Settings,
  Zap,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, openAuthModal, signOut } = useAuth();
  const {
    setIsSavedPlacesOpen,
    setIsRecentRoutesOpen,
    setIsSettingsOpen,
    setIsFullNavAppOpen,
    telemetry
  } = useNav();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090C]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <BrandLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#161922]/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <a
            href="#hero"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/90 hover:text-[#FFC800] hover:bg-white/5 transition-colors"
          >
            Home
          </a>
          <a
            href="#preview"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/90 hover:text-[#FFC800] hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#FFC800]" />
            <span>Interactive Nav</span>
          </a>
          <a
            href="#features"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/90 hover:text-[#FFC800] hover:bg-white/5 transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#mockup"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/90 hover:text-[#FFC800] hover:bg-white/5 transition-colors"
          >
            iQOO Device
          </a>

          <div className="w-[1px] h-4 bg-white/15 mx-1" />

          {/* Quick shortcuts */}
          <button
            type="button"
            onClick={() => setIsSavedPlacesOpen(true)}
            className="p-1.5 rounded-full text-[#8E95A5] hover:text-[#FFC800] hover:bg-white/5 transition-colors"
            title="Saved Places"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsRecentRoutesOpen(true)}
            className="p-1.5 rounded-full text-[#8E95A5] hover:text-[#FFC800] hover:bg-white/5 transition-colors"
            title="Recent Routes"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-full text-[#8E95A5] hover:text-[#FFC800] hover:bg-white/5 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </nav>

        {/* Action Controls & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Active telemetry pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161922] border border-white/10 text-[11px] font-mono text-[#8E95A5]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{telemetry.satelliteCount} SAT</span>
          </div>

          {user?.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161922] border border-white/10">
                <User className="w-3.5 h-3.5 text-[#FFC800]" />
                <span className="text-xs font-bold text-white max-w-[100px] truncate">{user.name}</span>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="p-2 rounded-xl text-[#8E95A5] hover:text-red-400 hover:bg-white/5 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="text-xs font-bold text-white hover:text-[#FFC800] px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Primary CTA */}
          <button
            type="button"
            onClick={() => setIsFullNavAppOpen(true)}
            className="py-2 px-4 rounded-xl bg-[#FFC800] hover:bg-[#FFE043] text-black font-bold text-xs tracking-wide transition-all shadow-glow-yellow-sm hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>Launch NavX</span>
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFullNavAppOpen(true)}
            className="py-1.5 px-3 rounded-lg bg-[#FFC800] text-black font-bold text-xs shadow-glow-yellow-sm flex items-center gap-1"
          >
            <Zap className="w-3 h-3 fill-current" /> NavX
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#161922] border border-white/10 text-[#8E95A5] hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1117] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 mt-3 shadow-2xl">
          <div className="space-y-1">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/5"
            >
              Home
            </a>
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#FFC800] hover:bg-white/5"
            >
              Interactive Navigation Preview
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/5"
            >
              Key Capabilities
            </a>
            <a
              href="#mockup"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/5"
            >
              iQOO Smartphone Visual
            </a>
          </div>

          <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSavedPlacesOpen(true);
              }}
              className="p-2.5 rounded-xl bg-[#161922] border border-white/5 text-xs text-center flex flex-col items-center gap-1 text-[#8E95A5]"
            >
              <Bookmark className="w-4 h-4 text-[#FFC800]" />
              <span>Saved</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsRecentRoutesOpen(true);
              }}
              className="p-2.5 rounded-xl bg-[#161922] border border-white/5 text-xs text-center flex flex-col items-center gap-1 text-[#8E95A5]"
            >
              <History className="w-4 h-4 text-[#00F0FF]" />
              <span>Recent</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSettingsOpen(true);
              }}
              className="p-2.5 rounded-xl bg-[#161922] border border-white/5 text-xs text-center flex flex-col items-center gap-1 text-[#8E95A5]"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Engine</span>
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {user?.isLoggedIn ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#161922]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FFC800]" />
                  <span className="text-xs font-bold text-white">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-400"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signin');
                }}
                className="w-full py-2.5 rounded-xl bg-[#161922] border border-white/10 text-xs font-bold text-white"
              >
                Sign In
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsFullNavAppOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-[#FFC800] text-black font-bold text-xs tracking-wide shadow-glow-yellow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" /> Launch NavX Cockpit
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
