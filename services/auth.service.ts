import { api } from "../lib/api";
import { AuthResponse } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post("/auth/login/", data);
    return response.data;
  },
};