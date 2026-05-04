"use client";

import Link from "next/link";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

export default function EnterpriseDashboard() {
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const router = useRouter();

    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    return (
        <main className="min-h-screen bg-zinc-100">
            {/* Sidebar + Content Layout */}
            <div className="flex">
                {/* Sidebar */}
                <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-zinc-200 bg-white">
                    {/* Org selector */}
                    <div className="border-b border-zinc-200 p-4">
                        <button className="flex w-full items-center justify-between rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200">
                            <div className="flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold text-white">
                                    M
                                </span>
                                <span>Mon Organisation</span>
                            </div>
                            <span className="text-zinc-400">⌄</span>
                        </button>
                    </div>

                    {/* Workspace selector */}
                    <div className="border-b border-zinc-200 p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Espace de travail
                        </p>
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100">
                            <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-200 text-xs">
                                📁
                            </span>
                            <span>Workspace par défaut</span>
                        </button>
                    </div>

                    {/* Nav links */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Navigation
                        </p>
                        <ul className="space-y-1">
                            {[
                                { icon: "📊", label: "Tableau de bord", path: "/dashboard/enterprise", active: true },
                                { icon: "🔔", label: "Notifications", path: "/notifications", active: false },
                                { icon: "👤", label: "Mon Profil", path: "/user_profile", active: false },
                                { icon: "📂", label: "Projets", path: "/project/123", active: false },
                                { icon: "🎫", label: "Tickets", path: "/tickets", active: false },
                                { icon: "📋", label: "Board Kanban", path: "/Board/kanban", active: false },
                                { icon: "🏃", label: "Sprints", path: "/sprint", active: false },
                                { icon: "🕒", label: "Timeline", path: "/Board/Timeline", active: false },
                                { icon: "🚀", label: "Releases", path: "/release", active: false },
                                { icon: "💬", label: "Chat", path: "/chat", active: false },
                                { icon: "👥", label: "Membres", path: "#", active: false },
                                { icon: "📈", label: "Rapports", path: "/reports", active: false },
                                { icon: "🛡️", label: "Logs d'audit", path: "/audit", active: false },
                                { icon: "⚙️", label: "Paramètres", path: "#", active: false },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.path}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${item.active
                                            ? "bg-zinc-900 text-white"
                                            : "text-zinc-700 hover:bg-zinc-100"
                                            }`}
                                    >
                                        <span className="text-base">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Bottom user section */}
                    <div className="border-t border-zinc-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-700">
                                    {user?.username?.charAt(0).toUpperCase() ?? "U"}
                                </span>
                                <span className="text-sm font-medium text-zinc-900">
                                    {user?.username ?? "Utilisateur"}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                                title="Déconnexion"
                            >
                                🚪
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1 overflow-y-auto px-8 py-8 bg-zinc-50/50">
                    {/* Header & Global Actions */}
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">Command Center</p>
                            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                                Bonjour, {user?.username ?? "Hassine"} 🚀
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative group lg:w-64">
                                <span className="absolute left-3 top-2.5 text-zinc-400 text-sm">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Recherche globale (Cmd + K)"
                                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none transition"
                                />
                            </div>
                            <button className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-zinc-900/10 hover:bg-zinc-800 transition">
                                + Nouveau Ticket
                            </button>
                        </div>
                    </div>

                    {/* KPI Dashboard Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: "Santé Projets", value: "Optimale", icon: "✨", color: "text-green-600" },
                            { label: "Tickets Bloqués", value: "3", icon: "🔴", color: "text-red-600" },
                            { label: "Membres Actifs", value: "12 / 15", icon: "👥", color: "text-zinc-900" },
                            { label: "Prochaine Release", value: "v2.1.0", icon: "🚀", color: "text-blue-600" },
                        ].map((kpi, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{kpi.label}</span>
                                    <span className="text-sm">{kpi.icon}</span>
                                </div>
                                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                                <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between">
                                    <div className="h-1 flex-1 bg-zinc-100 rounded-full overflow-hidden mr-2">
                                        <div className="h-full bg-zinc-900 w-3/4"></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-400">85%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Bento Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Active Sprint - Multi-functional Component */}
                        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900">Sprint Actif #04</h2>
                                    <p className="text-xs text-zinc-400 mt-1">Échéance : 26 Avril (4 jours restants)</p>
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-8 w-8 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-600">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="h-8 w-8 rounded-full bg-zinc-900 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                                        +6
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold text-zinc-500 uppercase">Progression</span>
                                        <span className="text-2xl font-bold text-zinc-900">72%</span>
                                    </div>
                                    <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden mb-6">
                                        <div className="h-full bg-zinc-900 w-[72%]"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Terminés</p>
                                            <p className="text-lg font-bold text-green-600">42 pts</p>
                                        </div>
                                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Estimés</p>
                                            <p className="text-lg font-bold text-zinc-900">58 pts</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-zinc-900 rounded-2xl p-6 text-white relative overflow-hidden group">
                                    <p className="text-xs font-bold text-zinc-400 uppercase">Board Preview</p>
                                    <div className="mt-6 space-y-3 relative z-10">
                                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                            <span className="text-xs">🔄</span>
                                            <p className="text-xs font-medium truncate">Fix: Middleware CORS config</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm opacity-60">
                                            <span className="text-xs">✅</span>
                                            <p className="text-xs font-medium truncate line-through">Auth System JWT</p>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition"></div>
                                </div>
                            </div>
                        </div>

                        {/* Combined Activity & Notifications */}
                        <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm flex flex-col">
                            <h2 className="text-lg font-bold text-zinc-900 mb-6">Activité Flux</h2>
                            <div className="flex-1 space-y-6">
                                {[
                                    { icon: "💬", user: "Hassine", msg: "A mentionné @snofy dans le chat", time: "2 min" },
                                    { icon: "🛡️", user: "Système", msg: "Journal d'audit : MFA vérifié", time: "15 min" },
                                    { icon: "🚀", user: "Release", msg: "Nouveau build prêt pour tests", time: "1h" },
                                    { icon: "📂", user: "Projet", msg: "Document 'Specs V3' mis à jour", time: "3h" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 group cursor-pointer">
                                        <div className="h-10 w-10 flex-shrink-0 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center text-sm group-hover:bg-zinc-900 group-hover:text-white transition">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs">
                                                <span className="font-bold text-zinc-900">{item.user}</span>
                                                <span className="text-zinc-500 ml-1 truncate block">{item.msg}</span>
                                            </p>
                                            <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-8 w-full border border-zinc-200 bg-white py-3 rounded-xl text-xs font-bold text-zinc-900 hover:bg-zinc-50 transition">
                                Voir tout le flux
                            </button>
                        </div>

                        {/* Bottom Row - More Micro-functionalities */}
                        <div className="lg:col-span-1 bg-zinc-900 rounded-3xl p-8 text-white shadow-2xl shadow-zinc-900/20">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Membres Favoris</h3>
                            <div className="space-y-4">
                                {[
                                    { name: "Snofy", role: "DevOps", status: "online" },
                                    { name: "Hassine", role: "Lead Dev", status: "online" },
                                ].map(m => (
                                    <div key={m.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold">{m.name}</p>
                                                <p className="text-[10px] text-zinc-500">{m.role}</p>
                                            </div>
                                        </div>
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    </div>
                                ))}
                                <button className="w-full text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition">
                                    + Gérer l&apos;équipe
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-zinc-900">Timeline Globale</h3>
                                <div className="flex gap-1">
                                    <div className="h-1.5 w-8 rounded-full bg-zinc-900"></div>
                                    <div className="h-1.5 w-8 rounded-full bg-zinc-200"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { date: "24 Avr", label: "Beta Launch", tag: "Major" },
                                    { date: "02 Mai", label: "Final Review", tag: "Review" },
                                    { date: "15 Mai", label: "Production", tag: "Release" },
                                    { date: "20 Mai", label: "Post-Launch", tag: "Maint." },
                                ].map((event, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-900 transition cursor-pointer">
                                        <p className="text-sm font-bold text-zinc-900">{event.date}</p>
                                        <p className="text-[10px] text-zinc-500 mt-1 truncate">{event.label}</p>
                                        <span className="mt-3 inline-block text-[8px] font-bold uppercase py-0.5 px-2 bg-zinc-200 rounded-full text-zinc-600">
                                            {event.tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Super Footer / Mode Switch */}
                    <div className="mt-12 flex items-center justify-center gap-8 border-t border-zinc-200 pt-8">
                        <Link
                            href="/user_enterprise"
                            className="group flex items-center gap-2 text-sm text-zinc-500 font-medium transition hover:text-zinc-900"
                        >
                            <span className="text-lg group-hover:-translate-x-1 transition">⬅</span>
                            Revenir à la sélection de mode
                        </Link>
                        <div className="h-4 w-px bg-zinc-200"></div>
                        <p className="text-xs text-zinc-400">Système Projeta Enterprise v2.1.0 • Stable</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
