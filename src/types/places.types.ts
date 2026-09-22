export interface SavedPlace {
  id: string;
  user_id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  category?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSavedPlaceDTO {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  category?: string;
}

export interface UpdateSavedPlaceDTO {
  name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  category?: string;
}

export interface PlaceSearchResult {
  id: string;
  name: string;
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  types?: string[];
  rating?: number;
  userRatingsTotal?: number;
}
