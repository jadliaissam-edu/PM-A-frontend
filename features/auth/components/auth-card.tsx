import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          AgileFlow
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      </div>

      {children}

      {footer ? <div className="mt-6 space-y-3">{footer}</div> : null}
    </div>
  );
}
