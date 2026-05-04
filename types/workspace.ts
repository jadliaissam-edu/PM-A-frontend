export type AccentTone = "blue" | "pink" | "emerald" | "amber" | "cyan";

export type SpaceStatus = "Active" | "In progress" | "Planning";
export type ProjectStatus = "On track" | "Planning" | "At risk" | "Completed";
export type IssueStatus = "Backlog" | "In progress" | "Review" | "Done";
export type IssuePriority = "Low" | "Medium" | "High" | "Critical";
export type IssueType = "Story" | "Task" | "Bug" | "Epic";

export interface FavoriteLink {
  label: string;
  href: string;
}

export interface SpaceSummary {
  id: string;
  name: string;
  description: string;
  members: number;
  taskCount: number;
  updatedLabel: string;
  status: SpaceStatus;
  accent: AccentTone;
}

export interface ProjectSummary {
  id: string;
  name: string;
  code: string;
  summary: string;
  status: ProjectStatus;
  progress: number;
  issueCount: number;
  completedCount: number;
  lead: string;
  team: string;
  dueLabel: string;
  accent: AccentTone;
  tags: string[];
  memberInitials: string[];
}

export interface IssueSummary {
  id: string;
  key: string;
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  projectId: string;
  projectName: string;
  assignee: string;
  reporter: string;
  sprint: string;
  updatedLabel: string;
}

export interface WorkspaceActivity {
  id: string;
  title: string;
  meta: string;
  projectId?: string;
}

export interface DeadlineItem {
  id: string;
  title: string;
  dateLabel: string;
  projectId?: string;
}
