import { api } from '../lib/api'

export type ProjectProgressReport = any
export type SprintReport = any
export type ReleaseDashboard = any

const BASE = '/projects/'

export const reportsService = {
  /* Dashboard-level stats */
  getDashboardStats: (params?: any) => api.get('/dashboard/stats/', { params }).then((r) => r.data),

  /* Project reports */
  getProjectProgress: (projectId: number, params?: any) => api.get(`${BASE}${projectId}/reports/progress/`, { params }).then((r) => r.data),

  /* Sprint reports */
  getSprintReport: (projectId: number, sprintId: number, params?: any) => api.get(`${BASE}${projectId}/sprints/${sprintId}/report/`, { params }).then((r) => r.data),
  getSprintProgress: (projectId: number, sprintId: number, params?: any) => api.get(`${BASE}${projectId}/sprints/${sprintId}/reports/progress/`, { params }).then((r) => r.data),

  /* Release reports / dashboards */
  getReleaseDashboard: (projectId: number, releaseId: number, params?: any) => api.get(`${BASE}${projectId}/releases/${releaseId}/dashboard/`, { params }).then((r) => r.data),
  getReleaseIssuesSummary: (projectId: number, releaseId: number, params?: any) => api.get(`${BASE}${projectId}/releases/${releaseId}/issues-summary/`, { params }).then((r) => r.data),

  /* Generic report helper */
  runCustomReport: (url: string, params?: any) => api.get(url, { params }).then((r) => r.data),
  /* Exports (return blob) */
  exportProjectReport: (projectId: number, format = 'csv') => api.get(`${BASE}${projectId}/reports/export/`, { params: { format }, responseType: 'blob' }).then((r) => r.data),
  exportSprintReport: (projectId: number, sprintId: number, format = 'csv') => api.get(`${BASE}${projectId}/sprints/${sprintId}/reports/export/`, { params: { format }, responseType: 'blob' }).then((r) => r.data),
  exportMemberReport: (projectId: number, userId: number | string, format = 'csv') => api.get(`${BASE}${projectId}/members/${userId}/reports/export/`, { params: { format }, responseType: 'blob' }).then((r) => r.data),
}

export default reportsService
