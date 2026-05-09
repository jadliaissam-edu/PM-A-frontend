"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, CheckCircle2, Gauge, Users } from "lucide-react";
import { Avatar, Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import { projectService, type ProjectSummary } from "@/services/project.service";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = String(params.id || "commerce");
  const [dialog, setDialog] = useState<"settings" | "sprint" | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await projectService.getProjectById(projectId);
        if (!mounted) return;
        setProject(data);
      } catch (e) {
        console.error("Failed to load project", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [projectId]);

  const router = useRouter();

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title={project?.name || "Project"}
        subtitle={`Product / Projects / ${projectId}`}
        badge={project?.status || "Stable"}
        actions={<>
          <GhostButton onClick={() => router.push(`/Board/kanban?projectId=${projectId}`)}>View board</GhostButton>
          <GhostButton onClick={() => setDialog("settings")}>Project settings</GhostButton>
          <PrimaryButton onClick={() => setDialog("sprint")}>Launch sprint</PrimaryButton>
        </>}
      />

      <section className="mb-4 grid gap-3 xl:grid-cols-4">
        {[
          { title: "Progress", value: project?.progress != null ? `${project.progress}%` : "—", meta: "+12% this month", tone: "purple" as const },
          { title: "Open tasks", value: project?.issueCount != null ? String(project.issueCount) : "—", meta: project?.issueCount ? `${project.issueCount} total` : "", tone: "blue" as const },
          { title: "Time left", value: project?.dueLabel || "—", meta: project?.dueLabel ? `deadline ${project.dueLabel}` : "", tone: "yellow" as const },
          { title: "Velocity", value: project && (project as any).velocity != null ? String((project as any).velocity) : "—", meta: "pts / sprint", tone: "green" as const },
        ].map((item) => (
          <div key={item.title} className="rounded-[10px] border border-[#dfe3e8] bg-white p-3.5 shadow-sm">
            <div className="mb-3 flex items-center justify-between"><p className="text-[11px] font-black uppercase text-[#8f96a3]">{item.title}</p><Chip tone={item.tone}>{item.meta}</Chip></div>
            <p className="text-3xl font-black text-[#20242a]">{item.value}</p>
            <div className="mt-3 h-1.5 rounded-full bg-[#e4e7ec]"><div className="h-full w-[68%] rounded-full bg-[var(--primary-color)]" style={{ width: project?.progress ? `${project.progress}%` : "0%" }} /></div>
          </div>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Panel title="Recent activity" icon={<Activity size={16} />}>
          <div className="space-y-2">
            {project && (project as any).recent_activity ? (project as any).recent_activity.map((item: any) => (
              <div key={item.text} className="flex items-center gap-3 rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                <Avatar initials={item.user || (item.user_initials || "") } />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#20242a]">{item.text}</p>
                  <p className="text-xs font-semibold text-[#8f96a3]">{item.time}</p>
                </div>
              </div>
            )) : [
              { user: "HT", text: "pushed 3 commits to feature/auth", time: "2h" },
              { user: "AP", text: "commented on ticket PM-12", time: "5h" },
              { user: "SN", text: "moved PM-88 into Done", time: "Yesterday" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                <Avatar initials={item.user} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#20242a]">{item.text}</p>
                  <p className="text-xs font-semibold text-[#8f96a3]">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <aside className="space-y-4">
          <Panel title="Project health" icon={<Gauge size={16} />}>
            <div className="rounded-[9px] bg-[#24113f] p-4 text-white">
              <p className="text-[10px] font-black uppercase text-white/55">Risk factor</p>
              <p className="mt-2 text-2xl font-black">Low</p>
              <p className="mt-3 text-xs font-semibold leading-5 text-white/60">The project is ahead of plan. No critical dependency is currently blocked.</p>
            </div>
          </Panel>
          <Panel title="Active members" icon={<Users size={16} />}>
              <div className="flex -space-x-2">
              {project?.memberInitials && project.memberInitials.length > 0 ? project.memberInitials.slice(0,4).map((member) => <Avatar key={member} initials={member} />) : ["HT","AP","SN","JD"].map((member) => <Avatar key={member} initials={member} />)}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#20242a] text-[10px] font-black text-white ring-2 ring-white">+{project && (project as any).member_count ? (project as any).member_count - (project.memberInitials ? project.memberInitials.length : 4) : 12}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-black text-[#68707d]"><span>Capacity</span><span>85%</span></div>
            <div className="mt-1 h-1.5 rounded-full bg-[#e4e7ec]"><div className="h-full w-[85%] rounded-full bg-[var(--primary-color)]" style={{ width: project?.progress ? `${project.progress}%` : '0%' }} /></div>
          </Panel>
          <Panel title="Next actions" icon={<CheckCircle2 size={16} />}>
            <div className="space-y-2">
              {["Review Stripe integration", "Close QA checklist", "Prepare launch notes"].map((item) => (
                <button key={item} onClick={() => setDone((current) => {
                  const next = new Set(current);
                  if (next.has(item)) next.delete(item);
                  else next.add(item);
                  return next;
                })} className={`flex w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 py-2 text-left text-sm font-black text-[#20242a] hover:bg-white ${done.has(item) ? "text-[#8f96a3] line-through" : ""}`}>
                  {item}
                  {done.has(item) && <CheckCircle2 size={14} className="text-[#7b68ee]" />}
                </button>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setDialog(null)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">{dialog === "settings" ? "Project settings" : "Launch sprint"}</h2>
              <button onClick={() => setDialog(null)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            <p className="text-sm font-semibold text-[#68707d]">{dialog === "settings" ? "Settings are local-only in this frontend pass." : "Sprint launch is staged locally until backend workflow support exists."}</p>
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
