export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  taskCount: number;
  completedTasks: number;
  assignees: User[];
  priority: 'low' | 'medium' | 'high';
  order: number;
  isCollapsed?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: User;
  startDate?: Date;
  dueDate?: Date;
  milestoneId: string;
  order: number;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface FilterState {
  status: string[];
  assignees: string[];
  priority: string[];
  search: string;
  showCompleted: boolean;
}