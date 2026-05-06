"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { CheckCircle2, CirclePlus, FileUp, PlugZap } from "lucide-react";
import { Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";

export default function ImportPage() {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [source, setSource] = useState("Jira");
  const [message, setMessage] = useState("");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [mappingOpen, setMappingOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(event.type !== "dragleave");
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    setFileName(event.dataTransfer.files?.[0]?.name || null);
    if (event.dataTransfer.files?.[0]) setActiveStep(1);
  };
  const handleBrowse = (event: ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.files?.[0]?.name || null);
    if (event.target.files?.[0]) setActiveStep(1);
  };
  const runImport = () => {
    if (!fileName) {
      setMessage("Choose a file before importing.");
      return;
    }
    setActiveStep(3);
    setMessage(`Local import preview ready for ${fileName} from ${source}.`);
  };

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Import"
        subtitle="Product / data migration / source mapping"
        badge="CSV · JSON · Jira"
        actions={<><GhostButton onClick={() => setTemplatesOpen(true)}>Templates</GhostButton><PrimaryButton onClick={runImport}><span className="inline-flex items-center gap-1"><CirclePlus size={14} /> Import</span></PrimaryButton></>}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Panel title="Upload source file" icon={<FileUp size={16} />}>
          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`flex min-h-[280px] flex-col items-center justify-center rounded-[10px] border border-dashed p-8 text-center transition ${dragging ? "border-[#7b68ee] bg-[#f3efff]" : "border-[#bfc6d1] bg-[#f7f8fb]"}`}>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[12px] bg-[#7b68ee] text-white">
              <FileUp size={24} />
            </div>
            <h2 className="text-lg font-black text-[#20242a]">{fileName || "Drop your file here"}</h2>
            <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-[#68707d]">Import tasks, members, or projects from CSV, JSON, XML, Jira archives, or GitHub issue exports.</p>
            <input ref={inputRef} type="file" onChange={handleBrowse} className="hidden" />
            <button onClick={() => inputRef.current?.click()} className="mt-6 h-9 rounded-[7px] bg-[#7b68ee] px-4 text-sm font-black text-white">Browse files</button>
            {message && <p className="mt-3 text-xs font-black text-[#7b68ee]">{message}</p>}
          </div>
        </Panel>

        <aside className="space-y-4">
          <Panel title="Import steps" icon={<CheckCircle2 size={16} />}>
            <div className="space-y-3">
              {["Upload source", "Map fields", "Validate rows", "Create tasks"].map((step, index) => (
                <button key={step} onClick={() => { setActiveStep(index); if (index === 1) setMappingOpen(true); }} className={`flex w-full gap-3 rounded-[8px] border p-3 text-left ${activeStep === index ? "border-[#d7d1ff] bg-[#f3efff]" : "border-[#edf0f3] bg-[#f7f8fb]"}`}>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ring-1 ${activeStep >= index ? "bg-[#7b68ee] text-white ring-[#d7d1ff]" : "bg-white text-[#7b68ee] ring-[#dfe3e8]"}`}>{index + 1}</span>
                  <div>
                    <p className="text-xs font-black text-[#20242a]">{step}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#8f96a3]">{activeStep === index ? "Current local step" : "Required before final import"}</p>
                  </div>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Integrations" icon={<PlugZap size={16} />}>
            <div className="space-y-2">
              {["Jira", "Trello", "Asana", "GitHub Issues"].map((name, index) => (
                <button
                  key={name}
                  onClick={() => {
                    if (index === 0) {
                      setSource(name);
                      setActiveStep(0);
                      setMessage("Jira import source selected.");
                    } else {
                      setMessage(`${name} connector is not connected yet. Use a CSV template for now.`);
                    }
                  }}
                  className={`flex h-10 w-full items-center justify-between rounded-[8px] border px-3 text-left text-sm font-black text-[#20242a] hover:bg-white ${source === name ? "border-[#d7d1ff] bg-[#f3efff]" : "border-[#edf0f3] bg-[#f7f8fb]"}`}
                >
                  {name}
                  <Chip tone={index === 0 ? "purple" : "neutral"}>{index === 0 ? "Ready" : "Soon"}</Chip>
                </button>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
      {templatesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setTemplatesOpen(false)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">Import templates</h2>
              <button onClick={() => setTemplatesOpen(false)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            {["Task CSV", "Member CSV", "Release JSON"].map((item) => <button key={item} onClick={() => { setMessage(`${item} selected as a local template.`); setFileName(`${item.toLowerCase().replaceAll(" ", "-")}.csv`); setActiveStep(1); setTemplatesOpen(false); }} className="mb-2 flex h-10 w-full items-center rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] px-3 text-sm font-black text-[#20242a] hover:bg-white">{item}</button>)}
          </section>
        </div>
      )}
      {mappingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setMappingOpen(false)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-base font-black text-[#20242a]">Map fields</h2><button onClick={() => setMappingOpen(false)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button></div>
            {["Title -> Task name", "Owner -> Assignee", "Deadline -> Due date"].map((field) => <div key={field} className="mb-2 rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-sm font-black text-[#68707d]">{field}</div>)}
            <div className="mt-3 flex justify-end"><PrimaryButton onClick={() => { setActiveStep(2); setMappingOpen(false); }}>Validate rows</PrimaryButton></div>
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
