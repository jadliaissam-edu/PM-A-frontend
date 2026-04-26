"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { projectService, ProjectBoard, Project, Ticket } from "@/services/project.service";
import { 
  Plus, MoreHorizontal, Search, Filter, Share2, LayoutGrid, List, 
  Calendar, MessageSquare, Paperclip, Clock, ChevronLeft, Loader2, X, Check, Send 
} from "lucide-react";
import { ticketService } from "@/services/ticket.service";
import { api } from "@/lib/api";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export default function KanbanBoardPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [board, setBoard] = useState<ProjectBoard | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  
  // Creation States
  const [isCreatingTask, setIsCreatingTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Progress accurately from backend state
  const calculateProgress = () => {
    if (!board) return 0;
    const totalTickets = board.columns.reduce((sum, col) => sum + (col.tickets?.length || 0), 0);
    const doneTicketsCount = board.columns
      .filter(c => c.is_done_column || c.name.toLowerCase().includes('done'))
      .reduce((sum, col) => sum + (col.tickets?.length || 0), 0);
    return totalTickets > 0 ? (doneTicketsCount / totalTickets) * 100 : 0;
  };
  const progressPercent = calculateProgress();

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      try {
        const [projData, boardData] = await Promise.all([
          projectService.getProject(projectId as string),
          projectService.getProjectBoard(projectId as string)
        ]);
        setProject(projData);
        setBoard(boardData);
      } catch (error) {
        console.error("Failed to fetch project board", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  // Fetch ticket details (comments, attachments) when selected
  useEffect(() => {
    if (selectedTicket && projectId) {
      const fetchTicketExtras = async () => {
        try {
          const [commentsRes, attachmentsRes] = await Promise.all([
            api.get(`/projects/${projectId}/tickets/${selectedTicket.id}/comments/`),
            api.get(`/projects/${projectId}/tickets/${selectedTicket.id}/attachments/`)
          ]);
          setComments(commentsRes.data || []);
          setAttachments(attachmentsRes.data || []);
        } catch (e) {
          console.error("Error fetching ticket extras", e);
        }
      };
      fetchTicketExtras();
    }
  }, [selectedTicket, projectId]);

  const handleCreateTask = async (columnId: string) => {
    if (!newTaskTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await ticketService.createTicket(projectId as string, {
        title: newTaskTitle,
        current_column: columnId, 
        priority: "medium",
        type: "task"
      } as any);
      
      const updatedBoard = await projectService.getProjectBoard(projectId as string);
      setBoard(updatedBoard);
      setNewTaskTitle("");
      setIsCreatingTask(null);
    } catch (error) {
      console.error("Failed to create task", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePriority = async (newPriority: string) => {
    if (!selectedTicket || !projectId) return;
    try {
      await api.patch(`/projects/${projectId}/tickets/${selectedTicket.id}/`, { priority: newPriority });
      const updatedTicket = { ...selectedTicket, priority: newPriority };
      setSelectedTicket(updatedTicket);
      // Refresh board to show new priority color (accent bar)
      const updatedBoard = await projectService.getProjectBoard(projectId as string);
      setBoard(updatedBoard);
    } catch (e) {
      console.error("Failed to update priority", e);
    }
  };

  const handlePostComment = async (html: string) => {
    if (!selectedTicket || !projectId || !html.trim()) return;
    try {
      const res = await api.post(`/projects/${projectId}/tickets/${selectedTicket.id}/comments/`, {
        body: html
      });
      setComments([res.data, ...comments]);
    } catch (e) {
      console.error("Error posting comment", e);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newColumnId: string) => {
     try {
       await api.post(`/projects/${projectId}/tickets/${ticketId}/move/`, {
         to_column: newColumnId
       });
       const updatedBoard = await projectService.getProjectBoard(projectId as string);
       setBoard(updatedBoard);
     } catch (e) {
       console.error("Failed to move ticket", e);
     }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden relative">
      {/* PERSONALIZED BACKGROUND - Mesh Gradient & Radial Grid */}
      <div className="absolute inset-0 -z-10 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(240,244,255,1)_0%,_rgba(255,255,255,1)_70%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/30 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* PROGRESS CURSOR (Left to Right) */}
        <div className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-zinc-900 transition-all duration-1000 ease-out z-[30] shadow-[0_0_20px_rgba(37,99,235,0.3)]" style={{ width: `${progressPercent}%` }} />

        {/* Board Header */}
        <header className="border-b border-zinc-200/50 bg-white/40 backdrop-blur-xl px-8 py-6 z-20">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="group flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-2 text-zinc-500 shadow-sm transition-all hover:border-zinc-400 hover:text-zinc-900 active:scale-95">
                <ChevronLeft size={18} />
              </button>
              <div className="flex flex-col">
                <nav className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span className="hover:text-zinc-900 cursor-pointer transition">{project?.organization_name}</span>
                  <span className="text-zinc-300">/</span>
                  <span className="hover:text-zinc-900 cursor-pointer transition">{project?.workspace_name}</span>
                </nav>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black tracking-tight text-zinc-900">{project?.name}</h1>
                  <div className="mt-1 flex items-center gap-2 rounded-full border border-black/5 bg-zinc-900/5 px-3 py-1 shadow-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">
                      {Math.round(progressPercent)}% Complété
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[11px] font-black text-zinc-400 ring-1 ring-black/5 shadow-sm">U{i}</div>
                 ))}
                 <button className="h-10 w-10 rounded-full border-2 border-white bg-zinc-900 text-white flex items-center justify-center text-xs font-black shadow-lg hover:scale-110 transition-transform active:scale-95">+</button>
               </div>
               <div className="h-8 w-[1px] bg-zinc-200" />
               <button 
                  onClick={() => board?.columns[0] && setIsCreatingTask(board.columns[0].id)}
                  className="flex items-center gap-2.5 rounded-2xl bg-zinc-900 px-7 py-3.5 text-sm font-black text-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] transition-all hover:bg-zinc-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                  <Plus size={18} />
                  <span>CRÉER UNE TÂCHE</span>
               </button>
            </div>
          </div>
        </header>

        {/* Board Content */}
        <main className="flex-1 overflow-x-auto p-10 no-scrollbar">
          <div className="flex h-full gap-8">
            {board?.columns.map((column) => (
              <div key={column.id} className="flex min-w-[360px] max-w-[360px] flex-col rounded-[2.8rem] bg-white/40 border border-white/60 backdrop-blur-md p-7 shadow-2xl shadow-zinc-200/20">
                <div className="mb-8 flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[12px] font-black text-zinc-900 uppercase tracking-[0.2em]">{column.name}</h2>
                    <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-zinc-900 text-[10px] font-black text-white shadow-xl">
                      {column.tickets?.length || 0}
                    </span>
                  </div>
                  <button onClick={() => setIsCreatingTask(column.id)} className="h-8 w-8 rounded-full hover:bg-white/50 flex items-center justify-center transition-all text-zinc-400 hover:text-zinc-900">
                    <Plus size={18} />
                  </button>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pb-6 pr-1">
                  {column.tickets?.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicket(ticket)} />
                  ))}
                  
                  <button 
                    onClick={() => setIsCreatingTask(column.id)}
                    className="group relative flex w-full flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-zinc-200 bg-white/40 p-8 transition-all hover:border-zinc-400 hover:bg-white hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                      <Plus size={22} />
                    </div>
                    <span className="text-[11px] font-black text-zinc-300 group-hover:text-zinc-900 uppercase tracking-widest transition-colors">Ajouter une tâche</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Task Detail Sidebar */}
      {selectedTicket && (
        <TicketDetailSidebar 
          ticket={selectedTicket} 
          comments={comments}
          attachments={attachments}
          onClose={() => setSelectedTicket(null)} 
          onUpdatePriority={handleUpdatePriority}
          onPostComment={handlePostComment}
        />
      )}
    </div>
  );
}

function CommentEditor({ onPost }: { onPost: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Écrivez un message ou de la documentation...' })],
    content: '',
  });

  const handleSubmit = () => {
    if (editor && !editor.isEmpty) {
      onPost(editor.getHTML());
      editor.commands.clearContent();
    }
  };

  return (
    <div className="rounded-[1.8rem] border-2 border-zinc-100 bg-zinc-50/50 p-2 transition-all focus-within:border-zinc-900 focus-within:bg-white focus-within:shadow-xl">
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-5 min-h-[120px] outline-none text-[14px] font-medium text-zinc-700" />
      <div className="flex items-center justify-between border-t border-zinc-100 p-3 mt-1">
        <div className="flex gap-2">
           {/* Add toolbar icons here if needed */}
        </div>
        <button 
          onClick={handleSubmit} 
          className="rounded-2xl bg-zinc-900 px-8 py-3 text-[11px] font-black text-white shadow-xl transition-all hover:scale-105 hover:bg-zinc-800 active:scale-95 flex items-center gap-2"
        >
          <Send size={14} />
          POSTER LE MESSAGE
        </button>
      </div>
    </div>
  );
}

function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const priorityColors = { critical: "bg-rose-50 text-rose-600 border-rose-100", high: "bg-orange-50 text-orange-600 border-orange-100", medium: "bg-blue-50 text-blue-600 border-blue-100", low: "bg-zinc-50 text-zinc-600 border-zinc-100" } as any;

  return (
    <div onClick={onClick} className="group relative overflow-hidden rounded-[2.2rem] border border-zinc-200 bg-white p-7 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-2 cursor-pointer active:scale-[0.98]">
      <div className={`absolute top-0 left-0 h-1.5 w-full ${ticket.priority.toLowerCase() === 'critical' ? 'bg-rose-500 shadow-[0_2px_10px_rgba(244,63,94,0.3)]' : ticket.priority.toLowerCase() === 'high' ? 'bg-orange-500' : ticket.priority.toLowerCase() === 'medium' ? 'bg-blue-500' : 'bg-zinc-300'}`} />
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-2">
          <span className={`rounded-lg border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${priorityColors[ticket.priority.toLowerCase()] || priorityColors.medium}`}>
            {ticket.priority}
          </span>
          <span className="rounded-lg bg-zinc-900 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
            {ticket.type}
          </span>
        </div>
        <MoreHorizontal size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
      </div>
      <h4 className="mb-5 text-[17px] font-bold text-zinc-900 leading-snug group-hover:text-blue-600 transition-colors">{ticket.title}</h4>
      <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
        <div className="flex items-center gap-5 text-zinc-400">
           <div className="flex items-center gap-1.5 group/icon"><MessageSquare size={14} className="group-hover/icon:text-zinc-900 transition-colors" /><span className="text-[10px] font-black">4</span></div>
           <div className="flex items-center gap-1.5 group/icon"><Paperclip size={14} className="group-hover/icon:text-zinc-900 transition-colors" /><span className="text-[10px] font-black">2</span></div>
        </div>
        <div className="flex -space-x-2">
           <div className="h-8 w-8 rounded-full border-2 border-white bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white shadow-lg transition-transform hover:scale-110 hover:z-10">JD</div>
           <div className="h-8 w-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 shadow-sm transition-transform hover:scale-110 hover:z-10">+1</div>
        </div>
      </div>
    </div>
  );
}

