"use client";

import { useEffect, useState } from "react";
import { WorkspacePage, WorkspaceHeader, Panel, GhostButton, PrimaryButton, Avatar, Chip } from "@/components/workspace-ui";
import { orgService, type Organization, type Workspace } from "@/services/org.service";
import { useRouter } from "next/navigation";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [creating, setCreating] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDesc, setNewOrgDesc] = useState("");
  const router = useRouter();
  const [workspaceCreatingOrgId, setWorkspaceCreatingOrgId] = useState<string | null>(null);
  const [newWsName, setNewWsName] = useState("");
  const [newWsVisibility, setNewWsVisibility] = useState("private");
  const [inviteOrgId, setInviteOrgId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteWorkspaceId, setInviteWorkspaceId] = useState<string | null>(null);
  const [inviteRole, setInviteRole] = useState("Member");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [o, w] = await Promise.all([orgService.getOrganizations(), orgService.getWorkspaces()]);
        if (!mounted) return;
        setOrgs(o || []);
        setWorkspaces(w || []);
      } catch (e) {
        console.error("Failed to load orgs/workspaces", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const byOrg = (orgId: string) => workspaces.filter((w) => String(w.organization) === String(orgId));

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Organizations"
        subtitle="Manage organizations and workspaces"
        actions={
          <>
            <PrimaryButton onClick={() => setCreating(true)}>Create organization</PrimaryButton>
            
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          {loading && <div className="text-sm text-[#8f96a3]">Loading organizations...</div>}
          {!loading && orgs.map((org) => (
            <Panel key={org.id} title={org.name} icon={<Avatar initials={org.name.slice(0,2).toUpperCase()} />} action={<div className="flex gap-2"><button onClick={() => setWorkspaceCreatingOrgId(org.id)} className="h-8 rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-xs font-black text-[#68707d]">New workspace</button><button onClick={() => { setInviteOrgId(org.id); setInviteEmail(''); setInviteWorkspaceId(''); }} className="h-8 rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-xs font-black text-[#68707d]">Invite</button></div>}>
              <div className="space-y-2">
                {byOrg(org.id).length === 0 && <div className="text-sm text-[#8f96a3]">No workspaces yet.</div>}
                {byOrg(org.id).map((ws) => (
                  <div key={ws.id} className="flex h-10 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a] hover:bg-white">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedWorkspace(ws)}>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: ws.color || "var(--primary-color)", color: "white" }}>{(ws.name || "").slice(0,2).toUpperCase()}</span>
                      <div className="min-w-0">
                        <div className="truncate">{ws.name}</div>
                        <div className="text-xs font-semibold text-[#8f96a3]">{ws.visibility} · {ws.member_count || 0} members</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip tone={ws.status ? "green" : "neutral"}>{ws.status || ws.visibility}</Chip>
                      <button onClick={async (e) => {
                        e.stopPropagation();
                        if (!confirm(`Delete workspace "${ws.name}"? This cannot be undone.`)) return;
                        try {
                          await orgService.deleteWorkspaceById(ws.id);
                          setWorkspaces((cur) => cur.filter((x) => x.id !== ws.id));
                          if (selectedWorkspace?.id === ws.id) setSelectedWorkspace(null);
                        } catch (err) {
                          console.error('Failed to delete workspace', err);
                          alert('Failed to delete workspace');
                        }
                      }} className="h-7 w-7 rounded bg-red-50 text-red-600">🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </section>

        <aside>
          <Panel title="Create workspace">
            <p className="text-sm text-[#68707d]">Create a new workspace under an organization to start grouping projects.</p>
          </Panel>
        </aside>
      </div>

      {selectedWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#20242a]/35 backdrop-blur-sm" onMouseDown={() => setSelectedWorkspace(null)}>
          <aside onMouseDown={(e) => e.stopPropagation()} className="h-full w-full max-w-lg overflow-y-auto border-l border-[#dfe3e8] bg-white p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase text-[#8f96a3]">Workspace</p>
                <h2 className="mt-1 text-xl font-black text-[#20242a]">{selectedWorkspace.name}</h2>
              </div>
              <button onClick={() => setSelectedWorkspace(null)} className="h-8 w-8 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-black text-[#68707d]">Visibility: {selectedWorkspace.visibility}</div>
              <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-black text-[#68707d]">Members: {selectedWorkspace.member_count || 0}</div>
            </div>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-[#59606b]">{selectedWorkspace.description || "No description provided."}</p>
              <div className="flex gap-2">
                <button onClick={() => {
                  const id = selectedWorkspace?.id;
                  setSelectedWorkspace(null);
                  if (id) router.push(`/workspaces/${id}`);
                }} className="h-9 rounded-[7px] bg-[var(--primary-color)] px-4 text-sm font-black text-white">Open workspace</button>
                <button onClick={() => setSelectedWorkspace(null)} className="h-9 rounded-[7px] border border-[#dfe3e8] px-4 text-sm font-black">Close</button>
                <button onClick={async () => {
                  const id = selectedWorkspace?.id;
                  if (!id) return;
                  if (!confirm(`Delete workspace "${selectedWorkspace.name}"? This cannot be undone.`)) return;
                  try {
                    await orgService.deleteWorkspaceById(id);
                    setWorkspaces((cur) => cur.filter((w) => w.id !== id));
                    setSelectedWorkspace(null);
                  } catch (err) {
                    console.error('Failed to delete workspace', err);
                    alert('Failed to delete workspace');
                  }
                }} className="h-9 rounded-[7px] bg-red-50 px-4 text-sm font-black text-red-600">Delete</button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {workspaceCreatingOrgId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setWorkspaceCreatingOrgId(null)}>
          <section onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <h3 className="mb-3 text-base font-black">Create Workspace</h3>
            <input value={newWsName} onChange={(e) => setNewWsName(e.target.value)} placeholder="Workspace name" className="mb-2 h-10 w-full rounded-[8px] border border-[#dfe3e8] px-3" />
            <select value={newWsVisibility} onChange={(e) => setNewWsVisibility(e.target.value)} className="mb-3 h-10 w-full rounded-[8px] border border-[#dfe3e8] px-3">
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setWorkspaceCreatingOrgId(null)} className="h-8 rounded-[7px] border border-[#dfe3e8] px-3 text-xs">Cancel</button>
              <button onClick={async () => {
                const name = newWsName.trim();
                if (!name || !workspaceCreatingOrgId) return;
                try {
                  const payload = { name, visibility: newWsVisibility, organization: workspaceCreatingOrgId } as any;
                  const created = await orgService.createWorkspace(payload);
                  setWorkspaces((cur) => [created, ...cur]);
                  setNewWsName(""); setNewWsVisibility("private"); setWorkspaceCreatingOrgId(null);
                } catch (e) {
                  console.error('Failed to create workspace', e);
                }
              }} className="h-8 rounded-[7px] bg-[var(--primary-color)] px-3.5 text-xs font-black text-white">Create</button>
            </div>
          </section>
        </div>
      )}
      {inviteOrgId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setInviteOrgId(null)}>
          <section onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <h3 className="mb-3 text-base font-black">Invite Member</h3>
            <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Email address" className="mb-2 h-10 w-full rounded-[8px] border border-[#dfe3e8] px-3" />
            <select value={inviteWorkspaceId || ""} onChange={(e) => setInviteWorkspaceId(e.target.value || null)} className="mb-2 h-10 w-full rounded-[8px] border border-[#dfe3e8] px-3">
              <option value="" disabled>Select workspace (required)</option>
              {byOrg(inviteOrgId).map((ws) => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="mb-3 h-10 w-full rounded-[8px] border border-[#dfe3e8] px-3">
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setInviteOrgId(null)} className="h-8 rounded-[7px] border border-[#dfe3e8] px-3 text-xs">Cancel</button>
              <button onClick={async () => {
                const email = inviteEmail.trim();
                if (!email) return alert('Enter an email');
                // determine workspace to attach the invite to
                const fallbackWorkspace = byOrg(inviteOrgId || "")[0]?.id;
                const workspaceToUse = inviteWorkspaceId || fallbackWorkspace;
                if (!workspaceToUse) return alert('Please create a workspace in this organization before inviting members.');
                try {
                  const payload: any = { email, role: inviteRole, workspace: workspaceToUse };
                  // Backend requires invite_link and expires_at
                  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
                  const origin = typeof window !== 'undefined' ? window.location.origin : '';
                  const inviteLink = `${origin}/accept-invite?org=${encodeURIComponent(inviteOrgId || '')}&workspace=${encodeURIComponent(workspaceToUse)}&email=${encodeURIComponent(email)}`;
                  payload.expires_at = expiresAt;
                  payload.invite_link = inviteLink;

                  await orgService.createInvitation(payload);
                  setInviteOrgId(null);
                  alert('Invitation created');
                } catch (err) {
                  console.error('Failed to create invitation', err);
                  alert('Failed to create invitation');
                }
              }} className="h-8 rounded-[7px] bg-[var(--primary-color)] px-3.5 text-xs font-black text-white">Send invite</button>
            </div>
          </section>
        </div>
      )}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setCreating(false)}>
          <section onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <h3 className="mb-3 text-base font-black">Create Organization</h3>
            <input value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} placeholder="Organization name" className="mb-2 h-10 w-full rounded-[8px] border border-[#dfe3e8] px-3" />
            <input value={newOrgDesc} onChange={(e) => setNewOrgDesc(e.target.value)} placeholder="Description (optional)" className="mb-3 h-10 w-full rounded-[8px] border border-[#dfe3e8] px-3" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setCreating(false)} className="h-8 rounded-[7px] border border-[#dfe3e8] px-3 text-xs">Cancel</button>
              <button onClick={async () => {
                const name = newOrgName.trim();
                if (!name) { return; }
                try {
                  setCreating(false);
                  const payload = { name, description: newOrgDesc };
                  const created = await orgService.createOrganization(payload);
                  setOrgs((current) => [created, ...current]);
                  setNewOrgName(''); setNewOrgDesc('');
                } catch (e) {
                  console.error('Failed to create org', e);
                }
              }} className="h-8 rounded-[7px] bg-[var(--primary-color)] px-3.5 text-xs font-black text-white">Create</button>
            </div>
          </section>
        </div>
      )}
      
    </WorkspacePage>
  );
}
