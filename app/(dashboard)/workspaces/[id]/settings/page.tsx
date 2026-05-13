"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { orgService } from "@/services/org.service";
import { WorkspacePage, WorkspaceHeader, Panel, PrimaryButton, GhostButton } from "@/components/workspace-ui";
import { ArrowLeft, Save, Trash2, Globe, Lock, Shield } from "lucide-react";

export default function WorkspaceSettingsPage() {
  const params = useParams() as any;
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const w = await orgService.getWorkspaceById(id);
        setWorkspace(w);
        setName(w.name || "");
        setDescription(w.description || "");
        setVisibility(w.visibility || "private");
      } catch (e: any) {
        console.error(e);
        setError("Failed to load workspace settings.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await orgService.updateWorkspaceById(id, { name, description, visibility });
      alert("Settings updated successfully!");
      // We don't use router.refresh() here as we want to stay on the page with updated state
      setWorkspace((prev: any) => ({ ...prev, name, description, visibility }));
    } catch (e: any) {
      console.error(e);
      setError("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this workspace? This action is irreversible.")) return;
    try {
      await orgService.deleteWorkspaceById(id);
      router.push("/organization");
    } catch (e) {
      alert("Failed to delete workspace.");
    }
  };

  if (loading) return <WorkspacePage><div className="flex h-[60vh] items-center justify-center font-black text-[#8f96a3]">Loading settings...</div></WorkspacePage>;

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title={`${workspace?.name || 'Workspace'} Settings`}
        subtitle="Manage workspace profile and permissions"
        actions={
          <GhostButton onClick={() => router.push(`/workspaces/${id}`)}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Workspace
          </GhostButton>
        }
      />

      <div className="mx-auto max-w-3xl space-y-8 pb-20">
        <Panel title="General Settings">
          <div className="space-y-6 pt-2">
            {error && (
              <div className="rounded-[8px] bg-red-50 p-3 text-xs font-black text-red-600 border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-[#8f96a3]">Workspace Name</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workspace name"
                className="h-11 w-full rounded-[12px] border border-[#dfe3e8] bg-white px-4 text-sm font-black text-[#20242a] focus:border-[#7b68ee] focus:outline-none focus:ring-4 focus:ring-[#7b68ee]/5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-[#8f96a3]">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this workspace for?"
                rows={4}
                className="w-full rounded-[12px] border border-[#dfe3e8] bg-white p-4 text-sm font-semibold text-[#20242a] focus:border-[#7b68ee] focus:outline-none focus:ring-4 focus:ring-[#7b68ee]/5 resize-none leading-relaxed"
              />
              <p className="text-[10px] font-semibold text-[#8f96a3]">Briefly describe the goals or department of this workspace.</p>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-[#8f96a3]">Workspace Visibility</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button 
                  onClick={() => setVisibility('private')}
                  className={`flex flex-col items-start gap-4 rounded-[20px] border p-5 text-left transition-all ${visibility === 'private' ? 'border-[#7b68ee] bg-[#7b68ee]/5 ring-1 ring-[#7b68ee]' : 'border-[#edf0f3] bg-white hover:border-[#dfe3e8]'}`}
                >
                  <div className={`rounded-[10px] p-2 ${visibility === 'private' ? 'bg-[#7b68ee] text-white shadow-[0_4px_12px_rgba(123,104,238,0.3)]' : 'bg-[#f7f8fb] text-[#68707d]'}`}>
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#20242a]">Private Workspace</h4>
                    <p className="mt-1 text-[11px] font-semibold text-[#8f96a3] leading-relaxed">Only workspace members can see tasks and projects within this space.</p>
                  </div>
                </button>

                <button 
                  onClick={() => setVisibility('public')}
                  className={`flex flex-col items-start gap-4 rounded-[20px] border p-5 text-left transition-all ${visibility === 'public' ? 'border-[#7b68ee] bg-[#7b68ee]/5 ring-1 ring-[#7b68ee]' : 'border-[#edf0f3] bg-white hover:border-[#dfe3e8]'}`}
                >
                  <div className={`rounded-[10px] p-2 ${visibility === 'public' ? 'bg-[#7b68ee] text-white shadow-[0_4px_12px_rgba(123,104,238,0.3)]' : 'bg-[#f7f8fb] text-[#68707d]'}`}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#20242a]">Public Workspace</h4>
                    <p className="mt-1 text-[11px] font-semibold text-[#8f96a3] leading-relaxed">Anyone in your organization can view and join this workspace and its projects.</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#f7f8fb]">
              <PrimaryButton onClick={handleSave} disabled={saving} className="h-11 px-8">
                <Save size={18} className="mr-2" />
                {saving ? "Saving Changes..." : "Save Settings"}
              </PrimaryButton>
            </div>
          </div>
        </Panel>

        <Panel title="Danger Zone">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[24px] border border-red-50 bg-[#fffcfc] p-6 sm:flex-row sm:items-center">
             <div className="space-y-1">
                <h4 className="text-sm font-black text-red-600 flex items-center gap-2">
                  <Shield size={16} />
                  Delete this workspace
                </h4>
                <p className="text-[11px] font-semibold text-[#8f96a3] max-w-[420px] leading-5">
                  Permanently remove this workspace and all of its associated projects, tickets, and data. This action is irreversible and cannot be undone.
                </p>
             </div>
             <button 
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-[14px] bg-red-50 px-6 py-3.5 text-xs font-black text-[#ff4d4d] transition-all hover:bg-red-100 hover:scale-105 active:scale-95"
             >
                <Trash2 size={16} />
                Delete Workspace
             </button>
          </div>
        </Panel>
      </div>
    </WorkspacePage>
  );
}
