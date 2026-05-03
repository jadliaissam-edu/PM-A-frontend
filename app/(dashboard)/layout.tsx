"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SpacesSection from "@/components/SpacesSection";
import React, { ReactNode, useEffect, useState, useRef } from "react";
import { authService, UserProfile } from "@/services/auth.service";
import { useSidebarStore } from "@/store/sidebar.store";
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
  LogOut,
  ExternalLink,
  HelpCircle,
  Keyboard,
  Palette,
  CreditCard,
  ArrowLeftRight,
  FlaskConical,
  Sparkles,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("AgileFlow Inc.");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setIsOrgDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prof = await authService.getProfile();
        setProfile(prof);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Using a separate simple profile dropdown since the imported one might clash
  // Usually this is abstracted into components but keeping it inline to preserve design exactly
  const ProfileDropdown = ({ profile, onLogout, onClose }: any) => {
    return (
      <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-xl border border-zinc-200 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50">
        <div className="mb-2 px-3 pb-3 pt-2">
          <p className="text-sm font-semibold">{profile?.username || "Aya Achiban"}</p>
          <p className="text-xs text-zinc-500">{profile?.email || "aya.achiban@agileflow.com"}</p>
        </div>

        <div className="space-y-1 border-t border-zinc-100 pt-2">
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100">
            <Settings size={15} className="text-zinc-400" />
            Paramètres
          </button>
        </div>

        <div className="mt-2 space-y-1 border-t border-zinc-100 pt-2">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={15} />
            Déconnexion
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900 overflow-hidden">
      {/* FIXED SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-screen ${isCollapsed ? "w-20" : "w-72"} border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out px-4 py-5 xl:block hidden z-40 group`}>
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:text-zinc-900 opacity-0 group-hover:opacity-100"
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

      {/* MAIN CONTENT AREA SHIFTED RIGHT BY THE FIXED SIDEBAR */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isCollapsed ? "xl:ml-20" : "xl:ml-72"}`}>
        {/* FIXED HEADER */}
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-4 py-4 md:px-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* Header left side / Org switcher */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="relative" ref={orgDropdownRef}>
                  <button
                    onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                    className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition shadow-sm"
                  >
                    <BriefcaseBusiness size={15} className="text-zinc-500" />
                    <span>{selectedOrg}</span>
                    <ChevronDown size={14} className="text-zinc-400" />
                  </button>

                  {isOrgDropdownOpen && (
                    <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl z-50">
                      <div className="mb-2 px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">
                        Vos organisations
                      </div>
                      <button
                        onClick={() => { setSelectedOrg("AgileFlow Inc."); setIsOrgDropdownOpen(false); }}
                        className="w-full flex items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-zinc-100 transition"
                      >
                        <span className={selectedOrg === "AgileFlow Inc." ? "font-semibold text-zinc-900" : "font-medium text-zinc-700"}>AgileFlow Inc.</span>
                        {selectedOrg === "AgileFlow Inc." && <CheckCircle2 size={16} className="text-zinc-900" />}
                      </button>
                      <button
                        onClick={() => { setSelectedOrg("Design Team"); setIsOrgDropdownOpen(false); }}
                        className="w-full flex items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-zinc-100 transition"
                      >
                        <span className={selectedOrg === "Design Team" ? "font-semibold text-zinc-900" : "font-medium text-zinc-700"}>Design Team</span>
                        {selectedOrg === "Design Team" && <CheckCircle2 size={16} className="text-zinc-900" />}
                      </button>

                      <div className="my-1 h-[1px] bg-zinc-100" />

                      <button className="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition mt-1">
                        <CirclePlus size={16} />
                        Créer une organisation
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-zinc-300">/</span>
                <span className="text-sm font-medium text-zinc-500">Workspace</span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2">
                <Search size={16} className="text-zinc-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-44 bg-transparent text-sm outline-none"
                />
              </div>

              <button className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 shadow-sm">
                <CirclePlus size={16} />
                Créer
              </button>

              <Link href="/notifications" className="rounded-xl border border-zinc-300 p-2 text-zinc-700 transition hover:bg-zinc-100 shadow-sm">
                <Bell size={18} />
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2 hover:bg-zinc-50 transition shadow-sm bg-white"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white overflow-hidden ring-2 ring-white">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      (profile?.username?.charAt(0).toUpperCase() || "A")
                    )}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium leading-tight">{profile?.username || "Aya Achiban"}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{profile?.bio || "ADMIN"}</p>
                  </div>
                </button>

                {isProfileOpen && (
                  <ProfileDropdown
                    profile={profile}
                    onLogout={handleLogout}
                    onClose={() => setIsProfileOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* FLOATING AI CHAT CHATBOT WIDGET */}
      <AIChatbotWidget />
    </div>
  );
}

function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<{ role: "assistant" | "user", text: string }[]>([
    { role: "assistant", text: "Bonjour ! Je suis l'IA de votre espace de travail AgileFlow. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMessage = inputVal;
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInputVal("");

    // Simulate AI typing and response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", text: "J'analyse votre requête concernant les projets... Je peux générer un résumé de sprint, suggérer des story points ou créer des tâches si besoin !" }]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 1000);

    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 overflow-hidden rounded-2xl bg-white shadow-2xl border border-zinc-200 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-indigo-600 px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span className="font-semibold text-sm">Assistant IA</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition">
              <ChevronDown size={20} />
            </button>
          </div>

          <div className="h-80 overflow-y-auto bg-zinc-50 p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white border border-zinc-200 text-zinc-800 rounded-bl-none shadow-sm"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white border-t border-zinc-100 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Demandez-moi n'importe quoi..."
                className="flex-1 rounded-full bg-zinc-100 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!inputVal.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <ArrowLeftRight size={14} className="rotate-90" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        <Sparkles size={24} />
      </button>
    </div>
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
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 ${isCollapsed ? "justify-center px-1" : ""} ${active
        ? "bg-zinc-900 text-white shadow-sm font-medium"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        {icon}
      </div>
      {!isCollapsed && <span className="truncate text-sm">{label}</span>}
      {isCollapsed && <span className="absolute left-16 z-50 hidden rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg group-hover:block whitespace-nowrap">{label}</span>}
    </Link>
  );
}

function SectionTitle({ title, isCollapsed = false }: { title: string, isCollapsed?: boolean }) {
  if (isCollapsed) return <div className="my-4 h-[1px] bg-zinc-200" />;
  return (
    <div className="mb-2 mt-6 flex items-center justify-between px-2">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
        {title}
      </h3>
      <button className="text-zinc-400 hover:text-zinc-900 transition">
        <CirclePlus size={14} />
      </button>
    </div>
  );
}
