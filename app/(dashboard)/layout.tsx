"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import SpacesSection from "@/components/SpacesSection";
import { type ReactNode, useEffect, useState, useRef } from "react";
import { authService, type UserProfile } from "@/services/auth.service";
import { useSidebarStore } from "@/store/sidebar.store";
import {
  Bell,
  ChevronDown,
  CirclePlus,
  FolderKanban,
  Home,
  Layers3,
  LayoutGrid,
  Search,
  Settings,
  Users,
  CheckCircle2,
  CalendarDays,
  PanelsTopLeft,
  BriefcaseBusiness,
  BarChart3,
  Workflow,
  History,
  Download,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  ArrowLeftRight,
  Sparkles,
} from "lucide-react";

function ProfileDropdown({
  profile,
  onLogout,
}: {
  profile: UserProfile | null;
  onLogout: () => void;
}) {
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
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("AgileFlow Inc.");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

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
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f9] text-zinc-900">
      {/* FIXED SIDEBAR */}
      <aside className={`fixed left-0 top-0 z-40 hidden h-screen ${isCollapsed ? "w-[50px]" : "w-[228px]"} overflow-visible border-r border-zinc-200 bg-[#fafbfc] transition-all duration-200 ease-out xl:flex xl:flex-col group`}>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[6px] py-1.5">
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-12 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 opacity-0 shadow-sm transition hover:text-zinc-900 group-hover:opacity-100"
        >
          {isCollapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>

        <div className={`mb-1 flex h-7 items-center gap-1.5 rounded-sm px-1.5 transition hover:bg-white ${isCollapsed ? "justify-center px-1" : ""}`}>
          <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-sm bg-violet-600 text-[10px] font-bold text-white">
            {profile?.username?.charAt(0).toUpperCase() || "A"}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold leading-3 text-zinc-900">AgileFlow</p>
              <p className="truncate text-[9px] leading-3 text-zinc-500">Workspace</p>
            </div>
          )}
          {!isCollapsed && <ChevronDown size={12} className="text-zinc-400" />}
        </div>

        <div className="mb-1 space-y-px border-b border-zinc-200/70 pb-1">
          <SidebarItem icon={<Home size={14} />} label="Home" href="/dashboard/enterprise" active={pathname === "/dashboard/enterprise" || pathname.startsWith("/dashboard")} isCollapsed={isCollapsed} />
          <SidebarItem icon={<LayoutGrid size={14} />} label="Dashboard" href="/dashboard/enterprise" active={false} isCollapsed={isCollapsed} />
        </div>

        <SectionTitle title="Agile Tools" isCollapsed={isCollapsed} />
        <div className="mb-1 space-y-px border-b border-zinc-200/70 pb-1">
          <SidebarItem icon={<Layers3 size={14} />} label="Backlog" href="/sprint" active={pathname === "/sprint"} isCollapsed={isCollapsed} />
          <SidebarItem icon={<PanelsTopLeft size={14} />} label="Active Board" href="/Board/kanban" active={pathname.startsWith("/Board/kanban")} isCollapsed={isCollapsed} />
          <SidebarItem icon={<CalendarDays size={14} />} label="Timeline" href="/Board/Timeline" active={pathname.startsWith("/Board/Timeline")} isCollapsed={isCollapsed} />
          <SidebarItem icon={<Workflow size={14} />} label="Releases" href="/release" active={pathname === "/release"} isCollapsed={isCollapsed} />
        </div>

        <SectionTitle title="Management" isCollapsed={isCollapsed} />
        <div className="mb-1 space-y-px border-b border-zinc-200/70 pb-1">
          <SidebarItem icon={<FolderKanban size={14} />} label="Projects" href="/project" active={pathname === "/project" || pathname.startsWith("/project/")} isCollapsed={isCollapsed} />
          <SidebarItem icon={<CheckCircle2 size={14} />} label="Tasks" href="/tickets" active={pathname === "/tickets"} isCollapsed={isCollapsed} />
          <SidebarItem icon={<BarChart3 size={14} />} label="Reports" href="/reports" active={pathname === "/reports"} isCollapsed={isCollapsed} />
        </div>

        <SectionTitle title="System" isCollapsed={isCollapsed} />
        <div className="mb-1 space-y-px">
          <SidebarItem icon={<Download size={14} />} label="Import" href="/import" active={pathname === "/import"} isCollapsed={isCollapsed} />
          <SidebarItem icon={<History size={14} />} label="Audit Logs" href="/audit" active={pathname === "/audit"} isCollapsed={isCollapsed} />
          <SidebarItem icon={<Users size={14} />} label="Teams" href="/chat" active={pathname === "/chat"} isCollapsed={isCollapsed} />
          <SidebarItem icon={<Settings size={14} />} label="Settings" href="/user_profile" active={pathname === "/user_profile"} isCollapsed={isCollapsed} />
        </div>

        <SectionTitle title="Spaces" isCollapsed={isCollapsed} />
        <div className="pt-0.5">
          <SpacesSection variant="sidebar" isCollapsed={isCollapsed} />
        </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA SHIFTED RIGHT BY THE FIXED SIDEBAR */}
      <div className={`flex h-screen min-w-0 flex-1 flex-col transition-all duration-200 ease-out ${isCollapsed ? "xl:ml-[50px]" : "xl:ml-[228px]"}`}>
        {/* FIXED HEADER */}
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white px-2 py-1 md:px-2.5">
          <div className="flex flex-col gap-1 xl:flex-row xl:items-center xl:justify-between">
            {/* Header left side / Org switcher */}
            <div className="flex flex-col gap-1">
              <div className="flex h-7 items-center gap-1.5">
                <span className="text-[12px] font-semibold text-zinc-900">Workspace</span>
                <span className="text-zinc-300">/</span>
                <div className="relative" ref={orgDropdownRef}>
                  <button
                    onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                    className="flex h-7 items-center gap-1.5 rounded-sm border border-transparent bg-transparent px-1.5 text-[12px] font-medium text-zinc-500 transition hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800"
                  >
                    <BriefcaseBusiness size={14} className="text-zinc-400" />
                    <span>{selectedOrg}</span>
                    <ChevronDown size={13} className="text-zinc-400" />
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
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
              <div className="flex h-7 items-center gap-1 border border-zinc-200 bg-white p-px">
              <div className="flex h-6 items-center gap-1.5 bg-zinc-50 px-1.5">
                <Search size={14} className="text-zinc-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-36 bg-transparent text-[12px] outline-none lg:w-48"
                />
              </div>

              <button className="flex h-6 items-center justify-center gap-1 bg-violet-600 px-2 text-[11px] font-semibold text-white transition hover:bg-violet-700">
                <CirclePlus size={13} />
                Créer
              </button>

              <Link href="/notifications" className="flex h-6 w-6 items-center justify-center text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900">
                <Bell size={14} />
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex h-6 items-center gap-1.5 px-1 transition hover:bg-zinc-100"
                >
                  <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-[10px] font-semibold text-white">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      (profile?.username?.charAt(0).toUpperCase() || "A")
                    )}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-[11px] font-medium leading-none text-zinc-800">{profile?.username || "Aya Achiban"}</p>
                  </div>
                </button>

                {isProfileOpen && (
                  <ProfileDropdown
                    profile={profile}
                    onLogout={handleLogout}
                  />
                )}
              </div>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
          <div className="flex h-8 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-2.5">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-sm bg-violet-600" />
              <span className="truncate text-[12px] font-semibold leading-none text-zinc-900">Workspace</span>
              <span className="text-[11px] text-zinc-300">/</span>
              <span className="truncate text-[11px] font-medium leading-none text-zinc-500">Everything</span>
            </div>

            <div className="hidden h-6 items-center border border-zinc-200 bg-zinc-50 p-px sm:flex">
              <button className="h-5 border-r border-zinc-200 bg-white px-2 text-[11px] font-semibold text-violet-800 shadow-[inset_0_-2px_0_#7c3aed]">
                List
              </button>
              <button className="h-5 border-r border-zinc-200 px-2 text-[11px] font-medium text-zinc-500 hover:bg-white hover:text-zinc-900">
                Board
              </button>
              <button className="h-5 px-2 text-[11px] font-medium text-zinc-500 hover:bg-white hover:text-zinc-900">
                Calendar
              </button>
            </div>
          </div>

          <div className="flex h-8 shrink-0 items-center justify-between border-b border-zinc-200 bg-[#fbfbfc] px-2.5">
            <div className="flex min-w-0 items-center gap-1">
              <button type="button" className="h-6 border border-zinc-200 bg-white px-2 text-[11px] font-semibold text-zinc-900">
                All
              </button>
              <button type="button" className="h-6 px-2 text-[11px] font-medium text-zinc-500 hover:bg-white hover:text-zinc-900">
                Open
              </button>
              <button type="button" className="h-6 px-2 text-[11px] font-medium text-zinc-500 hover:bg-white hover:text-zinc-900">
                Closed
              </button>
            </div>

            <div className="hidden items-center gap-1 md:flex">
              <div className="flex h-6 items-center gap-1.5 border border-zinc-200 bg-white px-1.5">
                <Search size={13} className="text-zinc-400" />
                <span className="text-[11px] font-medium text-zinc-400">Search tasks</span>
              </div>
              <button type="button" className="h-6 border border-zinc-200 bg-white px-2 text-[11px] font-medium text-zinc-600 hover:text-zinc-900">
                Filter
              </button>
              <button type="button" className="h-6 border border-zinc-200 bg-white px-2 text-[11px] font-medium text-zinc-600 hover:text-zinc-900">
                Sort
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
            <div className="grid h-7 shrink-0 grid-cols-[minmax(240px,1fr)_118px_118px_104px] items-center border-b border-zinc-200 bg-white text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
              <div className="px-2.5">Task name</div>
              <div className="border-l border-zinc-100 px-2">Status</div>
              <div className="border-l border-zinc-100 px-2">Assignee</div>
              <div className="border-l border-zinc-100 px-2">Due date</div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div aria-hidden="true" className="border-b border-zinc-200 bg-white">
                <div className="flex h-7 items-center gap-1.5 border-b border-zinc-100 bg-[#fbfbfc] px-2.5 text-[11px] font-semibold text-zinc-700">
                  <ChevronDown size={13} className="text-zinc-400" />
                  <span>Sprint Backlog</span>
                  <span className="border-l border-zinc-200 pl-1.5 text-[10px] font-medium text-zinc-400">3 tasks</span>
                </div>

                {[
                  {
                    title: "Refine workspace navigation",
                    meta: "PM-142",
                    priorityClass: "bg-rose-500",
                    status: "In progress",
                    statusClass: "border-sky-200 bg-sky-50 text-sky-700 shadow-[inset_3px_0_0_#0ea5e9]",
                    assignee: "AA",
                    assigneeClass: "bg-violet-600",
                    due: "Today",
                    dueClass: "text-rose-600",
                    selected: true,
                  },
                  {
                    title: "Review sprint backlog priorities",
                    meta: "PM-136",
                    priorityClass: "bg-amber-500",
                    status: "Review",
                    statusClass: "border-amber-200 bg-amber-50 text-amber-700 shadow-[inset_3px_0_0_#f59e0b]",
                    assignee: "MK",
                    assigneeClass: "bg-emerald-600",
                    due: "May 8",
                    dueClass: "text-zinc-600",
                  },
                  {
                    title: "Prepare release checklist",
                    meta: "PM-128",
                    priorityClass: "bg-zinc-300",
                    status: "To do",
                    statusClass: "border-zinc-200 bg-zinc-50 text-zinc-600 shadow-[inset_3px_0_0_#d4d4d8]",
                    assignee: "YS",
                    assigneeClass: "bg-sky-600",
                    due: "Next week",
                    dueClass: "text-zinc-500",
                  },
                ].map((row) => (
                  <div
                    key={row.meta}
                    className={`group/row grid h-8 grid-cols-[minmax(240px,1fr)_118px_118px_104px] items-center border-b border-zinc-100 text-[11px] last:border-b-0 hover:bg-[#f8f9fb] ${row.selected ? "bg-violet-50/60 shadow-[inset_2px_0_0_#7c3aed]" : ""}`}
                  >
                    <div className="flex min-w-0 items-center gap-2 px-2.5">
                      <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border bg-white ${row.selected ? "border-violet-500" : "border-zinc-300 group-hover/row:border-zinc-400"}`}>
                        {row.selected && <span className="h-1.5 w-1.5 bg-violet-600" />}
                      </span>
                      <span className={`h-3.5 w-0.5 shrink-0 ${row.priorityClass}`} />
                      <div className="flex min-w-0 items-baseline gap-1.5">
                        <span className="truncate font-medium text-zinc-800">{row.title}</span>
                        <span className="shrink-0 border border-zinc-200 bg-zinc-50 px-1 text-[9px] font-semibold leading-4 text-zinc-400">{row.meta}</span>
                      </div>
                    </div>
                    <div className="border-l border-zinc-100 px-2">
                      <span className={`inline-flex h-[18px] min-w-[78px] items-center justify-center border px-1.5 text-[10px] font-semibold leading-none ${row.statusClass}`}>
                        {row.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-zinc-100 px-2">
                      <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-[8px] font-semibold text-white ring-1 ring-white ${row.assigneeClass}`}>
                        {row.assignee}
                      </span>
                      <span className="truncate text-[10px] font-medium text-zinc-500">Owner</span>
                    </div>
                    <div className="border-l border-zinc-100 px-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${row.dueClass}`}>
                        {row.selected && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                        {row.due}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {children}
            </div>
          </div>
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
      className={`group/item relative flex h-[26px] w-full items-center gap-1.5 rounded-sm px-1.5 text-[11px] transition-colors duration-150 ${isCollapsed ? "justify-center px-1" : ""} ${active
        ? "bg-violet-100 font-semibold text-violet-950 shadow-[inset_2px_0_0_#7c3aed,inset_0_0_0_1px_rgba(124,58,237,0.12)]"
        : "text-zinc-600 hover:bg-white hover:text-zinc-900"
        }`}
    >
      <div className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center ${active ? "text-violet-800" : "text-zinc-400 group-hover/item:text-zinc-600"}`}>
        {icon}
      </div>
      {!isCollapsed && <span className="truncate leading-none">{label}</span>}
    </Link>
  );
}

function SectionTitle({ title, isCollapsed = false }: { title: string, isCollapsed?: boolean }) {
  if (isCollapsed) return <div className="mx-2 my-1 h-px bg-zinc-200" />;
  return (
    <div className="mb-px mt-1 flex h-4 items-center px-1.5">
      <h3 className="text-[9px] font-medium uppercase tracking-wide text-zinc-400">
        {title}
      </h3>
    </div>
  );
}
