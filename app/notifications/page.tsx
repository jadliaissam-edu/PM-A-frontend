"use client";

import React, { useState } from "react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const notifications = [
    { id: 1, type: "mention", user: "admin", text: "vous a mentionné dans le ticket PM-12", time: "Il y a 5 min", unread: true },
    { id: 2, type: "system", user: "Système", text: "La sauvegarde hebdomadaire a été effectuée avec succès.", time: "Il y a 2h", unread: true },
    { id: 3, type: "invite", user: "snofy", text: "vous invite à rejoindre l'espace 'Marketing'", time: "Il y a 5h", unread: false },
    { id: 4, type: "status", user: "admin", text: "a marqué le ticket PM-45 comme 'Terminé'", time: "Hier", unread: false },
    { id: 5, type: "alert", user: "Sécurité", text: "Nouvelle connexion détectée depuis Paris, FR", time: "Hier", unread: false },
  ];

  const filteredNotifications = activeTab === "all" ? notifications : notifications.filter(n => n.unread);

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Notifications</h1>
            <p className="text-sm text-zinc-500">Restez informé de l&apos;activité de vos projets</p>
          </div>
          <button className="text-sm font-medium text-zinc-900 hover:underline">
            Tout marquer comme lu
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-zinc-200 pb-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 text-sm font-medium transition ${activeTab === "all" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            Toutes
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`pb-3 text-sm font-medium transition ${activeTab === "unread" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            Non lues <span className="ml-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] text-white">2</span>
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm border transition hover:shadow-md ${n.unread ? "border-zinc-900/10 bg-zinc-50/50" : "border-zinc-200"}`}
            >
              <div className="mt-1">
                {n.type === "mention" && <span className="text-xl">💬</span>}
                {n.type === "system" && <span className="text-xl">⚙️</span>}
                {n.type === "invite" && <span className="text-xl">📩</span>}
                {n.type === "status" && <span className="text-xl">✅</span>}
                {n.type === "alert" && <span className="text-xl">⚠️</span>}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    <span className="font-bold text-zinc-900">{n.user}</span>
                    <span className="text-zinc-600 ml-1">{n.text}</span>
                  </p>
                  {n.unread && <span className="h-2 w-2 rounded-full bg-zinc-900"></span>}
                </div>
                <p className="mt-1 text-xs text-zinc-400">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
