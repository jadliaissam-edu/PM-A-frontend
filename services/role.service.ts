import { api } from "../lib/api";

export type RoleName = "chef_de_project" | "admin" | "dev" | "observer";

export interface ProjectRole {
  id: string;
  project: string;
  user: number;
  user_username: string;
  role_name: RoleName;
  permissions: string[];
  created_at: string;
}

export interface AssignRolePayload {
  user: number;
  role_name: RoleName;
  permissions?: string[];
}

export const roleService = {
  /** List all roles for a project */
  getRoles: async (projectId: string): Promise<ProjectRole[]> => {
    const response = await api.get(`/projects/${projectId}/roles/`);
    return response.data;
  },

  /** Assign a role to a user in a project (owner only) */
  assignRole: async (projectId: string, data: AssignRolePayload): Promise<ProjectRole> => {
    const response = await api.post(`/projects/${projectId}/roles/`, data);
    return response.data;
  },

  /** Update a role (owner only) */
  updateRole: async (
    projectId: string,
    roleId: string,
    data: Partial<AssignRolePayload>
  ): Promise<ProjectRole> => {
    const response = await api.patch(`/projects/${projectId}/roles/${roleId}/`, data);
    return response.data;
  },

  /** Revoke a role (owner only) */
  deleteRole: async (projectId: string, roleId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/roles/${roleId}/`);
  },
};
