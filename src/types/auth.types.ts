export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthSessionResponse {
  user: UserProfile;
  access_token: string;
  token_type: string;
  expires_in?: number;
}
