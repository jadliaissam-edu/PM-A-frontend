import { api } from "../lib/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginPayload) => {
    const response = await api.post("/auth/login/", data);
    return response.data;
  },
};