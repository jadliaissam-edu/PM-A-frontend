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

// Rely on HttpOnly cookies for auth (no localStorage tokens).
if (typeof window !== "undefined") {
  // Attach Authorization header from localStorage for client requests
  api.interceptors.request.use((config) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // If sending FormData, remove default JSON Content-Type so browser/axios can set multipart boundary
      if (config && config.data && typeof FormData !== "undefined" && config.data instanceof FormData) {
        if (config.headers) delete (config.headers as any)["Content-Type"];
      }
    } catch (e) {
      // ignore
    }
    return config;
  });
  // Axios response interceptor implementing refresh-on-401 with queueing
  let isRefreshing = false;
  let refreshPromise: Promise<string | null> | null = null;
  const subscribers: Array<(token: string | null) => void> = [];

  const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
    subscribers.push(cb);
  };

  const onRefreshed = (token: string | null) => {
    subscribers.forEach((cb) => cb(token));
    subscribers.length = 0;
  };

  const refreshToken = async (): Promise<string | null> => {
    if (refreshPromise) return refreshPromise;
    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        // Call refresh endpoint. Backend should read refresh cookie when available.
        const resp = await api.post("/auth/token/refresh/", {}, { withCredentials: true });
        const newAccess = resp.data?.access || null;
        const newRefresh = resp.data?.refresh || null;
        try {
          if (newAccess) localStorage.setItem("accessToken", newAccess);
          if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
        } catch (e) {}
        return newAccess;
      } catch (e) {
        return null;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();
    return refreshPromise;
  };

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error?.config;
      const status = error?.response?.status;

      if ((status === 401 || status === 403) && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        // Attempt refresh
        try {
          const newAccess = await refreshToken();
          if (newAccess) {
            // retry original request with new access token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            }
            onRefreshed(newAccess);
            return api(originalRequest);
          }
        } catch (e) {
          // fallthrough to logout
        }
      }

      // If we reach here, refresh failed or not applicable — clear auth and redirect
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } catch (e) {}
      try {
        if (useAuthStore && typeof useAuthStore.getState === "function")
          useAuthStore.getState().clearAuth();
      } catch (e) {}
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(error);
    }
  );
}