import Link from "next/link";
import { ArrowRight, CheckCircle2, FolderKanban } from "lucide-react";
import { AccentBadge, ProjectStatusBadge } from "@/features/workspace/components/workspace-badges";
import { WorkspaceAvatarStack } from "@/features/workspace/components/workspace-avatar-stack";
import type { ProjectSummary } from "@/types/workspace";

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-zinc-950 p-3 text-white">
            <FolderKanban size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-zinc-900">{project.name}</h2>
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                {project.code}
              </span>
            </div>
            <p className="text-sm text-zinc-500">{project.team}</p>
          </div>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-600">{project.summary}</p>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-100">
          <div
            className="h-2 rounded-full bg-zinc-900"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <AccentBadge key={tag} label={tag} accent={project.accent} className="px-2.5 py-1" />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <span>{project.issueCount} issues</span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 size={14} />
            {project.completedCount} done
          </span>
        </div>
        <WorkspaceAvatarStack initials={project.memberInitials} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-200 pt-4 text-sm">
        <div>
          <p className="font-medium text-zinc-900">{project.lead}</p>
          <p className="text-zinc-500">{project.dueLabel}</p>
        </div>
        <span className="inline-flex items-center gap-1 font-medium text-zinc-900">
          Open project
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
