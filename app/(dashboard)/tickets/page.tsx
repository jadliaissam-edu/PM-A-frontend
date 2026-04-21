"use client";

import React, { useState } from "react";

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [mentionsOpen, setMentionsOpen] = useState(false);

  const tickets = [
    { id: "PM-1", title: "Mise en place de l'auth JWT", priority: "High", status: "In Progress", assignee: "Hassine", updated: "2h", desc: "Besoin de configurer Passport.js ou simplejwt côté Django. Vérifier les headers CORS." },
    { id: "PM-2", title: "Configuration CORS backend", priority: "Medium", status: "Done", assignee: "Admin", updated: "5h", desc: "Autoriser l'origine localhost:3000 dans les settings Django." },
    { id: "PM-3", title: "Maquettes Dashboard", priority: "Low", status: "To Do", assignee: "Snofy", updated: "1j", desc: "Utiliser Zinc pour le design system." },
    { id: "PM-4", title: "Intégration Stripe", priority: "High", status: "Blocked", assignee: "Hassine", updated: "2j", desc: "En attente des clés API production." },
    { id: "PM-5", title: "Refonte de la sidebar", priority: "Medium", status: "In Progress", assignee: "Admin", updated: "1h", desc: "Ajouter les nouveaux liens vers les pages analytics." },
  ];

  const comments = [
    { id: 1, user: "Admin", text: "On devrait utiliser @Hassine pour cette partie.", time: "1h", reactions: ["👍", "🔥"] },
    { id: 2, user: "Snofy", text: "C'est déjà en cours. J'ai ajouté le middleware.", time: "45 min", reactions: ["❤️"] },
  ];

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNewComment(val);
    if (val.endsWith("@")) {
      setMentionsOpen(true);
    } else {
      setMentionsOpen(false);
    }
  };

  const insertMention = (name: string) => {
    setNewComment(newComment + name + " ");
    setMentionsOpen(false);
  };

  return (
    <main className="relative min-h-screen bg-zinc-100 p-8 overflow-hidden">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Tickets & Tâches</h1>
          <p className="text-sm text-zinc-500">Gérez l&apos;ensemble des tickets du projet</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
            Export CSV
          </button>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition">
            + Nouveau Ticket
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-zinc-200">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-2.5 text-zinc-400">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un ticket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 outline-none focus:border-zinc-900 transition text-sm"
          />
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-zinc-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">ID</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Titre</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Priorité</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Statut</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Assigné</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {tickets.map((ticket) => (
              <tr 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className="hover:bg-zinc-50 transition cursor-pointer"
              >
                <td className="px-6 py-4 text-sm font-mono font-bold text-zinc-400">{ticket.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-zinc-900">{ticket.title}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ticket.priority === 'High' ? 'bg-red-50 text-red-600' : 
                    ticket.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ticket.status === 'Done' ? 'bg-green-100 text-green-700' :
                    ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    ticket.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-zinc-200 text-zinc-600'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-900 text-[10px] font-bold text-white flex items-center justify-center">
                      {ticket.assignee.charAt(0)}
                    </div>
                    <span className="text-sm text-zinc-700">{ticket.assignee}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Detail Slider */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="w-full max-w-xl h-full bg-white shadow-2xl border-l border-zinc-200 p-8 overflow-y-auto animate-in slide-in-from-right duration-500"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{selectedTicket.id}</span>
                <h2 className="text-2xl font-bold text-zinc-900 mt-1">{selectedTicket.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                 <div className="flex-1 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                   <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Assigné</p>
                   <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-zinc-900 text-[10px] font-bold text-white flex items-center justify-center">
                        {selectedTicket.assignee.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{selectedTicket.assignee}</span>
                   </div>
                 </div>
                 <div className="flex-1 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                   <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Statut</p>
                   <span className="text-xs font-bold text-zinc-900">{selectedTicket.status}</span>
                 </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 mb-2">Description</h3>
                <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                  {selectedTicket.desc}
                </p>
              </div>

              {/* Collaborative Comments */}
              <div className="border-t border-zinc-100 pt-8">
                <h3 className="text-lg font-bold text-zinc-900 mb-6">Commentaires</h3>
                
                <div className="space-y-6 mb-8">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600 shrink-0">
                        {c.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-bold text-zinc-900">{c.user}</span>
                          <span className="text-[10px] text-zinc-400">{c.time}</span>
                        </div>
                        <p className="text-sm text-zinc-600 bg-zinc-50 p-3 rounded-2xl rounded-tl-none border border-zinc-100">
                          {c.text}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {c.reactions.map((r, i) => (
                            <button key={i} className="text-xs bg-white border border-zinc-200 px-2 py-0.5 rounded-full hover:border-zinc-900 transition">
                              {r} <span className="text-[10px] font-bold ml-1">1</span>
                            </button>
                          ))}
                          <button className="text-[10px] text-zinc-400 hover:text-zinc-900 font-bold uppercase tracking-wider">Réagir</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* New Comment Input */}
                <div className="relative">
                  <textarea 
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Laissez un commentaire... (utilisez @ pour mentionner)"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-sm outline-none focus:border-zinc-900 transition min-h-[100px]"
                  />
                  
                  {/* Mentions Dropdown */}
                  {mentionsOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                       <p className="p-2 text-[10px] font-bold text-zinc-400 border-b border-zinc-50 uppercase">Mentionner</p>
                       {['Hassine', 'Snofy', 'Admin'].map(u => (
                         <button 
                          key={u}
                          onClick={() => insertMention(u)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 transition border-b border-zinc-50 last:border-0"
                         >
                           {u}
                         </button>
                       ))}
                    </div>
                  )}

                  <div className="flex justify-end mt-2">
                    <button className="bg-zinc-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition shadow-lg shadow-zinc-900/10">
                      Envoyer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
