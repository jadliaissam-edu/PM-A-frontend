export interface User {
  id?: string | number;
  email?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user_id: string | number;
  username: string;
  email: string;
}