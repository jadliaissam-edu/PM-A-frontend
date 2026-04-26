import { api } from "../lib/api";
import { Ticket } from "./project.service";

export const ticketService = {
  getTickets: async (): Promise<Ticket[]> => {
    const response = await api.get("/tickets/");
    return response.data;
  },

  getProjectTickets: async (projectId: string): Promise<Ticket[]> => {
    const response = await api.get(`/projects/${projectId}/tickets/`);
    return response.data;
  },

  getTicketDetail: async (projectId: string, ticketId: string): Promise<Ticket> => {
    const response = await api.get(`/projects/${projectId}/tickets/${ticketId}/`);
    return response.data;
  },

  updateTicketStatus: async (projectId: string, ticketId: string, status: string) => {
    const response = await api.patch(`/projects/${projectId}/tickets/${ticketId}/status/`, { status });
    return response.data;
  },

  addComment: async (projectId: string, ticketId: string, content: string) => {
    // Assuming collaboration app handles comments
    const response = await api.post(`/projects/${projectId}/tickets/${ticketId}/comments/`, { content });
    return response.data;
  },

  createTicket: async (projectId: string, data: Partial<Ticket>): Promise<Ticket> => {
    const response = await api.post(`/projects/${projectId}/tickets/`, data);
    return response.data;
  }
};
