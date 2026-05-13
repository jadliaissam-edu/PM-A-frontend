import { api } from '../lib/api'

export type ActivityItem = any

export const activityService = {
  listProjectActivity: (projectId: number, params?: any) =>
    api.get(`/activity/projects/${projectId}/activity/`, { params }).then((r) => r.data),

  getTicketHistory: async (ticketId: number | string, params?: any) => {
    try {
      const response = await api.get(`/activity/tickets/${ticketId}/history/`, { params });
      return response.data;
    } catch (err: any) {
      // If the endpoint is missing or returns 404, silently return empty list so callers can fall back.
      if (err?.response?.status === 404) return [];
      // For other errors, also return empty list to avoid noisy console errors in the UI.
      return [];
    }
  },

  getMyActivity: (params?: any) => api.get(`/activity/users/me/activity/`, { params }).then((r) => r.data),
}

export default activityService
