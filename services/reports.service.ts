import api from '../lib/api'

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
}

export default reportsService
