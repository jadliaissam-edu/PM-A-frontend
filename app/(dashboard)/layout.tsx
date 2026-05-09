"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { authService, type UserProfile } from "@/services/auth.service";
import { useAuthStore } from "@/store";
import { useSidebarStore } from "@/store/sidebar.store";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CirclePlus,
  Download,
  FolderKanban,
  History,
  Home,
  Layers3,
  LayoutGrid,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  PanelsTopLeft,
  Search,
  Settings,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const collapsed = useSidebarStore((state) => state.isCollapsed);
  const toggleSidebar = useSidebarStore((state) => state.toggleCollapsed);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState("AgileFlow Inc.");
  const [menu, setMenu] = useState<"headerOrg" | "sidebarOrg" | "profile" | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickPanel, setQuickPanel] = useState<"new" | "automate" | "share" | "view" | "filter" | "sort" | "notifications" | null>(null);
  const [quickPanelNote, setQuickPanelNote] = useState("");
  const [toolbarMode, setToolbarMode] = useState({ subtasks: false, me: false, grouped: true });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node) && !sidebarDropdownRef.current?.contains(event.target as Node)) {
        setMenu(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  useEffect(() => {
    authService.getProfile().then(setProfile).catch((error) => console.error("Failed to fetch dashboard profile", error));
  }, []);

  // Apply user's preferred color (if provided in profile) as a CSS variable and theme-color meta
  // Apply persisted appearance first (from localStorage) so user selections take effect immediately
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const storedAccent = localStorage.getItem("af:accent");
      const storedDensity = localStorage.getItem("af:density");
      if (storedAccent) {
        document.documentElement.style.setProperty("--primary-color", storedAccent);
        let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = "theme-color";
          document.head.appendChild(meta);
        }
        meta.content = storedAccent;
      }
      if (storedDensity) {
        document.documentElement.setAttribute("data-density", storedDensity.toLowerCase());
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Apply user's preferred color (if provided in profile) as a CSS variable and theme-color meta
  useEffect(() => {
    if (!profile) return;
    // Try several common fields where a color might be stored
    const pref = (profile as any).preferences_json || {};
    // Prefer locally stored accent (user-set in UI) over profile values
    const storedAccent = typeof window !== "undefined" ? localStorage.getItem("af:accent") : null;
    const color = storedAccent || (profile as any).color || pref.primaryColor || pref.themeColor || pref.color || "[var(--primary-color)]";
    try {
      document.documentElement.style.setProperty("--primary-color", color);
      document.documentElement.style.setProperty("--primary-color-hover", color);
      let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      meta.content = color;
    } catch (e) {
      // ignore in non-browser environments
    }
    // also apply density preference from profile if local choice not present
    try {
      const storedDensity = typeof window !== "undefined" ? localStorage.getItem("af:density") : null;
      const profileDensity = (pref && (pref.density || pref.workspaceDensity)) || null;
      const densityToApply = storedDensity || profileDensity;
      if (densityToApply) document.documentElement.setAttribute("data-density", densityToApply.toLowerCase());
    } catch (e) {
      // ignore
    }
  }, [profile]);

  const signOut = async () => {
    try {
      await authService.logout();
      // clear local auth state and navigate to login
      useAuthStore.getState().clearAuth();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const closeQuickPanel = () => {
    setQuickPanel(null);
    setQuickPanelNote("");
  };

  const openQuickPanel = (panel: Exclude<typeof quickPanel, null>) => {
    setMenu(null);
    setQuickPanelNote("");
    setQuickPanel(panel);
  };

  const avatar = profile?.username?.charAt(0).toUpperCase() || "A";
  const avatarStyle = profile?.avatar_url ? { backgroundImage: `url(${profile.avatar_url})` } : ((profile && ((profile as any).color || (profile as any).preferences_json?.color)) ? { backgroundColor: (profile as any).color || (profile as any).preferences_json?.color } : undefined);
  const searchResults = [
    { label: "Overview", href: "/dashboard/enterprise", meta: "Workspace home" },
    { label: "Tasks", href: "/tickets", meta: "List view" },
    { label: "Active Board", href: "/Board/kanban", meta: "Kanban" },
    { label: "Timeline", href: "/Board/Timeline", meta: "Calendar view" },
    { label: "Reports", href: "/reports", meta: "Analytics" },
  ].filter((item) => `${item.label} ${item.meta}`.toLowerCase().includes(globalSearch.toLowerCase()));

  return (
    <div className="flex h-screen overflow-hidden bg-white text-[#20242a]">
      <aside className={`fixed left-0 top-0 z-40 hidden h-screen border-r border-[#d8dde5] xl:flex ${collapsed ? "w-[64px]" : "w-[352px]"}`}>
        <div className="flex h-full w-[64px] shrink-0 flex-col items-center bg-[#24113f] px-2 py-2 text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.08)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] bg-white shadow-sm">
            <span className="grid h-6 w-6 grid-cols-2 gap-0.5">
              <span className="rounded-[3px] bg-[#7b68ee]" />
              <span className="rounded-[3px] bg-[#ffcc00]" />
              <span className="rounded-[3px] bg-[#00b884]" />
              <span className="rounded-[3px] bg-[#1090e0]" />
            </span>
          </div>
          <nav className="flex flex-1 flex-col items-center gap-1.5">
            {[
              { href: "/dashboard/enterprise", active: pathname.startsWith("/dashboard"), icon: <Home size={17} /> },
              { href: "/tickets", active: pathname === "/tickets", icon: <CheckCircle2 size={17} /> },
              { href: "/Board/kanban", active: pathname.startsWith("/Board/kanban"), icon: <PanelsTopLeft size={17} /> },
              { href: "/Board/Timeline", active: pathname.startsWith("/Board/Timeline"), icon: <CalendarDays size={17} /> },
              { href: "/reports", active: pathname === "/reports", icon: <BarChart3 size={17} /> },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`relative flex h-10 w-10 items-center justify-center rounded-[10px] transition ${item.active ? "bg-white text-[#6d28d9] shadow-sm" : "text-white/62 hover:bg-white/10 hover:text-white"}`}>
                {item.active && <span className="absolute -left-2 h-5 w-1 rounded-r-full bg-white" />}
                {item.icon}
              </Link>
            ))}
          </nav>
          <button onClick={() => router.push("/reports")} className="mb-1 flex h-10 w-10 items-center justify-center rounded-[10px] text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30" aria-label="Open reports">
            <Sparkles size={17} />
          </button>
          <button onClick={() => router.push("/user_profile")} className="flex h-10 w-10 items-center justify-center rounded-[10px] text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30" aria-label="Open settings">
            <Settings size={17} />
          </button>
        </div>

        {!collapsed && (
          <div className="flex min-h-0 w-[288px] flex-col bg-[#f4f6fa]">
            <div ref={sidebarDropdownRef} className="relative flex h-[58px] shrink-0 items-center gap-2.5 border-b border-[#dfe3e8] px-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-[var(--primary-color)] text-[12px] font-black text-white">{avatar}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-black leading-4 text-[#24272d]">AgileFlow</p>
                <p className="truncate text-[11px] font-semibold leading-4 text-[#7b828f]">Free Forever</p>
              </div>
                <button onClick={() => setMenu(menu === "sidebarOrg" ? null : "sidebarOrg")} className="flex h-7 w-7 items-center justify-center rounded-[7px] text-[#8f96a3] hover:bg-white" aria-label="Switch organization">
                  <ChevronDown size={15} />
                </button>
              {menu === "sidebarOrg" && (
                <div className="absolute left-3 right-3 top-[52px] z-50 rounded-[10px] border border-[#dfe3e8] bg-white p-2 shadow-xl">
                  <p className="mb-2 border-b border-[#edf0f3] px-2 pb-2 text-[11px] font-black uppercase text-[#8f96a3]">Organisations</p>
                  {["AgileFlow Inc.", "Design Team"].map((org) => (
                    <button key={org} onClick={() => { setOrganization(org); setMenu(null); }} className="flex w-full items-center justify-between rounded-[7px] px-2 py-2 text-left text-sm font-bold text-[#2f343c] hover:bg-[#f7f8fb]">
                      {org}
                      {organization === org && <CheckCircle2 size={16} className="text-[#7b68ee]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 py-2">
              <div className="mb-2 border-b border-[#e4e7ec] pb-2">
                <p className="mb-1 flex h-5 items-center px-1.5 text-[10px] font-black uppercase text-[#8f96a3]">Home</p>
                {[
                  { href: "/dashboard/enterprise", label: "Home", active: pathname.startsWith("/dashboard"), icon: <Home size={15} /> },
                  { href: "/dashboard/enterprise", label: "Dashboard", active: false, icon: <LayoutGrid size={15} /> },
                ].map((item) => (
                  <Link key={item.href + item.label} href={item.href} className={`flex h-[31px] items-center gap-2 rounded-[7px] px-2 text-[12px] ${item.active ? "bg-white font-black text-[#2f343c] shadow-sm ring-1 ring-[#dfe3e8]" : "font-bold text-[#68707d] hover:bg-white hover:text-[#2f343c]"}`}>
                    <span className={item.active ? "text-[#7b68ee]" : "text-[#9aa1ad]"}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mb-2 border-b border-[#e4e7ec] pb-2">
                <p className="mb-1 flex h-5 items-center px-1.5 text-[10px] font-black uppercase text-[#8f96a3]">Favorites</p>
                {[
                  { href: "/sprint", label: "Sprint Backlog", active: pathname === "/sprint", icon: <Layers3 size={15} /> },
                  { href: "/Board/kanban", label: "Active Board", active: pathname.startsWith("/Board/kanban"), icon: <PanelsTopLeft size={15} /> },
                  { href: "/Board/Timeline", label: "Timeline", active: pathname.startsWith("/Board/Timeline"), icon: <CalendarDays size={15} /> },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className={`flex h-[31px] items-center gap-2 rounded-[7px] px-2 text-[12px] ${item.active ? "bg-white font-black text-[#2f343c] shadow-sm ring-1 ring-[#dfe3e8]" : "font-bold text-[#68707d] hover:bg-white hover:text-[#2f343c]"}`}>
                    <span className={item.active ? "text-[#7b68ee]" : "text-[#9aa1ad]"}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mb-2 border-b border-[#e4e7ec] pb-2">
                <p className="mb-1 flex h-5 items-center px-1.5 text-[10px] font-black uppercase text-[#8f96a3]">Spaces</p>
                <div className="group mb-1 flex h-8 items-center gap-2 rounded-[7px] px-2 text-[12px] font-black text-[#2f343c] hover:bg-white">
                  <ChevronDown size={14} className="text-[#8f96a3]" />
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-[#7b68ee]" />
                  <span className="truncate">Product</span>
                  <span className="ml-auto rounded-full bg-[#e7e9ef] px-1.5 py-px text-[9px] font-black text-[#7c828d]">14</span>
                  <CirclePlus size={13} className="hidden text-[#a2a9b5] group-hover:block" />
                </div>
                <div className="ml-[13px] border-l border-[#d9dde5] pl-1.5">
                  {[
                    { href: "/project", label: "Projects", active: pathname === "/project" || pathname.startsWith("/project/"), icon: <FolderKanban size={15} />, left: 8 },
                    { href: "/tickets", label: "Tasks", active: pathname === "/tickets", icon: <CheckCircle2 size={15} />, left: 24 },
                    { href: "/release", label: "Releases", active: pathname === "/release", icon: <Workflow size={15} />, left: 24 },
                    { href: "/reports", label: "Reports", active: pathname === "/reports", icon: <BarChart3 size={15} />, left: 24 },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} className={`flex h-[31px] items-center gap-2 rounded-[7px] pr-2 text-[12px] ${item.active ? "bg-white font-black text-[#2f343c] shadow-sm ring-1 ring-[#dfe3e8]" : "font-bold text-[#68707d] hover:bg-white hover:text-[#2f343c]"}`} style={{ paddingLeft: item.left }}>
                      <span className={item.active ? "text-[#7b68ee]" : "text-[#9aa1ad]"}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mb-2 border-b border-[#e4e7ec] pb-2">
                <p className="mb-1 flex h-5 items-center px-1.5 text-[10px] font-black uppercase text-[#8f96a3]">Everything</p>
                {[
                  { href: "/import", label: "Import", active: pathname === "/import", icon: <Download size={15} /> },
                  { href: "/audit", label: "Audit Logs", active: pathname === "/audit", icon: <History size={15} /> },
                  { href: "/chat", label: "Teams", active: pathname === "/chat", icon: <Users size={15} /> },
                  { href: "/user_profile", label: "Settings", active: pathname === "/user_profile", icon: <Settings size={15} /> },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className={`flex h-[31px] items-center gap-2 rounded-[7px] px-2 text-[12px] ${item.active ? "bg-white font-black text-[#2f343c] shadow-sm ring-1 ring-[#dfe3e8]" : "font-bold text-[#68707d] hover:bg-white hover:text-[#2f343c]"}`}>
                    <span className={item.active ? "text-[#7b68ee]" : "text-[#9aa1ad]"}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
            <div className="m-2.5 rounded-[10px] border border-[#dfe3e8] bg-white p-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase text-[#8f96a3]">Pinned views</p>
                <MoreHorizontal size={14} className="text-[#a2a9b5]" />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {[
                  { label: "List", href: "/tickets" },
                  { label: "Board", href: "/Board/kanban" },
                  { label: "Cal", href: "/Board/Timeline" },
                ].map((view) => {
                  const isActive = view.href === "/tickets" ? pathname === "/tickets" || pathname === "/sprint" : pathname.startsWith(view.href);
                  return (
                  <Link key={view.label} href={view.href} className={`h-[46px] rounded-[7px] border p-1.5 text-[10px] font-black ${isActive ? "border-[#d7d1ff] bg-[#f3efff] text-[#7b68ee]" : "border-[#e2e5ea] bg-white text-[#68707d]"}`}>
                    <span>{view.label}</span>
                    <div className="mt-2 flex gap-0.5">
                      <span className="h-1 w-4 rounded-full bg-current opacity-40" />
                      <span className="h-1 w-2 rounded-full bg-current opacity-20" />
                    </div>
                  </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </aside>

      <div className={`flex h-screen min-w-0 flex-1 flex-col ${collapsed ? "xl:ml-[64px]" : "xl:ml-[352px]"}`}>
        <header ref={dropdownRef} className="sticky top-0 z-30 border-b border-[#d8dde5] bg-white px-4 py-2 shadow-[0_1px_0_rgba(18,22,30,0.02)]">
          <div className="grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 md:grid-cols-[minmax(0,1fr)_minmax(240px,520px)_auto] xl:grid-cols-[1fr_minmax(360px,680px)_1fr] xl:gap-4">
            <div className="order-1 flex min-w-0 items-center gap-2">
              <button onClick={toggleSidebar} className="hidden h-8 w-8 items-center justify-center rounded-[7px] border border-[#dfe3e8] bg-white text-[#68707d] transition hover:bg-[#f7f8fb] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] xl:flex">
                {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
              </button>
              <div className="relative min-w-0">
                <button onClick={() => setMenu(menu === "headerOrg" ? null : "headerOrg")} className="flex h-9 max-w-full items-center gap-2 rounded-[7px] px-2.5 text-[13px] font-black text-[#2f343c] transition hover:bg-[#f7f8fb] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] sm:max-w-[240px]">
                  <BriefcaseBusiness size={15} className="text-[#7b68ee]" />
                  <span className="truncate">{organization}</span>
                  <ChevronDown size={14} className="text-[#8f96a3]" />
                </button>
                {menu === "headerOrg" && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-[10px] border border-[#dfe3e8] bg-white p-2 shadow-xl">
                    <p className="mb-2 border-b border-[#edf0f3] px-2 pb-2 text-[11px] font-black uppercase text-[#8f96a3]">Organisations</p>
                    {["AgileFlow Inc.", "Design Team"].map((org) => (
                      <button key={org} onClick={() => { setOrganization(org); setMenu(null); }} className="flex w-full items-center justify-between rounded-[7px] px-2 py-2 text-left text-sm font-bold text-[#2f343c] hover:bg-[#f7f8fb]">
                        {org}
                        {organization === org && <CheckCircle2 size={16} className="text-[#7b68ee]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="relative order-3 col-span-2 flex h-9 items-center gap-2 rounded-[9px] border border-[#d9dde5] bg-[#f7f8fb] px-3 shadow-inner shadow-white md:order-2 md:col-span-1">
              <Search size={16} className="text-[#7c828d]" />
              <input value={globalSearch} onFocus={() => setSearchOpen(true)} onChange={(event) => { setGlobalSearch(event.target.value); setSearchOpen(true); }} onKeyDown={(event) => {
                if (event.key === "Enter" && searchResults[0]) {
                  router.push(searchResults[0].href);
                  setGlobalSearch("");
                  setSearchOpen(false);
                }
              }} className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold outline-none placeholder:text-[#8f96a3]" placeholder="Search or jump to..." />
              <span className="hidden h-5 items-center rounded border border-[#d8dde5] bg-white px-1.5 text-[9px] font-black text-[#8f96a3] md:flex">Tasks</span>
              <span className="rounded border border-[#d8dde5] bg-white px-1.5 py-0.5 text-[9px] font-black text-[#8f96a3]">Ctrl K</span>
              {globalSearch && searchOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[10px] border border-[#dfe3e8] bg-white shadow-xl">
                  {searchResults.length > 0 ? searchResults.map((item) => (
                    <button key={item.href} onClick={() => { router.push(item.href); setGlobalSearch(""); setSearchOpen(false); }} className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-[#f7f8fb]">
                      <span className="text-sm font-black text-[#20242a]">{item.label}</span>
                      <span className="text-[11px] font-bold text-[#8f96a3]">{item.meta}</span>
                    </button>
                  )) : <p className="px-3 py-2 text-sm font-bold text-[#8f96a3]">No matching workspace view.</p>}
                </div>
              )}
            </div>
            <div className="order-2 flex justify-end md:order-3">
              <div className="flex h-9 items-center gap-1">
                <button onClick={() => openQuickPanel("new")} className="flex h-8 items-center gap-1 rounded-[7px] bg-[#7b68ee] px-3 text-[12px] font-black text-white transition hover:bg-[#6d56ea] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">
                  <CirclePlus size={14} />
                  New
                </button>
                <button onClick={() => openQuickPanel("automate")} className="hidden h-8 items-center gap-1 rounded-[7px] border border-[#dfe3e8] bg-white px-2.5 text-[12px] font-black text-[#68707d] transition hover:bg-[#f7f8fb] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] lg:flex">
                  <Workflow size={14} />
                  Automate
                </button>
                <button onClick={() => openQuickPanel("notifications")} className="flex h-8 w-8 items-center justify-center rounded-[7px] text-[#68707d] hover:bg-[#f7f8fb]" aria-label="Open notifications">
                  <Bell size={15} />
                </button>
                <div className="relative">
                  <button onClick={() => setMenu(menu === "profile" ? null : "profile")} className="flex h-8 items-center gap-1.5 rounded-[7px] px-1.5 hover:bg-[#f7f8fb]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7b68ee] bg-cover bg-center text-[10px] font-black text-white ring-2 ring-white" style={avatarStyle}>
                      {!profile?.avatar_url && avatar}
                    </span>
                    <span className="hidden text-[12px] font-black text-[#2f343c] sm:inline">{profile?.username || "Aya"}</span>
                  </button>
                  {menu === "profile" && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-[10px] border border-[#dfe3e8] bg-white p-2 shadow-xl">
                      <div className="mb-2 px-3 pb-3 pt-2">
                        <p className="text-sm font-black text-[#20242a]">{profile?.username || "Aya Achiban"}</p>
                        <p className="text-xs font-semibold text-[#7c828d]">{profile?.email || "aya.achiban@agileflow.com"}</p>
                      </div>
                      <button onClick={() => { router.push("/user_profile"); setMenu(null); }} className="flex w-full items-center gap-2 rounded-[7px] px-3 py-2 text-sm font-bold text-[#59606b] hover:bg-[#f7f8fb]">
                        <Settings size={15} className="text-[#8f96a3]" />
                        Parametres
                      </button>
                      <button onClick={signOut} className="mt-2 flex w-full items-center gap-2 border-t border-[#edf0f3] px-3 py-2 text-sm font-black text-red-600 hover:bg-red-50">
                        <LogOut size={15} />
                        Deconnexion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
          <div className="flex min-h-[58px] shrink-0 flex-wrap items-center justify-between gap-2 overflow-hidden border-b border-[#dfe3e8] bg-white px-5 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#7b68ee] text-white shadow-sm">
                <FolderKanban size={15} />
              </span>
              <span className="text-[13px] font-bold text-[#7c828d]">Product</span>
              <span className="text-[#c3c8d0]">/</span>
              <span className="truncate text-[18px] font-black text-[#20242a]">Sprint Backlog</span>
              <span className="rounded-[5px] border border-[#e1e4e8] bg-[#f7f8fb] px-2 py-0.5 text-[11px] font-bold text-[#8f96a3]">Private</span>
              <span className="hidden rounded-full bg-[#edf0f5] px-2 py-0.5 text-[10px] font-black text-[#7c828d] md:inline">14 tasks</span>
            </div>
            <div className="hidden items-center gap-1 sm:flex">
              <span className="flex -space-x-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7b68ee] text-[10px] font-black text-white ring-2 ring-white">AA</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00b884] text-[10px] font-black text-white ring-2 ring-white">MK</span>
              </span>
              <button onClick={() => openQuickPanel("share")} className="h-8 rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-[12px] font-black text-[#68707d]">Share</button>
              <button onClick={() => openQuickPanel("new")} className="h-8 rounded-[7px] bg-[#7b68ee] px-3.5 text-[12px] font-black text-white">Add task</button>
            </div>
          </div>
          <div className="flex h-10 shrink-0 items-end justify-between gap-3 overflow-x-auto border-b border-[#dfe3e8] bg-white px-5">
            <div className="flex h-full shrink-0 items-end gap-1">
              {[
                { href: "/dashboard/enterprise", label: "Overview", active: pathname.startsWith("/dashboard") },
                { href: "/tickets", label: "List", active: pathname === "/tickets" || pathname === "/sprint" },
                { href: "/Board/kanban", label: "Board", active: pathname.startsWith("/Board/kanban") },
                { href: "/Board/Timeline", label: "Calendar", active: pathname.startsWith("/Board/Timeline") },
              ].map((tab) => (
                <Link key={tab.href} href={tab.href} className={`flex h-9 items-center gap-1.5 px-2.5 text-[13px] font-black ${tab.active ? "border-b-2 border-[#7b68ee] text-[#20242a]" : "text-[#68707d] hover:text-[#20242a]"}`}>
                  {tab.label}
                  {tab.active && <span className="h-1.5 w-1.5 rounded-full bg-[#7b68ee]" />}
                </Link>
              ))}
              <button onClick={() => openQuickPanel("view")} className="h-9 px-2.5 text-[13px] font-black text-[#68707d]">+ View</button>
            </div>
            <div className="hidden h-full shrink-0 items-center gap-1 text-[11px] font-black text-[#8f96a3] lg:flex">
              <MessageSquare size={14} />
              3 comments
            </div>
          </div>
          <div className="flex h-11 shrink-0 items-center justify-between gap-3 overflow-x-auto border-b border-[#dfe3e8] bg-[#fbfbfc] px-5">
            <div className="flex shrink-0 gap-1">
              <button onClick={() => setToolbarMode((current) => ({ ...current, grouped: !current.grouped }))} className={`h-8 rounded-[7px] px-2.5 text-[12px] font-black shadow-sm ${toolbarMode.grouped ? "border border-[#dfe3e8] bg-white text-[#20242a]" : "text-[#68707d] hover:bg-white"}`}>Group: Status</button>
              <button onClick={() => setToolbarMode((current) => ({ ...current, subtasks: !current.subtasks }))} className={`h-8 rounded-[7px] px-2.5 text-[12px] font-black ${toolbarMode.subtasks ? "border border-[#dfe3e8] bg-white text-[#20242a]" : "text-[#68707d] hover:bg-white"}`}>Subtasks</button>
              <button onClick={() => setToolbarMode((current) => ({ ...current, me: !current.me }))} className={`h-8 rounded-[7px] px-2.5 text-[12px] font-black ${toolbarMode.me ? "border border-[#dfe3e8] bg-white text-[#20242a]" : "text-[#68707d] hover:bg-white"}`}>Me mode</button>
            </div>
            <div className="hidden shrink-0 items-center gap-1 md:flex">
              <button onClick={() => openQuickPanel("filter")} className="h-8 rounded-[7px] border border-[#dfe3e8] bg-white px-2.5 text-[12px] font-black text-[#68707d]">Filter</button>
              <button onClick={() => openQuickPanel("sort")} className="h-8 rounded-[7px] border border-[#dfe3e8] bg-white px-2.5 text-[12px] font-black text-[#68707d]">Sort</button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb]">{children}</div>
        </main>
      </div>
      {quickPanel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={closeQuickPanel}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">
                {quickPanel === "new" ? "Create task" : quickPanel === "automate" ? "Automation shortcuts" : quickPanel === "share" ? "Share workspace" : quickPanel === "view" ? "Add view" : quickPanel === "notifications" ? "Notifications" : quickPanel === "filter" ? "Workspace filters" : "Workspace sort"}
              </h2>
              <button onClick={closeQuickPanel} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            {quickPanelNote && (
              <div className="mb-3 rounded-[8px] border border-[#d7d1ff] bg-[#f3efff] px-3 py-2 text-xs font-black text-[#5f4bd8]">
                {quickPanelNote}
              </div>
            )}
            <div className="space-y-2">
              {quickPanel === "new" && ["Task", "Project", "Release"].map((item) => (
                <button key={item} onClick={() => { router.push(item === "Project" ? "/project" : item === "Release" ? "/release" : "/tickets"); closeQuickPanel(); }} className="flex h-10 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a] hover:bg-white">{item}<CirclePlus size={14} className="text-[#7b68ee]" /></button>
              ))}
              {quickPanel === "automate" && ["When status changes, notify assignee", "When due date passes, mark at risk", "When release ships, post to chat"].map((item) => (
                <button key={item} onClick={() => setQuickPanelNote(`${item} staged locally.`)} className="flex w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-left text-sm font-bold text-[#59606b] hover:bg-white">
                  {item}
                  {quickPanelNote.startsWith(item) && <span className="text-[10px] font-black text-[#7b68ee]">Staged</span>}
                </button>
              ))}
              {quickPanel === "share" && (
                <>
                  {["Aya Achiban", "Product team", "External reviewer"].map((item) => <div key={item} className="flex items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-black text-[#20242a]"><span>{item}</span><span className="text-[10px] text-[#8f96a3]">Can view</span></div>)}
                  <button onClick={() => setQuickPanelNote("Workspace share link copied locally.")} className="flex h-10 w-full items-center justify-center rounded-[8px] bg-[#7b68ee] px-3 text-sm font-black text-white">Copy share link</button>
                </>
              )}
              {quickPanel === "notifications" && [
                { title: "Aya mentioned you in PM-104", meta: "Task comment · 5 min" },
                { title: "Release v2.2 moved to review", meta: "Release update · 18 min" },
                { title: "Audit export finished locally", meta: "Workspace system · 1h" },
              ].map((item) => (
                <button key={item.title} onClick={() => { router.push(item.title.includes("Release") ? "/release" : item.title.includes("Audit") ? "/audit" : "/tickets"); closeQuickPanel(); }} className="flex w-full items-center justify-between gap-3 rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-left hover:bg-white">
                  <span>
                    <span className="block text-sm font-black text-[#20242a]">{item.title}</span>
                    <span className="text-[11px] font-bold text-[#8f96a3]">{item.meta}</span>
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#7b68ee]" />
                </button>
              ))}
              {quickPanel === "view" && [
                { label: "List", href: "/tickets" },
                { label: "Board", href: "/Board/kanban" },
                { label: "Calendar", href: "/Board/Timeline" },
              ].map((item) => <button key={item.href} onClick={() => { router.push(item.href); closeQuickPanel(); }} className="flex h-10 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a] hover:bg-white">{item.label}<span className="text-[#7b68ee]">Open</span></button>)}
              {(quickPanel === "filter" || quickPanel === "sort") && (quickPanel === "filter" ? ["Assigned to me", "Due soon", "Blocked only", "High priority"] : ["Priority first", "Recently updated", "Due date", "Task name"]).map((item) => (
                <button
                  key={item}
                  onClick={() => setQuickPanelNote(`${item} is active for this workspace session.`)}
                  className="flex h-9 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a] hover:bg-white"
                >
                  {item}
                  {quickPanelNote.startsWith(item) && <span className="text-[10px] text-[#7b68ee]">Active</span>}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
