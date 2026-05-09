"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, type UserProfile } from "@/services/auth.service";
import { dashboardService, type ActivityItem, type AssignedTask, type DashboardStats } from "@/services/dashboard.service";
import { orgService, type Organization, type Workspace } from "@/services/org.service";
import { Activity, CalendarDays, CheckCircle2, CirclePlus, FolderKanban, MoreHorizontal, Search, Star, Users, Workflow } from "lucide-react";

type FocusItem = {
  id: string;
  title: string;
  status: "IN PROGRESS" | "REVIEW" | "TO DO";
  owner: string;
  due: string;
  priority: string;
};

type DashboardPanel = "customize" | "task" | "invite" | "view";

const focusItems: FocusItem[] = [
  { id: "PM-142", title: "Refine ClickUp-style workspace shell", status: "IN PROGRESS", owner: "AA", due: "Today", priority: "Urgent" },
  { id: "PM-136", title: "Review sprint backlog priorities", status: "REVIEW", owner: "MK", due: "May 8", priority: "High" },
  { id: "PM-128", title: "Prepare release checklist", status: "TO DO", owner: "YS", due: "Next week", priority: "Low" },
  { id: "PM-119", title: "QA task drawer interactions", status: "IN PROGRESS", owner: "HA", due: "Tomorrow", priority: "Medium" },
];

const overviewColumns = [
  { title: "To Do", filter: "TO DO" as const, count: 8, color: "bg-[#87909e]", width: "w-[54%]" },
  { title: "Doing", filter: "IN PROGRESS" as const, count: 5, color: "bg-[#1090e0]", width: "w-[42%]" },
  { title: "Review", filter: "REVIEW" as const, count: 3, color: "bg-[#f8ae00]", width: "w-[28%]" },
  { title: "Done", filter: "All" as const, count: 12, color: "bg-[#00b884]", width: "w-[76%]" },
];

const quickActions = ["Create task", "Open board", "Invite teammate", "Add view"];

