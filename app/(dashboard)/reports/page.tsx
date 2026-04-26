"use client";

import React, { useEffect, useState } from "react";
import { projectService, Project, ProjectProgressReport } from "@/services/project.service";
import { sprintService, SprintProgressReport } from "@/services/sprint.service";
import { Loader2, BarChart3, TrendingUp, Layers, CheckCircle2 } from "lucide-react";

export default function ReportsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [progressReport, setProgressReport] = useState<ProjectProgressReport | null>(null);
  const [sprintReport, setSprintReport] = useState<SprintProgressReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
        if (data.length > 0) setSelectedProjectId(data[0].id);
        else setLoading(false);
      } catch (e) {
        console.error("Failed to load projects", e);
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    loadReports();
  }, [selectedProjectId]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [progress, sprints] = await Promise.all([
        projectService.getProjectProgressReport(selectedProjectId),
        sprintService.getSprints(selectedProjectId),
      ]);
      setProgressReport(progress);

      // Try to get sprint progress for the active sprint
      const activeSprint = sprints.find((s) => s.status === "active");
      if (activeSprint) {
        try {
          const sr = await sprintService.getSprintProgressReport(selectedProjectId, activeSprint.id);
          setSprintReport(sr);
        } catch { setSprintReport(null); }
      } else {
        setSprintReport(null);
      }
    } catch (e) {
      console.error("Failed to load reports", e);
    } finally {
      setLoading(false);
    }
  };

  const totalTickets = progressReport?.total_tickets || 0;
  const completedTickets = progressReport?.completed_tickets || 0;
  const openTickets = progressReport?.open_tickets || 0;
  const progressPercent = progressReport?.progress_percent || 0;

  const byStatus = progressReport?.tickets_by_status || {};
  const byPriority = progressReport?.tickets_by_priority || {};

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Analyses & Rapports</h1>
          <p className="text-sm text-zinc-500">Visualisez la performance de l'équipe et l'avancement du projet.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="bg-white border border-zinc-300 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 outline-none shadow-sm"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            {projects.length === 0 && <option>Aucun projet</option>}
          </select>
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
            Exporter PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-zinc-400" size={36} />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              { label: "Total Tickets", value: totalTickets.toString(), icon: <BarChart3 size={20} />, color: "text-zinc-900" },
              { label: "Terminés", value: completedTickets.toString(), icon: <CheckCircle2 size={20} />, color: "text-emerald-600" },
              { label: "En cours / Ouverts", value: openTickets.toString(), icon: <Layers size={20} />, color: "text-blue-600" },
              { label: "Progression globale", value: `${progressPercent}%`, icon: <TrendingUp size={20} />, color: "text-zinc-900" },
            ].map((kpi, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-zinc-400">{kpi.icon}</div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{kpi.label}</p>
                </div>
                <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Progress chart */}
            <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-md border border-zinc-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Progression du projet</h2>
                  <p className="text-xs text-zinc-400">Taux de complétion global</p>
                </div>
              </div>

              {/* Big progress bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-500 font-medium">Complétion</span>
                  <span className="font-bold text-zinc-900">{progressPercent}%</span>
                </div>
                <div className="h-4 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* By Status Bars */}
              {Object.keys(byStatus).length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">
                    Répartition par statut
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(byStatus).map(([status, count]) => {
                      const pct = totalTickets > 0 ? Math.round(((count as number) / totalTickets) * 100) : 0;
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-500 capitalize">{status.replace(/_/g, " ")}</span>
                            <span className="font-bold text-zinc-900">{count as number} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-zinc-900 transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Priority breakdown + Sprint */}
            <div className="space-y-6">
              {/* Priority */}
              <div className="rounded-3xl bg-white p-8 shadow-md border border-zinc-200">
                <h2 className="text-lg font-bold text-zinc-900 mb-6">Par priorité</h2>
                <div className="space-y-4">
                  {Object.keys(byPriority).length > 0 ? (
                    Object.entries(byPriority).map(([priority, count]) => {
                      const pct = totalTickets > 0 ? Math.round(((count as number) / totalTickets) * 100) : 0;
                      const color =
                        priority === "critical" ? "bg-rose-500" :
                        priority === "high" ? "bg-orange-400" :
                        priority === "medium" ? "bg-amber-400" :
                        "bg-zinc-300";
                      return (
                        <div key={priority}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-zinc-500 font-medium capitalize">{priority}</span>
                            <span className="font-bold text-zinc-900">{count as number}</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-zinc-400">Aucune donnée de priorité</p>
                  )}
                </div>
              </div>

              {/* Active Sprint report */}
              {sprintReport && (
                <div className="rounded-3xl bg-zinc-900 p-6 text-white">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Sprint Actif</h3>
                  <p className="text-lg font-bold mt-1">{sprintReport.sprint_name}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-400">Progression</span>
                      <span className="font-bold">{sprintReport.progress_percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all"
                        style={{ width: `${sprintReport.progress_percent}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Total pts</p>
                      <p className="text-xl font-black mt-1">{sprintReport.total_points}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Complétés</p>
                      <p className="text-xl font-black mt-1">{sprintReport.completed_points}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Health indicator */}
              <div className="rounded-3xl bg-white p-6 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Santé Globale</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    progressPercent >= 75 ? "text-emerald-600 bg-emerald-50" :
                    progressPercent >= 40 ? "text-amber-600 bg-amber-50" :
                    "text-red-600 bg-red-50"
                  }`}>
                    {progressPercent >= 75 ? "Excellente" : progressPercent >= 40 ? "Bonne" : "Attention"}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {completedTickets} ticket{completedTickets !== 1 ? "s" : ""} terminé{completedTickets !== 1 ? "s" : ""} sur {totalTickets} au total ({progressPercent}% d'avancement).
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
