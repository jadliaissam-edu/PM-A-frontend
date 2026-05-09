"use client";

import { useState } from "react";
import { CirclePlus, GitBranch, Rocket, Search, ShieldCheck } from "lucide-react";
import { Avatar, Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";

const releases = [
  { version: "v2.1.0", status: "Released", date: "Apr 20", owner: "AP", notes: "Dashboard, chat, notifications, and audit improvements.", items: ["Dashboard", "Chat", "Notifications"] },
  { version: "v2.0.1", status: "Released", date: "Apr 15", owner: "HT", notes: "Kanban fixes and SQL performance work.", items: ["Kanban", "DB", "Profile"] },
  { version: "v2.2.0-rc", status: "Draft", date: "May 6", owner: "SN", notes: "Backend integration readiness and enterprise workspace polish.", items: ["API", "Enterprise", "Reports"] },
  { version: "v1.5.0", status: "Archived", date: "Mar 1", owner: "SYS", notes: "Stable MVP baseline.", items: ["MVP", "Auth"] },
];
type Release = (typeof releases)[number];

export default function ReleaseManagementPage() {
  const [items, setItems] = useState<Release[]>(releases);
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
    const release: Release = { version, status: "Draft", date: "Today", owner: "AA", notes: "Local draft release prepared from the frontend.", items: ["Draft", "Planning"] };
    setItems((current) => [release, ...current]);
    setSelected(release);
    setNewVersion("");
    setDialog(null);
  };

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Releases"
        subtitle="Product / release train / deployment readiness"
        badge="4 versions"
        actions={
          <>
            <GhostButton onClick={() => setDialog("changelog")}>Changelog</GhostButton>
            <PrimaryButton onClick={() => setDialog("release")}><span className="inline-flex items-center gap-1"><CirclePlus size={14} /> Release</span></PrimaryButton>
          </>
        }
      />

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
              <article key={release.version} className={`rounded-[9px] border bg-white p-3 shadow-sm hover:bg-[#f7f8fb] ${selected?.version === release.version ? "border-[#d7d1ff] bg-[#f3efff]" : "border-[#dfe3e8]"}`}>
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
                  <button onClick={() => setSelected(release)} className="text-xs font-black text-[#7b68ee]">Open details</button>
                </div>
              </article>
            ))}
            {visible.length === 0 && <div className="rounded-[9px] border border-dashed border-[#dfe3e8] p-6 text-center text-sm font-bold text-[#8f96a3]">No releases match.</div>}
          </div>
        </Panel>

        <aside className="space-y-4">
          <Panel title="Readiness" icon={<ShieldCheck size={16} />}>
            <div className="space-y-3">
              {["Stability", "Test coverage", "Rollback plan"].map((item, index) => (
                <button key={item} onClick={() => setReadiness((current) => ({ ...current, [item]: !current[item as keyof typeof current] }))} className="block w-full text-left">
                  <div className="mb-1 flex justify-between text-xs font-black text-[#68707d]"><span>{item}</span><span>{[99, 84, 76][index]}%</span></div>
                  <div className="h-1.5 rounded-full bg-[#e4e7ec]"><div className={`h-full rounded-full ${readiness[item as keyof typeof readiness] ? "bg-[#7b68ee]" : "bg-[#c8cdd4]"}`} style={{ width: `${[99, 84, 76][index]}%` }} /></div>
                </button>
              ))}
            </div>
          </Panel>
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
              <button onClick={() => { setSelected(null); setDialog(null); }} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            {selected && <div className="space-y-3"><p className="text-sm font-semibold leading-6 text-[#68707d]">{selected.notes}</p><div className="flex flex-wrap gap-1.5">{selected.items.map((item) => <Chip key={item}>{item}</Chip>)}</div><button onClick={() => { setFilter(selected.status); setSelected(null); setDialog(null); }} className="h-9 w-full rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] text-sm font-black text-[#68707d] hover:bg-white">Filter by {selected.status}</button></div>}
            {dialog === "changelog" && !selected && <div className="space-y-2">{items.slice(0, 3).map((release) => <button key={release.version} onClick={() => setSelected(release)} className="w-full rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-left hover:bg-white"><p className="text-sm font-black text-[#20242a]">{release.version}</p><p className="mt-1 text-xs font-semibold text-[#68707d]">{release.notes}</p></button>)}</div>}
            {dialog === "release" && !selected && <><input value={newVersion} onChange={(event) => setNewVersion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createRelease(); }} autoFocus placeholder="v2.3.0" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[#7b68ee]" /><div className="mt-3 flex justify-end"><PrimaryButton onClick={createRelease}>Create draft</PrimaryButton></div></>}
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
