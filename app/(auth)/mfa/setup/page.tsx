"use client";

import { useState } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { authAdvancedService } from "@/services/auth-advanced.service";

export default function MfaSetupPage() {
  const [sharedSecret, setSharedSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const generate = async () => {
    try {
      // call MFA setup endpoint which returns secret and qr_url
      const resp = await authAdvancedService.setupMfa({ email });
      setSharedSecret(resp.secret || null);
      setQrUrl(resp.qr_url || null);
      setMessage(resp.qr_url ? "Scan the QR code or enter the secret into your authenticator app." : "Secret generated. Enter into your authenticator app.");
    } catch (e) {
      setMessage("Unable to generate MFA secret right now.");
    }
  };

  const confirm = async () => {
    try {
      const token = (code || '').toString().replace(/\D/g, '').slice(0, 6);
      await authAdvancedService.verifyMfa({ email, token });
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
            {qrUrl && (
              <div className="mt-2">
                  <img id="mfa-qr" src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=200x200`} alt="MFA QR" />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        // trigger download of the QR image via the qrserver URL
                        const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=400x400`;
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'mfa-qr.png';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                      }}
                      className="px-3 py-2 rounded-[6px] bg-[#7b68ee] text-white text-xs font-black"
                    >
                      Download QR
                    </button>
                    <button
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(qrUrl);
                          setMessage('Provisioning URI copied to clipboard.');
                        } catch (e) {
                          setMessage('Unable to copy provisioning URI.');
                        }
                      }}
                      className="px-3 py-2 rounded-[6px] border border-[#dfe3e8] text-xs font-black"
                    >
                      Copy provisioning URI
                    </button>
                  </div>
              </div>
            )}
              {sharedSecret && (
                <div className="mt-2">
                  <p className="text-xs text-[#68707d]">Or manually enter this secret into Google Authenticator:</p>
                  <div className="rounded-[7px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-black text-[#20242a]">{sharedSecret}</div>
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(sharedSecret || '');
                          setMessage('Secret copied to clipboard.');
                        } catch (e) {
                          setMessage('Unable to copy secret.');
                        }
                      }}
                      className="px-3 py-2 rounded-[6px] bg-[#7b68ee] text-white text-xs font-black"
                    >
                      Copy secret
                    </button>
                  </div>
                </div>
              )}
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
