import { create } from "zustand";

export type ViewMode = "list" | "board" | "timeline" | "calendar";

interface UIState {
  /** Active task view mode within a list/space */
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;

  /** Global "Create" modal — opened from topbar */
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;

  /** Command palette (⌘K) */
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: "list",
  setActiveView: (view) => set({ activeView: view }),

  isCreateModalOpen: false,
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
}));
