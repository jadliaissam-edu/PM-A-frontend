"use client";

import React from "react";

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Analyses & Rapports</h1>
          <p className="text-sm text-zinc-500">Visualisez la performance de vos équipes et l&apos;avancement des projets.</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
            Générer Rapport PDF
          </button>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition">
            Configuration Auto
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Vélocité Moyenne", value: "38 pts", trend: "+12%", color: "text-zinc-900" },
          { label: "Temps de Résolution", value: "2.4 jrs", trend: "-5%", color: "text-green-600" },
          { label: "Tickets Fermés", value: "142", trend: "+22%", color: "text-zinc-900" },
          { label: "Taux de Blocage", value: "4.2%", trend: "-1%", color: "text-green-600" },
        ].map((kpi, idx) => (
          <div key={idx} className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{kpi.label}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
              <span className="text-[10px] font-bold text-green-600">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Chart: Velocity */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-md border border-zinc-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Vélocité de l&apos;équipe</h2>
              <p className="text-xs text-zinc-400">Points complétés par sprint</p>
            </div>
            <select className="bg-zinc-50 border border-zinc-200 text-[10px] font-bold rounded-lg px-2 py-1 outline-none">
              <option>6 derniers mois</option>
              <option>12 derniers mois</option>
            </select>
          </div>
          
          <div className="flex h-64 items-end gap-2 pb-2 border-b border-zinc-100">
            {[35, 42, 38, 45, 52, 48, 55, 50, 42, 58, 60, 65].map((val, idx) => (
              <div key={idx} className="group relative flex-1">
                <div 
                  className="bg-zinc-900 rounded-t-lg transition hover:bg-zinc-700 cursor-pointer w-full"
                  style={{ height: `${val}%` }}
                >
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {val} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-zinc-400">
             <span>JAN</span>
             <span>MAR</span>
             <span>MAI</span>
             <span>JUL</span>
             <span>SEP</span>
             <span>NOV</span>
          </div>
        </div>

        {/* Breakdown: Ticket Status */}
        <div className="rounded-3xl bg-white p-8 shadow-md border border-zinc-200">
          <h2 className="text-lg font-bold text-zinc-900 mb-8">Répartition des tâches</h2>
          <div className="space-y-6">
             {[
               { label: "Développement", val: 65, color: "bg-zinc-900" },
               { label: "Design", val: 15, color: "bg-zinc-400" },
               { label: "QA / Tests", val: 12, color: "bg-zinc-200" },
               { label: "Autres", val: 8, color: "bg-zinc-100" },
             ].map((item) => (
               <div key={item.label}>
                 <div className="flex justify-between text-xs mb-2">
                   <span className="font-medium text-zinc-500">{item.label}</span>
                   <span className="font-bold text-zinc-900">{item.val}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                   <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
          
          <div className="mt-12 pt-6 border-t border-zinc-100">
             <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-zinc-900">Santé Globale</p>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">Excellente</span>
             </div>
             <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
               92% des objectifs de Q1 ont été atteints sans retard majeur.
             </p>
          </div>
        </div>
      </div>
    </main>
  );
}
