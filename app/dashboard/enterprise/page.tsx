"use client";
import Link from "next/link";
import SpacesSection from "@/components/SpacesSection";
import React, { ReactNode, useEffect, useState } from "react";
import { authService, UserProfile } from "@/services/auth.service";
import { dashboardService, DashboardStats, ActivityItem, AssignedTask } from "@/services/dashboard.service";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Clock3,
  FolderKanban,
  Home,
  Layers3,
  LayoutGrid,
  MoreHorizontal,
  Search,
  Settings,
  Star,
  Users,
  CheckCircle2,
  CalendarDays,
  Activity,
  PanelsTopLeft,
  BriefcaseBusiness,
  BarChart3,
  Workflow,
  History,
  Download,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const favorites = [
  "Frontend space",
  "Sprint board",
  "Auth project",
  "Design system",
];

const quickActions = [
  "Create new space",
  "Open project board",
  "Invite team members",
  "Create task",
];

const deadlines = [
  {
    title: "Homepage review",
    date: "Today",
  },
  {
    title: "Frontend auth polish",
    date: "Tomorrow",
  },
  {
    title: "Team sync meeting",
    date: "Friday",
  },
];

export default function HomePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, st, act, tsk] = await Promise.all([
          authService.getProfile(),
          dashboardService.getStats(),
          dashboardService.getRecentActivity(),
          dashboardService.getAssignedTasks(),
        ]);
        setProfile(prof);
        setStats(st);
        setActivities(act);
        setTasks(tsk);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="flex min-h-screen">
        <aside className={`hidden ${isCollapsed ? "w-20" : "w-72"} border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out px-4 py-5 xl:block overflow-hidden relative group`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:text-zinc-900 opacity-0 group-hover:opacity-100"
          >
            {isCollapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
          </button>

          <div className={`mb-6 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 transition-all ${isCollapsed ? "justify-center px-1" : ""}`}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-bold text-white">
              {profile?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">AgileFlow</p>
                <p className="text-xs text-zinc-500">Project workspace</p>
              </div>
            )}
            {!isCollapsed && <ChevronDown size={16} className="text-zinc-400" />}
          </div>

          <div className="mb-6 space-y-1">
            <SidebarItem icon={<Home size={18} />} label="Home" href="/dashboard/enterprise" active isCollapsed={isCollapsed} />
            <SidebarItem icon={<LayoutGrid size={18} />} label="Dashboard" href="/dashboard/enterprise" isCollapsed={isCollapsed} />
          </div>

          <SectionTitle title="Agile Tools" isCollapsed={isCollapsed} />
          <div className="mb-6 space-y-1">
            <SidebarItem icon={<Layers3 size={18} />} label="Backlog" href="/sprint" isCollapsed={isCollapsed} />
            <SidebarItem icon={<PanelsTopLeft size={18} />} label="Active Board" href="/Board/kanban" isCollapsed={isCollapsed} />
            <SidebarItem icon={<CalendarDays size={18} />} label="Timeline" href="/Board/Timeline" isCollapsed={isCollapsed} />
            <SidebarItem icon={<Workflow size={18} />} label="Releases" href="/release" isCollapsed={isCollapsed} />
          </div>

          <SectionTitle title="Management" isCollapsed={isCollapsed} />
          <div className="mb-6 space-y-1">
            <SidebarItem icon={<FolderKanban size={18} />} label="Projects" href="/project" isCollapsed={isCollapsed} />
            <SidebarItem icon={<CheckCircle2 size={18} />} label="Tasks" href="/tickets" isCollapsed={isCollapsed} />
            <SidebarItem icon={<BarChart3 size={18} />} label="Reports" href="/reports" isCollapsed={isCollapsed} />
          </div>

          <SectionTitle title="System" isCollapsed={isCollapsed} />
          <div className="mb-6 space-y-1">
            <SidebarItem icon={<Download size={18} />} label="Import" href="/import" isCollapsed={isCollapsed} />
            <SidebarItem icon={<History size={18} />} label="Audit Logs" href="/audit" isCollapsed={isCollapsed} />
            <SidebarItem icon={<Users size={18} />} label="Teams" href="/chat" isCollapsed={isCollapsed} />
            <SidebarItem icon={<Settings size={18} />} label="Settings" href="/user_profile" isCollapsed={isCollapsed} />
          </div>

          <SectionTitle title="Spaces" isCollapsed={isCollapsed} />
          <SpacesSection variant="sidebar" isCollapsed={isCollapsed} />
        </aside>

        <section className="flex-1">
          <header className="border-b border-zinc-200 bg-white px-4 py-4 md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2 text-sm text-zinc-500">
                  <span>Workspace</span>
                  <ChevronRight size={14} />
                  <span className="text-zinc-700">Home</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back, {profile?.username || "loading..."}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Manage your spaces, follow recent activity, and keep track of your work.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2">
                  <Search size={16} className="text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-44 bg-transparent text-sm outline-none"
                  />
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
                  <CirclePlus size={16} />
                  Create
                </button>

                <Link href="/notifications" className="rounded-xl border border-zinc-300 p-2 text-zinc-700 transition hover:bg-zinc-100">
                  <Bell size={18} />
                </Link>

                <Link href="/user_profile" className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2 hover:bg-zinc-50 transition">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      (profile?.username?.charAt(0).toUpperCase() || "A")
                    )}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium">{profile?.username || "Aya Achiban"}</p>
                    <p className="text-xs text-zinc-500">{profile?.bio || "Frontend"}</p>
                  </div>
                </Link>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8">
            <section className="mb-8 grid gap-4 xl:grid-cols-4">
              <MetricCard title="Total projects" value={stats?.total_projects.toString() || "0"} subtitle="Active projects" />
              <MetricCard title="Owned projects" value={stats?.owned_projects.toString() || "0"} subtitle="Projects created by you" />
              <MetricCard title="Member projects" value={stats?.member_projects.toString() || "0"} subtitle="Collaborations" />
              <MetricCard title="Archived" value={stats?.archived_projects.toString() || "0"} subtitle="Inactive projects" />
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Spaces</h2>
                  <p className="text-sm text-zinc-500">
                    Organize work by teams and functional areas.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-50">
                    View all
                  </button>
                  <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
                    Create space
                  </button>
                </div>
              </div>

              <SpacesSection />
            </section>

            <section className="mb-4">
              <h2 className="text-xl font-semibold">Your work</h2>
              <p className="text-sm text-zinc-500">
                Quick access to important items, ongoing tasks, and team activity.
              </p>
            </section>

            <div className="grid gap-6 2xl:grid-cols-12">
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md 2xl:col-span-4">
                <BlockTitle icon={<Star size={18} />} title="Favorites" />
                <div className="space-y-3">
                  {favorites.map((item) => (
                    <RowCard key={item} text={item} />
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md 2xl:col-span-4">
                <BlockTitle icon={<Activity size={18} />} title="Recent activity" />
                <div className="space-y-3">
                  {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-12 bg-zinc-50 animate-pulse rounded-xl" />)
                  ) : activities.length > 0 ? (
                    activities.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                      >
                        <p className="text-sm font-medium text-zinc-800">{item.title}</p>
                        <p className="mt-1 text-xs text-zinc-500">{item.meta}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400">No recent activity.</p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md 2xl:col-span-4">
                <BlockTitle icon={<CheckCircle2 size={18} />} title="Assigned to me" />
                <div className="space-y-3">
                  {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-12 bg-zinc-50 animate-pulse rounded-xl" />)
                  ) : tasks.length > 0 ? (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                      >
                        <p className="text-sm text-zinc-800">{task.title}</p>
                        <span className="rounded-full bg-zinc-200 px-2.5 py-1 text-[10px] font-bold text-zinc-700 uppercase tracking-tight">
                          {task.priority || "Medium"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400">All caught up!</p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md 2xl:col-span-6">
                <BlockTitle icon={<CirclePlus size={18} />} title="Quick actions" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-left text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md 2xl:col-span-6">
                <BlockTitle icon={<CalendarDays size={18} />} title="Upcoming deadlines" />
                <div className="space-y-3">
                  {deadlines.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                    >
                      <p className="text-sm font-medium text-zinc-800">{item.title}</p>
                      <span className="text-xs text-zinc-500">{item.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SidebarItem({
  icon,
  label,
  href = "#",
  active = false,
  isCollapsed = false,
}: {
  icon: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  isCollapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      title={isCollapsed ? label : ""}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${isCollapsed ? "justify-center px-1" : ""} ${active
          ? "bg-zinc-900 text-white"
          : "text-zinc-700 hover:bg-zinc-100"
        }`}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        {icon}
      </div>
      {!isCollapsed && <span className="truncate text-sm font-medium">{label}</span>}
      {isCollapsed && <span className="absolute left-16 z-50 hidden rounded bg-zinc-900 px-2 py-1 text-[10px] text-white shadow-lg group-hover:block whitespace-nowrap">{label}</span>}
    </Link>
  );
}

function SectionTitle({ title, isCollapsed = false }: { title: string, isCollapsed?: boolean }) {
  if (isCollapsed) return <div className="my-4 h-[1px] bg-zinc-200" />;
  return (
    <div className="mb-3 mt-6 flex items-center justify-between px-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      <button className="text-zinc-400 hover:text-zinc-700">
        <CirclePlus size={16} />
      </button>
    </div>
  );
}

function BlockTitle({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}

function RowCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800">
      {text}
    </div>
  );
}

function AvatarDot() {
  return <div className="h-7 w-7 rounded-full border-2 border-white bg-zinc-300" />;
}