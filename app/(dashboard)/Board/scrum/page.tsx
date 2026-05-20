"use client";

import { Suspense, useEffect, useState } from "react";
import { projectService } from "@/services/project.service";
import { useSearchParams } from "next/navigation";

interface Sprint {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  goal?: string;
}

interface Ticket {
  id: string;
  ticket_key: string;
  title: string;
  story_points: number;
  status_display: string;
}

function ScrumBoardContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId");

  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchScrumData = async () => {
      setLoading(true);
      try {
        const sprints = await projectService.listSprints(projectId);
        const active = sprints.find((s: any) => s.status === 'active') || sprints[0];
        
        if (active) {
          setActiveSprint(active);
          const ticketsData = await projectService.listProjectTickets(projectId, { sprint: active.id });
          setTickets(ticketsData);
        }
      } catch (err) {
        console.error("Failed to fetch scrum data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScrumData();
  }, [projectId]);

  const calculateProgress = () => {
    if (tickets.length === 0) return 0;
    const completed = tickets.filter(t => t.status_display === 'Done' || t.status_display === 'Terminé').length;
    return Math.round((completed / tickets.length) * 100);
  };

  const totalPoints = tickets.reduce((sum, t) => sum + (t.story_points || 0), 0);

  if (!projectId) {
    return (
      <main className="min-h-screen bg-zinc-100 p-8 flex items-center justify-center">
        <p className="text-zinc-500 font-medium text-lg">Veuillez sélectionner un projet pour voir le Board Scrum.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Sprint Actif (Scrum)</h1>
          {activeSprint ? (
            <p className="text-sm text-zinc-500">
              {activeSprint.name} : {activeSprint.goal || "Aucun objectif défini"} • 
              {new Date(activeSprint.end_date).toLocaleDateString()}
            </p>
          ) : (
            <p className="text-sm text-zinc-500">Aucun sprint actif trouvé</p>
          )}
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
            Backlog
          </button>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition">
            Finaliser le Sprint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sprint Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-md shadow-zinc-200/50">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">Avancement</h2>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-zinc-500">Total : {totalPoints} points</span>
              <span className="font-semibold text-zinc-900">{calculateProgress()}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full bg-zinc-900 transition-all duration-500" style={{ width: `${calculateProgress()}%` }}></div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md shadow-zinc-200/50">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">Burndown Chart</h2>
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50">
              <span className="text-2xl">📉</span>
              <p className="mt-2 text-xs text-zinc-400">Graphique de progression en temps réel</p>
            </div>
          </div>
        </div>

        {/* Current Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900">Items du Sprint</h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-center py-8 text-zinc-400 animate-pulse">Chargement des tickets...</p>
            ) : tickets.length > 0 ? (
              tickets.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-zinc-200 hover:border-zinc-900 transition cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-zinc-400">{item.ticket_key}</span>
                    <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                      {item.story_points || 0} pts
                    </span>
                    <span className={`text-xs font-medium ${item.status_display === 'Terminé' || item.status_display === 'Done' ? 'text-green-600' : 'text-blue-600'}`}>
                      {item.status_display}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 rounded-xl border-2 border-dashed border-zinc-200">
                <p className="text-zinc-400 text-sm">Aucun ticket dans ce sprint</p>
              </div>
            )}
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition">
            + Ajouter au Sprint
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ScrumBoardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScrumBoardContent />
    </Suspense>
  );
}
