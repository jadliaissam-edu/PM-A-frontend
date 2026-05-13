"use client";

import { useState } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { authService } from "@/services/auth.service";

export default function MfaVerifyPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const verify = async () => {
    try {
      await authService.verifyOtp({ email, otp: code });
      setMessage("Verification successful.");
    } catch (e) {
      setMessage("Verification failed.");
    }
  };

  return (
    <AuthCard title="Verify MFA" description="Enter the code from your authenticator app or SMS">
      <div className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="h-9 w-full rounded-[7px] border border-[#dfe3e8] px-3 text-xs" />
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" className="h-9 w-full rounded-[7px] border border-[#dfe3e8] px-3 text-xs" />
        <div className="flex gap-2">
          <button onClick={verify} className="flex h-9 items-center justify-center rounded-[7px] bg-[#7b68ee] text-xs font-black text-white">Verify</button>
        </div>
        {message && <div className="mt-2 text-sm text-[#68707d]">{message}</div>}
      </div>
    </AuthCard>
  );
}
