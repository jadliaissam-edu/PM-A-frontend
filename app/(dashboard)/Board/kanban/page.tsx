"use client";

import { Suspense, type DragEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "../../../../store";
import { dashboardService } from "@/services/dashboard.service";
import { projectService } from "@/services/project.service";
import { ticketsService } from "@/services/tickets.service";
import { CheckCircle2, CirclePlus, MoreHorizontal, Search, SlidersHorizontal } from "lucide-react";

type BoardTask = {
  id: string;
  content: string;
  priority: "Urgent" | "High" | "Normal" | "Low";
  due: string;
  points: number;
  subtasks: string;
  comments: number;
  project?: string | null;
  label: string;
};

type BoardColumn = {
  title: string;
  tone: string;
  soft: string;
  wip: string;
  tasks: BoardTask[];
};

const initialColumns: BoardColumn[] = [
  { title: "TO DO", tone: "bg-[#87909e]", soft: "bg-[#f0f2f5]", wip: "", tasks: [] },
  { title: "IN PROGRESS", tone: "bg-[#1090e0]", soft: "bg-[#eaf5ff]", wip: "", tasks: [] },
  { title: "REVIEW", tone: "bg-[#f8ae00]", soft: "bg-[#fff8e8]", wip: "", tasks: [] },
  { title: "DONE", tone: "bg-[#00b884]", soft: "bg-[#e8fff6]", wip: "", tasks: [] },
];

const backendToFrontendPriority = (p: string): BoardTask["priority"] => {
  const map: Record<string, BoardTask["priority"]> = { critical: "Urgent", high: "High", medium: "Normal", low: "Low" };
  return map[(p || "medium").toLowerCase()] || "Normal";
};

function KanbanBoardContent() {
  const user = useAuthStore((state) => state.user);
  const [boardColumns, setBoardColumns] = useState<BoardColumn[]>(initialColumns);
  // Start as false so server-rendered HTML matches client initial render
  const [loading, setLoading] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [dialog, setDialog] = useState<"settings" | "add" | null>(null);
  const [targetColumn, setTargetColumn] = useState(0);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newPriority, setNewPriority] = useState<BoardTask["priority"]>("Normal");
  const [newDue, setNewDue] = useState(new Date().toISOString().split('T')[0]);
  const [newLabel, setNewLabel] = useState("Local");
  const [priorityFilter, setPriorityFilter] = useState<"All" | BoardTask["priority"]>("All");
  const [hideDone, setHideDone] = useState(false);
  const [selectedTask, setSelectedTask] = useState<BoardTask | null>(null);
  const [projectReleases, setProjectReleases] = useState<any[]>([]);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState("");
  const searchParams = useSearchParams();
  const projectIdQuery = searchParams?.get("projectId") || null;

  const visibleColumns = boardColumns.map((column) => ({
    ...column,
    tasks: column.tasks
      .filter((task) => `${task.id} ${task.content} ${task.label} ${task.priority} ${task.due}`.toLowerCase().includes(query.toLowerCase()))
      .filter((task) => priorityFilter === "All" || task.priority === priorityFilter)
      .filter(() => !hideDone || column.title !== "DONE"),
  }));
  const visibleTaskCount = visibleColumns.reduce((count, column) => count + column.tasks.length, 0);

  const handleDragStart = (event: DragEvent<HTMLElement>, taskId: string, sourceColumnIndex: number) => {
    setDraggedTaskId(taskId);
    event.dataTransfer.setData("taskId", taskId);
    event.dataTransfer.setData("sourceColumnIndex", sourceColumnIndex.toString());
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetColumnIndex: number) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    const sourceColumnIndex = Number.parseInt(event.dataTransfer.getData("sourceColumnIndex"), 10);

    if (sourceColumnIndex === targetColumnIndex || Number.isNaN(sourceColumnIndex)) {
      setDraggedTaskId(null);
      return;
    }

    setBoardColumns((currentColumns) => {
      const nextColumns = currentColumns.map((column) => ({ ...column, tasks: [...column.tasks] }));
      const taskIndex = nextColumns[sourceColumnIndex]?.tasks.findIndex((task) => task.id === taskId) ?? -1;
      if (taskIndex === -1) return currentColumns;
      const [movedTask] = nextColumns[sourceColumnIndex].tasks.splice(taskIndex, 1);
      nextColumns[targetColumnIndex].tasks.push(movedTask);
      return nextColumns;
    });
    setDraggedTaskId(null);
    // Persist status change to backend
    (async () => {
      try {
        const statusMap = ["todo", "in_progress", "in_review", "done"];
        const newStatus = statusMap[targetColumnIndex] || statusMap[0];

        // find project id for ticket if available so we call the project-scoped endpoint
        const sourceTasks = boardColumns[sourceColumnIndex]?.tasks || [];
        const moved = sourceTasks.find((t) => t.id === taskId) as any | undefined;
        const projectId = moved?.project || projectIdQuery || null;

        if (projectIdQuery) {
          // If we're viewing a project board, use the project move endpoint which
          // handles ordering and status server-side. Send source/target indices
          // so backend can adjust ordering if supported.
          await projectService.moveTicketOnBoard(projectIdQuery, taskId, {
            from_column: sourceColumnIndex,
            to_column: targetColumnIndex,
            status: newStatus,
          });
        } else if (projectId) {
          // Use the project-scoped status endpoint when we can infer a project id
          await ticketsService.updateStatus(taskId, projectId, { status: newStatus });
        } else {
          // Fallback to updating the ticket resource directly
          await ticketsService.updateTicket(taskId, { status: newStatus });
        }
        setNotice(`Moved card to ${newStatus}.`);
      } catch (e) {
        console.error("Failed to persist moved card", e);
        setNotice("Failed to persist card move.");
        // Optionally refresh board to revert optimistic change
        void fetchData();
      }
    })();
  };
  const addCard = () => {
    (async () => {
      const title = newCardTitle.trim();
      if (!title) return;
      setDialog(null);
      try {
        const statusMap = ["todo", "in_progress", "in_review", "done"];
        // Build payload matching backend TicketSerializer fields
        const priorityMap: Record<string, string> = {
          Urgent: "critical",
          High: "high",
          Normal: "medium",
          Low: "low",
        };
        const payload: any = {
          title,
          // backend field is `priority` with choices [critical, high, medium, low]
          priority: priorityMap[newPriority] || "medium",
          
          status: statusMap[targetColumn] || statusMap[0],
          // serializer expects `labels` as an array
          labels: newLabel ? [newLabel.trim()] : [],
        };
        // Try to infer a project context for ticket creation. The backend expects
        // creation to be under a project: POST /projects/{project_id}/tickets/
        const inferredProject = projectIdQuery ||
          (boardColumns[targetColumn]?.tasks && boardColumns[targetColumn].tasks[0]?.project) ||
          boardColumns.flatMap((c) => c.tasks).find((t) => (t as any).project)?.project ||
          null;

        if (!inferredProject) {
          setNotice("Cannot create ticket: no project context. Create a ticket from a project page.");
          return;
        }

        const created: any = await ticketsService.createTicket(payload, inferredProject);

        const task: BoardTask = {
          id: created.id,
          content: created.title || title,
          priority: backendToFrontendPriority(created.priority),
          due: created.due_date || newDue,
          points: created.estimate_story_points || 0,
          subtasks: "0/0",
          comments: created.comments_count || 0,
          label: created.label || payload.label,
          project: created.project || null,
        };
        setBoardColumns((current) => current.map((column, index) => index === targetColumn ? { ...column, tasks: [task, ...column.tasks] } : column));
        setNewCardTitle("");
        setNewPriority("Normal");
        setNewDue(new Date().toISOString().split('T')[0]);
        setNewLabel("Local");
        setSelectedTask(task);
        setNotice(`Created ${task.id} in ${boardColumns[targetColumn]?.title || "board"}.`);
      } catch (e) {
        console.error("Failed to create ticket", e);
        setNotice("Failed to create ticket.");
      }
    })();
  };

  async function fetchTicketDetail(ticketId: string, projectId?: string) {
    try {
      // accept optional project id to call project-scoped detail endpoint
      const detail = await ticketsService.getTicket(ticketId, projectId);
      
      const task: BoardTask = {
        id: detail.id,
        content: detail.title || detail.description || "Untitled",
        priority: backendToFrontendPriority(detail.priority as string),
        due: detail.updated_at || "",
        points: 0,
        subtasks: "0/0",
        comments: detail.comments_count || 0,
        label: detail.project || "",
        project: (detail.project as any) || null,
      };
      setSelectedTask(task);
      // load releases for the ticket's project so user can associate ticket -> release
      try {
        if (detail.project) {
          const rels = await projectService.listReleases(detail.project);
          setProjectReleases(rels || []);
          setSelectedReleaseId(detail.release || null);
        } else {
          setProjectReleases([]);
          setSelectedReleaseId(null);
        }
      } catch (e) {
        console.warn('Failed to load project releases', e);
        setProjectReleases([]);
        setSelectedReleaseId(detail.release || null);
      }
    } catch (e) {
      console.error("Failed to load ticket details", e);
      setNotice("Failed to load ticket details.");
    }
  }

  const handleOpenTask = (task: BoardTask) => {
    fetchTicketDetail(task.id, task.project || projectIdQuery || undefined);
  };
  const updateTask = (taskId: string, patch: Partial<BoardTask>) => {
    setBoardColumns((current) => current.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => task.id === taskId ? { ...task, ...patch } : task),
    })));
    setSelectedTask((current) => current?.id === taskId ? { ...current, ...patch } : current);
  };
  const moveTask = (taskId: string, targetColumnIndex: number) => {
    setBoardColumns((current) => {
      const next = current.map((column) => ({ ...column, tasks: [...column.tasks] }));
      const sourceColumnIndex = next.findIndex((column) => column.tasks.some((task) => task.id === taskId));
      if (sourceColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) return current;
      const taskIndex = next[sourceColumnIndex].tasks.findIndex((task) => task.id === taskId);
      const [task] = next[sourceColumnIndex].tasks.splice(taskIndex, 1);
      next[targetColumnIndex].tasks.push(task);
      return next;
    });
    setNotice(`Moved card to ${boardColumns[targetColumnIndex]?.title || "selected column"}.`);
  };
  const handleDeleteTicket = async (ticketId: string, projectId?: string) => {
    try {
      setLoading(true);
      await ticketsService.deleteTicket(ticketId, projectId);
      setBoardColumns((current) => current.map((col) => ({ ...col, tasks: col.tasks.filter((t) => t.id !== ticketId) })));
      setNotice("Ticket deleted.");
    } catch (e) {
      console.error("Failed to delete ticket", e);
      setNotice("Failed to delete ticket.");
    } finally {
      setLoading(false);
    }
  };
  const toggleColumn = (columnTitle: string) => {
    setCollapsedColumns((current) => {
      const next = new Set(current);
      if (next.has(columnTitle)) next.delete(columnTitle);
      else next.add(columnTitle);
      return next;
    });
  };
  const clearBoardFilters = () => {
    setQuery("");
    setPriorityFilter("All");
    setHideDone(false);
  };

  useEffect(() => {
    // use the shared fetchData below for mount and manual refresh
    fetchData();
    // re-run when projectIdQuery changes
  }, [projectIdQuery]);

  // fetchData: reusable loader so Refresh button can re-fetch board tasks
  async function fetchData() {
    setLoading(true);
    try {
      const tasks = projectIdQuery ? await projectService.listProjectTickets(projectIdQuery) : await dashboardService.getAssignedTasks();
      
      // Map incoming tasks into columns by status
      const cols: BoardColumn[] = initialColumns.map((c) => ({ ...c, tasks: [] }));
        tasks.forEach((t: any) => {
          const task: BoardTask = {
            id: t.id,
            content: t.title || t.content || "Untitled",
            priority: backendToFrontendPriority(t.priority),
            due: t.due_date || t.due || "",
            points: t.estimate_story_points || t.points || 0,
            subtasks: t.subtasks || "0/0",
            comments: t.comments_count || t.comments || 0,
            label: t.label || t.project || "",
            project: t.project || null,
          };
        const status = (t.status || "TO DO").toUpperCase();
        if (status.includes("DONE") || status === "DONE") cols[3].tasks.push(task);
        else if (status.includes("REVIEW")) cols[2].tasks.push(task);
        else if (status.includes("IN PROGRESS") || status.includes("PROGRESS")) cols[1].tasks.push(task);
        else cols[0].tasks.push(task);
      });
      setBoardColumns(cols);
    } catch (e) {
      setBoardColumns(initialColumns);
      setNotice("Failed to load board data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-full flex-col bg-[#f7f8fb]">
      {notice && (
        <div className="border-b border-[#d7f4e8] bg-[#ecfff6] px-5 py-2 text-xs font-black text-[#008f65]">
          <button onClick={() => setNotice("")} className="w-full text-left">{notice}</button>
        </div>
      )}
      <BoardToolbar
        query={query}
        setQuery={setQuery}
        compact={compact}
        setCompact={setCompact}
        showSubtasks={showSubtasks}
        setShowSubtasks={setShowSubtasks}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        hideDone={hideDone}
        setHideDone={setHideDone}
        visibleTaskCount={visibleTaskCount}
        clearFilters={clearBoardFilters}
        openSettings={() => setDialog("settings")}
        openAddTask={() => { setTargetColumn(0); setDialog("add"); }}
        fetchData={fetchData}
        loading={loading}
        columns={boardColumns}
      />
      <div className="min-h-0 flex-1 overflow-x-auto p-4">
        <div className="flex min-h-full min-w-max gap-3">
          {visibleColumns.map((column, columnIndex) => (
            <BoardLane
              key={column.title}
              column={column}
              columnIndex={columnIndex}
              draggedTaskId={draggedTaskId}
              assigneeInitial={user?.username?.charAt(0).toUpperCase() || "U"}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onDragEnd={() => setDraggedTaskId(null)}
              compact={compact}
              showSubtasks={showSubtasks}
              completed={completed}
              isCollapsed={collapsedColumns.has(column.title)}
              onToggleColumn={() => toggleColumn(column.title)}
              toggleComplete={(taskId) => setCompleted((current) => {
                const next = new Set(current);
                if (next.has(taskId)) next.delete(taskId);
                else next.add(taskId);
                return next;
              })}
              openAddTask={() => { setTargetColumn(columnIndex); setDialog("add"); }}
              openTask={handleOpenTask}
              removeTicket={(taskId: string) => handleDeleteTicket(taskId, projectIdQuery || undefined)}
            />
          ))}
        </div>
      </div>
      {(dialog || selectedTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => { setDialog(null); setSelectedTask(null); }}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">{selectedTask ? selectedTask.content : dialog === "settings" ? "Board settings" : "Add task"}</h2>
              <button onClick={() => { setDialog(null); setSelectedTask(null); }} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            {selectedTask ? (
              <div className="space-y-2 text-sm font-bold text-[#59606b]">
                <div className="grid grid-cols-2 gap-2">
                  <SummaryCell label="ID" value={selectedTask.id} />
                  <SummaryCell label="Subtasks" value={selectedTask.subtasks} />
                </div>
                <FieldSelect label="Priority" value={selectedTask.priority} onChange={(value) => updateTask(selectedTask.id, { priority: value as BoardTask["priority"] })} options={["Urgent", "High", "Normal", "Low"]} />
                <FieldSelect label="Due" value={selectedTask.due} onChange={(value) => updateTask(selectedTask.id, { due: value })} options={["Today", "Tomorrow", "May 6", "May 7", "May 8", "Next week"]} />
                <FieldSelect label="Label" value={selectedTask.label} onChange={(value) => updateTask(selectedTask.id, { label: value })} options={["Frontend", "Backend", "Design", "API", "QA", "Security", "Setup", "Local"]} />
                <div>
                  <p className="mb-1.5 text-[10px] font-black uppercase text-[#8f96a3]">Release</p>
                  <select
                    value={selectedReleaseId || ''}
                    onChange={async (e) => {
                      const val = e.target.value || null;
                      setSelectedReleaseId(val);
                      try {
                        const projectId = selectedTask?.project || projectIdQuery || undefined;
                        if (!projectId) {
                          setNotice('Cannot assign release: missing project context');
                          return;
                        }
                        await ticketsService.updateTicket(selectedTask.id, { release: val }, projectId as string);
                        setNotice('Release association updated.');
                      } catch (err) {
                        console.error('Failed to update ticket release', err);
                        setNotice('Failed to update release.');
                      }
                    }}
                    className="mt-2 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2 text-sm font-black text-[#20242a]"
                  >
                    <option value="">None</option>
                    {projectReleases.map((r) => <option key={r.id} value={r.id}>{r.tag}</option>)}
                  </select>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-black uppercase text-[#8f96a3]">Move to</p>
                  <div className="flex flex-wrap gap-1">
                    {boardColumns.map((column, index) => (
                      <button key={column.title} onClick={() => moveTask(selectedTask.id, index)} className="h-8 rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2.5 text-[11px] font-black text-[#68707d] hover:bg-white">{column.title}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : dialog === "settings" ? (
              <div className="space-y-2">
                <button onClick={() => setCompact((current) => !current)} className="flex h-10 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a]">Compact cards<span>{compact ? "On" : "Off"}</span></button>
                <button onClick={() => setShowSubtasks((current) => !current)} className="flex h-10 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a]">Show subtasks<span>{showSubtasks ? "On" : "Off"}</span></button>
                <button onClick={() => setHideDone((current) => !current)} className="flex h-10 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a]">Hide done column<span>{hideDone ? "On" : "Off"}</span></button>
              </div>
            ) : (
              <>
                <input value={newCardTitle} onChange={(event) => setNewCardTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addCard(); }} autoFocus placeholder="Card title" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[#7b68ee]" />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <FieldSelect label="Priority" value={newPriority} onChange={(value) => setNewPriority(value as BoardTask["priority"])} options={["Urgent", "High", "Normal", "Low"]} />
                  <label className="block text-[10px] font-black uppercase text-[#8f96a3]">
                    Due Date
                    <input type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)} className="mt-1 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2 text-xs font-black text-[#20242a] outline-none focus:border-[#7b68ee]" />
                  </label>
                  <FieldSelect label="Label" value={newLabel} onChange={setNewLabel} options={["Frontend", "Backend", "Design", "API", "QA", "Security", "Setup", "Local"]} />
                  <label className="text-[10px] font-black uppercase text-[#8f96a3]">
                    Column
                    <select value={targetColumn} onChange={(event) => setTargetColumn(Number(event.target.value))} className="mt-1 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2 text-xs font-black text-[#20242a] outline-none focus:border-[#7b68ee]">
                      {boardColumns.map((column, index) => <option key={column.title} value={index}>{column.title}</option>)}
                    </select>
                  </label>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button onClick={() => setDialog(null)} className="h-8 rounded-[7px] border border-[#dfe3e8] px-3 text-xs font-black text-[#68707d]">Cancel</button>
                  <button onClick={addCard} className="h-8 rounded-[7px] bg-[#7b68ee] px-3.5 text-xs font-black text-white">Create</button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function BoardToolbar({
  query,
  setQuery,
  compact,
  setCompact,
  showSubtasks,
  setShowSubtasks,
  priorityFilter,
  setPriorityFilter,
  hideDone,
  setHideDone,
  visibleTaskCount,
  clearFilters,
  openSettings,
  openAddTask,
  fetchData,
  loading,
  columns,
}: {
  query: string;
  setQuery: (value: string) => void;
  compact: boolean;
  setCompact: (value: boolean) => void;
  showSubtasks: boolean;
  setShowSubtasks: (value: boolean) => void;
  priorityFilter: "All" | BoardTask["priority"];
  setPriorityFilter: (value: "All" | BoardTask["priority"]) => void;
  hideDone: boolean;
  setHideDone: (value: boolean) => void;
  visibleTaskCount: number;
  clearFilters: () => void;
  openSettings: () => void;
  openAddTask: () => void;
  fetchData: () => Promise<void>;
  loading: boolean;
  columns: BoardColumn[];
}) {
  return (
      <div className="border-b border-[#dfe3e8] bg-white px-5 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[19px] font-black text-[#20242a]">Active Board</h1>
            <span className="rounded-full bg-[#edf0f5] px-2 py-0.5 text-[10px] font-black text-[#68707d]">{columns.length} statuses</span>
            <span className="rounded-full bg-[#f3efff] px-2 py-0.5 text-[10px] font-black text-[var(--primary-color)]">{visibleTaskCount} cards</span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-[#7c828d]">Sprint Backlog / Board view / grouped by status</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden h-8 w-60 items-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2.5 lg:flex">
            <Search size={14} className="text-[#8f96a3]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold outline-none placeholder:text-[#9aa1ad]" placeholder="Search cards..." />
          </div>
          <button onClick={() => fetchData()} disabled={loading} className="flex h-8 items-center gap-1.5 rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-xs font-black text-[#68707d] shadow-sm transition hover:bg-[#f7f8fb] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button onClick={openSettings} className="flex h-8 items-center gap-1.5 rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-xs font-black text-[#68707d] shadow-sm transition hover:bg-[#f7f8fb] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">
            <SlidersHorizontal size={14} />
            Board settings
          </button>
          <button onClick={openAddTask} className="rounded-[7px] bg-[var(--primary-color)] px-3.5 py-1.5 text-xs font-black text-white shadow-sm transition hover:bg-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">Add task</button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        <span className="inline-flex h-7 items-center rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2.5 text-[11px] font-black text-[#20242a]">Group by Status</span>
        <button onClick={() => setShowSubtasks(!showSubtasks)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${showSubtasks ? "border border-[#dfe3e8] bg-[#f7f8fb] text-[#20242a]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>Show subtasks</button>
        <button onClick={() => setCompact(!compact)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${compact ? "border border-[#dfe3e8] bg-[#f7f8fb] text-[#20242a]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>Compact cards</button>
        <button onClick={() => setHideDone(!hideDone)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${hideDone ? "border border-[#dfe3e8] bg-[#f7f8fb] text-[#20242a]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>Hide done</button>
        {(["All", "Urgent", "High", "Normal", "Low"] as Array<"All" | BoardTask["priority"]>).map((priority) => (
          <button key={priority} onClick={() => setPriorityFilter(priority)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${priorityFilter === priority ? "border border-[#dfe3e8] bg-[#f7f8fb] text-[#20242a]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>{priority}</button>
        ))}
        {(query || priorityFilter !== "All" || hideDone) && <button onClick={clearFilters} className="h-7 rounded-[7px] px-2.5 text-[11px] font-black text-[var(--primary-color)] hover:bg-[var(--primary-color)]">Clear</button>}
      </div>
    </div>
  );
}

function BoardLane({
  column,
  columnIndex,
  draggedTaskId,
  assigneeInitial,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  compact,
  showSubtasks,
  completed,
  isCollapsed,
  onToggleColumn,
  toggleComplete,
  openAddTask,
  openTask,
  removeTicket,
}: {
  column: BoardColumn;
  columnIndex: number;
  draggedTaskId: string | null;
  assigneeInitial: string;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>, columnIndex: number) => void;
  onDragStart: (event: DragEvent<HTMLElement>, taskId: string, columnIndex: number) => void;
  onDragEnd: () => void;
  compact: boolean;
  showSubtasks: boolean;
  completed: Set<string>;
  isCollapsed: boolean;
  onToggleColumn: () => void;
  toggleComplete: (taskId: string) => void;
  openAddTask: () => void;
  openTask: (task: BoardTask) => void;
  removeTicket: (taskId: string) => void;
}) {
  return (
    <section className={`${isCollapsed ? "w-[74px]" : "w-[352px]"} flex shrink-0 flex-col transition-[width]`}>
      <LaneHeader column={column} isCollapsed={isCollapsed} onToggleColumn={onToggleColumn} onAddTask={openAddTask} />
      {!isCollapsed && (
        <div
          className={`flex min-h-[610px] flex-1 flex-col gap-2.5 rounded-[11px] border p-2.5 transition-colors ${draggedTaskId ? "border-dashed border-[#bfc6d1] bg-[#e9ecf2]" : `border-[#dfe3e8] ${column.soft}`}`}
          onDragOver={onDragOver}
          onDrop={(event) => onDrop(event, columnIndex)}
        >
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnTone={column.tone}
              assigneeInitial={assigneeInitial}
              isDragging={draggedTaskId === task.id}
              compact={compact}
              showSubtasks={showSubtasks}
              isComplete={completed.has(task.id)}
              toggleComplete={() => toggleComplete(task.id)}
              openTask={() => openTask(task)}
              removeTicket={() => removeTicket(task.id)}
              onDragStart={(event) => onDragStart(event, task.id, columnIndex)}
              onDragEnd={onDragEnd}
            />
          ))}
          {column.tasks.length === 0 && (
            <div className="flex min-h-[120px] items-center justify-center rounded-[9px] border border-dashed border-[#c8cdd4] bg-white/70 px-4 text-center text-xs font-black text-[#8f96a3]">
              No visible cards in this column.
            </div>
          )}
          <button onClick={openAddTask} className="flex h-10 items-center justify-center gap-2 rounded-[8px] border border-dashed border-[#bfc6d1] bg-white/80 text-xs font-black text-[#8f96a3] transition hover:border-[#7b68ee] hover:bg-white hover:text-[#7b68ee]">
            <CirclePlus size={14} />
            Add task
          </button>
        </div>
      )}
    </section>
  );
}

function LaneHeader({
  column,
  isCollapsed,
  onToggleColumn,
  onAddTask,
}: {
  column: BoardColumn;
  isCollapsed: boolean;
  onToggleColumn: () => void;
  onAddTask: () => void;
}) {
  return (
    <div className="mb-2 rounded-[9px] border border-[#dfe3e8] bg-white shadow-sm">
      <div className={`flex h-10 items-center justify-between ${isCollapsed ? "px-2" : "px-3"}`}>
        <button onClick={onToggleColumn} className={`flex min-w-0 items-center gap-2 rounded-[6px] text-left hover:bg-[#f7f8fb] ${isCollapsed ? "justify-center px-1" : "px-1"}`}>
          <span className={`h-2.5 w-2.5 rounded-[3px] ${column.tone}`} />
          {!isCollapsed && <h2 className="truncate text-[12px] font-black text-[#20242a]">{column.title}</h2>}
          {!isCollapsed && <span className="rounded-full bg-[#eef0f4] px-2 py-0.5 text-[10px] font-black text-[#68707d]">{column.tasks.length}</span>}
        </button>
        {!isCollapsed && <div className="flex items-center gap-1">
          <span className="rounded-[5px] bg-[#f7f8fb] px-1.5 py-0.5 text-[10px] font-black text-[#8f96a3]">{column.wip}</span>
          <button onClick={onAddTask} className="flex h-6 w-6 items-center justify-center rounded-[5px] text-[#8f96a3] hover:bg-[#f7f8fb]" aria-label={`Add task to ${column.title}`}>
            <CirclePlus size={14} />
          </button>
          <button onClick={onToggleColumn} className="flex h-6 w-6 items-center justify-center rounded-[5px] text-[#8f96a3] hover:bg-[#f7f8fb]" aria-label={`Collapse ${column.title}`}>
            <MoreHorizontal size={14} />
          </button>
        </div>}
      </div>
      {!isCollapsed && <div className="h-1 overflow-hidden rounded-b-[9px] bg-[#edf0f3]">
        <div className={`h-full ${column.tone}`} style={{ width: `${Math.min(column.tasks.length * 24, 100)}%` }} />
      </div>}
    </div>
  );
}

function TaskCard({
  task,
  columnTone,
  assigneeInitial,
  isDragging,
  compact,
  showSubtasks,
  isComplete,
  toggleComplete,
  openTask,
  removeTicket,
  onDragStart,
  onDragEnd,
}: {
  task: BoardTask;
  columnTone: string;
  assigneeInitial: string;
  isDragging: boolean;
  compact: boolean;
  showSubtasks: boolean;
  isComplete: boolean;
  toggleComplete: () => void;
  openTask: () => void;
  removeTicket: () => void;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}) {
  return (
    <article
      draggable
      onClick={openTask}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group cursor-pointer rounded-[9px] border border-[#dfe3e8] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8cdd4] hover:shadow-md active:scale-[0.98] ${isDragging ? "scale-[0.98] opacity-50" : "opacity-100"}`}
    >
        <div className="flex items-center justify-between border-b border-[#edf0f3] px-3 py-2">
        <div className="flex items-center gap-2">
          <button onClick={(event) => { event.stopPropagation(); toggleComplete(); }} className={`flex h-4 w-4 items-center justify-center rounded-[3px] border ${isComplete ? "border-[#7b68ee] bg-[#7b68ee] text-white" : "border-[#c8cdd4] bg-white text-transparent group-hover:border-[#7b68ee] group-hover:text-[#7b68ee]"}`}>
            <CheckCircle2 size={12} />
          </button>
          <span className="rounded-[3px] bg-[#f3f4f6] px-1.5 py-0.5 text-[9px] font-black text-[#8f96a3]">{task.id}</span>
        </div>
          <div className="flex items-center gap-2">
            <PriorityPill priority={task.priority} />
            <button onClick={(event) => { event.stopPropagation(); if (confirm('Delete this ticket?')) removeTicket(); }} className="h-6 w-6 rounded-[5px] text-[#e5484d] hover:bg-[#fff1f1]" title="Delete ticket">✕</button>
          </div>
      </div>

      <div className={compact ? "p-2.5" : "p-3"}>
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className={`text-[13px] font-black leading-5 text-[#20242a] ${isComplete ? "text-[#8f96a3] line-through" : ""}`}>{task.content}</p>
          <button onClick={(event) => { event.stopPropagation(); openTask(); }} className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-[5px] text-[#8f96a3] hover:bg-[#f7f8fb] group-hover:flex">
            <MoreHorizontal size={14} />
          </button>
        </div>
        {showSubtasks && <div className="mb-3 flex items-center gap-1.5">
          <span className="rounded-[4px] bg-[#f7f8fb] px-1.5 py-0.5 text-[10px] font-black text-[#68707d]">{task.label}</span>
          <span className="rounded-[4px] bg-[#f7f8fb] px-1.5 py-0.5 text-[10px] font-black text-[#8f96a3]">{task.subtasks} subtasks</span>
        </div>}
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 flex-1 rounded-full ${columnTone}`} />
          <span className={`h-1.5 flex-1 rounded-full ${task.subtasks.startsWith("0") ? "bg-[#e5e7eb]" : columnTone} opacity-45`} />
          <span className="h-1.5 flex-1 rounded-full bg-[#e5e7eb]" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7b68ee] text-[10px] font-black text-white ring-2 ring-white">{assigneeInitial}</span>
            <span className="text-[10px] font-black text-[#8f96a3]">{task.points} pts</span>
            <span className="text-[10px] font-black text-[#8f96a3]">{task.comments} c</span>
          </div>
          <span className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-black ${task.due === "Today" ? "bg-[#fff1f1] text-[#e5484d]" : "bg-[#f7f8fb] text-[#68707d]"}`}>{task.due}</span>
        </div>
      </div>
    </article>
  );
}

function PriorityPill({ priority }: { priority: BoardTask["priority"] }) {
  const className = priority === "Urgent"
    ? "border-[#ffd6d6] bg-[#fff1f1] text-[#e5484d]"
    : priority === "High"
      ? "border-[#ffe1b3] bg-[#fff7e8] text-[#c87900]"
      : priority === "Normal"
        ? "border-[#dfe2e6] bg-white text-[#68707d]"
        : "border-[#e5e7eb] bg-[#f7f8fb] text-[#8f96a3]";
  return <span className={`rounded-[3px] border px-1.5 py-0.5 text-[9px] font-black ${className}`}>{priority}</span>;
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
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export default function KanbanBoardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KanbanBoardContent />
    </Suspense>
  );
}
