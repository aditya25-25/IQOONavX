export interface RecentRoute {
  id: string;
  user_id: string;
  source_name: string;
  destination_name: string;
  source_latitude?: number | null;
  source_longitude?: number | null;
  dest_latitude?: number | null;
  dest_longitude?: number | null;
  distance: number; // in kilometers
  duration: number; // in minutes
  travel_mode?: string | null;
  created_at?: string;
}

export interface CreateRecentRouteDTO {
  source_name: string;
  destination_name: string;
  source_latitude?: number;
  source_longitude?: number;
  dest_latitude?: number;
  dest_longitude?: number;
  distance: number;
  duration: number;
  travel_mode?: string;
}
