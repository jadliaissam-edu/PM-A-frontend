"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, CheckCircle2, Gauge, Users } from "lucide-react";
import TicketCreateSlideOver from "@/components/ticket/TicketCreateSlideOver";
import { Avatar, Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import { projectService, type ProjectSummary } from "@/services/project.service";
import { api } from "@/lib/api";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = String(params.id || "commerce");
  const [dialog, setDialog] = useState<"settings" | "sprint" | null>(null);
  const [showTicketCreate, setShowTicketCreate] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [newMemberUserId, setNewMemberUserId] = useState<string>("");
  const [newMemberRole, setNewMemberRole] = useState<string>("observateur");
  const [userSearch, setUserSearch] = useState<string>("");
  const [userResults, setUserResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [memberActionLoading, setMemberActionLoading] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [projectData, activityData] = await Promise.all([
          projectService.getProjectById(projectId),
          projectService.getProjectActivity(projectId)
        ]);
        if (!mounted) return;
        setProject(projectData);
        setActivity(activityData);
      } catch (e) {
        console.error("Failed to load project dashboard", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [projectId]);

  // Fetch project members when opening settings dialog
  const fetchMembers = async () => {
    setMembersLoading(true);
    try {
      const list = await projectService.listMembers(projectId as any);
      setMembers(list.members || list || []);
    } catch (e) {
      console.error('Failed to load members', e);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    if (dialog === 'settings') fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  // debounce user search
  useEffect(() => {
    let mounted = true;
    const t = setTimeout(async () => {
      if (!userSearch || userSearch.length < 2) { setUserResults([]); return; }
      try {
        const resp = await api.get('/users/', { params: { search: userSearch } });
        if (!mounted) return;
        setUserResults(resp.data || []);
      } catch (e) {
        console.error('User search failed', e);
        setUserResults([]);
      }
    }, 300);
    return () => { mounted = false; clearTimeout(t); };
  }, [userSearch]);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h`;
    if (diffHrs < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

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
          <GhostButton onClick={() => setShowTicketCreate(true)}>New ticket</GhostButton>
          <GhostButton onClick={async () => {
            if (!confirm('Archive this project?')) return;
            try {
              setLoading(true);
              const updated = await projectService.archiveProject(projectId);
              setProject(updated);
              alert('Project archived.');
            } catch (err) {
              console.error('Failed to archive project', err);
              alert('Failed to archive project');
            } finally {
              setLoading(false);
            }
          }}>Archive</GhostButton>
          <GhostButton onClick={async () => {
            if (!confirm('Close this project?')) return;
            try {
              setLoading(true);
              const updated = await projectService.closeProject(projectId);
              setProject(updated);
              alert('Project closed.');
            } catch (err) {
              console.error('Failed to close project', err);
              alert('Failed to close project');
            } finally {
              setLoading(false);
            }
          }}>Close</GhostButton>
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
            {activity && activity.length > 0 ? activity.slice(0, 10).map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                <Avatar initials={item.actor_username ? item.actor_username.slice(0, 2).toUpperCase() : "???"} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#20242a]">{item.description}</p>
                  <p className="text-xs font-semibold text-[#8f96a3]">{formatTime(item.created_at)}</p>
                </div>
              </div>
            )) : (
              <div className="p-4 text-center text-xs font-semibold text-[#8f96a3]">
                No recent activity found for this project.
              </div>
            )}
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
            <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-2xl rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-black text-[#20242a]">Project settings — Members</h2>
                <button onClick={() => setDialog(null)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-black text-[#8f96a3]">Project members</p>
                  <div className="space-y-2">
                    <div className="rounded-[8px] border border-[#edf0f3] bg-[#fbfbfd] p-3">
                      <div className="mb-2 flex items-center justify-between text-sm font-black text-[#68707d]"><span>Member</span><span>Role</span></div>
                      {membersLoading ? (
                        <div className="text-sm text-[#8f96a3]">Loading members…</div>
                      ) : members.length === 0 ? (
                        <div className="text-sm text-[#8f96a3]">No members found.</div>
                      ) : (
                        members.map((m) => (
                          <div key={m.id} className="mb-2 flex items-center justify-between rounded-[6px] border border-[#eef0f4] bg-white p-2">
                            <div className="min-w-0">
                              <div className="text-sm font-black text-[#20242a]">{m.full_name || m.username}</div>
                              <div className="text-xs text-[#8f96a3]">{m.email}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select value={m.role} onChange={async (e) => {
                                const role = e.target.value;
                                setMemberActionLoading(true);
                                try {
                                  await projectService.updateRole(projectId, m.id, { role });
                                  setMembers((cur) => cur.map((it) => it.id === m.id ? { ...it, role } : it));
                                } catch (err) {
                                  console.error('Failed to update member role', err);
                                  alert('Failed to update role');
                                } finally { setMemberActionLoading(false); }
                              }} className="h-8 rounded-[6px] border border-[#dfe3e8] bg-[#f7f8fb] px-2 text-sm font-black text-[#20242a] outline-none">
                                <option value="admin">Admin</option>
                                <option value="chef_de_projet">Chef de projet</option>
                                <option value="developpeur">Développeur</option>
                                <option value="observateur">Observateur</option>
                              </select>
                              <button onClick={async () => {
                                if (!confirm(`Remove ${m.username || m.full_name} from project?`)) return;
                                setMemberActionLoading(true);
                                try {
                                  await projectService.deleteRole(projectId, m.id);
                                  setMembers((cur) => cur.filter((it) => it.id !== m.id));
                                } catch (err) {
                                  console.error('Failed to remove member', err);
                                  alert('Failed to remove member');
                                } finally { setMemberActionLoading(false); }
                              }} className="h-8 rounded-[6px] bg-[#ffefef] px-2 text-sm font-black text-[#e5484d]">Remove</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-black text-[#8f96a3]">Add member</p>
                  <div className="rounded-[8px] border border-[#edf0f3] bg-[#fbfbfd] p-3">
                    <label className="block text-xs font-black text-[#8f96a3]">Find user</label>
                    <input value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setSelectedUser(null); }} placeholder="Search by name or email" className="mb-2 mt-1 h-10 w-full rounded-[6px] border border-[#dfe3e8] bg-white px-2 text-sm outline-none" />
                    {userResults.length > 0 && (
                      <div className="mb-2 max-h-40 overflow-auto rounded-[6px] border border-[#eef0f3] bg-white">
                        {userResults.map((u) => (
                          <button key={u.id} onClick={() => { setSelectedUser(u); setNewMemberUserId(String(u.id)); setUserResults([]); setUserSearch(u.username || u.email || u.id); }} className="w-full text-left px-3 py-2 hover:bg-[#f7f8fb]">
                            <div className="text-sm font-black text-[#20242a]">{u.first_name || u.username} {u.last_name ? u.last_name : ""}</div>
                            <div className="text-xs text-[#8f96a3]">{u.email}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="mb-2 text-xs text-[#8f96a3]">Selected: {selectedUser ? `${selectedUser.username || selectedUser.email}` : 'None'}</div>
                    <label className="block text-xs font-black text-[#8f96a3]">Role</label>
                    <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} className="mb-3 mt-1 h-10 w-full rounded-[6px] border border-[#dfe3e8] bg-white px-2 text-sm outline-none">
                      <option value="admin">Admin</option>
                      <option value="chef_de_projet">Chef de projet</option>
                      <option value="developpeur">Développeur</option>
                      <option value="observateur">Observateur</option>
                    </select>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setNewMemberUserId(""); setNewMemberRole("observateur"); }} className="h-8 rounded-[6px] border border-[#dfe3e8] px-3 text-sm font-black text-[#68707d]">Clear</button>
                      <button onClick={async () => {
                        const uid = newMemberUserId || selectedUser?.id;
                        if (!uid) { alert('Select a user'); return; }
                        setMemberActionLoading(true);
                        try {
                          const payload = { user: Number(uid), role: newMemberRole };
                          await projectService.addMember(projectId, payload);
                          await fetchMembers();
                          setNewMemberUserId("");
                          setNewMemberRole("observateur");
                          setUserSearch("");
                          setSelectedUser(null);
                        } catch (err) {
                          console.error('Failed to add member', err);
                          alert('Failed to add member (ensure user exists and you have permission)');
                        } finally { setMemberActionLoading(false); }
                      }} className="h-8 rounded-[6px] bg-[#7b68ee] px-3 text-sm font-black text-white">Add</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
      )}
      {showTicketCreate && (
        <TicketCreateSlideOver
          open={showTicketCreate}
          onClose={() => setShowTicketCreate(false)}
          projectId={projectId}
          onCreated={(t) => {
            // refresh project data after ticket creation
            setProject((p) => p ? { ...p, issueCount: (p.issueCount || 0) + 1 } : p);
          }}
        />
      )}
    </WorkspacePage>
  );
}
