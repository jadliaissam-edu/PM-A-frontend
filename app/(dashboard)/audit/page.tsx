"use client";

import { useEffect, useState } from "react";
import { ArrowDownUp, Download, Search, ShieldCheck } from "lucide-react";
import { Avatar, Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import { projectService } from "@/services/project.service";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [range, setRange] = useState("Last 24h");
  const [selected, setSelected] = useState<any | null>(null);
  const [notice, setNotice] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await projectService.getAuditLogs();
        if (!mounted) return;
        setLogs(data || []);
      } catch (e) {
        console.error("Failed to fetch audit logs", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const getStatus = (action: string) => {
     if (action.includes("Error") || action.includes("Block") || action.includes("Fail")) return "Error";
     if (action.includes("Warning") || action.includes("MFA")) return "Warning";
     return "Success";
  };

  const filtered = logs
    .filter((log) => `${log.actor_username} ${log.action} ${log.description}`.toLowerCase().includes(search.toLowerCase()))
    .filter((log) => {
       const logStatus = getStatus(log.action);
       return status === "All" || logStatus === status;
    })
    .sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortDesc ? timeB - timeA : timeA - timeB;
    });

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setRange("Last 24h");
  };

  const countStatus = (target: string) => {
     return logs.filter(l => getStatus(l.action) === target).length;
  };

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Audit logs"
        subtitle="Everything / security / workspace activity"
        badge={`${logs.length} events`}
        actions={<>
          <GhostButton onClick={() => setRange(range === "Last 24h" ? "Last 7d" : "Last 24h")}>{range}</GhostButton>
          <GhostButton onClick={() => setSortDesc((current) => !current)}>
            <span className="inline-flex items-center gap-1"><ArrowDownUp size={13} /> {sortDesc ? "Newest" : "Oldest"}</span>
          </GhostButton>
          <PrimaryButton onClick={() => setNotice(`${filtered.length} visible events exported locally.`)}>
            <span className="inline-flex items-center gap-1"><Download size={13} /> CSV</span>
          </PrimaryButton>
        </>}
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
          {["Success", "Warning", "Error"].map((item) => (
            <button key={item} onClick={() => setStatus(item)} className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-left hover:bg-white">
              <p className="text-[10px] font-black uppercase text-[#8f96a3]">{item}</p>
              <p className="mt-1 text-xl font-black text-[#20242a]">{countStatus(item)}</p>
            </button>
          ))}
        </div>
        {notice && <div className="mb-3 rounded-[8px] border border-[#d7f4e8] bg-[#ecfff6] px-3 py-2 text-xs font-black text-[#008f65]">{notice}</div>}
        
        <div className="overflow-x-auto rounded-[8px] border border-[#dfe3e8]">
          <div className="min-w-[850px]">
          <div className="grid h-8 grid-cols-[150px_150px_minmax(280px,1fr)_110px_160px] items-center bg-[#f8f9fb] text-[10px] font-black uppercase text-[#68707d]">
            <div className="px-3">User</div><div className="border-l border-[#e4e6ea] px-3">Action</div><div className="border-l border-[#e4e6ea] px-3">Detail</div><div className="border-l border-[#e4e6ea] px-3">Status</div><div className="border-l border-[#e4e6ea] px-3">Time</div>
          </div>
          {loading ? (
             <div className="p-10 text-center text-sm font-bold text-[#8f96a3]">Loading audit logs...</div>
          ) : filtered.map((log) => {
            const logStatus = getStatus(log.action);
            return (
              <button key={log.id} onClick={() => setSelected(log)} className="grid h-11 w-full grid-cols-[150px_150px_minmax(280px,1fr)_110px_160px] items-center border-t border-[#edf0f3] bg-white text-left text-xs hover:bg-[#f7f8fb]">
                <div className="flex items-center gap-2 px-3"><Avatar initials={log.actor_username ? log.actor_username.slice(0,2).toUpperCase() : "??"} /><span className="font-black text-[#20242a]">{log.actor_username}</span></div>
                <div className="border-l border-[#e5e7eb] px-3 font-black text-[#68707d]">{log.action}</div>
                <div className="truncate border-l border-[#e5e7eb] px-3 font-semibold text-[#68707d]">{log.description}</div>
                <div className="border-l border-[#e5e7eb] px-3"><Chip tone={logStatus === "Success" ? "green" : logStatus === "Warning" ? "yellow" : "red"}>{logStatus}</Chip></div>
                <div className="border-l border-[#e5e7eb] px-3 font-mono text-[11px] text-[#8f96a3]">{formatTime(log.created_at)}</div>
              </button>
            );
          })}
          {filtered.length === 0 && !loading && <div className="px-3 py-8 text-center text-sm font-bold text-[#8f96a3]">No audit events match.</div>}
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
            <p className="text-sm font-semibold leading-6 text-[#68707d]">{selected.description}</p>
            <p className="mt-2 font-mono text-xs text-[#8f96a3]">{formatTime(selected.created_at)}</p>
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
