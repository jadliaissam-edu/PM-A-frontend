"use client";

import { useEffect, useState } from "react";
import { CirclePlus, GitBranch, Rocket, Search, ShieldCheck } from "lucide-react";
import { Avatar, Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import { orgService } from "@/services/org.service";
import { useSearchParams } from "next/navigation";
import { projectService } from "@/services/project.service";

interface Release {
  id?: string;
  version: string;
  status: string;
  date: string;
  owner: string;
  notes: string;
  items: string[];
}

export default function ReleaseManagementPage() {
  const searchParams = useSearchParams();
  const projectIdQuery = searchParams?.get("projectId") || null;

  const [items, setItems] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Release | null>(null);
  const [dialog, setDialog] = useState<"changelog" | "release" | null>(null);
  const [newVersion, setNewVersion] = useState("");
  const [readiness, setReadiness] = useState({ Stability: true, "Test coverage": true, "Rollback plan": false });
  const visible = (filter === "All" ? items : items.filter((release) => release.status === filter)).filter((release) => `${release.version} ${release.notes} ${release.items.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  const createRelease = () => {
    const version = newVersion.trim();
    if (!version) return;
    (async () => {
      if (!projectIdQuery) {
        // Local draft fallback
        const release: Release = { version, status: "Draft", date: "Today", owner: "AA", notes: "Local draft release prepared from the frontend.", items: ["Draft", "Planning"] };
        setItems((current) => [release, ...current]);
        setSelected(release);
        setNewVersion("");
        setDialog(null);
        return;
      }

      try {
        setLoading(true);
        const payload = { version, notes: "Created from frontend", items: ["Draft"] };
        const created = await projectService.createRelease(projectIdQuery, payload);
        const mapped: Release = {
          id: created.id || String(created.pk || created.uuid || created.tag || created.version || ""),
          version: created.version || created.tag || created.name || String(created.id || ""),
          status: created.status || "Draft",
          date: created.date || created.published_at || created.created_at || "Today",
          owner: created.owner || created.lead || (created.author && created.author.initials) || "",
          notes: created.notes || created.summary || created.description || "",
          items: created.items || created.features || [],
        };
        setItems((current) => [mapped, ...current]);
        setSelected(mapped);
        setNewVersion("");
        setDialog(null);
      } catch (e) {
        console.error("Failed to create project release", e);
        setDialog(null);
      } finally {
        setLoading(false);
      }
    })();
  };

  useEffect(() => {
    // If viewing a project context, load releases from the project API
    if (!projectIdQuery) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await projectService.listReleases(projectIdQuery);
        if (!mounted) return;
        // Map server releases to local shape conservatively
        const mapped = (data || []).map((r: any) => ({
          version: r.version || r.tag || r.name || String(r.id || ""),
          status: r.status || r.state || "Draft",
          date: r.date || r.published_at || r.created_at || "Unknown",
          owner: r.owner || r.lead || (r.author && r.author.initials) || "",
          notes: r.notes || r.summary || r.description || "",
          items: r.items || r.features || [],
          id: r.id || r.uuid || r.pk || undefined,
        }));
        setItems(mapped);
      } catch (e) {
        console.error("Failed to load project releases", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [projectIdQuery]);

  async function openReleaseDetails(release: Release) {
    if (!projectIdQuery || !release?.id) {
      setSelected(release);
      return;
    }
    try {
      setLoading(true);
      const data = await projectService.getRelease(projectIdQuery, String(release.id));
      const mapped: Release = {
        id: data.id || String(data.pk || data.uuid || release.id),
        version: data.version || data.tag || data.name || String(data.id || ""),
        status: data.status || "Draft",
        date: data.date || data.published_at || data.created_at || "Unknown",
        owner: data.owner || data.lead || (data.author && data.author.initials) || "",
        notes: data.notes || data.summary || data.description || "",
        items: data.items || data.features || [],
      };
      setSelected(mapped);
    } catch (e) {
      console.error("Failed to load release detail", e);
      setSelected(release);
    } finally {
      setLoading(false);
    }
  }

  const closeSelectedRelease = async () => {
    if (!projectIdQuery || !selected?.id) return;
    try {
      setLoading(true);
      await projectService.closeRelease(projectIdQuery, String(selected.id));
      // Refresh list
      const data = await projectService.listReleases(projectIdQuery);
      const mapped = (data || []).map((r: any) => ({
        version: r.version || r.tag || r.name || String(r.id || ""),
        status: r.status || r.state || "Draft",
        date: r.date || r.published_at || r.created_at || "Unknown",
        owner: r.owner || r.lead || (r.author && r.author.initials) || "",
        notes: r.notes || r.summary || r.description || "",
        items: r.items || r.features || [],
        id: r.id || r.uuid || r.pk || undefined,
      }));
      setItems(mapped);
      setSelected(null);
    } catch (e) {
      console.error("Failed to close release", e);
    } finally {
      setLoading(false);
    }
  };

  const markSelectedReleased = async () => {
    if (!projectIdQuery || !selected?.id) return;
    try {
      setLoading(true);
      await projectService.updateRelease(projectIdQuery, String(selected.id), { status: "Released" });
      setNotice("Release marked as Released.");
      // refresh
      const data = await projectService.listReleases(projectIdQuery);
      const mapped = (data || []).map((r: any) => ({
        version: r.version || r.tag || r.name || String(r.id || ""),
        status: r.status || r.state || "Draft",
        date: r.date || r.published_at || r.created_at || "Unknown",
        owner: r.owner || r.lead || (r.author && r.author.initials) || "",
        notes: r.notes || r.summary || r.description || "",
        items: r.items || r.features || [],
        id: r.id || r.uuid || r.pk || undefined,
      }));
      setItems(mapped);
    } catch (e) {
      console.error("Failed to mark release released", e);
      setNotice("Failed to update release.");
    } finally {
      setLoading(false);
    }
  };

  const showReleaseDashboard = async () => {
    if (!projectIdQuery || !selected?.id) return;
    try {
      setLoading(true);
      const data = await projectService.getReleaseDashboard(projectIdQuery, String(selected.id));
      console.log("Release dashboard:", data);
      setNotice("Loaded release dashboard (see console).");
    } catch (e) {
      console.error("Failed to load release dashboard", e);
      setNotice("Failed to load release dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const showReleaseIssues = async () => {
    if (!projectIdQuery || !selected?.id) return;
    try {
      setLoading(true);
      const data = await projectService.getReleaseIssuesSummary(projectIdQuery, String(selected.id));
      console.log("Release issues summary:", data);
      setNotice("Loaded release issues summary (see console).");
    } catch (e) {
      console.error("Failed to load issues summary", e);
      setNotice("Failed to load issues summary.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgReleases = async () => {
    try {
      setLoading(true);
      const data = await orgService.listOrgReleases();
      console.log("Org releases:", data);
      setNotice("Loaded org releases (see console).");
    } catch (e) {
      console.error("Failed to load org releases", e);
      setNotice("Failed to load org releases.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Releases"
        subtitle="Product / release train / deployment readiness"
        badge=""
        actions={
          <>
            <GhostButton onClick={() => setDialog("changelog")}>Changelog</GhostButton>
            <GhostButton onClick={fetchOrgReleases}>Org releases</GhostButton>
            <PrimaryButton onClick={() => setDialog("release")}><span className="inline-flex items-center gap-1"><CirclePlus size={14} /> Release</span></PrimaryButton>
          </>
        }
      />

      {notice && (
        <div className="border-b border-[#d7f4e8] bg-[#ecfff6] px-5 py-2 text-xs font-black text-[#008f65]">
          <button onClick={() => setNotice("")} className="w-full text-left">{notice}</button>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Panel title="Release train" icon={<Rocket size={16} />}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="flex h-8 w-full min-w-0 items-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2.5 sm:w-auto sm:min-w-[240px]">
              <Search size={14} className="text-[#8f96a3]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search releases..." className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold outline-none placeholder:text-[#8f96a3]" />
            </div>
            {["All", "Released", "Draft", "Archived"].map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${filter === item ? "border border-[#dfe3e8] bg-[#f7f8fb] text-[#20242a]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>{item}</button>
            ))}
          </div>
          <div className="space-y-2">
            {visible.map((release) => (
              <article key={release.id || release.version} className={`rounded-[9px] border bg-white p-3 shadow-sm hover:bg-[#f7f8fb] ${selected?.version === release.version ? "border-[#d7d1ff] bg-[#f3efff]" : "border-[#dfe3e8]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-black text-[#20242a]">{release.version}</h2>
                      <Chip tone={release.status === "Released" ? "green" : release.status === "Draft" ? "blue" : "neutral"}>{release.status}</Chip>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-[#68707d]">{release.notes}</p>
                  </div>
                  <span className="text-[10px] font-black text-[#8f96a3]">{release.date}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {release.items.map((item) => <Chip key={item}>{item}</Chip>)}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#edf0f3] pt-3">
                  <div className="flex items-center gap-2"><Avatar initials={release.owner} /><span className="text-xs font-black text-[#68707d]">Owner {release.owner}</span></div>
                  <button onClick={() => openReleaseDetails(release)} className="text-xs font-black text-[#7b68ee]">Open details</button>
                </div>
              </article>
            ))}
            {visible.length === 0 && <div className="rounded-[9px] border border-dashed border-[#dfe3e8] p-6 text-center text-sm font-bold text-[#8f96a3]">No releases match.</div>}
          </div>
        </Panel>

        <aside className="space-y-4">
          <Panel title="Next deployment" icon={<GitBranch size={16} />}>
            <div className="rounded-[9px] bg-[#24113f] p-4 text-white">
              <p className="text-[10px] font-black uppercase text-white/55">Scheduled</p>
              <p className="mt-2 text-2xl font-black">May 24</p>
              <p className="mt-3 text-xs font-semibold leading-5 text-white/60">v2.2.0 ships member management, report exports, and workspace fidelity updates.</p>
            </div>
          </Panel>
        </aside>
      </div>
      {(selected || dialog) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => { setSelected(null); setDialog(null); }}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">{selected?.version || (dialog === "changelog" ? "Changelog" : "Create release")}</h2>
              <div className="flex items-center gap-2">
                <button onClick={async () => {
                  // quick API verification: prefer project endpoints when available
                  try {
                    setNotice("Verifying APIs...");
                    if (projectIdQuery) {
                      const list = await projectService.listReleases(projectIdQuery);
                      console.log("project listReleases:", list);
                      if (selected?.id) {
                        const detail = await projectService.getRelease(projectIdQuery, String(selected.id));
                        console.log("project getRelease:", detail);
                        const dash = await projectService.getReleaseDashboard(projectIdQuery, String(selected.id));
                        console.log("project getReleaseDashboard:", dash);
                        const issues = await projectService.getReleaseIssuesSummary(projectIdQuery, String(selected.id));
                        console.log("project getReleaseIssuesSummary:", issues);
                      }
                      setNotice(`Project API reachable — ${Array.isArray(list) ? list.length : "ok"} releases`);
                    } else {
                      const orgList = await orgService.listOrgReleases();
                      console.log("org listReleases:", orgList);
                      setNotice(`Org API reachable — ${Array.isArray(orgList) ? orgList.length : "ok"} releases`);
                    }
                  } catch (err) {
                    console.error("API verification failed", err);
                    setNotice("API verification failed — see console");
                  }
                }} className="h-7 rounded-[7px] border border-[#dfe3e8] bg-white px-2 text-xs font-black text-[#68707d]">Verify API</button>
                <button onClick={() => { setSelected(null); setDialog(null); }} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
              </div>
            </div>
            {selected && <div className="space-y-3">
                <p className="text-sm font-semibold leading-6 text-[#68707d]">{selected.notes}</p>
                <div className="flex flex-wrap gap-1.5">{selected.items.map((item) => <Chip key={item}>{item}</Chip>)}</div>
                <div className="flex gap-2">
                  <button onClick={() => openReleaseDetails(selected)} className="h-9 rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#68707d] hover:bg-white">Refresh</button>
                  {selected.status !== "Released" && <button onClick={markSelectedReleased} className="h-9 rounded-[8px] bg-[#00b884] px-3 text-sm font-black text-white">Mark Released</button>}
                  <button onClick={closeSelectedRelease} className="h-9 rounded-[8px] border border-[#edf0f3] px-3 text-sm font-black text-[#e5484d] hover:bg-white">Close</button>
                  <button onClick={showReleaseDashboard} className="h-9 rounded-[8px] border border-[#edf0f3] px-3 text-sm font-black text-[#68707d] hover:bg-white">Dashboard</button>
                  <button onClick={showReleaseIssues} className="h-9 rounded-[8px] border border-[#edf0f3] px-3 text-sm font-black text-[#68707d] hover:bg-white">Issues summary</button>
                  <button onClick={() => { setFilter(selected.status); setSelected(null); setDialog(null); }} className="ml-auto h-9 w-auto rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#68707d] hover:bg-white">Filter by {selected.status}</button>
                </div>
              </div>}
            {dialog === "changelog" && !selected && <div className="space-y-2">{items.slice(0, 3).map((release) => <button key={release.version} onClick={() => setSelected(release)} className="w-full rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-left hover:bg-white"><p className="text-sm font-black text-[#20242a]">{release.version}</p><p className="mt-1 text-xs font-semibold text-[#68707d]">{release.notes}</p></button>)}</div>}
            {dialog === "release" && !selected && <><input value={newVersion} onChange={(event) => setNewVersion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createRelease(); }} autoFocus placeholder="v2.3.0" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[#7b68ee]" /><div className="mt-3 flex justify-end"><PrimaryButton onClick={createRelease}>Create draft</PrimaryButton></div></>}
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
