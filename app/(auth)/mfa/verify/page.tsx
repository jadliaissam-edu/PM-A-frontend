"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/features/auth/components/auth-card";
import { authAdvancedService } from "@/services/auth-advanced.service";
import { useAuthStore } from "@/store";

function MfaVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qEmail = searchParams?.get("email");
    if (qEmail) setEmail(qEmail);
  }, [searchParams]);

  // autofocus the OTP input on mount
  const codeInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    codeInputRef.current?.focus();
  }, []);

  // auto-submit when code length reaches 6
  useEffect(() => {
    if (!loading && code && code.replace(/\s+/g, '').length >= 6) {
      // debounce small delay to allow paste to complete
      const t = setTimeout(() => {
        verify();
      }, 120);
      return () => clearTimeout(t);
    }
  }, [code]);

  const verify = async () => {
    setLoading(true);
    try {
      // sanitize code: digits only, max 6
      const token = (code || '').toString().replace(/\D/g, '').slice(0, 6);
      // Request the backend to issue tokens after successful MFA
      const response = await authAdvancedService.verifyMfa({ email, token, issue_tokens: true });

      const access = response?.access;
      const refresh = response?.refresh;
      const user = response?.user || null;

      if (access || refresh) {
        try {
          if (access) localStorage.setItem("accessToken", access);
          if (refresh) localStorage.setItem("refreshToken", refresh);
        } catch (e) {}
        try {
          setAuth({ user, accessToken: access, refreshToken: refresh });
        } catch (e) {}
      }

      setMessage("Verification successful.");

      // Redirect to dashboard after short delay
      router.push("/dashboard/enterprise");
    } catch (e) {
      setMessage("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Verify MFA" description="Enter the code from your authenticator app or SMS">
      <div className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="h-9 w-full rounded-[7px] border border-[#dfe3e8] px-3 text-xs" />
        <input
          ref={codeInputRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              verify();
            }
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData?.getData('text') || '';
            const trimmed = pasted.replace(/\D/g, '').slice(0, 6);
            if (trimmed) setCode(trimmed);
          }}
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          className="h-9 w-full rounded-[7px] border border-[#dfe3e8] px-3 text-xs"
        />
        <div className="flex gap-2">
          <button onClick={verify} disabled={loading} className="flex h-9 items-center justify-center rounded-[7px] bg-[#7b68ee] text-xs font-black text-white">{loading ? 'Verifying...' : 'Verify'}</button>
        </div>
        {message && <div className="mt-2 text-sm text-[#68707d]">{message}</div>}
      </div>
    </AuthCard>
  );
}

export default function MfaVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MfaVerifyContent />
    </Suspense>
  );
}
