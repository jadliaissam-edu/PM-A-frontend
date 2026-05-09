"use client";

import { useState } from "react";
import { CirclePlus, MoreHorizontal, Search, SendHorizonal } from "lucide-react";
import { Avatar, Chip, GhostButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";

type Contact = {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  last: string;
  unread: number;
  pinned: boolean;
};
type Message = {
  id: number;
  from: string;
  mine: boolean;
  text: string;
  time: string;
};

const contacts: Contact[] = [
  { id: 1, name: "Hassine Trigui", avatar: "HT", status: "online", last: "On termine la revue demain ?", unread: 2, pinned: true },
  { id: 2, name: "Admin Projeta", avatar: "AP", status: "away", last: "CORS est configure sur le backend.", unread: 0, pinned: false },
  { id: 3, name: "Snofy", avatar: "SN", status: "offline", last: "Salut, tu as vu mon mail ?", unread: 1, pinned: false },
];

const messages: Message[] = [
  { id: 1, from: "HT", mine: false, text: "Salut ! Comment avance le projet ?", time: "10:00" },
  { id: 2, from: "AA", mine: true, text: "Ca progresse bien, j'ai fini les pages Board et Sprint.", time: "10:05" },
  { id: 3, from: "HT", mine: false, text: "Super. N'oublie pas de verifier les redirections.", time: "10:06" },
  { id: 4, from: "AA", mine: true, text: "C'est fait. Je passe sur la coherence produit.", time: "10:10" },
];

export default function ChatPage() {
  const [threads, setThreads] = useState<Contact[]>(contacts);
  const [activeChat, setActiveChat] = useState(1);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [threadOpen, setThreadOpen] = useState<"settings" | "new" | null>(null);
  const [filter, setFilter] = useState<"All" | "Unread" | "Pinned">("All");
  const [newThreadName, setNewThreadName] = useState("");
  const [notice, setNotice] = useState("");
  const [threadMessages, setThreadMessages] = useState<Record<number, Message[]>>({ 1: messages, 2: messages.slice(0, 2), 3: messages.slice(1, 3) });
  const activeContact = threads.find((contact) => contact.id === activeChat) || threads[0];
  const visibleContacts = threads
    .filter((contact) => contact.name.toLowerCase().includes(query.toLowerCase()) || contact.last.toLowerCase().includes(query.toLowerCase()))
    .filter((contact) => filter === "All" || (filter === "Unread" ? contact.unread > 0 : contact.pinned));
  const activeMessages = threadMessages[activeChat] || [];
  const openThread = (contactId: number) => {
    setActiveChat(contactId);
    setThreads((current) => current.map((contact) => contact.id === contactId ? { ...contact, unread: 0 } : contact));
  };
  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setThreadMessages((current) => ({
      ...current,
      [activeChat]: [...(current[activeChat] || []), { id: Date.now(), from: "AA", mine: true, text, time: "now" }],
    }));
    setThreads((current) => current.map((contact) => contact.id === activeChat ? { ...contact, last: text } : contact));
    setDraft("");
  };
  const createThread = () => {
    const name = newThreadName.trim();
    if (!name) return;
    const avatar = name.split(" ").map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase() || "NT";
    const thread: Contact = { id: Date.now(), name, avatar, status: "online", last: "New local thread started.", unread: 0, pinned: false };
    setThreads((current) => [thread, ...current]);
    setThreadMessages((current) => ({ ...current, [thread.id]: [] }));
    setActiveChat(thread.id);
    setNewThreadName("");
    setThreadOpen(null);
    setNotice("Thread created locally.");
  };
  const togglePinned = () => {
    setThreads((current) => current.map((contact) => contact.id === activeChat ? { ...contact, pinned: !contact.pinned } : contact));
    setNotice("Thread pin state updated locally.");
  };
  const clearThread = () => {
    setThreadMessages((current) => ({ ...current, [activeChat]: [] }));
    setNotice("Thread messages cleared locally.");
    setThreadOpen(null);
  };

  return (
    <WorkspacePage>
      <WorkspaceHeader title="Team chat" subtitle="Everything / conversations / delivery coordination" badge={`${threads.length} threads`} actions={<GhostButton onClick={() => setThreadOpen("new")}><span className="inline-flex items-center gap-1"><CirclePlus size={13} /> Thread</span></GhostButton>} />
      {notice && <button onClick={() => setNotice("")} className="mb-3 w-full rounded-[8px] border border-[#d7f4e8] bg-[#ecfff6] px-3 py-2 text-left text-xs font-black text-[#008f65]">{notice}</button>}
      <div className="grid h-[calc(100vh-250px)] min-h-[560px] overflow-hidden rounded-[10px] border border-[#dfe3e8] bg-white shadow-sm xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-r border-[#dfe3e8] bg-[#fbfbfc]">
          <div className="border-b border-[#edf0f3] p-3">
            <div className="flex h-8 items-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-white px-2.5">
              <Search size={14} className="text-[#8f96a3]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-xs font-semibold outline-none placeholder:text-[#9aa1ad]" placeholder="Search conversations..." />
            </div>
            <div className="mt-2 flex gap-1">
              {(["All", "Unread", "Pinned"] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`h-7 rounded-[7px] px-2.5 text-[11px] font-black ${filter === item ? "border border-[#dfe3e8] bg-white text-[#20242a]" : "text-[#68707d] hover:bg-white"}`}>{item}</button>)}
            </div>
          </div>
          {visibleContacts.map((contact) => (
            <button key={contact.id} onClick={() => openThread(contact.id)} className={`flex w-full items-center gap-3 border-b border-[#edf0f3] px-3 py-3 text-left hover:bg-white ${activeChat === contact.id ? "bg-[#f3efff] shadow-[inset_4px_0_0_#7b68ee]" : ""}`}>
              <Avatar initials={contact.avatar} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-black text-[#20242a]">{contact.name}</p>
                  <div className="flex items-center gap-1">{contact.pinned && <span className="text-[10px] font-black text-[#7b68ee]">Pin</span>}{contact.unread > 0 && <span className="rounded-full bg-[#7b68ee] px-1.5 text-[10px] font-black text-white">{contact.unread}</span>}<span className={`h-2 w-2 rounded-full ${contact.status === "online" ? "bg-[#00b884]" : contact.status === "away" ? "bg-[#f8ae00]" : "bg-[#c8cdd4]"}`} /></div>
                </div>
                <p className="truncate text-xs font-semibold text-[#8f96a3]">{contact.last}</p>
              </div>
            </button>
          ))}
          {visibleContacts.length === 0 && <p className="p-4 text-sm font-bold text-[#8f96a3]">No conversations match.</p>}
        </aside>
        <section className="flex min-w-0 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-[#edf0f3] px-4">
            <div className="flex items-center gap-3">
              <Avatar initials={activeContact.avatar} />
              <div>
                <p className="text-sm font-black text-[#20242a]">{activeContact.name}</p>
                <Chip tone={activeContact.status === "online" ? "green" : "yellow"}>{activeContact.status}</Chip>
              </div>
            </div>
            <button onClick={() => setThreadOpen("settings")} className="flex h-8 w-8 items-center justify-center rounded-[7px] text-[#8f96a3] hover:bg-[#f7f8fb]"><MoreHorizontal size={16} /></button>
          </header>
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#f7f8fb] p-4">
            {activeMessages.map((message) => (
              <div key={message.id} className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-md rounded-[10px] border px-3 py-2 shadow-sm ${message.mine ? "border-[#7b68ee] bg-[#7b68ee] text-white" : "border-[#dfe3e8] bg-white text-[#20242a]"}`}>
                  <p className="text-sm font-semibold">{message.text}</p>
                  <p className={`mt-1 text-[10px] font-black ${message.mine ? "text-white/60" : "text-[#8f96a3]"}`}>{message.from} · {message.time}</p>
                </div>
              </div>
            ))}
            {activeMessages.length === 0 && <div className="flex h-full items-center justify-center text-sm font-bold text-[#8f96a3]">No messages yet. Start the thread below.</div>}
          </div>
          <footer className="border-t border-[#edf0f3] bg-white p-3">
            <div className="flex items-center gap-2 rounded-[9px] border border-[#dfe3e8] bg-[#f7f8fb] p-2">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Write a message..." className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold outline-none placeholder:text-[#9aa1ad]" />
              <button onClick={sendMessage} className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-[#7b68ee] text-white"><SendHorizonal size={15} /></button>
            </div>
          </footer>
        </section>
      </div>
      {threadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setThreadOpen(null)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">{threadOpen === "new" ? "New thread" : "Thread settings"}</h2>
              <button onClick={() => setThreadOpen(null)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            {threadOpen === "new" ? (
              <div className="space-y-3">
                <input value={newThreadName} onChange={(event) => setNewThreadName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createThread(); }} autoFocus placeholder="Thread name" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[#7b68ee]" />
                <div className="flex justify-end"><button onClick={createThread} className="h-8 rounded-[7px] bg-[#7b68ee] px-3.5 text-xs font-black text-white">Create</button></div>
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={togglePinned} className="h-10 w-full rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] text-sm font-black text-[#20242a] hover:bg-white">{activeContact.pinned ? "Unpin thread" : "Pin thread"}</button>
                <button onClick={clearThread} className="h-10 w-full rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] text-sm font-black text-[#20242a] hover:bg-white">Clear local messages</button>
              </div>
            )}
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
