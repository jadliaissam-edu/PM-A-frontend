import { api } from '../lib/api'

export type Workspace = {
  id: number
  name: string
  description?: string
}

export const workspaceService = {
  /* Workspaces (under orgs) */
  listWorkspaces: (params?: any) => api.get('/orgs/workspaces/', { params }).then((r) => r.data),
  getWorkspace: (id: number) => api.get(`/orgs/workspaces/${id}/`).then((r) => r.data),
  createWorkspace: (payload: any) => api.post('/orgs/workspaces/', payload).then((r) => r.data),
  updateWorkspace: (id: number, payload: any) => api.patch(`/orgs/workspaces/${id}/`, payload).then((r) => r.data),
  deleteWorkspace: (id: number) => api.delete(`/orgs/workspaces/${id}/`).then((r) => r.data),

  /* Favorites - endpoint not present in provided spec, keep for compatibility */
  listFavorites: (params?: any) => api.get('/favorites/', { params }).then((r) => r.data),
  addFavorite: (payload: any) => api.post('/favorites/', payload).then((r) => r.data),
  removeFavorite: (favoriteId: number) => api.delete(`/favorites/${favoriteId}/`).then((r) => r.data),

  /* Activity (scoped endpoints) */
  listProjectActivity: (projectId: number, params?: any) =>
    api.get(`/activity/projects/${projectId}/activity/`, { params }).then((r) => r.data),

  listTicketHistory: (ticketId: number, params?: any) =>
    api.get(`/activity/tickets/${ticketId}/history/`, { params }).then((r) => r.data),

  getMyActivity: (params?: any) => api.get(`/activity/users/me/activity/`, { params }).then((r) => r.data),
  
  listWorkspaceReleases: (workspaceId: string) => api.get(`/workspaces/${workspaceId}/releases/`).then((r) => r.data),
}

export default workspaceService
