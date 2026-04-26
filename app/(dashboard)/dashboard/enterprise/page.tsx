"use client";

import React, { useEffect, useState } from "react";
import { authService, UserProfile } from "@/services/auth.service";
import { dashboardService, DashboardStats, ActivityItem, AssignedTask } from "@/services/dashboard.service";
import ExploreTree from "@/components/ExploreTree";
import {
  TrendingUp,
  BarChart3,
  Layers,
  ChevronRight,
  ChevronLeft,
  Activity,
  Star,
  CheckCircle2,
  CalendarDays,
  Plus
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const favorites = [
  "Frontend space",
  "Sprint board",
  "Auth project",
  "Design system",
];

// Mock data for the graph
const chartData = [
  { name: 'Jan', projects: 4, activity: 240 },
  { name: 'Feb', projects: 7, activity: 320 },
  { name: 'Mar', projects: 5, activity: 190 },
  { name: 'Apr', projects: 9, activity: 480 },
  { name: 'May', projects: 12, activity: 560 },
  { name: 'Jun', projects: 15, activity: 410 },
  { name: 'Jul', projects: 18, activity: 680 },
];

export default function EnterpriseDashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [hierarchy, setHierarchy] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, dashData, act, tsk] = await Promise.all([
          authService.getProfile(),
          dashboardService.getDashboardData(),
          dashboardService.getRecentActivity(),
          dashboardService.getAssignedTasks(),
        ]);
        setProfile(prof);
        setStats(dashData as any);
        setActivities(act);
        setTasks(tsk);
        setHierarchy([]);  // /api/dashboard/ no longer returns nested orgs tree
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
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900">
            Welcome back, {profile?.username || "loading..."}
          </h1>
          <p className="mt-2 text-[15px] font-medium text-zinc-500">
            Enterprise overview and real-time project metrics.
          </p>
        </div>
        <div className="flex -space-x-2">
           {[1,2,3,4].map(i => (
             <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[11px] font-black text-zinc-400">U{i}</div>
           ))}
        </div>
      </div>

      {/* Metric Grid */}
      <section className="mb-10 grid gap-6 xl:grid-cols-4">
        <MetricCard title="Total Projets" value={(stats as any)?.total_projects?.toString() || "0"} icon={<Layers size={20} />} trend="Tous statuts" />
        <MetricCard title="Mes Projets" value={(stats as any)?.owned_projects?.toString() || "0"} icon={<BarChart3 size={20} />} trend="Propriétaire" />
        <MetricCard title="Membre de" value={(stats as any)?.member_projects?.toString() || "0"} icon={<Activity size={20} />} trend="Collaboration" />
        <MetricCard title="Archivés" value={(stats as any)?.archived_projects?.toString() || "0"} icon={<CheckCircle2 size={20} />} trend="Terminés" />
      </section>

      {/* CHARTS SECTION */}
      <div className="mb-10 grid gap-8 xl:grid-cols-12">
        {/* Main Growth Chart */}
        <section className="xl:col-span-8 rounded-[2.5rem] bg-white border border-zinc-200 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
           <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-zinc-900">Performance de l'Entreprise</h3>
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mt-1">Activité des projets & Engagements</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 p-1.5">
                <button className="px-4 py-2 text-[10px] font-black bg-white shadow-sm rounded-lg text-zinc-900 transition">7 JOURS</button>
                <button className="px-4 py-2 text-[10px] font-black text-zinc-400 hover:text-zinc-600 transition">30 JOURS</button>
              </div>
           </div>
           
           <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#A1A1AA' }}
                  dy={15}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: '900'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="activity" 
                  stroke="#18181b" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorActivity)" 
                />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </section>

        {/* Distributed Stats Chart */}
        <section className="xl:col-span-4 rounded-[2.5rem] bg-zinc-900 p-8 shadow-2xl text-white">
           <h3 className="text-xl font-black mb-1">Impact Global</h3>
           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-10">Répartition par catégorie</p>
           
           <div className="space-y-6">
              <StatBar label="Développement" value={78} color="bg-blue-500" />
              <StatBar label="Marketing" value={45} color="bg-emerald-500" />
              <StatBar label="Support" value={92} color="bg-orange-500" />
              <StatBar label="Ventes" value={61} color="bg-rose-500" />
           </div>

           <div className="mt-12 p-6 rounded-[2rem] bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                 <TrendingUp className="text-emerald-400" size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Efficacité +24%</span>
              </div>
              <p className="text-sm font-medium text-zinc-400">Votre vitesse de livraison a augmenté significativement ce mois-ci.</p>
           </div>
        </section>
      </div>

      <section className="mb-12">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-zinc-900">Arbre de Structure</h2>
          <p className="text-sm font-medium text-zinc-500">Navigation hiérarchique de vos espaces de travail.</p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(i => <div key={i} className="h-40 rounded-3xl bg-zinc-100 animate-pulse" />)}
          </div>
        ) : (
          <ExploreTree data={hierarchy} />
        )}
      </section>

      <div className="grid gap-8 xl:grid-cols-12 pb-20">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl xl:col-span-4">
          <BlockTitle icon={<Star size={18} />} title="Favorites" />
          <div className="space-y-3">
            {favorites.map((item) => <RowCard key={item} text={item} />)}
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl xl:col-span-4">
          <BlockTitle icon={<Activity size={18} />} title="Activités Récentes" />
          <div className="space-y-4">
            {activities.length > 0 ? activities.map((item) => (
              <div key={item.id} className="flex gap-4 items-start border-l-2 border-zinc-100 pl-4 transition-colors hover:border-zinc-900">
                <div>
                  <p className="text-sm font-bold text-zinc-800">{item.title}</p>
                  <p className="text-[10px] font-black text-zinc-400 uppercase mt-1">{item.meta}</p>
                </div>
              </div>
            )) : <p className="text-xs text-zinc-400">No recent activity.</p>}
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl xl:col-span-4">
          <BlockTitle icon={<CheckCircle2 size={18} />} title="Mes Tâches" />
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="group flex items-center justify-between rounded-2xl bg-zinc-50 p-4 transition-all hover:bg-zinc-100">
                <span className="text-sm font-bold text-zinc-700">{task.title}</span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                  task.priority === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-white text-zinc-400'
                }`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black">{value}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function BlockTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-900 shadow-inner">{icon}</div>
      <h3 className="text-lg font-black text-zinc-900">{title}</h3>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }: { title: string; value: string; icon: any; trend: string }) {
  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="text-zinc-400">{icon}</div>
        <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>
      </div>
      <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{title}</p>
      <p className="mt-2 text-4xl font-black text-zinc-900 tracking-tighter">{value}</p>
    </div>
  );
}

function RowCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm font-bold text-zinc-800 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer shadow-sm group">
      <div className="flex items-center justify-between">
        <span>{text}</span>
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
      </div>
    </div>
  );
}