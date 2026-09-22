import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NavProvider } from './context/NavContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NavigationSection } from './components/NavigationSection';
import { FeatureGrid } from './components/FeatureGrid';
import { PhoneMockup } from './components/PhoneMockup';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

// Modals
import { SignInModal } from './components/modals/SignInModal';
import { SignUpModal } from './components/modals/SignUpModal';
import { SavedPlacesModal } from './components/modals/SavedPlacesModal';
import { RecentRoutesModal } from './components/modals/RecentRoutesModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { RouteDetailsModal } from './components/modals/RouteDetailsModal';
import { FullNavXModal } from './components/modals/FullNavXModal';

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08090C] text-white flex flex-col selection:bg-[#FFC800] selection:text-black">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Section 1: Hero with live map preview */}
        <Hero />

        {/* Section 2: Interactive Navigation Preview & Route Selector */}
        <NavigationSection />

        {/* Section 3: 4 Key Capabilities */}
        <FeatureGrid />

        {/* Section 4: iQOO Smartphone Mockup with NavX App */}
        <PhoneMockup />

        {/* Section 5: Minimal Final CTA */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Reusable Modals & Dialogs */}
      <SignInModal />
      <SignUpModal />
      <SavedPlacesModal />
      <RecentRoutesModal />
      <SettingsModal />
      <RouteDetailsModal />
      <FullNavXModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavProvider>
        <AppContent />
      </NavProvider>
    </AuthProvider>
  );
};

export default App;
