"use client";

import React, { useEffect, useState } from "react";
import SlideOver from "@/components/ui/SlideOver";
import { PrimaryButton, GhostButton } from "@/components/workspace-ui";
import { useRouter } from "next/navigation";
import { projectService } from "@/services/project.service";
import { ticketsService } from "@/services/tickets.service";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TurndownService from "turndown";

export default function TicketCreateSlideOver({ open, onClose, projectId, onCreated }: { open: boolean; onClose: () => void; projectId: string; onCreated?: (ticket: any) => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("task");
  const [priority, setPriority] = useState("medium");
  const [labels, setLabels] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  useEffect(() => {
    if (!open) {
      setTitle("");
      setType("task");
      setPriority("medium");
      setLabels("");
      editor?.commands.setContent("");
    }
    // load project members when opening
    (async () => {
      if (!open || !projectId) return;
      try {
        const m = await projectService.listMembers(projectId);
        setMembers(Array.isArray(m) ? m : []);
      } catch (err) {
        console.error("Failed to load project members", err);
        setMembers([]);
      }
    })();
  }, [open, editor]);

  const submit = async () => {
    setLoading(true);
    try {
      const html = editor?.getHTML() || "";
      const turndown = new TurndownService();
      const markdown = turndown.turndown(html);
      const payload = {
        title,
        description_markdown: markdown,
        type,
        priority,
        labels: labels ? labels.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      const created = await projectService.createProjectTicket(projectId, payload);

      // Assign selected assignees (API expects per-assignee POST)
      if (selectedAssignees && selectedAssignees.length > 0) {
        for (const uid of selectedAssignees) {
          try {
            await ticketsService.addAssignee(projectId, created.id, { user_id: uid });
          } catch (err) {
            console.warn("Failed to add assignee", uid, err);
          }
        }
      }

      // Upload attachments if any
      if (files && files.length > 0) {
        for (const f of files) {
          try {
            await projectService.uploadTicketAttachment(projectId, created.id, f);
          } catch (err) {
            console.error('Failed to upload attachment', err);
          }
        }
      }

      if (onCreated) onCreated(created);
      onClose();
      alert("Ticket created");
    } catch (e) {
      console.error("Failed to create ticket", e);
      alert("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlideOver open={open} onClose={onClose} title="Create ticket">
      <div className="space-y-4">
        <label className="block text-xs font-black text-[#8f96a3]">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summary of the ticket" className="w-full rounded-[8px] border border-[#dfe3e8] p-2" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black text-[#8f96a3]">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-[8px] border border-[#dfe3e8] p-2">
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
              <option value="task">Task</option>
              <option value="epic">Epic</option>
              <option value="story">Story</option>
              <option value="sub_task">Sub-task</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-[#8f96a3]">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-[8px] border border-[#dfe3e8] p-2">
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-[#8f96a3]">Assignees</label>
          <select multiple value={selectedAssignees} onChange={(e) => {
            const opts = Array.from(e.target.selectedOptions || []).map(o => o.value);
            setSelectedAssignees(opts);
          }} className="w-full rounded-[8px] border border-[#dfe3e8] p-2">
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.username || m.email || m.id}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[#68707d]">Hold Control/Cmd to select multiple assignees.</p>
        </div>

        <div>
          <label className="block text-xs font-black text-[#8f96a3]">Labels (comma separated)</label>
          <input value={labels} onChange={(e) => setLabels(e.target.value)} placeholder="ui,backend,bug" className="w-full rounded-[8px] border border-[#dfe3e8] p-2" />
        </div>

        <div>
          <label className="block text-xs font-black text-[#8f96a3] mb-2">Description (Markdown)</label>
          <div className="min-h-[200px] rounded-[8px] border border-[#dfe3e8] p-2">
            {editor && <EditorContent editor={editor} />}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-[#8f96a3]">Attachments</label>
          <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="mt-2" />
          {files.length > 0 && <div className="mt-2 text-sm text-[#68707d]">{files.length} file(s) selected</div>}
        </div>

        <div className="flex justify-end gap-2">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={loading || !title}>{loading ? "Creating..." : "Create"}</PrimaryButton>
        </div>
      </div>
    </SlideOver>
  );
}
