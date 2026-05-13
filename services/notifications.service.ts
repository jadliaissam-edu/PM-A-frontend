import api from '../lib/api'

export type Notification = {
  id: number
  actor?: number
  verb?: string
  target_type?: string
  target_id?: number
  unread?: boolean
  data?: any
  created_at?: string
}

export const notificationsService = {
  list: (params?: any) => api.get('/notifications/', { params }).then((r) => r.data),
  markRead: (id: number) => api.post(`/notifications/${id}/read/`).then((r) => r.data),
  markReadBulk: (payload: { ids: number[] }) => api.post('/notifications/mark-read-bulk/', payload).then((r) => r.data),
  readAll: () => api.post('/notifications/read-all/').then((r) => r.data),
  unreadCount: () => api.get('/notifications/unread-count/').then((r) => r.data),
}

export default notificationsService
