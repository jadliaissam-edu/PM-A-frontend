"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [message, setMessage] = useState("Processing OAuth login...");

  useEffect(() => {
    async function handle() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const provider = params.get("provider") || "github";

        if (!code) {
          setMessage("Missing authorization code.");
          return;
        }

        setMessage("Verifying with server...");

        const res = await fetch("/api/auth/oauth/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, provider }),
        });

        const data = await res.json();
        if (!res.ok) {
          setMessage(data.error || "OAuth login failed.");
          return;
        }

        // Persist tokens and update auth store
        if (data.access) localStorage.setItem("accessToken", data.access);
        if (data.refresh) localStorage.setItem("refreshToken", data.refresh);
        setAuth({ user: data.user || null, accessToken: data.access, refreshToken: data.refresh });

        router.push("/dashboard/enterprise");
      } catch (err) {
        setMessage("Unexpected error during OAuth login.");
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    handle();
  }, [router, setAuth]);

  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
