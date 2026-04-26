import { api } from "../lib/api";
import { Sprint } from "./project.service";

export interface SprintCreate {
  name: string;
  description?: string;
  goal?: string;
  start_date: string;
  end_date: string;
}

export interface SprintReport {
  sprint: Sprint;
  total_tickets: number;
  completed_tickets: number;
  incomplete_tickets: number;
  velocity: number;
}

export interface SprintProgressReport {
  sprint_id: string;
  sprint_name: string;
  total_points: number;
  completed_points: number;
  progress_percent: number;
  tickets_by_status: Record<string, number>;
}

export const sprintService = {
  /** List sprints for a project */
  getSprints: async (projectId: string): Promise<Sprint[]> => {
    const response = await api.get(`/projects/${projectId}/sprints/`);
    return response.data;
  },

  /** Get one sprint */
  getSprint: async (projectId: string, sprintId: string): Promise<Sprint> => {
    const response = await api.get(`/projects/${projectId}/sprints/${sprintId}/`);
    return response.data;
  },

  /** Create a sprint */
  createSprint: async (projectId: string, data: SprintCreate): Promise<Sprint> => {
    const response = await api.post(`/projects/${projectId}/sprints/`, data);
    return response.data;
  },

  /** Update a sprint (PATCH) */
  updateSprint: async (projectId: string, sprintId: string, data: Partial<SprintCreate>): Promise<Sprint> => {
    const response = await api.patch(`/projects/${projectId}/sprints/${sprintId}/`, data);
    return response.data;
  },

  /** Delete a sprint */
  deleteSprint: async (projectId: string, sprintId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/sprints/${sprintId}/`);
  },

  /** Start a sprint */
  startSprint: async (projectId: string, sprintId: string): Promise<{ message: string }> => {
    const response = await api.post(`/projects/${projectId}/sprints/${sprintId}/start/`);
    return response.data;
  },

  /** Complete/close a sprint */
  completeSprint: async (projectId: string, sprintId: string): Promise<{ message: string }> => {
    const response = await api.post(`/projects/${projectId}/sprints/${sprintId}/complete/`);
    return response.data;
  },

  /** Get sprint completion report */
  getSprintReport: async (projectId: string, sprintId: string): Promise<SprintReport> => {
    const response = await api.get(`/projects/${projectId}/sprints/${sprintId}/report/`);
    return response.data;
  },

  /** Get sprint progress report */
  getSprintProgressReport: async (projectId: string, sprintId: string): Promise<SprintProgressReport> => {
    const response = await api.get(`/projects/${projectId}/sprints/${sprintId}/reports/progress/`);
    return response.data;
  },
};
