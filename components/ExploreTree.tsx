"use client";

import React, { useState } from "react";
import { 
  Building2, 
  LayoutGrid, 
  ChevronRight, 
  ChevronDown, 
  FolderKanban, 
  Users,
  Settings,
  FileText,
  ExternalLink
} from "lucide-react";
import { projectService } from "@/services/project.service";
import { orgService } from "@/services/org.service";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  status: string;
  board_id: string;
}

interface Workspace {
  id: string;
  name: string;
  projects: Project[];
}

interface Organization {
  id: string;
  name: string;
  workspaces: Workspace[];
}

export default function ExploreTree({ data }: { data: Organization[] }) {
  const [expandedOrgs, setExpandedOrgs] = useState<Record<string, boolean>>({});
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Record<string, boolean>>({});

  const toggleOrg = (id: string) => {
    setExpandedOrgs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleWorkspace = (id: string) => {
    setExpandedWorkspaces(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [creatingProjectIn, setCreatingProjectIn] = useState<string | null>(null);
  const [creatingDocIn, setCreatingDocIn] = useState<string | null>(null);
  const [creatingWorkspaceIn, setCreatingWorkspaceIn] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateWorkspace = async (orgId: string) => {
    if (!newWorkspaceName.trim()) return;
    setIsSubmitting(true);
    try {
      await orgService.createWorkspace({
        name: newWorkspaceName,
        organization: orgId
      });
      setNewWorkspaceName("");
      setCreatingWorkspaceIn(null);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create workspace", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async (workspaceId: string) => {
    if (!newProjectName.trim()) return;
    setIsSubmitting(true);
    try {
      await projectService.createProject({
        name: newProjectName,
        workspace_id: workspaceId
      });
      setNewProjectName("");
      setCreatingProjectIn(null);
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to create project", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateDoc = async (projectId: string) => {
    if (!newDocTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await projectService.createProjectDocument(projectId, {
        title: newDocTitle,
        content: "# " + newDocTitle + "\n\nStart writing..."
      });
      setNewDocTitle("");
      setCreatingDocIn(null);
      alert("Document created successfully!");
    } catch (error) {
      console.error("Failed to create document", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-zinc-50 border-2 border-dashed border-zinc-200">
        <Building2 className="mb-4 text-zinc-300" size={48} />
        <h3 className="text-xl font-bold text-zinc-900">No Organizations Found</h3>
        <p className="mt-1 text-sm text-zinc-500">Create your first organization to start managing spaces and projects.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((org) => (
        <div key={org.id} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-900/5">
          {/* Org Header */}
          <div 
            onClick={() => toggleOrg(org.id)}
            className="flex cursor-pointer items-center justify-between bg-zinc-50/50 p-5 transition hover:bg-zinc-100/50 border-b border-zinc-200/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/10">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-900">{org.name}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                  <span>{org.workspaces?.length || 0} Workspaces</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
                  <span>Enterprise Account</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-2 mr-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-[8px] font-bold text-zinc-600">
                    U{i}
                  </div>
                ))}
              </div>
              <button className="hidden rounded-xl bg-white p-2 text-zinc-500 shadow-sm hover:text-zinc-900 lg:block border border-zinc-200">
                <Settings size={16} />
              </button>
              <div className="text-zinc-400">
                {expandedOrgs[org.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </div>
          </div>

          {/* Workspaces List */}
          {expandedOrgs[org.id] && (
            <div className="divide-y divide-zinc-100 bg-white">
              {org.workspaces?.length > 0 ? (
                org.workspaces.map((workspace) => (
                  <div key={workspace.id} className="p-2">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWorkspace(workspace.id);
                      }}
                      className="group flex cursor-pointer items-center justify-between rounded-2xl p-4 transition hover:bg-zinc-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-200 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600">
                          <LayoutGrid size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 group-hover:text-zinc-900">{workspace.name}</p>
                          <p className="text-xs text-zinc-500">{workspace.projects?.length || 0} Active Projects</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-blue-50/50 px-3 py-1 text-[10px] font-bold text-blue-600 border border-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                          Explore
                        </span>
                        <div className="text-zinc-400 group-hover:text-zinc-900">
                           {expandedWorkspaces[workspace.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                      </div>
                    </div>

                    {/* Projects List */}
                    {expandedWorkspaces[workspace.id] && (
                      <div className="ml-14 mr-4 mt-2 mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {workspace.projects?.length > 0 ? (
                          workspace.projects.map((project) => (
                            <Link 
                              key={project.id}
                              href={`/project/${project.id}/board`}
                              className="group/project flex flex-col items-start rounded-2xl border border-zinc-100 bg-[#FCFCFC] p-4 transition-all hover:bg-white hover:border-zinc-900/10 hover:shadow-xl hover:shadow-black/5"
                            >
                              <div className="mb-4 flex w-full items-start justify-between">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/5 text-zinc-600 transition group-hover/project:bg-zinc-900 group-hover/project:text-white">
                                  <FolderKanban size={16} />
                                </div>
                                <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${project.status === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-zinc-100 text-zinc-500"}`}>
                                  {project.status}
                                </span>
                              </div>
                              <h4 className="mb-1 text-sm font-bold text-zinc-900">{project.name}</h4>
                              <p className="mb-4 text-xs text-zinc-500">Board mode active</p>
                              <div className="flex w-full items-center justify-between pt-3 border-t border-zinc-50 text-zinc-400 group-hover/project:text-zinc-900 transition">
                                <span className="text-[10px] font-bold">Open Kanban</span>
                                <div className="flex gap-2">
                                   <button 
                                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCreatingDocIn(project.id); }}
                                     className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-900 transition"
                                     title="Add Document"
                                   >
                                      <FileText size={12} />
                                   </button>
                                   <ExternalLink size={12} />
                                </div>
                              </div>
                              {creatingDocIn === project.id && (
                                <div className="mt-3 w-full p-3 bg-zinc-50 rounded-xl border border-zinc-200 animate-in fade-in slide-in-from-top-2">
                                   <input 
                                     autoFocus
                                     type="text"
                                     placeholder="Doc title..."
                                     className="mb-2 w-full bg-transparent text-[11px] font-bold outline-none border-b border-zinc-200"
                                     value={newDocTitle}
                                     onChange={(e) => setNewDocTitle(e.target.value)}
                                     onKeyDown={(e) => e.key === "Enter" && handleCreateDoc(project.id)}
                                   />
                                   <div className="flex gap-1">
                                      <button 
                                        onClick={() => handleCreateDoc(project.id)}
                                        className="flex-1 bg-zinc-900 text-white text-[9px] font-bold py-1 rounded"
                                      >
                                        Create
                                      </button>
                                      <button 
                                        onClick={() => setCreatingDocIn(null)}
                                        className="px-2 bg-zinc-200 text-zinc-600 text-[9px] font-bold py-1 rounded"
                                      >
                                        X
                                      </button>
                                   </div>
                                </div>
                              )}
                            </Link>
                          ))
                        ) : (
                          <div className="col-span-full py-6 text-center rounded-2xl bg-zinc-50/50 border border-dashed border-zinc-200">
                             <p className="text-xs text-zinc-400">No projects in this workspace.</p>
                          </div>
                        )}
                        
                        {creatingProjectIn === workspace.id ? (
                          <div className="flex flex-col items-start rounded-2xl border border-zinc-900/10 bg-white p-4 shadow-xl">
                            <input 
                              autoFocus
                              type="text"
                              placeholder="Project name..."
                              className="mb-3 w-full bg-transparent text-sm font-bold outline-none border-b border-zinc-200 pb-1"
                              value={newProjectName}
                              onChange={(e) => setNewProjectName(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleCreateProject(workspace.id)}
                            />
                            <div className="flex w-full items-center gap-2">
                              <button 
                                onClick={() => handleCreateProject(workspace.id)}
                                disabled={isSubmitting || !newProjectName.trim()}
                                className="flex-1 rounded-lg bg-zinc-900 py-1.5 text-[10px] font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                              >
                                {isSubmitting ? "Creating..." : "Save Project"}
                              </button>
                              <button 
                                onClick={() => setCreatingProjectIn(null)}
                                className="rounded-lg bg-zinc-100 px-3 py-1.5 text-[10px] font-bold text-zinc-500 hover:bg-zinc-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setCreatingProjectIn(workspace.id)}
                            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 p-4 text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                          >
                             <FolderKanban size={20} className="mb-2" />
                             <span className="text-[10px] font-bold uppercase">+ New Project</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-sm text-zinc-500 mb-4">No workspaces yet.</p>
                  {creatingWorkspaceIn === org.id ? (
                    <div className="mx-auto max-w-xs space-y-3 animate-in fade-in slide-in-from-top-2">
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Workspace name..."
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-bold outline-none focus:border-zinc-900 focus:bg-white transition"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateWorkspace(org.id)}
                      />
                      <div className="flex gap-2 text-xs font-bold uppercase">
                        <button 
                          onClick={() => handleCreateWorkspace(org.id)}
                          disabled={isSubmitting || !newWorkspaceName.trim()}
                          className="flex-1 rounded-xl bg-zinc-900 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
                        >
                          {isSubmitting ? "Creating..." : "Save"}
                        </button>
                        <button 
                          onClick={() => setCreatingWorkspaceIn(null)}
                          className="px-4 rounded-xl bg-zinc-100 py-2 text-zinc-500 hover:bg-zinc-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setCreatingWorkspaceIn(org.id)}
                      className="text-xs font-bold text-zinc-900 underline uppercase tracking-widest hover:text-zinc-600 transition"
                    >
                      Add Workspace
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
