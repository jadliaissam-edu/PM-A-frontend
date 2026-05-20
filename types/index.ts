export interface User {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface AuthResponse {
  access?: string;
  refresh?: string;
  username?: string;
  email?: string;
  mfa_required?: boolean;
  user?: User;
}