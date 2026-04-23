import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  FolderKanban,
  Layers3,
  Users,
} from "lucide-react";
import { IssueListItem } from "@/features/workspace/components/issue-list-item";
import { ProjectStatusBadge, AccentBadge } from "@/features/workspace/components/workspace-badges";
import { WorkspaceAvatarStack } from "@/features/workspace/components/workspace-avatar-stack";
import { WorkspaceMetricCard } from "@/features/workspace/components/workspace-metric-card";
import { WorkspacePageHeader } from "@/features/workspace/components/workspace-page-header";
import { WorkspacePanel } from "@/features/workspace/components/workspace-panel";
import { WorkspaceListRow } from "@/features/workspace/components/workspace-list-row";
import {
  getActivityByProjectId,
  getIssuesByProjectId,
  getProjectById,
} from "@/features/workspace/data/mock-workspace";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const projectIssues = getIssuesByProjectId(projectId);
  const projectActivity = getActivityByProjectId(projectId);

  return (
    <>
      <WorkspacePageHeader
        title={project.name}
        description={project.summary}
        breadcrumbs={[
          { label: "Workspace", href: "/dashboard" },
          { label: "Projects", href: "/projects" },
          { label: project.name },
        ]}
        actions={
          <>
            <ProjectStatusBadge status={project.status} />
            <Link
              href="/issues"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
            >
              View all issues
            </Link>
          </>
        }
      />

      <section className="mb-8 grid gap-4 xl:grid-cols-4">
        <WorkspaceMetricCard
          title="Progress"
          value={`${project.progress}%`}
          subtitle="Completion across current scope"
        />
        <WorkspaceMetricCard
          title="Open issues"
          value={projectIssues.length.toString()}
          subtitle="Tracked work items in this project"
        />
        <WorkspaceMetricCard
          title="Completed work"
          value={project.completedCount.toString()}
          subtitle="Items delivered so far"
        />
        <WorkspaceMetricCard
          title="Team members"
          value={project.memberInitials.length.toString()}
          subtitle="Contributors represented in the mock workspace"
        />
      </section>

      <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <WorkspacePanel
            title="Project overview"
            description="Key ownership and delivery details for the selected project."
            icon={<FolderKanban size={18} />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Lead</p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">{project.lead}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Team</p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">{project.team}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Due date</p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">{project.dueLabel}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Project code</p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">{project.code}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <AccentBadge key={tag} label={tag} accent={project.accent} />
              ))}
            </div>
          </WorkspacePanel>

          <WorkspacePanel
            title="Current project issues"
            description="The most relevant items tied to the current sprint and delivery status."
            icon={<CheckCircle2 size={18} />}
          >
            <div className="space-y-3">
              {projectIssues.map((issue) => (
                <IssueListItem key={issue.id} issue={issue} />
              ))}
            </div>
          </WorkspacePanel>
        </div>

        <div className="space-y-6">
          <WorkspacePanel title="Team snapshot" icon={<Users size={18} />}>
            <div className="space-y-4">
              <WorkspaceAvatarStack initials={project.memberInitials} size="md" />
              <WorkspaceListRow
                title={project.lead}
                subtitle="Project owner"
                trailing={<ProjectStatusBadge status={project.status} />}
              />
              <WorkspaceListRow
                title={project.team}
                subtitle="Primary team"
                trailing={<span className="text-xs text-zinc-500">{project.dueLabel}</span>}
              />
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Recent activity" icon={<Activity size={18} />}>
            <div className="space-y-3">
              {projectActivity.map((item) => (
                <WorkspaceListRow key={item.id} title={item.title} subtitle={item.meta} />
              ))}
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Navigation" icon={<Layers3 size={18} />}>
            <div className="space-y-3">
              <WorkspaceListRow
                title="Back to projects"
                subtitle="Return to the projects overview."
                href="/projects"
              />
              <WorkspaceListRow
                title="Review issue queue"
                subtitle="Cross-project issue list for milestone two."
                href="/issues"
              />
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </>
  );
}
