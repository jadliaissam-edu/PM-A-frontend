"use client";

import React, { useState } from "react";

export default function ReleaseManagementPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const releases = [
    { 
      version: "v2.1.0", 
      status: "Released", 
      date: "20 Avril 2024", 
      author: "Admin",
      notes: "Ajout du tableau de bord projet, du chat et des notifications. Amélioration de la sécurité MFA.",
      items: ["Dashboards Projets", "Interface Chat", "Système Notifications", "Audit via API"]
    },
    { 
      version: "v2.0.1", 
      status: "Released", 
      date: "15 Avril 2024", 
      author: "Hassine",
      notes: "Correction de bugs mineurs sur le board Kanban et optimisation des performances SQL.",
      items: ["Bugfix Kanban", "Optimisation DB", "Refonte UI Profil"]
    },
    { 
      version: "v2.0.0-rc", 
      status: "Draft", 
      date: "En attente", 
      author: "Snofy",
      notes: "Préparation de la version majeure avec intégration complète du backend Django.",
      items: ["Core API Integration", "Enterprise Dashboard", "Module Sprints"]
    },
    { 
      version: "v1.5.0", 
      status: "Archived", 
      date: "01 Mars 2024", 
      author: "System",
      notes: "Ancienne version stable du MVP.",
      items: ["MVP Basic", "Auth simple"]
    },
  ];

  const filteredReleases = activeFilter === "all" ? releases : releases.filter(r => r.status.toLowerCase() === activeFilter);

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Gestion des Releases</h1>
          <p className="text-sm text-zinc-500">Suivez le cycle de vie de vos versions et déploiements</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
            Journal de bord (Raw)
          </button>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition">
            + Créer une Release
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Release List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 mb-4">
            {["all", "released", "draft", "archived"].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  activeFilter === f ? "bg-zinc-900 text-white" : "bg-white text-zinc-400 hover:text-zinc-600 border border-zinc-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredReleases.map((release) => (
              <div key={release.version} className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-zinc-900">{release.version}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      release.status === 'Released' ? 'bg-green-50 text-green-700' :
                      release.status === 'Draft' ? 'bg-blue-50 text-blue-700' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {release.status}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 font-medium">{release.date}</span>
                </div>
                
                <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                  {release.notes}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {release.items.map(item => (
                    <span key={item} className="bg-zinc-50 border border-zinc-100 text-zinc-500 px-2 py-1 rounded-lg text-[10px] font-medium">
                      #{item}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                   <div className="flex items-center gap-2">
                     <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                       {release.author.charAt(0)}
                     </div>
                     <span className="text-xs text-zinc-500">Par {release.author}</span>
                   </div>
                   <button className="text-xs font-bold text-zinc-900 hover:underline">
                     Voir les détails
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
            <h2 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-widest">Statistiques</h2>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">Stabilité</span>
                    <span className="text-zinc-900 font-bold">99.8%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 w-[99%]"></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">Couverture Tests</span>
                    <span className="text-zinc-900 font-bold">84%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 w-[84%]"></div>
                  </div>
               </div>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6 text-white">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Prochain Déploiement</p>
            <p className="text-2xl font-bold mt-2">Prévu le 24 Avril</p>
            <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
              La v2.2.0 inclura le système de gestion des membres et les rapports PDF.
            </p>
            <div className="mt-8 h-12 w-12 rounded-full border-4 border-zinc-800 border-t-white animate-spin"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
