"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { orgService } from "@/services/org.service";
import { WorkspacePage, WorkspaceHeader, Panel, GhostButton, PrimaryButton, Avatar, Chip } from "@/components/workspace-ui";
import { projectService, type ProjectSummary } from "@/services/project.service";
import { workspaceService } from "@/services/workspace.service";
import { Settings, Plus, Rocket, Trash2, Layout, Kanban, RefreshCw, BarChart3, Users, Clock, Globe, Lock } from "lucide-react";

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

export default function WorkspaceDetailView() {
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

  const [isCreatingProject, setIsCreatingProject] = useState(false);

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

  const handleCreateProject = async () => {
    const name = prompt("Project Name:");
    if (!name) return;
    const type = prompt("Project Type (software/business/support):", "software");
    if (!type) return;

    try {
      setIsCreatingProject(true);
      await projectService.createProject({
        name,
        type: type.toLowerCase(),
        workspace_id: id,
        status: "active"
      });
      // Refresh projects
      const ps = await projectService.getProjects({ workspace_id: id });
      setProjects(ps || []);
      alert("Project created successfully!");
    } catch (err: any) {
      console.error("Failed to create project", err);
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert("Failed to create project: " + msg);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleDeleteRelease = async (projectId: string, releaseId: string) => {
    if (!confirm("Are you sure you want to delete this release?")) return;
    try {
      await projectService.deleteRelease(projectId, releaseId);
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

  if (loading && !workspace) {
    return (
      <WorkspacePage>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#edf0f3] border-t-[#7b68ee]"></div>
        </div>
      </WorkspacePage>
    );
  }

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title={workspace?.name || "Workspace"}
        subtitle="Collaboration & Delivery Hub"
        actions={(
          <div className="flex items-center gap-2">
            <GhostButton onClick={() => router.push(`/workspaces/${id}/settings`)}>
              <Settings size={16} className="mr-2" />
              Settings
            </GhostButton>
            <PrimaryButton onClick={handleCreateProject} disabled={isCreatingProject}>
              <Plus size={16} className="mr-2" />
              {isCreatingProject ? "Creating..." : "New Project"}
            </PrimaryButton>
          </div>
        )}
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-[#20242a] tracking-tight flex items-center gap-2">
                <Layout size={20} className="text-[#7b68ee]" />
                Active Projects
              </h3>
              <Chip tone="purple">{projects.length} Total</Chip>
            </div>

            {loadingProjects ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map(i => <div key={i} className="h-40 rounded-[20px] bg-white border border-[#edf0f3] animate-pulse" />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-[24px] border-2 border-dashed border-[#edf0f3] bg-white/50 p-12 text-center">
                <p className="text-sm font-semibold text-[#8f96a3]">No projects in this workspace yet.</p>
                <PrimaryButton className="mt-4" onClick={() => router.push(`/projects?workspace_id=${id}`)}>
                  Create First Project
                </PrimaryButton>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((p) => (
                  <div key={p.id} className="group relative rounded-[24px] border border-[#edf0f3] bg-white p-6 transition-all hover:border-[#7b68ee] hover:shadow-2xl hover:shadow-[#7b68ee]/5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="min-w-0">
                        <h4 className="truncate text-base font-black text-[#20242a]">{p.name}</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="text-[10px] font-black bg-[#f7f8fb] px-1.5 py-0.5 rounded text-[#7b68ee]">{p.code || 'PRJ'}</code>
                          <span className="text-[10px] font-bold text-[#8f96a3] uppercase tracking-wider">{p.status || 'In Progress'}</span>
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => router.push(`/project/${p.id}`)}
                        className="flex flex-col items-center justify-center gap-2 rounded-[16px] bg-[#f7f8fb] py-3.5 text-[10px] font-black text-[#68707d] border border-transparent hover:bg-[#7b68ee] hover:text-white transition-all shadow-sm"
                      >
                        <BarChart3 size={16} />
                        Insight
                      </button>
                      <button 
                        onClick={() => router.push(`/Board/kanban?projectId=${p.id}`)}
                        className="flex flex-col items-center justify-center gap-2 rounded-[16px] bg-[#f7f8fb] py-3.5 text-[10px] font-black text-[#68707d] border border-transparent hover:bg-[#7b68ee] hover:text-white transition-all shadow-sm"
                      >
                        <Kanban size={16} />
                        Kanban
                      </button>
                      <button 
                        onClick={() => router.push(`/Board/scrum?projectId=${p.id}`)}
                        className="flex flex-col items-center justify-center gap-2 rounded-[16px] bg-[#f7f8fb] py-3.5 text-[10px] font-black text-[#68707d] border border-transparent hover:bg-[#7b68ee] hover:text-white transition-all shadow-sm"
                      >
                        <RefreshCw size={16} />
                        Scrum
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-[#20242a] tracking-tight flex items-center gap-2">
                <Rocket size={20} className="text-[#7b68ee]" />
                Recent Releases
              </h3>
              <GhostButton onClick={handleCreateRelease}>
                <Plus size={16} className="mr-2" />
                Plan Release
              </GhostButton>
            </div>

            {loadingReleases ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-20 rounded-[20px] bg-white border border-[#edf0f3] animate-pulse" />)}
              </div>
            ) : releases.length === 0 ? (
              <div className="rounded-[24px] border-2 border-dashed border-[#edf0f3] bg-white/50 py-10 text-center">
                <p className="text-sm font-semibold text-[#8f96a3]">No releases tracked yet.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {releases.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-5 rounded-[20px] bg-white border border-[#edf0f3] hover:border-[#7b68ee] hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-[14px] bg-[#f7f8fb] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">🚀</div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-black text-[#20242a]">{r.tag}</h4>
                          <Chip tone={r.status === 'released' ? 'green' : 'purple'}>{r.status}</Chip>
                        </div>
                        <p className="text-[10px] font-bold text-[#8f96a3] uppercase mt-0.5 tracking-wider">
                          {r.project_name} • <span className="text-[#7b68ee]">Due {new Date(r.target_date).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteRelease(r.project, r.id)}
                      className="opacity-0 group-hover:opacity-100 p-2.5 text-[#ff4d4d] hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <Panel title="General Info">
            <div className="space-y-5 pt-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8f96a3] mb-2 opacity-70">Workspace Status</p>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-black text-[#20242a]">Operational</span>
                </div>
              </div>
              
              <div className="h-px bg-[#f7f8fb]" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-[#8f96a3] opacity-60">Visibility</p>
                   <div className="flex items-center gap-1.5 text-xs font-black text-[#20242a]">
                     {workspace?.visibility === 'public' ? <Globe size={12} className="text-green-500" /> : <Lock size={12} />}
                     {workspace?.visibility || 'Private'}
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-[#8f96a3] opacity-60">Members</p>
                   <div className="flex items-center gap-1.5 text-xs font-black text-[#20242a]">
                     <Users size={12} />
                     {workspace?.member_count || 0}
                   </div>
                </div>
              </div>

              <div className="h-px bg-[#f7f8fb]" />

              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-semibold text-[#68707d] flex items-center gap-2"><Clock size={12} /> Last Sync</span>
                   <span className="text-xs font-black text-[#20242a]">Just now</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-semibold text-[#68707d]">Storage</span>
                   <span className="text-xs font-black text-[#20242a]">24% Used</span>
                 </div>
              </div>
            </div>
          </Panel>

          <Panel title="Operations">
            <div className="space-y-3">
              <button 
                onClick={handleCreateProject} 
                disabled={isCreatingProject}
                className="w-full flex items-center justify-center gap-3 rounded-[16px] bg-[#20242a] px-5 py-4 text-sm font-black text-white hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-zinc-200"
              >
                <Plus size={18} />
                {isCreatingProject ? "Creating..." : "Create New Project"}
              </button>
              <button onClick={handleCreateRelease} className="w-full flex items-center justify-center gap-3 rounded-[16px] border border-[#dfe3e8] bg-white px-5 py-4 text-sm font-black text-[#20242a] hover:bg-[#f7f8fb] transition-all">
                <Rocket size={18} />
                New Release Tag
              </button>
              <div className="pt-4">
                <button 
                  onClick={async () => {
                    if (!id) return;
                    if (!confirm('Permanently delete this workspace? All projects and data will be lost.')) return;
                    try {
                      await orgService.deleteWorkspaceById(id);
                      router.push('/workspaces');
                    } catch (err) {
                      console.error('Failed to delete workspace', err);
                      alert('Failed to delete workspace');
                    }
                  }} 
                  className="w-full flex items-center justify-center gap-2 rounded-[16px] bg-[#fff5f5] px-5 py-4 text-sm font-black text-[#ff4d4d] hover:bg-[#ffebeb] transition-all"
                >
                  <Trash2 size={16} />
                  Delete Workspace
                </button>
              </div>
            </div>
          </Panel>
        </aside>
      </div>
    </WorkspacePage>
  );
}
