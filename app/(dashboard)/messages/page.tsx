"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Search, 
  Send, 
  MoreVertical,
  Paperclip,
  Smile,
  Circle,
  Phone,
  Video,
  Info
} from "lucide-react";
import { communicationService, ChatMessage } from "@/services/communication.service";
import { authService, UserProfile } from "@/services/auth.service";

export default function MessagesPage() {
  const [activeUser, setActiveUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const profile = await authService.getProfile();
        setCurrentUser(profile);
        
        // Mocking users for now as we don't have a direct "list all users" endpoint 
        // that is scoped to the current context easily without refactoring more backend.
        // In reality, you'd fetch from /api/users/
        setUsers([
          { id: "1", name: "Sarah Connor", status: "online", avatar: "SC", lastMsg: "See you at the meeting!" },
          { id: "2", name: "John Doe", status: "offline", avatar: "JD", lastMsg: "Did you review the PR?" },
          { id: "3", name: "Marcus Wright", status: "busy", avatar: "MW", lastMsg: "I'm working on the docs" }
        ]);
        setActiveUser({ id: "1", name: "Sarah Connor", status: "online", avatar: "SC" });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (activeUser && currentUser) {
      const fetchMessages = async () => {
         try {
           const data = await communicationService.getMessages({ receiverId: activeUser.id });
           setMessages(data);
         } catch (e) {}
      };
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [activeUser, currentUser]);

  const handleSendMessage = async () => {
    if (!message || !activeUser) return;
    try {
      const newMsg = await communicationService.sendMessage({
        receiver: activeUser.id,
        content: message,
        is_direct: true
      });
      setMessages([...messages, newMsg]);
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent"></div></div>;

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-black/5 animate-in fade-in duration-700">
      {/* Sidebar - Contacts */}
      <aside className="w-80 border-r border-zinc-100 bg-zinc-50/50">
        <div className="flex h-full flex-col">
          <div className="p-6">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Messages</h2>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input 
                type="text" 
                placeholder="Rechercher une conversation..."
                className="w-full rounded-xl bg-zinc-100/50 pl-9 pr-4 py-2.5 text-xs font-bold outline-none transition focus:bg-white focus:ring-1 focus:ring-zinc-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1 no-scrollbar">
            {users.map((u) => (
              <button 
                key={u.id}
                onClick={() => setActiveUser(u)}
                className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 transition-all ${activeUser?.id === u.id ? "bg-white shadow-lg shadow-black/5 ring-1 ring-zinc-200" : "hover:bg-zinc-100/50"}`}
              >
                <div className="relative shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-black text-white shadow-md">
                    {u.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-zinc-50 ${u.status === 'online' ? 'bg-emerald-500' : u.status === 'busy' ? 'bg-amber-500' : 'bg-zinc-300'}`} />
                </div>
                <div className="flex-1 overflow-hidden text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-900">{u.name}</span>
                  </div>
                  <p className="truncate text-xs font-medium text-zinc-500">{u.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Messaging Area */}
      <main className="flex flex-1 flex-col bg-white">
        {/* Chat Header */}
        <header className="flex items-center justify-between border-b border-zinc-100 px-8 py-4">
          {activeUser ? (
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-xs font-black text-zinc-900 shadow-sm">
                  {activeUser.avatar}
              </div>
              <div>
                  <h3 className="text-sm font-bold text-zinc-900">{activeUser.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${activeUser.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{activeUser.status === 'online' ? 'En ligne' : 'Hors ligne'}</span>
                  </div>
              </div>
            </div>
          ) : (
            <div>Sélectionnez une conversation</div>
          )}
          <div className="flex items-center gap-2">
            <button className="rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-50 transition"><Phone size={18} /></button>
            <button className="rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-50 transition"><Video size={18} /></button>
            <div className="mx-2 h-6 w-px bg-zinc-100" />
            <button className="rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-50 transition"><Info size={18} /></button>
            <button className="rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-50 transition"><MoreVertical size={18} /></button>
          </div>
        </header>

        {/* Conversation Flow */}
        <div className="flex-1 overflow-y-auto p-10 space-y-6 no-scrollbar bg-zinc-50/20">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === currentUser?.id ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in-95 duration-500`}>
              <div className={`max-w-md rounded-2xl p-4 text-sm font-medium shadow-sm ring-1 ring-black/5 ${msg.sender === currentUser?.id ? 'bg-zinc-950 text-white rounded-br-none' : 'bg-white text-zinc-800 rounded-bl-none'}`}>
                 <p>{msg.content}</p>
                 <p className={`mt-1.5 text-[10px] font-black uppercase tracking-widest ${msg.sender === currentUser?.id ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-zinc-400 opacity-50">
                  <MessageSquare size={48} className="mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">Commencez la conversation...</p>
              </div>
          )}
        </div>

        {/* Message Input */}
        <footer className="p-8">
          <div className="relative">
            <input 
              type="text"
              placeholder={activeUser ? `Message pour ${activeUser.name}...` : "Sélectionnez un contact"}
              disabled={!activeUser}
              className="w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 px-6 py-5 pr-36 text-sm font-bold text-zinc-900 outline-none transition focus:border-zinc-950 focus:bg-white shadow-xl shadow-black/[0.02] disabled:opacity-50"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
              <button className="rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-100 transition"><Paperclip size={20} /></button>
              <button className="rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-100 transition"><Smile size={20} /></button>
              <button 
                onClick={handleSendMessage}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-2xl shadow-black/20 transition hover:bg-black active:scale-90"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
