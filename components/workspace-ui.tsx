import { type ButtonHTMLAttributes, type ReactNode } from "react";

export function WorkspacePage({ children }: { children: ReactNode }) {
  return <main className="min-h-full bg-[#f7f8fb] p-4 text-[#20242a]">{children}</main>;
}

export function WorkspaceHeader({
  title,
  subtitle,
  badge,
  actions,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="mb-4 rounded-[10px] border border-[#dfe3e8] bg-white shadow-sm">
      <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-[20px] font-black text-[#20242a]">{title}</h1>
            {badge && <span className="rounded-full bg-[#f3efff] px-2 py-0.5 text-[10px] font-black text-[#7b68ee]">{badge}</span>}
          </div>
          <p className="mt-0.5 text-xs font-semibold text-[#7c828d]">{subtitle}</p>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </section>
  );
}

export function Panel({ title, icon, action, children }: { title: string; icon?: ReactNode; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[10px] border border-[#dfe3e8] bg-white p-3.5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-[#7b68ee]">{icon}</div>}
          <h2 className="text-sm font-black text-[#20242a]">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function GhostButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button {...props} className={`inline-flex h-8 items-center justify-center rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-xs font-black text-[#68707d] shadow-sm transition hover:bg-[#f7f8fb] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] disabled:cursor-not-allowed disabled:opacity-55 ${className}`}>{children}</button>;
}

export function PrimaryButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button {...props} className={`inline-flex h-8 items-center justify-center rounded-[7px] bg-[#7b68ee] px-3.5 text-xs font-black text-white shadow-sm transition hover:bg-[#6d56ea] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] disabled:cursor-not-allowed disabled:opacity-55 ${className}`}>{children}</button>;
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "purple" | "green" | "blue" | "red" | "yellow" }) {
  const color = {
    neutral: "border-[#dfe3e8] bg-white text-[#68707d]",
    purple: "border-[#d7d1ff] bg-[#f3efff] text-[#7b68ee]",
    green: "border-[#d7f4e8] bg-[#ecfff6] text-[#008f65]",
    blue: "border-[#d9efff] bg-[#eff8ff] text-[#1090e0]",
    red: "border-[#ffd6d6] bg-[#fff1f1] text-[#e5484d]",
    yellow: "border-[#ffe1b3] bg-[#fff7e8] text-[#c87900]",
  }[tone];
  return <span className={`inline-flex h-5 items-center rounded-[4px] border px-2 text-[10px] font-black ${color}`}>{children}</span>;
}

export function Avatar({ initials }: { initials: string }) {
  return <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7b68ee] text-[10px] font-black text-white ring-2 ring-white">{initials}</span>;
}
