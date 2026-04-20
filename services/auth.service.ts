import { api } from "../lib/api";
import { AuthResponse } from "../types";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ResetPasswordRequestPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ConfirmResetPayload {
  email: string;
  otp: string;
  new_password: string;
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

  register: async (data: RegisterPayload) => {
    const response = await api.post("/auth/register/", data);
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    const response = await api.post("/auth/reset-password/", { email });
    return response.data;
  },
};