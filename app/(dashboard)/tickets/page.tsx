"use client";

import React, { useEffect, useState } from "react";
import { ticketService } from "@/services/ticket.service";
import { Ticket, Project } from "@/services/project.service";
import { 
  Loader2, MessageSquare, Paperclip, Clock, CheckCircle2, AlertCircle, 
  Search, Filter, Plus, ChevronRight, X, Send, MoreHorizontal 
} from "lucide-react";
import { api } from "@/lib/api";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);

  // Board-wide progress calculation
  const totalTickets = tickets.length;
  const doneTickets = tickets.filter(t => t.status === 'done' || t.status === 'completed').length;
  const progressPercent = totalTickets > 0 ? (doneTickets / totalTickets) * 100 : 0;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Sync ticket details when selected
  useEffect(() => {
    if (selectedTicket) {
      const fetchExtras = async () => {
        try {
          const [cRes, aRes] = await Promise.all([
            api.get(`/projects/${selectedTicket.project}/tickets/${selectedTicket.id}/comments/`),
            api.get(`/projects/${selectedTicket.project}/tickets/${selectedTicket.id}/attachments/`)
          ]);
          setComments(cRes.data || []);
          setAttachments(aRes.data || []);
        } catch (e) {
          console.error("Error fetching extras", e);
        }
      };
      fetchExtras();
    }
  }, [selectedTicket]);

  const handlePostComment = async (html: string) => {
    if (!selectedTicket || !html.trim()) return;
    try {
      const res = await api.post(`/projects/${selectedTicket.project}/tickets/${selectedTicket.id}/comments/`, {
        body: html
      });
      setComments([res.data, ...comments]);
    } catch (e) {
      console.error("Error posting comment", e);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <Loader2 className="animate-spin text-zinc-900" size={32} />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#F9FAFB] overflow-hidden">
      {/* PREMIUM BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(240,244,255,1)_0%,_rgba(255,255,255,1)_100%)]" />
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[100px]" />
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* FIXED PROGRESS CURSOR */}
      <div className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-zinc-900 transition-all duration-1000 ease-out z-[100] shadow-lg" style={{ width: `${progressPercent}%` }} />

      <div className="p-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">Tickets & Tâches</h1>
            <p className="text-sm font-bold text-zinc-400 mt-2 uppercase tracking-widest">
              Gestion de l&apos;ensemble des flux • {Math.round(progressPercent)}% Complété
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-black text-zinc-700 shadow-sm hover:bg-zinc-50 transition-all">
              EXPORT CSV
            </button>
            <button className="flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-black text-white shadow-xl hover:bg-zinc-800 transition-all active:scale-95">
              <Plus size={18} />
              NOUVEAU TICKET
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-8 flex gap-6 items-center">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Rechercher par titre, ID ou contenu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-white border border-zinc-200 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 rounded-[1.5rem] bg-white border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition shadow-sm">
            <Filter size={18} className="text-zinc-400" />
            FILTRES
          </button>
        </div>

        {/* Table View */}
        <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-zinc-200/40 border border-white/60 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Référence</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Désignation</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Criticité</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Avancement</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Responsable</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredTickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  onClick={() => setSelectedTicket(ticket)}
                  className="group hover:bg-white/50 transition cursor-pointer"
                >
                  <td className="px-10 py-7">
                    <span className="text-xs font-mono font-black text-zinc-400 group-hover:text-zinc-900 transition-colors">
                      {ticket.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{ticket.title}</span>
                      <span className="text-[10px] font-black text-zinc-400 uppercase mt-1 tracking-tighter">{ticket.type}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      ticket.priority === 'critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                      ticket.priority === 'high' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                      ticket.priority === 'medium' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-zinc-50 text-zinc-600 border-zinc-100'
                    }`}>
                      <div className={`h-1 w-1 rounded-full ${
                         ticket.priority === 'critical' ? 'bg-rose-600' : 'bg-current'
                      }`} />
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] font-black uppercase ${
                      ticket.status === 'done' ? 'bg-emerald-50 text-emerald-600' :
                      ticket.status === 'in_progress' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-400'
                    }`}>
                      {ticket.status === 'done' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-2xl bg-zinc-900 text-[10px] font-black text-white flex items-center justify-center shadow-lg">
                        {ticket.assignments?.[0]?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="text-xs font-bold text-zinc-700">{ticket.assignments?.[0]?.username || "Non assigné"}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Sidebar Integration */}
      {selectedTicket && (
        <TicketDetailSidebar 
          ticket={selectedTicket}
          comments={comments}
          attachments={attachments}
          onClose={() => setSelectedTicket(null)}
          onPostComment={handlePostComment}
          onUpdatePriority={(p: string) => {
             api.patch(`/projects/${selectedTicket.project}/tickets/${selectedTicket.id}/`, { priority: p })
               .then(() => {
                 setSelectedTicket({...selectedTicket, priority: p});
                 ticketService.getTickets().then(setTickets);
               });
          }}
        />
      )}
    </main>
  );
}

