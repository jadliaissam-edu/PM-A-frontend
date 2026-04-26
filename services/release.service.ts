import { api } from "../lib/api";

export interface Release {
  id: string;
  project: string;
  name: string;
  tag: string;
  description: string;
  status: "draft" | "released" | "archived";
  release_date: string | null;
  created_by: number;
  created_by_username: string;
  created_at: string;
  is_closed: boolean;
}

export interface ReleaseCreate {
  name: string;
  tag: string;
  description?: string;
  status?: "draft" | "released" | "archived";
  release_date?: string;
}

export interface ReleaseDashboard {
  release: Release;
  total_tickets: number;
  done_tickets: number;
  open_tickets: number;
  progress_percent: number;
}

export interface ReleaseIssuesSummary {
  release_id: string;
  total: number;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
}

export const releaseService = {
  /** List all releases for a project */
  getReleases: async (projectId: string): Promise<Release[]> => {
    const response = await api.get(`/projects/${projectId}/releases/`);
    return response.data;
  },

  /** Get a single release */
  getRelease: async (projectId: string, releaseId: string): Promise<Release> => {
    const response = await api.get(`/projects/${projectId}/releases/${releaseId}/`);
    return response.data;
  },

  /** Create a release */
  createRelease: async (projectId: string, data: ReleaseCreate): Promise<Release> => {
    const response = await api.post(`/projects/${projectId}/releases/`, data);
    return response.data;
  },

  /** Update a release (PATCH) */
  updateRelease: async (projectId: string, releaseId: string, data: Partial<ReleaseCreate>): Promise<Release> => {
    const response = await api.patch(`/projects/${projectId}/releases/${releaseId}/`, data);
    return response.data;
  },

  /** Delete a release */
  deleteRelease: async (projectId: string, releaseId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/releases/${releaseId}/`);
  },

  /** Close a release */
  closeRelease: async (projectId: string, releaseId: string): Promise<{ message: string }> => {
    const response = await api.post(`/projects/${projectId}/releases/${releaseId}/close/`);
    return response.data;
  },

  /** Get release dashboard (progress stats) */
  getReleaseDashboard: async (projectId: string, releaseId: string): Promise<ReleaseDashboard> => {
    const response = await api.get(`/projects/${projectId}/releases/${releaseId}/dashboard/`);
    return response.data;
  },

  /** Get issues summary grouped by status/priority */
  getReleaseIssuesSummary: async (projectId: string, releaseId: string): Promise<ReleaseIssuesSummary> => {
    const response = await api.get(`/projects/${projectId}/releases/${releaseId}/issues-summary/`);
    return response.data;
  },

  /** List all org-level releases */
  getOrgReleases: async (): Promise<Release[]> => {
    const response = await api.get("/orgs/releases/");
    return response.data;
  },
};
