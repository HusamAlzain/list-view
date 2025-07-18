import { create } from 'zustand';
import { Milestone, Task, FilterState, User } from '@/types/project';

interface ProjectStore {
  milestones: Milestone[];
  tasks: Task[];
  filters: FilterState;
  selectedTaskIds: string[];
  users: User[];
  bulkEditMode: boolean;
  
  // Actions
  setMilestones: (milestones: Milestone[]) => void;
  setTasks: (tasks: Task[]) => void;
  addMilestone: (milestone: Milestone) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSelectedTaskIds: (taskIds: string[]) => void;
  toggleTaskSelection: (taskId: string) => void;
  selectAllTasks: (milestoneId?: string) => void;
  clearSelection: () => void;
  setBulkEditMode: (enabled: boolean) => void;
  moveTask: (taskId: string, newMilestoneId: string, newOrder: number) => void;
  reorderMilestones: (milestones: Milestone[]) => void;
  bulkUpdateTasks: (taskIds: string[], updates: Partial<Task>) => void;
  bulkDeleteTasks: (taskIds: string[]) => void;
  duplicateMilestone: (milestoneId: string) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  milestones: [],
  tasks: [],
  selectedTaskIds: [],
  bulkEditMode: false,
  users: [
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '👨‍💼' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '👩‍💻' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '👨‍🎨' },
  ],
  filters: {
    status: [],
    assignees: [],
    priority: [],
    search: '',
    showCompleted: true,
  },

  setMilestones: (milestones) => set({ milestones }),
  setTasks: (tasks) => set({ tasks }),
  
  addMilestone: (milestone) => set((state) => ({
    milestones: [...state.milestones, milestone]
  })),
  
  updateMilestone: (id, updates) => set((state) => ({
    milestones: state.milestones.map(m => m.id === id ? { ...m, ...updates } : m)
  })),
  
  deleteMilestone: (id) => set((state) => ({
    milestones: state.milestones.filter(m => m.id !== id),
    tasks: state.tasks.filter(t => t.milestoneId !== id)
  })),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id),
    selectedTaskIds: state.selectedTaskIds.filter(taskId => taskId !== id)
  })),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  setSelectedTaskIds: (taskIds) => set({ selectedTaskIds: taskIds }),
  
  toggleTaskSelection: (taskId) => set((state) => ({
    selectedTaskIds: state.selectedTaskIds.includes(taskId)
      ? state.selectedTaskIds.filter(id => id !== taskId)
      : [...state.selectedTaskIds, taskId]
  })),
  
  selectAllTasks: (milestoneId) => set((state) => {
    const tasksToSelect = milestoneId 
      ? state.tasks.filter(task => task.milestoneId === milestoneId)
      : state.tasks;
    return { selectedTaskIds: tasksToSelect.map(task => task.id) };
  }),
  
  clearSelection: () => set({ selectedTaskIds: [], bulkEditMode: false }),
  
  setBulkEditMode: (enabled) => set({ bulkEditMode: enabled }),
  
  moveTask: (taskId, newMilestoneId, newOrder) => set((state) => ({
    tasks: state.tasks.map(t => 
      t.id === taskId 
        ? { ...t, milestoneId: newMilestoneId, order: newOrder }
        : t
    )
  })),
  
  reorderMilestones: (milestones) => set({ milestones }),
  
  bulkUpdateTasks: (taskIds, updates) => set((state) => ({
    tasks: state.tasks.map(t => 
      taskIds.includes(t.id) ? { ...t, ...updates } : t
    )
  })),
  
  bulkDeleteTasks: (taskIds) => set((state) => ({
    tasks: state.tasks.filter(t => !taskIds.includes(t.id)),
    selectedTaskIds: []
  })),
  
  duplicateMilestone: (milestoneId) => set((state) => {
    const originalMilestone = state.milestones.find(m => m.id === milestoneId);
    if (!originalMilestone) return state;
    
    const newMilestone: Milestone = {
      ...originalMilestone,
      id: Math.random().toString(36).substr(2, 9),
      name: `${originalMilestone.name} (Copy)`,
      order: state.milestones.length,
      status: 'not-started',
      progress: 0,
      completedTasks: 0,
    };
    
    // Duplicate associated tasks
    const originalTasks = state.tasks.filter(t => t.milestoneId === milestoneId);
    const newTasks = originalTasks.map(task => ({
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      milestoneId: newMilestone.id,
      status: 'todo' as const,
    }));
    
    return {
      milestones: [...state.milestones, newMilestone],
      tasks: [...state.tasks, ...newTasks]
    };
  }),
}));