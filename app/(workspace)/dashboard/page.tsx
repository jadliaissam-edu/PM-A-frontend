import Link from "next/link";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  Star,
} from "lucide-react";
import { SpaceCard } from "@/features/workspace/components/space-card";
import { WorkspaceListRow } from "@/features/workspace/components/workspace-list-row";
import { WorkspaceMetricCard } from "@/features/workspace/components/workspace-metric-card";
import { WorkspacePageHeader } from "@/features/workspace/components/workspace-page-header";
import { WorkspacePanel } from "@/features/workspace/components/workspace-panel";
import {
  IssueStatusBadge,
  ProjectStatusBadge,
} from "@/features/workspace/components/workspace-badges";
import {
  deadlines,
  favoriteLinks,
  issues,
  projects,
  recentActivity,
  spaces,
} from "@/features/workspace/data/mock-workspace";

const assignedIssues = issues.filter((issue) => issue.assignee === "Aya Achiban").slice(0, 3);
const featuredProjects = projects.slice(0, 3);

export default function DashboardPage() {
  return (
    <>
      <WorkspacePageHeader
        title="Welcome back, Aya"
        description="Manage team spaces, review project health, and keep delivery visible across the workspace."
        breadcrumbs={[
          { label: "Workspace", href: "/dashboard" },
          { label: "Dashboard" },
        ]}
        actions={
          <>
            <Link
              href="/issues"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
            >
              Review issues
            </Link>
            <Link
              href="/projects"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Open projects
            </Link>
          </>
        }
      />

      <section className="mb-8 grid gap-4 xl:grid-cols-4">
        <WorkspaceMetricCard
          title="Total spaces"
          value={spaces.length.toString()}
          subtitle="Active team workspaces"
        />
        <WorkspaceMetricCard
          title="Projects in flight"
          value={projects.length.toString()}
          subtitle="Tracked in the authenticated workspace"
        />
        <WorkspaceMetricCard
          title="Assigned issues"
          value={assignedIssues.length.toString()}
          subtitle="Currently assigned to you"
        />
        <WorkspaceMetricCard
          title="Recent updates"
          value={recentActivity.length.toString()}
          subtitle="Changes surfaced in the last day"
        />
      </section>

      <section className="mb-8">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Spaces</h2>
            <p className="text-sm text-zinc-500">
              Organize work by teams and functional areas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
            >
              View projects
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold text-zinc-900">Your work</h2>
        <p className="text-sm text-zinc-500">
          Quick access to recent progress, personal issues, and project momentum.
        </p>
      </section>

      <div className="grid gap-6 2xl:grid-cols-12">
        <WorkspacePanel
          title="Favorites"
          icon={<Star size={18} />}
          className="2xl:col-span-4"
        >
          <div className="space-y-3">
            {favoriteLinks.map((item) => (
              <WorkspaceListRow
                key={item.href}
                title={item.label}
                subtitle="Pinned workspace shortcut"
                href={item.href}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel
          title="Recent activity"
          icon={<Activity size={18} />}
          className="2xl:col-span-4"
        >
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <WorkspaceListRow key={item.id} title={item.title} subtitle={item.meta} />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel
          title="Assigned to me"
          icon={<CheckCircle2 size={18} />}
          className="2xl:col-span-4"
        >
          <div className="space-y-3">
            {assignedIssues.map((issue) => (
              <WorkspaceListRow
                key={issue.id}
                title={issue.title}
                subtitle={`${issue.key} · ${issue.projectName}`}
                trailing={<IssueStatusBadge status={issue.status} />}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel
          title="Featured projects"
          description="The main delivery streams currently moving through the workspace."
          icon={<FolderKanban size={18} />}
          className="2xl:col-span-6"
        >
          <div className="space-y-3">
            {featuredProjects.map((project) => (
              <WorkspaceListRow
                key={project.id}
                title={project.name}
                subtitle={`${project.team} · ${project.issueCount} issues · ${project.dueLabel}`}
                trailing={<ProjectStatusBadge status={project.status} />}
                href={`/projects/${project.id}`}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel
          title="Upcoming deadlines"
          icon={<CalendarDays size={18} />}
          className="2xl:col-span-6"
        >
          <div className="space-y-3">
            {deadlines.map((item) => (
              <WorkspaceListRow
                key={item.id}
                title={item.title}
                subtitle={item.projectId ? "Linked project milestone" : undefined}
                trailing={<span className="text-xs text-zinc-500">{item.dateLabel}</span>}
                href={item.projectId ? `/projects/${item.projectId}` : undefined}
              />
            ))}
          </div>
        </WorkspacePanel>
      </div>
    </>
  );
}
