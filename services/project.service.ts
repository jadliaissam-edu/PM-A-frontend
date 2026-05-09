import { api } from "../lib/api";

export interface ProjectSummary {
  id: string;
  name: string;
  code?: string;
  summary?: string;
  status?: string;
  progress?: number;
  issueCount?: number;
  completedCount?: number;
  lead?: string;
  team?: string;
  dueLabel?: string;
  accent?: string;
  tags?: string[];
  memberInitials?: string[];
}

export const projectService = {
  getProjects: async (): Promise<ProjectSummary[]> => {
    const response = await api.get("/projects/");
    return response.data;
  },

  getProjectById: async (id: string): Promise<ProjectSummary> => {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },

  /* Backlog */
  listBacklog: async (projectId: string, params?: any) => {
    const response = await api.get(`/projects/${projectId}/backlog/`, { params });
    return response.data;
  },

  addBacklogItem: async (projectId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/backlog/`, payload);
    return response.data;
  },

  deleteBacklogItem: async (projectId: string, backlogItemId: string) => {
    const response = await api.delete(`/projects/${projectId}/backlog/${backlogItemId}/`);
    return response.data;
  },

  addBacklogItemToSprint: async (projectId: string, backlogItemId: string) => {
    const response = await api.post(`/projects/${projectId}/backlog/${backlogItemId}/add-to-sprint/`);
    return response.data;
  },

  prioritizeBacklogItem: async (projectId: string, backlogItemId: string, payload: any) => {
    const response = await api.patch(`/projects/${projectId}/backlog/${backlogItemId}/prioritize/`, payload);
    return response.data;
  },

  /* Board endpoints */
  getProjectBoard: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/board/`);
    return response.data;
  },

  updateProjectBoard: async (projectId: string, payload: any) => {
    const response = await api.patch(`/projects/${projectId}/board/`, payload);
    return response.data;
  },

  createBoardColumn: async (projectId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/board/columns/`, payload);
    return response.data;
  },

  updateBoardColumn: async (projectId: string, columnId: string, payload: any) => {
    const response = await api.patch(`/projects/${projectId}/board/columns/${columnId}/`, payload);
    return response.data;
  },

  deleteBoardColumn: async (projectId: string, columnId: string) => {
    const response = await api.delete(`/projects/${projectId}/board/columns/${columnId}/`);
    return response.data;
  },

  getBoardConfig: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/board/config/`);
    return response.data;
  },

  updateBoardConfig: async (projectId: string, payload: any) => {
    const response = await api.patch(`/projects/${projectId}/board/config/`, payload);
    return response.data;
  },

  getBoardStats: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/board/stats/`);
    return response.data;
  },

  getBoardTaskSummary: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/board/task-summary/`);
    return response.data;
  },

  moveTicketOnBoard: async (projectId: string, ticketId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/board/tickets/${ticketId}/move/`, payload);
    return response.data;
  },

  getTicketMovements: async (projectId: string, ticketId: string) => {
    const response = await api.get(`/projects/${projectId}/board/tickets/${ticketId}/movements/`);
    return response.data;
  },

  /* Documents */
  listDocuments: async (projectId: string, params?: any) => {
    const response = await api.get(`/projects/${projectId}/documents/`, { params });
    return response.data;
  },

  createDocument: async (projectId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/documents/`, payload);
    return response.data;
  },

  getDocument: async (projectId: string, documentId: string) => {
    const response = await api.get(`/projects/${projectId}/documents/${documentId}/`);
    return response.data;
  },

  updateDocument: async (projectId: string, documentId: string, payload: any) => {
    const response = await api.patch(`/projects/${projectId}/documents/${documentId}/`, payload);
    return response.data;
  },

  deleteDocument: async (projectId: string, documentId: string) => {
    const response = await api.delete(`/projects/${projectId}/documents/${documentId}/`);
    return response.data;
  },

  /* Members */
  listMembers: async (projectId: string, params?: any) => {
    const response = await api.get(`/projects/${projectId}/members/`, { params });
    return response.data;
  },

  addMember: async (projectId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/members/`, payload);
    return response.data;
  },

  getMemberProgressReport: async (projectId: string, userId: string) => {
    const response = await api.get(`/projects/${projectId}/members/${userId}/reports/progress/`);
    return response.data;
  },

  /* Releases */
  listReleases: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/releases/`);
    return response.data;
  },

  createRelease: async (projectId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/releases/`, payload);
    return response.data;
  },

  getRelease: async (projectId: string, releaseId: string) => {
    const response = await api.get(`/projects/${projectId}/releases/${releaseId}/`);
    return response.data;
  },

  updateRelease: async (projectId: string, releaseId: string, payload: any) => {
    const response = await api.patch(`/projects/${projectId}/releases/${releaseId}/`, payload);
    return response.data;
  },

  closeRelease: async (projectId: string, releaseId: string) => {
    const response = await api.post(`/projects/${projectId}/releases/${releaseId}/close/`);
    return response.data;
  },

  getReleaseDashboard: async (projectId: string, releaseId: string) => {
    const response = await api.get(`/projects/${projectId}/releases/${releaseId}/dashboard/`);
    return response.data;
  },

  getReleaseIssuesSummary: async (projectId: string, releaseId: string) => {
    const response = await api.get(`/projects/${projectId}/releases/${releaseId}/issues-summary/`);
    return response.data;
  },

  /* Roles */
  listRoles: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/roles/`);
    return response.data;
  },

  createRole: async (projectId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/roles/`, payload);
    return response.data;
  },

  updateRole: async (projectId: string, roleId: string, payload: any) => {
    const response = await api.patch(`/projects/${projectId}/roles/${roleId}/`, payload);
    return response.data;
  },

  deleteRole: async (projectId: string, roleId: string) => {
    const response = await api.delete(`/projects/${projectId}/roles/${roleId}/`);
    return response.data;
  },

  /* Sprints */
  listSprints: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/sprints/`);
    return response.data;
  },

  createSprint: async (projectId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/sprints/`, payload);
    return response.data;
  },

  getSprint: async (projectId: string, sprintId: string) => {
    const response = await api.get(`/projects/${projectId}/sprints/${sprintId}/`);
    return response.data;
  },

  completeSprint: async (projectId: string, sprintId: string) => {
    const response = await api.post(`/projects/${projectId}/sprints/${sprintId}/complete/`);
    return response.data;
  },

  getSprintReport: async (projectId: string, sprintId: string) => {
    const response = await api.get(`/projects/${projectId}/sprints/${sprintId}/report/`);
    return response.data;
  },

  getSprintProgressReports: async (projectId: string, sprintId: string) => {
    const response = await api.get(`/projects/${projectId}/sprints/${sprintId}/reports/progress/`);
    return response.data;
  },

  startSprint: async (projectId: string, sprintId: string) => {
    const response = await api.post(`/projects/${projectId}/sprints/${sprintId}/start/`);
    return response.data;
  },

  /* Project tickets (scoped wrappers) */
  listProjectTickets: async (projectId: string, params?: any) => {
    const response = await api.get(`/projects/${projectId}/tickets/`, { params });
    return response.data;
  },

  createProjectTicket: async (projectId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/tickets/`, payload);
    return response.data;
  },

  getProjectTicket: async (projectId: string, ticketId: string) => {
    const response = await api.get(`/projects/${projectId}/tickets/${ticketId}/`);
    return response.data;
  },

  updateProjectTicket: async (projectId: string, ticketId: string, payload: any) => {
    const response = await api.patch(`/projects/${projectId}/tickets/${ticketId}/`, payload);
    return response.data;
  },

  /* Ticket attachments (project-scoped) */
  listTicketAttachments: async (projectId: string, ticketId: string) => {
    const response = await api.get(`/projects/${projectId}/tickets/${ticketId}/attachments/`);
    return response.data;
  },

  uploadTicketAttachment: async (projectId: string, ticketId: string, file: File, extra?: object) => {
    const form = new FormData();
    form.append('file', file);
    if (extra) Object.entries(extra).forEach(([k, v]) => form.append(k, String(v)));
    const response = await api.post(`/projects/${projectId}/tickets/${ticketId}/attachments/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteTicketAttachment: async (projectId: string, ticketId: string, attachmentId: string) => {
    const response = await api.delete(`/projects/${projectId}/tickets/${ticketId}/attachments/${attachmentId}/`);
    return response.data;
  },

  /* Ticket labels */
  listTicketLabels: async (projectId: string, ticketId: string) => {
    const response = await api.get(`/projects/${projectId}/tickets/${ticketId}/labels/`);
    return response.data;
  },

  addTicketLabel: async (projectId: string, ticketId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/tickets/${ticketId}/labels/`, payload);
    return response.data;
  },

  /* Ticket links */
  listTicketLinks: async (projectId: string, ticketId: string) => {
    const response = await api.get(`/projects/${projectId}/tickets/${ticketId}/links/`);
    return response.data;
  },

  createTicketLink: async (projectId: string, ticketId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/tickets/${ticketId}/links/`, payload);
    return response.data;
  },

  deleteTicketLink: async (projectId: string, ticketId: string, linkId: string) => {
    const response = await api.delete(`/projects/${projectId}/tickets/${ticketId}/links/${linkId}/`);
    return response.data;
  },

  /* Ticket status */
  changeTicketStatus: async (projectId: string, ticketId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/tickets/${ticketId}/status/`, payload);
    return response.data;
  },

  /* Time entries */
  listTicketTimeEntries: async (projectId: string, ticketId: string) => {
    const response = await api.get(`/projects/${projectId}/tickets/${ticketId}/time-entries/`);
    return response.data;
  },

  createTicketTimeEntry: async (projectId: string, ticketId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/tickets/${ticketId}/time-entries/`, payload);
    return response.data;
  },

  /* Ticket import */
  importTickets: async (projectId: string, payload: any) => {
    const response = await api.post(`/projects/${projectId}/tickets/import/`, payload);
    return response.data;
  },
};
