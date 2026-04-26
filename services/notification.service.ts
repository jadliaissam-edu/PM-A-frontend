import { api } from "../lib/api";

export interface Notification {
  id: string;
  project_id: string;
  event_type: string;
  payload_json: any;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get("/core/notifications/");
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/core/notifications/${id}/read/`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post("/core/notifications/read-all/");
  },
};
