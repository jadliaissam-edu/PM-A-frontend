"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  ChevronDown,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Home,
  PanelsTopLeft,
  Star,
} from "lucide-react";
import {
  favoriteLinks,
  recentLinks,
  workspaceLinks,
} from "@/features/workspace/data/mock-workspace";
import { cn } from "@/lib/utils";

const primaryNavigation = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/issues", label: "Issues", icon: CheckCircle2 },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r border-zinc-200 bg-white px-4 py-5 xl:block">
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-bold text-white">
          A
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">AgileFlow</p>
          <p className="text-xs text-zinc-500">Project workspace</p>
        </div>
        <ChevronDown size={16} className="text-zinc-400" />
      </div>

      <div className="mb-6 space-y-2">
        {primaryNavigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100",
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <SidebarSection
        title="Favorites"
        icon={Star}
        items={favoriteLinks}
        pathname={pathname}
      />
      <SidebarSection
        title="Recent"
        icon={Clock3}
        items={recentLinks}
        pathname={pathname}
      />
      <SidebarSection
        title="Workspaces"
        icon={BriefcaseBusiness}
        items={workspaceLinks}
        pathname={pathname}
        alternateIcon={PanelsTopLeft}
      />
    </aside>
  );
}

function SidebarSection({
  title,
  icon: Icon,
  items,
  pathname,
  alternateIcon: AlternateIcon,
}: {
  title: string;
  icon: typeof Star;
  items: typeof favoriteLinks;
  pathname: string;
  alternateIcon?: typeof PanelsTopLeft;
}) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, index) => {
          const ActiveIcon = AlternateIcon && index % 2 === 1 ? AlternateIcon : Icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={`${title}-${item.href}`}
              href={item.href}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-700 hover:bg-zinc-100",
              )}
            >
              <ActiveIcon size={14} className="text-zinc-400" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
