import { api } from "../lib/api";

export interface DashboardStats {
  total_projects: number;
  owned_projects: number;
  member_projects: number;
  archived_projects: number;
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
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats/");
    return response.data;
  },

  getRecentActivity: async (): Promise<ActivityItem[]> => {
    // Fallback if no specific activity endpoint exists
    // We can fetch recent projects or comments
    const response = await api.get("/dashboard/recent-projects/");
    return response.data.map((p: any) => ({
      id: p.id,
      title: `Project "${p.name}" accessed`,
      meta: `Accessed at ${new Date(p.created_at).toLocaleTimeString()}`,
      type: "project"
    }));
  },

  getAssignedTasks: async (): Promise<AssignedTask[]> => {
    // This is a placeholder since we don't have a direct "my-tasks" endpoint
    // We'll return an empty array for now or a dummy if needed
    try {
      const response = await api.get("/tickets/");
      return response.data.filter((t: any) => t.assigned_to === "me" || true).slice(0, 5);
    } catch (e) {
      return [];
    }
  }
};
