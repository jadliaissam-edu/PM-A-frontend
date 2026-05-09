"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { orgService, type Workspace } from "@/services/org.service";
import { WorkspacePage, WorkspaceHeader, Panel, GhostButton, PrimaryButton, Avatar, Chip } from "@/components/workspace-ui";
import { projectService, type ProjectSummary } from "@/services/project.service";

export default function WorkspaceView() {
  const params = useParams() as any;
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const w = await orgService.getWorkspaceById(id);
        if (!mounted) return;
        setWorkspace(w);
        // fetch projects under this workspace
        setLoadingProjects(true);
        try {
          const ps = await projectService.getProjects({ workspace_id: id });
          if (!mounted) return;
          setProjects(ps || []);
        } catch (pe) {
          console.error('Failed to load workspace projects', pe);
        } finally {
          if (mounted) setLoadingProjects(false);
        }
      } catch (e: any) {
        console.error("Failed to load workspace", e);
        setError(e?.message || String(e));
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
        subtitle="Workspace details"
        actions={(
          <>
            <GhostButton onClick={() => router.push(`/workspaces/${id}/settings`)}>Settings</GhostButton>
            <PrimaryButton onClick={() => router.push(`/projects?workspace_id=${id}`)}>New project</PrimaryButton>
          </>
        )}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <Panel title={workspace?.name || "Workspace"} icon={<Avatar initials={(workspace?.name || "").slice(0,2).toUpperCase()} />}>
            {loading && <div className="text-sm text-[#8f96a3]">Loading workspace...</div>}
            {!loading && error && <div className="text-sm text-red-600">Error: {error}</div>}
            {!loading && workspace && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-black text-[#68707d]">Visibility: {workspace.visibility}</div>
                  <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-black text-[#68707d]">Members: {workspace.member_count || 0}</div>
                </div>

                <div className="rounded-[8px] border border-[#edf0f3] bg-white p-3 text-sm text-[#59606b]">{workspace.description || 'No description provided.'}</div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded border bg-white p-4">Projects: {workspace.project_count || 0}</div>
                  <div className="rounded border bg-white p-4">Last updated: {workspace.last_updated || '—'}</div>
                </div>
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-black text-[#20242a]">Projects</h3>
                  {loadingProjects && <div className="text-sm text-[#8f96a3]">Loading projects...</div>}
                  {!loadingProjects && projects.length === 0 && <div className="text-sm text-[#8f96a3]">No projects in this workspace.</div>}
                  <div className="space-y-2">
                    {projects.map((p) => (
                      <button key={p.id} onClick={() => router.push(`/projects/${p.id}`)} className="flex w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 py-2 text-sm font-black text-[#20242a] hover:bg-white">
                        <div className="min-w-0">
                          <div className="truncate">{p.name}</div>
                          <div className="text-xs font-semibold text-[#8f96a3]">{p.status || 'Unknown'}</div>
                        </div>
                        <Chip tone={p.status ? 'green' : 'neutral'}>{p.status || '—'}</Chip>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Panel>
        </section>

        <aside>
          <Panel title="Quick actions">
            <div className="space-y-2">
              <button onClick={() => router.push(`/projects?workspace_id=${id}`)} className="w-full rounded-[8px] bg-[var(--primary-color)] px-3 py-2 text-sm font-black text-white">Create project</button>
              <button onClick={() => router.push(`/workspaces/${id}/settings`)} className="w-full rounded-[8px] border border-[#dfe3e8] px-3 py-2 text-sm font-black">Workspace settings</button>
            </div>
          </Panel>
        </aside>
      </div>
    </WorkspacePage>
  );
}
