import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// State to handle multiple 401s and token refresh queuing
let isRefreshing = false;
let refreshSubscribers: ((token: string | null, error: any) => void)[] = [];

const onRefreshed = (accessToken: string | null, error: any = null) => {
  refreshSubscribers.map((callback) => callback(accessToken, error));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string | null, error: any) => void) => {
  refreshSubscribers.push(callback);
};

// Interceptor to handle 401 errors (expired tokens)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and it's NOT a refresh request
    if (error.response?.status === 401 && !originalRequest.url?.includes("/auth/token/refresh/")) {
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Attempt to refresh the token
          await api.post("/auth/token/refresh/");
          
          isRefreshing = false;
          onRefreshed("refreshed", null);
          
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          onRefreshed(null, refreshError);
          
          // If refresh fails, clear everything and redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      // If already refreshing, wait for it to complete
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((token, err) => {
          if (err) {
            reject(err);
          } else {
            resolve(api(originalRequest));
          }
        });
      });
    }

    return Promise.reject(error);
  }
);