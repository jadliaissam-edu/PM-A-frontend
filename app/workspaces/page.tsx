"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspacePage, WorkspaceHeader, Panel, GhostButton, PrimaryButton, Avatar, Chip } from "@/components/workspace-ui";
import { orgService, type Organization, type Workspace } from "@/services/org.service";

export default function WorkspacesIndexPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [o, w] = await Promise.all([orgService.getOrganizations(), orgService.getWorkspaces()]);
        if (!mounted) return;
        setOrgs(o || []);
        setWorkspaces(w || []);
        // determine selected org from localStorage or first org
        try {
          const stored = typeof window !== 'undefined' ? localStorage.getItem('af:org') : null;
          const found = o && stored ? o.find((x: any) => x.name === stored) : null;
          setSelectedOrgId(found ? String(found.id) : (o && o[0] ? String(o[0].id) : null));
        } catch (e) {
          if (o && o[0]) setSelectedOrgId(String(o[0].id));
        }
      } catch (e) {
        console.error('Failed to load orgs/workspaces', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const byOrg = (orgId: string | null) => workspaces.filter((w) => String(w.organization) === String(orgId));

  const createWorkspace = async () => {
    if (!selectedOrgId) return alert('Select an organization');
    const name = newWsName.trim();
    if (!name) return alert('Enter workspace name');
    try {
      const payload: any = { name, organization: selectedOrgId, visibility: 'private' };
      const created = await orgService.createWorkspace(payload);
      setWorkspaces((cur) => [created, ...cur]);
      setCreating(false);
      setNewWsName("");
    } catch (e) {
      console.error('Failed to create workspace', e);
      alert('Failed to create workspace');
    }
  };

  return (
    <WorkspacePage>
      <WorkspaceHeader title="Workspaces" subtitle="Workspaces in your organizations" actions={<PrimaryButton onClick={() => setCreating(true)}>New workspace</PrimaryButton>} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          {loading && <div className="text-sm text-[#8f96a3]">Loading workspaces...</div>}
          {!loading && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-black text-[#8f96a3]">Organization</label>
                <select value={selectedOrgId || ""} onChange={(e) => setSelectedOrgId(e.target.value || null)} className="h-9 rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-sm font-black text-[#20242a]">
                  {orgs.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
                </select>
              </div>

              {selectedOrgId && byOrg(selectedOrgId).length === 0 && <div className="text-sm text-[#8f96a3]">No workspaces yet for this organization.</div>}

              {selectedOrgId && byOrg(selectedOrgId).map((ws) => (
                <div key={ws.id} className="flex h-12 w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a] hover:bg-white">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/workspaces/${ws.id}`)}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: ws.color || "var(--primary-color)", color: 'white' }}>{(ws.name || '').slice(0,2).toUpperCase()}</span>
                    <div className="min-w-0">
                      <div className="truncate">{ws.name}</div>
                      <div className="text-xs font-semibold text-[#8f96a3]">{ws.visibility} · {ws.member_count || 0} members</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip tone={ws.status ? 'green' : 'neutral'}>{ws.status || ws.visibility}</Chip>
                    <GhostButton onClick={() => router.push(`/workspaces/${ws.id}`)}>Open</GhostButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside>
          <Panel title="Create workspace">
            <p className="text-sm text-[#68707d]">Create a workspace under the selected organization.</p>
            <div className="mt-3 space-y-2">
              <input value={newWsName} onChange={(e) => setNewWsName(e.target.value)} placeholder="Workspace name" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] px-3" />
              <div className="flex justify-end gap-2">
                <button onClick={() => { setCreating(false); setNewWsName(''); }} className="h-9 rounded-[7px] border border-[#dfe3e8] px-3 text-sm font-black">Cancel</button>
                <button onClick={createWorkspace} className="h-9 rounded-[7px] bg-[var(--primary-color)] px-3 text-sm font-black text-white">Create</button>
              </div>
            </div>
          </Panel>
        </aside>
      </div>

    </WorkspacePage>
  );
}
