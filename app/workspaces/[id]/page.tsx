"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { orgService } from "@/services/org.service";
import { WorkspacePage, WorkspaceHeader, Panel, GhostButton, PrimaryButton, Avatar, Chip } from "@/components/workspace-ui";
import { projectService, type ProjectSummary } from "@/services/project.service";
import { workspaceService } from "@/services/workspace.service";

interface WorkspaceWithCounts {
  id: string;
  name: string;
  description?: string;
  visibility?: string;
  member_count?: number;
  project_count?: number;
  last_updated?: string;
}

interface Release {
  id: string;
  project: string;
  project_name: string;
  tag: string;
  target_date: string;
  description: string;
  status: string;
}

export default function WorkspaceView() {
  const params = useParams() as any;
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [workspace, setWorkspace] = useState<WorkspaceWithCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loadingReleases, setLoadingReleases] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const w = await orgService.getWorkspaceById(id);
      setWorkspace(w);
      
      setLoadingProjects(true);
      const ps = await projectService.getProjects({ workspace_id: id });
      setProjects(ps || []);
      setLoadingProjects(false);

      setLoadingReleases(true);
      const rs = await workspaceService.listWorkspaceReleases(id);
      setReleases(rs || []);
      setLoadingReleases(false);
    } catch (e: any) {
      console.error("Failed to load workspace data", e);
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
      setLoadingProjects(false);
      setLoadingReleases(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteRelease = async (projectId: string, releaseId: string) => {
    if (!confirm("Are you sure you want to delete this release?")) return;
    try {
      await projectService.deleteRelease(projectId, releaseId);
      // Refresh releases
      const rs = await workspaceService.listWorkspaceReleases(id!);
      setReleases(rs || []);
    } catch (err) {
      console.error("Failed to delete release", err);
      alert("Failed to delete release");
    }
  };

  const handleCreateRelease = async () => {
    if (projects.length === 0) {
      alert("Please create a project first.");
      return;
    }
    const tag = prompt("Release tag (e.g. v1.0.0):");
    if (!tag) return;
    const date = prompt("Target date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
    if (!date) return;
    
    try {
      await projectService.createRelease(projects[0].id, {
        tag,
        target_date: date,
        description: "Workspace release",
        status: "planned"
      });
      const rs = await workspaceService.listWorkspaceReleases(id!);
      setReleases(rs || []);
    } catch (err) {
      console.error("Failed to create release", err);
      alert("Failed to create release");
    }
  };

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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <Panel title="Workspace Projects" icon={<Avatar initials={(workspace?.name || "").slice(0,2).toUpperCase()} />}>
            {loading && <div className="text-sm text-[#8f96a3] animate-pulse">Loading data...</div>}
            {!loading && error && <div className="text-sm text-red-600">Error: {error}</div>}
            {!loading && workspace && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[12px] border border-[#edf0f3] bg-[#f7f8fb] p-4 text-sm font-black text-[#68707d]">
                    <p className="text-[10px] uppercase opacity-60 mb-1">Visibility</p>
                    <span className="text-[#20242a]">{workspace.visibility || 'Private'}</span>
                  </div>
                  <div className="rounded-[12px] border border-[#edf0f3] bg-[#f7f8fb] p-4 text-sm font-black text-[#68707d]">
                    <p className="text-[10px] uppercase opacity-60 mb-1">Active Members</p>
                    <span className="text-[#20242a]">{workspace.member_count || 0}</span>
                  </div>
                </div>

                {workspace.description && (
                  <div className="rounded-[12px] border border-[#edf0f3] bg-white p-4 text-sm leading-relaxed text-[#59606b]">
                    {workspace.description}
                  </div>
                )}

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-[#20242a]">Projects</h3>
                    <Chip tone="purple">{projects.length} Total</Chip>
                  </div>
                  
                  {loadingProjects ? (
                    <div className="text-sm text-[#8f96a3]">Loading projects...</div>
                  ) : projects.length === 0 ? (
                    <div className="rounded-[12px] border-2 border-dashed border-[#edf0f3] p-12 text-center text-sm text-[#8f96a3]">
                      <p>No projects found in this workspace.</p>
                      <button onClick={() => router.push(`/projects?workspace_id=${id}`)} className="mt-4 text-[#7b68ee] font-bold hover:underline">Create your first project →</button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {projects.map((p) => (
                        <div key={p.id} className="group relative rounded-[16px] border border-[#edf0f3] bg-white p-5 transition-all hover:border-[#7b68ee] hover:shadow-xl hover:shadow-zinc-200/40">
                          <div className="flex items-center justify-between mb-4">
                            <div className="min-w-0">
                              <h4 className="truncate text-base font-black text-[#20242a]">{p.name}</h4>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8f96a3]">{p.code || 'PRJ'} • {p.status || 'Active'}</p>
                            </div>
                            <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <button 
                              onClick={() => router.push(`/project/${p.id}`)}
                              className="flex flex-col items-center justify-center gap-1.5 rounded-[12px] bg-[#f7f8fb] py-3 text-[10px] font-black text-[#68707d] border border-transparent hover:bg-white hover:border-[#dfe3e8] hover:text-[#20242a] transition-all"
                            >
                              <span className="text-base">📊</span>
                              Dashboard
                            </button>
                            <button 
                              onClick={() => router.push(`/Board/kanban?projectId=${p.id}`)}
                              className="flex flex-col items-center justify-center gap-1.5 rounded-[12px] bg-[#f7f8fb] py-3 text-[10px] font-black text-[#68707d] border border-transparent hover:bg-white hover:border-[#dfe3e8] hover:text-[#20242a] transition-all"
                            >
                              <span className="text-base">📋</span>
                              Kanban
                            </button>
                            <button 
                              onClick={() => router.push(`/Board/scrum?projectId=${p.id}`)}
                              className="flex flex-col items-center justify-center gap-1.5 rounded-[12px] bg-[#f7f8fb] py-3 text-[10px] font-black text-[#68707d] border border-transparent hover:bg-white hover:border-[#dfe3e8] hover:text-[#20242a] transition-all"
                            >
                              <span className="text-base">🔄</span>
                              Scrum
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Workspace Releases" action={<PrimaryButton onClick={handleCreateRelease}>New Release</PrimaryButton>}>
            {loadingReleases ? (
              <div className="text-sm text-[#8f96a3]">Loading releases...</div>
            ) : releases.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-[#edf0f3] rounded-[12px]">
                <p className="text-sm text-[#8f96a3]">No releases tracked for this workspace.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {releases.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-4 rounded-[12px] bg-[#f7f8fb] border border-[#edf0f3] hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-[#dfe3e8] text-lg">🚀</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-[#20242a]">{r.tag}</h4>
                          <Chip tone={r.status === 'released' ? 'green' : 'purple'}>{r.status}</Chip>
                        </div>
                        <p className="text-[10px] font-semibold text-[#8f96a3]">{r.project_name} • Due {new Date(r.target_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteRelease(r.project, r.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </section>

        <aside className="space-y-6">
          <Panel title="Workspace Meta">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase text-[#8f96a3] mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-black text-[#20242a]">Operational</span>
                </div>
              </div>
              <div className="h-px bg-[#edf0f3]" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#68707d]">Projects</span>
                <span className="text-sm font-black text-[#20242a]">{workspace?.project_count || projects.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#68707d]">Releases</span>
                <span className="text-sm font-black text-[#20242a]">{releases.length}</span>
              </div>
            </div>
          </Panel>

          <Panel title="Quick actions">
            <div className="space-y-2">
              <button onClick={() => router.push(`/projects?workspace_id=${id}`)} className="w-full flex items-center justify-center gap-2 rounded-[12px] bg-[#20242a] px-4 py-3 text-sm font-black text-white hover:bg-[#000] transition-all">
                <span>➕</span> Create project
              </button>
              <button onClick={handleCreateRelease} className="w-full flex items-center justify-center gap-2 rounded-[12px] border border-[#dfe3e8] bg-white px-4 py-3 text-sm font-black text-[#20242a] hover:bg-[#f7f8fb] transition-all">
                <span>🚀</span> Create release
              </button>
              <button onClick={() => router.push(`/workspaces/${id}/settings`)} className="w-full flex items-center justify-center gap-2 rounded-[12px] border border-[#dfe3e8] bg-white px-4 py-3 text-sm font-black text-[#20242a] hover:bg-[#f7f8fb] transition-all">
                <span>⚙️</span> Workspace settings
              </button>
              <div className="pt-2">
                <button onClick={async () => {
                  if (!id) return;
                  if (!confirm('Delete this workspace? This cannot be undone.')) return;
                  try {
                    await orgService.deleteWorkspaceById(id);
                    router.push('/orgs');
                  } catch (err) {
                    console.error('Failed to delete workspace', err);
                    alert('Failed to delete workspace');
                  }
                }} className="w-full rounded-[12px] bg-red-50 px-4 py-3 text-sm font-black text-red-600 hover:bg-red-100 transition-all">
                  Delete workspace
                </button>
              </div>
            </div>
          </Panel>
        </aside>
      </div>
    </WorkspacePage>
  );
}
