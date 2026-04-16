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

export const authService = {
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