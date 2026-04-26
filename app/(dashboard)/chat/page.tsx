"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  MessageSquare, 
  Hash, 
  Plus, 
  Search, 
  Send, 
  MoreVertical,
  Paperclip,
  Smile,
  Circle
} from "lucide-react";
import { communicationService, ChatChannel, ChatMessage } from "@/services/communication.service";
import { orgService } from "@/services/org.service";
import { authService, UserProfile } from "@/services/auth.service";

export default function ChatPage() {
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initChat = async () => {
      try {
        const profile = await authService.getProfile();
        setCurrentUser(profile);

        const activeOrgId = localStorage.getItem("activeOrgId");
        if (activeOrgId) {
          const channelsData = await communicationService.getChannels(activeOrgId);
          setChannels(channelsData);
          if (channelsData.length > 0) setActiveChannel(channelsData[0]);
          
          setUsers([
            { name: "Aya Achiban", status: "online", avatar: "AA" },
            { name: "Sarah Connor", status: "online", avatar: "SC" },
            { name: "John Doe", status: "offline", avatar: "JD" },
            { name: "Marcus Wright", status: "busy", avatar: "MW" }
          ]);
        }
      } catch (error) {
        console.error("Failed to initialize chat", error);
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (activeChannel) {
      const fetchMessages = async () => {
        try {
          const data = await communicationService.getMessages({ channelId: activeChannel.id });
          setMessages(data);
        } catch (e) {}
      };
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [activeChannel]);

  const handleSendMessage = async () => {
    if (!message || !activeChannel) return;
    try {
      const newMsg = await communicationService.sendMessage({
        channel: activeChannel.id,
        content: message,
        is_direct: false
      });
      setMessages([...messages, newMsg]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (loading) {
      return <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent"></div></div>;
  }

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-black/5 animate-in fade-in duration-700">
      {/* Sidebar - Channels & People */}
      <aside className="w-72 border-r border-zinc-100 bg-zinc-50/50">
        <div className="flex h-full flex-col">
          <div className="p-6">
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Team Chat</h2>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input 
                type="text" 
                placeholder="Rechercher..."
                className="w-full rounded-xl bg-zinc-100/50 pl-9 pr-4 py-2 text-xs font-bold outline-none transition focus:bg-white focus:ring-1 focus:ring-zinc-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-8 no-scrollbar">
            {/* Channels List */}
            <div>
              <div className="mb-2 flex items-center justify-between px-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Canaux</span>
                <button className="text-zinc-400 hover:text-zinc-900 transition"><Plus size={14} /></button>
              </div>
              <div className="space-y-0.5">
                {channels.map((ch) => (
                  <button 
                    key={ch.id}
                    onClick={() => setActiveChannel(ch)}
                    className={`flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all ${activeChannel?.id === ch.id ? "bg-zinc-950 text-white shadow-lg shadow-black/10" : "text-zinc-600 hover:bg-zinc-100"}`}
                  >
                    <Hash size={16} className={activeChannel?.id === ch.id ? "text-zinc-400" : "text-zinc-300"} />
                    <span className="font-bold">{ch.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Members List */}
            <div>
              <div className="mb-2 flex items-center justify-between px-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Membres</span>
              </div>
              <div className="space-y-0.5 pb-6">
                {users.map((u) => (
                  <button 
                    key={u.name}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-200 text-[10px] font-black text-zinc-600 ring-1 ring-white shadow-sm">
                        {u.avatar}
                      </div>
                      <span className="font-bold">{u.name}</span>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${u.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col bg-white">
        {/* Chat Header */}
        <header className="flex items-center justify-between border-b border-zinc-100 px-8 py-4">
          {activeChannel ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 shadow-sm">
                <Hash size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 capitalize">{activeChannel.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
                  <Circle size={6} fill="currentColor" />
                  {users.length} Membres
                </p>
              </div>
            </div>
          ) : (
            <div>Sélectionnez un canal</div>
          )}
          <button className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition">
            <MoreVertical size={20} />
          </button>
        </header>

        {/* Messages Flow */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-zinc-50/20">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-4 animate-in fade-in slide-in-from-left-2 duration-500">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 text-xs font-black text-zinc-500">
                {(msg.sender_username || "??").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-zinc-900">{msg.sender_username}</span>
                  <span className="text-[10px] font-black text-zinc-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="mt-1.5 max-w-2xl rounded-2xl rounded-tl-none bg-white p-4 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-100 leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && !loading && (
              <div className="flex h-full flex-col items-center justify-center text-zinc-400 opacity-50">
                  <MessageSquare size={48} className="mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">Aucun message ici...</p>
              </div>
          )}
        </div>

        {/* Message Input */}
        <footer className="border-t border-zinc-100 p-6">
          <div className="relative">
            <input 
              type="text"
              placeholder={activeChannel ? `Envoyer un message dans #${activeChannel.name}` : "Sélectionnez un canal"}
              disabled={!activeChannel}
              className="w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 px-6 py-4 pr-32 text-sm font-bold text-zinc-900 outline-none transition focus:border-zinc-950 focus:bg-white shadow-inner shadow-black/[0.02] disabled:opacity-50"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              <button className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 transition"><Paperclip size={18} /></button>
              <button className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 transition"><Smile size={18} /></button>
              <button 
                onClick={handleSendMessage}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-xl shadow-black/10 transition hover:bg-black active:scale-90"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
