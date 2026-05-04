"use client";

import React from "react";

export default function TimelineBoardPage() {
  const months = ["Avril", "Mai", "Juin"];
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const tasks = [
    { name: "Design System", start: 2, duration: 10, color: "bg-zinc-900" },
    { name: "Auth Backend", start: 8, duration: 15, color: "bg-zinc-700" },
    { name: "Frontend Setup", start: 1, duration: 5, color: "bg-zinc-400" },
    { name: "API Integration", start: 18, duration: 20, color: "bg-zinc-500" },
  ];

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Timeline du Projet</h1>
          <p className="text-sm text-zinc-500">Planification globale et jalons</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
            Aujourd&apos;hui
          </button>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition">
            + Ajouter un Jalon
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-md shadow-zinc-200/50 overflow-hidden">
        {/* Timeline Header */}
        <div className="flex border-b border-zinc-100 pb-4">
          <div className="w-64 flex-shrink-0 font-bold text-zinc-900">Tâches</div>
          <div className="flex flex-grow">
            {months.map(m => (
              <div key={m} className="flex-1 text-center text-xs font-bold uppercase tracking-wider text-zinc-400 border-l border-zinc-50">
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Body */}
        <div className="relative mt-4 space-y-2">
          {tasks.map((task) => (
            <div key={task.name} className="flex items-center group">
              <div className="w-64 flex-shrink-0 text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                {task.name}
              </div>
              <div className="relative flex-grow h-10 bg-zinc-50/50 rounded-lg">
                <div 
                  className={`absolute h-6 top-2 rounded-full ${task.color} shadow-sm transition hover:scale-[1.02] cursor-pointer group-hover:shadow-md flex items-center px-4`}
                  style={{ 
                    left: `${(task.start / 90) * 100}%`, 
                    width: `${(task.duration / 90) * 100}%` 
                  }}
                >
                  <span className="text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {task.duration} jrs
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Vertical grid lines (simulated) */}
          <div className="absolute top-0 bottom-0 left-64 right-0 flex pointer-events-none">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 border-l border-zinc-100 border-dashed"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex gap-6 px-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-zinc-900"></div>
          <span className="text-xs text-zinc-500 font-medium">Critique</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-zinc-500"></div>
          <span className="text-xs text-zinc-500 font-medium">Standard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-zinc-300"></div>
          <span className="text-xs text-zinc-500 font-medium">Secondaire</span>
        </div>
      </div>
    </main>
  );
}
