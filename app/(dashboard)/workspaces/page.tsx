"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { orgService, type Workspace } from "@/services/org.service";
import { WorkspacePage, WorkspaceHeader, Panel, GhostButton, PrimaryButton, Avatar, Chip } from "@/components/workspace-ui";
import { Plus, Search, Filter, Globe, Lock, MoreHorizontal } from "lucide-react";

export default function WorkspacesListPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [orgMap, setOrgMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await orgService.getWorkspaces();
        setWorkspaces(data);
        // also fetch organizations to show org name for each workspace
        try {
          const orgs = await orgService.getOrganizations();
          const map: Record<string, string> = {};
          orgs.forEach((o) => { map[o.id] = o.name; });
          setOrgMap(map);
        } catch (err) {
          console.warn('Failed to load organizations', err);
        }
      } catch (err) {
        console.error("Failed to load workspaces", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  const filteredWorkspaces = workspaces.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    (w.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Workspaces"
        subtitle="Manage your team's collaborative environments"
        actions={(
          <PrimaryButton onClick={() => router.push('/workspaces/new')}>
            <Plus size={16} className="mr-2" />
            Create Workspace
          </PrimaryButton>
        )}
      />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f96a3]" size={18} />
          <input 
            type="text" 
            placeholder="Search workspaces..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[12px] border border-[#edf0f3] bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-[#20242a] outline-none transition-all focus:border-[#7b68ee] focus:ring-4 focus:ring-[#7b68ee]/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <GhostButton>
            <Filter size={16} className="mr-2" />
            Recently Updated
          </GhostButton>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[200px] rounded-[20px] bg-white border border-[#edf0f3] animate-pulse" />
          ))}
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#edf0f3] bg-white/50 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f8fb] text-2xl">🏗️</div>
          <h3 className="text-lg font-black text-[#20242a]">No workspaces found</h3>
          <p className="mt-2 max-w-xs text-sm font-semibold text-[#8f96a3]">Create your first workspace to start collaborating on projects with your team.</p>
          <PrimaryButton className="mt-6" onClick={() => router.push('/workspaces/new')}>
            Get Started
          </PrimaryButton>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkspaces.map((w) => (
            <div 
              key={w.id} 
              onClick={() => router.push(`/workspaces/${w.id}`)}
              className="group cursor-pointer rounded-[24px] border border-[#edf0f3] bg-white p-6 transition-all hover:border-[#7b68ee] hover:shadow-2xl hover:shadow-[#7b68ee]/5"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="h-12 w-12 rounded-[16px] bg-gradient-to-br from-[#7b68ee] to-[#9d8df1] p-0.5 shadow-lg shadow-[#7b68ee]/20 group-hover:scale-110 transition-transform">
                  <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
                    <span className="text-lg font-black text-[#7b68ee]">{w.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                </div>
                <button className="rounded-lg p-2 text-[#8f96a3] hover:bg-[#f7f8fb] hover:text-[#20242a]">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="mb-4 min-w-0">
                <h4 className="truncate text-[11px] font-black text-[#8f96a3] tracking-tight mb-1">{orgMap[w.organization] ? `${orgMap[w.organization]} /` : ''}</h4>
                <h3 className="truncate text-lg font-black text-[#20242a] tracking-tight">{w.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm font-semibold text-[#68707d] leading-relaxed">
                  {w.description || "No description provided for this workspace."}
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-[#f7f8fb] pt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-[#8f96a3] opacity-60">Visibility</span>
                  <div className="mt-1 flex items-center gap-1 text-xs font-black text-[#20242a]">
                    {w.visibility === 'public' ? <Globe size={12} className="text-green-500" /> : <Lock size={12} className="text-[#8f96a3]" />}
                    {w.visibility || 'Private'}
                  </div>
                </div>
                <div className="h-8 w-px bg-[#f7f8fb]" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-[#8f96a3] opacity-60">Members</span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-5 w-5 rounded-full border-2 border-white bg-[#edf0f3]" />
                      ))}
                    </div>
                    <span className="text-xs font-black text-[#20242a]">{w.member_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </WorkspacePage>
  );
}
