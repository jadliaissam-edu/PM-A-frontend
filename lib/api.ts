import axios from "axios";
import { useAuthStore } from "@/store";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  // allow cookies from the backend (refresh/access cookie setting)
  withCredentials: true,
});

// Attach Authorization header from localStorage for client requests
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } catch (e) {}
        try {
          // clear persisted auth store
          if (useAuthStore && typeof useAuthStore.getState === "function") useAuthStore.getState().clearAuth();
        } catch (e) {}
        // Force navigation to login page
        if (typeof window !== "undefined") window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
}