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

  getTicket: async (id: string): Promise<TicketDetail> => {
    const response = await api.get(`/tickets/${id}/`);
    return response.data;
  },

  createTicket: async (payload: Partial<TicketDetail>): Promise<TicketDetail> => {
    const response = await api.post(`/tickets/`, payload);
    return response.data;
  },

  updateTicket: async (id: string, patch: Partial<TicketDetail>): Promise<TicketDetail> => {
    const response = await api.patch(`/tickets/${id}/`, patch);
    return response.data;
  },

  listComments: async (ticketId: string): Promise<CommentItem[]> => {
    const response = await api.get(`/tickets/${ticketId}/comments/`);
    return response.data;
  },

  addComment: async (ticketId: string, payload: { body: string }): Promise<CommentItem> => {
    const response = await api.post(`/tickets/${ticketId}/comments/`, payload);
    return response.data;
  },
};
