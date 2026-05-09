"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { WorkspacePage, WorkspaceHeader, Panel, PrimaryButton, GhostButton, Avatar, Chip } from "@/components/workspace-ui";
import { orgService, type Workspace } from "@/services/org.service";

export default function WorkspacePageDetail() {
  const params = useParams();
  const id = String(params.id || "");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await orgService.getWorkspaceById(id);
        if (!mounted) return;
        setWorkspace(data);
      } catch (e) {
        console.error("Failed to load workspace", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title={workspace?.name || "Workspace"}
        subtitle={workspace ? `${workspace.organization} / ${workspace.name}` : "Workspace details"}
        badge={workspace?.visibility || "Private"}
        actions={<><GhostButton>Settings</GhostButton><PrimaryButton>Create project</PrimaryButton></>}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <Panel title="Overview">
            {loading && <div className="text-sm text-[#8f96a3]">Loading...</div>}
            {workspace && (
              <div>
                <p className="text-sm font-black text-[#20242a]">{workspace.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  <Avatar initials={(workspace.name || "").slice(0,2).toUpperCase()} />
                  <div>
                    <div className="text-sm font-black">{workspace.name}</div>
                    <div className="text-xs text-[#8f96a3]">{workspace.member_count || 0} members · {workspace.task_count || 0} tasks</div>
                  </div>
                </div>
              </div>
            )}
          </Panel>
        </section>

        <aside>
          <Panel title="Meta">
            <div className="space-y-2">
              <div className="text-sm text-[#68707d]">Visibility: <span className="font-black text-[#20242a]">{workspace?.visibility}</span></div>
              <div className="text-sm text-[#68707d]">Last updated: <span className="font-black text-[#20242a]">{workspace?.last_updated || '—'}</span></div>
            </div>
          </Panel>
        </aside>
      </div>
    </WorkspacePage>
  );
}
