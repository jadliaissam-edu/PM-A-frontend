"use client";

import React from "react";

export default function ScrumBoardPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Sprint Actif (Scrum)</h1>
          <p className="text-sm text-zinc-500">Sprint 1 : Initialisation Système • 12 jours restants</p>
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
              <span className="text-zinc-500">Total : 150 points</span>
              <span className="font-semibold text-zinc-900">65%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full w-[65%] bg-zinc-900"></div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md shadow-zinc-200/50">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">Burndown Chart</h2>
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50">
              <span className="text-2xl">📉</span>
              <p className="mt-2 text-xs text-zinc-400">Graphique de progression</p>
            </div>
          </div>
        </div>

        {/* Current Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900">Items du Sprint</h2>
          <div className="space-y-3">
            {[
              { id: "PM-12", title: "Configuration infrastructure Docker", points: 8, status: "Terminé" },
              { id: "PM-15", title: "API Authentification & JWT", points: 5, status: "En cours" },
              { id: "PM-18", title: "Modèles Orgs et Workspaces", points: 3, status: "À faire" },
              { id: "PM-22", title: "Interface Dashboard Premium", points: 13, status: "En cours" },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-zinc-200 hover:border-zinc-900 transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono font-bold text-zinc-400">{item.id}</span>
                  <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                    {item.points} pts
                  </span>
                  <span className={`text-xs font-medium ${item.status === 'Terminé' ? 'text-green-600' : item.status === 'En cours' ? 'text-blue-600' : 'text-zinc-400'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition">
            + Ajouter au Sprint
          </button>
        </div>
      </div>
    </main>
  );
}
