"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, CirclePlus, FolderKanban, MoreHorizontal, Search } from "lucide-react";
import { Avatar, Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import { useEffect } from "react";
import { projectService, type ProjectSummary } from "@/services/project.service";

type Project = ProjectSummary;

export default function ProjectsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [portfolio, setPortfolio] = useState(true);
  const [dialog, setDialog] = useState<"project" | "template" | "actions" | null>(null);
  const [healthFilter, setHealthFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const visibleProjects = items.filter((project) => `${project.name} ${project.health} ${project.owner}`.toLowerCase().includes(query.toLowerCase())).filter((project) => healthFilter === "All" || project.health === healthFilter);
  const createProject = () => {
    const name = newProjectName.trim();
    if (!name) return;
    const project: Project = { id: `local-${items.length + 1}`, name, health: "Planning", progress: 5, owner: "AA", tasks: 0, due: "Next month", tone: "blue" };
    setItems((current) => [project, ...current]);
    setSelectedProject(project);
    setNewProjectName("");
    setDialog(null);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await projectService.getProjects();
        if (!mounted) return;
        // Map API shape into local Project type where necessary
        const mapped = data.map((p) => ({
          id: String(p.id),
          name: p.name || p.code || "Untitled",
          health: p.status || "Unknown",
          progress: p.progress || 0,
          owner: (p.lead && p.lead.slice(0, 2)) || (p.memberInitials && p.memberInitials[0]) || "--",
          tasks: p.issueCount || 0,
          due: p.dueLabel || p.dueLabel || "",
          tone: p.accent ? "green" : "blue",
          // keep other fields from API
          ...p,
        }));
        setItems(mapped);
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Projects"
        subtitle="Product / spaces / active project portfolio"
        badge="3 active"
        actions={
          <>
            <div className="flex h-8 items-center gap-1 rounded-[7px] border border-[#dfe3e8] bg-white px-2.5 shadow-sm">
              <Search size={13} className="text-[#8f96a3]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" className="w-32 bg-transparent text-xs font-black outline-none placeholder:text-[#8f96a3]" />
            </div>
            <PrimaryButton onClick={() => setDialog("project")}><span className="inline-flex items-center gap-1"><CirclePlus size={14} /> Project</span></PrimaryButton>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Panel title={portfolio ? "Active projects" : "Compact project list"} icon={<FolderKanban size={16} />} action={<GhostButton onClick={() => setPortfolio((current) => !current)}>Portfolio view</GhostButton>}>
          <div className="mb-3 flex flex-wrap gap-1">
            {["All", "Stable", "At risk", "Planning"].map((health) => <button key={health} onClick={() => setHealthFilter(health)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${healthFilter === health ? "border border-[#dfe3e8] bg-[#f7f8fb] text-[#20242a]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>{health}</button>)}
          </div>
          <div className="overflow-x-auto rounded-[8px] border border-[#dfe3e8]">
            <div className="min-w-[728px]">
            <div className="grid h-8 grid-cols-[minmax(280px,1fr)_110px_90px_90px_110px_48px] items-center bg-[#f8f9fb] text-[10px] font-black uppercase text-[#68707d]">
              <div className="px-3">Project</div>
              <div className="border-l border-[#e4e6ea] px-3">Health</div>
              <div className="border-l border-[#e4e6ea] px-3">Owner</div>
              <div className="border-l border-[#e4e6ea] px-3">Tasks</div>
              <div className="border-l border-[#e4e6ea] px-3">Due</div>
              <div className="border-l border-[#e4e6ea]" />
            </div>
            {visibleProjects.map((project, index) => (
              <div key={project.id} className={`grid h-12 grid-cols-[minmax(280px,1fr)_110px_90px_90px_110px_48px] items-center border-t border-[#edf0f3] text-xs hover:bg-[#f5f7fa] ${index === 0 ? "bg-[#f3efff] shadow-[inset_4px_0_0_#7b68ee]" : "bg-white"}`}>
                <button onClick={() => router.push(`/project/${project.id}`)} className="col-span-5 grid h-full grid-cols-[minmax(280px,1fr)_110px_90px_90px_110px] items-center text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#d7d1ff]">
                  <span className="min-w-0 px-3">
                    <span className="block truncate font-black text-[#20242a]">{project.name}</span>
                    <span className="mt-1 block h-1.5 rounded-full bg-[#e4e7ec]"><span className="block h-full rounded-full bg-[#7b68ee]" style={{ width: `${project.progress}%` }} /></span>
                  </span>
                  <span className="border-l border-[#e5e7eb] px-3"><Chip tone={project.tone}>{project.health}</Chip></span>
                  <span className="flex items-center border-l border-[#e5e7eb] px-3"><Avatar initials={project.owner} /></span>
                  <span className="border-l border-[#e5e7eb] px-3 font-black text-[#68707d]">{project.tasks}</span>
                  <span className="border-l border-[#e5e7eb] px-3 font-black text-[#68707d]">{project.due}</span>
                </button>
                <button onClick={() => { setSelectedProject(project); setDialog("actions"); }} className="flex h-full items-center justify-center border-l border-[#e5e7eb] text-[#a2a9b5] hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#d7d1ff]"><MoreHorizontal size={14} /></button>
              </div>
            ))}
            {visibleProjects.length === 0 && <div className="px-3 py-8 text-center text-sm font-bold text-[#8f96a3]">No projects match the current filters.</div>}
            </div>
          </div>
        </Panel>

        <aside className="space-y-4">
          <Panel title="Portfolio health">
            <div className="space-y-3">
              {["Delivery confidence", "Team capacity", "Budget fit"].map((item, index) => (
                <div key={item}>
                  <div className="mb-1 flex justify-between text-xs font-black text-[#68707d]"><span>{item}</span><span>{[82, 64, 91][index]}%</span></div>
                  <div className="h-1.5 rounded-full bg-[#e4e7ec]"><div className="h-full rounded-full bg-[#7b68ee]" style={{ width: `${[82, 64, 91][index]}%` }} /></div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Pinned templates" icon={<CheckCircle2 size={16} />}>
            <div className="space-y-2">
              {["Software delivery", "Bug triage", "Release checklist"].map((item) => (
                <button key={item} onClick={() => { setNewProjectName(item); setDialog("template"); }} className="flex h-9 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-left text-xs font-black text-[#20242a] hover:bg-white">
                  {item}
                  <CirclePlus size={13} className="text-[#7b68ee]" />
                </button>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setDialog(null)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">{dialog === "project" ? "Create project" : dialog === "actions" ? "Project actions" : "Template preview"}</h2>
              <button onClick={() => setDialog(null)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            {dialog === "project" && <><input value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createProject(); }} autoFocus placeholder="Project name" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[#7b68ee]" /><div className="mt-3 flex justify-end"><PrimaryButton onClick={createProject}>Create locally</PrimaryButton></div></>}
            {dialog === "template" && <><p className="text-sm font-semibold text-[#68707d]">Template selected: {newProjectName}. Start a local project from this template.</p><div className="mt-3 flex justify-end"><PrimaryButton onClick={createProject}>Use template</PrimaryButton></div></>}
            {dialog === "actions" && selectedProject && <div className="space-y-2"><p className="text-sm font-black text-[#20242a]">{selectedProject.name}</p><button onClick={() => { setHealthFilter(selectedProject.health); setDialog(null); }} className="h-9 w-full rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] text-sm font-black text-[#68707d] hover:bg-white">Filter by {selectedProject.health}</button><Link href={`/project/${selectedProject.id}`} className="flex h-9 items-center justify-center rounded-[8px] bg-[#7b68ee] text-sm font-black text-white">Open project</Link></div>}
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
