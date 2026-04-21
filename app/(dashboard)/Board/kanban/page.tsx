"use client";

import React, { useState } from "react";
import { useAuthStore } from "../../../../store";

type TaskType = { id: string; content: string };
type ColumnType = { title: string; tasks: TaskType[] };

const initialData: ColumnType[] = [
  { 
    title: "À faire", 
    tasks: [
      { id: "t1", content: "Définir architecture API" },
      { id: "t2", content: "Créer maquettes Figma" },
      { id: "t3", content: "Installer Tailwind" }
    ] 
  },
  { 
    title: "En cours", 
    tasks: [
      { id: "t4", content: "Développement de la sidebar" },
      { id: "t5", content: "Intégration d'Axios" }
    ] 
  },
  { 
    title: "Review", 
    tasks: [
      { id: "t6", content: "Authentification JWT" }
    ] 
  },
  { 
    title: "Terminé", 
    tasks: [
      { id: "t7", content: "Initier le projet Next.js" },
      { id: "t8", content: "Configuration du backend Django" }
    ] 
  },
];

export default function KanbanBoardPage() {
  const user = useAuthStore((state: any) => state.user);
  const [columns, setColumns] = useState<ColumnType[]>(initialData);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string, sourceColIndex: number) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColIndex", sourceColIndex.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetColIndex: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColIndex = parseInt(e.dataTransfer.getData("sourceColIndex"), 10);

    if (sourceColIndex === targetColIndex) {
      setDraggedTaskId(null);
      return;
    }

    setColumns((prevCols) => {
      const newCols = [...prevCols];
      
      // Find the task in the source column
      const taskIndex = newCols[sourceColIndex].tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevCols;
      
      const [movedTask] = newCols[sourceColIndex].tasks.splice(taskIndex, 1);
      
      // Append to the target column
      newCols[targetColIndex].tasks.push(movedTask);
      
      return newCols;
    });
    
    setDraggedTaskId(null);
  };

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Board Kanban</h1>
          <p className="text-sm text-zinc-500">Suivi des tâches en temps réel</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition shadow-sm">
            Filtrer
          </button>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition shadow-sm">
            + Ajouter une tâche
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column, colIndex) => (
          <div key={column.title} className="flex min-w-[300px] flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                {column.title} <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600">{column.tasks.length}</span>
              </h2>
              <button className="text-zinc-400 hover:text-zinc-900">•••</button>
            </div>

            {/* Drop Zone */}
            <div 
              className={`flex flex-col gap-3 rounded-2xl p-3 min-h-[500px] border-2 transition-colors duration-200 ${
                draggedTaskId ? "border-zinc-300 bg-zinc-200/40 border-dashed" : "border-transparent bg-zinc-200/50"
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, colIndex)}
            >
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, colIndex)}
                  onDragEnd={() => setDraggedTaskId(null)}
                  className={`cursor-move rounded-xl bg-white p-4 shadow-sm border border-zinc-200 transition-all hover:shadow-md hover:border-zinc-300 active:scale-95 ${
                    draggedTaskId === task.id ? "opacity-50 scale-95" : "opacity-100"
                  }`}
                >
                  <div className="mb-3 flex gap-2">
                    <span className="h-1.5 w-8 rounded-full bg-zinc-900"></span>
                  </div>
                  <p className="text-sm font-medium text-zinc-900">{task.content}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-600 ring-2 ring-white">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400">2 jrs</span>
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
