export type SupportedTravelMode = 'driving' | 'walking' | 'cycling' | 'two_wheeler' | 'monster';

export interface NavigationPreferences {
  id: string;
  user_id: string;
  voice_enabled: boolean;
  dark_mode: boolean;
  travel_mode: SupportedTravelMode;
  monster_mode_enabled: boolean;
  speed_unit: 'km/h' | 'mph';
  voice_language: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdatePreferencesDTO {
  voice_enabled?: boolean;
  dark_mode?: boolean;
  travel_mode?: SupportedTravelMode;
  monster_mode_enabled?: boolean;
  speed_unit?: 'km/h' | 'mph';
  voice_language?: string;
}
