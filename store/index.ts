import { create } from "zustand";
import { User } from "../types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (data: {
    user: User | null;
    accessToken?: string;
    refreshToken?: string;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setAuth: ({ user, accessToken, refreshToken }) =>
    set((state) => ({
      user,
      accessToken: accessToken !== undefined ? accessToken : state.accessToken,
      refreshToken: refreshToken !== undefined ? refreshToken : state.refreshToken,
    })),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    }),
}));