import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: ({ user, accessToken, refreshToken }) =>
        set((state) => ({
          user,
          accessToken:
            accessToken !== undefined ? accessToken : state.accessToken,
          refreshToken:
            refreshToken !== undefined ? refreshToken : state.refreshToken,
        })),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        {
          name: "auth-storage",
          // Persist user and tokens in localStorage (restore previous behavior).
          partialize: (state) => ({
            user: state.user,
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
          }),
        }
        user: state.user,
      }),
    }
  )
);
