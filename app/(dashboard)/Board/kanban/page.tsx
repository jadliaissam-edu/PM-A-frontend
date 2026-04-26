"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { projectService, Project, ProjectBoard, BoardColumn, Ticket } from "@/services/project.service";
import { Loader2, Plus, LayoutGrid } from "lucide-react";

export default function KanbanPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-zinc-400" size={36} />
      </div>
    }>
      <KanbanBoardPage />
    </Suspense>
  );
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-rose-500",
  high: "bg-orange-400",
  medium: "bg-amber-400",
  low: "bg-zinc-300",
};

const TYPE_LABEL: Record<string, string> = {
  task: "Tâche",
  bug: "Bug",
  feature: "Feature",
  story: "Story",
};

function KanbanBoardPage() {
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get("projectId");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectIdParam || "");
  const [board, setBoard] = useState<ProjectBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [dragSourceColId, setDragSourceColId] = useState<string | null>(null);

  // Load projects
  useEffect(() => {
    projectService.getProjects().then((data) => {
      setProjects(data);
      if (!selectedProjectId && data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    });
  }, []);

  // Load board when project changes
  useEffect(() => {
    if (!selectedProjectId) {
      setLoading(false);
      return;
    }
    loadBoard();
  }, [selectedProjectId]);

  const loadBoard = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjectBoard(selectedProjectId);
      setBoard(data);
    } catch (e) {
      console.error("Failed to load board", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (ticketId: string, sourceColId: string) => {
    setDraggedTicketId(ticketId);
    setDragSourceColId(sourceColId);
  };

  const handleDrop = async (targetColId: string) => {
    if (!board || !draggedTicketId || !dragSourceColId || dragSourceColId === targetColId) {
      setDraggedTicketId(null);
      setDragSourceColId(null);
      return;
    }

    // Optimistic update
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.map((col) => {
      if (col.id === dragSourceColId) {
        return { ...col, tickets: (col.tickets || []).filter((t) => t.id !== draggedTicketId) };
      }
      if (col.id === targetColId) {
        const ticket = board.columns
          .flatMap((c) => c.tickets || [])
          .find((t) => t.id === draggedTicketId);
        return { ...col, tickets: ticket ? [...(col.tickets || []), ticket] : col.tickets };
      }
      return col;
    });
    setBoard(newBoard);

    try {
      await projectService.moveTicket(selectedProjectId, draggedTicketId, targetColId);
    } catch (e) {
      console.error("Failed to move ticket", e);
      await loadBoard(); // Revert on error
    } finally {
      setDraggedTicketId(null);
      setDragSourceColId(null);
    }
  };

  const handleCreateTicket = async (colId: string, colName: string) => {
    const title = window.prompt(`Nouveau ticket dans "${colName}" :`);
    if (!title?.trim()) return;
    try {
      await projectService.createTicket(selectedProjectId, {
        title,
        current_column: colId,
        priority: "medium",
        type: "task",
      });
      await loadBoard();
    } catch (e) {
      console.error("Failed to create ticket", e);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Board Kanban</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Glissez-déposez les tickets entre colonnes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <LayoutGrid size={14} className="text-zinc-400" />
            <select
              className="bg-white border border-zinc-300 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 outline-none shadow-sm"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              {projects.length === 0 && <option>Aucun projet</option>}
            </select>
          </div>
        </div>
      </div>

      {/* Board */}
      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="animate-spin text-zinc-400" size={36} />
        </div>
      ) : !board ? (
        <div className="flex h-96 items-center justify-center text-zinc-400 text-sm">
          Aucun board trouvé pour ce projet.
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-6">
          {board.columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              isDragActive={!!draggedTicketId}
              onDragStart={(ticketId) => handleDragStart(ticketId, col.id)}
              onDrop={() => handleDrop(col.id)}
              onAddTicket={() => handleCreateTicket(col.id, col.name)}
              draggedTicketId={draggedTicketId}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function KanbanColumn({
  column,
  isDragActive,
  onDragStart,
  onDrop,
  onAddTicket,
  draggedTicketId,
}: {
  column: BoardColumn;
  isDragActive: boolean;
  onDragStart: (ticketId: string) => void;
  onDrop: () => void;
  onAddTicket: () => void;
  draggedTicketId: string | null;
}) {
  const tickets = column.tickets || [];

  return (
    <div className="flex min-w-[300px] flex-col gap-3">
      {/* Column Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{column.name}</h2>
          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-black text-zinc-600">
            {tickets.length}
          </span>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`flex flex-col gap-3 rounded-2xl p-3 min-h-[500px] border-2 transition-all duration-200 ${
          isDragActive ? "border-zinc-400 bg-zinc-100 border-dashed" : "border-transparent bg-zinc-200/50"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            isDragging={draggedTicketId === ticket.id}
            onDragStart={() => onDragStart(ticket.id)}
          />
        ))}

        <button
          onClick={onAddTicket}
          className="mt-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-500 hover:border-zinc-800 hover:text-zinc-800 transition"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>
    </div>
  );
}

function TicketCard({
  ticket,
  isDragging,
  onDragStart,
}: {
  ticket: Ticket;
  isDragging: boolean;
  onDragStart: () => void;
}) {
  const dotColor = PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.low;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`cursor-move rounded-xl bg-white p-4 shadow-sm border border-zinc-200 transition-all hover:shadow-md active:scale-95 ${
        isDragging ? "opacity-40 scale-95 rotate-1" : "opacity-100"
      }`}
    >
      {/* Priority dot + type */}
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full flex-shrink-0 ${dotColor}`} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          {TYPE_LABEL[ticket.type] || ticket.type}
        </span>
      </div>

      <p className="text-sm font-semibold text-zinc-900 leading-snug">{ticket.title}</p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-300">#{ticket.id.slice(0, 6)}</span>
        {ticket.estimate_story_points != null && (
          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-black text-zinc-600">
            {ticket.estimate_story_points} pts
          </span>
        )}
      </div>
    </div>
  );
}
