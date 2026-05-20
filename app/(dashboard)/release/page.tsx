"use client";

import { Suspense, useEffect, useState } from "react";
import { CirclePlus, GitBranch, Rocket, Search, ShieldCheck, Clock, Calendar } from "lucide-react";
import { Avatar, Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import { orgService } from "@/services/org.service";
import { useSearchParams } from "next/navigation";
import { projectService } from "@/services/project.service";

interface Release {
  id?: string;
  tag: string;
  project_name: string;
  status: string;
  target_date: string;
  start_date?: string;
  end_date?: string;
  description: string;
}

function ReleaseManagementContent() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams?.get("workspace") || "1b14b1ce-3017-49a6-9b01-bc4123305fe0";

  const [items, setItems] = useState<Release[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Release | null>(null);
  const [dialog, setDialog] = useState<"changelog" | "release" | null>(null);
  
  const [newRelease, setNewRelease] = useState({
    tag: "",
    projectId: "",
    description: "",
    startDate: "",
    endDate: "",
    targetDate: "",
    status: "planned"
  });

  const visible = (filter === "All" ? items : items.filter((release) => {
    const s = release.status?.toLowerCase();
    if (filter === "Released") return s === "released";
    if (filter === "Draft") return s === "planned" || s === "in_progress";
    if (filter === "Archived") return s === "archived";
    return true;
  })).filter((release) => 
    `${release.tag} ${release.description} ${release.project_name}`.toLowerCase().includes(query.toLowerCase())
  );

  const createRelease = async () => {
    if (!newRelease.tag || !newRelease.projectId || !newRelease.targetDate) {
       setNotice("Please fill in tag, project, and target date.");
       return;
    }
    
    setLoading(true);
    try {
      const payload = {
        tag: newRelease.tag,
        description: newRelease.description,
        start_date: newRelease.startDate ? new Date(newRelease.startDate).toISOString() : null,
        end_date: newRelease.endDate ? new Date(newRelease.endDate).toISOString() : null,
        target_date: newRelease.targetDate,
        status: newRelease.status
      };
      await projectService.createRelease(newRelease.projectId, payload);
      setNotice(`Release ${newRelease.tag} created successfully.`);
      setDialog(null);
      setNewRelease({ tag: "", projectId: newRelease.projectId, description: "", startDate: "", endDate: "", targetDate: "", status: "planned" });
      
      const data = await projectService.listWorkspaceReleases(workspaceId);
      setItems(data || []);
    } catch (e) {
      console.error("Failed to create project release", e);
      setNotice("Failed to create release. Check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [releaseData, projectData] = await Promise.all([
           projectService.listWorkspaceReleases(workspaceId),
           projectService.getProjects()
        ]);
        if (!mounted) return;
        setItems(releaseData || []);
        const workspaceProjects = (projectData || []).filter((p: any) => 
          p.workspace?.id === workspaceId || p.workspace_id === workspaceId
        );
        setProjects(workspaceProjects);
        if (workspaceProjects.length > 0) {
           setNewRelease(prev => ({ ...prev, projectId: workspaceProjects[0].id }));
        }
      } catch (e) {
        console.error("Failed to load workspace data", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [workspaceId]);

  const formatDate = (d: string | undefined) => d ? new Date(d).toLocaleDateString() : "TBD";

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Releases"
        subtitle="Product / release train / deployment readiness"
        badge={`${items.length} builds`}
        actions={
          <>
            <GhostButton onClick={() => setDialog("changelog")}>Changelog</GhostButton>
            <PrimaryButton onClick={() => setDialog("release")}><span className="inline-flex items-center gap-1"><CirclePlus size={14} /> New Release</span></PrimaryButton>
          </>
        }
      />

      {notice && (
        <div className="border-b border-[#d7f4e8] bg-[#ecfff6] px-5 py-2 text-xs font-black text-[#008f65]">
          <button onClick={() => setNotice("")} className="w-full text-left">{notice}</button>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Panel title="Release pipeline" icon={<Rocket size={16} />}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="flex h-8 w-full min-w-0 items-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2.5 sm:w-auto sm:min-w-[240px]">
              <Search size={14} className="text-[#8f96a3]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tags or projects..." className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold outline-none placeholder:text-[#8f96a3]" />
            </div>
            {["All", "Released", "Draft", "Archived"].map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${filter === item ? "border border-[#dfe3e8] bg-[#f7f8fb] text-[#20242a]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>{item}</button>
            ))}
          </div>
          <div className="space-y-2">
            {visible.map((release) => (
              <article key={release.id} className={`rounded-[9px] border bg-white p-3 shadow-sm hover:bg-[#f7f8fb] ${selected?.id === release.id ? "border-[#d7d1ff] bg-[#f3efff]" : "border-[#dfe3e8]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-black text-[#20242a]">{release.tag}</h2>
                      <Chip tone={release.status === "released" ? "green" : (release.status === "planned" || release.status === "in_progress") ? "blue" : "neutral"}>
                        {release.status}
                      </Chip>
                    </div>
                    <p className="mt-1 text-xs font-black text-[#7b68ee] uppercase">{release.project_name}</p>
                    <p className="mt-1 text-xs font-semibold text-[#68707d]">{release.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[#8f96a3] uppercase">Target Date</p>
                    <span className="text-[11px] font-bold text-[#20242a]">{formatDate(release.target_date)}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center gap-4 text-[11px] text-[#68707d]">
                  <div className="flex items-center gap-1"><Clock size={12} /> <span>Dev: {formatDate(release.start_date)} - {formatDate(release.end_date)}</span></div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#edf0f3] pt-3">
                   <div className="flex items-center gap-2">
                      <Avatar initials={release.project_name?.slice(0,2).toUpperCase()} />
                      <span className="text-xs font-black text-[#68707d]">Project Lead</span>
                   </div>
                   <button onClick={() => setSelected(release)} className="text-xs font-black text-[#7b68ee]">View details</button>
                </div>
              </article>
            ))}
            {visible.length === 0 && !loading && <div className="rounded-[9px] border border-dashed border-[#dfe3e8] p-6 text-center text-sm font-bold text-[#8f96a3]">No releases found.</div>}
            {loading && <div className="p-6 text-center text-sm font-bold text-[#8f96a3]">Loading...</div>}
          </div>
        </Panel>

        <aside className="space-y-4">
          <Panel title="Schedule" icon={<Calendar size={16} />}>
            <div className="rounded-[9px] bg-[#24113f] p-4 text-white">
              <p className="text-[10px] font-black uppercase text-white/55">Next release</p>
              <p className="mt-2 text-2xl font-black">Coming Soon</p>
              <p className="mt-3 text-xs font-semibold leading-5 text-white/60">Monitor your deployment pipeline and readiness checklist before shipping.</p>
            </div>
          </Panel>
        </aside>
      </div>

      {(selected || dialog) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => { setSelected(null); setDialog(null); }}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-[15px] border border-[#dfe3e8] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#20242a]">{selected?.tag || (dialog === "changelog" ? "System Changelog" : "Create New Release")}</h2>
              <button onClick={() => { setSelected(null); setDialog(null); }} className="h-8 w-8 rounded-[8px] bg-[#f7f8fb] text-sm font-black text-[#68707d] hover:bg-[#edf0f3]">x</button>
            </div>

            {selected && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[10px] bg-[#f7f8fb] p-3">
                    <p className="text-[10px] font-black uppercase text-[#8f96a3]">Project</p>
                    <p className="mt-1 text-sm font-bold text-[#20242a]">{selected.project_name}</p>
                  </div>
                  <div className="rounded-[10px] bg-[#f7f8fb] p-3">
                    <p className="text-[10px] font-black uppercase text-[#8f96a3]">Status</p>
                    <p className="mt-1 text-sm font-bold text-[#20242a] uppercase">{selected.status}</p>
                  </div>
                </div>

                <div>
                   <p className="text-[10px] font-black uppercase text-[#8f96a3]">Notes</p>
                   <p className="mt-2 text-sm font-semibold leading-6 text-[#68707d]">{selected.description}</p>
                </div>

                <div className="border-t border-[#edf0f3] pt-4 flex gap-2">
                   {selected.status !== "released" && (
                      <PrimaryButton onClick={() => setNotice("Update functionality coming soon.")}>Update Status</PrimaryButton>
                   )}
                   <GhostButton onClick={() => setSelected(null)}>Close</GhostButton>
                </div>
              </div>
            )}

            {dialog === "release" && !selected && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black uppercase text-[#8f96a3]">Release Tag</label>
                  <input value={newRelease.tag} onChange={(e) => setNewRelease({...newRelease, tag: e.target.value})} placeholder="e.g. v1.0.4" className="mt-1 h-10 w-full rounded-[10px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#7b68ee]/20" />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-[#8f96a3]">Project</label>
                  <select value={newRelease.projectId} onChange={(e) => setNewRelease({...newRelease, projectId: e.target.value})} className="mt-1 h-10 w-full rounded-[10px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none">
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="text-[11px] font-black uppercase text-[#8f96a3]">Start Dev</label>
                     <input type="date" value={newRelease.startDate} onChange={(e) => setNewRelease({...newRelease, startDate: e.target.value})} className="mt-1 h-10 w-full rounded-[10px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none" />
                   </div>
                   <div>
                     <label className="text-[11px] font-black uppercase text-[#8f96a3]">Finish Dev</label>
                     <input type="date" value={newRelease.endDate} onChange={(e) => setNewRelease({...newRelease, endDate: e.target.value})} className="mt-1 h-10 w-full rounded-[10px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none" />
                   </div>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-[#8f96a3]">Launch Date (Target)</label>
                  <input type="date" value={newRelease.targetDate} onChange={(e) => setNewRelease({...newRelease, targetDate: e.target.value})} className="mt-1 h-10 w-full rounded-[10px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none" />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-[#8f96a3]">Description</label>
                  <textarea value={newRelease.description} onChange={(e) => setNewRelease({...newRelease, description: e.target.value})} placeholder="What's changing in this version?" className="mt-1 min-h-[80px] w-full rounded-[10px] border border-[#dfe3e8] bg-[#f7f8fb] p-3 text-sm font-semibold outline-none" />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <GhostButton onClick={() => setDialog(null)}>Cancel</GhostButton>
                  <PrimaryButton onClick={createRelease}>Create Release Draft</PrimaryButton>
                </div>
              </div>
            )}
            
            {dialog === "changelog" && !selected && (
               <div className="space-y-3">
                 {items.length === 0 ? <p className="text-center py-10 font-bold text-[#8f96a3]">No release history.</p> : 
                  items.slice(0, 5).map(r => (
                    <div key={r.id} className="rounded-[10px] border border-[#edf0f3] p-3">
                       <p className="text-sm font-black text-[#20242a]">{r.tag}</p>
                       <p className="mt-1 text-xs text-[#68707d]">{r.description}</p>
                    </div>
                  ))
                 }
               </div>
            )}
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}

export default function ReleaseManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReleaseManagementContent />
    </Suspense>
  );
}
