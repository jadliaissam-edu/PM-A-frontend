import { CircleDashed, Layers3, ListTodo, ShieldAlert } from "lucide-react";
import { IssueStatusBadge, PriorityBadge } from "@/features/workspace/components/workspace-badges";
import { WorkspaceListRow } from "@/features/workspace/components/workspace-list-row";
import type { IssueSummary } from "@/types/workspace";

interface IssueListItemProps {
  issue: IssueSummary;
}

const iconMap = {
  Story: CircleDashed,
  Task: ListTodo,
  Bug: ShieldAlert,
  Epic: Layers3,
};

export function IssueListItem({ issue }: IssueListItemProps) {
  const Icon = iconMap[issue.type];

  return (
    <WorkspaceListRow
      title={`${issue.key} · ${issue.title}`}
      subtitle={`${issue.projectName} · ${issue.assignee} · ${issue.updatedLabel}`}
      trailing={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700">
            <Icon size={12} />
            {issue.type}
          </span>
          <PriorityBadge priority={issue.priority} />
          <IssueStatusBadge status={issue.status} />
        </div>
      }
      className="items-start"
    />
  );
}
