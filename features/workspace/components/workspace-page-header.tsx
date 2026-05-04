import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface WorkspacePageHeaderProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: ReactNode;
}

export function WorkspacePageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: WorkspacePageHeaderProps) {
  return (
    <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          {breadcrumbs.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <ChevronRight size={14} /> : null}
              {item.href ? (
                <Link href={item.href} className="transition hover:text-zinc-900">
                  {item.label}
                </Link>
              ) : (
                <span className="text-zinc-700">{item.label}</span>
              )}
            </div>
          ))}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{description}</p>
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </section>
  );
}
