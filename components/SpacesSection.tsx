"use client";

import React, { useEffect, useState } from "react";
import { LayoutGrid, MoreHorizontal, CirclePlus } from "lucide-react";
import { orgService, Workspace } from "../services/org.service";

export default function SpacesSection({ 
  variant = "grid", 
  isCollapsed = false 
}: { 
  variant?: "grid" | "sidebar";
  isCollapsed?: boolean;
}) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const data = await orgService.getWorkspaces();
        const enriched = data.map((ws, idx) => ({
          ...ws,
          description: ws.description || "Collection of tasks and team project coordination.",
          member_count: ws.member_count || 3,
          task_count: ws.task_count || 12,
          last_updated: ws.last_updated || "Today",
          status: ws.status || "Active",
          color: ws.color || getColorForIdx(idx),
        }));
        setWorkspaces(enriched);
      } catch (error) {
        console.error("Failed to fetch spaces", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, []);

  const getColorForIdx = (idx: number) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-pink-100 text-pink-700",
      "bg-emerald-100 text-emerald-700",
      "bg-amber-100 text-amber-700",
    ];
    return colors[idx % colors.length];
  };

  if (loading) {
    if (variant === "sidebar") {
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-zinc-100 animate-pulse"></div>
          ))}
        </div>
      );
    }
    return (
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-zinc-100 animate-pulse border border-zinc-200"></div>
        ))}
      </div>
    );
  }

  if (workspaces.length === 0) {
    if (variant === "sidebar") return null;
    return (
      <div className="rounded-2xl border-2 border-dashed border-zinc-200 p-8 text-center text-zinc-500">
        <p className="text-sm font-medium">No spaces found.</p>
        <button className="mt-4 text-xs font-bold text-zinc-900 underline">Create your first space</button>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="space-y-1">
        {workspaces.map((space) => (
          <div
            key={space.id}
            title={isCollapsed ? space.name : ""}
            className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 cursor-pointer ${isCollapsed ? "justify-center px-1" : ""}`}
          >
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${space.color}`}>
              <LayoutGrid size={14} />
            </div>
            {!isCollapsed && <span className="truncate font-medium">{space.name}</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {workspaces.map((space) => (
        <div
          key={space.id}
          className="group relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-3 ${space.color}`}>
                <LayoutGrid size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{space.name}</h3>
                <span className="text-xs font-medium text-zinc-500">
                  {space.member_count} members
                </span>
              </div>
            </div>

            <button className="text-zinc-400 hover:text-zinc-900 transition">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <p className="mb-3 text-sm leading-relaxed text-zinc-600 line-clamp-2">
            {space.description}
          </p>

          <div className="mb-4 flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <span>{space.task_count} tasks</span>
            <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
            <span>{space.last_updated}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${space.color}`}>
              {space.status}
            </span>

            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                  U{i}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
