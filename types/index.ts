export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
}