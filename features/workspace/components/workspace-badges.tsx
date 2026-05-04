import { cn } from "@/lib/utils";
import type {
  AccentTone,
  IssuePriority,
  IssueStatus,
  ProjectStatus,
  SpaceStatus,
} from "@/types/workspace";

export const accentToneMap: Record<AccentTone, string> = {
  blue: "bg-blue-100 text-blue-700",
  pink: "bg-pink-100 text-pink-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  cyan: "bg-cyan-100 text-cyan-700",
};

const issueStatusToneMap: Record<IssueStatus, string> = {
  Backlog: "bg-zinc-100 text-zinc-700",
  "In progress": "bg-sky-100 text-sky-700",
  Review: "bg-amber-100 text-amber-700",
  Done: "bg-emerald-100 text-emerald-700",
};

const priorityToneMap: Record<IssuePriority, string> = {
  Low: "bg-zinc-100 text-zinc-700",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-amber-100 text-amber-700",
  Critical: "bg-rose-100 text-rose-700",
};

const projectStatusToneMap: Record<ProjectStatus | SpaceStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  "In progress": "bg-sky-100 text-sky-700",
  Planning: "bg-amber-100 text-amber-700",
  "On track": "bg-emerald-100 text-emerald-700",
  "At risk": "bg-rose-100 text-rose-700",
  Completed: "bg-zinc-900 text-white",
};

function Badge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", className)}>
      {label}
    </span>
  );
}

export function AccentBadge({
  label,
  accent,
  className,
}: {
  label: string;
  accent: AccentTone;
  className?: string;
}) {
  return <Badge label={label} className={cn(accentToneMap[accent], className)} />;
}

export function ProjectStatusBadge({
  status,
}: {
  status: ProjectStatus | SpaceStatus;
}) {
  return <Badge label={status} className={projectStatusToneMap[status]} />;
}

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  return <Badge label={status} className={issueStatusToneMap[status]} />;
}

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  return <Badge label={priority} className={priorityToneMap[priority]} />;
}
