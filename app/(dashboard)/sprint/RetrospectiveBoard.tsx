"use client";

import { useEffect, useState } from "react";

type Card = { id: string; text: string };

export default function RetrospectiveBoard({ projectId }: { projectId: string | null }) {
  const storageKey = `retro:${projectId || 'global'}`;
  const [columns, setColumns] = useState<{ title: string; cards: Card[] }[]>([
    { title: "What went well", cards: [] },
    { title: "To improve", cards: [] },
    { title: "Action items", cards: [] },
  ]);
  const [newCardText, setNewCardText] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setColumns(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, [storageKey]);

  const save = (next: any) => {
    setColumns(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch (e) {}
  };

  const addCard = () => {
    if (!newCardText.trim()) return;
    const next = columns.map((c, idx) => {
      if (idx !== selectedColumn) return c;
      return { ...c, cards: [...c.cards, { id: Date.now().toString(), text: newCardText.trim() }] };
    });
    save(next);
    setNewCardText("");
  };

  const removeCard = (colIdx: number, cardId: string) => {
    const next = columns.map((c, idx) => {
      if (idx !== colIdx) return c;
      return { ...c, cards: c.cards.filter((cd) => cd.id !== cardId) };
    });
    save(next);
  };

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <select value={selectedColumn} onChange={(e) => setSelectedColumn(Number(e.target.value))} className="rounded border px-2 py-1 text-sm">
          {columns.map((c, i) => (
            <option key={c.title} value={i}>{c.title}</option>
          ))}
        </select>
        <input value={newCardText} onChange={(e) => setNewCardText(e.target.value)} placeholder="Write a note..." className="flex-1 rounded border px-2 py-1 text-sm" />
        <button onClick={addCard} className="rounded bg-[#7b68ee] px-3 py-1 text-xs font-bold text-white">Add</button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {columns.map((col, ci) => (
          <div key={col.title} className="rounded border bg-[#fbfbff] p-3">
            <h4 className="mb-2 text-xs font-semibold text-zinc-700">{col.title}</h4>
            <div className="space-y-2">
              {col.cards.map((card) => (
                <div key={card.id} className="flex items-start justify-between rounded bg-white p-2">
                  <div className="text-sm text-zinc-800">{card.text}</div>
                  <button onClick={() => removeCard(ci, card.id)} className="ml-2 text-xs text-red-500">x</button>
                </div>
              ))}
              {col.cards.length === 0 && <p className="text-xs text-zinc-400">No notes yet</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
