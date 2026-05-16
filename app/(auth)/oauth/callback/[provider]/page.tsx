"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store";

export default function OAuthProviderCallbackPage() {
  const router = useRouter();
  const params = useParams();
  const provider = params?.provider || "github";
  const setAuth = useAuthStore((s) => s.setAuth);
  const [message, setMessage] = useState("Processing OAuth login...");

  useEffect(() => {
    async function handle() {
      try {
        const search = new URLSearchParams(window.location.search);
        const code = search.get("code");

        if (!code) {
          setMessage("Missing authorization code.");
          return;
        }

        setMessage("Verifying with server...");

        const backend = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const res = await fetch(`${backend}/api/auth/oauth/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, provider }),
        });

        // Read raw text first so we can show helpful debug info when server
        // returns HTML or an error page instead of JSON.
        const raw = await res.text();
        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (err) {
          console.error("OAuth callback: invalid JSON response", raw, err);
          setMessage(raw || "OAuth login failed (invalid server response).");
          return;
        }

        if (!res.ok) {
          setMessage((data && (data.error || data.message)) || raw || "OAuth login failed.");
          return;
        }

        if (data?.access) localStorage.setItem("accessToken", data.access);
        if (data?.refresh) localStorage.setItem("refreshToken", data.refresh);
        setAuth({ user: data?.user || null, accessToken: data?.access, refreshToken: data?.refresh });

        router.push("/dashboard/enterprise");
      } catch (err) {
        setMessage("Unexpected error during OAuth login.");
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    handle();
  }, [provider, router, setAuth]);

  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
