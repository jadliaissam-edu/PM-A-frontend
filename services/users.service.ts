import { api } from "../lib/api";

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  is_active?: boolean;
  date_joined?: string;
}

export const usersService = {
  // List users (optionally paginated)
  listUsers: async (params?: Record<string, any>): Promise<UserSummary[]> => {
    const response = await api.get("/users/", { params });
    return response.data;
  },

  // Get a specific user by id
  getUserById: async (id: string): Promise<UserSummary> => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  // Update a user partially
  updateUser: async (id: string, patch: Partial<UserSummary>): Promise<UserSummary> => {
    const response = await api.patch(`/users/${id}/`, patch);
    return response.data;
  },

  // Current authenticated user (alias to existing profile endpoint)
  getMe: async (): Promise<UserSummary> => {
    const response = await api.get("/users/me/");
    return response.data;
  },
};
