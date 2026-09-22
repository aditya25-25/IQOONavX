import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useNav } from '../../context/NavContext';
import { SAVED_PLACES } from '../../data/mockNavigation';
import { SavedPlace } from '../../types/navigation';
import { Home, Building2, Flame, Plane, Navigation, Plus } from 'lucide-react';

export const SavedPlacesModal: React.FC = () => {
  const { isSavedPlacesOpen, setIsSavedPlacesOpen, routeToSavedPlace } = useNav();
  const [places, setPlaces] = useState<SavedPlace[]>(SAVED_PLACES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const getIcon = (category: string) => {
    switch (category) {
      case 'home':
        return <Home className="w-5 h-5 text-[#FFC800]" />;
      case 'work':
        return <Building2 className="w-5 h-5 text-[#00F0FF]" />;
      case 'track':
        return <Flame className="w-5 h-5 text-[#FF3B30]" />;
      default:
        return <Plane className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newPlace: SavedPlace = {
      id: `sp-${Date.now()}`,
      title: newTitle,
      category: 'favorite',
      address: newAddress || 'Custom coordinate location',
      distanceKm: +(3 + Math.random() * 15).toFixed(1),
      travelTimeMin: Math.floor(6 + Math.random() * 20),
      iconName: 'MapPin',
    };
    setPlaces([newPlace, ...places]);
    setNewTitle('');
    setNewAddress('');
    setShowAddForm(false);
  };

  return (
    <Modal
      isOpen={isSavedPlacesOpen}
      onClose={() => setIsSavedPlacesOpen(false)}
      title="Saved Places & Destinations"
      subtitle="Quick-launch precomputed low-latency routes"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* List of saved places */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {places.map((place) => (
            <div
              key={place.id}
              className="p-3.5 rounded-xl bg-[#161922] border border-white/5 hover:border-[#FFC800]/40 transition-all flex items-center justify-between group cursor-pointer"
              onClick={() => routeToSavedPlace(place)}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#08090C] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getIcon(place.category)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FFC800] transition-colors flex items-center gap-2">
                    {place.title}
                  </h4>
                  <p className="text-xs text-[#8E95A5] line-clamp-1">{place.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white">{place.travelTimeMin} min</div>
                  <div className="text-[11px] text-[#8E95A5] font-mono">{place.distanceKm} km</div>
                </div>
                <button
                  type="button"
                  className="p-2 rounded-lg bg-[#FFC800]/10 text-[#FFC800] group-hover:bg-[#FFC800] group-hover:text-black transition-all"
                  title="Route Now"
                >
                  <Navigation className="w-4 h-4 transform rotate-45" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add custom location form */}
        {showAddForm ? (
          <form onSubmit={handleAddPlace} className="p-4 rounded-xl bg-[#161922]/70 border border-[#FFC800]/30 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#FFC800]">Add Favorite Waypoint</h5>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Location name (e.g. iQOO Service Hub)"
              className="w-full bg-[#08090C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFC800]"
              required
            />
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Address / Street name"
              className="w-full bg-[#08090C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFC800]"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-[#8E95A5] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#FFC800] text-black font-bold text-xs hover:bg-[#FFE043]"
              >
                Save Place
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-white/15 hover:border-[#FFC800]/50 text-xs font-semibold text-[#8E95A5] hover:text-[#FFC800] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Waypoint
          </button>
        )}
      </div>
    </Modal>
  );
};
