"use client";

import React, { useState } from "react";

export default function AuditPage() {
  const [search, setSearch] = useState("");

  const auditLogs = [
    { id: 1, user: "hassine", action: "Login", detail: "Connexion réussie depuis 192.168.1.1", status: "Success", timestamp: "2024-04-20 10:15:32" },
    { id: 2, user: "admin", action: "Create Project", detail: "Projet 'PM-A' créé", status: "Success", timestamp: "2024-04-20 09:42:01" },
    { id: 3, user: "snofy", action: "Delete Workspace", detail: "Tentative de suppression échouée (Permission)", status: "Error", timestamp: "2024-04-19 22:11:15" },
    { id: 4, user: "system", action: "Backup", detail: "Sauvegarde journalière terminée", status: "Success", timestamp: "2024-04-19 04:00:00" },
    { id: 5, user: "admin", action: "Update MFA", detail: "MFA activé pour l'utilisateur 'hassine'", status: "Warning", timestamp: "2024-04-18 15:30:22" },
  ];

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Logs d&apos;audit</h1>
          <p className="text-sm text-zinc-500">Historique complet des actions système et de sécurité</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
            Exporter en CSV
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-zinc-200">
        <div className="flex-1 min-w-[300px] relative">
          <span className="absolute left-3 top-2.5 text-zinc-400">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par utilisateur, action ou détail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 outline-none focus:border-zinc-900 transition text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-sm outline-none">
            <option>Tous les statuts</option>
            <option>Success</option>
            <option>Warning</option>
            <option>Error</option>
          </select>
          <select className="px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-sm outline-none">
            <option>Dernières 24h</option>
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-zinc-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Utilisateur</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Action</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Détail</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Statut</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Horodatage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-50 transition cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-zinc-900 text-[10px] font-bold text-white flex items-center justify-center">
                      {log.user.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-zinc-900">{log.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-700 font-medium">{log.action}</td>
                <td className="px-6 py-4 text-sm text-zinc-500">{log.detail}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    log.status === 'Success' ? 'bg-green-50 text-green-700' :
                    log.status === 'Warning' ? 'bg-orange-50 text-orange-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400 font-mono">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination placeholder */}
        <div className="bg-zinc-50 px-6 py-4 flex items-center justify-between border-t border-zinc-200">
          <p className="text-xs text-zinc-500">Affichage de 5 sur 152 logs</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-zinc-200 rounded text-xs font-medium text-zinc-400 cursor-not-allowed">Précédent</button>
            <button className="px-3 py-1 bg-white border border-zinc-200 rounded text-xs font-medium text-zinc-900">Suivant</button>
          </div>
        </div>
      </div>
    </main>
  );
}
