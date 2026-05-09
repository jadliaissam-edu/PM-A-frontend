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

  updateTicket: async (id: string, patch: Partial<TicketDetail>, projectId?: string): Promise<TicketDetail> => {
    const url = projectId ? `/projects/${projectId}/tickets/${id}/` : `/tickets/${id}/`;
    const response = await api.patch(url, patch);
    return response.data;
  },

  updateStatus: async (id: string, projectId: string, payload: { status: string }) => {
    const response = await api.post(`/projects/${projectId}/tickets/${id}/status/`, payload);
    return response.data;
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
};
