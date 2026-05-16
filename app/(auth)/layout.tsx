"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const authNav = [
  { label: "Sign in", href: "/login", meta: "Workspace entry" },
  { label: "Create account", href: "/register", meta: "New teammate" },
  { label: "Reset password", href: "/forgot-password", meta: "Recovery" },
];



export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <main className="relative flex min-h-screen bg-white text-[#20242a] ">
      {/* Full-page patterned background behind all auth pages */}
      
      {/* left icon sidebar removed per user request */}

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
          {/* Access scope card removed */}
        </nav>
      </aside>

    <section className="relative flex min-h-screen w-full items-center justify-center bg-[#f7f8fb] px-4 py-6 sm:px-6 ">



  <div className="relative z-10 w-full max-w-[820px] grid place-items-center overflow-hidden  ">
    
    

    {/* Auth Section */}
    <div className="flex min-h-[560px] items-center justify-center p-5 sm:p-7">
      <div className="w-full max-w-[410px]">
        {children}
      </div>
    </div>

  </div>
</section>
    </main>
  );
}
