import { api } from '../lib/api'

export type Message = any
export type Channel = any
export type CollabComment = any
export type Reaction = any

export const collaborationService = {
  /* Channel messages */
  getChannelMessages: (channelId: number, params?: any) =>
    api.get(`/collaboration/channels/${channelId}/messages/`, { params }).then((r) => r.data),

  postChannelMessage: (channelId: number, payload: any) =>
    api.post(`/collaboration/channels/${channelId}/messages/`, payload).then((r) => r.data),

  createDirectChannel: (payload: any) =>
    api.post(`/collaboration/channels/direct/`, payload).then((r) => r.data),

  /* Project / Workspace channels */
  getProjectChannels: (projectId: number, params?: any) =>
    api.get(`/collaboration/projects/${projectId}/channels/`, { params }).then((r) => r.data),

  createProjectChannel: (projectId: number, payload: any) =>
    api.post(`/collaboration/projects/${projectId}/channels/`, payload).then((r) => r.data),

  getWorkspaceChannels: (workspaceId: number, params?: any) =>
    api.get(`/collaboration/workspaces/${workspaceId}/channels/`, { params }).then((r) => r.data),

  createWorkspaceChannel: (workspaceId: number, payload: any) =>
    api.post(`/collaboration/workspaces/${workspaceId}/channels/`, payload).then((r) => r.data),

  /* Comments (collaboration) */
  listComments: (params?: any) => api.get('/collaboration/comments/', { params }).then((r) => r.data),
  createComment: (payload: any) => api.post('/collaboration/comments/', payload).then((r) => r.data),
  getComment: (id: number) => api.get(`/collaboration/comments/${id}/`).then((r) => r.data),
  putComment: (id: number, payload: any) => api.put(`/collaboration/comments/${id}/`, payload).then((r) => r.data),
  patchComment: (id: number, payload: any) => api.patch(`/collaboration/comments/${id}/`, payload).then((r) => r.data),
  deleteComment: (id: number) => api.delete(`/collaboration/comments/${id}/`).then((r) => r.data),

  /* Project-ticket comments */
  listProjectTicketComments: (projectId: number, ticketId: number, params?: any) =>
    api.get(`/collaboration/projects/${projectId}/tickets/${ticketId}/comments/`, { params }).then((r) => r.data),

  createProjectTicketComment: (projectId: number, ticketId: number, payload: any) =>
    api.post(`/collaboration/projects/${projectId}/tickets/${ticketId}/comments/`, payload).then((r) => r.data),

  patchProjectTicketComment: (projectId: number, ticketId: number, commentId: number, payload: any) =>
    api.patch(`/collaboration/projects/${projectId}/tickets/${ticketId}/comments/${commentId}/`, payload).then((r) => r.data),

  deleteProjectTicketComment: (projectId: number, ticketId: number, commentId: number) =>
    api.delete(`/collaboration/projects/${projectId}/tickets/${ticketId}/comments/${commentId}/`).then((r) => r.data),

  /* Reactions on project-ticket comments */
  listReactions: (projectId: number, ticketId: number, commentId: number) =>
    api.get(`/collaboration/projects/${projectId}/tickets/${ticketId}/comments/${commentId}/reactions/`).then((r) => r.data),

  addReaction: (projectId: number, ticketId: number, commentId: number, payload: any) =>
    api.post(`/collaboration/projects/${projectId}/tickets/${ticketId}/comments/${commentId}/reactions/`, payload).then((r) => r.data),

  removeReaction: (projectId: number, ticketId: number, commentId: number, reactionId: number) =>
    api.delete(`/collaboration/projects/${projectId}/tickets/${ticketId}/comments/${commentId}/reactions/${reactionId}/`).then((r) => r.data),
}

export default collaborationService
