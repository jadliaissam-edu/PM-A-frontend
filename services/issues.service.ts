import { api } from "../lib/api";

export interface IssueSummary {
  id: string;
  key?: string;
  title: string;
  type?: string;
  status?: string;
  priority?: string;
  projectId?: string;
  assignee?: string;
  reporter?: string;
  updated_at?: string;
}

export interface IssueDetail extends IssueSummary {
  description?: string;
  comments?: Array<{ id: string; author?: string; body: string; created_at?: string }>;
  sprint?: string;
  story_points?: number;
}

export const issuesService = {
  // List issues with optional filters (project, status, assignee, search, page, etc.)
  listIssues: async (params?: Record<string, any>): Promise<IssueSummary[]> => {
    const response = await api.get("/issues/", { params });
    return response.data;
  },

  // Get a single issue by id
  getIssue: async (id: string): Promise<IssueDetail> => {
    const response = await api.get(`/issues/${id}/`);
    return response.data;
  },

  // Create a new issue
  createIssue: async (payload: Partial<IssueDetail>): Promise<IssueDetail> => {
    const response = await api.post(`/issues/`, payload);
    return response.data;
  },

  // Update an existing issue partially
  updateIssue: async (id: string, patch: Partial<IssueDetail>): Promise<IssueDetail> => {
    const response = await api.patch(`/issues/${id}/`, patch);
    return response.data;
  },

  // Delete an issue
  deleteIssue: async (id: string): Promise<void> => {
    await api.delete(`/issues/${id}/`);
  },

  // Convenience: list issues for a given project
  listIssuesByProject: async (projectId: string, params?: Record<string, any>): Promise<IssueSummary[]> => {
    // Try project-specific endpoint first, fall back to filter param
    try {
      const response = await api.get(`/projects/${projectId}/issues/`, { params });
      return response.data;
    } catch (e) {
      const response = await api.get(`/issues/`, { params: { ...(params || {}), project: projectId } });
      return response.data;
    }
  },
};
