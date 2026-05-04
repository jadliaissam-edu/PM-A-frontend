import Link from "next/link";
import { CheckCircle2, FolderKanban, ShieldAlert, TimerReset } from "lucide-react";
import { IssueListItem } from "@/features/workspace/components/issue-list-item";
import { WorkspaceMetricCard } from "@/features/workspace/components/workspace-metric-card";
import { WorkspacePageHeader } from "@/features/workspace/components/workspace-page-header";
import { WorkspacePanel } from "@/features/workspace/components/workspace-panel";
import { WorkspaceListRow } from "@/features/workspace/components/workspace-list-row";
import { issues, projects } from "@/features/workspace/data/mock-workspace";

const inProgressIssues = issues.filter((issue) => issue.status === "In progress");
const reviewIssues = issues.filter((issue) => issue.status === "Review");
const criticalIssues = issues.filter((issue) => issue.priority === "Critical");
const myIssues = issues.filter((issue) => issue.assignee === "Aya Achiban");

export default function IssuesPage() {
  return (
    <>
      <WorkspacePageHeader
        title="Issues"
        description="Track all work items across the current project scope with status, priority, and sprint context."
        breadcrumbs={[
          { label: "Workspace", href: "/dashboard" },
          { label: "Issues" },
        ]}
        actions={
          <Link
            href="/projects"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
          >
            Browse projects
          </Link>
        }
      />

      <section className="mb-8 grid gap-4 xl:grid-cols-4">
        <WorkspaceMetricCard
          title="Total issues"
          value={issues.length.toString()}
          subtitle="Current work items in the workspace"
        />
        <WorkspaceMetricCard
          title="In progress"
          value={inProgressIssues.length.toString()}
          subtitle="Items currently being implemented"
        />
        <WorkspaceMetricCard
          title="In review"
          value={reviewIssues.length.toString()}
          subtitle="Items awaiting validation"
        />
        <WorkspaceMetricCard
          title="Assigned to me"
          value={myIssues.length.toString()}
          subtitle="Personal workload in the sprint"
        />
      </section>

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <WorkspacePanel
          title="Issue queue"
          description="The cross-project view for the authenticated workspace foundation."
          icon={<CheckCircle2 size={18} />}
        >
          <div className="space-y-3">
            {issues.map((issue) => (
              <IssueListItem key={issue.id} issue={issue} />
            ))}
          </div>
        </WorkspacePanel>

        <div className="space-y-6">
          <WorkspacePanel title="Priority watch" icon={<ShieldAlert size={18} />}>
            <div className="space-y-3">
              {criticalIssues.map((issue) => (
                <WorkspaceListRow
                  key={issue.id}
                  title={issue.title}
                  subtitle={`${issue.key} · ${issue.projectName}`}
                />
              ))}
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Project coverage" icon={<FolderKanban size={18} />}>
            <div className="space-y-3">
              {projects.map((project) => (
                <WorkspaceListRow
                  key={project.id}
                  title={project.name}
                  subtitle={`${issues.filter((issue) => issue.projectId === project.id).length} linked issues`}
                  href={`/projects/${project.id}`}
                />
              ))}
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Sprint pulse" icon={<TimerReset size={18} />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Done</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900">
                  {issues.filter((issue) => issue.status === "Done").length}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Backlog</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900">
                  {issues.filter((issue) => issue.status === "Backlog").length}
                </p>
              </div>
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </>
  );
}
