import { api } from '../lib/api'

export type ActivityItem = any

export const activityService = {
  listProjectActivity: (projectId: number, params?: any) =>
    api.get(`/activity/projects/${projectId}/activity/`, { params }).then((r) => r.data),

  getTicketHistory: (ticketId: number, params?: any) =>
    api.get(`/activity/tickets/${ticketId}/history/`, { params }).then((r) => r.data),

  getMyActivity: (params?: any) => api.get(`/activity/users/me/activity/`, { params }).then((r) => r.data),
}

export default activityService
