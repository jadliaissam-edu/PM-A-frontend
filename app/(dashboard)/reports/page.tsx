"use client";

import { useState } from "react";
import { BarChart3, Download, Filter, TrendingUp } from "lucide-react";
import { Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";

const kpis = [
  { label: "Velocity", value: "38 pts", trend: "+12%", tone: "purple" as const },
  { label: "Resolution", value: "2.4d", trend: "-5%", tone: "green" as const },
  { label: "Closed tasks", value: "142", trend: "+22%", tone: "blue" as const },
  { label: "Blocked", value: "4.2%", trend: "-1%", tone: "yellow" as const },
];

export default function ReportsPage() {
  const [range, setRange] = useState(12);
  const [showFilter, setShowFilter] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedKpi, setSelectedKpi] = useState(kpis[0].label);
  const [reportView, setReportView] = useState<"Velocity" | "Distribution" | "Summary">("Velocity");
  const values = [35, 42, 38, 45, 52, 48, 55, 50, 42, 58, 60, 65].slice(-range);
  const distribution = [
    { label: "Development", value: 65, color: "bg-[#7b68ee]" },
    { label: "Design", value: 15, color: "bg-[#1090e0]" },
    { label: "QA / Tests", value: 12, color: "bg-[#f8ae00]" },
    { label: "Operations", value: 8, color: "bg-[#87909e]" },
  ];

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Reports"
        subtitle="Product / delivery analytics / sprint health"
        badge="Live"
        actions={
          <>
            <GhostButton onClick={() => setShowFilter((current) => !current)}><span className="inline-flex items-center gap-1"><Filter size={13} /> Filter</span></GhostButton>
            <PrimaryButton onClick={() => setNotice("Report export prepared locally.")}><span className="inline-flex items-center gap-1"><Download size={13} /> Export</span></PrimaryButton>
          </>
        }
      />

      <section className="mb-4 grid gap-3 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <button key={kpi.label} onClick={() => { setSelectedKpi(kpi.label); setReportView(kpi.label === "Closed tasks" ? "Distribution" : "Velocity"); }} className={`rounded-[10px] border bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selectedKpi === kpi.label ? "border-[#d7d1ff] bg-[#f3efff]" : "border-[#dfe3e8]"}`}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-black uppercase text-[#8f96a3]">{kpi.label}</p>
              <Chip tone={kpi.tone}>{kpi.trend}</Chip>
            </div>
            <p className="text-3xl font-black text-[#20242a]">{kpi.value}</p>
            <p className="mt-1 text-xs font-semibold text-[#7c828d]">Compared with previous sprint</p>
          </button>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel title="Velocity by sprint" icon={<BarChart3 size={16} />} action={<GhostButton onClick={() => setRange(range === 12 ? 6 : 12)}>Last {range} sprints</GhostButton>}>
          {showFilter && <div className="mb-3 flex flex-wrap gap-1">{[6, 12].map((item) => <button key={item} onClick={() => setRange(item)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${range === item ? "border border-[#dfe3e8] bg-[#f7f8fb] text-[#20242a]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>{item} sprints</button>)}{(["Velocity", "Distribution", "Summary"] as const).map((view) => <button key={view} onClick={() => setReportView(view)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${reportView === view ? "border border-[#dfe3e8] bg-[#f7f8fb] text-[#20242a]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>{view}</button>)}</div>}
          {notice && <div className="mb-3 rounded-[8px] border border-[#d7f4e8] bg-[#ecfff6] px-3 py-2 text-xs font-black text-[#008f65]">{notice}</div>}
          {reportView === "Velocity" && <>
            <div className="flex h-72 items-end gap-2 border-b border-[#edf0f3] px-2 pb-3">
              {values.map((value, index) => (
                <button key={index} onClick={() => setNotice(`Sprint ${index + 1}: ${value} velocity points selected.`)} className="group relative flex flex-1 items-end">
                  <div className="w-full rounded-t-[6px] bg-[#7b68ee] transition group-hover:bg-[#6d56ea]" style={{ height: `${value}%` }} />
                  <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded-[5px] bg-[#20242a] px-2 py-1 text-[10px] font-black text-white group-hover:block">{value}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[10px] font-black text-[#8f96a3]">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
            </div>
          </>}
          {reportView === "Distribution" && <div className="grid gap-3 md:grid-cols-2">{distribution.map((item) => <button key={item.label} onClick={() => setNotice(`${item.label} represents ${item.value}% of current work.`)} className="rounded-[9px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-left hover:bg-white"><div className="mb-2 flex justify-between text-xs font-black text-[#68707d]"><span>{item.label}</span><span>{item.value}%</span></div><div className="h-1.5 rounded-full bg-[#e4e7ec]"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} /></div></button>)}</div>}
          {reportView === "Summary" && <div className="rounded-[9px] border border-[#d7f4e8] bg-[#ecfff6] p-4"><p className="text-sm font-black text-[#20242a]">Selected insight: {selectedKpi}</p><p className="mt-2 text-sm font-semibold leading-6 text-[#68707d]">Delivery is healthy across the selected range. Use export to stage a local report snapshot.</p></div>}
        </Panel>

        <aside className="space-y-4">
          <Panel title="Work distribution" icon={<TrendingUp size={16} />}>
            <div className="space-y-4">
              {distribution.map((item) => (
                <button key={item.label} onClick={() => { setReportView("Distribution"); setNotice(`${item.label} distribution selected.`); }} className="block w-full text-left">
                  <div className="mb-1 flex justify-between text-xs font-black text-[#68707d]"><span>{item.label}</span><span>{item.value}%</span></div>
                  <div className="h-1.5 rounded-full bg-[#e4e7ec]"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} /></div>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Executive summary">
            <div className="rounded-[9px] border border-[#d7f4e8] bg-[#ecfff6] p-3">
              <p className="text-sm font-black text-[#20242a]">Healthy delivery</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-[#68707d]">92% of Q1 goals are on track, with no critical dependency currently blocking release readiness.</p>
            </div>
          </Panel>
        </aside>
      </div>
    </WorkspacePage>
  );
}
