"use client";

import React, { useState } from "react";
import { useAuthStore } from "../../store";

export default function SprintPlanningPage() {
  const user = useAuthStore((state) => state.user);
  const [isSprintActive, setIsSprintActive] = useState(true);

  // Example data
  const backlogItems = [
    { id: "PM-101", title: "Intégration API de paiement", priority: "High", points: 8 },
    { id: "PM-102", title: "Refonte du menu mobile", priority: "Medium", points: 3 },
    { id: "PM-103", title: "Optimisation des images", priority: "Low", points: 2 },
    { id: "PM-104", title: "Export PDF des rapports", priority: "High", points: 5 },
  ];

  const activeSprintItems = [
    { id: "PM-45", title: "Mise en place de MFA", status: "In Progress", points: 5 },
    { id: "PM-48", title: "Dashboard Enterprise", status: "Done", points: 13 },
  ];

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Sprint & Backlog</h1>
          <p className="text-sm text-zinc-500">Planifiez vos cycles de travail et gérez vos priorités</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
            Importer des tickets
          </button>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition">
            + Créer un sprint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Active Sprint or Empty State */}
        <div className="space-y-6">
          <div className="flex items-center justify-between items-baseline mb-2">
            <h2 className="text-lg font-bold text-zinc-900">Sprint Actif</h2>
            <span className="text-xs font-medium text-zinc-500">Cycle : 2 semaines</span>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md border border-zinc-200">
            {isSprintActive ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="font-bold text-zinc-900">Sprint 4 : Security & UI</h3>
                    <p className="text-xs text-zinc-400 mt-1">12 - 26 Avril • 18 tickets restants</p>
                  </div>
                  <button className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-900 hover:bg-zinc-200 transition">
                    Terminer
                  </button>
                </div>

                <div className="space-y-3">
                  {activeSprintItems.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between bg-zinc-50 rounded-xl p-3 border border-transparent hover:border-zinc-200 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-zinc-400">{item.id}</span>
                        <p className="text-sm font-medium text-zinc-900">{item.title}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                   <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-500">Progression globale</span>
                    <span className="font-bold text-zinc-900">45%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 w-[45%]"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="text-4xl mb-4">🧊</span>
                <p className="text-sm font-medium text-zinc-700">Aucun sprint actif</p>
                <p className="text-xs text-zinc-500 mt-1">Faites glisser des tickets depuis le backlog pour démarrer.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Backlog */}
        <div className="space-y-6">
          <div className="flex items-center justify-between items-baseline mb-2">
            <h2 className="text-lg font-bold text-zinc-900">Backlog de Produit</h2>
            <span className="text-xs font-medium text-zinc-500">{backlogItems.length} items</span>
          </div>

          <div className="rounded-2xl bg-zinc-200/50 p-4 space-y-3 min-h-[500px]">
            {backlogItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200 hover:shadow-md transition cursor-grab active:cursor-grabbing">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono font-bold text-zinc-400">{item.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.priority === 'High' ? 'bg-red-50 text-red-600' : 
                    item.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 
                    'bg-zinc-100 text-zinc-600'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    <div className="h-5 w-5 rounded-full bg-zinc-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-zinc-600">
                      JS
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded">
                    {item.points} pts
                  </span>
                </div>
              </div>
            ))}
            <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-300 rounded-xl text-sm font-medium text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition mt-2">
              + Ajouter au backlog
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
