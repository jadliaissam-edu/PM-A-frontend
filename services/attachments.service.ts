import api from '../lib/api'

export type ProjectFile = {
  id: number
  name: string
  url?: string
  content_type?: string
  size?: number
  uploaded_by?: number
  created_at?: string
}

export const attachmentsService = {
  listProjectFiles: (projectId: number, params?: any) =>
    api.get(`/projects/${projectId}/files/`, { params }).then((r) => r.data),

  uploadProjectFile: (projectId: number, file: File, extra?: object) => {
    const form = new FormData()
    form.append('file', file)
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => form.append(k, String(v)))
    }
    return api.post(`/projects/${projectId}/files/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  getProjectFile: (projectId: number, fileId: number) =>
    api.get(`/projects/${projectId}/files/${fileId}/`, { responseType: 'blob' }).then((r) => r.data),

  deleteProjectFile: (projectId: number, fileId: number) =>
    api.delete(`/projects/${projectId}/files/${fileId}/`).then((r) => r.data),

  /* Ticket attachments */
  listTicketAttachments: (projectId: number, ticketId: number) =>
    api.get(`/projects/${projectId}/tickets/${ticketId}/attachments/`).then((r) => r.data),

  uploadTicketAttachment: (projectId: number, ticketId: number, file: File, extra?: object) => {
    const form = new FormData()
    form.append('file', file)
    if (extra) Object.entries(extra).forEach(([k, v]) => form.append(k, String(v)))
    return api.post(`/projects/${projectId}/tickets/${ticketId}/attachments/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  deleteTicketAttachment: (projectId: number, ticketId: number, attachmentId: number) =>
    api.delete(`/projects/${projectId}/tickets/${ticketId}/attachments/${attachmentId}/`).then((r) => r.data),
}

export default attachmentsService
