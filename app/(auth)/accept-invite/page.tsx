"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { orgService } from "@/services/org.service";
import { PrimaryButton, Panel } from "@/components/workspace-ui";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const org = searchParams.get("org");
  const workspace = searchParams.get("workspace");
  const email = searchParams.get("email");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAccept = async () => {
    if (!workspace || !email) {
      setError("Invalid invitation link structure.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await orgService.acceptInvitationByWorkspace(workspace, email);
      setSuccess(true);
      setTimeout(() => {
        router.push("/organization"); 
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to join workspace. Make sure you are logged in with the correct email.");
    } finally {
      setLoading(false);
    }
  };

  if (!org || !workspace || !email) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-[#20242a]">Invalid Invitation</h1>
        <p className="text-sm text-[#68707d]">This invitation link is missing some required information (org, workspace, or email).</p>
        <button onClick={() => router.push('/login')} className="text-sm font-black text-[#7b68ee]">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-[#20242a]">Join Workspace</h1>
        <p className="text-sm text-[#68707d]">
          You've been invited to join a workspace on AgileFlow. Click below to accept and start collaborating.
        </p>
      </div>

      <div className="rounded-[12px] border border-[#dfe3e8] bg-[#f7f8fb] p-4">
        <div className="space-y-3 text-[13px] font-bold">
          <div className="flex justify-between border-b border-[#dfe3e8] pb-2">
            <span className="text-[#8f96a3]">Invited Email</span>
            <span className="text-[#20242a]">{email}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[#8f96a3]">Workspace ID</span>
            <span className="truncate text-[#20242a] ml-4 max-w-[180px]">{workspace}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[8px] border border-red-100 bg-red-50 p-3 text-[12px] font-black text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-[8px] border border-green-100 bg-green-50 p-3 text-[12px] font-black text-green-600">
          Successfully joined! Redirecting you now...
        </div>
      )}

      <PrimaryButton 
        onClick={handleAccept} 
        disabled={loading || success}
        className="h-12 w-full !text-sm"
      >
        {loading ? "Joining..." : "Accept Invitation"}
      </PrimaryButton>
      
      <p className="text-center text-[11px] font-semibold text-[#8f96a3]">
        By accepting, you will be added as a member to this workspace.
      </p>
    </div>
  );
}

export default function AcceptInvitePage() {
    return (
        <Suspense fallback={<div className="text-sm font-black text-[#8f96a3]">Loading invitation...</div>}>
            <AcceptInviteContent />
        </Suspense>
    );
}
