import { api } from "../lib/api";

export interface Organization {
  id: string;
  name: string;
}

export interface Workspace {
  id: string;
  organization: string;
  name: string;
  visibility: string;
  description?: string;
  summary?: string;
  member_count?: number;
  task_count?: number;
  last_updated?: string;
  status?: string;
  color?: string;
}

export const orgService = {
  getOrganizations: async (): Promise<Organization[]> => {
    const response = await api.get("/orgs/organizations/");
    return response.data;
  },

  getWorkspaces: async (): Promise<Workspace[]> => {
    const response = await api.get("/orgs/workspaces/");
    return response.data;
  },

  createWorkspace: async (data: Partial<Workspace>): Promise<Workspace> => {
    const response = await api.post("/orgs/workspaces/", data);
    return response.data;
  },

  /* Invitations */
  listInvitations: async (params?: any) => {
    const response = await api.get("/orgs/invitations/", { params });
    return response.data;
  },

  createInvitation: async (data: any) => {
    const response = await api.post("/orgs/invitations/", data);
    return response.data;
  },

  getInvitation: async (id: string) => {
    const response = await api.get(`/orgs/invitations/${id}/`);
    return response.data;
  },

  updateInvitation: async (id: string, data: any) => {
    const response = await api.put(`/orgs/invitations/${id}/`, data);
    return response.data;
  },

  acceptInvitation: async (invitationId: string) => {
    const response = await api.post(`/orgs/invitations/${invitationId}/accept/`);
    return response.data;
  },

  acceptInvitationByWorkspace: async (workspaceId: string, email: string) => {
    const response = await api.post(`/orgs/invitations/accept/`, { workspace: workspaceId, email });
    return response.data;
  },

  deleteInvitation: async (id: string) => {
    const response = await api.delete(`/orgs/invitations/${id}/`);
    return response.data;
  },

  /* Organizations CRUD */
  createOrganization: async (data: any) => {
    const response = await api.post('/orgs/organizations/', data);
    return response.data;
  },

  getOrganization: async (id: string) => {
    const response = await api.get(`/orgs/organizations/${id}/`);
    return response.data;
  },

  updateOrganization: async (id: string, data: any) => {
    const response = await api.patch(`/orgs/organizations/${id}/`, data);
    return response.data;
  },

  deleteOrganization: async (id: string) => {
    const response = await api.delete(`/orgs/organizations/${id}/`);
    return response.data;
  },

  /* Releases and tree */
  listOrgReleases: async (params?: any) => {
    const response = await api.get('/orgs/releases/', { params });
    return response.data;
  },

  getOrgTree: async (params?: any) => {
    const response = await api.get('/orgs/tree/', { params });
    return response.data;
  },

  /* Workspace details */
  getWorkspaceById: async (id: string) => {
    const response = await api.get(`/orgs/workspaces/${id}/`);
    return response.data;
  },

  updateWorkspaceById: async (id: string, data: any) => {
    const response = await api.patch(`/orgs/workspaces/${id}/`, data);
    return response.data;
  },

  deleteWorkspaceById: async (id: string) => {
    const response = await api.delete(`/orgs/workspaces/${id}/`);
    return response.data;
  },

  getOrganizationMembers: async (orgId: string) => {
    const response = await api.get(`/orgs/organizations/${orgId}/members/`);
    return response.data;
  },
};
