"use client";

import { useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from "react";
import { ArrowDownUp, CheckCircle2, ChevronDown, CirclePlus, MoreHorizontal, Search, SlidersHorizontal, UserPlus } from "lucide-react";

type Ticket = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "In Progress" | "Done" | "To Do" | "Blocked";
  assignee: string;
  updated: string;
  due: string;
  desc: string;
  subtasks: string;
  comments: number;
};

type QuickFilter = "All" | "Open" | "Assigned to me" | "Due soon" | "Priority";
type SortKey = "default" | "title" | "status" | "assignee" | "due" | "priority" | "updated";
type ToolbarPanel = "filter" | "sort" | "customize" | null;

const tickets: Ticket[] = [
  { id: "PM-1", title: "Mise en place de l'auth JWT", priority: "High", status: "In Progress", assignee: "Hassine", updated: "2h", due: "Today", desc: "Besoin de configurer Passport.js ou simplejwt cote Django. Verifier les headers CORS.", subtasks: "3/5", comments: 4 },
  { id: "PM-2", title: "Configuration CORS backend", priority: "Medium", status: "Done", assignee: "Admin", updated: "5h", due: "May 5", desc: "Autoriser l'origine localhost:3000 dans les settings Django.", subtasks: "2/2", comments: 1 },
  { id: "PM-3", title: "Maquettes Dashboard", priority: "Low", status: "To Do", assignee: "Snofy", updated: "1j", due: "May 9", desc: "Utiliser Zinc pour le design system.", subtasks: "0/4", comments: 2 },
  { id: "PM-4", title: "Integration Stripe", priority: "High", status: "Blocked", assignee: "Hassine", updated: "2j", due: "Overdue", desc: "En attente des cles API production.", subtasks: "1/6", comments: 7 },
  { id: "PM-5", title: "Refonte de la sidebar", priority: "Medium", status: "In Progress", assignee: "Admin", updated: "1h", due: "Tomorrow", desc: "Ajouter les nouveaux liens vers les pages analytics.", subtasks: "4/8", comments: 3 },
];

const grid = "grid-cols-[42px_minmax(360px,1.25fr)_132px_154px_122px_108px_88px_72px]";

