"use client";

import { CalendarDays, CirclePlus, Filter, MoreHorizontal, Search } from "lucide-react";
import { Avatar, Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import { useState, type ReactNode } from "react";

type TimelineStatus = "IN PROGRESS" | "REVIEW" | "TO DO" | "BLOCKED";
type TimelineRange = "Month" | "Quarter" | "Half";
type TimelineItem = {
  id: string;
  name: string;
  owner: string;
  status: TimelineStatus;
  start: number;
  span: number;
  color: string;
  due: string;
};
type Milestone = {
  id: string;
  title: string;
  date: string;
  status: "Done" | "Open" | "At risk";
};

const initialTimelineItems: TimelineItem[] = [
  { id: "PM-41", name: "Design system finalization", owner: "AA", status: "IN PROGRESS", start: 4, span: 18, color: "bg-[#7b68ee]", due: "May 8" },
  { id: "PM-56", name: "Auth backend hardening", owner: "HT", status: "REVIEW", start: 18, span: 22, color: "bg-[#1090e0]", due: "May 14" },
  { id: "PM-63", name: "Task list fidelity pass", owner: "MK", status: "TO DO", start: 32, span: 16, color: "bg-[#f8ae00]", due: "May 19" },
  { id: "PM-72", name: "Release readiness", owner: "SN", status: "BLOCKED", start: 52, span: 28, color: "bg-[#e5484d]", due: "Jun 2" },
];

const initialMilestones: Milestone[] = [
  { id: "MS-1", title: "Design signoff", date: "May 6", status: "Done" },
  { id: "MS-2", title: "API freeze", date: "May 17", status: "Open" },
  { id: "MS-3", title: "Release candidate", date: "Jun 4", status: "Open" },
];

export default function TimelineBoardPage() {
  const [items, setItems] = useState<TimelineItem[]>(initialTimelineItems);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState<TimelineItem | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [today, setToday] = useState(false);
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [range, setRange] = useState<TimelineRange>("Quarter");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TimelineStatus>("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("May 24");
  const owners = Array.from(new Set(items.map((item) => item.owner)));
  const weeks = range === "Month" ? ["W1", "W2", "W3", "W4"] : range === "Quarter" ? ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"] : ["M1", "M2", "M3", "M4", "M5", "M6"];
  const filteredItems = items.filter((item) => {
    const matchesSearch = `${item.id} ${item.name} ${item.owner} ${item.status} ${item.due}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesOwner = ownerFilter === "All" || item.owner === ownerFilter;
    return matchesSearch && matchesStatus && matchesOwner;
  });
  const visibleMilestones = milestones.filter((milestone) => `${milestone.title} ${milestone.date} ${milestone.status}`.toLowerCase().includes(query.toLowerCase()));
  const todayPosition = range === "Month" ? 56 : range === "Quarter" ? 36 : 48;
  const addMilestone = () => {
    const title = newMilestoneTitle.trim();
    if (!title) return;
    const milestone: Milestone = { id: `MS-${milestones.length + 1}`, title, date: newMilestoneDate, status: "Open" };
    setMilestones((current) => [milestone, ...current]);
    setSelectedMilestone(milestone);
    setNewMilestoneTitle("");
    setMilestoneOpen(false);
  };
  const updateItem = (itemId: string, patch: Partial<TimelineItem>) => {
    setItems((current) => current.map((item) => item.id === itemId ? { ...item, ...patch } : item));
    setSelected((current) => current?.id === itemId ? { ...current, ...patch } : current);
  };
  const toggleMilestoneStatus = (milestoneId: string) => {
    setMilestones((current) => current.map((milestone) => {
      if (milestone.id !== milestoneId) return milestone;
      const status = milestone.status === "Done" ? "Open" : milestone.status === "Open" ? "At risk" : "Done";
      return { ...milestone, status };
    }));
    setSelectedMilestone((current) => {
      if (!current || current.id !== milestoneId) return current;
      const status = current.status === "Done" ? "Open" : current.status === "Open" ? "At risk" : "Done";
      return { ...current, status };
    });
  };
  const clearFilters = () => {
    setQuery("");
    setStatusFilter("All");
    setOwnerFilter("All");
  };

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
                {filteredItems.map((item) => (
                  <div key={item.id} className={`grid h-[52px] grid-cols-[260px_1fr] items-center transition ${selected?.id === item.id ? "bg-[#f3efff] shadow-[inset_4px_0_0_#7b68ee]" : "bg-white hover:bg-[#f7f8fb]"}`}>
                    <button onClick={() => setSelected(item)} className="flex min-w-0 items-center gap-2 px-3 text-left">
                      <Avatar initials={item.owner} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-[#20242a]">{item.name}</p>
                        <p className="text-[10px] font-black text-[#8f96a3]">{item.id} · due {item.due}</p>
                      </div>
                    </button>
                    <div className={`relative h-full border-l border-[#e4e6ea] bg-[linear-gradient(to_right,#edf0f3_1px,transparent_1px)] ${today ? "bg-[#fbfaff]" : ""}`} style={{ backgroundSize: `${100 / weeks.length}% 100%` }}>
                      {today && <div className="absolute top-0 h-full w-px bg-[#7b68ee]" style={{ left: `${todayPosition}%` }} />}
                      <button onClick={() => setSelected(item)} className={`absolute top-3 flex h-7 items-center rounded-[5px] px-2 text-left text-[10px] font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.color} ${selected?.id === item.id ? "ring-2 ring-[#d7d1ff]" : ""}`} style={{ left: `${item.start}%`, width: `${Math.max(item.span, 10)}%` }}>
                        {item.status}
                      </button>
                    </div>
                  </div>
                ))}
                {filteredItems.length === 0 && <div className="flex h-24 items-center justify-center bg-white text-sm font-bold text-[#8f96a3]">No roadmap items match the current filters.</div>}
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
          <Panel title="Calendar health">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-[#68707d]"><span>On track</span><span>72%</span></div>
              <div className="h-1.5 rounded-full bg-[#e4e7ec]"><div className="h-full w-[72%] rounded-full bg-[#00b884]" /></div>
              <p className="text-xs font-semibold leading-5 text-[#7c828d]">Two dependencies are close to deadline. Review API freeze before the next planning session.</p>
            </div>
          </Panel>
        </aside>
      </div>
      {(selected || selectedMilestone || milestoneOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => { setSelected(null); setSelectedMilestone(null); setMilestoneOpen(false); }}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">{selected ? selected.name : selectedMilestone ? selectedMilestone.title : "New milestone"}</h2>
              <button onClick={() => { setSelected(null); setSelectedMilestone(null); setMilestoneOpen(false); }} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            {selected && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <SummaryCell label="Owner" value={selected.owner} />
                  <SummaryCell label="Due" value={selected.due} />
                </div>
                <FieldSelect label="Status" value={selected.status} onChange={(value) => updateItem(selected.id, { status: value as TimelineStatus, color: statusColor(value as TimelineStatus) })} options={["TO DO", "IN PROGRESS", "REVIEW", "BLOCKED"]} />
                <FieldSelect label="Due" value={selected.due} onChange={(value) => updateItem(selected.id, { due: value })} options={["May 8", "May 14", "May 19", "May 24", "Jun 2", "Jun 4"]} />
              </div>
            )}
            {selectedMilestone && (
              <div className="space-y-3">
                <SummaryCell label="Date" value={selectedMilestone.date} />
                <button onClick={() => toggleMilestoneStatus(selectedMilestone.id)} className="h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] text-sm font-black text-[#20242a] hover:bg-white">Cycle status: {selectedMilestone.status}</button>
              </div>
            )}
            {milestoneOpen && !selected && !selectedMilestone && (
              <div className="space-y-3">
                <input value={newMilestoneTitle} onChange={(event) => setNewMilestoneTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addMilestone(); }} autoFocus placeholder="Milestone name" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[#7b68ee]" />
                <FieldSelect label="Date" value={newMilestoneDate} onChange={setNewMilestoneDate} options={["May 24", "Jun 2", "Jun 4", "Jun 14"]} />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setMilestoneOpen(false)} className="h-8 rounded-[7px] border border-[#dfe3e8] px-3 text-xs font-black text-[#68707d]">Cancel</button>
                  <button onClick={addMilestone} className="h-8 rounded-[7px] bg-[#7b68ee] px-3.5 text-xs font-black text-white">Create</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
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

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
      <p className="mb-1 text-[10px] font-black uppercase text-[#8f96a3]">{label}</p>
      <p className="text-sm font-black text-[#20242a]">{value}</p>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-[10px] font-black uppercase text-[#8f96a3]">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2 text-xs font-black text-[#20242a] outline-none focus:border-[#7b68ee]">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
