"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store";
import { authService } from "@/services/auth.service";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    // Rehydrate auth state from localStorage and fetch profile
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken) {
        setAuth({ user: null, accessToken, refreshToken: refreshToken ?? undefined });
        authService
          .getProfile()
          .then((profile) => setAuth({ user: { ...profile, id: parseInt(profile.id) } as any, accessToken, refreshToken: refreshToken ?? undefined }))
          .catch(() => {
            // profile fetch failed — tokens might be invalid
          });
      }
    } catch (e) {
      // ignore
    }
  }, [setAuth]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}