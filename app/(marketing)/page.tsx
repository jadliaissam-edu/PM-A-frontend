import Link from "next/link";
import { ArrowRight, BarChart3, CalendarDays, CheckCircle2, Layers3, MessageSquare, PanelsTopLeft, Search, ShieldCheck } from "lucide-react";

const columns = [
  { title: "TO DO", color: "bg-[#87909e]", tasks: ["Plan import mapping", "Review auth states"] },
  { title: "IN PROGRESS", color: "bg-[#1090e0]", tasks: ["Polish list density", "Update workspace shell"] },
  { title: "REVIEW", color: "bg-[#f8ae00]", tasks: ["Board fidelity pass"] },
];

const views = [
  { href: "/tickets", icon: <CheckCircle2 size={18} />, title: "List", text: "Dense grouped tasks with real PM-tool hierarchy." },
  { href: "/Board/kanban", icon: <PanelsTopLeft size={18} />, title: "Board", text: "Status lanes, cards, metadata, and drag cues." },
  { href: "/Board/Timeline", icon: <CalendarDays size={18} />, title: "Timeline", text: "Planning bands, milestones, and release timing." },
  { href: "/reports", icon: <BarChart3 size={18} />, title: "Reports", text: "Velocity, workload, and delivery health surfaces." },
];

