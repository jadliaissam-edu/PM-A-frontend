"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectBoardRedirect() {
  const params = useParams();
  const router = useRouter();
  const projectId = String(params.id || "");

  useEffect(() => {
    if (!projectId) return;
    // replace so back button doesn't return to this redirect page
    router.replace(`/Board/kanban?projectId=${encodeURIComponent(projectId)}`);
  }, [projectId, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-sm font-black text-[#68707d]">Opening project board…</p>
    </div>
  );
}
