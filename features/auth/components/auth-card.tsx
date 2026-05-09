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
    <section className="w-full rounded-[10px] border border-[#dfe3e8] bg-white p-5 shadow-[0_1px_2px_rgba(18,22,30,0.06)] sm:p-6">
      <div className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex h-5 items-center rounded-[4px] border border-[#d7d1ff] bg-[#f3efff] px-2 text-[10px] font-black text-[#7b68ee]">Workspace access</span>
          <span className="text-[10px] font-black uppercase text-[#8f96a3]">Secure</span>
        </div>
          <h1 className="text-[20px] font-black text-[#20242a]">
            {title}
          </h1>
          <p className="mt-0.5 text-xs font-semibold leading-5 text-[#7c828d]">{description}</p>
      </div>

      {children}

      {footer ? <div className="mt-4 space-y-2 border-t border-[#edf0f3] pt-3.5">{footer}</div> : null}
    </section>
  );
}
