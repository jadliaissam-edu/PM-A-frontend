"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspacePage, WorkspaceHeader } from "@/components/workspace-ui";
import { orgService } from "@/services/org.service";

export default function NewWorkspacePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [creating, setCreating] = useState(false);

  return (
    <WorkspacePage>
      <WorkspaceHeader title="Create workspace" subtitle="Add a new workspace to an organization" actions={null} />

      <div className="p-6">
        <div className="max-w-md">
          <label className="block font-black mb-2">Workspace name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mb-3 w-full rounded border border-[#e6e9ef] px-3 py-2" placeholder="e.g. Product" />

          <label className="block font-black mb-2">Visibility</label>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="mb-4 w-full rounded border border-[#e6e9ef] px-3 py-2">
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>

          <div className="flex gap-2">
            <button disabled={creating} onClick={async () => {
              const n = name.trim();
              if (!n) return alert('Enter a name');
              try {
                setCreating(true);
                // backend expects organization id in payload; try best-effort to attach selected org from localStorage
                const orgId = typeof window !== 'undefined' ? localStorage.getItem('af:org_id') : null;
                const payload: any = { name: n, visibility };
                if (orgId) payload.organization = orgId;
                const created = await orgService.createWorkspace(payload);
                // navigate to created workspace when possible
                if (created && created.id) router.push(`/workspaces/${created.id}`);
              } catch (err) {
                console.error('Failed to create workspace', err);
                alert('Failed to create workspace');
              } finally { setCreating(false); }
            }} className="rounded-[7px] bg-[var(--primary-color)] px-4 py-2 font-black text-white">Create</button>
            <button onClick={() => router.back()} className="rounded-[7px] border px-4 py-2">Cancel</button>
          </div>
        </div>
      </div>
    </WorkspacePage>
  );
}
