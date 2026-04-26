"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  FolderKanban, 
  Search, 
  Filter, 
  CirclePlus, 
  MoreHorizontal,
  Activity,
  Users,
  Clock3,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  List,
  X,
  Loader2,
  ChevronLeft,
  Archive,
  MoreVertical
} from "lucide-react";
import { projectService, Project } from "@/services/project.service";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'Tous' | 'Actifs' | 'Archivés'>('Tous');
  
  // Creation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const activeOrgId = localStorage.getItem("activeOrgId") || undefined;
      const data = await projectService.getProjects(activeOrgId);
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    
    // Fetch workspaces for the creation modal via org tree
    const fetchWorkspaces = async () => {
      try {
        const response = await import("@/lib/api").then(m => m.api.get("/orgs/tree/"));
        const allWorkspaces: any[] = [];
        (response.data as any[]).forEach((org: any) => {
          (org.workspaces || []).forEach((ws: any) => {
            allWorkspaces.push({ ...ws, orgName: org.name });
          });
        });
        setWorkspaces(allWorkspaces);
        if (allWorkspaces.length > 0) setSelectedWorkspace(allWorkspaces[0].id);
      } catch (e) {
        console.error("Error fetching workspaces", e);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !selectedWorkspace) return;
    setIsSubmitting(true);
    try {
      await projectService.createProject({
        name: newProjectName,
        description: newProjectDesc,
        workspace_id: selectedWorkspace
      });
      setIsModalOpen(false);
      setNewProjectName("");
      setNewProjectDesc("");
      fetchProjects();
    } catch (e) {
      console.error("Error creating project", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.organization_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'Tous' || 
                      (activeTab === 'Actifs' && p.status === 'active') ||
                      (activeTab === 'Archivés' && p.status === 'archived');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in duration-700 relative">
      <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 uppercase">Mes Projets</h1>
          <p className="mt-2 text-[15px] font-medium text-zinc-500">Gérez vos espaces de travail et suivez l&apos;avancement de vos équipes.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex rounded-2xl bg-zinc-100 p-1.5 shadow-inner">
            <button 
              onClick={() => setViewMode('grid')}
              className={`rounded-xl p-2.5 transition ${viewMode === 'grid' ? "bg-white text-zinc-900 shadow-xl" : "text-zinc-400 hover:text-zinc-600"}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`rounded-xl p-2.5 transition ${viewMode === 'list' ? "bg-white text-zinc-900 shadow-xl" : "text-zinc-400 hover:text-zinc-600"}`}
            >
              <List size={20} />
            </button>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 rounded-[1.5rem] bg-zinc-900 px-8 py-4 text-sm font-black text-white shadow-2xl shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:-translate-y-1 active:translate-y-0 active:scale-95"
          >
            <CirclePlus size={20} />
            NOUVEAU PROJET
          </button>
        </div>
      </div>

      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Projets" value={projects.length.toString()} icon={<FolderKanban size={20} />} color="zinc" />
        <StatCard title="En Cours" value={projects.filter(p => p.status === 'active').length.toString()} icon={<Activity size={20} />} color="emerald" />
        <StatCard title="Equipes" value="12" icon={<Users size={20} />} color="blue" />
        <StatCard title="Echéances" value="3" icon={<Clock3 size={20} />} color="amber" />
      </div>

      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm">
        <div className="flex gap-8 border-b border-zinc-50/50">
          {(['Tous', 'Actifs', 'Archivés'] as const).map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition border-b-4 ${activeTab === tab ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-600"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un projet..."
              className="w-72 rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 py-3.5 text-sm font-medium outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 shadow-sm transition hover:shadow-xl active:scale-95 group">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-funnel group-hover:rotate-12 transition-transform"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 animate-pulse rounded-[2.5rem] bg-zinc-200/40" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-6"}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} viewMode={viewMode} onRefresh={fetchProjects} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-24 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-zinc-200 shadow-xl ring-1 ring-zinc-200 group">
             <FolderKanban size={48} className="group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-black text-zinc-900 uppercase">Aucun projet disponible</h3>
          <p className="mt-3 text-[15px] font-medium text-zinc-500 max-w-sm">Commencez par créer votre premier projet pour gérer vos tâches et collaborer avec votre équipe.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-10 rounded-2xl bg-zinc-900 px-10 py-4 text-sm font-black text-white shadow-2xl transition hover:bg-zinc-800 hover:-translate-y-1 active:scale-95"
          >
             CRÉER MON PREMIER PROJET
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto">
           <div 
             className="w-full max-w-lg bg-white rounded-[3.5rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-zinc-100 animate-in zoom-in-95 duration-500"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-3xl font-black text-zinc-900 uppercase">Projet Stratégique</h2>
                 <button onClick={() => setIsModalOpen(false)} className="h-12 w-12 rounded-full bg-zinc-50 text-zinc-400 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all transform hover:rotate-90">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-10">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-2">Identification du projet</label>
                    <input 
                      required
                      type="text" 
                      className="w-full rounded-[1.5rem] bg-zinc-50 border-2 border-transparent px-8 py-5 text-sm font-bold text-zinc-900 outline-none transition focus:bg-white focus:border-zinc-900 shadow-inner"
                      placeholder="Nom du projet..."
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                    />
                 </div>

                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-2">Affectation Workspace</label>
                    <div className="relative">
                      <select 
                        required
                        className="w-full rounded-[1.5rem] bg-zinc-50 border-2 border-transparent px-8 py-5 text-sm font-bold text-zinc-900 outline-none transition focus:bg-white focus:border-zinc-900 appearance-none shadow-inner"
                        value={selectedWorkspace}
                        onChange={(e) => setSelectedWorkspace(e.target.value)}
                      >
                         {workspaces.map(ws => (
                           <option key={ws.id} value={ws.id}>{ws.orgName} / {ws.name}</option>
                         ))}
                      </select>
                      <ChevronRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-2">Vision & Objectifs</label>
                    <textarea 
                      className="w-full rounded-[1.5rem] bg-zinc-50 border-2 border-transparent px-8 py-5 text-sm font-bold text-zinc-900 outline-none transition focus:bg-white focus:border-zinc-900 min-h-[140px] shadow-inner"
                      placeholder="Décrivez les enjeux..."
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                    />
                 </div>

                 <button 
                   disabled={isSubmitting}
                   type="submit" 
                   className="w-full rounded-[1.8rem] bg-zinc-900 py-6 text-sm font-black text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all hover:bg-zinc-800 hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-4 active:translate-y-0 active:scale-95"
                 >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CirclePlus size={20} />}
                    INITIALISER LE PROJET
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    zinc: "bg-zinc-100 text-zinc-600 ring-zinc-500/5",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-500/10",
    blue: "bg-blue-50 text-blue-600 ring-blue-500/10",
    amber: "bg-amber-50 text-amber-600 ring-amber-500/10"
  };
  
  return (
    <div className="flex items-center gap-5 rounded-[2.5rem] bg-white p-7 shadow-sm border border-zinc-100 transition-all hover:shadow-2xl hover:-translate-y-1 group">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-3 ring-1 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{title}</p>
        <p className="text-3xl font-black text-zinc-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function ProjectCard({ project, viewMode, onRefresh }: { project: Project, viewMode: 'grid' | 'list', onRefresh: () => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await projectService.archiveProject(project.id);
      onRefresh();
      setShowMenu(false);
    } catch (err) {
      console.error("Failed to archive project", err);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="relative group flex items-center justify-between rounded-[2rem] border border-zinc-100 bg-white p-5 transition-all hover:border-zinc-900 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1">
        <Link href={`/project/${project.id}/board`} className="flex-1 flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-zinc-900 text-white shadow-lg shadow-zinc-900/20">
            <FolderKanban size={24} />
          </div>
          <div>
            <h4 className="text-[16px] font-black text-zinc-900">{project.name}</h4>
            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mt-0.5">{project.organization_name} • {project.workspace_name}</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
           <div className="hidden items-center gap-6 sm:flex text-right">
              <div>
                 <p className="text-[9px] uppercase font-black tracking-[0.2em] text-zinc-400 mb-1">Status</p>
                 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${project.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                    <div className={`h-1 w-1 rounded-full ${project.status === 'active' ? 'bg-emerald-600' : 'bg-zinc-400'}`}></div>
                    <span className="text-[9px] font-black uppercase tracking-widest">{project.status}</span>
                 </div>
              </div>
           </div>
           
           <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all shadow-inner"
              >
                <MoreVertical size={18} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white p-2 shadow-2xl border border-zinc-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={handleArchive}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <Archive size={16} />
                    Archiver le projet
                  </button>
                </div>
              )}
           </div>
           
           <Link href={`/project/${project.id}/board`} className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all">
             <ChevronRight size={20} />
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2.8rem] border border-zinc-100 bg-white p-8 shadow-sm transition-all hover:border-zinc-900 hover:shadow-3xl hover:shadow-black/10 hover:-translate-y-3">
      <Link href={`/project/${project.id}/board`} className="absolute inset-0 z-0" />
      
      <div className="relative z-10 mb-10 flex items-start justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-[1.8rem] bg-zinc-900 text-white shadow-2xl shadow-zinc-900/30 group-hover:scale-110 group-hover:rotate-3 transition-all">
          <FolderKanban size={32} />
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }}
            className="h-12 w-12 rounded-full hover:bg-zinc-50 flex items-center justify-center transition-colors pointer-events-auto"
          >
             {/* The SVG matching their request (triple dots) */}
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-more-horizontal text-zinc-300 group-hover:text-zinc-600"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-[1.5rem] bg-white p-2 shadow-2xl border border-zinc-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
               <button 
                 onClick={handleArchive}
                 className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-sm font-black uppercase tracking-widest text-zinc-500 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
               >
                 <Archive size={18} />
                 Archiver
               </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative z-10 mb-8 border-l-4 border-zinc-900 pl-6 pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
           <span className="rounded-lg bg-zinc-100 px-3 py-1 text-[9px] font-black uppercase text-zinc-500 tracking-widest">WS: {project.workspace_name}</span>
           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${project.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
              <div className={`h-1 w-1 rounded-full ${project.status === 'active' ? 'bg-emerald-600' : 'bg-zinc-400'}`} />
              {project.status}
           </span>
        </div>
        <h4 className="text-2xl font-black tracking-tight text-zinc-900 uppercase leading-none">{project.name}</h4>
        <p className="text-sm font-medium text-zinc-500 mt-2 line-clamp-2">{project.description || "Aucune description fournie pour ce projet stratégique."}</p>
      </div>
      
      <div className="relative z-10 mb-10 flex items-center justify-between pointer-events-none">
         <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 shadow-sm">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-[10px] font-black text-white shadow-xl">+3</div>
         </div>
      </div>
      
      <div className="relative z-10 mt-auto flex items-center justify-between pt-8 border-t border-zinc-50 pointer-events-none">
        <div className="flex items-center gap-2.5 text-emerald-500">
          <TrendingUp size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">85% Avancement</span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-inner">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
}
