import { api } from "../lib/api";

// ─── Ticket ─────────────────────────────────────────────────────────────────

export interface Ticket {
  id: string;
  project: string;
  title: string;
  description_markdown: string;
  type: string;
  priority: string;
  status: string;
  current_column: string;
  current_column_name?: string;
  sprint?: string;
  sprint_name?: string;
  release?: string;
  release_tag?: string;
  estimate_story_points?: number;
  assignments?: any[];
  created_at?: string;
}

// ─── Backlog ─────────────────────────────────────────────────────────────────

export interface BacklogItem {
  id: string;
  project: string;
  ticket: Ticket;
  rank: number;
  priority_score: number;
}

// ─── Board ───────────────────────────────────────────────────────────────────

export interface BoardColumn {
  id: string;
  name: string;
  position: number;
  ticket_count: number;
  is_done_column?: boolean;
  tickets?: Ticket[];
}

export interface ProjectBoard {
  id: string;
  project_id: string;
  board_type: string;
  view_mode: string;
  columns: BoardColumn[];
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  owner?: number;
  owner_username?: string;
  type?: string;
  status?: string;
  is_archived?: boolean;
  is_closed?: boolean;
  organization_name: string;
  workspace_name?: string;
  created_at?: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  workspace_id: string;
  type?: string;
  visibility?: string;
  status?: string;
  is_archived?: boolean;
  is_closed?: boolean;
}

// ─── Member ──────────────────────────────────────────────────────────────────

export interface ProjectMember {
  id: number;
  username: string;
  email: string;
  role: string;
}

// ─── Sprint ──────────────────────────────────────────────────────────────────

export interface Sprint {
  id: string;
  project: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "planning" | "active" | "completed";
  goal: string;
}

// ─── Progress Report ─────────────────────────────────────────────────────────

export interface ProjectProgressReport {
  project_id: string;
  total_tickets: number;
  completed_tickets: number;
  open_tickets: number;
  progress_percent: number;
  tickets_by_status: Record<string, number>;
  tickets_by_priority: Record<string, number>;
}

export interface MemberProgressReport {
  user_id: number;
  username: string;
  project_id: string;
  assigned_tickets: number;
  completed_tickets: number;
  completion_rate: number;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const projectService = {
  // -- Projects --

  /** List projects where current user is owner/member */
  getProjects: async (organizationId?: string): Promise<Project[]> => {
    const response = await api.get("/projects/", {
      params: organizationId ? { organization_id: organizationId } : undefined,
    });
    return response.data;
  },

  /** Get a single project */
  getProject: async (projectId: string): Promise<Project> => {
    const response = await api.get(`/projects/${projectId}/`);
    return response.data;
  },

  /** Create a project */
  createProject: async (data: ProjectCreate): Promise<Project> => {
    const response = await api.post("/projects/", data);
    return response.data;
  },

  /** Update a project (owner only) */
  updateProject: async (projectId: string, data: Partial<ProjectCreate>): Promise<Project> => {
    const response = await api.patch(`/projects/${projectId}/`, data);
    return response.data;
  },

  /** Delete a project (owner only) */
  deleteProject: async (projectId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/`);
  },

  /** Archive a project (owner only) */
  archiveProject: async (projectId: string): Promise<{ message: string }> => {
    const response = await api.post(`/projects/${projectId}/archive/`);
    return response.data;
  },

  /** Close a project (owner only) */
  closeProject: async (projectId: string): Promise<{ message: string }> => {
    const response = await api.post(`/projects/${projectId}/close/`);
    return response.data;
  },

  /** Get project members with their roles */
  getProjectMembers: async (projectId: string): Promise<{ project_id: string; members: ProjectMember[] }> => {
    const response = await api.get(`/projects/${projectId}/members/`);
    return response.data;
  },

  /** Get project progress report */
  getProjectProgressReport: async (projectId: string): Promise<ProjectProgressReport> => {
    const response = await api.get(`/projects/${projectId}/reports/progress/`);
    return response.data;
  },

  /** Get member progress report within a project */
  getMemberProgressReport: async (projectId: string, userId: number): Promise<MemberProgressReport> => {
    const response = await api.get(`/projects/${projectId}/members/${userId}/reports/progress/`);
    return response.data;
  },

  // -- Board --

  /** Get the full board with columns + populted tickets */
  getProjectBoard: async (projectId: string): Promise<ProjectBoard> => {
    const boardResponse = await api.get(`/projects/${projectId}/board/`);
    const boardData = boardResponse.data;

    // The endpoint can return { board: {...} } or the board directly
    const board = boardData.board || boardData;

    // Fetch tickets for this project and distribute them into columns
    const ticketsResponse = await api.get(`/projects/${projectId}/tickets/`);
    const tickets: Ticket[] = ticketsResponse.data;

    const columnsWithTickets = (board.columns || []).map((col: BoardColumn) => ({
      ...col,
      tickets: tickets.filter((t) => t.current_column === col.id),
    }));

    return {
      id: board.board_id || board.id,
      project_id: board.project_id || projectId,
      board_type: board.board_type || "kanban",
      view_mode: board.view_mode || "board",
      columns: columnsWithTickets,
    };
  },

  /** Move a ticket to another column */
  moveTicket: async (projectId: string, ticketId: string, toColumnId: string) => {
    const response = await api.post(`/projects/${projectId}/board/tickets/${ticketId}/move/`, {
      to_column: toColumnId,
    });
    return response.data;
  },

  /** Add a board column (owner only) */
  addColumn: async (projectId: string, data: { name: string; position: number }): Promise<any> => {
    const response = await api.post(`/projects/${projectId}/board/columns/`, data);
    return response.data;
  },

  // -- Sprints --

  /** List sprints for a project */
  getProjectSprints: async (projectId: string): Promise<Sprint[]> => {
    const response = await api.get(`/projects/${projectId}/sprints/`);
    return response.data;
  },

  // -- Backlog --

  /** Get the project backlog */
  getProjectBacklog: async (projectId: string): Promise<BacklogItem[]> => {
    const response = await api.get(`/projects/${projectId}/backlog/`);
    return response.data;
  },

  // -- Tickets --

  /** Create a ticket in a project */
  createTicket: async (projectId: string, data: Partial<Ticket>) => {
    const response = await api.post(`/projects/${projectId}/tickets/`, data);
    return response.data;
  },

  // -- Documents --

  /** Get project documents */
  getProjectDocuments: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/documents/`);
    return response.data;
  },

  /** Create a project document */
  createProjectDocument: async (
    projectId: string,
    data: { title: string; content: string }
  ): Promise<any> => {
    const response = await api.post(`/projects/${projectId}/documents/`, data);
    return response.data;
  },
};
