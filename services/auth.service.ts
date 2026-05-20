import { api } from "../lib/api";
import { AuthResponse } from "../types";

export interface LoginPayload {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
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
    const url = `${api.defaults.baseURL?.replace(/\/$/, '')}/auth/register/`;
    console.debug("authService.register ->", url, data);
    const response = await api.post("/auth/register/", data);
    console.debug("authService.register response ->", response.status, response.data);
    return response.data;
  },

  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post("/auth/login/", data);
    // If MFA is required, backend returns { mfa_required: true, email }
    if (response.data?.mfa_required) {
      return response.data;
    }

    const access = response.data?.access;
    const refresh = response.data?.refresh;
    const user = response.data?.user || null;
    try {
      if (access) localStorage.setItem("accessToken", access);
      if (refresh) localStorage.setItem("refreshToken", refresh);
    } catch (e) {}
    try {
      const { useAuthStore } = require("@/store");
      if (useAuthStore && typeof useAuthStore.getState === "function") {
        useAuthStore.getState().setAuth({ user, accessToken: access, refreshToken: refresh });
      }
    } catch (e) {}
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

  mfaSetup: async (email: string) => {
    const response = await api.post("/auth/mfa/setup/", { email });
    return response.data;
  },

  verifyOtp: async (data: { email: string; otp: string; issue_tokens?: boolean }) => {
    const response = await api.post("/auth/verify-otp/", data);
    // If tokens were issued as part of MFA verification, persist them
    const access = response.data?.access;
    const refresh = response.data?.refresh;
    const user = response.data?.user || null;
    if (access || refresh) {
      try {
        if (access) localStorage.setItem("accessToken", access);
        if (refresh) localStorage.setItem("refreshToken", refresh);
      } catch (e) {}
      try {
        const { useAuthStore } = require("@/store");
        if (useAuthStore && typeof useAuthStore.getState === "function") {
          useAuthStore.getState().setAuth({ user, accessToken: access, refreshToken: refresh });
        }
      } catch (e) {}
    }
    return response.data;
  },

  verifyResetOtp: async (data: { email: string; otp: string }) => {
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

  confirmPasswordReset: async (data: any) => {
    const response = await api.post("/auth/confirm-reset/", data);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout/");
    } catch (e) {
      // ignore network errors during logout
    }
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (e) {}
    try {
      // clear client auth store as well
      // lazy-import to avoid circular deps in some bundlers
      const { useAuthStore } = require("@/store");
      if (useAuthStore && typeof useAuthStore.getState === "function") {
        useAuthStore.getState().clearAuth();
      }
    } catch (e) {
      // ignore
    }
  },
};