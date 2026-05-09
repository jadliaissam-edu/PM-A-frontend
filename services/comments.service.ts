import { api } from "../lib/api";

export interface CommentItem {
  id: string;
  author?: string;
  body: string;
  created_at?: string;
}

export const commentsService = {
  // List comments for a specific ticket
  listByTicket: async (ticketId: string): Promise<CommentItem[]> => {
    const response = await api.get(`/tickets/${ticketId}/comments/`);
    return response.data;
  },

  // Create a comment for a specific ticket
  createForTicket: async (ticketId: string, payload: { body: string }): Promise<CommentItem> => {
    const response = await api.post(`/tickets/${ticketId}/comments/`, payload);
    return response.data;
  },

  // Generic comments endpoints (if backend exposes them)
  list: async (params?: Record<string, any>): Promise<CommentItem[]> => {
    const response = await api.get(`/comments/`, { params });
    return response.data;
  },

  create: async (payload: { ticket?: string; body: string }): Promise<CommentItem> => {
    const response = await api.post(`/comments/`, payload);
    return response.data;
  },
};
