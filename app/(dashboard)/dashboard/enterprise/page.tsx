"use client";
import React, { useEffect, useState } from "react";
import { authService, UserProfile } from "@/services/auth.service";
import { dashboardService, DashboardStats, ActivityItem, AssignedTask } from "@/services/dashboard.service";
import SpacesSection from "@/components/SpacesSection";
import {
  CirclePlus,
  Star,
  CheckCircle2,
  CalendarDays,
  Activity,
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
  { title: "Homepage review", date: "Today" },
  { title: "Frontend auth polish", date: "Tomorrow" },
  { title: "Team sync meeting", date: "Friday" },
];

export default function EnterpriseDashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [loading, setLoading] = useState(true);

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
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Welcome back, {profile?.username || "loading..."}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your spaces, follow recent activity, and keep track of your work.
        </p>
      </div>

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
            <p className="text-sm text-zinc-500">Organize work by teams and functional areas.</p>
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
        <p className="text-sm text-zinc-500">Quick access to important items, ongoing tasks, and team activity.</p>
      </section>

      <div className="grid gap-6 2xl:grid-cols-12 pb-12">
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
                <div key={item.id} className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
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
                <div key={task.id} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
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
              <button key={action} className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-left text-sm font-medium text-zinc-800 transition hover:bg-zinc-100">
                {action}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md 2xl:col-span-6">
          <BlockTitle icon={<CalendarDays size={18} />} title="Upcoming deadlines" />
          <div className="space-y-3">
            {deadlines.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-sm font-medium text-zinc-800">{item.title}</p>
                <span className="text-xs text-zinc-500">{item.date}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function BlockTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="text-zinc-500">{icon}</div>
      <h3 className="text-lg font-semibold text-zinc-800">{title}</h3>
    </div>
  );
}

function MetricCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300 transition">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-900">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}

function RowCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100 transition cursor-pointer">
      {text}
    </div>
  );
}