export default function EnterpriseDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState<DashboardPanel | null>(null);
  const [localFocusItems, setLocalFocusItems] = useState<FocusItem[]>(focusItems);
  const [statusFilter, setStatusFilter] = useState<"All" | FocusItem["status"]>("All");
  const [completedFocus, setCompletedFocus] = useState<Set<string>>(new Set());
  const [hiddenWidgets, setHiddenWidgets] = useState<Set<string>>(new Set());
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedFocus, setSelectedFocus] = useState<FocusItem | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [doneUpcoming, setDoneUpcoming] = useState<Set<string>>(new Set());

  useEffect(() => {
    // fetchData is defined below and used on mount and via the Refresh button
    fetchData();
  }, []);

  // fetchData: reusable loader for initial mount and manual refresh
  async function fetchData() {
    setLoading(true);
    try {
      const [profileData, statsData, activityData, taskData, orgsData, workspacesData] = await Promise.all([
        authService.getProfile(),
        dashboardService.getStats(),
        dashboardService.getRecentActivity(),
        dashboardService.getAssignedTasks(),
        orgService.getOrganizations(),
        orgService.getWorkspaces(),
      ]);
      setProfile(profileData);
      setStats(statsData);
      setActivities(activityData);
      setTasks(taskData);
      setOrganizations(orgsData || []);
      setWorkspaces(workspacesData || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      setNotice("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  const filteredFocusItems = localFocusItems.filter((item) => {
    const matchesSearch = `${item.title} ${item.id} ${item.owner} ${item.priority}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const visibleActivities = activities.filter((item) => `${item.title} ${item.meta}`.toLowerCase().includes(search.toLowerCase()));
  const visibleAssignedTasks = (tasks.length > 0 ? tasks.slice(0, 4) : localFocusItems).filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));
  const isWidgetVisible = (widget: string) => !hiddenWidgets.has(widget);
  const addLocalTask = () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    const nextTask: FocusItem = {
      id: `PM-${Math.floor(Date.now() / 1000)}`,
      title,
      status: "TO DO",
      owner: profile?.username?.slice(0, 2).toUpperCase() || "AA",
      due: "Tomorrow",
      priority: "Medium",
    };
    setLocalFocusItems((current) => [nextTask, ...current]);
    setSelectedFocus(nextTask);
    setNewTaskTitle("");
    setPanel(null);
    setNotice("Local task added to the focus list.");
  };
  const inviteTeammate = () => {
    if (!inviteEmail.trim()) return;
    setNotice(`Invite staged for ${inviteEmail.trim()}.`);
    setInviteEmail("");
    setPanel(null);
  };

  return (
    <main className="min-h-full bg-[#f7f8fb] p-4">
      {notice && (
        <div className="mb-3 flex items-center justify-between rounded-[9px] border border-[#d7f4e8] bg-[#ecfff6] px-3 py-2 text-xs font-black text-[#008f65]">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} className="text-[#008f65]/70 hover:text-[#008f65]">Dismiss</button>
        </div>
      )}
      <section className="mb-4 rounded-[11px] border border-[#dfe3e8] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#edf0f3] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-[21px] font-black text-[#20242a]">Good morning, {profile?.username || "Aya"}</h1>
          </div>
            <p className="mt-0.5 text-xs font-semibold text-[#7c828d]">A dense command center for active sprint delivery, review queues, and team activity.</p>
          </div>
            <div className="flex flex-wrap items-center gap-2">
            <div className="hidden h-8 w-64 items-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2.5 xl:flex">
              <Search size={14} className="text-[#8f96a3]" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold outline-none placeholder:text-[#9aa1ad]" placeholder="Search dashboard..." />
            </div>
            <button onClick={() => fetchData()} disabled={loading} className="rounded-[7px] border border-[#dfe3e8] bg-white px-3 py-1.5 text-xs font-black text-[#68707d] shadow-sm transition hover:bg-[#f7f8fb] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button onClick={() => setPanel("customize")} className="rounded-[7px] border border-[#dfe3e8] bg-white px-3 py-1.5 text-xs font-black text-[#68707d] shadow-sm transition hover:bg-[#f7f8fb] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">Customize</button>
            <button onClick={() => setPanel("task")} className="rounded-[7px] bg-[var(--primary-color)] px-3.5 py-1.5 text-xs font-black text-white shadow-sm transition hover:bg-[var(--primary-color-hover)] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">New task</button>
          </div>
        </div>
        <div className="grid divide-y divide-[#edf0f3] md:grid-cols-4 md:divide-x md:divide-y-0">
          <MetricStrip title="Total projects" value={(stats?.total_projects ?? 0).toString()} subtitle="workspace projects" color="bg-[#7b68ee]" onClick={() => router.push("/project")} />
          <MetricStrip title="Owned projects" value={(stats?.owned_projects ?? 0).toString()} subtitle="created by you" color="bg-[#1090e0]" onClick={() => router.push("/project")} />
          <MetricStrip title="Collaborations" value={(stats?.member_projects ?? 0).toString()} subtitle="shared spaces" color="bg-[#f8ae00]" onClick={() => router.push("/chat")} />
          <MetricStrip title="Archived" value={(stats?.archived_projects ?? 0).toString()} subtitle="inactive work" color="bg-[#87909e]" onClick={() => setNotice("Archived project filter is staged locally.")} />
        </div>
      </section>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_370px]">
        <section className="space-y-4">
          <Panel title="Workspace overview" icon={<FolderKanban size={16} />} action={<button onClick={() => router.push("/Board/kanban")} className="flex h-7 items-center gap-1 rounded-[6px] border border-[#dfe3e8] bg-white px-2 text-[11px] font-black text-[#68707d]">Open board</button>}>
            <div className="mb-3 flex flex-wrap gap-1">
              {["All", "TO DO", "IN PROGRESS", "REVIEW"].map((item) => (
                <button key={item} onClick={() => setStatusFilter(item as "All" | FocusItem["status"])} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${statusFilter === item ? "border border-[#dfe3e8] bg-white text-[#20242a] shadow-sm" : "text-[#68707d] hover:bg-white"}`}>{item}</button>
              ))}
            </div>
            <div className="grid gap-3 lg:grid-cols-4">
              {overviewColumns.map((column) => (
                <button key={column.title} onClick={() => setStatusFilter(column.filter)} className={`rounded-[9px] border p-3 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm ${statusFilter === column.filter ? "border-[#d7d1ff] bg-[#f3efff]" : "border-[#dfe3e8] bg-[#f7f8fb]"}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-[3px] ${column.color}`} />
                    <span className="text-xs font-black text-[#20242a]">{column.title}</span>
                    <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-[#68707d]">{column.count}</span>
                  </div>
                  <div className="mb-3 h-1.5 rounded-full bg-[#e4e7ec]">
                    <div className={`h-full rounded-full ${column.color} ${column.width}`} />
                  </div>
                  <div className="space-y-1.5">
                    <MiniCard strong />
                    <MiniCard />
                    {column.title === "Doing" && <MiniCard />}
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Focus list" icon={<CheckCircle2 size={16} />} action={<button onClick={() => setPanel("task")} className="flex h-7 items-center gap-1 rounded-[6px] bg-[#7b68ee] px-2.5 text-[11px] font-black text-white"><CirclePlus size={13} />Task</button>}>
            <FocusTable
              items={filteredFocusItems}
              completed={completedFocus}
              onOpen={setSelectedFocus}
              onToggleComplete={(itemId) => setCompletedFocus((current) => {
                const next = new Set(current);
                if (next.has(itemId)) next.delete(itemId);
                else next.add(itemId);
                return next;
              })}
            />
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2">
            {/* Removed demo-only sprint and team widgets to keep dashboard focused. */}
            <Panel title="Workspace overview" icon={<FolderKanban size={16} />}>
              <div className="space-y-2">
                <p className="text-sm font-black text-[#20242a]">Organization</p>
                <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase text-[#8f96a3]">Organization</p>
                      <p className="mt-1 text-sm font-black text-[#20242a]">{organizations.length > 0 ? organizations[0].name : profile?.username || "Your organization"}</p>
                    </div>
                    <button onClick={() => router.push("/orgs")} className="h-8 rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-sm font-black text-[#68707d]">Open</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => router.push("/workspaces")} className="rounded-[7px] border border-[#edf0f3] bg-white p-2 text-xs font-black">Workspaces ({workspaces.length})</button>
                    <button onClick={() => router.push("/project")} className="rounded-[7px] border border-[#edf0f3] bg-white p-2 text-xs font-black">Projects ({stats?.total_projects ?? 0})</button>
                    <button onClick={() => router.push(workspaces[0] ? `/workspaces/${workspaces[0].id}` : "/workspaces")} className="rounded-[7px] border border-[#edf0f3] bg-white p-2 text-xs font-black">Open workspace</button>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </section>

        <aside className="space-y-4">
          <Panel title="Quick actions" icon={<CirclePlus size={16} />} action={<MoreHorizontal size={15} className="text-[#a2a9b5]" />}>
            <div className="grid gap-2">
              {quickActions.map((action) => (
                <button key={action} onClick={() => {
                  if (action === "Open board") router.push("/Board/kanban");
                  else if (action === "Create task") setPanel("task");
                  else if (action === "Invite teammate") setPanel("invite");
                  else setPanel("view");
                }} className="flex h-10 items-center justify-between rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-left text-sm font-black text-[#20242a] transition hover:border-[#c8cdd4] hover:bg-white">
                  {action}
                  <CirclePlus size={14} className="text-[var(--primary-color)]" />
                </button>
              ))}
            </div>
          </Panel>

          {isWidgetVisible("activity") && <Panel title="Recent activity" icon={<Activity size={16} />}>
            <ActivityList activities={visibleActivities} loading={loading} onOpen={setSelectedActivity} />
          </Panel>}

          {isWidgetVisible("assigned") && <Panel title="Assigned to me" icon={<Star size={16} />}>
            <AssignedList tasks={visibleAssignedTasks} onOpen={() => router.push("/tickets")} />
          </Panel>}

          {isWidgetVisible("upcoming") && <Panel title="Upcoming" icon={<CalendarDays size={16} />}>
            <div className="space-y-2">
              {["Homepage review", "Frontend auth polish", "Team sync meeting"].map((title, index) => (
                <button key={title} onClick={() => setDoneUpcoming((current) => {
                  const next = new Set(current);
                  if (next.has(title)) next.delete(title);
                  else next.add(title);
                  return next;
                })} className="flex w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 py-2 text-left hover:bg-white">
                  <p className={`text-sm font-black text-[#20242a] ${doneUpcoming.has(title) ? "text-[#8f96a3] line-through" : ""}`}>{title}</p>
                  <span className={`text-xs font-black ${index === 0 ? "text-[#e5484d]" : "text-[#8f96a3]"}`}>{index === 0 ? "Today" : index === 1 ? "Tomorrow" : "Friday"}</span>
                </button>
              ))}
            </div>
          </Panel>}
        </aside>
      </div>
      {panel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setPanel(null)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">{panel === "customize" ? "Customize dashboard" : panel === "task" ? "Create local task" : panel === "invite" ? "Invite teammate" : "Add view"}</h2>
              <button onClick={() => setPanel(null)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            {panel === "customize" && <CustomizePanel hiddenWidgets={hiddenWidgets} setHiddenWidgets={setHiddenWidgets} />}
            {panel === "view" && <ViewPanel onOpen={(href) => { router.push(href); setPanel(null); }} />}
            {panel === "invite" && (
              <div className="space-y-3">
                <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") inviteTeammate(); }} autoFocus placeholder="teammate@company.com" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[var(--primary-color)]" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setPanel(null)} className="h-8 rounded-[7px] border border-[#dfe3e8] px-3 text-xs font-black text-[#68707d]">Cancel</button>
                  <button onClick={inviteTeammate} className="h-8 rounded-[7px] bg-[var(--primary-color)] px-3.5 text-xs font-black text-white">Invite</button>
                </div>
              </div>
            )}
            {panel === "task" && (
              <div className="space-y-3">
                <input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addLocalTask(); }} autoFocus placeholder="Task title" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[var(--primary-color)]" />
                <div className="grid grid-cols-2 gap-2">
                  {["Assignee: You", "Status: To Do", "Due: Tomorrow", "Priority: Medium"].map((item) => <div key={item} className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-xs font-black text-[#68707d]">{item}</div>)}
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setPanel(null)} className="h-8 rounded-[7px] border border-[#dfe3e8] px-3 text-xs font-black text-[#68707d]">Cancel</button>
                  <button onClick={addLocalTask} className="h-8 rounded-[7px] bg-[var(--primary-color)] px-3.5 text-xs font-black text-white">Create</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
      {(selectedFocus || selectedActivity) && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#20242a]/35 backdrop-blur-sm" onMouseDown={() => { setSelectedFocus(null); setSelectedActivity(null); }}>
          <aside onMouseDown={(event) => event.stopPropagation()} className="h-full w-full max-w-lg overflow-y-auto border-l border-[#dfe3e8] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase text-[#8f96a3]">{selectedFocus?.id || "Activity"}</p>
                <h2 className="mt-1 text-xl font-black text-[#20242a]">{selectedFocus?.title || selectedActivity?.title}</h2>
              </div>
              <button onClick={() => { setSelectedFocus(null); setSelectedActivity(null); }} className="h-8 w-8 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            {selectedFocus ? (
              <div className="grid grid-cols-2 gap-2">
                <SummaryCell label="Status" value={selectedFocus.status} />
                <SummaryCell label="Owner" value={selectedFocus.owner} />
                <SummaryCell label="Due" value={selectedFocus.due} />
                <SummaryCell label="Priority" value={selectedFocus.priority} />
              </div>
            ) : (
              <div className="rounded-[9px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-semibold leading-6 text-[#59606b]">{selectedActivity?.meta}</div>
            )}
            <button onClick={() => router.push("/tickets")} className="mt-4 h-9 rounded-[7px] bg-[var(--primary-color)] px-4 text-sm font-black text-white">Open task list</button>
          </aside>
        </div>
      )}
    </main>
  );
}

function Panel({ title, icon, action, children }: { title: string; icon: ReactNode; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[10px] border border-[#dfe3e8] bg-white p-3.5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="text-[var(--primary-color)]">{icon}</div>
          <h2 className="text-sm font-black text-[#20242a]">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MetricStrip({ title, value, subtitle, color, onClick }: { title: string; value: string; subtitle: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#f7f8fb]">
      <span className={`h-9 w-1 rounded-full ${color}`} />
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase text-[#8f96a3]">{title}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-black text-[#20242a]">{value}</p>
          <p className="truncate text-xs font-semibold text-[#7c828d]">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}

function FocusTable({
  items,
  completed,
  onOpen,
  onToggleComplete,
}: {
  items: FocusItem[];
  completed: Set<string>;
  onOpen: (item: FocusItem) => void;
  onToggleComplete: (itemId: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-[#dfe3e8]">
      <div className="min-w-[720px]">
      <div className="grid h-8 grid-cols-[42px_minmax(280px,1fr)_126px_92px_92px_86px] items-center bg-[#f8f9fb] text-[10px] font-black uppercase tracking-[0.02em] text-[#68707d]">
        <div className="flex h-full items-center justify-center border-r border-[#e4e6ea]">
          <span className="h-3.5 w-3.5 rounded-[3px] border border-[#c8cdd4] bg-white" />
        </div>
        <div className="px-3">Task</div>
        <div className="border-l border-[#e4e6ea] px-3">Status</div>
        <div className="border-l border-[#e4e6ea] px-3">Owner</div>
        <div className="border-l border-[#e4e6ea] px-3">Due</div>
        <div className="border-l border-[#e4e6ea] px-3">Priority</div>
      </div>
      {items.length === 0 && <div className="px-3 py-6 text-center text-sm font-bold text-[#8f96a3]">No matching focus items.</div>}
      {items.map((item, index) => (
        <button key={item.id} onClick={() => onOpen(item)} className={`group grid h-10 grid-cols-[42px_minmax(280px,1fr)_126px_92px_92px_86px] items-center border-t border-[#edf0f3] text-left text-xs hover:bg-[#f5f7fa] ${index === 0 ? "bg-[#f3efff] shadow-[inset_4px_0_0_#7b68ee]" : "bg-white"}`}>
          <div className="flex h-full items-center justify-center border-r border-[#e5e7eb]">
            <span onClick={(event) => { event.stopPropagation(); onToggleComplete(item.id); }} className={`flex h-4 w-4 items-center justify-center rounded-[3px] border ${completed.has(item.id) ? "border-[var(--primary-color)] bg-[var(--primary-color)] text-white" : "border-[#c8cdd4] bg-white text-transparent group-hover:border-[var(--primary-color)]"}`}>
              <CheckCircle2 size={12} />
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2 px-3">
            <span className={`truncate font-black text-[#20242a] ${completed.has(item.id) ? "text-[#8f96a3] line-through" : ""}`}>{item.title}</span>
            <span className="rounded-[3px] bg-[#f3f4f6] px-1 py-[2px] text-[9px] font-black text-[#8f96a3]">{item.id}</span>
          </div>
          <div className="border-l border-[#e5e7eb] px-3"><StatusPill status={item.status} /></div>
          <div className="flex items-center gap-1.5 border-l border-[#e5e7eb] px-3"><Avatar initials={item.owner} /></div>
          <div className={`border-l border-[#e5e7eb] px-3 font-black ${item.due === "Today" ? "text-[#e5484d]" : "text-[#68707d]"}`}>{item.due}</div>
          <div className="border-l border-[#e5e7eb] px-3 font-black text-[#8f96a3]">{item.priority}</div>
        </button>
      ))}
      </div>
    </div>
  );
}

function ActivityList({ activities, loading, onOpen }: { activities: ActivityItem[]; loading: boolean; onOpen: (item: ActivityItem) => void }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-12 animate-pulse rounded-[8px] bg-[#f7f8fb]" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return <p className="text-xs font-semibold text-[#8f96a3]">No recent activity.</p>;
  }

  return (
    <div className="space-y-2">
      {activities.slice(0, 4).map((item) => (
        <button key={item.id} onClick={() => onOpen(item)} className="w-full rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 py-2 text-left hover:bg-white">
          <p className="text-sm font-black text-[#20242a]">{item.title}</p>
          <p className="mt-0.5 text-xs font-semibold text-[#8f96a3]">{item.meta}</p>
        </button>
      ))}
    </div>
  );
}

function AssignedList({ tasks, onOpen }: { tasks: Array<AssignedTask | FocusItem>; onOpen: () => void }) {
  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <button key={task.id || index} onClick={onOpen} className="flex w-full items-center justify-between gap-2 rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 py-2 text-left hover:bg-white">
          <p className="truncate text-sm font-black text-[#20242a]">{task.title}</p>
          <span className="shrink-0 rounded-[3px] bg-white px-1.5 py-0.5 text-[10px] font-black text-[#8f96a3]">{task.priority || "Med"}</span>
        </button>
      ))}
      {tasks.length === 0 && <p className="text-xs font-semibold text-[#8f96a3]">No matching assigned work.</p>}
    </div>
  );
}

function CustomizePanel({
  hiddenWidgets,
  setHiddenWidgets,
}: {
  hiddenWidgets: Set<string>;
  setHiddenWidgets: (updater: (current: Set<string>) => Set<string>) => void;
}) {
  const widgets = [
    { id: "sprint", label: "Sprint pulse" },
    { id: "team", label: "Team load" },
    { id: "activity", label: "Recent activity" },
    { id: "assigned", label: "Assigned to me" },
    { id: "upcoming", label: "Upcoming" },
  ];

  return (
    <div className="space-y-2">
      {widgets.map((widget) => (
        <button
          key={widget.id}
          onClick={() => setHiddenWidgets((current) => {
            const next = new Set(current);
            if (next.has(widget.id)) next.delete(widget.id);
            else next.add(widget.id);
            return next;
          })}
          className="flex h-10 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a] hover:bg-white"
        >
          {widget.label}
          <span className={hiddenWidgets.has(widget.id) ? "text-[#8f96a3]" : "text-[#00b884]"}>{hiddenWidgets.has(widget.id) ? "Hidden" : "Visible"}</span>
        </button>
      ))}
    </div>
  );
}

function ViewPanel({ onOpen }: { onOpen: (href: string) => void }) {
  return (
    <div className="space-y-2">
      {[
        { label: "List", href: "/tickets" },
        { label: "Board", href: "/Board/kanban" },
        { label: "Timeline", href: "/Board/Timeline" },
        { label: "Reports", href: "/reports" },
      ].map((view) => (
        <button key={view.href} onClick={() => onOpen(view.href)} className="flex h-10 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a] hover:bg-white">
          {view.label}
          <span className="text-[var(--primary-color)]">Open</span>
        </button>
      ))}
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

function MiniCard({ strong = false }: { strong?: boolean }) {
  return (
    <div className={`rounded-[6px] border border-[#dfe3e8] bg-white p-2 shadow-sm ${strong ? "h-10" : "h-8"}`}>
      <div className="flex gap-1.5">
        <span className="h-1.5 w-12 rounded-full bg-[#c8cdd4]" />
        <span className="h-1.5 w-6 rounded-full bg-[#e4e7ec]" />
      </div>
      {strong && <div className="mt-2 h-1.5 w-20 rounded-full bg-[#edf0f3]" />}
    </div>
  );
}

function StatusPill({ status }: { status: FocusItem["status"] }) {
  const className = status === "IN PROGRESS" ? "bg-[#1090e0]" : status === "REVIEW" ? "bg-[#f8ae00]" : "bg-[#87909e]";
  return <span className={`inline-flex h-5 min-w-[92px] items-center justify-center rounded-[3px] px-2 text-[9px] font-black text-white ${className}`}>{status}</span>;
}

function Avatar({ initials }: { initials: string }) {
  return <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-color)] text-[10px] font-black text-white ring-2 ring-white">{initials}</span>;
}
