import { api } from "../lib/api";
import { AuthResponse } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  preferences_json?: any;
}

export const authService = {
  register: async (data: RegisterPayload) => {
    const response = await api.post("/auth/register/", data);
    return response.data;
  },

  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post("/auth/login/", data);
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get("/users/me/");
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch("/users/me/", data);
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    const response = await api.post("/auth/reset-password/", { email });
    return response.data;
  },

  verifyOtp: async (data: { email: string; otp: string }) => {
    const response = await api.post("/auth/verify-otp/", data);
    return response.data;
  },

  confirmReset: async (data: any) => {
    const response = await api.post("/auth/confirm-reset/", data);
    return response.data;
  },
  refreshToken: async (refreshToken: string) => {
    // primary refresh endpoint under auth
    const response = await api.post("/auth/token/refresh/", { refresh: refreshToken });
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout/");
    } catch (e) {
      // ignore network errors during logout
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};