function TicketDetailSidebar({ ticket, comments, attachments, onClose, onUpdatePriority, onPostComment }: any) {
  const priorities = ["low", "medium", "high", "critical"];

  return (
    <div className="w-[550px] border-l border-zinc-200 bg-white/95 backdrop-blur-3xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-500">
      <header className="flex items-center justify-between border-b border-zinc-100 p-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">TICKET-REF: {ticket.id.substring(0, 8)}</p>
          <h2 className="text-2xl font-black text-zinc-900 leading-tight">{ticket.title}</h2>
        </div>
        <button onClick={onClose} className="group rounded-full bg-zinc-100 p-4 text-zinc-500 hover:bg-zinc-200 transition-all hover:rotate-90">
          <X size={22} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
        {/* CRITICALITY SELECTOR */}
        <section>
          <label className="mb-6 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Priorité du Ticket (Backend Sync)</label>
          <div className="grid grid-cols-4 gap-4">
            {priorities.map(p => (
              <button 
                key={p} 
                onClick={() => onUpdatePriority(p)} 
                className={`flex items-center justify-center rounded-2xl border-2 py-4 text-[10px] font-black uppercase transition-all ${
                  ticket.priority.toLowerCase() === p 
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] scale-105" 
                  : "border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* COLLABORATION & COMMENTS */}
        <section>
          <label className="mb-7 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Espace Collaboration (Tiptap Editor)</label>
          <div className="mb-10 space-y-8">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 bg-zinc-50/50 rounded-[2rem] border-2 border-dashed border-zinc-100">
                <MessageSquare className="text-zinc-200 mb-3" size={32} />
                <p className="text-[11px] font-black text-zinc-300 uppercase tracking-widest text-center leading-relaxed">Aucune discussion pour le moment.<br/>Soyez le premier à commenter !</p>
              </div>
            ) : comments.map((c: any) => (
              <div key={c.id} className="flex gap-5">
                <div className="h-12 w-12 shrink-0 rounded-[1.25rem] bg-zinc-900 text-sm font-black text-white flex items-center justify-center shadow-lg">
                  {c.author_username?.substring(0, 2).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <div className="rounded-[1.8rem] bg-zinc-100/70 p-6 text-[15px] font-medium text-zinc-700 leading-relaxed shadow-sm border border-white" dangerouslySetInnerHTML={{ __html: c.body }} />
                  <div className="flex items-center gap-3 mt-3 ml-4">
                    <span className="text-[10px] font-black uppercase text-zinc-900">{c.author_username}</span>
                    <span className="text-[10px] font-bold text-zinc-400">• {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <CommentEditor onPost={onPostComment} />
        </section>

        {/* ATTACHMENTS */}
        <section>
          <div className="mb-7 flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Documents & Ressources</label>
            <button className="flex items-center gap-2.5 rounded-[1.2rem] bg-zinc-100 px-6 py-3 text-[10px] font-black text-zinc-600 hover:bg-zinc-200 transition-all shadow-sm">
              <Plus size={16} /> AJOUTER UN FICHIER
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {attachments.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-zinc-100 rounded-[2rem] flex flex-col items-center justify-center">
                 <Paperclip className="text-zinc-200 mb-2" size={28} />
                 <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Aucun document joint</p>
              </div>
            ) : attachments.map((a: any) => (
              <div key={a.id} className="flex items-center gap-5 rounded-[2rem] border-2 border-zinc-50 bg-white p-5 transition-all hover:border-zinc-900 group shadow-sm hover:shadow-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-zinc-50 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-inner">
                  <Paperclip size={24} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-[15px] font-black text-zinc-900">{a.file_name}</p>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {a.mime_type?.split('/')[1]?.toUpperCase() || "DOC"} • {Math.round(a.file_size / 1024)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
