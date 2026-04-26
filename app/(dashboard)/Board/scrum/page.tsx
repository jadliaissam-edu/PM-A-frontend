"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { projectService, Project, Sprint, BacklogItem } from "@/services/project.service";
import { sprintService, SprintReport } from "@/services/sprint.service";
import { Loader2, CheckCircle, Flame, Target, TrendingUp } from "lucide-react";

export default function ScrumPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-zinc-400" size={36} />
      </div>
    }>
      <ScrumBoardPage />
    </Suspense>
  );
}

function ScrumBoardPage() {
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get("projectId");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectIdParam || "");
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [sprintItems, setSprintItems] = useState<BacklogItem[]>([]);
  const [report, setReport] = useState<SprintReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getProjects().then((data) => {
      setProjects(data);
      if (!selectedProjectId && data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedProjectId) { setLoading(false); return; }
    loadData();
  }, [selectedProjectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sprints, backlog] = await Promise.all([
        sprintService.getSprints(selectedProjectId),
        projectService.getProjectBacklog(selectedProjectId),
      ]);
      const active = sprints.find((s) => s.status === "active") || null;
      setActiveSprint(active);

      // Filter backlog items for the active sprint if available
      if (active) {
        const sprintItems = backlog.filter((b) => b.ticket.sprint === active.id);
        setSprintItems(sprintItems.length > 0 ? sprintItems : backlog.slice(0, 5));
        try {
          const rep = await sprintService.getSprintReport(selectedProjectId, active.id);
          setReport(rep);
        } catch { /* report may not exist yet */ }
      } else {
        setSprintItems(backlog.slice(0, 5));
      }
    } catch (e) {
      console.error("Failed to load scrum data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!activeSprint) return;
    try {
      await sprintService.completeSprint(selectedProjectId, activeSprint.id);
      await loadData();
    } catch (e) { console.error(e); }
  };

  const daysLeft = activeSprint
    ? Math.max(0, Math.round((new Date(activeSprint.end_date).getTime() - Date.now()) / 86400000))
    : null;

  const progress = report
    ? Math.round((report.completed_tickets / Math.max(report.total_tickets, 1)) * 100)
    : 0;

  const statusColor = (status: string) => {
    if (status === "done" || status === "closed") return "text-emerald-600";
    if (status === "in_progress") return "text-blue-600";
    return "text-zinc-400";
  };

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Sprint Actif (Scrum)</h1>
          <p className="text-sm text-zinc-500">
            {activeSprint
              ? `${activeSprint.name} • ${daysLeft} jour${daysLeft !== 1 ? "s" : ""} restant${daysLeft !== 1 ? "s" : ""}`
              : "Aucun sprint actif"}
          </p>
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
          </select>
          {activeSprint && (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition"
            >
              <CheckCircle size={16} />
              Finaliser le Sprint
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-zinc-400" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Sprint Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avancement */}
            <div className="rounded-2xl bg-white p-6 shadow-md shadow-zinc-200/50 border border-zinc-200">
              <h2 className="mb-4 text-lg font-bold text-zinc-900">Avancement</h2>

              {activeSprint ? (
                <>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-zinc-500">
                      {report ? `${report.completed_tickets} / ${report.total_tickets} tickets` : "—"}
                    </span>
                    <span className="font-semibold text-zinc-900">{progress}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full bg-zinc-900 transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {activeSprint.goal && (
                    <div className="mt-5 rounded-xl bg-zinc-50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={14} className="text-zinc-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Objectif</span>
                      </div>
                      <p className="text-sm font-medium text-zinc-700 italic">"{activeSprint.goal}"</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                  <Flame size={32} className="mb-3 text-zinc-200" />
                  <p className="text-sm">Aucun sprint actif</p>
                </div>
              )}
            </div>

            {/* Stats */}
            {report && (
              <div className="rounded-2xl bg-zinc-900 p-6 text-white border border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-zinc-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Vélocité</h2>
                </div>
                <p className="text-4xl font-black">{report.velocity}</p>
                <p className="text-xs text-zinc-400 mt-1">pts complétés</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Terminés</p>
                    <p className="text-xl font-black mt-1">{report.completed_tickets}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Restants</p>
                    <p className="text-xl font-black mt-1">{report.incomplete_tickets}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sprint Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-zinc-900">
              Items du Sprint {activeSprint ? `— ${activeSprint.name}` : ""}
            </h2>
            <div className="space-y-3">
              {sprintItems.length > 0 ? (
                sprintItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-zinc-200 hover:border-zinc-400 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-zinc-300">
                        #{item.ticket.id.slice(0, 6)}
                      </span>
                      <p className="text-sm font-semibold text-zinc-900">{item.ticket.title}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {item.ticket.estimate_story_points != null && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                          {item.ticket.estimate_story_points} pts
                        </span>
                      )}
                      <span className={`text-xs font-medium capitalize ${statusColor(item.ticket.status)}`}>
                        {item.ticket.status?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-16 text-zinc-400">
                  <p className="text-sm font-medium">Aucun ticket dans ce sprint</p>
                  <p className="text-xs mt-1">Ajoutez des tickets depuis la page Backlog</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
