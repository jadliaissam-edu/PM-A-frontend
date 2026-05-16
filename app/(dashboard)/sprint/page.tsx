"use client";

import { useEffect, useState } from "react";
import { projectService } from "@/services/project.service";
import { useSearchParams } from "next/navigation";

type BacklogItem = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  points: number;
};

type SprintItem = {
  id: string;
  title: string;
  status: "In Progress" | "Done";
  points: number;
};

const initialBacklog: BacklogItem[] = [
  { id: "PM-101", title: "Payment API integration", priority: "High", points: 8 },
  { id: "PM-102", title: "Mobile menu redesign", priority: "Medium", points: 3 },
  { id: "PM-103", title: "Image loading optimization", priority: "Low", points: 2 },
  { id: "PM-104", title: "Reports PDF export", priority: "High", points: 5 },
];

const sprintItems: SprintItem[] = [
  { id: "PM-45", title: "MFA setup", status: "In Progress", points: 5 },
  { id: "PM-48", title: "Enterprise dashboard", status: "Done", points: 13 },
];

const priorityStyle = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-orange-50 text-orange-600",
  Low: "bg-zinc-100 text-zinc-600",
} as const;

export default function SprintPlanningPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId");

  const [isSprintActive, setIsSprintActive] = useState(true);
  const [backlog, setBacklog] = useState(initialBacklog);
  const [sprints, setSprints] = useState<any[]>([]);
  const [loadingSprints, setLoadingSprints] = useState(false);
  const [notice, setNotice] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const addBacklogItem = () => {
    const nextNumber = backlog.length + 105;
    setBacklog((items) => [
      ...items,
      {
        id: `PM-${nextNumber}`,
        title: "New backlog task",
        priority: "Medium",
        points: 3,
      },
    ]);
    setNotice("Backlog item added locally.");
  };

  useEffect(() => {
    if (!projectId) return;

    let mounted = true;
    (async () => {
      setLoadingSprints(true);
      try {
        const list = await projectService.listSprints(projectId as any);
        if (!mounted) return;
        setSprints(list || []);
      } catch (e) {
        console.error("Failed to load sprints:", e);
      } finally {
        setLoadingSprints(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  const createSprintBackend = async () => {
    if (!projectId) {
      setNotice("No project selected — sprint created locally.");
      setIsSprintActive(true);
      setCreateOpen(false);
      return;
    }

    try {
      const payload = {
        name: `Sprint ${sprints.length + 1}`,
        goal: "",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      };
      const created = await projectService.createSprint(projectId as any, payload);
      setSprints((s) => [created, ...s]);
      setIsSprintActive(true);
      setCreateOpen(false);
      setNotice("Sprint created on server.");
    } catch (err) {
      console.error(err);
      setNotice("Failed to create sprint on server — created locally.");
      setIsSprintActive(true);
      setCreateOpen(false);
    }
  };

  const handleAddBacklogToSprint = async (backlogItemId: string) => {
    if (!projectId) {
      setNotice("No project selected — cannot add to sprint.");
      return;
    }
    try {
      await projectService.addBacklogItemToSprint(projectId as any, backlogItemId);
      setBacklog((b) => b.filter((it) => it.id !== backlogItemId));
      setNotice("Backlog item added to sprint.");
      // refresh sprints list
      const list = await projectService.listSprints(projectId as any);
      setSprints(list || []);
    } catch (err) {
      console.error(err);
      setNotice("Failed to add backlog item to sprint.");
    }
  };

  return (
    <main className="min-h-full bg-[#f7f8fb] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-black text-[#20242a]">Sprint & Backlog</h1>
          <p className="text-xs font-medium text-[#7c828d]">Plan cycles, balance capacity, and keep upcoming work ready.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setNotice("Import preview opened locally. Backend import is not connected on this page.")}
            className="rounded-[6px] border border-[#dfe3e8] bg-white px-3 py-1.5 text-xs font-bold text-[#68707d] transition hover:bg-[#f7f8fb]"
          >
            Import tickets
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-[6px] bg-[#7b68ee] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#6a56e8]"
          >
            Create sprint
          </button>
        </div>
      </div>

      {/* Retrospective board */}
      <div className="mt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-black text-[#20242a]">Retrospective</h2>
          <span className="text-xs font-semibold text-[#8f96a3]">Collaborative notes (saved locally)</span>
        </div>
        <RetrospectiveBoard projectId={projectId} />
      </div>

      {notice && (
        <div className="mb-4 flex items-center justify-between rounded-[8px] border border-[#d7d1ff] bg-[#f3efff] px-3 py-2 text-xs font-black text-[#5f4bd8]">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} className="text-[#7b68ee]">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-black text-[#20242a]">Active sprint</h2>
            <span className="text-xs font-semibold text-[#8f96a3]">2 week cycle</span>
          </div>

          <div className="rounded-[8px] border border-[#dfe3e8] bg-white p-4 shadow-sm">
            {isSprintActive ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#edf0f3] pb-3">
                  <div>
                    <h3 className="font-black text-[#20242a]">Sprint 4: Security & UI</h3>
                    <p className="mt-1 text-xs font-medium text-[#8f96a3]">Apr 12 - Apr 26 · 18 tickets remaining</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        // attempt to complete the first sprint found
                        const sprint = sprints && sprints[0];
                        if (!sprint || !projectId) {
                          setIsSprintActive(false);
                          setNotice("Sprint completed locally.");
                          return;
                        }
                        try {
                          await projectService.completeSprint(projectId as any, sprint.id);
                          setNotice("Sprint completed on server.");
                          // refresh sprints
                          const list = await projectService.listSprints(projectId as any);
                          setSprints(list || []);
                          setIsSprintActive(false);
                        } catch (err) {
                          console.error(err);
                          setNotice("Failed to complete sprint on server.");
                        }
                      }}
                      className="rounded-[6px] bg-[#f3efff] px-3 py-1.5 text-xs font-bold text-[#7b68ee] transition hover:bg-[#ebe8ff]"
                    >
                      Complete
                    </button>

                    <button
                      onClick={async () => {
                        const sprint = sprints && sprints[0];
                        if (!sprint || !projectId) {
                          setNotice("No sprint selected on server.");
                          return;
                        }
                        try {
                          await projectService.startSprint(projectId as any, sprint.id);
                          setNotice("Sprint started on server.");
                          const list = await projectService.listSprints(projectId as any);
                          setSprints(list || []);
                          setIsSprintActive(true);
                        } catch (err) {
                          console.error(err);
                          setNotice("Failed to start sprint on server.");
                        }
                      }}
                      className="rounded-[6px] border border-[#e6e6f8] bg-white px-3 py-1.5 text-xs font-bold text-[#444] transition hover:bg-[#f7f8fb]"
                    >
                      Start
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {sprintItems.map((item) => (
                    <button key={item.id} onClick={() => setNotice(`${item.id} selected.`)} className="group flex w-full items-center justify-between rounded-[7px] border border-transparent bg-[#f7f8fb] p-2.5 text-left transition hover:border-[#dfe3e8] hover:bg-white">
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="text-[10px] font-bold text-[#8f96a3]">{item.id}</span>
                        <span className="truncate text-sm font-semibold text-[#20242a]">{item.title}</span>
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.status === "Done" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                        {item.status}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-semibold text-[#68707d]">Sprint progress</span>
                    <span className="font-black text-[#20242a]">45%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#edf0f3]">
                    <div className="h-full w-[45%] bg-[#7b68ee]" />
                  </div>
                </div>
                {/* Charts: Burndown & Velocity */}
                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="rounded-lg border bg-white p-3">
                    <h4 className="mb-2 text-xs font-bold text-zinc-700">Burndown (Sprint)</h4>
                    <div className="h-28 w-full">
                      {/* Simple placeholder sparkline; ideally replace with real chart using report data */}
                      <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#7b68ee" strokeWidth="2" points="0,5 20,8 40,12 60,18 80,25 100,28" />
                      </svg>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-white p-3">
                    <h4 className="mb-2 text-xs font-bold text-zinc-700">Velocity (Past sprints)</h4>
                    <div className="h-28 w-full">
                      <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#22c55e" strokeWidth="2" points="0,25 20,18 40,12 60,14 80,8 100,10" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f3efff] text-sm font-black text-[#7b68ee]">SP</span>
                <p className="text-sm font-black text-[#20242a]">No active sprint</p>
                <p className="mt-1 text-xs font-medium text-[#8f96a3]">Create a sprint or pull tasks from the backlog to start planning.</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-black text-[#20242a]">Product backlog</h2>
            <span className="text-xs font-semibold text-[#8f96a3]">{backlog.length} items</span>
          </div>

          <div className="min-h-[420px] space-y-2 rounded-[8px] border border-[#dfe3e8] bg-[#eef0f4] p-3">
            {backlog.map((item) => (
              <div key={item.id} className="w-full rounded-[7px] border border-[#dfe3e8] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <span className="text-[10px] font-bold text-[#8f96a3]">{item.id}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityStyle[item.priority]}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div onClick={() => setNotice(`${item.id} selected.`)} className="cursor-pointer">
                    <p className="text-sm font-bold text-[#20242a]">{item.title}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-600 ring-2 ring-white">JS</span>
                      <span className="rounded bg-zinc-50 px-1.5 py-0.5 text-[10px] font-bold text-zinc-400">{item.points} pts</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleAddBacklogToSprint(item.id)} className="rounded-[6px] bg-[#7b68ee] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#6a56e8]">Add to sprint</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addBacklogItem} className="mt-2 flex w-full items-center justify-center gap-2 rounded-[8px] border border-dashed border-zinc-300 py-3 text-sm font-black text-zinc-500 transition hover:border-[#7b68ee] hover:bg-white hover:text-[#7b68ee]">
              Add backlog item
            </button>
          </div>
        </section>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setCreateOpen(false)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-sm rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">Create sprint</h2>
              <button onClick={() => setCreateOpen(false)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            <p className="mb-4 text-sm font-medium text-[#68707d]">Create a sprint on the server for the current project (requires a selected project).</p>
            <button onClick={createSprintBackend} className="h-9 w-full rounded-[7px] bg-[#7b68ee] text-xs font-black text-white">Start sprint on server</button>
          </section>
        </div>
      )}
    </main>
  );
}
