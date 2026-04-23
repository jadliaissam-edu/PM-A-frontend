import Link from "next/link";
import { Bell, CirclePlus, Search } from "lucide-react";

export function WorkspaceTopbar() {
  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-4 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2">
          <Search size={16} className="text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects, issues, or teams..."
            className="w-64 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <CirclePlus size={16} />
            New project
          </Link>

          <button
            className="rounded-xl border border-zinc-300 p-2 text-zinc-700 transition hover:bg-zinc-100"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
              AA
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-zinc-900">Aya Achiban</p>
              <p className="text-xs text-zinc-500">Frontend lead</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
