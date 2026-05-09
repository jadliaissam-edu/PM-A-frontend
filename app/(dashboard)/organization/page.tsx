"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WorkspacePage, WorkspaceHeader, Panel, GhostButton, PrimaryButton, Avatar, Chip } from "@/components/workspace-ui";
import { orgService, type Organization, type Workspace } from "@/services/org.service";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);

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
      <WorkspaceHeader title="Organizations" subtitle="Manage organizations and workspaces" actions={<><GhostButton>Import org</GhostButton><PrimaryButton>Create workspace</PrimaryButton></>} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          {loading && <div className="text-sm text-[#8f96a3]">Loading organizations...</div>}
          {!loading && orgs.map((org) => (
            <Panel key={org.id} title={org.name} icon={<Avatar initials={org.name.slice(0,2).toUpperCase()} />}>
              <div className="space-y-2">
                {byOrg(org.id).length === 0 && <div className="text-sm text-[#8f96a3]">No workspaces yet.</div>}
                {byOrg(org.id).map((ws) => (
                  <Link key={ws.id} href={`/workspace/${ws.id}`} className="flex h-10 items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a] hover:bg-white">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: ws.color || "var(--primary-color)", color: "white" }}>{(ws.name || "").slice(0,2).toUpperCase()}</span>
                      <div className="min-w-0">
                        <div className="truncate">{ws.name}</div>
                        <div className="text-xs font-semibold text-[#8f96a3]">{ws.visibility} · {ws.member_count || 0} members</div>
                      </div>
                    </div>
                    <Chip tone={ws.status ? "green" : "neutral"}>{ws.status || ws.visibility}</Chip>
                  </Link>
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
    </WorkspacePage>
  );
}
