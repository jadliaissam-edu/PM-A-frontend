"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.id || "123";

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Projet #{projectId}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            <span className="text-[10px] font-bold text-green-600 uppercase">Santé : Stable</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900">Refonte E-commerce 2024</h1>
          <p className="text-sm text-zinc-500 mt-1">Développement du frontend et intégration Stripe</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
            Paramètres du projet
          </button>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition">
            Lancer un Sprint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main Stats Row */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
          <p className="text-xs font-bold text-zinc-400 uppercase">Avancement global</p>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-4xl font-bold text-zinc-900">68%</span>
            <span className="text-xs font-medium text-green-600 mb-1">+12% ce mois</span>
          </div>
          <div className="mt-4 h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-900 w-[68%]"></div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
          <p className="text-xs font-bold text-zinc-400 uppercase">Tickets Ouverts</p>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-4xl font-bold text-zinc-900">24</span>
            <span className="text-xs text-zinc-400 mb-1">sur 86 au total</span>
          </div>
          <div className="mt-4 flex gap-1">
            <div className="h-1 flex-1 bg-red-400 rounded-full" title="Critique"></div>
            <div className="h-1 flex-1 bg-orange-400 rounded-full" title="Haute"></div>
            <div className="h-1 flex-2 bg-zinc-200 rounded-full" title="Basse"></div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
          <p className="text-xs font-bold text-zinc-400 uppercase">Temps restant</p>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-4xl font-bold text-zinc-900">12j</span>
            <span className="text-xs text-zinc-400 mb-1">Deadline : 02 Mai</span>
          </div>
          <p className="mt-4 text-xs font-medium text-orange-600">⚠ Attention : 4 tickets critiques</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
          <p className="text-xs font-bold text-zinc-400 uppercase">Vitesse d&apos;équipe</p>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-4xl font-bold text-zinc-900">42</span>
            <span className="text-xs text-zinc-400 mb-1">pts / sprint</span>
          </div>
          <div className="mt-4 h-8 flex items-end gap-1">
             <div className="bg-zinc-100 w-full h-1/2 rounded-t-sm"></div>
             <div className="bg-zinc-200 w-full h-3/4 rounded-t-sm"></div>
             <div className="bg-zinc-300 w-full h-2/3 rounded-t-sm"></div>
             <div className="bg-zinc-900 w-full h-full rounded-t-sm"></div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Team Activity */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-zinc-900">Activité récente</h2>
          <div className="space-y-4">
            {[
              { user: "HT", name: "Hassine", action: "a poussé 3 commits sur", target: "feature/auth", time: "2h" },
              { user: "AP", name: "Admin", action: "a commenté le ticket", target: "PM-12", time: "5h" },
              { user: "SN", name: "Snofy", action: "a déplacé", target: "Ticket #88", text: "dans Terminé", time: "Hier" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 hover:border-zinc-200 transition">
                <div className="h-10 w-10 rounded-full bg-zinc-900 text-xs font-bold text-white flex items-center justify-center flex-shrink-0">
                  {activity.user}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-bold text-zinc-900">{activity.name}</span>
                    <span className="text-zinc-600 ml-1">{activity.action}</span>
                    <span className="font-semibold text-zinc-900 ml-1 underline decoration-zinc-200 underline-offset-4">{activity.target}</span>
                    {activity.text && <span className="text-zinc-600 ml-1">{activity.text}</span>}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Health & Risk */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-zinc-900">Santé du projet</h2>
          <div className="rounded-2xl bg-zinc-900 p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Facteur de risque</p>
              <p className="text-3xl font-bold mt-2">Faible</p>
              <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
                Le projet est en avance sur le planning de 15%. Aucune dépendance critique n&apos;est actuellement bloquée.
              </p>
              <button className="mt-8 w-full bg-white text-zinc-900 py-3 rounded-xl text-sm font-bold hover:bg-zinc-100 transition">
                Voir le rapport complet
              </button>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-12 -right-12 h-48 w-48 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="rounded-2xl bg-white border border-zinc-200 p-6">
             <h3 className="text-sm font-bold text-zinc-900 mb-4">Membres actifs</h3>
             <div className="flex -space-x-3">
                {['HT', 'AP', 'SN', 'JD'].map((m) => (
                   <div key={m} className="h-10 w-10 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-xs font-bold text-zinc-600">
                     {m}
                   </div>
                ))}
                <div className="h-10 w-10 rounded-full bg-zinc-900 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                  +12
                </div>
             </div>
             <p className="mt-6 text-xs text-zinc-500 font-medium">Capacité actuelle : <span className="text-zinc-900">85%</span></p>
          </div>
        </div>
      </div>
    </main>
  );
}
