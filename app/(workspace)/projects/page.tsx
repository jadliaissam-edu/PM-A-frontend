import Link from "next/link";
import { FolderKanban, Layers3, ListChecks, TimerReset } from "lucide-react";
import { ProjectCard } from "@/features/workspace/components/project-card";
import { WorkspaceMetricCard } from "@/features/workspace/components/workspace-metric-card";
import { WorkspacePageHeader } from "@/features/workspace/components/workspace-page-header";
import { WorkspacePanel } from "@/features/workspace/components/workspace-panel";
import { WorkspaceListRow } from "@/features/workspace/components/workspace-list-row";
import { ProjectStatusBadge } from "@/features/workspace/components/workspace-badges";
import { useEffect, useState } from "react";
import { projectService, type ProjectSummary } from "@/services/project.service";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService
      .getProjects()
      .then((data) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const activeProjects = projects.filter((project) => project.status !== "Completed");
  const totalIssues = projects.reduce((sum, p) => sum + (p.issueCount || 0), 0);
  return (
    <>
      <WorkspacePageHeader
        title="Projects"
        description="Browse the active delivery streams, monitor ownership, and drill into detailed project context."
        breadcrumbs={[
          { label: "Workspace", href: "/dashboard" },
          { label: "Projects" },
        ]}
        actions={
          <Link
            href="/dashboard"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
          >
            Back to dashboard
          </Link>
        }
      />

        <section className="mb-8 grid gap-4 xl:grid-cols-4">
        <WorkspaceMetricCard
          title="Active projects"
            value={loading ? "—" : activeProjects.length.toString()}
          subtitle="Delivery streams currently open"
        />
        <WorkspaceMetricCard
          title="Total issues"
            value={loading ? "—" : totalIssues.toString()}
          subtitle="Work items linked to current projects"
        />
        <WorkspaceMetricCard
          title="Average progress"
            value={
              loading
                ? "—"
                : `${Math.round(
                    projects.reduce((sum, project) => sum + (project.progress || 0), 0) / Math.max(projects.length, 1),
                  )}%`
            }
          subtitle="Progress across listed projects"
        />
        <WorkspaceMetricCard
          title="Teams involved"
            value={loading ? "—" : new Set(projects.map((project) => project.team)).size.toString()}
          subtitle="Cross-functional groups represented"
        />
      </section>

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <section className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project as any} />
          ))}
        </section>

        <div className="space-y-6">
          <WorkspacePanel
            title="Delivery focus"
            description="A compact summary of what needs attention across the portfolio."
            icon={<Layers3 size={18} />}
          >
            <div className="space-y-3">
              {projects.map((project) => (
                <WorkspaceListRow
                  key={project.id}
                  title={project.name}
                  subtitle={`${project.issueCount} issues · ${project.dueLabel}`}
                  trailing={<ProjectStatusBadge status={project.status} />}
                  href={`/projects/${project.id}`}
                />
              ))}
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Snapshot" icon={<FolderKanban size={18} />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">At risk</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900">
                  {projects.filter((project) => project.status === "At risk").length}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Planning</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900">
                  {projects.filter((project) => project.status === "Planning").length}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Open issues</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900">{issues.length}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Done issues</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900">
                  {issues.filter((issue) => issue.status === "Done").length}
                </p>
              </div>
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Next actions" icon={<ListChecks size={18} />}>
            <div className="space-y-3">
              <WorkspaceListRow
                title="Review high-priority issues"
                subtitle="Focus on critical work items before the next sprint handoff."
                href="/issues"
              />
              <WorkspaceListRow
                title="Open project details"
                subtitle="Inspect scope, progress, and recent activity per project."
                href={`/projects/${projects[0].id}`}
              />
              <WorkspaceListRow
                title="Prepare milestone three"
                subtitle="Reports, settings, and issue detail pages remain queued next."
                trailing={<TimerReset size={16} className="text-zinc-400" />}
              />
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </>
  );
}