function CommentEditor({ onPost }: { onPost: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Collaborer sur cette tâche...' })],
    content: '',
  });

  return (
    <div className="rounded-[2rem] border-2 border-zinc-100 bg-zinc-50/50 p-2 transition-all focus-within:border-zinc-900 focus-within:bg-white focus-within:shadow-2xl">
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-5 min-h-[140px] outline-none text-[14px] font-medium text-zinc-700 leading-relaxed" />
      <div className="flex items-center justify-between border-t border-zinc-100 p-3 mt-1">
        <div />
        <button 
          onClick={() => { if(editor && !editor.isEmpty) { onPost(editor.getHTML()); editor.commands.clearContent(); } }}
          className="rounded-2xl bg-zinc-900 px-8 py-3.5 text-[11px] font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          ENVOYER LE MESSAGE
        </button>
      </div>
    </div>
  );
}

function TicketDetailSidebar({ ticket, comments, attachments, onClose, onPostComment, onUpdatePriority }: any) {
  const priorities = ["low", "medium", "high", "critical"];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div onClick={onClose} className="absolute inset-0 -z-10" />
      <div className="w-full max-w-[550px] h-full bg-white/95 backdrop-blur-3xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
        
        <header className="flex items-center justify-between border-b border-zinc-100 p-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">TICKET-REF: {ticket.id.substring(0, 8).toUpperCase()}</p>
            <h2 className="text-3xl font-black text-zinc-900 leading-tight">{ticket.title}</h2>
          </div>
          <button onClick={onClose} className="group rounded-full bg-zinc-100 p-4 text-zinc-500 hover:bg-zinc-200 transition-all hover:rotate-90">
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 space-y-16 no-scrollbar pb-32">
          {/* CRITICALITY */}
          <section>
            <label className="mb-6 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Priorité de Traitement</label>
            <div className="grid grid-cols-4 gap-4">
              {priorities.map(p => (
                <button 
                  key={p} 
                  onClick={() => onUpdatePriority(p)} 
                  className={`flex items-center justify-center rounded-2xl border-2 py-5 text-[10px] font-black uppercase transition-all ${
                    ticket.priority.toLowerCase() === p 
                    ? "border-zinc-900 bg-zinc-900 text-white shadow-2xl scale-105" 
                    : "border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>

          {/* CHAT / COMMENTS */}
          <section>
            <label className="mb-8 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Fil de Discussion (Backend Sync)</label>
            <div className="space-y-8 mb-12">
              {comments.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-zinc-100 rounded-[2.5rem] flex flex-col items-center justify-center bg-white/50">
                  <MessageSquare className="text-zinc-200 mb-2" size={32} />
                  <p className="text-[11px] font-black text-zinc-300 uppercase tracking-widest">Aucun message</p>
                </div>
              ) : comments.map((c: any) => (
                <div key={c.id} className="flex gap-5">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-zinc-900 text-sm font-black text-white flex items-center justify-center shadow-lg">
                    {c.author_username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="rounded-[2rem] bg-white border border-zinc-100 p-6 text-[15px] font-medium text-zinc-700 leading-relaxed shadow-sm group-hover:shadow-md transition-shadow" dangerouslySetInnerHTML={{ __html: c.body }} />
                    <div className="mt-3 ml-4 flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase text-zinc-900">{c.author_username}</span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                        {new Date(c.created_at).toLocaleDateString()} • {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CommentEditor onPost={onPostComment} />
          </section>

          {/* DOCUMENTS */}
          <section>
            <div className="mb-8 flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Documents attachés</label>
              <button className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-5 py-2.5 text-[10px] font-black text-zinc-600 hover:bg-zinc-200 transition-all">
                <Plus size={16} /> AJOUTER
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {attachments.length === 0 ? (
                <div className="p-10 border-2 border-dashed border-zinc-100 rounded-[2rem] flex flex-col items-center justify-center">
                   <Paperclip className="text-zinc-200 mb-2" size={24} />
                   <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Aucun document</p>
                </div>
              ) : attachments.map((a: any) => (
                <div key={a.id} className="flex items-center gap-5 rounded-[2rem] border-2 border-zinc-50 bg-white p-6 transition-all hover:border-zinc-900 group shadow-sm hover:shadow-xl">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-inner">
                    <Paperclip size={24} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-base font-black text-zinc-900">{a.file_name}</p>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Fichier système • {Math.round(a.file_size/1024)} KB</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
