import { api } from "../lib/api";

export interface TicketSummary {
  id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigned_to?: string | null;
  project?: string | null;
  created_at?: string;
  updated_at?: string;
  comments_count?: number;
}

export interface TicketDetail extends TicketSummary {
  comments?: CommentItem[];
}

export interface CommentItem {
  id: string;
  author?: string;
  body: string;
  created_at?: string;
}

export const ticketsService = {
  listTickets: async (params?: Record<string, any>): Promise<TicketSummary[]> => {
    const response = await api.get("/tickets/", { params });
    return response.data;
  },

  getTicket: async (id: string, projectId?: string): Promise<TicketDetail> => {
    const url = projectId ? `/projects/${projectId}/tickets/${id}/` : `/tickets/${id}/`;
    const response = await api.get(url);
    return response.data;
  },

  createTicket: async (payload: Partial<TicketDetail>, projectId?: string): Promise<TicketDetail> => {
    const url = projectId ? `/projects/${projectId}/tickets/` : `/tickets/`;
    const response = await api.post(url, payload);
    return response.data;
  },

  deleteTicket: async (id: string, projectId?: string) => {
    const url = projectId ? `/projects/${projectId}/tickets/${id}/` : `/tickets/${id}/`;
    const response = await api.delete(url);
    return response.data;
  },

  updateTicket: async (id: string, patch: Partial<TicketDetail>, projectId?: string): Promise<TicketDetail> => {
    const projectUrl = `/projects/${projectId}/tickets/${id}/`;
    const globalUrl = `/tickets/${id}/`;

    // Prefer project-scoped update when projectId provided. If the project-scoped
    // endpoint returns 404 (e.g. server expects a UUID but a display id was used),
    // fall back to the global ticket endpoint before surfacing the error.
    try {
      const url = projectId ? projectUrl : globalUrl;
      const response = await api.patch(url, patch);
      return response.data;
    } catch (err: any) {
      // Attach extra debug info before potentially retrying.
      const status = err?.response?.status;
      const urlTried = err?.config?.url || (projectId ? projectUrl : globalUrl);
      console.error("ticketsService.updateTicket failed", { urlTried, status, patch, err });

      // If we attempted a project-scoped call, try the global endpoint as a fallback
      // (catch common 4xx/5xx causes). Do not retry on auth errors.
      if (projectId && status && status !== 401 && status !== 403) {
        try {
          const fallbackResp = await api.patch(globalUrl, patch);
          return fallbackResp.data;
        } catch (fallbackErr: any) {
          console.error("ticketsService.updateTicket fallback failed", { globalUrl, fallbackErr });
          throw err; // rethrow original for caller to handle
        }
      }
      throw err;
    }
  },

  updateStatus: async (id: string, projectId: string, payload: { status: string }) => {
    const projectUrl = `/projects/${projectId}/tickets/${id}/status/`;
    const globalUrl = `/tickets/${id}/status/`;
    try {
      const response = await api.post(projectUrl, payload);
      return response.data;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        // Try global status endpoint as a fallback
        try {
          const fallback = await api.post(globalUrl, payload);
          return fallback.data;
        } catch (err2: any) {
          // Final fallback: PATCH the ticket status on the global ticket resource
          const patchResp = await api.patch(`/tickets/${id}/`, { status: payload.status });
          return patchResp.data;
        }
      }
      throw err;
    }
  },

  listComments: async (ticketId: string, projectId?: string): Promise<CommentItem[]> => {
    const url = projectId ? `/projects/${projectId}/tickets/${ticketId}/comments/` : `/tickets/${ticketId}/comments/`;
    const response = await api.get(url);
    return response.data;
  },

  addComment: async (ticketId: string, payload: { body: string }, projectId?: string): Promise<CommentItem> => {
    const url = projectId ? `/projects/${projectId}/tickets/${ticketId}/comments/` : `/tickets/${ticketId}/comments/`;
    const response = await api.post(url, payload);
    return response.data;
  },

  /* Assignees (project-scoped) */
  listAssignees: async (projectId: string, ticketId: string) => {
    const response = await api.get(`/projects/${projectId}/tickets/${ticketId}/assignees/`);
    return response.data;
  },

  addAssignee: async (projectId: string, ticketId: string, payload: { user_id: string }) => {
    const response = await api.post(`/projects/${projectId}/tickets/${ticketId}/assignees/`, payload);
    return response.data;
  },

  removeAssignee: async (projectId: string, ticketId: string, userId: string) => {
    const response = await api.delete(`/projects/${projectId}/tickets/${ticketId}/assignees/${userId}/`);
    return response.data;
  },

  /* Attachments (project-scoped) */
  listAttachments: async (projectId: string, ticketId: string) => {
    const response = await api.get(`/projects/${projectId}/tickets/${ticketId}/attachments/`);
    return response.data;
  },

  uploadAttachment: async (projectId: string, ticketId: string, file: File, extra?: object) => {
    const form = new FormData();
    form.append('file', file);
    if (extra) Object.entries(extra).forEach(([k, v]) => form.append(k, String(v)));
    const response = await api.post(`/projects/${projectId}/tickets/${ticketId}/attachments/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteAttachment: async (projectId: string, ticketId: string, attachmentId: string) => {
    const response = await api.delete(`/projects/${projectId}/tickets/${ticketId}/attachments/${attachmentId}/`);
    return response.data;
  },

  /* Bulk assign tickets to a release (project-scoped) */
  bulkAssignRelease: async (projectId: string, ticketIds: string[], releaseId: string | null) => {
    // If releaseId provided, prefer the release-scoped URL; otherwise use a generic bulk endpoint
    const url = releaseId
      ? `/projects/${projectId}/releases/${releaseId}/assign-tickets/`
      : `/projects/${projectId}/tickets/bulk-assign-release/`;
    const response = await api.post(url, { ticket_ids: ticketIds });
    return response.data;
  },
};
