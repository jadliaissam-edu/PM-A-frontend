"use client";

import { useState } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { authService } from "@/services/auth.service";

export default function MfaSetupPage() {
  const [sharedSecret, setSharedSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const generate = async () => {
    try {
      // call MFA setup endpoint which returns secret and qr_url
      const resp = await authService.mfaSetup(email);
      setSharedSecret(resp.secret || null);
      setMessage(resp.qr_url ? "Scan the QR code or enter the secret into your authenticator app." : "Secret generated. Enter into your authenticator app.");
    } catch (e) {
      setMessage("Unable to generate MFA secret right now.");
    }
  };

  const confirm = async () => {
    try {
      await authService.verifyOtp({ email, otp: code });
      setMessage("MFA enabled for your account.");
    } catch (e) {
      setMessage("Verification failed.");
    }
  };

  return (
    <AuthCard title="Set up MFA" description="Use an authenticator app or SMS to secure your account.">
      <div className="space-y-3">
        <p className="text-sm text-[#68707d]">We recommend using a TOTP authenticator app for stronger security.</p>

        {!sharedSecret ? (
          <div className="grid gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="h-9 w-full rounded-[7px] border border-[#dfe3e8] px-3 text-xs" />
            <button onClick={generate} className="flex h-9 items-center justify-center rounded-[7px] bg-[#7b68ee] text-xs font-black text-white">Generate secret</button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="rounded-[7px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-black text-[#20242a]">Secret: {sharedSecret}</div>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code from app" className="h-9 w-full rounded-[7px] border border-[#dfe3e8] px-3 text-xs" />
            <div className="flex gap-2">
              <button onClick={confirm} className="flex h-9 items-center justify-center rounded-[7px] bg-[#7b68ee] text-xs font-black text-white">Verify</button>
            </div>
          </div>
        )}

        {message && <div className="mt-2 text-sm text-[#68707d]">{message}</div>}
      </div>
    </AuthCard>
  );
}