const productRoutes = [
  { href: "/dashboard/enterprise", label: "Workspace home", meta: "Dashboard" },
  { href: "/project", label: "Projects", meta: "Portfolio" },
  { href: "/release", label: "Releases", meta: "Delivery" },
  { href: "/chat", label: "Team chat", meta: "Collaboration" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#20242a]">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 grid-cols-2 gap-0.5 rounded-[10px] bg-[#24113f] p-2">
            <span className="rounded-[2px] bg-[#7b68ee]" />
            <span className="rounded-[2px] bg-[#ffcc00]" />
            <span className="rounded-[2px] bg-[#00b884]" />
            <span className="rounded-[2px] bg-[#1090e0]" />
          </span>
          <div>
            <p className="text-sm font-black">AgileFlow</p>
            <p className="text-[11px] font-bold text-[#7c828d]">Project workspace</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-[#68707d] md:flex">
          <Link href="#workspace" className="hover:text-[#20242a]">Workspace</Link>
          <Link href="#views" className="hover:text-[#20242a]">Views</Link>
          <Link href="#security" className="hover:text-[#20242a]">Security</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="h-8 rounded-[7px] border border-[#dfe3e8] bg-white px-3 py-2 text-xs font-black text-[#68707d] shadow-sm transition hover:bg-[#f7f8fb] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">Sign in</Link>
          <Link href="/register" className="h-8 rounded-[7px] bg-[#7b68ee] px-3.5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#6d56ea] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">Start free</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 xl:grid-cols-[0.92fr_1.08fr] xl:py-16">
        <div className="self-center">
          <span className="inline-flex h-7 items-center rounded-full border border-[#d7d1ff] bg-[#f3efff] px-3 text-xs font-black text-[#7b68ee]">ClickUp-inspired delivery workspace</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-[#20242a] md:text-6xl">Plan, track, and ship work in one compact product surface.</h1>
          <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#68707d]">AgileFlow brings project dashboards, task lists, boards, timelines, reports, imports, audit logs, chat, and settings into one coherent PM workspace.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#7b68ee] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#6d56ea] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">
              Create workspace
              <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard/enterprise" className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#dfe3e8] bg-white px-5 text-sm font-black text-[#68707d] shadow-sm transition hover:bg-[#f7f8fb] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">View dashboard</Link>
          </div>
          <div className="mt-5 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
            {productRoutes.map((route) => (
              <Link key={route.href} href={route.href} className="rounded-[8px] border border-[#dfe3e8] bg-white px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d7d1ff] hover:bg-[#f3efff]">
                <p className="truncate text-[11px] font-black text-[#20242a]">{route.label}</p>
                <p className="text-[10px] font-bold text-[#8f96a3]">{route.meta}</p>
              </Link>
            ))}
          </div>
        </div>

        <div id="workspace" className="rounded-[14px] border border-[#dfe3e8] bg-white shadow-[0_30px_90px_rgba(31,35,43,0.14)]">
          <div className="flex h-12 items-center justify-between border-b border-[#dfe3e8] px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#7b68ee]" />
              <span className="text-sm font-black">Sprint Backlog</span>
              <span className="rounded-[5px] border border-[#e1e4e8] bg-[#f7f8fb] px-2 py-0.5 text-[10px] font-bold text-[#8f96a3]">Private</span>
            </div>
            <Link href="/tickets" className="hidden h-8 w-72 items-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2.5 transition hover:bg-white md:flex">
              <Search size={14} className="text-[#8f96a3]" />
              <span className="text-xs font-semibold text-[#9aa1ad]">Search or jump to...</span>
            </Link>
          </div>
          <div className="grid gap-3 bg-[#f7f8fb] p-4 md:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="rounded-[10px] border border-[#dfe3e8] bg-[#eef0f4] p-2">
                <div className="mb-2 flex h-8 items-center justify-between rounded-[8px] border border-[#dfe3e8] bg-white px-2">
                  <div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-[3px] ${column.color}`} /><span className="text-[11px] font-black">{column.title}</span></div>
                  <span className="rounded-full bg-[#eef0f4] px-2 text-[10px] font-black text-[#68707d]">{column.tasks.length}</span>
                </div>
                <div className="space-y-2">
                  {column.tasks.map((task) => (
                    <div key={task} className="rounded-[8px] border border-[#dfe3e8] bg-white p-3 shadow-sm">
                      <p className="text-xs font-black">{task}</p>
                      <div className="mt-3 flex items-center justify-between"><span className="rounded-[4px] bg-[#f7f8fb] px-1.5 py-0.5 text-[10px] font-black text-[#8f96a3]">PM</span><span className="h-6 w-6 rounded-full bg-[#7b68ee]" /></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="views" className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-black text-[#20242a]">Workspace views that match the app</h2>
            <p className="mt-1 text-sm font-semibold text-[#68707d]">Every card below opens the matching dashboard route.</p>
          </div>
          <Link href="/tickets" className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#dfe3e8] bg-white px-4 text-xs font-black text-[#68707d] shadow-sm hover:bg-[#f7f8fb]">Open task list</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
        {views.map((item) => (
          <Link href={item.href} key={item.title} className="rounded-[10px] border border-[#dfe3e8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d7d1ff] hover:shadow-md">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#f3efff] text-[#7b68ee]">{item.icon}</div>
            <h2 className="text-sm font-black">{item.title}</h2>
            <p className="mt-2 text-xs font-semibold leading-5 text-[#68707d]">{item.text}</p>
          </Link>
        ))}
        </div>
      </section>

      <section id="security" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[12px] border border-[#dfe3e8] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-[9px] bg-[#ecfff6] text-[#00b884]"><ShieldCheck size={20} /></div>
            <div className="min-w-0">
              <h2 className="text-lg font-black">Frontend ready for secure integration</h2>
              <p className="text-sm font-semibold text-[#68707d]">Auth flows, typed services, validation, and dashboard surfaces are prepared for backend growth.</p>
            </div>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Layers3 size={16} className="text-[#7b68ee]" />
              <span className="text-xs font-black text-[#8f96a3]">Workspace-grade UI</span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row md:ml-4">
              <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#7b68ee] px-4 text-xs font-black text-white shadow-sm hover:bg-[#6d56ea]">Start free</Link>
              <Link href="/chat" className="inline-flex h-9 items-center justify-center gap-1 rounded-[8px] border border-[#dfe3e8] bg-white px-4 text-xs font-black text-[#68707d] shadow-sm hover:bg-[#f7f8fb]"><MessageSquare size={13} /> See chat</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
