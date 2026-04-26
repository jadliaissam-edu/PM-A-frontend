import { api } from "../lib/api";

export interface BoardColumn {
  id: string;
  board: string;
  name: string;
  position: number;
  is_done_column?: boolean;
}

export interface BoardStats {
  total_tickets: number;
  done_tickets: number;
  in_progress_tickets: number;
  todo_tickets: number;
  overdue_tickets: number;
}

export interface BoardConfig {
  board_id: string;
  view_mode: string;
  board_type: string;
  columns: BoardColumn[];
}

export const boardService = {
  /** Get board configuration and columns */
  getBoard: async (projectId: string): Promise<{ project_id: string; board_id: string; columns: BoardColumn[] }> => {
    const response = await api.get(`/projects/${projectId}/board/`);
    return response.data;
  },

  /** Get board statistics */
  getBoardStats: async (projectId: string): Promise<BoardStats> => {
    const response = await api.get(`/projects/${projectId}/board/stats/`);
    return response.data;
  },

  /** Get board task summary */
  getBoardTaskSummary: async (projectId: string): Promise<any> => {
    const response = await api.get(`/projects/${projectId}/board/task-summary/`);
    return response.data;
  },

  /** Get board config (view_mode, board_type, etc.) */
  getBoardConfig: async (projectId: string): Promise<BoardConfig> => {
    const response = await api.get(`/projects/${projectId}/board/config/`);
    return response.data;
  },

  /** Create a new board column (owner only) */
  createColumn: async (projectId: string, data: { name: string; position: number }): Promise<BoardColumn> => {
    const response = await api.post(`/projects/${projectId}/board/columns/`, data);
    return response.data;
  },

  /** Update a board column (owner only) */
  updateColumn: async (columnId: string, data: Partial<{ name: string; position: number }>): Promise<BoardColumn> => {
    const response = await api.patch(`/board/columns/${columnId}/`, data);
    return response.data;
  },

  /** Delete a board column (owner only) */
  deleteColumn: async (columnId: string): Promise<void> => {
    await api.delete(`/board/columns/${columnId}/`);
  },
};
