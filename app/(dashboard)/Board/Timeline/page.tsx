"use client";

import { CalendarDays, CirclePlus, Filter, MoreHorizontal, Search } from "lucide-react";
import { Avatar, Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import { Suspense, useState, type ReactNode, useEffect } from "react";
import { projectService } from "@/services/project.service";
import { useSearchParams } from "next/navigation";

type TimelineStatus = "IN PROGRESS" | "REVIEW" | "TO DO" | "BLOCKED";
type TimelineRange = "Month" | "Quarter" | "Half";
type TimelineItem = {
  id: string;
  name: string;
  owner: string;
  status: TimelineStatus;
  start: number; // percentage from start of range
  span: number; // percentage width
  color: string;
  due: string;
};
type Milestone = {
  id: string;
  title: string;
  date: string;
  status: "Done" | "Open" | "At risk";
};

function TimelineBoardContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId");

  const [items, setItems] = useState<TimelineItem[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState<TimelineItem | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [today, setToday] = useState(false);
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [range, setRange] = useState<TimelineRange>("Quarter");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TimelineStatus>("All");
  const [ownerFilter, setOwnerFilter] = useState("All");

  useEffect(() => {
    if (!projectId) return;

    const fetchTimelineData = async () => {
      setLoading(true);
      try {
        const [tickets, releases] = await Promise.all([
          projectService.listProjectTickets(projectId),
          projectService.listReleases(projectId)
        ]);

        // Map tickets to timeline items
        const mappedItems: TimelineItem[] = tickets.map((t: any, index: number) => {
          // Simple heuristic for start/span since real dates might be missing
          const start = (index * 10) % 60;
          const span = 15 + (index % 3) * 10;
          
          return {
            id: t.ticket_key || String(t.id),
            name: t.title,
            owner: t.assignee_initials || "??",
            status: mapStatus(t.status_display),
            start,
            span,
            color: statusColor(mapStatus(t.status_display)),
            due: t.due_date ? new Date(t.due_date).toLocaleDateString() : "No due date"
          };
        });

        // Map releases to milestones
        const mappedMilestones: Milestone[] = releases.map((r: any) => ({
          id: String(r.id),
          title: r.version || r.tag || "Release",
          date: r.target_date || "No date",
          status: r.status === 'Released' ? 'Done' : 'Open'
        }));

        setItems(mappedItems);
        setMilestones(mappedMilestones);
      } catch (err) {
        console.error("Failed to fetch timeline data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [projectId]);

  const mapStatus = (status: string): TimelineStatus => {
    status = status?.toUpperCase() || "";
    if (status.includes("PROGRESS")) return "IN PROGRESS";
    if (status.includes("REVIEW")) return "REVIEW";
    if (status.includes("TODO") || status.includes("FAIRE")) return "TO DO";
    if (status.includes("BLOCKED") || status.includes("BLOQUÉ")) return "BLOCKED";
    return "TO DO";
  };

  const owners = Array.from(new Set(items.map((item) => item.owner)));
  const weeks = range === "Month" ? ["W1", "W2", "W3", "W4"] : range === "Quarter" ? ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"] : ["M1", "M2", "M3", "M4", "M5", "M6"];
  
  const filteredItems = items.filter((item) => {
    const matchesSearch = `${item.id} ${item.name} ${item.owner} ${item.status}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesOwner = ownerFilter === "All" || item.owner === ownerFilter;
    return matchesSearch && matchesStatus && matchesOwner;
  });

  const visibleMilestones = milestones.filter((milestone) => `${milestone.title} ${milestone.date}`.toLowerCase().includes(query.toLowerCase()));
  
  const clearFilters = () => {
    setQuery("");
    setStatusFilter("All");
    setOwnerFilter("All");
  };

  if (!projectId) {
    return (
      <WorkspacePage>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-zinc-500 font-medium text-lg">Veuillez sélectionner un projet pour voir la Timeline.</p>
        </div>
      </WorkspacePage>
    );
  }

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Timeline"
        subtitle="Product / Sprint Backlog / calendar planning"
        badge={`${range} view`}
        actions={
          <>
            <GhostButton onClick={() => setToday((current) => !current)}>Today</GhostButton>
            <PrimaryButton onClick={() => setMilestoneOpen(true)}><span className="inline-flex items-center gap-1"><CirclePlus size={14} /> Milestone</span></PrimaryButton>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Panel title="Roadmap timeline" icon={<CalendarDays size={16} />} action={<GhostButton onClick={() => setShowFilter((current) => !current)}><span className="inline-flex items-center gap-1"><Filter size={13} /> Filter</span></GhostButton>}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="flex h-8 w-full min-w-0 items-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2.5 sm:w-auto sm:min-w-[240px]">
              <Search size={14} className="text-[#8f96a3]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roadmap..." className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold outline-none placeholder:text-[#8f96a3]" />
            </div>
            {(["Month", "Quarter", "Half"] as TimelineRange[]).map((item) => (
              <button key={item} onClick={() => setRange(item)} className={`h-8 rounded-[7px] px-2.5 text-[11px] font-black ${range === item ? "border border-[#dfe3e8] bg-white text-[#20242a] shadow-sm" : "text-[#68707d] hover:bg-white"}`}>{item}</button>
            ))}
            {(query || statusFilter !== "All" || ownerFilter !== "All") && <button onClick={clearFilters} className="h-8 rounded-[7px] px-2.5 text-[11px] font-black text-[#7b68ee] hover:bg-[#f3efff]">Clear</button>}
          </div>
          {showFilter && (
            <div className="mb-3 grid gap-2 rounded-[9px] border border-[#dfe3e8] bg-[#fbfbfd] p-3 lg:grid-cols-2">
              <FilterGroup title="Status">
                {(["All", "TO DO", "IN PROGRESS", "REVIEW", "BLOCKED"] as Array<"All" | TimelineStatus>).map((status) => (
                  <button key={status} onClick={() => setStatusFilter(status)} className={`h-7 rounded-[7px] px-2 text-[11px] font-black ${statusFilter === status ? "bg-white text-[#20242a] shadow-sm ring-1 ring-[#dfe3e8]" : "text-[#68707d] hover:bg-white"}`}>{status}</button>
                ))}
              </FilterGroup>
              <FilterGroup title="Owner">
                {["All", ...owners].map((owner) => (
                  <button key={owner} onClick={() => setOwnerFilter(owner)} className={`h-7 rounded-[7px] px-2 text-[11px] font-black ${ownerFilter === owner ? "bg-white text-[#20242a] shadow-sm ring-1 ring-[#dfe3e8]" : "text-[#68707d] hover:bg-white"}`}>{owner}</button>
                ))}
              </FilterGroup>
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              <div className={`grid h-9 items-center border-b border-[#dfe3e8] bg-[#f8f9fb] text-[10px] font-black uppercase text-[#68707d]`} style={{ gridTemplateColumns: `260px repeat(${weeks.length}, minmax(0, 1fr))` }}>
                <div className="px-3">Task</div>
                {weeks.map((week) => (
                  <div key={week} className="border-l border-[#e4e6ea] px-2 text-center">{week}</div>
                ))}
              </div>
              <div className="divide-y divide-[#edf0f3]">
                {loading ? (
                  <p className="p-8 text-center text-zinc-400">Loading timeline data...</p>
                ) : filteredItems.map((item) => (
                  <div key={item.id} className={`grid h-[52px] grid-cols-[260px_1fr] items-center transition ${selected?.id === item.id ? "bg-[#f3efff] shadow-[inset_4px_0_0_#7b68ee]" : "bg-white hover:bg-[#f7f8fb]"}`}>
                    <button onClick={() => setSelected(item)} className="flex min-w-0 items-center gap-2 px-3 text-left">
                      <Avatar initials={item.owner} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-[#20242a]">{item.name}</p>
                        <p className="text-[10px] font-black text-[#8f96a3]">{item.id} · due {item.due}</p>
                      </div>
                    </button>
                    <div className={`relative h-full border-l border-[#e4e6ea] bg-[linear-gradient(to_right,#edf0f3_1px,transparent_1px)] ${today ? "bg-[#fbfaff]" : ""}`} style={{ backgroundSize: `${100 / weeks.length}% 100%` }}>
                      <button onClick={() => setSelected(item)} className={`absolute top-3 flex h-7 items-center rounded-[5px] px-2 text-left text-[10px] font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.color} ${selected?.id === item.id ? "ring-2 ring-[#d7d1ff]" : ""}`} style={{ left: `${item.start}%`, width: `${Math.max(item.span, 10)}%` }}>
                        {item.status}
                      </button>
                    </div>
                  </div>
                ))}
                {!loading && filteredItems.length === 0 && <div className="flex h-24 items-center justify-center bg-white text-sm font-bold text-[#8f96a3]">No roadmap items match the current filters.</div>}
              </div>
            </div>
          </div>
        </Panel>

        <aside className="space-y-4">
          <Panel title="Milestones" action={<MoreHorizontal size={15} className="text-[#a2a9b5]" />}>
            <div className="space-y-2">
              {visibleMilestones.map((item) => (
                <button key={item.id} onClick={() => setSelectedMilestone(item)} className={`w-full rounded-[8px] border p-3 text-left hover:bg-white ${selectedMilestone?.id === item.id ? "border-[#d7d1ff] bg-[#f3efff]" : "border-[#edf0f3] bg-[#f7f8fb]"}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-[#20242a]">{item.title}</p>
                    <Chip tone={item.status === "Done" ? "green" : item.status === "At risk" ? "red" : "purple"}>{item.status}</Chip>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-[#8f96a3]">{item.date}</p>
                </button>
              ))}
              {visibleMilestones.length === 0 && <p className="rounded-[8px] border border-dashed border-[#dfe3e8] p-3 text-xs font-bold text-[#8f96a3]">No matching milestones.</p>}
            </div>
          </Panel>
        </aside>
      </div>
    </WorkspacePage>
  );
}

function statusColor(status: TimelineStatus) {
  return status === "IN PROGRESS" ? "bg-[#7b68ee]" : status === "REVIEW" ? "bg-[#1090e0]" : status === "BLOCKED" ? "bg-[#e5484d]" : "bg-[#f8ae00]";
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-black uppercase text-[#8f96a3]">{title}</p>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

export default function TimelineBoardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TimelineBoardContent />
    </Suspense>
  );
}

