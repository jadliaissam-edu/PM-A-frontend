"use client";

import React from "react";
import { useAuthStore } from "../../../store";

export default function KanbanBoardPage() {
  const user = useAuthStore((state) => state.user);

  const columns = [
    { title: "À faire", tasks: ["Définir architecture API", "Créer maquettes Figma", "Installer Tailwind"] },
    { title: "En cours", tasks: ["Développement de la sidebar", "Intégration d'Axios"] },
    { title: "Review", tasks: ["Authentification JWT"] },
    { title: "Terminé", tasks: ["Initier le projet Next.js", "Configuration du backend Django"] },
  ];

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Board Kanban</h1>
          <p className="text-sm text-zinc-500">Suivi des tâches en temps réel</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
            Filtrer
          </button>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition">
            + Ajouter une tâche
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.title} className="flex min-w-[300px] flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                {column.title} <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600">{column.tasks.length}</span>
              </h2>
              <button className="text-zinc-400 hover:text-zinc-900">•••</button>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl bg-zinc-200/50 p-3 min-h-[500px]">
              {column.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="cursor-move rounded-xl bg-white p-4 shadow-sm border border-zinc-200 transition hover:shadow-md hover:border-zinc-300"
                >
                  <div className="mb-3 flex gap-2">
                    <span className="h-1.5 w-8 rounded-full bg-zinc-900"></span>
                  </div>
                  <p className="text-sm font-medium text-zinc-900">{task}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-600 ring-2 ring-white">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400">2 jrs</span>
                  </div>
                </div>
              ))}
              <button className="mt-2 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition">
                <span>+</span> Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
