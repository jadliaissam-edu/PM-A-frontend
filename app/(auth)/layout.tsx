"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const authNav = [
  { label: "Sign in", href: "/login", meta: "Workspace entry" },
  { label: "Create account", href: "/register", meta: "New teammate" },
  { label: "Reset password", href: "/forgot-password", meta: "Recovery" },
];

const previewRows = [
  { title: "Finish dashboard QA", status: "IN PROGRESS", color: "#1090e0" },
  { title: "Review release checklist", status: "REVIEW", color: "#7b68ee" },
  { title: "Export audit report", status: "TO DO", color: "#87909e" },
];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <main className="flex min-h-screen bg-white text-[#20242a]">
      <aside className="hidden w-[64px] shrink-0 flex-col items-center bg-[#24113f] px-2 py-2 text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.08)] xl:flex">
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[12px] bg-white shadow-sm">
          <span className="grid h-6 w-6 grid-cols-2 gap-0.5">
            <span className="rounded-[3px] bg-[#7b68ee]" />
            <span className="rounded-[3px] bg-[#ffcc00]" />
            <span className="rounded-[3px] bg-[#00b884]" />
            <span className="rounded-[3px] bg-[#1090e0]" />
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-2">
          {["A", "T", "B", "R"].map((item, index) => (
            <span key={item} className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-xs font-black ${index === 0 ? "bg-white text-[#6d28d9] shadow-sm" : "text-white/62 ring-1 ring-white/10"}`}>
              {item}
            </span>
          ))}
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7b68ee] text-[10px] font-black ring-2 ring-white/20">AF</span>
      </aside>

      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[#dfe3e8] bg-[#f4f6fa] lg:flex">
        <div className="flex h-[58px] items-center gap-2.5 border-b border-[#dfe3e8] px-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-[#7b68ee] text-[12px] font-black text-white">AF</span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-black leading-4 text-[#24272d]">AgileFlow</p>
            <p className="truncate text-[11px] font-semibold leading-4 text-[#7b828f]">Secure workspace access</p>
          </div>
        </div>
        <nav className="flex-1 px-2.5 py-3">
          <p className="mb-1 flex h-5 items-center px-1.5 text-[10px] font-black uppercase text-[#8f96a3]">Auth suite</p>
          {authNav.map((item) => {
            const active = pathname === item.href;
            return (
            <Link key={item.href} href={item.href} className={`mb-1 flex h-[31px] items-center gap-2 rounded-[7px] px-2 text-left text-[12px] ${active ? "bg-white font-black text-[#2f343c] shadow-sm ring-1 ring-[#dfe3e8]" : "font-bold text-[#68707d] hover:bg-white hover:text-[#2f343c]"}`}>
              <span className={`h-2.5 w-2.5 rounded-[3px] ${active ? "bg-[#7b68ee]" : "bg-[#c5cad3]"}`} />
              <span className="truncate">{item.label}</span>
              <span className="ml-auto hidden text-[10px] font-bold text-[#8f96a3] xl:inline">{item.meta}</span>
            </Link>
            );
          })}
          <div className="mt-5 rounded-[10px] border border-[#dfe3e8] bg-white p-3 shadow-sm">
            <p className="text-[10px] font-black uppercase text-[#8f96a3]">Access scope</p>
            <p className="mt-2 text-[11px] font-semibold leading-5 text-[#68707d]">
              One secure account for tasks, boards, reports, releases, and project settings.
            </p>
          </div>
        </nav>
      </aside>

      <section className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex min-h-[58px] shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#dfe3e8] bg-white px-4 py-2 shadow-[0_1px_0_rgba(18,22,30,0.02)]">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2 text-[12px] font-bold text-[#7c828d]">
              <span>Everything</span>
              <span className="text-[#c3c8d0]">/</span>
              <span>Security</span>
              <span className="text-[#c3c8d0]">/</span>
              <span className="truncate font-black text-[#20242a]">Authentication</span>
            </div>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-[#8f96a3]">Use your AgileFlow credentials to access delivery work.</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="hidden h-8 items-center rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-xs font-black text-[#68707d] shadow-sm sm:inline-flex">Private workspace</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7b68ee] text-[10px] font-black text-white ring-2 ring-white">AF</span>
          </div>
        </header>

        <div className="flex h-10 shrink-0 items-end gap-1 overflow-x-auto border-b border-[#dfe3e8] bg-white px-4">
          {authNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex h-9 shrink-0 items-center px-2.5 text-[13px] font-black ${active ? "border-b-2 border-[#7b68ee] text-[#20242a]" : "text-[#68707d] hover:text-[#20242a]"}`}>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb] p-4 sm:p-6">
          <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[10px] border border-[#dfe3e8] bg-white shadow-sm xl:grid-cols-[minmax(0,0.9fr)_430px]">
            <div className="hidden border-r border-[#edf0f3] bg-white p-5 xl:block">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-[#8f96a3]">Workspace preview</p>
                  <h2 className="mt-1 text-sm font-black text-[#20242a]">Sprint Backlog</h2>
                </div>
                <span className="inline-flex h-5 items-center rounded-[4px] border border-[#d7d1ff] bg-[#f3efff] px-2 text-[10px] font-black text-[#7b68ee]">Auth required</span>
              </div>
              <div className="space-y-2.5">
                {previewRows.map((row) => (
                  <div key={row.title} className="grid grid-cols-[minmax(0,1fr)_104px_76px] items-center rounded-[7px] border border-[#edf0f3] bg-white text-[12px] shadow-sm">
                    <div className="flex min-w-0 items-center gap-2 px-3 py-2">
                      <span className="h-3.5 w-3.5 rounded-[3px] border border-[#c8cdd4] bg-white" />
                      <span className="truncate font-black text-[#20242a]">{row.title}</span>
                    </div>
                    <span className="border-l border-[#edf0f3] px-3 py-2 text-[9px] font-black text-white" style={{ backgroundColor: row.color }}>{row.status}</span>
                    <span className="border-l border-[#edf0f3] px-3 py-2 text-[10px] font-black text-[#8f96a3]">Today</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[9px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                <p className="text-[10px] font-black uppercase text-[#8f96a3]">Session status</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#68707d]">
                  Sign in to unlock your workspace data and continue where your team left off.
                </p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  ["Tasks", "14"],
                  ["Boards", "5"],
                  ["Reports", "8"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[7px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                    <p className="text-[10px] font-black uppercase text-[#8f96a3]">{label}</p>
                    <p className="mt-1 text-xl font-black text-[#20242a]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-white p-5 sm:min-h-[560px] sm:p-7">
              <div className="w-full max-w-[410px]">{children}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
