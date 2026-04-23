import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WorkspacePanelProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function WorkspacePanel({
  title,
  description,
  icon,
  action,
  children,
  className,
}: WorkspacePanelProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md",
        className,
      )}
    >
      {title || description || action ? (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <div className="flex items-center gap-2">
                {icon}
                <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
              </div>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
