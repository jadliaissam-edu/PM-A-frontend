import { ResetConfirmFormData, VerifyOtpFormData } from "@/lib/validations";
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

  verifyResetOtp: async (data: VerifyOtpFormData) => {
    const response = await api.post("/auth/reset-password/verify-otp/", data);
    return response.data;
  },

  confirmPasswordReset: async (data: ResetConfirmFormData) => {
    const response = await api.post("/auth/reset-password/confirm/", data);
    return response.data;
  },

  getUsers: async (): Promise<UserProfile[]> => {
    const response = await api.get("/users/");
    return response.data;
  },

  logout: async () => {
    await api.post("/auth/logout/");
  },

};
