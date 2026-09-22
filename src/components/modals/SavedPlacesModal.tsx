import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { useNav } from '../../context/NavContext';
import { useAuth } from '../../context/AuthContext';
import { SAVED_PLACES } from '../../data/mockNavigation';
import { SavedPlace } from '../../types/navigation';
import { apiClient } from '../../services/apiClient';
import { Home, Building2, Flame, Plane, Navigation, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';

export const SavedPlacesModal: React.FC = () => {
  const { isSavedPlacesOpen, setIsSavedPlacesOpen, routeToSavedPlace } = useNav();
  const { user } = useAuth();

  const [places, setPlaces] = useState<SavedPlace[]>(SAVED_PLACES);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCategory, setNewCategory] = useState<'home' | 'work' | 'favorite' | 'track'>('favorite');

  // Convert backend SavedPlace to frontend SavedPlace
  const mapBackendPlace = (bp: any): SavedPlace => ({
    id: bp.id,
    title: bp.name,
    category: (bp.category as any) || 'favorite',
    address: bp.address || 'Custom coordinates location',
    distanceKm: +(Math.abs(bp.latitude || 28.5) * 0.4).toFixed(1),
    travelTimeMin: Math.max(5, Math.round(Math.abs(bp.latitude || 28.5) * 0.5)),
    iconName: bp.category === 'home' ? 'Home' : bp.category === 'work' ? 'Building2' : 'Flame',
  });

  const fetchSavedPlaces = useCallback(async () => {
    if (!user) {
      setPlaces(SAVED_PLACES);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<any[]>('/places');
      if (Array.isArray(data) && data.length > 0) {
        setPlaces(data.map(mapBackendPlace));
      } else {
        // If user has no saved places yet in database
        setPlaces([]);
      }
    } catch (err: any) {
      console.warn('Could not fetch saved places from backend, using fallback cache:', err.message);
      setPlaces(SAVED_PLACES);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isSavedPlacesOpen) {
      fetchSavedPlaces();
    }
  }, [isSavedPlacesOpen, fetchSavedPlaces]);

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

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSaving(true);
    setError(null);

    const lat = +(28.4 + Math.random() * 0.2).toFixed(4);
    const lng = +(77.0 + Math.random() * 0.4).toFixed(4);

    try {
      if (user) {
        const created = await apiClient.post('/places', {
          name: newTitle.trim(),
          latitude: lat,
          longitude: lng,
          address: newAddress.trim() || 'Custom coordinates location',
          category: newCategory,
        });

        const newMapped = mapBackendPlace(created);
        setPlaces((prev) => [newMapped, ...prev]);
      } else {
        const localNew: SavedPlace = {
          id: `sp-${Date.now()}`,
          title: newTitle.trim(),
          category: newCategory,
          address: newAddress.trim() || 'Custom coordinate location',
          distanceKm: +(3 + Math.random() * 15).toFixed(1),
          travelTimeMin: Math.floor(6 + Math.random() * 20),
          iconName: 'MapPin',
        };
        setPlaces((prev) => [localNew, ...prev]);
      }

      setNewTitle('');
      setNewAddress('');
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save place.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlace = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (user && !id.startsWith('sp-local-')) {
        await apiClient.delete(`/places/${id}`);
      }
      setPlaces((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete place.');
    }
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
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-[#8E95A5]">
            <Loader2 className="w-6 h-6 animate-spin text-[#FFC800]" />
            <span>Loading synced waypoints from Supabase...</span>
          </div>
        ) : places.length === 0 ? (
          /* Empty State */
          <div className="py-10 text-center text-xs text-[#8E95A5] border border-dashed border-white/10 rounded-xl p-6">
            <p className="font-semibold text-white mb-1">No saved destinations found.</p>
            <p>Add your favorite POIs, tracks, or home bases below to quickly launch navigation.</p>
          </div>
        ) : (
          /* List of saved places */
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

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-white">{place.travelTimeMin} min</div>
                    <div className="text-[11px] text-[#8E95A5] font-mono">{place.distanceKm} km</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeletePlace(place.id, e)}
                    className="p-2 rounded-lg bg-white/5 text-[#8E95A5] hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="Delete Place"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
        )}

        {/* Add custom location form */}
        {showAddForm ? (
          <form onSubmit={handleAddPlace} className="p-4 rounded-xl bg-[#161922]/70 border border-[#FFC800]/30 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#FFC800]">Add Favorite Waypoint</h5>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="bg-[#08090C] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#FFC800]"
              >
                <option value="favorite">Favorite ⭐</option>
                <option value="home">Home 🏠</option>
                <option value="work">Work 🏢</option>
                <option value="track">Race Track / Arena ⚡</option>
              </select>
            </div>

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
                disabled={saving}
                className="px-4 py-1.5 rounded-lg bg-[#FFC800] text-black font-bold text-xs hover:bg-[#FFE043] flex items-center gap-1.5"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Place</span>
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
