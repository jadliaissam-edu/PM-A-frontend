import { api } from '../lib/api'

export const reactionsService = {
  listReactions: (projectId: number, ticketId: number, commentId: number) =>
    api
      .get(`/collaboration/projects/${projectId}/tickets/${ticketId}/comments/${commentId}/reactions/`)
      .then((r) => r.data),

  addReaction: (projectId: number, ticketId: number, commentId: number, payload: any) =>
    api
      .post(`/collaboration/projects/${projectId}/tickets/${ticketId}/comments/${commentId}/reactions/`, payload)
      .then((r) => r.data),

  removeReaction: (projectId: number, ticketId: number, commentId: number, reactionId: number) =>
    api
      .delete(`/collaboration/projects/${projectId}/tickets/${ticketId}/comments/${commentId}/reactions/${reactionId}/`)
      .then((r) => r.data),
}

export default reactionsService
