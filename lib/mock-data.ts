import { Milestone, Task } from '@/types/project';
import { addDays, subDays } from 'date-fns';

export const mockMilestones: Milestone[] = [
  {
    id: '1',
    name: 'Project Setup & Planning',
    description: 'Initial project setup and requirement gathering',
    startDate: subDays(new Date(), 14),
    dueDate: addDays(new Date(), 7),
    status: 'in-progress',
    progress: 75,
    taskCount: 4,
    completedTasks: 3,
    assignees: [
      { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '👨‍💼' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '👩‍💻' }
    ],
    priority: 'high',
    order: 0
  },
  {
    id: '2',
    name: 'UI/UX Design',
    description: 'Design system and user interface mockups',
    startDate: new Date(),
    dueDate: addDays(new Date(), 14),
    status: 'not-started',
    progress: 0,
    taskCount: 6,
    completedTasks: 0,
    assignees: [
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '👨‍🎨' }
    ],
    priority: 'medium',
    order: 1
  },
  {
    id: '3',
    name: 'Development Phase 1',
    description: 'Core functionality implementation',
    startDate: addDays(new Date(), 7),
    dueDate: addDays(new Date(), 28),
    status: 'not-started',
    progress: 0,
    taskCount: 8,
    completedTasks: 0,
    assignees: [
      { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '👨‍💼' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '👩‍💻' }
    ],
    priority: 'high',
    order: 2
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Setup project repository',
    description: 'Initialize Git repository and setup basic project structure',
    status: 'completed',
    priority: 'high',
    assignee: { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '👨‍💼' },
    startDate: subDays(new Date(), 14),
    dueDate: subDays(new Date(), 12),
    milestoneId: '1',
    order: 0,
    tags: ['setup', 'git'],
    estimatedHours: 2,
    actualHours: 1.5
  },
  {
    id: '2',
    title: 'Define project requirements',
    description: 'Gather and document all functional and non-functional requirements',
    status: 'completed',
    priority: 'high',
    assignee: { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '👩‍💻' },
    startDate: subDays(new Date(), 12),
    dueDate: subDays(new Date(), 8),
    milestoneId: '1',
    order: 1,
    tags: ['planning', 'documentation'],
    estimatedHours: 8,
    actualHours: 10
  },
  {
    id: '3',
    title: 'Setup development environment',
    description: 'Configure development tools and environments',
    status: 'completed',
    priority: 'medium',
    assignee: { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '👨‍💼' },
    startDate: subDays(new Date(), 8),
    dueDate: subDays(new Date(), 5),
    milestoneId: '1',
    order: 2,
    tags: ['setup', 'development'],
    estimatedHours: 4,
    actualHours: 3
  },
  {
    id: '4',
    title: 'Create project timeline',
    description: 'Develop detailed project timeline and milestones',
    status: 'in-progress' as const,
    priority: 'medium',
    assignee: { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '👩‍💻' },
    startDate: subDays(new Date(), 3),
    dueDate: addDays(new Date(), 2),
    milestoneId: '1',
    order: 3,
    tags: ['planning', 'timeline'],
    estimatedHours: 6,
    actualHours: 4
  },
  {
    id: '5',
    title: 'Research design trends',
    description: 'Research current UI/UX trends and best practices',
    status: 'todo',
    priority: 'low',
    assignee: { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '👨‍🎨' },
    startDate: new Date(),
    dueDate: addDays(new Date(), 3),
    milestoneId: '2',
    order: 0,
    tags: ['research', 'design'],
    estimatedHours: 8
  },
  {
    id: '6',
    title: 'Create wireframes',
    description: 'Design wireframes for all main pages',
    status: 'todo',
    priority: 'high',
    assignee: { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '👨‍🎨' },
    startDate: addDays(new Date(), 3),
    dueDate: addDays(new Date(), 7),
    milestoneId: '2',
    order: 1,
    tags: ['design', 'wireframes'],
    estimatedHours: 16
  }
];