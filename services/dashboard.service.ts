import { api } from "../lib/api";

export interface DashboardStats {
  total_projects: number;
  owned_projects: number;
  member_projects: number;
  archived_projects: number;
  // Legacy shape support
  organizations?: number;
  workspaces?: number;
  projects?: number;
  active_projects?: number;
  closed_projects?: number;
}

export interface RecentProject {
  id: string;
  name: string;
  description: string;
  owner: number;
  owner_username: string;
  is_archived: boolean;
  is_closed: boolean;
  created_at: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  type?: string;
}

export interface AssignedTask {
  id: string;
  title: string;
  priority: string;
  status: string;
}

export const dashboardService = {
  /** GET /api/dashboard/ — flat summary + recent projects */
  getDashboardData: async (): Promise<{
    total_projects: number;
    owned_projects: number;
    member_projects: number;
    archived_projects: number;
    recent_projects: RecentProject[];
  }> => {
    const response = await api.get("/dashboard/");
    return response.data;
  },

  /** GET /api/dashboard/stats/ — same shape as getDashboardData */
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats/");
    return response.data;
  },

  /** GET /api/dashboard/recent-projects/ — list of recent projects */
  getRecentProjects: async (): Promise<RecentProject[]> => {
    const response = await api.get("/dashboard/recent-projects/");
    return response.data;
  },

  /** Adapter: returns ActivityItem[] formatted from recent projects */
  getRecentActivity: async (): Promise<ActivityItem[]> => {
    const projects = await dashboardService.getRecentProjects();
    return projects.map((p) => ({
      id: p.id,
      title: `Projet "${p.name}" accédé`,
      meta: new Date(p.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "project",
    }));
  },

  /** Try to fetch assigned tickets; returns [] on failure */
  getAssignedTasks: async (): Promise<AssignedTask[]> => {
    try {
      const response = await api.get("/tickets/");
      return (response.data as any[]).slice(0, 5).map((t) => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        status: t.status,
      }));
    } catch {
      return [];
    }
  },
};
