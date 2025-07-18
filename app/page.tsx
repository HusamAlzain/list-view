"use client";

import { useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { ProjectHeader } from '@/components/project/project-header';
import { FilterBar } from '@/components/project/filter-bar';
import { MilestoneCard } from '@/components/project/milestone-card';
import { AddTaskDialog } from '@/components/project/add-task-dialog';
import { BulkActionsBar } from '@/components/project/bulk-actions-bar';
import { BulkEditDialog } from '@/components/project/bulk-edit-dialog';
import { TaskEditDialog } from '@/components/project/task-edit-dialog';
import { TaskDragOverlay } from '@/components/project/task-drag-overlay';
import { useProjectStore } from '@/lib/store';
import { mockMilestones, mockTasks } from '@/lib/mock-data';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useState } from 'react';
import { Task } from '@/types/project';
import { arrayMove } from '@dnd-kit/sortable';

export default function ProjectDashboard() {
  const { 
    milestones, 
    tasks, 
    filters,
    selectedTaskIds,
    clearSelection,
    bulkUpdateTasks,
    bulkDeleteTasks,
    setMilestones, 
    setTasks, 
    moveTask, 
    reorderMilestones,
    updateTask
  } = useProjectStore();
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addTaskMilestoneId, setAddTaskMilestoneId] = useState<string | null>(null);
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);
  const [taskEditDialogOpen, setTaskEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Use keyboard shortcuts
  useKeyboardShortcuts();

  // Load mock data on component mount
  useEffect(() => {
    setMilestones(mockMilestones);
    setTasks(mockTasks);
  }, [setMilestones, setTasks]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're reordering milestones
    const activeMilestone = milestones.find(m => m.id === activeId);
    const overMilestone = milestones.find(m => m.id === overId);

    if (activeMilestone && overMilestone && activeId !== overId) {
      const oldIndex = milestones.findIndex(m => m.id === activeId);
      const newIndex = milestones.findIndex(m => m.id === overId);
      
      const newMilestones = arrayMove(milestones, oldIndex, newIndex);
      
      reorderMilestones(newMilestones.map((m, index) => ({ ...m, order: index })));
      return;
    }

    // Handle task reordering
    const activeTask = tasks.find(t => t.id === activeId);
    if (activeTask) {
      const overTask = tasks.find(t => t.id === overId);
      
      if (overTask) {
        // Reordering within the same milestone or moving to different milestone
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const overIndex = tasks.findIndex(t => t.id === overId);
        
        if (activeTask.milestoneId === overTask.milestoneId) {
          // Same milestone - reorder
          const milestoneTasks = tasks.filter(t => t.milestoneId === activeTask.milestoneId);
          const activeMilestoneIndex = milestoneTasks.findIndex(t => t.id === activeId);
          const overMilestoneIndex = milestoneTasks.findIndex(t => t.id === overId);
          
          const reorderedTasks = arrayMove(milestoneTasks, activeMilestoneIndex, overMilestoneIndex);
          const updatedTasks = tasks.map(task => {
            if (task.milestoneId === activeTask.milestoneId) {
              const newIndex = reorderedTasks.findIndex(t => t.id === task.id);
              return { ...task, order: newIndex };
            }
            return task;
          });
          setTasks(updatedTasks);
        } else {
          // Different milestone - move task
          moveTask(activeId, overTask.milestoneId, overTask.order);
        }
      } else if (milestones.find(m => m.id === overId)) {
        // Dropped on milestone - move to end of milestone
        const targetMilestone = milestones.find(m => m.id === overId);
        if (targetMilestone) {
          const milestoneTaskCount = tasks.filter(t => t.milestoneId === overId).length;
          moveTask(activeId, overId, milestoneTaskCount);
        }
      }
    }
  };

  const handleAddTask = (milestoneId: string) => {
    setAddTaskMilestoneId(milestoneId);
  };

  const handleBulkEdit = () => {
    setBulkEditDialogOpen(true);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedTaskIds.length} task(s)?`)) {
      bulkDeleteTasks(selectedTaskIds);
    }
  };

  const handleBulkMove = () => {
    // TODO: Implement bulk move functionality
    console.log('Bulk move not implemented yet');
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setTaskEditDialogOpen(true);
  };

  const handleBulkSave = (updates: Partial<Task>) => {
    bulkUpdateTasks(selectedTaskIds, updates);
    clearSelection();
  };

  const handleTaskSave = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
  };
  return (
    <div className="min-h-screen bg-background">
      <ProjectHeader />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <FilterBar />
        
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            <SortableContext 
              items={milestones.map(m => m.id)} 
              strategy={verticalListSortingStrategy}
            >
              {milestones.map((milestone) => {
                const milestoneTasks = filteredTasks
                  .filter(task => task.milestoneId === milestone.id)
                  .sort((a, b) => a.order - b.order);
                
                return (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    onAddTask={handleAddTask}
                    onTaskEdit={handleTaskEdit}
                  />
                );
              })}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeId && (
              <TaskDragOverlay 
                tasks={selectedTaskIds.includes(activeId) 
                  ? tasks.filter(t => selectedTaskIds.includes(t.id))
                  : tasks.filter(t => t.id === activeId)
                } 
              />
            )}
          </DragOverlay>
        </DndContext>

        {milestones.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No milestones yet. Create your first milestone to get started.
            </p>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedTaskIds.length}
        onBulkEdit={handleBulkEdit}
        onBulkDelete={handleBulkDelete}
        onBulkMove={handleBulkMove}
        onClearSelection={clearSelection}
      />

      {/* Dialogs */}
      {addTaskMilestoneId && (
        <AddTaskDialog
          milestoneId={addTaskMilestoneId}
          open={!!addTaskMilestoneId}
          onOpenChange={(open) => !open && setAddTaskMilestoneId(null)}
        />
      )}

      <BulkEditDialog
        open={bulkEditDialogOpen}
        onOpenChange={setBulkEditDialogOpen}
        selectedTasks={tasks.filter(t => selectedTaskIds.includes(t.id))}
        onSave={handleBulkSave}
      />

      <TaskEditDialog
        task={editingTask}
        open={taskEditDialogOpen}
        onOpenChange={setTaskEditDialogOpen}
        onSave={handleTaskSave}
      />
    </div>
  );
}