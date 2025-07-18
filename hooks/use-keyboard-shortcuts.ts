"use client";

import { useEffect } from 'react';
import { useProjectStore } from '@/lib/store';

export function useKeyboardShortcuts() {
  const { selectedTaskIds, clearSelection, selectAllTasks, bulkDeleteTasks } = useProjectStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + A - Select all
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        selectAllTasks();
      }

      // Escape - Clear selection
      if (event.key === 'Escape') {
        clearSelection();
      }

      // Delete - Delete selected tasks
      if (event.key === 'Delete' && selectedTaskIds.length > 0) {
        event.preventDefault();
        if (confirm(`Are you sure you want to delete ${selectedTaskIds.length} task(s)?`)) {
          bulkDeleteTasks(selectedTaskIds);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedTaskIds, clearSelection, selectAllTasks, bulkDeleteTasks]);
}