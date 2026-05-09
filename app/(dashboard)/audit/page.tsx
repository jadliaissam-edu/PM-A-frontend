"use client";

import { useState } from "react";
import { ArrowDownUp, Download, Search, ShieldCheck } from "lucide-react";
import { Avatar, Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";

const logs = [
  { id: 1, user: "hassine", action: "Login", detail: "Successful login from 192.168.1.1", status: "Success", time: "2024-04-20 10:15" },
  { id: 2, user: "admin", action: "Create Project", detail: "Project PM-A created", status: "Success", time: "2024-04-20 09:42" },
  { id: 3, user: "snofy", action: "Delete Workspace", detail: "Delete attempt blocked by permission", status: "Error", time: "2024-04-19 22:11" },
  { id: 4, user: "system", action: "Backup", detail: "Daily backup completed", status: "Success", time: "2024-04-19 04:00" },
  { id: 5, user: "admin", action: "Update MFA", detail: "MFA enabled for hassine", status: "Warning", time: "2024-04-18 15:30" },
];

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [range, setRange] = useState("Last 24h");
  const [selected, setSelected] = useState<(typeof logs)[number] | null>(null);
  const [notice, setNotice] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const filtered = logs
    .filter((log) => `${log.user} ${log.action} ${log.detail}`.toLowerCase().includes(search.toLowerCase()))
    .filter((log) => status === "All" || log.status === status)
    .sort((a, b) => sortDesc ? b.time.localeCompare(a.time) : a.time.localeCompare(b.time));
  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setRange("Last 24h");
  };

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Audit logs"
        subtitle="Everything / security / workspace activity"
        badge="152 events"
        actions={<><GhostButton onClick={() => setRange(range === "Last 24h" ? "Last 7d" : "Last 24h")}>{range}</GhostButton><GhostButton onClick={() => setSortDesc((current) => !current)}><span className="inline-flex items-center gap-1"><ArrowDownUp size={13} /> {sortDesc ? "Newest" : "Oldest"}</span></GhostButton><PrimaryButton onClick={() => setNotice(`${filtered.length} visible events exported locally.`)}><span className="inline-flex items-center gap-1"><Download size={13} /> CSV</span></PrimaryButton></>}
      />

      <Panel title="Security activity" icon={<ShieldCheck size={16} />}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex h-8 w-full min-w-0 items-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-2.5 sm:w-auto sm:min-w-[320px]">
            <Search size={14} className="text-[#8f96a3]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold outline-none placeholder:text-[#8f96a3]" />
          </div>
          <div className="flex gap-1">
            {["All", "Success", "Warning", "Error"].map((item) => (
              <button key={item} onClick={() => setStatus(item)} className={status === item ? "rounded-[5px] ring-2 ring-[#d7d1ff]" : ""}>
                <Chip tone={item === "Success" ? "green" : item === "Warning" ? "yellow" : item === "Error" ? "red" : "neutral"}>{item}</Chip>
              </button>
            ))}
            {(search || status !== "All" || range !== "Last 24h") && <button onClick={clearFilters} className="h-6 rounded-[5px] px-2 text-[10px] font-black text-[#7b68ee] hover:bg-[#f3efff]">Clear</button>}
          </div>
        </div>
        <div className="mb-3 grid gap-2 md:grid-cols-3">
          {["Success", "Warning", "Error"].map((item) => <button key={item} onClick={() => setStatus(item)} className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-left hover:bg-white"><p className="text-[10px] font-black uppercase text-[#8f96a3]">{item}</p><p className="mt-1 text-xl font-black text-[#20242a]">{logs.filter((log) => log.status === item).length}</p></button>)}
        </div>
        {notice && <div className="mb-3 rounded-[8px] border border-[#d7f4e8] bg-[#ecfff6] px-3 py-2 text-xs font-black text-[#008f65]">{notice}</div>}
        <div className="overflow-x-auto rounded-[8px] border border-[#dfe3e8]">
          <div className="min-w-[850px]">
          <div className="grid h-8 grid-cols-[150px_150px_minmax(280px,1fr)_110px_160px] items-center bg-[#f8f9fb] text-[10px] font-black uppercase text-[#68707d]">
            <div className="px-3">User</div><div className="border-l border-[#e4e6ea] px-3">Action</div><div className="border-l border-[#e4e6ea] px-3">Detail</div><div className="border-l border-[#e4e6ea] px-3">Status</div><div className="border-l border-[#e4e6ea] px-3">Time</div>
          </div>
          {filtered.map((log) => (
            <button key={log.id} onClick={() => setSelected(log)} className="grid h-11 w-full grid-cols-[150px_150px_minmax(280px,1fr)_110px_160px] items-center border-t border-[#edf0f3] bg-white text-left text-xs hover:bg-[#f7f8fb]">
              <div className="flex items-center gap-2 px-3"><Avatar initials={log.user.charAt(0).toUpperCase()} /><span className="font-black text-[#20242a]">{log.user}</span></div>
              <div className="border-l border-[#e5e7eb] px-3 font-black text-[#68707d]">{log.action}</div>
              <div className="truncate border-l border-[#e5e7eb] px-3 font-semibold text-[#68707d]">{log.detail}</div>
              <div className="border-l border-[#e5e7eb] px-3"><Chip tone={log.status === "Success" ? "green" : log.status === "Warning" ? "yellow" : "red"}>{log.status}</Chip></div>
              <div className="border-l border-[#e5e7eb] px-3 font-mono text-[11px] text-[#8f96a3]">{log.time}</div>
            </button>
          ))}
          {filtered.length === 0 && <div className="px-3 py-8 text-center text-sm font-bold text-[#8f96a3]">No audit events match.</div>}
          </div>
        </div>
      </Panel>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setSelected(null)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">{selected.action}</h2>
              <button onClick={() => setSelected(null)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            <p className="text-sm font-semibold leading-6 text-[#68707d]">{selected.detail}</p>
            <p className="mt-2 font-mono text-xs text-[#8f96a3]">{selected.time}</p>
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
