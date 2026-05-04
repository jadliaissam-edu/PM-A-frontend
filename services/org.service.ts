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
  // Metadata for UI
  description?: string;
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
};
