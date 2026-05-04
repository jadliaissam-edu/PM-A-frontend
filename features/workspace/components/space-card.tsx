import { LayoutGrid, MoreHorizontal } from "lucide-react";
import { WorkspaceAvatarStack } from "@/features/workspace/components/workspace-avatar-stack";
import {
  ProjectStatusBadge,
  accentToneMap,
} from "@/features/workspace/components/workspace-badges";
import type { SpaceSummary } from "@/types/workspace";

interface SpaceCardProps {
  space: SpaceSummary;
}

const spaceInitials: Record<string, string[]> = {
  engineering: ["AA", "HK", "SN"],
  design: ["YM", "LB", "AA"],
  marketing: ["SN", "LB", "HK"],
  product: ["AA", "LB", "YM"],
};

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentToneMap[space.accent]}`}
          >
            <LayoutGrid size={18} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">{space.name}</h3>
            <span className="text-xs text-zinc-500">{space.members} members</span>
          </div>
        </div>

        <button className="text-zinc-400 hover:text-zinc-700" aria-label="More options">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <p className="mb-3 text-sm leading-6 text-zinc-600">{space.description}</p>
      <p className="mb-4 text-xs text-zinc-500">
        {space.taskCount} tasks · {space.updatedLabel}
      </p>

      <div className="flex items-center justify-between">
        <ProjectStatusBadge status={space.status} />
        <WorkspaceAvatarStack initials={spaceInitials[space.id] ?? ["AF", "TM", "UX"]} />
      </div>
    </div>
  );
}
