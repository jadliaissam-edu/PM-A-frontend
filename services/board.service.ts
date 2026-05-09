import { api } from '../lib/api'

export type Column = {
  id: number
  title: string
  position?: number
}

export const boardService = {
  /* Project-scoped board */
  getProjectBoard: (projectId: number) => api.get(`/projects/${projectId}/board/`).then((r) => r.data),
  getProjectBoardStats: (projectId: number) => api.get(`/projects/${projectId}/board/stats/`).then((r) => r.data),
  getProjectBoardTaskSummary: (projectId: number) => api.get(`/projects/${projectId}/board/task-summary/`).then((r) => r.data),

  /* Columns (project-scoped create + top-level patch/delete) */
  getColumnsForProject: (projectId: number) => api.get(`/projects/${projectId}/board/columns/`).then((r) => r.data),
  createColumnForProject: (projectId: number, payload: any) => api.post(`/projects/${projectId}/board/columns/`, payload).then((r) => r.data),
  updateColumn: (columnId: number, payload: any) => api.patch(`/board/columns/${columnId}/`, payload).then((r) => r.data),
  deleteColumn: (columnId: number) => api.delete(`/board/columns/${columnId}/`).then((r) => r.data),

  /* Board config */
  getBoardConfig: (projectId: number) => api.get(`/projects/${projectId}/board/config/`).then((r) => r.data),
  updateBoardConfig: (projectId: number, payload: any) => api.patch(`/projects/${projectId}/board/config/`, payload).then((r) => r.data),

  /* Ticket movements (tickets as cards) */
  moveTicket: (projectId: number, ticketId: number, payload: any) =>
    api.post(`/projects/${projectId}/board/tickets/${ticketId}/move/`, payload).then((r) => r.data),
  getTicketMovements: (projectId: number, ticketId: number) =>
    api.get(`/projects/${projectId}/board/tickets/${ticketId}/movements/`).then((r) => r.data),
}

export default boardService
