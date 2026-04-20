"use client";

import type { ReactNode } from "react";
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
} from "lucide-react";

const spaces = [
  {
    name: "Engineering",
    description: "Development tasks, bugs, sprint planning and technical delivery.",
    members: 12,
    tasks: 24,
    updated: "Updated 2h ago",
    status: "Active",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Design",
    description: "UI/UX work, prototypes, component system and product visuals.",
    members: 5,
    tasks: 13,
    updated: "Updated 4h ago",
    status: "Active",
    color: "bg-pink-100 text-pink-700",
  },
  {
    name: "Marketing",
    description: "Campaign planning, brand content and growth coordination.",
    members: 7,
    tasks: 18,
    updated: "Updated today",
    status: "In progress",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Product",
    description: "Roadmap definition, feedback analysis and feature planning.",
    members: 4,
    tasks: 9,
    updated: "Updated yesterday",
    status: "Planning",
    color: "bg-amber-100 text-amber-700",
  },
];

const favorites = [
  "Frontend space",
  "Sprint board",
  "Auth project",
  "Design system",
];

const recentActivity = [
  {
    title: "Authentication flow updated",
    meta: "Aya • 24 min ago",
  },
  {
    title: "OTP verification task completed",
    meta: "Hassine • 1h ago",
  },
  {
    title: "Register page UI improved",
    meta: "Aya • 2h ago",
  },
  {
    title: "Backend auth endpoints connected",
    meta: "Team • Today",
  },
];

const assignedTasks = [
  {
    title: "Finalize Jira-inspired homepage",
    priority: "High",
  },
  {
    title: "Create spaces section UI",
    priority: "Medium",
  },
  {
    title: "Improve auth pages design",
    priority: "Medium",
  },
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
  
  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-zinc-200 bg-white px-4 py-5 xl:block">
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-bold text-white">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">AgileFlow</p>
              <p className="text-xs text-zinc-500">Project workspace</p>
            </div>
            <ChevronDown size={16} className="text-zinc-400" />
          </div>

          <div className="mb-6 space-y-2">
            <SidebarItem icon={<Home size={18} />} label="Home" active />
            <SidebarItem icon={<Layers3 size={18} />} label="Spaces" />
            <SidebarItem icon={<FolderKanban size={18} />} label="Projects" />
            <SidebarItem icon={<CheckCircle2 size={18} />} label="Tasks" />
            <SidebarItem icon={<Users size={18} />} label="Teams" />
            <SidebarItem icon={<Settings size={18} />} label="Settings" />
          </div>

          <SectionTitle title="Favorites" />
          <div className="mb-6 space-y-2">
            {favorites.map((item) => (
              <MiniSidebarItem key={item} icon={<Star size={14} />} label={item} />
            ))}
          </div>

          <SectionTitle title="Recent" />
          <div className="mb-6 space-y-2">
            {["HomePage", "Register", "Auth Flow", "Spaces"].map((item) => (
              <MiniSidebarItem key={item} icon={<Clock3 size={14} />} label={item} />
            ))}
          </div>

          <SectionTitle title="Workspaces" />
          <div className="space-y-2">
            <MiniSidebarItem icon={<BriefcaseBusiness size={14} />} label="Product Team" />
            <MiniSidebarItem icon={<PanelsTopLeft size={14} />} label="Development Team" />
          </div>
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
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, Aya</h1>
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

                <button className="rounded-xl border border-zinc-300 p-2 text-zinc-700 transition hover:bg-zinc-100">
                  <Bell size={18} />
                </button>

                <div className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                    AA
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium">Aya Achiban</p>
                    <p className="text-xs text-zinc-500">Frontend</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8">
            <section className="mb-8 grid gap-4 xl:grid-cols-4">
              <MetricCard title="Total spaces" value="4" subtitle="Active team workspaces" />
              <MetricCard title="Assigned tasks" value="3" subtitle="Currently assigned to you" />
              <MetricCard title="Recent updates" value="12" subtitle="Changes in the last 24h" />
              <MetricCard title="Upcoming deadlines" value="3" subtitle="Planned this week" />
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

              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                {spaces.map((space) => (
                  <div
                    key={space.name}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl p-3 ${space.color}`}>
                          <LayoutGrid size={18} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{space.name}</h3>
                          <span className="text-xs text-zinc-500">
                            {space.members} members
                          </span>
                        </div>
                      </div>

                      <button className="text-zinc-400 hover:text-zinc-700">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <p className="mb-3 text-sm leading-6 text-zinc-600">
                      {space.description}
                    </p>

                    <p className="mb-4 text-xs text-zinc-500">
                      {space.tasks} tasks • {space.updated}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                        {space.status}
                      </span>

                      <div className="flex -space-x-2">
                        <AvatarDot />
                        <AvatarDot />
                        <AvatarDot />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                  {recentActivity.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                    >
                      <p className="text-sm font-medium text-zinc-800">{item.title}</p>
                      <p className="mt-1 text-xs text-zinc-500">{item.meta}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md 2xl:col-span-4">
                <BlockTitle icon={<CheckCircle2 size={18} />} title="Assigned to me" />
                <div className="space-y-3">
                  {assignedTasks.map((task) => (
                    <div
                      key={task.title}
                      className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                    >
                      <p className="text-sm text-zinc-800">{task.title}</p>
                      <span className="rounded-full bg-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {task.priority}
                      </span>
                    </div>
                  ))}
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
  active = false,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-zinc-900 text-white"
          : "text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MiniSidebarItem({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100">
      <span className="text-zinc-400">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
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