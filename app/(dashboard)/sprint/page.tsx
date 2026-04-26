"use client";

import React, { useEffect, useState } from "react";
import { projectService, Project, Sprint, BacklogItem } from "@/services/project.service";
import { sprintService, SprintCreate } from "@/services/sprint.service";
import { ticketService } from "@/services/ticket.service";
import { api } from "@/lib/api";
import {
  Loader2, Box, Layers, PlayCircle, CheckCircle, Plus, X, Calendar, Target,
  ChevronLeft, ChevronRight, Flame
} from "lucide-react";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SprintPlanningPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [backlog, setBacklog] = useState<BacklogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal — Create Sprint
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sprintForm, setSprintForm] = useState<SprintCreate>({
    name: "",
    goal: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  // ── Load projects ──────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
        if (data.length > 0) setSelectedProject(data[0]);
        else setLoading(false);
      } catch (e) {
        console.error("Failed to load projects", e);
        setLoading(false);
      }
    };
    init();
  }, []);

  // ── Load project data when selection changes ───────────────────────────────
  useEffect(() => {
    if (!selectedProject) return;
    loadProjectData();
  }, [selectedProject]);

  const loadProjectData = async () => {
    if (!selectedProject) return;
    setLoading(true);
    try {
      const [sprintsData, backlogData] = await Promise.all([
        sprintService.getSprints(selectedProject.id),
        projectService.getProjectBacklog(selectedProject.id),
      ]);
      setSprints(sprintsData);
      setBacklog(backlogData);
    } catch (e) {
      console.error("Failed to load sprint/backlog data", e);
    } finally {
      setLoading(false);
    }
  };

  // ── Create sprint ──────────────────────────────────────────────────────────
  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setFormError(null);
    setIsSubmitting(true);
    try {
      await sprintService.createSprint(selectedProject.id, sprintForm);
      setIsModalOpen(false);
      setSprintForm({ name: "", goal: "", description: "", start_date: "", end_date: "" });
      await loadProjectData();
    } catch (err: any) {
      const data = err?.response?.data;
      setFormError(
        typeof data === "string"
          ? data
          : data?.detail || data?.name?.[0] || "Erreur lors de la création."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Start sprint ───────────────────────────────────────────────────────────
  const handleStartSprint = async (sprintId: string) => {
    if (!selectedProject) return;
    try {
      await sprintService.startSprint(selectedProject.id, sprintId);
      await loadProjectData();
    } catch (e) {
      console.error("Failed to start sprint", e);
    }
  };

  // ── Complete sprint ────────────────────────────────────────────────────────
  const handleCompleteSprint = async (sprintId: string) => {
    if (!selectedProject) return;
    try {
      await sprintService.completeSprint(selectedProject.id, sprintId);
      await loadProjectData();
    } catch (e) {
      console.error("Failed to complete sprint", e);
    }
  };

  // ── Add ticket to backlog ──────────────────────────────────────────────────
  const handleAddToBacklog = async () => {
    if (!selectedProject) return;
    const title = window.prompt("Titre du ticket :");
    if (!title?.trim()) return;
    try {
      const ticket = await ticketService.createTicket(selectedProject.id, {
        title,
        priority: "medium",
        type: "task",
      } as any);
      // Add to backlog
      await api.post(`/projects/${selectedProject.id}/backlog/`, { ticket: ticket.id });
      await loadProjectData();
    } catch (e) {
      console.error("Failed to add to backlog", e);
    }
  };

  const activeSprint = sprints.find((s) => s.status === "active");
  const planningSprints = sprints.filter((s) => s.status === "planning");
  const completedSprints = sprints.filter((s) => s.status === "completed");

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      {/* ── Header ── */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Sprint & Backlog</h1>
          <div className="mt-2 flex items-center gap-2">
            <Layers size={14} className="text-zinc-400" />
            <select
              className="bg-transparent border-none text-sm font-medium text-zinc-600 outline-none cursor-pointer hover:text-zinc-900 transition"
              value={selectedProject?.id || ""}
              onChange={(e) => {
                const p = projects.find((pr) => pr.id === e.target.value);
                if (p) setSelectedProject(p);
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              {projects.length === 0 && <option>Aucun projet</option>}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddToBacklog}
            disabled={!selectedProject}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-40"
          >
            + Ajouter au backlog
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedProject}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition disabled:opacity-40"
          >
            <Plus size={16} />
            Créer un sprint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ── Left: Active Sprint + Planning Sprints ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-zinc-900">Sprint Actif</h2>
            <span className="text-xs font-medium text-zinc-500">Cycle : 2 semaines</span>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md border border-zinc-200">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-500">Chargement du sprint...</p>
              </div>
            ) : activeSprint ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Flame size={14} className="text-orange-500" />
                      <h3 className="font-bold text-zinc-900">{activeSprint.name}</h3>
                    </div>
                    <p className="text-xs text-zinc-400">
                      {new Date(activeSprint.start_date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      →{" "}
                      {new Date(activeSprint.end_date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCompleteSprint(activeSprint.id)}
                    className="flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-bold hover:bg-emerald-100 transition"
                  >
                    <CheckCircle size={14} />
                    Terminer
                  </button>
                </div>

                {activeSprint.goal && (
                  <div className="flex flex-col items-center justify-center py-6 border-b border-zinc-50 border-dashed">
                    <Target size={24} className="text-zinc-300 mb-2" />
                    <p className="text-sm text-zinc-500 font-medium italic text-center">
                      "{activeSprint.goal}"
                    </p>
                  </div>
                )}

                {activeSprint.description && (
                  <p className="text-xs text-zinc-500 leading-relaxed">{activeSprint.description}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="text-4xl mb-4">🧊</span>
                <p className="text-sm font-medium text-zinc-700">Aucun sprint actif</p>
                <p className="text-xs text-zinc-500 mt-1 text-center max-w-xs">
                  Créez un sprint et démarrez-le pour qu'il apparaisse ici.
                </p>
              </div>
            )}
          </div>

          {/* Planning sprints */}
          {!loading && planningSprints.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Sprints planifiés ({planningSprints.length})
              </h3>
              {planningSprints.map((sprint) => (
                <div
                  key={sprint.id}
                  className="rounded-xl bg-white p-4 border border-zinc-200 flex items-center justify-between hover:shadow-sm transition"
                >
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{sprint.name}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {new Date(sprint.start_date).toLocaleDateString("fr-FR")} →{" "}
                      {new Date(sprint.end_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartSprint(sprint.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-zinc-900 text-white px-3 py-1.5 text-xs font-bold hover:bg-zinc-800 transition"
                  >
                    <PlayCircle size={14} />
                    Démarrer
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Completed sprints */}
          {!loading && completedSprints.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Terminés ({completedSprints.length})
              </h3>
              {completedSprints.map((sprint) => (
                <div
                  key={sprint.id}
                  className="rounded-xl bg-zinc-50 px-4 py-3 border border-zinc-100 flex items-center justify-between opacity-60"
                >
                  <p className="text-sm font-medium text-zinc-500 line-through">{sprint.name}</p>
                  <CheckCircle size={14} className="text-emerald-500" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Backlog ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-zinc-900">Backlog de Produit</h2>
            <span className="text-xs font-medium text-zinc-500">{backlog.length} items</span>
          </div>

          <div className="rounded-2xl bg-zinc-200/50 p-4 space-y-3 min-h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-zinc-400" />
              </div>
            ) : backlog.length > 0 ? (
              backlog.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200 hover:shadow-md transition cursor-grab active:cursor-grabbing"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-400">
                      {item.ticket.id.slice(0, 8)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.ticket.priority === "critical"
                          ? "bg-rose-50 text-rose-600"
                          : item.ticket.priority === "high"
                          ? "bg-red-50 text-red-600"
                          : item.ticket.priority === "medium"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {item.ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">{item.ticket.title}</p>
                  {item.ticket.type && (
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">
                      {item.ticket.type}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400 italic text-sm">
                <Box size={32} className="mb-3 text-zinc-300" />
                Le backlog est vide.
              </div>
            )}
            <button
              onClick={handleAddToBacklog}
              disabled={!selectedProject}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-300 rounded-xl text-sm font-medium text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition mt-2 disabled:opacity-40"
            >
              + Ajouter au backlog
            </button>
          </div>
        </div>
      </div>

      {/* ── Create Sprint Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm">
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-10 shadow-2xl border border-zinc-100 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-zinc-900">Nouveau Sprint</h2>
              <button
                onClick={() => { setIsModalOpen(false); setFormError(null); }}
                className="h-10 w-10 rounded-full bg-zinc-50 text-zinc-400 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSprint} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Nom du sprint <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Sprint 1 – Core Features"
                  className="w-full rounded-2xl bg-zinc-50 border-2 border-transparent px-6 py-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition"
                  value={sprintForm.name}
                  onChange={(e) => setSprintForm({ ...sprintForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Objectif du sprint
                </label>
                <input
                  type="text"
                  placeholder="Livrer le module d'auth complet"
                  className="w-full rounded-2xl bg-zinc-50 border-2 border-transparent px-6 py-4 text-sm font-medium text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition"
                  value={sprintForm.goal}
                  onChange={(e) => setSprintForm({ ...sprintForm, goal: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    <Calendar size={10} className="inline mr-1" />Début <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full rounded-2xl bg-zinc-50 border-2 border-transparent px-5 py-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition"
                    value={sprintForm.start_date}
                    onChange={(e) => setSprintForm({ ...sprintForm, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    <Calendar size={10} className="inline mr-1" />Fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full rounded-2xl bg-zinc-50 border-2 border-transparent px-5 py-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition"
                    value={sprintForm.end_date}
                    onChange={(e) => setSprintForm({ ...sprintForm, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Détails sur ce sprint..."
                  rows={2}
                  className="w-full rounded-2xl bg-zinc-50 border-2 border-transparent px-6 py-4 text-sm font-medium text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition resize-none"
                  value={sprintForm.description}
                  onChange={(e) => setSprintForm({ ...sprintForm, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-zinc-900 py-5 text-sm font-black text-white shadow-xl hover:bg-zinc-800 transition disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                CRÉER LE SPRINT
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
