"use client";

import React, { useState } from "react";

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(1);

  const contacts = [
    { id: 1, name: "Hassine Trigui", avatar: "HT", status: "online", lastMsg: "On termine la revue demain ?" },
    { id: 2, name: "Admin Projeta", avatar: "AP", status: "away", lastMsg: "CORS est configuré sur le backend." },
    { id: 3, name: "Snofy", avatar: "SN", status: "offline", lastMsg: "Salut, tu as vu mon mail ?" },
  ];

  const messages = [
    { id: 1, sender: "assistant", text: "Salut ! Comment avance le projet ?", time: "10:00" },
    { id: 2, sender: "me", text: "Ça progresse bien, j'ai fini les pages Board et Sprint.", time: "10:05" },
    { id: 3, sender: "assistant", text: "Super ! N'oublie pas de vérifier les redirections.", time: "10:06" },
    { id: 4, sender: "me", text: "C'est déjà fait, j'attaque le chat maintenant.", time: "10:10" },
  ];

  return (
    <main className="flex h-screen bg-zinc-100 overflow-hidden">
      {/* Sidebar: Contacts */}
      <aside className="w-80 flex flex-col border-r border-zinc-200 bg-white">
        <div className="p-6 border-b border-zinc-100">
          <h1 className="text-xl font-bold text-zinc-900">Messages</h1>
          <div className="mt-4 relative">
            <span className="absolute left-3 top-2.5 text-zinc-400">🔍</span>
            <input
              type="text"
              placeholder="Rechercher une discussion..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-sm outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`w-full flex items-center gap-4 p-4 transition hover:bg-zinc-50 ${activeChat === contact.id ? "bg-zinc-100/50 border-r-2 border-zinc-900" : ""}`}
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-zinc-900 text-sm font-bold text-white flex items-center justify-center">
                  {contact.avatar}
                </div>
                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  contact.status === 'online' ? 'bg-green-500' : 
                  contact.status === 'away' ? 'bg-orange-500' : 'bg-zinc-300'
                }`}></span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">{contact.name}</p>
                <p className="text-xs text-zinc-500 truncate">{contact.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main: Chat View */}
      <section className="flex-1 flex flex-col bg-zinc-50/50">
        {/* Top Header */}
        <header className="px-8 py-4 border-b border-zinc-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-zinc-900 text-xs font-bold text-white flex items-center justify-center">
              {contacts.find(c => c.id === activeChat)?.avatar}
            </div>
            <div>
              <p className="font-bold text-zinc-900">{contacts.find(c => c.id === activeChat)?.name}</p>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">En ligne</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="text-zinc-400 hover:text-zinc-900">📞</button>
            <button className="text-zinc-400 hover:text-zinc-900">🎥</button>
            <button className="text-zinc-400 hover:text-zinc-900">🛡️</button>
          </div>
        </header>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md rounded-2xl p-4 shadow-sm ${
                m.sender === 'me' 
                  ? 'bg-zinc-900 text-white rounded-br-none' 
                  : 'bg-white text-zinc-900 border border-zinc-200 rounded-bl-none'
              }`}>
                <p className="text-sm">{m.text}</p>
                <p className={`mt-2 text-[10px] ${m.sender === 'me' ? 'text-zinc-400' : 'text-zinc-400'}`}>
                  {m.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <footer className="p-6 bg-white border-t border-zinc-200">
          <div className="flex items-center gap-4 bg-zinc-100 p-2 rounded-2xl">
            <button className="p-2 text-zinc-400 hover:text-zinc-900 transition">📎</button>
            <input
              type="text"
              placeholder="Écrivez votre message ici..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-900"
            />
            <button className="p-2 text-zinc-400 hover:text-zinc-900 transition">😀</button>
            <button className="h-10 w-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center transition hover:bg-zinc-800">
              🚀
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