export default function TicketsPage() {
  const [items, setItems] = useState<Ticket[]>(tickets);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [comment, setComment] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [activeFilter, setActiveFilter] = useState<QuickFilter>("Open");
  const [statusFilter, setStatusFilter] = useState<"All" | Ticket["status"]>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Ticket["priority"]>("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [collapsed, setCollapsed] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Ticket["priority"]>("Medium");
  const [newStatus, setNewStatus] = useState<Ticket["status"]>("To Do");
  const [newAssignee, setNewAssignee] = useState("Admin");
  const [newDue, setNewDue] = useState("Tomorrow");
  const [toolbarPanel, setToolbarPanel] = useState<ToolbarPanel>(null);
  const [compactRows, setCompactRows] = useState(false);
  const [showRowMeta, setShowRowMeta] = useState(true);
  const [localComments, setLocalComments] = useState<Record<string, Array<{ user: string; text: string; time: string }>>>({});
  const assignees = Array.from(new Set(items.map((ticket) => ticket.assignee)));
  const statusCounts = items.reduce<Record<Ticket["status"], number>>((acc, ticket) => {
    acc[ticket.status] += 1;
    return acc;
  }, { "In Progress": 0, Done: 0, "To Do": 0, Blocked: 0 });
  const priorityCounts = items.reduce<Record<Ticket["priority"], number>>((acc, ticket) => {
    acc[ticket.priority] += 1;
    return acc;
  }, { High: 0, Medium: 0, Low: 0 });
  const visibleTickets = items
    .filter((ticket) => `${ticket.title} ${ticket.id} ${ticket.assignee} ${ticket.status} ${ticket.priority}`.toLowerCase().includes(query.toLowerCase()))
    .filter((ticket) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Assigned to me") return ticket.assignee === "Hassine" || ticket.assignee === "Admin";
      if (activeFilter === "Due soon") return ["Today", "Tomorrow", "Overdue"].includes(ticket.due);
      if (activeFilter === "Priority") return ticket.priority === "High";
      return ticket.status !== "Done";
    })
    .filter((ticket) => statusFilter === "All" || ticket.status === statusFilter)
    .filter((ticket) => priorityFilter === "All" || ticket.priority === priorityFilter)
    .filter((ticket) => assigneeFilter === "All" || ticket.assignee === assigneeFilter)
    .sort((a, b) => {
      if (sortBy === "default") return 0;
      const priorityRank = { High: 0, Medium: 1, Low: 2 };
      const dueRank = { Overdue: 0, Today: 1, Tomorrow: 2 };
      let result = 0;
      if (sortBy === "priority") result = priorityRank[a.priority] - priorityRank[b.priority];
      else if (sortBy === "due") result = (dueRank[a.due as keyof typeof dueRank] ?? 10) - (dueRank[b.due as keyof typeof dueRank] ?? 10) || a.due.localeCompare(b.due);
      else result = String(a[sortBy]).localeCompare(String(b[sortBy]));
      return sortDirection === "asc" ? result : -result;
    });

  const openRow = (event: KeyboardEvent<HTMLDivElement>, ticket: Ticket) => {
    if (event.key === "Enter") setSelected(ticket);
  };
  const addLocalTicket = () => {
    const title = newTitle.trim();
    if (!title) return;
    const ticket: Ticket = {
      id: `PM-${items.length + 1}`,
      title,
      priority: newPriority,
      status: newStatus,
      assignee: newAssignee,
      updated: "now",
      due: newDue,
      desc: "Local draft task created from the frontend workspace.",
      subtasks: "0/3",
      comments: 0,
    };
    setItems((current) => [ticket, ...current]);
    setSelected(ticket);
    setNewTitle("");
    setNewPriority("Medium");
    setNewStatus("To Do");
    setNewAssignee("Admin");
    setNewDue("Tomorrow");
    setNewTicketOpen(false);
  };
  const clearFilters = () => {
    setQuery("");
    setActiveFilter("Open");
    setStatusFilter("All");
    setPriorityFilter("All");
    setAssigneeFilter("All");
    setSortBy("default");
    setSortDirection("asc");
  };
  const toggleToolbarPanel = (panel: Exclude<ToolbarPanel, null>) => {
    setToolbarPanel((current) => current === panel ? null : panel);
  };
  const updateTicket = (ticketId: string, patch: Partial<Ticket>) => {
    setItems((current) => current.map((ticket) => ticket.id === ticketId ? { ...ticket, ...patch, updated: "now" } : ticket));
    setSelected((current) => current?.id === ticketId ? { ...current, ...patch, updated: "now" } : current);
  };
  const toggleExpanded = (ticketId: string) => {
    setExpandedRows((current) => {
      const next = new Set(current);
      if (next.has(ticketId)) next.delete(ticketId);
      else next.add(ticketId);
      return next;
    });
  };

  return (
    <main className="flex min-h-full flex-col bg-[#f7f8fb]">
      <div className="border-b border-[#dfe3e8] bg-white px-5 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[19px] font-black text-[#20242a]">Tickets & Tasks</h1>
              <span className="rounded-full bg-[#edf0f5] px-2 py-0.5 text-[10px] font-black text-[#68707d]">{visibleTickets.length} tasks</span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-[#7c828d]">Product / Sprint Backlog / Open work</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-8 w-full min-w-0 items-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2.5 sm:w-[310px]">
              <Search size={14} className="text-[#8f96a3]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks..." className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold outline-none placeholder:text-[#8f96a3]" />
              {query && <button onClick={() => setQuery("")} className="rounded-[5px] px-1 text-[10px] font-black text-[#8f96a3] hover:bg-white" aria-label="Clear search">x</button>}
            </div>
            <button onClick={() => toggleToolbarPanel("filter")} className={`flex h-8 items-center gap-1.5 rounded-[7px] border px-3 text-xs font-black shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] ${toolbarPanel === "filter" ? "border-[#d7d1ff] bg-[#f3efff] text-[#7b68ee]" : "border-[#dfe3e8] bg-white text-[#68707d] hover:bg-[#f7f8fb]"}`}>
              <SlidersHorizontal size={14} />
              Filter
            </button>
            <button onClick={() => toggleToolbarPanel("sort")} className={`flex h-8 items-center gap-1.5 rounded-[7px] border px-3 text-xs font-black shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] ${toolbarPanel === "sort" ? "border-[#d7d1ff] bg-[#f3efff] text-[#7b68ee]" : "border-[#dfe3e8] bg-white text-[#68707d] hover:bg-[#f7f8fb]"}`}>
              <ArrowDownUp size={14} />
              Sort
            </button>
            <button onClick={() => toggleToolbarPanel("customize")} className={`flex h-8 items-center gap-1.5 rounded-[7px] border px-3 text-xs font-black shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] ${toolbarPanel === "customize" ? "border-[#d7d1ff] bg-[#f3efff] text-[#7b68ee]" : "border-[#dfe3e8] bg-white text-[#68707d] hover:bg-[#f7f8fb]"}`}>
              <SlidersHorizontal size={14} />
              Customize
            </button>
            <button onClick={() => setNewTicketOpen(true)} className="h-8 rounded-[7px] bg-[#7b68ee] px-3.5 text-xs font-black text-white shadow-sm transition hover:bg-[#6d56ea] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">New ticket</button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {(["All", "Open", "Assigned to me", "Due soon", "Priority"] as QuickFilter[]).map((label) => (
              <button key={label} onClick={() => setActiveFilter(label)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${activeFilter === label ? "border border-[#dfe3e8] bg-[#f7f8fb] text-[#20242a]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>{label}</button>
            ))}
            {(query || activeFilter !== "Open" || statusFilter !== "All" || priorityFilter !== "All" || assigneeFilter !== "All" || sortBy !== "default") && (
              <button onClick={clearFilters} className="h-7 rounded-[7px] px-2.5 text-[11px] font-black text-[#7b68ee] hover:bg-[#f3efff]">Clear</button>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-black text-[#8f96a3]">
            <UserPlus size={14} />
            Shared with Product team
          </div>
        </div>
        {toolbarPanel && (
          <div className="mt-3 rounded-[9px] border border-[#dfe3e8] bg-[#fbfbfd] p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-black capitalize text-[#20242a]">{toolbarPanel}</p>
                <p className="text-[11px] font-bold text-[#8f96a3]">
                  {toolbarPanel === "filter" ? "Narrow the local task list." : toolbarPanel === "sort" ? "Choose local ordering for visible tasks." : "Change local row density and row details."}
                </p>
              </div>
              <button onClick={() => setToolbarPanel(null)} className="h-7 w-7 rounded-[7px] bg-white text-sm font-black text-[#68707d] shadow-sm">x</button>
            </div>
            {toolbarPanel === "filter" && (
              <div className="grid gap-3 lg:grid-cols-3">
                <FilterGroup title="Status">
                  {(["All", "To Do", "In Progress", "Blocked", "Done"] as Array<"All" | Ticket["status"]>).map((status) => (
                    <button key={status} onClick={() => setStatusFilter(status)} className={`h-7 rounded-[7px] px-2 text-[11px] font-black ${statusFilter === status ? "bg-white text-[#20242a] shadow-sm ring-1 ring-[#dfe3e8]" : "text-[#68707d] hover:bg-white"}`}>{status}{status !== "All" ? ` ${statusCounts[status]}` : ""}</button>
                  ))}
                </FilterGroup>
                <FilterGroup title="Priority">
                  {(["All", "High", "Medium", "Low"] as Array<"All" | Ticket["priority"]>).map((priority) => (
                    <button key={priority} onClick={() => setPriorityFilter(priority)} className={`h-7 rounded-[7px] px-2 text-[11px] font-black ${priorityFilter === priority ? "bg-white text-[#20242a] shadow-sm ring-1 ring-[#dfe3e8]" : "text-[#68707d] hover:bg-white"}`}>{priority}{priority !== "All" ? ` ${priorityCounts[priority]}` : ""}</button>
                  ))}
                </FilterGroup>
                <FilterGroup title="Assignee">
                  {["All", ...assignees].map((assignee) => (
                    <button key={assignee} onClick={() => setAssigneeFilter(assignee)} className={`h-7 rounded-[7px] px-2 text-[11px] font-black ${assigneeFilter === assignee ? "bg-white text-[#20242a] shadow-sm ring-1 ring-[#dfe3e8]" : "text-[#68707d] hover:bg-white"}`}>{assignee}</button>
                  ))}
                </FilterGroup>
              </div>
            )}
            {toolbarPanel === "sort" && (
              <div className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)]">
                <FilterGroup title="Direction">
                  <button onClick={() => setSortDirection((current) => current === "asc" ? "desc" : "asc")} className="flex h-7 items-center gap-1 rounded-[7px] px-2 text-[11px] font-black text-[#68707d] hover:bg-white"><ArrowDownUp size={12} /> {sortDirection === "asc" ? "Ascending" : "Descending"}</button>
                </FilterGroup>
                <FilterGroup title="Sort by">
                  {(["default", "title", "priority", "due", "status", "assignee", "updated"] as SortKey[]).map((sort) => (
                    <button key={sort} onClick={() => setSortBy(sort)} className={`h-7 rounded-[7px] px-2 text-left text-[11px] font-black capitalize ${sortBy === sort ? "bg-white text-[#20242a] shadow-sm ring-1 ring-[#dfe3e8]" : "text-[#68707d] hover:bg-white"}`}>{sort}</button>
                  ))}
                </FilterGroup>
              </div>
            )}
            {toolbarPanel === "customize" && (
              <div className="grid gap-3 lg:grid-cols-3">
                <FilterGroup title="Density">
                  {[
                    { label: "Comfortable", active: !compactRows, action: () => setCompactRows(false) },
                    { label: "Compact", active: compactRows, action: () => setCompactRows(true) },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action} className={`h-7 rounded-[7px] px-2 text-[11px] font-black ${item.active ? "bg-white text-[#20242a] shadow-sm ring-1 ring-[#dfe3e8]" : "text-[#68707d] hover:bg-white"}`}>{item.label}</button>
                  ))}
                </FilterGroup>
                <FilterGroup title="Row details">
                  <button onClick={() => setShowRowMeta((current) => !current)} className={`h-7 rounded-[7px] px-2 text-[11px] font-black ${showRowMeta ? "bg-white text-[#20242a] shadow-sm ring-1 ring-[#dfe3e8]" : "text-[#68707d] hover:bg-white"}`}>{showRowMeta ? "Meta on" : "Meta off"}</button>
                </FilterGroup>
                <FilterGroup title="Expansion">
                  <button onClick={() => setExpandedRows(new Set(visibleTickets.map((ticket) => ticket.id)))} className="h-7 rounded-[7px] px-2 text-[11px] font-black text-[#68707d] hover:bg-white">Expand visible</button>
                  <button onClick={() => setExpandedRows(new Set())} className="h-7 rounded-[7px] px-2 text-[11px] font-black text-[#68707d] hover:bg-white">Collapse all</button>
                </FilterGroup>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-white">
        <div className="min-w-[1120px]">
          <div className={`grid ${grid} sticky top-0 z-10 h-8 items-center border-b border-[#d4d8df] bg-[#f8f9fb] text-[10px] font-black uppercase tracking-[0.02em] text-[#68707d]`}>
            <div className="flex h-full items-center justify-center border-r border-[#e4e6ea]">
              <button onClick={() => setCompleted((current) => current.size === visibleTickets.length ? new Set() : new Set(visibleTickets.map((ticket) => ticket.id)))} className="h-3.5 w-3.5 rounded-[3px] border border-[#c8cdd4] bg-white" aria-label="Toggle visible tickets" />
            </div>
            {[
              { label: "Task name", sort: "title" as SortKey },
              { label: "Status", sort: "status" as SortKey },
              { label: "Assignee", sort: "assignee" as SortKey },
              { label: "Due date", sort: "due" as SortKey },
              { label: "Priority", sort: "priority" as SortKey },
              { label: "Updated", sort: "updated" as SortKey },
              { label: "", sort: null },
            ].map((column, index) => (
              column.sort ? (
                <button key={`${column.label}-${index}`} onClick={() => setSortBy(column.sort || "default")} className={`flex h-full items-center px-3 text-left hover:bg-white ${index > 0 ? "border-l border-[#e4e6ea]" : ""}`}>
                  {column.label}
                  {sortBy === column.sort ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
                </button>
              ) : (
                <span key={`${column.label}-${index}`} className={`flex h-full items-center px-3 ${index > 0 ? "border-l border-[#e4e6ea]" : ""}`}>{column.label}</span>
              )
            ))}
          </div>

          <div className={`grid ${grid} h-9 items-center border-b border-[#dfe3e8] bg-[#fbfbfd] text-[11px] font-black text-[#2f343c] shadow-[inset_4px_0_0_#7b68ee]`}>
            <div className="flex h-full items-center justify-center border-r border-[#e4e6ea]">
              <button onClick={() => setCollapsed((current) => !current)} className="flex h-6 w-6 items-center justify-center rounded-[5px] hover:bg-white" aria-label="Collapse open tickets">
                <ChevronDown size={14} className={`text-[#8f96a3] transition ${collapsed ? "-rotate-90" : ""}`} />
              </button>
            </div>
            <div className="flex h-full items-center gap-2 px-3">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-[#7b68ee]" />
              Open tickets
              <span className="rounded-full bg-[#ebe8ff] px-1.5 py-px text-[9px] text-[#7b68ee]">{visibleTickets.length}</span>
            </div>
            <div className="flex h-full items-center border-l border-[#e5e7eb] px-3 text-[10px] font-black text-[#1090e0]">2 active</div>
            <div className="flex h-full items-center border-l border-[#e5e7eb] px-3 text-[10px] font-black text-[#8f96a3]">4 people</div>
            <div className="flex h-full items-center border-l border-[#e5e7eb] px-3 text-[10px] font-black text-[#e5484d]">2 due</div>
            <div className="flex h-full items-center border-l border-[#e5e7eb] px-3 text-[10px] font-black text-[#8f96a3]">mixed</div>
            <div className="h-full border-l border-[#e5e7eb]" />
            <div className="h-full border-l border-[#e5e7eb]" />
          </div>

          {!collapsed && visibleTickets.map((ticket) => {
            const isSelected = selected?.id === ticket.id;
            const isComplete = completed.has(ticket.id);
            const isExpanded = expandedRows.has(ticket.id);
            const statusColor = ticket.status === "Done" ? "bg-[#00b884]" : ticket.status === "In Progress" ? "bg-[#1090e0]" : ticket.status === "Blocked" ? "bg-[#e5484d]" : "bg-[#87909e]";
            const priorityColor = ticket.priority === "High" ? "border-[#ffe1b3] bg-[#fff7e8] text-[#c87900]" : ticket.priority === "Medium" ? "border-[#dfe2e6] bg-white text-[#68707d]" : "border-[#e5e7eb] bg-[#f7f8fb] text-[#8f96a3]";
            const dueColor = ticket.due === "Overdue" ? "bg-[#fff1f1] text-[#e5484d]" : ticket.due === "Today" ? "bg-[#fff7e8] text-[#c87900]" : "text-[#68707d]";
            const assigneeColor = ticket.assignee === "Hassine" ? "bg-[#7b68ee]" : ticket.assignee === "Admin" ? "bg-[#1090e0]" : "bg-[#00b884]";

            return (
              <div key={ticket.id} role="button" tabIndex={0} onClick={() => setSelected(ticket)} onKeyDown={(event) => openRow(event, ticket)} className={`group grid ${grid} ${isExpanded ? (compactRows ? "h-[66px]" : "h-[74px]") : (compactRows ? "h-[34px]" : "h-[40px]")} cursor-pointer items-center border-b border-[#edf0f3] text-left text-[12px] transition hover:bg-[#f5f7fa] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#d7d1ff] ${isSelected ? "bg-[#f3efff] shadow-[inset_4px_0_0_#7b68ee]" : "bg-white"}`}>
                <div className="flex h-full items-center justify-center border-r border-[#e5e7eb]">
                  <button onClick={(event) => {
                    event.stopPropagation();
                    setCompleted((current) => {
                      const next = new Set(current);
                      if (next.has(ticket.id)) next.delete(ticket.id);
                      else next.add(ticket.id);
                      return next;
                    });
                  }} className={`flex h-4 w-4 items-center justify-center rounded-[3px] border text-[10px] ${isComplete || isSelected ? "border-[#7b68ee] bg-[#7b68ee] text-white" : "border-[#c8cdd4] bg-white text-transparent group-hover:border-[#7b68ee]"}`} aria-label={`Toggle ${ticket.id}`}>
                    <CheckCircle2 size={12} />
                  </button>
                </div>
                <div className="flex min-w-0 items-center gap-2 px-3">
                  <span className="h-5 w-px bg-[#d9dde5]" />
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`truncate font-black text-[#20242a] ${isComplete ? "text-[#8f96a3] line-through" : ""}`}>{ticket.title}</span>
                      <span className="rounded-[3px] bg-[#f3f4f6] px-1 py-[2px] text-[9px] font-black text-[#8f96a3]">{ticket.id}</span>
                    </div>
                    {showRowMeta && <div className="mt-0.5 flex items-center gap-2 text-[10px] font-black text-[#a0a7b3]">
                      <span>{ticket.subtasks} subtasks</span>
                      <span>{ticket.comments} comments</span>
                    </div>}
                  </div>
                  <div className="ml-auto hidden items-center gap-1 group-hover:flex">
                    <button onClick={(event) => { event.stopPropagation(); setSelected(ticket); }} className="h-6 rounded-[5px] border border-[#dfe3e8] bg-white px-2 text-[10px] font-black text-[#68707d]">Open</button>
                    <button onClick={(event) => { event.stopPropagation(); toggleExpanded(ticket.id); }} className="h-6 rounded-[5px] border border-[#dfe3e8] bg-white px-2 text-[10px] font-black text-[#68707d]">{isExpanded ? "Less" : "More"}</button>
                    <button onClick={(event) => { event.stopPropagation(); setStatusFilter(ticket.status); setToolbarPanel("filter"); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-[#dfe3e8] bg-white text-[#8f96a3]" aria-label={`Filter by ${ticket.status}`}>
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="col-span-full mt-1 flex items-center gap-2 text-[10px] font-bold text-[#8f96a3]">
                      <span className="rounded-[4px] bg-white px-1.5 py-0.5 ring-1 ring-[#edf0f3]">Description: {ticket.desc}</span>
                    </div>
                  )}
                </div>
                <div className="flex h-full items-center border-l border-[#e5e7eb] px-3">
                  <span className={`inline-flex h-[21px] min-w-[96px] items-center justify-center rounded-[3px] px-2 text-[9px] font-black uppercase text-white ${statusColor}`}>{ticket.status}</span>
                </div>
                <div className="flex h-full items-center gap-2 border-l border-[#e5e7eb] px-3">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${assigneeColor} text-[10px] font-black text-white ring-2 ring-white`}>{ticket.assignee.charAt(0)}</span>
                  <span className="truncate font-bold text-[#59606b]">{ticket.assignee}</span>
                </div>
                <div className="flex h-full items-center border-l border-[#e5e7eb] px-3">
                  <span className={`rounded-[4px] px-1.5 py-0.5 font-black ${dueColor}`}>{ticket.due}</span>
                </div>
                <div className="flex h-full items-center border-l border-[#e5e7eb] px-3">
                  <span className={`inline-flex h-5 min-w-[66px] items-center justify-center rounded-[3px] border px-2 text-[10px] font-black ${priorityColor}`}>{ticket.priority}</span>
                </div>
                <div className="flex h-full items-center border-l border-[#e5e7eb] px-3 text-[11px] font-bold text-[#8f96a3]">{ticket.updated}</div>
                <div className="flex h-full items-center justify-center border-l border-[#e5e7eb] text-[#a2a9b5]">
                  <MoreHorizontal size={14} className="opacity-0 transition group-hover:opacity-100" />
                </div>
              </div>
            );
          })}
          {!collapsed && visibleTickets.length === 0 && (
            <div className="flex h-28 items-center justify-center border-b border-[#edf0f3] bg-white text-sm font-bold text-[#8f96a3]">
              No tasks match the current filters.
            </div>
          )}

          <button onClick={() => setNewTicketOpen(true)} className={`grid ${grid} h-9 w-full items-center border-b border-[#edf0f3] bg-[#fcfcfd] text-left text-[12px] font-bold text-[#8f96a3] hover:bg-white`}>
            <div className="h-full border-r border-[#e5e7eb]" />
            <div className="flex items-center gap-2 px-3">
              <CirclePlus size={14} />
              New task
            </div>
            <div className="h-full border-l border-[#e5e7eb]" />
            <div className="h-full border-l border-[#e5e7eb]" />
            <div className="h-full border-l border-[#e5e7eb]" />
            <div className="h-full border-l border-[#e5e7eb]" />
            <div className="h-full border-l border-[#e5e7eb]" />
            <div className="h-full border-l border-[#e5e7eb]" />
          </button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#20242a]/35 backdrop-blur-sm" onMouseDown={() => setSelected(null)}>
          <div onMouseDown={(event) => event.stopPropagation()} className="h-full w-full max-w-xl overflow-y-auto border-l border-[#dfe3e8] bg-white shadow-2xl">
            <div className="border-b border-[#edf0f3] p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase text-[#8f96a3]">{selected.id}</span>
                  <h2 className="mt-1 text-xl font-black text-[#20242a]">{selected.title}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-[#f7f8fb] font-black text-[#68707d] hover:bg-[#edf0f5]">x</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                  <p className="mb-1 text-[10px] font-black uppercase text-[#8f96a3]">Assignee</p>
                  <p className="text-sm font-black text-[#20242a]">{selected.assignee}</p>
                </div>
                <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                  <p className="mb-1 text-[10px] font-black uppercase text-[#8f96a3]">Status</p>
                  <div className="flex flex-wrap gap-1">
                    {(["To Do", "In Progress", "Blocked", "Done"] as Ticket["status"][]).map((status) => (
                      <button key={status} onClick={() => updateTicket(selected.id, { status })} className={`rounded-[5px] px-2 py-1 text-[10px] font-black ${selected.status === status ? "bg-[#7b68ee] text-white" : "bg-white text-[#68707d] ring-1 ring-[#dfe3e8]"}`}>{status}</button>
                    ))}
                  </div>
                </div>
                <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                  <p className="mb-1 text-[10px] font-black uppercase text-[#8f96a3]">Priority</p>
                  <div className="flex flex-wrap gap-1">
                    {(["High", "Medium", "Low"] as Ticket["priority"][]).map((priority) => (
                      <button key={priority} onClick={() => updateTicket(selected.id, { priority })} className={`rounded-[5px] px-2 py-1 text-[10px] font-black ${selected.priority === priority ? "bg-[#7b68ee] text-white" : "bg-white text-[#68707d] ring-1 ring-[#dfe3e8]"}`}>{priority}</button>
                    ))}
                  </div>
                </div>
                <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                  <p className="mb-1 text-[10px] font-black uppercase text-[#8f96a3]">Due</p>
                  <p className="text-sm font-black text-[#20242a]">{selected.due}</p>
                </div>
              </div>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <h3 className="mb-2 text-sm font-black text-[#20242a]">Description</h3>
                <p className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-medium leading-relaxed text-[#59606b]">{selected.desc}</p>
              </div>
              <div className="border-t border-[#edf0f3] pt-5">
                <h3 className="mb-4 text-sm font-black text-[#20242a]">Activity</h3>
                {[
                  { user: "Admin", text: "On devrait utiliser @Hassine pour cette partie.", time: "1h" },
                  { user: "Snofy", text: "C'est deja en cours. J'ai ajoute le middleware.", time: "45 min" },
                  ...(localComments[selected.id] || []),
                ].map((activity, index) => (
                  <div key={`${activity.user}-${activity.time}-${index}`} className="mb-4 flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3efff] text-[10px] font-black text-[#7b68ee]">{activity.user.charAt(0)}</div>
                    <div>
                      <div className="mb-1 flex items-baseline gap-2">
                        <span className="text-sm font-black text-[#20242a]">{activity.user}</span>
                        <span className="text-[10px] font-bold text-[#8f96a3]">{activity.time}</span>
                      </div>
                      <p className="rounded-[10px] rounded-tl-none border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-medium text-[#59606b]">{activity.text}</p>
                    </div>
                  </div>
                ))}
                <div className="relative mt-5">
                  <textarea
                    value={comment}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                      const value = event.target.value;
                      setComment(value);
                      setShowMentions(value.endsWith("@"));
                    }}
                    placeholder="Leave a comment... use @ to mention"
                    className="min-h-[96px] w-full rounded-[10px] border border-[#dfe3e8] bg-[#f7f8fb] p-3 text-sm font-medium outline-none focus:border-[#7b68ee]"
                  />
                  {showMentions && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-[9px] border border-[#dfe3e8] bg-white shadow-xl">
                      {["Hassine", "Snofy", "Admin"].map((name) => (
                    <button key={name} onClick={() => { setComment(`${comment}${name} `); setShowMentions(false); }} className="block w-full px-3 py-2 text-left text-sm font-bold hover:bg-[#f7f8fb]">{name}</button>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex justify-end">
                    <button onClick={() => {
                      const text = comment.trim();
                      if (!text || !selected) return;
                      setLocalComments((current) => ({ ...current, [selected.id]: [...(current[selected.id] || []), { user: "You", text, time: "now" }] }));
                      setComment("");
                    }} className="rounded-[7px] bg-[#7b68ee] px-4 py-2 text-sm font-black text-white">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {newTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setNewTicketOpen(false)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">Create local ticket</h2>
              <button onClick={() => setNewTicketOpen(false)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            <input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addLocalTicket(); }} autoFocus placeholder="Task name" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[#7b68ee]" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <FieldSelect label="Status" value={newStatus} onChange={(value) => setNewStatus(value as Ticket["status"])} options={["To Do", "In Progress", "Blocked", "Done"]} />
              <FieldSelect label="Priority" value={newPriority} onChange={(value) => setNewPriority(value as Ticket["priority"])} options={["High", "Medium", "Low"]} />
              <FieldSelect label="Assignee" value={newAssignee} onChange={setNewAssignee} options={assignees} />
              <FieldSelect label="Due" value={newDue} onChange={setNewDue} options={["Today", "Tomorrow", "May 9", "Next week"]} />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setNewTicketOpen(false)} className="h-8 rounded-[7px] border border-[#dfe3e8] px-3 text-xs font-black text-[#68707d]">Cancel</button>
              <button onClick={addLocalTicket} className="h-8 rounded-[7px] bg-[#7b68ee] px-3.5 text-xs font-black text-white">Create</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-black uppercase text-[#8f96a3]">{title}</p>
      <div className="flex flex-wrap gap-1">{children}</div>
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
    <label className="text-[10px] font-black uppercase text-[#8f96a3]">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2 text-xs font-black text-[#20242a] outline-none focus:border-[#7b68ee]">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
