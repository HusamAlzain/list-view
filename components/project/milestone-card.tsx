"use client";

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal, 
  Plus, 
  GripVertical,
  Calendar,
  Users
} from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Milestone } from '@/types/project';
import { useProjectStore } from '@/lib/store';
import { TaskTable } from './task-table';
import { Task } from '@/types/project';
import { MilestoneEditDialog } from './milestone-edit-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface MilestoneCardProps {
  milestone: Milestone;
  onAddTask: (milestoneId: string) => void;
  onTaskEdit: (task: Task) => void;
}

export function MilestoneCard({ milestone, onAddTask, onTaskEdit }: MilestoneCardProps) {
  const { updateMilestone, tasks, filters, deleteMilestone, duplicateMilestone } = useProjectStore();
  const [isCollapsed, setIsCollapsed] = useState(milestone.isCollapsed ?? false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const milestoneTasks = tasks.filter(task => task.milestoneId === milestone.id);
  
  // Apply filters to milestone tasks
  const filteredMilestoneTasks = milestoneTasks.filter(task => {
    if (filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }
    if (filters.assignees.length > 0) {
      if (!task.assignee || !filters.assignees.includes(task.assignee.id)) {
        return false;
      }
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !task.title.toLowerCase().includes(searchLower) &&
        !task.description?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });

  const statusColor = {
    'not-started': 'bg-gray-100 text-gray-800 hover:bg-gray-200/90 transition-colors duration-200 ease-in-out',
    'in-progress': 'bg-blue-100 text-blue-800 hover:bg-blue-200/90 transition-colors duration-200 ease-in-out',
    'completed': 'bg-green-100 text-green-800 hover:bg-green-200/90 transition-colors duration-200 ease-in-out',
    'on-hold': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200/90 transition-colors duration-200 ease-in-out'
  };

  const priorityColor = {
    'low': 'border-green-200',
    'medium': 'border-yellow-200',
    'high': 'border-red-200'
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    updateMilestone(milestone.id, { isCollapsed: !isCollapsed });
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    deleteMilestone(milestone.id);
    setDeleteDialogOpen(false);
  };

  const handleDuplicate = () => {
    duplicateMilestone(milestone.id);
  };

  const handleSave = (milestoneId: string, updates: Partial<Milestone>) => {
    updateMilestone(milestoneId, updates);
  };

  return (
    <>
      <Card 
        ref={setNodeRef} 
        style={style} 
        className={`mb-4 ${priorityColor[milestone.priority]} border-l-4 ${isDragging ? 'opacity-50' : ''} transition-all duration-200`}
      >
        <CardHeader className="pb-3 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                {...attributes}
                {...listeners}
                className="cursor-grab hover:cursor-grabbing p-1 h-8 w-8 flex-shrink-0"
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="p-1 h-8 w-8 flex-shrink-0"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{milestone.name}</h3>
                  <Badge className={`${statusColor[milestone.status]} cursor-default`}>
                    {milestone.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                {milestone.description && (
                  <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">{format(milestone.dueDate, 'MMM dd, yyyy')}</span>
                    <span className="sm:hidden">{format(milestone.dueDate, 'MMM dd')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{milestone.completedTasks}/{milestone.taskCount} tasks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <div className="flex -space-x-1">
                      {milestone.assignees.slice(0, 3).map((user) => (
                        <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {user.avatar || user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {milestone.assignees.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                          +{milestone.assignees.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-2">
              <div className="text-right min-w-[60px] sm:min-w-[80px]">
                <div className="text-sm font-medium">{milestone.progress}%</div>
                <Progress value={milestone.progress} className="w-20 h-2" />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddTask(milestone.id)}
                className="shrink-0 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>Edit milestone</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate}>Duplicate milestone</DropdownMenuItem>
                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onSelect={(e) => {
                          e.preventDefault();
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete milestone
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Milestone</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{milestone.name}"? This action cannot be undone and will also delete all associated tasks ({milestone.taskCount} tasks).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        {!isCollapsed && (
          <CardContent className="pt-0 px-4 sm:px-6">
            <TaskTable tasks={filteredMilestoneTasks} milestoneId={milestone.id} onTaskEdit={onTaskEdit} />
          </CardContent>
        )}
      </Card>

      <MilestoneEditDialog
        milestone={milestone}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
      />
    </>
  );
}