"use client";

import Link from "next/link";
import { AuthCard } from "@/features/auth/components/auth-card";

export default function MfaIndex() {
  return (
    <AuthCard title="Multi-factor Authentication" description="Protect your account with an additional authentication factor.">
      <div className="space-y-3">
        <p className="text-sm text-[#68707d]">We support TOTP apps (Google Authenticator, Authy) and SMS-based codes. Set up MFA to add an extra layer of security to your workspace.</p>

        <div className="grid gap-2">
          <Link href="/mfa/setup" className="flex h-9 items-center justify-center rounded-[7px] bg-[#7b68ee] text-xs font-black text-white">Set up MFA</Link>
          <Link href="/mfa/verify" className="flex h-9 items-center justify-center rounded-[7px] border border-[#dfe3e8] bg-white text-xs font-black text-[#20242a]">Verify an existing code</Link>
        </div>
      </div>
    </AuthCard>
  );
}
