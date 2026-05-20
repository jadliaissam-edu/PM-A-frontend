"use client";

import { useState, useEffect } from "react";
import { BarChart3, Download, Filter, TrendingUp, Loader2 } from "lucide-react";
import { Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import reportsService from "@/services/reports.service";
import { projectService } from "@/services/project.service";

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
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null);
  const [sprints, setSprints] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string | number | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | number | null>(null);
  const [exportingProject, setExportingProject] = useState(false);
  const [exportingSprint, setExportingSprint] = useState(false);
  const [exportingMember, setExportingMember] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await projectService.getProjects();
        if (!mounted) return;
        setProjects(list || []);
        if ((list || []).length > 0) setSelectedProjectId(list[0].id);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    if (!selectedProjectId) {
      setSprints([]);
      setMembers([]);
      setSelectedSprintId(null);
      setSelectedMemberId(null);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const s = await projectService.listSprints(selectedProjectId as any);
        const m = await projectService.listMembers(selectedProjectId as any);
        if (!mounted) return;
        setSprints(s || []);
        setMembers(m || []);
        if ((s || []).length > 0) setSelectedSprintId(s[0].id);
        if ((m || []).length > 0) setSelectedMemberId(m[0].user?.id ?? m[0].id ?? null);
        // derive a simple values series for velocity chart from sprint reports when available
        const velocities = (s || []).map((it: any) => (it.report?.velocity ?? 0));
        setValues(velocities.length ? velocities : [0]);
        // fetch project-level progress for selected project
        try {
          const pr = await reportsService.getProjectProgress(selectedProjectId as any);
          if (!mounted) return;
          setProjectReport(pr || null);
        } catch (e) {
          // ignore
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, [selectedProjectId]);
  const [dashboardStats, setDashboardStats] = useState<any | null>(null);
  const [projectReport, setProjectReport] = useState<any | null>(null);
  const [sprintReport, setSprintReport] = useState<any | null>(null);
  const [memberReport, setMemberReport] = useState<any | null>(null);
  const [kpis, setKpis] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [values, setValues] = useState<number[]>([]);

  const [selectedKpi, setSelectedKpi] = useState<string>('Velocity');
  const [reportView, setReportView] = useState<"Velocity" | "Distribution" | "Summary">("Velocity");

  // Fetch site/dashboard-level stats once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stats = await reportsService.getDashboardStats();
        if (!mounted) return;
        setDashboardStats(stats || null);
        setKpis([
          { label: 'Velocity', value: `${stats?.average_velocity ?? 0} pts`, trend: stats?.velocity_trend ?? '', tone: 'purple' },
          { label: 'Resolution', value: `${stats?.average_resolution ?? '-'}d`, trend: stats?.resolution_trend ?? '', tone: 'green' },
          { label: 'Closed tasks', value: `${stats?.closed_issues ?? 0}`, trend: stats?.closed_trend ?? '', tone: 'blue' },
          { label: 'Open issues', value: `${stats?.open_issues ?? 0}`, trend: stats?.open_trend ?? '', tone: 'yellow' },
        ]);
        setDistribution(stats?.work_distribution ?? []);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Reports"
        subtitle="Product / delivery analytics / sprint health"
        badge="Live"
        actions={
          <>
              <GhostButton onClick={() => setShowFilter((current) => !current)}><span className="inline-flex items-center gap-1"><Filter size={13} /> Filter</span></GhostButton>
              <div className="mr-2 inline-flex items-center">
                <select value={selectedProjectId ?? ""} onChange={(e) => setSelectedProjectId(e.target.value)} className="h-9 rounded-[7px] border border-[#dfe3e8] bg-white px-2 text-sm font-black text-[#20242a]">
                  <option value="">Select project</option>
                  {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
                <select value={selectedSprintId ?? ""} onChange={(e) => setSelectedSprintId(e.target.value)} className="ml-2 h-9 rounded-[7px] border border-[#dfe3e8] bg-white px-2 text-sm font-black text-[#20242a]">
                  <option value="">Select sprint</option>
                  {sprints.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
                <select value={selectedMemberId ?? ""} onChange={(e) => setSelectedMemberId(e.target.value)} className="ml-2 h-9 rounded-[7px] border border-[#dfe3e8] bg-white px-2 text-sm font-black text-[#20242a]">
                  <option value="">Select member</option>
                  {members.map((m) => {
                    const uid = m.user?.id ?? m.id;
                    const name = m.user ? `${m.user.first_name} ${m.user.last_name}`.trim() || m.user.username : m.username || m.name || String(uid);
                    return (<option key={uid} value={uid}>{name}</option>);
                  })}
                </select>
              </div>
              <PrimaryButton disabled={exportingProject} onClick={async () => {
                if (exportingProject) return;
                setExportingProject(true);
                try {
                  setNotice('Preparing export...')
                  const projectId = selectedProjectId;
                  if (!projectId) {
                    setNotice('Please select a project to export');
                    return;
                  }
                  const blob = await reportsService.exportProjectReport(Number(projectId), 'csv');
                  const url = window.URL.createObjectURL(new Blob([blob]));
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `project_${projectId}_report.csv`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                  setNotice('Export downloaded');
                } catch (e: any) {
                  setNotice(e?.response?.data?.error || 'Export failed');
                } finally {
                  setExportingProject(false);
                }
              }}>
                <span className="inline-flex items-center gap-1">
                  {exportingProject ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                  Export
                </span>
              </PrimaryButton>
                <GhostButton disabled={exportingSprint} onClick={async () => {
                  if (exportingSprint) return;
                  setExportingSprint(true);
                  try {
                    if (!selectedProjectId || !selectedSprintId) { setNotice('Select project and sprint'); return; }
                    setNotice('Preparing sprint export...');
                    const blob = await reportsService.exportSprintReport(selectedProjectId as any, selectedSprintId as any, 'csv');
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const a = document.createElement('a'); a.href = url; a.download = `sprint_${selectedSprintId}_report.csv`; document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
                    setNotice('Sprint export downloaded');
                  } catch (e: any) { setNotice(e?.response?.data?.error || 'Sprint export failed'); }
                  finally { setExportingSprint(false); }
                }} className="ml-2">
                  <span className="inline-flex items-center gap-1">{exportingSprint ? <Loader2 size={13} className="animate-spin" /> : null}Export Sprint</span>
                </GhostButton>

                <GhostButton disabled={exportingMember} onClick={async () => {
                  if (exportingMember) return;
                  setExportingMember(true);
                  try {
                    if (!selectedProjectId || !selectedMemberId) { setNotice('Select project and member'); return; }
                    setNotice('Preparing member export...');
                    const blob = await reportsService.exportMemberReport(selectedProjectId as any, selectedMemberId as any, 'csv');
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const a = document.createElement('a'); a.href = url; a.download = `member_${selectedMemberId}_report.csv`; document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
                    setNotice('Member export downloaded');
                  } catch (e: any) { setNotice(e?.response?.data?.error || 'Member export failed'); }
                  finally { setExportingMember(false); }
                }} className="ml-2">
                  <span className="inline-flex items-center gap-1">{exportingMember ? <Loader2 size={13} className="animate-spin" /> : null}Export Member</span>
                </GhostButton>
          </>
        }
      />

      <section className="mb-4" />

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
