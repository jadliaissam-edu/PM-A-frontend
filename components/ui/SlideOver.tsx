"use client";

import React, { useEffect, useRef } from "react";

export default function SlideOver({ open, onClose, title, children, width = 520, backdrop = true }: { open: boolean; onClose: () => void; title?: React.ReactNode; children?: React.ReactNode; width?: number; backdrop?: boolean }) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        console.debug("SlideOver: Escape pressed, closing");
        onClose();
      }
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // focus the first focusable element inside the panel
    const timer = setTimeout(() => {
      try {
        const root = panelRef.current;
        if (!root) return;
        const sel = 'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const el = root.querySelector(sel) as HTMLElement | null;
        if (el && typeof el.focus === 'function') el.focus();
      } catch (err) {
        // ignore
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <div aria-hidden={!open} style={{ pointerEvents: open ? "auto" : "none" }} className="fixed inset-0 z-50">
      <div onClick={onClose} className={`fixed inset-0 transition-opacity ${open ? "opacity-100" : "opacity-0"} ${backdrop ? "bg-black/30" : "bg-transparent"}`} />

      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ width }}
        ref={panelRef}
      >
        <header className="flex items-center justify-between border-b border-[#edf0f3] p-4">
          <div className="text-lg font-black text-[#20242a]">{title}</div>
          <button onClick={onClose} aria-label="Close panel" className="h-8 w-8 rounded-[8px] bg-[#f7f8fb] text-[#68707d]">×</button>
        </header>

        <div className="overflow-auto p-4 flex-1">{children}</div>
      </aside>
    </div>
  );
}
