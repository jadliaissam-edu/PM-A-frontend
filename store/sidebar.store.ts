import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  /** Whether the sidebar is collapsed to icon-only mode */
  isCollapsed: boolean;
  /** Space IDs that are expanded in the sidebar tree */
  expandedSpaces: string[];
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleSpace: (spaceId: string) => void;
  expandSpace: (spaceId: string) => void;
  collapseSpace: (spaceId: string) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      expandedSpaces: [],

      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),

      toggleSpace: (spaceId) =>
        set((state) => ({
          expandedSpaces: state.expandedSpaces.includes(spaceId)
            ? state.expandedSpaces.filter((id) => id !== spaceId)
            : [...state.expandedSpaces, spaceId],
        })),

      expandSpace: (spaceId) =>
        set((state) => ({
          expandedSpaces: state.expandedSpaces.includes(spaceId)
            ? state.expandedSpaces
            : [...state.expandedSpaces, spaceId],
        })),

      collapseSpace: (spaceId) =>
        set((state) => ({
          expandedSpaces: state.expandedSpaces.filter((id) => id !== spaceId),
        })),
    }),
    {
      name: "sidebar-storage",
    }
  )
);
